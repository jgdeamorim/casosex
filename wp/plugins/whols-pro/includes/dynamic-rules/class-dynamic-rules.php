<?php
namespace Whols_Pro\Dynamic_Rules;

class Dynamic_Rules{
    private static $instance = null;
    private $rule_data = [];
    private $rules = [];

    public static function get_instance() {
        if (self::$instance == null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {
        $rule_data = whols_get_option('dynamic_rules');
        $this->rule_data = is_array($rule_data) ? $rule_data : [];

        $this->includes();

        // Load only enabled rules instance
        $this->load_rules();
        
        // Initialize debug inspector
        $this->init_debug_inspector();
    }

    private function includes() {
        require_once __DIR__ . '/rules/class-abstract-rule.php';
        require_once __DIR__ . '/rules/class-cart-discount-rule.php';
        require_once __DIR__ . '/rules/class-bogo-rule.php';
        require_once __DIR__ . '/rules/class-free-shipping-rule.php';
        require_once __DIR__ . '/rules/class-payment-gateway-rule.php';

        require_once __DIR__ . '/conditions/class-conditions.php';
        require_once __DIR__ . '/conditions/class-abstract-condition.php';

        require_once __DIR__ . '/conditions/cart/class-cart-total-condition.php';
        require_once __DIR__ . '/conditions/cart/class-cart-total-quantity-condition.php';
        require_once __DIR__ . '/conditions/cart/class-cart-item-count-condition.php';
        require_once __DIR__ . '/conditions/product/class-product-in-cart-condition.php';
        require_once __DIR__ . '/conditions/product/class-cross-category-condition.php';
        require_once __DIR__ . '/conditions/user/class-user-condition.php';
        require_once __DIR__ . '/conditions/user/class-customer-history-condition.php';
        require_once __DIR__ . '/conditions/user/class-shipping-country-condition.php';
        require_once __DIR__ . '/conditions/bogo/class-buy-product-condition.php';
        require_once __DIR__ . '/conditions/bogo/class-get-product-condition.php';
        require_once __DIR__ . '/conditions/time/class-time-restriction-condition.php';
        
        // Include rules inspector
        require_once __DIR__ . '/class-rules-inspector.php';
    }

    /**
     * Load and initialize rule instances from rule data
     */
    private function load_rules() {
        foreach ($this->rule_data as $index => $rule) {
            // Skip inactive rules unless it's a free shipping rule, because it has to clear the cache based on status change
            if (empty($rule['status']) && $rule['action'] !== 'apply_free_shipping') {
                continue;
            }
            
            // Create rule instance
            $rule_instance = $this->create_rule_instance($rule);
            
            // Add valid rule instance to rules array
            if ($rule_instance) {
                $rule['_index'] = $index; // Store original index for debugging
                $this->rules[] = $rule_instance;
            }
        }
    }


    private function create_rule_instance($rule_data) {
        $action = isset($rule_data['action']) ? $rule_data['action'] : '';

        switch ($action) {
            case 'apply_cart_discount':
            case 'apply_extra_charge':
                return new Rules\Cart_Discount_Rule($rule_data);
                
            case 'apply_bogo_discount':
                return new Rules\Bogo_Rule($rule_data);
                
            case 'apply_free_shipping':
                return new Rules\Free_Shipping_Rule($rule_data);
                
            case 'control_payment_methods':
                return new Rules\Payment_Gateway_Rule($rule_data);
                
            default:
                return null;
        }
    }
    
    /**
     * Initialize rules inspector
     */
    private function init_debug_inspector() {
        $inspector = Rules_Inspector::get_instance();
        $inspector->set_dynamic_rules($this);
    }
}

Dynamic_Rules::get_instance();