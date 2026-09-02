<?php
namespace Whols_Pro;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Bulk Order Form Shortcode Handler
 * 
 * Handles the registration and rendering of the bulk order form shortcode.
 */
class Bulk_Order_Shortcode {
    /**
     * Singleton instance
     *
     * @var Bulk_Order_Shortcode
     */
    private static $instance = null;
    
    /**
     * Get the singleton instance
     *
     * @return Bulk_Order_Shortcode
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
        // Register shortcode
        add_shortcode('whols_bulk_order_form', array($this, 'render_shortcode'));
    }

    /**
     * Render shortcode output
     *
     * @param array $atts Shortcode attributes
     * @return string
     */
    public function render_shortcode($atts) {
        // Get default values from configuration
        $defaults = array(
            // Basic Configuration
            'template' => 'default',
            'title' => Bulk_Order_Form::get_config('bof_title_text'),
            
            // Quantity Controls
            'min_quantity' => 1,
            'step_quantity' => 1,
            
            // Access Control
            'role' => ''
        );
        
        // Parse shortcode attributes
        $atts = shortcode_atts($defaults, $atts, 'whols_bulk_order_form');

        // Convert string attributes to proper data types
        $atts['min_quantity'] = absint($atts['min_quantity']);
        $atts['step_quantity'] = absint($atts['step_quantity']);

        // Enqueue required assets
        $this->enqueue_assets();
        
        // Start output buffer
        ob_start();
        
        // Load template
        $this->load_template($atts);
        
        // Return rendered output
        return ob_get_clean();
    }

    /**
     * Load template file
     *
     * @param array $atts Template attributes
     */
    private function load_template($atts) {
        $template = sanitize_key($atts['template']);
        $template_file = $this->get_template_path($template);
        
        // Check if template exists
        if (file_exists($template_file)) {
            include $template_file;
        } else {
            echo '<p>' . esc_html__('Bulk order form template not found.', 'whols') . '</p>';
        }
    }

    /**
     * Get template path
     *
     * @param string $template Template name
     * @return string Full template path
     */
    private function get_template_path($template) {
        // Theme template path (for overrides)
        $theme_template = get_stylesheet_directory() . '/whols-pro/bulk-order-form/' . $template . '/template.php';
        
        // Check if theme has an override
        if (file_exists($theme_template)) {
            return $theme_template;
        }
        
        // Fallback to default template
        return plugin_dir_path(dirname(__FILE__)) . 'bulk-order-form/templates/default/template.php';
    }

    /**
     * Enqueue required assets
     */
    private function enqueue_assets() {
        // Enqueue the registered assets from the main class
        wp_enqueue_style('whols-bulk-order-form');
        wp_enqueue_script('whols-bulk-order-form');
        
        // Enqueue variation popup assets
        wp_enqueue_script('wc-add-to-cart-variation');
        wp_enqueue_style('whols-variation-popup');
        wp_enqueue_script('whols-variation-popup');
    }
}

// Initialize the class
Bulk_Order_Shortcode::get_instance();