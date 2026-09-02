<?php
namespace Whols_Pro;
use const Whols_Pro\PL_PATH;

class Ajax_Actions {
    // Plugin settings
    public $pricing_model;
    public $default_wholesale_role;
    public $enable_auto_approve;
    public $redirect_page_url;
    public $successful_message_for_auto_approve;
    public $successful_message_for_manual_approve;

    public $wc_user_fields = array();
    public $reg_inputs     = array();
    public $reg_first_name      = '';
    public $reg_last_name       = '';
    public $reg_username        = '';
    public $reg_email           = '';
    public $reg_role            = '';
    public $reg_pass            = '';

    public $additional_fields         = array();
    public $validation_result         = array();
    public $reg_successfull_message           = '';
    public $role_to_be_assigned       = 'subscriber';
    public $role_to_be_selected       = '';
    public $create_post_args          = array();
    public $wholesaler_request_status = '';

    // Other variables
    public $user_id = 0;
    public $wholesaler_req_id = 0;


    public function __construct() {
        $this->pricing_model                         = whols_get_option('pricing_model');
        $this->default_wholesale_role                = whols_get_option('default_wholesale_role');
        $this->enable_auto_approve                   = whols_get_option('enable_auto_approve_customer_registration');
        $this->redirect_page_url                     = whols_get_option('redirect_page_customer_registration');
        $this->successful_message_for_auto_approve   = whols_get_option('registration_successful_message_for_auto_approve');
        $this->successful_message_for_manual_approve = whols_get_option('registration_successful_message_for_manual_approve');
        $this->wc_user_fields                        = $this->get_wc_user_fields();

        // Registration form submission
        add_action( 'wp_ajax_whols_ajax_user_register', array( $this, 'ajax_registration_handler') );
        add_action( 'wp_ajax_nopriv_whols_ajax_user_register', array($this, 'ajax_registration_handler') );

        // Request a quote / Conversation
        add_action( 'wp_ajax_whols_open_raq_modal', array( $this, 'open_raq_modal') );
        add_action( 'wp_ajax_nopriv_whols_open_raq_modal', array( $this, 'open_raq_modal') );

        add_action( 'wp_ajax_whols_request_raq_form_submit', array( $this, 'raq_form_submit') );
        add_action( 'wp_ajax_nopriv_whols_request_raq_form_submit', array( $this, 'raq_form_submit') );

        add_action( 'wp_ajax_whols_raq_send_message', array( $this, 'send_message') );

        // Get email placeholders
        add_action( 'wp_ajax_whols_get_email_placeholders', array( $this, 'get_email_placeholders') );
    }

