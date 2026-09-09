<?php
defined('ABSPATH') || exit;

/**
 * Módulo de Mutação Ativa de Conteúdo e WooCommerce (Interceptador PHP em Tempo Real)
 */
class Adsentice_Content_Mutator {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Intercepta e muta o conteúdo do Gutenberg nativamente no WordPress
        add_filter('the_content', array($this, 'mutate_gutenberg_content'), 999);

        // Intercepta e injeta badges/ofertas dinâmicas no WooCommerce
        add_action('woocommerce_single_product_summary', array($this, 'inject_dynamic_woo_badge'), 15);
    }

    public function mutate_gutenberg_content($content) {
        if (is_admin() || empty($content)) {
            return $content;
        }

        $post_id = get_the_ID();
        
        // Tenta buscar contexto por ID da pagina, por slug ou por slot padrao
        $context = null;
        if ($post_id) {
            $context = Adsentice_Transient_Cache::get_instance()->get_render_context('page_' . $post_id);
        }
        if (!$context) {
            $context = Adsentice_Transient_Cache::get_instance()->get_render_context('about_hero_slot');
        }

        if (!$context) {
            return $content;
        }

        // Muta Títulos (H1-H6 nativos ou Greenshift)
        if (!empty($context['headline'])) {
            $headline_html = esc_html($context['headline']);
            $content = preg_replace(
                '/(<h[1-6][^>]*>)(.*?)(<\/h[1-6]>)/is',
                '$1<span class="adsentice-mutated-headline" style="color:var(--wp--preset--color--primary, #B99579);">' . $headline_html . '</span>$3',
                $content,
                1
            );
        }

        // Muta CTAs / Botões
        if (!empty($context['cta'])) {
            $cta_html = esc_html($context['cta']);
            if (strpos($content, 'gspb-buttonbox-title') !== false) {
                $content = preg_replace(
                    '/(<span class="gspb-buttonbox-title"[^>]*>)(.*?)(<\/span>)/is',
                    '$1' . $cta_html . '$3',
                    $content,
                    1
                );
            } else {
                $content = preg_replace(
                    '/(<a[^>]*class="[^"]*button[^"]*"[^>]*>)(.*?)(<\/a>)/is',
                    '$1' . $cta_html . '$3',
                    $content,
                    1
                );
            }
        }

        return $content;
    }

    public function inject_dynamic_woo_badge() {
        $vuid = Adsentice_Visitor_Tagging::get_instance()->get_vuid();
        $badge = get_transient('adsentice_badge_' . sanitize_key($vuid));

        if ($badge) {
            echo '<div class="adsentice-dynamic-badge" style="background:#e53e3e; color:#fff; padding:6px 12px; border-radius:4px; font-weight:bold; margin-bottom:10px; display:inline-block;">' . esc_html($badge) . '</div>';
        }
    }
}
