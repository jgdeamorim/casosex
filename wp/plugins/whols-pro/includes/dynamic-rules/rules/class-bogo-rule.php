<?php
namespace Whols_Pro\Dynamic_Rules\Rules;

use Whols_Pro\Dynamic_Rules\Conditions\Conditions;

class Bogo_Rule extends Abstract_Rule {
    
    public function __construct($rule_data) {
        parent::__construct($rule_data);

        add_action('woocommerce_cart_loaded_from_session', [$this, 'conditionally_add_free_product']);
        add_action('woocommerce_before_calculate_totals', [$this, 'set_free_product_price']);
        add_action('woocommerce_after_cart_item_name', [$this, 'display_free_badge'], 10, 2);
        add_filter('woocommerce_cart_item_quantity', [$this, 'disable_cart_item_quantity_for_get_product'], 10, 3);
    }

    public function conditionally_add_free_product($cart) {
        if (!$this->rule_apply_primary_check()) {
            return;
        }

        // Get all BOGO rules
        $all_rules = whols_get_option('dynamic_rules', []);
        
        foreach ($all_rules as $rule) {
            // Skip if not BOGO rule or not enabled
            if (empty($rule['status']) || $rule['action'] !== 'apply_bogo_discount') {
                continue;
            }

            $gift_product_id = $rule['discounted_items'];
            if (!$gift_product_id) {
                continue;
            }

            // Check if rule conditions are met using the Conditions class
            $conditions = new Conditions($rule);
            $rule_qualifies = $conditions->are_satisfied();

            $has_gift_product = $this->find_gift_product_in_cart($cart, $gift_product_id);

            if ($rule_qualifies) {
                // Rule qualifies, add gift product if not already in cart
                if (!$has_gift_product) {
                    $whols_bogo_metadata = [
                        'whols_bogo' => [
                            'discount_type' => $rule['amount_type'] ?? 'percentage',
                            'discount_amount' => $rule['discount_or_fee_value'] ?: '50',
                        ]
                    ];

                    $cart->add_to_cart($gift_product_id, 1, 0, [], $whols_bogo_metadata);
                } else {
                    // Update existing gift product metadata if changed
                    $this->update_gift_product_metadata($cart, $has_gift_product, $rule);
                }
                
                // Only apply first qualifying BOGO rule
                break;
            } else {
                // Rule doesn't qualify, remove gift product if it exists
                if ($has_gift_product) {
                    $cart->remove_cart_item($has_gift_product);
                }
            }
        }
    }

    public function set_free_product_price($cart) {
        if (!$this->rule_apply_primary_check()) {
            return;
        }

        foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
            if (!isset($cart_item['whols_bogo'])) {
                continue;
            }

            $product = isset( $cart_item['data'] ) ? $cart_item['data'] : null;

            // Skip if product is not valid
            if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
                continue;
            }

            $discount_type = $cart_item['whols_bogo']['discount_type'] ?? 'percentage';
            $discount_amount = abs((float)($cart_item['whols_bogo']['discount_amount'] ?? 50));
            $original_price = $product->get_price();

            if ($discount_type === 'percentage') {
                $new_price = $original_price * (1 - $discount_amount / 100);
            } else {
                // Fixed discount
                $new_price = max(0, $original_price - $discount_amount);
            }

            $product->set_price($new_price);
        }
    }

    public function display_free_badge($cart_item, $cart_item_key) {
        $product = isset( $cart_item['data'] ) ? $cart_item['data'] : null;

        if ( isset($cart_item['whols_bogo']) && $product && is_a( $product, 'WC_Product' ) && $product->get_price() == 0 ) {
            echo '<div class="whols-discount-badge">' . __('Free', 'whols') . '</div>';
        }
    }

    public function disable_cart_item_quantity_for_get_product($product_quantity, $cart_item_key, $cart_item) {
        if (is_cart() && isset($cart_item['whols_bogo'])) {
            $product_quantity = sprintf(
                '<strong>%s</strong><input type="hidden" name="cart[%s][qty]" value="%s" />',
                $cart_item['quantity'],
                $cart_item_key,
                $cart_item['quantity']
            );
        }

        return $product_quantity;
    }

    public function rule_apply_primary_check() {
        if (is_admin()) {
            return false;
        }

        if (!WC()->cart || WC()->cart->is_empty()) {
            return false;
        }

        // Check for wallet product
        foreach (WC()->cart->get_cart() as $cart_item) {
            $product_id = $cart_item['product_id'];
            if ($product_id == get_option('whols_wallet_product_id')) {
                return false;
            }
        }

        return true;
    }

    private function find_gift_product_in_cart($cart, $gift_product_id) {
        foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
            if ($cart_item['product_id'] == $gift_product_id && isset($cart_item['whols_bogo'])) {
                return $cart_item_key;
            }
        }
        return false;
    }

    private function update_gift_product_metadata($cart, $gift_product_key, $rule) {
        $current_metadata = $cart->cart_contents[$gift_product_key]['whols_bogo'] ?? [];
        $new_metadata = [
            'discount_type' => $rule['amount_type'] ?? 'percentage',
            'discount_amount' => $rule['discount_or_fee_value'] ?: '50',
        ];

        // Update if metadata has changed
        if ($current_metadata !== $new_metadata) {
            $cart->cart_contents[$gift_product_key]['whols_bogo'] = $new_metadata;
            $cart->set_session();
        }
    }
}