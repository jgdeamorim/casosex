<?php
namespace Whols_Pro\Dynamic_Rules;

class Rules_Inspector {
    private static $instance = null;
    private $dynamic_rules;
    
    public static function get_instance() {
        if (self::$instance == null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function __construct() {
        if( $this->config('enable_dynamic_rules_inspector') ){
            $this->init();
        }
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
            'enable_dynamic_rules_inspector' => whols_get_option('enable_dynamic_rules_inspector', false),
        );
        
        // Return the requested option or default
        return isset($config[$option_name]) ? $config[$option_name] : $default;
    }
    
    /**
     * Initialize rules inspector
     */
    private function init() {
        // Always add the admin bar menu for administrators
        add_action('admin_bar_menu', [$this, 'add_inspector_menu_to_admin_bar'], 100);
        
        if ($this->is_inspector_active()) {
            add_action('wp_footer', [$this, 'render_rules_inspector']);
            add_action('wp_enqueue_scripts', [$this, 'enqueue_inspector_assets']);
            
            // Add product ID column to cart table
            add_filter('woocommerce_cart_item_name', [$this, 'add_product_id_to_cart_item'], 10, 3);
        }
    }
    
    /**
     * Add product ID to cart item name when inspector is active
     *
     * @param string $product_name Product name HTML
     * @param array $cart_item Cart item data
     * @param string $cart_item_key Cart item key
     * @return string Modified product name HTML
     */
    public function add_product_id_to_cart_item($product_name, $cart_item, $cart_item_key) {
        if (!$this->should_show_inspector()) {
            return $product_name;
        }

        $product = isset( $cart_item['data'] ) ? $cart_item['data'] : null;

        // Skip if product is not valid
        if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
            return $product_name;
        }

        $product_id = $product->get_id();
        $parent_id = $product->get_parent_id();
        
        // Get the actual product ID (parent product for variations)
        $actual_product_id = $parent_id > 0 ? $parent_id : $product_id;
        
        // Get product categories
        $categories = get_the_terms($actual_product_id, 'product_cat');
        $category_slugs = [];
        
        if (!empty($categories) && !is_wp_error($categories)) {
            foreach ($categories as $category) {
                $category_slugs[] = $category->slug;
            }
        }
        
        $id_html = '<div class="whols-inspector-product-id">';
        
        if ($parent_id > 0) {
            // This is a variation
            $id_html .= sprintf('<span>Variation ID: <code>%d</code></span><br><span>Product ID: <code>%d</code></span>', 
                $product_id, $parent_id);
        } else {
            // Simple product
            $id_html .= sprintf('<span>Product ID: <code>%d</code></span>', $product_id);
        }
        
        // Add category slugs if available
        if (!empty($category_slugs)) {
            $id_html .= '<br><span>Category Slugs: <code>' . implode(', ', $category_slugs) . '</code></span>';
        }
        
        $id_html .= '</div>';
        
        return $product_name . $id_html;
    }
    
    /**
     * Check if inspector is active
     */
    private function is_inspector_active() {
        return isset($_GET['inspect']) && $_GET['inspect'] == '1';
    }
    
    /**
     * Check if rules inspector should be shown on current page
     */
    private function should_show_inspector() {
        return $this->is_inspector_active() && current_user_can('manage_options') &&
               (is_cart() || is_checkout());
    }
    
    /**
     * Add inspector menu to admin bar
     *
     * @param WP_Admin_Bar $admin_bar
     */
    public function add_inspector_menu_to_admin_bar($admin_bar) {
        // Only show to administrators
        if (!current_user_can('manage_options')) {
            return;
        }
        
        // Only show cart and checkout pages
        if (!(is_cart() || is_checkout())) {
            return;
        }
        
        // Get current URL
        $current_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        
        // Add or remove inspect parameter
        if ($this->is_inspector_active()) {
            // Remove inspect parameter if it's already active
            $target_url = remove_query_arg('inspect', $current_url);
            $title = 'Close Rules Inspector';
            $button_style = 'background-color:#72aee6;color:white;';
        } else {
            // Add inspect parameter
            $target_url = add_query_arg('inspect', '1', $current_url);
            $title = 'Open Rules Inspector';
            $button_style = '';
        }
        
        // Add menu item with icon and inline style
        $admin_bar->add_menu([
            'id'    => 'whols-dynamic-rules-inspector',
            'title' => '<span style="' . $button_style . 'display:inline-block;padding:0 8px;"><span class="dashicons dashicons-visibility" style="font-family:dashicons !important;font-size:18px;line-height:1;padding-right:4px;position:relative;top:6px;display:inline-block;"></span>' . $title . '</span>',
            'href'  => $target_url,
            'meta'  => [
                'title' => $title
            ]
        ]);
    }
    

    
    /**
     * Set the dynamic rules instance
     */
    public function set_dynamic_rules($dynamic_rules) {
        $this->dynamic_rules = $dynamic_rules;
    }
    
