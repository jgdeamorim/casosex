<?php
namespace Whols_Pro\Dynamic_Rules\Conditions\Product;

use Whols_Pro\Dynamic_Rules\Conditions\Abstract_Condition;

class Cross_Category_Condition extends Abstract_Condition {
    public function is_satisfied() {
        $defined_condition_operator = isset( $this->rule_data['target_item_operator'] ) ? $this->rule_data['target_item_operator'] : '';
        $defined_categories = isset( $this->rule_data['product_categories'] ) ? $this->rule_data['product_categories'] : array();

        // Safety check for WooCommerce cart
        if ( ! WC()->cart ) {
            return true;
        }

        $cart = WC()->cart->get_cart();

        $cart_categories = array();

        foreach ( $cart as $cart_item ) {
            $product = isset( $cart_item['data'] ) ? $cart_item['data'] : null;

            // Skip if product is not valid
            if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
                continue;
            }

            if ( $product->is_type( 'variation' ) ) {
                $parent_id = $product->get_parent_id();
                $parent_product = wc_get_product( $parent_id );
                $product_categories = ( $parent_product && is_a( $parent_product, 'WC_Product' ) ) ? $parent_product->get_category_ids() : array();
            } else {
                $product_categories = $product->get_category_ids();
            }

            if ( $product_categories ) {
                $cart_categories = array_merge( $cart_categories, $product_categories );
            }
        }

        // Get category slugs
        $cart_categories_slugs = array_map( function( $category_id ) {
            return get_term_field( 'slug', $category_id );
        }, $cart_categories );

        $matched = array_intersect( $cart_categories_slugs, $defined_categories );

        if ( $defined_categories && $defined_condition_operator == 'matches_any_of' ) {
            if ( empty( $matched ) ) {
                return false;
            }
        }

        if ( $defined_categories && $defined_condition_operator == 'matches_all_of' ) {
            if ( count( $matched ) != count( $defined_categories ) ) {
                return false;
            }
        }

        if ( $defined_categories && $defined_condition_operator == 'matches_none_of' ) {
            if ( ! empty( $matched ) ) { // if there is any matched product
                return false;
            }
        }

        return true;
    }
    
    public function get_debug_name() {
        return 'Cross Category';
    }
    
    public function get_debug_details() {
        $operator = isset( $this->rule_data['target_item_operator'] ) ? $this->rule_data['target_item_operator'] : '';
        $categories = isset( $this->rule_data['product_categories'] ) ? $this->rule_data['product_categories'] : array();

        return [
            'operator' => $operator,
            'value' => is_array( $categories ) ? implode(',', $categories) : '',
            'current' => 'N/A'
        ];
    }
}