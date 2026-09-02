<?php
/**
 * Plugin Name: CASOSEX Dropshipping Sync & Product Layout
 * Description: Sincroniza metadados nativos de custo (_cost_of_goods), gerencia abas, formata descrição, vincula Atributos Globais, aplica Trava de Segurança de Estoque (<= 5 un), resolve Hierarquia de Categorias em 3 Níveis (Matriz Oficial INTT 100% Fidelidade), orquestra o Mega Menu Responsivo Blocksy Pro & Elemento Header Contacts (v2.6.0) e executa Sincronização Agendada (2x/dia) Nativamente no WordPress.
 * Version: 2.6.0
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

// 5. Registro de Endpoints REST Soberanos
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
 * REST Endpoint para Reconstrução Fiel do Mega Menu INTT no Blocksy
 */
function casosex_rest_build_blocksy_mega_menu(WP_REST_Request $request) {
    $result = casosex_build_blocksy_mega_menu();
    return rest_ensure_response($result);
}

/**
 * REST Endpoint para Sincronização de Estoque e Custo
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

function casosex_execute_intt_stock_cost_cron() {
    error_log('[CASOSEX-CRON] Iniciando sincronização 2x/dia de estoque e custo INTT com trava de segurança (<= 5 un).');
    casosex_update_stock_and_cost_batch(array());
}

function casosex_rest_ingest_single_product(WP_REST_Request $request) {
    $item = $request->get_json_params();
    if (empty($item) || empty($item['sku'])) {
        return new WP_Error('invalid_payload', 'Payload JSON inválido ou SKU ausente.', array('status' => 400));
    }

    $result = casosex_ingest_product_native($item);
    return rest_ensure_response($result);
}

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
 * Helper para obter ou criar termo de Categoria no WooCommerce de Forma Idempotente
 */