    /**
     * Get inspection data for all rules
     */
    public function get_debug_data() {
        if (!$this->is_inspector_active() || !$this->dynamic_rules) {
            return [];
        }
        
        $rule_data = whols_get_option('dynamic_rules', []);
        $debug_data = [];
        
        foreach ($rule_data as $index => $rule_data_item) {
            $rule_debug = [
                'index' => $index,
                'label' => $rule_data_item['rule_label'] ?? "Rule #" . ($index + 1),
                'action' => $rule_data_item['action'] ?? '',
                'status' => $rule_data_item['status'] ?? 'inactive',
                'enabled' => !empty($rule_data_item['status']),
                'conditions_met' => false,
                'conditions' => [],
                'applied' => false,
                'execution_time' => 0
            ];
            
            // Only check conditions for enabled rules
            if ($rule_debug['enabled']) {
                $start_time = microtime(true);
                
                try {
                    $conditions = new Conditions\Conditions($rule_data_item);
                    $rule_debug['conditions_met'] = $conditions->are_satisfied();
                    $rule_debug['conditions'] = $conditions->get_debug_info();
                    $rule_debug['applied'] = $rule_debug['conditions_met'];
                } catch (Exception $e) {
                    $rule_debug['error'] = $e->getMessage();
                }
                
                $rule_debug['execution_time'] = round((microtime(true) - $start_time) * 1000, 2);
            }
            
            $debug_data[] = $rule_debug;
        }
        
        return $debug_data;
    }
    
    /**
     * Get cart inspection information
     */
    private function get_cart_debug_info() {
        if (!function_exists('WC') || !WC()->cart) {
            return [];
        }
        
        return [
            'subtotal' => WC()->cart->get_subtotal(),
            'total' => WC()->cart->get_total('raw'),
            'item_count' => count(WC()->cart->get_cart()),
            'quantity_count' => WC()->cart->get_cart_contents_count(),
            'fees' => WC()->cart->get_fees(),
            'coupons' => WC()->cart->get_applied_coupons(),
        ];
    }
    
    /**
     * Enqueue inspector assets
     */
    public function enqueue_inspector_assets() {
        if (!$this->should_show_inspector()) {
            return;
        }
        
        $css = $this->get_inspector_css();
        wp_add_inline_style('wp-block-library', $css);
        
        $js = $this->get_inspector_js();
        wp_add_inline_script('jquery', $js);
    }
    
