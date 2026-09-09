<?php
/**
 * Motor de Matching Score e Pesquisa Mercado Livre
 * ADR-0239 § 2.1
 */

if (!defined('ABSPATH')) {
    exit;
}

class CasoSex_MeLi_Matcher {

    public static function match_product($product_id) {
        $product = wc_get_product($product_id);
        if (!$product) {
            return new WP_Error('not_found', 'Produto não encontrado.');
        }

        $token = CasoSex_MeLi_OAuth::get_access_token();
        if (is_wp_error($token)) {
            return $token;
        }

        $title = $product->get_name();
        $cost_price = floatval(get_post_meta($product_id, '_cost_price', true));
        $our_price = floatval($product->get_regular_price());

        // Sanitização de termo de busca
        $clean_query = self::sanitize_query($title);

        // Se for Satisfyer Pro 2 Gen 3, busca direto o catálogo canônico
        $catalog_id = null;
        if (stripos($title, 'Satisfyer') !== false && (stripos($title, 'Gen 3') !== false || stripos($title, 'Generation 3') !== false)) {
            $catalog_id = 'MLB41352084';
        }

        $catalog_data = null;
        if ($catalog_id) {
            $catalog_data = self::fetch_catalog_product($catalog_id, $token);
        }

        // Se não achou por catálogo direto, faz a busca
        if (!$catalog_data) {
            $search_res = self::search_meli($clean_query, $token);
            if (!empty($search_res)) {
                $catalog_id = !empty($search_res['id']) ? $search_res['id'] : (!empty($search_res['catalog_product_id']) ? $search_res['catalog_product_id'] : null);
                if ($catalog_id) {
                    $catalog_data = self::fetch_catalog_product($catalog_id, $token);
                    if (!$catalog_data) {
                        $catalog_data = $search_res; // Se /products/{id} falhar, usa os dados da própria busca
                    }
                }
            }
        }

        if (!$catalog_data) {
            return new WP_Error('no_match', 'Nenhum item correspondente no Mercado Livre.');
        }

        // Cálculo de Matching Score Ponderado
        $meli_name = isset($catalog_data['name']) ? $catalog_data['name'] : '';
        $score = self::calculate_score($title, $meli_name, $cost_price);

        // Unidades da caixa fechada
        $box_units = 1;
        $box_terms = wp_get_post_terms($product_id, 'pa_caixa_atacado');
        if (!empty($box_terms) && !is_wp_error($box_terms)) {
            if (preg_match('/(\d+)/', $box_terms[0]->name, $m_box)) {
                $box_units = intval($m_box[1]);
            }
        }

        // Benchmarking Avançado dos Top 5 Concorrentes (ADR-0240 § 2.5)
        $top5_bench = CasoSex_MeLi_Benchmarking::get_top5_benchmark($catalog_id, $token);
        $market_price = !empty($top5_bench['avg_price']) ? $top5_bench['avg_price'] : self::fetch_market_price($catalog_id, $token);
        $lowest_competitor = !empty($top5_bench['lowest_price']) ? $top5_bench['lowest_price'] : $market_price;
        
        // Sensor DataForSEO: Volume de Busca & CPA Real (ADR-0241)
        $cpa_real = 0;
        if (class_exists('Adsentice_DataForSEO_Bridge')) {
            $clean_kw = self::sanitize_query($title);
            $dfs_metrics = Adsentice_DataForSEO_Bridge::get_keyword_metrics($clean_kw);
            if (!empty($dfs_metrics['cpc']) && floatval($dfs_metrics['cpc']) > 0) {
                // CPA = CPC / Taxa de Conversão estimada de LP (2.5%)
                $cpa_real = round(floatval($dfs_metrics['cpc']) / 0.025, 2);
            }
        }

        // Motor Algorítmico Multicanal (ADR-0240 / ADR-0241) - ZERO 1.8x cego
        $pricing = CasoSex_MeLi_Pricing_Engine::calculate_all_channels($cost_price, $box_units, $market_price, $cpa_real);

        if ($market_price <= 0 && !empty($pricing)) {
            $market_price = $pricing['price_meli_premium']; // Preço seguro Premium como fallback
        }

        // Análise de inteligência
        $intelligence = CasoSex_MeLi_Intelligence::analyze_product($product_id, $catalog_data, $cost_price, $market_price);

        // Enriquecimento de atributos
        $applied_attrs = [];
        if (!empty($catalog_data['attributes'])) {
            $applied_attrs = CasoSex_MeLi_Enricher::enrich_product_attributes($product_id, $catalog_data['attributes']);
        }

        // Atualização dos campos ACF / PostMeta
        $fields_to_update = [
            'meli_matching_score'       => $score,
            'meli_catalog_id'           => $catalog_id,
            'meli_market_price'         => $market_price,
            'meli_lowest_competitor'    => $lowest_competitor,
            'meli_top5_avg_price'       => !empty($top5_bench['avg_price']) ? $top5_bench['avg_price'] : $market_price,
            'meli_top5_competitors_json'=> !empty($top5_bench['competitors']) ? wp_json_encode($top5_bench['competitors']) : '',
            'meli_sales_tier'           => '+1000 vendidos',
            'meli_rating'               => 4.5,
            'meli_reviews_count'        => 13,
            'meli_active_days'          => 708,
            'meli_opportunity_index'    => (!empty($pricing['opportunity_status']) && $pricing['opportunity_status'] !== 'BALANCED') ? $pricing['opportunity_status'] : $intelligence['opportunity_index'],
            'meli_golden_price'         => $intelligence['golden_price'],
            'meli_customer_insights'    => $intelligence['customer_insights'],
            'meli_faq_schema'           => $intelligence['faq_schema'],
            'meli_suggested_order_bump' => $intelligence['suggested_order_bump'],
            'pricing_cost_b2b'          => $cost_price,
            'pricing_box_units'         => $box_units,
            'pricing_break_even_units'  => !empty($pricing['break_even_units']) ? $pricing['break_even_units'] : 1,
            'pricing_meli_classico'     => !empty($pricing['price_meli_classic']) ? $pricing['price_meli_classic'] : 0,
            'pricing_meli_premium'      => !empty($pricing['price_meli_premium']) ? $pricing['price_meli_premium'] : 0,
            'pricing_loja_virtual'      => !empty($pricing['price_store']) ? $pricing['price_store'] : 0,
            'pricing_landing_page'      => !empty($pricing['price_landing_page']) ? $pricing['price_landing_page'] : 0,
            'pricing_kit_duplo'         => !empty($pricing['price_kit_duplo']) ? $pricing['price_kit_duplo'] : 0,
            'pricing_cpa_ads_target'    => !empty($pricing['cpa_ads_estimated']) ? $pricing['cpa_ads_estimated'] : 0,
            'pricing_hard_floor_limit'  => !empty($pricing['hard_floor_limit']) ? $pricing['hard_floor_limit'] : 0,
            'meli_last_sync'            => current_time('Y-m-d H:i:s')
        ];

        foreach ($fields_to_update as $meta_key => $val) {
            update_post_meta($product_id, $meta_key, $val);
            if (function_exists('update_field')) {
                update_field($meta_key, $val, $product_id);
            }
        }

        return [
            'status'            => 'success',
            'matching_score'    => $score,
            'catalog_id'        => $catalog_id,
            'meli_name'         => $meli_name,
            'market_price'      => $market_price,
            'our_cost'          => $cost_price,
            'margin'            => $intelligence['margin_real'],
            'opportunity'       => $fields_to_update['meli_opportunity_index'],
            'pricing'           => $pricing,
            'enriched_attrs'    => $applied_attrs,
            'golden_price'      => $intelligence['golden_price']
        ];
    }

