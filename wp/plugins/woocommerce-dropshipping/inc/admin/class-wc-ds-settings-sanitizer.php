<?php
/**
 * Centralized save handler for wc_dropship_manager.
 *
 * Preserves legacy behavior from class-wc-dropshipping-settings.php while
 * blocking unrelated $_POST keys (nonces, WooCommerce UI fields).
 *
 * @package WooCommerce_Dropshipping
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class WC_DS_Settings_Sanitizer
 */
class WC_DS_Settings_Sanitizer {

	/**
	 * POST keys that must never be written into wc_dropship_manager.
	 *
	 * @var string[]
	 */
	private static $blocked_post_keys = array(
		'save',
		'tab',
		'section',
		'page',
		'_wpnonce',
		'_wp_http_referer',
		'wc_ds_merchant_profile',
	);

	/**
	 * Hooked from WC_DS_Settings constructor.
	 *
	 * @param mixed $context Optional context from WooCommerce (section id in some versions).
	 * @return void
	 */
	public static function save( $context = null ) {
		unset( $context );

		if ( ! current_user_can( 'manage_woocommerce' ) ) {
			return;
		}

		if ( empty( $_POST['save'] ) || empty( $_POST['tab'] ) || 'wc_dropship_settings' !== $_POST['tab'] ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
			return;
		}

		check_admin_referer( 'woocommerce-settings' );

		$post    = wp_unslash( $_POST ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$options = self::merge_options_from_post( $post );

		update_option( 'wc_dropship_manager', $options, true );

		self::maybe_save_merchant_profile( $post );
	}

	/**
	 * Build option array from POST using legacy rules.
	 *
	 * @param array $post Unslashed POST data.
	 * @return array
	 */
	public static function merge_options_from_post( array $post ) {
		$current = get_option( 'wc_dropship_manager', array() );
		if ( ! is_array( $current ) ) {
			$current = array();
		}

		// Legacy: merge most POST keys into options (minus blocked keys).
		foreach ( $post as $key => $value ) {
			if ( 'submit' === $key ) {
				continue;
			}
			if ( self::is_blocked_post_key( $key ) ) {
				continue;
			}
			$current[ $key ] = $value;
		}

		// Explicit checkbox booleans (legacy — unchecked boxes are absent from POST).
		$checkboxes = array(
			'supp_notification',
			'csv_inmail',
			'billing_phone',
			'email_supplier',
			'hide_suppliername',
			'hide_suppliername_on_product_page',
			'hideorderdetail_suppliername',
			'full_information',
			'show_logo',
			'order_date',
			'smtp_check',
			'std_mail',
			'checkout_order_number',
			'show_pay_type',
			'cnf_mail',
			'cc_mail',
			'hide_client_info_Suppliers',
			'view_order',
			'renewal_email',
			'hide_contact_info_Suppliers',
			'store_add_shipping_add',
			'hide_shipping_price',
			'hide_tax',
			'total_price',
			'product_price',
			'shipping',
			'payment_method',
			'cost_of_goods',
			'show_gst_supplier_email',
			'billing_address',
			'shipping_address',
			'product_image',
			'store_name',
			'store_address',
			'complete_email',
			'order_complete_link',
			'type_of_package',
			'customer_note',
			'customer_email',
			'ali_cbe_enable_name',
			'dynamic_profit_margin',
		);

		foreach ( $checkboxes as $key ) {
			$current[ $key ] = isset( $post[ $key ] ) ? '1' : '0';
		}

		// Text fields that legacy cleared when missing.
		if ( isset( $post['from_name'] ) ) {
			$current['from_name'] = $post['from_name'];
		} else {
			$current['from_name'] = '';
		}
		if ( isset( $post['from_email'] ) ) {
			$current['from_email'] = $post['from_email'];
		} else {
			$current['from_email'] = '';
		}

		// AliExpress CBE rate (legacy behavior).
		if ( isset( $post['ali_cbe_price_rate_name'] ) ) {
			$current['ali_cbe_price_rate_name'] = $post['ali_cbe_price_rate_name'];
		} else {
			$current['ali_cbe_price_rate'] = '';
		}

		if ( isset( $post['ali_cbe_price_rate_value_name'] ) ) {
			$raw = $post['ali_cbe_price_rate_value_name'];
			// Match legacy check against submitted value (not stale $current).
			if ( $raw < 1 || ! is_numeric( $raw ) ) {
				$current['ali_cbe_price_rate_value_name'] = 0;
			} else {
				$current['ali_cbe_price_rate_value_name'] = $raw;
			}
		} else {
			$current['ali_cbe_price_rate_value_name'] = 0;
		}

		// Part 2: fee / profit fields (kept same as legacy conditional blocks).
		if ( isset( $post['packing_slip_header'] ) ) {
			if ( '' !== $post['packing_slip_header'] ) {
				$current['packing_slip_header'] = $post['packing_slip_header'];
			} else {
				$current['packing_slip_header'] = '';
			}
		}

		$numeric_fields = array( 'fee_percent_value', 'fee_doller_value', 'profit_doller_value', 'profit_percent_value' );
		foreach ( $numeric_fields as $field ) {
			if ( isset( $post[ $field ] ) ) {
				if ( '' !== $post[ $field ] ) {
					$current[ $field ] = $post[ $field ];
				} else {
					$current[ $field ] = '';
				}
			}
		}

		return $current;
	}

	/**
	 * @param string $key POST key.
	 * @return bool
	 */
	private static function is_blocked_post_key( $key ) {
		if ( in_array( $key, self::$blocked_post_keys, true ) ) {
			return true;
		}
		// WordPress / WC internals.
		if ( 0 === strpos( $key, '_wp' ) ) {
			return true;
		}
		return false;
	}

	/**
	 * Optional UX-only option (not part of wc_dropship_manager).
	 *
	 * @param array $post Unslashed POST.
	 * @return void
	 */
	private static function maybe_save_merchant_profile( array $post ) {
		if ( ! isset( $post['wc_ds_merchant_profile'] ) ) {
			return;
		}
		$allowed = array( '', 'aliexpress', 'local', 'amazon_affiliate', 'mixed' );
		$val     = sanitize_key( $post['wc_ds_merchant_profile'] );
		if ( in_array( $val, $allowed, true ) ) {
			update_option( 'wc_ds_merchant_profile', $val, false );
		}
	}
}