function casosex_ensure_category_term($name, $parent_id = 0) {
    $name = trim($name);
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
 * MATRIZ OFICIAL INTT (100% Fidelidade ao Menu HTML da Lojaintt.com.br)
 */
function casosex_get_official_intt_taxonomy_tree() {
    return array(
        'Saúde e bem-estar' => array(
            'Bem-estar' => array(
                'Antisséptico bucal',
                'Maquiagem e beleza',
                'Óleo corporal',
                'Perfumes',
                'Suplemento',
            ),
            'Saúde íntima' => array(
                'Clareador e Esfoliante',
                'Coletor Menstrual',
                'Desodorantes',
                'Higienizador de Toys',
                'Pompoarismo',
                'Sabonetes',
                'Sérum e Creme Hidratante',
            ),
        ),
        'Gel Deslizante' => array(
            'Hidratante Vaginal' => array(),
            'Siliconados'        => array(),
            'À base de água'     => array(
                'Beijável',
                'Neutro',
                'Térmico',
            ),
        ),
        'Cosméticos sensuais' => array(
            'Adstringente' => array(),
            'Kits'         => array(),
            'Retardante'   => array(),
            'Excitantes'   => array(
                'Feminino',
                'Masculinos',
                'Unissex',
            ),
            'Massagem' => array(
                'Géis',
                'Óleos',
                'Vela beijável',
                'Vela de massagem',
            ),
            'Sexo Anal' => array(
                'Dessensibilizante',
                'Excitante anal',
            ),
            'Sexo Oral' => array(
                'Beijáveis',
                'Calcinha comestível',
                'Garganta Profunda',
            ),
        ),
        'Vibradores líquidos' => array(
            'Vibration' => array(),
        ),
        'Vibradores' => array(
            'Anal'             => array(),
            'Bullet'           => array(),
            'Com App'          => array(),
            'Para casal'       => array(),
            'Femininos'        => array(
                'Multifuncional',
                'Ponto G',
                'Realísticos',
                'Vibradores clitorianos',
                'Vibradores Rabbit',
                'Vibradores varinha mágica',
            ),
            'Marcas exclusivas' => array(
                'Intt Toys',
                'Satisfyer',
                'Svakom',
            ),
            'Masculinos' => array(
                'Anel peniano',
                'Masturbadores',
            ),
        ),
        'Sugadores de clitóris' => array(),
        'Produtos eróticos' => array(
            'BDSM e Fetiche'     => array(),
            'Bomba peniana'      => array(),
            'Livros e Jogos'     => array(),
            'Masturbadores Eggs' => array(),
            'Plug anal'          => array(),
        ),
        'Linhas' => array(
            'Deborah Secco' => array(),
            '50 tons'       => array(),
            'Collors'       => array(),
            'Intt Wellness' => array(),
            'Laura Muller'  => array(),
            'Poções'        => array(),
            'Stripper'      => array(),
        ),
        'Promoção' => array(
            'Descontos'     => array(),
            'Mais vendidos' => array(),
        ),
    );
}

/**
 * Resolvedor de Hierarquia de Categorias alinhado à Matriz INTT
 */
function casosex_resolve_category_hierarchy($name, $description, $incoming_cat = '') {
    $tree = casosex_get_official_intt_taxonomy_tree();
    $text = mb_strtolower($name . ' ' . strip_tags($description) . ' ' . $incoming_cat);

    $level1 = 'Cosméticos sensuais';
    $level2 = 'Excitantes';
    $level3 = 'Unissex';

    // 1. Saúde e bem-estar
    if (strpos($text, 'antisséptico') !== false || strpos($text, 'maquiagem') !== false || strpos($text, 'suplemento') !== false || strpos($text, 'sabonete') !== false || strpos($text, 'higienizador') !== false || strpos($text, 'clareador') !== false || strpos($text, 'pompoarismo') !== false || strpos($text, 'coletor') !== false) {
        $level1 = 'Saúde e bem-estar';
        if (strpos($text, 'sabonete') !== false || strpos($text, 'higienizador') !== false || strpos($text, 'clareador') !== false || strpos($text, 'pompoarismo') !== false || strpos($text, 'coletor') !== false || strpos($text, 'desodorante') !== false || strpos($text, 'sérum') !== false || strpos($text, 'serum') !== false) {
            $level2 = 'Saúde íntima';
            if (strpos($text, 'sabonete') !== false) $level3 = 'Sabonetes';
            elseif (strpos($text, 'higienizador') !== false || strpos($text, 'limpa toys') !== false) $level3 = 'Higienizador de Toys';
            elseif (strpos($text, 'clareador') !== false) $level3 = 'Clareador e Esfoliante';
            elseif (strpos($text, 'coletor') !== false) $level3 = 'Coletor Menstrual';
            elseif (strpos($text, 'desodorante') !== false) $level3 = 'Desodorantes';
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
            $level3 = '';
        } elseif (strpos($text, 'hidratante vaginal') !== false) {
            $level2 = 'Hidratante Vaginal';
            $level3 = '';
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
        $level3 = '';
    }
    // 4. Vibradores & Sugadores
    elseif (strpos($text, 'vibrador') !== false || strpos($text, 'sugador') !== false || strpos($text, 'rabbit') !== false || strpos($text, 'bullet') !== false || strpos($text, 'satisfyer') !== false || strpos($text, 'svakom') !== false) {
        if (strpos($text, 'sugador') !== false) {
            $level1 = 'Sugadores de clitóris';
            $level2 = '';
            $level3 = '';
        } else {
            $level1 = 'Vibradores';
            if (strpos($text, 'satisfyer') !== false || strpos($text, 'svakom') !== false || strpos($text, 'intt toys') !== false) {
                $level2 = 'Marcas exclusivas';
                if (strpos($text, 'satisfyer') !== false) $level3 = 'Satisfyer';
                elseif (strpos($text, 'svakom') !== false) $level3 = 'Svakom';
                else $level3 = 'Intt Toys';
            } elseif (strpos($text, 'anal') !== false) { $level2 = 'Anal'; $level3 = ''; }
            elseif (strpos($text, 'bullet') !== false) { $level2 = 'Bullet'; $level3 = ''; }
            elseif (strpos($text, 'app') !== false) { $level2 = 'Com App'; $level3 = ''; }
            elseif (strpos($text, 'casal') !== false) { $level2 = 'Para casal'; $level3 = ''; }
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
    // 5. Produtos eróticos (BDSM, Plugs, Eggs, Bombas)
    elseif (strpos($text, 'bdsm') !== false || strpos($text, 'fetiche') !== false || strpos($text, 'algema') !== false || strpos($text, 'plug') !== false || strpos($text, 'egg') !== false || strpos($text, 'bomba peniana') !== false) {
        $level1 = 'Produtos eróticos';
        if (strpos($text, 'bdsm') !== false || strpos($text, 'fetiche') !== false || strpos($text, 'algema') !== false) $level2 = 'BDSM e Fetiche';
        elseif (strpos($text, 'plug') !== false) $level2 = 'Plug anal';
        elseif (strpos($text, 'egg') !== false) $level2 = 'Masturbadores Eggs';
        elseif (strpos($text, 'bomba') !== false) $level2 = 'Bomba peniana';
        else $level2 = 'Livros e Jogos';
        $level3 = '';
    }
    // 6. Cosméticos sensuais (Padrão)
    else {
        $level1 = 'Cosméticos sensuais';
        if (strpos($text, 'adstringente') !== false) { $level2 = 'Adstringente'; $level3 = ''; }
        elseif (strpos($text, 'kit') !== false) { $level2 = 'Kits'; $level3 = ''; }
        elseif (strpos($text, 'retardante') !== false) { $level2 = 'Retardante'; $level3 = ''; }
        elseif (strpos($text, 'anal') !== false || strpos($text, 'dessensibilizante') !== false) {
            $level2 = 'Sexo Anal';
            $level3 = (strpos($text, 'dessensibilizante') !== false) ? 'Dessensibilizante' : 'Excitante anal';
        } elseif (strpos($text, 'oral') !== false || strpos($text, 'beijável') !== false || strpos($text, 'beijavel') !== false || strpos($text, 'garganta') !== false || strpos($text, 'babalub') !== false) {
            $level2 = 'Sexo Oral';
            if (strpos($text, 'garganta') !== false) $level3 = 'Garganta Profunda';
            elseif (strpos($text, 'calcinha') !== false) $level3 = 'Calcinha comestível';
            else $level3 = 'Beijáveis';
        } elseif (strpos($text, 'massagem') !== false || strpos($text, 'vela') !== false || strpos($text, 'óleo') !== false) {
            $level2 = 'Massagem';
            if (strpos($text, 'vela beijável') !== false) $level3 = 'Vela beijável';
            elseif (strpos($text, 'vela') !== false) $level3 = 'Vela de massagem';
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
    $l2_id = !empty($level2) ? casosex_ensure_category_term($level2, $l1_id) : 0;
    $l3_id = (!empty($level3) && !empty($l2_id)) ? casosex_ensure_category_term($level3, $l2_id) : 0;

    return array_values(array_unique(array_filter(array($l1_id, $l2_id, $l3_id))));
}

/**
 * Construtor Soberano do Mega Menu Blocksy baseando-se 100% na Matriz Oficial da INTT
 */
function casosex_build_blocksy_mega_menu() {
    $menu_name = 'Main Menu';
    $menu_obj = wp_get_nav_menu_object($menu_name);

    if (!$menu_obj) {
        $menu_id = wp_create_nav_menu($menu_name);
    } else {
        $menu_id = (int)$menu_obj->term_id;
    }

    // Limpar itens existentes no menu para garantir 100% de reconstrução fiel sem duplicações
    $existing_items = wp_get_nav_menu_items($menu_id);
    if ($existing_items && is_array($existing_items)) {
        foreach ($existing_items as $item) {
            wp_delete_post($item->ID, true);
        }
    }

    // Vincular menu às posições `menu_1` (Desktop) e `menu_mobile` (Mobile)
    $locations = get_theme_mod('nav_menu_locations', array());
    $locations['menu_1'] = $menu_id;
    $locations['menu_mobile'] = $menu_id;
    set_theme_mod('nav_menu_locations', $locations);

    $tree = casosex_get_official_intt_taxonomy_tree();
    $created_items = array();

    foreach ($tree as $l1_name => $l2_group) {
        $l1_term_id = casosex_ensure_category_term($l1_name, 0);

        // Criar Item Nível 1 no Menu
        $l1_item_id = wp_update_nav_menu_item($menu_id, 0, array(
            'menu-item-title'     => $l1_name,
            'menu-item-object'    => 'product_cat',
            'menu-item-object-id' => $l1_term_id,
            'menu-item-type'      => 'taxonomy',
            'menu-item-status'    => 'publish',
        ));

        if (is_wp_error($l1_item_id)) continue;

        // Injetar Configuração Nativa do Mega Menu Blocksy no Nível 1
        $mega_menu_opts = array(
            'has_mega_menu'     => !empty($l2_group) ? 'yes' : 'no',
            'mega_menu_columns' => count($l2_group) > 3 ? '4' : (count($l2_group) > 0 ? '3' : '2'),
            'mega_menu_width'   => 'container',
        );

        if ($l1_name === 'Promoção') {
            $mega_menu_opts['mega_menu_label'] = 'PROMO';
        }

        update_post_meta($l1_item_id, 'blocksy_post_meta_options', $mega_menu_opts);

        $created_items[] = array('id' => $l1_item_id, 'name' => $l1_name, 'level' => 1);

        // Nível 2
        foreach ($l2_group as $l2_name => $l3_list) {
            $l2_term_id = casosex_ensure_category_term($l2_name, $l1_term_id);

            $l2_item_id = wp_update_nav_menu_item($menu_id, 0, array(
                'menu-item-title'     => $l2_name,
                'menu-item-object'    => 'product_cat',
                'menu-item-object-id' => $l2_term_id,
                'menu-item-type'      => 'taxonomy',
                'menu-item-parent-id' => $l1_item_id,
                'menu-item-status'    => 'publish',
            ));

            if (is_wp_error($l2_item_id)) continue;
            $created_items[] = array('id' => $l2_item_id, 'name' => $l2_name, 'level' => 2);

            // Nível 3
            if (!empty($l3_list) && is_array($l3_list)) {
                foreach ($l3_list as $l3_name) {
                    $l3_term_id = casosex_ensure_category_term($l3_name, $l2_term_id);

                    $l3_item_id = wp_update_nav_menu_item($menu_id, 0, array(
                        'menu-item-title'     => $l3_name,
                        'menu-item-object'    => 'product_cat',
                        'menu-item-object-id' => $l3_term_id,
                        'menu-item-type'      => 'taxonomy',
                        'menu-item-parent-id' => $l2_item_id,
                        'menu-item-status'    => 'publish',
                    ));

                    if (!is_wp_error($l3_item_id)) {
                        $created_items[] = array('id' => $l3_item_id, 'name' => $l3_name, 'level' => 3);
                    }
                }
            }
        }
    }

    // Sincronizar também os itens do elemento Contacts do Cabeçalho Blocksy (Blog e Seja Revendedora)
    casosex_ensure_header_contacts_items();

    return array(
        'status'         => 'success',
        'menu_id'        => $menu_id,
        'total_created'  => count($created_items),
        'items'          => $created_items,
    );
}

/**
 * Garante a injeção nativa dos itens Blog e Seja Revendedora no elemento Contacts do Header Blocksy Pro
 */
function casosex_ensure_header_contacts_items() {
    $mods = get_option('theme_mods_blocksy', array());

    if (!isset($mods['header_placements']['sections'][0]['items'])) {
        return false;
    }

    $site_url = get_site_url();

    foreach ($mods['header_placements']['sections'][0]['items'] as &$item) {
        if ($item['id'] === 'contacts') {
            if (!isset($item['values']['contact_items']) || !is_array($item['values']['contact_items'])) {
                $item['values']['contact_items'] = array();
            }

            $has_blog = false;
            $has_revendedora = false;

            foreach ($item['values']['contact_items'] as $c) {
                if (isset($c['__id']) && $c['__id'] === 'blog_item_casosex') $has_blog = true;
                if (isset($c['__id']) && $c['__id'] === 'revendedora_item_casosex') $has_revendedora = true;
            }

            if (!$has_blog) {
                $item['values']['contact_items'][] = array(
                    'id'      => 'website',
                    'enabled' => true,
                    'title'   => 'Blog:',
                    'content' => 'Blog Volúpia',
                    'link'    => $site_url . '/blog',
                    'icon'    => array('icon' => 'blc blc-globe'),
                    '__id'    => 'blog_item_casosex'
                );
            }

            if (!$has_revendedora) {
                $item['values']['contact_items'][] = array(
                    'id'      => 'website',
                    'enabled' => true,
                    'title'   => 'Parceira:',
                    'content' => 'Seja Revendedora',
                    'link'    => $site_url . '/seja-revendedora',
                    'icon'    => array('icon' => 'blc blc-star'),
                    '__id'    => 'revendedora_item_casosex'
                );
            }
        }
    }

    update_option('theme_mods_blocksy', $mods);
    return true;
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
            // Ignora exceção
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
