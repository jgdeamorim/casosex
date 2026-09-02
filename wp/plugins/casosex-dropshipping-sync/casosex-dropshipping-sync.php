<?php
/**
 * Plugin Name: CASOSEX Dropshipping Sync & Product Layout
 * Description: Sincroniza metadados nativos de custo (_cost_of_goods), gerencia abas, formata descrição, vincula Atributos Globais, aplica Trava de Segurança de Estoque (<= 5 un), resolve Hierarquia de Categorias em 3 Níveis (Matriz INTT), orquestra o Mega Menu Responsivo Blocksy Pro (v2.4.0) e executa Sincronização Agendada (2x/dia) Nativamente no WordPress.
 * Version: 2.4.0
 * Author: CASOSEX Sovereign Engine
 */

if (!defined('ABSPATH')) exit;

// Constante de Trava de Segurança de Dropshipping
define('CASOSEX_SAFETY_STOCK_THRESHOLD', 5);

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

// 4. Agendamento WP-Cron Automático (2x ao Dia: twicedaily)
add_action('init', 'casosex_setup_scheduled_sync');
add_action('casosex_cron_intt_stock_cost_sync', 'casosex_execute_intt_stock_cost_cron');

function casosex_setup_scheduled_sync() {
    if (!wp_next_scheduled('casosex_cron_intt_stock_cost_sync')) {
        wp_schedule_event(time(), 'twicedaily', 'casosex_cron_intt_stock_cost_sync');
    }
}

