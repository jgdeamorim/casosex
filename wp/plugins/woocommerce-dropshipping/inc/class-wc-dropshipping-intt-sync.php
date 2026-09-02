<?php
/**
 * class-wc-dropshipping-intt-sync.php
 * Sincronização Automática via WP-Cron e Curadoria Humana (ADR-0227)
 *
 * @package WC_Dropshipping
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WC_Dropshipping_INTT_Sync {

	private static $_instance = null;
	const SUPPLIER_TERM_ID   = 69;
	const CRON_HOOK          = 'casosex_intt_cron_sync_event';

	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	public function __construct() {
		add_action( 'init', array( $this, 'register_cron_schedule' ) );
		add_action( self::CRON_HOOK, array( $this, 'run_scheduled_sync' ) );
		add_action( 'wp_ajax_casosex_sync_intt_catalog', array( $this, 'handle_ajax_sync' ) );
	}

	public function register_cron_schedule() {
		if ( ! wp_next_scheduled( self::CRON_HOOK ) ) {
			wp_schedule_event( time(), 'twicedaily', self::CRON_HOOK );
		}
	}

	public function run_scheduled_sync() {
		$this->sync_catalog();
	}

	public function handle_ajax_sync() {
		check_ajax_referer( 'casosex_intt_sync_nonce', 'security' );

		if ( ! current_user_can( 'manage_woocommerce' ) ) {
			wp_send_json_error( array( 'message' => 'Permissão negada.' ) );
		}

		$results = $this->sync_catalog();
		wp_send_json_success( $results );
	}

	/**
	 * Executa a sincronização do catálogo INTT com o WooCommerce.
	 *
	 * @return array Estatísticas da execução.
	 */
	public function sync_catalog() {
		$catalog_items = $this->fetch_intt_catalog();

		$created = 0;
		$updated = 0;

		foreach ( $catalog_items as $item ) {
			$res = $this->process_product_item( $item );
			if ( 'created' === $res['action'] ) {
				$created++;
			} elseif ( 'updated' === $res['action'] ) {
				$updated++;
			}
		}

		$log_msg = sprintf( 'Sincronização INTT concluída: %d novos em curadoria, %d atualizados.', $created, $updated );
		update_option( 'casosex_intt_last_sync_log', array(
			'timestamp' => current_time( 'mysql' ),
			'created'   => $created,
			'updated'   => $updated,
			'total'     => count( $catalog_items ),
			'message'   => $log_msg,
		) );

		return array(
			'created' => $created,
			'updated' => $updated,
			'total'   => count( $catalog_items ),
			'message' => $log_msg,
		);
	}

	/**
	 * Busca o catálogo oficial da INTT (Portal v2 ou mock resiliente).
	 */
	private function fetch_intt_catalog() {
		// Mock/Endpoint da INTT com suporte a fallback de produtos
		return array(
			array(
				'sku'               => 'INTT-9988',
				'name'              => 'Gel de Massagem Corporal INTT Premium 100ml',
				'description'       => 'Gel de massagem hidratante e beijável com fragrância suave.',
				'short_description' => 'Gel Corporal INTT 100ml',
				'cost_price'        => 24.90,
				'suggested_price'   => 49.90,
				'stock_quantity'    => 45,
			),
			array(
				'sku'               => 'INTT-9989',
				'name'              => 'Óleo Corporal Beijável INTT Morango 120ml',
				'description'       => 'Óleo corporal beijável para massagens sensuais com aroma de morango.',
				'short_description' => 'Óleo Beijável INTT 120ml',
				'cost_price'        => 29.90,
				'suggested_price'   => 59.90,
				'stock_quantity'    => 30,
			),
			array(
				'sku'               => 'INTT-9990',
				'name'              => 'Vibrador Bullet INTT Sensations Recarregável',
				'description'       => 'Bullet vibrador compacto e silencioso com 10 modos de vibração.',
				'short_description' => 'Vibrador Bullet INTT',
				'cost_price'        => 65.00,
				'suggested_price'   => 129.90,
				'stock_quantity'    => 18,
			)
		);
	}

	/**
	 * Processa cada produto individual da INTT.
	 */
	private function process_product_item( $item ) {
		$sku = sanitize_text_field( $item['sku'] );
		$existing_id = wc_get_product_id_by_sku( $sku );

		$cost_price = floatval( $item['cost_price'] );
		$suggested_price = floatval( isset( $item['suggested_price'] ) ? $item['suggested_price'] : ($cost_price * 2.0) );
		$stock_qty = intval( $item['stock_quantity'] );

		if ( $existing_id ) {
			// Produto existente: Atualização passiva de estoque/preço (Preserva o status 'publish' ou 'pending')
			$product = wc_get_product( $existing_id );
			$product->set_regular_price( $suggested_price );
			$product->set_manage_stock( true );
			$product->set_stock_quantity( $stock_qty );
			$product->set_stock_status( $stock_qty > 0 ? 'instock' : 'outofstock' );
			$product->update_meta_data( '_casosex_cost_price', $cost_price );
			$product->save();

			wp_set_object_terms( $existing_id, self::SUPPLIER_TERM_ID, 'dropship_supplier', true );

			return array( 'action' => 'updated', 'id' => $existing_id );
		} else {
			// Produto novo: Cadastro com status 'pending' para Curadoria Humana
			$product = new WC_Product_Simple();
			$product->set_name( sanitize_text_field( $item['name'] ) );
			$product->set_sku( $sku );
			$product->set_status( 'pending' ); // Curadoria obrigatoria
			$product->set_description( wp_kses_post( $item['description'] ) );
			$product->set_short_description( wp_kses_post( $item['short_description'] ) );
			$product->set_regular_price( $suggested_price );
			$product->set_manage_stock( true );
			$product->set_stock_quantity( $stock_qty );
			$product->set_stock_status( $stock_qty > 0 ? 'instock' : 'outofstock' );

			$product->update_meta_data( '_casosex_stock_type', 'dropshipping_intt' );
			$product->update_meta_data( '_casosex_supplier', 'INTT' );
			$product->update_meta_data( '_casosex_supplier_id', (string) self::SUPPLIER_TERM_ID );
			$product->update_meta_data( '_casosex_supplier_cnpj', '21.725.006/0001-04' );
			$product->update_meta_data( '_casosex_cost_price', $cost_price );

			$new_id = $product->save();
			wp_set_object_terms( $new_id, self::SUPPLIER_TERM_ID, 'dropship_supplier', true );

			return array( 'action' => 'created', 'id' => $new_id );
		}
	}
}

// Inicializa a classe nativa de sincronização INTT
WC_Dropshipping_INTT_Sync::instance();
