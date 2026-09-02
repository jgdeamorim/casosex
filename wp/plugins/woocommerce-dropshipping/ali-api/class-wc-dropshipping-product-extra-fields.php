<?php

class WC_Dropshipping_Product_Extra_Fields {

	public function __construct() {

		add_action('woocommerce_after_shop_loop_item', array($this, 'Show_Suppliername_On_Product_Page'), 9);
		add_action('woocommerce_single_product_summary', array($this, 'Show_Suppliername_On_Product_Page'), 21);

		// For custom extra Amazon Affiliate fields.

		add_action('woocommerce_product_options_general_product_data', array($this, 'Woocommerce_Product_Custom_Fields_Amazon_Affiliate_ID'), 10);
		add_action('woocommerce_process_product_meta', array($this, 'Woocommerce_Product_Custom_Fields_Amazon_Affiliate_ID_Save'), 10);
		add_action('woocommerce_product_options_general_product_data', array($this, 'Woocommerce_Product_Custom_Fields_Amazon_Product_ID'), 10);
		add_action('woocommerce_process_product_meta', array($this, 'Woocommerce_Product_Custom_Fields_Amazon_Product_ID_Save'), 10);

		// For custom extra inventory fields.
		add_action('woocommerce_product_options_inventory_product_data', array($this, 'woocommerce_product_extra_fields'));
		add_action('woocommerce_process_product_meta', array($this, 'save_woocommerce_product_extra_fields'));

		// For custom supplier tab and its fields.
		add_filter('woocommerce_product_data_tabs', array($this, 'my_custom_supplier_tab'));
		add_action('woocommerce_product_data_panels', array($this, 'supplier_tab_panel'));
		add_action('woocommerce_process_product_meta', array($this, 'save_supplier_field'));

		// The code for displaying WooCommerce Product Custom Fields
		add_action('woocommerce_product_options_general_product_data', array($this, 'woocommerce_product_custom_fields'));
		add_action('woocommerce_process_product_meta', array($this, 'woocommerce_product_custom_fields_save'));
		add_action('woocommerce_variation_options_pricing', array($this, 'bbloomer_add_custom_field_to_variations'), 10, 3);
		add_action('woocommerce_save_product_variation', array($this, 'bbloomer_save_custom_field_variations'), 10, 2);
		add_filter('woocommerce_available_variation', array($this, 'bbloomer_add_custom_field_variation_data'));

		// For Description custom fields
		add_action('woocommerce_variation_options_pricing', array($this, 'bbloomer_add_custom_field_description_to_variations'), 10, 3);
		add_action('woocommerce_save_product_variation', array($this, 'bbloomer_save_custom_field_description_variations'), 10, 2);
		add_filter('woocommerce_available_variation', array($this, 'bbloomer_add_custom_field_description_variation_data'));
		add_action('woocommerce_product_options_general_product_data', array($this, 'woocommerce_product_custom_fields_description'));
		add_action('woocommerce_process_product_meta', array($this, 'woocommerce_product_custom_fields_description_save'));

		// Hide External Products Only Prices
		add_filter('woocommerce_variable_sale_price_html', array($this, 'woocommerce_remove_prices'), 10, 2);
		add_filter('woocommerce_variable_price_html', array($this, 'woocommerce_remove_prices'), 10, 2);
		add_filter('woocommerce_get_price_html', array($this, 'woocommerce_remove_prices'), 10, 2);
		
	}

	/**
	 * Show supplier name on product page.
	 * 
	 */
	function Show_Suppliername_On_Product_Page() {

		global $product;
		$options = get_option('wc_dropship_manager');

		if (isset($options['hide_suppliername_on_product_page'])) {
			$hide_suppliername_on_product_page = $options['hide_suppliername_on_product_page'];
		} else {
			$hide_suppliername_on_product_page = '';
		}

		if ($hide_suppliername_on_product_page == '1') {
			$products_id = $product->get_id();
			$s_name = get_post_meta($products_id, 'supplier', true);
			if (! empty($s_name)) {
				echo '<p id="supplier_product_page"> ' . esc_html__('Supplier:', 'woocommerce-dropshipping') . ' ' . esc_html($s_name) . '</p>' . PHP_EOL;
			}
		}
	}

