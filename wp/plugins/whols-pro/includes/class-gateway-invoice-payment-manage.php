<?php
namespace Whols_Pro;
use const Whols_Pro\PL_PATH;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Invoice Payment Gateway
 */
class Gateway_Invoice_Payment_Manage {
	public static function init() {
		// New gateway class
		add_action( 'plugins_loaded', array( __CLASS__, 'includes' ), 0 );

		// Make the gateway available to WC.
		add_filter( 'woocommerce_payment_gateways', array( __CLASS__, 'add_gateway' ) );

		// Registers WooCommerce Blocks integration. (Has issue)
		// add_action( 'woocommerce_blocks_loaded', array( __CLASS__, 'add_block_support' ) );
	}

	/**
	 * includes.
	 */
	public static function includes() {

		// Make the WC_Gateway_Dummy class available.
		if ( class_exists( 'WC_Payment_Gateway' ) ) {
			require_once PL_PATH . '/includes/class-wc-gateway-whols-invoice.php';
		}
	}

	/**
	 * Add the New Payment gateway to the list of available gateways.
	 *
	 * @param array
	 */
	public static function add_gateway( $gateways ) {

		$options = get_option( 'woocommerce_whols_invoice_settings', array() );

		if ( isset( $options['hide_for_non_admin_users'] ) ) {
			$hide_for_non_admin_users = $options['hide_for_non_admin_users'];
		} else {
			$hide_for_non_admin_users = 'no';
		}

		if ( ( 'yes' === $hide_for_non_admin_users && current_user_can( 'manage_options' ) ) || 'no' === $hide_for_non_admin_users ) {
			$gateways[] = 'Gateway_Whols_Invoice';
		}
		return $gateways;
	}

	/**
	 * Registers WooCommerce Blocks integration.
	 *
	 */
	public static function add_block_support() {

		if ( class_exists( 'Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType' ) ) {
			require_once PL_PATH . '/includes/class-wc-gateway-whols-invoice-block-support.php';
			add_action(
				'woocommerce_blocks_payment_method_type_registration',
				function( \Automattic\WooCommerce\Blocks\Payments\PaymentMethodRegistry $payment_method_registry ) {
					$payment_method_registry->register( new Gateway_Whols_Invoice_Block_Support() );
				}
			);
		}
	}
}

Gateway_Invoice_Payment_Manage::init();