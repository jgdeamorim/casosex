<?php
/**
 * Módulo de Interface para Sincronização em Lote com Barra de Progresso AJAX
 * ADR-0239
 */

if (!defined('ABSPATH')) {
    exit;
}

class CasoSex_MeLi_Batch_Sync {

    public static function init() {
        add_action('admin_menu', [__CLASS__, 'add_admin_menu']);
        add_action('admin_notices', [__CLASS__, 'render_top_sync_button']);
        add_action('wp_ajax_casosex_meli_get_sync_queue', [__CLASS__, 'ajax_get_sync_queue']);
        add_action('wp_ajax_casosex_meli_sync_single_product', [__CLASS__, 'ajax_sync_single_product']);
    }

    public static function add_admin_menu() {
        add_submenu_page(
            'edit.php?post_type=product',
            'Sincronização MeLi',
            '⚡ Sincronizar Mercado Livre',
            'manage_woocommerce',
            'casosex-meli-sync',
            [__CLASS__, 'render_sync_page']
        );
    }

    public static function render_top_sync_button() {
        $screen = get_current_screen();
        if ($screen && $screen->id === 'edit-product') {
            ?>
            <div class="notice notice-info is-dismissible" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; border-left-color: #2563eb;">
                <div>
                    <strong style="font-size: 14px;">⚡ Inteligência Competitiva Mercado Livre (ADR-0239)</strong>
                    <p style="margin: 3px 0 0 0; color: #475569;">Atualize o Matching Score, Menor Preço Concorrente e Margens de Lucro de todos os produtos cadastrados.</p>
                </div>
                <a href="<?php echo admin_url('edit.php?post_type=product&page=casosex-meli-sync'); ?>" class="button button-primary" style="background: #2563eb; border-color: #1d4ed8; font-weight: bold; padding: 4px 14px; height: auto;">
                    🚀 Sincronizar Todos os Produtos com MeLi
                </a>
            </div>
            <?php
        }
    }

