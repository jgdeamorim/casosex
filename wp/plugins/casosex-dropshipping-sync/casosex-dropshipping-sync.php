<?php
/**
 * Plugin Name: CASOSEX Dropshipping Sync & Product Layout
 * Description: Sincroniza metadados nativos de custo (_cost_of_goods), gerencia abas, formata descrição e fornece Endpoints REST e MCP para Ingestão Soberana de Produtos INTT Nativamente no WordPress.
 * Version: 2.0.0
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

// 4. Registro de Endpoints REST Soberanos para Ingestão e Sincronização via WordPress / MCP
add_action('rest_api_init', function() {
    register_rest_route('casosex/v1', '/sync-intt', array(
        'methods'             => 'POST',
        'callback'            => 'casosex_rest_sync_intt_catalog',
        'permission_callback' => '__return_true', // Permite execuções locais / MCP
    ));

    register_rest_route('casosex/v1', '/ingest-product', array(
        'methods'             => 'POST',
        'callback'            => 'casosex_rest_ingest_single_product',
        'permission_callback' => '__return_true',
    ));
});

/**
 * Endpoint para Ingestão Soberana Nativa de um Produto
 */
function casosex_rest_ingest_single_product(WP_REST_Request $request) {
    $item = $request->get_json_params();
    if (empty($item) || empty($item['sku'])) {
        return new WP_Error('invalid_payload', 'Payload JSON inválido ou SKU ausente.', array('status' => 400));
    }

    $result = casosex_ingest_product_native($item);
    return rest_ensure_response($result);
}

/**
 * Endpoint para Sincronizar o Catálogo Completo INTT Nativamente
 */
function casosex_rest_sync_intt_catalog(WP_REST_Request $request) {
    $items = $request->get_json_params();
    if (empty($items) || !is_array($items)) {
        return new WP_Error('invalid_payload', 'Lista de produtos ausente ou formato inválido.', array('status' => 400));
    }

    $synced = array();
    foreach ($items as $item) {
        if (is_array($item) && !empty($item['sku'])) {
            $synced[] = casosex_ingest_product_native($item);
        }
    }

    return rest_ensure_response(array(
        'status' => 'success',
        'total_synced' => count($synced),
        'results' => $synced,
    ));
}

/**
 * Função Nativa PHP de Ingestão e Atualização de Produto WooCommerce no WordPress
 */
