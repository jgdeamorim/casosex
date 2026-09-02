<?php
namespace Whols_Pro\Dynamic_Rules\Rules;

use Whols_Pro\Dynamic_Rules\Conditions\Conditions;

class Free_Shipping_Rule extends Abstract_Rule {
    private static $active_rules = [];
    private static $hooks_added = false;
    
    public function __construct($rule_data) {
        parent::__construct($rule_data);
        
        // Store this rule instance
        self::$active_rules[] = $this;
        
        // Only add hooks once for all free shipping rules
        if (!self::$hooks_added) {
            // Add filter to check if any free shipping rule is enabled
            add_filter('whols_enable_dynamic_free_shipping', [$this, 'check_any_rule_qualifies']);
            
            // Inject custom free shipping rate only if enabled
            add_filter('woocommerce_package_rates', [$this, 'add_free_shipping_rate_if_enabled'], 100, 2);
            
            // Smart cache refresh based on toggle change
            add_action('woocommerce_before_cart', [$this, 'smart_shipping_cache_refresh']);
            add_action('woocommerce_checkout_update_order_review', [$this, 'smart_shipping_cache_refresh']);
            
            self::$hooks_added = true;
        }
    }

    /**
     * Check if any free shipping rule qualifies
     */
    public function check_any_rule_qualifies($default = false) {
        if (!$this->rule_apply_primary_check()) {
            return false;
        }

        // Check if any rule qualifies
        foreach (self::$active_rules as $rule_instance) {
            if ($rule_instance->rule_qualifies()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Add free shipping rate only if enabled
     */
    public function add_free_shipping_rate_if_enabled($rates, $package) {
        // Check if free shipping should be enabled
        if (!apply_filters('whols_enable_dynamic_free_shipping', false)) {
            return $rates;
        }

        // Get the qualifying rule for label
        $qualifying_rule = null;
        foreach (self::$active_rules as $rule_instance) {
            if ($rule_instance->rule_qualifies()) {
                $qualifying_rule = $rule_instance;
                break;
            }
        }

        if (!$qualifying_rule) {
            return $rates;
        }

        // Create custom free shipping rate
        $custom_rate = new \WC_Shipping_Rate(
            'whols_dynamic_free_shipping',
            $qualifying_rule->get_shipping_label(),
            0,
            [],
            'whols_free_shipping'
        );

        // Return only free shipping rate
        return [$custom_rate->get_id() => $custom_rate];
    }

    /**
     * Smart cache refresh based on toggle change
     */
    public function smart_shipping_cache_refresh() {
        if (!WC()->cart || !WC()->session) {
            return;
        }

        $is_enabled_now = apply_filters('whols_enable_dynamic_free_shipping', false);
        $was_enabled = WC()->session->get('whols_free_shipping_enabled');

        // If the toggle changed (from true to false or vice versa), force refresh
        if ($was_enabled !== $is_enabled_now) {
            $packages = WC()->shipping()->get_packages();
            foreach ($packages as $i => $package) {
                WC()->session->set("shipping_for_package_{$i}", false);
            }
            WC()->cart->calculate_shipping();
            
            // Store the current state
            WC()->session->set('whols_free_shipping_enabled', $is_enabled_now);
        }
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
        if ($action !== 'apply_free_shipping') {
            return false;
        }

        // Check all conditions
        $conditions = new Conditions($this->rule_data);
        return $conditions->are_satisfied();
    }

    /**
     * Get shipping label for this rule
     */
    public function get_shipping_label() {
        // Check for custom label in rule data
        if (!empty($this->rule_data['rule_label'])) {
            return $this->rule_data['rule_label'];
        }

        // Default label with rule name
        return sprintf(__('Free Shipping', 'whols'));
    }

    /**
     * Get debug information
     */
    public function get_debug_info() {
        $conditions = new Conditions($this->rule_data);
        
        $action = isset($this->rule_data['action']) ? $this->rule_data['action'] : '';

        return [
            'rule_label' => $this->rule_data['rule_label'] ?? 'Unnamed Rule',
            'rule_active' => !empty($this->rule_data['status']),
            'correct_action' => $action === 'apply_free_shipping',
            'conditions_met' => $conditions->are_satisfied(),
            'rule_qualifies' => $this->rule_qualifies(),
            'shipping_label' => $this->get_shipping_label(),
            'condition_debug' => $conditions->get_debug_info()
        ];
    }

    /**
     * Get debug info for all active rules
     */
    public static function get_all_debug_info() {
        $debug = [
            'free_shipping_enabled' => apply_filters('whols_enable_dynamic_free_shipping', false),
            'rule_apply_primary_check' => self::rule_apply_primary_check(),
            'active_rules_count' => count(self::$active_rules),
            'rules' => []
        ];

        foreach (self::$active_rules as $index => $rule) {
            $debug['rules'][$index] = $rule->get_debug_info();
        }

        return $debug;
    }
}