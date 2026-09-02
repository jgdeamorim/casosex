<?php
namespace Whols_Pro\Dynamic_Rules\Conditions\User;

use Whols_Pro\Dynamic_Rules\Conditions\Abstract_Condition;

class User_Condition extends Abstract_Condition {
    /**
     * Check if user condition is satisfied
     *
     * @return bool True if user condition meets criteria
     */
    public function is_satisfied() {
        $criteria = $this->rule_data['user_condition_name'] ?? '';
        
        switch($criteria) {
            case 'all_registered_users':
                return $this->check_registered_users();
            case 'b2b_roles':
                return $this->check_b2b_roles();
            case 'specific_roles':
                return $this->check_specific_roles();
            case 'specific_user':
                return $this->check_specific_users();
            default:
                return true; // Any customers - always pass
        }
    }

    /**
     * Check if user is registered (logged in)
     */
    private function check_registered_users() {
        return is_user_logged_in();
    }

    /**
     * Check if user has any B2B/wholesale roles
     */
    private function check_b2b_roles() {
        $matched = array_intersect(
            array_keys(whols_roles_dropdown_options()), 
            whols_get_current_user_roles()
        );
        return !empty($matched);
    }

    /**
     * Check if user has specific roles
     */
    private function check_specific_roles() {
        $defined_roles = !empty($this->rule_data['user_condition_specific_role']) ? 
            $this->rule_data['user_condition_specific_role'] : array();
        
        if (empty($defined_roles)) {
            return true;
        }

        return whols_is_user_has_role($defined_roles);
    }

    /**
     * Check if current user is in specific users list
     */
    private function check_specific_users() {
        $defined_users = !empty($this->rule_data['user_condition_specific_user']) ? 
            $this->rule_data['user_condition_specific_user'] : array();
        
        if (empty($defined_users)) {
            return true;
        }

        return in_array(get_current_user_id(), $defined_users);
    }

    public function get_debug_name() {
        return 'User Condition';
    }
    
    public function get_debug_details() {
        $criteria = $this->rule_data['user_condition_name'] ?? '';
        $current_user_id = get_current_user_id();
        $current_user_roles = whols_get_current_user_roles();
        
        $details = [
            'criteria' => $criteria,
            'current_user_id' => $current_user_id,
            'current_user_roles' => implode(', ', $current_user_roles),
            'is_logged_in' => is_user_logged_in()
        ];

        // Add specific details based on criteria
        switch($criteria) {
            case 'specific_roles':
                $specific_roles = isset( $this->rule_data['user_condition_specific_role'] ) ? $this->rule_data['user_condition_specific_role'] : array();
                $details['required_roles'] = is_array( $specific_roles ) ? implode(', ', $specific_roles) : '';
                break;
            case 'specific_user':
                $specific_users = isset( $this->rule_data['user_condition_specific_user'] ) ? $this->rule_data['user_condition_specific_user'] : array();
                $details['allowed_users'] = is_array( $specific_users ) ? implode(', ', $specific_users) : '';
                break;
            case 'b2b_roles':
                $details['available_b2b_roles'] = implode(', ', array_keys(whols_roles_dropdown_options()));
                break;
        }

        return $details;
    }
}