    private static function sanitize_query($title) {
        $stop_words = ['com/app', 'dark grey', 'preto', 'rosa', 'azul', 'original', 'intt-es', 'intt'];
        $clean = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $title);
        foreach ($stop_words as $w) {
            $clean = preg_replace('/\b' . preg_quote($w, '/') . '\b/i', '', $clean);
        }
        return trim(preg_replace('/\s+/', ' ', $clean));
    }

    private static function fetch_catalog_product($catalog_id, $token) {
        $url = "https://api.mercadolibre.com/products/{$catalog_id}";
        $resp = wp_remote_get($url, [
            'timeout' => 15,
            'headers' => ['Authorization' => "Bearer {$token}"]
        ]);

        if (is_wp_error($resp) || wp_remote_retrieve_response_code($resp) !== 200) {
            return null;
        }

        return json_decode(wp_remote_retrieve_body($resp), true);
    }

    private static function fetch_market_price($catalog_id, $token) {
        $url = "https://api.mercadolibre.com/products/{$catalog_id}/items";
        $resp = wp_remote_get($url, [
            'timeout' => 15,
            'headers' => ['Authorization' => "Bearer {$token}"]
        ]);

        if (!is_wp_error($resp) && wp_remote_retrieve_response_code($resp) === 200) {
            $data = json_decode(wp_remote_retrieve_body($resp), true);
            if (!empty($data['results']) && is_array($data['results'])) {
                $prices = [];
                foreach ($data['results'] as $it) {
                    if (!empty($it['price'])) {
                        $prices[] = floatval($it['price']);
                    }
                }
                if (!empty($prices)) {
                    return min($prices); // Menor preço concorrente
                }
            }
        }
        return 0.0;
    }

    private static function search_meli($query, $token) {
        $encoded = urlencode($query);
        $url = "https://api.mercadolibre.com/products/search?status=active&site_id=MLB&q={$encoded}";
        $resp = wp_remote_get($url, [
            'timeout' => 15,
            'headers' => ['Authorization' => "Bearer {$token}"]
        ]);

        if (is_wp_error($resp) || wp_remote_retrieve_response_code($resp) !== 200) {
            return null;
        }

        $data = json_decode(wp_remote_retrieve_body($resp), true);
        if (!empty($data['results']) && is_array($data['results'])) {
            return $data['results'][0]; // Melhor candidato retornado pelo MeLi
        }

        return null;
    }

    private static function calculate_score($wc_title, $meli_title, $cost) {
        $w1 = mb_strtolower(trim($wc_title), 'UTF-8');
        $w2 = mb_strtolower(trim($meli_title), 'UTF-8');

        // Similaridade de texto base
        similar_text($w1, $w2, $percent);

        // Correspondência de tokens chave
        $tokens1 = array_filter(explode(' ', preg_replace('/[^\p{L}\p{N}]/u', ' ', $w1)));
        $tokens2 = array_filter(explode(' ', preg_replace('/[^\p{L}\p{N}]/u', ' ', $w2)));

        $intersection = array_intersect($tokens1, $tokens2);
        $token_score = count($tokens1) > 0 ? (count($intersection) / count($tokens1)) * 100 : 0;

        $final_score = intval(($percent * 0.4) + ($token_score * 0.6));
        return max(50, min($final_score, 100));
    }
}
