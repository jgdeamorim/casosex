<?php
namespace Whols_Pro;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Bulk Order Form AJAX Handler
 * 
 * Handles all AJAX requests for the bulk order form.
 */
class Bulk_Order_Ajax {
    /**
     * Singleton instance
     *
     * @var Bulk_Order_Ajax
     */
    private static $instance = null;
    
    /**
     * Get the singleton instance
     *
     * @return Bulk_Order_Ajax
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    public function __construct() {
        // Register AJAX handlers
        add_action('wp_ajax_whols_search_products', array($this, 'search_products'));
        add_action('wp_ajax_nopriv_whols_search_products', array($this, 'search_products'));
        add_action('wp_ajax_whols_add_to_cart', array($this, 'add_to_cart'));
        add_action('wp_ajax_nopriv_whols_add_to_cart', array($this, 'add_to_cart'));

        // For variable products
        add_action('wp_ajax_whols_get_wholesale_pricing_data', array($this, 'get_wholesale_pricing_data_cb'));
        add_action('wp_ajax_nopriv_whols_get_wholesale_pricing_data', array($this, 'get_wholesale_pricing_data_cb'));

        // Add content load handler for variations
        add_action('wp_ajax_load_bof_variation_popup', array($this, 'bof_variation_popup_cb'));
        add_action('wp_ajax_nopriv_load_bof_variation_popup', array($this, 'bof_variation_popup_cb'));
    }

    /**
     * AJAX handler to load the variation form
     */
    public function bof_variation_popup_cb() {
        // Check nonce
        check_ajax_referer('whols-popup-nonce', 'nonce');
        
        if (!isset($_POST['product_id'])) {
            wp_send_json_error(array(
                'message' => 'No product ID specified'
            ));
            return;
        }
        
        $product_id = absint($_POST['product_id']);
        $product = wc_get_product($product_id);
        
        if (!$product || !$product->is_type('variable')) {
            wp_send_json_error(array(
                'message' => 'Invalid product'
            ));
            return;
        }
        
        ob_start();
        
        // Add product thumbnail
        $image_id = $product->get_image_id();
        $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'woocommerce_single') : wc_placeholder_img_src('woocommerce_single');
        
        echo '<div class="whols-bof__variation-popup__product-image-wrapper">';
        echo '<img src="' . esc_url($image_url) . '" class="whols-bof__variation-popup__product-thumbnail" alt="' . esc_attr($product->get_name()) . '" />';
        echo '</div>';

        /** @var \WC_Product_Variable $product */
        
        // Set the global $product variable for the template
        global $product;
        $product = wc_get_product($product_id);
        
        // Get available variations
        $available_variations = $product->get_available_variations();
        $attributes = $product->get_variation_attributes();

        add_action('woocommerce_single_variation', function() {
            // Add a custom button with text from configuration
            echo '<button type="button" class="button whols-bof-variation-add">' . esc_html__('Add Product', 'whols') . '</button>';
        }, 20);
        
        // Include the variation template
        wc_get_template(
            'single-product/add-to-cart/variable.php',
            array(
                'available_variations' => $available_variations,
                'attributes'           => $attributes,
                'selected_attributes'  => $product->get_default_attributes(),
            ),
            '', 
            WC()->plugin_path() . '/templates/'
        );
        
        $form_html = ob_get_clean();
        
