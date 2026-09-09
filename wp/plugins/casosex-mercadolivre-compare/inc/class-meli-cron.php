<?php
/**
 * Cron Job Diário de Matching e Inteligência Competitiva Mercado Livre
 * ADR-0239
 */

if (!defined('ABSPATH')) {
    exit;
}

class CasoSex_MeLi_Cron {

    const CRON_HOOK = 'casosex_meli_daily_sync_hook';

    public static function init() {
        add_action(self::CRON_HOOK, [__CLASS__, 'run_daily_sync']);
        add_filter('cron_schedules', [__CLASS__, 'add_cron_intervals']);

        // Garante agendamento se não existir
        if (!wp_next_scheduled(self::CRON_HOOK)) {
            wp_schedule_event(time(), 'daily', self::CRON_HOOK);
        }
    }

    public static function add_cron_intervals($schedules) {
        if (!isset($schedules['daily'])) {
            $schedules['daily'] = [
                'interval' => 86400,
                'display'  => 'Uma vez por dia'
            ];
        }
        return $schedules;
    }

    public static function run_daily_sync($limit = 50) {
        // Processa os produtos em lotes ordenados pela data de última sincronização mais antiga
        $args = [
            'post_type'      => 'product',
            'posts_per_page' => $limit,
            'post_status'    => 'publish',
            'meta_key'       => 'meli_last_sync',
            'orderby'        => 'meta_value',
            'order'          => 'ASC',
            'fields'         => 'ids'
        ];

        // Se houver produtos sem meta meli_last_sync, prioriza eles
        $unmatched_args = [
            'post_type'      => 'product',
            'posts_per_page' => $limit,
            'post_status'    => 'publish',
            'meta_query'     => [
                [
                    'key'     => 'meli_last_sync',
                    'compare' => 'NOT EXISTS'
                ]
            ],
            'fields'         => 'ids'
        ];

        $product_ids = get_posts($unmatched_args);
        if (empty($product_ids)) {
            $product_ids = get_posts($args);
        }

        $processed = 0;
        foreach ($product_ids as $pid) {
            CasoSex_MeLi_Matcher::match_product($pid);
            $processed++;
            usleep(200000); // 200ms de pausa para respeitar o rate-limit da API MeLi
        }

        update_option('casosex_meli_cron_last_run', current_time('Y-m-d H:i:s'));
        update_option('casosex_meli_cron_last_processed_count', $processed);

        return $processed;
    }
}
