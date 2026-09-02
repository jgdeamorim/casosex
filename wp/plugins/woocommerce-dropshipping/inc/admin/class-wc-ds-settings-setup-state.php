<?php
/**
 * Setup checklist / Overview state derived from wc_dropship_manager
 * (no brittle one-off flags required for core items).
 *
 * @package WooCommerce_Dropshipping
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class WC_DS_Settings_Setup_State
 */
class WC_DS_Settings_Setup_State {

	/**
	 * @var array
	 */
	private $options;

	/**
	 * @param array $options wc_dropship_manager.
	 */
	public function __construct( array $options ) {
		$this->options = $options;
	}

	/**
	 * Checklist rows for Overview.
	 *
	 * @return array<int, array{id:string,label:string,done:bool,target_tab:string}>
	 */
	public function get_checklist_items() {
		$o = $this->options;

		return array(
			array(
				'id'         => 'intt_local_supplier',
				'label'      => __( 'Trava White Label & Fornecedor INTT', 'woocommerce-dropshipping' ),
				'done'       => ! empty( $o['hide_suppliername'] ) && '1' === (string) $o['hide_suppliername'],
				'target_tab' => 'general_settings',
			),
			array(
				'id'         => 'supplier_emails',
				'label'      => __( 'Notificações & E-mail Automático ao Fornecedor INTT', 'woocommerce-dropshipping' ),
				'done'       => $this->has_text( $o, 'email_order_note' ),
				'target_tab' => 'supplier_email_notifications',
			),
			array(
				'id'         => 'packing_slips',
				'label'      => __( 'Romaneios PDF com CPF/CNPJ do Destinatário Final', 'woocommerce-dropshipping' ),
				'done'       => ! empty( $o['full_information'] ) && '1' === (string) $o['full_information'],
				'target_tab' => 'packing_slips',
			),
			array(
				'id'         => 'pricing',
				'label'      => __( 'Precificação e Regras de Margem em BRL (R$)', 'woocommerce-dropshipping' ),
				'done'       => $this->has_text( $o, 'profit_percent_value' ) || $this->has_text( $o, 'profit_doller_value' ) || ! empty( $o['dynamic_profit_margin'] ) || $this->has_text( $o, 'profit_margin_hidden_textarea' ),
				'target_tab' => 'price_calculator_options',
			),
		);
	}

	/**
	 * 0–100 for progress bar.
	 *
	 * @return int
	 */
	public function get_progress_percent() {
		$items = $this->get_checklist_items();
		$done  = 0;
		foreach ( $items as $item ) {
			if ( ! empty( $item['done'] ) ) {
				++$done;
			}
		}
		$total = count( $items );
		return $total > 0 ? (int) round( ( $done / $total ) * 100 ) : 0;
	}

	/**
	 * Whether Overview should be the default tab on first visit.
	 *
	 * @return bool
	 */
	public function should_default_to_overview() {
		return $this->get_progress_percent() < 100;
	}

	/**
	 * @param array  $options Options.
	 * @param string $key     Key.
	 * @return bool
	 */
	private function has_text( $options, $key ) {
		return isset( $options[ $key ] ) && '' !== trim( (string) $options[ $key ] );
	}
}
