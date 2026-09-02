<?php
namespace Whols_Pro\Dynamic_Rules\Conditions\Cart;

use Whols_Pro\Dynamic_Rules\Conditions\Abstract_Condition;

class Cart_Total_Condition extends Abstract_Condition {
    /**
     * Check if cart total condition is satisfied
     *
     * @return bool True if cart total meets criteria
     */
    public function is_satisfied() {
        $condition_operator = $this->settings['condition_operator'] ?? 'at_least';
        $condition_value    = $this->settings['condition_value'] ?? 0;

        // Safety check for WooCommerce cart
        if ( ! WC()->cart ) {
            return true;
        }

        $cart_subtotal = WC()->cart->get_subtotal();

        if ( $condition_operator == 'at_least' ) {
            return $cart_subtotal >= $condition_value;
        }

        if ( $condition_operator == 'less_than' ) {
            return $cart_subtotal < $condition_value;
        }

        if ( $condition_operator == 'equal' ) {
            return $cart_subtotal == $condition_value;
        }

        return false;
    }
    
    public function get_debug_name() {
        return 'Cart Subtotal';
    }
    
    public function get_debug_details() {
        $condition_operator = $this->settings['condition_operator'] ?? 'at_least';
        $condition_value    = $this->settings['condition_value'] ?? 0;
        $cart_subtotal = WC()->cart ? WC()->cart->get_subtotal() : 0;

        return [
            'operator' => $condition_operator,
            'value' => $condition_value,
            'current' => $cart_subtotal
        ];
    }
}