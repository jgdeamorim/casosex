<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 *
 * Dropshipping use this function for packing slip
 *
 * @package WC_Dropshipping
 */

use Automattic\WooCommerce\Utilities\OrderUtil;
use Automattic\WooCommerce\Internal\DataStores\Orders\CustomOrdersTableController;

add_action('admin_head', 'wp_my_custom_fonts');

/**
 *
 * Function use for wp_my_custom_fonts
 */

error_reporting();
function wp_my_custom_fonts()
{

	if (is_user_logged_in()) {
		$user = wp_get_current_user();
		$roles = (array) $user->roles;

		if ('dropshipper' == $roles[0]) {
			echo '<style>
               @media (max-width: 680px){
            #adminmenuwrap {
                display: block!important;
                max-width: 56px!important;
                width: 100%!important;
            }

            #wpcontent{
                padding-left: 67px!important;
            }
            .auto-fold #adminmenu {

                max-width: 60px!important;
            }

            .auto-fold #adminmenu .wp-menu-name {
                position: static!important;
                display: none!important;
            }
            #collapse-menu {
                display: block !important;
            }

            }
            </style>';
		}
	}
}

if (! function_exists('supplier_admins_mobile_menu')) {

	/**
	 *
	 * Function use for supplier_admins_mobile_menu
	 */
	function supplier_admins_mobile_menu()
	{
		if (is_user_logged_in()) {
			$user = wp_get_current_user();
			$roles = (array) $user->roles;

			if ('dropshipper' == $roles[0]) {
				wp_enqueue_style('admin-styles', plugins_url('/assets/css/supplier_mobile_menu.css', __FILE__));
			}
		}
	}
	add_action('admin_enqueue_scripts', 'supplier_admins_mobile_menu');
}

if (! function_exists('generate_aliexpress_key')) {

	/**
	 * Returns a persistent per-site secret used for AliExpress REST auth keys.
	 *
	 * @return string
	 */
	function wc_dropshipping_get_aliexpress_auth_secret()
	{
		$option_name = 'wc_dropshipping_aliexpress_auth_secret';
		$secret = get_option($option_name, '');

		if (! is_string($secret) || '' === trim($secret)) {
			$secret = wp_generate_password(64, true, true);
			update_option($option_name, $secret, false);
		}

		return (string) $secret;
	}

	/**
	 *
	 * Function use for generate_aliexpress_key
	 *
	 *  @param string $domain Domain name.
	 */
	function generate_aliexpress_key($domain)
	{
		// Old insecure logic (kept for reference):
		// $passphrase = '107029c9969d644eca7321f9c4df2e6b';
		// $key = md5($domain . $passphrase); 

		$secret = wc_dropshipping_get_aliexpress_auth_secret();
		$domain = strtolower(trim((string) $domain));
		$key = hash_hmac('sha256', $domain, $secret);

		return $key;
	}
} // Generate aliexpress api key and send to the admin mailbox.

if (! function_exists('get_dropship_option')) {

	/**
	 *
	 * Function use for get_dropship_option
	 */
	function get_dropship_option()
	{

		$d_options = get_option('opmc_dropshipping_options');

		if (false !== $d_options && is_array($d_options) && ! empty($d_options)) {

			return $d_options;
		} else {

			return array();
		}
	}
}

if (! function_exists('update_dropship_option')) {

	/**
	 *
	 * Function for update_dropship_option
	 *
	 * @param array $d_options Dropshipping options.
	 */
	function update_dropship_option($d_options)
	{

		if (is_array($d_options)) {

			update_option('opmc_dropshipping_options', $d_options);
		}
	}
}

if (! function_exists('wc_dropshipping_get_dropship_supplier')) {
	/**
	 * 
	 * Function for wc_dropshipping_get_dropship_supplier
	 * 
	 * @param int $id Supplier term ID.
	 * 
	 * @return array
	 */
	function wc_dropshipping_get_dropship_supplier($id = 0)
	{

		$term = get_term(intval($id), 'dropship_supplier');

		$supplier = get_term_meta(intval($id), 'meta', true);

		if (isset($term->term_id)) {

			$supplier['id'] = $term->term_id;

			$supplier['slug'] = $term->slug;

			$supplier['name'] = $term->name;

			$supplier['description'] = $term->description;
		}

		return $supplier;
	}
}

if (! function_exists('wc_dropshipping_get_dropship_supplier_by_product_id')) {

	/**
	 *
	 * Function for wc_dropshipping_get_dropship_supplier_by_product_id
	 *
	 * @param int $product_id Product ID.
     * @return array
	 */
	function wc_dropshipping_get_dropship_supplier_by_product_id($product_id)
	{

		$supplier = array();

		$productdata = get_post_meta($product_id, '_virtual', true);

		if ('yes' != $productdata) {

			$terms = get_the_terms(intval($product_id), 'dropship_supplier');
		}

		if (isset($terms)) {

			if ($terms && ! is_wp_error($terms) && 0 < count($terms)) {

				$supplier = wc_dropshipping_get_dropship_supplier(intval($terms[0]->term_id));
				// load the term. there can only be one supplier notified per product.

			}
		}

		return $supplier;
	}
}

if (! function_exists('wc_dropshipping_get_base_path')) {

	/**
	 *
	 * Function for wc_dropshipping_get_base_path
	 */
	function wc_dropshipping_get_base_path()
	{

		return plugin_dir_path(__FILE__);
	}
}

add_action('wp_ajax_woocommerce_dropshippers_pod_received', 'pod_received_callback');

add_action('wp_ajax_nopriv_woocommerce_dropshippers_pod_received', 'pod_received_callback');

add_action('wp_ajax_woocommerce_dropshippers_mark_as_shipped', 'woocommerce_dropshippers_mark_as_shipped_callback');

