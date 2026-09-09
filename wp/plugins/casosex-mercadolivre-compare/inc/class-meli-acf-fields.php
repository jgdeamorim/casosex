<?php
/**
 * Registro do Local Field Group ACF / Secure Custom Fields
 * Exposto na REST API para consumo Easy MCP AI
 * ADR-0239
 */

if (!defined('ABSPATH')) {
    exit;
}

class CasoSex_MeLi_ACF_Fields {

    public static function init() {
        add_action('acf/init', [__CLASS__, 'register_fields']);
    }

    public static function register_fields() {
        if (!function_exists('acf_add_local_field_group')) {
            return;
        }

        acf_add_local_field_group([
            'key' => 'group_casosex_meli_intelligence',
            'title' => 'Mercado Livre - Inteligência Competitiva & Matching',
            'fields' => [
                [
                    'key' => 'field_meli_matching_score',
                    'label' => 'Matching Score (%)',
                    'name' => 'meli_matching_score',
                    'type' => 'number',
                    'instructions' => 'Grau de certeza da correspondência no Mercado Livre (0 a 100%).',
                    'min' => 0,
                    'max' => 100,
                ],
                [
                    'key' => 'field_meli_catalog_id',
                    'label' => 'ID do Catálogo MeLi',
                    'name' => 'meli_catalog_id',
                    'type' => 'text',
                    'instructions' => 'Código canônico do produto no catálogo do Mercado Livre (ex: MLB41352084).',
                ],
                [
                    'key' => 'field_meli_market_price',
                    'label' => 'Preço Vencedor de Mercado (R$)',
                    'name' => 'meli_market_price',
                    'type' => 'number',
                    'instructions' => 'Preço praticado no Buy Box do Mercado Livre.',
                    'step' => '0.01',
                ],
                [
                    'key' => 'field_meli_sales_tier',
                    'label' => 'Faixa de Vendas / Tração',
                    'name' => 'meli_sales_tier',
                    'type' => 'text',
                    'instructions' => 'Ex: +1000 vendidos, +500 vendidos.',
                ],
                [
                    'key' => 'field_meli_rating',
                    'label' => 'Avaliação Média (Rating)',
                    'name' => 'meli_rating',
                    'type' => 'number',
                    'instructions' => 'Nota média dada pelos clientes (1.0 a 5.0).',
                    'step' => '0.1',
                    'min' => 1,
                    'max' => 5,
                ],
                [
                    'key' => 'field_meli_reviews_count',
                    'label' => 'Total de Avaliações (Reviews)',
                    'name' => 'meli_reviews_count',
                    'type' => 'number',
                ],
                [
                    'key' => 'field_meli_active_days',
                    'label' => 'Dias Ativo em Catálogo',
                    'name' => 'meli_active_days',
                    'type' => 'number',
                ],
                [
                    'key' => 'field_meli_opportunity_index',
                    'label' => 'Índice de Viabilidade (LP)',
                    'name' => 'meli_opportunity_index',
                    'type' => 'select',
                    'choices' => [
                        'HIGH_MARGIN' => '🟢 Alta Margem (Ideal para Tráfego Direto / LP)',
                        'ORDER_BUMP'  => '🟡 Média Margem (Recomendado para Order Bump / Combo)',
                        'SEO_ONLY'    => '🔴 Margem Comprimida (Venda apenas em Catálogo / Orgânico)'
                    ],
                    'default_value' => 'SEO_ONLY',
                ],
                [
                    'key' => 'field_meli_golden_price',
                    'label' => 'Preço de Ouro Sugerido para LP (R$)',
                    'name' => 'meli_golden_price',
                    'type' => 'number',
                    'step' => '0.01',
                ],
                [
                    'key' => 'field_meli_customer_insights',
                    'label' => 'Dores & Desejos Minerados (Copywriting)',
                    'name' => 'meli_customer_insights',
                    'type' => 'textarea',
                    'rows' => 4,
                ],
                [
                    'key' => 'field_meli_faq_schema',
                    'label' => 'Dúvidas Reais de Compradores (FAQ)',
                    'name' => 'meli_faq_schema',
                    'type' => 'textarea',
                    'rows' => 4,
                ],
                [
                    'key' => 'field_meli_suggested_order_bump',
                    'label' => 'Order Bump Sugerido (Catálogo INTT)',
                    'name' => 'meli_suggested_order_bump',
                    'type' => 'text',
                ],
                [
                    'key' => 'field_pricing_meli_classico',
                    'label' => 'Preço Sugerido MeLi Clássico (R$)',
                    'name' => 'pricing_meli_classico',
                    'type' => 'number',
                    'step' => '0.01',
                ],
                [
                    'key' => 'field_pricing_meli_premium',
                    'label' => 'Preço Sugerido MeLi Premium (10x s/ juros) (R$)',
                    'name' => 'pricing_meli_premium',
                    'type' => 'number',
                    'step' => '0.01',
                ],
                [
                    'key' => 'field_pricing_loja_virtual',
                    'label' => 'Preço Loja Virtual casosex.com.br (R$)',
                    'name' => 'pricing_loja_virtual',
                    'type' => 'number',
                    'step' => '0.01',
                ],
                [
                    'key' => 'field_pricing_landing_page',
                    'label' => 'Preço Landing Page (com CPA Ads) (R$)',
                    'name' => 'pricing_landing_page',
                    'type' => 'number',
                    'step' => '0.01',
                ],
                [
                    'key' => 'field_pricing_break_even_units',
                    'label' => 'Ponto de Equilíbrio (Vendas p/ Pagar Caixa/Lote)',
                    'name' => 'pricing_break_even_units',
                    'type' => 'number',
                ],
                [
                    'key' => 'field_pricing_hard_floor_limit',
                    'label' => 'Trava de Piso Rígido (Anti-Prejuízo R$)',
                    'name' => 'pricing_hard_floor_limit',
                    'type' => 'number',
                    'step' => '0.01',
                ],
                [
                    'key' => 'field_meli_top5_avg_price',
                    'label' => 'Preço Médio dos Top 5 Vendedores (R$)',
                    'name' => 'meli_top5_avg_price',
                    'type' => 'number',
                    'step' => '0.01',
                    'instructions' => 'Média aritmética dos 5 menores concorrentes qualificados da 1ª página.',
                ],
                [
                    'key' => 'field_meli_lowest_competitor',
                    'label' => 'Menor Preço Ativo Top 5 (R$)',
                    'name' => 'meli_lowest_competitor',
                    'type' => 'number',
                    'step' => '0.01',
                    'instructions' => 'Preço do concorrente mais agressivo da 1ª página.',
                ],
                [
                    'key' => 'field_meli_last_sync',
                    'label' => 'Última Sincronização MeLi',
                    'name' => 'meli_last_sync',
                    'type' => 'date_time_picker',
                    'display_format' => 'd/m/Y H:i',
                    'return_format' => 'Y-m-d H:i:s',
                ]
            ],
            'location' => [
                [
                    [
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'product',
                    ]
                ]
            ],
            'menu_order' => 15,
            'position' => 'normal',
            'style' => 'default',
            'show_in_rest' => 1 // Habilita o endpoint REST e o consumo Easy MCP AI
        ]);
    }
}
