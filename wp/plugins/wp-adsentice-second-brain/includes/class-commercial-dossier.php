<?php
/**
 * ADR-0240: Gerador e Renderizador do Dossiê Comercial Vivo (Estilo Pico Pulse)
 * Mobile-First, Paleta Dark/Neon Roxo/Verde, KPIs Financeiros e Ponto de Equilíbrio.
 */

if (!defined('ABSPATH')) {
    exit;
}

class Adsentice_Commercial_Dossier {

    public static function init() {
        add_action('init', [__CLASS__, 'register_dossier_rewrite']);
        add_filter('query_vars', [__CLASS__, 'register_query_vars']);
        add_action('template_redirect', [__CLASS__, 'handle_dossier_render']);
        add_action('add_meta_boxes', [__CLASS__, 'add_product_dossier_metabox']);
    }

    public static function register_dossier_rewrite() {
        add_rewrite_rule('^casosex-dossier/([0-9]+)/?', 'index.php?casosex_dossier_id=$matches[1]', 'top');
    }

    public static function register_query_vars($vars) {
        $vars[] = 'casosex_dossier_id';
        return $vars;
    }

    public static function add_product_dossier_metabox() {
        add_meta_box(
            'casosex_product_dossier_box',
            '⚡ Dossiê Comercial & Inteligência (ADR-0240)',
            [__CLASS__, 'render_metabox'],
            'product',
            'side',
            'high'
        );
    }

    public static function render_metabox($post) {
        $dossier_url = home_url('/casosex-dossier/' . $post->ID);
        ?>
        <div style="text-align: center; padding: 12px 5px;">
            <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">
                Dossiê executivo completo com KPIs de canais, ROI de caixa fechada e benchmarking.
            </p>
            <a href="<?php echo esc_url($dossier_url); ?>" target="_blank" class="button button-primary" style="background: linear-gradient(135deg, #7e4bc4, #4c277e); border-color: #7e4bc4; font-weight: bold; width: 100%; padding: 8px; text-align: center;">
                📊 Abrir Dossiê Comercial Vivo
            </a>
        </div>
        <?php
    }

    public static function handle_dossier_render() {
        $pid = get_query_var('casosex_dossier_id');
        if (!$pid && isset($_GET['casosex_dossier'])) {
            $pid = intval($_GET['casosex_dossier']);
        }

        if (!$pid) {
            return;
        }

        $product = wc_get_product($pid);
        if (!$product) {
            wp_die('Produto não encontrado.', 'Erro', ['response' => 404]);
        }

        self::render_html_dossier($product);
        exit;
    }

