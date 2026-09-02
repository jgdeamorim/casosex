<?php
namespace Whols_Pro;

class Manage_Quote {
    public function __construct() {
        $enable_request_a_quote = whols_get_option('enable_request_a_quote');

        if( !$enable_request_a_quote ){
            return;
        }

        // Add custom quote button to the cart page.
        add_action( 'woocommerce_cart_actions', array( $this, 'add_reqest_quote_button' ) );
        add_action( 'woolentor_cart_actions', array( $this, 'add_reqest_quote_button' ) );

        // Add js template for the quote modal.
        add_action( 'wp_footer', array( $this, 'add_modal_markup' ) );
    }

    public function add_reqest_quote_button(){
        $request_a_quote_label = whols_get_option('request_a_quote_label', esc_html__( 'Request a Quote', 'whols' ), true);
        ?>
        <a href="#" data-location="cart" class="whols-request-a-quote button alt"><?php echo esc_html($request_a_quote_label); ?></a>
        <?php
    }

    public function add_modal_markup(){
        wp_enqueue_style('dashicons');
    }
}