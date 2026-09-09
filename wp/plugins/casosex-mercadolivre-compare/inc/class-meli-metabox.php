<?php
/**
 * Metabox de Inteligência Competitiva Mercado Livre no post.php
 * ADR-0239
 */

if (!defined('ABSPATH')) {
    exit;
}

class CasoSex_MeLi_Metabox {

    public static function init() {
        add_action('add_meta_boxes', [__CLASS__, 'register_metabox']);
        add_action('wp_ajax_casosex_meli_run_matching', [__CLASS__, 'ajax_run_matching']);
    }

    public static function register_metabox() {
        add_meta_box(
            'casosex_meli_intelligence_metabox',
            '⚡ Mercado Livre - Comparador de Preços & Inteligência Competitiva',
            [__CLASS__, 'render_metabox'],
            'product',
            'side',
            'high'
        );
    }

    public static function render_metabox($post) {
        $score = get_post_meta($post->ID, 'meli_matching_score', true);
        $market_price = floatval(get_post_meta($post->ID, 'meli_market_price', true));
        $cost_price = floatval(get_post_meta($post->ID, '_cost_price', true));
        $our_price = floatval(get_post_meta($post->ID, '_regular_price', true));
        $opp = get_post_meta($post->ID, 'meli_opportunity_index', true);
        $catalog_id = get_post_meta($post->ID, 'meli_catalog_id', true);
        $golden_price = get_post_meta($post->ID, 'meli_golden_price', true);

        $margin = $market_price > 0 && $cost_price > 0 ? ($market_price - $cost_price) : 0;
        ?>
        <div class="casosex-meli-metabox-content" style="font-size: 13px; line-height: 1.5;">
            <?php if ($score): ?>
                <div style="margin-bottom: 12px; padding: 8px; background: #eef9f1; border-left: 4px solid #10b981; border-radius: 4px;">
                    <strong>Matching Score:</strong> <span style="font-size: 16px; color: #047857; font-weight: bold;"><?php echo esc_html($score); ?>%</span>
                    <br><small style="color: #666;">Catálogo MeLi: <strong><?php echo esc_html($catalog_id); ?></strong></small>
                </div>

                <div style="margin-bottom: 10px;">
                    <strong>Preço no Mercado Livre:</strong> <span style="color: #2563eb; font-weight: bold;">R$ <?php echo number_format($market_price, 2, ',', '.'); ?></span><br>
                    <strong>Nosso Custo Atacado:</strong> R$ <?php echo number_format($cost_price, 2, ',', '.'); ?><br>
                    <strong>Margem Bruta Unitária:</strong> <span style="color: #10b981; font-weight: bold;">R$ <?php echo number_format($margin, 2, ',', '.'); ?></span>
                </div>

                <?php if ($golden_price): ?>
                <div style="margin-bottom: 12px; padding: 6px 8px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                    <strong>Preço de Ouro (LP):</strong> <span style="font-size: 14px; font-weight: bold; color: #b45309;">R$ <?php echo number_format(floatval($golden_price), 2, ',', '.'); ?></span>
                </div>
                <?php endif; ?>

                <div style="margin-bottom: 15px;">
                    <?php if ($opp === 'HIGH_MARGIN'): ?>
                        <span style="display: block; background: #10b981; color: #fff; padding: 4px 8px; text-align: center; border-radius: 4px; font-weight: bold;">🟢 Alta Margem (Ideal para LP)</span>
                    <?php elseif ($opp === 'ORDER_BUMP'): ?>
                        <span style="display: block; background: #f59e0b; color: #fff; padding: 4px 8px; text-align: center; border-radius: 4px; font-weight: bold;">🟡 Recomendado para Order Bump</span>
                    <?php else: ?>
                        <span style="display: block; background: #64748b; color: #fff; padding: 4px 8px; text-align: center; border-radius: 4px;">⚪ Catálogo Orgânico</span>
                    <?php endif; ?>
                </div>
            <?php else: ?>
                <p style="color: #64748b;">Nenhuma análise do Mercado Livre vinculada a este produto ainda.</p>
            <?php endif; ?>

            <button type="button" class="button button-primary" id="btn-run-meli-match" data-product-id="<?php echo esc_attr($post->ID); ?>" style="width: 100%; text-align: center;">
                🔄 Executar Matching & Enriquecer
            </button>
            <span id="meli-spinner" class="spinner" style="float: none; margin: 8px auto; display: none;"></span>
            <div id="meli-ajax-result" style="margin-top: 10px;"></div>
        </div>

        <script>
        jQuery(document).ready(function($) {
            $('#btn-run-meli-match').on('click', function(e) {
                e.preventDefault();
                var btn = $(this);
                var pid = btn.data('product-id');
                var spinner = $('#meli-spinner');
                var resBox = $('#meli-ajax-result');

                btn.prop('disabled', true);
                spinner.show();
                resBox.html('<small style="color: #64748b;">Consultando Mercado Livre e calculando score...</small>');

                $.post(ajaxurl, {
                    action: 'casosex_meli_run_matching',
                    product_id: pid,
                    nonce: '<?php echo wp_create_nonce('casosex_meli_nonce'); ?>'
                }, function(res) {
                    spinner.hide();
                    btn.prop('disabled', false);
                    if (res.success) {
                        resBox.html('<div style="color: #047857; font-weight: bold; margin-top: 8px;">✓ ' + res.data.message + '</div>');
                        setTimeout(function() { location.reload(); }, 1200);
                    } else {
                        resBox.html('<div style="color: #dc2626; margin-top: 8px;">✗ ' + (res.data || 'Falha na consulta.') + '</div>');
                    }
                });
            });
        });
        </script>
        <?php
    }

    public static function ajax_run_matching() {
        check_ajax_referer('casosex_meli_nonce', 'nonce');
        $pid = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
        if (!$pid) {
            wp_send_json_error('ID do produto inválido.');
        }

        $res = CasoSex_MeLi_Matcher::match_product($pid);
        if (is_wp_error($res)) {
            wp_send_json_error($res->get_error_message());
        }

        wp_send_json_success([
            'message' => 'Matching realizado com ' . $res['matching_score'] . '% de similaridade! Ficha enriquecida.',
            'data'    => $res
        ]);
    }
}