	/**
	 * Adding a Field for Amazon_Product_ID
	 * 	
	 */
	function woocommerce_remove_prices($price, $product) {

		if ($product->is_type('external')) {
			if ($product->get_price() == 0) {
				$price = '';
			}
		}

		return $price;
	}

	/**
	 * Adding a Field for Amazon_Product_ID
	 * 
	 * */
	function Woocommerce_Product_Custom_Fields_Amazon_Product_ID() {

		global $woocommerce, $post; ?>

		<script>
			jQuery("#_product_url").keyup(function() {
				var Text = jQuery(this).val();
				var creativeASIN = Text.split("/");
				jQuery("#product_custom_field_amazon_product_id").val(creativeASIN[5]);
			});
		</script>

		<?php
		echo '<div class="product_custom_field_amazon_product_id">';
			woocommerce_wp_text_input(
				array(
					'id' => 'product_custom_field_amazon_product_id',
					'label' => __('Amazon Product ID', 'woocommerce'),					
				)
			);
		echo '</div>';
	}

	function Woocommerce_Product_Custom_Fields_Amazon_Product_ID_Save($post_id) {
		// Custom Product Text Field
		$woocommerce_product_custom_field_amazon_product_id = $_POST['product_custom_field_amazon_product_id']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		if (isset($woocommerce_product_custom_field_amazon_product_id)) {
			update_post_meta($post_id, 'product_custom_field_amazon_product_id', esc_attr($woocommerce_product_custom_field_amazon_product_id));
		}
	}

	/**
	 * Adding a Field for Amazon_Affiliate_ID
	 * 
	 */
	function Woocommerce_Product_Custom_Fields_Amazon_Affiliate_ID() {

		global $woocommerce, $post; ?>

		<script>
			jQuery('#product-type').on('change', function() {
				jQuery('.product_custom_field_amazon_affiliate_id').hide();
				jQuery('.product_custom_field_amazon_product_id').hide();
				var val = jQuery(this).val()
				if (val == 'external') {
					jQuery('.product_custom_field_amazon_affiliate_id').show();
					jQuery('.product_custom_field_amazon_product_id').show();
				}
			});

			jQuery("#_product_url").keyup(function() {
				var Text = jQuery(this).val();
				var creativeASIN = Text.split("&");
				var value = creativeASIN[5].split("tag=");
				jQuery("#product_custom_field_amazon_affiliate_id").val(value[1]);
			});
		</script>

	<?php
		echo '<div class=" product_custom_field_amazon_affiliate_id ">';
			woocommerce_wp_text_input(
				array(
					'id' => 'product_custom_field_amazon_affiliate_id',
					'label' => __('Amazon Affiliate ID', 'woocommerce'),				
				)
			);
		echo '</div>';
	}

	function Woocommerce_Product_Custom_Fields_Amazon_Affiliate_ID_Save($post_id) {
		// Custom Product Text Field
		$woocommerce_product_custom_field_amazon_affiliate_id = $_POST['product_custom_field_amazon_affiliate_id']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		if (isset($woocommerce_product_custom_field_amazon_affiliate_id)) {
			update_post_meta($post_id, 'product_custom_field_amazon_affiliate_id', esc_attr($woocommerce_product_custom_field_amazon_affiliate_id));
		}
	}

	/**
	 * Adding a Cost of goods
	 * 
	 */
	function bbloomer_add_custom_field_to_variations($loop, $variation_data, $variation) {

		woocommerce_wp_text_input(
			array(
				'id' => 'custom_field[' . $loop . ']',
				'class' => 'short',
				'label' => __('Cost of goods', 'woocommerce') . ' (' . get_woocommerce_currency_symbol() . ')',
				'value' => get_post_meta($variation->ID, 'custom_field', true),
			)
		);
	}

	function bbloomer_save_custom_field_variations($variation_id, $i) {

		$custom_field = $_POST['custom_field'][$i]; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		if (isset($custom_field)) {
			update_post_meta($variation_id, 'custom_field', esc_attr($custom_field));
		}
	}

