<?php
namespace Whols_Pro\Dynamic_Rules\Conditions\Cart;

use Whols_Pro\Dynamic_Rules\Conditions\Abstract_Condition;

class Cart_Total_Quantity_Condition extends Abstract_Condition {
    /**
     * Check if cart total quantity condition is satisfied
     *
     * @return bool True if cart total quantity meets criteria
     */
    public function is_satisfied() {
        $condition_operator = isset( $this->settings['condition_operator'] ) ? $this->settings['condition_operator'] : 'at_least';
        $condition_value    = isset( $this->settings['condition_value'] ) ? $this->settings['condition_value'] : 0;

        // Safety check for WooCommerce cart
        if ( ! WC()->cart ) {
            return true;
        }

        $cart_total_quantity = WC()->cart->get_cart_contents_count();

        if ( $condition_operator == 'at_least' ) {
            if ( ! ( $cart_total_quantity >= $condition_value ) ) {
                return false;
            }
        }

        if ( $condition_operator == 'less_than' ) {
            if ( ! ( $cart_total_quantity < $condition_value ) ) {
                return false;
            }
        }

        if ( $condition_operator == 'equal' ) {
            if ( ! ( $cart_total_quantity == $condition_value ) ) {
                return false;
            }
        }

        return true;
    }

    public function get_debug_name() {
        return 'Cart Total Quantity';
    }
    
    public function get_debug_details() {
        $condition_operator = $this->settings['condition_operator'] ?? 'at_least';
        $condition_value    = $this->settings['condition_value'] ?? 0;
        $cart_total_quantity = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
        
        return [
            'operator' => $condition_operator,
            'value' => (int) $condition_value,
            'current' => $cart_total_quantity
        ];
    }
}