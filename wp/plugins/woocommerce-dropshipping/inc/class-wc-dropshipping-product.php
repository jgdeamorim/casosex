<?php
class WC_Dropshipping_Product {

	/**
	 * Prevent duplicate cell output when multiple HPOS column actions fire.
	 *
	 * @var array
	 */
	private static $rendered_supplier_cells = array();

	public function __construct() {

		// admin for product edit
		add_action( 'init', array( $this, 'check_deleted_supplier' ) );
		add_action( 'add_meta_boxes', array( $this, 'add_dropshipper_metaboxes_in_orders' ) );
		add_action( 'add_meta_boxes', array( $this, 'dropship_supplier_meta_box' ) );
		add_action( 'save_post_product', array( $this, 'save_supplier_name' ), 100, 1 );
		add_action( 'woocommerce_before_order_itemmeta', array( $this, 'supplier_name_order_page' ), 10, 3 );
		add_filter( 'handle_bulk_actions-edit-product', array( $this, 'assign_bulk_supplier' ), 10, 3 );

		// Orders list columns: classic CPT + HPOS.
		$this->register_orders_list_column_hooks();
	}

	/**
	 * Register supplier column on classic and HPOS orders list tables.
	 */
	private function register_orders_list_column_hooks() {
		// Classic CPT orders list.
		add_filter( 'manage_edit-shop_order_columns', array( $this, 'wc_new_supplier_column' ), 20 );
		add_action( 'manage_shop_order_posts_custom_column', array( $this, 'supplier_value' ), 20, 2 );

		// HPOS: screen-based manage_* hooks.
		add_filter( 'manage_woocommerce_page_wc-orders_columns', array( $this, 'wc_new_supplier_column' ), 20 );
		add_action( 'manage_woocommerce_page_wc-orders_custom_column', array( $this, 'supplier_value_hpos' ), 20, 2 );

		// HPOS: WooCommerce list-table dedicated hooks (some WC versions fire these as well).
		add_filter( 'woocommerce_shop_order_list_table_columns', array( $this, 'wc_new_supplier_column' ), 20 );
		add_action( 'woocommerce_shop_order_list_table_custom_column', array( $this, 'supplier_value_hpos' ), 20, 2 );
	}

	public function add_dropshipper_metaboxes_in_orders() {
		if ( function_exists( 'opmc_hpos_add_meta_box' ) ) {
			opmc_hpos_add_meta_box( 'wpt_dropshipper_list', 'Shipping details', array( $this, 'print_dropshipper_list_metabox_in_orders' ), 'shop_order', 'side', 'default' );
		} else {
			add_meta_box( 'wpt_dropshipper_list', 'Shipping details', array( $this, 'print_dropshipper_list_metabox_in_orders' ), 'shop_order', 'side', 'default' );
		}
	}

	/**
	 * Resolve WC_Order from classic post screen or HPOS order screen.
	 *
	 * @param WP_Post|WC_Order|null $post_or_order_object Metabox subject.
	 * @return WC_Order|false
	 */
	private function get_order_from_admin_context( $post_or_order_object = null ) {
		if ( $post_or_order_object instanceof WC_Order ) {
			return $post_or_order_object;
		}

		if ( $post_or_order_object instanceof WP_Post ) {
			return wc_get_order( $post_or_order_object->ID );
		}

		global $post, $theorder;
		if ( isset( $theorder ) && $theorder instanceof WC_Order ) {
			return $theorder;
		}
		if ( isset( $post->ID ) ) {
			return wc_get_order( $post->ID );
		}

		return false;
	}

	/**
	 * Read supplier term id from an order line item (HPOS-safe, with legacy fallback).
	 *
	 * @param WC_Order_Item_Product $item Order item.
	 * @param int                   $item_id Item id.
	 * @return int
	 */
	private function get_order_item_supplier_id( $item, $item_id ) {
		$supplier_id = 0;
		if ( is_callable( array( $item, 'get_meta' ) ) ) {
			$supplier_id = absint( $item->get_meta( 'supplierid', true ) );
		}
		if ( ! $supplier_id && function_exists( 'wc_get_order_item_meta' ) ) {
			$supplier_id = absint( wc_get_order_item_meta( $item_id, 'supplierid', true ) );
		}
		if ( ! $supplier_id ) {
			// Legacy storage used post meta keyed by order item id.
			$supplier_id = absint( get_post_meta( $item_id, 'supplierid', true ) );
		}
		return $supplier_id;
	}

