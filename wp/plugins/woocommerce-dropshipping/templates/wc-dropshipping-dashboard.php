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
		<h1 id="dashboard-header"><?php echo esc_html__('Painel Geral Dropshipping INTT — CASOSEX', 'woocommerce-dropshipping' ); ?></h1>
	</div>

	<div class="dash-row wcd-blurb-container">
		<div class="metric-box metric-style1">
			<img loading="lazy" src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/listings.svg' ); ?>" alt="Produtos INTT">
			<h2><?php echo esc_textarea( $dashboard_data['count_prod_listings'] ); ?></h2>
			<p class="wcd-blurb-text"><?php esc_html_e( 'Produtos no Catálogo INTT', 'woocommerce-dropshipping' ); ?></p>
		</div>

		<div class="metric-box metric-style2">
			<img loading="lazy" src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/low-stock.svg' ); ?>" alt="Fora de Estoque">
			<h2><?php echo esc_textarea( $dashboard_data['count_prod_out_stock'] ); ?></h2>
			<p class="wcd-blurb-text"><?php esc_html_e( 'Itens Fora de Estoque (INTT)', 'woocommerce-dropshipping' ); ?></p>
		</div>

		<div class="metric-box metric-style3">
			<img loading="lazy" src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/orders.svg' ); ?>" alt="Total de Pedidos">
			<h2><?php echo esc_textarea( $dashboard_data['orders'][0] ); ?></h2>
			<p class="wcd-blurb-text"><?php esc_html_e( 'Total de Pedidos Dropshipping', 'woocommerce-dropshipping' ); ?></p>
		</div>

		<div class="metric-box metric-style4">
			<img loading="lazy" src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/totaol.svg' ); ?>" alt="Lucro Projetado">
			<h2>
				R$ 
				<?php echo isset( $dashboard_data['week_old_sales']['profit'] ) ? esc_html( number_format( (float) $dashboard_data['week_old_sales']['profit'], 2, ',', '.' ) ) : '0,00'; ?>
				<br>
			</h2>
			<p class="wcd-blurb-text"><?php esc_html_e( 'Lucro Estimado (R$)', 'woocommerce-dropshipping' ); ?></p>
		</div>

		<?php if ( $dashboard_data['products_draft_count'] >= 1 ) { ?>
			<div class="metric-box metric-style1">
				<img loading="lazy" src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/listings.svg' ); ?>" alt="Rascunhos de Produtos" style="height: 65px; margin: 0 auto; padding: 10px;">
				<h2 id="ali-draft-prod-count"><?php echo esc_textarea( $dashboard_data['products_draft_count'] ); ?></h2>
				<p class="wcd-blurb-text"><?php esc_html_e( 'Produtos em Rascunho', 'woocommerce-dropshipping' ); ?></p>
				<button class="button button1" id="ali-draft-publish-btn"><?php esc_html_e( 'Publicar Rascunhos', 'woocommerce-dropshipping' ); ?></button>
			</div>
		<?php } ?>
	</div>

	<div class="dash-row">
		<div class="dash-section-50 bar-chart">
			<h2 class="white"><?php esc_html_e( 'Desempenho Recente de Pedidos INTT', 'woocommerce-dropshipping' ); ?></h2>
			<div class="chart-wrapper">
				<canvas id="bar-chart-grouped"></canvas>
			</div>
		</div>
		<div class="dash-section-50 dash-stats">
			<h2 class="white"><?php esc_html_e( 'Resumo Operacional Dropshipping', 'woocommerce-dropshipping' ); ?></h2>
			<p id="account-info-note"><?php esc_html_e( 'Métricas de pedidos e entregas INTT em tempo real', 'woocommerce-dropshipping' ); ?></p>
			
			<div class="blurb">
				<div class="blurb-inner">
					<img loading="lazy" src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/orders.svg' ); ?> " alt="Pedidos INTT Processados">
					<h3><?php esc_html_e( 'Pedidos INTT Processados', 'woocommerce-dropshipping' ); ?></h3>
					<div class="blurb-content"><?php echo esc_textarea( $dashboard_data['orders'][0] ); ?></div>
				</div>
			</div>
			<div class="blurb">
				<div class="blurb-inner">
					<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/progress-1.svg' ); ?> ">
					<h3><?php esc_html_e( 'Pedidos em Andamento', 'woocommerce-dropshipping' ); ?></h3>
					<div class="blurb-content">
						<?php echo esc_textarea( $dashboard_data['orders_inprogress'] ); ?>						
					</div>
				</div>
			</div>
			<div class="blurb">
				<div class="blurb-inner">
					<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/progress.svg' ); ?>">
					<h3><?php esc_html_e( 'Pedidos Concluídos', 'woocommerce-dropshipping' ); ?></h3>
					<div class="blurb-content">
						<?php echo esc_textarea( $dashboard_data['orders_completed'] ); ?>
					</div>
				</div>
			</div>
			<div class="blurb">
				<div class="blurb-inner">
					<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/stock-alert.svg' ); ?>">
					<h3><?php esc_html_e( 'Sem Estoque na INTT', 'woocommerce-dropshipping' ); ?></h3>
					<div class="blurb-content"><?php echo esc_textarea( $dashboard_data['count_prod_out_stock'] ); ?></div>
				</div>
			</div>
			<div class="blurb">
				<div class="blurb-inner">
					<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/pending.svg' ); ?>">
					<h3><?php esc_html_e( 'Pendente de Pagamento/Despacho', 'woocommerce-dropshipping' ); ?></h3>
					<div class="blurb-content">
						<?php echo esc_textarea( $dashboard_data['orders_pending'] ); ?>
					</div>
				</div>
			</div>
			<div class="blurb">
				<div class="blurb-inner">
					<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/progress.svg' ); ?>">
					<h3><?php esc_html_e( 'Entregas INTT Finalizadas', 'woocommerce-dropshipping' ); ?></h3>
					<div class="blurb-content"><?php echo esc_textarea( $dashboard_data['completed_dropship_orders'] ); ?></div>
				</div>
			</div>
		</div>
	</div>

	<div class="dash-row">
		<div class="dash-slider">
			<h2 class="white font-28"><?php esc_html_e( 'Produtos INTT Mais Vendidos', 'woocommerce-dropshipping' ); ?></h2>
			<div class="gap"></div>
			<?php			
			if ( ! empty( $dashboard_data['best_selling_prod'] ) ) {
				foreach ( $dashboard_data['best_selling_prod'] as $product ) {
					?>
					<div class="product-slide">
						<a href="<?php echo esc_url( $product[3] ); ?>">
							<?php echo $product[2]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> 
							<h3><?php echo esc_html( $product[1] ); ?></h3>
							<span><?php echo esc_html( $product[0] . ' vendidos' ); ?></span>
						</a>
					</div>
				<?php }
			} else {
				echo '<p style="color:#aaa; padding:10px;">Nenhum produto vendido recentemente.</p>';
			} ?>
		</div>
	</div>

	<div class="dash-row">
		<div class="dash-slider">
			<h2 class="white font-28"><?php esc_html_e( 'Produtos com Alerta de Estoque Baixo', 'woocommerce-dropshipping' ); ?></h2>
			<div class="gap-2"></div>
			<?php 
			if ( ! empty( $dashboard_data['low_stocks_prod'] ) ) {
				foreach ( $dashboard_data['low_stocks_prod'] as $product ) { ?>
					<div class="product-slide">
						<a href="<?php echo esc_url( $product[3] ); ?>">
							<?php echo $product[2]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							<h3><?php echo esc_html( $product[1] ); ?></h3>
							<span><?php echo esc_html( $product[0] . ' restantes' ); ?></span>
						</a>
					</div>
				<?php }
			} else {
				echo '<p style="color:#aaa; padding:10px;">Nenhum produto com estoque crítico.</p>';
			} ?>
		</div>
	</div>

	<div class="dash-row">
		<h2 class="white font-40"><?php esc_html_e( 'Central de Atalhos Operacionais', 'woocommerce-dropshipping' ); ?></h2>
	</div>

	<div id="plugin-setup" class="dash-row thirds">
		<div class="metric-box">
			<img loading="lazy" src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/settings.svg' ); ?>" alt="Configurações INTT">
			<h2><?php esc_html_e( 'Configurações White Label', 'woocommerce-dropshipping' ); ?></h2>
			<p class="plugin-setup-desc"><?php esc_html_e( 'Ajuste regras de e-mail, romaneio PDF e precificação.', 'woocommerce-dropshipping' ); ?></p>
			<a href="<?php echo esc_url( function_exists( 'wc_ds_get_settings_admin_url' ) ? wc_ds_get_settings_admin_url( array( 'wc_ds_tab' => 'overview' ) ) : admin_url( 'admin.php?page=wc-settings&tab=wc_dropship_settings' ) ); ?>">
				<?php esc_html_e( 'Acessar Configurações', 'woocommerce-dropshipping' ); ?>
			</a>
		</div>

		<div class="metric-box">
			<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/orders.svg' ); ?>">
			<h2><?php esc_html_e( 'Gestão de Pedidos INTT', 'woocommerce-dropshipping' ); ?></h2>
			<p class="plugin-setup-desc"><?php esc_html_e( 'Visualize e aprove pedidos para liberação na INTT.', 'woocommerce-dropshipping' ); ?></p>
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=wc-orders' ) ); ?>">
				<?php esc_html_e( 'Ver Pedidos WooCommerce', 'woocommerce-dropshipping' ); ?>
			</a>
		</div>

		<div class="metric-box">
			<img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . '../assets/icons/affiliate.svg' ); ?>">
			<h2><?php esc_html_e( 'Fornecedor INTT', 'woocommerce-dropshipping' ); ?></h2>
			<p class="plugin-setup-desc"><?php esc_html_e( 'Gerencie o fornecedor INTT e contatos de despacho.', 'woocommerce-dropshipping' ); ?></p>
			<a href="<?php echo esc_url( admin_url( 'edit-tags.php?taxonomy=dropship_supplier&post_type=product' ) ); ?>">
				<?php esc_html_e( 'Gerenciar Fornecedor', 'woocommerce-dropshipping' ); ?>
			</a>
		</div>
	</div>
</div>
<!-- End of dashboard -->

<?php wp_enqueue_style( 'add_custom_dashboard_style' ); ?>
<?php wp_enqueue_script( 'add_dropshipping_chart_lib' ); ?>
<?php wp_enqueue_script( 'add_custom_dashboard_script' ); ?>
