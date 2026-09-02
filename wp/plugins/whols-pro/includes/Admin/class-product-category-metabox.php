<?php
/**
 * Whols Product Category Metabox
 *
 * @since 1.0.0
 */

namespace Whols_Pro\Admin;

/**
 * Product_Category_Metabox class
 */
class Product_Category_Metabox {

    /**
     * Product_Category_Metabox constructor
     *
     * @since 1.0.0
     */
    public function __construct() {
        // $this->options();
        add_action('csf_loaded', array($this, 'options'));
    }

    /**
     * Meta options for product categories
     *
     * @since 1.0.0
     */
    public function options() {
         $pricing_model         = whols_get_option( 'pricing_model' );
         $roles                 = whols_get_taxonomy_terms();
         $price_type_2_tabs_arr = array();

         foreach( $roles as $role_slug => $role ){
             $price_type_2_tabs_arr[] =  array(
                 'title'  => $role,
                 'fields' => array(
                     // enable this pricing
                     array(
                         'id'         => $role_slug. '__enable_this_pricing',
                         'type'       => 'switcher',
                         'title'      => esc_html__( 'Enable This Pricing', 'whols'),
                         'text_on'    => esc_html__( 'Yes', 'whols' ),
                         'text_off'   => esc_html__( 'No', 'whols' ),
                     ),

                     // price type
                     array(
                         'id'          => $role_slug. '__price_type',
                         'type'        => 'select',
                         'title'       => esc_html__( 'Price Type', 'whols'),
                         'options'     => array(
                             'flat_rate'     => esc_html__( 'Flat Rate', 'whols' ),
                             'percent'       => esc_html__( 'Percent', 'whols' ),
                         ),
                     ),

                     // price value
                     array(
                         'id'    => $role_slug. '__price_value',
                         'type'  => 'text',
                         'title' => esc_html__( 'Price Value', 'whols' ),
                         'attributes'  => array(
                             'type'      => 'number',
                             'step'      => '.01',
                         ),
                     ),

                     // minimum quantity
                     array(
                         'id'    => $role_slug. '__minimum_quantity',
                         'type'  => 'text',
                         'title' => esc_html__( 'Minimum Quantity', 'whols' ),
                         'attributes'  => array(
                             'type'      => 'number',
                         ),
                     ),
                 ),
             );
         }

        if( $pricing_model == 'single_role' ){               
            $fields = array(
                // price type 1 properties
                array(
                  'id'         => 'price_type_1_properties',
                  'type'       => 'fieldset',
                  'title'      => esc_html__( 'Price Options For Pricing Model: Single', 'whols' ),
                  'fields'     => array(
                        // enable this pricing
                        array(
                          'id'         => 'enable_this_pricing',
                          'type'       => 'switcher',
                          'title'      => esc_html__( 'Enable This Pricing', 'whols'),
                          'text_on'    => esc_html__( 'Yes', 'whols' ),
                          'text_off'   => esc_html__( 'No', 'whols' ),
                          'label'      => esc_html__( '(If not enabled global options will be used)' ),
                        ),

                        // price type
                        array(
                          'id'          => 'price_type',
                          'type'        => 'select',
                          'title'       => esc_html__( 'Price Type', 'whols'),
                          'options'     => array(
                            'flat_rate'     => esc_html__( 'Flat Rate', 'whols' ),
                            'percent'       => esc_html__( 'Percent', 'whols' ),
                          ),
                        ),

                        // price value
                        array(
                          'id'    => 'price_value',
                          'type'  => 'text',
                          'title' => esc_html__( 'Price Value', 'whols' ),
                          'attributes'  => array(
                            'type'      => 'number',
                            'step'      => '.01'
                          ),
                        ),

                        // minimum quantity
                        array(
                          'id'    => 'minimum_quantity',
                          'type'  => 'text',
                          'title' => esc_html__( 'Minimum Quantity', 'whols' ),
                          'attributes'  => array(
                            'type'      => 'number',
                          ),
                        ),
                    ),
                )
            );
        } // endif single role 

        if( $pricing_model == 'multiple_role' ){               
            $fields = array(
                // price type 2 properties
                array(
                    'id'         => 'price_type_2_properties',
                    'type'       => 'tabbed',
                    'title'      => esc_html__( 'Price Options For Pricing Model: Multiple', 'whols' ),
                    'tabs'       => $price_type_2_tabs_arr,
                    'after'      => esc_html__( 'If not enabled global options will be used.' ),
                ),
            );
        } // endif multiple role 

        $prefix = 'whols_product_category_meta';
        
         // Create taxonomy meta option wrapper
         \CSF::createTaxonomyOptions( $prefix, array(
           'taxonomy'  => 'product_cat',
           'data_type' => 'serialize', // The type of the database save options. `serialize` or `unserialize`
         ) );

         // Create a section & fields
         \CSF::createSection( $prefix, array(
           'fields' => !empty($fields) ? $fields : array()
         ) );  
    }
}
