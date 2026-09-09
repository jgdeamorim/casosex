<?php
/**
 * Plugin Name: Adsentice Second Brain
 * Plugin URI:  https://adsentice.com.br
 * Description: Gânglio Nervoso Local do Adsentice Brain-OODA para WordPress e WooCommerce. Propicia telemetria ativa, cache local 0ms, tagging de visitantes e cupons por intenção.
 * Version:     1.0.0
 * Author:      Adsentice Core & Antigravity
 * Text Domain: adsentice-second-brain
 * License:     GPL-2.0+
 */

defined('ABSPATH') || exit;

define('ADSENTICE_SECOND_BRAIN_VERSION', '1.0.0');
define('ADSENTICE_SECOND_BRAIN_PATH', plugin_dir_path(__FILE__));
define('ADSENTICE_SECOND_BRAIN_URL', plugin_dir_url(__FILE__));

// Carrega os módulos da arquitetura soberana (ADR-0110)
require_once ADSENTICE_SECOND_BRAIN_PATH . 'includes/class-visitor-tagging.php';
require_once ADSENTICE_SECOND_BRAIN_PATH . 'includes/class-transient-cache.php';
require_once ADSENTICE_SECOND_BRAIN_PATH . 'includes/class-observer-engine.php';
require_once ADSENTICE_SECOND_BRAIN_PATH . 'includes/class-auto-coupon-engine.php';
require_once ADSENTICE_SECOND_BRAIN_PATH . 'includes/class-slot-decorator.php';
require_once ADSENTICE_SECOND_BRAIN_PATH . 'includes/class-rest-api.php';
require_once ADSENTICE_SECOND_BRAIN_PATH . 'includes/class-content-mutator.php';
require_once ADSENTICE_SECOND_BRAIN_PATH . 'includes/class-dataforseo-bridge.php';
require_once ADSENTICE_SECOND_BRAIN_PATH . 'includes/class-commercial-dossier.php';

/**
 * Classe Principal do Plugin
 */
class Adsentice_Second_Brain {
    
    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->init_modules();
    }

    private function init_modules() {
        Adsentice_Visitor_Tagging::get_instance();
        Adsentice_Transient_Cache::get_instance();
        Adsentice_Observer_Engine::get_instance();
        Adsentice_Auto_Coupon_Engine::get_instance();
        Adsentice_Slot_Decorator::get_instance();
        Adsentice_REST_API::get_instance();
        Adsentice_Content_Mutator::get_instance();
        Adsentice_Commercial_Dossier::init();
    }

    public static function activate() {
        if (empty(get_option('adsentice_api_secret'))) {
            update_option('adsentice_api_secret', wp_generate_password(32, false));
        }
        flush_rewrite_rules();
    }

    public static function deactivate() {
        flush_rewrite_rules();
    }
}

// Hooks de Ativação e Desativação WPORG Standard
register_activation_hook(__FILE__, array('Adsentice_Second_Brain', 'activate'));
register_deactivation_hook(__FILE__, array('Adsentice_Second_Brain', 'deactivate'));

// Inicializa o plugin
add_action('plugins_loaded', array('Adsentice_Second_Brain', 'get_instance'));