    /**
     * Get inspector CSS styles
     */
    private function get_inspector_css() {
        return ".whols-rules-inspector {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 380px;
    max-height: 70vh;
    background: #ffffff;
    color: #1a202c;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    font-size: 12px;
    line-height: 1.5;
    border-radius: 12px;
    z-index: 99999;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border: 1px solid #e2e8f0;
}

.whols-inspector-header {
    padding: 16px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.whols-inspector-header h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
}

.whols-inspector-toggle {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 14px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    font-weight: 600;
    transition: background-color 0.2s;
}

.whols-inspector-toggle:hover {
    background: rgba(255, 255, 255, 0.3);
}

.whols-inspector-content {
    max-height: calc(70vh - 64px);
    overflow-y: auto;
    padding: 0;
}

.whols-inspector-content.collapsed {
    display: none;
}

.whols-inspector-section {
    border-bottom: 1px solid #f1f5f9;
}

.whols-inspector-section:last-child {
    border-bottom: none;
}

.whols-inspector-section-header {
    padding: 12px 20px;
    background: #f8fafc;
    font-weight: 600;
    font-size: 13px;
    color: #475569;
    border-bottom: 1px solid #e2e8f0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.whols-inspector-rule {
    margin: 0;
    padding: 16px 20px;
    background: #ffffff;
    border-left: 4px solid #e2e8f0;
    border-bottom: 1px solid #f1f5f9;
    transition: all 0.2s ease;
}

.whols-inspector-rule:hover {
    background: #f8fafc;
}

.whols-inspector-rule:last-child {
    border-bottom: none;
}

.whols-inspector-rule.enabled {
    border-left-color: #3b82f6;
}

.whols-inspector-rule.applied {
    border-left-color: #10b981;
    background: #ecfdf5;
}

.whols-inspector-rule.applied:hover {
    background: #d1fae5;
}

.whols-inspector-rule.failed {
    border-left-color: #ef4444;
    background: #fef2f2;
}

.whols-inspector-rule.failed:hover {
    background: #fee2e2;
}

.whols-inspector-rule.error {
    border-left-color: #f59e0b;
    background: #fffbeb;
}

.whols-inspector-rule.error:hover {
    background: #fef3c7;
}

.whols-inspector-rule-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.whols-inspector-rule-title {
    font-weight: 600;
    font-size: 13px;
    color: #111827;
}

.whols-inspector-status {
    font-size: 10px;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.whols-inspector-status.inactive { 
    background: #f1f5f9; 
    color: #64748b; 
}

.whols-inspector-status.active { 
    background: #dbeafe; 
    color: #1d4ed8; 
}

.whols-inspector-status.applied { 
    background: #dcfce7; 
    color: #166534; 
}

.whols-inspector-status.failed { 
    background: #fee2e2; 
    color: #dc2626; 
}

.whols-inspector-status.error { 
    background: #fef3c7; 
    color: #d97706; 
}

.whols-inspector-meta {
    font-size: 11px;
    color: #64748b;
    margin: 4px 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.whols-inspector-conditions {
    margin-top: 12px;
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.whols-inspector-condition {
    font-size: 11px;
    margin: 6px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
}

.whols-inspector-condition:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.whols-inspector-condition-name {
    font-weight: 500;
    color: #374151;
}

.whols-inspector-condition-result {
    font-weight: 600;
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.whols-inspector-condition-result.pass { 
    background: #dcfce7; 
    color: #166534; 
}

.whols-inspector-condition-result.fail { 
    background: #fee2e2; 
    color: #dc2626; 
}

.whols-inspector-condition-details {
    font-size: 10px;
    color: #6b7280;
    margin-top: 4px;
    padding: 8px 12px;
    background: #ffffff;
    border-radius: 6px;
    border-left: 3px solid #e5e7eb;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}

.whols-inspector-details-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.whols-inspector-details-list li {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    border-bottom: 1px dashed #e5e7eb;
}

.whols-inspector-details-list li:last-child {
    border-bottom: none;
}

.whols-inspector-details-list li strong {
    color: #4b5563;
    margin-right: 8px;
}

/* Nested list styles */
.whols-inspector-nested-list {
    list-style: none;
    margin: 4px 0 0 0;
    padding: 6px 0 0 12px;
    border-left: 1px dashed #e5e7eb;
}

.whols-inspector-nested-list li {
    display: flex;
    justify-content: space-between;
    padding: 3px 0;
    border-bottom: 1px dotted #e5e7eb;
    font-size: 9px;
}

.whols-inspector-nested-list li:last-child {
    border-bottom: none;
}

.whols-inspector-nested-list li strong {
    color: #64748b;
    margin-right: 8px;
}

.whols-inspector-cart-info {
    padding: 16px 20px;
    font-size: 11px;
}

.whols-inspector-cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
}

.whols-inspector-cart-item:last-child {
    border-bottom: none;
}

.whols-inspector-cart-label {
    color: #6b7280;
    font-weight: 500;
}

.whols-inspector-cart-value {
    color: #111827;
    font-weight: 600;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}

.whols-inspector-error {
    color: #dc2626;
    font-weight: 500;
    margin-top: 8px;
    padding: 8px 12px;
    background: #fee2e2;
    border-radius: 6px;
    border-left: 3px solid #dc2626;
}

.whols-inspector-timing {
    color: #6b7280;
    font-size: 10px;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}

/* Cart product ID styles */
.whols-inspector-product-id {
    margin-top: 8px;
    font-size: 11px;
    padding: 3px 6px;
    border-left: 3px solid #94a3b8;
}";
    }
    
    /**
     * Get inspector JavaScript
     */
    private function get_inspector_js() {
        return "
        jQuery(document).ready(function($) {
            // Set cookie function
            function setInspectorCookie(collapsed) {
                var date = new Date();
                date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
                document.cookie = 'whols_inspector_collapsed=' + collapsed + '; expires=' + date.toUTCString() + '; path=/; SameSite=Lax';
            }
            
            // Delete cookie function
            function deleteInspectorCookie() {
                document.cookie = 'whols_inspector_collapsed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
            }
            
            // Get cookie function
            function getInspectorCookie() {
                var name = 'whols_inspector_collapsed=';
                var decodedCookie = decodeURIComponent(document.cookie);
                var cookieArray = decodedCookie.split(';');
                
                for (var i = 0; i < cookieArray.length; i++) {
                    var cookie = cookieArray[i].trim();
                    if (cookie.indexOf(name) === 0) {
                        return cookie.substring(name.length, cookie.length) === 'true';
                    }
                }
                return false; // Default to expanded
            }
            
            // Initialize state from cookie
            var content = $('.whols-inspector-content');
            var toggle = $('.whols-inspector-toggle');
            var isCollapsed = getInspectorCookie();
            
            if (isCollapsed) {
                content.addClass('collapsed').hide();
                toggle.html('+');
            } else {
                content.removeClass('collapsed').show();
                toggle.html('−');
            }
            
            // Toggle handler
            $('.whols-inspector-header').on('click', function() {
                if (content.hasClass('collapsed')) {
                    content.removeClass('collapsed').show();
                    toggle.html('−');
                    setInspectorCookie(false);
                } else {
                    content.addClass('collapsed').hide();
                    toggle.html('+');
                    setInspectorCookie(true);
                }
            });
            
            // Check if there's a close button in the admin bar and attach event handler
            $('#wp-admin-bar-whols-dynamic-rules-inspector.whols-inspector-active a').on('click', function() {
                // Delete the cookie when the inspector is closed
                deleteInspectorCookie();
            });
        });
        ";
    }
    
    /**
     * Render rules inspector HTML
     */
    public function render_rules_inspector() {
        if (!$this->should_show_inspector()) {
            return;
        }
        
        $debug_data = $this->get_debug_data();
        $cart_info = $this->get_cart_debug_info();
        
        echo '<div class="whols-rules-inspector">';
        
        // Header
        echo '<div class="whols-inspector-header">';
        echo '<h4>🔍 Dynamic Rules Inspector</h4>';
        echo '<button class="whols-inspector-toggle">−</button>';
        echo '</div>';
        
        echo '<div class="whols-inspector-content">';
        
        // Cart Information Section
        if (!empty($cart_info)) {
            echo '<div class="whols-inspector-section">';
            echo '<div class="whols-inspector-section-header">Cart Information</div>';
            echo '<div class="whols-inspector-cart-info">';
            
            foreach ($cart_info as $key => $value) {
                echo '<div class="whols-inspector-cart-item">';
                echo '<span class="whols-inspector-cart-label">' . esc_html(ucwords(str_replace('_', ' ', $key))) . ':</span>';
                
                if (in_array($key, ['subtotal', 'total'])) {
                    echo '<span class="whols-inspector-cart-value">' . wc_price($value) . '</span>';
                } elseif (is_array($value)) {
                    echo '<span class="whols-inspector-cart-value">' . count($value) . ' items</span>';
                } else {
                    echo '<span class="whols-inspector-cart-value">' . esc_html($value) . '</span>';
                }
                echo '</div>';
            }
            
            echo '</div>';
            echo '</div>';
        }
        
        // Rules Section
        echo '<div class="whols-inspector-section">';
        echo '<div class="whols-inspector-section-header">Rules (' . count($debug_data) . ')</div>';
        
        if (empty($debug_data)) {
            echo '<div class="whols-inspector-rule">';
            echo '<p style="color: #999; margin: 8px 0;">No rules configured</p>';
            echo '</div>';
        } else {
            foreach ($debug_data as $rule) {
                $this->render_rule_debug($rule);
            }
        }
        
        echo '</div>';
        echo '</div>';
        echo '</div>';
    }
    
    /**
     * Render individual rule debug information
     */
    private function render_rule_debug($rule) {
        $rule_class = 'whols-inspector-rule';
        $status_class = 'inactive';
        $status_text = 'Inactive';
        
        if (isset($rule['error'])) {
            $rule_class .= ' error';
            $status_class = 'error';
            $status_text = 'Error';
        } elseif ($rule['enabled']) {
            $rule_class .= ' enabled';
            if ($rule['applied']) {
                $rule_class .= ' applied';
                $status_class = 'applied';
                $status_text = 'Applied';
            } else {
                $rule_class .= ' failed';
                $status_class = 'failed';
                $status_text = 'Failed';
            }
        } else {
            $status_text = 'Disabled';
        }
        
        echo '<div class="' . esc_attr($rule_class) . '">';
        
        // Rule Header
        echo '<div class="whols-inspector-rule-header">';
        echo '<span class="whols-inspector-rule-title">' . esc_html($rule['label']) . '</span>';
        echo '<span class="whols-inspector-status ' . esc_attr($status_class) . '">' . esc_html($status_text) . '</span>';
        echo '</div>';
        
        // Rule Meta
        if (!empty($rule['action'])) {
            echo '<div class="whols-inspector-meta">Action: ' . esc_html($rule['action']) . '</div>';
        }
        
        if ($rule['execution_time'] > 0) {
            echo '<div class="whols-inspector-meta whols-inspector-timing">Execution: ' . esc_html($rule['execution_time']) . 'ms</div>';
        }
        
        // Error Message
        if (isset($rule['error'])) {
            echo '<div class="whols-inspector-error">Error: ' . esc_html($rule['error']) . '</div>';
        }
        
        // Conditions
        if ($rule['enabled'] && !empty($rule['conditions'])) {
            echo '<div class="whols-inspector-conditions">';
            
            if (empty($rule['conditions'])) {
                echo '<div class="whols-inspector-meta">No conditions configured</div>';
            } else {
                foreach ($rule['conditions'] as $condition) {
                    $result_class = $condition['result'] ? 'pass' : 'fail';
                    $result_text = $condition['result'] ? '✓ PASS' : '✗ FAIL';
                    
                    echo '<div class="whols-inspector-condition">';
                    echo '<span class="whols-inspector-condition-name">' . esc_html($condition['name']) . '</span>';
                    echo '<span class="whols-inspector-condition-result ' . esc_attr($result_class) . '">' . esc_html($result_text) . '</span>';
                    echo '</div>';
                    
                    if (!empty($condition['details'])) {
                        echo '<div class="whols-inspector-condition-details">';
                        
                        // Check if details is an array (from our updated condition classes)
                        if (is_array($condition['details'])) {
                            echo '<ul class="whols-inspector-details-list">';
                            foreach ($condition['details'] as $key => $value) {
                                $formatted_key = ucfirst(str_replace('_', ' ', $key));
                                
                                // Handle nested arrays like conditions, current_stats
                                if (is_array($value)) {
                                    echo '<li><strong>' . esc_html($formatted_key) . ':</strong>';
                                    echo '<ul class="whols-inspector-nested-list">';
                                    foreach ($value as $nested_key => $nested_value) {
                                        $formatted_nested_key = ucfirst(str_replace('_', ' ', $nested_key));
                                        
                                        // Format nested value
                                        if (is_bool($nested_value)) {
                                            $formatted_nested_value = $nested_value ? 'Yes' : 'No';
                                        } elseif (is_null($nested_value)) {
                                            $formatted_nested_value = 'None';
                                        } elseif (is_numeric($nested_value) && $nested_value > 100 && (
                                            $nested_key === 'total_spent' || 
                                            $nested_key === 'min_total_spent' ||
                                            strpos($nested_key, 'price') !== false ||
                                            strpos($nested_key, 'total') !== false
                                        )) {
                                            $formatted_nested_value = wc_price($nested_value);
                                        } else {
                                            $formatted_nested_value = esc_html($nested_value);
                                        }
                                        
                                        echo '<li><strong>' . esc_html($formatted_nested_key) . ':</strong> ' . $formatted_nested_value . '</li>';
                                    }
                                    echo '</ul>';
                                    echo '</li>';
                                }
                                // Format value based on type for non-array values
                                elseif ($key === 'value' || $key === 'current') {
                                    // For cart total condition, format as price if numeric and > 100
                                    if (is_numeric($value) && $value > 100 && strpos($condition['name'], 'Cart Total') !== false) {
                                        $formatted_value = wc_price($value);
                                    } else {
                                        $formatted_value = esc_html($value);
                                    }
                                    echo '<li><strong>' . esc_html($formatted_key) . ':</strong> ' . $formatted_value . '</li>';
                                } elseif ($key === 'operator') {
                                    // Format operator for better readability
                                    $operators = [
                                        'at_least' => '≥ (at least)',
                                        'less_than' => '< (less than)',
                                        'equal' => '= (equal to)'
                                    ];
                                    $formatted_value = isset($operators[$value]) ? $operators[$value] : esc_html($value);
                                    echo '<li><strong>' . esc_html($formatted_key) . ':</strong> ' . $formatted_value . '</li>';
                                } else {
                                    if (is_bool($value)) {
                                        $formatted_value = $value ? 'Yes' : 'No';
                                    } elseif (is_null($value)) {
                                        $formatted_value = 'None';
                                    } else {
                                        $formatted_value = esc_html($value);
                                    }
                                    echo '<li><strong>' . esc_html($formatted_key) . ':</strong> ' . $formatted_value . '</li>';
                                }
                            }
                            echo '</ul>';
                        } else {
                            // Fallback for string details
                            echo esc_html($condition['details']);
                        }
                        
                        echo '</div>';
                    }
                }
            }
            
            echo '</div>';
        }
        
        echo '</div>';
    }
}