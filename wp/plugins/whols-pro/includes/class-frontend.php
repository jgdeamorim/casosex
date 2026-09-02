<?php
namespace Whols_Pro;
use const Whols_Pro\PL_ASSETS;

/**
 * Whols Frontend
 *
 * @since 1.0.0
 */
class Frontend {
	public $version = '';

    /**
     * Frontend constructor.
     *
     * @since 1.0.0
     */
    public function __construct() {
		// Set time as the version for development mode.
		if( defined('WP_DEBUG') && WP_DEBUG ){
			$this->version = time();
		} else {
			$this->version = PL_VERSION;
		}

        // Admin assets hook into action.
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );

        // Filter the content to add the [whols_registration_form] shortcode to the assigned page
        add_filter( 'the_content', array( $this, 'filter_the_content' ) );

        // Body class
        add_filter('body_class', array($this, 'custom_body_classes'));
    }

    /**
     * Enqueue frontend assets
     *
     * @since 1.0.0
     */
    public function enqueue_frontend_assets() {
        $recaptcha_site_key   = whols_get_option('recaptcha_site_key', '');
        
        wp_enqueue_style( 'whols-style', PL_ASSETS . '/css/style.css', array(), $this->version );

		// Scripts
        $suffix = \Automattic\Jetpack\Constants::is_true( 'SCRIPT_DEBUG' ) ? '' : '.min';
        wp_enqueue_script( 'serializejson', WC()->plugin_url() . '/assets/js/jquery-serializejson/jquery.serializejson' . $suffix . '.js', array( 'jquery' ), '2.8.1' );

        wp_register_script( 'recaptcha-api', 'https://www.google.com/recaptcha/api.js?render='. $recaptcha_site_key, array(), false, true);

        wp_enqueue_script( 'whols-frontend', PL_ASSETS . '/js/frontend.js', array( 'jquery' ), $this->version );

		// Localize the script with new data
		$localize = array(
			'ajax_url'                    => admin_url( 'admin-ajax.php' ),
			'nonce'                       => wp_create_nonce( 'whols_nonce' ),
			'auto_apply_minimum_quantity' => whols_get_option('auto_apply_minimum_quantity') ? 1 : 0,

            'enable_recaptcha'         => whols_get_option('enable_recaptcha') ? 1 : 0,
            'recaptcha_site_key'       => whols_get_option('recaptcha_site_key'),
            'recaptcha_badge_disable'  => whols_get_option('recaptcha_badge_disable'),
		);
		wp_localize_script( 'whols-frontend', 'whols_params', $localize );

        // Localized var used in this fiile
        wp_register_script( 'whols-registration', PL_ASSETS . '/js/registration.js', array( 'jquery' ), $this->version );
    }

    /**
     * If the content doesn't have the shortcode, add it to the end of the content
     *
     * @param $content The content of the post.
     *
     * @return string The content of the page, with the shortcode appended to the end.
     */
    public function filter_the_content( $content ){
        global $post;

        if( isset($post->ID) && $post->ID == whols_get_option('registration_page') && !has_shortcode($content, 'whols_registration_form') ){
            $shortcode = do_shortcode('[whols_registration_form]');
            return $content . $shortcode;
        }

        return $content;
    }

    public function custom_body_classes($classes) {
        if(whols_is_wholesaler()){
            $classes[] = 'whols--is_wholesaler';
        }

        return $classes;
    }
}