	/* ADD METABOX WITH DROPSHIPPER STATUSES IN ADMIN ORDERS */

	public function print_dropshipper_list_metabox_in_orders( $post_or_order_object = null ) {

		$order = $this->get_order_from_admin_context( $post_or_order_object );
		if ( ! $order ) {
			return;
		}

		$order_id = $order->get_id();
		$items = $order->get_items();
		$arrayuser = array();
		$order_status = $order->get_status();
		$suppliers_attached = array();

		foreach ( $items as $item_id => $item ) {

			if ( ! $item instanceof WC_Order_Item_Product ) {
				continue;
			}

			$supplier_id = $this->get_order_item_supplier_id( $item, $item_id );
			if ( ! $supplier_id ) {
				$supplier_id = absint( get_post_meta( $item->get_product_id(), 'supplierid', true ) );
			}

			$arg = array(
				'meta_key'    => 'supplier_id',
				'meta_value'    => $supplier_id,
			);

			$user_query = new WP_User_Query( $arg );
			$authors = $user_query->get_results();

			foreach ( $authors as $author ) {
				$arrayuser[] = $author->ID;
			}

			array_push( $suppliers_attached, $supplier_id );
		}

		$uniqe_userid = array_unique( $arrayuser );

		if ( 'on-hold' == $order_status ) {

			echo 'On hold orders are not yet processed to the suppliers';

		} else {

			foreach ( $uniqe_userid as $key => $value ) {

				$dropshipper_shipping_info = function_exists( 'opmc_hpos_get_post_meta' )
					? opmc_hpos_get_post_meta( $order_id, 'dropshipper_shipping_info_' . $value )
					: get_post_meta( $order_id, 'dropshipper_shipping_info_' . $value, true );
				$supplier_id = get_user_meta( $value, 'supplier_id', true );
				$term = get_term_by( 'id', $supplier_id, 'dropship_supplier' );

				if ( in_array( $supplier_id, $suppliers_attached ) ) {
					if ( ! empty( $term->name ) ) {
						if ( empty( $dropshipper_shipping_info ) ) {						
							echo 'Pending shipping info - <b>' . esc_html( $term->name ) . '</b></br></br>';
							echo '<hr>';
						} else {
							echo '<h2><b>' . esc_html( $term->name ) . '</b></h2>';
							echo '<strong>' . esc_html__( 'Date', 'woocommerce-dropshippers' ) . '</strong>: <span class="dropshipper_date">' . ( empty( $dropshipper_shipping_info['date'] ) ? '-' : esc_html( $dropshipper_shipping_info['date'] ) ) . '</span><br/>' . "\n";
							echo '<strong>' . esc_html__( 'Tracking Number(s)', 'woocommerce-dropshippers' ) . '</strong>: <span class="dropshipper_tracking_number">' . ( empty( $dropshipper_shipping_info['tracking_number'] ) ? '-' : esc_html( $dropshipper_shipping_info['tracking_number'] ) ) . '</span><br/>' . "\n";
							echo '<strong>' . esc_html__( 'Shipping Company', 'woocommerce-dropshippers' ) . '</strong>: <span class="dropshipper_shipping_company">' . ( empty( $dropshipper_shipping_info['shipping_company'] ) ? '-' : esc_html( $dropshipper_shipping_info['shipping_company'] ) ) . '</span><br/>' . "\n";
							echo '<strong>' . esc_html__( 'Notes', 'woocommerce-dropshippers' ) . '</strong>: <span class="dropshipper_notes">' . ( empty( $dropshipper_shipping_info['notes'] ) ? '-' : esc_html( $dropshipper_shipping_info['notes'] ) ) . '</span><br/>' . "\n";
							echo "<hr>\n";
						}
					}
				}
			}
		}
	}

	public function de_bulk_actions_edit_product( $bulk_actions ) {

		$terms = get_terms(
			array(
				'taxonomy' => 'dropship_supplier',
				'hide_empty' => false,
			)
		);

		foreach ( $terms as $term ) {
			$bulk_actions[ 'opmc-dropship-suppliers-' . $term->name ] = $term->name;
		}

		return $bulk_actions;
	}

	public function wc_new_supplier_column( $columns ) {
		if ( ! is_array( $columns ) ) {
			return $columns;
		}

		// Insert after Status so it shows in Screen Options and the table.
		$new_columns = array();
		$inserted    = false;
		foreach ( $columns as $key => $label ) {
			$new_columns[ $key ] = $label;
			if ( 'order_status' === $key ) {
				$new_columns['dropshipping_supplier'] = __( 'Dropshipping Supplier', 'woocommerce-dropshipping' );
				$inserted = true;
			}
		}
		if ( ! $inserted ) {
			$new_columns['dropshipping_supplier'] = __( 'Dropshipping Supplier', 'woocommerce-dropshipping' );
		}

		return $new_columns;
	}

