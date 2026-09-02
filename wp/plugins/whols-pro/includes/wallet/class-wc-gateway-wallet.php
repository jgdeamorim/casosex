<?php
namespace Whols_Pro;

if ( ! class_exists( 'WC_Payment_Gateway' ) ) {
    return;
}

class WC_Gateway_Wallet extends \WC_Payment_Gateway {

    public function __construct() {
        $this->id                 = 'whols_wallet'; // used in the URL admin.php?page=wc-settings&tab=checkout&section=whols_wallet
        $this->icon               = ''; // URL of the icon that will be displayed on the checkout page
        $this->has_fields         = false;
        $this->method_title       = __( 'Whols - Wallet Payment', 'whols' );
        $this->method_description = __( 'Allows payments using wallet.', 'whols' );

        // Load the settings
        $this->init_form_fields();
        $this->init_settings();

        // Define user settings
        $this->title        = $this->get_option( 'title' );
        $this->description  = $this->get_option( 'description' );

        // Save the settings using the parent method.
        add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) ); 
    }

    public function init_form_fields() {
        $this->form_fields = array(
            'enabled' => array(
                'title'   => __( 'Enable/Disable', 'whols' ),
                'type'    => 'checkbox',
                'label'   => __( 'Enable Wallet Payment', 'whols' ),
                'default' => 'yes'
            ),
            'title' => array(
                'title'       => __( 'Title', 'whols' ),
                'type'        => 'text',
                'description' => __( 'This controls the title which the user sees during checkout.', 'whols' ),
                'default'     => __( 'Wallet Payment', 'whols' ),
            ),
            'description' => array(
                'title'       => __( 'Description', 'whols' ),
                'type'        => 'textarea',
                'description' => __( 'This controls the description which the user sees during checkout.', 'whols' ),
                'default'     => __( 'Pay using your wallet balance.', 'whols' ),
            ),
        );
    }

    public function process_payment( $order_id ) {
        $order = wc_get_order( $order_id );

        // Mark as on-hold (we're awaiting the payment)
        $order->update_status( 'on-hold', __( 'Awaiting wallet payment', 'whols' ) );

        // Reduce stock levels
        wc_reduce_stock_levels( $order_id );

        // Remove cart
        WC()->cart->empty_cart();

        // Return thank you page redirect
        return array(
            'result'   => 'success',
            'redirect' => $this->get_return_url( $order ),
        );
    }
}