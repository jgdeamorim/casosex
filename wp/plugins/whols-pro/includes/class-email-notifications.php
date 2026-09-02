<?php
namespace Whols_Pro;
use const Whols_Pro\PL_PATH;

/**
 * Email Notifications
 */
class Email_Notifications {
    private static $instance = null;    

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor.
     */
    public function __construct() {
        add_action('whols_user_registration_success', array($this, 'user_registration_email_for_admin'), 10, 2);
        add_action( 'whols_user_registration_success', array( $this, 'user_registration_email_for_user' ));

        // Send approved / rejection mail
        add_filter( 'wp_insert_post_data' , array( $this, 'approved_n_rejection_mail'), '99', 2 );

        // Send email notification for either quote request or conversation
        add_action( 'whols_after_raq_form_submit', array( $this, 'send_raq_email_notification' ) );

        // Send email notifications for conversation messages
        add_action( 'whols_conversation_message_sent', array( $this, 'handle_conversation_message_notification' ), 10, 2 );

        // Send email notifications for wallet transactions
        add_action( 'whols_wallet_credited', array( $this, 'send_wallet_credit_email_notification' ), 10, 2 );
        add_action( 'whols_wallet_debited', array( $this, 'send_wallet_debit_email_notification' ), 10, 2 );

        // Add AJAX handler for secure actions
        add_action('wp_ajax_nopriv_whols_secure_action', array($this, 'handle_secure_action'));
        add_action('wp_ajax_whols_secure_action', array($this, 'handle_secure_action'));
    }

    /**
     * Handle secure action from email links
     */
    public function handle_secure_action() {
        // Check if token is provided
        if (empty($_GET['token'])) {
            wp_die(__('Invalid request.', 'whols'));
        }
        
        // Process the action
        $result = Secure_Action_Links::get_instance()->process_action(urldecode($_GET['token']));
        
        // Display result page
        $this->display_action_result_page($result);
        wp_die();
    }

    /**
     * Display result page after processing action
     * 
     * @param string $message Result message
     * @return void
     */
    public function display_action_result_page( $message ) {
        // Enqueue WordPress styles
        wp_enqueue_style( 'wp-admin' );
        
        // Process message to determine status type
        $status_type = 'info';
        $icon = '🔔';
        
        if ( false !== strpos( $message, 'success' ) ) {
            $status_type = 'success';
            $icon = '✅';
        } elseif ( false !== strpos( $message, 'expired' ) || false !== strpos( $message, 'invalid' ) || false !== strpos( $message, 'not found' ) ) {
            $status_type = 'error';
            $icon = '❌';
        }
        
        // Start output buffering
        ob_start();
        
        // Include header
        $this->get_action_result_header();
        ?>
        <div class="whols-container">
            <div class="whols-status-icon whols-<?php echo esc_attr( $status_type ); ?>"><?php echo esc_html( $icon ); ?></div>
            <h1><?php esc_html_e( 'Wholesaler Request Action', 'whols-pro' ); ?></h1>
            <p><?php echo esc_html( $message ); ?></p>
            <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=whols_user_request' ) ); ?>" class="whols-button"><?php esc_html_e( 'View All Requests', 'whols-pro' ); ?></a>
        </div>
        <?php
        // Include footer
        $this->get_action_result_footer();
        
        // Output the buffered content
        echo ob_get_clean();
    }
    
    /**
     * Output the header for action result page
     *
     * @return void
     */
    private function get_action_result_header() {
        ?>
        <!DOCTYPE html>
        <html <?php language_attributes(); ?>>
        <head>
            <meta charset="<?php bloginfo( 'charset' ); ?>">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title><?php echo esc_html( get_bloginfo( 'name' ) ); ?> - <?php esc_html_e( 'Wholesaler Request', 'whols-pro' ); ?></title>
            <?php wp_head(); ?>
            <style>
                :root {
                    --whols-primary: #2271b1;
                    --whols-primary-hover: #135e96;
                    --whols-text: #3c434a;
                    --whols-background: #f0f0f1;
                    --whols-border: #c3c4c7;
                    --whols-spacing-sm: 10px;
                    --whols-spacing-md: 20px;
                    --whols-spacing-lg: 40px;
                    --whols-spacing-xl: 100px;
                    --whols-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
                    --whols-radius: 4px;
                }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                    background-color: var(--whols-background);
                    margin: 0;
                    padding: 0;
                    color: var(--whols-text);
                }
                
