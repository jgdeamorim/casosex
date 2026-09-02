<?php
/**
 * Product Metabox
 *
 * @since 1.0.0
 */

namespace Whols_Pro\Admin;

/**
 * Product Metabox
 */
class Product_Metabox {

    /**
     * Metabox constructor.
     *
     * @since 1.0.0
     */
    public function __construct() {
        // Add extra metabox tab to woocommerce
        add_filter( 'woocommerce_product_data_tabs', array( $this, 'add_wc_extra_metabox_tab' ) );

        // Add metabox to whols tab
        add_action( 'woocommerce_product_data_panels', array( $this, 'add_meta_fields_to_whols_tab' ) );

        // Create meta fields for simple product
        add_action( 'woocommerce_product_options_pricing', array( $this, 'simple_product_meta_fields' ), 99 );

        // Save product meta fields
        add_action( 'woocommerce_process_product_meta', array( $this, 'save_product_meta' ) );

        // Create meta fields for variable product
        add_action( 'woocommerce_variation_options_pricing', array( $this, 'product_data_variation_fields' ), 99, 3 );

        // Save meta fields for variable product
        add_action( 'woocommerce_save_product_variation', array( $this, 'save_variation_meta' ), 10, 2 );
    }

    /**
     * Add extra metabox tab to woocommerce
     */
    function add_wc_extra_metabox_tab($tabs){
        $whols_tab = array(
            'label'    => esc_html__( 'Whols', 'whols' ),
            'target'   => 'whols_product_data',
            'class'    => '',
            'priority' => 80,
        );

        $tabs[] = $whols_tab;

        return $tabs;
    }

    /**
     * Add metabox to general tab
     */
    function add_meta_fields_to_whols_tab(){
        global $post;

        echo '<div id="whols_product_data" class="panel woocommerce_options_panel hidden">';
		echo '<h4 class="whols_visibility">'. esc_html__('Product Visibility', 'whols') .'</h4>';
        $product_visibility = get_post_meta($post->ID, '_whols_mark_this_product_as_wholesale_only', true) == 'yes' ? 'wholesaler_only' : ''; // Backward compatibility
        $product_visibility = $product_visibility ? $product_visibility : get_post_meta($post->ID, '_whols_product_visibility', true);

        woocommerce_wp_select(array(
            'id'          => '_whols_product_visibility',
            'value'       => $product_visibility,
            'label'       => esc_html__( 'Who sees it?', 'whols' ),
            'description' => esc_html__( 'Decide who should see this product', 'whols' ),
            'desc_tip'    => true,
            'options' => array(
                ''                  => __('Everyone', 'whols'),
                'wholesaler_only'   => __('Wholesalers Only', 'whols'),
                'retailer_only'     => __('Retailers Only', 'whols'),
            )
        ));
        echo '</div>';

    }

