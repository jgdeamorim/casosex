<?php
namespace Whols_Pro;

/**
 * Whols Admin.
 *
 * @since 1.0.0
 */
class Admin {
    /**
     * Admin constructor.
     *
     * @since 1.0.0
     */
    public function __construct() {
        new Admin\Wholesaler_Request_Metabox();
        new Admin\Product_Metabox();
        new Admin\Role_Cat_Metabox();
        new Admin\Product_Category_Metabox();
        new Admin\User_Metabox();
        new Admin\Role_Manager();
        new Admin\Product_List_Table_Custom_Columns();
        new Admin\Manage_Data_Migration();
        new Admin\Manage_Reports();
        new Admin\Manage_Manual_Order();
        new Admin\Product_Quick_Edit_Fields();
        new Admin\Polylang_Integration();

        // Admin assets hook into action.
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );

        // Bind admin page link to the plugin action link.
        add_filter( 'plugin_action_links_whols-pro/whols-pro.php', array($this, 'action_links_add'), 10, 4 );

        // Admin assets hook into action.
        add_action( 'admin_head', array( $this, 'enqueue_admin_assets' ) );

        // Add page states to the page list table
        add_filter('display_post_states', array( $this, 'filter_post_states' ), 10, 2); 
    }

    /**
     * Action link add.
     *
     * @since 1.0.0
     */
    function action_links_add( $actions, $plugin_file, $plugin_data, $context ){

        $settings_page_link = sprintf(
            /*
             * translators:
             * 1: Settings label
             */
            '<a href="'. esc_url( get_admin_url() . 'admin.php?page=whols-admin' ) .'">%1$s</a>',
            esc_html__( 'Settings', 'whols' )
        );

        array_unshift( $actions, $settings_page_link );

        return $actions;
    }

    /**
     * Enqueue admin assets.
     *
     * @since 1.0.0
     */
    public function enqueue_admin_assets( $hook_sffix ) {
        $current_screen = get_current_screen();
        global $typenow;
        
        if (
            'shop_order' == $current_screen->id ||
            'whols_role_cat' == $current_screen->taxonomy ||
            $current_screen->post_type  == 'whols_user_request' ||
            $current_screen->post_type  == 'shop_order' ||
            'toplevel_page_whols-admin' == $current_screen->base ||
            $current_screen->post_type == 'product' || 
            'user-edit' == $current_screen->base ||
            'whols_conversation' == $typenow
        ) {
            wp_enqueue_style( 'whols-admin', PL_ASSETS . '/css/admin.css', array(), PL_VERSION );
            wp_enqueue_script( 'whols-admin', PL_ASSETS . '/js/admin.js', array('jquery'), PL_VERSION );

            // inline js for the settings submenu
            $is_whols_setting = isset( $_GET['page'] ) ? $_GET['page'] : '';
            $is_whols_setting = $is_whols_setting == 'whols-admin' ? 1 : 0;
            wp_add_inline_script( 'whols-admin', 'var whols_is_settings_page = '. esc_js( $is_whols_setting ) .';');

            // Localize
            $roles = whols_get_taxonomy_terms();
            $localize_vars = array();
            $localize_vars['roles']    = json_encode($roles);
            $localize_vars['ajax_url'] = admin_url( 'admin-ajax.php' );
            $localize_vars['nonce']    = wp_create_nonce( 'whols_nonce' );
            wp_localize_script( 'whols-admin', 'whols_params', $localize_vars );
        }
    }

    /**
     * It adds a "Whols Registration Page" state to the page that is set as the registration page.
     * 
     * @param $post_states (array) An array of post display states.
     * @param $post The post object.
     */
    public function filter_post_states( $post_states, $post ){
        if( has_shortcode( $post->post_content, 'whols_registration_form') ||
            (whols_get_option('registration_page') && $post->ID == whols_get_option('registration_page'))
        ){
            $post_states['whols_registration_page'] = __('Whols Registration Page', 'whols');
        }
    
        return $post_states;
    }

}