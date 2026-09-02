<?php
namespace Whols_Pro;

/**
 * Manage Order
 */
class Manage_Order {
    /**
     * Order type meta key
     */
    const ORDER_TYPE_META_KEY = '_whols_order_type';

    /**
     * Filter options for order types
     * 
     * @var array
     */
    public $filter_default_options;

    /**
     * Constructor
     */
    public function __construct() {
        add_action('admin_init', function(){ // Fixed textdomain early loading issue
            $this->filter_default_options = array(
                'all'                => __('All Orders', 'whols'),
                'wholesale_only'     => __('Only Wholesale Orders', 'whols'),
                'retail_only'        => __('Only Retail Orders', 'whols'),
            );
        });

        // Add order meta to track wholesale orders
        add_action( 'woocommerce_checkout_update_order_meta', array( $this, 'add_order_meta' ), 10, 2 );

        // Legacy WooCommerce order filtering (pre 7.0)
        add_action( 'restrict_manage_posts', array( $this, 'add_filter' ), 15 );
        add_action( 'parse_query', array( $this, 'order_type_custom_field' ) );
        
        // WooCommerce 7.0+ HPOS compatibility
        add_action( 'woocommerce_order_list_table_restrict_manage_orders', array( $this, 'add_hpos_filter' ) );
        add_filter( 'woocommerce_shop_order_list_table_prepare_items_query_args', array( $this, 'filter_hpos_orders' ) );
        
        // Adding meta data to the order item
        // It will show on the order received page and order edit page for admin
        add_action( 'woocommerce_checkout_create_order_line_item', array( $this, 'add_order_item_meta' ), 10, 4 );

        // Filter thank you message of order received page for wholesales
        add_filter( 'woocommerce_thankyou_order_received_text', array( $this, 'add_custom_thank_you_message') );
    }

    /**
     * It adds the wholesaler role to the order meta
     * 
     * @param $order_id The order ID
     * @param $posted The  data for the checkout form
     */
    public function add_order_meta( $order_id, $posted ){

        // Save the wholesaler role in the order meta
        if( whols_is_wholesaler() && !current_user_can('manage_options') ){
            $wholesaler_roles = whols_get_current_user_roles();
            // $wholesaler_roles = count($wholesaler_roles) > 1 ? implode(',', $wholesaler_roles) : current($wholesaler_roles);

            foreach( $wholesaler_roles as $slug => $role ){
                // Get the order object
                $order = wc_get_order( $order_id );
                
                // Update the order meta data
                $order->update_meta_data( self::ORDER_TYPE_META_KEY, $role );
                $order->save();
            }
            
        }
    }

    /**
     * Adds a dropdown to the legacy admin orders page that allows filtering orders by type
     * 
     * For WooCommerce versions before 7.0
     */
    public function add_filter() {
        global $typenow;
        
        $order_type = isset( $_GET['whols_order_type'] ) ? wc_clean( $_GET['whols_order_type'] ) : '';

        if( $typenow === 'shop_order' ) {
            $this->render_filter_dropdown( $order_type );
        }
    }
    
    /**
     * Adds a dropdown to the HPOS admin orders page that allows filtering orders by type
     * 
     * For WooCommerce versions 7.0+
     */
    public function add_hpos_filter() {
        $order_type = isset( $_GET['whols_order_type'] ) ? wc_clean( $_GET['whols_order_type'] ) : '';
        $this->render_filter_dropdown( $order_type );
    }
    
    /**
     * Renders the filter dropdown for both legacy and HPOS admin pages
     * 
     * @param string $order_type Currently selected order type
     */
    private function render_filter_dropdown( $order_type ) {
        $roles = whols_roles_dropdown_options();
        ?>
        <select name="whols_order_type" id="whols_order_type">
            <?php
                echo '<optgroup label="'. __('Types', 'whols') .'">';
                    foreach( $this->filter_default_options as $option_name => $option_label ){
                        printf( '<option value="%s" %s>%s</option>',
                            esc_attr( $option_name ),
                            selected( $order_type, $option_name, false ),
                            esc_html( $option_label )
                        );
                    }
                echo '</optgroup>';

                echo '<optgroup label="'. __('Roles', 'whols') .'">';
                    foreach( $roles as $option_name => $option_label ){
                        printf( '<option value="%s" %s>%s</option>',
                            esc_attr( $option_name ),
                            selected( $order_type, $option_name, false ),
                            esc_html( $option_label )
                        );
                    }
            echo '</optgroup>';
            ?>
        </select>
        <?php
    }

