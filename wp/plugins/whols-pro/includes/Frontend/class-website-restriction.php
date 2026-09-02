<?php
namespace Whols_Pro\Frontend;

class Manage_Website_Restriction{
    private static $_instance = null;

    /**
     * Instance
     */
    public static function instance(){
        if( is_null( self::$_instance ) ){
            self::$_instance = new self();
        }
        return self::$_instance;
    }
    
    public function __construct() {
        add_action('plugins_loaded', function(){
            $enable_website_restriction = whols_get_option('enable_website_restriction');

            // Restriction is only for shop.
            if( $enable_website_restriction == 'for_only_shop' ){
                $this->setup_shop_restriction();
            // Restriction is for entire website.
            } elseif ($enable_website_restriction == 'for_entire_wbesite') {
                $this->setup_entire_website_restriction();
            }
        });
    }

    public function setup_shop_restriction(){
        add_action( 'woocommerce_product_query', array( $this, 'hide_products_for_guest_users' ) );
        add_action( 'woocommerce_no_products_found', array( $this, 'show_restriction_notice' ), 9 );
        add_action( 'template_redirect', array( $this, 'redirect_to_myaccount_page' ), 99 );
    }

    public function setup_entire_website_restriction(){
        add_action( 'template_redirect', array( $this, 'hide_entire_website_for_guest_users' ) );
        add_filter( 'login_message', array( $this, 'login_restriction_message' ) );
    }

    public function hide_products_for_guest_users( $query ){
        $who_can_access_shop = whols_get_option('who_can_access_shop');

        if( $who_can_access_shop == 'logedin_users_with_wholesale_role' ){
            if( is_user_logged_in() && whols_is_wholesaler(get_current_user_id()) ){
                return;
            }
        } elseif( $who_can_access_shop == 'logedin_users' ){
            if( is_user_logged_in() ){
                return;
            }
        } elseif( $who_can_access_shop == 'everyone' ){
            return;
        }

        $tax_query = (array) $query->get( 'tax_query' );
        $tax_query[] = array(
           'taxonomy' => 'product_cat',
           'field' => 'slug',
           'terms' => array( 'habijabicateogry' ),
           'operator' => 'IN'
        );

        $query->set( 'tax_query', $tax_query );
    }

    public function show_restriction_notice(){
        if ( is_user_logged_in() || is_product() ){
            remove_action( 'woocommerce_no_products_found', 'wc_no_products_found', 10 );

            $who_can_access_shop = whols_get_option('who_can_access_shop');
            if( $who_can_access_shop == 'logedin_users_with_wholesale_role' ){
                $message = esc_html__('Only wholesale users are allowed to access the shop.', 'whols');
                echo '<p class="woocommerce-info">' . wp_kses_post( $message ) .'</p>';
            }
        } elseif( !is_user_logged_in() ){
            remove_action( 'woocommerce_no_products_found', 'wc_no_products_found', 10 );

            $message = esc_html__('Please login to access the Shop', 'whols');
            echo '<p class="woocommerce-info">' . wp_kses_post( $message ) .'</p>';
            echo do_shortcode( '[woocommerce_my_account]' );
        }
    }

    /**
     * Redirects users to the my account page based on website restriction settings.
     */
    public function redirect_to_myaccount_page(){
        if(current_user_can('manage_options')){
            return;
        }
        
        $who_can_access_shop = whols_get_option('who_can_access_shop'); // everyone, logedin_users, logedin_users_with_wholesale_role

        if( $who_can_access_shop ===  'logedin_users_with_wholesale_role' ){
            $query_string_notice = isset($_GET['whols_notice']) ? sanitize_text_field($_GET['whols_notice']) : ''; // session should be used before start rendering the page

            if( $query_string_notice === 'need_wholesaler_role' ){
                wc_add_notice(__('Access to the shop pages is restricted to wholesalers. Log in with your wholesale role.', 'whols'), 'error');
            }

            if( !whols_is_wholesaler(get_current_user_id()) && $this->is_wc_area() ){
                $url = get_permalink( get_option( 'woocommerce_myaccount_page_id' ) );
                $url = add_query_arg('whols_notice', 'need_wholesaler_role', $url);

                wp_redirect( $url );
                exit();
            }

        } elseif( $who_can_access_shop ===  'logedin_users' ){
            if( !is_user_logged_in() && $this->is_wc_area() ){
                wp_redirect( get_permalink( get_option( 'woocommerce_myaccount_page_id' ) ) );
                exit();
            }
        }
    }

    public function hide_entire_website_for_guest_users(){
        $who_can_access_shop = whols_get_option('who_can_access_entire_website');

        if( $who_can_access_shop == 'logedin_users_with_wholesale_role' ){
            if( is_user_logged_in() && whols_is_wholesaler(get_current_user_id()) ){
                return;
            }

            $login_url = wp_login_url();
            $login_url = add_query_arg('whols_need_wholesaler_role', '', $login_url);

            wp_redirect($login_url);
            exit;
        } elseif( $who_can_access_shop == 'logedin_users' ){
            if( is_user_logged_in() ){
                return;
            }

            $login_url = wp_login_url();
            $login_url = add_query_arg('whols_need_to_login', '', $login_url);

            wp_redirect($login_url);
            exit;
        }

        auth_redirect();
    }

    public function login_restriction_message( $message ){
        $whols_need_wholesaler_role = isset($_GET['whols_need_wholesaler_role']) ? true : '';
        $whols_need_to_login        = isset($_GET['whols_need_to_login']) ? true : '';

        if( $whols_need_wholesaler_role ){
            $message_str = esc_html__('You must need to login as a wholesaler to access the site.', 'whols');
            $message = '<div style="text-align:center;color:#ca4a1f;">'. $message_str .'</div>';
        }

        if( $whols_need_to_login ){
            $message_str = esc_html__('You must need to login to access the site.', 'whols');
            $message = '<div style="text-align:center;color:#ca4a1f;">'. $message_str .'</div>';
        }

        return $message;
    }

    public function is_wc_area(){
        if( !class_exists('WooCommerce') ){
            return false;
        }
        
        return is_product() || is_shop() || is_cart() || is_checkout() || is_post_type_archive('product');
    }
}

Manage_Website_Restriction::instance();