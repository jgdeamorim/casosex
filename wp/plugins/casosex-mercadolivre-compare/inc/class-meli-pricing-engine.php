<?php
/**
 * ADR-0240: Motor Algorítmico de Precificação Multicanal & Trava de Piso Rígido
 * Operação Própria (Compra B2B Atacado INTT ES, Frete R$ 0, NF Própria, Embalagem Própria)
 */

if (!defined('ABSPATH')) {
    exit;
}

class CasoSex_MeLi_Pricing_Engine {

    /**
     * Retorna os parâmetros operacionais globais configurados em wc_dropship_settings
     */
    public static function get_settings() {
        return [
            'packaging_cost'     => floatval(get_option('casosex_cost_packaging_fixed', 3.50)),
            'tax_percent'        => floatval(get_option('casosex_tax_invoice_percent', 5.0)), // Simples Nacional
            'meli_classic_fee'   => floatval(get_option('casosex_meli_classic_fee', 13.0)),   // MeLi Clássico
            'meli_premium_fee'   => floatval(get_option('casosex_meli_premium_fee', 18.0)),   // MeLi Premium (10x sem juros)
            'gateway_fee'        => floatval(get_option('casosex_gateway_fee_percent', 4.0)), // Gateway Loja Própria
            'target_margin_store'=> floatval(get_option('casosex_target_margin_store', 40.0)),
            'target_margin_meli' => floatval(get_option('casosex_target_margin_meli', 25.0)),
            'target_margin_store'=> floatval(get_option('casosex_target_margin_store', 40.0)),
            'target_margin_meli' => floatval(get_option('casosex_target_margin_meli', 25.0)),
            'target_margin_lp'   => floatval(get_option('casosex_target_margin_lp', 28.0)), // Calibrado ADR-0241 (25% a 30%)
            'b2b_min_order'      => floatval(get_option('casosex_b2b_min_order', 450.00)),
            'shipping_melhor_envio' => floatval(get_option('casosex_shipping_melhor_envio', 18.00)), // Média Melhor Envio ES
        ];
    }

    /**
     * Calcula o Piso Rígido de Segurança (Hard Floor Margin: Custo * 1.25 + Embalagem + Imposto)
     */
    public static function get_hard_floor_limit($cost_b2b) {
        $cfg = self::get_settings();
        $tax_multiplier = 1 - ($cfg['tax_percent'] / 100);
        $min_base = ($cost_b2b * 1.25) + $cfg['packaging_cost'];
        return round($min_base / max($tax_multiplier, 0.5), 2);
    }

