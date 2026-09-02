<?php
namespace Whols_Pro\Dynamic_Rules\Conditions\Time;

use Whols_Pro\Dynamic_Rules\Conditions\Abstract_Condition;

class Time_Restriction_Condition extends Abstract_Condition {
    /**
     * Check if time restriction condition is satisfied
     *
     * @return bool True if time restrictions are met
     */
    public function is_satisfied() {
        // Skip if time restriction is not enabled
        if (empty($this->rule_data['enable_time_restriction'])) {
            return true;
        }

        // Check date range restriction
        if (!$this->check_date_range()) {
            return false;
        }

        // Check days of week restriction
        if (!$this->check_days_of_week()) {
            return false;
        }

        // Check time of day restriction
        if (!$this->check_time_of_day()) {
            return false;
        }

        return true;
    }

    /**
     * Check if current date is within specified date range
     */
    private function check_date_range() {
        $date_range = $this->rule_data['date_range'] ?? '';
        
        // Skip if no date range specified
        if (empty($date_range)) {
            return true;
        }

        $dates = explode(',', $date_range);
        if (count($dates) !== 2) {
            return true; // Invalid format, skip restriction
        }

        $start_date = trim($dates[0]);
        $end_date = trim($dates[1]);

        // Validate date format
        if (!$this->is_valid_date($start_date) || !$this->is_valid_date($end_date)) {
            return true; // Invalid dates, skip restriction
        }

        $current_date = current_time('Y-m-d');
        
        return $current_date >= $start_date && $current_date <= $end_date;
    }

    /**
     * Check if current day is in allowed days of week
     */
    private function check_days_of_week() {
        $days_of_week = $this->rule_data['days_of_week'] ?? '';
        
        // Skip if no days specified
        if (empty($days_of_week)) {
            return true;
        }

        $allowed_days = array_map('trim', explode(',', $days_of_week));
        $current_day = current_time('w'); // 0 (Sunday) to 6 (Saturday)

        return in_array($current_day, $allowed_days);
    }

    /**
     * Check if current time is within specified time range
     */
    private function check_time_of_day() {
        // Skip if time of day restriction is not enabled
        if (empty($this->rule_data['enable_time_of_day'])) {
            return true;
        }

        $start_time = $this->rule_data['start_time'] ?? '';
        $end_time = $this->rule_data['end_time'] ?? '';

        // Skip if times are not specified
        if (empty($start_time) || empty($end_time)) {
            return true;
        }

        // Validate time format (HH:MM)
        if (!$this->is_valid_time($start_time) || !$this->is_valid_time($end_time)) {
            return true; // Invalid time format, skip restriction
        }

        $current_time = current_time('H:i');
        
        // Handle same day time range
        if ($start_time <= $end_time) {
            return $current_time >= $start_time && $current_time <= $end_time;
        } 
        // Handle overnight time range (e.g., 22:00 to 06:00)
        else {
            return $current_time >= $start_time || $current_time <= $end_time;
        }
    }

    /**
     * Validate date format (YYYY-MM-DD)
     */
    private function is_valid_date($date) {
        $date_obj = \DateTime::createFromFormat('Y-m-d', $date);
        return $date_obj && $date_obj->format('Y-m-d') === $date;
    }

    /**
     * Validate time format (HH:MM)
     */
    private function is_valid_time($time) {
        return preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $time);
    }

    /**
     * Get day name from day number
     */
    private function get_day_name($day_number) {
        $days = [
            0 => 'Sunday',
            1 => 'Monday', 
            2 => 'Tuesday',
            3 => 'Wednesday',
            4 => 'Thursday',
            5 => 'Friday',
            6 => 'Saturday'
        ];
        
        return $days[$day_number] ?? 'Unknown';
    }

    public function get_debug_name() {
        return 'Time Restriction';
    }
    
    public function get_debug_details() {
        $current_date = current_time('Y-m-d');
        $current_time = current_time('H:i');
        $current_day = current_time('w');
        
        $details = [
            'enabled' => !empty($this->rule_data['enable_time_restriction']),
            'current_datetime' => [
                'date' => $current_date,
                'time' => $current_time,
                'day_of_week' => $current_day,
                'day_name' => $this->get_day_name($current_day)
            ],
            'restrictions' => [
                'date_range' => $this->rule_data['date_range'] ?? '',
                'days_of_week' => $this->rule_data['days_of_week'] ?? '',
                'time_of_day_enabled' => !empty($this->rule_data['enable_time_of_day']),
                'start_time' => $this->rule_data['start_time'] ?? '',
                'end_time' => $this->rule_data['end_time'] ?? ''
            ],
            'checks' => [
                'date_range_valid' => $this->check_date_range(),
                'days_of_week_valid' => $this->check_days_of_week(),
                'time_of_day_valid' => $this->check_time_of_day()
            ]
        ];

        // Add parsed allowed days
        if (!empty($this->rule_data['days_of_week'])) {
            $allowed_days = array_map('trim', explode(',', $this->rule_data['days_of_week']));
            $details['parsed_allowed_days'] = array_map([$this, 'get_day_name'], $allowed_days);
        }

        return $details;
    }
}