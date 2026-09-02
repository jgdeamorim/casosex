<?php
/**
 * Top-level Dropshipping settings tabs (job-based labels).
 * Panel `data-id` values MUST stay aligned with existing .drop-setting-section ids
 * until markup is physically reordered.
 *
 * @package WooCommerce_Dropshipping
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class WC_DS_Settings_Registry
 */
class WC_DS_Settings_Registry {

	/**
	 * Tab definitions for nav.
	 *
	 * @return array<int, array{id:string,label:string}>
	 */
	public static function get_tabs() {
		$tabs = array(
			array(
				'id'    => 'overview',
				'label' => __( 'Overview & Governança INTT', 'woocommerce-dropshipping' ),
			),
			array(
				'id'    => 'general_settings',
				'label' => __( 'Dropshipping & White Label (INTT)', 'woocommerce-dropshipping' ),
			),
			array(
				'id'    => 'supplier_email_notifications',
				'label' => __( 'Fornecedores & Despacho INTT', 'woocommerce-dropshipping' ),
			),
			array(
				'id'    => 'packing_slips',
				'label' => __( 'Romaneios & PDFs (CPF/CNPJ)', 'woocommerce-dropshipping' ),
			),
			array(
				'id'    => 'price_calculator_options',
				'label' => __( 'Precificação & Margem BRL', 'woocommerce-dropshipping' ),
			),
		);

		return apply_filters( 'wc_ds_settings_tabs', $tabs );
	}

	/**
	 * Linear guided setup order (Back / Next). Tab strip order may differ.
	 *
	 * @return array<int, array{id:string,label:string}>
	 */
	public static function get_guided_steps() {
		$tabs = self::get_tabs();
		$by_id = array();
		foreach ( $tabs as $t ) {
			$by_id[ $t['id'] ] = $t['label'];
		}

		$order = array(
			'overview',
			'general_settings',
			'supplier_email_notifications',
			'packing_slips',
			'price_calculator_options',
		);

		$steps = array();
		foreach ( $order as $id ) {
			if ( isset( $by_id[ $id ] ) ) {
				$steps[] = array(
					'id'    => $id,
					'label' => $by_id[ $id ],
				);
			}
		}

		return apply_filters( 'wc_ds_settings_guided_steps', $steps );
	}
}