    public function ajax_registration_handler(){
        // Verify nonce
        $nonce = sanitize_text_field($_REQUEST['nonce']);

        if ( !wp_verify_nonce( $nonce, 'whols_nonce' ) ) {
            wp_send_json_error(array(
                'message' => esc_html__( 'Oops! Something went wrong while checking the security token. Please try again or refresh the page, and if the issue persists, get in touch with us!', 'whols' )
            ));
        }

        $post_data               = wp_unslash($_POST);
        unset($post_data['woocommerce-login-nonce']);
        unset($post_data['_wpnonce']);
        unset($post_data['woocommerce-reset-password-nonce']);
        unset($post_data['action']);
        unset($post_data['nonce']);

        $this->reg_inputs        = !empty($post_data) ? $post_data : array();
        $this->validation_result = $this->get_user_inputs_validation_status( $this->reg_inputs );

        $this->reg_first_name   =   !empty($this->reg_inputs['reg_name']) ? sanitize_text_field( $this->reg_inputs['reg_name'] ) : '';
        $this->reg_last_name    =   !empty($this->reg_inputs['last_name']) ? sanitize_text_field( $this->reg_inputs['last_name'] ) : '';
        $this->reg_username     =   !empty($this->reg_inputs['reg_username']) ? sanitize_text_field( $this->reg_inputs['reg_username'] ) : '';
        $this->reg_email        =   !empty($this->reg_inputs['reg_email']) ? sanitize_email( $this->reg_inputs['reg_email'] ) : '';
        $this->reg_pass         =   !empty($this->reg_inputs['reg_password']) ? sanitize_user( $this->reg_inputs['reg_password'] ) : '';

        $recapthca_token = !empty($post_data['recaptcha_token']) ? sanitize_text_field($post_data['recaptcha_token']) : '';
        if( $recapthca_token ){
            $verification_status = $this->verify_recaptcha_token( $recapthca_token );

            if( isset($verification_status['success']) && !$verification_status['success'] ){
                wp_send_json_error( [
                    'registerauth' => false,
                    'message'      => $verification_status['message']
                ]);
            }
        }

        if( $this->validation_result == false || empty($this->validation_result['registerauth']) ){
            wp_send_json_error( [
                'registerauth' => false,
                'message'      => !empty($this->validation_result['message']) ? $this->validation_result['message'] : esc_html__('Oops, there was an issue. Please double-check your information and try again.', 'whols')
            ]);
        }

        // Validation passed, proceed further


        if( !empty($this->reg_inputs['_whols_role'])  ){
            $this->role_to_be_selected    = $this->reg_inputs['_whols_role'];
        }

        // Update properties based on different criteria
        $this->update_properties();

        // Create user
        if( !is_user_logged_in() ){
            $this->user_id = $this->create_user();
        } else {
            $this->update_user();
        }

        // Create wholesaler request
        $this->wholesaler_req_id = $this->create_wholesaler_request();

        if( $this->user_id ){
            do_action('whols_user_registration_success', $this->user_id, $this->wholesaler_req_id);

            $this->upload_and_assign_files_to_user($this->user_id);
        }

        // Display success message notice
        wp_send_json_success( [ 
            'registerauth' => true, 
            'redirect_url' => $this->redirect_page_url, 
            'message'      => $this->reg_successfull_message
        ] );
    }

    public function upload_and_assign_files_to_user( $user_id ){
        $user = get_user_by('id', $user_id);

        if( $user ){
            // File upload if has
            if ( isset($_FILES) && !empty($_FILES) ) {
                                        
                // Include the required files from backend
                require_once( ABSPATH . 'wp-admin/includes/image.php' );
                require_once( ABSPATH . 'wp-admin/includes/file.php' );
                require_once( ABSPATH . 'wp-admin/includes/media.php' );
                
                $upload_overrides = array('test_form' => false); // Disable 'test_form' to avoid form field checks
                
                // Loop through each files
                foreach($_FILES as $input_name => $temp_file){
                    // File is not added by user
                    if( empty($temp_file['name']) ){
                        continue;
                    }

                    // Move/Upload file
                    $uploaded_file_arr = wp_handle_upload($temp_file, $upload_overrides);
                    $uploaded_file_url  = $uploaded_file_arr['url'];
                    $uploaded_file_path = $uploaded_file_arr['file'];
                    $uploaded_file_type = $uploaded_file_arr['type'];

                    // File upload successful
                    $attachment = array(
                        'guid'           => $uploaded_file_url,
                        'post_mime_type' => $uploaded_file_type,
                        'post_title'     => sanitize_file_name($temp_file['name']),
                        'post_content'   => '',
                        'post_status'    => 'inherit'
                    );

                    // Insert the attachment into the WordPress Media Library
                    $attachment_id = wp_insert_attachment($attachment, $uploaded_file_path);

                    // Generate the metadata for the attachment, and update the database record
                    $attachment_data = wp_generate_attachment_metadata( $attachment_id, $uploaded_file_path );
                    wp_update_attachment_metadata( $attachment_id, $attachment_data );

                    update_user_meta($user_id, $input_name, $attachment_id);
                }
            }
        }
    }

    public function get_wc_user_fields(){
        return array(
            'billing_first_name',
            'billing_last_name',
            'billing_company' ,
            'billing_address_1',
            'billing_address_2',
            'billing_city',
            'billing_postcode',
            'billing_state',
            'billing_country',
            'billing_phone',
            'billing_email',
            'shipping_first_name',
            'shipping_last_name',
            'shipping_company',
            'shipping_address_1',
            'shipping_address_2',
            'shipping_city',
            'shipping_postcode',
            'shipping_state',
            'shipping_country',
            'shipping_phone',
        );
    }