// 5. Registro de Endpoints REST Soberanos para Ingestão, Sincronização e Orquestração do Mega Menu
add_action('rest_api_init', function() {
    register_rest_route('casosex/v1', '/sync-intt', array(
        'methods'             => 'POST',
        'callback'            => 'casosex_rest_sync_intt_catalog',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('casosex/v1', '/ingest-product', array(
        'methods'             => 'POST',
        'callback'            => 'casosex_rest_ingest_single_product',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('casosex/v1', '/sync-stock-cost', array(
        'methods'             => array('GET', 'POST'),
        'callback'            => 'casosex_rest_sync_stock_cost',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('casosex/v1', '/build-menu', array(
        'methods'             => array('GET', 'POST'),
        'callback'            => 'casosex_rest_build_blocksy_mega_menu',
        'permission_callback' => '__return_true',
    ));
});

/**
 * Endpoint REST para Construção Automática do Mega Menu Blocksy
 */
function casosex_rest_build_blocksy_mega_menu(WP_REST_Request $request) {
    $result = casosex_build_blocksy_mega_menu();
    return rest_ensure_response($result);
}

/**
 * Endpoint para Sincronização Rápida de Estoque e Custo (2x/dia)
 */
function casosex_rest_sync_stock_cost(WP_REST_Request $request) {
    $items = $request->get_json_params();
    $results = casosex_update_stock_and_cost_batch(is_array($items) ? $items : array());
    return rest_ensure_response(array(
        'status'  => 'success',
        'updated' => count($results),
        'results' => $results,
    ));
}

/**
 * Função Executada pelo WP-Cron 2x/Dia
 */
function casosex_execute_intt_stock_cost_cron() {
    error_log('[CASOSEX-CRON] Iniciando sincronização 2x/dia de estoque e custo INTT com trava de segurança (<= 5 un).');
    casosex_update_stock_and_cost_batch(array());
}

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
 * Helper para obter ou criar termo de Categoria com Hierarquia
 */
function casosex_ensure_category_term($name, $parent_id = 0) {
    $existing = get_terms(array(
        'taxonomy'   => 'product_cat',
        'name'       => $name,
        'parent'     => $parent_id,
        'hide_empty' => false,
    ));

    if (!empty($existing) && !is_wp_error($existing)) {
        return (int)$existing[0]->term_id;
    }

    $inserted = wp_insert_term($name, 'product_cat', array(
        'parent' => $parent_id,
    ));

    if (!is_wp_error($inserted)) {
        return (int)$inserted['term_id'];
    }

    if (isset($inserted->error_data['term_exists'])) {
        return (int)$inserted->error_data['term_exists'];
    }

    return 0;
}

/**
 * Mapeador e Resolvedor Hierárquico de Categorias (3 Níveis) baseado na Matriz INTT
 */
function casosex_resolve_category_hierarchy($name, $description, $incoming_cat = '') {
    $text = mb_strtolower($name . ' ' . strip_tags($description) . ' ' . $incoming_cat);

    $level1 = 'Cosméticos sensuais';
    $level2 = 'Excitantes';
    $level3 = 'Unissex';

    // 1. Saúde e bem-estar
    if (strpos($text, 'antisséptico') !== false || strpos($text, 'maquiagem') !== false || strpos($text, 'suplemento') !== false || strpos($text, 'sabonete') !== false || strpos($text, 'higienizador') !== false || strpos($text, 'clareador') !== false || strpos($text, 'pompoarismo') !== false) {
        $level1 = 'Saúde e bem-estar';
        if (strpos($text, 'sabonete') !== false || strpos($text, 'higienizador') !== false || strpos($text, 'clareador') !== false || strpos($text, 'pompoarismo') !== false || strpos($text, 'coletor') !== false) {
            $level2 = 'Saúde íntima';
            if (strpos($text, 'sabonete') !== false) $level3 = 'Sabonetes';
            elseif (strpos($text, 'higienizador') !== false || strpos($text, 'limpa toys') !== false) $level3 = 'Higienizador de Toys';
            elseif (strpos($text, 'clareador') !== false) $level3 = 'Clareador e Esfoliante';
            elseif (strpos($text, 'pompoarismo') !== false) $level3 = 'Pompoarismo';
            else $level3 = 'Sérum e Creme Hidratante';
        } else {
            $level2 = 'Bem-estar';
            if (strpos($text, 'antisséptico') !== false) $level3 = 'Antisséptico bucal';
            elseif (strpos($text, 'maquiagem') !== false) $level3 = 'Maquiagem e beleza';
            elseif (strpos($text, 'óleo corporal') !== false) $level3 = 'Óleo corporal';
            elseif (strpos($text, 'perfume') !== false) $level3 = 'Perfumes';
            else $level3 = 'Suplemento';
        }
    }
    // 2. Gel Deslizante (Lubrificantes)
    elseif (strpos($text, 'lubrificante') !== false || strpos($text, 'gel deslizante') !== false || strpos($text, 'siliconado') !== false || strpos($text, 'hidratante vaginal') !== false) {
        $level1 = 'Gel Deslizante';
        if (strpos($text, 'siliconado') !== false) {
            $level2 = 'Siliconados';
            $level3 = 'Siliconados';
        } elseif (strpos($text, 'hidratante vaginal') !== false) {
            $level2 = 'Hidratante Vaginal';
            $level3 = 'Hidratante Vaginal';
        } else {
            $level2 = 'À base de água';
            if (strpos($text, 'beijável') !== false || strpos($text, 'beijavel') !== false) $level3 = 'Beijável';
            elseif (strpos($text, 'térmico') !== false || strpos($text, 'esquenta') !== false) $level3 = 'Térmico';
            else $level3 = 'Neutro';
        }
    }
    // 3. Vibradores Líquidos
    elseif (strpos($text, 'vibrador líquido') !== false || strpos($text, 'vibrador liquido') !== false || strpos($text, 'vibration') !== false) {
        $level1 = 'Vibradores líquidos';
        $level2 = 'Vibration';
        $level3 = 'Vibration';
    }
    // 4. Vibradores & Sugadores
    elseif (strpos($text, 'vibrador') !== false || strpos($text, 'sugador') !== false || strpos($text, 'rabbit') !== false || strpos($text, 'bullet') !== false || strpos($text, 'masturbador') !== false) {
        if (strpos($text, 'sugador') !== false) {
            $level1 = 'Sugadores de clitóris';
            $level2 = 'Sugadores de clitóris';
            $level3 = 'Sugadores de clitóris';
        } else {
            $level1 = 'Vibradores';
            if (strpos($text, 'anal') !== false) { $level2 = 'Anal'; $level3 = 'Anal'; }
            elseif (strpos($text, 'bullet') !== false) { $level2 = 'Bullet'; $level3 = 'Bullet'; }
            elseif (strpos($text, 'app') !== false) { $level2 = 'Com App'; $level3 = 'Com App'; }
            elseif (strpos($text, 'casal') !== false) { $level2 = 'Para casal'; $level3 = 'Para casal'; }
            elseif (strpos($text, 'anel peniano') !== false || strpos($text, 'masturbador') !== false) {
                $level2 = 'Masculinos';
                $level3 = (strpos($text, 'anel') !== false) ? 'Anel peniano' : 'Masturbadores';
            } else {
                $level2 = 'Femininos';
                if (strpos($text, 'rabbit') !== false) $level3 = 'Vibradores Rabbit';
                elseif (strpos($text, 'ponto g') !== false) $level3 = 'Ponto G';
                elseif (strpos($text, 'clitóris') !== false || strpos($text, 'clitoriano') !== false) $level3 = 'Vibradores clitorianos';
                elseif (strpos($text, 'varinha') !== false) $level3 = 'Vibradores varinha mágica';
                elseif (strpos($text, 'realístico') !== false) $level3 = 'Realísticos';
                else $level3 = 'Multifuncional';
            }
        }
    }
    // 5. Cosméticos Sensuais (Padrão para géis, beijáveis, orais, anais)
    else {
        $level1 = 'Cosméticos sensuais';
        if (strpos($text, 'anal') !== false || strpos($text, 'dessensibilizante') !== false) {
            $level2 = 'Sexo Anal';
            $level3 = (strpos($text, 'dessensibilizante') !== false) ? 'Dessensibilizante' : 'Excitante anal';
        } elseif (strpos($text, 'oral') !== false || strpos($text, 'beijável') !== false || strpos($text, 'beijavel') !== false || strpos($text, 'garganta') !== false || strpos($text, 'babalub') !== false) {
            $level2 = 'Sexo Oral';
            if (strpos($text, 'garganta') !== false) $level3 = 'Garganta Profunda';
            elseif (strpos($text, 'calcinha') !== false) $level3 = 'Calcinha comestível';
            else $level3 = 'Beijáveis';
        } elseif (strpos($text, 'massagem') !== false || strpos($text, 'vela') !== false || strpos($text, 'óleo') !== false) {
            $level2 = 'Massagem';
            if (strpos($text, 'vela') !== false) $level3 = 'Vela beijável';
            elseif (strpos($text, 'óleo') !== false) $level3 = 'Óleos';
            else $level3 = 'Géis';
        } else {
            $level2 = 'Excitantes';
            if (strpos($text, 'feminino') !== false) $level3 = 'Feminino';
            elseif (strpos($text, 'masculino') !== false) $level3 = 'Masculinos';
            else $level3 = 'Unissex';
        }
    }

    // Criar/obter Termos com vinculo Pai-Filho no WooCommerce
    $l1_id = casosex_ensure_category_term($level1, 0);
    $l2_id = casosex_ensure_category_term($level2, $l1_id);
    $l3_id = casosex_ensure_category_term($level3, $l2_id);

    return array_values(array_unique(array_filter(array($l1_id, $l2_id, $l3_id))));
}

/**
 * Função Soberana para Montar o Mega Menu Blocksy com Injeção de Meta `blocksy_post_meta_options`
 */
function casosex_build_blocksy_mega_menu() {
    $menu_name = 'Main Menu';
    $menu_obj = wp_get_nav_menu_object($menu_name);

    if (!$menu_obj) {
        $menu_id = wp_create_nav_menu($menu_name);
    } else {
        $menu_id = (int)$menu_obj->term_id;
    }

    // Vincular menu às posições `menu_1` (Desktop) e `menu_mobile` (Mobile)
    $locations = get_theme_mod('nav_menu_locations', array());
    $locations['menu_1'] = $menu_id;
    $locations['menu_mobile'] = $menu_id;
    set_theme_mod('nav_menu_locations', $locations);

    // Buscar categorias Nível 1 (Sem pai)
    $l1_terms = get_terms(array(
        'taxonomy'   => 'product_cat',
        'parent'     => 0,
        'hide_empty' => false,
    ));

    $created_items = array();

    foreach ($l1_terms as $l1) {
        if ($l1->slug === 'uncategorized') continue;

        // Criar Item Nível 1 no Menu
        $l1_item_id = wp_update_nav_menu_item($menu_id, 0, array(
            'menu-item-title'     => $l1->name,
            'menu-item-object'    => 'product_cat',
            'menu-item-object-id' => $l1->term_id,
            'menu-item-type'      => 'taxonomy',
            'menu-item-status'    => 'publish',
        ));

        if (is_wp_error($l1_item_id)) continue;

        // Injetar Configuração Nativa do Mega Menu Blocksy no Nível 1
        update_post_meta($l1_item_id, 'blocksy_post_meta_options', array(
            'has_mega_menu'     => 'yes',
            'mega_menu_columns' => '4',
            'mega_menu_width'   => 'container',
        ));

        $created_items[] = array('id' => $l1_item_id, 'name' => $l1->name, 'level' => 1);

        // Buscar Subcategorias Nível 2
        $l2_terms = get_terms(array(
            'taxonomy'   => 'product_cat',
            'parent'     => $l1->term_id,
            'hide_empty' => false,
        ));

        foreach ($l2_terms as $l2) {
            $l2_item_id = wp_update_nav_menu_item($menu_id, 0, array(
                'menu-item-title'     => $l2->name,
                'menu-item-object'    => 'product_cat',
                'menu-item-object-id' => $l2->term_id,
                'menu-item-type'      => 'taxonomy',
                'menu-item-parent-id' => $l1_item_id,
                'menu-item-status'    => 'publish',
            ));

            if (is_wp_error($l2_item_id)) continue;
            $created_items[] = array('id' => $l2_item_id, 'name' => $l2->name, 'level' => 2);

            // Buscar Subcategorias Nível 3
            $l3_terms = get_terms(array(
                'taxonomy'   => 'product_cat',
                'parent'     => $l2->term_id,
                'hide_empty' => false,
            ));

            foreach ($l3_terms as $l3) {
                $l3_item_id = wp_update_nav_menu_item($menu_id, 0, array(
                    'menu-item-title'     => $l3->name,
                    'menu-item-object'    => 'product_cat',
                    'menu-item-object-id' => $l3->term_id,
                    'menu-item-type'      => 'taxonomy',
                    'menu-item-parent-id' => $l2_item_id,
                    'menu-item-status'    => 'publish',
                ));

                if (!is_wp_error($l3_item_id)) {
                    $created_items[] = array('id' => $l3_item_id, 'name' => $l3->name, 'level' => 3);
                }
            }
        }
    }

    return array(
        'status'         => 'success',
        'menu_id'        => $menu_id,
        'total_created'  => count($created_items),
        'items'          => $created_items,
    );
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
    $category_name = sanitize_text_field($product_data['category'] ?? '');
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

    // Atributos de variação (Local)
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

    $attributes_array = array();

    $attr = new WC_Product_Attribute();
    $attr->set_id(0);
    $attr->set_name('Opção');
    $attr->set_options($options_list);
    $attr->set_position(0);
    $attr->set_visible(true);
    $attr->set_variation(true);
    $attributes_array['opcao'] = $attr;

    // Metadados
    $product->update_meta_data('_ncm', $ncm);
    $product->update_meta_data('_weight_net', $weight_net);
    $product->update_meta_data('_casosex_cost_price', $cost_price);
    $product->update_meta_data('_cost_of_goods', $cost_price);
    $product->update_meta_data('_casosex_brand', $brand_name);
    $product->update_meta_data('_casosex_supplier', 'INTT');
    
    // Atributo selecionado por padrão no WooCommerce
    $product->set_default_attributes(array('opcao' => $options_list[0]));

    // 2. Mapear e Vincular Atributos Globais (`pa_...`)
    $global_attrs = casosex_map_global_attributes($name, $description, $product_data);
    foreach ($global_attrs as $tax_name => $term_slugs) {
        if (!taxonomy_exists($tax_name)) continue;

        $g_attr = new WC_Product_Attribute();
        $g_attr->set_id(wc_attribute_taxonomy_id_by_name(str_replace('pa_', '', $tax_name)));
        $g_attr->set_name($tax_name);
        $g_attr->set_options($term_slugs);
        $g_attr->set_position(count($attributes_array));
        $g_attr->set_visible(true);
        $g_attr->set_variation(false);
        $attributes_array[$tax_name] = $g_attr;
    }

    $product->set_attributes($attributes_array);
    $product_id = $product->save();

    // Aplicação Forçada da Trava de Segurança em Meta + Transients
    $stock_status = ($stock_qty <= CASOSEX_SAFETY_STOCK_THRESHOLD) ? 'outofstock' : 'instock';
    update_post_meta($product_id, '_stock_status', $stock_status);

    // 3. Vincular Hierarquia Completa de Categorias (3 Níveis)
    if ($product_id) {
        $cat_ids = casosex_resolve_category_hierarchy($name, $description, $category_name);
        wp_set_object_terms($product_id, $cat_ids, 'product_cat');

        // Fornecedor INTT (Term 69)
        wp_set_object_terms($product_id, 69, 'dropship_supplier', true);
    }

    // Vincular termos das taxonomias globais no WordPress
    if ($product_id) {
        foreach ($global_attrs as $tax_name => $term_slugs) {
            if (taxonomy_exists($tax_name)) {
                wp_set_object_terms($product_id, $term_slugs, $tax_name);
            }
        }
    }

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

    // 4. Download e Vínculo de Imagens via Media Sideload
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

    // 5. Variações Filhas
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
        $var_stock_status = ($var_stock <= CASOSEX_SAFETY_STOCK_THRESHOLD) ? 'outofstock' : 'instock';
        update_post_meta($v_id, '_stock_status', $var_stock_status);

        if ($v_id && !empty($var_gtin)) {
            update_post_meta($v_id, '_gtin', $var_gtin);
            update_post_meta($v_id, '_barcode', $var_gtin);
            update_post_meta($v_id, '_global_unique_id', $var_gtin);
        }
        $var_ids[] = $v_id;
    }

    wc_delete_product_transients($product_id);

    return array(
        'success' => true,
        'product_id' => $product_id,
        'sku' => $sku,
        'stock_quantity' => $stock_qty,
        'stock_status' => get_post_meta($product_id, '_stock_status', true),
        'variations_count' => count($var_ids),
        'categories_assigned' => count(wp_get_post_terms($product_id, 'product_cat')),
        'global_attributes' => array_keys($global_attrs),
        'image_id' => $product->get_image_id(),
        'gallery_count' => count($product->get_gallery_image_ids())
    );
}

/**
 * Mapeador Inteligente de Atributos Globais (`pa_...`) do WooCommerce
 */
function casosex_map_global_attributes($name, $description, $payload) {
    $mapped = array();
    $text = mb_strtolower($name . ' ' . strip_tags($description));

    // pa_sabor
    if (strpos($text, 'chiclete') !== false) {
        $mapped['pa_sabor'][] = 'chiclete';
    } elseif (strpos($text, 'morango') !== false) {
        $mapped['pa_sabor'][] = 'morango';
    } elseif (strpos($text, 'menta') !== false || strpos($text, 'hortelã') !== false) {
        $mapped['pa_sabor'][] = 'menta-ice';
    } elseif (strpos($text, 'chocolate') !== false) {
        $mapped['pa_sabor'][] = 'chocolate';
    } elseif (strpos($text, 'baunilha') !== false) {
        $mapped['pa_sabor'][] = 'baunilha';
    }

    // pa_volume
    if (preg_match('/(\d+)\s*(g|ml)/i', $name, $matches)) {
        $vol_slug = strtolower($matches[1] . $matches[2]);
        $mapped['pa_volume'][] = $vol_slug;
    } elseif (strpos($text, '15g') !== false || strpos($text, '15ml') !== false) {
        $mapped['pa_volume'][] = '15ml';
    }

    // pa_efeito
    if (strpos($text, 'esquenta') !== false || strpos($text, 'hot') !== false || strpos($text, 'aquecimento') !== false) {
        $mapped['pa_efeito'][] = 'esquenta-warm';
    }
    if (strpos($text, 'esfria') !== false || strpos($text, 'ice') !== false || strpos($text, 'gelado') !== false) {
        $mapped['pa_efeito'][] = 'esfria-ice';
    }
    if (strpos($text, 'vibra') !== false || strpos($text, 'pulsante') !== false || strpos($text, 'jambu') !== false) {
        $mapped['pa_efeito'][] = 'pulsante';
    }

    // pa_material
    if (strpos($text, 'gel') !== false || strpos($text, 'água') !== false) {
        $mapped['pa_material'][] = 'gel-a-base-de-agua';
    }

    return $mapped;
}

/**
 * Atualização Leve e Rápida de Estoque e Custo em Lote (2x/dia) com Trava de Segurança (<= 5 un)
 */
function casosex_update_stock_and_cost_batch($items = array()) {
    $results = array();

    // Se a lista estiver vazia, busca produtos INTT cadastrados no WooCommerce
    if (empty($items)) {
        $args = array(
            'post_type'      => array('product', 'product_variation'),
            'posts_per_page' => -1,
            'meta_key'       => '_casosex_supplier',
            'meta_value'     => 'INTT',
            'fields'         => 'ids'
        );
        $product_ids = get_posts($args);

        foreach ($product_ids as $pid) {
            $product = wc_get_product($pid);
            if (!$product) continue;

            $product->set_manage_stock(true);
            $stock = $product->get_stock_quantity();
            $cost = get_post_meta($pid, '_cost_of_goods', true);

            $stock_status = ($stock === null || $stock <= CASOSEX_SAFETY_STOCK_THRESHOLD) ? 'outofstock' : 'instock';
            $product->save();

            update_post_meta($pid, '_stock_status', $stock_status);
            wc_delete_product_transients($pid);

            $results[] = array(
                'product_id'   => $pid,
                'sku'          => $product->get_sku(),
                'stock'        => $stock,
                'stock_status' => $stock_status,
                'cost'         => $cost
            );
        }
    } else {
        foreach ($items as $item) {
            if (empty($item['sku'])) continue;
            $pid = wc_get_product_id_by_sku($item['sku']);
            if (!$pid) continue;

            $product = wc_get_product($pid);
            if (!$product) continue;

            $stock = isset($item['stock_quantity']) ? intval($item['stock_quantity']) : $product->get_stock_quantity();
            $cost = isset($item['cost_price']) ? floatval($item['cost_price']) : get_post_meta($pid, '_cost_of_goods', true);
            $stock_status = ($stock <= CASOSEX_SAFETY_STOCK_THRESHOLD) ? 'outofstock' : 'instock';

            // Se for produto pai variável, atualiza o pai e todas as variações filhas!
            if ($product->is_type('variable')) {
                $product->set_manage_stock(true);
                $product->set_stock_quantity($stock);
                if (isset($item['cost_price'])) {
                    update_post_meta($pid, '_casosex_cost_price', $cost);
                    update_post_meta($pid, '_cost_of_goods', $cost);
                }
                $product->save();

                update_post_meta($pid, '_stock_status', $stock_status);
                wc_delete_product_transients($pid);

                foreach ($product->get_children() as $child_id) {
                    $child = wc_get_product($child_id);
                    if (!$child) continue;
                    $child->set_manage_stock(true);
                    $child->set_stock_quantity($stock);
                    if (isset($item['cost_price'])) {
                        update_post_meta($child_id, '_casosex_cost_price', $cost);
                        update_post_meta($child_id, '_cost_of_goods', $cost);
                    }
                    $child->save();

                    update_post_meta($child_id, '_stock_status', $stock_status);
                    wc_delete_product_transients($child_id);
                }
            } else {
                $product->set_manage_stock(true);
                $product->set_stock_quantity($stock);
                if (isset($item['cost_price'])) {
                    update_post_meta($pid, '_casosex_cost_price', $cost);
                    update_post_meta($pid, '_cost_of_goods', $cost);
                }
                $product->save();

                update_post_meta($pid, '_stock_status', $stock_status);
                wc_delete_product_transients($pid);
            }

            $results[] = array(
                'product_id'   => $pid,
                'sku'          => $item['sku'],
                'stock'        => $stock,
                'stock_status' => $stock_status,
                'cost'         => $cost
            );
        }
    }

    return $results;
}
