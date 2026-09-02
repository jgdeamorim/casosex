<?php
namespace Whols_Pro;
use const Whols_Pro\PL_VERSION;
use const Whols_Pro\PL_PATH;
use const Whols_Pro\PL_URL;

use Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType;

/**
 * Whols Invoice Payment Block integration
 */
final class Gateway_Whols_Invoice_Block_Support extends AbstractPaymentMethodType {

	/**
	 * The gateway instance.
	 */
	private $gateway;

	/**
	 * Payment method name/id/slug.
	 *
	 * @var string
	 */
	protected $name = 'whols_invoice';

	/**
	 * Initializes the payment method type.
	 */
	public function initialize() {
		$this->settings = get_option( 'woocommerce_whols_invoice_settings', [] );
		$gateways       = WC()->payment_gateways->payment_gateways();
		$this->gateway  = $gateways[ $this->name ];
	}

	/**
	 * Returns if this payment method should be active. If false, the scripts will not be enqueued.
	 *
	 * @return boolean
	 */
	public function is_active() {
		return $this->gateway->is_available();
	}

	/**
	 * Returns an array of scripts/handles to be registered for this payment method.
	 *
	 * @return array
	 */
	public function get_payment_method_script_handles() {
		$script_path       = '/build/blocks/whols-invoice-payment/index.js';
		$script_asset_path = PL_PATH . '/build/blocks/whols-invoice-payment/index.asset.php';

		$script_asset      = file_exists( $script_asset_path )
			? require( $script_asset_path )
			: array(
				'dependencies' => array(),
				'version'      => PL_VERSION
			);
		$script_url        = PL_URL . $script_path;

		wp_register_script(
			'whols-invoice-payment-block-support',
			$script_url,
			$script_asset[ 'dependencies' ],
			$script_asset[ 'version' ],
			true
		);

		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations( 'whols-invoice-payment-block-support','whols', PL_URL . '/languages/' );
		}

		return [ 'whols-invoice-payment-block-support'];
	}

	/**
	 * Returns an array of key=>value pairs of data made available to the payment methods script.
	 *
	 * @return array
	 */
	public function get_payment_method_data() {
		return [
			'title'       => $this->get_setting( 'title' ),
			'description' => $this->get_setting( 'description' ),
			'supports'    => array_filter( $this->gateway->supports, [ $this->gateway, 'supports' ] )
		];
	}
}
