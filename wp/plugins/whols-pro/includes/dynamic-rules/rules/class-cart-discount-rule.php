<?php
namespace Whols_Pro\Dynamic_Rules\Rules;
use Whols_Pro\Dynamic_Rules\Conditions\Conditions;

class Cart_Discount_Rule extends Abstract_Rule {
    public function __construct($rule_data) {
        parent::__construct($rule_data);

        add_action('woocommerce_cart_calculate_fees', [$this, 'maybe_add_cart_discount_or_fee'], 10, 2);
    }

    public function maybe_add_cart_discount_or_fee(){
        if (!$this->rule_apply_primary_check()) {
            return;
        }

        $conditions = new Conditions($this->rule_data);

        if( $conditions->are_satisfied() ){
            // get discount amount
            $amount_type = isset( $this->rule_data['amount_type'] ) ? $this->rule_data['amount_type'] : 'percentage';
            $amount = isset( $this->rule_data['discount_or_fee_value'] ) ? (float) $this->rule_data['discount_or_fee_value'] : 0;

            $cart_contents_total = WC()->cart->get_cart_contents_total();
            
            // Calculate discount amount
            if( $amount_type === 'percentage' ){
                $discount = whols_get_percent_of( $cart_contents_total, $amount );
            }else{
                $discount = $amount;
            }
            
            // Apply discount or fee
            $action = isset( $this->rule_data['action'] ) ? $this->rule_data['action'] : '';

            if( $action === 'apply_cart_discount' ){
                $label = !empty($this->rule_data['rule_label'])
                    ? $this->rule_data['rule_label']
                    : __('Discount', 'whols');

                WC()->cart->add_fee($label, -$discount, false, '');
            }else if( $action === 'apply_extra_charge' ) {
                $label = !empty($this->rule_data['rule_label'])
                    ? $this->rule_data['rule_label']
                    : __('Fee', 'whols');

                WC()->cart->add_fee($label, $discount, false, '');
            }
        }
    }
}