    public static function render_sync_page() {
        $counts = wp_count_posts('product');
        $total = $counts->publish + $counts->pending + $counts->draft;
        ?>
        <div class="wrap" style="max-width: 900px;">
            <h1 style="display: flex; align-items: center; gap: 10px;">
                <span>⚡</span> Sincronização em Lote: Mercado Livre & WooCommerce
            </h1>
            <p style="color: #64748b; font-size: 14px;">
                Execute a varredura automática dos <strong><?php echo $total; ?> produtos</strong> cadastrados. O motor fará o matching no catálogo do MeLi, extrairá o menor preço de venda concorrente, calculará sua margem bruta e enriquecerá a ficha técnica no ACF.
            </p>

            <div style="background: #fff; padding: 25px; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-top: 20px;">
                <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px;">
                    <button type="button" id="btn-start-batch-sync" class="button button-primary button-hero" style="background: #2563eb; border-color: #1d4ed8;">
                        ▶️ Iniciar Sincronização dos <?php echo $total; ?> Produtos
                    </button>
                    <button type="button" id="btn-pause-batch-sync" class="button button-secondary button-hero" style="display: none;">
                        ⏸️ Pausar
                    </button>
                </div>

                <!-- Barra de Progresso -->
                <div id="sync-progress-wrapper" style="display: none; margin-top: 20px;">
                    <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 6px; font-size: 13px;">
                        <span id="sync-status-text">Processando...</span>
                        <span id="sync-percentage-text">0%</span>
                    </div>
                    <div style="width: 100%; height: 22px; background: #e2e8f0; border-radius: 11px; overflow: hidden;">
                        <div id="sync-progress-bar" style="width: 0%; height: 100%; background: #10b981; transition: width 0.2s ease;"></div>
                    </div>
                </div>

                <!-- Terminal / Log ao vivo -->
                <div id="sync-console-log" style="margin-top: 20px; background: #0f172a; color: #f8fafc; font-family: monospace; font-size: 12px; padding: 15px; border-radius: 6px; height: 260px; overflow-y: auto; display: none;">
                </div>
            </div>
        </div>

        <script>
        jQuery(document).ready(function($) {
            var queue = [];
            var totalItems = 0;
            var processed = 0;
            var isRunning = false;

            $('#btn-start-batch-sync').on('click', function() {
                var btn = $(this);
                btn.prop('disabled', true);
                $('#btn-pause-batch-sync').show();
                $('#sync-progress-wrapper').show();
                $('#sync-console-log').show().html('<div>[1/3] Obtendo fila de produtos do WooCommerce...</div>');

                $.post(ajaxurl, {
                    action: 'casosex_meli_get_sync_queue',
                    nonce: '<?php echo wp_create_nonce('casosex_meli_batch_nonce'); ?>'
                }, function(res) {
                    if (res.success && res.data.length > 0) {
                        queue = res.data;
                        totalItems = queue.length;
                        processed = 0;
                        isRunning = true;
                        $('#sync-console-log').append('<div>[2/3] Fila carregada com ' + totalItems + ' produtos. Iniciando matching...</div>');
                        processNext();
                    } else {
                        alert('Nenhum produto encontrado para sincronizar.');
                        btn.prop('disabled', false);
                    }
                });
            });

            $('#btn-pause-batch-sync').on('click', function() {
                isRunning = false;
                $(this).hide();
                $('#btn-start-batch-sync').prop('disabled', false).text('▶️ Retomar Sincronização');
                $('#sync-console-log').append('<div style="color: #f59e0b;">⏸️ Processamento pausado pelo usuário.</div>');
            });

            function processNext() {
                if (!isRunning || queue.length === 0) {
                    if (queue.length === 0 && totalItems > 0) {
                        $('#sync-status-text').text('✓ Concluído com sucesso!');
                        $('#sync-progress-bar').css('background', '#059669');
                        $('#sync-console-log').append('<div style="color: #10b981; font-weight: bold;">[3/3] Sincronização concluída! Todos os ' + totalItems + ' produtos foram auditados.</div>');
                        $('#btn-pause-batch-sync').hide();
                        $('#btn-start-batch-sync').prop('disabled', false).text('🔄 Sincronizar Novamente');
                    }
                    return;
                }

                var pid = queue.shift();
                $.post(ajaxurl, {
                    action: 'casosex_meli_sync_single_product',
                    product_id: pid,
                    nonce: '<?php echo wp_create_nonce('casosex_meli_batch_nonce'); ?>'
                }, function(res) {
                    processed++;
                    var pct = Math.round((processed / totalItems) * 100);
                    $('#sync-progress-bar').css('width', pct + '%');
                    $('#sync-percentage-text').text(pct + '% (' + processed + '/' + totalItems + ')');

                    if (res.success) {
                        var d = res.data;
                        var logLine = '✓ [' + processed + '/' + totalItems + '] ID ' + pid + ': Score ' + d.matching_score + '% | MeLi R$ ' + d.market_price.toFixed(2) + ' | Margem R$ ' + d.margin.toFixed(2);
                        $('#sync-console-log').append('<div style="color: #4ade80;">' + logLine + '</div>');
                    } else {
                        $('#sync-console-log').append('<div style="color: #94a3b8;">• [' + processed + '/' + totalItems + '] ID ' + pid + ': ' + (res.data || 'Sem correspondência') + '</div>');
                    }

                    var consoleDiv = document.getElementById('sync-console-log');
                    consoleDiv.scrollTop = consoleDiv.scrollHeight;

                    setTimeout(processNext, 200); // 200ms anti rate-limit
                }).fail(function() {
                    processed++;
                    setTimeout(processNext, 200);
                });
            }
        });
        </script>
        <?php
    }

    public static function ajax_get_sync_queue() {
        check_ajax_referer('casosex_meli_batch_nonce', 'nonce');
        $args = [
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'post_status'    => 'any',
            'fields'         => 'ids'
        ];
        $ids = get_posts($args);
        wp_send_json_success($ids);
    }

    public static function ajax_sync_single_product() {
        check_ajax_referer('casosex_meli_batch_nonce', 'nonce');
        $pid = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
        if (!$pid) {
            wp_send_json_error('ID inválido');
        }

        $res = CasoSex_MeLi_Matcher::match_product($pid);
        if (is_wp_error($res)) {
            wp_send_json_error($res->get_error_message());
        }

        wp_send_json_success($res);
    }
}
