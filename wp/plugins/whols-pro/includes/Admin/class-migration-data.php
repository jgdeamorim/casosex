<?php
namespace Whols_Pro\Admin;

/**
 * Manage Data Migration
 */
class Manage_Data_Migration {
    
    public function __construct() {
        $data_migration = !empty($_GET['whols_data_migration']) ? sanitize_text_field($_GET['whols_data_migration']) : '';
        if( !$data_migration ){ // It goes resoouce intensive when customer has lots products and users
            return;
        }
        
        if( get_option('whols_pro_run_products_update') ){
            add_action('init', array($this, 'migrate_wholesaler_only_products_meta') );
        }

        // Migrated old users order meta to filter the orders by type
        if( get_option('whols_pro_run_orders_update') ){
            add_action('init', array($this, 'migrate_orders_meta') );
        }
    }

    /**
     * In the free version _whols_mark_this_product_as_wholesale_only meta key is used for wholesaler only products
     * but in the free version _whols_mark_this_product_as_wholesale key was used, that's why some of the cusomers
     * who migrate the plugin to free to pro version were experiencing that the products doesn't remain wholesaler only products
     * when they are upgraded to the pro version.
     * 
     * This function is intended to fix the issue for wholesale only products for upgraded customers.
     */
    public function migrate_wholesaler_only_products_meta(){
        // Prevent executing the function
        // While the request is from ajax don't run the function due to performence reason 
        if( wp_doing_ajax() || get_option('whols_pro_products_update_completed') === 'yes' ){
            return;
        }
    
        if( get_option('whols_pro_run_products_update') ){

            // loop through all products that has meta _whols_mark_this_product_as_wholesale_only key
            $args = array( 
                'post_type'              => 'product',
                'posts_per_page'         => '-1',
                'fields'                 => 'ids',
                'update_post_term_cache' => false,
                'meta_key'               => array('_whols_mark_this_product_as_wholesale' )
            );
        
            // The Query
            $the_query = new \WP_Query( $args );
            $product_ids  = $the_query->get_posts();
    
            if( ! empty( $product_ids ) ){
                foreach ( $product_ids as $p_id ){
                    $meta_val_1 = get_post_meta($p_id, '_whols_mark_this_product_as_wholesale', true);
                    $meta_val_2 = get_post_meta($p_id, '_whols_mark_this_product_as_wholesale_only', true);

                    if( $meta_val_2 === 'yes' ){
                        continue; // do nothing, conttinue
                    }

                    if( $meta_val_1 === 'yes' ){
                        update_post_meta($p_id, '_whols_mark_this_product_as_wholesale_only', 'yes');
                    }
                }
            }
            /* Restore original Post Data */
            wp_reset_postdata();
    
            // update_option('whols_pro_products_update_completed', 'yes');
        }

        update_option('whols_pro_run_products_update', '');
    }

    /**
     * It loops through all orders and checks if the customer is a wholesaler, if so it adds a meta key
     * to the order so it can be recognized as a wholesale order
     * 
     * @return void
     */
    public function migrate_orders_meta(){

        // Prevent executing the function
        // While the request is from ajax don't run the function due to performence reason 
        if( wp_doing_ajax() || get_option('whols_pro_orders_update_completed') === 'yes' ){
            return;
        }
    
        if( get_option('whols_pro_run_orders_update') ){
            $args = array( 
                'post_type'              => 'shop_order',
                'post_status'            => 'all',
                'posts_per_page'         => '-1',
                'fields'                 => 'ids',
                'update_post_term_cache' => false, 
            );
        
            // The Query
            $the_query = new \WP_Query( $args );
            $order_ids  = $the_query->get_posts();
    
            if( ! empty( $order_ids ) ){
                
                // loop through all orders
                foreach ( $order_ids as $order_id ){
                    // Check if the cutomer is wholesaler if then
                    // Take the customer roles and add a meta key, so the order will be recongnized as a wholesale order
                    $order = wc_get_order($order_id);

                    if( !is_object($order) ){
                        continue; // if the order id is not valid continue to the next order
                    }

                    // if the order is already wholesale order continue to the nxt order
                    $order_meta = get_post_meta($order_id);
                    if( isset($order_meta['_whols_order_type']) ){
                        continue;
                    }
                    
                    $cutomer_id     = $order->get_customer_id();
                    $customer_roles = whols_get_current_user_roles($cutomer_id);
                    $matched_roles  = array_intersect_key( array_flip($customer_roles), whols_roles_dropdown_options() );

                    foreach( $matched_roles as $role_name => $item ){
                        add_post_meta($order_id, '_whols_order_type', $role_name);
                    }
                }
            }
            /* Restore original Post Data */
            wp_reset_postdata();
    
            update_option('whols_pro_orders_update_completed', 'yes');
        }

        update_option('whols_pro_run_orders_update', '');
    }
}