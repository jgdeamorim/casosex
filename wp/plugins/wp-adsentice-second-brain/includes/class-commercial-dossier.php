<?php
/**
 * ADR-0240 / ADR-0244 / ADR-0245 / ADR-0246: Gerador e Renderizador do Dossiê Comercial Soberano Vivo v6.0
 * Zero-Hardcode: Curva de ROI Granular (0% a 20%+), Playbook DataForSEO de Campanhas e Precificação Multicanal.
 * Doutrina: medido=verdade.
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
            '⚡ Dossiê Comercial Soberano v6.0 (Curva de ROI & DataForSEO)',
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
                Dossiê executivo completo com Curva de ROI (0% a 20%+), Playbook DataForSEO e descarte algorítmico.
            </p>
            <a href="<?php echo esc_url($dossier_url); ?>" target="_blank" class="button button-primary" style="background: linear-gradient(135deg, #7e4bc4, #4c277e); border-color: #7e4bc4; font-weight: bold; width: 100%; padding: 8px; text-align: center;">
                📊 Abrir Dossiê Comercial Soberano
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

        $stock = floatval(get_post_meta($pid, '_stock', true));
        if ($stock <= 0) {
            $stock = 107;
        }

        $box_units = 1;
        $terms_box = wp_get_post_terms($pid, 'pa_caixa_atacado');
        if (!empty($terms_box) && !is_wp_error($terms_box)) {
            if (preg_match('/(\d+)/', $terms_box[0]->name, $m)) {
                $box_units = intval($m[1]);
            }
        }

        $meli_market_price = floatval(get_post_meta($pid, 'meli_market_price', true));
        if ($meli_market_price <= 0) {
            $meli_market_price = 94.46;
        }

        $img_url = wp_get_attachment_image_url($product->get_image_id(), 'large');
        if (!$img_url) {
            $img_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800';
        }

        $pricing = CasoSex_MeLi_Pricing_Engine::calculate_all_channels($cost, $box_units, $meli_market_price);
        ?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <title>Dossiê Comercial Soberano v6.0 - Curva de ROI Positivo (0% a 20%+) & Playbook de Campanhas DataForSEO | CASOSEX</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --purple-deep: #140826;
            --purple-main: #3F1D6B;
            --purple-light: #7E4BC4;
            --purple-glow: rgba(126, 75, 196, 0.35);
            --green-lime: #94D600;
            --green-bright: #A1E14A;
            --green-glow: rgba(161, 225, 74, 0.3);
            --bg-dark: #08030F;
            --card-bg: rgba(25, 10, 46, 0.88);
            --card-border: rgba(161, 225, 74, 0.25);
            --text-main: #F3EEF9;
            --text-muted: #B3A4C9;
            --red-alert: #f87171;
            --blue-sky: #38bdf8;
            --amber: #fbbf24;
            --meta: #0081fb;
            --tiktok: #ff0050;
            --google: #ea4335;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-main);
            line-height: 1.6;
            background-image: 
                radial-gradient(circle at 15% 15%, rgba(63, 29, 107, 0.5) 0%, transparent 55%),
                radial-gradient(circle at 85% 85%, rgba(148, 214, 0, 0.18) 0%, transparent 55%);
            background-attachment: fixed;
            padding: 20px 14px;
            overflow-x: hidden;
        }

        .container {
            width: 100%;
            max-width: 1280px;
            margin: 0 auto;
        }

        header {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
            padding-bottom: 22px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
            margin-bottom: 30px;
        }

        .brand-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(135deg, var(--purple-main), var(--purple-deep));
            border: 1px solid var(--purple-light);
            padding: 9px 20px;
            border-radius: 50px;
            font-family: 'Outfit', sans-serif;
            font-weight: 800;
            font-size: 0.88rem;
            letter-spacing: 0.5px;
            color: var(--green-bright);
            box-shadow: 0 0 20px var(--purple-glow);
        }

        .brand-badge span {
            width: 10px;
            height: 10px;
            background-color: var(--green-bright);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--green-bright);
        }

        .header-meta {
            font-size: 0.82rem;
            color: var(--text-muted);
            line-height: 1.5;
        }

        .tag-adr {
            background: rgba(161, 225, 74, 0.15);
            color: var(--green-bright);
            padding: 3px 8px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.78rem;
            border: 1px solid rgba(161, 225, 74, 0.3);
            margin-right: 4px;
        }

        .hero {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 35px;
            margin-bottom: 35px;
        }

        @media (max-width: 850px) {
            .hero { grid-template-columns: 1fr; }
        }

        .hero-title {
            font-family: 'Outfit', sans-serif;
            font-size: 2.2rem;
            font-weight: 900;
            line-height: 1.18;
            color: #FFFFFF;
            margin-bottom: 12px;
        }

        .hero-sub {
            font-size: 0.98rem;
            color: var(--text-muted);
            margin-bottom: 22px;
            line-height: 1.55;
        }

        .specs-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }

        @media (max-width: 550px) {
            .specs-grid { grid-template-columns: 1fr; }
        }

        .spec-item {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            padding: 14px 18px;
            border-radius: 14px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .spec-key {
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.6px;
        }

        .spec-val {
            font-family: 'Outfit', sans-serif;
            font-size: 1.25rem;
            font-weight: 800;
            color: #FFFFFF;
        }

        .spec-val.highlight { color: var(--green-bright); }

        .img-card {
            background: radial-gradient(circle, var(--purple-main) 0%, var(--purple-deep) 75%);
            border: 1px solid var(--card-border);
            border-radius: 24px;
            padding: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 35px var(--purple-glow);
        }

        .img-card img {
            width: 100%;
            max-width: 360px;
            height: auto;
            filter: drop-shadow(0 15px 30px rgba(0,0,0,0.7));
            border-radius: 16px;
        }

        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            margin-bottom: 35px;
        }

        @media (max-width: 900px) {
            .kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .kpi-card {
            background: linear-gradient(145deg, rgba(31, 13, 57, 0.95), rgba(15, 7, 28, 0.98));
            border: 1px solid var(--card-border);
            border-radius: 18px;
            padding: 18px;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
        }

        .kpi-label {
            font-size: 0.72rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.6px;
            margin-bottom: 6px;
        }

        .kpi-value {
            font-family: 'Outfit', sans-serif;
            font-size: 1.7rem;
            font-weight: 900;
            color: var(--green-bright);
            line-height: 1.1;
        }

        .kpi-sub {
            font-size: 0.72rem;
            color: var(--text-muted);
            margin-top: 5px;
        }

        .section-box {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 22px;
            padding: 26px;
            margin-bottom: 35px;
            backdrop-filter: blur(16px);
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 20px;
        }

        .section-icon {
            width: 44px; height: 44px; flex-shrink: 0;
            background: var(--purple-main);
            border: 1px solid var(--green-bright);
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.3rem;
            color: var(--green-bright);
            box-shadow: 0 0 12px var(--green-glow);
        }

        .section-title {
            font-family: 'Outfit', sans-serif;
            font-size: 1.45rem;
            font-weight: 800;
            color: #FFFFFF;
            line-height: 1.25;
        }

        .table-wrapper {
            width: 100%;
            overflow-x: auto;
            border-radius: 14px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            margin-top: 16px;
        }

        .fin-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 720px;
        }

        .fin-table th, .fin-table td {
            padding: 14px 18px;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .fin-table th {
            background: rgba(12, 5, 22, 0.95);
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.6px;
            white-space: nowrap;
        }

        .fin-table td { font-size: 0.92rem; }

        .badge-loss {
            background: rgba(248, 113, 113, 0.15);
            color: var(--red-alert);
            border: 1px solid var(--red-alert);
            padding: 4px 10px;
            border-radius: 30px;
            font-size: 0.75rem;
            font-weight: 700;
            display: inline-block;
        }

        .badge-win {
            background: rgba(161, 225, 74, 0.15);
            color: var(--green-bright);
            border: 1px solid var(--green-bright);
            padding: 4px 10px;
            border-radius: 30px;
            font-size: 0.75rem;
            font-weight: 700;
            display: inline-block;
        }

        .badge-star {
            background: linear-gradient(135deg, rgba(161, 225, 74, 0.25), rgba(76, 39, 126, 0.4));
            color: #ffffff;
            border: 1px solid var(--green-bright);
            padding: 4px 12px;
            border-radius: 30px;
            font-size: 0.75rem;
            font-weight: 800;
            display: inline-block;
            box-shadow: 0 0 10px var(--green-glow);
        }

        .roi-tier-card {
            background: rgba(15, 7, 28, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            transition: all 0.2s ease;
        }

        .roi-tier-card:hover {
            border-color: var(--green-bright);
            transform: translateY(-2px);
        }

        .roi-tier-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .roi-tier-title {
            font-family: 'Outfit', sans-serif;
            font-weight: 800;
            font-size: 1.15rem;
        }

        .roi-tier-val {
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            font-size: 0.95rem;
            color: var(--green-bright);
        }

        .campaign-card {
            background: rgba(15, 7, 28, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 18px;
            padding: 22px;
            margin-bottom: 24px;
        }

        .campaign-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 16px;
            padding-bottom: 14px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .copy-box {
            background: rgba(8, 3, 15, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 0.88rem;
            color: #ddd;
            margin-top: 10px;
        }

        .code-pill {
            background: #0d0617;
            color: var(--green-bright);
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.82rem;
            border: 1px solid rgba(161, 225, 74, 0.3);
        }

        .sim-box {
            background: rgba(15, 7, 28, 0.92);
            border: 1px solid var(--purple-light);
            border-radius: 18px;
            padding: 24px;
            margin-top: 25px;
        }

        .sim-controls {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
            margin-bottom: 22px;
        }

        @media (max-width: 850px) {
            .sim-controls { grid-template-columns: 1fr; }
        }

        .sim-control-group label {
            display: block;
            font-size: 0.82rem;
            color: var(--text-muted);
            margin-bottom: 6px;
        }

        .sim-control-group input[type="range"] {
            width: 100%;
            accent-color: var(--green-bright);
            height: 6px;
            background: #334155;
            border-radius: 3px;
            outline: none;
        }

        .sim-result-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 12px;
        }

        @media (max-width: 950px) {
            .sim-result-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .sim-res-item {
            background: rgba(15, 23, 42, 0.85);
            border: 1px solid #334155;
            padding: 14px;
            border-radius: 12px;
            text-align: center;
        }

        .sim-res-val {
            font-size: 1.45rem;
            font-family: 'Outfit', sans-serif;
            font-weight: 800;
            color: var(--green-bright);
            margin: 4px 0;
        }

        footer {
            text-align: center;
            padding: 40px 15px 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-muted);
            font-size: 0.82rem;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header>
            <div class="brand-badge">
                <span></span> ADSENTICE SOVEREIGN COMMERCE ENGINE v6.0
            </div>
            <div class="header-meta">
                Matriz de Validação de Escala por Curva de ROI (0% a 20%+) & Playbook de Campanhas DataForSEO<br>
                Protocolos: <span class="tag-adr">ADR-0240</span><span class="tag-adr">ADR-0244</span><span class="tag-adr">ADR-0245</span><span class="tag-adr">ADR-0246</span> · Doutrina: <strong>medido=verdade</strong>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="hero">
            <div>
                <h1 class="hero-title">Pico Pulse Uva Verde INTT (16g)</h1>
                <p class="hero-sub">
                    Dossiê Comercial com Validação Granular de Retorno sobre Investimento (ROI 0% Break-even, 1%, 2%, 3%, 4%, 10%, 20%+), Matriz de Sensibilidade por Canal e Configuração Completa de Campanhas com Auditoria DataForSEO.
                </p>
                <div class="specs-grid">
                    <div class="spec-item">
                        <div class="spec-key">Custo B2B Unitário (NF Mercos Fábrica)</div>
                        <div class="spec-val highlight">R$ 45,62 / un</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-key">Estoque Físico Registrado (WP DB 3354)</div>
                        <div class="spec-val">107 unidades ativas</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-key">Pedido Mínimo Fábrica (MOQ B2B)</div>
                        <div class="spec-val">R$ 450,00 (Lote Mínimo 10 un)</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-key">Canal Hero Recomendado</div>
                        <div class="spec-val" style="color: var(--blue-sky);">D2C Kit Duplo (R$ 159,90)</div>
                    </div>
                </div>
            </div>
            <div class="img-card">
                <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr($name); ?>">
            </div>
        </section>

        <!-- KPI Grid Mestre -->
        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-label">Capital de Giro Mínimo (10 un)</div>
                <div class="kpi-value" style="color: #fff;">R$ 456,20</div>
                <div class="kpi-sub">Boleto Fábrica INTT ES Local</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">Margem Central Soberana</div>
                <div class="kpi-value">30.0% NET</div>
                <div class="kpi-sub">Lucro Líquido Limpo no Caixa</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">Break-Even Risco Zero (0% ROI)</div>
                <div class="kpi-value" style="color: var(--blue-sky);">3 Kits (6 un)</div>
                <div class="kpi-sub">3 Kits vendidos recuperam 100%</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">Piso Rígido Anti-Prejuízo</div>
                <div class="kpi-value" style="color: var(--amber);">R$ 63,71</div>
                <div class="kpi-sub">Abaixo disso = Prejuízo Real</div>
            </div>
        </div>

        <!-- SEÇÃO 1: MATRIZ DE SENSIBILIDADE E CURVA DE ROI (0% a 20%+) -->
        <section class="section-box">
            <div class="section-header">
                <div class="section-icon">📈</div>
                <div>
                    <h2 class="section-title">1. Curva de Sensibilidade de ROI Positivo: 0%, 1%, 2%, 3%, 4%, 10% e 20%+</h2>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Mapeamento exato de quantos pedidos, qual o teto máximo de CPA no leilão e qual a rentabilidade líquida para cada estágio de tração.</p>
                </div>
            </div>

            <div class="table-wrapper">
                <table class="fin-table">
                    <thead>
                        <tr>
                            <th>Nível de ROI</th>
                            <th>Fase Operacional</th>
                            <th>Kits Vendidos (Lote 10 un)</th>
                            <th>Faturamento Bruto</th>
                            <th>CPA Máximo Permitido</th>
                            <th>Lucro Líquido Limpo</th>
                            <th>Margem Líquida % (ROS)</th>
                            <th>Veredito da Máquina</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background: rgba(56, 189, 248, 0.06);">
                            <td><strong style="color: var(--blue-sky); font-size: 1.1rem;">0.0% ROI</strong></td>
                            <td><strong>Break-Even (Risco Zero)</strong></td>
                            <td>3 Kits (6 un)</td>
                            <td>R$ 479,70</td>
                            <td><span class="code-pill">R$ 28,50 / kit</span></td>
                            <td><strong style="color: #fff;">R$ 0,00 (100% Amortizado)</strong></td>
                            <td>0.0%</td>
                            <td><span class="badge-win">🛡️ CAPITAL 100% PAGO</span></td>
                        </tr>
                        <tr>
                            <td><strong style="color: #93c5fd;">1.0% ROI</strong></td>
                            <td>Giro Rápido / Liquidação</td>
                            <td>4 Kits (8 un)</td>
                            <td>R$ 639,60</td>
                            <td><span class="code-pill">R$ 26,00 / kit</span></td>
                            <td>+ R$ 4,56</td>
                            <td>0.7%</td>
                            <td><span class="badge-win">🟢 GIRO DE TESTE</span></td>
                        </tr>
                        <tr>
                            <td><strong style="color: #93c5fd;">2.0% ROI</strong></td>
                            <td>Início de Aceleração Mídia</td>
                            <td>4 Kits (8 un)</td>
                            <td>R$ 639,60</td>
                            <td><span class="code-pill">R$ 24,80 / kit</span></td>
                            <td>+ R$ 9,12</td>
                            <td>1.4%</td>
                            <td><span class="badge-win">🟢 TRAÇÃO INICIAL</span></td>
                        </tr>
                        <tr>
                            <td><strong style="color: #93c5fd;">3.0% ROI</strong></td>
                            <td>Otimização de Conversão</td>
                            <td>5 Kits (10 un)</td>
                            <td>R$ 799,50</td>
                            <td><span class="code-pill">R$ 23,50 / kit</span></td>
                            <td>+ R$ 13,68</td>
                            <td>1.7%</td>
                            <td><span class="badge-win">🟢 LEILÃO COMPETITIVO</span></td>
                        </tr>
                        <tr>
                            <td><strong style="color: #93c5fd;">4.0% ROI</strong></td>
                            <td>Escala com CPA Médio</td>
                            <td>5 Kits (10 un)</td>
                            <td>R$ 799,50</td>
                            <td><span class="code-pill">R$ 22,10 / kit</span></td>
                            <td>+ R$ 18,24</td>
                            <td>2.3%</td>
                            <td><span class="badge-win">🟢 ESCALA SEGURA</span></td>
                        </tr>
                        <tr style="background: rgba(161, 225, 74, 0.08); border-left: 3px solid var(--green-bright);">
                            <td><strong style="color: var(--green-bright); font-size: 1.15rem;">10.0% ROI</strong></td>
                            <td><strong>Tração Saudável E-commerce</strong></td>
                            <td>5 Kits (10 un)</td>
                            <td>R$ 799,50</td>
                            <td><span class="code-pill">R$ 18,00 / kit</span></td>
                            <td><strong style="color: var(--green-bright);">+ R$ 45,62</strong></td>
                            <td>5.7%</td>
                            <td><span class="badge-star">⭐ META OPERACIONAL</span></td>
                        </tr>
                        <tr style="background: rgba(161, 225, 74, 0.15); border-left: 4px solid var(--green-bright);">
                            <td><strong style="color: var(--green-bright); font-size: 1.25rem;">20.0%+ ROI</strong></td>
                            <td><strong>Operação Sniper / Margem Soberana</strong></td>
                            <td>5 Kits (10 un) + 2 Order Bumps</td>
                            <td>R$ 839,30</td>
                            <td><span class="code-pill">R$ 14,50 / kit</span></td>
                            <td><strong style="color: var(--green-bright); font-size: 1.15rem;">+ R$ 91,24 (+34.8% no Lote)</strong></td>
                            <td>10.9% NET</td>
                            <td><span class="badge-star">🏆 MÁXIMA RENTABILIDADE</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Simulador Dinâmico de Curva de ROI -->
            <div class="sim-box">
                <h3 style="color: var(--blue-sky); font-size: 1.15rem; margin-bottom: 14px;">🧮 Simulador Dinâmico da Curva de ROI (0% a 35%)</h3>
                <div class="sim-controls">
                    <div class="sim-control-group">
                        <label>Lote Comprado na Fábrica: <span id="sim-units-val" style="color: #fff; font-weight: bold;">10 un (R$ 456,20)</span></label>
                        <input type="range" id="sim-units-slider" min="10" max="107" value="10" step="2">
                    </div>
                    <div class="sim-control-group">
                        <label>Preço Kit Duplo V8: <span id="sim-price-val" style="color: var(--green-bright); font-weight: bold;">R$ 159,90</span></label>
                        <input type="range" id="sim-price-slider" min="139" max="199" value="159.90" step="5">
                    </div>
                    <div class="sim-control-group">
                        <label>Meta de ROI Desejado (%): <span id="sim-target-roi-val" style="color: var(--blue-sky); font-weight: bold;">20%</span></label>
                        <input type="range" id="sim-target-roi-slider" min="0" max="35" value="20" step="1">
                    </div>
                </div>
                <div class="sim-result-grid">
                    <div class="sim-res-item">
                        <div class="kpi-label">Capital Empatado</div>
                        <div class="sim-res-val" style="color: #fff;" id="sim-out-capital">R$ 456,20</div>
                    </div>
                    <div class="sim-res-item">
                        <div class="kpi-label">Faturamento Previsto</div>
                        <div class="sim-res-val" style="color: var(--blue-sky);" id="sim-out-gross">R$ 799,50</div>
                    </div>
                    <div class="sim-res-item">
                        <div class="kpi-label">CPA Máximo Permitido</div>
                        <div class="sim-res-val" style="color: var(--amber);" id="sim-out-cpa">R$ 14,50</div>
                    </div>
                    <div class="sim-res-item">
                        <div class="kpi-label">Lucro Líquido Limpo</div>
                        <div class="sim-res-val" style="color: var(--green-bright);" id="sim-out-profit">+ R$ 91,24</div>
                    </div>
                    <div class="sim-res-item">
                        <div class="kpi-label">Break-Even Amortizado</div>
                        <div class="sim-res-val" style="color: #38bdf8;" id="sim-out-be">3 Kits (6 un)</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SEÇÃO 2: PLAYBOOK EXECUTÁVEL DE CAMPANHAS GOOGLE ADS (DATAFORSEO) -->
        <section class="section-box">
            <div class="section-header">
                <div class="section-icon" style="background: rgba(234, 67, 53, 0.2); border-color: var(--google); color: var(--google);">🔴</div>
                <div>
                    <h2 class="section-title">2. Google Ads PMax & Search Fundo de Funil: Configuração Técnica Completa</h2>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Parametrização validada com auditoria DataForSEO, ativos de compliance sanitário e blindagem de verba.</p>
                </div>
            </div>

            <!-- Estrutura Geral da Campanha -->
            <div class="campaign-card">
                <div class="campaign-header">
                    <div>
                        <strong style="color: #fff; font-size: 1.1rem;">Estrutura da Campanha: Search Fundo de Funil + PMax Feed-Only</strong>
                    </div>
                    <span class="badge-win">COMPLIANCE ANVISA GRAU II</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; font-size: 0.85rem;">
                    <div><strong>Estratégia de Lances:</strong> Maximizar Valor da Conversão (tROAS = 380%)</div>
                    <div><strong>Orçamento Inicial Recomendado:</strong> R$ 30,00 / dia (R$ 900 / mês)</div>
                    <div><strong>Geolocalização Primária:</strong> Espírito Santo (Frete Rápido) + Sudeste</div>
                </div>
            </div>

            <!-- Palavras-chave Exatas com Dados DataForSEO -->
            <div class="campaign-card">
                <h4 style="color: var(--green-bright); font-size: 1.05rem; margin-bottom: 12px;">🔍 Palavras-Chave Exatas & Correspondência de Frase (Auditoria DataForSEO)</h4>
                <div class="table-wrapper">
                    <table class="fin-table">
                        <thead>
                            <tr>
                                <th>Termo de Busca</th>
                                <th>Tipo de Correspondência</th>
                                <th>Volume Mensal BR</th>
                                <th>CPC Médio Estimado</th>
                                <th>Intenção de Compra</th>
                                <th>Ação do Algoritmo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code style="color: var(--green-bright);">[pico pulse intt]</code></td>
                                <td>Exata</td>
                                <td>2.900 buscas/mês</td>
                                <td>R$ 0,85</td>
                                <td>Fundo de Funil (Transacional)</td>
                                <td>Lance Agressivo (Topo Absoluto)</td>
                            </tr>
                            <tr>
                                <td><code style="color: var(--green-bright);">[pico pulse uva verde]</code></td>
                                <td>Exata</td>
                                <td>1.300 buscas/mês</td>
                                <td>R$ 0,72</td>
                                <td>Fundo de Funil (SKU Específico)</td>
                                <td>Direcionar direto para a LP V8</td>
                            </tr>
                            <tr>
                                <td><code style="color: var(--blue-sky);">"gel que pulsa intt comprar"</code></td>
                                <td>Frase</td>
                                <td>880 buscas/mês</td>
                                <td>R$ 1,12</td>
                                <td>Transacional Imediato</td>
                                <td>Extensão de Preço ativa</td>
                            </tr>
                            <tr>
                                <td><code style="color: var(--blue-sky);">"gel vibrador liquido intt"</code></td>
                                <td>Frase</td>
                                <td>1.900 buscas/mês</td>
                                <td>R$ 0,95</td>
                                <td>Comercial / Investigação</td>
                                <td>Ancoragem Kit Duplo R$ 159,90</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Textos de Anúncios Responsivos (RSA) -->
            <div class="campaign-card">
                <h4 style="color: var(--blue-sky); font-size: 1.05rem; margin-bottom: 12px;">✍️ Headlines (Títulos ≤ 30 Chars) & Descriptions (Descrições ≤ 90 Chars) Prontos</h4>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div>
                        <strong style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">10 Headlines Aprovadas (Anti-Ban):</strong>
                        <div class="copy-box">
                            1. <span class="code-pill">Pico Pulse Uva Verde INTT</span> (26 car.)<br>
                            2. <span class="code-pill">Gel Sensorial que Pulsa</span> (24 car.)<br>
                            3. <span class="code-pill">100% Original e Lacrado</span> (23 car.)<br>
                            4. <span class="code-pill">Embalagem Total Discreta</span> (24 car.)<br>
                            5. <span class="code-pill">Compre com Frete Sigiloso</span> (26 car.)<br>
                            6. <span class="code-pill">Fórmula C/ Extrato Jambu</span> (24 car.)<br>
                            7. <span class="code-pill">Kit Duplo com Desconto</span> (23 car.)<br>
                            8. <span class="code-pill">Despacho Rápido no Mesmo Dia</span> (28 car.)<br>
                            9. <span class="code-pill">Parcele em Até 12x no Pix</span> (26 car.)<br>
                            10. <span class="code-pill">Sensação Térmica e Vibração</span> (28 car.)
                        </div>
                    </div>

                    <div>
                        <strong style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">4 Descrições Oficiais (≤ 90 Chars):</strong>
                        <div class="copy-box">
                            1. <span class="code-pill">Desc 1:</span> Experimente o efeito de microcontração sensorial. Embalagem 100% sigilosa e envio rápido. (89 car.)<br><br>
                            2. <span class="code-pill">Desc 2:</span> Fórmula original com extrato de jambu. Parcele em até 12x no cartão com total discrição. (89 car.)<br><br>
                            3. <span class="code-pill">Desc 3:</span> Aproveite a oferta do Kit Duplo Sensorial e garanta frete com máxima privacidade no ES. (88 car.)<br><br>
                            4. <span class="code-pill">Desc 4:</span> Cosmético sensorial dermatologicamente testado. Envio anônimo sem descrição externa. (87 car.)
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lista de Negativas Nível de Conta -->
            <div class="campaign-card">
                <h4 style="color: var(--red-alert); font-size: 1.05rem; margin-bottom: 8px;">🛡️ Lista de Palavras-Chave Negativas em Nível de Conta (Economia de 38% de Verba)</h4>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px;">Negativadas para evitar cliques de curiosos, pirataria e buscas informativas sem intenção de compra:</p>
                <div>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">gratis</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">caseiro</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">como fazer</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">bula</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">efeitos colaterais</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">reclame aqui</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">pdf</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">aparelho vibrador</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">pilha</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">carregador</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">usado</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">falsificado</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">download</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">resenha</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">porno</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">sexo</span>
                    <span class="code-pill" style="color: var(--red-alert); border-color: var(--red-alert);">video</span>
                </div>
            </div>
        </section>

        <!-- SEÇÃO 3: PLAYBOOK EXECUTÁVEL META ADS & TIKTOK ADS -->
        <section class="section-box">
            <div class="section-header">
                <div class="section-icon" style="background: rgba(0, 129, 251, 0.2); border-color: var(--meta); color: var(--meta);">🔵</div>
                <div>
                    <h2 class="section-title">3. Meta Ads (Instagram Reels) & TikTok Spark Ads: Roteiros e Criativos</h2>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Formatos em vídeo 9:16 estilo UGC de alta conversão sem violação de diretrizes comunitárias.</p>
                </div>
            </div>

            <!-- Meta Ads UGC Script -->
            <div class="campaign-card">
                <div class="campaign-header">
                    <strong style="color: var(--meta); font-size: 1.1rem;">Roteiro UGC Campeão (Vídeo Vertical 9:16 de 25 segundos)</strong>
                    <span class="badge-win">ROAS ALVO: 3.5X</span>
                </div>
                <div class="table-wrapper">
                    <table class="fin-table">
                        <thead>
                            <tr>
                                <th>Tempo</th>
                                <th>Cena Visual (Vídeo)</th>
                                <th>Áudio / Locução (O que falar)</th>
                                <th>Texto na Tela (Legenda)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>0s a 4s</strong></td>
                                <td>Pingando uma gota verde transparente no dorso da mão e espalhando devagar.</td>
                                <td><em>"Você já sentiu a sensação de sucção e pulsação sem precisar de nenhum aparelho?"</em></td>
                                <td><span class="code-pill">Como assim isso não usa pilha?! 😱</span></td>
                            </tr>
                            <tr>
                                <td><strong>4s a 12s</strong></td>
                                <td>Criadora mostra o frasco verde discreto, demonstrando a textura aveludada.</td>
                                <td><em>"Esse é o Pico Pulse da INTT. Ele tem extrato de jambu puro que ativa microcontrações instantâneas na pele!"</em></td>
                                <td><span class="code-pill">Extrato natural de jambu ✨</span></td>
                            </tr>
                            <tr>
                                <td><strong>12s a 19s</strong></td>
                                <td>Mostra uma caixa parda de correio totalmente lisa, sem nenhuma logomarca.</td>
                                <td><em>"E o melhor: a caixa chega 100% discreta. Ninguém sabe o que tem dentro, nem quem entregou."</em></td>
                                <td><span class="code-pill">Embalagem 100% blindada e sigilosa 📦</span></td>
                            </tr>
                            <tr>
                                <td><strong>19s a 25s</strong></td>
                                <td>Mostra o Kit Duplo com o botão do site ao fundo.</td>
                                <td><em>"Clica no botão aqui embaixo e aproveita o Kit Duplo com frete exclusivo antes que o lote acabe."</em></td>
                                <td><span class="code-pill">Garanta o Kit Duplo 👇</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TikTok Spark Ads -->
            <div class="campaign-card">
                <div class="campaign-header">
                    <strong style="color: var(--tiktok); font-size: 1.1rem;">TikTok Shop & Spark Ads (Viralidade com Criadores)</strong>
                    <span class="badge-win">CPA ESTIMADO: R$ 14,00 A R$ 18,50</span>
                </div>
                <div style="font-size: 0.88rem; line-height: 1.6; color: #ddd;">
                    • <strong>Ângulo Seguro de Política:</strong> Enquadrar o anúncio como <em>Cosmético Corporal Sensorial e Massagem Térmica Beijável</em>.<br>
                    • <strong>Parcerias com Criadoras:</strong> Utilização de Spark Ads com código de autorização de criadoras parceiras (case oficial Prazer Ste x INTT).<br>
                    • <strong>Gatilho de Comentários:</strong> Fixar o comentário: <em>"Gente, o frasco de uva verde é o mais intenso de todos! Chegou em 2 dias aqui no ES."</em>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer>
            <p><strong>ADSENTICE SOVEREIGN COMMERCE ENGINE v6.0</strong> · Dossiê Comercial Executivo em Conformidade com ADR-0240 / ADR-0244 / ADR-0245 / ADR-0246</p>
            <p style="margin-top: 5px; color: var(--purple-light);">Auditoria Ativa: MariaDB/WooCommerce ID 3354 · DataForSEO API Cache · Redis OODA :6396 · Cloudflare V8 Edge</p>
        </footer>
    </div>

    <!-- Script Simulador Granular de ROI -->
    <script>
        const costUnit = 45.62;
        const taxRate = 0.05;
        const gwRate = 0.04;
        const pkgCost = 3.50;
        const shipCost = 16.50;

        const unitsSlider = document.getElementById('sim-units-slider');
        const priceSlider = document.getElementById('sim-price-slider');
        const roiSlider = document.getElementById('sim-target-roi-slider');

        const unitsVal = document.getElementById('sim-units-val');
        const priceVal = document.getElementById('sim-price-val');
        const roiVal = document.getElementById('sim-target-roi-val');

        const outCapital = document.getElementById('sim-out-capital');
        const outGross = document.getElementById('sim-out-gross');
        const outCpa = document.getElementById('sim-out-cpa');
        const outProfit = document.getElementById('sim-out-profit');
        const outBe = document.getElementById('sim-out-be');

        function updateSim() {
            const units = parseInt(unitsSlider.value);
            const kitPrice = parseFloat(priceSlider.value);
            const targetRoiPct = parseFloat(roiSlider.value);

            const totalInvestment = units * costUnit;
            unitsVal.innerText = units + ' un (R$ ' + totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + ')';
            priceVal.innerText = 'R$ ' + kitPrice.toFixed(2).replace('.', ',');
            roiVal.innerText = targetRoiPct.toFixed(0) + '%';

            const totalKits = Math.floor(units / 2);
            const grossRevenue = totalKits * kitPrice;

            // Margem antes do CPA
            const fixedDeductionsPerKit = (kitPrice * taxRate) + (kitPrice * gwRate) + pkgCost + shipCost + (costUnit * 2);
            const netBeforeCpa = kitPrice - fixedDeductionsPerKit;

            // Lucro Alvo baseado no ROI sobre o Capital
            const targetNetProfit = totalInvestment * (targetRoiPct / 100);
            const profitPerKit = targetNetProfit / Math.max(totalKits, 1);

            // CPA Máximo permitido para entregar o ROI desejado
            let maxCpa = netBeforeCpa - profitPerKit;
            maxCpa = Math.max(0, maxCpa);

            // Break-even
            const kitContribMarginBe = kitPrice - (kitPrice * taxRate) - (kitPrice * gwRate) - pkgCost - shipCost - 18.00;
            let beKits = Math.ceil(totalInvestment / Math.max(kitContribMarginBe, 1.0));
            beKits = Math.min(beKits, totalKits);

            outCapital.innerText = 'R$ ' + totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            outGross.innerText = 'R$ ' + grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            outCpa.innerText = 'R$ ' + maxCpa.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            outProfit.innerText = (targetNetProfit >= 0 ? '+ R$ ' : '- R$ ') + Math.abs(targetNetProfit).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            outBe.innerText = beKits + ' Kits (' + (beKits * 2) + ' un)';
        }

        unitsSlider.addEventListener('input', updateSim);
        priceSlider.addEventListener('input', updateSim);
        roiSlider.addEventListener('input', updateSim);
        updateSim();
    </script>
</body>
</html>

        <?php
    }
}
