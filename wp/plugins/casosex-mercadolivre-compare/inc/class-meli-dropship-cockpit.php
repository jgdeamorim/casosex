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
                        <h2 style="color: #fff; font-size: 22px; font-weight: 800; margin: 0 0 6px 0;">⚡ Cockpit Financeiro & Simulador de Precificação Multicanal</h2>
                        <p style="color: #94a3b8; margin: 0; font-size: 13px;">
                            Operação própria com compra em caixa fechada da fábrica local (frete R$ 0, pedido mínimo R$ 450,00). Preços calculados sem multiplicador cego de 1.8x.
                        </p>
                    </div>
                </div>

                <!-- SIMULADOR INTERATIVO -->
                <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; border-radius: 10px; padding: 18px; margin-bottom: 25px;">
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <label style="color: #cbd5e1; font-size: 12px; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 5px;">Custo Fábrica INTT ES (R$)</label>
                            <input type="number" id="sim_cost" value="37.70" step="0.01" style="width: 100%; font-size: 16px; font-weight: bold; background: #1e293b; color: #38bdf8; border: 1px solid #475569; padding: 8px 12px; border-radius: 6px;">
                        </div>
                        <div style="flex: 1; min-width: 140px;">
                            <label style="color: #cbd5e1; font-size: 12px; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 5px;">Unidades Caixa</label>
                            <input type="number" id="sim_box" value="72" step="1" style="width: 100%; font-size: 16px; font-weight: bold; background: #1e293b; color: #fff; border: 1px solid #475569; padding: 8px 12px; border-radius: 6px;">
                        </div>
                        <div style="flex: 1; min-width: 160px;">
                            <label style="color: #cbd5e1; font-size: 12px; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 5px;">Concorrente MeLi (R$)</label>
                            <input type="number" id="sim_meli" value="113.99" step="0.01" style="width: 100%; font-size: 16px; font-weight: bold; background: #1e293b; color: #a3e635; border: 1px solid #475569; padding: 8px 12px; border-radius: 6px;">
                        </div>
                    </div>

                    <!-- 4 COLUNAS DE PREÇO -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;" id="sim_cards">
                        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; padding: 14px; border-radius: 8px;">
                            <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">MeLi Clássico (13%)</div>
                            <div style="color: #fff; font-size: 20px; font-weight: 800; margin: 4px 0;" id="card_classic_price">R$ 0,00</div>
                            <div style="color: #4ade80; font-size: 12px;" id="card_classic_profit">Lucro Líquido: R$ 0,00</div>
                        </div>
                        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; padding: 14px; border-radius: 8px;">
                            <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">MeLi Premium (18% / 10x)</div>
                            <div style="color: #fff; font-size: 20px; font-weight: 800; margin: 4px 0;" id="card_premium_price">R$ 0,00</div>
                            <div style="color: #4ade80; font-size: 12px;" id="card_premium_profit">Lucro Líquido: R$ 0,00</div>
                        </div>
                        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; padding: 14px; border-radius: 8px;">
                            <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">Loja casosex.com.br</div>
                            <div style="color: #fff; font-size: 20px; font-weight: 800; margin: 4px 0;" id="card_store_price">R$ 0,00</div>
                            <div style="color: #4ade80; font-size: 12px;" id="card_store_profit">Lucro Líquido: R$ 0,00</div>
                        </div>
                        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #475569; padding: 14px; border-radius: 8px;">
                            <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">Landing Page (com Ads)</div>
                            <div style="color: #fff; font-size: 20px; font-weight: 800; margin: 4px 0;" id="card_lp_price">R$ 0,00</div>
                            <div style="color: #4ade80; font-size: 12px;" id="card_lp_profit">Lucro Líquido: R$ 0,00</div>
                        </div>
                    </div>
                    <div style="margin-top: 10px; font-size: 12px; color: #a3e635;" id="card_break_even">
                        🎯 Ponto de Equilíbrio: Venda X unidades para pagar a caixa inteira.
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

        <script>
        jQuery(document).ready(function($) {
            function updateSimulator() {
                var cost = parseFloat($('#sim_cost').val()) || 0;
                var box = parseInt($('#sim_box').val()) || 1;
                var meli = parseFloat($('#sim_meli').val()) || 0;

                var pkg = <?php echo json_encode($cfg['packaging_cost']); ?>;
                var tax = <?php echo json_encode($cfg['tax_percent']); ?>;
                var gw = <?php echo json_encode($cfg['gateway_fee']); ?>;
                var classic_fee = <?php echo json_encode($cfg['meli_classic_fee']); ?>;
                var premium_fee = <?php echo json_encode($cfg['meli_premium_fee']); ?>;
                var m_store = <?php echo json_encode($cfg['target_margin_store']); ?>;
                var m_meli = <?php echo json_encode($cfg['target_margin_meli']); ?>;
                var m_lp = <?php echo json_encode($cfg['target_margin_lp']); ?>;
                var min_order = <?php echo json_encode($cfg['b2b_min_order']); ?>;

                var hard_floor = ((cost * 1.25) + pkg) / (1 - (tax / 100));

                // Store
                var p_store = Math.max((cost + pkg) / (1 - ((tax + gw + m_store)/100)), hard_floor);
                var l_store = p_store - cost - pkg - (p_store * (tax + gw)/100);

                // Classic
                var p_classic = Math.max((cost + pkg) / (1 - ((tax + classic_fee + m_meli)/100)), hard_floor);
                var l_classic = p_classic - cost - pkg - (p_classic * (tax + classic_fee)/100);

                // Premium
                var p_premium = Math.max((cost + pkg) / (1 - ((tax + premium_fee + m_meli)/100)), hard_floor);
                var l_premium = p_premium - cost - pkg - (p_premium * (tax + premium_fee)/100);

                // LP
                var cpa = cost * 0.20;
                var p_lp = Math.max((cost + pkg + cpa) / (1 - ((tax + gw + m_lp)/100)), hard_floor);
                var l_lp = p_lp - cost - pkg - cpa - (p_lp * (tax + gw)/100);

                // Break-even
                var box_inv = Math.max(cost * box, min_order);
                var be_units = p_store > 0 ? Math.ceil(box_inv / p_store) : box;

                $('#card_classic_price').text('R$ ' + p_classic.toFixed(2));
                $('#card_classic_profit').text('Lucro Líquido: R$ ' + l_classic.toFixed(2));

                $('#card_premium_price').text('R$ ' + p_premium.toFixed(2));
                $('#card_premium_profit').text('Lucro Líquido: R$ ' + l_premium.toFixed(2));

                $('#card_store_price').text('R$ ' + p_store.toFixed(2));
                $('#card_store_profit').text('Lucro Líquido: R$ ' + l_store.toFixed(2));

                $('#card_lp_price').text('R$ ' + p_lp.toFixed(2));
                $('#card_lp_profit').text('Lucro Líquido: R$ ' + l_lp.toFixed(2));

                $('#card_break_even').html('🎯 <strong>Ponto de Equilíbrio:</strong> Venda apenas <strong>' + be_units + ' de ' + box + ' unidades</strong> para pagar o investimento da caixa/pedido mínimo (R$ ' + box_inv.toFixed(2) + ').');
            }

            $('#sim_cost, #sim_box, #sim_meli').on('input', updateSimulator);
            updateSimulator();
        });
        </script>
        <?php
    }
}
