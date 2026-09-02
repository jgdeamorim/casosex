<?php
namespace Whols_Pro;

/**
 * Class for generating and validating secure action links for wholesaler approval/rejection
 */
class Secure_Action_Links {
    /**
     * Token expiration time in seconds (30 days)
     */
    const TOKEN_EXPIRATION = DAY_IN_SECONDS * 30;
    
    /**
     * Instance of this class
     *
     * @var Secure_Action_Links
     */
    private static $instance = null;
    
    /**
     * Private constructor to prevent direct instantiation
     */
    private function __construct() {
        // Private constructor to prevent direct instantiation
    }
    
    /**
     * Get the singleton instance of this class
     *
     * @return Secure_Action_Links
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        
        return self::$instance;
    }
    
    /**
     * Generate a secure token for wholesaler approval/rejection
     *
     * @param int $user_request_id The post ID of the wholesaler request
     * @param string $action The action to perform ('approve' or 'reject')
     * @param string $role Optional. The role to assign when approving
     * @return string The generated token
     */
    public function generate_token($user_request_id, $action, $role = '') {
        // Get current timestamp for expiration calculation
        $expiration = time() + self::TOKEN_EXPIRATION;
        
        // Create payload with user request ID, action, role, and expiration
        $payload = [
            'user_request_id' => $user_request_id,
            'action' => $action,
            'exp' => $expiration
        ];
        
        // Add role to payload if specified (for role-specific approval)
        if (!empty($role) && $action === 'approve') {
            $payload['role'] = $role;
        }
        
        // Get the site's authentication key for additional security
        $auth_key = defined('AUTH_KEY') ? AUTH_KEY : get_option('whols_secure_key', wp_generate_password(64, true, true));
        
        // Store a secure key if not already defined
        if (!defined('AUTH_KEY') && !get_option('whols_secure_key')) {
            update_option('whols_secure_key', $auth_key);
        }
        
        // Create a signature using the auth key
        $signature = hash_hmac('sha256', json_encode($payload), $auth_key);
        
        // Encode the payload and add the signature
        $token = base64_encode(json_encode($payload)) . '.' . $signature;
        
        return $token;
    }
    
    /**
     * Generate secure action links for wholesaler approval/rejection
     *
     * @param int $user_request_id The post ID of the wholesaler request
     * @return array Links for approval and rejection
     */
    public function generate_action_links($user_request_id) {
        // Create reject token
        $reject_token = $this->generate_token($user_request_id, 'reject');
        
        // Build URL for reject action
        $reject_url = add_query_arg([
            'action' => 'whols_secure_action',
            'token' => urlencode($reject_token)
        ], admin_url('admin-ajax.php'));
        
        $links = [
            'reject_link' => $reject_url
        ];
        
        // Check pricing model
        $is_multiple_role = function_exists('whols_get_pricing_model') && whols_get_pricing_model() === 'multiple_role';
        
        // Generate role-specific approval links based on pricing model
        if (function_exists('whols_roles_dropdown_options')) {
            $roles = whols_roles_dropdown_options();
            
            if ($is_multiple_role) {
                // For multiple_role pricing model, provide links for all roles
                foreach ($roles as $role_slug => $role_name) {
                    $role_token = $this->generate_token($user_request_id, 'approve', $role_slug);
                    $role_url = add_query_arg([
                        'action' => 'whols_secure_action',
                        'token' => urlencode($role_token)
                    ], admin_url('admin-ajax.php'));
                    
                    $links['approve_link_' . $role_slug] = $role_url;
                }
            } else {
                // For single_role pricing model, only provide link for default role
                $default_role = 'whols_default_role';
                $role_token = $this->generate_token($user_request_id, 'approve', $default_role);
                $role_url = add_query_arg([
                    'action' => 'whols_secure_action',
                    'token' => urlencode($role_token)
                ], admin_url('admin-ajax.php'));
                
                $links['approve_link'] = $role_url;
                $links['approve_link_' . $default_role] = $role_url; // For consistency
            }
        }
        
        return $links;
    }
    
    /**
     * Validate a secure token and extract its payload
     *
     * @param string $token The token to validate
     * @return array|bool Payload if valid, false if invalid
     */
    public function validate_token($token) {
        // Split token into data and signature parts
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            return false;
        }
        
        // Decode payload
        $json_data = base64_decode($parts[0]);
        if (!$json_data) {
            return false;
        }
        
        // Parse JSON
        $payload = json_decode($json_data, true);
        if (!$payload || !isset($payload['user_request_id']) || !isset($payload['action']) || !isset($payload['exp'])) {
            return false;
        }
        
        // Check if token has expired
        if (time() > $payload['exp']) {
            return false;
        }
        
        // Get the authentication key
        $auth_key = defined('AUTH_KEY') ? AUTH_KEY : get_option('whols_secure_key');
        if (!$auth_key) {
            return false;
        }
        