	function bbloomer_add_custom_field_variation_data($variations) {
		$variations['custom_field'] = '<div class="woocommerce_custom_field">Custom Field: <span>' . get_post_meta($variations['variation_id'], 'custom_field', true) . '</span></div>';
		return $variations;
	}

	function woocommerce_product_custom_fields() {

		global $woocommerce, $post;

		echo '<div class=" product_custom_field ">';

		woocommerce_wp_text_input(
			array(
				'id' => '_cost_of_goods',
				'label' => __('Cost of goods', 'woocommerce') . ' (' . get_woocommerce_currency_symbol() . ')',
				'desc_tip' => 'true',
				'description' => __('Cost of goods value included in the supplier email', 'woocommerce'),
			)
		);

		echo '</div>';
	}

	function woocommerce_product_custom_fields_save($post_id) {
		// Custom Product Text Field
		$woocommerce_custom_product_text_field = $_POST['_cost_of_goods']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		if (isset($woocommerce_custom_product_text_field)) {
			update_post_meta($post_id, '_cost_of_goods', esc_attr($woocommerce_custom_product_text_field));
		}
	}

	/**
	 * Adding a custom number_of_orders
	 *
	 */
	public function woocommerce_product_extra_fields() {

		$args = array(
			'id' => 'number_of_orders',
			'label' => __('AliExpress Orders', 'order_placed'),
			'description' => __('AliExpress Orders placed.'),
		);

		woocommerce_wp_text_input($args);
	}

	public function save_woocommerce_product_extra_fields($post_id) {
		$custom_fields_woocommerce_title = isset($_POST['number_of_orders']) ? $_POST['number_of_orders'] : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$product = wc_get_product($post_id);
		update_post_meta($post_id, 'number_of_orders', $custom_fields_woocommerce_title);
	}

	/**
	 * Adding a custom Supplier tab
	 * 
	 */
	public function my_custom_supplier_tab($tabs) {

		$tabs['supplier_tab'] = array(
			'label' => __('AliExpress Supplier', 'woocommerce'),
			'target' => 'the_supplier_custom_panel',
			'class' => array(),
		);

		return $tabs;
	}

	public function supplier_tab_panel() { ?>

		<div id="the_supplier_custom_panel" class="panel woocommerce_options_panel hidden">
			<div class="options_group">
				<?php				
				$productUrl = array(
					'id' => 'ali_product_url',
					'label' => __('Product URL', 'woocommerce'),
					'description' => __('Enter URL to AliExpress Product'),
				);

				$storeName = array(
					'id' => 'ali_store_name',
					'label' => __('Store Name', 'woocommerce'),
					'description' => __('AliExpress Supplier Store Name'),
					'desc_tip' => 'true',
					'custom_attributes' => array(
						'readonly' => 'readonly',
					),
				);

				$storeUrl = array(
					'id' => 'ali_store_url',
					'label' => __('Store URL', 'woocommerce'),
					'description' => __('AliExpress Supplier Store URL'),
					'desc_tip' => 'true',
					'custom_attributes' => array(
						'readonly' => 'readonly',
					),
				);

				$price_range = array(
					'id' => 'ali_store_price_range',
					'label' => __('Store Price Range'),
					'description' => __('AliExpress Supplier Store Price Range'),
					'desc_tip' => 'true',
					'custom_attributes' => array(
						'readonly' => 'readonly',
					),
				);

				$currency = array(
					'id' => 'ali_currency',
					'label' => __('Currency'),					
				);
				
				woocommerce_wp_text_input($productUrl);
				woocommerce_wp_text_input($storeName);
				woocommerce_wp_text_input($storeUrl);
				woocommerce_wp_text_input($price_range);
				woocommerce_wp_text_input($currency);
				?>

			</div>
		</div>
	<?php
	}

