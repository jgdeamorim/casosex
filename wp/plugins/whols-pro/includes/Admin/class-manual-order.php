<?php
namespace Whols_Pro\Admin;

/**
 * Manage Data Migration
 */
class Manage_Manual_Order {
    /**
	 * [$_instance]
	 *
	 * @var null
	 */
	private static $_instance = null;

	/**
	 * [instance] Initializes a singleton instance
	 *
	 * @return Manage_Manual_Order
	 */
	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}
    
    public function __construct() {
        add_action('woocommerce_order_item_add_action_buttons', array($this, 'render_select_wholesaler'));
        add_action('woocommerce_before_order_item_object_save', array($this, 'apply_discount_based_on_wholesaler_role'), 10, 2);
    }

    public function render_select_wholesaler( $order ){
        if( !$order->is_editable() ){
            return;
        }
        
        ob_start();
        
        echo '<select id="whols_manual_role">';
        echo '<option value="">Select Wholesaler Role</option>';

        foreach( whols_roles_dropdown_options() as $key => $label){
            echo "<option value='{$key}'>{$label}</option>";
        }
        echo '</select>';

        echo ob_get_clean();
    }

    public function apply_discount_based_on_wholesaler_role($wc_order_item_product, $arg2){
        $selected_wholesale_role = !empty($_REQUEST['manual_whols_role']) ? sanitize_text_field($_REQUEST['manual_whols_role']) : '';

        if( !$selected_wholesale_role ){ // Dont need to work with discounts
            return;
        }

        $item_qty = $wc_order_item_product->get_quantity();
        if($wc_order_item_product instanceof \WC_Order_Item_Product && $item_qty >= 1){
            
            // Get discounted / wholesale product price
            $wholesale_status = whols_get_product_status($wc_order_item_product->get_product());
            $order_item_qty = $wc_order_item_product->get_quantity();
            $discounted_product_price_total = 0;

            // If has tier it is priority first
            $tiers = !empty($wholesale_status['tiers']) ? $wholesale_status['tiers'] : array();
            ksort($tiers);

            if( $tiers ){
                foreach( $tiers as $tier_min_qty => $tier_price ){
                    if( $order_item_qty >= $tier_min_qty ){
                        $discounted_product_price_total = $tier_price * $order_item_qty;
                        break;
                    }
                }
            } else {
                $wsale_price_type = !empty($wholesale_status['price_type']) ? $wholesale_status['price_type'] : 'flat_rate';
                $wsale_price_value = !empty($wholesale_status['price_value']) ? $wholesale_status['price_value'] : '';
                $wsale_product_min_qty = !empty($wholesale_status['minimum_quantity']) ? $wholesale_status['minimum_quantity'] : '';

                if( $wsale_price_type == 'flat_rate' && $wsale_price_value && $order_item_qty >= $wsale_product_min_qty ){
                    $discounted_product_price_total = $wsale_price_value * $order_item_qty;
                }
            }

            // Apply discount
            if( $discounted_product_price_total ){
                $wc_order_item_product->set_total($discounted_product_price_total);
            }
        }
    }
}