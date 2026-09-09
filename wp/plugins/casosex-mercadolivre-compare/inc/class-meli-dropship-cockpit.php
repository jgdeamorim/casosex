<?php
/**
 * ADR-0240: Injeção do Cockpit de Custos Operacionais & Simulador Multicanal em wc_dropship_settings
 */

if (!defined('ABSPATH')) {
    exit;
}

class CasoSex_MeLi_Dropship_Cockpit {

    public static function init() {
        add_action('woocommerce_settings_wc_dropship_settings', [__CLASS__, 'render_cockpit_top'], 1);
        add_action('admin_init', [__CLASS__, 'save_settings']);
    }

    public static function save_settings() {
        if (!empty($_POST['casosex_save_pricing_cockpit']) && check_admin_referer('casosex_pricing_cockpit_nonce')) {
            update_option('casosex_cost_packaging_fixed', floatval($_POST['casosex_cost_packaging_fixed']));
            update_option('casosex_tax_invoice_percent', floatval($_POST['casosex_tax_invoice_percent']));
            update_option('casosex_meli_classic_fee', floatval($_POST['casosex_meli_classic_fee']));
            update_option('casosex_meli_premium_fee', floatval($_POST['casosex_meli_premium_fee']));
            update_option('casosex_gateway_fee_percent', floatval($_POST['casosex_gateway_fee_percent']));
            update_option('casosex_target_margin_store', floatval($_POST['casosex_target_margin_store']));
            update_option('casosex_target_margin_meli', floatval($_POST['casosex_target_margin_meli']));
            update_option('casosex_target_margin_lp', floatval($_POST['casosex_target_margin_lp']));
            update_option('casosex_b2b_min_order', floatval($_POST['casosex_b2b_min_order']));

            add_action('admin_notices', function() {
                echo '<div class="notice notice-success is-dismissible"><p><strong>✓ Sucesso:</strong> Parâmetros operacionais de precificação multicanal salvos com sucesso!</p></div>';
            });
        }
    }

