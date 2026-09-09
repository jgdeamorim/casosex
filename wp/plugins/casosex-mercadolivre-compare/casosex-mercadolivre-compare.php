<?php
/**
 * Plugin Name: CASOSEX - Mercado Livre Compare & Intelligence Engine
 * Plugin URI: https://casosex.com.br
 * Description: Motor de Matching Score, Inteligência Competitiva de Preços e Enriquecimento Automático com Mercado Livre (ADR-0239). Integrado com ACF e Easy MCP AI.
 * Version: 1.0.0
 * Author: Jeferson Amorim / Antigravity Agent
 * Text Domain: casosex-meli-compare
 * Requires at least: 6.0
 * Requires PHP: 8.0
 * WC requires at least: 7.0
 */

if (!defined('ABSPATH')) {
    exit;
}

// Declaração de compatibilidade com WooCommerce HPOS
add_action('before_woocommerce_init', function() {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
    }
});

// Inclusão dos módulos do plugin
require_once plugin_dir_path(__FILE__) . 'inc/class-meli-oauth.php';
require_once plugin_dir_path(__FILE__) . 'inc/class-meli-acf-fields.php';
require_once plugin_dir_path(__FILE__) . 'inc/class-meli-enricher.php';
require_once plugin_dir_path(__FILE__) . 'inc/class-meli-intelligence.php';
require_once plugin_dir_path(__FILE__) . 'inc/class-meli-matcher.php';
require_once plugin_dir_path(__FILE__) . 'inc/class-meli-metabox.php';
require_once plugin_dir_path(__FILE__) . 'inc/class-meli-admin-columns.php';
require_once plugin_dir_path(__FILE__) . 'inc/class-meli-cron.php';
require_once plugin_dir_path(__FILE__) . 'inc/class-meli-batch-sync.php';

// Inicialização
add_action('plugins_loaded', function() {
    CasoSex_MeLi_ACF_Fields::init();
    CasoSex_MeLi_Cron::init();
    if (is_admin()) {
        CasoSex_MeLi_Metabox::init();
        CasoSex_MeLi_Admin_Columns::init();
        CasoSex_MeLi_Batch_Sync::init();
    }
});
