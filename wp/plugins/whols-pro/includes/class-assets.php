<?php
namespace Whols_Pro;
use const Whols_Pro\PL_URL;
use const Whols_Pro\PL_VERSION;

/**
 * Manage all of the assets of the plugin.
 */
class Manage_Assets {
    public function __construct() {
        // Register all scripts.
        add_action( 'wp_loaded', array( $this, 'register_all_scripts' ) );

        // Frontend Assets.
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );

        // Admin Assets.
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_backend_assets' ) );
    }

    public function is_plugin_screen(){

    }

    public function register_all_scripts(){
        wp_register_style( 'whols-pro', PL_URL . '/assets/css/whols-pro.css', '', PL_VERSION );
        wp_register_script( 'whols-pro', PL_URL . '/assets/js/whols-pro.js', array( 'jquery' ), PL_VERSION, true );
    }

    /**
     * Enqueue frontend assets.
     */
    public function enqueue_frontend_assets() {
        wp_enqueue_style( 'whols-pro' );
        wp_enqueue_script( 'whols-pro' );
    }

    /**
     * Enqueue backend assets.
     */
    public function enqueue_backend_assets() {
        wp_enqueue_style( 'whols-pro' );
        wp_enqueue_script( 'whols-pro' );
    }  
}