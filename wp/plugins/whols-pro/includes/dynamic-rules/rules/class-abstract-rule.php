<?php
namespace Whols_Pro\Dynamic_Rules\Rules;

abstract class Abstract_Rule {
    public $rule_data;
    
    public function __construct($rule_data) {
        $this->rule_data = $rule_data;
    }

    public function rule_apply_primary_check() {
        // Skip in admin (except AJAX)
        if (is_admin() && !defined('DOING_AJAX')) {
            return false;
        }

        // Skip if no cart
        if (!WC()->cart || WC()->cart->is_empty()) {
            return false;
        }

        return true;
    }
}