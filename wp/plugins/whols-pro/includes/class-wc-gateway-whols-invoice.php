<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Invoice Payment Gateway
 */
class Gateway_Whols_Invoice extends \WC_Payment_Gateway {
	/**
	 * Payment gateway instructions.
	 * @var string
	 *
	 */
	protected $instructions;

	/**
	 * Whether the gateway is visible for non-admin users.
	 * @var boolean
	 *
	 */
	protected $hide_for_non_admin_users;

	/**
	 * Unique id for the gateway.
	 * @var string
	 *
	 */
	public $id = 'whols_invoice'; // used in the URL admin.php?page=wc-settings&tab=checkout&section=whols_invoice


	/**
	 * Constructor for the gateway.
	 */
	public function __construct() {
		$this->icon               = apply_filters( 'woocommerce_whols_invoice_icon', '' );
		$this->has_fields         = true;
		
		// Load the settings after click on the manage button.
		$this->init_form_fields();

		// Without calling this mehtod the quick enable/disable gateway option doesn't work
		$this->init_settings();

		// Display gateway info in the gateway list in checkout page
		$this->title = $this->get_option( 'title' );
		$this->description = $this->get_option( 'description' );
		//$this->instructions = $this->get_option( 'instructions' ); // Deprecated

		$this->method_title = __( 'Invoice Payment', 'whols' );
		$this->method_description = __( 'Allow invoice payments, which will be initiated by the admin and sent to the wholesale customer for payment.', 'whols' );

		// Actions.
		// Save the field values from gateway edit page
		add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );

		// Print instructions in the thank you page
		add_action( 'woocommerce_thankyou_' . $this->id, array( $this, 'thankyou_page' ) );

		// Customer Emails
		add_action( 'woocommerce_email_before_order_table', array( $this, 'email_instructions' ), 10, 3 );
	}

	/**
	 * Initialise Gateway Settings Form Fields.
	 */
	public function init_form_fields() {
		$this->form_fields = array(
			'enabled'      => array(
				'title'       => __( 'Enable/Disable', 'whols' ),
				'label'       => __( 'Enable invoice payment', 'whols' ),
				'type'        => 'checkbox',
				'description' => '',
				'default'     => 'no',
			),
			'title'        => array(
				'title'       => __( 'Title', 'whols' ),
				'type'        => 'safe_text',
				'description' => __( 'Payment method description that the customer will see on your checkout.', 'whols' ),
				'default'     => __( 'Invoice payment', 'whols' ),
				'desc_tip'    => true,
			),
			'description'  => array(
				'title'       => __( 'Description', 'whols' ),
				'type'        => 'textarea',
				'description' => __( 'Payment method description that the customer will see on your website.', 'whols' ),
				'default'     => __( 'Pay later using an invoice.', 'whols' ),
				'desc_tip'    => true,
			),
			'instructions' => array(
				'title'       => __( 'Instructions', 'whols' ),
				'type'        => 'textarea',
				'description' => __( 'Instructions that will be added to the thank you page.', 'whols' ),
				'default'     => __( 'Pay later using an invoice.', 'whols' ),
				'desc_tip'    => true,
			)
		);
	}

	/**
	 * Process the payment and return the result.
	 *
	 * @param int $order_id Order ID.
	 * @return array
	 */
	public function process_payment( $order_id ) {
		$order = wc_get_order( $order_id );

		if ( $order->get_total() > 0 ) {
			// Mark as on-hold (we're awaiting the invoce payment).
			$order->update_status( apply_filters( 'woocommerce_whols_invoice_process_payment_order_status', 'on-hold', $order ), __( 'Payment to be made later using the invoice.', 'whols' ) );
		} else {
			$order->payment_complete();
		}

		// Remove cart.
		WC()->cart->empty_cart();

		// Return thankyou redirect.
		return array(
			'result'   => 'success',
			'redirect' => $this->get_return_url( $order ),
		);
	}

	/**
	 * Output for the order received page.
	 */
	public function thankyou_page() {
		if ( $this->instructions ) {
			echo wp_kses_post( wpautop( wptexturize( $this->instructions ) ) );
		}
	}

	/**
	 * Add content to the WC emails.
	 *
	 * @param \WC_Order $order Order object.
	 * @param bool     $sent_to_admin  Sent to admin.
	 * @param bool     $plain_text Email format: plain text or HTML.
	 */
	public function email_instructions( $order, $sent_to_admin, $plain_text = false ) {
		if ( $this->instructions && ! $sent_to_admin && $this->id === $order->get_payment_method() ) {
			echo wp_kses_post( wpautop( wptexturize( $this->instructions ) ) . PHP_EOL );
		}
	}
}