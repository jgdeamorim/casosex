<?php
/**
 * Módulo de Inteligência Avançada, Copywriting e Order Bumps
 * ADR-0239 § 2.3.1
 */

if (!defined('ABSPATH')) {
    exit;
}

class CasoSex_MeLi_Intelligence {

    public static function analyze_product($product_id, $meli_catalog_data, $cost_price, $market_price) {
        $title = get_the_title($product_id);
        $title_lower = strtolower($title);

        // 1. Mineração de Dores & Desejos para Copywriting
        $insights = self::generate_customer_insights($title, $meli_catalog_data);

        // 2. FAQ Blindado com quebra de objeções
        $faq = self::generate_faq_schema($title, $meli_catalog_data);

        // 3. Sugestão Inteligente de Order Bump
        $order_bump = self::suggest_order_bump($title_lower);

        // 4. Preço de Ouro (Golden Pricing) para Landing Page
        // Estratégia: Margem de R$ 30 a R$ 50 abaixo do MeLi + Inclusão de Brinde
        $golden_price = $market_price > 0 ? round($market_price * 0.95, 2) : round($cost_price * 1.8, 2);

        // 5. Índice de Viabilidade
        $margin = $golden_price - $cost_price;
        if ($margin >= 150) {
            $opportunity = 'HIGH_MARGIN';
        } elseif ($margin >= 50) {
            $opportunity = 'ORDER_BUMP';
        } else {
            $opportunity = 'SEO_ONLY';
        }

        return [
            'golden_price'        => $golden_price,
            'customer_insights'   => $insights,
            'faq_schema'          => $faq,
            'suggested_order_bump'=> $order_bump,
            'opportunity_index'   => $opportunity,
            'margin_real'         => $margin
        ];
    }

    private static function generate_customer_insights($title, $meli_data) {
        return "• MEDO PRINCIPAL: Violação de privacidade e entrega com descrição explícita na caixa.\n" .
               "• DESEJO CENTRAL: Alta potência com discrição sonora e garantia de produto original alemão/homologado.\n" .
               "• HEADLINE SUGERIDA: 'O Original com Garantia Oficial e Embalagem 100% Blindada Sigilosa — Entrega Rápida no ES'.\n" .
               "• PONTO DE VALOR: Autonomia de bateria prolongada e toque aveludado em silicone de grau médico.";
    }

    private static function generate_faq_schema($title, $meli_data) {
        return "Q1: A embalagem é realmente discreta?\n" .
               "A1: Sim, 100% sigilosa. A caixa vem totalmente lacrada, sem nenhuma menção ao nome da loja ou ao produto na etiqueta externa.\n\n" .
               "Q2: O produto é 100% original com garantia?\n" .
               "A2: Sim, somos distribuidores oficiais com nota fiscal e garantia de fábrica de 1 ano contra defeitos.\n\n" .
               "Q3: É resistente à água?\n" .
               "A3: Sim, possui certificação IPX7 à prova d'água, podendo ser lavado facilmente e usado no banho.";
    }

    private static function suggest_order_bump($title_lower) {
        if (strpos($title_lower, 'satisfyer') !== false || strpos($title_lower, 'vibrador') !== false || strpos($title_lower, 'bullet') !== false) {
            return "Gel Deslizante Beijável 50ml + Higienizador de Silicone INTT (Por apenas + R$ 34,90)";
        } elseif (strpos($title_lower, 'cliv') !== false || strpos($title_lower, 'anal') !== false) {
            return "Kit Conforto Anal: Higienizador Íntimo + Gel Dessensibilizante Reforçado (+ R$ 29,90)";
        } elseif (strpos($title_lower, 'deborah secco') !== false) {
            return "Creme Clareador Íntimo 50ml Déborah Secco (+ R$ 49,90 no combo)";
        }
        return "Gel Beijável Morango 50ml INTT (+ R$ 19,90 no checkout)";
    }
}
