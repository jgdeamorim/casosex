<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** @var WC_Dropshipping $this */
// Dashboard data retrieval - Combine calls to minimize queries
$dashboard_report = $this->dashboard;

$dashboard_data = array(
	'count_prod_listings' => ( null === $dashboard_report->count_prod_listings() ) ? 0 : $dashboard_report->count_prod_listings(),
	'count_prod_out_stock' => $dashboard_report->count_prod_out_stock(),
	'orders' => $dashboard_report->count_orders(),
	'currency' => $dashboard_report->get_currency(),
	'ali_prod' => $dashboard_report->get_ali_orders(),
	'orders_inprogress' => count( $dashboard_report->get_inprogress_orders() ),
	'orders_completed' => $dashboard_report->get_completed_orders(),
	'orders_pending' => $dashboard_report->get_pending_orders(),
	'orders_affiliate' => $dashboard_report->get_affiliate_prod(),
	'week_old_sales' => $dashboard_report->get_week_total_sales(),
	'best_selling_prod' => $dashboard_report->get_best_selling_prod(),
	'low_stocks_prod' => $dashboard_report->get_low_on_stocks_prod(),
	'completed_dropship_orders' => $dashboard_report->get_completed_dropship_orders(),
	'products_draft_count' => $dashboard_report->get_products_draft_count(),
);

?>

<!-- Defer loading of jQuery and other scripts -->


