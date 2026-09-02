<?php
/**
 * Plugin Name: Whols Pro - WooCommerce Wholesale Prices
 * Plugin URI:  https://hasthemes.com/plugins/whols-woocommerce-wholesale-prices/
 * Description: Provides all the nacessary features to create wholesale pricing for the WooCommerce products
 * Version:     2.4.12
 * Author:      HasThemes
 * Author URI:  https://hasthemes.com
 * License:     GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: whols
 * Requires Plugins:  woocommerce
 * Domain Path: /languages
 */

use const Whols_Pro\PL_VERSION;
use const Whols_Pro\PL_FILE;
use const Whols_Pro\PL_PATH;
use const Whols_Pro\PL_URL;

// If this file is accessed directly, exit.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Whols class
 *
 * @since 1.0.0
 */
final class Whols_Pro {

	/**
	 * Whols version
	 *
	 * @since 1.0.0
	 */
	public $version = '2.4.12';

	/**
	 * The single instance of the class
	 *
	 * @since 1.0.0
	 */
	protected static $_instance = null;

	/**
	 * Main Whols Instance
	 *
	 * Ensures only one instance of Whols is loaded or can be loaded
	 *
	 * @since 1.0.0
	 */
	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	/**
	 * Whols Constructor
	 *
	 * @since 1.0.0
	 */
	private function __construct() {
		$this->define_constants();
		$this->includes();
		$this->run();
	}

	/**
	 * Define the required constants
	 *
	 * @since 1.0.0
	 */
	private function define_constants() {
		define( 'Whols_Pro\PL_VERSION', $this->version );

		define( 'Whols_Pro\PL_FILE', __FILE__ );

		define( 'Whols_Pro\PL_PATH', __DIR__ );

		define( 'Whols_Pro\PL_URL', plugins_url( '', PL_FILE ) );

		define( 'Whols_Pro\PL_ASSETS', PL_URL . '/assets' );

		// Dedicated constant for rewrite rules versioning
		// IMPORTANT: Only increment this when making changes to rewrite endpoints
		define( 'Whols_Pro\REWRITE_RULES_VERSION', '3.0' );
	}

