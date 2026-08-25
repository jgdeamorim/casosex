<?php
defined('ABSPATH') || exit;

/**
 * Endpoints REST API Soberanos do Adsentice Second Brain (/wp-json/adsentice/v1/)
 */
class Adsentice_REST_API {

    private static $instance = null;
    private $namespace = 'adsentice/v1';

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    public function register_routes() {
        // Rota 1: Injeção de RenderContext no Transient Cache
        register_rest_route($this->namespace, '/context', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'update_render_context'),
            'permission_callback' => array($this, 'verify_api_permission'),
        ));

        // Rota 2: Exportação da Árvore AST Gutenberg para o Astro
        register_rest_route($this->namespace, '/ast/(?P<id>\d+)', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'get_post_ast'),
            'permission_callback' => '__return_true', // Público para o Astro
        ));
    }

    public function update_render_context(WP_REST_Request $request) {
        $slot_id = $request->get_param('slot_id');
        $context = $request->get_param('context');
        $ttl     = $request->get_param('ttl') ? intval($request->get_param('ttl')) : 3600;

        if (empty($slot_id) || empty($context)) {
            return new WP_Error('invalid_params', 'slot_id e context são obrigatórios.', array('status' => 400));
        }

        $success = Adsentice_Transient_Cache::get_instance()->set_render_context($slot_id, $context, $ttl);

        return rest_ensure_response(array(
            'success'   => $success,
            'slot_id'   => $slot_id,
            'timestamp' => time(),
        ));
    }

    public function get_post_ast(WP_REST_Request $request) {
        $post_id = intval($request['id']);
        $post    = get_post($post_id);

        if (!$post) {
            return new WP_Error('post_not_found', 'Post/Página não encontrada.', array('status' => 404));
        }

        $blocks = parse_blocks($post->post_content);

        return rest_ensure_response(array(
            'id'       => $post_id,
            'title'    => $post->post_title,
            'slug'     => $post->post_name,
            'ast'      => $blocks,
            'modified' => $post->post_modified_gmt,
        ));
    }

    public function verify_api_permission(WP_REST_Request $request) {
        $secret = $request->get_header('X-Adsentice-Secret');
        $expected_secret = get_option('adsentice_api_secret', '');

        if (!empty($expected_secret) && $secret === $expected_secret) {
            return true;
        }

        return current_user_can('manage_options');
    }
}
