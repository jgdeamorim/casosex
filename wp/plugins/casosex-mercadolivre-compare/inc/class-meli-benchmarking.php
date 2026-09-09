<?php
/**
 * Motor de Benchmarking Top 5 Concorrentes Mercado Livre
 * ADR-0240 § 2.5
 */

if (!defined('ABSPATH')) {
    exit;
}

class CasoSex_MeLi_Benchmarking {

    /**
     * Extrai e calcula métricas dos Top 5 concorrentes de um catálogo do MeLi
     */
    public static function get_top5_benchmark($catalog_id, $token, $cost_price = 0.0) {
        if (empty($catalog_id) || empty($token)) {
            return null;
        }

        $transient_key = 'casosex_top5_' . $catalog_id . '_' . round($cost_price);
        $cached = get_transient($transient_key);
        if ($cached !== false) {
            return $cached;
        }

        $url = "https://api.mercadolibre.com/products/{$catalog_id}/items";
        $resp = wp_remote_get($url, [
            'timeout' => 15,
            'headers' => ['Authorization' => "Bearer {$token}"]
        ]);

        if (is_wp_error($resp) || wp_remote_retrieve_response_code($resp) !== 200) {
            return null;
        }

        $body = json_decode(wp_remote_retrieve_body($resp), true);
        $items = $body['results'] ?? [];

        if (empty($items) || !is_array($items)) {
            return null;
        }

        // 1. Filtrar itens com preço válido, purga internacional e piso anti-outlier (ADR-0241 § 8)
        // Piso de sanidade: descarta peças avulsas/acessórios abaixo de 70% do custo de fábrica da INTT
        $min_sanity_price = ($cost_price > 0) ? ($cost_price * 0.70) : 10.0;

        $valid_items = [];
        foreach ($items as $it) {
            $price = floatval($it['price'] ?? 0);
            if ($price <= 0 || $price < $min_sanity_price) {
                continue; // Descarta outliers, cabos USB avulsos ou amostras
            }

            // Purga Internacional (China / Cross-Border)
            $is_international = !empty($it['international_delivery_mode']) || 
                                (!empty($it['tags']) && in_array('international_seller', (array)$it['tags'])) ||
                                (!empty($it['shipping']['tags']) && in_array('cbt', (array)$it['shipping']['tags']));
            if ($is_international) {
                continue; // Descarta concorrente da China com 30 dias de prazo
            }

            $valid_items[] = $it;
        }

        if (empty($valid_items)) {
            return null;
        }

        // 2. Ordenar por menor preço de venda
        usort($valid_items, function($a, $b) {
            return floatval($a['price']) <=> floatval($b['price']);
        });

        // 3. Extrair os Top 5
        $top5_raw = array_slice($valid_items, 0, 5);
        $top5_competitors = [];
        $sum_prices = 0.0;
        $lowest_price = floatval($top5_raw[0]['price']);
        $highest_price = floatval(end($top5_raw)['price']);

        foreach ($top5_raw as $rank => $it) {
            $price = floatval($it['price']);
            $sum_prices += $price;

            $seller_id = $it['seller_id'] ?? null;
            $seller_info = self::fetch_seller_reputation($seller_id, $token);
            $item_id = $it['item_id'] ?? ($it['id'] ?? '');
            $permalink = !empty($it['permalink']) ? $it['permalink'] : ($item_id ? "https://produto.mercadolivre.com.br/{$item_id}" : '');

            $top5_competitors[] = [
                'rank'           => $rank + 1,
                'item_id'        => $item_id,
                'permalink'      => $permalink,
                'price'          => $price,
                'listing_type'   => ($it['listing_type_id'] ?? '') === 'gold_pro' ? 'Premium (10x)' : 'Clássico',
                'is_pro'         => ($it['listing_type_id'] ?? '') === 'gold_pro',
                'free_shipping'  => !empty($it['shipping']['free_shipping']),
                'logistic_type'  => $it['shipping']['logistic_type'] ?? 'Correios/Normal',
                'warranty'       => $it['warranty'] ?? 'Sem garantia informada',
                'seller_id'      => $seller_id,
                'seller_name'    => $seller_info['nickname'] ?? ('Seller #' . $seller_id),
                'seller_sales'   => $seller_info['transactions_total'] ?? 0,
                'seller_level'   => $seller_info['level_id'] ?? 'N/D',
                'is_official'    => !empty($it['official_store_id'])
            ];
        }

        $count = count($top5_raw);
        $avg_price = $count > 0 ? round($sum_prices / $count, 2) : 0.0;
        $catalog_url = !empty($catalog_id) ? "https://www.mercadolivre.com.br/p/{$catalog_id}" : '';

        $benchmark_data = [
            'catalog_id'     => $catalog_id,
            'catalog_url'    => $catalog_url,
            'total_sellers'  => count($valid_items),
            'top5_count'     => $count,
            'lowest_price'   => $lowest_price,
            'highest_price'  => $highest_price,
            'avg_price'      => $avg_price,
            'competitors'    => $top5_competitors,
            'analyzed_at'    => current_time('Y-m-d H:i:s')
        ];

        // Cache transient de 12 horas para equilibrar frescor e performance
        set_transient($transient_key, $benchmark_data, 12 * HOUR_IN_SECONDS);

        return $benchmark_data;
    }

    /**
     * Consulta dados de reputação e volume histórico do vendedor
     */
    private static function fetch_seller_reputation($seller_id, $token) {
        if (empty($seller_id)) {
            return null;
        }

        $transient_key = 'casosex_seller_' . $seller_id;
        $cached = get_transient($transient_key);
        if ($cached !== false) {
            return $cached;
        }

        $url = "https://api.mercadolibre.com/users/{$seller_id}";
        $resp = wp_remote_get($url, [
            'timeout' => 8,
            'headers' => ['Authorization' => "Bearer {$token}"]
        ]);

        if (is_wp_error($resp) || wp_remote_retrieve_response_code($resp) !== 200) {
            return null;
        }

        $user_data = json_decode(wp_remote_retrieve_body($resp), true);
        $reputation = [
            'nickname'           => $user_data['nickname'] ?? '',
            'level_id'           => $user_data['seller_reputation']['level_id'] ?? 'normal',
            'power_seller_status'=> $user_data['seller_reputation']['power_seller_status'] ?? '',
            'transactions_total' => $user_data['seller_reputation']['transactions']['total'] ?? 0
        ];

        // Cache de 7 dias para dados do seller
        set_transient($transient_key, $reputation, 7 * DAY_IN_SECONDS);

        return $reputation;
    }
}
