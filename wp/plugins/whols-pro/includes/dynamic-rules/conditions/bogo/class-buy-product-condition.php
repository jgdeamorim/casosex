<?php
namespace Whols_Pro\Dynamic_Rules\Conditions\Bogo;

use Whols_Pro\Dynamic_Rules\Conditions\Abstract_Condition;

class Buy_Product_Condition extends Abstract_Condition {
    /**
     * Check if buy product condition is satisfied
     *
     * @return bool True if buy product conditions are met
     */
    public function is_satisfied() {
        if (!WC()->cart || WC()->cart->is_empty()) {
            return false;
        }

        $target_item_based_on = $this->rule_data['bogo_based_on'] ?? '';
        $defined_products = $this->rule_data['bogo_products_to_buy'] ?? [];
        $min_quantity_to_buy = (int)($this->rule_data['buy_items_quantity'] ?? 1);
        $bogo_operator = $this->rule_data['bogo_operator'] ?? 'matches_any_of';

        // Any product in cart (no specific product requirement)
        if (empty($target_item_based_on)) {
            return $this->check_any_product_quantity($min_quantity_to_buy);
        }

        // Specific products requirement
        if ($target_item_based_on === 'specific_products') {
            return $this->check_specific_products($defined_products, $min_quantity_to_buy, $bogo_operator);
        }

        return false;
    }

    /**
     * Check if any product in cart meets minimum quantity
     */
    private function check_any_product_quantity($min_quantity) {
        foreach (WC()->cart->get_cart() as $cart_item) {
            // Skip BOGO products (don't count toward buy requirement)
            if (isset($cart_item['whols_bogo'])) {
                continue;
            }

            if ($cart_item['quantity'] >= $min_quantity) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if specific products meet requirements
     */
    private function check_specific_products($defined_products, $min_quantity, $operator) {
        if (empty($defined_products)) {
            return true;
        }

        $cart_products = [];
        $product_quantities = [];

        // Collect cart products and quantities (excluding BOGO items)
        foreach (WC()->cart->get_cart() as $cart_item) {
            if (isset($cart_item['whols_bogo'])) {
                continue;
            }

            $product_id = $cart_item['product_id'];
            $cart_products[] = $product_id;
            
            if (!isset($product_quantities[$product_id])) {
                $product_quantities[$product_id] = 0;
            }
            $product_quantities[$product_id] += $cart_item['quantity'];
        }

        $matched_products = array_intersect($cart_products, $defined_products);

        switch ($operator) {
            case 'matches_any_of':
                // At least one defined product with sufficient quantity
                foreach ($matched_products as $product_id) {
                    if ($product_quantities[$product_id] >= $min_quantity) {
                        return true;
                    }
                }
                return false;

            case 'matches_all_of':
                // All defined products must be in cart with sufficient quantity
                foreach ($defined_products as $product_id) {
                    if (!in_array($product_id, $cart_products) || 
                        $product_quantities[$product_id] < $min_quantity) {
                        return false;
                    }
                }
                return true;

            case 'matches_none_of':
                // None of the defined products should be in cart
                return empty($matched_products);

            default:
                return false;
        }
    }

    public function get_debug_name() {
        return 'BOGO Buy Product';
    }
    
    public function get_debug_details() {
        $target_item_based_on = $this->rule_data['bogo_based_on'] ?? '';
        $defined_products = $this->rule_data['bogo_products_to_buy'] ?? [];
        $min_quantity = (int)($this->rule_data['buy_items_quantity'] ?? 1);
        $operator = $this->rule_data['bogo_operator'] ?? 'matches_any_of';

        $cart_products = [];
        $product_quantities = [];

        if (WC()->cart) {
            foreach (WC()->cart->get_cart() as $cart_item) {
                if (!isset($cart_item['whols_bogo'])) {
                    $product_id = $cart_item['product_id'];
                    $cart_products[] = $product_id;
                    
                    if (!isset($product_quantities[$product_id])) {
                        $product_quantities[$product_id] = 0;
                    }
                    $product_quantities[$product_id] += $cart_item['quantity'];
                }
            }
        }

        return [
            'target_based_on' => $target_item_based_on,
            'required_products' => implode(', ', $defined_products),
            'min_quantity' => $min_quantity,
            'operator' => $operator,
            'cart_products' => implode(', ', array_unique($cart_products)),
            'product_quantities' => implode(', ', $product_quantities)
        ];
    }
}