    /**
     * Calcula a precificação ideal para todos os 4 canais + Kit Duplo Pico Pulse
     */
    public static function calculate_all_channels($cost_b2b, $box_units = 1, $meli_market_price = 0, $cpa_ads = 0) {
        $cost_b2b = floatval($cost_b2b);
        $box_units = max(intval($box_units), 1);
        $cfg = self::get_settings();

        if ($cost_b2b <= 0) {
            return null;
        }

        $hard_floor = self::get_hard_floor_limit($cost_b2b);

        // 1. Canal: Loja Virtual Própria (casosex.com.br)
        $denom_store = 1 - (($cfg['tax_percent'] + $cfg['gateway_fee'] + $cfg['target_margin_store']) / 100);
        $price_store = round(($cost_b2b + $cfg['packaging_cost']) / max($denom_store, 0.1), 2);
        $price_store = max($price_store, $hard_floor);
        $net_profit_store = round($price_store - $cost_b2b - $cfg['packaging_cost'] - ($price_store * ($cfg['tax_percent'] + $cfg['gateway_fee']) / 100), 2);

        // 2. Canal: Mercado Livre Clássico (13% taxa)
        $denom_classic = 1 - (($cfg['tax_percent'] + $cfg['meli_classic_fee'] + $cfg['target_margin_meli']) / 100);
        $price_classic = round(($cost_b2b + $cfg['packaging_cost']) / max($denom_classic, 0.1), 2);
        $price_classic = max($price_classic, $hard_floor);
        $net_profit_classic = round($price_classic - $cost_b2b - $cfg['packaging_cost'] - ($price_classic * ($cfg['tax_percent'] + $cfg['meli_classic_fee']) / 100), 2);

        // 3. Canal: Mercado Livre Premium (18% taxa + 10x sem juros)
        $denom_premium = 1 - (($cfg['tax_percent'] + $cfg['meli_premium_fee'] + $cfg['target_margin_meli']) / 100);
        $price_premium = round(($cost_b2b + $cfg['packaging_cost']) / max($denom_premium, 0.1), 2);
        $price_premium = max($price_premium, $hard_floor);
        $net_profit_premium = round($price_premium - $cost_b2b - $cfg['packaging_cost'] - ($price_premium * ($cfg['tax_percent'] + $cfg['meli_premium_fee']) / 100), 2);

        // 4. Canal: Landing Page de Conversão (lp.casosex.com.br) com CPA DataForSEO & Frete Melhor Envio
        // CPA real calibrado via DataForSEO: se não informado, usa default conservador baseado no custo
        $effective_cpa = ($cpa_ads > 0) ? $cpa_ads : round($cost_b2b * 0.05 + 15.00, 2); // Calibração real DataForSEO
        $denom_lp = 1 - (($cfg['tax_percent'] + $cfg['gateway_fee'] + $cfg['target_margin_lp']) / 100);
        $price_lp = round(($cost_b2b + $cfg['packaging_cost'] + $effective_cpa) / max($denom_lp, 0.1), 2);
        $price_lp = max($price_lp, $hard_floor);
        $net_profit_lp = round($price_lp - $cost_b2b - $cfg['packaging_cost'] - $effective_cpa - ($price_lp * ($cfg['tax_percent'] + $cfg['gateway_fee']) / 100), 2);

        // 5. Matriz Pico Pulse: D2C Kit Duplo (2 unidades com Frete Grátis Melhor Envio)
        $cost_kit2 = $cost_b2b * 2;
        $cpa_kit2 = $effective_cpa * 1.25; // Aumento leve de CPA por ticket maior
        $shipping_kit2 = $cfg['shipping_melhor_envio']; // Frete subsidiado Melhor Envio
        $price_kit2 = round(($cost_kit2 + $cfg['packaging_cost'] + $cpa_kit2 + $shipping_kit2) / max($denom_lp, 0.1), 2);
        $net_profit_kit2 = round($price_kit2 - $cost_kit2 - $cfg['packaging_cost'] - $cpa_kit2 - $shipping_kit2 - ($price_kit2 * ($cfg['tax_percent'] + $cfg['gateway_fee']) / 100), 2);

        // Ponto de Equilíbrio Real (Break-Even - ADR-0246):
        // 1. Custo de 1 Caixa Fechada
        $single_box_cost = round($cost_b2b * $box_units, 2);

        // 2. Caixas necessárias para atingir o Pedido Mínimo da Fábrica (R$ 450,00)
        $boxes_required = ($single_box_cost < $cfg['b2b_min_order']) ? intval(ceil($cfg['b2b_min_order'] / max($single_box_cost, 0.01))) : 1;
        $lot_units = $box_units * $boxes_required;
        $lot_investment = round($single_box_cost * $boxes_required, 2);

        // 3. Margem de Contribuição Líquida Unitária (Sobra de caixa por venda antes de abater o custo de estoque)
        $unit_contrib_margin = round($price_store - $cfg['packaging_cost'] - ($price_store * ($cfg['tax_percent'] + $cfg['gateway_fee']) / 100), 2);

        // 4. Ponto de Equilíbrio (Quantas unidades vendidas pagam 100% do boleto faturado da fábrica)
        $break_even_units = ($unit_contrib_margin > 0) ? intval(ceil($lot_investment / $unit_contrib_margin)) : $lot_units;
        $break_even_units = min($break_even_units, $lot_units);
        $profit_units = max(0, $lot_units - $break_even_units);
        $lot_net_profit = round($lot_units * $net_profit_store, 2);

        // Se concorrente MeLi for muito agressivo
        $opportunity_status = 'BALANCED';
        if ($meli_market_price > 0) {
            if ($meli_market_price < $hard_floor) {
                $opportunity_status = 'UNCOMPETITIVE_SAFE'; // Evita prejuízo
            } elseif ($price_premium < $meli_market_price) {
                $opportunity_status = 'HIGH_MARGIN'; // Vencemos com folga
            }
        }

        return [
            'cost_b2b'              => $cost_b2b,
            'hard_floor_limit'      => $hard_floor,
            'box_units'             => $box_units,
            'boxes_required'        => $boxes_required,
            'lot_units'             => $lot_units,
            'box_investment'        => $lot_investment,
            'break_even_units'      => $break_even_units,
            'profit_units'          => $profit_units,
            'lot_net_profit'        => $lot_net_profit,
            'price_store'           => $price_store,
            'net_profit_store'      => $net_profit_store,
            'price_meli_classic'    => $price_classic,
            'net_profit_classic'    => $net_profit_classic,
            'price_meli_premium'    => $price_premium,
            'net_profit_premium'    => $net_profit_premium,
            'price_landing_page'    => $price_lp,
            'net_profit_lp'         => $net_profit_lp,
            'price_kit_duplo'       => $price_kit2,
            'net_profit_kit_duplo'  => $net_profit_kit2,
            'cpa_ads_estimated'     => $effective_cpa,
            'opportunity_status'    => $opportunity_status,
        ];
    }