	public function save_supplier_field($post_id) {
		
		$ali_product_url = isset($_POST['ali_product_url']) ? $_POST['ali_product_url'] : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$ali_store_url = isset($_POST['ali_store_url']) ? $_POST['ali_store_url'] : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$ali_store_name = isset($_POST['ali_store_name']) ? $_POST['ali_store_name'] : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$ali_store_price_range = isset($_POST['ali_store_price_range']) ? $_POST['ali_store_price_range'] : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$ali_currency = isset($_POST['ali_currency']) ? $_POST['ali_currency'] : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		$product = wc_get_product($post_id);

		update_post_meta($post_id, 'ali_product_url', $ali_product_url);
		update_post_meta($post_id, 'ali_store_url', $ali_store_url);
		update_post_meta($post_id, 'ali_store_name', $ali_store_name);
		update_post_meta($post_id, 'ali_store_price_range', $ali_store_price_range);
		update_post_meta($post_id, 'ali_currency', $ali_currency);
	}

	/**
	 * Adding a Fields for Description - Type of Package
	 * 
	 */
	function bbloomer_add_custom_field_description_to_variations($loop, $variation_data, $variation) {

		woocommerce_wp_text_input(
			array(
				'id' => 'custom_field_description[' . $loop . ']',
				'class' => 'short',
				'label' => __('Description - Type of Package', 'woocommerce'),
				'value' => get_post_meta($variation->ID, 'custom_field_description', true),
			)
		);
	}

	function bbloomer_save_custom_field_description_variations($variation_id, $i) {

		$custom_field_description = $_POST['custom_field_description'][$i]; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		if (isset($custom_field_description)) {
			update_post_meta($variation_id, 'custom_field_description', esc_attr($custom_field_description));
		}
	}

	function bbloomer_add_custom_field_description_variation_data($variations) {
		$variations['custom_field_description'] = '<div class="woocommerce_custom_field_description">Custom Field: <span>' . get_post_meta($variations['variation_id'], 'custom_field_description', true) . '</span></div>';
		return $variations;
	}

	function woocommerce_product_custom_fields_description() {

		global $woocommerce, $post;

		echo '<div class=" product_custom_field_description ">';

			woocommerce_wp_text_input(
				array(
					'id' => '_custom_product_text_field_description',
					'label' => __('Description - Type of Package', 'woocommerce'),
					'desc_tip' => 'true',
					'description' => __('Description - Type of Package value included in the supplier email', 'woocommerce'),				
				)
			);

		echo '</div>';
	}

	function woocommerce_product_custom_fields_description_save($post_id) {

		// Custom Product Text Field
		$woocommerce_custom_product_text_field = $_POST['_custom_product_text_field_description']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		if (isset($woocommerce_custom_product_text_field)) {
			update_post_meta($post_id, '_custom_product_text_field_description', esc_attr($woocommerce_custom_product_text_field));
		}
	}
}

/* Related to Price Calculator */

add_action('woocommerce_variation_options_pricing', 'bbloomer_add_custom_field_to_variations', 10, 3);

