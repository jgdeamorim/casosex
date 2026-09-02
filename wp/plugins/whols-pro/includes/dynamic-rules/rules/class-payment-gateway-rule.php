<?php
namespace Whols_Pro\Dynamic_Rules\Rules;

use Whols_Pro\Dynamic_Rules\Conditions\Conditions;

class Payment_Gateway_Rule extends Abstract_Rule {
    private static $active_rules = [];
    private static $hooks_added = false;
    
    public function __construct($rule_data) {
        parent::__construct($rule_data);
        
        // Store this rule instance
        self::$active_rules[] = $this;
        
        // Only add hooks once for all payment gateway rules
        if (!self::$hooks_added) {
            add_filter('woocommerce_available_payment_gateways', [$this, 'modify_available_payment_gateways'], 20, 1);
            self::$hooks_added = true;
        }
    }

    public function rule_apply_primary_check() {
        // Skip in admin (except AJAX)
        if (is_admin() && !defined('DOING_AJAX')) {
            return false;
        }

        // Only for checkout page
        if (!is_checkout()) {
            return false;
        }

        // Skip if no cart
        if (!WC()->cart || WC()->cart->is_empty()) {
            return false;
        }

        return true;
    }

    /**
     * Modify available payment gateways based on qualifying rules
     */
    public function modify_available_payment_gateways($available_gateways) {        
        if (!$this->rule_apply_primary_check()) {
            return $available_gateways;
        }

        if (empty($available_gateways)) {
            return $available_gateways;
        }

        // Process each active rule
        foreach (self::$active_rules as $rule_instance) {
            if ($rule_instance->rule_qualifies()) {
                $available_gateways = $rule_instance->apply_payment_restrictions($available_gateways);
            }
        }

        return $available_gateways;
    }

    /**
     * Apply payment restrictions based on rule settings
     */
    public function apply_payment_restrictions($available_gateways) {
        $payment_methods = $this->rule_data['payment_methods'] ?? [];
        $payment_methods_criteria = $this->rule_data['payment_methods_criteria'] ?? 'allow_selected';

        if (empty($payment_methods)) {
            return $available_gateways;
        }

        switch ($payment_methods_criteria) {
            case 'allow_selected':
                // Only allow specified payment methods (disable all others)
                foreach ($available_gateways as $gateway_id => $gateway) {
                    if (!in_array($gateway_id, $payment_methods)) {
                        unset($available_gateways[$gateway_id]);
                    }
                }
                break;

            case 'disallow_selected':
                // Disable specified payment methods (allow all others)
                foreach ($payment_methods as $gateway_id) {
                    if (isset($available_gateways[$gateway_id])) {
                        unset($available_gateways[$gateway_id]);
                    }
                }
                break;
        }

        return $available_gateways;
    }

    /**
     * Check if this specific rule qualifies
     */
    public function rule_qualifies() {
        // Check if rule is active
        if (empty($this->rule_data['status'])) {
            return false;
        }

        // Check if correct action type
        $action = isset($this->rule_data['action']) ? $this->rule_data['action'] : '';
        if ($action !== 'control_payment_methods') {
            return false;
        }

        // Check all conditions
        $conditions = new Conditions($this->rule_data);
        return $conditions->are_satisfied();
    }

    /**
     * Get debug information
     */
    public function get_debug_info() {
        $conditions = new Conditions($this->rule_data);
        $available_gateways = WC()->payment_gateways()->get_available_payment_gateways();
        $action = isset($this->rule_data['action']) ? $this->rule_data['action'] : '';

        return [
            'rule_label' => $this->rule_data['rule_label'] ?? 'Unnamed Rule',
            'rule_active' => !empty($this->rule_data['status']),
            'correct_action' => $action === 'control_payment_methods',
            'conditions_met' => $conditions->are_satisfied(),
            'rule_qualifies' => $this->rule_qualifies(),
            'payment_settings' => [
                'target_methods' => $this->rule_data['payment_methods'] ?? [],
                'operator' => $this->rule_data['payment_methods_criteria'] ?? 'allow_selected'
            ],
            'available_gateways' => array_keys($available_gateways),
            'cart_total' => WC()->cart ? WC()->cart->get_cart_contents_total() : 0,
            'condition_debug' => $conditions->get_debug_info()
        ];
    }

    /**
     * Get debug info for all active rules
     */
    public function get_all_debug_info() {
        $debug = [
            'rule_apply_primary_check' => $this->rule_apply_primary_check(),
            'active_rules_count' => count(self::$active_rules),
            'original_gateways' => array_keys(WC()->payment_gateways()->get_available_payment_gateways()),
            'rules' => []
        ];

        foreach (self::$active_rules as $index => $rule) {
            $debug['rules'][$index] = $rule->get_debug_info();
        }

        return $debug;
    }

    /**
     * Get friendly gateway names for debugging
     */
    public function get_gateway_names($gateway_ids) {
        $gateway_names = [];
        $available_gateways = WC()->payment_gateways()->get_available_payment_gateways();
        
        foreach ($gateway_ids as $gateway_id) {
            if (isset($available_gateways[$gateway_id])) {
                $gateway_names[$gateway_id] = $available_gateways[$gateway_id]->get_title();
            } else {
                $gateway_names[$gateway_id] = $gateway_id . ' (Not Available)';
            }
        }
        
        return $gateway_names;
    }
}