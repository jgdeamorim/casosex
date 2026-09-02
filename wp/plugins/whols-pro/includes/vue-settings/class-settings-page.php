<?php
namespace Whols_Pro\Vue_Settings;
use const Whols_Pro\PL_URL;
use const Whols_Pro\PL_PATH;
use const Whols_Pro\PL_VERSION;

class Settings_Page {
    public $version;

    public $plugin_screens = array(
        'toplevel_page_whols-admin'
    );

    private static $_instance = null;
    /**
     * Get Instance
     */
    public static function instance(){
        if( is_null( self::$_instance ) ){
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Constructor
     */
    public function __construct() {
        // Version with time for cache busting
		if( defined( 'WP_DEBUG' ) && WP_DEBUG ){
			$this->version = time();
		} else {
			$this->version = PL_VERSION;
		}

        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));

        // Add hook to remove admin notices on specific pages
        add_action('admin_head', array($this, 'remove_admin_notices'), 1);

        // Intentionally load the editor in the footer to override the css loaded in the header
        add_action('admin_footer', function(){
            $current_screen = get_current_screen();

            if (!in_array($current_screen->id, $this->plugin_screens)) {
                return;
            }

            wp_enqueue_editor();
        });
    }

    public function remove_admin_notices() {
        $current_screen = get_current_screen();

        // Define the screens
        $hide_notices_screens = array(
            'toplevel_page_whols-admin'
        );

        // Check if current screen should have notices removed
        if (in_array($current_screen->id, $hide_notices_screens)) {
            // Remove all notices
            remove_all_actions('admin_notices');
            remove_all_actions('all_admin_notices');
        }
    }

    /**
     * Enqueue required scripts and styles
     */
    public function enqueue_scripts($hook) {
        if (!in_array($hook, $this->plugin_screens)) {
            return;
        }

        $is_dev = isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST'] === 'plugindev.test';

        if ($is_dev && $this->is_vite_running()) {
            // Development mode - load from Vite dev server
            wp_enqueue_script(
                'whols-vue-settings',
                'http://localhost:5173/@vite/client',
                array(),
                null,
                true
            );
            add_filter('script_loader_tag', function($tag, $handle, $src) {
                // For cache busting
                $src = $src . '?v=' . $this->version;

                if ($handle === 'whols-vue-settings' || $handle === 'whols-vue-settings-app') {
                    return '<script type="module" src="' . esc_url($src) . '"></script>';
                }
                return $tag;
            }, 10, 3);

            wp_enqueue_script(
                'whols-vue-settings-app',
                'http://localhost:5173/src/vue-settings/main.js' . '?v=' . $this->version,
                array('whols-vue-settings'),
                null,
                true
            );
        } else {
            // Production mode - load built files
            // CSS
            wp_enqueue_style(
                'whols-vue-settings-style',
                PL_URL . '/build/vue-settings/style.css',
                array(),
                $this->version,
                'all'
            );

            // JS
            wp_enqueue_script(
                'whols-vue-settings',
                PL_URL . '/build/vue-settings/main.js',
                array(),
                $this->version,
                true
            );

            // For cache busting
            // $this->enqueue_scripts_from_manifest(); // Updated the vite build process, no longer needed

            add_filter('script_loader_tag', function($tag, $handle, $src) {
                if ($handle === 'whols-vue-settings') {
                    return '<script type="module" src="' . esc_url($src) . '"></script>';
                }
                return $tag;
            }, 10, 3);
        }

        $menu = whols_include_plugin_file( 'includes/vue-settings/menu.php' );

        // Localize script with nonce and API info
        wp_localize_script('whols-vue-settings', 'wholsSettings', array(
            'nonce'       => wp_create_nonce('wp_rest'),
            'ajaxurl'     => admin_url('admin-ajax.php'),
            'ajaxNonce'   => wp_create_nonce('whols_nonce'),
            'apiBaseURL'  => esc_url_raw(rest_url()),
            'pluginVersion' => PL_VERSION,
            'apiEndpoint' => 'whols/v1/settings',
            'rolesApiEndpoint' => 'whols/v1/wholesaler-roles',
            'hasAdminBar' => is_admin_bar_showing(),
            'adminUrl' => admin_url(),
            'supportUrl' => 'https://hasthemes.com/contact-us/',
            'docsUrl' => 'https://wpwhols.com/docs/',
            'proUrl' => 'https://wpwhols.com/pricing/',

            // There is some dynamic defaults so manage it from one place here
            'defaultSettings' => Settings_Defaults::get_defaults(),

            // Translations
            'i18n' => array(
                'save' => esc_html__('General Settings', 'whols'),
                'loading' => esc_html__('Loading...', 'whols'),
                'error' => esc_html__('Error', 'whols'),
            ),

            // Plugins Settings
            'globalSettings' => array(
                'show_wholesale_price_for' => whols_get_option('show_wholesale_price_for'),
                'currency_symbol' => get_woocommerce_currency_symbol()
            ),

            'menu' => $menu,
            'shouldShowOnboarding' => whols_should_show_onboarding()
        ));

        wp_localize_script('whols-vue-settings', 'wholsSettingsSchema', Settings_Schema::get_schema());

        // Load WooCommerce CSS for form builder preview consistency
        $this->enqueue_woocommerce_styles();
    }