function bbloomer_add_custom_field_to_variations($loop, $variation_data, $variation) {

	$regular_price = isset($variation_data['variable_regular_price'][0]) ? $variation_data['variable_regular_price'][0] : 0;
	$sale_price = isset($variation_data['_sale_price'][0]) ? $variation_data['_sale_price'][0] : 0;

	$price = '';

	if (! empty($sale_price)) {
		$price = $sale_price;
	} else {
		$price = $regular_price;
	}

	$costofproduct = isset($variation_data['custom_field']) ? $variation_data['custom_field'][0] : 0;
	$costofproduct = floatval($costofproduct);

	$options = get_option('wc_dropship_manager');
	$prft_prcnt_val = 0;
	$prft_dolr_val = 0;
	$fee_prcnt_val = 0;
	$fee_dolr_val = 0;
	if (! empty($options['fee_percent_value'])) {
		$fee_prcnt_val = $options['fee_percent_value'];
	}

	if (! empty($options['fee_doller_value'])) {
		$fee_dolr_val = $options['fee_doller_value'];
	}

	if ( ! isset( $options['dynamic_profit_margin'] ) || $options['dynamic_profit_margin'] != 1 ) {

		if (! empty($options['profit_percent_value'])) {
			$prft_prcnt_val = $options['profit_percent_value'];
		}

		if (! empty($options['profit_doller_value'])) {
			$prft_dolr_val = $options['profit_doller_value'];
		}

	} elseif (! empty(@$options['profit_margin_hidden_textarea'])) {

		$textAreaValue = trim(@$options['profit_margin_hidden_textarea']);
		$allElements = explode('~', $textAreaValue);

		foreach ($allElements as $row) {

			$allTds = explode('_', $row);
			if ('null' != $allTds[0] && 'null' != $allTds[1] && 'null' != $allTds[2] && 'null' != $allTds[3] && $costofproduct >= $allTds[0] && $costofproduct <= $allTds[1]) {
				$prft_prcnt_val = $allTds[2];
				$prft_dolr_val = $allTds[3];
				break;
			}
		}
	}

	$prft_prcnt_val = floatval($prft_prcnt_val); // Convert to float if it's a string
	$profit_prcnt = 0;

	if (is_numeric($prft_prcnt_val) && is_numeric($costofproduct)) {
		$profit_prcnt = $prft_prcnt_val / 100 * $costofproduct;
	}

	$all_prft_some = $costofproduct + $profit_prcnt + $prft_dolr_val + $fee_dolr_val;
	$final_some = $all_prft_some / 100 * 100;

	$devide_left = 100 - $fee_prcnt_val;

	$right_calculesn = number_format($final_some * 100 / $devide_left, 2);
	$final_prcnt_fee = number_format( (float) $right_calculesn - $final_some, 2);
	$break_even_value = $final_prcnt_fee + $fee_dolr_val;

	if (! empty($costofproduct) && ! empty($price) && ($costofproduct != $price)) {
		$estimated_profit = $price - $costofproduct - $break_even_value;
	} else {
		$estimated_profit = 0;
	}

	woocommerce_wp_text_input(
		array(
			'id' => 'estmt_profit[' . $loop . ']',
			'class' => 'estmt_profit_variable',
			'custom_attributes' => array(
				'hidden' => 'hidden',
			),
			'label' => __('Estimated Profit : ' . wc_price($estimated_profit), 'woocommerce'),
			'value' => get_post_meta($variation->ID, 'estmt_profit', true),
		)
	);
}

add_action('woocommerce_product_options_general_product_data', 'echo_product_id_sku_general_tab');
function echo_product_id_sku_general_tab() {
	global $product_object;

	if ( ! $product_object instanceof WC_Product || ! $product_object->is_type( 'variable' ) ) {
		return;
	}

		$count = 1;
		$range_price = array();

		foreach ($product_object->get_children() as $variation_id) {
			$variation = wc_get_product($variation_id);

			$price = $variation->get_price();
			$costofproduct = get_post_meta($variation_id, 'custom_field', true);

			$options = get_option('wc_dropship_manager');
			$prft_prcnt_val = 0;
			$prft_dolr_val = 0;
			$fee_prcnt_val = 0;
			$fee_dolr_val = 0;

			if (! empty($options['fee_percent_value'])) {
				$fee_prcnt_val = $options['fee_percent_value'];
			}

			if (! empty($options['fee_doller_value'])) {
				$fee_dolr_val = $options['fee_doller_value'];
			}

			if ( ! isset( $options['dynamic_profit_margin'] ) || $options['dynamic_profit_margin'] != 1 ) {

				if (! empty($options['profit_percent_value'])) {
					$prft_prcnt_val = $options['profit_percent_value'];
				}

				if (! empty($options['profit_doller_value'])) {
					$prft_dolr_val = $options['profit_doller_value'];
				}
			} elseif (! empty(@$options['profit_margin_hidden_textarea'])) {

				$textAreaValue = trim(@$options['profit_margin_hidden_textarea']);
				$allElements = explode('~', $textAreaValue);

				foreach ($allElements as $row) {

					$allTds = explode('_', $row);

					if ('null' != $allTds[0] && 'null' != $allTds[1] && 'null' != $allTds[2] && 'null' != $allTds[3] && $costofproduct >= $allTds[0] && $costofproduct <= $allTds[1]) {
						$prft_prcnt_val = $allTds[2];
						$prft_dolr_val = $allTds[3];
						break;
					}
				}
			}

			$prft_prcnt_val = floatval($prft_prcnt_val); // Convert to float if it's a string
			$costofproduct = floatval($costofproduct);

			// $profit_prcnt = $prft_prcnt_val / 100 * $costofproduct;
			$profit_prcnt = 0;
			if (is_numeric($prft_prcnt_val) && is_numeric($costofproduct)) {
				$profit_prcnt = $prft_prcnt_val / 100 * $costofproduct;
			}

			$all_prft_some = $costofproduct + $profit_prcnt + $prft_dolr_val + $fee_dolr_val;
			$final_some = $all_prft_some / 100 * 100;

			$devide_left = 100 - $fee_prcnt_val;

			$right_calculesn = number_format($final_some * 100 / $devide_left, 2);
			$final_prcnt_fee = number_format( (float) $right_calculesn - $final_some, 2);
			$break_even_value = $final_prcnt_fee + $fee_dolr_val;

			if (! empty($costofproduct) && ! empty($price) && ($costofproduct != $price)) {
				$estimated_profit = (float) $price - (float) $costofproduct - (float) $break_even_value;
			} else {
				$estimated_profit = 0;
			}

			$range_price[] = $estimated_profit;
			$count++;
		}

		if (is_array($range_price) && ! empty($range_price)) {
			$min = min($range_price);
		} else {
			$min = 0;
		}

		if (is_array($range_price) && ! empty($range_price)) {
			$max = min($range_price);
		} else {
			$max = 0;
		}

		echo '<p class="form-field">
			<label>' . esc_html__('Estimated Profit:', 'woocommerce-dropshipping') . '</label>
			<span class="description">' . wp_kses_post(wc_price($min)) . ' - ' . wp_kses_post(wc_price($max)) . '</span>
		</p>';
}

