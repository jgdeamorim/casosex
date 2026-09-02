<?php
/**
 * Shared Back / Continue bar for the guided setup flow (Dropshipping settings).
 *
 * @var bool $wc_ds_first_run Optional. When true, copy nudges first-time setup.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// @phpstan-ignore-next-line
$wc_ds_first_run = isset( $wc_ds_first_run ) ? (bool) $wc_ds_first_run : true;

?>
<nav class="wc-ds-guided-nav" id="wc-ds-guided-nav" aria-label="<?php esc_attr_e( 'Setup step navigation', 'woocommerce-dropshipping' ); ?>">
	<?php if ( $wc_ds_first_run ) : ?>
		<p class="wc-ds-guided-nav__helper description">
			<?php esc_html_e( 'Use Continue to follow the suggested setup order, or open any tab when you need to. Your work is not saved until you click Save changes at the bottom of the page.', 'woocommerce-dropshipping' ); ?>
		</p>
	<?php else : ?>
		<p class="wc-ds-guided-nav__helper description">
			<?php esc_html_e( 'Switch tabs freely. One Save changes at the bottom updates all settings on this screen.', 'woocommerce-dropshipping' ); ?>
		</p>
	<?php endif; ?>

	<div class="wc-ds-guided-nav__bar" role="group" aria-labelledby="wc-ds-guided-title">
		<div class="wc-ds-guided-nav__actions wc-ds-guided-nav__actions--start">
			<button type="button" class="button wc-ds-guided-nav__back" id="wc-ds-guided-back" aria-label="<?php esc_attr_e( 'Go back to previous step', 'woocommerce-dropshipping' ); ?>">
				<?php esc_html_e( 'Back', 'woocommerce-dropshipping' ); ?>
			</button>
		</div>

		<div class="wc-ds-guided-nav__center">
			<div class="wc-ds-guided-nav__step">
				<p class="wc-ds-guided-nav__progress" id="wc-ds-guided-progress" aria-hidden="true"></p>
				<p class="wc-ds-guided-nav__step-title" id="wc-ds-guided-title"></p>
			</div>
		</div>

		<div class="wc-ds-guided-nav__actions wc-ds-guided-nav__actions--end">
			<button type="button" class="button button-primary wc-ds-guided-nav__next" id="wc-ds-guided-next" aria-label="<?php esc_attr_e( 'Continue to next step', 'woocommerce-dropshipping' ); ?>">
				<?php esc_html_e( 'Continue', 'woocommerce-dropshipping' ); ?>
			</button>
		</div>
	</div>
</nav>
