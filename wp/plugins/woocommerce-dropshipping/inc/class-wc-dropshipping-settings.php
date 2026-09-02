<?php

if (! defined('ABSPATH')) {

	exit; // Exit if accessed directly } if ( ! class_exists( 'WC_DS_Settings' ) ) :
}

if (! class_exists('WC_DS_Settings')) :

	require_once dirname( __FILE__ ) . '/admin/class-wc-ds-settings-sanitizer.php';
	require_once dirname( __FILE__ ) . '/admin/class-wc-ds-settings-setup-state.php';
	require_once dirname( __FILE__ ) . '/admin/class-wc-ds-settings-registry.php';

	function wc_ds_add_settings($settings)
	{

		/**
		 * Settings class
		 */

		class WC_DS_Settings extends WC_Settings_Page
		{

			/**
			 * The request response
			 *
			 * @var array
			 */

			private $response = null;

			/**
			 * The error message
			 *
			 * @var string
			 */

			private $error_message = '';

			/**
			 * Setup settings class
			 */

			const SETTINGS_NAMESPACE = 'dropshipping';

			public function __construct()
			{

				$this->id = 'wc_dropship_settings';

				$this->label = __( 'Dropshipping', 'woocommerce-dropshipping' );

				add_filter('woocommerce_settings_tabs_array', array($this, 'add_settings_page'), 20);

				add_action('woocommerce_settings_' . $this->id, array($this, 'output'));

				add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_settings_assets' ) );
			}

			/**
			 * Persist custom settings (WC_Admin_Settings::save_fields is a no-op for this tab).
			 *
			 * @return void
			 */
			public function save() {
				if ( method_exists( $this, 'is_current_page' ) && ! $this->is_current_page() ) {
					return;
				}
				WC_DS_Settings_Sanitizer::save();
			}

			/**
			 * Styles/scripts for refactored settings UI.
			 *
			 * @param string $hook_suffix Current admin page.
			 */
			public function enqueue_settings_assets( $hook_suffix ) {
				if ( 'woocommerce_page_wc-settings' !== $hook_suffix ) {
					return;
				}
				if ( empty( $_GET['tab'] ) || 'wc_dropship_settings' !== $_GET['tab'] ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
					return;
				}
				$plugin_file = dirname( dirname( __FILE__ ) ) . '/woocommerce-dropshipping.php';
				$wc_ds_ver  = defined( 'WC_DROPSHIPPING_VERSION' ) ? WC_DROPSHIPPING_VERSION : '';
				if ( '' === $wc_ds_ver ) {
					$plugin_data = get_file_data( $plugin_file, array( 'Version' => 'Version' ), 'plugin' );
					$wc_ds_ver   = ! empty( $plugin_data['Version'] ) ? $plugin_data['Version'] : '1.0.0';
				}
				wp_enqueue_style(
					'wc-ds-admin-settings',
					plugins_url( 'assets/css/wc-ds-admin-settings.css', $plugin_file ),
					array(),
					$wc_ds_ver
				);
				wp_enqueue_script(
					'wc-ds-settings-tabs',
					plugins_url( 'assets/js/wc-ds-settings-tabs.js', $plugin_file ),
					array( 'jquery' ),
					$wc_ds_ver,
					true
				);
				wp_localize_script(
					'wc-ds-settings-tabs',
					'wcDsGuidedNav',
					array(
						'steps' => WC_DS_Settings_Registry::get_guided_steps(),
						'i18n'  => array(
							'back'          => __( 'Back', 'woocommerce-dropshipping' ),
							'next'          => __( 'Next', 'woocommerce-dropshipping' ),
							'stepOf'        => __( 'Step %1$s of %2$s · %3$s', 'woocommerce-dropshipping' ),
							'stepProgress'  => __( 'Step %1$s of %2$s', 'woocommerce-dropshipping' ),
						),
					)
				);
			}

			/**
			 * Get settings array
			 *
			 * @param string $current_section Optional. Defaults to empty string.
			 * @return array Array of settings
			 */
			public function get_dropshipping_settings($current_section = '') {

				$base_name = explode('/', plugin_basename(__FILE__));

				wp_enqueue_style('wc_dropshipping_checkout_style', plugins_url() . '/' . $base_name[0] . '/assets/css/custom.css');

				// Options persistence: WC_DS_Settings_Sanitizer::save() on woocommerce_update_options_wc_dropship_settings.
				// Tab to update options //global $current_section;

				// Legacy merge: only on Dropshipping settings screen (never merge unrelated WC settings POST data).
				if (
					isset( $_GET['tab'] ) && 'wc_dropship_settings' === sanitize_key( wp_unslash( $_GET['tab'] ) ) // phpcs:ignore WordPress.Security.NonceVerification.Recommended
					&& ! empty( $_POST )
				) {

					$options = get_option('wc_dropship_manager');

					foreach ($_POST as $key => $opt) {
						if ($key != 'submit') {
							$options[$key] = $_POST[$key]; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
						}
					}

					if (isset($_POST['supp_notification'])) {
						$options['supp_notification'] = '1';
					} else {
						$options['supp_notification'] = '0';
					}
					
					if (isset($_POST['allow_manual_supplier_notification'])) {
						$options['allow_manual_supplier_notification'] = '1';
					} else {
						$options['allow_manual_supplier_notification'] = '0';
					}

					if (isset($_POST['csv_inmail'])) {
						$options['csv_inmail'] = '1';
					} else {
						$options['csv_inmail'] = '0';
					}

					if (isset($_POST['billing_phone'])) {
						$options['billing_phone'] = '1';
					} else {
						$options['billing_phone'] = '0';
					}

					if (isset($_POST['email_supplier'])) {
						$options['email_supplier'] = '1';
					} else {
						$options['email_supplier'] = '0';
					}

					if (isset($_POST['hide_suppliername'])) {
						$options['hide_suppliername'] = '1';
					} else {
						$options['hide_suppliername'] = '0';
					}

					if (isset($_POST['hide_suppliername_on_product_page'])) {
						$options['hide_suppliername_on_product_page'] = '1';
					} else {
						$options['hide_suppliername_on_product_page'] = '0';
					}

					if (isset($_POST['hideorderdetail_suppliername'])) {
						$options['hideorderdetail_suppliername'] = '1';
					} else {
						$options['hideorderdetail_suppliername'] = '0';
					}

					if (isset($_POST['full_information'])) {
						$options['full_information'] = '1';
					} else {
						$options['full_information'] = '0';
					}

					if (isset($_POST['show_logo'])) {
						$options['show_logo'] = '1';
					} else {
						$options['show_logo'] = '0';
					}

					if (isset($_POST['order_date'])) {
						$options['order_date'] = '1';
					} else {
						$options['order_date'] = '0';
					}

					if (isset($_POST['smtp_check'])) {
						$options['smtp_check'] = '1';
					} else {
						$options['smtp_check'] = '0';
					}

					if (isset($_POST['std_mail'])) {
						$options['std_mail'] = '1';
					} else {
						$options['std_mail'] = '0';
					}

					if (isset($_POST['checkout_order_number'])) {
						$options['checkout_order_number'] = '1';
					} else {
						$options['checkout_order_number'] = '0';
					}

					if (isset($_POST['show_pay_type'])) {
						$options['show_pay_type'] = '1';
					} else {
						$options['show_pay_type'] = '0';
					}

					if (isset($_POST['cnf_mail'])) {
						$options['cnf_mail'] = '1';
					} else {
						$options['cnf_mail'] = '0';
					}

					if (isset($_POST['cc_mail'])) {
						$options['cc_mail'] = '1';
					} else {
						$options['cc_mail'] = '0';
					}

					/** Staert Hide client info 5.6
					 * created at : 13/10/2022
					 * Updated at :
					 */
					if (isset($_POST['hide_client_info_Suppliers'])) {
						$options['hide_client_info_Suppliers'] = '1';
					} else {
						$options['hide_client_info_Suppliers'] = '0';
					}
					/** End Hide client info */

					/** Supplier Email Notifications */
					if (isset($_POST['view_order'])) {
						$options['view_order'] = '1';
					} else {
						$options['view_order'] = '0';
					}

					if (isset($_POST['renewal_email'])) {
						$options['renewal_email'] = '1';
					} else {
						$options['renewal_email'] = '0';
					}
					/** End Supplier Email Notifications */

					// Start hide contact_info_Suppliers
					if (isset($_POST['hide_contact_info_Suppliers'])) {
						$options['hide_contact_info_Suppliers'] = '1';
					} else {
						$options['hide_contact_info_Suppliers'] = '0';
					}

					// Customer Phone Number to Supplier
					if (isset($_POST['billing_phone'])) {
						$options['billing_phone'] = '1';
					} else {
						$options['billing_phone'] = '0';
					}
					// End Customer Phone Number to Supplier

					// End hide contact_info_Suppliers

					// store add_shipping_add
					if (isset($_POST['store_add_shipping_add'])) {
						$options['store_add_shipping_add'] = '1';
					} else {
						$options['store_add_shipping_add'] = '0';
					}
					// store add_shipping_add

					if (isset($_POST['from_name'])) {
						$options['from_name'] = $_POST['from_name']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					} else {
						$options['from_name'] = '';
					}

					if (isset($_POST['from_email'])) {
						$options['from_email'] = $_POST['from_email']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					} else {
						$options['from_email'] = '';
					}

					if (isset($_POST['hide_shipping_price'])) {
						$options['hide_shipping_price'] = '1';
					} else {
						$options['hide_shipping_price'] = '0';
					}

					if (isset($_POST['hide_tax'])) {
						$options['hide_tax'] = '1';
					} else {
						$options['hide_tax'] = '0';
					}

					if (isset($_POST['total_price'])) {
						$options['total_price'] = '1';
					} else {
						$options['total_price'] = '0';
					}

					if (isset($_POST['product_price'])) {
						$options['product_price'] = '1';
					} else {
						$options['product_price'] = '0';
					}

					if (isset($_POST['shipping'])) {
						$options['shipping'] = '1';
					} else {
						$options['shipping'] = '0';
					}

					if (isset($_POST['payment_method'])) {
						$options['payment_method'] = '1';
					} else {
						$options['payment_method'] = '0';
					}

					if (isset($_POST['cost_of_goods'])) {
						$options['cost_of_goods'] = '1';
					} else {
						$options['cost_of_goods'] = '0';
					}

					if (isset($_POST['show_gst_supplier_email'])) {
						$options['show_gst_supplier_email'] = '1';
					} else {
						$options['show_gst_supplier_email'] = '0';
					}

					if (isset($_POST['billing_address'])) {
						$options['billing_address'] = '1';
					} else {
						$options['billing_address'] = '0';
					}

					if (isset($_POST['shipping_address'])) {
						$options['shipping_address'] = '1';
					} else {
						$options['shipping_address'] = '0';
					}

					if (isset($_POST['product_image'])) {
						$options['product_image'] = '1';
					} else {
						$options['product_image'] = '0';
					}

					if (isset($_POST['store_name'])) {
						$options['store_name'] = '1';
					} else {
						$options['store_name'] = '0';
					}

					if (isset($_POST['store_address'])) {
						$options['store_address'] = '1';
					} else {
						$options['store_address'] = '0';
					}

					if (isset($_POST['complete_email'])) {
						$options['complete_email'] = '1';
					} else {
						$options['complete_email'] = '0';
					}

					if (isset($_POST['order_complete_link'])) {
						$options['order_complete_link'] = '1';
					} else {
						$options['order_complete_link'] = '0';
					}

					if (isset($_POST['type_of_package'])) {
						$options['type_of_package'] = '1';
					} else {
						$options['type_of_package'] = '0';
					}

					if (isset($_POST['customer_note'])) {
						$options['customer_note'] = '1';
					} else {
						$options['customer_note'] = '0';
					}

					if (isset($_POST['customer_email'])) {
						$options['customer_email'] = '1';
					} else {
						$options['customer_email'] = '0';
					}

					// Aliexpress Settings get POST

					if (isset($_POST['ali_cbe_enable_name'])) {
						$options['ali_cbe_enable_name'] = '1';
					} else {
						$options['ali_cbe_enable_name'] = '0';
					}

					if (isset($_POST['ali_cbe_price_rate_name'])) {
						$options['ali_cbe_price_rate_name'] = $_POST['ali_cbe_price_rate_name']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					} else {
						$options['ali_cbe_price_rate'] = '';
					}

					if (isset($_POST['ali_cbe_price_rate_value_name'])) {

						if ($options['ali_cbe_price_rate_value_name'] < 1 || ! is_numeric($options['ali_cbe_price_rate_value_name'])) {
							$options['ali_cbe_price_rate_value_name'] = 0;
						} else {
							$options['ali_cbe_price_rate_value_name'] = $_POST['ali_cbe_price_rate_value_name']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
						}
					} else {
						$options['ali_cbe_price_rate_value_name'] = 0;
					}

					/* Related to Price Calculator */

					if (isset($_POST['dynamic_profit_margin'])) {
						$options['dynamic_profit_margin'] = '1';
					} else {
						$options['dynamic_profit_margin'] = '0';
					}

					/* Related to Price Calculator End */

					update_option('wc_dropship_manager', $options);
				}

				/* Part 2 */

				$options = get_option('wc_dropship_manager');
				if ( ! is_array( $options ) ) {
					$options = array();
				}

				$wc_ds_setup_state    = new WC_DS_Settings_Setup_State( $options );
				$wc_ds_setup_progress = $wc_ds_setup_state->get_progress_percent();
				$wc_ds_first_run      = $wc_ds_setup_progress < 100;
				$wc_ds_active_tab     = $wc_ds_setup_state->should_default_to_overview() ? 'overview' : 'general_settings';

				if (isset($options['supp_notification'])) {
					$supp_notification = $options['supp_notification'];
				} else {
					$supp_notification = '';
				}

				if (isset($options['allow_manual_supplier_notification'])) {
					$allow_manual_supplier_notification = $options['allow_manual_supplier_notification'];
				} else {
					$allow_manual_supplier_notification = '1';
				}


				if (isset($options['csv_inmail'])) {
					$csvcheck = $options['csv_inmail'];
				} else {
					$csvcheck = '';
				}

				if (isset($_POST['packing_slip_header'])) {

					if ('' != $_POST['packing_slip_header']) {
						$options['packing_slip_header'] = $_POST['packing_slip_header']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					} else {
						$options['packing_slip_header'] = '';
					}
				}

				if (isset($options['full_information'])) {
					$full_information = $options['full_information'];
				} else {
					$full_information = '';
				}

				if (isset($options['show_logo'])) {
					$show_logo = $options['show_logo'];
				} else {
					$show_logo = '';
				}

				if (isset($options['order_date'])) {
					$order_date = $options['order_date'];
				} else {
					$order_date = '';
				}

				if (isset($options['smtp_check'])) {
					$smtp_check = $options['smtp_check'];
				} else {
					$smtp_check = '';
				}

				if (isset($options['std_mail'])) {
					$std_mail = $options['std_mail'];
				} else {
					$std_mail = '';
				}

				if (isset($options['checkout_order_number'])) {
					$checkout_order_number = $options['checkout_order_number'];
				} else {
					$checkout_order_number = 0;
				}

				if (isset($options['show_pay_type'])) {
					$show_pay_type = $options['show_pay_type'];
				} else {
					$show_pay_type = '';
				}

				if (isset($options['cnf_mail'])) {
					$cnf_mail = $options['cnf_mail'];
				} else {
					$cnf_mail = '';
				}

				if (isset($options['cc_mail'])) {
					$cc_mail = $options['cc_mail'];
				} else {
					$cc_mail = '';
				}

				/** hide client_info_Suppliers */
				if (isset($options['hide_client_info_Suppliers'])) {
					$hide_client_info_Suppliers = $options['hide_client_info_Suppliers'];
				} else {
					$hide_client_info_Suppliers = '';
				}
				// hide client_info_Suppliers

				// Supplier Email Notifications
				if (isset($options['view_order'])) {
					$view_order = $options['view_order'];
				} else {
					$view_order = '';
				}

				if (isset($options['renewal_email'])) {
					$renewal_email = $options['renewal_email'];
				} else {
					$renewal_email = '';
				}
				// End Supplier Email Notifications

				// hide contact_info_Suppliers
				if (isset($options['hide_contact_info_Suppliers'])) {
					$hide_contact_info_Suppliers = $options['hide_contact_info_Suppliers'];
				} else {
					$hide_contact_info_Suppliers = '';
				}
				// hide contact_info_Suppliers

				// Customer Phone Number to Supplier
				if (isset($options['billing_phone'])) {
					$billing_phone = $options['billing_phone'];
				} else {
					$billing_phone = '';
				}
				// End Customer Phone Number to Supplier

				// store add_shipping_add
				if (isset($options['store_add_shipping_add'])) {
					$store_add_shipping_add = $options['store_add_shipping_add'];
				} else {
					$store_add_shipping_add = '';
				}
				// store add_shipping_add

				if (isset($options['from_name'])) {
					$from_name = $options['from_name'];
				} else {
					$from_name = '';
				}

				if (isset($options['from_email'])) {
					$from_email = $options['from_email'];
				} else {
					$from_email = '';
				}

				if (isset($options['hide_shipping_price'])) {
					$hide_shipping_price = $options['hide_shipping_price'];
				} else {
					$hide_shipping_price = '';
				}

				if (isset($options['hide_tax'])) {
					$hide_tax = $options['hide_tax'];
				} else {
					$hide_tax = '';
				}

				if (isset($options['total_price'])) {
					$total_price = $options['total_price'];
				} else {
					$total_price = '';
				}

				if (isset($options['product_price'])) {
					$product_price = $options['product_price'];
				} else {
					$product_price = '';
				}

				if (isset($options['shipping'])) {
					$shipping = $options['shipping'];
				} else {
					$shipping = '';
				}

				if (isset($options['cost_of_goods'])) {
					$cost_of_goods = $options['cost_of_goods'];
				} else {
					$cost_of_goods = '';
				}

				if (isset($options['show_gst_supplier_email'])) {
					$show_gst_supplier_email = $options['show_gst_supplier_email'];
				} else {
					$show_gst_supplier_email = '';
				}

				if (isset($options['billing_address'])) {
					$billing_address = $options['billing_address'];
				} else {
					$billing_address = '';
				}

				if (isset($options['billing_phone'])) {
					$billing_phone = $options['billing_phone'];
				} else {
					$billing_phone = '';
				}

				if (isset($options['email_supplier'])) {
					$email_supplier = $options['email_supplier'];
				} else {
					$email_supplier = '';
				}

				if (isset($options['hide_suppliername'])) {
					$hide_suppliername = $options['hide_suppliername'];
				} else {
					$hide_suppliername = '';
				}

				if (isset($options['hide_suppliername_on_product_page'])) {
					$hide_suppliername_on_product_page = $options['hide_suppliername_on_product_page'];
				} else {
					$hide_suppliername_on_product_page = '';
				}

				if (isset($options['hideorderdetail_suppliername'])) {
					$hideorderdetail_suppliername = $options['hideorderdetail_suppliername'];
				} else {
					$hideorderdetail_suppliername = '';
				}

				if (isset($options['shipping_address'])) {
					$shipping_address = $options['shipping_address'];
				} else {
					$shipping_address = '';
				}

				if (isset($options['product_image'])) {
					$product_image = $options['product_image'];
				} else {
					$product_image = '';
				}

				if (isset($options['store_name'])) {
					$store_name = $options['store_name'];
				} else {
					$store_name = '';
				}

				if (isset($options['store_address'])) {
					$store_address = $options['store_address'];
				} else {
					$store_address = '';
				}

				if (isset($options['complete_email'])) {
					$complete_email = $options['complete_email'];
				} else {
					$complete_email = '';
				}

				if (isset($options['order_complete_link'])) {
					$order_complete_link = $options['order_complete_link'];
				} else {
					$order_complete_link = '';
				}

				if (isset($options['type_of_package'])) {
					$type_of_package = $options['type_of_package'];
				} else {
					$type_of_package = '';
				}

				if (isset($options['customer_note'])) {
					$customer_note = $options['customer_note'];
				} else {
					$customer_note = '';
				}

				if (isset($options['customer_email'])) {
					$customer_email = $options['customer_email'];
				} else {
					$customer_email = '';
				}

				if ($customer_email == '1') {
					$customer_email = ' checked="checked" ';
				} else {
					$customer_email = ' ';
				}

				// Aliexpress Settings for setting variable creation

				if (isset($options['ali_cbe_enable_name'])) {
					$ali_cbe_enable_setting = $options['ali_cbe_enable_name'];
				} else {
					$ali_cbe_enable_setting = '';
				}

				if (isset($options['ali_cbe_price_rate_name'])) {
					$ali_cbe_price_rate_selected_1 = '';
					$ali_cbe_price_rate_selected_2 = '';

					if ($options['ali_cbe_price_rate_name'] == 'ali_cbe_price_rate_percent_offset') {
						$ali_cbe_price_rate_selected_1 = 'selected';
						$ali_cbe_price_rate_selected_2 = '';
					} else {
						$ali_cbe_price_rate_selected_1 = '';
						$ali_cbe_price_rate_selected_2 = 'selected';
					}
				}

				/* Related to Price Calculator */

				if (isset($_POST['fee_percent_value'])) {

					if ('' != $_POST['fee_percent_value']) {
						$options['fee_percent_value'] = $_POST['fee_percent_value']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					} else {
						$options['fee_percent_value'] = '';
					}
				}

				if (isset($_POST['fee_doller_value'])) {

					if ('' != $_POST['fee_doller_value']) {
						$options['fee_doller_value'] = $_POST['fee_doller_value']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					} else {
						$options['fee_doller_value'] = '';
					}
				}

				if (isset($_POST['profit_doller_value'])) {

					if ('' != $_POST['profit_doller_value']) {
						$options['profit_doller_value'] = $_POST['profit_doller_value']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					} else {
						$options['profit_doller_value'] = '';
					}
				}

				if (isset($_POST['profit_percent_value'])) {

					if ('' != $_POST['profit_percent_value']) {
						$options['profit_percent_value'] = $_POST['profit_percent_value']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					} else {
						$options['profit_percent_value'] = '';
					}
				}

				if (isset($options['dynamic_profit_margin'])) {
					$dynamic_profit_margin_setting = $options['dynamic_profit_margin'];
				} else {
					$options['dynamic_profit_margin'] = '';
				}
				
				$prft_prcnt_val = 0;
				$prft_dolr_val  = 0;

				if ($options['dynamic_profit_margin'] != 1) {

					if (! empty($options['profit_percent_value'])) {
						$prft_prcnt_val = $options['profit_percent_value'];
					}

					if (! empty($options['profit_doller_value'])) {
						$prft_dolr_val = $options['profit_doller_value'];
					}

				} elseif (! empty(@$options['profit_margin_hidden_textarea'])) {

					$textAreaValue = trim( isset($options['profit_margin_hidden_textarea']) ? $options['profit_margin_hidden_textarea'] : '' );
					$allElements = explode('~', $textAreaValue);
					$isval = false;
					foreach ($allElements as $row) {

						$allTds = explode('_', $row);

						if ('null' != $allTds[0] && 'null' != $allTds[1] && 'null' != $allTds[2] && 'null' != $allTds[3] && 100 >= $allTds[0] && 100 <= $allTds[1]) {
							$isval = true;
							$prft_prcnt_val = $allTds[2];
							$prft_dolr_val = $allTds[3];
							break;
						} else {
							$prft_prcnt_val = 0;
							$prft_dolr_val = 0;
						}
					}
				}

				if (isset($options['fee_percent_value'])) {
					$fee_percent_value = $options['fee_percent_value'];
				} else {
					$fee_percent_value = '';
				}

				if (! empty($fee_percent_value) || '' != $fee_percent_value) {
					$fee_prcnt_val = $fee_percent_value;
				} else {
					$fee_prcnt_val = 0;
				}

				if (isset($options['fee_doller_value'])) {
					$fee_doller_value = $options['fee_doller_value'];
				} else {
					$fee_doller_value = '';
				}

				if (! empty($fee_doller_value) || '' != $fee_doller_value) {
					$fee_dolr_val = $fee_doller_value;
				} else {
					$fee_dolr_val = 0;
				}

				$pcnt_profit = $prft_prcnt_val / 100 * 100;

				$all_prft_some = 100 + $pcnt_profit + $prft_dolr_val + $fee_dolr_val;
				$final_some = $all_prft_some / 100 * 100;

				$devide_left = 100 - $fee_prcnt_val;

				$right_calculesn = number_format($final_some * 100 / $devide_left, 2);
				$final_prcnt_fee = number_format( (float) $right_calculesn - $final_some, 2);
			
				/* Part 3 */

				if ($options['dynamic_profit_margin'] == '1') {
					$dynamic_profit_margin_setting = ' checked="checked" ';
				} else {
					$dynamic_profit_margin_setting = ' ';
				}

				/* Related to Price Calculator End */

				if ($csvcheck == '1') {
					$csvInMail = ' checked="checked" ';
				} else {
					$csvInMail = ' ';
				}

				if ($supp_notification == '1') {
					$supp_notification_attr = ' checked="checked" ';
				} else {
					$supp_notification_attr = ' ';
				}

				if ($allow_manual_supplier_notification == '1') {
					$allow_manual_supplier_attr = ' checked="checked" ';
				} else {
					$allow_manual_supplier_attr = ' ';
				}

				if ($full_information == '1') {
					$checkfull = ' checked="checked" ';
					$disabledPdfOptions = '';
				} else {
					$checkfull = ' ';
					$disabledPdfOptions = 'disabled';
				}

				if ($show_logo == '1') {
					$logoshow = ' checked="checked" ';
					$show_logo_option = 'style="display:block"';
				} else {
					$logoshow = ' ';
					$show_logo_option = 'style="display:none"';
				}

				if ($order_date == '1') {
					$date_order = ' checked="checked" ';
				} else {
					$date_order = ' ';
				}

				if ($smtp_check == '1') {
					$check_smtp = ' checked="checked" ';
				} else {
					$check_smtp = ' ';
				}

				if ($std_mail == '1' || $std_mail == '') {
					$std_mail = ' checked="checked" ';
				} else {
					$std_mail = ' ';
				}

				if ($checkout_order_number == '1') {
					$checkout_order_number = ' checked="checked" ';
				} else {
					$checkout_order_number = ' ';
				}

				if ($show_pay_type == '1' || $show_pay_type == '') {
					$show_pay_type = ' checked="checked" ';
				} else {
					$show_pay_type = ' ';
				}

				if ($cnf_mail == '1') {
					$cnf_mail = ' checked="checked" ';
				} else {
					$cnf_mail = ' ';
				}

				if ($cc_mail == '1' || $cc_mail == '') {
					$cc_mail = ' checked="checked" ';
				} else {
					$cc_mail = ' ';
				}

				// hide client_info_Suppliers
				if ($hide_client_info_Suppliers == '1' || $hide_client_info_Suppliers == '') {
					$hide_client_info_Suppliers = ' checked="checked" ';
				} else {
					$hide_client_info_Suppliers = ' ';
				}
				// hide client_info_Suppliers

				// Supplier Email Notifications
				if ($view_order == '1' || $view_order == '') {
					$view_order = ' checked="checked" ';
				} else {
					$view_order = ' ';
				}

				if ($renewal_email == '1' || $renewal_email == '') {
					$renewal_email = ' checked="checked" ';
				} else {
					$renewal_email = ' ';
				}
				// End Supplier Email Notifications

				// hide contact_info_Suppliers
				if ($hide_contact_info_Suppliers == '1' || $hide_contact_info_Suppliers == '') {
					$hide_contact_info_Suppliers = ' checked="checked" ';
				} else {
					$hide_contact_info_Suppliers = ' ';
				}
				// hide contact_info_Suppliers

				// Customer Phone Number to Supplier
				if ($billing_phone == '1' || $billing_phone == '') {
					$billing_phone = ' checked="checked" ';
				} else {
					$billing_phone = ' ';
				}
				// End Customer Phone Number to Supplier

				// store add_shipping_add
				if ($store_add_shipping_add == '1' || $store_add_shipping_add == '') {
					$store_add_shipping_add = ' checked="checked" ';
				} else {
					$store_add_shipping_add = ' ';
				}
				// store add_shipping_add

				if ($hide_shipping_price == '1' || $hide_shipping_price == '') {
					$hide_shipping_price = ' checked="checked" ';
				} else {
					$hide_shipping_price = ' ';
				}

				if ($hide_tax == '1') {
					$hide_tax = ' checked="checked" ';
				} else {
					$hide_tax = ' ';
				}

				if ($total_price == '1') {
					$total_price = ' checked="checked" ';
				} else {
					$total_price = ' ';
				}

				if ($product_price == '1') {
					$price_product = ' checked="checked" ';
					$product_price_option = 'style="display:block"';
				} else {
					$price_product = ' ';
					$product_price_option = 'style="display:hide"';
				}

				if ($shipping == '1') {
					$product_shipping = ' checked="checked" ';
					$show_shipping_information_option = 'style="display:block"';
				} else {
					$product_shipping = ' ';
					$show_shipping_information_option = 'style="display:hide"';
				}

				if ($cost_of_goods == '1' || $cost_of_goods == '') {
					$cost_of_goods = ' checked="checked" ';
				} else {
					$cost_of_goods = ' ';
				}

				if ($show_gst_supplier_email == '1' || $show_gst_supplier_email == '') {
					$show_gst_supplier_email = ' checked="checked" ';
				} else {
					$show_gst_supplier_email = ' ';
				}

				if ($billing_address == '1') {
					$address_billing = ' checked="checked" ';
					$billing_address_option = 'style="display:block"';
				} else {
					$address_billing = ' ';
					$billing_address_option = 'style="display:hide"';
				}

				if ($email_supplier == '1') {
					$supplier_email = ' checked="checked" ';
				} else {
					$supplier_email = ' ';
				}

				if ($hide_suppliername == '1') {
					$suppliername_hide = ' checked="checked" ';
				} else {
					$suppliername_hide = ' ';
				}

				if ($hide_suppliername_on_product_page == '1') {
					$hide_suppliername_on_product_page = ' checked="checked" ';
				} else {
					$hide_suppliername_on_product_page = ' ';
				}

				if ($hideorderdetail_suppliername == '1') {
					$suppliername_hideorderdetail = ' checked="checked" ';
				} else {
					$suppliername_hideorderdetail = ' ';
				}

				if ($shipping_address == '1') {
					$address_shipping = ' checked="checked" ';
					$shipping_address_option = 'style="display:block"';
				} else {
					$address_shipping = ' ';
					$shipping_address_option = 'style="display:hide"';
				}

				if ($product_image == '1') {
					$image_product = ' checked="checked" ';
					$product_image_option = 'style="display:block"';
				} else {
					$image_product = ' ';
					$product_image_option = 'style="display:hide"';
				}

				if ($store_name == '1') {
					$name_store = ' checked="checked" ';
				} else {
					$name_store = ' ';
				}

				if ($store_address == '1') {
					$address_store = ' checked="checked" ';
				} else {
					$address_store = ' ';
				}

				if ($complete_email == '1') {
					$email_complete = ' checked="checked" ';
				} else {
					$email_complete = ' ';
				}

				if ($order_complete_link == '1') {
					$link_complete_order = ' checked="checked" ';
				} else {
					$link_complete_order = ' ';
				}

				if ($type_of_package == '1') {
					$type_of_package = ' checked="checked" ';
					$type_of_package_option = 'style="display:block"';
				} else {
					$type_of_package = ' ';
					$type_of_package_option = 'style="display:hide"';
				}

				if ($customer_note == '1') {
					$customer_note = ' checked="checked" ';
				} else {
					$customer_note = ' ';
				}

				// Aliexpress Settings for checkbox value

				if ($ali_cbe_enable_setting == '1') {
					$ali_cbe_enable_checkbox = ' checked="checked" ';
				} else {
					$ali_cbe_enable_checkbox = ' ';
				}

				if (isset($options['ali_cbe_price_rate_value_name'])) {
					if ($options['ali_cbe_price_rate_value_name'] < 1 || ! is_numeric($options['ali_cbe_price_rate_value_name'])) {
						$options['ali_cbe_price_rate_value_name'] = 0;
					}
				}

				$woocommerce_url = plugins_url() . '/woocommerce/';

				echo '<div class="wc-ds-settings-shell wc-ds-settings-wrap' . ( $wc_ds_first_run ? ' wc-ds-settings-shell--onboarding' : '' ) . '" id="wc-ds-settings-root" data-setup-progress="' . esc_attr( (string) $wc_ds_setup_progress ) . '"' . ( $wc_ds_first_run ? ' data-setup-incomplete="1"' : '' ) . '>';

				require dirname( __FILE__ ) . '/admin/views/settings-nav.php';

				require dirname( __FILE__ ) . '/admin/views/settings-guided-nav.php';

				require dirname( __FILE__ ) . '/admin/views/panel-overview.php';

				echo '<div class="drop-setting-section' . ( 'general_settings' === $wc_ds_active_tab ? ' active' : '' ) . '" id="general_settings">';

					echo '<h3>' . esc_html__('AliExpress Chrome Browser Extension (CBE) Settings', 'woocommerce-dropshipping') . '</h3>';

					echo '<table>
						<tr>
							<td><h4><label for="ali_cbe_enable_name">' . esc_html__('Enable Support for the AliExpress CBE:', 'woocommerce-dropshipping') . '</label></h4></td>
							<td><input name="ali_cbe_enable_name" id="ali_cbe_enable_name" type="checkbox" ' . esc_attr($ali_cbe_enable_checkbox) . ' /></td>
						</tr>
					</table>';
					// @phpstan-ignore-next-line
					if (isset($ali_cbe_enable_setting)) {

						if ($ali_cbe_enable_setting == '1') {

							echo '<table>
									<tr>
										<td><h4>' . esc_html__('Generate AliExpress API Key:', 'woocommerce-dropshipping') . '</h4></td>
										<td>
											<span>
												<button type="button" id="generate_ali_key" class="button-primary">' . esc_html__('Generate AliExpress API Key', 'woocommerce-dropshipping') . '</button>
											</span>
										<td>
									</tr>
								</table>';

							echo '<table>

								<tr id="hide_key">
									<td id="ali_api_key"></td>
								</tr>

							</table>';

							echo '
							<style>
								.setup-guide {
								padding: 20px 10px 20px 5px;
								max-width: 100%;
								box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
								}

								.setup-guide h2 {
								color: #333;
								margin-bottom: 20px;
								}

								.setup-guide ol {
								list-style-type: decimal;
								padding-left: 20px;
								}

								.setup-guide strong {
								color: #0056b3;
								}

								.setup-guide em {
								font-style: italic;
								color: #444;
								}
							</style>							
							<div class="setup-guide">
								<h4>How to Configure the CBE After Generating the Link</h4>
								<ol>
									<li>
										<strong>Generate Your AliExpress API Key:</strong>  
										Generate a new API key for your store.This key is required to authorize and connect your store with AliExpress.
									</li>
									<li>
										<strong>Go to the AliExpress Website:</strong>  
										After generating the key, navigate to the official AliExpress website.
									</li>
									<li>
										<strong>Activate the WooCommerce Dropshipping Extension:</strong>  
										Ensure that the WooCommerce Dropshipping Extension is installed and activated.
									</li>
									<li>
										<strong>Open the Category Page on AliExpress:</strong>  
										Visit any product category page. To connect the extension, click on the “Extensions” option and select <em>WooCommerce Dropshipping Extension</em>.
									</li>
									<li>
										<strong>Configure the Extension:</strong>  
										Click on the "Setup" button in the extension popup. Enter your Store URL and the AliExpress API Key generated using the button above, then save the settings.
									</li>
								</ol>
							</div>';
						}
					}

				echo '</div>';

				echo '<div class="drop-setting-section" id="supplier_email_notifications">';

					echo '<h3>' . esc_html__('Supplier Email Notifications', 'woocommerce-dropshipping') . '</h3>

					<p>' . esc_html__('Supplier Email Notifications', 'woocommerce-dropshipping') . '</p>
					

					<div class="wc-ds-merchant-callout" role="note">
						<p class="wc-ds-merchant-callout__kicker">' . esc_html__( 'How supplier emails work in this plugin', 'woocommerce-dropshipping' ) . '</p>
						<p>' . esc_html__( 'When an order is paid and moves to Processing, the plugin can email each supplier only the lines they fulfil. Those messages are separate from your customer-facing WooCommerce emails.', 'woocommerce-dropshipping' ) . '</p>
						<ul>
							<li>' . esc_html__( 'Packing slip PDFs, CSV files, and most “what to show” options are configured under Packing slips & PDFs. This screen is the message and a few email switches.', 'woocommerce-dropshipping' ) . '</li>
							<li>' . esc_html__( 'If suppliers say they never receive mail, check Email delivery (SMTP) and spam folders before changing wording here.', 'woocommerce-dropshipping' ) . '</li>
						</ul>
					</div>

					<h4 class="wc-ds-settings-group__title wc-ds-subsection-heading">' . esc_html__( 'Message included in supplier order emails', 'woocommerce-dropshipping' ) . '</h4>
					<p class="description">' . esc_html__( 'When an order moves to processing, each supplier can receive an email so they can fulfil their items.', 'woocommerce-dropshipping' ) . ' ' . esc_html__( 'Add an optional note below. It is included in those emails. HTML is allowed.', 'woocommerce-dropshipping' ) . '</p>

					<table>
						<tr>
							<td><label for="email_order_note">' . esc_html__('Email order note:', 'woocommerce-dropshipping') . '</label></td>
							<td><img class="help_tip" data-tip="This note will appear on emails that suppliers will receive with your order notifications and HTML is allowed." src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>

							<td><textarea name="email_order_note" id="email_order_note" cols="90" rows="5" >' . esc_textarea(@$options['email_order_note']) . '</textarea></td>
						</tr>
					</table>';

					echo '<p></p>

					<table>
						<tr>
							<td><label for="view_order">' . esc_html__('Include \'View order\' link in suppliers email:', 'woocommerce-dropshipping') . '</label></td>

							<td><img class="help_tip" data-tip="Check this option to include a link to view the order details in the email sent to suppliers." src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>

							<td><input name="view_order" id="view_order" class="view_order" type="checkbox" ' . esc_attr($view_order) . '  /></td>
						</tr>

					</table>

					<table>
						<tr>
							<td><label for="renewal_email">' . esc_html__('Do not send renewal email to suppliers:', 'woocommerce-dropshipping') . '</label></td>
							<td><img class="help_tip" data-tip="If checked this option will not send subscription renewal email\'s to suppliers." src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>
							<td><input name="renewal_email" id="renewal_email" class="view_order" type="checkbox" ' . esc_attr($renewal_email) . '  /></td>

						</tr>

					</table>';

					echo '<h4 class="wc-ds-settings-group__title wc-ds-subsection-heading--spaced">' . esc_html__( 'CSV File Inventory Update Settings', 'woocommerce-dropshipping' ) . '</h4>
					

					<p class="description">' . esc_html__( 'These options relate to how your store processes data imported from CSV spreadsheet files, if you receive them from your supplier', 'woocommerce-dropshipping' ) . ' ' . esc_html__( 'Used when you import stock levels from a CSV file from a supplier.', 'woocommerce-dropshipping' ) . '</p>

					<table>

						<tr>

							<td><label for="inventory_pad" style="margin-left: -2px;">' . esc_html__( 'Inventory Buffer:', 'woocommerce-dropshipping' ) . '</label></td>

							<td><img class="help_tip" data-tip="Set this to zero if you want to directly use the inventory numbers your supplier gives you, or higher if you want to ensure that they don&apos;t sell out of their products before you make a sale." src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>
							<td><input name="inventory_pad" value="' . esc_attr(@$options['inventory_pad']) . '" size="1" /></td>
						</tr>
					</table>
					' . esc_html__( "If the supplier's stock falls below this number on an imported spreadsheet, the item will be considered out of stock in your store.", 'woocommerce-dropshipping' ) . '';

				echo '</div>';

				echo '<div class="drop-setting-section wc-ds-panel-packing" id="packing_slips">';

				require dirname( __FILE__ ) . '/admin/views/panel-packing-slips.php';

				echo '</div>';

				echo '<div class="drop-setting-section" id="customised_supplier_emails">

					<h3>' . esc_html__( 'Supplier email appearance', 'woocommerce-dropshipping' ) . '</h3>

					<div class="wc-ds-merchant-callout" role="note">
						<p class="wc-ds-merchant-callout__kicker">' . esc_html__( 'Styling only — not packing slip content', 'woocommerce-dropshipping' ) . '</p>
						<p>' . esc_html__( 'Colors and font sizes here change how supplier notification emails look in the inbox. They do not change which products, prices, or addresses appear on the PDF packing slip.', 'woocommerce-dropshipping' ) . ' ' . esc_html__( 'Edit slip layout, attachments, and privacy under Packing slips & PDFs.', 'woocommerce-dropshipping' ) . '</p>
					</div>

					<p class="description">' . esc_html__( 'The Pro add-on unlocks more styling options.', 'woocommerce-dropshipping' ) . ' <a href="https://woocommerce.com/products/pro-add-on-for-woocommerce-dropshipping/">' . esc_html__( 'Learn more', 'woocommerce-dropshipping' ) . '</a></p>

                    <p></p>
                	
					<div style="';
						if (class_exists('WC_DS_Settings_Pro')) {
							echo 'width:50%;';
						} else {
							echo 'width:100%;';
						}
						
						echo 'display:inline-block; ">
                        <table>
                            <tr>
                             	<td>
                             		<div class="packing-slip-sections">
										<h4>' . esc_html__('Packing Slip ', 'woocommerce-dropshipping') . '</h4>
    									<table>
    										<tr>
												<td class="woocommerce-segmented-selection">
													<label for="supplier_email_packing_slip_title_color" >' . esc_html__('Title Color:', 'woocommerce-dropshipping') . '</label>
												</td>
                                				<td>
													<img class="help_tip" data-tip="EX: #000" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16">
												</td>
                                				<td>
													<input name="supplier_email_packing_slip_title_color" class="drop_color" type="text" value="' . esc_attr(@$options['supplier_email_packing_slip_title_color']) . '" size="30" />
												</td>
                                				</td>
                                			</tr>

											<tr>
												<td><label for="supplier_email_packing_slip_title_font_size" >' . esc_html__('Title Font Size:', 'woocommerce-dropshipping') . '</label></td>
												<td><img class="help_tip" data-tip="EX: 24px" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>
												<td><input name="supplier_email_packing_slip_title_font_size" type="text" value="' . esc_attr(@$options['supplier_email_packing_slip_title_font_size']) . '" size="30" /></td>
											</tr>
 										</table>
                            		</div>
                            	</td>
                            </tr>

                            <tr><td colspan="3" height="40"></td></tr>
                        	<tr>
                             	<td>
                             		<div class="packing-slip-sections woocommerce-customer-effort-score__selection">
										<h4>' . esc_html__('Email ', 'woocommerce-dropshipping') . '</h4>
    									
										<table>
					        				<tr>
												
												<td class="woocommerce-segmented-selection"><label for="supplier_email_background_color" >' . esc_html__('Background Color:', 'woocommerce-dropshipping') . '</label></td>
												<td><img class="help_tip" data-tip="EX: #000" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>

												<td><input name="supplier_email_background_color" class="drop_color" type="text" value="' . esc_attr(@$options['supplier_email_background_color']) . '" size="30" /></td>
                            				</tr>

											<tr>
													<td><label for="supplier_email_order_note_font_size"> ' . esc_html__('Order Note Font Size :', 'woocommerce-dropshipping') . '</label></td>
												<td><img class="help_tip" data-tip="EX: 14px" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>
												<td><input name="supplier_email_order_note_font_size" type="text" value="' . esc_attr(@$options['supplier_email_order_note_font_size']) . '" size="30" /></td>
											</tr>
											<tr>
												<td><label for="supplier_email_order_note_font_color">' . esc_html__('Order Note Font Color :', 'woocommerce-dropshipping') . '</label></td>
												<td><img class="help_tip" data-tip="EX: #000" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>
												<td><input name="supplier_email_order_note_font_color" class="drop_color" type="text" value="' . esc_attr(@$options['supplier_email_order_note_font_color']) . '" size="30" /></td>
											</tr>

											<tr>
												<td><label for="supplier_email_footer_message_font_size">' . esc_html__( 'Footer message font size', 'woocommerce-dropshipping' ) . '</label></td>
												<td><img class="help_tip" data-tip="' . esc_attr__( 'Example: 14px', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>
												<td><input name="supplier_email_footer_message_font_size" type="text" value="' . esc_attr(@$options['supplier_email_footer_message_font_size']) . '" size="30" /></td>
											</tr>

											<tr>
												<td><label for="supplier_email_footer_message_font_color">' . esc_html__( 'Footer message font color', 'woocommerce-dropshipping' ) . '</label></td>
												<td><img class="help_tip" data-tip="' . esc_attr__( 'Example: #000000', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>
												<td><input name="supplier_email_footer_message_font_color" class="drop_color" type="text" value="' . esc_attr(@$options['supplier_email_footer_message_font_color']) . '" size="30" /></td>
											</tr>
                        				</table>
                        			</div>
                        		</td>
                        	</tr>

                       		<tr>
                             	<td>
                             		<div class="packing-slip-sections woocommerce-customer-effort-score__selection">
        								<h4>' . esc_html__( 'Email body', 'woocommerce-dropshipping' ) . '</h4>
    							
										<table>
											<tr>
												<td class="woocommerce-segmented-selection"><label for="supplier_email_body_font_size" >' . esc_html__( 'Font size', 'woocommerce-dropshipping' ) . '</label></td>
												<td><img class="help_tip" data-tip="' . esc_attr__( 'Example: 18px', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>
												<td><input name="supplier_email_body_font_size" type="text" value="' . esc_attr(@$options['supplier_email_body_font_size']) . '" size="30" /></td>
											</tr>

											<tr>
												<td><label for="supplier_email_body_font_color" >' . esc_html__( 'Font color', 'woocommerce-dropshipping' ) . '</label></td>
												<td><img class="help_tip" data-tip="' . esc_attr__( 'Example: #000000', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>
												<td><input name="supplier_email_body_font_color" class="drop_color" type="text" value="' . esc_attr(@$options['supplier_email_body_font_color']) . '" size="30" /></td>
											</tr>
                         				</table>
                        			</div>
                        		</td>
                        	</tr>

                        	<tr>
                             	<td>
                             		<div class="packing-slip-sections woocommerce-customer-effort-score__selection">
        								<h4>' . esc_html__( 'Email footer', 'woocommerce-dropshipping' ) . '</h4>
    									
										<table>
											<tr>
												<td class="woocommerce-segmented-selection"><label for="supplier_email_bottom_sub_heading_font_size" >' . esc_html__( 'Subheading font size', 'woocommerce-dropshipping' ) . '</label></td>
												<td><img class="help_tip" data-tip="' . esc_attr__( 'Example: 14px', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>
												<td><input name="supplier_email_bottom_sub_heading_font_size" type="text" value="' . esc_attr(@$options['supplier_email_bottom_sub_heading_font_size']) . '" size="30" /></td>
											</tr>

											<tr>
												<td><label for="supplier_email_bottom_sub_heading_font_color" >' . esc_html__( 'Subheading font color', 'woocommerce-dropshipping' ) . '</label></td>
												<td><img class="help_tip" data-tip="' . esc_attr__( 'Example: #000000', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>
												<td><input name="supplier_email_bottom_sub_heading_font_color" class="drop_color" type="text" value="' . esc_attr(@$options['supplier_email_bottom_sub_heading_font_color']) . '" size="30" /></td>
											</tr>

											<tr>
												<td><label for="supplier_email_bottom_sub_heading_content_font_size" >' . esc_html__( 'Subheading content font size', 'woocommerce-dropshipping' ) . '</label></td>
												<td><img class="help_tip" data-tip="' . esc_attr__( 'Example: 14px', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>
												<td><input name="supplier_email_bottom_sub_heading_content_font_size" type="text" value="' . esc_attr(@$options['supplier_email_bottom_sub_heading_content_font_size']) . '" size="30" /></td>
											</tr>

											<tr>
												<td><label for="supplier_email_bottom_sub_heading_content_color" >' . esc_html__( 'Subheading content color', 'woocommerce-dropshipping' ) . '</label></td>
												<td><img class="help_tip" data-tip="' . esc_attr__( 'Example: #000000', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></td>
												<td><input name="supplier_email_bottom_sub_heading_content_color" class="drop_color" type="text" value="' . esc_attr(@$options['supplier_email_bottom_sub_heading_content_color']) . '" size="30" /></td>
											</tr>
                            			</table>
                        			</div>
                        		</td>
                        	</tr>
                        </table>
                    </div>';
					if (class_exists('WC_DS_Settings_Pro')) {
						$data = '';
						apply_filters('add_extra_supplier_email_dropshipping_pro_settings', $data);
					}
				echo '</div>';

				echo '<div class="drop-setting-section" id="smtp_options">';

					echo '<h3>' . esc_html__( 'Email delivery (SMTP)', 'woocommerce-dropshipping' ) . '</h3>

					<div class="wc-ds-merchant-callout wc-ds-merchant-callout--emphasis" role="note">
						<p class="wc-ds-merchant-callout__kicker">' . esc_html__( 'Use this screen when mail is the problem', 'woocommerce-dropshipping' ) . '</p>
						<p>' . esc_html__( 'Turning on SMTP sends WooCommerce emails (including supplier notifications) through your mail provider instead of the PHP mail function on your server. Use it when messages bounce, never arrive, or always land in spam.', 'woocommerce-dropshipping' ) . '</p>
						<ul>
							<li>' . esc_html__( 'This affects store email in general — not only dropshipping.', 'woocommerce-dropshipping' ) . '</li>
							<li>' . esc_html__( 'You still need correct supplier addresses and you must not disable supplier notifications if you expect them to receive order mail.', 'woocommerce-dropshipping' ) . '</li>
							<li>' . esc_html__( 'Sender details below override WooCommerce’s default “from” name and address when provided.', 'woocommerce-dropshipping' ) . '</li>
						</ul>
					</div>
					
					<table>
						<tr>
							<td><input name="smtp_check" id="smtp_check" type="checkbox" ' . esc_attr($check_smtp) . ' /></td>
							<td><label for="smtp_check">' . esc_html__( 'Send store email through SMTP', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>';

					$from_name_sanitized =  $from_name;
					$from_email_sanitized =  $from_email;


					echo '<h2>' . esc_html__( 'Sender details', 'woocommerce-dropshipping' ) . '</h2>
					
					<p style="margin-top: -10px;">' . esc_html__( 'Leave blank to use WooCommerce defaults.', 'woocommerce-dropshipping' ) . '</p>

					<table class="form-table">
						<tbody>
							<tr valign="top">
								<th scope="row" class="titledesc">
									<label for="from_name">' . esc_html__( 'Sender name', 'woocommerce-dropshipping' ) . ' <img class="help_tip" data-tip="' . esc_attr__( 'Overrides the default WooCommerce sender name.', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></label>
								</th>

								<td class="forminp forminp-text">
									<input name="from_name" id="from_name" type="text" size="30" value="' . esc_attr($from_name_sanitized) . '" class="" placeholder="">
								</td>
							</tr>

							<tr valign="top">
								<th scope="row" class="titledesc">
									<label for="from_email">' . esc_html__( 'Sender email address', 'woocommerce-dropshipping' ) . ' <img class="help_tip" data-tip="' . esc_attr__( 'Overrides the default WooCommerce sender email.', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16"></label>
								</th>

								<td class="forminp forminp-email">
									<input name="from_email" id="from_email" type="email" size="30" value="' . esc_attr($from_email_sanitized) . '" class="" placeholder="" multiple="multiple">
									<input type="hidden" name="show_admin_notice_option" value="0" />
								</td>
							</tr>
						</tbody>
					</table>
				</div>';

				/* Price Calculator Start */

				echo '<div class="drop-setting-section" id="price_calculator_options">';

					echo '<h3>' . esc_html__( 'Pricing and profit', 'woocommerce-dropshipping' ) . '</h3>';

					echo '<div class="wc-ds-merchant-callout" role="note">
						<p class="wc-ds-merchant-callout__kicker">' . esc_html__( 'What this calculator does', 'woocommerce-dropshipping' ) . '</p>
						<p>' . esc_html__( 'The chart below is a planning tool: it shows how fees and profit targets relate to cost and selling price. It does not automatically reprice every product — you still set costs and prices on products or imports.', 'woocommerce-dropshipping' ) . '</p>
						<p>' . esc_html__( 'Inventory rules for CSV imports and stock buffers live under Suppliers & fulfilment, not here.', 'woocommerce-dropshipping' ) . '</p>
					</div>';

					/* Progress Bar */
					$green = 100 - $prft_prcnt_val; // nosemgrep: scanner.php.lang.security.xss.direct-reflected
					$blue = $prft_prcnt_val; // nosemgrep: scanner.php.lang.security.xss.direct-reflected
					$nevy_blue = $prft_dolr_val; // nosemgrep: scanner.php.lang.security.xss.direct-reflected

					echo '<table class="w-ful responsive-table" style="width:80%; margin-top:35px;">'; // nosemgrep: scanner.php.lang.security.xss.direct-reflected
					
						echo '<p></p>
				        <tr>
				            <td>
				                <div class="packing-slip-sections">
				        			<h4>' . esc_html__( 'Pricing calculator', 'woocommerce-dropshipping' ) . '</h4>

				    				<table id="packing_t" style="background: #f8f8f8;width:100%;">
				    					<tbody>
											<tr hidden="hidden">
												<th id="row_cog_price"></th>
												<th id="row_profit_price"></th>
												<th>' . esc_html__( 'Product cost', 'woocommerce-dropshipping' ) . '</th>
												<th>' . esc_html__( 'Product cost', 'woocommerce-dropshipping' ) . '</th>
												<th>' . esc_html__( 'Product cost', 'woocommerce-dropshipping' ) . '</th>
												<th>' . esc_html__( 'Product cost', 'woocommerce-dropshipping' ) . '</th>
												<th>' . esc_html__( 'Product cost', 'woocommerce-dropshipping' ) . '</th>
												<th>' . esc_html__( 'Product cost', 'woocommerce-dropshipping' ) . '</th>
												<th>' . esc_html__( 'Product cost', 'woocommerce-dropshipping' ) . '</th>
												<th>' . esc_html__( 'Product cost', 'woocommerce-dropshipping' ) . '</th>

											</tr>
											<tr>
												<td colspan="3"></td>

												<td colspan="4" id="brek_evn_val" style="border-left: 1px solid #c1c1c1; border-right: 1px solid #c1c1c1;padding-top: 20px; border-bottom: 1px solid #c1c1c1; text-align: center;">
													<p>' . esc_html__( 'Break-even', 'woocommerce-dropshipping' ) . '</p>
												</td>

												<td colspan="3"></td>
											</tr>

											<tr>
												<td id="cog_val" style="text-align: left; position: relative; top: 15px; padding: 0px 0px 0px 10px;" rowspan="2"></td>

												<td colspan="2" id="profit_val" style="text-align: inherit; position: relative; top: 15px;" rowspan="2">
													<p></p>
												</td>
												<td style="border-left: 1px solid #c1c1c1;"> </td>
												
												<td style="padding-top: 15px; text-align: center;">
													<p id="fee_prcnt_val" style="margin-bottom: 0.2rem;">' . esc_html($fee_prcnt_val) . '% fee</p>
												</td>
												
												<td></td>
												
												<td  style="padding-top: 15px;border-right: 1px solid #c1c1c1; text-align: center;">
													<p id="fee_dolr_val" style="margin-bottom: 0.2rem;">$' . esc_html($fee_dolr_val) . ' fee</p>
												</td>
												
												<td></td>
												
												<td style="padding-top: 15px; text-align: center;">
													<p style="margin-bottom: 0.2rem;">' . esc_html__( 'Total price', 'woocommerce-dropshipping' ) . '</p>
												</td>
											<tr>

											<tr>
												<td colspan="2" id="progress_bar_td" style="padding: 0 0 15px 10px;">
													<div class="progress" style="max-width: 100%">
														<div class="progress-bar bg-success progress-bar-animated" id="green_progress" role="progressbar" style="width:' . $green . '%"><span id="cost_of_product">' . esc_html__( 'Product cost', 'woocommerce-dropshipping' ) . '</span> $100</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
															echo '<div class="progress-bar progress-bar-stripped progress-bar-animated" id="blue_progress"  role="progressbar" style="width:' . $blue . '%">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

																if (isset($options['profit_percent_value']) && $options['dynamic_profit_margin'] != '1') {
																	if ($options['profit_percent_value'] > 0 || $options['profit_doller_value'] > 0) {
																		echo '<span id="profir_margin">' . esc_html__( 'Profit margin', 'woocommerce-dropshipping' ) . ' </span>';
																	}
																} elseif (
																		(isset($options['dynamic_profit_margin']) && $options['dynamic_profit_margin'] == '1') &&
																		(isset($options['profit_margin_hidden_textarea']) && $options['profit_margin_hidden_textarea'] !== '') &&
																		(isset($allTds[0], $allTds[1]) && 100 >= $allTds[0] && 100 <= $allTds[1])
																	) {
																	echo '<span id="profir_margin">' . esc_html__( 'Profit margin', 'woocommerce-dropshipping' ) . ' </span>';
																}

																echo $blue . '%'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- nosemgrep: scanner.php.lang.security.xss.direct-reflected
															echo '</div>
													
															<div id="percent_fee_bar" class="progress-bar progress-bar-stripped progress-bar-animated" role="progressbar" style="width: ' . $nevy_blue . '%; background: #007bff80;">$' . $nevy_blue . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
														echo '</div>
													</div>
												</td>

												<td rowspan="2" style="text-align: center;">
													<p style="font-size: 40px;">}</p>
												</td>

												<td style="border-left: 1px solid #c1c1c1; text-align: right;">
													<p style="margin-bottom: 1.5rem;">+</p>
												</td>

												<td style="text-align: center;">
													<p id="final_prcnt_fee" style="margin-bottom: 1.5rem;">$' . esc_html($final_prcnt_fee) . '</p>
												</td>

												<td style="text-align: center;">
													<p style="margin-bottom: 1.5rem;">+</p>
												</td>

												<td style="border-right: 1px solid #c1c1c1; text-align: center;">
													<p id="fee_dolr_val_fix" style="margin-bottom: 1.5rem;">$' . esc_html($fee_dolr_val) . '</p>
												</td>

												<td style="text-align: center;">
													<p style="margin-bottom: 1.5rem;">=</p>
												</td>

												<td style="text-align: center;">
													<p id="right_calculesn" style="margin-bottom: 1.5rem;">$' . esc_html($right_calculesn) . '</p>
												</td>
											</tr>
				    					</tbody>
				    				</table>
				                </div>
				            </td>
				        </tr>
				    </table>';

					echo '<table class="w-ful" style="width:80%; margin-top: 34px;">
				        <p></p>
				        
						<tr>
				            <td>
				                <div class="packing-slip-sections">
				        		
									<h4>' . esc_html__( 'Fees', 'woocommerce-dropshipping' ) . '</h4>

									<table>
										<tr>
											<td>
												<label for="title_fee_percent" >' . esc_html__( 'Percentage fee', 'woocommerce-dropshipping' ) . '</label>
											</td>

											<td>
												<img class="help_tip" data-tip="' . esc_attr__( 'Transaction fee as a percentage.', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16">
											</td>

											<td>
												<input name="fee_percent_value" class="bar_cal" id="fee_percent_value" type="number" value="' . esc_attr(@$options['fee_percent_value']) . '" min="0" step="0.01" style="width:150px;" />
											</td>
										</tr>

										<tr>
											<td>
												<label for="title_fee_doller" >' . esc_html__( 'Fixed fee', 'woocommerce-dropshipping' ) . '</label>
											</td>

											<td>
												<img class="help_tip" data-tip="' . esc_attr__( 'Fixed transaction fee in your currency.', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16">
											</td>

											<td>
												<input name="fee_doller_value" class="bar_cal" id="fee_doller_value" type="number" value="' . esc_attr(@$options['fee_doller_value']) . '" min="0" step="0.01" style="width:150px;" />
											</td>
										</tr>
									</table>
				            	</div>
				            </td>
				        </tr>
				    </table>';

					echo '<table class="w-ful" style="width:80%; margin-top: 34px;">
				        <p></p>
						<tr>
							<td>
								<div class="packing-slip-sections">
									<h4>' . esc_html__( 'Profit margin', 'woocommerce-dropshipping' ) . '</h4>';

									if ($dynamic_profit_margin_setting == ' checked="checked" ') {
										echo '<table>
											<tr>
												<td>
													<label for="title_profit_percent" >' . esc_html__( 'Percentage profit', 'woocommerce-dropshipping' ) . '</label>
												</td>

												<td>
													<img class="help_tip" data-tip="Enter the Profit Percent value here." src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16">
												</td>

												<td>
													<input name="profit_percent_value" id="profit_percent_value" class="bar_cal" type="number" value="' . esc_attr(@$options['profit_percent_value']) . '" min="0" step="0.01" style="width:150px;" disabled/>
												</td>
											</tr>

											<tr>
												<td>
													<label for="title_profit_doller" >' . esc_html__( 'Fixed profit', 'woocommerce-dropshipping' ) . '</label>
												</td>

												<td>
													<img class="help_tip" data-tip="' . esc_attr__( 'Fixed profit amount in your currency.', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16">
												</td>

												<td>
													<input name="profit_doller_value" class="bar_cal" type="number" id="profit_doller_value" value="' . esc_attr(@$options['profit_doller_value']) . '" min="0" step="0.01" style="width:150px;" disabled />
												</td>
											</tr>
										</table>';
									} else {

										echo '<table>
											<tr>
												<td>
													<label for="title_profit_percent" >' . esc_html__( 'Percentage profit', 'woocommerce-dropshipping' ) . '</label>
												</td>

												<td>
													<img class="help_tip" data-tip="Enter the Profit Percent value here." src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16">
												</td>

												<td>
													<input name="profit_percent_value" class="bar_cal" type="number" id="profit_percent_value" value="' . esc_attr(@$options['profit_percent_value']) . '" min="0" step="0.01" style="width:140px;" />
												</td>
											</tr>

											<tr>
												<td>
													<label for="title_profit_doller" >' . esc_html__( 'Fixed profit', 'woocommerce-dropshipping' ) . '</label>
												</td>

												<td>
													<img class="help_tip" data-tip="' . esc_attr__( 'Fixed profit amount in your currency.', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16">
												</td>

												<td>
													<input name="profit_doller_value" class="bar_cal" type="number" id="profit_doller_value" value="' . esc_attr(@$options['profit_doller_value']) . '" min="0" step="0.01" style="width:140px;" />
												</td>
											</tr>

										</table>';
									}

									if ($dynamic_profit_margin_setting == ' checked="checked" ') {
										$dynamic_profit = 'yes';
									} else {
										$dynamic_profit = 'no';
									}

									echo '<table style="margin-top: 10px;">

										<tr valign="top" style="position:relative;">
											<th scope="row" class="titledesc">
												<label for="dynamic_profit_margin">
												' . esc_html__( 'Tiered profit by cost range', 'woocommerce-dropshipping' ) . '
												</label>
											</th>
											<th>
												<img class="help_tip" data-tip="' . esc_attr__( 'Save settings first, then add one or more cost ranges and profit rules.', 'woocommerce-dropshipping' ) . '" src="' . esc_url($woocommerce_url . 'assets/images/help.png') . '" height="16" width="16">
											</th>

											<td  class="forminp forminp-checkbox">
												<fieldset>
													<legend class="screen-reader-text"><span>' . esc_html__( 'Tiered profit by cost range', 'woocommerce-dropshipping' ) . '</span></legend>
													<label for="dynamic_profit_margin" class="opmc-toggle-control">

													<input name="dynamic_profit_margin" id="dynamic_profit_margin" type="checkbox" value="1"'; ?> <?php checked($dynamic_profit, 'yes'); ?> <?php echo '>
													<span class="opmc-control"></span>
													</label>
												</fieldset>
											</td>
										</tr>
									</table>';

									if ($dynamic_profit_margin_setting == ' checked="checked" ') {

										$textAreaValue = trim( isset($options['profit_margin_hidden_textarea']) ? $options['profit_margin_hidden_textarea'] : '' );

										if ($textAreaValue == '') { // i.e. no dynamic profit margin set yet

											echo '<div class="dynamic_profit_margin_section">

												<textarea id="profit_margin_hidden" name="profit_margin_hidden_textarea" hidden="hidden"></textarea>
												
												<table class="form-table" id="tr_clone" style="width:100%;">

													<tbody>
													
														<p class="p_cost_range">' . esc_html__( 'Product cost range', 'woocommerce-dropshipping' ) . '</p>
														
														<tr valign="top" class="mappingBlocks field-close" data-index="1" data-max_rows="5" id="trs_clone">
															<div class="rows">
																<td>
																	<label id="title_dynamic" for="title_from" >' . esc_html__( 'From', 'woocommerce-dropshipping' ) . '</label>

																	<fieldset>
																		<input name="dynamic_from_value[1]" class="dynamic_from_value clone_tds from_val requiredClass" id="dynamic_from_value_1" type="number" data="vfrom" min="0" step="0.01" style="width:100px;" required />
																	</fieldset>
																</td>

																<td>
																	<label id="title_dynamic" for="title_to" >' . esc_html__( 'To', 'woocommerce-dropshipping' ) . '</label>

																	<fieldset>

																		<input name="dynamic_to_value[1]" class="dynamic_to_value clone_tds to_val requiredClass" id="dynamic_to_value_1" type="number" data="vto" min="0" step="0.01" style="width:100px;" required />
																	</fieldset>
																</td>
																<td>
																	<label id="title_dynamic" for="title_profit_percent" >' . esc_html__( 'Percentage profit', 'woocommerce-dropshipping' ) . '</label>

																	<fieldset>

																		<input name="dynamic_profit_percent_value[1]" class="dynamic_profit_percent_value clone_tds requiredClass" id="dynamic_profit_percent_value_1" data="vpercent" type="number" min="0" step="0.01" style="width:100px;" required />
																	</fieldset>
																</td>

																<td>
																	<label id="title_dynamic" for="title_profit_doller" >' . esc_html__( 'Fixed profit', 'woocommerce-dropshipping' ) . '</label>

																	<fieldset>

																		<input name="dynamic_profit_doller_value[1]" class="dynamic_profit_doller_value clone_tds requiredClass" id="dynamic_profit_doller_value_1" data="vfixed" type="number" min="0" step="0.01"  style="width:100px;" required />
																	</fieldset>
																</td>
															</div>
														</tr>

														<tr class="add-rem-bttn" style="line-height: 4;">
															<td class="forminp" >
																<input type="button" class="btn btn-primary" value="' . esc_attr__( 'Remove rule', 'woocommerce-dropshipping' ) . '" id="removeRows" style="width: 120px;padding: 4px 0px;  font-size: 13px; border: 0;"/>
															</td>
															<td colspan="3">
																<input type="button" class="btn btn-primary" value="' . esc_attr__( 'Add rule', 'woocommerce-dropshipping' ) . '" id="addMoreRows" style="width: 120px;padding: 4px 0px;  font-size: 13px; border: 0;"/>
															</td>
														</tr>

													</tbody>
												</table>
												<p id="amount_message" style="display:none">' . esc_html__( 'Adjust the cost range values to add more rules.', 'woocommerce-dropshipping' ) . '</p>
											</div>';

										} else {  // i.e. dynamic profit margin has already been set

											$allElements = explode('~', $textAreaValue);
											$nRows = count($allElements);

											$elementsHtml = '
												<div class="dynamic_profit_margin_section">
													<textarea id="profit_margin_hidden" name="profit_margin_hidden_textarea" hidden="hidden">' . $textAreaValue . '</textarea>
													<table class="form-table" id="tr_clone" style="width:100%;">
														<tbody>
															<p class="p_cost_range">' . esc_html__('Product Cost Range', 'woocommerce-dropshipping') . '</p>';
															$rowCount = 0;
															foreach ($allElements as $row) {
																$rowCount++;

																$elementsHtml .= '
																<tr valign="top" class="mappingBlocks field-close" data-index="1" data-max_rows="5" id="trs_clone">
																	<div class="rows">';

																		$allTds = explode('_', $row);
																		$tdCount = 0;
																		foreach ($allTds as $td) {
																			$tdCount++;
																			switch ($tdCount) {
																				case 1:
																					$elementsHtml .= '
																								<td><label id="title_dynamic" for="title_from" >' . esc_html__( 'From', 'woocommerce-dropshipping' ) . '</label><fieldset><input name="dynamic_from_value[' . $rowCount . ']" class="dynamic_from_value clone_tds from_val requiredClass" id="dynamic_from_value_' . $rowCount . '" type="number" data="vfrom" min="0" step="0.01" style="width:100px;" value="' . $td . '" required /></fieldset></td>
																							';
																					break;
																				case 2:
																					$elementsHtml .= '
																								<td><label id="title_dynamic" for="title_to" >' . esc_html__( 'To', 'woocommerce-dropshipping' ) . '</label>
																								<fieldset><input name="dynamic_to_value[' . $rowCount . ']" class="dynamic_to_value clone_tds to_val requiredClass" id="dynamic_to_value_' . $rowCount . '" type="number" data="vto" min="0" step="0.01" style="width:100px;" value="' . $td . '" required /></fieldset></td>
																							';
																					break;
																				case 3:
																					$elementsHtml .= '
																								<td><label id="title_dynamic" for="title_profit_percent" >' . esc_html__( 'Percentage profit', 'woocommerce-dropshipping' ) . '</label>
																								<fieldset><input name="dynamic_profit_percent_value[' . $rowCount . ']" class="dynamic_profit_percent_value clone_tds requiredClass" id="dynamic_profit_percent_value_' . $rowCount . '" type="number" data="vpercent" min="0" step="0.01" style="width:100px;" value="' . $td . '" required /></fieldset></td>
																							';
																					break;
																				case 4:
																					$elementsHtml .= '
																								<td><label id="title_dynamic" for="title_profit_doller" >' . esc_html__( 'Fixed profit', 'woocommerce-dropshipping' ) . '</label>
																								<fieldset><input name="dynamic_profit_doller_value[' . $rowCount . ']" class="dynamic_profit_doller_value clone_tds requiredClass" id="dynamic_profit_doller_value_' . $rowCount . '" type="number" min="0" step="0.01" data="vfixed" style="width:100px;" value="' . $td . '" required /></fieldset></td>
																							';
																					break;
																			} // switch($tdCount)

																		} // foreach($allTds as $td)

																		$elementsHtml .= '
																	</div>
																</tr>';
															} // foreach($allElements as $row)

															$elementsHtml .= '
															<tr class="add-rem-bttn" style="line-height: 4;">
																<td class="forminp" >
																	<input type="button" class="btn btn-primary" value="' . esc_attr__( 'Remove rule', 'woocommerce-dropshipping' ) . '" id="removeRows" style="width: 120px;padding: 4px 0px; font-size: 13px; border: 0;" />
																</td>
																<td colspan="3">
																	<input type="button" class="btn btn-primary" value="' . esc_attr__( 'Add rule', 'woocommerce-dropshipping' ) . '" id="addMoreRows" style="width: 120px;padding: 4px 0px; font-size: 13px; border: 0;" />
																</td>
															</tr>
														</tbody>
													</table>
													
													<p id="amount_message" style="display:none">' . esc_html__( 'Adjust the cost range values to add more rules.', 'woocommerce-dropshipping' ) . '</p>
												</div>';
											echo $elementsHtml; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
										} // else of if($textAreaValue == "")
									} 
								echo '</div>	
							</td>
						</tr>				            
				    </table>
				</div>';
				/* Price Calculator End */

				require dirname( __FILE__ ) . '/admin/views/settings-save-bar.php';

				echo '</div><!-- .wc-ds-settings-shell -->';

				echo '<div class="slidesection_bkp">

				<p></p>';

				return apply_filters('woocommerce_get_settings_' . $this->id, array(), $current_section);
			}

			/**			 
			 * Output the settings
			 */
			public function output()
			{

				global $current_section;

				$settings = $this->get_dropshipping_settings($current_section);

				WC_Admin_Settings::output_fields($settings);
			}
		}

		$settings[] = new WC_DS_Settings();

		return $settings;
	}

	add_filter('woocommerce_get_settings_pages', 'wc_ds_add_settings', 15);

endif;