add_action('wp_ajax_nopriv_woocommerce_dropshippers_mark_as_shipped', 'woocommerce_dropshippers_mark_as_shipped_callback');

add_action( 'wp_ajax_wc_dropshipping_mail_track', 'wc_dropshipping_mail_track_callback' );
add_action( 'wp_ajax_nopriv_wc_dropshipping_mail_track', 'wc_dropshipping_mail_track_callback' );
add_action( 'init', 'wc_dropshipping_mail_track_maybe_handle', 1 );
add_action( 'template_redirect', 'wc_dropshipping_mail_track_maybe_handle', 0 );

if ( ! function_exists( 'wc_dropshipping_is_open_track_enabled' ) ) {
	/**
	 * Whether supplier email open notifications are enabled.
	 *
	 * @return bool
	 */
	function wc_dropshipping_is_open_track_enabled() {
		$options = get_option( 'wc_dropship_manager', array() );

		return isset( $options['cnf_mail'] ) && in_array( (string) $options['cnf_mail'], array( '1', 'yes', 'true' ), true );
	}
}

if ( ! function_exists( 'wc_dropshipping_get_mail_track_token' ) ) {
	/**
	 * Create a signed token for supplier email open tracking URLs.
	 *
	 * @param int $order_id    Order ID.
	 * @param int $supplier_id Supplier term ID.
	 * @return string
	 */
	function wc_dropshipping_get_mail_track_token( $order_id, $supplier_id ) {
		return hash_hmac( 'sha256', absint( $order_id ) . '|' . absint( $supplier_id ), wp_salt( 'wc_dropshipping_mail_track' ) );
	}
}

if ( ! function_exists( 'wc_dropshipping_verify_mail_track_token' ) ) {
	/**
	 * Verify a supplier email open tracking token.
	 *
	 * @param int    $order_id    Order ID.
	 * @param int    $supplier_id Supplier term ID.
	 * @param string $token       Token from the tracking URL.
	 * @return bool
	 */
	function wc_dropshipping_verify_mail_track_token( $order_id, $supplier_id, $token ) {
		if ( ! is_string( $token ) || '' === $token ) {
			return false;
		}

		if ( ! preg_match( '/^[a-f0-9]{64}$/i', $token ) ) {
			return false;
		}

		$expected = wc_dropshipping_get_mail_track_token( $order_id, $supplier_id );

		return hash_equals( $expected, strtolower( $token ) );
	}
}

if ( ! function_exists( 'wc_dropshipping_get_mail_track_url' ) ) {
	/**
	 * Build a signed tracking pixel URL for supplier order emails.
	 *
	 * Uses the site front URL so mail clients and firewalls can load the pixel
	 * (admin-ajax.php is often blocked for guests).
	 *
	 * @param int $order_id    Order ID.
	 * @param int $supplier_id Supplier term ID.
	 * @return string
	 */
	function wc_dropshipping_get_mail_track_url( $order_id, $supplier_id ) {
		$order_id    = absint( $order_id );
		$supplier_id = absint( $supplier_id );
		$plugin_file = defined( 'WC_DROPSHIPPING_PLUGIN_FILE' ) ? WC_DROPSHIPPING_PLUGIN_FILE : dirname( __FILE__ ) . '/woocommerce-dropshipping.php';

		$url = add_query_arg(
			array(
				'orderid' => $order_id,
				'suppid'  => $supplier_id,
				'token'   => wc_dropshipping_get_mail_track_token( $order_id, $supplier_id ),
			),
			plugins_url( 'inc/mail-track.php', $plugin_file )
		);

		if ( is_ssl() || 'https' === wp_parse_url( home_url(), PHP_URL_SCHEME ) ) {
			$url = set_url_scheme( $url, 'https' );
		}

		return $url;
	}
}

if ( ! function_exists( 'wc_dropshipping_get_mail_track_pixel_html' ) ) {
	/**
	 * Hidden open-tracking pixel for supplier order emails.
	 *
	 * This is not a clickable link. Mail clients request the image when the
	 * message is opened and remote images are allowed to load.
	 *
	 * @param int $order_id    Order ID.
	 * @param int $supplier_id Supplier term ID.
	 * @return string
	 */
	function wc_dropshipping_get_mail_track_pixel_html( $order_id, $supplier_id ) {
		$track_url = wc_dropshipping_get_mail_track_url( $order_id, $supplier_id );

		return '<img src="' . esc_attr( $track_url ) . '" width="1" height="1" border="0" alt="" style="display:block!important;width:1px!important;height:1px!important;border:0!important;margin:0!important;padding:0!important;line-height:1px!important;font-size:1px!important;" />';
	}
}

if ( ! function_exists( 'wc_dropshipping_mail_track_maybe_handle' ) ) {
	/**
	 * Handle public tracking pixel requests on the front end.
	 */
	function wc_dropshipping_mail_track_maybe_handle() {
		$is_front_end_track = isset( $_GET['wc_dropshipping_mail_track'] );
		$is_ajax_track      = isset( $_GET['action'] ) && 'wc_dropshipping_mail_track' === $_GET['action'];

		if ( ! $is_front_end_track && ! $is_ajax_track ) {
			return;
		}

		wc_dropshipping_mail_track_callback();
	}
}

