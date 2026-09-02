<?php
namespace Whols_Pro\Dynamic_Rules\Conditions\Product;

use Whols_Pro\Dynamic_Rules\Conditions\Abstract_Condition;

class Product_In_Cart_Condition extends Abstract_Condition {
    public function is_satisfied() {
        $defined_condition_operator = isset( $this->rule_data['target_item_operator'] ) ? $this->rule_data['target_item_operator'] : '';
        $defined_products = isset( $this->rule_data['products'] ) ? $this->rule_data['products'] : array();

        // Safety check for WooCommerce cart
        if ( ! WC()->cart ) {
            return true;
        }

        $cart = WC()->cart->get_cart();

        $cart_products = array();

        foreach ( $cart as $cart_item ) {
            $cart_products[] = $cart_item['product_id'];
        }

        $matched = array_intersect( $cart_products, $defined_products );

        if ( $defined_products && $defined_condition_operator == 'matches_any_of' ) {
            if ( empty( $matched ) ) {
                return false;
            }
        }

        if ( $defined_products && $defined_condition_operator == 'matches_all_of' ) {
            if ( count( $matched ) != count( $defined_products ) ) {
                return false;
            }
        }

        if ( $defined_products && $defined_condition_operator == 'matches_none_of' ) {
            if ( ! empty( $matched ) ) { // if there is any matched product
                return false;
            }
        }

        return true;
    }
    
    public function get_debug_name() {
        return 'Product In Cart';
    }

    public function get_debug_details() {
        $operator = isset( $this->rule_data['target_item_operator'] ) ? $this->rule_data['target_item_operator'] : '';
        $product_ids = isset( $this->rule_data['products'] ) ? $this->rule_data['products'] : array();

        return [
            'operator' => $operator,
            'value' => is_array( $product_ids ) ? implode(',', $product_ids) : '',
            'current' => 'N/A'
        ];
    }
}