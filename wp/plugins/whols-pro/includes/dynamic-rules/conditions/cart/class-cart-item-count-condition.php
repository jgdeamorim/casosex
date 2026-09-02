<?php
namespace Whols_Pro\Dynamic_Rules\Conditions\Cart;

use Whols_Pro\Dynamic_Rules\Conditions\Abstract_Condition;

class Cart_Item_Count_Condition extends Abstract_Condition {
    /**
     * Check if cart item count condition is satisfied
     *
     * @return bool True if cart item count meets criteria
     */
    public function is_satisfied() {
        $condition_operator = isset( $this->settings['condition_operator'] ) ? $this->settings['condition_operator'] : 'at_least';
        $condition_value    = isset( $this->settings['condition_value'] ) ? $this->settings['condition_value'] : 0;

        // Safety check for WooCommerce cart
        if ( ! WC()->cart ) {
            return true;
        }

        $cart_items_count = count( WC()->cart->get_cart() );

        if ( $condition_operator == 'at_least' ) {
            if ( ! ( $cart_items_count >= $condition_value ) ) {
                return false;
            }
        }

        if ( $condition_operator == 'less_than' ) {
            if ( ! ( $cart_items_count < $condition_value ) ) {
                return false;
            }
        }

        if ( $condition_operator == 'equal' ) {
            if ( ! ( $cart_items_count == $condition_value ) ) {
                return false;
            }
        }

        return true;
    }

    public function get_debug_name() {
        return 'Cart Item Count';
    }
    
    public function get_debug_details() {
        $condition_operator = $this->settings['condition_operator'] ?? 'at_least';
        $condition_value    = $this->settings['condition_value'] ?? 0;
        $cart_items_count = WC()->cart ? count(WC()->cart->get_cart()) : 0;
        
        return [
            'operator' => $condition_operator,
            'value' => (int) $condition_value,
            'current' => $cart_items_count
        ];
    }
}   