        wp_send_json_success(array(
            'title'      => $product->get_title(),
            'content'    => $form_html,
            'product_id' => $product_id,
            'image'      => $image_url,
        ));
    }

    /**
     * AJAX handler for product search
     */
    public function search_products() {
        // Verify nonce
        check_ajax_referer('whols_bulk_order_nonce', 'security');

        // Get search parameters
        $search_term = isset($_POST['search']) ? sanitize_text_field($_POST['search']) : '';
        $category_id = isset($_POST['category']) ? absint($_POST['category']) : 0;
        $results = array();

        // Prepare query arguments
        $args = array(
            'post_type'      => 'product',
            'post_status'    => 'publish',
            'posts_per_page' => Bulk_Order_Form::get_config('bof_search_results_limit'),
            'orderby'        => 'title',
            'order'          => 'ASC',
            'fields'         => 'ids',
        );

        // Add search term if provided
        if (!empty($search_term)) {
            $args['s'] = $search_term;
        }

        // Add category filter if provided
        if ($category_id > 0) {
            $args['tax_query'] = array(
                array(
                    'taxonomy' => 'product_cat',
                    'field'    => 'term_id',
                    'terms'    => $category_id,
                ),
            );
        }

        // Run the query
        $query = new \WP_Query($args);

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $product = wc_get_product(get_the_ID());

                if ($product && $product->is_purchasable() && $product->is_in_stock()) {
                    $results[] = $this->get_wholesale_pricing_data( $product->get_id() );
                }
            }
            wp_reset_postdata();
        }

        wp_send_json_success(array('products' => $results));
    }

    /**
     * Get wholesale pricing data for a product
     *
     * @param int $product_id Product ID or Variation ID
     * @return array|null Pricing data
     */
    public function get_wholesale_pricing_data( $product_id, $variation_id = null ){
        $product = wc_get_product($product_id);

        if ( ! $product || ! $product->is_purchasable() || ! $product->is_in_stock() ) {
            return null;
        }

        // Get the appropriate price based on user role
        $pricing = Wholesale_Product_Pricing::getInstance( $product, $variation_id );

        // Get product image
        $image_id = $product->get_image_id();
        $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'thumbnail') : wc_placeholder_img_src();

        $product_name = $product->get_name();
        $product_url = $product->get_permalink();

        
        if ($product->is_type('variable') && $variation_id) {
            $variation = wc_get_product($variation_id);

            // Prepare product name for variation
            $product_name = sprintf(
                '%s - %s',
                $product->get_name(),
                implode(', ', $variation->get_attributes())
            );

            // Prepare url for variation
            $product_url = $variation->get_permalink();
        }
            
        // Use wc_get_price_to_display() for tax-aware pricing that respects:
        // - WooCommerce tax display settings (incl/excl)
        // - Wholesaler tax exemption settings
        $display_price = wc_get_price_to_display($product);
        $wholesale_price_raw = $pricing->get_wholesale_price();
        $wholesale_display_price = $wholesale_price_raw ? wc_get_price_to_display($product, array('price' => $wholesale_price_raw)) : '';

        $result = array(
            'id'         => $product->get_id(),
            'variation_id' => $variation_id,
            'name'       => $product_name,
            'sku'        => $product->get_sku(),
            'price'      => $display_price,
            'price_html' => $pricing->get_price_html_with_labels() ? $pricing->get_price_html_with_labels() : $product->get_price_html(),
            'wholesale_price' => $wholesale_display_price,
            'wholesale_price_html' => $pricing->get_wholesale_price_html(),
            'stock'      => $product->get_stock_quantity(),
            'stock_status' => $product->get_stock_status(),
            'manage_stock' => $product->get_manage_stock(),
            'image'      => $image_url,
            'discount_minimum_quantity' => $pricing->get_minimum_quantity(),
            'has_tiered_pricing' => $pricing->has_tiered_pricing(),
            'price_tiers' => $pricing->get_price_tiers(),
            'product_type' => $product->get_type(),
            'url' => $product_url
        );

        return $result;
    }

    /**
     * AJAX handler for getting wholesale pricing data
     */
    public function get_wholesale_pricing_data_cb() {
        // Verify nonce
        check_ajax_referer('whols_bulk_order_nonce', 'nonce');
        
        $product_id = isset($_POST['product_id']) ? absint($_POST['product_id']) : 0;
        $variation_id = isset($_POST['variation_id']) ? absint($_POST['variation_id']) : null;
        
        $result = $this->get_wholesale_pricing_data($product_id, $variation_id);
        
        if ($result) {
            wp_send_json_success($result);
        } else {
            wp_send_json_error(array(
                'message' => __('Invalid product or variation', 'whols')
            ));
        }
    }


    /**
     * AJAX handler for adding products to cart
     */
    public function add_to_cart() {
        // Verify nonce
        check_ajax_referer('whols_bulk_order_nonce', 'nonce');
        
        $products = isset($_POST['products']) ? $_POST['products'] : array();
        $success = false;
        $added_count = 0;
        
        if (!empty($products) && is_array($products)) {
            // First check if we need to empty the cart before adding
            $empty_cart = apply_filters('whols/bulk_order/empty_cart_before_add', true);
            
            if ($empty_cart) {
                WC()->cart->empty_cart();
            }
            
            // Add each product to cart
            foreach ($products as $item) {
                if (isset($item['id']) && isset($item['quantity'])) {
                    $product_id = absint($item['id']);
                    $variation_id = isset($item['variation_id']) ? absint($item['variation_id']) : null;
                    $quantity = absint($item['quantity']);
                    
                    if ($product_id > 0 && $quantity > 0) {
                        // Check if product exists and is purchasable
                        $product = wc_get_product($product_id);
                        
                        if ($product && $product->is_purchasable() && $product->is_in_stock()) {
                            // For variable products, need the variation ID
                            if ($product->is_type('variable')) {
                                $result = WC()->cart->add_to_cart($product_id, $quantity, $variation_id);
                            } else {
                                // For simple products
                                $result = WC()->cart->add_to_cart($product_id, $quantity);
                            }
                            
                            if ($result) {
                                $added_count++;
                                $success = true;
                            }
                        }
                    }
                }
            }
        }
        
        if ($success) {
            $response_data = array(
                'message'   => sprintf(_n('%d product added to cart successfully.', '%d products added to cart successfully.', $added_count, 'whols'), $added_count),
                'count'     => $added_count
            );
            
            // Get redirect configuration
            $redirect_type = Bulk_Order_Form::get_config('bof_redirect_after_add');
            
            // Add appropriate redirect URL based on configuration
            if ($redirect_type === 'cart') {
                $response_data['redirect'] = wc_get_cart_url();
            } elseif ($redirect_type === 'checkout') {
                $response_data['redirect'] = wc_get_checkout_url();
            } // 'none' means no redirect
            
            wp_send_json_success($response_data);
        } else {
            wp_send_json_error(array(
                'message' => __('Error adding products to cart. Please try again.', 'whols')
            ));
        }
    }
}

// Initialize the class
Bulk_Order_Ajax::get_instance();