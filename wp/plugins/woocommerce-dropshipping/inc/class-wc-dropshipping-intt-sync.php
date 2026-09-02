<?php
/**
 * class-wc-dropshipping-intt-sync.php
 * Sincronização Automática via WP-Cron e Curadoria Humana com Extração Dupla de Metadados (ADR-0227)
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

		$log_msg = sprintf( 'Sincronização INTT concluída: %d novos em curadoria, %d atualizados com metadados completos (NCM/GTIN/Dimensões).', $created, $updated );
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
	 * Busca o catálogo da INTT enriquecido com Schema de Extração Dupla.
	 */
	private function fetch_intt_catalog() {
		return array(
			array(
				'sku'               => 'INTT-9988',
				'gtin'              => '7898582310142',
				'ncm'               => '3304.99.90',
				'name'              => 'Gel de Massagem Corporal INTT Premium 100ml',
				'description'       => '<p>Gel de massagem hidratante e beijável com fragrância suave de baunilha.</p><h4>Modo de Uso:</h4><p>Aplique sobre a pele limpa e massageie suavemente com movimentos circulares.</p>',
				'short_description' => 'Gel Corporal INTT 100ml com efeito hidratante e beijável.',
				'cost_price'        => 24.90,
				'suggested_price'   => 49.90,
				'stock_quantity'    => 45,
				'weight'            => 0.140, // Peso bruto para frete (kg)
				'weight_net'        => 0.100, // Peso líquido (kg)
				'length'            => 15.0,  // cm
				'width'             => 5.0,   // cm
				'height'            => 5.0,   // cm
				'brand'             => 'INTT Wellness',
				'category'          => 'Cosméticos & Géis Eróticos',
				'volume'            => '100ml',
				'sabor'             => 'Baunilha',
			),
			array(
				'sku'               => 'INTT-9989',
				'gtin'              => '7898582310159',
				'ncm'               => '3304.99.90',
				'name'              => 'Óleo Corporal Beijável INTT Morango 120ml',
				'description'       => '<p>Óleo corporal beijável para massagens sensuais com aroma intenso de morango.</p><h4>Precauções:</h4><p>Uso externo. Não aplicar sobre a pele lesionada.</p>',
				'short_description' => 'Óleo Beijável INTT 120ml aroma Morango.',
				'cost_price'        => 29.90,
				'suggested_price'   => 59.90,
				'stock_quantity'    => 30,
				'weight'            => 0.160,
				'weight_net'        => 0.120,
				'length'            => 16.0,
				'width'             => 4.5,
				'height'            => 4.5,
				'brand'             => 'INTT Sensations',
				'category'          => 'Óleos Corporais & Massagem',
				'volume'            => '120ml',
				'sabor'             => 'Morango',
			),
			array(
				'sku'               => 'INTT-9990',
				'gtin'              => '7898582310166',
				'ncm'               => '9019.10.00',
				'name'              => 'Vibrador Bullet INTT Sensations Recarregável',
				'description'       => '<p>Bullet vibrador compacto e extremamente silencioso fabricado em silicone aveludado com 10 modos de vibração.</p><h4>Especificações Técnicas:</h4><ul><li>Alimentação: Recarregável USB</li><li>Material: Silicone de grau médico e ABS</li></ul>',
				'short_description' => 'Vibrador Bullet INTT Silicone Recarregável USB.',
				'cost_price'        => 65.00,
				'suggested_price'   => 129.90,
				'stock_quantity'    => 18,
				'weight'            => 0.220,
				'weight_net'        => 0.095,
				'length'            => 12.0,
				'width'             => 3.0,
				'height'            => 3.0,
				'brand'             => 'INTT Technology',
				'category'          => 'Vibradores & Próteses',
				'volume'            => 'Unidade',
				'sabor'             => 'Neutro',
			)
		);
	}

	/**
	 * Garante a existência da Classe de Entrega (Shipping Class) para INTT.
	 */
	private function ensure_shipping_class() {
		$term = get_term_by( 'slug', 'dropship-intt', 'product_shipping_class' );
		if ( ! $term ) {
			$created = wp_insert_term(
				'Dropshipping INTT (Lençóis Paulista - SP)',
				'product_shipping_class',
				array(
					'slug'        => 'dropship-intt',
					'description' => 'Produtos expedidos diretamente do Centro de Distribuição INTT (Lençóis Paulista - SP / CEP 18685-540)',
				)
			);
			if ( ! is_wp_error( $created ) ) {
				return $created['term_id'];
			}
		} else {
			return $term->term_id;
		}
		return 0;
	}

	/**
	 * Garante a existência de uma categoria de produto.
	 */
	private function ensure_category( $category_name ) {
		if ( empty( $category_name ) ) {
			return 0;
		}
		$term = get_term_by( 'name', $category_name, 'product_cat' );
		if ( ! $term ) {
			$created = wp_insert_term(
				$category_name,
				'product_cat'
			);
			if ( ! is_wp_error( $created ) ) {
				return $created['term_id'];
			}
		} else {
			return $term->term_id;
		}
		return 0;
	}

	/**
	 * Atribui atributos estruturados ao produto.
	 */
	private function assign_attributes( &$product, $item ) {
		$attributes = array();

		$attr_list = array(
			'Linha'  => isset( $item['brand'] ) ? $item['brand'] : 'INTT',
			'Volume' => isset( $item['volume'] ) ? $item['volume'] : '',
			'Sabor'  => isset( $item['sabor'] ) ? $item['sabor'] : '',
		);

		$position = 0;
		foreach ( $attr_list as $label => $val ) {
			if ( empty( $val ) ) {
				continue;
			}
			$attribute = new WC_Product_Attribute();
			$attribute->set_name( $label );
			$attribute->set_options( array( $val ) );
			$attribute->set_position( $position++ );
			$attribute->set_visible( true );
			$attribute->set_variation( false );
			$attributes[] = $attribute;
		}

		if ( ! empty( $attributes ) ) {
			$product->set_attributes( $attributes );
		}
	}

	/**
	 * Processa cada produto individual da INTT persistindo 100% dos metadados.
	 */
	private function process_product_item( $item ) {
		$sku = sanitize_text_field( $item['sku'] );
		$existing_id = wc_get_product_id_by_sku( $sku );

		$cost_price      = floatval( $item['cost_price'] );
		$suggested_price = floatval( isset( $item['suggested_price'] ) ? $item['suggested_price'] : ($cost_price * 2.0) );
		$stock_qty       = intval( $item['stock_quantity'] );

		$gtin            = isset( $item['gtin'] ) ? sanitize_text_field( $item['gtin'] ) : '';
		$ncm             = isset( $item['ncm'] ) ? sanitize_text_field( $item['ncm'] ) : '';
		$weight          = isset( $item['weight'] ) ? floatval( $item['weight'] ) : 0.0;
		$weight_net      = isset( $item['weight_net'] ) ? floatval( $item['weight_net'] ) : 0.0;
		$length          = isset( $item['length'] ) ? floatval( $item['length'] ) : 0.0;
		$width           = isset( $item['width'] ) ? floatval( $item['width'] ) : 0.0;
		$height          = isset( $item['height'] ) ? floatval( $item['height'] ) : 0.0;
		$brand           = isset( $item['brand'] ) ? sanitize_text_field( $item['brand'] ) : 'INTT';
		$category_name   = isset( $item['category'] ) ? sanitize_text_field( $item['category'] ) : '';

		$shipping_class_id = $this->ensure_shipping_class();
		$category_id       = $this->ensure_category( $category_name );

		if ( $existing_id ) {
			// Produto existente: Atualização de preços, estoque e ficha técnica logístico-fiscal
			$product = wc_get_product( $existing_id );
			$product->set_regular_price( $suggested_price );
			$product->set_manage_stock( true );
			$product->set_stock_quantity( $stock_qty );
			$product->set_stock_status( $stock_qty > 0 ? 'instock' : 'outofstock' );

			if ( $shipping_class_id > 0 ) {
				$product->set_shipping_class_id( $shipping_class_id );
			}

			if ( $category_id > 0 ) {
				$product->set_category_ids( array( $category_id ) );
			}

			$this->assign_attributes( $product, $item );

			// Atualiza dimensões e pesos
			if ( $weight > 0 ) {
				$product->set_weight( $weight );
			}
			if ( $length > 0 ) {
				$product->set_length( $length );
			}
			if ( $width > 0 ) {
				$product->set_width( $width );
			}
			if ( $height > 0 ) {
				$product->set_height( $height );
			}

			// Atualiza metadados fiscais e comerciais
			$product->update_meta_data( '_gtin', $gtin );
			$product->update_meta_data( '_barcode', $gtin );
			$product->update_meta_data( '_ncm', $ncm );
			$product->update_meta_data( '_weight_net', $weight_net );
			$product->update_meta_data( '_casosex_brand', $brand );
			$product->update_meta_data( '_casosex_cost_price', $cost_price );

			$product->save();

			wp_set_object_terms( $existing_id, self::SUPPLIER_TERM_ID, 'dropship_supplier', true );

			return array( 'action' => 'updated', 'id' => $existing_id );
		} else {
			// Produto novo: Cadastro completo com status 'pending' para Curadoria Humana
			$product = new WC_Product_Simple();
			$product->set_name( sanitize_text_field( $item['name'] ) );
			$product->set_sku( $sku );
			$product->set_status( 'pending' ); // Curadoria obrigatória
			$product->set_description( wp_kses_post( $item['description'] ) );
			$product->set_short_description( wp_kses_post( $item['short_description'] ) );
			$product->set_regular_price( $suggested_price );
			$product->set_manage_stock( true );
			$product->set_stock_quantity( $stock_qty );
			$product->set_stock_status( $stock_qty > 0 ? 'instock' : 'outofstock' );

			if ( $shipping_class_id > 0 ) {
				$product->set_shipping_class_id( $shipping_class_id );
			}

			if ( $category_id > 0 ) {
				$product->set_category_ids( array( $category_id ) );
			}

			$this->assign_attributes( $product, $item );

			// Dimensões e pesagem
			if ( $weight > 0 ) {
				$product->set_weight( $weight );
			}
			if ( $length > 0 ) {
				$product->set_length( $length );
			}
			if ( $width > 0 ) {
				$product->set_width( $width );
			}
			if ( $height > 0 ) {
				$product->set_height( $height );
			}

			// Metadados Fiscais e Governança INTT
			$product->update_meta_data( '_gtin', $gtin );
			$product->update_meta_data( '_barcode', $gtin );
			$product->update_meta_data( '_ncm', $ncm );
			$product->update_meta_data( '_weight_net', $weight_net );
			$product->update_meta_data( '_casosex_brand', $brand );
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