add_action('woocommerce_product_options_general_product_data', 'woo_product_custom_fields_for_profitcal');

function woo_product_custom_fields_for_profitcal() {

	global $woocommerce, $post;
	if ( ! $post || ! isset( $post->ID ) ) {
		return;
	}
	$variation = wc_get_product( (int) $post->ID );
	if ( ! $variation instanceof WC_Product ) {
		return;
	}

	if ('variable' != $variation->get_type()) {

		$price = $variation->get_price();

		$costofproduct = get_post_meta($post->ID, '_cost_of_goods', true);

		$options = get_option('wc_dropship_manager');

		$prft_prcnt_val = 0;
		$prft_dolr_val = 0;
		$fee_prcnt_val = 0;
		$fee_dolr_val = 0;

		if (! empty($options['fee_percent_value'])) {
			$fee_prcnt_val = $options['fee_percent_value'];
		}

		if (! empty($options['fee_doller_value'])) {
			$fee_dolr_val = $options['fee_doller_value'];
		}

		if (isset($options['dynamic_profit_margin']) && $options['dynamic_profit_margin'] != 1) {

			if (! empty($options['profit_percent_value'])) {
				$prft_prcnt_val = $options['profit_percent_value'];
			}

			if (! empty($options['profit_doller_value'])) {
				$prft_dolr_val = $options['profit_doller_value'];
			}

		} elseif (! empty(@$options['profit_margin_hidden_textarea'])) {

			$textAreaValue = trim(@$options['profit_margin_hidden_textarea']);
			$allElements = explode('~', $textAreaValue);

			foreach ($allElements as $row) {

				$allTds = explode('_', $row);

				if ('null' != $allTds[0] && 'null' != $allTds[1] && 'null' != $allTds[2] && 'null' != $allTds[3] && $costofproduct >= $allTds[0] && $costofproduct <= $allTds[1]) {
					$prft_prcnt_val = $allTds[2];
					$prft_dolr_val = $allTds[3];
					break;
				}
			}
		}

		$prft_prcnt_val = floatval($prft_prcnt_val); // Convert to float if it's a string
		$costofproduct = floatval($costofproduct);

		$profit_prcnt = 0;
		if (is_numeric($prft_prcnt_val) && is_numeric($costofproduct)) {
			$profit_prcnt = $prft_prcnt_val / 100 * $costofproduct;
		}

		$all_prft_some = $costofproduct + $profit_prcnt + $prft_dolr_val + $fee_dolr_val;
		$final_some = $all_prft_some / 100 * 100;

		$devide_left = 100 - $fee_prcnt_val;

		$right_calculesn = number_format($final_some * 100 / $devide_left, 2);
		$final_prcnt_fee = number_format( (float) $right_calculesn - $final_some, 2);

		$break_even_value = $final_prcnt_fee + $fee_dolr_val;

		if (! empty($costofproduct) && ! empty($price) && ($costofproduct != $price)) {
			$estimated_profit = (float) $price - (float) $costofproduct - (float) $break_even_value;
		} else {
			$estimated_profit = 0;
		}

		$estimated_profit = is_numeric( $estimated_profit ) ? (float) $estimated_profit : 0;
		
		echo '<p class="form-field">
			<label>' . esc_html__('Estimated Profit:', 'woocommerce-dropshipping') . '</label>
			<span class="description">' . wp_kses_post(wc_price( esc_html($estimated_profit) ) ) . '</span>
		</p>';
	}
}

