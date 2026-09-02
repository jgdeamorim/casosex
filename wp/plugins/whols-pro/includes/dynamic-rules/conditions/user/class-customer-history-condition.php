<?php
namespace Whols_Pro\Dynamic_Rules\Conditions\User;

use Whols_Pro\Dynamic_Rules\Conditions\Abstract_Condition;

class Customer_History_Condition extends Abstract_Condition {
    /**
     * Check if customer history condition is satisfied
     *
     * @return bool True if customer history conditions are met
     */
    public function is_satisfied() {
        // Skip if customer history is not enabled
        if (empty($this->rule_data['enable_customer_history'])) {
            return true;
        }

        // Only logged-in users can have order history
        if (!is_user_logged_in()) {
            return false;
        }

        $current_user_id = get_current_user_id();
        
        // Get customer order data
        $customer_orders = $this->get_customer_completed_orders($current_user_id);
        $order_count = count($customer_orders);
        $total_spent = $this->calculate_total_spent($customer_orders);
        $days_since_last_order = $this->calculate_days_since_last_order($customer_orders);

        // Check minimum order count
        if (!$this->check_minimum_order_count($order_count)) {
            return false;
        }

        // Check minimum total spent
        if (!$this->check_minimum_total_spent($total_spent)) {
            return false;
        }

        // Check days since last order
        if (!$this->check_days_since_last_order($days_since_last_order)) {
            return false;
        }

        return true;
    }

    /**
     * Get customer's completed orders
     */
    private function get_customer_completed_orders($user_id) {
        $orders = wc_get_orders([
            'customer_id' => $user_id,
            'status' => 'completed',
            'limit' => -1,
            'return' => 'objects'
        ]);

        return $orders;
    }

    /**
     * Calculate total amount spent by customer
     */
    private function calculate_total_spent($orders) {
        $total = 0;
        
        foreach ($orders as $order) {
            $total += $order->get_total();
        }

        return $total;
    }

    /**
     * Calculate days since customer's last order
     */
    private function calculate_days_since_last_order($orders) {
        if (empty($orders)) {
            return null; // No orders found
        }

        // Sort orders by date (newest first)
        usort($orders, function($a, $b) {
            return $b->get_date_created()->getTimestamp() - $a->get_date_created()->getTimestamp();
        });

        $last_order = $orders[0];
        $last_order_date = $last_order->get_date_created();
        $current_date = new \DateTime();

        $diff = $current_date->diff($last_order_date);
        return $diff->days;
    }

    /**
     * Check minimum order count condition
     */
    private function check_minimum_order_count($order_count) {
        $min_order_count = $this->rule_data['min_order_count'] ?? '';
        
        // Skip if not specified
        if (empty($min_order_count) || !is_numeric($min_order_count)) {
            return true;
        }

        return $order_count >= (int)$min_order_count;
    }

    /**
     * Check minimum total spent condition
     */
    private function check_minimum_total_spent($total_spent) {
        $min_total_spent = $this->rule_data['min_total_spent'] ?? '';
        
        // Skip if not specified
        if (empty($min_total_spent) || !is_numeric($min_total_spent)) {
            return true;
        }

        return $total_spent >= (float)$min_total_spent;
    }

    /**
     * Check days since last order condition
     */
    private function check_days_since_last_order($days_since_last_order) {
        $required_days = $this->rule_data['days_since_last_order'] ?? '';
        
        // Skip if not specified
        if (empty($required_days) || !is_numeric($required_days)) {
            return true;
        }

        // If customer has no orders, they can't meet this condition
        if ($days_since_last_order === null) {
            return false;
        }

        // Rule applies only if this many days have passed since last order
        return $days_since_last_order >= (int)$required_days;
    }

    public function get_debug_name() {
        return 'Customer History';
    }
    
    public function get_debug_details() {
        $current_user_id = get_current_user_id();
        $is_logged_in = is_user_logged_in();
        
        $details = [
            'enabled' => !empty($this->rule_data['enable_customer_history']),
            'user_id' => $current_user_id,
            'is_logged_in' => $is_logged_in,
            'conditions' => [
                'min_order_count' => $this->rule_data['min_order_count'] ?? '',
                'min_total_spent' => $this->rule_data['min_total_spent'] ?? '',
                'days_since_last_order' => $this->rule_data['days_since_last_order'] ?? ''
            ]
        ];

        if ($is_logged_in) {
            $customer_orders = $this->get_customer_completed_orders($current_user_id);
            $details['current_stats'] = [
                'order_count' => count($customer_orders),
                'total_spent' => $this->calculate_total_spent($customer_orders),
                'days_since_last_order' => $this->calculate_days_since_last_order($customer_orders)
            ];
        }

        return $details;
    }
}