<?php
namespace Whols_Pro\Dynamic_Rules\Conditions;
use Whols_Pro\Dynamic_Rules\Conditions\Cart\Cart_Total_Condition;
use Whols_Pro\Dynamic_Rules\Conditions\Cart\Cart_Item_Count_Condition;
use Whols_Pro\Dynamic_Rules\Conditions\Cart\Cart_Total_Quantity_Condition;
use Whols_Pro\Dynamic_Rules\Conditions\User\Shipping_Country_Condition;
use Whols_Pro\Dynamic_Rules\Conditions\Product\Product_In_Cart_Condition;
use Whols_Pro\Dynamic_Rules\Conditions\Product\Cross_Category_Condition;
use Whols_Pro\Dynamic_Rules\Conditions\User\User_Condition;
use Whols_Pro\Dynamic_Rules\Conditions\User\Customer_History_Condition;

class Conditions{
    protected $rule_data;
    protected $conditions = [];
    protected $debug_info = []; // Add this line
    
    public function __construct( $rule_data ){
        $this->rule_data = $rule_data;

        // Additional conditions
        if (!empty($this->rule_data['additional_conditons'])) {
            foreach($this->rule_data['additional_conditons'] as $condition){
                $condition_value = $condition['condition_value'] ?? '';

                // No need to create condition instance if condition value is empty
                if( $condition_value ){
                    $condition_instance = $this->create_additonal_condition_instance( $condition );
                    if ($condition_instance) {
                        $this->conditions[] = $condition_instance;
                    }
                }   
            }
        }

        // Product conditions
        if( !empty($this->rule_data['products']) && isset($this->rule_data['target_item_based_on']) && $this->rule_data['target_item_based_on'] == 'specific_products' ){
            $this->conditions[] = new Product_In_Cart_Condition($this->rule_data);
        }

        if( !empty($this->rule_data['product_categories']) && isset($this->rule_data['target_item_based_on']) && $this->rule_data['target_item_based_on'] == 'product_category' ){
            $this->conditions[] = new Cross_Category_Condition($this->rule_data);
        }

        // Shipping country conditions
        if( !empty($this->rule_data['countries']) && isset($this->rule_data['checkout_shipping_country']) && $this->rule_data['checkout_shipping_country'] == 'shipping_country' ){
            $this->conditions[] = new Shipping_Country_Condition($this->rule_data);
        }

        // User conditions
        if( !empty($this->rule_data['user_condition_name']) ){
            $this->conditions[] = new User_Condition($this->rule_data);
        }

        if (!empty($this->rule_data['action']) && $this->rule_data['action'] === 'apply_bogo_discount') {
            $this->conditions[] = new Bogo\Buy_Product_Condition($this->rule_data);
            $this->conditions[] = new Bogo\Get_Product_Condition($this->rule_data);
        }

        // Customer history conditions
        if (!empty($this->rule_data['enable_customer_history'])) {
            $this->conditions[] = new Customer_History_Condition($this->rule_data);
        }

        // Time restriction conditions
        if (!empty($this->rule_data['enable_time_restriction'])) {
            $this->conditions[] = new Time\Time_Restriction_Condition($this->rule_data);
        }
    }

    /**
     * Check if all conditions are satisfied
     *
     * @return bool True if all conditions are satisfied, false otherwise
     */
    public function are_satisfied(){
        $all_satisfied = true;
        $this->debug_info = []; // Reset debug info
        
        foreach( $this->conditions as $condition ){
            if( $condition ){
                $is_satisfied = $condition->is_satisfied();
                
                // Collect debug info
                $this->debug_info[] = [
                    'name' => $condition->get_debug_name(),
                    'result' => $is_satisfied,
                    'details' => $condition->get_debug_details()
                ];
                
                if (!$is_satisfied) {
                    $all_satisfied = false;
                }
            }
        }

        return $all_satisfied;
    }
    
    /**
     * Get debug information about condition results
     */
    public function get_debug_info() {
        return $this->debug_info;
    }

    public function create_additonal_condition_instance($condition){
        $condition_name = $condition['condition_name'] ?? '';
        
        if( $condition_name == 'cart_subtotal' ){
            return new Cart_Total_Condition($this->rule_data, $condition);
        }

        if( $condition_name == 'cart_item_count' ){
            return new Cart_Item_Count_Condition($this->rule_data, $condition);
        }

        if( $condition_name == 'cart_total_qunatity' ){
            
            return new Cart_Total_Quantity_Condition($this->rule_data, $condition);
        }

        if( $condition_name == 'checkout_shipping_country' ){
            return new Shipping_Country_Condition($this->rule_data, $condition);
        }
        
        return null;
    }
}