<?php
namespace Whols_Pro;
use const Whols_Pro\PL_PATH;

class Wallet_Manager {
    public const WALLET_ENDPOINT = 'whols-wallet';
    public const WALLET_COLUMN   = 'whols-order-type';

    public function __construct() {
        if( !$this->config('enable_wallet_payment') ){
            return;
        }

        // Setup Wallet Core
        add_action( 'init', array( $this, 'add_wallet_product' ) );
        
        // Setup Payment Gateway
        $this->include_wallet_gateway_class();
        add_filter( 'woocommerce_payment_gateways', array( $this, 'add_wallet_gateway_class_for_creating_instance' ) );
        add_action( 'woocommerce_after_checkout_validation', array( $this, 'validate_wallet_payment' ), 10, 2 );
        add_filter( 'woocommerce_gateway_title', array($this, 'add_current_wallet_balance'), 10, 2 );

        // OTP Verification
        if( $this->config('otp_verification_method') ) {
            add_filter( 'woocommerce_gateway_description', array( $this, 'add_otp_input_markup' ), 20, 2 );
            add_action( 'wp_ajax_whols_send_otp', array( $this, 'send_otp_ajax_action') );
        }

        // Setup Interface
        add_action('wp_enqueue_scripts', function(){
            wp_enqueue_style( 'dashicons' ); // For loading icon
        });
        add_action( 'init', array( $this, 'register_wallet_endpoint' ) );
        add_filter( 'woocommerce_account_menu_items', array( $this, 'add_wallet_tab' ), 15 );
        add_action( 'woocommerce_account_' . self::WALLET_ENDPOINT . '_endpoint', array( $this, 'render_tab_content' ) );

        add_filter( 'woocommerce_account_orders_columns', array( $this, 'order_list_add_debit_column' ) );
        add_action( 'woocommerce_my_account_my_orders_column_' . self::WALLET_COLUMN, array( $this, 'order_list_add_debit_column_data' ) );
        add_filter( 'woocommerce_my_account_my_orders_query', array( $this, 'order_list_filter_by_wallet_transections' ) );
        add_filter( 'woocommerce_get_view_order_url', array( $this, 'order_list_add_query_string_in_order_url' ), 10, 2 );

        // Setup Recharge & Balance Management
        add_action( 'woocommerce_before_calculate_totals', array( $this, 'set_wallet_product_price' ) );
        add_action( 'woocommerce_order_status_completed', array( $this, 'update_wallet_balance_on_recharge' ), 10, 3 );
        add_action( 'woocommerce_checkout_order_created', array( $this, 'deduct_wallet_balance_on_order' ) );
        add_filter( 'woocommerce_add_to_cart_validation', array( $this, 'remove_wallet_product_from_cart' ), 10, 2 );
        add_action( 'woocommerce_checkout_order_created', array( $this, 'order_created_set_transection_type' ), 10, 2 );
        add_action( 'woocommerce_order_refunded', array( $this, 'refund_wallet_balance' ), 10, 2 );

        // Register Shortcodes
        add_shortcode( 'whols_wallet_balance', array( $this, 'sc_current_wallet_balance' ) );

        // Ajax Actions
        add_action( 'wp_ajax_whols_wallet_add_to_cart', array( $this, 'wallet_add_to_cart') );
    }