                .whols-container {
                    max-width: 700px;
                    margin: var(--whols-spacing-xl) auto;
                    padding: var(--whols-spacing-lg);
                    background: #fff;
                    border: 1px solid var(--whols-border);
                    box-shadow: var(--whols-shadow);
                    border-radius: var(--whols-radius);
                    text-align: center;
                }
                
                .whols-container h1 {
                    color: var(--whols-text);
                    font-weight: 500;
                    margin-top: 0;
                    font-size: 24px;
                }
                
                .whols-container p {
                    color: var(--whols-text);
                    font-size: 16px;
                    line-height: 1.5;
                }
                
                .whols-button {
                    display: inline-block;
                    background: var(--whols-primary);
                    border-color: var(--whols-primary);
                    color: #fff;
                    text-decoration: none;
                    font-size: 14px;
                    line-height: 2;
                    min-height: 30px;
                    margin: 0;
                    padding: 5px var(--whols-spacing-md);
                    cursor: pointer;
                    border-width: 1px;
                    border-style: solid;
                    border-radius: var(--whols-radius);
                    margin-top: var(--whols-spacing-md);
                }
                
                .whols-button:hover {
                    background: var(--whols-primary-hover);
                    border-color: var(--whols-primary-hover);
                }
                
                .whols-status-icon {
                    font-size: 48px;
                    margin-bottom: var(--whols-spacing-md);
                }
                
                .whols-success {
                    color: #4CAF50;
                }
                
                .whols-error {
                    color: #f44336;
                }
                
