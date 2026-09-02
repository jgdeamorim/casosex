<?php
/**
 * WC_Report_Whols_Sales_By_Category
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if( !class_exists('WC_Report_Sales_By_Category') ){
	include_once ( WP_PLUGIN_DIR . '/woocommerce/includes/admin/reports/class-wc-report-sales-by-category.php' );
}

/**
 * WC_Report_Whols_Sales_By_Category
 */
class WC_Report_Whols_Sales_By_Category extends WC_Report_Sales_By_Category {

	/**
	 * Output the report.
	 */
	public function output_report() {
		parent::output_report();
	}
}
