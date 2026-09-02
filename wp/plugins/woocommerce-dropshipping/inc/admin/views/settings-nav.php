<?php
/**
 * Top-level tab list for Dropshipping settings (WooCommerce → Settings → Dropshipping).
 *
 * @var array $wc_ds_tabs From WC_DS_Settings_Registry::get_tabs().
 * @var string $wc_ds_active_tab Which tab has .active (id).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$wc_ds_tabs = WC_DS_Settings_Registry::get_tabs();
?>
<ul class="wc-dropship-setting-tabs wc-ds-settings-nav" role="tablist" aria-label="<?php esc_attr_e( 'Dropshipping settings sections', 'woocommerce-dropshipping' ); ?>">
	<?php foreach ( $wc_ds_tabs as $tab ) : ?>
		<?php
		$is_active = ( $wc_ds_active_tab === $tab['id'] );
		// Legacy: price tab keeps id="prices_cal" for myscript.js.
		$tab_li_id = ( 'price_calculator_options' === $tab['id'] ) ? 'prices_cal' : 'wc-ds-tab-' . $tab['id'];
		?>
		<li
			role="tab"
			id="<?php echo esc_attr( $tab_li_id ); ?>"
			aria-controls="<?php echo esc_attr( $tab['id'] ); ?>"
			aria-selected="<?php echo $is_active ? 'true' : 'false'; ?>"
			tabindex="<?php echo $is_active ? '0' : '-1'; ?>"
			data-id="<?php echo esc_attr( $tab['id'] ); ?>"
			class="<?php echo $is_active ? 'active' : ''; ?>"
		>
			<?php echo esc_html( $tab['label'] ); ?>
		</li>
	<?php endforeach; ?>
</ul>