/*
add_filter('manage_edit-product_columns', 'bbloomer_admin_products_visibility_column', 9999);

function bbloomer_admin_products_visibility_column($columns) {
	$columns['est_profit'] = 'Estimated Profit';
	return $columns;
}

add_filter('manage_edit-product_columns', 'est_profit_column_place', 20);
function est_profit_column_place($columns_array) {

	// I want to display Brand column just after the product name column
	return array_slice($columns_array, 0, 6, true)
		+ array('est_profit' => 'est_profit')
		+ array_slice($columns_array, 6, null, true);
}
*/

add_action('manage_product_posts_custom_column', 'admin_products_est_profit_column_content', 10, 2);

function admin_products_est_profit_column_content($column, $product_id) {
	if ($column == 'est_profit') {

		global $product;

		if ( $product && $product->get_type() === 'variable' ) {
			$count = 1;
			$range_price = array();
			foreach ($product->get_children() as $variation_id) {
				$variation = wc_get_product($variation_id);
				$costofproduct = get_post_meta($variation_id, 'custom_field', true);
				$price = $variation->get_price();
				$options = get_option('wc_dropship_manager');
				$prft_prcnt_val = 0;
				$prft_dolr_val = 0;
				$fee_prcnt_val = 0;
				$fee_dolr_val = 0;

				if (! empty($options['fee_percent_value'])) {
					$fee_prcnt_val = $options['fee_percent_value'];
				}

				if (! empty($options['fee_doller_value'])) {
					$fee_dolr_val = $options['fee_doller_value'];
				}

				if ( ! isset( $options['dynamic_profit_margin'] ) || $options['dynamic_profit_margin'] != 1 ) {

					if (! empty($options['profit_percent_value'])) {
						$prft_prcnt_val = $options['profit_percent_value'];
					}

					if (! empty($options['profit_doller_value'])) {
						$prft_dolr_val = $options['profit_doller_value'];
					}

				} elseif (! empty(@$options['profit_margin_hidden_textarea'])) {

					$textAreaValue = trim(@$options['profit_margin_hidden_textarea']);
					$allElements = explode('~', $textAreaValue);

					foreach ($allElements as $row) {

						$allTds = explode('_', $row);

						if ('null' != $allTds[0] && 'null' != $allTds[1] && 'null' != $allTds[2] && 'null' != $allTds[3] && $costofproduct >= $allTds[0] && $costofproduct <= $allTds[1]) {
							$prft_prcnt_val = $allTds[2];
							$prft_dolr_val = $allTds[3];
							break;
						}
					}
				}
				
				$prft_prcnt_val = floatval($prft_prcnt_val); // Convert to float if it's a string
				$costofproduct = floatval($costofproduct);				
				$profit_prcnt = 0;

				if (is_numeric($prft_prcnt_val) && is_numeric($costofproduct)) {
					$profit_prcnt = $prft_prcnt_val / 100 * $costofproduct;
				}
				
				$all_prft_some = $costofproduct + $profit_prcnt + $prft_dolr_val + $fee_dolr_val;
				$final_some = $all_prft_some / 100 * 100;

				$devide_left = 100 - $fee_prcnt_val;

				$right_calculesn = number_format($final_some * 100 / $devide_left, 2);
				$final_prcnt_fee = number_format( (float) $right_calculesn - $final_some, 2);
				$break_even_value = $final_prcnt_fee + $fee_dolr_val;

				if (! empty($costofproduct) && ! empty($price) && ($costofproduct != $price)) {
					$estimated_profit = (float) $price - (float) $costofproduct - (float) $break_even_value;
				} else {
					$estimated_profit = 0;
				}

				$range_price[] = $estimated_profit;
				$count++;
			}
		
			if (! empty($range_price)) {
				$min = min($range_price);
			} else {
				$min = 0;
			}

			if (! empty($range_price)) {
				$max = max($range_price);
			} else {
				$max = 0;
			}

			echo wp_kses_post(wc_price($min)) . ' - ' . wp_kses_post(wc_price($max));

		} else {

			$variation = wc_get_product($product_id);
			$price = $variation->get_price();
			$costofproduct = get_post_meta($product_id, '_cost_of_goods', true);
			$options = get_option('wc_dropship_manager');
			$prft_prcnt_val = 0;
			$prft_dolr_val = 0;
			$fee_prcnt_val = 0;
			$fee_dolr_val = 0;

			if (! empty($options['fee_percent_value'])) {
				$fee_prcnt_val = $options['fee_percent_value'];
			}

			if (! empty($options['fee_doller_value'])) {
				$fee_dolr_val = $options['fee_doller_value'];
			}

			$dynamic_profit_margin = '';

			if (isset($options['dynamic_profit_margin'])) {
				$dynamic_profit_margin = $options['dynamic_profit_margin'];
			} else {
				$dynamic_profit_margin = '';
			}

			if (isset($options['dynamic_profit_margin']) && 1 != $options['dynamic_profit_margin']) {

				if (! empty($options['profit_percent_value'])) {
					$prft_prcnt_val = $options['profit_percent_value'];
				}

				if (! empty($options['profit_doller_value'])) {
					$prft_dolr_val = $options['profit_doller_value'];
				}

			} elseif (! empty(@$options['profit_margin_hidden_textarea'])) {

				$textAreaValue = trim(@$options['profit_margin_hidden_textarea']);
				$allElements = explode('~', $textAreaValue);

				foreach ($allElements as $row) {
					$allTds = explode('_', $row);
					if ('null' != $allTds[0] && 'null' != $allTds[1] && 'null' != $allTds[2] && 'null' != $allTds[3] && $costofproduct >= $allTds[0] && $costofproduct <= $allTds[1]) {

						$prft_prcnt_val = $allTds[2];
						$prft_dolr_val = $allTds[3];
						break;
					}
				}
			}
			
			$prft_prcnt_val = floatval($prft_prcnt_val); // Convert to float if it's a string
			$costofproduct = floatval($costofproduct);
			
			$profit_prcnt = 0;
			if (is_numeric($prft_prcnt_val) && is_numeric($costofproduct)) {
				$profit_prcnt = $prft_prcnt_val / 100 * $costofproduct;
			}

			$all_prft_some = $costofproduct + $profit_prcnt + $prft_dolr_val + $fee_dolr_val;
			$final_some = $all_prft_some / 100 * 100;

			$devide_left = 100 - $fee_prcnt_val;

			$right_calculesn = number_format($final_some * 100 / $devide_left, 2);
			$final_prcnt_fee = number_format( (float) $right_calculesn - $final_some, 2);
			$break_even_value = $final_prcnt_fee + $fee_dolr_val;

			if (! empty($costofproduct) && ! empty($price) && ($costofproduct != $price)) {
				$estimated_profit = (float) $price - (float) $costofproduct - (float) $break_even_value;
			} else {
				$estimated_profit = 0;
			}

			//echo wp_kses_post(wc_price($estimated_profit));
			$estimated_profit = is_numeric( $estimated_profit ) ? (float) $estimated_profit : 0;
			echo wp_kses_post( wc_price( esc_html($estimated_profit) ) );
		}
	}
}

add_action('admin_head', 'ds_product_column_width');
function ds_product_column_width() {
	echo '<style type="text/css">';
	echo 'table.wp-list-table .column-est_profit { width: 6%; text-align: left!important;}';
	echo 'table.wp-list-table .column-name {width: 17%;}';
	echo '</style>';
}
/* Related to Price Calculator END */