    /**
     * Get plugin configuration value based on key
     * 
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function config( $key = '', $default = null ) {
        $value = whols_get_option($key, $default);

        return $value;
    }

    public function add_wallet_product() {
        $wallet_product_id = get_option('whols_wallet_product_id');
        $product = wc_get_product($wallet_product_id);

        // Update the product status to publish if it's not published
        if( $wallet_product_id && $product && $product->get_status() != 'publish' ) {
            $product->set_status( 'publish' );
            $product->save();
        }

        // If the product is already created and published, then return
        if( $wallet_product_id && $product && $product->get_status() === 'publish' ) {
            return;
        }

        $product = new \WC_Product_Simple();
        $product->set_name( 'Wallet Recharge' );
        $product->set_description( 'This is a virtual product. You can recharge your wallet by purchasing this product.' );
        $product->set_status( 'publish' ); 
        $product->set_catalog_visibility( 'hidden' );
        $product->set_virtual( true );
        $product->set_price( 0 );
        $product->set_regular_price( 0 );
        $product->set_sold_individually( true );
        $product->save();

        $wallet_product_id = $product->get_id();

        // Save the product id to the database
        update_option('whols_wallet_product_id', $wallet_product_id);
    }


    public function include_wallet_gateway_class() {
        if ( ! class_exists( 'WC_Payment_Gateway' ) ) {
            return;
        }

        include_once PL_PATH . '/includes/wallet/class-wc-gateway-wallet.php';
    }

    public function add_wallet_gateway_class_for_creating_instance( $methods ) {
        // Skip guest users
        if( ! is_user_logged_in() ) {
            return $methods;
        }

        // Make avaialble wallet payment only if the wallet product is not in the cart
        if( !$this->find_wallet_product_in_cart() ){
            $methods[] = 'Whols_Pro\WC_Gateway_Wallet';
        }
        
        return $methods;
    }

    public function validate_wallet_payment( $fields, $errors ){
        // If curent user is not logged in, then return
        if( ! is_user_logged_in() ) {
            return;
        }

        if( $fields['payment_method'] === 'whols_wallet' ) {
            // OTP method is none
            $current_user_id  = get_current_user_id();
            $current_user_wallet_balance = (float) get_user_meta( $current_user_id, 'whols_wallet_balance', true );

            $checkout_amount_to_pay = WC()->cart->total;

            // If the wallet balance is less than the checkout amount, then return
            if( $current_user_wallet_balance < $checkout_amount_to_pay ) {
                $errors->add( 'validation', __('Insufficient wallet balance.', 'whols') );
                return;
            }

            if( $this->config('otp_verification_method') === 'email' ) {

                // Generate otp if not already generated
                if( ! get_transient('otp_verification_' . get_current_user_id()) ) {
                    $this->generate_new_otp();
                }

                $otp_validation_result = $this->validate_otp();

                if( is_wp_error($otp_validation_result) ){
                    $errors->add( 'validation', $otp_validation_result->get_error_message() );
                }
            }
        }
    }

    public function add_otp_input_markup($description, $payment_id){
        // If curent user is not logged in, then return
        if( ! is_user_logged_in() ) {
            return;
        }

        if ('whols_wallet' === $payment_id) {
            ob_start(); // Start buffering
            echo '<div class="whols-wallet-otp">';
            printf(
                '<div class="whols-otp-instruction">%s <a href="#" class="whols-send-otp">%s</a></div>',
                esc_html__('To ensure your security, we\'ll send a verification code (OTP) to your email.', 'whols'),
                esc_html__('Send OTP', 'whols')
            );
            
            woocommerce_form_field('whols_otp', array(
                'type'      => 'text',
                'label'     => __("Enter Verification Code", "whols"),
                'class'     => array('form-row-wide'),
                'placeholder' => __("Enter 6-digit code", "whols"),
                'required'  => true,
            ), '');

            printf(
                '<div><a href="#" class="whols-resend-otp">%s</a></div>',
                esc_html__('Didn\'t receive the OTP? Resend Again', 'whols')
            );
            echo '</div>';
            $description .= ob_get_clean(); // Append buffered content
        }
        return $description;
    }

    public function register_wallet_endpoint() {
        add_rewrite_endpoint( 'whols-wallet', EP_ROOT | EP_PAGES );

        whols_maybe_flush_rewrite_rules();
    }

    public function add_wallet_tab( $items ) {
        $items_count = count( $items );

        $first_slice = array_slice($items, 0, $items_count - 1);
        $second_slice = array_slice($items, $items_count - 1);

        // Add new item
        $first_slice['whols-wallet'] = esc_html__( 'Wallet', 'whols' );
        $items = array_merge($first_slice, $second_slice);

        return $items;
    }

    public function render_tab_content() {
        include PL_PATH . '/includes/wallet/html-wallet-tab-content.php';
    }

    public function order_list_add_debit_column( $columns ){
        global $wp;

        if( isset($wp->query_vars['whols-wallet']) ){
            return array (
                'order-number' => __('Order', 'whols'),
                'whols-order-type' => __('Type', 'whols'),
                'order-date' => __('Date', 'whols'),
                'order-status' => __('Status', 'whols'),
                'order-total' => __('Total', 'whols'),
            );
        }

        return $columns;
        
    }

    public function order_list_add_debit_column_data( $order ) {
        global $wp;

        if( isset($wp->query_vars['whols-wallet']) ){
            $transection_type = $order->get_meta('_whols_transection_type', true);
            echo esc_html( ucfirst($transection_type) );
        }
    }

    public function order_list_filter_by_wallet_transections( $query ) {
        global $wp;

        if( isset($wp->query_vars['whols-wallet']) ){
            // HPOS compatible meta query
            $query['meta_query'] = array(
                array(
                    'key' => '_whols_transection_type',
                    'compare' => 'EXISTS'
                )
            );
        }

        return $query;
    }

    public function order_list_add_query_string_in_order_url( $url, $order ){
        global $wp;

        if( isset($wp->query_vars['whols-wallet']) ){
            $url = add_query_arg( 'whols-wallet', '1', $url );
        }

        return $url;
    }

    public function set_wallet_product_price( $cart ){
        if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
            return;
        }

        if ( did_action( 'woocommerce_before_calculate_totals' ) >= 2 ) {
            return;
        }

        foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
            if ( ! empty( $cart_item['whols_recharge_amount'] ) ) {
                $product = isset( $cart_item['data'] ) ? $cart_item['data'] : null;

                // Skip if product is not valid
                if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
                    continue;
                }

                $product->set_price( $cart_item['whols_recharge_amount'] );
            }
        }
    }

    public function update_wallet_balance_on_recharge( $order_id, $order, $status_transition ){
        $wallet_recharge_amount = $this->get_wallet_recharge_amount( $order );

        // Add the wallet recharge amount to the user's wallet balance
        if( $wallet_recharge_amount > 0 ) {
            $user_id = $order->get_user_id();
            $this->update_wallet_balance( $user_id, $wallet_recharge_amount );

            // Fire wallet recharge action
            do_action('whols_wallet_credited', $user_id, $wallet_recharge_amount);

            // Credit type transection
            $order->update_meta_data('_whols_transection_type', 'credit');
        }
    }



    public function deduct_wallet_balance_on_order( $order ){
        // If payment method is not wallet, then return
        if( $order->get_payment_method() !== 'whols_wallet' ) {
            return;
        }

        // Variables
        $order_id               = $order->get_id();
        $user_id                = $order->get_user_id();
        $checkout_amount_to_pay = (float) $order->get_total();

        // Deduct the wallet balance from the user's wallet
        $this->update_wallet_balance( $user_id, $checkout_amount_to_pay * -1 );
        
        // Update meta data for the order
        $order->update_meta_data('_whols_transection_type', 'debit');

        // Fire wallet deduct action
        do_action('whols_wallet_debited', $user_id, $checkout_amount_to_pay);

        $order->save();
    }

    public function remove_wallet_product_from_cart( $passed, $product_id ) {
        // Skip if we're in admin
        if (whols_is_request('admin')) {
            return $passed;
        }

        // Skip if the product being added is the wallet product
        if ($product_id == get_option('whols_wallet_product_id')) {
            return $passed;
        }

        // Check if wallet product exists in cart
        $wallet_in_cart = false;
        if (WC()->cart) {
            foreach (WC()->cart->get_cart() as $cart_item) {
                if ($cart_item['product_id'] == get_option('whols_wallet_product_id')) {
                    $wallet_in_cart = true;
                    break;
                }
            }
        }

        // If wallet product exists, empty the cart before adding new product
        if ($wallet_in_cart) {
            WC()->cart->empty_cart();
            wc_add_notice(__('Cart was emptied because wallet recharge products cannot be purchased with other products.', 'whols'), 'notice');
        }

        return $passed;
    }

    public function order_created_set_transection_type( $order ){
        $wallet_recharge_amount = $this->get_wallet_recharge_amount( $order );
        $payment_method         = $order->get_payment_method();

        // Set transection type
        if( $wallet_recharge_amount > 0 ) {
            $order->update_meta_data('_whols_transection_type', 'credit');
        } elseif( $payment_method === 'whols_wallet' ) {
            $order->update_meta_data('_whols_transection_type', 'debit');
        }
    }

    public function refund_wallet_balance( $order_id, $refund_id ){
        $order = wc_get_order( $order_id );
        $refund = wc_get_order( $refund_id );

        // If the payment method is not wallet, then return
        if( $order->get_payment_method() !== 'whols_wallet' ) {
            return;
        }

        // Variables
        $user_id = $order->get_user_id();
        $refund_amount = (float) $refund->get_total(); // By default, the refund amount is negative
        $refund_amount = abs($refund_amount); // Make it positive

        // Add the refund amount to the user's wallet balance
        $this->update_wallet_balance( $user_id, $refund_amount );

        // Fire wallet refund action
        do_action('whols_wallet_refunded', $user_id, $refund_amount);

        // Update meta data for the order
        $order->update_meta_data('_whols_transection_type', 'credit');
    }

    public function add_current_wallet_balance( $title, $id ) {
        // Skip order edit page
        if(is_admin()){
            return $title;
        }
        
        $current_ajax_action = isset($_REQUEST['wc-ajax']) ? sanitize_text_field($_REQUEST['wc-ajax']) : '';

        // Only show the wallet balance in the checkout page, not in the order received page
        if( 'whols_wallet' === $id && $current_ajax_action !== 'checkout' ){
            $title = $title . ' (' . do_shortcode('[whols_wallet_balance]') . ')';
        }

        return $title;
    }

    public function send_otp_ajax_action(){
        // Verify nonce and get email
        check_ajax_referer('whols_nonce', 'nonce');

        // OTP already sent
        if( get_transient('otp_verification_' . get_current_user_id()) ) {
            $transient_expire_in = get_option('_transient_timeout_otp_verification_' . get_current_user_id());
            $transient_expire_in = $transient_expire_in - time();
            $transient_expire_in = ceil($transient_expire_in / 60); // Convert seconds to minutes

            wp_send_json_error(
                __('An OTP has already been sent. Please wait for the OTP to expire before requesting a new one. This code will expire in 3 minutes.', 'whols')
            );

            return;
        }

        $current_user = wp_get_current_user();
        $email = $current_user->user_email;

        if (!is_email($email)) {
            wp_send_json_error('Invalid email address');
            return;
        }

        // Generate OTP
        $otp = $this->generate_new_otp();

        // Send email
        $sent = $this->send_otp_email($email, $otp);

        if ($sent) {
            $message = sprintf(__('OTP sent successfully. This code will expire in 3 minutes.', 'whols'), $email);
            wp_send_json_success($message);
        } else {
            $message = __('Failed to send OTP', 'whols');
            wp_send_json_error($message);
        }
    }

    public function send_otp_email( $receiver_email = '', $otp = '' ){
        // Email template
        $subject = sprintf( __('Your OTP Code for %s', 'whols'), get_bloginfo('name') );
        $message = sprintf(
            __('Your OTP code is: <strong>%s</strong> This code will expire in 3 minutes.', 'whols'),
            $otp
        );

        // Send email
        $headers = array('Content-Type: text/html; charset=UTF-8');
        $sent = wp_mail($receiver_email, $subject, $message, $headers);

        return $sent;
    }

    public function sc_current_wallet_balance() {
        $user_id = get_current_user_id();
        $wallet_balance = wc_price( get_user_meta( $user_id, 'whols_wallet_balance', true ) );
        return $wallet_balance;
    }


    public function generate_new_otp(){
        $otp = rand(100000, 999999); // Generate a 6-digit OTP
        $customer_id = get_current_user_id() ?: WC()->session->get_customer_id(); // Get unique customer identifier
        set_transient('otp_verification_' . $customer_id, $otp, 3 * MINUTE_IN_SECONDS);

        return $otp;
    }

    public function has_otp_transients(){
        $customer_id = get_current_user_id() ?: WC()->session->get_customer_id(); // Get unique customer identifier
        return (bool) get_transient('otp_verification_' . $customer_id);
    }

    /**
     * Validate the OTP
     * 
     * @return bool|\WP_Error
     */
    public function validate_otp(){
        $customer_id = get_current_user_id() ?: WC()->session->get_customer_id(); // Get unique customer identifier
        $stored_otp = get_transient('otp_verification_' . $customer_id);
        $submitted_otp = !empty($_POST['whols_otp']) ? sanitize_text_field($_POST['whols_otp']) : '';
    
        if (!$stored_otp) {
            return new \WP_Error('expired_otp', 'OTP has expired. Please request a new one.');
        }
    
        if ($submitted_otp !== $stored_otp) {
            return new \WP_Error('invalid_otp', 'Invalid OTP code.');
        }
    
        delete_transient('otp_verification_' . $customer_id);
        return true;
    }

