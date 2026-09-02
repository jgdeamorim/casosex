<?php
/**
 * WC_Report_Whols_Sales_By_Product
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if( !class_exists('WC_Report_Sales_By_Product') ){
	include_once ( WP_PLUGIN_DIR . '/woocommerce/includes/admin/reports/class-wc-report-sales-by-product.php' );
}

/**
 * WC_Report_Whols_Sales_By_Product
 */
class WC_Report_Whols_Sales_By_Product extends WC_Report_Sales_By_Product {

	/**
	 * Output the report.
	 */
	public function output_report() {
		parent::output_report();
	}
}