    /**
     * Create meta fields for simple product
     */
    function simple_product_meta_fields() {
        global $post;

        $pricing_model = whols_get_option('pricing_model');
        $roles = whols_get_taxonomy_terms();
        if( $pricing_model == 'single_role' ){
            ?>

            <p class="form-field whols_product_meta_type_1_pricing">
                <label><?php echo esc_html__( 'Wholesale Price', 'whols' ).' ('.get_woocommerce_currency_symbol().')'; ?></label>
                <?php
                $price_type_1_properties     = get_post_meta( $post->ID, '_whols_price_type_1_properties', true);
                $price_type_1_properties_arr = explode(':', $price_type_1_properties);
                $wholesale_price             = !empty($price_type_1_properties_arr[0]) ? $price_type_1_properties_arr[0] : '';
                $wholesale_min_quantity      = !empty($price_type_1_properties_arr[1]) ? $price_type_1_properties_arr[1] : '';
                ?>
                <span class="wrap whols_product_meta_wrap">

                    <span class="whols_field_wrap">
                        <input name="whols_price_type_1_price" placeholder="Price" class="wc_input_price" type="text" step="any" min="0" value="<?php echo esc_attr( wc_format_localized_price($wholesale_price) ); ?>" />
                    </span>

                    <span class="whols_field_wrap">
                        <input name="whols_price_type_1_min_quantity" placeholder="Min. Quantity" class="" type="number" step="any" min="0" value="<?php echo esc_attr( $wholesale_min_quantity ); ?>" />
                    </span>

                </span>
                <?php
                ?>
            </p>

            <?php
        }elseif( $pricing_model == 'multiple_role' ){
        ?>
        <p class="form-field whols_product_meta_type_2_pricing">
            <span class="whols_product_meta_type_2_pricing_wrapper">
                <label><?php echo esc_html__( 'Wholesale Price For', 'whols' ).' ('.get_woocommerce_currency_symbol().')'; ?></label>
                <?php
                $price_type_2_properties = get_post_meta( $post->ID, '_whols_price_type_2_properties', true);
                $price_type_2_properties = explode (';', $price_type_2_properties);

                foreach ( $price_type_2_properties as $individual_value ){
                    if ( !empty($individual_value) ){
                        $individual_value_arr = explode(':', $individual_value);
                        ?>
                        <span class="wrap whols_product_meta_wrap">

                            <span class="whols_field_wrap">
                                <span class="whols_lbl"><?php echo esc_html__('Role', 'whols'); ?></span>
                                <select name="whols_price_type_2_role[]">
                                <?php
                                    echo '<option value="any_role">'. esc_html__('Any Role') .'</option>';
                                    foreach( $roles as $key => $value ){
                                        echo '<option '. selected( $individual_value_arr[0], $key ). ' value="'. esc_attr( $key ) .'">'. esc_html( $value ) .'</option>';
                                    }
                                ?>
                                </select>
                            </span>

                            <span class="whols_field_wrap">
                                <span class="whols_lbl"><?php echo esc_html__('Price', 'whols'); ?></span>
                                <input name="whols_price_type_2_price[]" class="wc_input_price" type="text" step="any" min="0" value="<?php echo esc_attr( wc_format_localized_price(floatval($individual_value_arr[1])) ); ?>" />
                            </span>

                            <span class="whols_field_wrap">
                                <span class="whols_lbl"><?php echo esc_html__('Min. Quantity', 'whols'); ?></span>
                                <input name="whols_price_type_2_min_quantity[]" class="" type="number" step="any" min="1" placeholder="1" value="<?php echo esc_attr( $individual_value_arr[2] ); ?>" />
                            </span>

                            <i class="dashicons-before dashicons-no"></i>
                        </span>
                        <?php
                    }
                }
                ?>
                <span class="wrap whols_product_meta_wrap">

                    <span class="whols_field_wrap">
                        <span class="whols_lbl"><?php echo esc_html__('Role', 'whols'); ?></span>
                        <select name="whols_price_type_2_role[]">
                        <?php
                            echo '<option value="any_role">'. esc_html__('Any Role') .'</option>';
                            foreach( $roles as $key => $value ){
                                echo '<option value="'. esc_attr( $key ) .'">'. esc_html( $value ) .'</option>';
                            }
                        ?>
                        </select>
                    </span>

                    <span class="whols_field_wrap">
                        <span class="whols_lbl"><?php echo esc_html__('Price', 'whols'); ?></span>
                        <input name="whols_price_type_2_price[]"  placeholder="" class="wc_input_price" type="text" step="any" min="0"  />
                    </span>

                    <span class="whols_field_wrap">
                        <span class="whols_lbl"><?php echo esc_html__('Min. Quantity', 'whols'); ?></span>
                        <input name="whols_price_type_2_min_quantity[]" placeholder="" type="number" step="any" min="1" />
                    </span>

                    <i class="dashicons-before dashicons-no"></i>

                </span>
            </span>
            <button type="button" class="button whols_button_clone"><?php esc_html_e('Add pricing for another role', 'whols'); ?></button>
        </p>
        <?php
        } // endif pricing model
    }

    /**
     * Save simple product meta fields
     */
    function save_product_meta( $post_id ){
        $meta_field_value = '';
        $pricing_model = whols_get_option( 'pricing_model' );

        if( $pricing_model == 'single_role' ){
            if ( isset($_POST['whols_price_type_1_min_quantity']) ){
                $min_quantity = $_POST['whols_price_type_1_min_quantity'];
            } else {
                $min_quantity = '';
            }

            if ( isset($_POST['whols_price_type_1_price']) ){
                $price = $_POST['whols_price_type_1_price'];
            } else {
                $price = '';
            }

            if ( !empty( $price ) ){
                $meta_field_value .= wc_format_decimal($price). ':' .$min_quantity;
            }

            update_post_meta( $post_id, '_whols_price_type_1_properties', $meta_field_value);
        } elseif ( $pricing_model == 'multiple_role' ){
            if ( isset($_POST['whols_price_type_2_role']) ){
                $role = $_POST['whols_price_type_2_role'];
            } else {
                $role = '';
            }

            if ( isset($_POST['whols_price_type_2_min_quantity']) ){
                $min_quantity = $_POST['whols_price_type_2_min_quantity'];
            } else {
                $min_quantity = '';
            }

            if ( isset($_POST['whols_price_type_2_price']) ){
                $price = $_POST['whols_price_type_2_price'];
            } else {
                $price = '';
            }

            if ( is_array( $min_quantity ) && is_array( $price ) ){
                foreach ( $price as $index => $price_value ){
                    if ( !empty( $price[$index] ) ){
                        $meta_field_value .= $role[$index]. ':' .wc_format_decimal($price[$index]). ':' .$min_quantity[$index]. ';';
                    }
                }
            }

            update_post_meta( $post_id, '_whols_price_type_2_properties', $meta_field_value);
        }

        // Save whols tab;
        $product_visibility_new = isset( $_POST['_whols_product_visibility'] ) ? sanitize_text_field($_POST['_whols_product_visibility']) : '';

		// Backward compatibility.
		// Think what happen when existing user has some product marked as wholesaler only with this key _whols_mark_this_product_as_wholesale_only?
		switch ( $product_visibility_new ) {
			case 'wholesaler_only':
				update_post_meta( $post_id, '_whols_mark_this_product_as_wholesale_only', 'yes' );
				update_post_meta( $post_id, '_whols_product_visibility', 'wholesaler_only' );
				break;

			case 'retailer_only':
				update_post_meta( $post_id, '_whols_mark_this_product_as_wholesale_only', 'no' );
				update_post_meta( $post_id, '_whols_product_visibility', 'retailer_only' );
				break;

			default:
				update_post_meta( $post_id, '_whols_mark_this_product_as_wholesale_only', '' );
				update_post_meta( $post_id, '_whols_product_visibility', '' );
				break;
		}
    }