	/**
	 * Include required core files and libraries
	 *
	 * @since 1.0.0
	 */
	public function includes() {
		/**
		 * Including plugin file for secutiry purpose
		 */
		if ( ! function_exists( 'is_plugin_active' ) ) {
			include_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		if ( ! function_exists( 'get_current_screen' ) ) {
			require_once ABSPATH . '/wp-admin/includes/screen.php';
		}

		/**
		 * Including Codestar Framework
		 */
		if ( ! class_exists( 'CSF' ) ) {
			require_once PL_PATH . '/libs/codestar-framework-custom/classes/setup.class.php';
			require_once PL_PATH . '/includes/Admin/csf-fields/CSF_Field_registration_details.php';
		}

		/**
		 * Load files
		 */
		require_once PL_PATH . '/includes/functions.php';
		whols_include_plugin_file('includes/class-assets.php');
		whols_include_plugin_file('includes/class-compatibility.php');

		// Custom Posts, Txonomies, Metaboxes etc
		whols_include_plugin_file('includes/class-admin.php');
		whols_include_plugin_file('includes/Admin/class-custom-posts.php');
		whols_include_plugin_file('includes/Admin/class-custom-taxonomies.php');
		whols_include_plugin_file('includes/Admin/class-wholesaler-request-metabox.php');
		whols_include_plugin_file('includes/Admin/class-product-metabox.php');
		whols_include_plugin_file('includes/Admin/class-user-metabox.php');
		whols_include_plugin_file('includes/Admin/class-role-cat-metabox.php');
		whols_include_plugin_file('includes/Admin/class-product-category-metabox.php');
		whols_include_plugin_file('includes/Admin/class-product-list-table-custom-columns.php');
		whols_include_plugin_file('includes/Admin/class-menu.php');
		whols_include_plugin_file('includes/Admin/class-role-manager.php');
		whols_include_plugin_file('includes/Admin/class-migration-data.php');
		whols_include_plugin_file('includes/Admin/class-reports-manager.php');
		whols_include_plugin_file('includes/Admin/class-manual-order.php');
		whols_include_plugin_file('includes/Admin/class-polylang-integration.php');

		// Wholesale Product Pricing
		whols_include_plugin_file('includes/class-wholesale-product-pricing.php');

		// Popup feature for entire Plugin to use
		whols_include_plugin_file('includes/popup/class-whols-popup.php');

		whols_include_plugin_file('includes/class-frontend.php');
		whols_include_plugin_file('includes/Frontend/class-login-register.php');
		whols_include_plugin_file('includes/Frontend/class-product-query.php');
		whols_include_plugin_file('includes/Frontend/class-website-restriction.php');
		whols_include_plugin_file('includes/Frontend/class-woo-config.php');
		whols_include_plugin_file('includes/dynamic-rules/class-dynamic-rules.php');
		whols_include_plugin_file('includes/class-ajax-actions.php');
		whols_include_plugin_file('includes/class-email-notifications.php');
		whols_include_plugin_file('includes/class-email-placeholder-helper.php');
		whols_include_plugin_file('includes/class-manage-order.php');
		whols_include_plugin_file('includes/class-gateway-invoice-payment-manage.php');
		whols_include_plugin_file('includes/blocks/class-block-registration.php');
		whols_include_plugin_file('includes/class-secure-action-links.php');

		// Vue settings
		whols_include_plugin_file('includes/vue-settings/class-init.php');

		// Modular features
		whols_include_plugin_file('includes/wallet/class-wallet.php');
		whols_include_plugin_file('includes/bulk-order-form/class-bulk-order-form.php');
		whols_include_plugin_file('includes/save-order-list/class-save-order-list.php');
		whols_include_plugin_file('includes/request-a-quote/class-request-a-quote.php');
		whols_include_plugin_file('includes/request-a-quote/class-conversation.php');
		whols_include_plugin_file('includes/Admin/class-product-quick-edit-fields.php');

		whols_include_plugin_file('includes/Frontend/class-tax-manager.php');

		if ( is_admin() ) {
			add_action('wp_loaded', function(){
				require_once __DIR__ . '/includes/Admin/license/WholsPro.php';
			});
		}
	}

	/**
	 * First initialization of the plugin
	 *
	 * @since 1.0.0
	 */
	private function run() {
		register_activation_hook( __FILE__, array( $this, 'register_activation_hook_cb' ) );
		register_deactivation_hook( __FILE__, array( $this, 'register_deactivation_hook_cb' ) );

		// Flush permalink on plugin update
		add_action( 'upgrader_process_complete', array($this, 'upgrader_process_complete_cb'), 10, 2 );

		if ( ! is_plugin_active( 'woocommerce/woocommerce.php' ) ) {
			add_action( 'admin_notices', array( $this, 'build_dependencies_notice' ) );
		} else {
			// Set up localisation.
			add_action( 'init', array( $this, 'load_plugin_textdomain' ) );

			// Finally initialize this plugin.
			add_action( 'plugins_loaded', array( $this, 'plugins_loaded_cb' ) );

			// Maybe redirect to the admin page
			add_action( 'admin_init', array( $this, 'do_activation_redirect' ) );
		}
	}

	/**
	 * Do stuff upon plugin activation
	 *
	 * @since 1.0.0
	 */
	public function register_activation_hook_cb() {
		// deactivate the free plugin if active.
		if ( ! function_exists( 'is_plugin_active' ) ) {
			include_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		if ( is_plugin_active( 'whols/whols.php' ) ) {
			add_action(
				'update_option_active_plugins',
				function() {
					deactivate_plugins( 'whols/whols.php' );
				}
			);
		}

		$installed = get_option( 'whols_pro_installed' );

		if ( ! $installed ) {
			update_option( 'whols_pro_installed', time() );
		}

		update_option( 'whols_pro_version', PL_VERSION );
		update_option( 'whols_pro_run_products_update', true );
		update_option( 'whols_pro_run_orders_update', true );

		update_option('whols_flush_permalink', '1');
		
		// Save initial settings if not already.
		$existing_settings = get_option('whols_options');
		if ( empty($existing_settings) ) {
			$defaults = Whols_Pro\Vue_Settings\Settings_Defaults::get_defaults();
			update_option( 'whols_options', $defaults );
		}

		update_option( 'whols_do_activation_redirect', 'yes' );
	}

	/**
	 * Do stuff upon plugin deactivation
	 */
	public function register_deactivation_hook_cb() {
		update_option('whols_flush_permalink', '1');
	}

	/**
	 * Maybe redirect to the admin page
	 * 
	 * Checks if the activation redirect flag is set and redirects to the admin page if needed
	 * 
	 * @return void
	 */
	public function do_activation_redirect() {
		// Only run on admin page load
		if ( ! is_admin() || wp_doing_ajax() ) {
			return;
		}

		// Check if we should redirect
		$redirect = get_option( 'whols_do_activation_redirect' );
		
		if ( 'yes' === $redirect ) {
			// Delete the redirect option to prevent multiple redirects
			delete_option( 'whols_do_activation_redirect' );

			$redirect_link = admin_url( 'admin.php?page=whols-admin' );

			if( whols_should_show_onboarding() ){
				$redirect_link = admin_url( 'admin.php?page=whols-admin#onboarding' );
			}
			
			// Redirect to the admin page
			wp_safe_redirect( $redirect_link );
			exit;
		}
	}

	public function upgrader_process_complete_cb($upgrader, $hook_extra) {
		// Check if plugin is active
		if ( ! function_exists( 'is_plugin_active' ) ) {
			include_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$plugin_file = 'whols-pro/whols-pro.php';
		if( !is_plugin_active( $plugin_file ) ){
			return;
		}

		if($hook_extra['action'] === 'update' && $hook_extra['type'] === 'plugin' && in_array($plugin_file, $hook_extra['plugins'])){
			update_option('whols_flush_permalink', '1');
		}
	}

	/**
	 * Load the plugin textdomain
	 *
	 * @since 1.0.0
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain( 'whols', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
	}

	/**
	 * Initialize this plugin
	 *
	 * @since 1.0.0
	 */
	public function plugins_loaded_cb() {
		// Both admin + frontend.
		new Whols_Pro\Ajax_Actions();
		new Whols_Pro\Manage_Assets();
		new Whols_Pro\Manage_Order();
		new Whols_Pro\Compatibility();
		new Whols_Pro\Admin\Custom_Posts();
		new Whols_Pro\Admin\Custom_Taxonomies();
		new Whols_Pro\Manage_Quote();
		new Whols_Pro\Manage_Conversation();
		new Whols_Pro\Wallet_Manager();

		// Frontend.
		new Whols_Pro\Frontend();
		new Whols_Pro\Frontend\Woo_Config();
		new Whols_Pro\Frontend\Manage_Product_Query();

		new Whols_Pro\Blocks\Block_Registration();

		// Prior this was instantiate only in the Frontend.php file
		// The reason why moved it here is to load it on both frontend & admin because for using the has_shortcode function in the admin area too.
		new Whols_Pro\Frontend\Wholesaler_Login_Register();

		if ( is_admin() ) {
			new Whols_Pro\Admin();
			new Whols_Pro\Admin\Menu();
		}

		// Insert default role.
		add_action( 'init', array( $this, 'insert_default_term' ), 12 );

		// Test mode.
		$this->init_test_mode();
	}

	/**
	 * Output a admin notice when build dependencies not met
	 *
	 * @since 1.0.0
	 */
	public function build_dependencies_notice() {
		$message = sprintf(
			/* translators: 1: Whols, 2: WooCommerce. */
			esc_html__( '%1$s plugin requires the %2$s plugin to be installed and activated in order to work.', 'whols' ),
			'<strong>' . esc_html__( 'Whols', 'whols' ) . '</strong>',
			'<strong>' . esc_html__( 'WooCommerce', 'whols' ) . '</strong>'
		);

		printf( '<div class="notice notice-warning"><p>%1$s</p></div>', wp_kses_post( $message ) );
	}

	/**
	 * Create and set default role
	 */
	public function insert_default_term() {
		// check if category(term) exists.
		$cat_exists = term_exists( 'whols_default_role', 'whols_role_cat' );

		if ( ! $cat_exists ) {
			// if term is not exist, insert it.
			$new_cat = wp_insert_term(
				esc_html__( 'Default Role', 'whols' ),
				'whols_role_cat',
				array(
					'description' => esc_html__( 'Default Wholesale Role', 'whols' ),
					'slug'        => 'whols_default_role',
				)
			);
			// wp_insert_term returns an array on success so we need to get the term_id from it.
			$default_cat_id = ( $new_cat && is_array( $new_cat ) ) ? $new_cat['term_id'] : false;
		} else {
			// if default category is already inserted, term_exists will return it's term_id.
			$default_cat_id = $cat_exists;
		}

		// Setting default_{$taxonomy} option value as our default term_id to make them default and non-removable (like default uncategorized WP category).
		$stored_default_cat = get_option( 'whols_default_role' );

		if ( empty( $stored_default_cat ) && $default_cat_id ) {
			update_option( 'whols_default_role', $default_cat_id );
		}
	}

	/**
	 * Implement test mode feature
	 * If test mode is enabled, it adds whols_default_role to the current logged in administrator user
	 * and if the test mode is disabled, it removes the whols_default_role from the administrator
	 */
	public function init_test_mode() {
		if ( is_user_logged_in() && current_user_can( 'manage_options' ) ) {

			$current_user = wp_get_current_user();
			$is_test_mode = whols_get_option( 'show_wholesale_price_for' ) === 'administrator' ? true : false;

			$test_mode_meta = get_user_meta( get_current_user_id(), 'whols_test_mode', true );

			if ( $is_test_mode && ! $test_mode_meta && ! array_intersect( $current_user->roles, array( 'whols_default_role' ) ) ) {
				$current_user->add_role( 'whols_default_role' );
				update_user_meta( get_current_user_id(), 'whols_test_mode', 1 );
			} elseif ( ! $is_test_mode && $test_mode_meta && array_intersect( $current_user->roles, array( 'whols_default_role' ) ) ) {
				$current_user->remove_role( 'whols_default_role' );
				delete_user_meta( get_current_user_id(), 'whols_test_mode' );
			}
		}
	}

}

/**
 * Returns the main instance of Whols
 *
 * @since 1.0.0
 */
function whols_pro() { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName.FunctionNameInvalid
	if( function_exists( 'is_plugin_active' ) && is_plugin_active( 'whols/whols.php' ) ){
		deactivate_plugins( 'whols/whols.php' );
	}

	if(!class_exists('Whols_Lite') && !function_exists('whols_lite')){
		return Whols_Pro::instance();
	}
}

// Kick-off the plugin.
whols_pro();