    /**
     * Enqueue WooCommerce styles for form builder preview consistency
     */
    private function enqueue_woocommerce_styles() {
        // Only load WooCommerce CSS if WooCommerce is active
        if (!class_exists('WooCommerce')) {
            return;
        }

        // Get WooCommerce plugin URL and version
        $wc_plugin_url = WC()->plugin_url();
        $wc_version = defined('WC_VERSION') ? WC_VERSION : WC()->version;
        $suffix = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '' : '.min';
        
        // Define WooCommerce CSS files to load
        $wc_styles = array(
            'woocommerce-general-admin' => '/assets/css/woocommerce' . $suffix . '.css',
        );
        
        // Register and enqueue WooCommerce CSS files for admin area
        foreach ($wc_styles as $handle => $path) {
            wp_register_style(
                $handle,
                $wc_plugin_url . $path,
                array(),
                $wc_version
            );
            wp_enqueue_style($handle);
        }

        // Add custom CSS to scope WooCommerce styles to form builder canvas only
        wp_add_inline_style('woocommerce-general-admin', '
            /* Scope WooCommerce form styles to form builder canvas only */
            .form-builder-canvas .field-wrapper{
                padding: 10px;
            }
            .form-builder-canvas p{
                margin: 0;
            }
            
            .form-builder-canvas .whols-form-row > label{
                display: block;
                font-weight: 600;
                margin-bottom: 0.5em;
            }
            
            .form-builder-canvas .whols-input-wrapper,
            .form-builder-canvas .input-text,
            .form-builder-canvas select,
            .form-builder-canvas textarea {
                width: 100%;
                max-width: 100%;
            }
            
            .form-builder-canvas .input-text,
            .form-builder-canvas select,
            .form-builder-canvas textarea {
                padding: 0.4em;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                line-height: 1.618;
            }
            
            .form-builder-canvas .required {
                color: #f46048;
            }
            
            .form-builder-canvas .optional {
                opacity: 0.7;
                font-weight: normal;
            }
            
            .form-builder-canvas .description {
                display: inline;
                font-size: 16px;
                color: rgb(51, 65, 85);
                font-style: normal;
                font-weight: 400;
                font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                line-height: 26.4px;
                margin-bottom: 0.5em;
                margin-top: -0.25em;
                box-sizing: border-box;
                overflow-wrap: break-word;
                text-size-adjust: 100%;
                -webkit-font-smoothing: antialiased;
            }
            
            /* Radio option styling */
            .form-builder-canvas .whols-form-row.type--radio .whols-radio-option {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            /* Prevent WooCommerce styles from affecting admin UI outside form builder */
            #wpadminbar *, 
            #adminmenumain *, 
            #wpfooter *,
            .wp-toolbar *,
            .wrap:not(.form-builder-canvas) * {
                /* Reset any potential WooCommerce interference */
            }
        ');
    }

    /**
     * Check if Vite dev server is running
     */
    private function is_vite_running() {
        $handle = curl_init('http://localhost:5173');
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_NOBODY, true);

        curl_exec($handle);
        $error = curl_errno($handle);
        curl_close($handle);

        return !$error;
    }

    public function enqueue_scripts_from_manifest() {
        $manifiest_file = PL_PATH . '/build/vue-settings/.vite/manifest.json';
        if (!file_exists($manifiest_file)) {
            return;
        }

        $manifest = json_decode(file_get_contents($manifiest_file), true);

        $ordered_manifest = array();

        // Prepare the scripts_data
        foreach ($manifest as $file => $info) {
            if ( isset($info['isEntry']) && $info['isEntry'] ) {
                if( !$info['imports'] ){
                    $ordered_manifest[] = $info;
                } else {
                    $ordered_manifest[] = $info;

                    // Loop through imports and add them to the scripts_data
                    foreach ($info['imports'] as $import) {
                        if (isset($manifest[$import])) {
                            $ordered_manifest[] = $manifest[$import];
                        }
                    }
                }
            }
        }

        // Now enqueue the scripts
        foreach ($ordered_manifest as $index => $info) {
            if( isset($info['name']) && isset($info['src']) ){
                $handle = $info['name'];
                if( isset($info['isEntry']) && $info['isEntry'] ){
                    $handle = 'whols-vue-settings';
                }

                $src = PL_URL . '/build/vue-settings/' . $info['file'];

                wp_enqueue_script($handle, $src, array(), null, true);
            }
        }
    }

    /**
     * Render the Vue app container
     */
    public function render_app() {
        ?>
        <div class="wrap">
            <div id="whols-vue-settings-app"></div>
        </div>
        <?php
    }
}