    /**
     * Create meta fields for variable product
     */
    function product_data_variation_fields( $loop, $variation_data, $variation ){
        global $post;

        $pricing_model = whols_get_option('pricing_model');
        $roles = whols_get_taxonomy_terms();
        if( $pricing_model == 'single_role' ){
            ?>

            <p class="form-field whols_product_meta_type_1_pricing">
                <?php
                $price_type_1_properties = get_post_meta( $variation->ID, '_whols_price_type_1_properties', true);
                $price_type_1_properties_arr = explode(':', $price_type_1_properties);
                $price_type_1_price = isset($price_type_1_properties_arr[0]) ? $price_type_1_properties_arr[0] : '';
                $price_type_1_min_quantity = isset($price_type_1_properties_arr[1]) ? $price_type_1_properties_arr[1] : '';
                ?>
                <span class="wrap whols_product_meta_wrap">

                    <span class="form-row form-field whols_field_wrap">
                        <span class="whols_lbl"><?php echo esc_html__( 'Wholesale Price', 'whols' ).' ('.get_woocommerce_currency_symbol().')'; ?></span>
                        <input name="whols_price_type_1_price_<?php echo esc_attr($variation->ID); ?>" placeholder="<?php echo esc_attr__( 'Price', 'whols' ); ?>" class="wc_input_price" type="text" step="any" min="0" value="<?php echo wc_format_localized_price( $price_type_1_price ); ?>" />
                    </span>

                    <span class="form-row form-field whols_field_wrap">
                        <span class="whols_lbl"><?php echo esc_html__('Wholesale Min. Quantity', 'whols'); ?></span>
                        <input name="whols_price_type_1_min_quantity_<?php echo esc_attr($variation->ID); ?>" placeholder="<?php echo esc_attr__( 'Min. Quantity', 'whols' ); ?>" class="" type="number" step="any" min="0" value="<?php echo esc_attr( $price_type_1_min_quantity ); ?>" />
                    </span>

                </span>
                <?php
                ?>
            </p>

            <?php
        }elseif( $pricing_model == 'multiple_role' ){
        ?>
        <p class="form-field whols_product_meta_type_2_pricing">
            <span class="whols_product_meta_type_2_pricing_wrapper">
                <span class="inline notice woocommerce-message">
                    <?php echo __( 'Apply different wholesale price for different roles below. <br> To remove any price for a role, keep the price field empty. ', 'whols' ); ?>
                </span>
                <?php
                $price_type_2_properties = get_post_meta( $variation->ID, '_whols_price_type_2_properties', true);
                $price_type_2_properties = explode (';', $price_type_2_properties);

                foreach ( $price_type_2_properties as $individual_value ){
                    if ( !empty($individual_value) ){
                        $individual_value_arr = explode(':', $individual_value);
                        ?>
                        <span class="wrap whols_product_meta_wrap">

                            <span class="whols_field_wrap">
                                <span class="whols_lbl"><?php echo esc_html__('Role', 'whols'); ?></span>
                                <select name="whols_price_type_2_role_<?php echo esc_attr($variation->ID); ?>[]">
                                <?php
                                    echo '<option value="any_role">'. esc_html__('Any Role') .'</option>';
                                    foreach( $roles as $key => $value ){
                                        echo '<option '. selected( $individual_value_arr[0], $key ). ' value="'. esc_attr( $key ) .'">'. esc_html( $value ) .'</option>';
                                    }
                                ?>
                                </select>
                            </span>

                            <span class="whols_field_wrap">
                                <span class="whols_lbl"><?php echo esc_html__('Price', 'whols'); ?></span>
                                <input name="whols_price_type_2_price_<?php echo esc_attr($variation->ID); ?>[]" class="wc_input_price" type="text" step="any" min="0" value="<?php echo esc_attr( wc_format_localized_price(floatval($individual_value_arr[1])) ); ?>" />
                            </span>

                            <span class="whols_field_wrap">
                                <span class="whols_lbl"><?php echo esc_html__('Min. Quantity', 'whols'); ?></span>
                                <input name="whols_price_type_2_min_quantity_<?php echo esc_attr($variation->ID); ?>[]" class="" type="number" step="any" min="1" placeholder="1" value="<?php echo esc_attr( $individual_value_arr[2] ); ?>" />
                            </span>

                            <i class="dashicons-before dashicons-no"></i>

                        </span> <!-- .wrap -->

                        <?php
                    }
                }
                ?>
                <span class="wrap whols_product_meta_wrap">

                    <span class="whols_field_wrap">
                        <span class="whols_lbl"><?php echo esc_html__('Role', 'whols'); ?></span>
                        <select name="whols_price_type_2_role_<?php echo esc_attr($variation->ID); ?>[]">
                        <?php
                            echo '<option value="any_role">'. esc_html__('Any Role') .'</option>';
                            foreach( $roles as $key => $value ){
                                echo '<option value="'. esc_attr( $key ) .'">'. esc_html( $value ) .'</option>';
                            }
                        ?>
                        </select>
                    </span>

                    <span class="whols_field_wrap">
                        <span class="whols_lbl"><?php echo esc_html__('Price', 'whols'); ?></span>
                        <input name="whols_price_type_2_price_<?php echo esc_attr($variation->ID); ?>[]"  class="wc_input_price" type="text" step="any" min="0"  />
                    </span>

                    <span class="whols_field_wrap">
                        <span class="whols_lbl"><?php echo esc_html__('Min. Quantity', 'whols'); ?></span>
                        <input name="whols_price_type_2_min_quantity_<?php echo esc_attr($variation->ID); ?>[]" type="number" step="any" min="1" placeholder="1" />
                    </span>

                    <i class="dashicons-before dashicons-no"></i>
                </span> <!-- .wrap -->
            </span> <!-- .whols_product_meta_type_2_pricing_wrapper -->

            <button type="button" class="button whols_button_clone" data-id="<?php echo esc_attr($variation->ID); ?>"><?php esc_html_e('Add pricing for another role', 'whols'); ?></button>
        </p> <!-- .whols_product_meta_type_2_pricing -->

        <?php
        } // endif pricing model
    }

