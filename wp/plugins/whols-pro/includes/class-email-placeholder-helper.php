<?php
namespace Whols_Pro;

/**
 * Email Placeholder Helper
 * Provides dynamic list of available placeholders for email templates
 */
class Email_Placeholder_Helper {

    /**
     * Get all available placeholders for registration emails
     *
     * @return array Array of placeholders with descriptions
     */
    public static function get_registration_placeholders() {
        $placeholders = array();

        // Basic placeholders
        $placeholders['common'] = array(
            '{name}' => __("Customer's first name", 'whols'),
            '{email}' => __("Customer's email address", 'whols'),
            '{date}' => __('Registration date', 'whols'),
            '{time}' => __('Registration time', 'whols'),
            '{site_title}' => __('Website title', 'whols'),
            '{shop_url}' => __('Shop page URL', 'whols')
        );

        // Fields to exclude from the fields section (already in common)
        $exclude_from_fields = array('reg_name', 'reg_email');

        // Admin specific placeholders
        $placeholders['admin'] = array(
            '{approve_link}' => __('Link to approve registration (single role)', 'whols'),
            '{reject_link}' => __('Link to reject registration', 'whols'),
            '{role_approval_links}' => __('List of role-specific approval links', 'whols'),
        );

        // Add role-specific approval links if multiple roles
        if (function_exists('whols_get_pricing_model') && whols_get_pricing_model() === 'multiple_role') {
            if (function_exists('whols_roles_dropdown_options')) {
                $roles = whols_roles_dropdown_options();
                foreach ($roles as $role_slug => $role_name) {
                    $placeholders['admin']['{approve_link_' . $role_slug . '}'] = sprintf(__('Approval link for %s role', 'whols'), $role_name);
                }
            }
        }

        // Registration form fields
        $placeholders['fields'] = array();
        $all_fields = whols_get_option('registration_fields');

        if (!empty($all_fields) && is_array($all_fields)) {
            foreach ($all_fields as $field) {
                // Skip password fields for security
                if (!empty($field['field']) && $field['field'] == 'reg_password') {
                    continue;
                }

                // Skip disabled fields
                if (isset($field['enable']) && !$field['enable']) {
                    continue;
                }

                // Skip fields that are already in common placeholders
                if (in_array($field['field'], $exclude_from_fields)) {
                    continue;
                }

                $placeholder_key = '';
                $placeholder_label = '';

                if ($field['field'] == 'custom' && !empty($field['custom_field_name'])) {
                    $placeholder_key = '{' . $field['custom_field_name'] . '}';
                    $placeholder_label = !empty($field['label']) ? $field['label'] : $field['custom_field_name'];
                } else {
                    $placeholder_key = '{' . $field['field'] . '}';
                    $placeholder_label = !empty($field['label']) ? $field['label'] : self::get_field_default_label($field['field']);
                }

                if (!empty($placeholder_key)) {
                    // Add field type info for clarity
                    $type_info = '';
                    if (!empty($field['type']) && $field['type'] == 'file') {
                        $type_info = ' ' . __('(File URL)', 'whols');
                    }

                    $placeholders['fields'][$placeholder_key] = $placeholder_label . $type_info;
                }
            }
        }

        return $placeholders;
    }

    /**
     * Get default label for a field
     *
     * @param string $field_name Field name
     * @return string Field label
     */
    private static function get_field_default_label($field_name) {
        $labels = array(
            'reg_name' => __('First Name', 'whols'),
            'last_name' => __('Last Name', 'whols'),
            'reg_username' => __('Username', 'whols'),
            'reg_email' => __('Email', 'whols'),
            '_whols_role' => __('Wholesaler Role', 'whols'),
            'billing_company' => __('Billing Company', 'whols'),
            'billing_address_1' => __('Billing Address 1', 'whols'),
            'billing_address_2' => __('Billing Address 2', 'whols'),
            'billing_city' => __('Billing City', 'whols'),
            'billing_postcode' => __('Billing Postcode', 'whols'),
            'billing_country' => __('Billing Country', 'whols'),
            'billing_state' => __('Billing State', 'whols'),
            'billing_phone' => __('Billing Phone', 'whols'),
        );

        return isset($labels[$field_name]) ? $labels[$field_name] : ucfirst(str_replace('_', ' ', $field_name));
    }

    /**
     * Get placeholders for AJAX response
     *
     * @return array Formatted placeholders for frontend
     */
    public static function get_placeholders_for_ajax() {
        $all_placeholders = self::get_registration_placeholders();

        $formatted = array(
            'common' => array(),
            'registration' => array(),
            'fields' => array(),
        );

        // Format common placeholders
        if (!empty($all_placeholders['common'])) {
            foreach ($all_placeholders['common'] as $placeholder => $description) {
                $formatted['common'][] = array(
                    'placeholder' => $placeholder,
                    'description' => $description
                );
            }
        }

        // Format admin placeholders as registration placeholders
        if (!empty($all_placeholders['admin'])) {
            foreach ($all_placeholders['admin'] as $placeholder => $description) {
                $formatted['registration'][] = array(
                    'placeholder' => $placeholder,
                    'description' => $description
                );
            }
        }

        // Format field placeholders
        if (!empty($all_placeholders['fields'])) {
            foreach ($all_placeholders['fields'] as $placeholder => $description) {
                $formatted['fields'][] = array(
                    'placeholder' => $placeholder,
                    'description' => $description
                );
            }
        }

        return $formatted;
    }
}