    /**
     * Add or deduct the wallet balance of the user
     * 
     * @param int $user_id
     * @param float $amount - Positive or negative amount
     */
    public function update_wallet_balance($user_id, $amount){
        if( ! $user_id ) { // Skip guest users
            return;
        }

        // Negative or positive amount
        if ($amount > 0 || $amount < 0) {
            $current_balance = (float) get_user_meta($user_id, 'whols_wallet_balance', true);
            $new_balance = $current_balance + $amount;
            update_user_meta($user_id, 'whols_wallet_balance', $new_balance);
        }
    }

    public function find_wallet_product_in_cart(){
        if( ! WC()->cart ) { // Return for is_admin()
            return false;
        }

        $cart = WC()->cart->get_cart();
        $wallet_product_id = get_option('whols_wallet_product_id');

        foreach( $cart as $cart_item_key => $cart_item ) {
            if( $cart_item['product_id'] == $wallet_product_id ) {
                return true;
            }
        }

        return false;
    }

    public function find_wallet_product_in_order( $order ){
        if( ! $order ) {
            return false;
        }

        foreach ( $order->get_items() as $item_id => $item ) {
            $product_id = $item->get_product_id();
            if( $product_id == get_option('whols_wallet_product_id') ) {
                return true;
            }
        }

        return false;
    }

