<?php
/**
 * Secure supplier email open tracking pixel.
 *
 * @package WooCommerceDropshipping
 */

// Do not call WordPress functions before wp-load.php is required.
$script_filename = isset( $_SERVER['SCRIPT_FILENAME'] ) ? (string) $_SERVER['SCRIPT_FILENAME'] : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
$parse_uri       = explode( 'wp-content', $script_filename );

if ( empty( $parse_uri[0] ) ) {
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

$wp_load = $parse_uri[0] . 'wp-load.php';

if ( ! file_exists( $wp_load ) ) {
	header( 'HTTP/1.1 403 Forbidden' );
	exit;
}

require $wp_load;

if ( ! function_exists( 'opmc_hpos_get_post_meta' ) ) {
	$helper_file = dirname( __DIR__ ) . '/includes/opmc-hpos-compatibility-helper.php';
	if ( file_exists( $helper_file ) ) {
		require_once $helper_file;
	}
}

if ( ! function_exists( 'wc_dropshipping_mail_track_callback' ) ) {
	$functions_file = dirname( __DIR__ ) . '/woocommerce-dropshipping-functions.php';
	if ( file_exists( $functions_file ) ) {
		require_once $functions_file;
	}
}

if ( function_exists( 'wc_dropshipping_mail_track_callback' ) ) {
	wc_dropshipping_mail_track_callback();
}

if ( function_exists( 'wc_dropshipping_mail_track_send_pixel' ) ) {
	wc_dropshipping_mail_track_send_pixel();
}

status_header( 403 );
exit;
