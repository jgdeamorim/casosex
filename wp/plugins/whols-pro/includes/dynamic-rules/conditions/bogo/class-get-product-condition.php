<?php
namespace Whols_Pro\Dynamic_Rules\Conditions\Bogo;

use Whols_Pro\Dynamic_Rules\Conditions\Abstract_Condition;

class Get_Product_Condition extends Abstract_Condition {
    /**
     * Check if get product condition is satisfied
     *
     * @return bool True if get product is available and valid
     */
    public function is_satisfied() {
        $gift_product_id = $this->rule_data['discounted_items'] ?? null;
        
        // Validate gift product ID
        if (empty($gift_product_id) || !is_numeric($gift_product_id)) {
            return false;
        }

        $gift_product_id = (int)$gift_product_id;

        // Check if gift product exists and is purchasable
        $gift_product = wc_get_product($gift_product_id);
        if (!$gift_product || !$gift_product->is_purchasable()) {
            return false;
        }

        // Check if gift product is in stock
        if (!$gift_product->is_in_stock()) {
            return false;
        }

        // Check if gift product is not the same as buy products (prevent self-referencing BOGO)
        if (!$this->is_gift_product_different_from_buy_products($gift_product_id)) {
            return false;
        }

        // Validate discount settings
        return $this->validate_discount_settings();
    }

    /**
     * Validate that gift product is not the same as buy products
     */
    private function is_gift_product_different_from_buy_products($gift_product_id) {
        $target_item_based_on = $this->rule_data['bogo_based_on'] ?? '';
        $buy_products = $this->rule_data['bogo_products_to_buy'] ?? [];

        // If specific products are required for buy, ensure gift product is not in that list
        if ($target_item_based_on === 'specific_products' && !empty($buy_products)) {
            if (in_array($gift_product_id, $buy_products)) {
                return false; // Gift product cannot be the same as buy product
            }
        }

        return true;
    }

    /**
     * Check if discount amount and type are valid
     *
     * @return bool True if discount settings are valid, false otherwise
     */
    private function validate_discount_settings() {
        $discount_type = $this->rule_data['amount_type'] ?? 'percentage';
        $discount_value = $this->rule_data['discount_or_fee_value'] ?? '';

        // Discount value must be provided
        if (empty($discount_value) || !is_numeric($discount_value)) {
            return false;
        }

        $discount_amount = (float)$discount_value;

        // Validate percentage discount (0-100%)
        if ($discount_type === 'percentage') {
            return $discount_amount > 0 && $discount_amount <= 100;
        }

        // Validate fixed discount (must be positive)
        if ($discount_type === 'fixed') {
            return $discount_amount >= 0;
        }

        return false;
    }

    /**
     * Check if gift product already exists in cart with BOGO metadata
     */
    public function gift_product_exists_in_cart() {
        if (!WC()->cart) {
            return false;
        }

        $gift_product_id = $this->rule_data['discounted_items'] ?? '';
        
        foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
            if ($cart_item['product_id'] == $gift_product_id && isset($cart_item['whols_bogo'])) {
                return $cart_item_key;
            }
        }

        return false;
    }

    /**
     * Get expected gift product metadata
     */
    public function get_expected_gift_metadata() {
        return [
            'discount_type' => $this->rule_data['amount_type'] ?? 'percentage',
            'discount_amount' => $this->rule_data['discount_or_fee_value'] ?? '50',
        ];
    }

    public function get_debug_name() {
        return 'BOGO Get Product';
    }
    
    public function get_debug_details() {
        $gift_product_id = $this->rule_data['discounted_items'] ?? '';
        $discount_type = $this->rule_data['amount_type'] ?? 'percentage';
        $discount_value = $this->rule_data['discount_or_fee_value'] ?? '';
        
        $gift_product = null;
        $product_status = [];
        
        if ($gift_product_id) {
            $gift_product = wc_get_product($gift_product_id);
            if ($gift_product) {
                $product_status = [
                    'exists' => true,
                    'purchasable' => $gift_product->is_purchasable(),
                    'in_stock' => $gift_product->is_in_stock(),
                    'name' => $gift_product->get_name()
                ];
            } else {
                $product_status = ['exists' => false];
            }
        }

        return [
            'gift_product_id' => $gift_product_id,
            'discount_type' => $discount_type,
            'discount_value' => $discount_value,
            'product_status' => implode(', ', array_keys($product_status)) . ' | ' . implode(', ', $product_status),
            'gift_in_cart' => $this->gift_product_exists_in_cart(),
            'expected_metadata' => implode(', ', $this->get_expected_gift_metadata())
        ];
    }
}