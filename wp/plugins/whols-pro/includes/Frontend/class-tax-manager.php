<?php
namespace Whols_Pro\Frontend;

/**
 * Tax Manager
 */
class Tax_Manager {
    public static $instance;

    public static function get_instance() {
        if ( is_null( self::$instance ) ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor.
     */
    public function __construct() {
        add_filter( 'woocommerce_product_get_tax_class', [ $this, 'disable_tax_calculation' ], 10, 2 );
        add_filter( 'woocommerce_product_variation_get_tax_class', [ $this, 'disable_tax_calculation' ], 10, 2 );
    }

    /**
     * Disable tax calculation
     */
    public function disable_tax_calculation( $tax_class, $product ) {
        // Return if tax calculation is not enabled from WooCommerce settings
        if( !\wc_tax_enabled() ){
            return $tax_class;
        }

        if( whols_is_wholesaler() && $this->whols_get_tax_exempt_status() ){
            $tax_class = 'Zero Rate';
        }

        return $tax_class;
    }

    public function whols_get_tax_exempt_status(){
        $exclude_tax_status = (bool) whols_get_option('exclude_tax_for_wholesale_customers');

        // override role level exclude tax
        $current_user_obj   = wp_get_current_user();
        $current_user_roles = $current_user_obj->roles;

        $current_user_ws_role = '';
        foreach( $current_user_roles as $role ){
            if( term_exists( $role, 'whols_role_cat') ){
                $current_user_ws_role = $role;
            }
        }

        if( class_exists('WP_Term_Query') ){
            $roles_query = new \WP_Term_Query(array(
                'taxonomy' => 'whols_role_cat',
                'hide_empty' => false,
            ));

            // Loop through each roles
            foreach ( $roles_query->get_terms() as $term ) {
                if( $term->slug ==  $current_user_ws_role ){

                    $role_meta = get_term_meta( $term->term_id, 'whols_role_tax_meta', true );
                    $role_exclude_tax_status = isset($role_meta['exclude_tax']) ? $role_meta['exclude_tax'] : '';

                    if($role_exclude_tax_status == 'yes'){
                        $exclude_tax_status = true;
                    } elseif($role_exclude_tax_status == 'no'){
                        $exclude_tax_status = false;
                    }

                    break;

                }
            }
        }

        return $exclude_tax_status;
    }
}

// New instance
Tax_Manager::get_instance();