    /**
     * Filter order type for legacy WooCommerce orders page
     *
     * @param WP_Query $wp Query object
     */
    public function order_type_custom_field( $wp ) {
        global $pagenow;

        $post_type = !empty($wp->query_vars['post_type']) ? $wp->query_vars['post_type'] : '';

        if ( 'edit.php' !== $pagenow || 'shop_order' !== $post_type || !isset( $_GET['whols_order_type'] ) ) {
            return;
        }

        $order_type = wc_clean( wp_unslash( $_GET['whols_order_type'] ) );
        $wp->query_vars['meta_query'] = $this->get_order_type_meta_query( $order_type );
    }
    
    /**
     * Filter order type for WooCommerce 7.0+ HPOS orders page
     *
     * @param array $query_args Query arguments
     * @return array Modified query arguments
     */
    public function filter_hpos_orders( $query_args ) {
        if ( ! isset( $_GET['whols_order_type'] ) ) {
            return $query_args;
        }
        
        $order_type = wc_clean( wp_unslash( $_GET['whols_order_type'] ) );
        
        if ( ! isset( $query_args['meta_query'] ) ) {
            $query_args['meta_query'] = array();
        }
        
        $meta_query = $this->get_order_type_meta_query( $order_type );
        
        if ( ! empty( $meta_query ) ) {
            $query_args['meta_query'] = array_merge( $query_args['meta_query'], $meta_query );
        }
        
        return $query_args;
    }
    
    /**
     * Get meta query for filtering orders by type
     *
     * @param string $order_type Order type to filter by
     * @return array Meta query arguments
     */
    private function get_order_type_meta_query( $order_type ) {
        switch ( $order_type ) {
            case 'all':
                return array();

            case 'wholesale_only':
                return array(
                    array(
                        'key'     => self::ORDER_TYPE_META_KEY,
                        'compare' => 'EXISTS'
                    )
                );

            case 'retail_only':
                return array(
                    array(
                        'key'     => self::ORDER_TYPE_META_KEY,
                        'compare' => 'NOT EXISTS'
                    )
                );
            
            default:
                return array(
                    array(
                        'key'   => self::ORDER_TYPE_META_KEY,
                        'value' => $order_type,
                    )
                );
        }
    }

    /**
     * If the current user is a wholesaler and the product is wholesale priced, add a meta data to the
     * order item
     * 
     * @return void
     */
    function add_order_item_meta( $item, $cart_item_key, $values, $order ) {
        if( !whols_is_wholesaler() ){
            return;
        }     
    
        if ( whols_is_wholesale_priced( $item->get_product_id(), $item->get_quantity()) ) {
            $item->add_meta_data( '_wholesale_priced', 'Yes' );
            
            // Get the matched roles
            $matched_roles = array_intersect_key( array_flip(whols_get_current_user_roles()),  whols_roles_dropdown_options() );
            $matched_roles = array_keys($matched_roles);
    
            // Store only one role into the meta value because multiple value in one key doesn't support here like post meta
            $single_matche_role = current($matched_roles);
            if( $single_matche_role ){
                $item->add_meta_data( '_whols_role', $single_matche_role ); // Added underscore to prevent showing this meta value in the order received page
            }
        }
    }

    /**
     * It adds a custom thank you message to the order received page for wholesales.
     * 
     * @param $message The default thank you message.
     * 
     * @return string
     */
    public function add_custom_thank_you_message( $message ){
        $enable         = whols_get_option('enable_custom_thank_you_message');
        $placement      = whols_get_option('thank_you_message_placement');
        $custom_message = whols_get_option('custom_thank_you_message');

        // Determine whether should return the default message
        // so we don't need to go further
        if( !whols_is_wholesaler() || !$enable || !$custom_message ){
            return $message;
        }

        global $wp;
        if( isset($wp->query_vars['order-received']) ){
            // Order id
            $order_id = absint($wp->query_vars['order-received']); // The order ID
            $order    = wc_get_order( $order_id ); // The WC_Order object

            $custom_message = str_replace('{billing_first_name}', $order->get_billing_first_name(), $custom_message);
            $custom_message = str_replace('{billing_last_name}', $order->get_billing_last_name(), $custom_message);
            $custom_message = str_replace('{billing_email}', $order->get_billing_email(), $custom_message);
            $custom_message = '<div class="whols-custom-thank-you-message">'. wpautop($custom_message) .'</div>';
        }

        switch ($placement) {
            case 'before_default_message':
                $message =  $custom_message . $message;
				break;

            case 'after_default_message':
                $message = $message . $custom_message;
                break;
            
            default:
                $message = $custom_message;
                break;
        }

        return $message;
    }
}