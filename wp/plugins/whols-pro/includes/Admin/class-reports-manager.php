<?php
/**
 * Main class for the Wholesale Reports
 */

namespace Whols_Pro\Admin;

use const Whols_Pro\PL_PATH;

class Manage_Reports {
	/**
	 * Constructor
	 */
	public function __construct() {
		// Add a tab to the existing WC reports
		add_filter( 'woocommerce_admin_reports', array( $this, 'add_tab' ) );

		// Set the file by which the report is rendered
		add_filter( 'wc_admin_reports_path', array( $this, 'assign_wholesale_report_path' ), 9999, 3 );
	}

	public function add_tab( $reports ) {
		$reports['whols_reports'] = array(
			'title'   => __( 'Whols Reports', 'whols' ),
			'reports' => array(
				'whols_sales_by_date'     => array(
					'title'       => __( 'Sales by date', 'whols' ),
					'description' => '',
					'hide_title'  => true,
					'callback'    => array( 'WC_Admin_Reports', 'get_report' ),
				),
				'whols_sales_by_product'  => array(
					'title'       => __( 'Sales by product', 'whols' ),
					'description' => '',
					'hide_title'  => true,
					'callback'    => array( 'WC_Admin_Reports', 'get_report' ),
				),
				'whols_sales_by_category' => array(
					'title'       => __( 'Sales by category', 'whols' ),
					'description' => '',
					'hide_title'  => true,
					'callback'    => array( 'WC_Admin_Reports', 'get_report' ),
				),
			),
		);

		return $reports;
	}

	public function assign_wholesale_report_path( $path, $name, $class ) {
		$newpath = '';

		switch ( $path ) {
			case 'reports/class-wc-report-whols-sales-by-date.php':
				$newpath = PL_PATH . '/includes/Admin/reports/wc-report-whols-sales-by-date.php';
				break;

			case 'reports/class-wc-report-whols-sales-by-product.php':
				$newpath = PL_PATH . '/includes/Admin/reports/wc-report-whols-sales-by-product.php';
				break;

			case 'reports/class-wc-report-whols-sales-by-category.php':
				$newpath = PL_PATH . '/includes/Admin/reports/wc-report-whols-sales-by-category.php';
				break;
		}

		if ( $newpath ) {
			$path = $newpath;
			add_filter( 'woocommerce_reports_get_order_report_query', array( $this, 'filter_sales_by_date' ) );
		}

		return $path;
	}

	public function filter_sales_by_date( $query ) {
		global $wpdb;

		$query['where'] .= sprintf(
			" AND posts.ID IN (SELECT %s.post_id FROM %s WHERE %s.meta_key = '_whols_order_type')",
			$wpdb->postmeta,
			$wpdb->postmeta,
			$wpdb->postmeta,
		);

		return $query;
	}
}