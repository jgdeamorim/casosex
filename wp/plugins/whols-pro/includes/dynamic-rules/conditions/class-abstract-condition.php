<?php
namespace Whols_Pro\Dynamic_Rules\Conditions;

abstract class Abstract_Condition {
    protected $rule_data;
    protected $settings;
    
    /**
     * Constructor
     *
     * @param array $rule_data Rule configuration data
     * @param array $settings Optional settings for this condition
     */
    public function __construct($rule_data, $settings = []) {
        $this->rule_data = $rule_data;
        $this->settings = $settings;
    }
    
    /**
     * Check if condition is satisfied
     *
     * @return bool True if condition is satisfied
     */
    abstract public function is_satisfied();
    
    /**
     * Get debug name for this condition
     */
    public function get_debug_name() {
        return get_class($this);
    }
    
    /**
     * Get debug details for this condition
     */
    public function get_debug_details() {
        return '';
    }
}