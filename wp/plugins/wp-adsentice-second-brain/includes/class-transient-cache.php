<?php
defined('ABSPATH') || exit;

/**
 * Módulo de Cache Local de Intenção OODA (Latência Externa 0ms)
 */
class Adsentice_Transient_Cache {

    private static $instance = null;
    private $prefix = 'adsentice_render_context_';

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {}

    /**
     * Resgata o RenderContext pré-computado do cache local PHP
     */
    public function get_render_context($slot_id) {
        $key = $this->prefix . sanitize_key($slot_id);
        $context = get_transient($key);

        if (false === $context) {
            return null; // Fallback gracioso
        }

        return json_decode($context, true);
    }

    /**
     * Salva o RenderContext (Invocado via REST/MCP)
     */
    public function set_render_context($slot_id, array $data, $ttl_seconds = 3600) {
        $key = $this->prefix . sanitize_key($slot_id);
        return set_transient($key, json_encode($data), $ttl_seconds);
    }
}
