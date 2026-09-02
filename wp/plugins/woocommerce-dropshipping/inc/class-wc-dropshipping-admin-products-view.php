<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WC_Dropshipping_Admin_Products_View {

	private static $instance = null;

	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function __construct() {
		if ( ! is_admin() ) {
			return;
		}

		add_filter( 'manage_edit-product_columns', array( $this, 'add_custom_product_columns' ), 20 );
		add_filter( 'manage_edit-product_columns', array( $this, 'sanitize_product_columns' ), 99999 );
		add_action( 'manage_product_posts_custom_column', array( $this, 'render_custom_product_column_content' ), 10, 2 );
		add_action( 'restrict_manage_posts', array( $this, 'add_supplier_filter_dropdown' ) );
		add_action( 'parse_query', array( $this, 'filter_products_by_supplier_query' ) );
		add_action( 'admin_head', array( $this, 'inject_admin_styles' ) );
	}

	/**
	 * Sanitiza as colunas da tabela para eliminar duplicidades e redundâncias.
	 */
	public function sanitize_product_columns( $columns ) {
		unset( $columns['est_profit'] );
		unset( $columns['taxonomy-dropship_supplier'] );
		return $columns;
	}

	/**
	 * Injeta colunas de governança B2B / Dropshipping na tabela de produtos.
	 */
	public function add_custom_product_columns( $columns ) {
		$new_columns = array();

		foreach ( $columns as $key => $title ) {
			if ( 'est_profit' === $key || 'taxonomy-dropship_supplier' === $key ) {
				continue;
			}

			$new_columns[ $key ] = $title;

			// Insere a coluna Fornecedor & Frete após a coluna 'name'
			if ( 'name' === $key ) {
				$new_columns['supplier_freight'] = __( 'Fornecedor & Frete', 'woocommerce-dropshipping' );
			}

			// Insere as colunas Fiscais e Financeiras após 'price'
			if ( 'price' === $key ) {
				$new_columns['cost_margin'] = __( 'Custo & Margem', 'woocommerce-dropshipping' );
				$new_columns['fiscal_data'] = __( 'Dados Fiscais', 'woocommerce-dropshipping' );
				$new_columns['curation_status'] = __( 'Status Curadoria', 'woocommerce-dropshipping' );
			}
		}

		unset( $new_columns['est_profit'] );
		unset( $new_columns['taxonomy-dropship_supplier'] );

		return $new_columns;
	}

	/**
	 * Renderiza o conteúdo das células das colunas personalizadas.
	 */
	public function render_custom_product_column_content( $column, $post_id ) {
		$product = wc_get_product( $post_id );
		if ( ! $product ) {
			return;
		}

		switch ( $column ) {
			case 'supplier_freight':
				$terms = get_the_terms( $post_id, 'dropship_supplier' );
				$supplier_html = '<span style="color:#6b7280; font-size:11px;">Estoque Próprio</span>';

				if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
					$supplier_names = array();
					foreach ( $terms as $term ) {
						$supplier_names[] = esc_html( $term->name );
					}
					$supplier_html = '<span style="background:#7f54b3; color:#fff; padding:2px 8px; border-radius:4px; font-weight:600; font-size:11px; display:inline-block; margin-bottom:4px;">' . implode( ', ', $supplier_names ) . '</span>';
				}

				$shipping_class_id = $product->get_shipping_class_id();
				$sc_term = $shipping_class_id ? get_term( $shipping_class_id, 'product_shipping_class' ) : false;
				$sc_name = ( $sc_term && ! is_wp_error( $sc_term ) ) ? esc_html( $sc_term->name ) : 'Padrão';

				echo '<div style="line-height:1.3;">';
				echo $supplier_html . '<br>';
				echo '<span style="color:#4b5563; font-size:11px;">🚚 ' . $sc_name . '</span>';
				echo '</div>';
				break;

			case 'cost_margin':
				$cost_price = get_post_meta( $post_id, '_casosex_cost_price', true );
				$sale_price = $product->get_price();

				if ( '' === $cost_price || false === $cost_price ) {
					echo '<span style="color:#9ca3af; font-size:11px;">Não informado</span>';
					break;
				}

				$cost_val = floatval( $cost_price );
				$sale_val = floatval( $sale_price );

				echo '<div style="font-size:11px; line-height:1.4;">';
				echo '<span style="color:#4b5563;">Custo: <strong>R$ ' . number_format( $cost_val, 2, ',', '.' ) . '</strong></span><br>';

				if ( $sale_val > 0 && $cost_val > 0 ) {
					$profit = $sale_val - $cost_val;
					$margin_pct = ( $profit / $sale_val ) * 100;

					$color = '#b91c1c'; // Vermelho < 20%
					if ( $margin_pct >= 40 ) {
						$color = '#15803d'; // Verde >= 40%
					} elseif ( $margin_pct >= 20 ) {
						$color = '#b45309'; // Amarelo 20-39%
					}

					echo '<span style="color:' . $color . '; font-weight:600;">Margem: R$ ' . number_format( $profit, 2, ',', '.' ) . ' (' . number_format( $margin_pct, 1, ',', '.' ) . '%)</span>';
				} else {
					echo '<span style="color:#9ca3af;">Sem preço venda</span>';
				}
				echo '</div>';
				break;

			case 'fiscal_data':
				$ncm = get_post_meta( $post_id, '_ncm', true );
				if ( ! $ncm ) {
					$ncm = get_post_meta( $post_id, '_ncm_code', true );
				}
				$gtin = get_post_meta( $post_id, '_gtin', true );
				if ( ! $gtin ) {
					$gtin = get_post_meta( $post_id, '_barcode', true );
				}

				$ncm_str = $ncm ? esc_html( $ncm ) : '<span style="color:#9ca3af;">-</span>';
				$gtin_str = $gtin ? esc_html( $gtin ) : '<span style="color:#9ca3af;">-</span>';

				echo '<div style="font-size:11px; line-height:1.4; color:#374151;">';
				echo '<strong>NCM:</strong> ' . $ncm_str . '<br>';
				echo '<strong>GTIN:</strong> ' . $gtin_str;
				echo '</div>';
				break;

			case 'curation_status':
				$post_status = get_post_status( $post_id );

				if ( 'pending' === $post_status ) {
					echo '<span style="background:#fef3c7; color:#92400e; border:1px solid #fcd34d; padding:3px 8px; border-radius:12px; font-weight:600; font-size:11px; display:inline-block;">🟡 Curadoria Pendente</span>';
				} elseif ( 'publish' === $post_status ) {
					echo '<span style="background:#dcfce7; color:#166534; border:1px solid #86efac; padding:3px 8px; border-radius:12px; font-weight:600; font-size:11px; display:inline-block;">🟢 Publicado</span>';
				} elseif ( 'draft' === $post_status ) {
					echo '<span style="background:#f3f4f6; color:#374151; border:1px solid #d1d5db; padding:3px 8px; border-radius:12px; font-weight:600; font-size:11px; display:inline-block;">⚪ Rascunho</span>';
				} else {
					echo '<span style="color:#6b7280; font-size:11px;">' . esc_html( ucfirst( $post_status ) ) . '</span>';
				}
				break;
		}
	}

	/**
	 * Adiciona o dropdown de filtro por fornecedor na barra de filtros da tabela de produtos.
	 */
	public function add_supplier_filter_dropdown( $post_type ) {
		if ( 'product' !== $post_type ) {
			return;
		}

		$terms = get_terms( array(
			'taxonomy'   => 'dropship_supplier',
			'hide_empty' => false,
		) );

		if ( empty( $terms ) || is_wp_error( $terms ) ) {
			return;
		}

		$current_supplier = isset( $_GET['filter_dropship_supplier'] ) ? sanitize_text_field( $_GET['filter_dropship_supplier'] ) : '';

		echo '<select name="filter_dropship_supplier" id="filter_dropship_supplier">';
		echo '<option value="">' . esc_html__( 'Todos os Fornecedores', 'woocommerce-dropshipping' ) . '</option>';
		foreach ( $terms as $term ) {
			$selected = ( $current_supplier === $term->slug ) ? ' selected="selected"' : '';
			echo '<option value="' . esc_attr( $term->slug ) . '"' . $selected . '>' . esc_html( $term->name ) . '</option>';
		}
		echo '</select>';
	}

	/**
	 * Filtra a query de produtos no WP Admin de acordo com a escolha do fornecedor.
	 */
	public function filter_products_by_supplier_query( $query ) {
		global $pagenow;

		if ( ! is_admin() || 'edit.php' !== $pagenow || ! $query->is_main_query() ) {
			return;
		}

		if ( 'product' !== $query->get( 'post_type' ) ) {
			return;
		}

		if ( ! empty( $_GET['filter_dropship_supplier'] ) ) {
			$supplier_slug = sanitize_text_field( $_GET['filter_dropship_supplier'] );
			$tax_query = (array) $query->get( 'tax_query' );

			$tax_query[] = array(
				'taxonomy' => 'dropship_supplier',
				'field'    => 'slug',
				'terms'    => $supplier_slug,
			);

			$query->set( 'tax_query', $tax_query );
		}
	}

	/**
	 * Injeta estilos CSS para ajustar as larguras e alinhamentos das colunas.
	 */
	public function inject_admin_styles() {
		$screen = get_current_screen();
		if ( ! $screen || 'edit-product' !== $screen->id ) {
			return;
		}
		?>
		<style type="text/css">
			/* Container de rolagem horizontal nativo e fluído */
			#posts-filter {
				overflow-x: auto !important;
				max-width: 100% !important;
				padding-bottom: 15px;
			}

			/* Tabela de produtos com layout automático expansível */
			body.post-type-product table.wp-list-table.products {
				table-layout: auto !important;
				width: 100% !important;
				min-width: 1500px !important;
			}

			/* Prevenção absoluta contra quebra vertical de texto em todas as células e links da tabela */
			body.post-type-product table.wp-list-table.products th,
			body.post-type-product table.wp-list-table.products td,
			body.post-type-product table.wp-list-table.products th *,
			body.post-type-product table.wp-list-table.products td * {
				white-space: nowrap !important;
				word-break: normal !important;
				word-wrap: normal !important;
				overflow-wrap: normal !important;
				hyphens: manual !important;
			}

			/* Apenas o Título do Produto pode ter quebra de linha normal */
			body.post-type-product table.wp-list-table.products .column-name,
			body.post-type-product table.wp-list-table.products .column-name *,
			body.post-type-product table.wp-list-table.products .column-name a {
				white-space: normal !important;
				word-break: break-word !important;
				min-width: 220px !important;
				max-width: 320px !important;
			}

			/* Alinhamentos e espaçamento das células */
			body.post-type-product table.wp-list-table.products td,
			body.post-type-product table.wp-list-table.products th {
				vertical-align: middle !important;
				padding: 10px 12px !important;
			}

			/* Ocultação forçada das colunas legadas indesejadas */
			body.post-type-product .column-est_profit,
			body.post-type-product .column-taxonomy-dropship_supplier {
				display: none !important;
			}
		</style>
		<?php
	}
}
