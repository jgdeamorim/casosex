<?php
defined('ABSPATH') || exit;

/**
 * Módulo de Telemetria Ativa (Hooks WooCommerce & WP)
 */
class Adsentice_Observer_Engine {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Hooks do WooCommerce
        add_action('woocommerce_add_to_cart', array($this, 'on_add_to_cart'), 10, 6);
        add_action('woocommerce_order_status_changed', array($this, 'on_order_status_changed'), 10, 4);
    }

    public function on_add_to_cart($cart_item_key, $product_id, $quantity, $variation_id, $variation, $cart_item_data) {
        $vuid = Adsentice_Visitor_Tagging::get_instance()->get_vuid();

        $payload = array(
            'event'       => 'telemetry:cart_add',
            'vuid'        => $vuid,
            'product_id'  => $product_id,
            'quantity'    => $quantity,
            'timestamp'   => time(),
        );

        $this->dispatch_telemetry_async($payload);
    }

    public function on_order_status_changed($order_id, $old_status, $new_status, $order) {
        $payload = array(
            'event'      => 'telemetry:order_status',
            'order_id'   => $order_id,
            'old_status' => $old_status,
            'new_status' => $new_status,
            'total'      => $order ? $order->get_total() : 0,
            'timestamp'  => time(),
        );

        $this->dispatch_telemetry_async($payload);
    }

    private function dispatch_telemetry_async($payload) {
        // Envio assíncrono não-bloqueante para o Adsentice SaaS
        $endpoint = apply_filters('adsentice_telemetry_endpoint', 'http://localhost:3000/api/telemetry/wp');

        wp_remote_post($endpoint, array(
            'method'      => 'POST',
            'timeout'     => 1, // Timeout ultracurto para nunca desacelerar o PHP
            'blocking'    => false,
            'headers'     => array('Content-Type' => 'application/json'),
            'body'        => json_encode($payload),
        ));
    }
}
