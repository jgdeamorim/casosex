<?php
namespace Whols_Pro\Frontend;

use Whols_Pro\Wholesale_Product_Pricing;

/**
 * Woo_Config class.
 */
class Woo_Config {
    /**
     * Pricing model
     * 
     * @var string single_role or multiple_role
     */
    public $pricing_model = '';
    
    /**
     * Wholesale price visibility
     * 
     * @var string administrator or all_users or only_wholesalers
     */
    public $wholesale_price_visibility = '';

    /**
     * Constructor. 
     */
    public function __construct() {
        $this->pricing_model = whols_get_option('pricing_model');
        $this->wholesale_price_visibility = whols_get_wholesale_price_visibility();

        // Hide price for guest users
        add_action( 'wp', array( $this, 'hide_prices_for_guest_users') );
        add_action( 'wp', array( $this, 'prevent_accessing_wholesale_only_product_page') );

        // Apply discount or Adjust price
        add_action( 'woocommerce_before_calculate_totals', array( $this, 'apply_discount') );

        // Recalculate product price on mini cart
        // When wholesale price applied using the woocommerce_before_calculate_totals hook, the price doesn't reflect on the mini cart
        // That's why this hack was needed
        add_action( 'woocommerce_before_mini_cart_contents',  array( $this, 'recalculate_mini_cart_on_ajax_refresh' ) );

        // Alter price html for loop/details to display wholesale price
        $legacy_wholesale_price_html = sanitize_text_field(isset($_GET['legacy']) ? $_GET['legacy'] : false);
        if( $legacy_wholesale_price_html ){
            add_filter( 'woocommerce_get_price_html', array( $this, 'legacy_alter_price_html' ), 10, 2 );
        } else {
            add_filter( 'woocommerce_get_price_html', array( $this, 'enhanced_alter_price_html' ), 10, 2 );
        }

        // Implement Variable product price tier
        add_filter( 'woocommerce_available_variation', array( $this, 'variable_product_price_tier' ), 10, 3 );

        // Disable payment gateways
        add_filter( 'woocommerce_available_payment_gateways', array( $this, 'disable_payment_gateways' ) );

        // Disable coupon for wholesale customers
        add_filter( 'woocommerce_coupons_enabled', array( $this, 'hide_coupon_field_on_cart_page' ) );
        // Removing all coupons from the cart.
        add_action('woocommerce_before_cart', array( $this, 'remove_coupons_for_wholesalers' ) );
        add_action('woocommerce_before_checkout_form', array( $this, 'remove_coupons_for_wholesalers') );

        // Disable Free shipping for wholesaler
        add_filter( 'woocommerce_shipping_free_shipping_is_available', array( $this, 'disable_free_shipping' ), 10, 3 );

		// Set default value in the quantity field
        add_filter( 'woocommerce_loop_add_to_cart_link', array($this, 'set_min_qty_for_shop'), 10, 2 );
		add_filter( 'woocommerce_quantity_input_args', array( $this, 'set_default_value_in_quantity_field' ), 10, 2 );
    }

    /**
	 * Set minimum quantity for product loop.
	 *
	 * @return array
	 */
    function set_min_qty_for_shop( $html, $product ) {
		if( !whols_is_wholesaler() || !$product->is_type('simple') || !whols_get_option('auto_apply_minimum_quantity') || !whols_get_option('force_auto_apply_minimum_quantity') ){
			return $html;
		}

		$product_status      = whols_get_product_status( $product );
		$enable_this_pricing = $product_status['enable_this_pricing'];
		$minimum_quantity    = $product_status['minimum_quantity'];
		$price_tiers 	   	 = !empty($product_status['tiers']) ? $product_status['tiers'] : array();

		// If auto apply minimum quantity option is disabled, then return.
		if( !$enable_this_pricing ){
			return $html;
		}

		if( $price_tiers ){
			$min_qty = min( array_keys($price_tiers) );
            $html = str_replace( 'quantity="1"', 'quantity="'. $min_qty .'"', $html );
		} elseif( $minimum_quantity ){
			$html = str_replace( 'quantity="1"', 'quantity="'. $minimum_quantity .'"', $html );
		}

        return $html;
    }


	/**
	 * Set default value in the quantity field
	 *
	 * @param array $args
	 * @param object $product
	 *
	 * @return array
	 */
	function set_default_value_in_quantity_field( $args, $product ){
		// Only for simple product.
		// Variable product support added differently by the woocommerce_available_variation hook.
		if( !is_product() || !whols_is_wholesaler() || !$product->is_type('simple') || !whols_get_option('auto_apply_minimum_quantity') ){
			return $args;
		}

		$product_status      = whols_get_product_status( $product );
		$enable_this_pricing = $product_status['enable_this_pricing'];
		$minimum_quantity    = $product_status['minimum_quantity'];
		$price_tiers 	   	 = !empty($product_status['tiers']) ? $product_status['tiers'] : array();

		// If auto apply minimum quantity option is disabled, then return.
		if( !$enable_this_pricing ){
			return $args;
		}

		if( $price_tiers ){
			$args['min_value'] = min( array_keys($price_tiers) );
		} elseif( $minimum_quantity ){
			$args['min_value'] = $minimum_quantity;
		}

		return $args;
	}

