<?php
defined('ABSPATH') || exit;

/**
 * Módulo de Tagging e Identidade do Visitante (_adsentice_vuid)
 */
class Adsentice_Visitor_Tagging {

    private static $instance = null;
    private $cookie_name = '_adsentice_vuid';

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('init', array($this, 'ensure_visitor_cookie'));
    }

    public function ensure_visitor_cookie() {
        if (headers_sent() || isset($_COOKIE[$this->cookie_name])) {
            return;
        }

        $vuid = 'vuid_' . wp_generate_password(24, false);
        setcookie(
            $this->cookie_name,
            $vuid,
            time() + (365 * 24 * 60 * 60), // 1 ano
            COOKIEPATH,
            COOKIE_DOMAIN,
            is_ssl(),
            true // httponly
        );
        $_COOKIE[$this->cookie_name] = $vuid;
    }

    public function get_vuid() {
        return isset($_COOKIE[$this->cookie_name]) ? sanitize_text_field($_COOKIE[$this->cookie_name]) : 'anonymous';
    }
}