<div id="woocommerce-dropshipping-dashboard">

	<div class="dash-row">
		<h1 id="dashboard-header"><?php echo esc_html__('WooCommerce Dropshipping Dashboard', 'woocommerce-dropshipping' ); ?></h1>
	</div>

	<div class="dash-row wcd-blurb-container">
		<div class="metric-box metric-style1">
			<img loading="lazy" src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/listings.svg' ); ?>" alt="Published Listings">
			<h2><?php echo esc_textarea( $dashboard_data['count_prod_listings'] ); ?></h2>
			<p class="wcd-blurb-text"><?php echo esc_html_e( 'Published Listings', 'woocommerce-dropshipping' ); ?></p>
		</div>

		<div class="metric-box metric-style2">
			<img loading="lazy" src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/low-stock.svg' ); ?>" alt="Out of Stock">
			<h2><?php echo esc_textarea( $dashboard_data['count_prod_out_stock'] ); ?></h2>
			<p class="wcd-blurb-text"><?php esc_html_e( 'Out of Stock', 'woocommerce-dropshipping' ); ?></p>
		</div>

		<div class="metric-box metric-style3">
			<img loading="lazy" src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/orders.svg' ); ?>" alt="Orders">
			<h2><?php echo esc_textarea( $dashboard_data['orders'][0] ); ?></h2>
			<p class="wcd-blurb-text"><?php esc_html_e( 'Orders', 'woocommerce-dropshipping' ); ?></p>
		</div>

		<div class="metric-box metric-style4">
			<img loading="lazy" src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/totaol.svg' ); ?>" alt="Projected Profit">
			<h2>
				<?php echo esc_html( $dashboard_data['currency'] ); ?>
				<?php echo isset( $dashboard_data['week_old_sales']['profit'] ) ? esc_html( $dashboard_data['week_old_sales']['profit'] ) : 0; ?>
				<br>
			</h2>
			<p class="wcd-blurb-text"><?php esc_html_e( 'Projected Profit', 'woocommerce-dropshipping' ); ?></p>
		</div>

		<?php if ( $dashboard_data['products_draft_count'] >= 1 ) { ?>
			<div class="metric-box metric-style1">
				<img loading="lazy" src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/ali-draft-prods.png' ); ?>" alt="Draft Products" style="height: 65px; margin: 0 auto; padding: 10px;">
				<h2 id="ali-draft-prod-count"><?php echo esc_textarea( $dashboard_data['products_draft_count'] ); ?></h2>
				<p class="wcd-blurb-text"><?php esc_html_e( 'Draft Products', 'woocommerce-dropshipping' ); ?></p>
				<button class="button button1" id="ali-draft-publish-btn"><?php esc_html_e( 'Publish Products', 'woocommerce-dropshipping' ); ?></button>
			</div>
		<?php } ?>
	</div>

	<div class="dash-row">
		<div class="dash-section-50 bar-chart">
			<h2 class="white"><?php esc_html_e( 'Recent Order Data', 'woocommerce-dropshipping' ); ?></h2>
			<div class="chart-wrapper">
				<canvas id="bar-chart-grouped"></canvas>
			</div>
		</div>
		<div class="dash-section-50 dash-stats">
			<h2 class="white"><?php esc_html_e( 'Account Information', 'woocommerce-dropshipping' ); ?></h2>
			<p id="account-info-note"><?php esc_html_e( 'WooCommerce orders at a glance', 'woocommerce-dropshipping' ); ?></p>
			<!-- Info stats about orders -->
			<div class="blurb">
				<div class="blurb-inner">
					<img loading="lazy" src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/aliexpress.svg' ); ?> " alt="Aliexpress Orders">
					<h3><?php esc_html_e( 'Aliexpress Orders', 'woocommerce-dropshipping' ); ?></h3>
					<div class="blurb-content"><?php echo esc_textarea( $dashboard_data['ali_prod'][0] ); ?></div>
				</div>
			</div>
			<div class="blurb">
				<div class="blurb-inner">
					<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/progress-1.svg' ); ?> ">
					<h3><?php esc_html_e( 'Orders in Progress', 'woocommerce-dropshipping' ); ?></h3>
					<div class="blurb-content">
						<?php echo esc_textarea( $dashboard_data['orders_inprogress'] ); ?>						
					</div>
				</div>
			</div>
			<div class="blurb">
				<div class="blurb-inner">
					<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/progress.svg' ); ?>">
					<h3><?php esc_html_e( 'Orders Completed', 'woocommerce-dropshipping' ); ?></h3>
					<div class="blurb-content">
						<?php echo esc_textarea( $dashboard_data['orders_completed'] ); ?>
					</div>
				</div>
			</div>
			<div class="blurb">
				<div class="blurb-inner">
					<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/stock-alert.svg' ); ?>">
					<h3><?php esc_html_e( 'Out of Stock Listings', 'woocommerce-dropshipping' ); ?></h3>
					<div class="blurb-content"><?php echo esc_textarea( $dashboard_data['count_prod_out_stock'] ); ?></div>
				</div>
			</div>
			<div class="blurb">
				<div class="blurb-inner">
					<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/pending.svg' ); ?>">
					<h3><?php esc_html_e( 'Pending Orders', 'woocommerce-dropshipping' ); ?></h3>
					<div class="blurb-content">
						<?php echo esc_textarea( $dashboard_data['orders_pending'] ); ?>
					</div>
				</div>
			</div>
			<div class="blurb">
				<div class="blurb-inner">
					<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/progress.svg' ); ?>">
					<h3><?php esc_html_e( 'Completed Dropshipping Orders', 'woocommerce-dropshipping' ); ?></h3>
					<div class="blurb-content"><?php echo esc_textarea( $dashboard_data['completed_dropship_orders'] ); ?></div>
				</div>
			</div>
			<div class="blurb">
				<div class="blurb-inner">
					<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/affiliate.svg' ); ?>">
					<h3><?php esc_html_e( 'Active Affiliate Products', 'woocommerce-dropshipping' ); ?></h3>
					<div class="blurb-content"><?php echo esc_textarea( $dashboard_data['orders_affiliate'] ); ?></div>
				</div>
			</div>
		</div>
	</div>

	<div class="dash-row">
		<div class="dash-slider">
			<h2 class="white font-28"><?php esc_html_e( 'Best Selling Products', 'woocommerce-dropshipping' ); ?></h2>
			<div class="gap"></div>
			<?php			
			foreach ( $dashboard_data['best_selling_prod'] as $product ) {
				?>
				<div class="product-slide">
					<a href="<?php echo esc_url( $product[3] ); ?>">
						<?php echo $product[2]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> 
						<h3><?php echo esc_html( $product[1] ); ?></h3>
						<span><?php echo esc_html( $product[0] . ' sold' ); ?></span>
					</a>
				</div>
			<?php } ?>
		</div>
	</div>

	<div class="dash-row">
		<div class="dash-slider">
			<h2 class="white font-28"><?php esc_html_e( 'Low on Stock', 'woocommerce-dropshipping' ); ?></h2>
			<div class="gap-2"></div>
			<?php foreach ( $dashboard_data['low_stocks_prod'] as $product ) { ?>
				<div class="product-slide">
					<a href="<?php echo esc_url( $product[3] ); ?>">
						<?php echo $product[2]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						<h3><?php echo esc_html( $product[1] ); ?></h3>
						<span><?php echo esc_html( $product[0] . ' left' ); ?></span>
					</a>
				</div>
			<?php } ?>
		</div>
	</div>

	<div class="dash-row">
		<h2 class="white font-40"><?php esc_html_e( 'Plugin Setup', 'woocommerce-dropshipping' ); ?></h2>
	</div>

	<div id="plugin-setup" class="dash-row thirds">
		<div class="metric-box">
			<img loading="lazy" src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/aliexpress.svg' ); ?>" alt="Aliexpress Import">
			<h2><?php esc_html_e( 'Aliexpress Import', 'woocommerce-dropshipping' ); ?></h2>
			<p class="plugin-setup-desc"><?php esc_html_e( 'Install the extension to get started', 'woocommerce-dropshipping' ); ?></p>
			<a target="_blank" href="https://chrome.google.com/webstore/detail/woocommerce-dropshipping/hfhghglengghapddjhheegmmpahpnkpo?hl=en"><?php esc_html_e( 'Install Now', 'woocommerce-dropshipping' ); ?></a>
		</div>
		<!-- Repeat for other setup steps -->

		<div class="metric-box">
			<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/settings.svg' ); ?>">
			<h2><?php esc_html_e( 'Adjust Plugin Settings', 'woocommerce-dropshipping' ); ?></h2>
			<p class="plugin-setup-desc"><?php esc_html_e( 'Configure packing slips, emails and more.', 'woocommerce-dropshipping' ); ?></p>
			<a href="<?php echo esc_url( function_exists( 'wc_ds_get_settings_admin_url' ) ? wc_ds_get_settings_admin_url( array( 'wc_ds_tab' => 'overview' ) ) : admin_url( 'admin.php?page=wc-settings&tab=wc_dropship_settings' ) ); ?>">
				<?php esc_html_e( 'Go to Settings', 'woocommerce-dropshipping' ); ?>
			</a>
		</div>
		<div class="metric-box">
			<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/affiliate.svg' ); ?>">
			<h2><?php esc_html_e( 'Suppliers', 'woocommerce-dropshipping' ); ?></h2>
			<p class="plugin-setup-desc"><?php esc_html_e( 'Organise your store\'s products by their supplier.', 'woocommerce-dropshipping' ); ?></p>
			<a href="<?php echo esc_url( get_admin_url() . 'edit-tags.php?taxonomy=dropship_supplier&post_type=product' ); ?>">
				<?php esc_html_e( 'Manage Suppliers', 'woocommerce-dropshipping' ); ?>
			</a>
		</div>
	</div>
</div>
<!-- End of dashboard -->

<?php wp_enqueue_style( 'add_custom_dashboard_style' ); ?>
<?php wp_enqueue_script( 'add_dropshipping_chart_lib' ); ?>
<?php wp_enqueue_script( 'add_custom_dashboard_script' ); ?>
