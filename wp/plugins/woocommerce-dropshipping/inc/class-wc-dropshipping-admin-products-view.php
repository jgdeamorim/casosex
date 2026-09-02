<?php
/**
 * WooCommerce Dropshipping Admin Products View Class
 *
 * Encapsulates products list table enhancements (columns, filters, enqueued styles)
 * adhering to strict WordPress and WooCommerce core standards.
 *
 * @package WooCommerce_Dropshipping
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WC_Dropshipping_Admin_Products_View {

	/**
	 * Single instance of the class.
	 *
	 * @var WC_Dropshipping_Admin_Products_View
	 */
	private static $instance = null;

	/**
	 * Main instance launcher.
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor. Registers all WordPress hooks.
	 */
	public function __construct() {
		add_filter( 'manage_edit-product_columns', array( $this, 'register_custom_product_columns' ), 15 );
		add_action( 'manage_product_posts_custom_column', array( $this, 'render_custom_product_column_content' ), 10, 2 );
		add_action( 'restrict_manage_posts', array( $this, 'add_supplier_filter_dropdown' ) );
		add_action( 'parse_query', array( $this, 'filter_products_by_supplier_query' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_products_styles' ) );
	}

	/**
	 * Enfileira a folha de estilos dedicada da tabela de produtos no WP Admin no padrão nativo do WordPress.
	 *
	 * @param string $hook Sufixo do hook de página do admin.
	 */
	public function enqueue_admin_products_styles( $hook ) {
		if ( 'edit.php' !== $hook ) {
			return;
		}

		$screen = get_current_screen();
		if ( ! $screen || 'product' !== $screen->post_type ) {
			return;
		}

		wp_enqueue_style(
			'wc-dropshipping-admin-products-table',
			plugins_url( '../assets/css/admin-products-table.css', __FILE__ ),
			array(),
			'2.1.5'
		);
	}

	/**
	 * Insere as colunas customizadas do INTT White Label na tabela de produtos admin.
	 *
	 * @param array $columns Colunas existentes.
	 * @return array Colunas reordenadas.
	 */
	public function register_custom_product_columns( $columns ) {
		$new_columns = array();

		foreach ( $columns as $key => $column ) {
			$new_columns[ $key ] = $column;

			if ( 'name' === $key ) {
				$new_columns['supplier_freight'] = __( 'Fornecedor & Frete', 'woocommerce-dropshipping' );
			}
			if ( 'price' === $key ) {
				$new_columns['cost_margin']     = __( 'Custo & Margem', 'woocommerce-dropshipping' );
				$new_columns['fiscal_data']     = __( 'Dados Fiscais', 'woocommerce-dropshipping' );
				$new_columns['curation_status'] = __( 'Status Curadoria', 'woocommerce-dropshipping' );
			}
		}

		return $new_columns;
	}

	/**
	 * Renderiza o conteúdo das colunas personalizadas.
	 *
	 * @param string $column  Identificador da coluna.
	 * @param int    $post_id ID do produto/post.
	 */
	public function render_custom_product_column_content( $column, $post_id ) {
		switch ( $column ) {
			case 'supplier_freight':
				$terms = get_the_terms( $post_id, 'dropship_supplier' );
				if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
					$supplier_names = wp_list_pluck( $terms, 'name' );
					echo '<div style="font-weight:600; color:#1e293b; font-size:12px;">' . esc_html( implode( ', ', $supplier_names ) ) . '</div>';
				} else {
					echo '<div style="color:#64748b; font-size:11px;">INTT Dropshipping Nacional</div>';
				}

				$shipping_class_id = get_post_meta( $post_id, '_shipping_class_id', true );
				if ( $shipping_class_id ) {
					$term = get_term_by( 'id', $shipping_class_id, 'product_shipping_class' );
					if ( $term ) {
						echo '<div style="font-size:11px; color:#475569; margin-top:2px;">🚚 ' . esc_html( $term->name ) . '</div>';
					}
				} else {
					echo '<div style="font-size:11px; color:#475569; margin-top:2px;">🚚 Dropshipping INTT (Lençóis Paulista - SP)</div>';
				}
				break;

			case 'cost_margin':
				$cost  = get_post_meta( $post_id, 'wholesale_price', true );
				$price = get_post_meta( $post_id, '_price', true );

				if ( '' !== $cost && numeric_check( $cost ) ) {
					$cost_val  = floatval( $cost );
					$price_val = floatval( $price );

					echo '<div style="font-size:12px; font-weight:600; color:#1e293b;">Custo: R$ ' . esc_html( number_format( $cost_val, 2, ',', '.' ) ) . '</div>';

					if ( $price_val > 0 ) {
						$margin     = $price_val - $cost_val;
						$margin_pct = ( $margin / $price_val ) * 100;
						$color      = $margin >= 0 ? '#166534' : '#991b1b';
						echo '<div style="font-size:11px; font-weight:600; color:' . esc_attr( $color ) . '; margin-top:2px;">Margem: R$ ' . esc_html( number_format( $margin, 2, ',', '.' ) ) . ' (' . esc_html( number_format( $margin_pct, 1, ',', '.' ) ) . '%)</div>';
					}
				} else {
					echo '<span style="color:#9ca3af; font-size:11px;">–</span>';
				}
				break;

			case 'fiscal_data':
				$ncm = get_post_meta( $post_id, '_ncm', true );
				$gtin = get_post_meta( $post_id, '_gtin', true );
				if ( ! $gtin ) {
					$gtin = get_post_meta( $post_id, '_barcode', true );
				}

				$ncm_str  = $ncm ? esc_html( $ncm ) : '<span style="color:#9ca3af;">-</span>';
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
	 *
	 * @param string $post_type Tipo de post atual.
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

		$current_supplier = isset( $_GET['filter_dropship_supplier'] ) ? sanitize_text_field( wp_unslash( $_GET['filter_dropship_supplier'] ) ) : '';

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
	 *
	 * @param WP_Query $query Objeto de query do WordPress.
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
			$supplier_slug = sanitize_text_field( wp_unslash( $_GET['filter_dropship_supplier'] ) );
			$tax_query     = (array) $query->get( 'tax_query' );

			$tax_query[] = array(
				'taxonomy' => 'dropship_supplier',
				'field'    => 'slug',
				'terms'    => $supplier_slug,
			);

			$query->set( 'tax_query', $tax_query );
		}
	}
}

/**
 * Função auxiliar para validação numérica de string ou float.
 *
 * @param mixed $val Valor.
 * @return bool
 */
if ( ! function_exists( 'numeric_check' ) ) {
	function numeric_check( $val ) {
		return is_numeric( $val );
	}
}
