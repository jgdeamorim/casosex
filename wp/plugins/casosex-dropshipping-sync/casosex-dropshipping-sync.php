<?php
/**
 * Plugin Name: CASOSEX Dropshipping Sync & Product Tabs
 * Description: Sincroniza metadados nativos de custo (_cost_of_goods), fornecedor, marcas, tags e exibe Abas Personalizadas (Product Tabs & Shortcodes) para Modo de Uso, Higiene e Conteúdo.
 * Version: 1.2.0
 * Author: CASOSEX Sovereign Engine
 */

if (!defined('ABSPATH')) exit;

// Sincroniza _cost_of_goods automaticamente quando _casosex_cost_price for atualizado
add_action('updated_post_meta', 'casosex_sync_cost_of_goods', 10, 4);
add_action('added_post_meta', 'casosex_sync_cost_of_goods', 10, 4);

function casosex_sync_cost_of_goods($meta_id, $object_id, $meta_key, $meta_value) {
    if ($meta_key === '_casosex_cost_price') {
        update_post_meta($object_id, '_cost_of_goods', $meta_value);
    }
    if ($meta_key === '_casosex_supplier' && $meta_value === 'INTT') {
        wp_set_object_terms($object_id, 69, 'dropship_supplier', true);
    }
}

// Shortcodes de campos personalizados para uso em Abas de Produtos (e.g. post=1121) e Page Builders
add_shortcode('casosex_usage', function() {
    global $product;
    if (!$product) return '';
    return get_post_meta($product->get_id(), '_casosex_usage', true);
});

add_shortcode('casosex_care', function() {
    global $product;
    if (!$product) return '';
    return get_post_meta($product->get_id(), '_casosex_care', true);
});

add_shortcode('casosex_content', function() {
    global $product;
    if (!$product) return '';
    return get_post_meta($product->get_id(), '_casosex_content', true);
});

add_shortcode('casosex_brand', function() {
    global $product;
    if (!$product) return '';
    $brands = wp_get_post_terms($product->get_id(), 'product_brand', array('fields' => 'names'));
    if (!empty($brands) && !is_wp_error($brands)) {
        return implode(', ', $brands);
    }
    return get_post_meta($product->get_id(), '_casosex_brand', true) ?: 'INTT';
});

add_shortcode('casosex_supplier', function() {
    global $product;
    if (!$product) return '';
    return get_post_meta($product->get_id(), '_casosex_supplier', true) ?: 'INTT';
});

// WooCommerce Product Tabs Dinâmicos (Modo de Uso, Higiene & Cuidados, Ficha Técnica)
add_filter('woocommerce_product_tabs', 'casosex_register_custom_product_tabs');

function casosex_register_custom_product_tabs($tabs) {
    global $product;
    if (!$product) return $tabs;

    $product_id = $product->get_id();
    $usage = get_post_meta($product_id, '_casosex_usage', true);
    $care = get_post_meta($product_id, '_casosex_care', true);
    $content = get_post_meta($product_id, '_casosex_content', true);

    if (!empty($usage)) {
        $tabs['casosex_usage'] = array(
            'title'    => '📖 Modo de Uso',
            'priority' => 15,
            'callback' => 'casosex_tab_usage_render'
        );
    }

    if (!empty($care)) {
        $tabs['casosex_care'] = array(
            'title'    => '🧼 Higiene & Cuidados',
            'priority' => 25,
            'callback' => 'casosex_tab_care_render'
        );
    }

    if (!empty($content)) {
        $tabs['casosex_specs'] = array(
            'title'    => '📋 Conteúdo & Origem',
            'priority' => 35,
            'callback' => 'casosex_tab_specs_render'
        );
    }

    return $tabs;
}

function casosex_tab_usage_render() {
    global $product;
    if (!$product) return;
    $usage = get_post_meta($product->get_id(), '_casosex_usage', true);
    echo '<div class="casosex-custom-tab-content"><h3>📖 Modo de Uso</h3><p>' . nl2br(esc_html($usage)) . '</p></div>';
}

function casosex_tab_care_render() {
    global $product;
    if (!$product) return;
    $care = get_post_meta($product->get_id(), '_casosex_care', true);
    echo '<div class="casosex-custom-tab-content"><h3>🧼 Higiene &amp; Cuidados</h3><p>' . nl2br(esc_html($care)) . '</p></div>';
}

function casosex_tab_specs_render() {
    global $product;
    if (!$product) return;
    $content = get_post_meta($product->get_id(), '_casosex_content', true);
    echo '<div class="casosex-custom-tab-content"><h3>📋 Conteúdo &amp; Origem</h3>' . wp_kses_post($content) . '</div>';
}