    public function get_wallet_recharge_amount( $order ) {
        // Accumalate the wallet recharge amount from the order
        $wallet_recharge_amount = 0;

        if( ! $order ) {
            return $wallet_recharge_amount;
        }

        foreach ( $order->get_items() as $item_id => $item ) {
            $product_id = $item->get_product_id();
            $subtotal = $item->get_subtotal();
            $total = $item->get_total();

            if( $product_id == get_option('whols_wallet_product_id') ) {
                $wallet_recharge_amount = $total;
                break;
            }
        }

        return $wallet_recharge_amount;
    }

    public function wallet_add_to_cart(){
        ob_start();
        $product_id        = get_option('whols_wallet_product_id');

		// phpcs:disable WordPress.Security.NonceVerification.Missing
		if ( ! isset( $_POST['recharge_amount'] ) ) {
			return;
		}

        // Validate minimum and maximum recharge amount
        $min_recharge_amount = (float) whols_get_option('min_amount_can_recharge');
        $max_recharge_amount = (float) whols_get_option('max_amount_can_recharge');
        $recharge_amount = (float) sanitize_text_field($_POST['recharge_amount']);

        if( $min_recharge_amount && $recharge_amount < $min_recharge_amount ){
            wc_add_notice( sprintf( esc_html__('Minimum recharge amount is %s', 'whols'), wc_price($min_recharge_amount) ), 'error' );

            wp_send_json_success(array(
                'message' => wc_print_notices(true)
            ));
        }

        if( $max_recharge_amount && $recharge_amount > $max_recharge_amount ){
            wc_add_notice( sprintf( esc_html__('Maximum recharge amount is %s', 'whols'), wc_price($max_recharge_amount) ), 'error' );

            wp_send_json_success(array(
                'message' => wc_print_notices(true)
            ));
        }

        // Clear the cart
        WC()->cart->empty_cart();
		
		$product           = new \WC_Product_Simple( $product_id );
        $product->set_price( $recharge_amount );
		$product_status    = get_post_status( $product_id );
        $cart_item_key = WC()->cart->add_to_cart( $product_id, 1, 0, array(), array('whols_recharge_amount' => $recharge_amount) );

		if ( $product->get_id() && $cart_item_key && 'publish' === $product_status ) {
            
            wc_add_to_cart_message( $product_id );

			wp_send_json_success(array(
                'message' => wc_print_notices(true)
            ));

		} else {

			// If there was an error adding to the cart, redirect to the product page to show any errors.
			$data = array(
				'error'       => true,
				'product_url' => apply_filters( 'woocommerce_cart_redirect_after_error', get_permalink( $product_id ), $product_id ),
			);

			wp_send_json( $data );
		}
		// phpcs:enable
    }
}