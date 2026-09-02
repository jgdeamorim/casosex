<?php
/**
 * Wholesaler Registration.
 */
namespace Whols_Pro\Frontend;

/**
 * Wholesaler_Login_Register class.
 */
class Wholesaler_Login_Register{

    /**
     * Wholesaler_Login_Register constructor.
     *
     * @since 1.0.0
     */
    public function __construct() {
        // registration form shortcode
        add_shortcode( 'whols_registration_form', array( $this, 'registration_form_shortcode' ) );

        // redirect after login
        if( whols_get_option('redirect_page_customer_login') ){
            add_filter( 'woocommerce_login_redirect', array( $this, 'wholesaler_wc_login_redirect' ), 9999, 2 );
            add_filter('login_redirect', array( $this, 'wholesaler_wp_login_redirect' ), 9999, 3);
        }
    }

    /**
     * Register user shortcode callback function
     *
     * @since 1.0.0
     */
    public function registration_form_shortcode( $atts ){
        $enable_recaptcha     = whols_get_option('enable_recaptcha');
        $recaptcha_site_key   = whols_get_option('recaptcha_site_key');
        $recaptcha_secret_key = whols_get_option('recaptcha_secret_key');

        ob_start();

            if( $this->should_show_registration_form()  ):
                if( $enable_recaptcha && $recaptcha_site_key && $recaptcha_secret_key ){
                    wp_enqueue_script( 'recaptcha-api' );
                }
                
                wp_enqueue_script( 'whols-registration' );
                wp_enqueue_script( 'wc-country-select' );
                wp_enqueue_script( 'wc-address-i18n' );

                if( current_user_can('manage_options') && function_exists('wc_print_notice') && is_page() ){ // Dont show in block
                    wc_print_notice( esc_html__( 'You are viewing the wholesaler registration form as an administrator. This message is hidden from customers.', 'whols' ), 'notice' );
                }
            ?>
                <div id="whols_user_reg_message" class="whols_user_reg_message"></div>
                <div class="whols_registration_form">
                    <form action="" class="whols_registration_action woocommerce-billing-fields" enctype="multipart/form-data">
                        <?php $this->render_registration_fields(); ?>

                        <?php $this->render_submit_button(); ?>
                    </form>
                </div>

            <?php else:
                global $wp;
                $current_user = wp_get_current_user();
                $current_url = home_url( add_query_arg( array(), $wp->request ) );
            ?>
                <div class="whols_reg_logged_in">
                    <?php echo esc_html__( 'You are Logged in as: ', 'whols' ) . $current_user->display_name. ' (<a href="'. esc_url( wp_logout_url( $current_url )  ) .'">'. esc_html__( 'Logout', 'whols' ) .'</a>)';
                    ?>
                </div>

            <?php endif; ?>
        <?php
        return ob_get_clean();
    }

    /**
     * WooCommerce Redirect After login
     *
     * @since 1.0.0
     */
    public function wholesaler_wc_login_redirect( $redirect, $user ) {
        $current_user_id = $user->ID;
        if ( whols_is_wholesaler( $current_user_id ) ) {
            $redirect_page_customer_login = whols_get_option('redirect_page_customer_login');
            if( $redirect_page_customer_login ){
                $redirect = $redirect_page_customer_login;
            }
        }

        return $redirect;
    }

    /**
     * WordPress Redirect After login
     *
     * @since 1.0.0
     */
    public function wholesaler_wp_login_redirect( $redirect_to, $requested_redirect_to, $user ){
        if ( !empty($user->ID) && whols_is_wholesaler( $user->ID ) ) { // Fix undefined $user->ID issue
            $redirect_page_customer_login = whols_get_option('redirect_page_customer_login');
            if( $redirect_page_customer_login ){
                $redirect_to = $redirect_page_customer_login;
            }
        }

        return $redirect_to;
    }

    /**
     * Render registration fields (original method)
     */
    public function render_registration_fields(){
        $fields = whols_get_registration_fields();

        foreach ($fields as $key => $field) {
            $default = $field['value'] ?? null;
            if( $key == '_whols_role' ){
                $default = whols_get_option('default_wholesale_role');
            }

            $field_args = array(
                'type'          => !empty($field['type']) ? $field['type'] : 'text', // Removed null coalescing operator, as it was not setting default value
                'label'         => $field['label'] ?? '',
                'placeholder'   => $field['placeholder'] ?? '',
                'description'   => $field['description'] ?? '',
                'required'      => !empty($field['required']) ? 'required' : '',
                'is_additional' => !empty($field['is_additional']),
                'options'       => $field['options'] ?? array(),
                'class'         => $field['class'] ?? array(),
                'default'       => $default
            );

            whols_form_field($key, $field_args, $default);
        }
    }

    /**
     * Render submit button (original method)
     */
    public function render_submit_button() {
        $submit_button_label_filter = apply_filters('whols_registration_submit_label', 
            __('Register As Wholesaler', 'whols')
        );
        $submit_button_label = whols_get_option('registration_form_submit_button_label');
        $submit_button_label = $submit_button_label ?: $submit_button_label_filter;
        ?>
        <button type="submit" 
                name="reg_submit" 
                id="whols_reg_submit" 
                class="button button-primary"
                value="<?php echo esc_attr($submit_button_label); ?>">
            <?php echo wp_kses_post($submit_button_label); ?>
        </button>
        <?php
    }

    /**
     * Get logged in user message
     *
     * @since 1.0.0
     * @return string
     */
    private function get_logged_in_message() {
        global $wp;
        $current_user = wp_get_current_user();
        $current_url = home_url(add_query_arg(array(), $wp->request));
        
        return sprintf(
            '<div class="whols_reg_logged_in">%s %s (<a href="%s">%s</a>)</div>',
            esc_html__('You are Logged in as:', 'whols'),
            esc_html($current_user->display_name),
            esc_url(wp_logout_url($current_url)),
            esc_html__('Logout', 'whols')
        );
    }

    /**
     * Check if registration form should be shown
     * - Show for all users. except wholesalers
     * - Show for admin with notice
     *
     * @return bool
     */
    public function should_show_registration_form() {
        $should_show                = true;
        $user_type                  = 'regular';
        $wholesale_price_visibility = whols_get_option('show_wholesale_price_for');
        
        if (current_user_can('manage_options')) {
            $user_type = 'admin';
        } elseif (whols_is_wholesaler()) {
            $user_type = 'wholesaler';
        }

        if($user_type == 'admin'){
            $should_show = true;
        } elseif($user_type == 'wholesaler' && $wholesale_price_visibility == 'all_users'){
            $should_show = true;
        } elseif($user_type == 'wholesaler'){
            $should_show = false;
        }

        return $should_show;
    }
}