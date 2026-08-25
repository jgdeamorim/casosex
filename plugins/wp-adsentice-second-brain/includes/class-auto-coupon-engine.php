<?php
defined('ABSPATH') || exit;

/**
 * Módulo de Auto-Aplicacao de Cupons Dinamicos no Carrinho (Closed-Loop Conversion)
 */
class Adsentice_Auto_Coupon_Engine {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('woocommerce_before_cart', array($this, 'apply_dynamic_coupon'));
        add_action('woocommerce_before_checkout_form', array($this, 'apply_dynamic_coupon'));
    }

    public function apply_dynamic_coupon() {
        if (!function_exists('WC') || !WC()->cart) {
            return;
        }

        $vuid = Adsentice_Visitor_Tagging::get_instance()->get_vuid();
        $assigned_coupon = get_transient('adsentice_coupon_' . sanitize_key($vuid));

        if ($assigned_coupon && !WC()->cart->has_discount($assigned_coupon)) {
            WC()->cart->apply_coupon($assigned_coupon);
        }
    }
}