function casosex_ingest_product_native($product_data) {
    if (!class_exists('WooCommerce')) {
        return array('error' => 'WooCommerce não está ativo.');
    }

    $sku = sanitize_text_field($product_data['sku']);
    $name = sanitize_text_field($product_data['name']);
    $description = wp_kses_post($product_data['description'] ?? '');
    $short_desc = wp_kses_post($product_data['short_description'] ?? '');
    $suggested_price = floatval($product_data['suggested_price'] ?? 0);
    $cost_price = floatval($product_data['cost_price'] ?? 0);
    $stock_qty = intval($product_data['stock_quantity'] ?? 50);
    $gtin = sanitize_text_field($product_data['gtin'] ?? '');
    $ncm = sanitize_text_field($product_data['ncm'] ?? '');
    $weight = floatval($product_data['weight'] ?? 0.1);
    $weight_net = floatval($product_data['weight_net'] ?? 0.05);
    $length = floatval($product_data['length'] ?? 10);
    $width = floatval($product_data['width'] ?? 5);
    $height = floatval($product_data['height'] ?? 5);
    $category_name = sanitize_text_field($product_data['category'] ?? 'Produtos Eróticos INTT');
    $brand_name = sanitize_text_field($product_data['brand'] ?? 'INTT');
    $variations = $product_data['variations'] ?? array();
    $images = $product_data['images'] ?? array();

    // 1. Localizar ou Criar Produto Pai
    $existing_id = wc_get_product_id_by_sku($sku);
    if ($existing_id) {
        $product = wc_get_product($existing_id);
    } else {
        $product = new WC_Product_Variable();
    }

    $product->set_sku($sku);
    $product->set_name($name);
    $product->set_description($description);
    $product->set_short_description($short_desc);
    $product->set_status('publish');
    $product->set_manage_stock(true);
    $product->set_stock_quantity($stock_qty);
    $product->set_weight($weight);
    $product->set_length($length);
    $product->set_width($width);
    $product->set_height($height);

    // Atributos de variação
    $options_set = array();
    if (!empty($variations)) {
        foreach ($variations as $v) {
            $opt = $v['option'] ?? $v['opcao'] ?? 'Padrão';
            $options_set[] = $opt;
        }
    }
    if (empty($options_set)) {
        $options_set = array('Padrão');
    }
    $options_list = array_values(array_unique($options_set));

    $attr = new WC_Product_Attribute();
    $attr->set_id(0);
    $attr->set_name('Opção');
    $attr->set_options($options_list);
    $attr->set_position(0);
    $attr->set_visible(true);
    $attr->set_variation(true);
    $product->set_attributes(array('opcao' => $attr));

    // Metadados
    $product->update_meta_data('_ncm', $ncm);
    $product->update_meta_data('_weight_net', $weight_net);
    $product->update_meta_data('_casosex_cost_price', $cost_price);
    $product->update_meta_data('_cost_of_goods', $cost_price);
    $product->update_meta_data('_casosex_brand', $brand_name);
    $product->update_meta_data('_casosex_supplier', 'INTT');
    
    // Atributo selecionado por padrão no WooCommerce
    $product->set_default_attributes(array('opcao' => $options_list[0]));

    $product_id = $product->save();

    // GTIN Seguro sem lançar exceção de duplicidade
    if ($product_id && !empty($gtin)) {
        update_post_meta($product_id, '_gtin', $gtin);
        update_post_meta($product_id, '_barcode', $gtin);
        update_post_meta($product_id, '_global_unique_id', $gtin);
        try {
            if (method_exists($product, 'set_global_unique_id')) {
                @$product->set_global_unique_id($gtin);
            }
        } catch (Exception $e) {
            // Ignora exceção de duplicação pai/filho
        }
    }

    // Categorias e Termos de Fornecedor
    if ($product_id) {
        $cat_term = get_term_by('name', $category_name, 'product_cat');
        if (!$cat_term) {
            $new_cat = wp_insert_term($category_name, 'product_cat');
            if (!is_wp_error($new_cat)) {
                $cat_term_id = (int)$new_cat['term_id'];
            }
        } else {
            $cat_term_id = (int)$cat_term->term_id;
        }
        if (isset($cat_term_id) && $cat_term_id > 0) {
            wp_set_object_terms($product_id, array($cat_term_id), 'product_cat');
        }

        // Fornecedor INTT (Term 69)
        wp_set_object_terms($product_id, 69, 'dropship_supplier', true);
    }

    // 2. Download e Vínculo de Imagens via Media Sideload
    if (!empty($images) && is_array($images)) {
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');

        $gallery_ids = array();
        foreach ($images as $idx => $img_url) {
            if (empty($img_url) || !is_string($img_url) || strpos($img_url, 'http') !== 0) continue;
            $attach_id = media_sideload_image($img_url, $product_id, null, 'id');
            if (!is_wp_error($attach_id)) {
                if ($idx === 0 && !$product->get_image_id()) {
                    $product->set_image_id($attach_id);
                } else {
                    $gallery_ids[] = $attach_id;
                }
            }
        }
        if (!empty($gallery_ids)) {
            $existing_g = $product->get_gallery_image_ids();
            $merged_g = array_unique(array_merge($existing_g, $gallery_ids));
            $product->set_gallery_image_ids($merged_g);
        }
        $product->save();
    }

    // 3. Variações Filhas
    if (empty($variations)) {
        $variations = array(
            array(
                'sku' => $sku . '-DEFAULT',
                'option' => $options_list[0],
                'suggested_price' => $suggested_price,
                'cost_price' => $cost_price,
                'stock_quantity' => $stock_qty,
                'gtin' => $gtin
            )
        );
    }

    $var_ids = array();
    foreach ($variations as $var_data) {
        $var_option = $var_data['option'] ?? $var_data['opcao'] ?? 'Padrão';
        $var_sku = sanitize_text_field($var_data['sku'] ?? ($sku . '-' . strtoupper(sanitize_title($var_option))));
        $var_price = floatval($var_data['suggested_price'] ?? $suggested_price);
        $var_cost = floatval($var_data['cost_price'] ?? $cost_price);
        $var_stock = intval($var_data['stock_quantity'] ?? $stock_qty);
        $var_gtin = sanitize_text_field($var_data['gtin'] ?? $gtin);

        $existing_var_id = wc_get_product_id_by_sku($var_sku);
        if ($existing_var_id) {
            $variation = wc_get_product($existing_var_id);
        } else {
            $variation = new WC_Product_Variation();
        }

        $variation->set_parent_id($product_id);
        $variation->set_sku($var_sku);
        $variation->set_attributes(array('opcao' => $var_option));
        $variation->set_regular_price($var_price);
        $variation->set_price($var_price);
        $variation->set_manage_stock(true);
        $variation->set_stock_quantity($var_stock);
        $variation->set_status('publish');

        $variation->update_meta_data('_casosex_cost_price', $var_cost);
        $variation->update_meta_data('_cost_of_goods', $var_cost);

        $v_id = $variation->save();
        if ($v_id && !empty($var_gtin)) {
            update_post_meta($v_id, '_gtin', $var_gtin);
            update_post_meta($v_id, '_barcode', $var_gtin);
            update_post_meta($v_id, '_global_unique_id', $var_gtin);
        }
        $var_ids[] = $v_id;
    }

    return array(
        'success' => true,
        'product_id' => $product_id,
        'sku' => $sku,
        'variations_count' => count($var_ids),
        'image_id' => $product->get_image_id(),
        'gallery_count' => count($product->get_gallery_image_ids())
    );
}
