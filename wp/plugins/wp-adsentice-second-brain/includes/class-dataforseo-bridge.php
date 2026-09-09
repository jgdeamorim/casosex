<?php
/**
 * ADR-0240: Ponte com DataForSEO via Easy MCP AI
 * Consome o saldo de $13.52 USD já autenticado no Easy MCP AI e armazena com TTL de 30 dias.
 */

if (!defined('ABSPATH')) {
    exit;
}

class Adsentice_DataForSEO_Bridge {

    /**
     * Busca volume de busca e CPC estimado no Google Ads Brasil
     */
    public static function get_keyword_metrics($keyword) {
        $keyword = trim($keyword);
        if (empty($keyword)) {
            return null;
        }

        $transient_key = 'adsentice_dfs_' . md5(mb_strtolower($keyword));
        $cached = get_transient($transient_key);
        if ($cached !== false) {
            return $cached;
        }

        // Verifica se o client do Easy MCP AI existe
        if (!class_exists('Easy_MCP_AI\DFS\DataforSEO_Client')) {
            return null;
        }

        try {
            $client = new \Easy_MCP_AI\DFS\DataforSEO_Client();
            $payload = [
                [
                    'keywords'      => [$keyword],
                    'location_name' => 'Brazil',
                    'language_name' => 'Portuguese'
                ]
            ];

            $response = $client->post('/v3/keywords_data/google_ads/search_volume/live', $payload);

            if (!empty($response['tasks'][0]['result'][0])) {
                $item = $response['tasks'][0]['result'][0];
                $data = [
                    'keyword'        => $keyword,
                    'search_volume'  => isset($item['search_volume']) ? intval($item['search_volume']) : 0,
                    'cpc'            => isset($item['cpc']) ? floatval($item['cpc']) : 0.0,
                    'competition'    => isset($item['competition']) ? floatval($item['competition']) : 0.0,
                    'fetched_at'     => current_time('Y-m-d H:i:s')
                ];

                // Cache de 30 dias para economizar o saldo de $13.52
                set_transient($transient_key, $data, 30 * DAY_IN_SECONDS);
                return $data;
            }
        } catch (\Exception $e) {
            error_log('DataForSEO Bridge Error: ' . $e->getMessage());
        }

        return null;
    }
}
