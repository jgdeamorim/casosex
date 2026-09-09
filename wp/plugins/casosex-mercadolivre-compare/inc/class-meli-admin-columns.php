<?php
/**
 * Coluna customizada de Inteligência MeLi na listagem edit.php?post_type=product
 * ADR-0239
 */

if (!defined('ABSPATH')) {
    exit;
}

class CasoSex_MeLi_Admin_Columns {

    public static function init() {
        add_filter('manage_edit-product_columns', [__CLASS__, 'add_columns']);
        add_action('manage_product_posts_custom_column', [__CLASS__, 'render_column_content'], 10, 2);
    }

    public static function add_columns($columns) {
        $new_columns = [];
        foreach ($columns as $key => $title) {
            $new_columns[$key] = $title;
            if ($key === 'price') {
                $new_columns['meli_intelligence'] = 'Preço MeLi / Margem';
            }
        }
        return $new_columns;
    }

    public static function render_column_content($column, $post_id) {
        if ($column !== 'meli_intelligence') {
            return;
        }

        $score = get_post_meta($post_id, 'meli_matching_score', true);
        $market_price = floatval(get_post_meta($post_id, 'meli_market_price', true));
        $cost_price = floatval(get_post_meta($post_id, '_cost_price', true));
        $opp = get_post_meta($post_id, 'meli_opportunity_index', true);

        if (!$score) {
            echo '<span style="color: #94a3b8; font-size: 11px;">— Sem análise</span>';
            return;
        }

        $margin = $market_price > 0 && $cost_price > 0 ? ($market_price - $cost_price) : 0;
        ?>
        <div style="font-size: 12px; line-height: 1.4;">
            <strong>MeLi:</strong> R$ <?php echo number_format($market_price, 2, ',', '.'); ?>
            <br>
            <strong>Margem:</strong> <span style="color: #10b981; font-weight: bold;">R$ <?php echo number_format($margin, 2, ',', '.'); ?></span>
            <br>
            <?php if ($opp === 'HIGH_MARGIN'): ?>
                <span style="display: inline-block; background: #10b981; color: #fff; font-size: 10px; padding: 1px 5px; border-radius: 3px; margin-top: 3px; font-weight: bold;">🟢 Alta Margem</span>
            <?php elseif ($opp === 'ORDER_BUMP'): ?>
                <span style="display: inline-block; background: #f59e0b; color: #fff; font-size: 10px; padding: 1px 5px; border-radius: 3px; margin-top: 3px;">🟡 Order Bump</span>
            <?php else: ?>
                <span style="display: inline-block; background: #94a3b8; color: #fff; font-size: 10px; padding: 1px 5px; border-radius: 3px; margin-top: 3px;">⚪ Catálogo</span>
            <?php endif; ?>
        </div>
        <?php
    }
}