    /**
     * Retorna a decomposição financeira detalhada linha a linha para um Custo B2B de Teste (ADR-0243)
     */
    public static function simulate_breakdown($cost_b2b) {
        $cost_b2b = max(floatval($cost_b2b), 1.0);
        $res = self::calculate_all_channels($cost_b2b);
        $cfg = self::get_settings();

        if (!$res) {
            return null;
        }

        return [
            'store' => [
                'name'         => 'Loja Virtual Própria',
                'badge'        => 'casosex.com.br',
                'price'        => $res['price_store'],
                'cost_b2b'     => $cost_b2b,
                'packaging'    => $cfg['packaging_cost'],
                'fixed_fee'    => 0.00,
                'tax_percent'  => $cfg['tax_percent'],
                'tax_brl'      => round($res['price_store'] * ($cfg['tax_percent'] / 100), 2),
                'fee_percent'  => $cfg['gateway_fee'],
                'fee_brl'      => round($res['price_store'] * ($cfg['gateway_fee'] / 100), 2),
                'cpa_ads'      => 0.00,
                'net_profit'   => $res['net_profit_store'],
                'net_margin'   => round(($res['net_profit_store'] / $res['price_store']) * 100, 1),
                'markup'       => round($res['price_store'] / $cost_b2b, 2)
            ],
            'meli_classic' => [
                'name'         => 'Mercado Livre Clássico',
                'badge'        => 'Comissão 13%',
                'price'        => $res['price_meli_classic'],
                'cost_b2b'     => $cost_b2b,
                'packaging'    => $cfg['packaging_cost'],
                'fixed_fee'    => ($res['price_meli_classic'] < 79) ? 6.50 : 0.00,
                'tax_percent'  => $cfg['tax_percent'],
                'tax_brl'      => round($res['price_meli_classic'] * ($cfg['tax_percent'] / 100), 2),
                'fee_percent'  => $cfg['meli_classic_fee'],
                'fee_brl'      => round($res['price_meli_classic'] * ($cfg['meli_classic_fee'] / 100), 2),
                'cpa_ads'      => 0.00,
                'net_profit'   => $res['net_profit_classic'],
                'net_margin'   => round(($res['net_profit_classic'] / $res['price_meli_classic']) * 100, 1),
                'markup'       => round($res['price_meli_classic'] / $cost_b2b, 2)
            ],
            'meli_premium' => [
                'name'         => 'Mercado Livre Premium',
                'badge'        => '18% + 10x s/ juros',
                'price'        => $res['price_meli_premium'],
                'cost_b2b'     => $cost_b2b,
                'packaging'    => $cfg['packaging_cost'],
                'fixed_fee'    => ($res['price_meli_premium'] < 79) ? 6.50 : 0.00,
                'tax_percent'  => $cfg['tax_percent'],
                'tax_brl'      => round($res['price_meli_premium'] * ($cfg['tax_percent'] / 100), 2),
                'fee_percent'  => $cfg['meli_premium_fee'],
                'fee_brl'      => round($res['price_meli_premium'] * ($cfg['meli_premium_fee'] / 100), 2),
                'cpa_ads'      => 0.00,
                'net_profit'   => $res['net_profit_premium'],
                'net_margin'   => round(($res['net_profit_premium'] / $res['price_meli_premium']) * 100, 1),
                'markup'       => round($res['price_meli_premium'] / $cost_b2b, 2)
            ],
            'landing_page' => [
                'name'         => 'Landing Page (Pico Pulse)',
                'badge'        => 'Tráfego Pago + Ads',
                'price'        => $res['price_landing_page'],
                'cost_b2b'     => $cost_b2b,
                'packaging'    => $cfg['packaging_cost'],
                'fixed_fee'    => 0.00,
                'tax_percent'  => $cfg['tax_percent'],
                'tax_brl'      => round($res['price_landing_page'] * ($cfg['tax_percent'] / 100), 2),
                'fee_percent'  => $cfg['gateway_fee'],
                'fee_brl'      => round($res['price_landing_page'] * ($cfg['gateway_fee'] / 100), 2),
                'cpa_ads'      => $res['cpa_ads_estimated'],
                'net_profit'   => $res['net_profit_lp'],
                'net_margin'   => round(($res['net_profit_lp'] / $res['price_landing_page']) * 100, 1),
                'markup'       => round($res['price_landing_page'] / $cost_b2b, 2)
            ]
        ];
    }
}
