<?php
namespace Whols_Pro;
use const Whols_Pro\PL_VERSION;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Bulk Order Form
 * 
 * Main class for the bulk order form feature.
 */
class Bulk_Order_Form {
    /**
     * Version for assets
     *
     * @var string
     */
    public $version = PL_VERSION;
    
    /**
     * Singleton instance
     *
     * @var Bulk_Order_Form
     */
    private static $instance = null;
    
    /**
     * Get the singleton instance
     *
     * @return Bulk_Order_Form
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    public function __construct() {
        if (!$this->is_enabled()) {
            return;
        }

        // Set version for assets
        if (defined('WP_DEBUG') && WP_DEBUG) {
            $this->version = time();
        }

        // Include required files
        $this->includes();

        // Register assets
        add_action('wp_enqueue_scripts', array($this, 'register_assets'));

        // Add WooCommerce My Account Integration
        add_filter('woocommerce_account_menu_items', array($this, 'add_bulk_order_tab'), 40);
        add_action('init', array($this, 'add_bulk_order_endpoint'));
        add_action('woocommerce_account_whols-bulk-order_endpoint', array($this, 'bulk_order_content'));

        // Register popup type
        add_action('init', array($this, 'register_popup_type'));
    }
    
    /**
     * Retrieves bulk order form configuration options
     * 
     * Serves as the centralized access point for all bulk order form settings.
     * Benefits:
     * - Prevents scattered direct calls to whols_get_option()
     * - Isolates option name changes to a single location
     * - Provides consistent default values
     * - Simplifies testing with static values
     *
     * @param string $option_name The option key to retrieve
     * @param mixed $default Value to return if option doesn't exist
     * @return mixed The option value
     */
    public function config($option_name, $default = null) {
        // Static configuration values for testing
        $config = array(
            // Feature toggle
            'bof_enabled' => whols_get_option('bof_enabled', false),
            
            // Search configuration
            'bof_search_results_limit' => whols_get_option('bof_search_results_limit', 20),
            
            // Text customization
            'bof_title_text' => whols_get_option('bof_title_text', 'Bulk / Quick Order Form'),
            'bof_menu_title' => whols_get_option('bof_menu_title', 'Bulk Order'),
            
            // WooCommerce integration
            'bof_redirect_after_add' => whols_get_option('bof_redirect_after_add', '') // Options: 'cart', 'checkout', 'none'
        );
        
        // Return the requested option or default
        return isset($config[$option_name]) ? $config[$option_name] : $default;
    }

    /**
     * Static helper to retrieve configuration options
     *
     * Provides easy access to configuration values from anywhere without needing an instance
     *
     * @param string $option_name The option key to retrieve
     * @param mixed $default Value to return if option doesn't exist
     * @return mixed The option value
     */
    public static function get_config($option_name, $default = null) {
        return self::get_instance()->config($option_name, $default);
    }
    
    /**
     * Check if the bulk order form feature is enabled
     *
     * @return bool
     */
    public function is_enabled() {
        // Use direct config access to avoid infinite recursion
        return $this->config('bof_enabled');
    }

    /**
     * Include required files
     */
    public function includes() {
        // Load dependencies
        whols_include_plugin_file('includes/bulk-order-form/class-bulk-order-shortcode.php');
        whols_include_plugin_file('includes/bulk-order-form/class-bulk-order-ajax.php');
    }

    /**
     * Register the variation popup type
     */
    public function register_popup_type() {
        if (function_exists('whols_popup')) {
            whols_popup()->register_popup('bof_variation', array(
                'title'           => __('Select Options', 'whols'),
                'class'           => 'whols-bof__variation-popup',
                'width'           => 'large',
                'ajax_action'     => 'load_bof_variation_popup',
                'ajax_callback'   => array(Bulk_Order_Ajax::get_instance(), 'bof_variation_popup_cb'),
                'close_on_overlay' => true,
            ));
        }
    }

    /**
     * Add bulk order tab to My Account
     *
     * @param array $items Account menu items
     * @return array Modified account menu items
     */
    public function add_bulk_order_tab($items) {        
        $new_items = array();
        
        // Get custom menu title from settings or use default
        $menu_title = $this->config('bof_menu_title', esc_html__('Bulk Order', 'whols'));
        
        // Add after orders tab
        foreach ($items as $key => $value) {
            $new_items[$key] = $value;
            
            if ($key === 'orders') {
                $new_items['whols-bulk-order'] = esc_html($menu_title);
            }
        }
        
        return $new_items;
    }

    /**
     * Add bulk order endpoint
     */
    public function add_bulk_order_endpoint() {
        add_rewrite_endpoint('whols-bulk-order', EP_ROOT | EP_PAGES);
        
        // Maybe flush rewrite rule
        whols_maybe_flush_rewrite_rules('bulk_order_form');
    }

    /**
     * Bulk order tab content
     */
    public function bulk_order_content() {
        echo do_shortcode('[whols_bulk_order_form]');
    }

    /**
     * Register assets
     */
    public function register_assets() {
        // Register CSS
        wp_register_style(
            'whols-bulk-order-form',
            plugins_url('assets/css/frontend-bulk-order-form.css', __FILE__),
            array(),
            $this->version
        );

        wp_register_style(
            'whols-variation-popup',
            plugins_url('assets/css/variation-popup.css', __FILE__),
            array(),
            $this->version
        );

        // Register JS
        wp_register_script(
            'whols-bulk-order-form',
            plugins_url('assets/js/frontend-bulk-order-form.js', __FILE__),
            array('jquery'),
            $this->version,
            true
        );

        wp_register_script(
            'whols-variation-popup',
            plugins_url('assets/js/frontend-variation-popup.js', __FILE__),
            array('jquery', 'wc-add-to-cart-variation'),
            $this->version,
            true
        );

        // Localize script
        wp_localize_script('whols-bulk-order-form', 'wholsBulkOrder', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('whols_bulk_order_nonce'),
            'config' => array(
                // Configurable options from config() method
                'titleText' => self::get_config('bof_title_text'),
                'redirectAfterAdd' => self::get_config('bof_redirect_after_add'),
                
                // Static strings
                'searchingText' => esc_html__('Searching...', 'whols'),
                'productNotFoundText' => esc_html__('No products found...', 'whols'),
                'errorAddingToCart' => esc_html__('Error adding products to cart', 'whols'),
                'pleaseSelectAllOptions' => esc_html__('Please select all product options before adding to the formm.', 'whols'),
            )
        ));
    }
}

// Initialize the class
Bulk_Order_Form::get_instance();