<?php
/**
 * Plugin Name: CASOSEX Dropshipping Sync & Product Layout
 * Description: Sincroniza metadados nativos de custo (_cost_of_goods), remove a aba Informação Adicional e anexa Modo de Uso e Higiene diretamente na Descrição do produto.
 * Version: 1.3.0
 * Author: CASOSEX Sovereign Engine
 */

if (!defined('ABSPATH')) exit;

// 1. Sincroniza _cost_of_goods automaticamente quando _casosex_cost_price for atualizado
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

// 2. Remoção da Aba 'Informação Adicional' (additional_information)
add_filter('woocommerce_product_tabs', 'casosex_clean_product_tabs', 98);

function casosex_clean_product_tabs($tabs) {
    // Remover aba Informação Adicional
    if (isset($tabs['additional_information'])) {
        unset($tabs['additional_information']);
    }
    return $tabs;
}

// 3. Formatação da Descrição: Anexa Modo de Uso & Higiene & Cuidados dentro do conteúdo da Descrição
add_filter('the_content', 'casosex_append_usage_and_care_to_description', 20);

function casosex_append_usage_and_care_to_description($content) {
    if (!is_singular('product')) {
        return $content;
    }

    global $product;
    if (!$product) return $content;

    $product_id = $product->get_id();
    $usage = get_post_meta($product_id, '_casosex_usage', true);
    $care = get_post_meta($product_id, '_casosex_care', true);

    $extra_html = '';

    if (!empty($usage) && strpos($content, 'Modo de Uso') === false) {
        $extra_html .= '<div class="casosex-section casosex-usage-section" style="margin-top:20px;">';
        $extra_html .= '<h4 style="font-size:1.1em; font-weight:bold;">📖 MODO DE USO:</h4>';
        $extra_html .= '<p>' . nl2br(esc_html($usage)) . '</p>';
        $extra_html .= '</div>';
    }

    if (!empty($care) && strpos($content, 'Higiene') === false) {
        $extra_html .= '<div class="casosex-section casosex-care-section" style="margin-top:20px;">';
        $extra_html .= '<h4 style="font-size:1.1em; font-weight:bold;">🧼 HIGIENE &amp; CUIDADOS:</h4>';
        $extra_html .= '<p>' . nl2br(esc_html($care)) . '</p>';
        $extra_html .= '</div>';
    }

    return $content . $extra_html;
}

// Shortcodes de utilidade caso sejam necessários no futuro
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
