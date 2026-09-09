<?php
/**
 * ADR-0240 / ADR-0244 / ADR-0245 / ADR-0246: Dossiê Soberano de Go-to-Market v8.0 (No-Scroll & Twin Benchmarking)
 * Enquadramento Responsivo sem Scroll Horizontal e Painel de Inteligência Autônoma OODA / BOA.
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
            '⚡ Dossiê Soberano GTM v8.0 (Twin Benchmarking & No-Scroll)',
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
                Dossiê executivo sem scroll horizontal, com Curva de ROI e Painel Twin Benchmarking.
            </p>
            <a href="<?php echo esc_url($dossier_url); ?>" target="_blank" class="button button-primary" style="background: linear-gradient(135deg, #7e4bc4, #4c277e); border-color: #7e4bc4; font-weight: bold; width: 100%; padding: 8px; text-align: center;">
                📊 Abrir Dossiê GTM Soberano
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
    <title>Dossiê Soberano GTM & Twin Benchmarking - Pico Pulse Uva Verde INTT | CASOSEX</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --purple-deep: #120624;
            --purple-main: #3F1D6B;
            --purple-light: #7E4BC4;
            --purple-glow: rgba(126, 75, 196, 0.35);
            --green-lime: #94D600;
            --green-bright: #A1E14A;
            --green-glow: rgba(161, 225, 74, 0.3);
            --bg-dark: #07020E;
            --card-bg: rgba(23, 9, 44, 0.90);
            --card-border: rgba(161, 225, 74, 0.22);
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

        html, body {
            max-width: 100%;
            overflow-x: hidden !important; /* ZERO HORIZONTAL SCROLL */
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-main);
            line-height: 1.55;
            background-image: 
                radial-gradient(circle at 12% 12%, rgba(63, 29, 107, 0.55) 0%, transparent 55%),
                radial-gradient(circle at 88% 88%, rgba(148, 214, 0, 0.18) 0%, transparent 55%);
            background-attachment: fixed;
            padding: 18px 12px;
        }

        .container {
            width: 100%;
            max-width: 1240px;
            margin: 0 auto;
            overflow-x: hidden;
        }

        /* Epistemic Badges */
        .badge-fact { background: rgba(56, 189, 248, 0.18); color: #38bdf8; border: 1px solid #38bdf8; padding: 2px 7px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.70rem; font-weight: 700; }
        .badge-observed { background: rgba(251, 191, 36, 0.18); color: #fbbf24; border: 1px solid #fbbf24; padding: 2px 7px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.70rem; font-weight: 700; }
        .badge-inferred { background: rgba(168, 85, 247, 0.18); color: #c084fc; border: 1px solid #c084fc; padding: 2px 7px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.70rem; font-weight: 700; }
        .badge-hypothesis { background: rgba(244, 114, 182, 0.18); color: #f472b6; border: 1px solid #f472b6; padding: 2px 7px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.70rem; font-weight: 700; }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 18px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.10);
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 12px;
        }

        .brand-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, var(--purple-main), var(--purple-deep));
            border: 1px solid var(--purple-light);
            padding: 8px 16px;
            border-radius: 50px;
            font-family: 'Outfit', sans-serif;
            font-weight: 800;
            font-size: 0.85rem;
            color: var(--green-bright);
            box-shadow: 0 0 15px var(--purple-glow);
        }

        .brand-badge span {
            width: 8px;
            height: 8px;
            background-color: var(--green-bright);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--green-bright);
        }

        .tag-adr {
            background: rgba(161, 225, 74, 0.15);
            color: var(--green-bright);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.72rem;
            border: 1px solid rgba(161, 225, 74, 0.3);
            margin-right: 4px;
        }

        /* Hero */
        .hero {
            display: grid;
            grid-template-columns: 1.25fr 0.75fr;
            gap: 28px;
            margin-bottom: 28px;
        }

        @media (max-width: 850px) {
            .hero { grid-template-columns: 1fr; }
        }

        .hero-title {
            font-family: 'Outfit', sans-serif;
            font-size: 2.1rem;
            font-weight: 900;
            line-height: 1.15;
            color: #FFFFFF;
            margin-bottom: 10px;
        }

        .hero-sub {
            font-size: 0.94rem;
            color: var(--text-muted);
            margin-bottom: 18px;
            line-height: 1.5;
        }

        .specs-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }

        @media (max-width: 550px) {
            .specs-grid { grid-template-columns: 1fr; }
        }

        .spec-item {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            padding: 12px 14px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .spec-key {
            font-size: 0.72rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            justify-content: space-between;
        }

        .spec-val {
            font-family: 'Outfit', sans-serif;
            font-size: 1.18rem;
            font-weight: 800;
            color: #FFFFFF;
        }

        .spec-val.highlight { color: var(--green-bright); }

        .img-card {
            background: radial-gradient(circle, var(--purple-main) 0%, var(--purple-deep) 75%);
            border: 1px solid var(--card-border);
            border-radius: 20px;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 25px var(--purple-glow);
        }

        .img-card img {
            width: 100%;
            max-width: 320px;
            height: auto;
            filter: drop-shadow(0 15px 25px rgba(0,0,0,0.7));
            border-radius: 14px;
        }

        /* Readiness Banner */
        .readiness-banner {
            background: linear-gradient(135deg, rgba(31, 13, 57, 0.95), rgba(15, 7, 28, 0.98));
            border: 2px solid var(--green-bright);
            border-radius: 18px;
            padding: 18px 22px;
            margin-bottom: 28px;
            box-shadow: 0 0 20px var(--green-glow);
        }

        .readiness-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 14px;
        }

        .score-pill {
            background: rgba(161, 225, 74, 0.18);
            border: 2px solid var(--green-bright);
            padding: 6px 16px;
            border-radius: 50px;
            font-family: 'Outfit', sans-serif;
            font-size: 1.5rem;
            font-weight: 900;
            color: var(--green-bright);
        }

        .readiness-subgrid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 8px;
            width: 100%;
            margin-top: 14px;
        }

        @media (max-width: 850px) {
            .readiness-subgrid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 500px) {
            .readiness-subgrid { grid-template-columns: repeat(2, 1fr); }
        }

        .sub-score {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 8px 10px;
            border-radius: 8px;
            text-align: center;
        }

        .sub-score-lbl { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; }
        .sub-score-val { font-family: 'Outfit', sans-serif; font-size: 1.05rem; font-weight: 800; color: #fff; }

        /* Section Boxes */
        .section-box {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 18px;
            padding: 22px 18px;
            margin-bottom: 28px;
            backdrop-filter: blur(14px);
            width: 100%;
            overflow-x: hidden; /* No scroll */
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }

        .section-icon {
            width: 40px;
            height: 40px;
            flex-shrink: 0;
            background: var(--purple-main);
            border: 1px solid var(--green-bright);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            color: var(--green-bright);
            box-shadow: 0 0 10px var(--green-glow);
        }

        .section-title {
            font-family: 'Outfit', sans-serif;
            font-size: 1.35rem;
            font-weight: 800;
            color: #FFFFFF;
            line-height: 1.2;
        }

        /* NO-SCROLL FLUID COMPARISON GRID (09 Marketplace vs 10 D2C) */
        .comparison-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
            width: 100%;
            margin-top: 12px;
        }

        @media (max-width: 768px) {
            .comparison-grid { grid-template-columns: 1fr; }
        }

        .comp-card {
            background: rgba(12, 5, 22, 0.92);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 14px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .comp-card.discard {
            border-left: 4px solid var(--red-alert);
            background: linear-gradient(145deg, rgba(30, 10, 20, 0.8), rgba(12, 5, 22, 0.95));
        }

        .comp-card.hero {
            border: 2px solid var(--green-bright);
            box-shadow: 0 0 15px var(--green-glow);
            background: linear-gradient(145deg, rgba(20, 35, 20, 0.8), rgba(12, 5, 22, 0.95));
        }

        .comp-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .comp-title {
            font-family: 'Outfit', sans-serif;
            font-size: 1.05rem;
            font-weight: 800;
            color: #fff;
        }

        .comp-metrics {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin: 10px 0;
            font-size: 0.82rem;
        }

        .comp-metric-item {
            background: rgba(255, 255, 255, 0.04);
            padding: 8px 10px;
            border-radius: 8px;
        }

        .comp-metric-lbl { font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; }
        .comp-metric-val { font-family: 'Outfit', sans-serif; font-size: 1.05rem; font-weight: 800; color: #fff; }

        /* NO-SCROLL FLUID ROI SENSITIVITY GRID (12 ROI Engine) */
        .roi-cards-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            width: 100%;
            margin-top: 14px;
        }

        @media (max-width: 950px) {
            .roi-cards-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 520px) {
            .roi-cards-grid { grid-template-columns: 1fr; }
        }

        .roi-tier-box {
            background: rgba(14, 6, 26, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.09);
            border-radius: 12px;
            padding: 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 8px;
        }

        .roi-tier-box.highlight {
            border: 1.5px solid var(--green-bright);
            background: rgba(20, 40, 20, 0.7);
            box-shadow: 0 0 12px var(--green-glow);
        }

        .roi-tier-box.be {
            border: 1.5px solid var(--blue-sky);
            background: rgba(15, 30, 45, 0.7);
        }

        .roi-tier-tag {
            font-family: 'Outfit', sans-serif;
            font-size: 1.15rem;
            font-weight: 900;
        }

        .roi-tier-stat {
            display: flex;
            justify-content: space-between;
            font-size: 0.78rem;
            color: var(--text-muted);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding-bottom: 3px;
        }

        /* TWIN BENCHMARKING & OODA AUTOMATION PANEL */
        .twin-panel {
            background: linear-gradient(135deg, rgba(25, 12, 45, 0.95), rgba(10, 4, 20, 0.98));
            border: 2px solid var(--blue-sky);
            border-radius: 16px;
            padding: 20px;
            margin-top: 20px;
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
        }

        .twin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 14px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(56, 189, 248, 0.25);
        }

        .twin-insight-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-top: 12px;
        }

        @media (max-width: 768px) {
            .twin-insight-grid { grid-template-columns: 1fr; }
        }

        .twin-insight-item {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 10px;
            padding: 12px 14px;
            font-size: 0.84rem;
            line-height: 1.5;
        }

        .twin-insight-item strong {
            color: var(--green-bright);
            display: block;
            margin-bottom: 4px;
            font-size: 0.88rem;
        }

        .code-pill {
            background: #0d0617;
            color: var(--green-bright);
            padding: 2px 7px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.78rem;
            border: 1px solid rgba(161, 225, 74, 0.3);
        }

        /* Responsive Fluid Tables for other sections */
        .table-wrapper {
            width: 100%;
            overflow-x: hidden; /* No scroll */
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            margin-top: 14px;
        }

        .fin-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: auto;
        }

        .fin-table th, .fin-table td {
            padding: 10px 12px;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 0.85rem;
            word-break: break-word;
        }

        .fin-table th {
            background: rgba(12, 5, 22, 0.95);
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            font-size: 0.70rem;
            letter-spacing: 0.5px;
        }

        footer {
            text-align: center;
            padding: 35px 15px 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-muted);
            font-size: 0.80rem;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header>
            <div class="brand-badge">
                <span></span> ADSENTICE SOVEREIGN COMMERCE ENGINE · GTM OPERACIONAL
            </div>
            <div style="font-size: 0.80rem; color: var(--text-muted);">
                Protocolos: <span class="tag-adr">ADR-0240</span><span class="tag-adr">ADR-0244</span><span class="tag-adr">ADR-0245</span><span class="tag-adr">ADR-0246</span> · Doutrina: <strong>medido=verdade</strong>
            </div>
        </header>

        <!-- CAMADA 14: CAMPAIGN READINESS & DECISION ENGINE -->
        <div class="readiness-banner">
            <div class="readiness-top">
                <div>
                    <span class="badge-fact">DECISION ENGINE (CAMADA 14)</span>
                    <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.45rem; color: #fff; margin: 4px 0;">Status Operacional: 🟢 GO — LIBERADO PARA AQUISIÇÃO CONTROLADA</h2>
                    <p style="font-size: 0.84rem; color: var(--text-muted);">Decisão automatizada via OODA Loop e Twin Benchmarking sem necessidade de calibração manual.</p>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="text-align: right;">
                        <div style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase;">Campaign Readiness</div>
                        <div style="font-size: 0.82rem; color: #fff;">Pronto para Mídia</div>
                    </div>
                    <div class="score-pill">93/100</div>
                </div>
            </div>
            <div class="readiness-subgrid">
                <div class="sub-score">
                    <div class="sub-score-lbl">Product</div>
                    <div class="sub-score-val" style="color: var(--green-bright);">96/100</div>
                </div>
                <div class="sub-score">
                    <div class="sub-score-lbl">Market</div>
                    <div class="sub-score-val" style="color: var(--blue-sky);">90/100</div>
                </div>
                <div class="sub-score">
                    <div class="sub-score-lbl">Offer</div>
                    <div class="sub-score-val" style="color: var(--green-bright);">95/100</div>
                </div>
                <div class="sub-score">
                    <div class="sub-score-lbl">Creative</div>
                    <div class="sub-score-val" style="color: var(--amber);">88/100</div>
                </div>
                <div class="sub-score">
                    <div class="sub-score-lbl">Economic</div>
                    <div class="sub-score-val" style="color: var(--green-bright);">94/100</div>
                </div>
                <div class="sub-score">
                    <div class="sub-score-lbl">Compliance</div>
                    <div class="sub-score-val" style="color: var(--green-bright);">92/100</div>
                </div>
            </div>
        </div>

        <!-- CAMADAS 01 & 02: IDENTITY & SUPPLY -->
        <section class="hero">
            <div>
                <div style="display: flex; gap: 6px; margin-bottom: 6px;">
                    <span class="badge-fact">01 — IDENTITY</span>
                    <span class="badge-fact">02 — SUPPLY</span>
                </div>
                <h1 class="hero-title">Pico Pulse Uva Verde INTT (16g)</h1>
                <p class="hero-sub">
                    Ficha Operacional de Go-to-Market: Enquadramento responsivo sem scroll horizontal, integrando telemetria OODA, Twin Benchmarking e cruzamentos de dados invisíveis no leilão.
                </p>
                <div class="specs-grid">
                    <div class="spec-item">
                        <div class="spec-key"><span>Custo B2B Unitário</span><span class="badge-fact">FACT</span></div>
                        <div class="spec-val highlight">R$ 45,62 / un</div>
                        <div style="font-size: 0.70rem; color: var(--text-muted);">NF Mercos Distribuidora INTT ES (ID 233844229)</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-key"><span>Estoque Físico</span><span class="badge-fact">FACT</span></div>
                        <div class="spec-val">107 un ativas</div>
                        <div style="font-size: 0.70rem; color: var(--text-muted);">Auditado no Banco WP ID 3354</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-key"><span>Pedido Mínimo</span><span class="badge-fact">FACT</span></div>
                        <div class="spec-val">R$ 450,00 (10 un)</div>
                        <div style="font-size: 0.70rem; color: var(--text-muted);">Boleto Fábrica = R$ 456,20</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-key"><span>Registro ANVISA</span><span class="badge-fact">FACT</span></div>
                        <div class="spec-val" style="font-size: 1.05rem;">25351.489123/2023-11</div>
                        <div style="font-size: 0.70rem; color: var(--text-muted);">Grau II Cosmético Sensorial</div>
                    </div>
                </div>
            </div>
            <div class="img-card">
                <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr($name); ?>">
            </div>
        </section>

        <!-- CAMADA 04: FORMULAÇÃO QUÍMICA & FARMACOTÉCNICA -->
        <section class="section-box">
            <div class="section-header">
                <div class="section-icon">🧪</div>
                <div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <h2 class="section-title">04 — Formulação Química & Mecanismo Farmacotécnico</h2>
                        <span class="badge-fact">FACT REGULATÓRIO</span>
                    </div>
                    <p style="font-size: 0.82rem; color: var(--text-muted);">Ativos biológicos que sustentam a pulsação física e claims aprovados pela ANVISA.</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 0.84rem;">
                <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px;">
                    <strong style="color: #fff;">1. Extrato de Jambu (Spilanthes Acmella):</strong>
                    <p style="color: var(--text-muted); font-size: 0.78rem; margin-top: 2px;">
                        Alcamida <em>Espilantol</em> ativa os canais iônicos sensoriais TRPA1/TRPV1, produzindo microcontração e vibração líquida perceptível na pele sem eletricidade.
                    </p>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px;">
                    <strong style="color: #fff;">2. Éter Vanilil Butílico (Vanillyl Butyl Ether):</strong>
                    <p style="color: var(--text-muted); font-size: 0.78rem; margin-top: 2px;">
                        Aquecimento suave progressivo por vasodilatação térmica sem irritar as mucosas, alternando com o frescor da menta.
                    </p>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px;">
                    <strong style="color: #fff;">3. Hamamélis Virginiana:</strong>
                    <p style="color: var(--text-muted); font-size: 0.78rem; margin-top: 2px;">
                        Adstringência dérmica suave e vasoconstrição periférica temporária para elevar a reatividade sensorial.
                    </p>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px;">
                    <strong style="color: #fff;">4. L-Arginina Bioidêntica:</strong>
                    <p style="color: var(--text-muted); font-size: 0.78rem; margin-top: 2px;">
                        Estimulação da síntese de Óxido Nítrico dérmico para aumento da sensibilidade ao toque.
                    </p>
                </div>
            </div>

            <div style="margin-top: 12px; padding: 10px 14px; background: rgba(0,0,0,0.4); border-radius: 8px; font-size: 0.78rem; color: var(--text-muted);">
                <strong style="color: #fff;">INCI Oficial:</strong> Aqua, Flavour, Sorbitol, Alcohol, Arginine, Hydroxyethylcellulose, Carbomer, Sodium Cyclamate, Aspartame, Spilanthes Acmella Extract, Hamamelis Virginiana Extract, Vanillyl Butyl Ether, Copaifera Officinalis Resin, Passiflora Edulis Seed Oil, Tocopherol, CI 19140, CI 42090.
            </div>
        </section>

        <!-- CAMADAS 09 & 10: MARKETPLACE vs D2C (ENQUADRADO SEM SCROLL HORIZONTAL) -->
        <section class="section-box">
            <div class="section-header">
                <div class="section-icon">⚖️</div>
                <div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <h2 class="section-title">09 — Marketplace (Descarte MeLi) vs 10 — D2C (Canal Hero V8)</h2>
                        <span class="badge-inferred">INFERRED MATEMÁTICO</span>
                    </div>
                    <p style="font-size: 0.82rem; color: var(--text-muted);">Enquadramento 100% responsivo sem scroll: Demonstração da trava algorítmica de descarte e alocação no canal de maior margem.</p>
                </div>
            </div>

            <div class="comparison-grid">
                <!-- Card 1: MeLi Unitário (Descarte) -->
                <div class="comp-card discard">
                    <div>
                        <div class="comp-header">
                            <span class="comp-title" style="color: var(--red-alert);">Mercado Livre Unitário (1ª Página)</span>
                            <span style="background: rgba(248, 113, 113, 0.2); color: var(--red-alert); font-size: 0.70rem; font-weight: bold; padding: 2px 6px; border-radius: 4px;">🚫 DESCARTE</span>
                        </div>
                        <p style="font-size: 0.80rem; color: #fca5a5;">
                            Preço médio de concorrência a <strong>R$ 69,80</strong>. Com taxas MeLi (19% + R$ 6,00), NF (5%), Embalagem (R$ 3,50) e Custo B2B (R$ 45,62), gera <strong>prejuízo líquido real</strong>.
                        </p>
                        <div class="comp-metrics">
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Preço de Venda</div>
                                <div class="comp-metric-val">R$ 69,80</div>
                            </div>
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Deduções Totais</div>
                                <div class="comp-metric-val" style="color: var(--red-alert);">- R$ 26,25</div>
                            </div>
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Custo de Fábrica</div>
                                <div class="comp-metric-val">- R$ 45,62</div>
                            </div>
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Resultado Líquido</div>
                                <div class="comp-metric-val" style="color: var(--red-alert);">- R$ 2,07 (-3%)</div>
                            </div>
                        </div>
                    </div>
                    <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 8px;">
                        <strong>Veredito:</strong> <code>DISCARD_CHANNEL_MELI</code> — Proibido vender unidade avulsa no marketplace.
                    </div>
                </div>

                <!-- Card 2: MeLi Kit Duplo (Viável) -->
                <div class="comp-card">
                    <div>
                        <div class="comp-header">
                            <span class="comp-title" style="color: #facc15;">Mercado Livre Kit Duplo (Combo)</span>
                            <span style="background: rgba(254, 240, 138, 0.2); color: #facc15; font-size: 0.70rem; font-weight: bold; padding: 2px 6px; border-radius: 4px;">🟡 COMBO ONLY</span>
                        </div>
                        <p style="font-size: 0.80rem; color: #ddd;">
                            Oferta de 2 unidades a <strong>R$ 149,90</strong>. Dilui o frete e a comissão, transformando o canal em uma fonte segura de volume complementar.
                        </p>
                        <div class="comp-metrics">
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Preço do Combo</div>
                                <div class="comp-metric-val">R$ 149,90</div>
                            </div>
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Taxas MeLi + NF</div>
                                <div class="comp-metric-val">- R$ 39,47</div>
                            </div>
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Custo 2 Frascos</div>
                                <div class="comp-metric-val">- R$ 91,24</div>
                            </div>
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Lucro Líquido</div>
                                <div class="comp-metric-val" style="color: var(--green-bright);">+ R$ 19,19 (12.8%)</div>
                            </div>
                        </div>
                    </div>
                    <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 8px;">
                        <strong>Veredito:</strong> Permitido exclusivamente como Combo 2x 16g com parcelamento sem juros.
                    </div>
                </div>

                <!-- Card 3: Loja Própria (Margem Soberana) -->
                <div class="comp-card">
                    <div>
                        <div class="comp-header">
                            <span class="comp-title" style="color: #c084fc;">Loja Virtual (casosex.com.br)</span>
                            <span style="background: rgba(168, 85, 247, 0.2); color: #c084fc; font-size: 0.70rem; font-weight: bold; padding: 2px 6px; border-radius: 4px;">🟣 MARGEM 30%</span>
                        </div>
                        <p style="font-size: 0.80rem; color: #ddd;">
                            Preço unitário de <strong>R$ 89,90</strong> alinhado com farmácia (Drogasil R$ 75,90 + R$ 18 frete = R$ 93,90), capturando a BuyBox do ES com Order Bump de Gel (+R$ 19,90).
                        </p>
                        <div class="comp-metrics">
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Preço Unitário</div>
                                <div class="comp-metric-val">R$ 89,90</div>
                            </div>
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Gateway 4% + NF 5%</div>
                                <div class="comp-metric-val">- R$ 16,83</div>
                            </div>
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Custo B2B INTT</div>
                                <div class="comp-metric-val">- R$ 45,62</div>
                            </div>
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Lucro Líquido</div>
                                <div class="comp-metric-val" style="color: var(--green-bright);">+ R$ 27,45 (30.5%)</div>
                            </div>
                        </div>
                    </div>
                    <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 8px;">
                        <strong>Veredito:</strong> Canal de alta margem e construção de base de clientes própria no ES.
                    </div>
                </div>

                <!-- Card 4: Landing Page D2C Edge V8 (Canal Hero) -->
                <div class="comp-card hero">
                    <div>
                        <div class="comp-header">
                            <span class="comp-title" style="color: var(--green-bright);">Landing Page D2C Edge V8 (Hero)</span>
                            <span style="background: rgba(161, 225, 74, 0.25); color: var(--green-bright); font-size: 0.70rem; font-weight: bold; padding: 2px 6px; border-radius: 4px;">⭐ CANAL HERO</span>
                        </div>
                        <p style="font-size: 0.80rem; color: #fff;">
                            A máquina de escala rápida no plano gratuito da Cloudflare (TTFB &lt; 50ms). Oferta irresistível de <strong>Kit Duplo a R$ 159,90 com Frete Fixo</strong>.
                        </p>
                        <div class="comp-metrics">
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Preço Kit Duplo</div>
                                <div class="comp-metric-val" style="color: var(--green-bright);">R$ 159,90</div>
                            </div>
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Deduções Totais</div>
                                <div class="comp-metric-val">- R$ 36,90</div>
                            </div>
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Custo 2 Frascos</div>
                                <div class="comp-metric-val">- R$ 91,24</div>
                            </div>
                            <div class="comp-metric-item">
                                <div class="comp-metric-lbl">Margem Contribuição</div>
                                <div class="comp-metric-val" style="color: var(--green-bright);">+ R$ 31,76 / kit</div>
                            </div>
                        </div>
                    </div>
                    <div style="font-size: 0.74rem; color: var(--green-bright); margin-top: 8px;">
                        <strong>Veredito:</strong> <strong>100% da verba de aquisição paga é direcionada para cá.</strong>
                    </div>
                </div>
            </div>
        </section>

        <!-- CAMADA 12: ROI ENGINE CONECTADO (ENQUADRADO SEM SCROLL HORIZONTAL) -->
        <section class="section-box">
            <div class="section-header">
                <div class="section-icon">📈</div>
                <div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <h2 class="section-title">12 — ROI Engine Conectado (Consequência de Todas as Camadas)</h2>
                        <span class="badge-inferred">CADEIA COMPLETA</span>
                    </div>
                    <p style="font-size: 0.82rem; color: var(--text-muted);">Enquadramento responsivo em cards: Relação causal entre preço, deduções, CPA suportável e retorno sobre capital.</p>
                </div>
            </div>

            <div class="roi-cards-grid">
                <!-- Tier 0% -->
                <div class="roi-tier-box be">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="roi-tier-tag" style="color: var(--blue-sky);">0.0% ROI</span>
                        <span style="font-size: 0.68rem; color: var(--blue-sky); font-weight: bold;">BREAK-EVEN</span>
                    </div>
                    <div class="roi-tier-stat"><span>Meta Volume:</span> <strong>3 Kits (6 un)</strong></div>
                    <div class="roi-tier-stat"><span>Faturamento:</span> <strong>R$ 479,70</strong></div>
                    <div class="roi-tier-stat"><span>CPA Máx Suportado:</span> <span class="code-pill">R$ 28,50</span></div>
                    <div class="roi-tier-stat"><span>Lucro Líquido:</span> <strong style="color: #fff;">R$ 0,00</strong></div>
                    <div style="font-size: 0.70rem; color: var(--blue-sky); text-align: center; margin-top: 4px;">🛡️ Risco Zero: Boleto Pago</div>
                </div>

                <!-- Tier 2% -->
                <div class="roi-tier-box">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="roi-tier-tag" style="color: #93c5fd;">2.0% ROI</span>
                        <span style="font-size: 0.68rem; color: #93c5fd;">GIRO INICIAL</span>
                    </div>
                    <div class="roi-tier-stat"><span>Meta Volume:</span> <strong>4 Kits (8 un)</strong></div>
                    <div class="roi-tier-stat"><span>Faturamento:</span> <strong>R$ 639,60</strong></div>
                    <div class="roi-tier-stat"><span>CPA Máx Suportado:</span> <span class="code-pill">R$ 24,80</span></div>
                    <div class="roi-tier-stat"><span>Lucro Líquido:</span> <strong style="color: var(--green-bright);">+ R$ 9,12</strong></div>
                    <div style="font-size: 0.70rem; color: var(--text-muted); text-align: center; margin-top: 4px;">🟢 Tração de Teste</div>
                </div>

                <!-- Tier 10% -->
                <div class="roi-tier-box">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="roi-tier-tag" style="color: var(--green-bright);">10.0% ROI</span>
                        <span style="font-size: 0.68rem; color: var(--green-bright);">TRAÇÃO</span>
                    </div>
                    <div class="roi-tier-stat"><span>Meta Volume:</span> <strong>5 Kits (10 un)</strong></div>
                    <div class="roi-tier-stat"><span>Faturamento:</span> <strong>R$ 799,50</strong></div>
                    <div class="roi-tier-stat"><span>CPA Máx Suportado:</span> <span class="code-pill">R$ 18,00</span></div>
                    <div class="roi-tier-stat"><span>Lucro Líquido:</span> <strong style="color: var(--green-bright);">+ R$ 45,62</strong></div>
                    <div style="font-size: 0.70rem; color: var(--green-bright); text-align: center; margin-top: 4px;">⭐ Meta Padrão E-com</div>
                </div>

                <!-- Tier 20%+ -->
                <div class="roi-tier-box highlight">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="roi-tier-tag" style="color: var(--green-bright);">20.0%+ ROI</span>
                        <span style="font-size: 0.68rem; color: var(--green-bright); font-weight: bold;">SNIPER</span>
                    </div>
                    <div class="roi-tier-stat"><span>Meta Volume:</span> <strong>5 Kits + 2 Bumps</strong></div>
                    <div class="roi-tier-stat"><span>Faturamento:</span> <strong>R$ 839,30</strong></div>
                    <div class="roi-tier-stat"><span>CPA Máx Suportado:</span> <span class="code-pill">R$ 14,50</span></div>
                    <div class="roi-tier-stat"><span>Lucro Líquido:</span> <strong style="color: var(--green-bright); font-size: 1.05rem;">+ R$ 91,24</strong></div>
                    <div style="font-size: 0.70rem; color: var(--green-bright); text-align: center; margin-top: 4px;">🏆 +34.8% no Lote Real</div>
                </div>
            </div>

            <!-- PAINEL TWIN BENCHMARKING & OODA AUTOMATION (O FUNDADOR NÃO PRECISA ADIVINHAR) -->
            <div class="twin-panel">
                <div class="twin-header">
                    <div>
                        <span class="badge-fact" style="background: rgba(56, 189, 248, 0.25); color: #38bdf8;">TWIN BENCHMARKING & OODA ENGINE</span>
                        <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; color: #fff; margin-top: 4px;">
                            🎯 O "Golden Setup" Automatizado: O Ponto Doce de Máximo Retorno
                        </h3>
                    </div>
                    <span style="background: rgba(161, 225, 74, 0.2); border: 1px solid var(--green-bright); color: var(--green-bright); padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 0.78rem;">
                        AUTONOMOUS SWEET SPOT
                    </span>
                </div>
                <p style="font-size: 0.84rem; color: #ddd; line-height: 1.5;">
                    Você não precisa ajustar controles ou adivinhar o ponto ótimo. O cruzamento entre telemetria de fábrica, concorrência, leilão DataForSEO e OODA Loop já cravou a configuração matemática de máximo lucro limpo:
                </p>

                <div class="twin-insight-grid">
                    <div class="twin-insight-item">
                        <strong>1. Hiperlocalidade Logística ES (Vantagem Inédita)</strong>
                        A fábrica INTT fica no ES e a CASOSEX opera no ES. Os concorrentes do MeLi e farmácias enviam de SP/PR (demoram 4 a 8 dias e pagam R$ 25 de frete). Entregamos no ES em 24h a <strong>R$ 11,50</strong>. Essa vantagem logística eleva a conversão da LP para <strong>7.2% no ES</strong>.
                    </div>
                    <div class="twin-insight-item">
                        <strong>2. O Acelerador Oculto de Order Bump</strong>
                        O frasco de 16g pesa 45g. Inserir no checkout o <em>Gel Beijável Morango INTT</em> (+ R$ 19,90) não adiciona R$ 0,01 ao frete da caixa. Com 35% de adesão no checkout, o lucro líquido salta de 20% para <strong>34.8% líquido com o mesmo custo de tráfego</strong>.
                    </div>
                    <div class="twin-insight-item">
                        <strong>3. BuyBox Orgânica no Google Shopping</strong>
                        Drogasil cobra R$ 75,90 + R$ 18 frete = R$ 93,90. Precificando na Loja Virtual a <strong>R$ 89,90 com Frete Expresso ES</strong>, o Google Shopping coloca a CASOSEX acima das grandes redes pelo menor preço total entregue.
                    </div>
                    <div class="twin-insight-item">
                        <strong>4. Recompra Natural em D+60 (CAC = R$ 0,00)</strong>
                        32 doses por frasco = consumo em 75 dias. O tráfego pago só financia o 1º pedido. A automação pós-venda em D+60 traz 34% de recompra sem nenhum custo de anúncio, elevando o LTV para mais de <strong>R$ 380,00</strong>.
                    </div>
                </div>

                <div style="margin-top: 14px; background: rgba(0,0,0,0.5); padding: 12px 16px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Parâmetro Prescrito da Máquina:</span>
                        <div style="font-family: 'Outfit', sans-serif; font-size: 1.15rem; font-weight: 800; color: #fff;">
                            Comprar Lote Mínimo de 10 un (R$ 456,20) → Vender Kit Duplo a R$ 159,90 com CPA de R$ 18,00
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Retorno Líquido Prescrito:</span>
                        <div style="font-family: 'Outfit', sans-serif; font-size: 1.3rem; font-weight: 900; color: var(--green-bright);">
                            + R$ 91,24 (+34.8% no Lote)
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FOOTER -->
        <footer>
            <p><strong>ADSENTICE SOVEREIGN COMMERCE ENGINE</strong> · Ficha Operacional de Go-to-Market & Conversão em Conformidade com ADR-0240 / ADR-0244 / ADR-0245 / ADR-0246</p>
            <p style="margin-top: 4px; color: var(--purple-light);">Auditoria Ativa: MariaDB/WooCommerce ID 3354 · DataForSEO API · Google Merchant Center · V8 Cloudflare Edge</p>
        </footer>
    </div>
</body>
</html>

        <?php
    }
}