        // Verify signature
        $expected_signature = hash_hmac('sha256', $json_data, $auth_key);
        if (!hash_equals($expected_signature, $parts[1])) {
            return false;
        }
        
        return $payload;
    }
    
    /**
     * Process a secure action from token
     *
     * @param string $token The token to process
     * @return bool|string Success status or error message
     */
    public function process_action($token) {
        // Validate the token
        $payload = $this->validate_token($token);
        if (!$payload) {
            return __('Invalid or expired token. Please login to the admin dashboard to manage wholesaler requests.', 'whols');
        }
        
        // Extract data from payload
        $user_request_id = $payload['user_request_id'];
        $action = $payload['action'];
        $role = isset($payload['role']) ? $payload['role'] : 'whols_default_role'; // Default role if not specified
        
        // Check if wholesaler request exists
        $request = get_post($user_request_id);
        if (!$request || $request->post_type !== 'whols_user_request') {
            return __('Wholesaler request not found.', 'whols');
        }
        
        // Get request meta
        $meta = get_post_meta($user_request_id, 'whols_user_request_meta', true);
        if (!$meta || empty($meta['user_id'])) {
            return __('Invalid wholesaler request data.', 'whols');
        }
        
        // Check if request has already been processed
        if (!empty($meta['status']) && $meta['status'] !== '') {
            if ($meta['status'] === 'approve') {
                return __('This wholesaler request has already been approved.', 'whols');
            } else if ($meta['status'] === 'reject') {
                return __('This wholesaler request has already been rejected.', 'whols');
            }
        }
        
        // Set the new status based on action
        $meta['status'] = $action; // 'approve' or 'reject'
        
        // If approving, set the role to assign
        if ($action === 'approve') {
            $meta['assign_role'] = $role;
        }
        
        // Update the post meta
        update_post_meta($user_request_id, 'whols_user_request_meta', $meta);
        
        // Update post to trigger post_updated hook which will update user role
        wp_update_post([
            'ID' => $user_request_id,
            'whols_user_request_meta' => $meta
        ]);
        
        // Return success message
        if ($action === 'approve') {
            $user_id = $meta['user_id'];
            $user = new \WP_User($user_id);
            
            // Get role name for the message
            $role_name = $role;
            if (function_exists('whols_roles_dropdown_options')) {
                $roles = whols_roles_dropdown_options();
                if (isset($roles[$role])) {
                    $role_name = $roles[$role];
                }
            }
            
            // Set the specified role
            $user->set_role($role);
            
            return sprintf(
                __('Wholesaler request approved successfully and assigned to the "%s" role.', 'whols'),
                $role_name
            );
        } else {
            return __('Wholesaler request rejected successfully.', 'whols');
        }
    }
    
    /**
     * Generate a list of role approval links in HTML format
     *
     * @param int $user_request_id The wholesaler request ID
     * @return string HTML with role approval links
     */
    public function generate_role_links_html($user_request_id) {
        if (!function_exists('whols_roles_dropdown_options')) {
            return '';
        }
        
        // Check pricing model
        $is_multiple_role = function_exists('whols_get_pricing_model') && whols_get_pricing_model() === 'multiple_role';
        $roles = whols_roles_dropdown_options();
        
        if (empty($roles)) {
            return '';
        }
        
        $html = '<div class="whols-role-approval-links">';
        
        if ($is_multiple_role) {
            // For multiple_role, show all roles
            $html .= '<p style="font-weight: bold; margin-bottom: 10px;">' . __('Approve as specific role:', 'whols') . '</p>';
            $html .= '<ul style="list-style: none; padding: 0; margin: 0;">';
            
            foreach ($roles as $role_slug => $role_name) {
                $token = $this->generate_token($user_request_id, 'approve', $role_slug);
                $url = add_query_arg([
                    'action' => 'whols_secure_action',
                    'token' => urlencode($token)
                ], admin_url('admin-ajax.php'));
                
                $html .= '<li style="margin-bottom: 5px;"><a href="' . esc_url($url) . '" style="display: inline-block;">' . esc_html($role_name) . '</a></li>';
            }
            
            $html .= '</ul>';
        } else {
            // For single_role, only show default role
            $default_role_slug = 'whols_default_role';
            $default_role_name = isset($roles[$default_role_slug]) ? $roles[$default_role_slug] : __('Default Wholesaler Role', 'whols');
            
            $token = $this->generate_token($user_request_id, 'approve', $default_role_slug);
            $url = add_query_arg([
                'action' => 'whols_secure_action',
                'token' => urlencode($token)
            ], admin_url('admin-ajax.php'));
            
            $html .= '<p style="margin-bottom: 10px;">' . __('Click to approve this request:', 'whols') . '</p>';
            $html .= '<a href="' . esc_url($url) . '" style="display: inline-block; padding: 8px 16px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 3px; font-weight: bold;">' . 
                sprintf(__('Approve as %s', 'whols'), esc_html($default_role_name)) . 
                '</a>';
        }
        
        $html .= '</div>';
        
        return $html;
    }
}