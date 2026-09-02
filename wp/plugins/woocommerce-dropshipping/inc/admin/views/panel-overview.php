<?php
/**
 * Setup Home / Overview panel (first tab).
 *
 * @var WC_DS_Settings_Setup_State $wc_ds_setup_state
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$profile = get_option( 'wc_ds_merchant_profile', '' );
if ( ! is_string( $profile ) ) {
	$profile = '';
}

$wc_ds_active_tab = $wc_ds_active_tab ?? '';
$progress               = $wc_ds_setup_state->get_progress_percent();
$items                  = $wc_ds_setup_state->get_checklist_items();
$wc_ds_default_overview = $wc_ds_setup_state->should_default_to_overview();
$overview_active        = ( 'overview' === $wc_ds_active_tab );
$wc_ds_first_run        = $progress < 100;
?>
<div
	class="drop-setting-section wc-ds-overview wc-ds-panel<?php echo $wc_ds_first_run ? ' wc-ds-overview--first-run' : ''; ?><?php echo $overview_active ? ' active' : ''; ?>"
	id="overview"
	role="tabpanel"
	aria-labelledby="wc-ds-tab-overview"
	aria-hidden="<?php echo $overview_active ? 'false' : 'true'; ?>"
	data-default-tab="<?php echo $wc_ds_default_overview ? 'overview' : ''; ?>"
>
	<header class="wc-ds-page-header">
		<?php if ( $wc_ds_first_run ) : ?>
			<p class="wc-ds-page-header__eyebrow"><?php esc_html_e( 'Start here', 'woocommerce-dropshipping' ); ?></p>
			<h2 class="wc-ds-page-header__title"><?php esc_html_e( 'Set up Dropshipping', 'woocommerce-dropshipping' ); ?></h2>
			<p class="wc-ds-page-header__lead description">
				<?php esc_html_e( 'Run through the checklist, optionally say how you sell, then use Continue to visit each section in order. Save once at the bottom when you are finished — one save stores every tab.', 'woocommerce-dropshipping' ); ?>
			</p>
		<?php else : ?>
			<h2 class="wc-ds-page-header__title"><?php esc_html_e( 'Overview', 'woocommerce-dropshipping' ); ?></h2>
			<p class="wc-ds-page-header__lead description">
				<?php esc_html_e( 'Checklist and shortcuts. All sections share one Save changes at the bottom.', 'woocommerce-dropshipping' ); ?>
			</p>
		<?php endif; ?>
	</header>

	<div class="wc-ds-overview__grid">
		<section class="wc-ds-card wc-ds-card--panel wc-ds-card--hero" aria-labelledby="wc-ds-overview-profile-heading">
			<h3 id="wc-ds-overview-profile-heading" class="wc-ds-card__title"><?php esc_html_e( 'How do you sell?', 'woocommerce-dropshipping' ); ?></h3>
			<p class="wc-ds-field-help"><?php esc_html_e( 'Optional. We only use this to tailor tips on this screen — nothing is turned on or off automatically.', 'woocommerce-dropshipping' ); ?></p>
			<label for="wc_ds_merchant_profile" class="screen-reader-text"><?php esc_html_e( 'Primary business type', 'woocommerce-dropshipping' ); ?></label>
			<select name="wc_ds_merchant_profile" id="wc_ds_merchant_profile" class="wc-ds-select">
				<option value=""><?php esc_html_e( 'Choose an option…', 'woocommerce-dropshipping' ); ?></option>
				<option value="aliexpress" <?php selected( $profile, 'aliexpress' ); ?>><?php esc_html_e( 'Mostly AliExpress', 'woocommerce-dropshipping' ); ?></option>
				<option value="local" <?php selected( $profile, 'local' ); ?>><?php esc_html_e( 'Local suppliers', 'woocommerce-dropshipping' ); ?></option>
				<option value="amazon_affiliate" <?php selected( $profile, 'amazon_affiliate' ); ?>><?php esc_html_e( 'Amazon affiliate', 'woocommerce-dropshipping' ); ?></option>
				<option value="mixed" <?php selected( $profile, 'mixed' ); ?>><?php esc_html_e( 'Mixed', 'woocommerce-dropshipping' ); ?></option>
			</select>
		</section>

		<section class="wc-ds-card wc-ds-card--panel" aria-labelledby="wc-ds-overview-progress-heading">
			<div class="wc-ds-card__head">
				<h3 id="wc-ds-overview-progress-heading" class="wc-ds-card__title"><?php esc_html_e( 'Your checklist', 'woocommerce-dropshipping' ); ?></h3>
				<span class="wc-ds-badge wc-ds-badge--neutral" title="<?php esc_attr_e( 'Checklist completion', 'woocommerce-dropshipping' ); ?>">
					<?php echo esc_html( (string) $progress ); ?>%
				</span>
			</div>
			<div
				class="wc-ds-progress"
				role="progressbar"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuenow="<?php echo esc_attr( (string) $progress ); ?>"
				aria-label="<?php esc_attr_e( 'Setup progress', 'woocommerce-dropshipping' ); ?>"
			>
				<div class="wc-ds-progress__bar" style="width: <?php echo esc_attr( (string) $progress ); ?>%;"></div>
			</div>
			<ul class="wc-ds-checklist">
				<?php foreach ( $items as $item ) : ?>
					<?php $done = ! empty( $item['done'] ); ?>
					<li class="wc-ds-checklist__item<?php echo $done ? ' wc-ds-checklist__item--done' : ' wc-ds-checklist__item--todo'; ?>">
						<span class="wc-ds-status-dot<?php echo $done ? ' wc-ds-status-dot--done' : ''; ?>" aria-hidden="true"></span>
						<button type="button" class="button-link wc-ds-goto-tab" data-tab="<?php echo esc_attr( $item['target_tab'] ); ?>">
							<?php echo esc_html( $item['label'] ); ?>
						</button>
						<?php if ( $done ) : ?>
							<span class="screen-reader-text"><?php esc_html_e( 'Done', 'woocommerce-dropshipping' ); ?></span>
						<?php else : ?>
							<span class="screen-reader-text"><?php esc_html_e( 'To do', 'woocommerce-dropshipping' ); ?></span>
						<?php endif; ?>
					</li>
				<?php endforeach; ?>
			</ul>
			<?php if ( empty( $items ) ) : ?>
				<p class="wc-ds-empty-state"><?php esc_html_e( 'No checklist items are available yet.', 'woocommerce-dropshipping' ); ?></p>
			<?php endif; ?>
		</section>
	</div>

	<details class="wc-ds-details wc-ds-details--subtle">
		<summary class="wc-ds-details__summary"><?php esc_html_e( 'Why one save?', 'woocommerce-dropshipping' ); ?></summary>
		<div class="wc-ds-details__body">
			<p class="description">
				<?php esc_html_e( 'WooCommerce saves all Dropshipping options in a single form. Switch tabs freely; nothing is stored until you click Save changes.', 'woocommerce-dropshipping' ); ?>
			</p>
		</div>
	</details>

	<details class="wc-ds-details wc-ds-details--subtle">
		<summary class="wc-ds-details__summary"><?php esc_html_e( 'Common support topics (quick answers)', 'woocommerce-dropshipping' ); ?></summary>
		<div class="wc-ds-details__body">
			<ul class="description" style="margin: 0 0 1.2em 1.25em; max-width: 75%; padding: 0;">
				<li><?php esc_html_e( '“No PDF attached” — usually supplier emails are disabled under Packing slips & PDFs → Notifications, or the order never reached Processing.', 'woocommerce-dropshipping' ); ?></li>
				<li><?php esc_html_e( '“Email colors changed but PDF didn’t” — PDF content is under Packing slips & PDFs; colors in Supplier email design only affect the HTML email.', 'woocommerce-dropshipping' ); ?></li>
				<li><?php esc_html_e( '“Suppliers never get mail” — check Email delivery (SMTP), spam, and that notifications are not disabled.', 'woocommerce-dropshipping' ); ?></li>
			</ul>
		</div>
	</details>
</div>