if ( ! function_exists( 'wc_dropshipping_mail_track_send_pixel' ) ) {
	/**
	 * Output a 1x1 transparent GIF and exit.
	 */
	function wc_dropshipping_mail_track_send_pixel() {
		nocache_headers();
		header( 'Content-Type: image/gif' );
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Binary image payload.
		echo base64_decode( 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' );
		exit;
	}
}

if ( ! function_exists( 'wc_dropshipping_order_has_supplier' ) ) {
	/**
	 * Check whether a supplier is associated with an order.
	 *
	 * @param int $order_id    Order ID.
	 * @param int $supplier_id Supplier term ID.
	 * @return bool
	 */
	function wc_dropshipping_order_has_supplier( $order_id, $supplier_id ) {
		$order_id    = absint( $order_id );
		$supplier_id = absint( $supplier_id );

		if ( ! $order_id || ! $supplier_id ) {
			return false;
		}

		if ( opmc_hpos_get_post_meta( $order_id, 'supplier_' . $supplier_id ) ) {
			return true;
		}

		$order = wc_get_order( $order_id );
		if ( ! $order ) {
			return false;
		}

		foreach ( $order->get_items() as $item_id => $item ) {
			$item_supplier_id = absint( $item->get_meta( 'supplierid', true ) );
			if ( ! $item_supplier_id && function_exists( 'wc_get_order_item_meta' ) ) {
				$item_supplier_id = absint( wc_get_order_item_meta( $item_id, 'supplierid', true ) );
			}
			if ( $item_supplier_id === $supplier_id ) {
				return true;
			}

			// @phpstan-ignore-next-line
			$product_id = $item->get_product_id(); 
			if ( $product_id ) {
				$terms = get_the_terms( $product_id, 'dropship_supplier' );
				if ( $terms && ! is_wp_error( $terms ) && absint( $terms[0]->term_id ) === $supplier_id ) {
					return true;
				}
			}
		}

		return false;
	}
}

if ( ! function_exists( 'wc_dropshipping_mail_track_callback' ) ) {
	/**
	 * Handle supplier email open tracking requests.
	 *
	 * Fires when the supplier opens any supplier notification email, regardless of
	 * order status. Only requires the cnf_mail setting to be enabled.
	 */
	function wc_dropshipping_mail_track_callback() {
		$order_id    = isset( $_GET['orderid'] ) ? absint( wp_unslash( $_GET['orderid'] ) ) : 0;
		$supplier_id = isset( $_GET['suppid'] ) ? absint( wp_unslash( $_GET['suppid'] ) ) : 0;
		$token       = isset( $_GET['token'] ) ? wp_unslash( $_GET['token'] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		if ( ! $order_id || ! $supplier_id || ! wc_dropshipping_verify_mail_track_token( $order_id, $supplier_id, $token ) ) {
			wc_dropshipping_mail_track_send_pixel();
		}

		if ( ! wc_get_order( $order_id ) ) {
			wc_dropshipping_mail_track_send_pixel();
		}

		$meta_key        = '_' . $order_id . '_' . $supplier_id;
		$already_tracked = opmc_hpos_get_post_meta( $order_id, $meta_key );
		if ( ! $already_tracked ) {
			$already_tracked = get_post_meta( $order_id, $meta_key, true );
		}
		if ( ! empty( $already_tracked ) ) {
			wc_dropshipping_mail_track_send_pixel();
		}

		$supplier = wc_dropshipping_get_dropship_supplier( $supplier_id );
		$sup_name = isset( $supplier['name'] ) ? $supplier['name'] : '';

		$to      = sanitize_email( get_option( 'admin_email' ) );
		$subject = sprintf(
			/* translators: %d: order ID */
			__( 'Supplier opened order email (Order #%d)', 'woocommerce-dropshipping' ),
			$order_id
		);
		$message  = '<h3>' . esc_html__( 'Hi there!', 'woocommerce-dropshipping' ) . '</h3>';
		$message .= '<h4>' . esc_html__( 'Email has been opened by', 'woocommerce-dropshipping' ) . ' => ' . esc_html( $sup_name ) . '</h4>';
		$message .= '<h4>' . esc_html__( 'Supplier Id', 'woocommerce-dropshipping' ) . ' => ' . esc_html( $supplier_id ) . '</h4>';
		$message .= '<h4>' . esc_html__( 'Order Id', 'woocommerce-dropshipping' ) . ' => ' . esc_html( $order_id ) . '</h4>';
		$headers  = array( 'Content-Type: text/html; charset=UTF-8' );

		$sent = wp_mail( $to, $subject, $message, $headers );
		if ( $sent ) {
			opmc_hpos_update_post_meta( $order_id, $meta_key, $order_id . '_' . $supplier_id );
		}

		wc_dropshipping_mail_track_send_pixel();
	}
}


/**
 *
 * Function for pod_received_callback
 */
function pod_received_callback()
{

	$order_id = $_GET['orderid']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

	$supplier_id = $_GET['supplierid']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

	$order_number = $_GET['order_number']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

	opmc_hpos_update_post_meta($order_id, $order_number . '_' . $supplier_id . '_status', 'received');

	header('Location:' . $_GET['return'] . 'admin.php?page=dropshipper-order-list'); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

	die;
}

function woocommerce_dropshippers_mark_as_shipped_callback()
{

	$order_id = $_GET['orderid']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

	$supplier_id = @$_GET['supplierid']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

	$order_number = @$_GET['order_number']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

	$d_key = 'order_' . $order_id;

	$d_options = get_dropship_option();

	if (! isset($d_options[$d_key])) {

		echo '<p style="color:red;">Sorry for inconvenience: This link will work only for the newly placed orders!</p>';

		wp_die();
	}

	$shipping_status = $d_options[$d_key]['shipping_status'];

	$my_wc_order = new WC_Order($order_id);

	$my_wc_order_number = $my_wc_order->get_order_number();

	$d_flag1 = '';
	if ('completed' == $shipping_status) {

		$my_wc_order->update_status('completed');
	} else {

		$d_options[$d_key][$supplier_id] = 'completed';

		$dFlag = true;

		$d_flag1 = 'yes';

		foreach ($d_options[$d_key] as $k => $v) {

			if ('shipping_status' != $k && 'processing' == $v) {

				$dFlag = false;

				$d_flag1 = 'no';
			}
		}

		if ($dFlag === true) {

			$d_options[$d_key]['shipping_status'] = 'completed';

			$my_wc_order->update_status('completed');

			unset($d_options[$d_key]);
		}

		update_dropship_option($d_options);
	}

	echo '<h1>' . esc_html('Order #' . $order_id) . '</h1>';

	echo '<p style="color:green;">Order has been notified as shipped for this supplier, and Marked as Completed if required.</p>';

	if (isset($_GET['return'])) {

		if ('no' == $d_flag1) {

			header('Location:' . $_GET['return'] . 'admin.php?page=dropshipper-order-list&success=' . $d_flag1); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		} else {

			header('Location:' . $_GET['return'] . 'admin.php?page=dropshipper-order-list&success=' . $d_flag1); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		}
	}

	die;
}


/**
 * Dropshipping for show_pod_content
 *
 * @param string $meta_value
 * @param int    $order_id
 * @param int    $supplier_pod_id
 * @param string $pod_ajax_url
 */
function show_pod_content($meta_value, $order_id, $supplier_pod_id, $pod_ajax_url) {

	if ('received' == $meta_value) {

		return 'Received';
	} else {

		return 'Not Received </br> </br> <a href="' . $pod_ajax_url . '" id="pod_received_' . $order_id . '_' . $supplier_pod_id . '" class="button button-primary" href="" style="margin-top:2px">Mark as Received</a>';
	}
}


/**
 *
 *  Function for dropshipper_order_list
 */
function dropshipper_order_list()
{

	$base_name = explode('/', plugin_basename(__FILE__));

	wp_enqueue_style('wc_dropshipping_checkout_style', plugins_url() . '/' . $base_name[0] . '/assets/css/custom.css');

	global $wpdb;

	$current_user = wp_get_current_user();

	$uid = $current_user->ID;

	$uemail = $current_user->user_email;

	$sid = get_user_meta($uid, 'supplier_id', true);

	$term = get_term_by('id', $sid, 'dropship_supplier');
	$store_add_shipping_add = '';

	if (! empty($term)) {

		$paged = isset($_GET['paged']) ? $_GET['paged'] : 1; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$post_status = array('wc-processing', 'wc-completed', 'wc-on-hold');
		$sup = wc_dropshipping_get_dropship_supplier($sid);

		$specific_delivery_location = @$sup['specific_delivery_location'];

		$options = get_option('wc_dropship_manager');

		$hide_client_info_Suppliers = $options['hide_client_info_Suppliers'];
		$hide_contact_info_Suppliers = $options['hide_contact_info_Suppliers'];

		$the_query = array();

		if (isset($_POST['dateFrom']) && isset($_POST['dateTo'])) {
			$get_fromdate_in = $_POST['dateFrom']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$get_todate_in = $_POST['dateTo']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$post_per_page = $_POST['order_per_page']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		} else if (isset($_GET['fromDate']) && isset($_GET['toDate'])) {
			$get_fromdate_in = $_GET['fromDate']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$get_todate_in = $_GET['toDate']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$post_per_page = $_GET['perPage']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		} else {
			$get_fromdate_in = gmdate('Y-m-d', strtotime('-7 days'));
			$get_todate_in = gmdate('Y-m-d');
			$post_per_page = 10;
		}

		$get_fromdate_inp = strtotime($get_fromdate_in);
		$get_fromdate_inp = gmdate('Y-m-d', strtotime('-1 day', $get_fromdate_inp));
		$get_todate_inp = strtotime($get_todate_in);
		$get_todate_inp = gmdate('Y-m-d', strtotime('+1 day', $get_todate_inp));

		if (isset($_POST['dateFrom']) && isset($_POST['dateTo'])) {

			$date_from = $_POST['dateFrom']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

			$date_to = $_POST['dateTo']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

			$args = array(

				'post_type' => 'shop_order',

				'post_status' => $post_status,

				'posts_per_page' => $post_per_page,

				'date_query' => array(
					'column' => 'post_date',
					'after' => $get_fromdate_inp,
					'before' => $get_todate_inp,
				),
				'meta_query' => array(
					array(
						'key' => 'dropship_supplier_' . $term->term_id,
						'value' => $term->term_id,
					),
				),
			);

			$the_query = wc_get_order($args);
		} else {

			if (class_exists('Automattic\WooCommerce\Utilities\OrderUtil') && OrderUtil::custom_orders_table_usage_is_enabled()) {

				$args = array(
					'status'        => $post_status,
					'meta_key'      => 'dropship_supplier_' . $term->term_id,
					'meta_value'    => $term->term_id,
					'limit'         => $post_per_page,
					'date_query' => array(
						'column' => 'post_date',
						'after' => $get_fromdate_inp,
						'before' => $get_todate_inp,
					),
				);

				$the_query = wc_get_orders($args);
			} else {
				// Use WP_Query for non-HPOS.
				$args = array(
					'post_type'      => 'shop_order',
					'post_status'    => $post_status,
					'posts_per_page' => $post_per_page,
					'date_query'     => array(
						'column' => 'post_date',
						'after'  => $get_fromdate_inp,
						'before' => $get_todate_inp,

					),
					'meta_query'     => array(
						array(
							'key'   => 'dropship_supplier_' . $term->term_id,
							'value' => $term->term_id,
						),
					),
				);

				$the_query = new WP_Query($args);
			}
		}

		echo '<div class="wrap">';

		echo '<h1>Supplier Orders</h1>';
		echo '<input type="text" id="searchInput" placeholder="Search..." style="float: right;"><br>';
		echo '<form name="Filter" method="POST" action="' . esc_url(get_admin_url(null, 'admin.php?page=dropshipper-order-list')) . '">';

		echo '<table class="table table-bordered">';
		echo '<tr>
                        From:
                        <input type="date" name="dateFrom" value="' . esc_attr($get_fromdate_in) . '" />
                        To:
                        <input type="date" name="dateTo" value="' . esc_attr($get_todate_in) . '" />
                        Number of items per page:
                        <input type="number" min="5" max="50" name="order_per_page" value="' . esc_attr($post_per_page) . '" style="width: 55px;margin-right: 5px;" />
                        <input type="submit" class="button button-primary" name="submit" value="Filter"/>
                    <tr>';
		echo '</table>';
		echo '</form>';

		echo '
		<div class="table-responsive" style="padding-top: 15px;">
			<table class="table table-bordered">';

		echo '<thead>';
		echo '<tr>';

		echo '<th scope="col" id="id" class="manage-column column-id column-primary sortable desc" style="width: 5%;padding-left: 10px;">ID</th>';
		echo '<th scope="col" id="date" class="manage-column column-date" style="width: 7%;">Date</th>';
		echo '<th scope="col" id="product" class="manage-column column-product">Product</th>';
		echo '<th scope="col" id="status" class="manage-column column-status-info">Status</th>';

		if (1 == $hide_client_info_Suppliers) {

			echo '<th scope="col" id="client" class="manage-column column-client-info" style="display:none;">Client Info</th>';
		} elseif (0 == $hide_client_info_Suppliers || 1 == $store_add_shipping_add) {
			echo '<th scope="col" id="client" class="manage-column column-client-info" >Client Info</th>';
		} elseif (0 == $hide_client_info_Suppliers && 0 == $store_add_shipping_add && 1 == $sup['specific_delivery_location']) {
			echo '<th scope="col" id="client" class="manage-column column-client-info" >Client Info</th>';
		}

		if (1 == $hide_contact_info_Suppliers) {
			echo '<th scope="col" id="contact_info" class="manage-column column-contact-info" style="display:none;">Contact Info</th>';
		} else {
			echo '<th scope="col" id="contact_info" class="manage-column column-contact-info">Contact Info</th>';
		}

		echo '
                        <th scope="col" id="shipping" class="manage-column column-shipping-info">Shipping Info</th>';
		echo '<th scope="col" id="pod_header" class="manage-column column-pod" title="Proof of Delivery (POD) status.">POD</th>';

		echo '</tr>';

		echo '</thead>';

		echo '<tbody id="the-list">';

		$user_id = get_current_user_id();

		$client_info_supp = '';

		$supplier_id = get_user_meta($user_id, 'supplier_id');

		// $the_query = wc_get_orders($args);
		if (class_exists('Automattic\WooCommerce\Utilities\OrderUtil') && OrderUtil::custom_orders_table_usage_is_enabled()) {

			if (! empty($the_query)) {

				foreach ($the_query as $order) {
					$new_order_id = $order->get_id();
					$order_number = $new_order_id;
					$supplier_pod_id = '_supplier_pod_' . get_current_user_id();
					$supplier_pod = opmc_hpos_get_post_meta($order_number, $order_number . '_' . $supplier_pod_id . '_status');
					$items = $order->get_items();

					$store_add_shipping_add = $options['store_add_shipping_add'];
					// $store_address     = get_option( 'woocommerce_store_address' );
					$store_address     = get_option('woocommerce_store_address');
					$store_address_2   = get_option('woocommerce_store_address_2');
					$store_city        = get_option('woocommerce_store_city');
					$store_postcode    = get_option('woocommerce_store_postcode');

					$admin_email = get_option('admin_email');

					$packing_slip_customer_service_email = $options['packing_slip_customer_service_email'];

					$order_id = is_object($order) ? $order->get_id() : $new_order_id;

					$fake_ajax_url = wp_nonce_url(admin_url('admin-ajax.php?action=woocommerce_dropshippers_mark_as_shipped&return=' . admin_url() . '&orderid=' . $order_id . '&supplierid=' . @$supplier_id[0]), 'woocommerce_dropshippers_mark_as_shipped');

					$pod_ajax_url = wp_nonce_url(admin_url('admin-ajax.php?action=woocommerce_dropshippers_pod_received&return=' . admin_url() . '&orderid=' . $order_id . '&supplierid=' . $supplier_pod_id . '&order_number=' . $order_number), 'woocommerce_dropshippers_pod_received');

					$upload_dir = wp_get_upload_dir();

					$pdfpath = $upload_dir['baseurl'] . '/' . $new_order_id . '/' . $new_order_id . '_' . $term->slug . '.pdf';

					$dropshipper_shipping_info = opmc_hpos_get_post_meta($new_order_id, 'dropshipper_shipping_info_' . get_current_user_id());

					$supplier_id = 'dropshipper_shipping_info_' . get_current_user_id();

					if (! $dropshipper_shipping_info) {

						$dropshipper_shipping_info = array(
							'date' => '',
							'tracking_number' => '',
							'shipping_company' => '',
							'notes' => '',
						);
					}

					$order_date = $order ? $order->get_date_created()->format('Y-m-d H:i:s') : 'N/A';

					echo '<tr>
					
						<td class="id column-id" data-colname="id">' . esc_html($new_order_id) . '</td>
		
						<td class="date column-date" data-colname="date">' . esc_html($order_date) . '</td>';

					echo '<td class="product column-product" data-colname="product">';

					if (count($items) > 0) {

						foreach ($items as $item_id => $item) {

							$ds = wc_dropshipping_get_dropship_supplier_by_product_id(intval($item['product_id']));

							if (is_array($ds) && ! empty($ds)) {

								if ($ds['order_email_addresses'] == $uemail) {
									$product_name = $item->get_name();
									echo '<p>' . esc_html($product_name) . '</p>';
								}
							}
						}
					}

					if ('' != $sup['address_line1']) {
						$sup['specific_delivery_location'] = '1';
					}

					echo '</td> 
	
						<td class="status column-status" data-colname="status">' . esc_html($order->get_status()) . '<br>';

					if ($order->get_status() != 'completed') {
						echo '<a id="mark_dropshipped_' . esc_attr($new_order_id) . '" class="button button-primary" href="' . esc_url($fake_ajax_url) . '" style="margin-top:2px">Mark as Complete</a><br>';
					}

					echo '<a href="' . esc_url($pdfpath) . '" target="_blank" id="print_slip_' . esc_attr($new_order_id) . '" class="button button-primary" style="margin-top:2px">Download packing slip</a></td>';

					if (1 == $hide_client_info_Suppliers) {
						echo '<td class="client column-client" data-colname="client" style="display:none;" >' . $order->get_formatted_shipping_address() . '</td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					} elseif (1 == $sup['specific_delivery_location'] && 0 == $store_add_shipping_add) {
						echo '<td class="client column-client" data-colname="client">' . $sup['address_line1'] . '<br>' . $sup['address_line2'] . '<br>' . $sup['supplier_city'] . '<br>' . $sup['country_state'] . '<br>' . $sup['postcode_zip'] . '</td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					} elseif (1 == $store_add_shipping_add) {
						echo '<td class="client column-client" data-colname="client">' . $store_address . '' . $store_address_2 . '' . $store_city . '' . $store_postcode . ' </td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					} else {
						echo '<td class="client column-client" data-colname="client">' . $order->get_formatted_shipping_address() . '</td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					}

					if (1 == $hide_contact_info_Suppliers) {
						echo '<td class="client-email column-client-email" data-colname="client-email" style="display:none;">' . $order->get_billing_email() . '<br><div class="row-actions"><span><a href="mailto:' . $order->get_billing_email() . '">Send an Email</a></span></div></td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					} elseif (($options['packing_slip_customer_service_email'] == '') && (1 == $store_add_shipping_add)) {
						echo '<td class="client-email column-client-email" data-colname="client-email">' . $admin_email . '<br><div class="row-actions"><span><a href="mailto:' . $admin_email . '">Send an Email</a></span></div></td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					} elseif (($packing_slip_customer_service_email != '') && (1 == $store_add_shipping_add)) {
						echo '<td class="client-email column-client-email" data-colname="client-email">' . esc_html( $packing_slip_customer_service_email ) . '<br><div class="row-actions"><span><a href="mailto:' . esc_attr( $packing_slip_customer_service_email ) . '">Send an Email</a></span></div></td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					} else {
						echo '<td class="client-email column-client-email" data-colname="client-email">' . $order->get_billing_email() . '<br><div class="row-actions"><span><a href="mailto:' . $order->get_billing_email() . '">Send an Email</a></span></div></td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					}

					echo ' <td class="shipping column-shipping" data-colname="shipping">
							<div id="dropshipper_shipping_info_' . esc_attr($new_order_id) . '" style="display:none;">							
								<p class="dropshipper_date">' . esc_html($dropshipper_shipping_info['date']) . '</p>
								<p class="dropshipper_tracking_number">' . esc_html($dropshipper_shipping_info['tracking_number']) . '</p>
								<p class="dropshipper_shipping_company">' . esc_html($dropshipper_shipping_info['shipping_company']) . '</p>
								<p class="dropshipper_notes">' . esc_html($dropshipper_shipping_info['notes']) . '</p>
							</div>

							<p>Date: ' . esc_html($dropshipper_shipping_info['date']) . '</p>
							<p>Tracking number: ' . esc_html($dropshipper_shipping_info['tracking_number']) . '</p>
							<p>Shipping Company: ' . esc_html($dropshipper_shipping_info['shipping_company']) . '</p>
							<p>Notes: ' . esc_html($dropshipper_shipping_info['notes']) . '</p>

							<br>

							<button id="open_dropshipper_dialog_' . $new_order_id . '" class="button button-primary" onclick="open_dropshipper_dialog(' . $new_order_id . ')" style="margin-top:2px">Edit Shipping Info</button>';  // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

					echo '<td class="client-email column-client-email" data-colname="client-email">' . show_pod_content($supplier_pod, $new_order_id, $supplier_pod_id, $pod_ajax_url) . '<br>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo '<div class="row-actions"><span></div>
						</td>						
					</tr>';
				}
			} else {
				echo '<tr><h3>Records not found on selected date.</h3></tr>';
			}
		} else {

			if ($the_query->have_posts()) {

				while ($the_query->have_posts()) :
					$the_query->the_post();

					$order = wc_get_order(get_the_ID());
					$new_order_id = $order->get_order_number();
					$order_number = $new_order_id;
					$supplier_pod_id = '_supplier_pod_' . get_current_user_id();
					$supplier_pod = opmc_hpos_get_post_meta($order_number, $order_number . '_' . $supplier_pod_id . '_status');
					$items = $order->get_items();

					$store_add_shipping_add = $options['store_add_shipping_add'];
					// $store_address     = get_option( 'woocommerce_store_address' );
					$store_address     = get_option('woocommerce_store_address');
					$store_address_2   = get_option('woocommerce_store_address_2');
					$store_city        = get_option('woocommerce_store_city');
					$store_postcode    = get_option('woocommerce_store_postcode');

					$admin_email = get_option('admin_email');

					$packing_slip_customer_service_email = $options['packing_slip_customer_service_email'];

					$order_id = is_object($order) ? $order->get_id() : $new_order_id;

					$fake_ajax_url = wp_nonce_url(admin_url('admin-ajax.php?action=woocommerce_dropshippers_mark_as_shipped&return=' . admin_url() . '&orderid=' . $order_id . '&supplierid=' . @$supplier_id[0]), 'woocommerce_dropshippers_mark_as_shipped');

					$pod_ajax_url = wp_nonce_url(admin_url('admin-ajax.php?action=woocommerce_dropshippers_pod_received&return=' . admin_url() . '&orderid=' . $order_id . '&supplierid=' . $supplier_pod_id . '&order_number=' . $order_number), 'woocommerce_dropshippers_pod_received');

					$upload_dir = wp_get_upload_dir();

					$pdfpath = $upload_dir['baseurl'] . '/' . $new_order_id . '/' . $new_order_id . '_' . $term->slug . '.pdf';

					$dropshipper_shipping_info = opmc_hpos_get_post_meta($new_order_id, 'dropshipper_shipping_info_' . get_current_user_id());

					$supplier_id = 'dropshipper_shipping_info_' . get_current_user_id();

					if (! $dropshipper_shipping_info) {

						$dropshipper_shipping_info = array(
							'date' => '',
							'tracking_number' => '',
							'shipping_company' => '',
							'notes' => '',
						);
					}

					echo '<tr>
							<td class="id column-id" data-colname="id">' . esc_html($new_order_id) . '</td>

                            <td class="date column-date" data-colname="date">' . get_the_date() . '</td>';

					echo '<td class="product column-product" data-colname="product">';

					if (count($items) > 0) {

						foreach ($items as $item_id => $item) {

							$ds = wc_dropshipping_get_dropship_supplier_by_product_id(intval($item['product_id']));

							if (is_array($ds) && ! empty($ds)) {

								if ($ds['order_email_addresses'] == $uemail) {
									$product_name = $item->get_name();
									echo '<p>' . esc_html($product_name) . '</p>';
								}
							}
						}
					}

					if ('' != $sup['address_line1']) {
						$sup['specific_delivery_location'] = '1';
					}

					echo '</td> 

						<td class="status column-status" data-colname="status">' . $order->get_status() . '<br>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

					if ($order->get_status() != 'completed') {
						echo '<a id="mark_dropshipped_' . $new_order_id . '" class="button button-primary" href="' . $fake_ajax_url . '" style="margin-top:2px">Mark as Complete</a> <br>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					}

					echo '<a href="' . $pdfpath . '" target="blank" id="print_slip_' . $new_order_id . '" class="button button-primary" style="margin-top:2px">Download packing slip</a> </td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

					if (1 == $hide_client_info_Suppliers) {
						echo '<td class="client column-client" data-colname="client" style="display:none;" >' . $order->get_formatted_shipping_address() . '</td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					} elseif (1 == $sup['specific_delivery_location'] && 0 == $store_add_shipping_add) {
						echo '<td class="client column-client" data-colname="client">' . $sup['address_line1'] . '<br>' . $sup['address_line2'] . '<br>' . $sup['supplier_city'] . '<br>' . $sup['country_state'] . '<br>' . $sup['postcode_zip'] . '</td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					} elseif (1 == $store_add_shipping_add) {
						echo '<td class="client column-client" data-colname="client">' . $store_address . '' . $store_address_2 . '' . $store_city . '' . $store_postcode . ' </td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					} else {
						echo '<td class="client column-client" data-colname="client">' . $order->get_formatted_shipping_address() . '</td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					}

					if (1 == $hide_contact_info_Suppliers) {
						echo '<td class="client-email column-client-email" data-colname="client-email" style="display:none;">' . $order->get_billing_email() . '<br><div class="row-actions"><span><a href="mailto:' . $order->get_billing_email() . '">Send an Email</a></span></div></td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					} elseif (($options['packing_slip_customer_service_email'] == '') && (1 == $store_add_shipping_add)) {
						echo '<td class="client-email column-client-email" data-colname="client-email">' . $admin_email . '<br><div class="row-actions"><span><a href="mailto:' . $admin_email . '">Send an Email</a></span></div></td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					} elseif (($packing_slip_customer_service_email != '') && (1 == $store_add_shipping_add)) {
						echo '<td class="client-email column-client-email" data-colname="client-email">' . esc_html($packing_slip_customer_service_email) . '<br><div class="row-actions"><span><a href="mailto:' . esc_attr($packing_slip_customer_service_email) . '">Send an Email</a></span></div></td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					} else {
						echo '<td class="client-email column-client-email" data-colname="client-email">' . $order->get_billing_email() . '<br><div class="row-actions"><span><a href="mailto:' . $order->get_billing_email() . '">Send an Email</a></span></div></td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					}

					echo '<td class="shipping column-shipping" data-colname="shipping">

							<div id="dropshipper_shipping_info_' . esc_attr($new_order_id) . '" style="display:none;">
								<p class="dropshipper_date">' . esc_html($dropshipper_shipping_info['date']) . '</p>
								<p class="dropshipper_tracking_number">' . esc_html($dropshipper_shipping_info['tracking_number']) . '</p>
								<p class="dropshipper_shipping_company">' . esc_html($dropshipper_shipping_info['shipping_company']) . '</p>
								<p class="dropshipper_notes">' . esc_html($dropshipper_shipping_info['notes']) . '</p>
							</div>

							<p>Date: ' . esc_html($dropshipper_shipping_info['date']) . '</p>
							<p>Tracking number: ' . esc_html($dropshipper_shipping_info['tracking_number']) . '</p>
							<p>Shipping Company: ' . esc_html($dropshipper_shipping_info['shipping_company']) . '</p>
							<p>Notes: ' . esc_html($dropshipper_shipping_info['notes']) . '</p>

							<br>

							<button id="open_dropshipper_dialog_' . $new_order_id . '" class="button button-primary" onclick="open_dropshipper_dialog(' . $new_order_id . ')" style="margin-top:2px">Edit Shipping Info</button>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

					echo '<td class="client-email column-client-email" data-colname="client-email">' . show_pod_content($supplier_pod, $new_order_id, $supplier_pod_id, $pod_ajax_url) . '<br>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo '<div class="row-actions"><span></div>
						</td>			
					</tr>';
				endwhile;
			} else {
				echo '<tr><h3>Records not found on selected date.</h3></tr>';
			}
		}

		wp_reset_query();

		echo '</tbody>
            </table>
			</div>';

		echo '<nav class="sw-pagination">';
		$big = 999999999;
		$link = str_replace($big, '%#%', esc_url(get_pagenum_link($big)));
		$link = str_replace('#038;', '&', $link);
		echo paginate_links( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			array( 
				'base' => $link,
				'add_args' => array(
					'fromDate' => $get_fromdate_in,
					'toDate' => $get_todate_in,
					'perPage' => $post_per_page,
				),
				'current' => max(1, $paged),
				'total' => $the_query->max_num_pages,
			)
		);

		echo '</nav></div>';
	} else {

		echo '<div class="wrap">

            <h1>Supplier Orders</h1>
			<input type="text" id="searchInput" placeholder="Search..." style="float: right;"><br>
			<div class="table-responsive" style="padding-top: 15px;">

            <table class="table table-bordered">

                <thead>

                    <tr>

                        <th scope="col" id="id" class="manage-column column-id column-primary sortable desc">ID</th>

                        <th scope="col" id="date" class="manage-column column-date">Date</th>

                        <th scope="col" id="product" class="manage-column column-product">Product</th>
						<th scope="col" id="status" class="manage-column column-status-info">Status</th>
                        <th scope="col" id="client" class="manage-column column-client-info" >Client Info</th>';

						echo '<th scope="col" id="contact_info" class="manage-column column-contact-info">Contact Info</th>
                        <th scope="col" id="shipping" class="manage-column column-shipping-info">Shipping Info</th>
                        <th scope="col" id="pod_header" class="manage-column column-pod" title="Proof of Delivery (POD) status.">POD</th>
                        
                    </tr>

                </thead>
                <tbody id="the-list">

                    <tr><td class="id column-id" colspan="8">No dropshipper has assigned to this user.</td></tr>
                </tbody>

            </table>
			</div>

        </div>';
	}

	echo '<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/themes/smoothness/jquery-ui.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css" />
	<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
	<script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"></script>

	<style>
			.ui-dialog-titlebar-close {
				background: none;
				border: none;
				outline: none;
				position: absolute;
				right: 0.3em;
				top: 50%;
				transform: translateY(-50%);
				padding: 0.2em;
				cursor: pointer;
			}
			.ui-dialog-titlebar-close .ui-button-icon {
				background-image: url("https://code.jquery.com/ui/1.13.2/themes/base/images/ui-icons_444444_256x240.png"); /* Updated sprite */
				background-position: -96px -128px; /* Close icon position */
				background-repeat: no-repeat;
				display: block;
				width: 16px;
				height: 16px;
			}
		</style>


	<div id="input-dialog-template" style="display:none">

		<label for="input-dialog-date">Date</label>
		<input type="text" name="input-dialog-date" id="input-dialog-date" style="width:100%">

		<label for="input-dialog-trackingnumber">Tracking Number(s)</label>
		<textarea name="input-dialog-trackingnumber" id="input-dialog-trackingnumber" style="width:100%"></textarea>

		<label for="input-dialog-shippingcompany">Shipping Company</label>
		<textarea name="input-dialog-shippingcompany" id="input-dialog-shippingcompany" style="width:100%"></textarea>

		<label for="input-dialog-notes">Notes</label>
		<textarea name="input-dialog-notes" id="input-dialog-notes" style="width:100%"></textarea>

	</div>';
}

if (isset($_GET['success'])) {

	if ('no' == @$_GET['success']) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		echo '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
		<!-- Modal -->
		<div class="modal" id="complete_order_mark_Modal">
			<div class="modal-dialog">
				<div class="modal-content">
					<!-- Modal Header -->
					<div class="modal-header">
						<h4 class="modal-title"></h4>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<!-- Modal body -->

					<div class="modal-body">
						Thank you for completing this order. It will be under process untill all other dropshippers mark this order as complete.
					</div>

					<!-- Modal footer -->

					<div class="modal-footer">
						<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>';
	}
}

if ( ! function_exists( 'wc_ds_get_settings_admin_url' ) ) {

	/**
	 * Admin URL for WooCommerce Dropshipping settings (same screen as WooCommerce → Settings → Dropshipping tab).
	 *
	 * @param array $args {
	 *     Optional. Query arguments.
	 *
	 *     @type string $tab       WooCommerce settings tab slug. Default `wc_dropship_settings`.
	 *     @type string $wc_ds_tab Dropshipping UI tab id to focus (e.g. `overview`). Must match a registered panel id.
	 * }
	 * @return string
	 */
	function wc_ds_get_settings_admin_url( $args = array() ) {
		$args = wp_parse_args(
			$args,
			array(
				'tab'       => 'wc_dropship_settings',
				'wc_ds_tab' => '',
			)
		);

		$url = add_query_arg(
			array(
				'page' => 'wc-settings',
				'tab'  => sanitize_key( $args['tab'] ),
			),
			admin_url( 'admin.php' )
		);

		if ( '' !== $args['wc_ds_tab'] && is_string( $args['wc_ds_tab'] ) ) {
			$allowed = array(
				'overview',
				'general_settings',
				'supplier_email_notifications',
				'packing_slips',
				'customised_supplier_emails',
				'smtp_options',
				'price_calculator_options',
			);
			$sub = sanitize_key( $args['wc_ds_tab'] );
			if ( in_array( $sub, $allowed, true ) ) {
				$url = add_query_arg( 'wc_ds_tab', $sub, $url );
			}
		}

		return $url;
	}
}