	/*Order page listing column */

	/**
	 * Output supplier column for classic CPT order list.
	 *
	 * @param string $column Column id.
	 * @param int    $post_id Optional post id (WP 5+).
	 */
	function supplier_value( $column, $post_id = 0 ) {

		if ( 'dropshipping_supplier' !== $column && 'supplier' !== $column ) {
			return;
		}

		global $post;
		$order_id = $post_id ? absint( $post_id ) : ( isset( $post->ID ) ? absint( $post->ID ) : 0 );
		$order    = $order_id ? wc_get_order( $order_id ) : false;
		$this->render_supplier_column( $order );
	}

	/**
	 * Output supplier column for HPOS orders list.
	 *
	 * @param string          $column Column id.
	 * @param WC_Order|int    $order Order object or order id (varies by WC version).
	 */
	public function supplier_value_hpos( $column, $order ) {
		if ( 'dropshipping_supplier' !== $column && 'supplier' !== $column ) {
			return;
		}
		if ( is_numeric( $order ) ) {
			$order = wc_get_order( absint( $order ) );
		}
		if ( ! $order || ! is_a( $order, 'WC_Order' ) ) {
			return;
		}

		// WC may fire both manage_* and woocommerce_shop_order_list_table_* for the same cell.
		$cell_key = $column . ':' . $order->get_id();
		if ( isset( self::$rendered_supplier_cells[ $cell_key ] ) ) {
			return;
		}
		self::$rendered_supplier_cells[ $cell_key ] = true;

		$this->render_supplier_column( $order );
	}

	/**
	 * Shared supplier column renderer.
	 *
	 * @param WC_Order|false $order Order.
	 */
	private function render_supplier_column( $order ) {
		if ( ! $order || ! is_a( $order, 'WC_Order' ) ) {
			return;
		}

		$names = array();
		$items = $order->get_items();
		foreach ( $items as $item_id => $item ) {
			if ( ! $item instanceof WC_Order_Item_Product ) {
				continue;
			}

			$suppliername = '';
			if ( function_exists( 'wc_get_order_item_meta' ) ) {
				$suppliername = wc_get_order_item_meta( $item_id, 'supplier', true );
			}
			if ( empty( $suppliername ) && is_callable( array( $item, 'get_meta' ) ) ) {
				$suppliername = $item->get_meta( 'supplier', true );
			}
			if ( empty( $suppliername ) ) {
				$suppliername = get_post_meta( $item->get_product_id(), 'supplier', true );
			}

			if ( ! empty( $suppliername ) ) {
				$names[] = $suppliername;
			}
		}

		$names = array_unique( array_filter( $names ) );
		if ( ! empty( $names ) ) {
			echo esc_html( implode( ', ', $names ) );
		}
	}

	function assign_bulk_supplier( $redirect_to, $action_name, $post_ids, $append = false ) {

		if ( strpos( $action_name, 'opmc-dropship-suppliers-' ) !== false ) {
			$action_name = str_replace( 'opmc-dropship-suppliers-', '', $action_name );
			foreach ( $post_ids as $post_id ) {
				wp_set_object_terms( $post_id, $action_name, 'dropship_supplier', $append );
				$post = get_post( $post_id );				
				$term = get_term_by( 'slug', $action_name, 'dropship_supplier' );
				$name = $term->name;
				update_post_meta( $post_id, 'supplier', $name );
				update_post_meta( $post_id, 'supplierid', $term->term_id );
			}

			$redirect_to = add_query_arg( 'other_bulk_posts_precessed', count( $post_ids ), $redirect_to );
			return $redirect_to;

		} else {
			return $redirect_to;
		}
	}

	/* Order Detail page */

	public function supplier_name_order_page( $item_id, $item, $_product ) {

		$suppliername = wc_get_order_item_meta( $item_id, 'supplier', true );

		/* if($item['product_id']) {
			echo '<p>Supplier : <b>'.$suppliername.'</b></p>';
		}*/
	}

