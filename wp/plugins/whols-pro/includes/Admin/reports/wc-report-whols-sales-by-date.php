<?php
/**
 * WC_Report_Whols_Sales_By_Date
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if( !class_exists('WC_Report_Sales_By_Date') ){
	include_once ( WP_PLUGIN_DIR . '/woocommerce/includes/admin/reports/class-wc-report-sales-by-date.php' );
}

/**
 * WC_Report_Whols_Sales_By_Date
 */
class WC_Report_Whols_Sales_By_Date extends WC_Report_Sales_By_Date {

	/**
	 * Output the report.
	 */
	public function output_report() {
		parent::output_report();
	}
}