    public function prevent_accessing_wholesale_only_product_page(){
        // Wholesale only products is accessible to only wholesalers.
        $hide_wholesale_only_products_from_other_customers = whols_get_option('hide_wholesale_only_products_from_other_customers');
        if( is_product() && !whols_is_wholesaler() && $hide_wholesale_only_products_from_other_customers ){
            $product_is_wholesale_only = in_array( get_the_id(), whols_get_wholesale_only_product_ids());
            
            if( $product_is_wholesale_only ){
                if( wp_get_referer() ){
                    $url = apply_filters( 'whols_access_wholesale_only_product_redirect_url', wp_get_referer() );
                    wp_safe_redirect($url);
                } else if(!is_shop()){
                    $url = apply_filters( 'whols_access_wholesale_only_product_redirect_url', get_permalink( wc_get_page_id('shop') ) );
                    wp_safe_redirect( $url );
                }
            }
        }
    }

    public function hide_prices_for_guest_users(){
        $hide_price_for_guest_users       = whols_get_option( 'hide_price_for_guest_users' );
        $hide_price_for_general_customers = whols_get_option( 'hide_price_for_general_customers' );

        $hide_price_status = false;
        if( is_user_logged_in() && !whols_is_wholesaler() && $hide_price_for_guest_users && $hide_price_for_general_customers  ){
            $hide_price_status = true;
        } elseif( $hide_price_for_guest_users && !is_user_logged_in() ){
            $hide_price_status = true;
        }

        // Added filter to hide price for guest users based on conditions, get_queried_object() can be used to get the current page object.
        $hide_price_status = apply_filters( 'whols_hide_price_for_guest_users', $hide_price_status );

        if( $hide_price_status ){
            // remove cart button from loop
            remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );

            // remove cart button from product details
            remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );

            // disable purchasing products for over protection
            add_filter( 'woocommerce_is_purchasable', array( $this, 'whols_disable_purchasable_guest_users' ) );

