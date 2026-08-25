<?php
defined('ABSPATH') || exit;

/**
 * Módulo de Injeção de Data-Attributes (data-slot-id, data-slot-variant) nos Blocos Gutenberg
 */
class Adsentice_Slot_Decorator {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_filter('render_block', array($this, 'decorate_block_html'), 10, 2);
    }

    public function decorate_block_html($block_content, $block) {
        if (is_admin() || empty($block_content)) {
            return $block_content;
        }

        $block_name = isset($block['blockName']) ? sanitize_key(str_replace('/', '-', $block['blockName'])) : 'core-block';
        $slot_variant = apply_filters('adsentice_slot_variant_override', 'default', $block_name);

        // Injeta data-attributes na primeira tag HTML do bloco
        $replacement = sprintf(
            ' data-slot-id="%s" data-slot-variant="%s" ',
            esc_attr($block_name),
            esc_attr($slot_variant)
        );

        return preg_replace('/^<([a-z1-6]+)/i', '<$1' . $replacement, $block_content, 1);
    }
}
