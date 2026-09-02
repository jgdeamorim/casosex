<?php
/**
 * Sticky region for the WooCommerce “Save changes” control (moved here via JS from the default footer).
 *
 * Keeps one primary save action visible; does not add a second submit handler — same form, same nonce.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="wc-ds-save-bar" id="wc-ds-save-bar" role="region" aria-label="<?php esc_attr_e( 'Save settings', 'woocommerce-dropshipping' ); ?>">
	<div class="wc-ds-save-bar__inner">
		<p class="wc-ds-save-bar__note description">
			<?php esc_html_e( 'Save changes applies this entire screen — all tabs at once.', 'woocommerce-dropshipping' ); ?>
		</p>
		<p class="wc-ds-save-bar__unsaved" id="wc-ds-unsaved-hint" hidden>
			<?php esc_html_e( 'You have unsaved changes.', 'woocommerce-dropshipping' ); ?>
		</p>
		<div class="wc-ds-save-bar__slot" id="wc-ds-save-bar-slot"></div>
	</div>
</div>