    function is_state_required_for_country( $country_code ) {
        // Make sure WooCommerce functions are available.
        if ( ! function_exists( 'WC' ) ) {
            return true;
        }
    
        // Get the locale data for all countries.
        $locale = WC()->countries->get_country_locale();
    
        // Default: state is required.
        $is_required = true;
    
        // Check if the country has a 'state' field in the locale definition.
        if ( isset( $locale[ $country_code ]['state'] ) ) {
            if ( isset( $locale[ $country_code ]['state']['required'] ) ) {
                $is_required = (bool) $locale[ $country_code ]['state']['required'];
            }
        }
    
        return $is_required;
    }    
    

    /**
     * Validate feach fields of the submitted data from the wholesaler registration fields
     * 
     * @param $posted_data
     *
     * @return array
     */
    public function get_user_inputs_validation_status( $posted_data ){
        // Check if user request is pending
        if( is_user_logged_in() ){
            $this->user_id = get_current_user_id();

            if( $this->check_if_wholesaler_request_is_pending($this->user_id) ){
                return [
                    'registerauth'  => false,
                    'message'       => __('You\'ve already submitted your Wholesaler request', 'whols')
                ];
            }
        }

        // Empty check
        $empty_fields = array();
        foreach( $posted_data as $key => $value ){
            $key        = str_replace('_whols_', '', $key);
            $fields     = whols_get_registration_fields();
            $field_info = !empty($fields[$key]) ? $fields[$key] : array();
            $required   = !empty($field_info['required']) ? $field_info['required'] : false;

            // Handle state
            // Based on selected country, state field is required or not, if not required then continue
            if( $key == 'billing_state' ){
                $is_state_required = $this->is_state_required_for_country( $posted_data['billing_country'] );

                if( !$is_state_required ){
                    continue;
                }
            }

            if($field_info){
                if( !$value && $required ){
                    $empty_fields[] = $field_info['label'];
                }
            }
        }

        // Validate files
        $fields = whols_get_registration_fields();
        if( isset($_FILES) && !empty($_FILES) ){

            foreach($_FILES as $input_name => $temp_file){
                $input_name = str_replace('_whols_', '', $input_name); // Remove prefix

                // Check for the field info
                if( empty($fields[$input_name]) ){
                    continue;
                }

                $field_info = $fields[$input_name];

                    // File size and file type limits
                $max_file_size = !empty($field_info['maximum_allowed_size']) ? $field_info['maximum_allowed_size'] : 2;
                $max_file_size = abs($max_file_size);

                $allowed_options = array(
                    'image' => array('image/jpeg', 'image/png', 'image/gif'),
                    'pdf'   => array('application/pdf'),
                    'doc'   => array('application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
                );

                // Get the default allowed file types
                $allowed_file_types = array();
                $selected_options = isset($field_info['allowed_files']) ? explode(',', $field_info['allowed_files']) : array('image', 'pdf'); // Default to 'image' and 'pdf'

                foreach ($selected_options as $option) {
                    if (isset($allowed_options[$option])) {
                        $allowed_file_types = array_merge($allowed_file_types, $allowed_options[$option]);
                    }
                }

                // File is optional nad file is not uploaded
                if( empty($temp_file['name']) && !$field_info['required'] ){
                    continue;
                }

                // Empty check for file
                if( empty($temp_file['name']) && $field_info['required'] ){

                    $input_name     = str_replace('_whols_', '', $input_name);
                    $field_label    = !empty($field_info['label']) ? $field_info['label'] : '';
                    $empty_fields[] = $field_label;
                    continue;
                }

                // File type validation
                if ( !in_array( $temp_file['type'], $allowed_file_types ) ) {
                    return [
                        'registerauth' => false,
                        'message'      => sprintf( __('<b>%s</b> is not a valid file type. Please upload an allowed file.', 'whols'), $temp_file['name'], implode($allowed_file_types) )
                    ];
                }

                // File size validation
                $temp_file_size = absint($temp_file['size']) / 1024 / 1024;
                if ( $temp_file_size > $max_file_size ) {
                    return [
                        'registerauth' => false,
                        'message'      => sprintf( __('File <b>%s</b> exceeds the maximum upload size.', 'whols'), $temp_file['name'] )
                    ];
                }
            }
            
        }

        if($empty_fields){
            return [
                'registerauth'  => false,
                'message'       => implode(', ', $empty_fields) . esc_html__(  ' cannot be empty.', 'whols')
            ];
        }

        if( !empty( $posted_data['reg_username'] ) ){

            if ( 4 > strlen( $posted_data['reg_username'] ) ) {
                return [
                    'registerauth' =>false,
                    'message'=> esc_html__('Username too short. At least 4 characters is required', 'whols')
                ];
            }

            if ( username_exists( $posted_data['reg_username'] ) ){
                return [
                    'registerauth' =>false,
                    'message'=> esc_html__('Sorry, that username already exists!', 'whols')
                ];
            }

            if ( !validate_username( $posted_data['reg_username'] ) ) {
                return [
                    'registerauth' =>false,
                    'message'=> esc_html__('Sorry, the username you entered is not valid', 'whols') 
                ];
            }

        }

        if( !empty( $posted_data['reg_password'] ) ){

            if ( 5 > strlen( $posted_data['reg_password'] ) ) {
                return [
                    'registerauth' =>false,
                    'message'=> esc_html__('Password length must be greater than 5', 'whols') 
                ];
            }

        }

        if( !empty( $posted_data['reg_email'] ) ){

            if ( !is_email( $posted_data['reg_email'] ) ) {
                return [
                    'registerauth' =>false,
                    'message'=> esc_html__('Email is not valid', 'whols')
                ];
            }

            if ( email_exists( $posted_data['reg_email'] ) ) {
                return [
                    'registerauth' =>false,
                    'message'=> esc_html__('Email Already in Use', 'whols')
                ];
            }

        }

         // No validation issue found
        return [
            'registerauth' => true,
        ];

    }

    /**
     * Validate feach fields of the submitted
     *
     * @param $form_fields
     * @param $posted_data
     *
     * @return array
     */
    public function get_user_inputs_validation_status2( $form_fields, $posted_data ){
        $msg_arr = array(
            'success' => false,
            'message' => ''
        );

        // Loop through each field
        foreach( $form_fields as $field_key => $field_info ){
            $required = !empty($field_info['required']) ? $field_info['required'] : false;

            if( $field_info ){
                // Check if the field is required
                if( $required && empty($posted_data[$field_key]) ){
                    $msg_arr['message'] = sprintf(
                        '%1$s %2$s %3$s',
                        $field_info['label'],
                        esc_html__('Field is required.', 'whols'),
                        esc_html__('Please fill it up.', 'whols')
                    );

                    break;
                }

                // Email field validation
                if( $field_info['type'] == 'email' && !empty($posted_data[$field_key]) ){
                    if( !is_email($posted_data[$field_key]) ){
                        $msg_arr['message'] = esc_html__('Invalid email address.', 'whols');
                        break;
                    }
                }
            }
        }

        if( empty($msg_arr['message']) ){ // No validation issue found
            $msg_arr['success'] = true;
        }

        return $msg_arr;
    }

    public function check_if_wholesaler_request_is_pending( $user_id ){
        if( whols_is_wholesaler() ){
            return false;
        }

        $args = array(
            'post_type'      => 'whols_user_request',
            'posts_per_page' => -1,
            'fields'         => 'ids',
        );

        $posts = new \WP_Query($args);

        $matched_request_id = '';
        $is_pending         = false;

        foreach( $posts->posts as $post_id ){
            $meta = get_post_meta($post_id, 'whols_user_request_meta', true);

            // Check for matching user ID and status
            foreach ($meta as $key => $value) {
                if ( ($key == 'user_id') && ($value == $user_id) ) {
                    $matched_request_id = $post_id;
                    break;
                }
            }
        }

        if( $matched_request_id ){
            $request_meta = get_post_meta($matched_request_id, 'whols_user_request_meta', true);

            if( isset($request_meta['status']) && $request_meta['status'] !== 'approved' ){
                $is_pending = true;
            }
        }

        return $is_pending;
    }

    public function update_properties(){
        if( is_user_logged_in() ){
            $this->user_id = get_current_user_id();
            $this->reg_successfull_message = esc_html__('Thank you for registering.', 'whols');
        } else{
            $this->reg_successfull_message = sprintf(
                '%1$s <a href="'. get_permalink(get_option( 'woocommerce_myaccount_page_id' )) .'">%2$s</a>',
                esc_html__('Thank you for registering.', 'whols'),
                esc_html__('Login Here', 'whols')
            );
        }

        if( $this->enable_auto_approve ){
            $this->wholesaler_request_status = 'approve';

            // If auto approve enabled and pricing model is single role
            if( $this->pricing_model == 'single_role' ){

                $this->role_to_be_assigned     = 'whols_default_role';
                $this->role_to_be_selected     = 'whols_default_role';
                $this->reg_successfull_message = $this->successful_message_for_auto_approve ? $this->successful_message_for_auto_approve : $this->reg_successfull_message;

            }

            // If auto approve enabled and user input role is matched with the default role
            if( $this->pricing_model == 'multiple_role' &&  !empty($this->reg_inputs['_whols_role']) && $this->reg_inputs['_whols_role'] == $this->default_wholesale_role ){

                $this->role_to_be_assigned      = $this->default_wholesale_role;
                $this->role_to_be_selected      = $this->default_wholesale_role;
                $this->reg_successfull_message  = $this->successful_message_for_auto_approve ? $this->successful_message_for_auto_approve : $this->reg_successfull_message;

            // If auto approve enabled and pricing model is multiple_role and user input role doesn't match with the default role
            }elseif( $this->pricing_model == 'multiple_role' &&  !empty($this->reg_inputs['_whols_role']) && $this->reg_inputs['_whols_role'] != $this->default_wholesale_role ){

                $this->wholesaler_request_status = ''; // Exception when doesn't match
                $this->reg_successfull_message   = $this->successful_message_for_manual_approve ? $this->successful_message_for_manual_approve : esc_html__( 'Thank you for registering. Your account will be reviewed by us & approve manually. Please wait to be approved.', 'whols' );

            // If auto approve enabled and form is not using the role field
            }elseif( $this->pricing_model == 'multiple_role' &&  empty($this->reg_inputs['_whols_role']) ){

                $this->role_to_be_assigned     = $this->default_wholesale_role;
                $this->role_to_be_selected     = 'whols_default_role';
                $this->reg_successfull_message = $this->successful_message_for_auto_approve ? $this->successful_message_for_auto_approve : $this->reg_successfull_message;

            }

        } else { // Auto approve not enabled
            if( $this->pricing_model == 'multiple_role' &&  !empty($this->reg_inputs['_whols_role']) ){

                $this->role_to_be_selected    = $this->reg_inputs['_whols_role'];

            } elseif( $this->pricing_model == 'single_role' ){

                $this->role_to_be_selected    = 'whols_default_role';

            }

            $this->reg_successfull_message = $this->successful_message_for_manual_approve ? $this->successful_message_for_manual_approve : esc_html__( 'Thank you for registering. Your account will be reviewed by us & approve manually. Please wait to be approved.', 'whols' );
        }
    }

    public function create_user(){
        $this->user_id =  wp_insert_user(array(
            'first_name' => $this->reg_first_name,
            'last_name'  => $this->reg_last_name,
            'user_login' => $this->reg_username,
            'user_email' => $this->reg_email,
            'user_pass'  => $this->reg_pass,
            'role'       => $this->role_to_be_assigned
        ));

        foreach( $this->get_additional_fields() as $key => $value ){
            add_user_meta( $this->user_id, $key, $value, true );
        }

        return $this->user_id;
    }

    public function update_user(){
        if( $this->user_id ){
            $user_instance = new \WP_User($this->user_id);
            $user_instance->add_role( $this->role_to_be_assigned );

            foreach( $this->get_additional_fields() as $key => $value ){
                add_user_meta( $this->user_id, $key, $value, true );
            }
        }
    }

    public function create_wholesaler_request(){
        $this->wholesaler_req_id = wp_insert_post(array(
            'post_title'   => $this->get_user_name( $this->user_id ),
            'post_status'  => 'publish',
            'post_type'    => 'whols_user_request',
            'meta_input'   => array(
                'whols_user_request_meta' => array (
                    'user_id'       => $this->user_id,
                    'current_role'  => $this->role_to_be_assigned, // User role
                    'assign_role'   => $this->role_to_be_selected, // Role selected in the dropdown
                    'status'        => $this->wholesaler_request_status,
                )
            ),
        ));

        return $this->wholesaler_req_id;
    }

    public function get_additional_fields(){
        $additional_fields = array(
            // Add first name and last name as additional field by default
            // to available it for the client's my account page
            'billing_first_name'    => !empty( $this->reg_inputs['reg_name'] ) ? sanitize_text_field( $this->reg_inputs['reg_name'] ) : "",
            'billing_last_name'     => !empty( $this->reg_inputs['last_name'] ) ? sanitize_text_field( $this->reg_inputs['last_name'] ) : ""
        );

        // Update additional_fields
        foreach( $this->reg_inputs as $field_name => $value ){
            if( str_starts_with($field_name, '_whols_') ){

                $additional_fields[$field_name] = $value;

            } elseif( in_array($field_name, $this->wc_user_fields) ){

                $additional_fields[$field_name] = $value;

            }
        }

        return $additional_fields;
    }

    public function get_user_name( $user_id ){
        $user_name = ''; // User first name

        if( is_user_logged_in() ) {
            $user_id = get_current_user_id();
        }

        if( $user_id ){
            $user = get_user_by( 'id', $user_id );

            if( $user ){
                $user_name = $user->first_name;
            }
        }

        return $user_name;
    }

    /**
     * Check recaptcha token
     *
     * @param string $token
     * @return array
     */
    public function verify_recaptcha_token( $token = '' ){
        $recaptcha_secret_key = whols_get_option('recaptcha_secret_key');
        $recaptcha_min_score = (int) whols_get_option('recaptcha_min_score');
        $request_url         = 'https://www.google.com/recaptcha/api/siteverify';
        $return_value        = array();

        $response_raw = wp_remote_post( $request_url, array(
            'body'  => array(
                'secret'    => $recaptcha_secret_key,
                'response'  => $token,
                'remoteip'  => $_SERVER['REMOTE_ADDR']
            ),
            'sslverify'   => false,
        ) );

        // Response is ok
        if( !is_wp_error( $response_raw ) && $response_raw['response']['code'] == 200  ){
            $response_arr = json_decode($response_raw['body'], true);

            // Captcha verify success
            if( $response_arr['success'] ){

                // Min score is set, Check min score
                if( $recaptcha_min_score && $response_arr['score'] < $recaptcha_min_score ){
                    $return_value = array(
                        'success' => false,
                        'message' => __('This captcha verification failed because the score was low!', 'whols')
                    );

                // Min score is not set
                } else {
                    $return_value = array(
                        'success' => true,
                        'message' => ''
                    );
                }
            } elseif( !empty($response_arr['error-codes']) ) {
                $msg = implode(array_values($response_arr['error-codes']));

                $return_value = array(
                    'success' => false,
                    'message' => $msg. __(': It appears that the captcha verification failed!', 'whols')
                );
            }

        // is wp error
        } elseif( is_wp_error( $response_raw ) ) {
            $return_value = array(
                'success' => false,
                'message' => $response_raw->get_error_message()
            );

        // Response code is not ok
        } else {
            $return_value = array(
                'success' => false,
                'message' => __('This captcha verification failed because the response code invalid!', 'whols')
            );
        }

        return $return_value;
    }

    public function raq_form_submit(){
        $nonce = sanitize_text_field($_REQUEST['nonce']);

        // Default values
        $defaults = include PL_PATH . '/includes/Admin/defaults.php';
        $raq_fields = $defaults['raq_fields'];
        $raq_data_defaults = $defaults['raq_data_defaults'];

        if ( !wp_verify_nonce( $nonce, 'whols_nonce' ) ) {
            wp_send_json_error(array(
                'message' => esc_html__( 'Oops! Something went wrong while checking the security token. Please try again or refresh the page, and if the issue persists, get in touch with us!', 'whols' )
            ));
        }

        $posted_data = !empty($_REQUEST['fields']) ? $_REQUEST['fields'] : array();
        $post_data = wp_parse_args($posted_data, $raq_data_defaults );

        $validation_result = $this->get_user_inputs_validation_status2( $raq_fields, $post_data );

        if( !$validation_result['success'] ){
            wp_send_json_error(array(
                'message' => $validation_result['message']
            ));
        }

        // No need to validate location
        $posted_data['location'] = !empty($_REQUEST['location']) ? sanitize_text_field($_REQUEST['location']) : '';

		// For sending email
        do_action( 'whols_after_raq_form_submit', $posted_data );

        wp_send_json_success(array(
            'message' => esc_html__('Your request has been submitted successfully. We will get back to you soon.', 'whols')
        ));
    }


    public function open_raq_modal(){
        ob_start();
        include_once( PL_PATH . '/includes/request-a-quote/html-modal.php' );
        $modal_content = ob_get_clean();

        wp_send_json_success(array(
            'modal_content' => $modal_content
        ));
    }

    public function send_message(){
        $nonce = sanitize_text_field($_REQUEST['nonce']);
        global $current_user;

        if ( !wp_verify_nonce( $nonce, 'whols_nonce' ) ) {
            wp_send_json_error(array(
                'message' => esc_html__( 'Oops! Something went wrong while checking the security token. Please try again or refresh the page, and if the issue persists, get in touch with us!', 'whols' )
            ));
        }

        $post_id = !empty($_REQUEST['post_id']) ? absint($_REQUEST['post_id']) : 0;
        $message = !empty($_REQUEST['message']) ? sanitize_textarea_field($_REQUEST['message']) : '';

        $sendar_type = '';
        if( is_user_logged_in() && current_user_can('administrator') ){
            $sendar_type = 'shop_manager';
			$post_status = 'whols-awaiting-reply'; // Admin waiting for reply
        } elseif(whols_is_wholesaler()) {
            $sendar_type = 'client';
			$post_status = 'pending'; // Admin need to reply
        }

        $meta_data = array(
            'sendar' => get_current_user_id(), // User is already logged in
            'sendar_type' => $sendar_type,
            'name'   => $current_user->data->display_name,
            'email'  => $current_user->data->user_email,
            'message' => $message,
            'time'   => time()
        );

        $meta_id = add_post_meta($post_id, '_conversations', $meta_data);

        // Fire hooks for email notifications
        if ($meta_id) {
            do_action('whols_conversation_message_sent', $meta_data, $post_id);
        }

        if( $meta_id ){
            // Remove pending post status
            wp_update_post(array(
                'ID'          => $post_id,
                'post_status' => $post_status
            ));

            wp_send_json_success(array(
                'message' => esc_html__('Your message has been sent successfully.', 'whols')
            ));
        } else {
            wp_send_json_error(array(
                'message' => esc_html__('Oops! Something went wrong while sending your message. Please try again or refresh the page, and if the issue persists, get in touch with us!', 'whols')
            ));
        }
    }

    /**
     * Get email placeholders for AJAX request
     *
     * @return void
     */
    public function get_email_placeholders() {
        // Include the helper class if not already loaded
        if (!class_exists('Whols_Pro\Email_Placeholder_Helper')) {
            require_once PL_PATH . '/includes/class-email-placeholder-helper.php';
        }

        // Get formatted placeholders
        $placeholders = Email_Placeholder_Helper::get_placeholders_for_ajax();

        wp_send_json_success(array(
            'placeholders' => $placeholders
        ));
    }
}
