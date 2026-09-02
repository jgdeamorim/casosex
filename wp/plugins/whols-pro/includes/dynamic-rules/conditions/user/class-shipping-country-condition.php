<?php
namespace Whols_Pro\Dynamic_Rules\Conditions\User;

use Whols_Pro\Dynamic_Rules\Conditions\Abstract_Condition;

class Shipping_Country_Condition extends Abstract_Condition {
    /**
     * Check if shipping country condition is satisfied
     *
     * @return bool True if shipping country meets criteria
     */
    public function is_satisfied() {
        $defined_shipping_countries = ! empty( $this->settings['countries'] ) ? $this->settings['countries'] : array();
        $defined_condition_operator = $this->settings['condition_operator_3'];
        $checkout_shipping_country  = WC()->customer->get_shipping_country();

        $matched = in_array( $checkout_shipping_country, $defined_shipping_countries );

        // matches_any_of
        if ( $defined_shipping_countries && $defined_condition_operator == 'matches_any_of' ) {
            if ( ! $matched ) {
                return false;
            }
        }

        // matches_none_of
        if ( $defined_shipping_countries && $defined_condition_operator == 'matches_none_of' ) {
            if ( $matched ) {
                return false;
            }
        }

        return true;
    }
}