    public static function render_cockpit_top() {
        $cfg = CasoSex_MeLi_Pricing_Engine::get_settings();
        ?>
        <div class="wrap" style="margin-bottom: 25px; max-width: 100%;">
            <div style="background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); color: #fff; padding: 25px; border-radius: 12px; border: 1px solid #3b82f6; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
                    <div>
                        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(59, 130, 246, 0.2); border: 1px solid #60a5fa; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; color: #93c5fd; margin-bottom: 8px;">
                            <span style="width: 8px; height: 8px; background: #38bdf8; border-radius: 50%; display: inline-block;"></span>
                            ADR-0240 · ESTOQUE PRÓPRIO ATACADO B2B (INTT ES)
                        </div>
                        <h2 style="color: #fff; font-size: 22px; font-weight: 800; margin: 0 0 6px 0;">🧠 Console de Telemetria OODA & Governança Autônoma (ADR-0241)</h2>
                        <p style="color: #94a3b8; margin: 0; font-size: 13px;">
                            Gânglio Nervoso Adsentice Second Brain: precificação 100% autônoma, classificação semântica de canais e trava anti-prejuízo sem necessidade de digitação manual.
                        </p>
                    </div>
                </div>

                <?php
                // Telemetria do Catálogo
                $total_prods = wp_count_posts('product')->publish ?? 0;
                $prods_synced = count(get_posts([
                    'post_type'   => 'product',
                    'meta_key'    => 'meli_last_sync',
                    'post_status' => 'publish',
                    'numberposts' => -1,
                    'fields'      => 'ids'
                ]));
                $high_margin_count = count(get_posts([
                    'post_type'   => 'product',
                    'meta_key'    => 'meli_opportunity_index',
                    'meta_value'  => 'HIGH_MARGIN',
                    'post_status' => 'publish',
                    'numberposts' => -1,
                    'fields'      => 'ids'
                ]));
                $order_bump_count = count(get_posts([
                    'post_type'   => 'product',
                    'meta_key'    => 'meli_opportunity_index',
                    'meta_value'  => 'ORDER_BUMP',
                    'post_status' => 'publish',
                    'numberposts' => -1,
                    'fields'      => 'ids'
                ]));
                $pct_synced = $total_prods > 0 ? round(($prods_synced / $total_prods) * 100, 1) : 0;
                ?>

                <!-- PAINEL DE TELEMETRIA OODA (ZERO MANUALIDADE) -->
                <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; border-radius: 10px; padding: 18px; margin-bottom: 25px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; padding: 15px; border-radius: 8px;">
                            <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">Sincronização Autônoma</div>
                            <div style="color: #38bdf8; font-size: 22px; font-weight: 800; margin: 4px 0;"><?php echo esc_html($pct_synced); ?>%</div>
                            <div style="color: #cbd5e1; font-size: 12px;"><?php echo esc_html($prods_synced); ?> de <?php echo esc_html($total_prods); ?> produtos ativos</div>
                        </div>
                        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; padding: 15px; border-radius: 8px;">
                            <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">Candidatos Landing Page</div>
                            <div style="color: #4ade80; font-size: 22px; font-weight: 800; margin: 4px 0;"><?php echo esc_html($high_margin_count); ?> SKUs</div>
                            <div style="color: #cbd5e1; font-size: 12px;">🟢 Alta Margem + Tráfego Pago</div>
                        </div>
                        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; padding: 15px; border-radius: 8px;">
                            <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">Combos & Order Bumps</div>
                            <div style="color: #facc15; font-size: 22px; font-weight: 800; margin: 4px 0;"><?php echo esc_html($order_bump_count); ?> SKUs</div>
                            <div style="color: #cbd5e1; font-size: 12px;">🟡 Kit Duplo & Loja Virtual</div>
                        </div>
                        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; padding: 15px; border-radius: 8px;">
                            <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">Health & APIs</div>
                            <div style="color: #a78bfa; font-size: 16px; font-weight: 800; margin: 6px 0;">✓ DFS · MeLi · Merchant</div>
                            <div style="color: #cbd5e1; font-size: 12px;">Saldo DataForSEO: $13.52 USD</div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; background: rgba(30, 41, 59, 0.5); padding: 12px 16px; border-radius: 8px; border: 1px dashed #475569;">
                        <div>
                            <strong style="color: #fff; font-size: 13px;">Gatilho do Ciclo OODA em Lote:</strong>
                            <p style="color: #94a3b8; margin: 0; font-size: 12px;">Executa benchmarking dos Top 5 do Mercado Livre, busca CPC no DataForSEO e atualiza preços com Piso Rígido.</p>
                        </div>
                        <a href="<?php echo admin_url('admin.php?page=casosex-meli-batch'); ?>" class="button button-primary" style="background: linear-gradient(135deg, #10b981, #059669); border-color: #059669; font-weight: bold; padding: 4px 16px; height: auto; font-size: 13px;">
                            ⚡ Disparar Ciclo OODA em Lote
                        </a>
                    </div>
                </div>

                <!-- FORMULÁRIO DE GOVERNANÇA DE TAXAS -->
                <form method="post" action="">
                    <?php wp_nonce_field('casosex_pricing_cockpit_nonce'); ?>
                    <input type="hidden" name="casosex_save_pricing_cockpit" value="1">

                    <h3 style="color: #e2e8f0; font-size: 15px; margin: 0 0 12px 0;">⚙️ Parâmetros Operacionais Fixos da Sua Operação:</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; margin-bottom: 15px;">
                        <div>
                            <label style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">Embalagem Própria por Pedido (R$)</label>
                            <input type="number" step="0.10" name="casosex_cost_packaging_fixed" value="<?php echo esc_attr($cfg['packaging_cost']); ?>" style="width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; padding: 6px 10px; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">Alíquota Nota Fiscal / Simples (%)</label>
                            <input type="number" step="0.10" name="casosex_tax_invoice_percent" value="<?php echo esc_attr($cfg['tax_percent']); ?>" style="width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; padding: 6px 10px; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">Comissão MeLi Clássico (%)</label>
                            <input type="number" step="0.10" name="casosex_meli_classic_fee" value="<?php echo esc_attr($cfg['meli_classic_fee']); ?>" style="width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; padding: 6px 10px; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">Comissão MeLi Premium (%)</label>
                            <input type="number" step="0.10" name="casosex_meli_premium_fee" value="<?php echo esc_attr($cfg['meli_premium_fee']); ?>" style="width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; padding: 6px 10px; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">Taxa Gateway Loja Própria (%)</label>
                            <input type="number" step="0.10" name="casosex_gateway_fee_percent" value="<?php echo esc_attr($cfg['gateway_fee']); ?>" style="width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; padding: 6px 10px; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">Margem Alvo Loja (%)</label>
                            <input type="number" step="0.10" name="casosex_target_margin_store" value="<?php echo esc_attr($cfg['target_margin_store']); ?>" style="width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; padding: 6px 10px; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">Margem Alvo MeLi (%)</label>
                            <input type="number" step="0.10" name="casosex_target_margin_meli" value="<?php echo esc_attr($cfg['target_margin_meli']); ?>" style="width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; padding: 6px 10px; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">Pedido Mínimo B2B Fábrica (R$)</label>
                            <input type="number" step="10.00" name="casosex_b2b_min_order" value="<?php echo esc_attr($cfg['b2b_min_order']); ?>" style="width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; padding: 6px 10px; border-radius: 4px;">
                        </div>
                    </div>

                    <button type="submit" class="button button-primary" style="background: #2563eb; border-color: #1d4ed8; font-weight: bold;">
                        💾 Salvar Parâmetros Operacionais de Precificação
                    </button>
                </form>
            </div>
        </div>

        <?php
    }
}