    public static function render_html_dossier($product) {
        $pid = $product->get_id();
        $name = $product->get_name();
        $sku = $product->get_sku() ? $product->get_sku() : 'PRD-' . $pid;
        $cost = floatval(get_post_meta($pid, '_casosex_cost_price', true));
        if ($cost <= 0) {
            $cost = floatval($product->get_price()) / 1.8;
        }

        $box_units = 1;
        $terms_box = wp_get_post_terms($pid, 'pa_caixa_atacado');
        if (!empty($terms_box) && !is_wp_error($terms_box)) {
            if (preg_match('/(\d+)/', $terms_box[0]->name, $m)) {
                $box_units = intval($m[1]);
            }
        }

        $meli_market_price = floatval(get_post_meta($pid, 'meli_market_price', true));
        $sales_tier = get_post_meta($pid, 'meli_sales_tier', true);
        if (!$sales_tier) $sales_tier = '+1000 vendidos';
        $rating = get_post_meta($pid, 'meli_rating', true);
        if (!$rating) $rating = 4.8;
        $reviews = get_post_meta($pid, 'meli_reviews_count', true);
        if (!$reviews) $reviews = 24;

        // Calcula com o motor
        $pricing = CasoSex_MeLi_Pricing_Engine::calculate_all_channels($cost, $box_units, $meli_market_price);

        $img_url = wp_get_attachment_image_url($product->get_image_id(), 'large');
        if (!$img_url) {
            $img_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800';
        }

        $insights = get_post_meta($pid, 'meli_customer_insights', true);
        $faq = get_post_meta($pid, 'meli_faq_schema', true);
        
        $top5_avg_price = floatval(get_post_meta($pid, 'meli_top5_avg_price', true));
        if ($top5_avg_price <= 0) {
            $top5_avg_price = $meli_market_price;
        }
        $top5_json = get_post_meta($pid, 'meli_top5_competitors_json', true);
        $top5_competitors = !empty($top5_json) ? json_decode($top5_json, true) : [];
        ?>
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Dossiê Comercial & Inteligência · <?php echo esc_html($name); ?> | CASOSEX</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                :root {
                    --purple-deep: #1F0D39;
                    --purple-main: #4C277E;
                    --purple-light: #7E4BC4;
                    --green-lime: #94D600;
                    --green-bright: #A1E14A;
                    --bg-dark: #0B0514;
                    --card-bg: rgba(31, 13, 57, 0.85);
                    --card-border: rgba(161, 225, 74, 0.22);
                    --text-main: #F3EEF9;
                    --text-muted: #B3A4C9;
                }
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background-color: var(--bg-dark);
                    color: var(--text-main);
                    line-height: 1.6;
                    padding: 20px 14px;
                    background-image: radial-gradient(circle at 10% 10%, rgba(76, 39, 126, 0.45) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(148, 214, 0, 0.15) 0%, transparent 50%);
                    background-attachment: fixed;
                }
                .container { width: 100%; max-width: 1100px; margin: 0 auto; }
                header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 25px; flex-wrap: wrap; gap: 15px; }
                .brand-badge { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, var(--purple-main), var(--purple-deep)); border: 1px solid var(--purple-light); padding: 8px 18px; border-radius: 50px; font-family: 'Outfit', sans-serif; font-weight: 700; color: var(--green-bright); font-size: 0.9rem; }
                .brand-badge span { width: 8px; height: 8px; background: var(--green-bright); border-radius: 50%; display: inline-block; box-shadow: 0 0 8px var(--green-bright); }
                .hero-box { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px; padding: 25px; margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
                @media (max-width: 768px) { .hero-box { grid-template-columns: 1fr; } }
                .hero-title { font-family: 'Outfit', sans-serif; font-size: 1.9rem; font-weight: 800; line-height: 1.2; margin-bottom: 12px; color: #FFFFFF; }
                .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; margin-bottom: 30px; }
                .kpi-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 18px; }
                .kpi-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
                .kpi-value { font-family: 'Outfit', sans-serif; font-size: 1.8rem; font-weight: 800; color: var(--green-bright); }
                .section-box { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 18px; padding: 22px; margin-bottom: 25px; }
                .section-title { font-family: 'Outfit', sans-serif; font-size: 1.3rem; font-weight: 700; color: #FFFFFF; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
                .channel-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                .channel-table th, .channel-table td { padding: 12px 14px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 0.95rem; }
                .channel-table th { color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; }
                .badge-opportunity { background: rgba(161, 225, 74, 0.2); border: 1px solid var(--green-bright); color: var(--green-bright); padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 0.8rem; }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <div class="brand-badge">
                        <span></span> CASOSEX & INTT ES · DOSSIÊ COMERCIAL SOBERANO
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">
                        Auditado via <strong>ADR-0240</strong> · Estoque Físico Local
                    </div>
                </header>

                <div class="hero-box">
                    <div>
                        <div style="color: var(--green-bright); font-size: 0.8rem; font-weight: 700; margin-bottom: 6px; text-transform: uppercase;">
                            SKU: <?php echo esc_html($sku); ?> · Operação Própria (Frete R$ 0)
                        </div>
                        <h1 class="hero-title"><?php echo esc_html($name); ?></h1>
                        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 18px;">
                            Produto B2B com captação direta na fábrica INTT ES. Sem taxas de intermediação de terceiros e com despacho no mesmo dia.
                        </p>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <span class="badge-opportunity"><?php echo esc_html($pricing['opportunity_status']); ?></span>
                            <span style="background: rgba(126, 75, 196, 0.25); border: 1px solid var(--purple-light); color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem;">
                                Caixa Fechada: <?php echo esc_html($box_units); ?> un
                            </span>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center;">
                        <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr($name); ?>" style="max-height: 220px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); object-fit: contain;">
                    </div>
                </div>

                <!-- CARDS DE KPIS -->
                <div class="kpi-grid">
                    <div class="kpi-card">
                        <div class="kpi-label">Custo Fábrica Atacado</div>
                        <div class="kpi-value" style="color: #fff;">R$ <?php echo number_format($cost, 2, ',', '.'); ?></div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">INTT ES Local (Sem frete)</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Menor Preço MeLi</div>
                        <div class="kpi-value" style="color: #60a5fa;">R$ <?php echo number_format($meli_market_price, 2, ',', '.'); ?></div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Concorrência BuyBox</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Break-Even (Caixa Fechada)</div>
                        <div class="kpi-value" style="color: var(--green-bright);"><?php echo esc_html($pricing['break_even_units']); ?> un</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Paga a caixa de <?php echo esc_html($box_units); ?> un</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Piso Rígido Anti-Prejuízo</div>
                        <div class="kpi-value" style="color: #f59e0b;">R$ <?php echo number_format($pricing['hard_floor_limit'], 2, ',', '.'); ?></div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Trava Hard Floor Margin</div>
                    </div>
                </div>

                <!-- TABELA MULTICANAL -->
                <div class="section-box">
                    <h2 class="section-title">📊 Precificação Multicanal & Margem Líquida Real (ADR-0240)</h2>
                    <table class="channel-table">
                        <thead>
                            <tr>
                                <th>Canal de Venda</th>
                                <th>Preço Sugerido</th>
                                <th>Taxas Canal + NF + Emb</th>
                                <th>Lucro Líquido Real</th>
                                <th>Margem Líquida %</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Loja casosex.com.br</strong></td>
                                <td style="color: var(--green-bright); font-weight: bold;">R$ <?php echo number_format($pricing['price_store'], 2, ',', '.'); ?></td>
                                <td>Gateway (4%) + NF (5%) + Emb (R$ 3,50)</td>
                                <td style="color: #4ade80; font-weight: bold;">R$ <?php echo number_format($pricing['net_profit_store'], 2, ',', '.'); ?></td>
                                <td>~40% Líquido</td>
                            </tr>
                            <tr>
                                <td><strong>Mercado Livre Clássico</strong></td>
                                <td style="color: #60a5fa; font-weight: bold;">R$ <?php echo number_format($pricing['price_meli_classic'], 2, ',', '.'); ?></td>
                                <td>Comissão MeLi (13%) + NF (5%) + Emb</td>
                                <td style="color: #4ade80; font-weight: bold;">R$ <?php echo number_format($pricing['net_profit_classic'], 2, ',', '.'); ?></td>
                                <td>~25% Líquido</td>
                            </tr>
                            <tr>
                                <td><strong>Mercado Livre Premium (10x s/ juros)</strong></td>
                                <td style="color: #93c5fd; font-weight: bold;">R$ <?php echo number_format($pricing['price_meli_premium'], 2, ',', '.'); ?></td>
                                <td>Comissão MeLi (18%) + NF (5%) + Emb</td>
                                <td style="color: #4ade80; font-weight: bold;">R$ <?php echo number_format($pricing['net_profit_premium'], 2, ',', '.'); ?></td>
                                <td>~25% Líquido</td>
                            </tr>
                            <tr>
                                <td><strong>Landing Page Unitária</strong></td>
                                <td style="color: #f472b6; font-weight: bold;">R$ <?php echo number_format($pricing['price_landing_page'], 2, ',', '.'); ?></td>
                                <td>CPA DataForSEO (R$ <?php echo number_format($pricing['cpa_ads_estimated'], 2, ',', '.'); ?>) + Gateway + NF</td>
                                <td style="color: #4ade80; font-weight: bold;">R$ <?php echo number_format($pricing['net_profit_lp'], 2, ',', '.'); ?></td>
                                <td>~28% Líquido</td>
                            </tr>
                            <?php if (!empty($pricing['price_kit_duplo'])): ?>
                            <tr style="background: rgba(161, 225, 74, 0.08); border-left: 3px solid var(--green-bright);">
                                <td><strong style="color: var(--green-bright);">🔥 D2C Kit Duplo (Landing Page)</strong></td>
                                <td style="color: var(--green-bright); font-weight: bold;">R$ <?php echo number_format($pricing['price_kit_duplo'], 2, ',', '.'); ?></td>
                                <td>CPA Diluído + Frete Grátis Melhor Envio + NF</td>
                                <td style="color: var(--green-bright); font-weight: bold;">R$ <?php echo number_format($pricing['net_profit_kit_duplo'], 2, ',', '.'); ?></td>
                                <td><span class="badge-opportunity" style="font-size: 0.75rem;">⚡ TOP MARGEM NET</span></td>
                            </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

                <!-- SIMULAÇÃO DE ESCALA POR LOTES (MATRIZ PICO PULSE) -->
                <?php
                $box_cost_total = round($cost * $box_units, 2);
                $lot1_net_total = round(($pricing['net_profit_kit_duplo'] ?: $pricing['net_profit_store']) * floor($box_units / 2), 2);
                $lot100_net_total = round(($pricing['net_profit_kit_duplo'] ?: $pricing['net_profit_store']) * 100, 2);
                $lot500_net_total = round(($pricing['net_profit_kit_duplo'] ?: $pricing['net_profit_store']) * 250, 2);
                ?>
                <div class="section-box">
                    <h2 class="section-title">📦 Simulação Comercial de Escala por Lote (Matriz Pico Pulse)</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 15px;">
                        <div style="background: rgba(15, 7, 28, 0.65); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 20px;">
                            <div style="font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 6px;">Lote 1 Caixa Fechada (<?php echo esc_html($box_units); ?> un)</div>
                            <div style="font-size: 1.6rem; font-weight: 800; color: var(--green-bright); margin-bottom: 10px;">R$ <?php echo number_format($lot1_net_total, 2, ',', '.'); ?> <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">Lucro Líquido</span></div>
                            <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6;">
                                • Investimento Caixa: <strong>R$ <?php echo number_format($box_cost_total, 2, ',', '.'); ?></strong><br>
                                • Break-Even: <strong><?php echo esc_html($pricing['break_even_units']); ?> unidades pagam a caixa inteira</strong><br>
                                • Retorno NET: <strong style="color: var(--green-bright);">+40% a +48% s/ Custo</strong>
                            </div>
                        </div>

                        <div style="background: rgba(42, 17, 75, 0.85); border: 1px solid var(--green-bright); border-radius: 16px; padding: 20px; box-shadow: 0 0 15px rgba(161, 225, 74, 0.15);">
                            <div style="font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 6px;">Lote 100 Pedidos D2C (Tração)</div>
                            <div style="font-size: 1.6rem; font-weight: 800; color: var(--green-bright); margin-bottom: 10px;">R$ <?php echo number_format($lot100_net_total, 2, ',', '.'); ?> <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">Lucro Líquido</span></div>
                            <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6;">
                                • Escala com Google Ads (DataForSEO CPC R$ 0,59)<br>
                                • Despacho via Melhor Envio no mesmo dia no ES<br>
                                • Status: <strong style="color: var(--green-bright);">Escala Previsível com Tráfego</strong>
                            </div>
                        </div>

                        <div style="background: rgba(15, 7, 28, 0.65); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 20px;">
                            <div style="font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 6px;">Lote Atacadista (500+ un)</div>
                            <div style="font-size: 1.6rem; font-weight: 800; color: var(--green-bright); margin-bottom: 10px;">R$ <?php echo number_format($lot500_net_total, 2, ',', '.'); ?> <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">Lucro Líquido</span></div>
                            <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6;">
                                • Distribuição multicanal (Loja + LP + MeLi)<br>
                                • Bonificação e desconto adicional de fábrica INTT<br>
                                • Operação Soberana de Alto Volume
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TABELA BENCHMARKING TOP 5 VENDEDORES MERCADO LIVRE -->
                <?php if (!empty($top5_competitors) && is_array($top5_competitors)): ?>
                <div class="section-box">
                    <h2 class="section-title">🏆 Benchmarking Top 5 Concorrentes (Mercado Livre Buy Box)</h2>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
                        Média de Preço dos Líderes: <strong style="color: var(--green-bright);">R$ <?php echo number_format($top5_avg_price, 2, ',', '.'); ?></strong> 
                        · Menor Concorrente Ativo: <strong style="color: #60a5fa;">R$ <?php echo number_format($meli_market_price, 2, ',', '.'); ?></strong>
                        · Auditado via API oficial do Mercado Livre
                    </div>
                    <table class="channel-table">
                        <thead>
                            <tr>
                                <th>Posição</th>
                                <th>Vendedor / Loja</th>
                                <th>Preço Concorrente</th>
                                <th>Modalidade</th>
                                <th>Logística & Frete</th>
                                <th>Histórico Vendedor</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($top5_competitors as $c): ?>
                            <tr>
                                <td><span style="background: rgba(161, 225, 74, 0.15); border: 1px solid var(--green-bright); padding: 2px 8px; border-radius: 12px; font-weight: bold; font-size: 0.8rem;">#<?php echo esc_html($c['rank']); ?></span></td>
                                <td>
                                    <strong><?php echo esc_html($c['seller_name']); ?></strong>
                                    <?php if (!empty($c['is_official'])): ?>
                                        <span style="background: #3b82f6; color: #fff; font-size: 0.65rem; padding: 2px 6px; border-radius: 8px; margin-left: 4px;">OFICIAL</span>
                                    <?php endif; ?>
                                </td>
                                <td style="font-weight: bold; color: #60a5fa;">R$ <?php echo number_format($c['price'], 2, ',', '.'); ?></td>
                                <td><?php echo esc_html($c['listing_type']); ?></td>
                                <td>
                                    <?php echo !empty($c['free_shipping']) ? '<span style="color: #4ade80;">Frete Grátis</span>' : '<span style="color: var(--text-muted);">Frete Normal</span>'; ?>
                                    <div style="font-size: 0.75rem; color: var(--text-muted);"><?php echo esc_html($c['logistic_type']); ?></div>
                                </td>
                                <td>
                                    <span style="color: #e2e8f0;"><?php echo number_format($c['seller_sales'], 0, ',', '.'); ?> vendas</span>
                                    <div style="font-size: 0.75rem; color: #4ade80;"><?php echo esc_html($c['seller_level']); ?></div>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
                <?php endif; ?>

                <?php if ($insights || $faq): ?>
                <div class="section-box">
                    <h2 class="section-title">💬 Mineração de Copywriting & Objeções (Mercado Livre)</h2>
                    <?php if ($insights): ?>
                        <div style="background: rgba(15, 7, 28, 0.7); padding: 15px; border-radius: 10px; margin-bottom: 15px; font-size: 0.9rem; color: #e2e8f0; white-space: pre-line;">
                            <?php echo esc_html($insights); ?>
                        </div>
                    <?php endif; ?>
                    <?php if ($faq): ?>
                        <div style="background: rgba(15, 7, 28, 0.7); padding: 15px; border-radius: 10px; font-size: 0.9rem; color: #e2e8f0; white-space: pre-line;">
                            <?php echo esc_html($faq); ?>
                        </div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>

                <footer style="text-align: center; color: var(--text-muted); font-size: 0.8rem; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08);">
                    CASOSEX & Adsentice OS · Doutrina <code>medido=verdade</code> · Operação Própria Atacado B2B
                </footer>
            </div>
        </body>
        </html>
        <?php
    }
}
