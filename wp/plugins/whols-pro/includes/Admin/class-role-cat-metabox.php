<?php
/**
 * Whols Role Cat Metabox
 *
 * @since 1.0.0
 */

namespace Whols_Pro\Admin;

/**
 * Taxonomy_Options class
 */
class Role_Cat_Metabox {

    /**
     * Role_Cat_Metabox constructor
     *
     * @since 1.0.0
     */
    public function __construct() {
      // Only run for ?taxonomy=whols_role_cat page
      // Fixed: Conflict with WC Payment Gateway page
      $taxonomy = isset($_GET['taxonomy']) ? sanitize_text_field($_GET['taxonomy']) : '';

      if( $taxonomy === 'whols_role_cat' ){
        $this->metabox_options();
      }
    }

    /**
     * Options for customer role
     *
     * @since 1.0.0
     */
    public function metabox_options() {
         $prefix = 'whols_role_tax_meta';

         // Create taxonomy options
         \CSF::createTaxonomyOptions( $prefix, array(
           'taxonomy'  => 'whols_role_cat',
           'data_type' => 'serialize', // The type of the database save options. `serialize` or `unserialize`
         ) );

         // Create a section & fields
         \CSF::createSection( $prefix, array(
           'fields' => array(

                array(
                  'id'         => 'disable_coupon',
                  'title'      => esc_html__( 'Disable Coupons', 'whols'),
                  'type'       => 'select',
                  'options'     => array(
                    ''          => esc_html__( 'Use Global Option', 'whols' ),
                    'yes'        => esc_html__( 'Yes', 'whols' ),
                    'no'         => esc_html__( 'No', 'whols' ),
                  ),
                ),

                array(
                    'id'          => 'disable_payment_methods',
                    'type'        => 'checkbox',
                    'title'       => esc_html__( 'Disable Payment Methods', 'whols' ),
                    'multiple'    => true,
                    'placeholder' => esc_html__( 'Select payment methods to disable for this role', 'whols' ),
                    'options'     => whols_get_payment_gateways_for_dropdown(),
                    'desc'       => esc_html__( 'Leave it empty to use the global option. If you disable any payment method from here. The Global option will not be used.' ),
                ),
                
                array(
                    'id'         => 'allow_free_shipping',
                    'type'       => 'checkbox',
                    'title'      => esc_html__( 'Allow Free Shipping', 'whols'),
                    'label'      => esc_html__( 'Free Shipping will not work unless you have enabled & configured free shipping into the "WooCommerce > Settings > Shipping Zones"'  , 'whols' ),
                ),
                
                array(
                    'id'         => 'exclude_tax',
                    'type'       => 'select',
                    'title'      => esc_html__( 'Exclude Tax', 'whols'),
                    'options'     => array(
                      ''          => esc_html__( 'Use Global Option', 'whols' ),
                      'yes'        => esc_html__( 'Yes', 'whols' ),
                      'no'         => esc_html__( 'No', 'whols' ),
                    ),
                    'desc'      => esc_html__( 'Exclude / Exempt Tax for the Customers of this Role'  , 'whols' ),
                ),
            )
         ) );  
    }
}