	public function dropship_supplier_metabox( $post ) {

		$taxonomy = 'dropship_supplier';
		$tax = get_taxonomy( $taxonomy );
		$terms = get_terms( $taxonomy, array( 'hide_empty' => false ) );
		$name = 'tax_input[' . $taxonomy . ']';
		$postterms = get_the_terms( $post->ID, $taxonomy );
		$current = ( $postterms ? array_pop( $postterms ) : false );
		$current = ( $current ? $current->term_id : 0 );

		echo '<div id="taxonomy-' . esc_attr( $taxonomy ) . '" class="categorydiv">

			<!-- Display tabs-->

			<ul id="' . esc_attr( $taxonomy ) . '-tabs" class="category-tabs">
				<li class="tabs"><a href="#' . esc_attr( $taxonomy ) . '-all" tabindex="3">' . esc_html__( 'Select a Supplier', 'woocommerce-dropshippers' ) .'</a></li>
			</ul>

			<!-- Display taxonomy terms -->

			<div id="' . esc_attr( $taxonomy ) . '-all" class="tabs-panel">
				<select id="" name="tax_input[dropship_supplier]" class="form-no-clear">';

					if ( $current == 0 ) {
						echo '<option selected value="">' . esc_html__( 'No Supplier', 'woocommerce-dropshippers' ) . '</option>';
					}

					foreach ( $terms as $term ) {
						$selected = ( $current == $term->term_id ) ? 'selected="selected"' : '';
						$id       = $taxonomy . '-' . $term->term_id;							
						echo '<option ' . esc_attr( $selected ) . ' value="' . esc_attr( $term->slug ) . '">' . esc_html( $term->name ) . '</option>';
					}

					if ( $current > 0 ) {
						echo '<option id="wcds-remove-supplier" value="">' . esc_html__( 'Remove Supplier', 'woocommerce-dropshippers' ) . '</option>';
					}

				echo '</select>				
			</div>
		</div>';
	}

	public function save_supplier_name( $post_id ) {

		global $post;

		if ( ! empty( $post->post_type ) && $post->post_type == 'product' ) {
			if ( isset( $_POST['tax_input']['dropship_supplier'] ) ) {
				$supplier_name = wp_unslash($_POST['tax_input']['dropship_supplier']); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

				if ( '' !== $supplier_name ) {
					$term = get_term_by( 'slug', $supplier_name, 'dropship_supplier' );
					$name = $term->name;
					update_post_meta( $post_id, 'supplier', $name );
					update_post_meta( $post_id, 'supplierid', $term->term_id );

				} else {
					delete_post_meta( $post_id, 'supplier' );
					delete_post_meta( $post_id, 'supplierid' );
				}
			}
		}
	}

	public function dropship_supplier_meta_box() {
		add_meta_box( 'dropship_supplier', 'Dropshipping Supplier', array( $this, 'dropship_supplier_metabox' ), 'product', 'side', 'core' );
	}

	public function check_deleted_supplier() {
		global $wpdb;
		$supplier = array();
		$suppliers = array();
		$meta_datas = array();

		$result = $wpdb->get_results( "SELECT a.ID,a.post_type, b.post_id  FROM {$wpdb->posts} a, {$wpdb->postmeta} b WHERE a.ID=b.post_id AND a.post_type='product' GROUP BY a.ID" ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

		if ( ! empty( $result ) ) {
			foreach ( $result as $products ) {
				if ( ! empty( get_post_meta( $products->ID, 'supplierid' ) ) ) {
					$supplier[] = get_post_meta( $products->ID, 'supplierid' );
				}
			}
			$get_meta_data = $wpdb->get_results( "SELECT a.term_id, b.term_id, b.taxonomy FROM {$wpdb->terms} a, {$wpdb->term_taxonomy} b WHERE a.term_id=b.term_id AND b.taxonomy='dropship_supplier'" );
			foreach ( $get_meta_data as $meta_data ) {
				if ( ! empty( $meta_data ) ) {
					$meta_datas[] = $meta_data->term_id;
				}
			}
			foreach ( $supplier as $data ) {
				$suppliers[] = $data[0];
			}

			$unmatched_result = array_diff( $suppliers, $meta_datas );

			foreach ( $unmatched_result as $rs ) {
				$results = $wpdb->get_results( $wpdb->prepare( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='supplierid' AND meta_value=%s", $rs ) ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
				if ( ! empty( $results ) ) {
					foreach ( $results as $row ) {
						if ( ! empty( $row->post_id ) ) {
							delete_post_meta( $row->post_id, 'supplierid' );
							delete_post_meta( $row->post_id, 'supplier' );
						}
					}
				}
			}
		}
	}
}