            // finally add custom message instead of showing price & cart button
            add_filter( 'woocommerce_get_price_html', array( $this, 'whols_filter_woocommerce_get_price_html' ), 10, 2 );
        }
    }

    /**
     * Disable the products purchasable
     */
    function whols_disable_purchasable_guest_users( $purchasable ){
        return false;
    }

    /**
     * Filter woocommerce_get_price_html
     */
    function whols_filter_woocommerce_get_price_html( $price, $product ){
        $hide_price_for_guest_users = whols_get_option( 'hide_price_for_guest_users' );
        $lgoin_to_see_price_label   = whols_get_option( 'lgoin_to_see_price_label' );
        $my_account_page_id         = wc_get_page_id('myaccount');

        if( $my_account_page_id >= 1 && get_post_status($my_account_page_id) == 'publish' ){
            $login_link = get_permalink( $my_account_page_id );
        } else {
            $login_link = wp_login_url();
        }

        if( $lgoin_to_see_price_label ){
            $price = '<a href="'. esc_url( $login_link ) .'">' . esc_html( $lgoin_to_see_price_label ) . '</a>';
        } else {
            $price = '<a href="'. esc_url( $login_link ) .'">'. esc_html__( 'Login to view price', 'whols' ) .'</a>';
        }

        // For variation product, don't show the "Login to view price" message for guest users
        if( $hide_price_for_guest_users && !whols_is_wholesaler() && $product->get_type() === 'variation' ){
            return '';
        }

        return $price;
    }

    /**
     * Set price based on cart quantity
     */
    function apply_discount( $cart_object ) {
        $should_apply_discount = false;

        $is_open_purchase = whols_get_option('purchase_permission') === 'yes';
        $is_public_access = whols_get_option('show_wholesale_price_for') === 'all_users';
        
        if( $is_open_purchase && $is_public_access ){
            $should_apply_discount = true;
        }
        
        if ( (is_admin() && ! defined( 'DOING_AJAX' )) ){
            $should_apply_discount = false;
        }

        $current_user_id = get_current_user_id();
        if( whols_is_wholesaler( $current_user_id ) ){
            $should_apply_discount = true;
        }

        if( !$should_apply_discount ){
            return;
        }

        foreach ( $cart_object->get_cart() as $hash => $value ) {

            $product = isset( $value['data'] ) ? $value['data'] : null;

            // Skip if product is not valid
            if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
                continue;
            }

            // $product_status = whols_get_product_status( $product );
            $product_status = Wholesale_Product_Pricing::getInstance($product)->get_wholesale_status();

            if( $product_status['enable_this_pricing'] && $product_status['price_value']  ){

                // apply the new product price into the cart
                // Look in the quantity based price tires first
                if( !empty($product_status['tiers']) ){
                    $new_price = get_price_by_qty_from_tired_price_list($product_status['tiers'], $value['quantity']);

                    if( $new_price > 0 ){
                        $product->set_price( $new_price );
                    }
                } elseif( $value['quantity'] >= $product_status['minimum_quantity'] ){
                    if( $product_status['price_type'] == 'flat_rate' ){
                        $new_price = $product_status['price_value'];
                    } else {
                        $new_price = whols_get_percent_of( $product->get_regular_price(), $product_status['price_value'] );
                    }

                    $product->set_price( $new_price );
                }

            } // endif enable_this_pricing
        } // endforeach
    }

    /**
     * Alter price html to display wholesale price using the new pricing class
     *
     * @param string $price The price HTML of the product
     * @param \WC_Product $product The product object. Includes variation type product too.
     * 
     * @since 2.2.0
     *
     * @return string The new price html.
     */
    function enhanced_alter_price_html( $price, $product ) {
        $is_quick_edit_request = isset($_REQUEST['woocommerce_quick_edit']) ? $_REQUEST['woocommerce_quick_edit'] : false;
        if($is_quick_edit_request){
            return $price;
        }

        // Early returns for conditions where we shouldn't alter price
        if( (is_admin() && !wp_doing_ajax()) || !whols_is_wholesaler() || !$price > 0 ){
            return $price;
        }

        $product_type = $product->get_type();
        if( $product_type == 'variation' ){
            return $price;
        }

        // Only process simple and variable products
        if ( !in_array($product_type, ['simple', 'variable']) ) {
            return $price;
        }

        // Fix
        // $price returns "Price html containing markups", so when user doesn't enter any price
        // so the product is free product, but wholesale price showing for the free product
        // because $price variable were having truthy value
        if( $product->is_type('simple') && $product->get_regular_price() <= 0 ){ // Fixed decimal point issue
            return $price;
        }

        // Initialize the new pricing class
        $pricing = Wholesale_Product_Pricing::getInstance($product);

        // Get wholesale status - use whols_is_on_wholesale for variable products for proper price range
        if ($product->is_type('variable')) {
            $wholesale_status = whols_is_on_wholesale($product->get_id());
            // Check if variable product has wholesale pricing
            if ( empty($wholesale_status['enable_this_pricing']) || empty($wholesale_status['price_value']) ) {
                return $price;
            }
        } else {
            // Check if product has wholesale pricing (for simple products)
            if ( !$pricing->has_wholesale_pricing() ) {
                return $price;
            }
            $wholesale_status = $pricing->get_wholesale_status();
        }
        $price_value      = $wholesale_status['price_value'];
        $minimum_quantity = $wholesale_status['minimum_quantity'];

        // Apply filter for backward compatibility - allows other plugins to modify wholesale price
        $wholesale_price_info = apply_filters( 'whols_override_wholesale_price', array(
            'price' => $price_value,
        ), $product );
        $price_value = $wholesale_price_info['price'];

        // Get price display options from settings
        $retailer_price_options = whols_get_option( 'retailer_price_options' );
        $hide_retailer_price = $retailer_price_options['hide_retailer_price'] ?? false;
        $retailer_price_custom_label = $retailer_price_options['retailer_price_custom_label'] ?? '';

        $wholesaler_price_options = whols_get_option( 'wholesaler_price_options' );
        $hide_wholesaler_price = $wholesaler_price_options['hide_wholesaler_price'] ?? false;
        $wholesaler_price_custom_label = $wholesaler_price_options['wholesaler_price_custom_label'] ?? '';

        $discount_label_options = whols_get_option( 'discount_label_options' );
        $hide_discount_percent = $discount_label_options['hide_discount_percent'] ?? false;

        // Check for del tag disable filter
        $disable_del_tag = apply_filters('whols_disable_del_tag', false);
        
        // Variable for price range display including tax
        $display_variable_price_range_including_tax = apply_filters('whols_display_variable_price_range_including_tax', true);

        ob_start();
        ?>
        <div class="whols_loop_custom_price beta">

            <!-- Retailer price section -->
            <?php if ( !$hide_retailer_price ): ?>
            <div class="whols_retailer_price">
                <span class="whols_label">
                    <span class="whols_label_left">
                        <?php echo $retailer_price_custom_label ? 
                            esc_html( $retailer_price_custom_label ) : 
                            esc_html__( 'Retailer Price:', 'whols' ); ?>
                    </span>
                    
                    <?php if ( !$disable_del_tag ) echo '<del>'; ?>
                    
                    <?php if ( $product_type == 'simple' ): ?>
                        <?php 
                        $retailer_price = $product->get_regular_price();
                        $retailer_price = wc_get_price_to_display( $product, array('price' => $retailer_price) );
                        echo wc_price( $retailer_price ); 
                        ?>
                    <?php elseif ( $product_type == 'variable' ): ?>
                        <span class="whols_price">
                            <?php
                            // Get retail price range for variable products
                            $min_variation_price = $product->get_variation_price();
                            $max_variation_price = $product->get_variation_price( 'max' );
                            
                            if ( $display_variable_price_range_including_tax ) {
                                echo wc_price(
                                    wc_get_price_to_display($product, array( 'price' => $min_variation_price ))
                                );

                                if ( $min_variation_price != $max_variation_price ) {
                                    echo '–';
                                    echo wc_price(
                                        wc_get_price_to_display($product, array('price' => $max_variation_price ))
                                    );
                                }
                            } else {
                                echo wc_price($min_variation_price);

                                if ( $min_variation_price != $max_variation_price ) {
                                    echo '–';
                                    echo wc_price($max_variation_price);
                                }
                            }
                            ?>
                        </span>
                    <?php endif; ?>
                    
                    <?php if ( !$disable_del_tag ) echo '</del>'; ?>
                </span>
            </div>
            <?php endif; ?>

            <!-- Wholesaler price section -->
            <?php if ( !$hide_wholesaler_price ): ?>
            <div class="whols_wholesaler_price">
                <span class="whols_label">
                    <span class="whols_label_left">
                        <?php echo $wholesaler_price_custom_label ? 
                            esc_html( $wholesaler_price_custom_label ) : 
                            esc_html__( 'Wholesaler Price:', 'whols' ); ?>
                    </span>
                    <span class="whols_label_right">
                        <?php
                        // Use whols_get_wholesaler_price for variable products to get proper price range
                        if ($product->is_type('variable')) {
                            $price_type = $wholesale_status['price_type'];
                            echo whols_get_wholesaler_price($price_type, $price_value, $product);
                        } else {
                            // Use the new pricing class for simple products
                            echo $pricing->get_wholesale_price_html();
                        }
                        ?>
                    </span>
                </span>
            </div>
            <?php endif; ?>

            <!-- Discount/Save amount section -->
            <?php if ( !$hide_discount_percent ): ?>
            <div class="whols_save_amount">
                <?php
                // For variable products, use whols_get_price_save_info directly
                if ($product->is_type('variable')) {
                    $price_type = $wholesale_status['price_type'];
                    echo whols_get_price_save_info($price_type, $price_value, $product);
                } else {
                    // Use enhanced discount HTML for simple products
                    echo $pricing->get_discount_html();
                }
                ?>
            </div>
            <?php endif; ?>

        </div> <!-- .whols_loop_custom_price -->

        <?php
        // Get price tiers using the new pricing class
        $product_price_tiers = $pricing->get_price_tiers(true);
        ksort($product_price_tiers); // sort by minimum quantity

        // Minimum quantity notice (skip for variable products with mixed pricing)
        $minimum_quantity_threshold = apply_filters('whols_minimum_quantity_notice_threshold', 2);
        
        if ( count($product_price_tiers) < 2 && $minimum_quantity >= $minimum_quantity_threshold ):
            $default = esc_html__('Wholesale price will apply for minimum quantity of {qty} products.', 'whols');
            $notice_text = whols_get_option('min_qty_notice_custom_text');
            $notice_text = $notice_text ? $notice_text : $default;
            $notice_text = str_replace('{qty}', $minimum_quantity, $notice_text);
        ?>
        <div class="whols_minimum_quantity_notice">
            <span><?php echo wp_kses_post($notice_text); ?></span>
        </div>
        <?php endif; ?>

        <?php
        global $woocommerce_loop;

        // Price tier table display logic (only for simple products)
        // @todo option support enable_tired_pricing_table_for_shop_products
        $show_price_tier_html = false;

        if (
            $product->get_type() != 'variable' && // not variable product
            ( isset($woocommerce_loop['name']) && $woocommerce_loop['name'] != 'related' ) &&  // not related product
            count($product_price_tiers) > 1 && is_product() // more than 1 price tier & single product
        ) {
            $show_price_tier_html = true;
        }

        if ( $show_price_tier_html ):
        ?>
        <table class="shop_table shop_table_responsive whols_shop_table">
            <thead>
                <tr>
                    <th><?php echo esc_html__('Minimum Quantity','whols'); ?></th>
                    <th><?php echo esc_html__('Price Per Unit','whols'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach( $product_price_tiers as $tier_min_qty => $tier_price ): ?>
                <tr>
                    <td><?php echo esc_html($tier_min_qty); ?></td>
                    <td>
                        <?php
                        echo wc_price( wc_get_price_to_display( $product, array(
                            'price' => $tier_price
                        )) ) . $product->get_price_suffix( $tier_price );
                        ?>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php
        endif;
        
        $price = ob_get_clean();
        
        return $price;
    }

   /**
    * Alter price html to display wholesale price
    *
    * @param $price The price of the product.
    * @param $product The product object. Includes variation type product too.
    *
    * @return string The new price html.
    */
    function legacy_alter_price_html( $price, $product ){
        // Added !wp_doing_ajax() condition to fix issue for just tables plugin
        if( (is_admin() && !wp_doing_ajax()) || !whols_is_wholesaler() || !$price > 0 ){
            return $price;
        }

        if( $product->get_type() == 'variation' ){
            return $price;
        }

        $display_variable_price_range_including_tax = apply_filters('whols_display_variable_price_range_including_tax', true);

        // Fix
        // $price returns "Price html containing markups", so when user doesn't enter any price
        // so the product is free product, but wholesale price showing for the free product
        // because $price variable were having truthy value
        if( $product->is_type('simple') && $product->get_regular_price() <= 0 ){ // Fixed decimal point issue
            return $price;
        }

        $product_type     = $product->get_type();

        // $wholesale_status    = whols_get_product_status( $product ); // Fix, Show price for all user doesn't show for multiple role
        $wholesale_status    = whols_is_on_wholesale( $product );
        $enable_this_pricing = $wholesale_status['enable_this_pricing'];
        $price_type          = $wholesale_status['price_type'];
        $price_value         = $wholesale_status['price_value'];
        $minimum_quantity    = $wholesale_status['minimum_quantity'];

        if( whols_is_wholesaler() && $enable_this_pricing && $price_value ){
            $retailer_price                = $product->get_regular_price();
            $retailer_price                = wc_get_price_to_display( $product, array('price' => $retailer_price) ); // WC Tax option support

            $retailer_price_options        = whols_get_option( 'retailer_price_options' );
            $hide_retailer_price           = $retailer_price_options['hide_retailer_price'];
            $retailer_price_custom_label   = $retailer_price_options['retailer_price_custom_label'];

            $wholesaler_price_options      = whols_get_option( 'wholesaler_price_options' );
            $hide_wholesaler_price         = $wholesaler_price_options['hide_wholesaler_price'];
            $wholesaler_price_custom_label = $wholesaler_price_options['wholesaler_price_custom_label'];

            $discount_label_options        = whols_get_option( 'discount_label_options' );
            $hide_discount_percent         = $discount_label_options['hide_discount_percent'];
            $discount_percent_custom_label = $discount_label_options['discount_percent_custom_label'];

            if( $product_type == 'simple' || $product_type == 'variable' ):
                $disable_del_tag = apply_filters('whols_disable_del_tag', false);

                ob_start();
            ?>
            <div class="whols_loop_custom_price">

                <!-- retailer price -->
                <?php if( !$hide_retailer_price ): ?>
                <div class="whols_retailer_price">
                    <span class="whols_label">

                        <?php if( $retailer_price_custom_label ): ?>
                            <span class="whols_label_left"><?php echo esc_html( $retailer_price_custom_label ); ?></span>
                        <?php else: ?>
                            <span class="whols_label_left"><?php echo esc_html__( 'Retailer Price:', 'whols' ); ?></span>
                        <?php endif; ?>

                        <?php
                        if( !$disable_del_tag ){
                            echo '<del>';
                        }
                        ?>
                            <?php if( $product_type == 'simple' ): ?>
                                <?php echo wc_price( $retailer_price ); ?>
                            <?php elseif( $product_type == 'variable' ): // Variable product
                                    $min_variation_price = $product->get_variation_price();
                                    $max_variation_price = $product->get_variation_price( 'max' );
                                ?>
                                <span class="whols_price">
                                    <?php
                                        if( $display_variable_price_range_including_tax ){
                                            echo wc_price(
                                                wc_get_price_to_display($product, array( 'price' => $min_variation_price ))
                                            );

                                            if( $min_variation_price != $max_variation_price ){
                                                echo '–';
                                                echo wc_price(
                                                    wc_get_price_to_display($product, array('price' => $max_variation_price ))
                                                );
                                            }
                                        } else {
                                            echo wc_price($min_variation_price);

                                            if( $min_variation_price != $max_variation_price ){
                                                echo '–';
                                                echo wc_price($max_variation_price);
                                            }
                                        }
                                    ?>
                                </span>
                            <?php endif; ?>
                        <?php
                        if( !$disable_del_tag ){
                            echo '</del>';
                        }
                        ?>
                    </span>
                </div>
                <?php endif; ?>

                <!-- wholesaler price -->
                <?php if( !$hide_wholesaler_price ):
                ?>
                <div class="whols_wholesaler_price">
                    <span class="whols_label">
                        <?php if( $wholesaler_price_custom_label ): ?>
                            <span class="whols_label_left"><?php echo esc_html( $wholesaler_price_custom_label ); ?></span>
                        <?php else: ?>
                            <span class="whols_label_left"><?php echo esc_html__( 'Wholesaler Price:', 'whols' ); ?></span>
                        <?php endif; ?>
                        <span class="whols_label_right"><?php echo whols_get_wholesaler_price( $price_type, $price_value, $product ); ?></span>
                    </span>
                </div>
                <?php endif; ?>

                <!-- price save info -->
                <?php if( !$hide_discount_percent ): ?>
                <div class="whols_save_amount">
                    <?php echo whols_get_price_save_info( $price_type, $price_value, $product ); ?>
                </div>
                <?php endif; ?>
            </div> <!-- .whols_loop_custom_price -->

            <?php
            $product_price_tiers = whols_get_product_price_tiers( $product, true );

            ksort($product_price_tiers);

            $minimum_quantity_threshold = apply_filters('whols_minimum_quantity_notice_threshold', 2);
            if( count($product_price_tiers) < 2 && $minimum_quantity >= $minimum_quantity_threshold ):

                $default = esc_html__('Wholesale price will apply for minimum quantity of {qty} products.', 'whols');
                $notce_text = whols_get_option('min_qty_notice_custom_text');
                $notce_text = $notce_text ? $notce_text : $default;
                $notce_text = str_replace('{qty}', $minimum_quantity, $notce_text);
            ?>
            <div class="whols_minimum_quantity_notice">
                <span><?php echo wp_kses_post($notce_text); ?></span>
            </div>
            <?php endif; ?>

            <?php
            global $woocommerce_loop;

            // Only show this for single product
            // @todo option support enable_tired_pricing_table_for_shop_products
            $show_price_tier_html = false;

            if(
                $product->get_type() != 'variable' && // not variable product
                ( isset($woocommerce_loop['name']) && $woocommerce_loop['name'] != 'related') &&  // not related product
                count($product_price_tiers) > 1 && is_product() // more than 1 price tier & single product
            ){
                $show_price_tier_html = true;
            }

            if( $show_price_tier_html ):
            ?>
            <table class="shop_table shop_table_responsive whols_shop_table">
                <thead>
                    <tr>
                        <th><?php echo esc_html__('Minimum Quantity','whols'); ?></th>
                        <th><?php echo esc_html__('Price Per Unit','whols'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach( $product_price_tiers as $tier_min_qty => $tier_price ){
                        printf('<tr><td>%s</td><td>%s</td></tr>',
                            $tier_min_qty,
                            wc_price( wc_get_price_to_display( $product, array(
                                'price' => $tier_price
                            )) ) . $product->get_price_suffix( $price_value )
                        );
                    } ?>
                </tbody>
            </table>
            <?php
            endif;
            $price = ob_get_clean();
            endif;
        }

        return $price;
    }

    /**
     * Check whether the wholesale price should be shown or not
     *
     * @return bool
     */
    function should_show_wholesale_price(){
        // When all_users -> show wholesale pricing for all users
        if( $this->wholesale_price_visibility == 'all_users' ){
            return true;
        }

        // When only_wholesalers -> show wholesale pricing for wholesalers only
        if( $this->wholesale_price_visibility == 'only_wholesalers' ){
            return whols_is_wholesaler();
        }

        // When adminstrator -> show wholesale pricing for adminstrators and wholesalers
        if( $this->wholesale_price_visibility == 'adminstrator' ){
            return current_user_can('administrator') || whols_is_wholesaler();
        }

        return false;
    }

    // Display Price Tier - for Variation
    function variable_product_price_tier( $data, $product, $variation ){
        if( !whols_is_wholesaler() ){
            return $data;
        }

        // current user role
        $current_user_obj        = wp_get_current_user();
        $current_user_roles      = $current_user_obj->roles;

        $pricing_model = whols_get_option('pricing_model');

        $wholesale_status    = whols_get_product_status( $variation );
        $enable_this_pricing = $wholesale_status['enable_this_pricing'];
        $price_type          = $wholesale_status['price_type'];
        $price_value         = $wholesale_status['price_value'];
        $minimum_quantity    = $wholesale_status['minimum_quantity'];

        $wholesale_price_info = apply_filters( 'whols_override_wholesale_price', array(
            'price' => $price_value,
        ), $product ); // For multicurrency

        $price_value = $wholesale_price_info['price'];

        $has_price_tier = false;
        ob_start();

        if( $pricing_model  == 'single_role' ){
            // By default show variation price
            $price_per_unit = $variation->get_regular_price();
            if( $enable_this_pricing && $price_value ){
                if($price_type == 'flat_rate'){
                    $price_per_unit = $price_value;
                } elseif($price_type == 'percent'){
                    $price_per_unit = whols_get_percent_of( $variation->get_regular_price(), $price_value );
                }
            }

            if( $price_per_unit && $minimum_quantity < 2 ):
                $data['price_html'] = '<span class="price">' .  wc_price( wc_get_price_to_display($variation, array('price' => $price_per_unit)) ) . $variation->get_price_suffix( $price_per_unit ) . '</span>';
            endif;

            if( $price_per_unit ){
                $has_price_tier = true;
            }
        } elseif( $pricing_model  == 'multiple_role' ){
            $price_type_2_properties_meta = get_post_meta( $variation->get_id(), '_whols_price_type_2_properties', true);
            $roles_data_list = explode( ';', $price_type_2_properties_meta );

            // Fix, Show price for all user doesn't show for multiple role
            $show_wholesale_price_for        = whols_get_option('show_wholesale_price_for');
            $select_role_for_all_users_price = whols_get_option('select_role_for_all_users_price');

            // Support for testing mode
            if( $show_wholesale_price_for == 'administrator' ){
                $current_user_role_for_admin = isset( $current_user_roles[0] ) ? $current_user_roles[0] : '';
                $select_role_for_all_users_price = $current_user_role_for_admin === 'administrator' ? 'whols_default_role' : $current_user_role_for_admin;
            }

            if( in_array($show_wholesale_price_for, array('all_users', 'administrator')) && $select_role_for_all_users_price ){
                $current_user_roles[] = $select_role_for_all_users_price;
            }

            foreach( $roles_data_list as $role_data ){
                if(
                    in_array( 'any_role', explode( ':', $role_data ) ) ||
                    array_intersect($current_user_roles, explode( ':', $role_data ))
                ){
                    $price_type_2_properties = $role_data;

                    break;
                }
            }

            // By default show variation price
            $price_per_unit = $variation->get_regular_price();
            if( $enable_this_pricing && $price_value ){
                if($price_type == 'flat_rate'){
                    $price_per_unit = $price_value;
                } elseif($price_type == 'percent'){
                    $price_per_unit = whols_get_percent_of( $variation->get_regular_price(), $price_value );
                }
            }

            if( $price_per_unit ){
                $has_price_tier = true;
            }
        }


        $product_price_tiers = whols_get_product_price_tiers($variation, true);

		// Set default value in the quantity field for variable product.
		if( !empty($product_price_tiers) && !empty( array_keys($product_price_tiers) ) ){
			$data['whols_quantity_input_value'] = min( array_keys($product_price_tiers) );
		}

        if( count($product_price_tiers) > 1 ){ ?>
        <table class="shop_table shop_table_responsive whols_shop_table">
            <thead>
                <tr>
                    <th><?php echo esc_html__('Minimum Quantity','whols'); ?></th>
                    <th><?php echo esc_html__('Price Per Unit','whols'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach( $product_price_tiers as $tier_min_qty => $tier_price ){
                    printf('<tr><td>%s</td><td>%s</td></tr>',
                        $tier_min_qty,
                        wc_price( wc_get_price_to_display( $variation, array(
                            'price' => $tier_price
                        )) ) . $variation->get_price_suffix( $tier_price )
                    );
                } ?>
            </tbody>
        </table>
        <?php
        } else{
            $data['whols_quantity_input_value'] = $minimum_quantity;

            $price_per_unit = $variation->get_regular_price();
            if( $enable_this_pricing && $price_value ){
                if($price_type == 'flat_rate'){
                    $price_per_unit = $price_value;
                } elseif($price_type == 'percent'){
                    $price_per_unit = whols_get_percent_of( $variation->get_regular_price(), $price_value );
                }
            }

            if( $enable_this_pricing && $minimum_quantity > 1 ): ?>
            <table class="shop_table shop_table_responsive whols_shop_table">
                <thead>
                    <tr>
                        <th><?php echo esc_html__('Minimum Quantity','whols'); ?></th>
                        <th><?php echo esc_html__('Price Per Unit','whols'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><?php echo esc_html($minimum_quantity) ?></td>
                        <td><?php echo wc_price( wc_get_price_to_display($variation, array('price' => $price_per_unit)) ) . $variation->get_price_suffix($price_per_unit) ?></td>
                    </tr>
                </tbody>
            </table>
            <?php
            else:
                $data['price_html'] = '<span class="price">' . wc_price( wc_get_price_to_display( $variation, array( 'price' => $price_per_unit) )) . $variation->get_price_suffix( $price_per_unit ) . '</span>';
            endif;
        }


        $new_html = ob_get_clean();
        $previous_availability = $data['availability_html'];

        $data['availability_html'] = $new_html . $previous_availability;
        return $data;
    }

    // Disable payment gateways
    function disable_payment_gateways( $available_gateways ) {
        $current_user_id = get_current_user_id();
        if( !whols_is_wholesaler( $current_user_id ) ){
            return $available_gateways;
        }

        // prority first role level disable payment gateways
        if( class_exists('\WP_Term_Query') ){
            $term_query = new \WP_Term_Query(array(
                'taxonomy' => 'whols_role_cat',
                'hide_empty' => false,
            ));

            foreach ( $term_query->get_terms() as $term ) {
                if( in_array($term->slug, whols_get_current_user_roles()) ){
                    $meta = get_term_meta( $term->term_id, 'whols_role_tax_meta', true );
                    $restricted_gateways = isset($meta['disable_payment_methods']) ? $meta['disable_payment_methods'] : '';
                    if( $restricted_gateways ){
                        foreach( $restricted_gateways as $index => $rgateway_id ){
                            if ( isset( $available_gateways[$rgateway_id] ) ) {
                                unset( $available_gateways[$rgateway_id] );
                            }
                        }

                        return $available_gateways;
                    }

                    break;
                }
            }
        }

        // priority last, globally disable payment methods
        $current_user_id = get_current_user_id();
        $restricted_gateways = whols_get_option( 'disable_specific_payment_gateway_for_wholesale_customers' );

        if( $restricted_gateways ){
            foreach( $restricted_gateways as $index => $rgateway_id ){
                if ( isset( $available_gateways[$rgateway_id] ) ) {
                    unset( $available_gateways[$rgateway_id] );
                }
            }

            $available_gateways;
        }

       return $available_gateways;
    }

    // Disable coupon for wholesale customers
    function hide_coupon_field_on_cart_page( $status ) {
        if( $status ){
            $enabled = 'yes';
        } else {
            $enabled = '';
        }

        $current_user_id = get_current_user_id();
        if( !whols_is_wholesaler( $current_user_id ) ){
			return $status;
        }

        // globally disable coupon
        $current_user_id = get_current_user_id();
        $disable_coupon_for_wholesale_customers = whols_get_option( 'disable_coupon_for_wholesale_customers' );

        if ( $disable_coupon_for_wholesale_customers && whols_is_wholesaler( $current_user_id ) ) {
            if( !is_admin() || wp_doing_ajax() ){
                $enabled = '';
            }
        }

        // override role level disable coupon
        if( class_exists('\WP_Term_Query') ){
            $term_query = new \WP_Term_Query(array(
                'taxonomy' => 'whols_role_cat',
                'hide_empty' => false,
            ));

            foreach ( $term_query->get_terms() as $term ) {
                if( in_array($term->slug, whols_get_current_user_roles()) ){
                    $meta = get_term_meta( $term->term_id, 'whols_role_tax_meta', true );
                    if( isset($meta['disable_coupon']) && $meta['disable_coupon'] == 'yes' ){
                        $enabled = '';
                    } elseif( isset($meta['disable_coupon']) && $meta['disable_coupon'] == 'no' ){
                        $enabled = 'yes';
                    }
                    break;
                }
            }
        }

        if( $enabled == 'yes' ){
            return true;
        } else {
            return false;
        }
    }

    // Removing all coupons from the cart
    function remove_coupons_for_wholesalers(){
        // globally disable coupon
        $current_user_id = get_current_user_id();
        $disable_coupon_for_wholesale_customers = whols_get_option( 'disable_coupon_for_wholesale_customers' );
        if ( $disable_coupon_for_wholesale_customers && whols_is_wholesaler( $current_user_id ) ) {
            WC()->cart->remove_coupons(); // remove coupon
        }

        // override role level disable coupon
        if( class_exists('\WP_Term_Query') ){
            $term_query = new \WP_Term_Query(array(
                'taxonomy' => 'whols_role_cat',
                'hide_empty' => false,
            ));

            foreach ( $term_query->get_terms() as $term ) {
                if( in_array($term->slug, whols_get_current_user_roles()) ){
                    $meta = get_term_meta( $term->term_id, 'whols_role_tax_meta', true );
                    if( isset($meta['disable_coupon']) && $meta['disable_coupon'] == 'yes' ){
                        WC()->cart->remove_coupons(); // remove coupon
                    }
                    break;
                }
            }
        }
    }

    //  Free shipping control for wholesaler
    function disable_free_shipping( $is_available, $package, $shipping_method ){
        $has_free_shipping = 0;
        $allow_free_shipping = '';

        if( whols_is_wholesaler(get_current_user_id()) ){
            $has_free_shipping = whols_get_option( 'allow_free_shipping_for_wholesale_customers' );
        }

        // override from role level option
        if( whols_is_wholesaler(get_current_user_id()) ){
            $has_free_shipping = whols_get_option( 'allow_free_shipping_for_wholesale_customers' );
        }

        // override role level disable free shipping
        if( class_exists('\WP_Term_Query') ){
            $term_query = new \WP_Term_Query(array(
                'taxonomy' => 'whols_role_cat',
                'hide_empty' => false,
            ));

            foreach ( $term_query->get_terms() as $term ) {
                if( in_array($term->slug, whols_get_current_user_roles()) ){
                    $meta = get_term_meta( $term->term_id, 'whols_role_tax_meta', true );
                    $allow_free_shipping = isset($meta['allow_free_shipping']) ? $meta['allow_free_shipping'] : '';
                    break;
                }
            }
        }

        if( $allow_free_shipping ){
            $has_free_shipping = true;
        }

        if( $has_free_shipping ){
			$is_available = true;
        }

        return $is_available;
    }

    function recalculate_mini_cart_on_ajax_refresh(){
         // Calculate totals
        WC()->cart->calculate_totals();

        // Save cart to session
        WC()->cart->set_session();

        // Maybe set cart cookies
        WC()->cart->maybe_set_cart_cookies();
    }
}
