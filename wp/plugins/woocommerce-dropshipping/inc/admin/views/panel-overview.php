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
			<p class="wc-ds-page-header__eyebrow"><?php esc_html_e( 'Configuração Inicial', 'woocommerce-dropshipping' ); ?></p>
			<h2 class="wc-ds-page-header__title"><?php esc_html_e( 'Operação Dropshipping INTT (White Label CASOSEX)', 'woocommerce-dropshipping' ); ?></h2>
			<p class="wc-ds-page-header__lead description">
				<?php esc_html_e( 'Governador e painel de parametrização para despacho direto com o fornecedor nacional INTT. Utilize o checklist para conferir os parâmetros de White Label e faturamento fiscal.', 'woocommerce-dropshipping' ); ?>
			</p>
		<?php else : ?>
			<h2 class="wc-ds-page-header__title"><?php esc_html_e( 'Visão Geral & Governança INTT', 'woocommerce-dropshipping' ); ?></h2>
			<p class="wc-ds-page-header__lead description">
				<?php esc_html_e( 'Checklist de prontidão da operação B2C Dropshipping INTT. Todas as abas compartilham o botão único "Salvar alterações" no rodapé.', 'woocommerce-dropshipping' ); ?>
			</p>
		<?php endif; ?>
	</header>

	<div class="wc-ds-overview__grid">
		<section class="wc-ds-card wc-ds-card--panel wc-ds-card--hero" aria-labelledby="wc-ds-overview-profile-heading">
			<h3 id="wc-ds-overview-profile-heading" class="wc-ds-card__title"><?php esc_html_e( 'Canal de Operação Principal', 'woocommerce-dropshipping' ); ?></h3>
			<p class="wc-ds-field-help"><?php esc_html_e( 'Canal ativo exclusivo para o ecossistema CASOSEX:', 'woocommerce-dropshipping' ); ?></p>
			<label for="wc_ds_merchant_profile" class="screen-reader-text"><?php esc_html_e( 'Modo de Operação', 'woocommerce-dropshipping' ); ?></label>
			<select name="wc_ds_merchant_profile" id="wc_ds_merchant_profile" class="wc-ds-select">
				<option value="local" selected="selected"><?php esc_html_e( 'Dropshipping Nacional INTT (White Label)', 'woocommerce-dropshipping' ); ?></option>
			</select>
		</section>

		<section class="wc-ds-card wc-ds-card--panel" aria-labelledby="wc-ds-overview-progress-heading">
			<div class="wc-ds-card__head">
				<h3 id="wc-ds-overview-progress-heading" class="wc-ds-card__title"><?php esc_html_e( 'Checklist de Prontidão INTT', 'woocommerce-dropshipping' ); ?></h3>
				<span class="wc-ds-badge wc-ds-badge--neutral" title="<?php esc_attr_e( 'Progresso da Configuração', 'woocommerce-dropshipping' ); ?>">
					<?php echo esc_html( (string) $progress ); ?>%
				</span>
			</div>
			<div
				class="wc-ds-progress"
				role="progressbar"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuenow="<?php echo esc_attr( (string) $progress ); ?>"
				aria-label="<?php esc_attr_e( 'Progresso da configuração', 'woocommerce-dropshipping' ); ?>"
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
							<span class="screen-reader-text"><?php esc_html_e( 'Concluído', 'woocommerce-dropshipping' ); ?></span>
						<?php else : ?>
							<span class="screen-reader-text"><?php esc_html_e( 'Pendente', 'woocommerce-dropshipping' ); ?></span>
						<?php endif; ?>
					</li>
				<?php endforeach; ?>
			</ul>
			<?php if ( empty( $items ) ) : ?>
				<p class="wc-ds-empty-state"><?php esc_html_e( 'Nenhum item de checklist disponível.', 'woocommerce-dropshipping' ); ?></p>
			<?php endif; ?>
		</section>
	</div>

	<details class="wc-ds-details wc-ds-details--subtle">
		<summary class="wc-ds-details__summary"><?php esc_html_e( 'Como funciona a persistência de dados?', 'woocommerce-dropshipping' ); ?></summary>
		<div class="wc-ds-details__body">
			<p class="description">
				<?php esc_html_e( 'O WooCommerce armazena todas as opções de Dropshipping em um formulário unificado. Navegue livremente entre as abas e clique em "Salvar alterações" no rodapé para persistir.', 'woocommerce-dropshipping' ); ?>
			</p>
		</div>
	</details>

	<details class="wc-ds-details wc-ds-details--subtle">
		<summary class="wc-ds-details__summary"><?php esc_html_e( 'Diretrizes da Operação INTT (Suporte Operacional)', 'woocommerce-dropshipping' ); ?></summary>
		<div class="wc-ds-details__body">
			<ul class="description" style="margin: 0 0 1.2em 1.25em; max-width: 85%; padding: 0;">
				<li><?php esc_html_e( '• "Dados Fiscais no Romaneio" — O CPF/CNPJ e telefone do destinatário são injetados automaticamente no PDF de expedição para emissão da NF de despacho pela INTT.', 'woocommerce-dropshipping' ); ?></li>
				<li><?php esc_html_e( '• "Sigilo de Marca (White Label)" — Nome e marca do fornecedor são omitidos em todos os e-mails e telas visíveis ao cliente final.', 'woocommerce-dropshipping' ); ?></li>
				<li><?php esc_html_e( '• "Notificação ao Fornecedor" — Certifique-se de que o e-mail de notificação do fornecedor INTT está cadastrado na aba "Fornecedores & Despacho INTT".', 'woocommerce-dropshipping' ); ?></li>
			</ul>
		</div>
	</details>
</div>