                .whols-info {
                    color: var(--whols-primary);
                }
            </style>
        </head>
        <body>
        <?php
    }
    
    /**
     * Output the footer for action result page
     *
     * @return void
     */
    private function get_action_result_footer() {
        ?>
        <?php wp_footer(); ?>
        </body>
        </html>
        <?php
    }

    /**
     * Send approved / rejection mail
     */
    public function approved_n_rejection_mail( $data , $postarr ) {
        if($data['post_type'] != 'whols_user_request'){
            return $data;
        }

        $meta_prev   = get_post_meta($postarr['ID'], 'whols_user_request_meta', true);
        $status_prev = isset($meta_prev['status']) ? $meta_prev['status'] : '';

        $meta_new    = isset($postarr['whols_user_request_meta']) ? $postarr['whols_user_request_meta'] : array();
        $status_new  = isset($meta_new['status']) ? $meta_new['status'] : '';

        if($status_prev != $status_new){
            $user_id = $meta_prev['user_id'];

            if($status_new == 'approve'){
                $enable_email_notification = whols_get_option('enable_approved_notification');
                $subject                   = whols_get_option('approved_email_subject');
                $body                      = whols_get_option('approved_email_message');
                $user                      = get_user_by( 'ID', $user_id );

                if( $enable_email_notification && $user ){
                    $posted_data = [
                        'name' => $user->first_name,
                        'email' => $user->user_email,
                        'date' => gmdate( 'Y-m-d', strtotime( $user->user_registered ) ),
                        'time' => gmdate( 'H:i:s', strtotime( $user->user_registered ) )
                    ];

                    // Subject
                    $subject = stripslashes( html_entity_decode($subject, ENT_QUOTES, 'UTF-8' ) );
                    $subject = $this->replace_placeholders($subject, $posted_data, $user_id);

                    // Body
                    $body = $this->replace_placeholders($body, $posted_data, $user_id);
                    $body = wpautop($body);

                    // send the mail
                    $to = $user->user_email;
                    $headers[] = 'Content-Type: text/html; charset=UTF-8';

                    wp_mail( $to, $subject, $body, $headers );
                }
            } elseif($status_new == 'reject'){
                $enable_email_notification = whols_get_option('enable_rejection_notification');
                $subject                   = whols_get_option('rejection_email_subject');
                $body                      = whols_get_option('rejection_email_message');
                $user                      = get_user_by( 'ID', $user_id );

                if( $enable_email_notification && $user ){
                    $posted_data = [
                        'name' => $user->first_name,
                        'email' => $user->user_email,
                        'date' => gmdate( 'Y-m-d', strtotime( $user->user_registered ) ),
                        'time' => gmdate( 'H:i:s', strtotime( $user->user_registered ) )
                    ];
                    
                    // subject
                    $subject = stripslashes( html_entity_decode($subject, ENT_QUOTES, 'UTF-8' ) );
                    $subject = $this->replace_placeholders($subject, $posted_data, $user_id);

                    // body
                    $body = $this->replace_placeholders($body, $posted_data, $user_id);
                    $body = wpautop($body);

                    // send the mail
                    $to = $user->user_email;
                    $headers[] = 'Content-Type: text/html; charset=UTF-8';

                    wp_mail( $to, $subject, $body, $headers );
                }
            }
        }

        return $data;
    }

    /**
     * Notification for admin
     */
    public function user_registration_email_for_admin($user_id, $wholesaler_req_id) {
        $enable_email_notification = whols_get_option('enable_registration_notification_for_admin');
        $subject                   = whols_get_option('registration_notification_subject_for_admin');
        $body                      = whols_get_option('registration_notification_message_for_admin');
        $user                      = get_user_by('ID', $user_id);
        $custom_emails             = whols_get_option('registration_notification_recipients'); // Comma separated emails

        // Ensure body is not empty
        if (empty(trim($body))) {
            $body = 'A new wholesaler registration request has been submitted.';
        }

        // Check if email notification is enabled, user exists, and body has content
        if ($enable_email_notification && $user) {
            // Check pricing model
            $is_multiple_role = function_exists('whols_get_pricing_model') && whols_get_pricing_model() === 'multiple_role';
            
            // Posted data
            $posted_data = [
                'name' => $user->first_name,
                'email' => $user->user_email,
                'message' => '',
                'date' => gmdate('Y-m-d', strtotime($user->user_registered)),
                'time' => gmdate('H:i:s', strtotime($user->user_registered))
            ];

            // Generate action links
            $action_links = Secure_Action_Links::get_instance()->generate_action_links($wholesaler_req_id);
                
            // Add reject link to posted data
            $posted_data['reject_link'] = $action_links['reject_link'];
            
            // For single_role pricing model, add {approve_link} if available
            if (!$is_multiple_role && isset($action_links['approve_link'])) {
                $posted_data['approve_link'] = $action_links['approve_link'];
            }

            // Add role-specific approval links based on pricing model
            if (function_exists('whols_roles_dropdown_options')) {
                $roles = whols_roles_dropdown_options();
                
                if ($is_multiple_role) {
                    // For multiple_role, add all role-specific links
                    foreach ($roles as $role_slug => $role_name) {
                        if (isset($action_links['approve_link_' . $role_slug])) {
                            $posted_data['approve_link_' . $role_slug] = $action_links['approve_link_' . $role_slug];
                        }
                    }
                } else {
                    // For single_role, only add default role link
                    $default_role = 'whols_default_role';
                    if (isset($action_links['approve_link_' . $default_role])) {
                        $posted_data['approve_link_' . $default_role] = $action_links['approve_link_' . $default_role];
                    }
                }
                
                // Add a list of role-specific approval links
                $posted_data['role_approval_links'] = Secure_Action_Links::get_instance()->generate_role_links_html($wholesaler_req_id);
            }

            // Subject
            $subject = stripslashes(html_entity_decode($subject, ENT_QUOTES, 'UTF-8'));
            $subject = $this->replace_placeholders($subject, $posted_data, $user_id);

            // Body
            $body = $this->replace_placeholders($body, $posted_data, $user_id);
            $body = wpautop($body);

            // send the mail
            $to = get_option('admin_email');
            if ($custom_emails) {
                $to = explode(',', $custom_emails);
            }

            $headers = array();
            $headers[] = 'Content-Type: text/html; charset=UTF-8';

            wp_mail($to, $subject, $body, $headers);
        }
    }
    /**
     * Notification for user
     */
    public function user_registration_email_for_user( $user_id ){
        $enable_email_notification = whols_get_option('enable_registration_notification_for_user');
        $subject                   = whols_get_option('registration_notification_subject_for_user');
        $body                      = whols_get_option('registration_notification_message_for_user');
        $user                      = get_user_by( 'ID', $user_id );

        // Ensure body is not empty
        if(empty(trim($body))) {
            $body = 'Thank you for your wholesaler registration request. We will review your application and get back to you soon.';
        }

        // Check if email notification is enabled, user exists, and body has content
        if( $enable_email_notification && $user ){
            $posted_data = [
                'name' => $user->first_name,
                'email' => $user->user_email,
                'message' => '',
                'date' => gmdate( 'Y-m-d', strtotime( $user->user_registered ) ),
                'time' => gmdate( 'H:i:s', strtotime( $user->user_registered ) )
            ];

            // Subject
            $subject = stripslashes( html_entity_decode($subject, ENT_QUOTES, 'UTF-8' ) );
            $subject = $this->replace_placeholders($subject, $posted_data, $user_id);

            // Body
            $body = $this->replace_placeholders($body, $posted_data, $user_id);
            $body = wpautop($body);

            // send the mail
            $to = $user->user_email;
            $headers = array();
            $headers[] = 'Content-Type: text/html; charset=UTF-8';

            wp_mail( $to, $subject, $body, $headers );
        }
    }

    public function send_raq_email_notification($posted_data) {
        $defaults = array('location' => '');
        $posted_data = wp_parse_args($posted_data, $defaults);

        $email_type = $posted_data['location'] === 'cart' ? 'raq' : 'conversation';

        if ($this->should_send_raq_email( $posted_data )) {
            $email_data = $this->prepare_email_data($email_type, $posted_data);
            $this->send_email($email_data);
        }
    }

    public function should_send_raq_email( $posted_data ) {
        $return_value = false;

        $enable_raq_email_notification = whols_get_option('enable_raq_email_notification');
        $enable_conversation_email_notification = whols_get_option('enable_conversation_email_notification');

		// Location is cart, raq email notification is enabled
        if( $posted_data['location'] == 'cart' && $enable_raq_email_notification ){
            $return_value = true;
        }

		// Location is conversation, conversation email notification is enabled
        if( $posted_data['location'] == 'conversation' && $enable_conversation_email_notification ){
            $return_value = true;
        }

        return $return_value;
    }

    public function prepare_email_data($email_type, $posted_data) {
        $defaults = array(
            'raq_new_request_email_subject' => __('[{site_title}] New Quote Request from {name}', 'whols'),
            'raq_new_request_email_body' => __('
            Name: {name}
            Email: {email}
            Subject: {subject}
            Message: {message}
            Products: {products}', 'whols'),

            'conversation_start_email_subject' => __('[{site_title}] New Conversation from {name}', 'whols'),
            'conversation_start_email_body' => __('Name: {name}
            Email: {email}
            Subject: {subject}
            Message: {message}
            ', 'whols'),
        );

        if(whols_get_option('raq_new_request_email_subject')){
            $defaults['raq_new_request_email_subject'] = whols_get_option('raq_new_request_email_subject');
        }

        if(whols_get_option('raq_new_request_email_body')){
            $defaults['raq_new_request_email_body'] = whols_get_option('raq_new_request_email_body');
        }

        if(whols_get_option('conversation_start_email_subject')){
            $defaults['conversation_start_email_subject'] = whols_get_option('conversation_start_email_subject');
        }

        if(whols_get_option('conversation_start_email_body')){
            $defaults['conversation_start_email_body'] = whols_get_option('conversation_start_email_body');
        }

        $subject_key = $email_type === 'raq' ? 'raq_new_request_email_subject' : 'conversation_start_email_subject';
        $body_key = $email_type === 'raq' ? 'raq_new_request_email_body' : 'conversation_start_email_body';

        $subject = $this->replace_placeholders($defaults[$subject_key], $posted_data);
        $body = $this->replace_placeholders($defaults[$body_key], $posted_data);



        if ($email_type === 'raq') {
            $body = $this->add_products_data($body, $posted_data);
            $body = $this->get_raq_prepared_body($body); // html, head, body
        } else {
            $body = wpautop($body);
        }

        return [
            'to' => get_option('admin_email'),
            'subject' => $subject,
            'body' => $body,
            'headers' => ['Content-Type: text/html; charset=UTF-8'],
        ];
    }

    public function get_raq_prepared_body( $body ) {
        ob_start();
        ?>
        <html>
            <head>
                <style>
                    table {
                        border-collapse: collapse;
                        margin: 20px 0;
                        font-size: 16px;
                        font-family: Arial, sans-serif;
                        text-align: left;
                    }
                    table, th, td {
                        border: 1px solid #dddddd;
                        padding: 8px;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <?php echo wpautop($body); ?>
            </body>
        </html>
        <?php
        return ob_get_clean();
    }
    
    public function get_common_placeholders_name() {
        return [
            '{name}',
            '{email}',
            '{date}',
            '{time}',
            '{site_title}',
            '{shop_url}',
        ];
    }

    /**
     * Replace email template placeholders including action links
     * 
     * @param string $content Template content with placeholders
     * @param array $posted_data Data to replace placeholders with
     * @return string Processed content with placeholders replaced
     */
    public function replace_placeholders($content, $posted_data, $user_id = null) {
        // Check pricing model
        $is_multiple_role = function_exists('whols_get_pricing_model') && whols_get_pricing_model() === 'multiple_role';
        
        $basic_placeholders = [
            // Common for all
            '{name}' => $posted_data['name'] ?? '',
            '{email}' => $posted_data['email'] ?? '',
            '{message}' => $posted_data['message'] ?? '',
            '{date}' => date_i18n(get_option('date_format')),
            '{time}' => date_i18n(get_option('time_format')),
            '{site_title}' => get_bloginfo('name'),
            '{shop_url}' => function_exists('wc_get_page_id') ? get_permalink(wc_get_page_id('shop')) : '',

            // For conversation
            '{subject}' => !empty($posted_data['subject']) ? $posted_data['subject'] : '',
            '{conversation_title}' => !empty($posted_data['conversation_title']) ? $posted_data['conversation_title'] : '',

            // For registration
            '{reject_link}' => !empty($posted_data['reject_link']) ? $posted_data['reject_link'] : '',
            '{role_approval_links}' => !empty($posted_data['role_approval_links']) ? $posted_data['role_approval_links'] : '',

            // for Wallet
            '{wallet_credit_amount}' => !empty($posted_data['wallet_credit_amount']) ? $posted_data['wallet_credit_amount'] : '',
            '{wallet_debit_amount}' => !empty($posted_data['wallet_debit_amount']) ? $posted_data['wallet_debit_amount'] : '',
        ];
        
        // For single_role pricing model, add {approve_link} placeholder
        if (!$is_multiple_role && isset($posted_data['approve_link'])) {
            $basic_placeholders['{approve_link}'] = $posted_data['approve_link'];
        }
        
        // Add role-specific approval links
        if (function_exists('whols_roles_dropdown_options')) {
            $roles = whols_roles_dropdown_options();
            
            if ($is_multiple_role) {
                // For multiple_role pricing model, add all role placeholders
                foreach ($roles as $role_slug => $role_name) {
                    $placeholder_key = '{approve_link_' . $role_slug . '}';
                    $basic_placeholders[$placeholder_key] = !empty($posted_data['approve_link_' . $role_slug]) ? 
                        $posted_data['approve_link_' . $role_slug] : '';
                }
            } else {
                // For single_role pricing model, only add default role placeholder
                $default_role = 'whols_default_role';
                $placeholder_key = '{approve_link_' . $default_role . '}';
                if (!empty($posted_data['approve_link_' . $default_role])) {
                    $basic_placeholders[$placeholder_key] = $posted_data['approve_link_' . $default_role];
                }
            }
        }

        $all_placeholders = array_merge(
            $basic_placeholders,
            $this->get_registration_form_field_placeholders($user_id)
        );

        return str_replace(array_keys($all_placeholders), array_values($all_placeholders), $content);
    }

    public function get_registration_form_field_placeholders($user_id = null){
        $placeholders = [];

        // Prepare custom registration fields
        $all_fields = whols_get_option('registration_fields');

        foreach( $all_fields as $field ){
            $placeholder_name = '';
            $form_field_key = '';
            $form_field_value = '';

            // Skip password field for security reasons
            if( !empty($field['field']) && $field['field'] == 'reg_password' ){
                continue;
            }

            // Determine placeholder name and field key
            if( $field['field'] == 'custom' && !empty($field['custom_field_name']) ){
                $placeholder_name = '{' . $field['custom_field_name'] . '}';
                $form_field_key = '_whols_' . $field['custom_field_name'];
            } else {
                $placeholder_name = '{' . $field['field'] . '}';
                $form_field_key = $field['field'];
            }

            // Get field value from different sources
            if( $user_id ) {
                // Get value from user meta for existing users
                $form_field_value = $this->get_field_value_from_user($user_id, $field, $form_field_key);
            } elseif( !empty($_REQUEST[$form_field_key]) ) {
                // Get value from request for new registrations
                $form_field_value = $this->sanitize_field_value($_REQUEST[$form_field_key], $field);
            }

            // Add placeholder if value exists
            if( !empty($placeholder_name) && !empty($form_field_value) ){
                $placeholders[$placeholder_name] = $form_field_value;
            }
        }

        return $placeholders;
    }

    /**
     * Get field value from user meta
     *
     * @param int $user_id User ID
     * @param array $field Field configuration
     * @param string $form_field_key Field key
     * @return string Field value
     */
    private function get_field_value_from_user($user_id, $field, $form_field_key) {
        $value = '';

        // Handle file upload fields
        if( !empty($field['type']) && $field['type'] == 'file' ){
            $file_data = get_user_meta($user_id, $form_field_key, true);
            if( !empty($file_data) && is_array($file_data) && !empty($file_data['url']) ) {
                $value = $file_data['url']; // Return file URL for email
            }
        }
        // Handle special fields mapping
        elseif( in_array($field['field'], ['reg_name', 'reg_email', 'reg_username', 'last_name']) ) {
            $user = get_user_by('ID', $user_id);
            if( $user ) {
                switch($field['field']) {
                    case 'reg_name':
                        $value = $user->first_name;
                        break;
                    case 'last_name':
                        $value = $user->last_name;
                        break;
                    case 'reg_email':
                        $value = $user->user_email;
                        break;
                    case 'reg_username':
                        $value = $user->user_login;
                        break;
                }
            }
        }
        // Handle wholesaler role field
        elseif( $field['field'] == '_whols_role' ) {
            $value = get_user_meta($user_id, $form_field_key, true);
            // Get role label if available
            if( $value && !empty($field['options']) ) {
                $options = $this->parse_field_options($field['options']);
                $value = isset($options[$value]) ? $options[$value] : $value;
            }
        }
        // Handle all other fields from user meta
        else {
            $value = get_user_meta($user_id, $form_field_key, true);

            // Handle select/radio fields - get label instead of value
            if( $value && in_array($field['type'], ['select', 'radio']) && !empty($field['options']) ) {
                $options = $this->parse_field_options($field['options']);
                $value = isset($options[$value]) ? $options[$value] : $value;
            }
            // Handle checkbox fields
            elseif( $field['type'] == 'checkbox' && is_array($value) ) {
                $value = implode(', ', $value);
            }
        }

        return $value;
    }

    /**
     * Sanitize field value based on field type
     *
     * @param mixed $value Field value
     * @param array $field Field configuration
     * @return string Sanitized value
     */
    private function sanitize_field_value($value, $field) {
        $field_type = isset($field['type']) ? $field['type'] : 'text';

        switch($field_type) {
            case 'textarea':
                return sanitize_textarea_field($value);
            case 'checkbox':
                if( is_array($value) ) {
                    return implode(', ', array_map('sanitize_text_field', $value));
                }
                return sanitize_text_field($value);
            case 'file':
                // For new uploads, we might not have the file URL yet
                return ''; // File handling happens separately
            default:
                return sanitize_text_field($value);
        }
    }

    /**
     * Parse field options string into array
     *
     * @param string $options_string Options string with format "key|label" per line
     * @return array Associative array of options
     */
    private function parse_field_options($options_string) {
        $options = [];
        if( !empty($options_string) ) {
            $lines = explode("\n", $options_string);
            foreach($lines as $line) {
                $parts = explode('|', trim($line));
                if( count($parts) == 2 ) {
                    $options[trim($parts[0])] = trim($parts[1]);
                }
            }
        }
        return $options;
    }

    public function add_products_data($raq_body_html, $posted_data) {
        $products_data = json_decode(wp_unslash($posted_data['products_data']), true);
        $products_data_html = '';

        if ($products_data) {
            ob_start();
            include PL_PATH . '/includes/request-a-quote/html-product-data.php';
            $products_data_html = ob_get_clean();
        }

        return str_replace('{products}', $products_data_html, $raq_body_html);
    }

    public function send_email($email_data) {
		$to      = $email_data['to'];
		$subject = $email_data['subject'];
		$body    = $email_data['body'];

		if( whols_get_option('show_wholesale_price_for') === 'administrator' ){
			error_log("======(Whols)- Email sent: To: $to, Sub: $subject, Body: $body ======");
		}

        wp_mail($to, $subject, $body, $email_data['headers']);
    }
    
    /**
     * Send wallet credit notification to customer
     *
     * @param int $user_id User ID
     * @param float $amount Amount credited
     * @return void
     */
    public function send_wallet_credit_email_notification($user_id, $amount) {      
        // Get user data
        $user = get_userdata($user_id);
        if (!$user) {
            return;
        }
        
        // Format amount with currency symbol
        $formatted_amount = wc_price($amount);
        
        // Prepare email data
        $posted_data = array(
            'name' => $user->display_name,
            'email' => $user->user_email,
            'amount' => $formatted_amount,
            'date' => date_i18n(get_option('date_format')),
            'time' => date_i18n(get_option('time_format')),
            'wallet_credit_amount' => $formatted_amount
        );
        
        // Get email content from settings
        $subject = whols_get_option('wallet_credit_email_subject');
        $body = whols_get_option('wallet_credit_email_message');
        
        // Replace placeholders
        $subject = $this->replace_placeholders($subject, $posted_data);
        $body = $this->replace_placeholders($body, $posted_data);
        
        // Send email
        $email_data = array(
            'to' => $user->user_email,
            'subject' => $subject,
            'body' => $body,
            'headers' => array('Content-Type: text/html; charset=UTF-8')
        );
        
        $this->send_email($email_data);
    }
    
    /**
     * Send wallet debit notification to customer
     *
     * @param int $user_id User ID
     * @param float $amount Amount debited
     * @return void
     */
    public function send_wallet_debit_email_notification($user_id, $amount) {
        // Get user data
        $user = get_userdata($user_id);
        if (!$user) {
            return;
        }
        
        // Format amount with currency symbol
        $formatted_amount = wc_price($amount);
        
        // Prepare email data
        $posted_data = array(
            'name' => $user->display_name,
            'email' => $user->user_email,
            'amount' => $formatted_amount,
            'date' => date_i18n(get_option('date_format')),
            'time' => date_i18n(get_option('time_format')),
            'wallet_debit_amount' => $formatted_amount
        );
        
        // Get email content from settings
        $subject = whols_get_option('wallet_debit_email_subject');
        $body = whols_get_option('wallet_debit_email_message');
        
        // Replace placeholders
        $subject = $this->replace_placeholders($subject, $posted_data);
        $body = $this->replace_placeholders($body, $posted_data);
        
        // Send email
        $email_data = array(
            'to' => $user->user_email,
            'subject' => $subject,
            'body' => $body,
            'headers' => array('Content-Type: text/html; charset=UTF-8')
        );
        
        $this->send_email($email_data);
    }
    
    /**
     * Send wallet refund notification to customer
     *
     * @param int $user_id User ID
     * @param float $amount Amount refunded
     * @return void
     */
    public function send_wallet_refund_email_notification($user_id, $amount) {
        // Get user data
        $user = get_userdata($user_id);
        if (!$user) {
            return;
        }
        
        // Format amount with currency symbol
        $formatted_amount = wc_price($amount);
        
        // Prepare email data
        $posted_data = array(
            'name' => $user->display_name,
            'email' => $user->user_email,
            'amount' => $formatted_amount,
            'date' => date_i18n(get_option('date_format')),
            'time' => date_i18n(get_option('time_format')),
            'wallet_refund_amount' => $formatted_amount
        );
        
        // Get email content from settings
        $subject = whols_get_option('wallet_refund_email_subject');
        $body = whols_get_option('wallet_refund_email_message');
        
        // Replace placeholders
        $subject = $this->replace_placeholders($subject, $posted_data);
        $body = $this->replace_placeholders($body, $posted_data);
        
        // Send email
        $email_data = array(
            'to' => $user->user_email,
            'subject' => $subject,
            'body' => $body,
            'headers' => array('Content-Type: text/html; charset=UTF-8')
        );
        
        $this->send_email($email_data);
    }

    /**
     * Handle conversation notifications based on sender type
     *
     * @param array $meta_data Message metadata
     * @param int $post_id Conversation post ID
     * @return void
     */
    public function handle_conversation_message_notification($meta_data, $post_id) {
        // Determine sender type and route to appropriate notification method
        if (!empty($meta_data['sendar_type'])) {
            if ($meta_data['sendar_type'] === 'client') {
                // Customer sent a message, notify admin
                $this->send_conversation_message_notification_to_admin($meta_data, $post_id);
            } elseif ($meta_data['sendar_type'] === 'shop_manager') {
                // Admin sent a message, notify customer
                $this->send_conversation_message_notification_to_customer($meta_data, $post_id);
            }
        }
    }

    /**
     * Send email notification to admin when a customer sends a new message
     *
     * @param array $meta_data Message metadata
     * @param int $post_id Conversation post ID
     * @return void
     */
    public function send_conversation_message_notification_to_admin($meta_data, $post_id) {

        // Check if admin notification is enabled
        $enable_notification = whols_get_option('enable_conversation_new_message_for_admin');
        if (!$enable_notification) {
            return;
        }

        // Get conversation post details
        $conversation = get_post($post_id);
        if (!$conversation) {
            return;
        }

        // Prepare email data
        $posted_data = array(
            'name' => $meta_data['name'],
            'email' => $meta_data['email'],
            'message' => $meta_data['message'],
            'date' => date_i18n(get_option('date_format'), $meta_data['time']),
            'time' => date_i18n(get_option('time_format'), $meta_data['time']),
            'subject' => $conversation->post_title,
            'location' => 'conversation',
            'conversation_title' => $conversation->post_title
        );

        // Get admin email
        $admin_email = get_option('admin_email');

        // Get email content from settings
        $subject = whols_get_option('conversation_new_message_for_admin_subject');
        $body = whols_get_option('conversation_new_message_for_admin_message');

        // Replace placeholders
        $subject = $this->replace_placeholders($subject, $posted_data);
        $body = $this->replace_placeholders($body, $posted_data);

        // Send email
        $email_data = array(
            'to' => $admin_email,
            'subject' => $subject,
            'body' => $body,
            'headers' => array('Content-Type: text/html; charset=UTF-8')
        );

        $this->send_email($email_data);
    }

    /**
     * Send email notification to customer when admin sends a new message
     *
     * @param array $meta_data Message metadata
     * @param int $post_id Conversation post ID
     * @return void
     */
    public function send_conversation_message_notification_to_customer($meta_data, $post_id) {
        // Check if customer notification is enabled
        $enable_notification = whols_get_option('enable_conversation_new_message_for_user');
        if (!$enable_notification) {
            return;
        }

        // Get conversation post details
        $conversation = get_post($post_id);
        if (!$conversation) {
            return;
        }

        // Get customer email from conversation post meta
        $customer_id = get_post_meta($post_id, '_client_id', true);
        $customer = get_userdata($customer_id);
        if (!$customer) {
            return;
        }

        // Prepare email data
        $posted_data = array(
            'name' => $customer->display_name,
            'email' => $customer->user_email,
            'message' => $meta_data['message'],
            'date' => date_i18n(get_option('date_format'), $meta_data['time']),
            'time' => date_i18n(get_option('time_format'), $meta_data['time']),
            'subject' => $conversation->post_title,
            'location' => 'conversation',
            'conversation_title' => $conversation->post_title
        );

        // Get email content from settings
        $subject = whols_get_option('conversation_new_message_for_user_subject');
        $body = whols_get_option('conversation_new_message_for_user_message');

        // Replace placeholders
        $subject = $this->replace_placeholders($subject, $posted_data);
        $body = $this->replace_placeholders($body, $posted_data);

        // Send email
        $email_data = array(
            'to' => $customer->user_email,
            'subject' => $subject,
            'body' => $body,
            'headers' => array('Content-Type: text/html; charset=UTF-8')
        );

        $this->send_email($email_data);
    }
}

// New instance
Email_Notifications::get_instance();