    /**
     * Save meta fields for variable product
     */
    function save_variation_meta( $post_id ){
        $meta_field_value = '';
        $pricing_model = whols_get_option( 'pricing_model' );

        if( $pricing_model == 'single_role' ){
            if ( isset($_POST['whols_price_type_1_min_quantity_'. $post_id]) ){
                $min_quantity = $_POST['whols_price_type_1_min_quantity_'. $post_id];
            } else {
                $min_quantity = '';
            }

            if ( isset($_POST['whols_price_type_1_price_'. $post_id]) ){
                $price = $_POST['whols_price_type_1_price_'. $post_id];
            } else {
                $price = '';
            }

            if ( !empty( $price ) ){
                $meta_field_value .= wc_format_decimal($price). ':' .$min_quantity;
            }

            update_post_meta( $post_id, '_whols_price_type_1_properties', $meta_field_value);
        } elseif ( $pricing_model == 'multiple_role' ){
            if ( isset($_POST['whols_price_type_2_role_'. $post_id]) ){
                $role = $_POST['whols_price_type_2_role_'. $post_id];
            } else {
                $role = '';
            }

            if ( isset($_POST['whols_price_type_2_min_quantity_'. $post_id]) ){
                $min_quantity = $_POST['whols_price_type_2_min_quantity_'. $post_id];
            } else {
                $min_quantity = '';
            }

            if ( isset($_POST['whols_price_type_2_price_'. $post_id]) ){
                $price = $_POST['whols_price_type_2_price_'. $post_id];
            } else {
                $price = '';
            }

            if ( is_array( $min_quantity ) && is_array( $price ) ){
                foreach ( $price as $index => $price_value ){
                    if ( !empty( $price[$index] ) ){
                        $meta_field_value .= $role[$index]. ':' .wc_format_decimal($price[$index]). ':' .$min_quantity[$index]. ';';
                    }
                }
            }

            update_post_meta( $post_id, '_whols_price_type_2_properties', $meta_field_value);
        }
    }
}
