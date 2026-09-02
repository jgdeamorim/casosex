<?php
/**
 * Whols Functions
 *
 * Necessary functions of the plugin.
 *
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

use const Whols_Pro\PL_PATH;

/**
 * Get global options value.
 *
 * @since 1.0.0
 *
 * @param string   $option_name Option name.
 * @param null $default Default value.
 * @param bool $check_empty Check whether the option is empty or not, if true and option is empty then return default value.
 *
 * @return mixed
 */
if( !function_exists('whols_get_option') ){
    function whols_get_option( $option_name = '', $default = null, $check_empty = false  ) {
        $options = get_option( 'whols_options' );

        if( $check_empty && empty($options[$option_name]) ){
            return $default;
        }

        return ( isset( $options[$option_name] ) ) ? $options[$option_name] : $default;
    }
}

/**
* Get term meta value.
*
* @since 1.0.0
*
* @param string   $term_id Term ID
* @param null $meta_opt_name Meta key name
*
* @return string
*/
if( !function_exists('whols_get_term_meta') ){
    function whols_get_term_meta( $term_id, $meta_opt_name ){
        $meta_value = get_term_meta( $term_id, $meta_opt_name, true );

        return $meta_value;
    }
}

/**
 * List payment gateways.
 *
 * @since 1.0.0
 *
 * @return array
 */
if(!function_exists('whols_get_payment_gateways')){
    function whols_get_payment_gateways(){
        $gateways = WC()->payment_gateways->get_available_payment_gateways();
        $gateway_list = array();

        foreach( $gateways as $key => $gateway ) {
            $gateway_list[$key] = $gateway->get_title();
        }

        return $gateway_list;
    }
}

/**
 * List given taxonomy terms
 *
 * @since 1.0.0
 *
 * @return array
 */
if( !function_exists('whols_get_taxonomy_terms') ){
    function whols_get_taxonomy_terms( $taxonomy = 'whols_role_cat' ){
        if( class_exists('WP_Term_Query') ){
            $term_query = new WP_Term_Query(array(
                'taxonomy' => $taxonomy,
                'hide_empty' => false,
            ));

            $term_list = array();
            foreach ( $term_query->get_terms() as $term ) {
                $term_list[ $term->slug ] = $term->name;
            }

            return $term_list;
        }

        return array();
    }
}

/**
 * Validate each fields of the submitted data from the wholesaler registration fields
 *
 * @param $posted_data
 *
 * @return true|array
 */
if( !function_exists('whols_get_user_reg_validation_status') ){
    function whols_get_user_reg_validation_status( $posted_data ){
        // Empty check
        $empty_fields = array();
        foreach( $posted_data as $key => $value ){
            $key        = str_replace('_whols_', '', $key);
            $fields     = whols_get_registration_fields();
            $field_info = !empty($fields[$key]) ? $fields[$key] : array();
            $required   = !empty($field_info['required']) ? $field_info['required'] : false;

            if($field_info){
                if( !$value && $required ){
                    $empty_fields[] = $field_info['label'];
                }
            }
        }

        if($empty_fields){
            return [
                'registerauth'  => false,
                'message'       => implode(', ', $empty_fields) . esc_html__(  ' cannot be empty.', 'whols')
            ];
        }

        if( !empty( $posted_data['reg_username'] ) ){

            if ( 4 > strlen( $posted_data['reg_username'] ) ) {
                return [
                    'registerauth' =>false,
                    'message'=> esc_html__('Username too short. At least 4 characters is required', 'whols')
                ];
            }

            if ( username_exists( $posted_data['reg_username'] ) ){
                return [
                    'registerauth' =>false,
                    'message'=> esc_html__('Sorry, that username already exists!', 'whols')
                ];
            }

            if ( !validate_username( $posted_data['reg_username'] ) ) {
                return [
                    'registerauth' =>false,
                    'message'=> esc_html__('Sorry, the username you entered is not valid', 'whols')
                ];
            }

        }

        if( !empty( $posted_data['reg_password'] ) ){

            if ( 5 > strlen( $posted_data['reg_password'] ) ) {
                return [
                    'registerauth' =>false,
                    'message'=> esc_html__('Password length must be greater than 5', 'whols')
                ];
            }

        }

        if( !empty( $posted_data['reg_email'] ) ){

            if ( !is_email( $posted_data['reg_email'] ) ) {
                return [
                    'registerauth' =>false,
                    'message'=> esc_html__('Email is not valid', 'whols')
                ];
            }

            if ( email_exists( $posted_data['reg_email'] ) ) {
                return [
                    'registerauth' =>false,
                    'message'=> esc_html__('Email Already in Use', 'whols')
                ];
            }

        }

        return true; // No validation issue found

    }
}

/**
 * Return wholesaler price
 * 
 * @param string $price_type 'flat_rate' or 'percentage'.
 * @param string $price_value Price string. e.g. '10' for simple and '10:30' for variable
 * @param object $product The product object. Includes variation type product too.
 *
 * @return string The new price html.
 */
if( !function_exists('whols_get_wholesaler_price') ){
    function whols_get_wholesaler_price( $price_type, $price_value, $product = '' ){
        $product_type = $product->get_type();
        $retailer_price = $product->get_regular_price();

        if( $product_type == 'simple' ){

            if( $price_type == 'flat_rate'){
                $wholesaler_price = whols_get_simple_flat_rate_price( $price_value, $product );
            } else {
                $wholesaler_price = whols_get_simple_percentage_price( $price_value, $retailer_price, $product );
            }

        } elseif( $product_type = 'variable' ){
            if( $price_type == 'flat_rate'){
                $wholesaler_price = whols_get_variable_flat_rate_price( $price_value, $product );
            } else {
                $wholesaler_price = whols_get_variable_percentage_price( $price_value, $product );
            }
        }

        return $wholesaler_price;
    }
}

if( !function_exists('whols_get_simple_flat_rate_price') ){
    function whols_get_simple_flat_rate_price( $price_value, $product ){
        $wholesale_price_info = apply_filters( 'whols_override_wholesale_price', array(
            'price' => $price_value,
        ), $product ); // For multicurrency

        $price_value = $wholesale_price_info['price'];

        $wholesaler_price = wc_price( wc_get_price_to_display( $product, array(
            'price' => $price_value
        )) ) . $product->get_price_suffix( $price_value );

        // Display price range instead of the flat price when tiers are available
        // @todo add support with enable_price_range_for_tierd_pricing
        $tiers = whols_get_product_price_tiers( $product, true );

        if( count($tiers) > 1 ){
            $tire_prices = array_values($tiers);

            $wholesale_price_info = apply_filters( 'whols_override_wholesale_price', array(
                'min_price' => min($tire_prices),
                'max_price' => max($tire_prices)
            ), $product ); // For multicurrency

            // Display price range with tax support
            $wholesaler_price = wc_format_price_range( $wholesale_price_info['min_price'], $wholesale_price_info['max_price'] );
        }

        return $wholesaler_price;
    }
}

if( !function_exists('whols_get_simple_percentage_price') ){
    function whols_get_simple_percentage_price( $price_value, $retailer_price, $product ){
        $wholesale_price_info = apply_filters( 'whols_override_wholesale_price', array(
            'price' => $price_value,
            'price_type' => 'percentage'
        ), $product); // For multicurrency

        $price_value = $wholesale_price_info['price'];

        $wholesaler_price = whols_get_percent_of( $retailer_price, $price_value );
        $wholesaler_price = wc_price( wc_get_price_to_display( $product, array(
            'price' => $wholesaler_price
        )) ) . $product->get_price_suffix( $wholesaler_price );

        return $wholesaler_price;
    }
}

/**
 * @param $price_value e.g. '14' or '10:14', formate like this '10:14' where 10 is min and 14 refers to the max price.
 *
 * @return string Price / Price range html
 */
if( !function_exists('whols_get_variable_flat_rate_price') ){
    function whols_get_variable_flat_rate_price( $price_value, $product ){
        $price = explode(':', $price_value);

        $prices = $product->get_variation_prices( true );
        $min_price     = current( $prices['price'] );
        $max_price     = end( $prices['price'] );
        $variable_has_no_range = $min_price == $max_price;

        $display_variable_price_range_including_tax = apply_filters('whols_display_variable_price_range_including_tax', true);

        if( $price_value && count($price) > 1 ){
            $wholesale_price_info = apply_filters( 'whols_override_wholesale_price', array(
                'min_price' => $price[0],
                'max_price' => $price[1]
            ), $product ); // For multicurrency

            $wholesale_min_price        = $wholesale_price_info['min_price'];
            $wholesale_max_price        = $wholesale_price_info['max_price'];

            if( $variable_has_no_range && $wholesale_min_price ==  $wholesale_max_price ){

                if( $display_variable_price_range_including_tax ){
                    $wholesaler_price = wc_price( wc_get_price_to_display($product, array('price' => $wholesale_min_price)) );
                } else {
                    $wholesaler_price = wc_price( $wholesale_min_price );
                }

            } else {

                if( $display_variable_price_range_including_tax ){
                    $wholesaler_price = wc_format_price_range(
                        wc_get_price_to_display($product, array('price' => $wholesale_min_price)),
                        wc_get_price_to_display($product, array('price' => $wholesale_max_price))
                    ) . $product->get_price_suffix( $wholesale_min_price );
                } else {
                    $wholesaler_price = wc_format_price_range( $wholesale_min_price, $wholesale_max_price );
                }

            }
        } else {
            $wholesale_price_info = apply_filters( 'whols_override_wholesale_price', array(
                'price' => $price_value
            ), $product ); // For multicurrency

            $price_value = $wholesale_price_info['price'];

            if( $display_variable_price_range_including_tax ){
                $wholesaler_price = wc_price( wc_get_price_to_display($product, array('price' => $price_value)) );
            } else {
                $wholesaler_price = wc_price( $price_value );
            }

        }

        return $wholesaler_price;
    }
}


if( !function_exists('whols_get_variable_percentage_price') ){
    function whols_get_variable_percentage_price( $price_value, $product ){
        $min_variation_price = $product->get_variation_price();
        $max_variation_price = $product->get_variation_price( 'max' );

        $wholesaler_min_variation_price = whols_get_percent_of( $min_variation_price, $price_value );
        $wholesaler_max_variation_price = whols_get_percent_of( $max_variation_price, $price_value );

        if( $wholesaler_min_variation_price ==  $wholesaler_max_variation_price ){
            $wholesaler_price   = wc_price( wc_get_price_to_display($product, array('price' => $wholesaler_min_variation_price)) );
        } else{
            $wholesaler_price   = wc_price( wc_get_price_to_display($product, array('price' => $wholesaler_min_variation_price)) ).' - '. wc_price( wc_get_price_to_display($product, array('price' => $wholesaler_max_variation_price)) );
        }

        return $wholesaler_price;
    }
}

/**
 * Check if the current user is wholesaler
 *
 * @since 1.0.0
 *
 * @return bool
 */
if( !function_exists('whols_is_wholesaler') ){
    function whols_is_wholesaler( $user_id = '' ){
        // Check if public mode is enabled (all users should see wholesale prices)
        $show_wholesale_price_for = whols_get_option('show_wholesale_price_for');

        if( $show_wholesale_price_for == 'all_users' ){
            return true;
        }

        if( empty($user_id) ){
            $user_id = get_current_user_id();
        }

        if( $user_id ){
            $user_obj = get_user_by( 'id', $user_id );

            if( !$user_obj ){
                return false;
            }

            $user_roles = $user_obj->roles;

            // Check if user is administrator and testing mode is enabled
            if( $show_wholesale_price_for == 'administrator' && in_array( 'administrator', $user_roles ) ){
                return true;
            }

            // Check if user has any wholesale role
            if( array_intersect( $user_roles, array_keys( whols_get_taxonomy_terms() ) ) ){
                return true;
            }
        }

        return false;
    }
}

/**
 * It returns an array of the current user's roles
 *
 * @param $user_id The ID of the user you want to get the roles for. If left blank, it will default to
 * the current user.
 *
 * @return array of the current user's roles with key => role_name pair.
 */
if( !function_exists('whols_get_current_user_roles') ){
    function whols_get_current_user_roles( $user_id = '' ){
        $user_roles = array();

        if( isset($_REQUEST['manual_whols_role']) && current_user_can('manage_options') ){ // For manual order creat
            $role = sanitize_text_field($_REQUEST['manual_whols_role']);
            $user_roles = $role ? array($role) : $user_roles;

            return $user_roles;
        }

        if( empty($user_id) ){
            $user_id = get_current_user_id();
        }

        if( $user_id ){
            $user_obj   = get_user_by( 'id', $user_id );

            if( $user_obj ){
                $user_roles = $user_obj->roles;
            }
        }

        return $user_roles;
    }
}

/**
 * Return price saving (discount) info
 */
if( !function_exists('whols_get_price_save_info') ){
    function whols_get_price_save_info( $price_type, $price_value, $product = '' ){
        $product_type   = $product->get_type();
        $retailer_price = $product->get_regular_price();
        $save_info      = '';
        $saving_message = '';

        // Quantity based prices
        $tiers      = whols_get_product_price_tiers($product, true);
        $upto_text  = apply_filters('whols_label_upto', __('Upto ', 'whols'));

        if( $product_type  ==  'simple' ){
            if( $price_type == 'flat_rate' ){
                $wholesale_price_info = apply_filters( 'whols_override_wholesale_price', array(
                    'price' => $price_value
                ), $product ); // For multicurrency

                $price_value = $wholesale_price_info['price'];

                $save_price = (float) $retailer_price - (float) $price_value;
                $save_info  = $save_price >= 1 ? wc_price( $save_price ) . ' ('. round(whols_get_discount_percent( $retailer_price, $price_value )) .'%)' : '';

                // If the product has tiers then show differnt price save info
                // @todo add support with enable_price_range_for_tierd_pricing
                if( count($tiers) > 1 ){
                    $prices         = array_values($tiers);
                    $new_min_price  = min($prices);
                    $discount_max   = round(whols_get_discount_percent( $retailer_price, $new_min_price ));

                    $save_info = $upto_text . $discount_max .'%';
                }
            } else {
                $new_wholesaler_price = whols_get_percent_of( $retailer_price, $price_value );
                $save_price           = (float) $retailer_price - (float) $new_wholesaler_price;
                $save_info            = $save_price >= 1 ? wc_price( $save_price ) . ' ('. round(whols_get_discount_percent( $retailer_price, $new_wholesaler_price )) .'%)' : '';
            }
        } elseif( $product_type == 'variable' ){
            $old_min_price = $product->get_variation_price();
            $old_max_price = $product->get_variation_price( 'max' );

            if( $price_type == 'flat_rate' ){
                $price = explode(':', $price_value);

                if( $price_value && count($price) == 1 ){
                    $save_info = '';
                }elseif( $price_value && count($price) > 1 ){
                    $wholesale_price_info = apply_filters( 'whols_override_wholesale_price', array(
                        'min_price' => $price[0],
                        'max_price' => $price[1],
                    ), $product ); // For multicurrency

                    $new_min_price = $wholesale_price_info['min_price'];
                    $new_max_price = $wholesale_price_info['max_price'];

                    $discount_min = round(whols_get_discount_percent( $old_min_price, $new_min_price ));
                    $discount_max = round(whols_get_discount_percent( $old_max_price, $new_max_price ));

                    if( $new_min_price == $new_max_price ){
                        $save_info = $upto_text . $discount_max .'%';
                    } elseif( $discount_min == $discount_max ){

                        $save_info = $discount_min < 1 ? '' : $discount_min .'%';

                    } elseif( $discount_min > $discount_max ){

                        $save_info = $upto_text. $discount_min .'%';

                    } elseif( $discount_max > $discount_min ) {

                        $save_info = $upto_text. $discount_max .'%';


                    }
                } else {
                    $min_variation_price = 0;
				    $max_variation_price = 0;

                    $save_info = round(whols_get_discount_percent( $min_variation_price, $price_value )) .'% - '. round(whols_get_discount_percent( $max_variation_price, $price_value )) .'%';
                }
            } else {
                $save_info = (100 - (int)$price_value) . '%';
            }
        }

        if( $save_info ){
            $discount_label_options        = whols_get_option( 'discount_label_options' );
            $discount_percent_custom_label = !empty($discount_label_options['discount_percent_custom_label']) ? $discount_label_options['discount_percent_custom_label']: '';

            $saving_message .= '<span class="whols_label">';
            $saving_message .= '<span class="whols_label_left">';
            $saving_message .= $discount_percent_custom_label ? esc_html( $discount_percent_custom_label ) : esc_html__( 'Save: ', 'whols' );
            $saving_message .= '</span>';
            $saving_message .= '<span class="whols_label_right">';
            $saving_message .= $save_info;
            $saving_message .= '</span>';
            $saving_message .= '</span>';
        }

        return $saving_message;
    }
}

/**
 * Calculate discount compared by old & new price
 *
 * @since 1.0.0
 */
if( !function_exists('whols_get_discount_percent') ){
    function whols_get_discount_percent( $old_price, $new_price ){
        $decrease =  (float) $old_price - (float) $new_price;

        if( $decrease > 0 ){
            $percent = $decrease / (float) $old_price * 100;
            return (float) $percent;
        }

        return 0;
    }
}

if( !function_exists('whols_get_percent_of') ){
    /**
     * It takes a number and a percentage limit and returns the percentage of the number
     * e.g: whols_get_percent_of(30, 50) returns 15. Or 50 percent of 30 = 15
     *
     * @param $x The number you want to get the percentage of.
     * @param $percent_limit
     */
    function whols_get_percent_of( $x, $percent_limit ){
        if($x){
            $percent = (float) $percent_limit / 100;
            return $x * $percent;
        }

        return 0;
    }
}

if( !function_exists('whols_wc_get_default_address_fields') ){
    function whols_wc_get_default_address_fields( $type = 'billing_' ){
        $defaults = array(
            'company'    => array(
                'enable'       => true,
                'label'        => __( 'Company name', 'whols' ),
                'required'     => false,
            ),
            'country'    => array(
                'enable'       => true,
                'label'        => __( 'Country / Region', 'whols' ),
                'required'     => false,
                'type'         => 'country',
            ),
            'address_1'  => array(
                'enable'       => true,
                'label'        => __( 'Street address', 'whols' ),
                /* translators: use local order of street name and house number. */
                'placeholder'  => esc_attr__( 'House number and street name', 'whols' ),
                'required'     => false,
            ),
            'address_2'  => array(
                'enable'       => true,
                'label'        => __( 'Apartment, suite, unit etc. (optional)', 'whols' ),
                'label_class'  => array( 'screen-reader-text' ),
                'placeholder'  => esc_attr__( 'Apartment, suite, unit etc. (optional)', 'whols' ),
                'required'     => false,
            ),
            'city'       => array(
                'enable'       => true,
                'label'        => __( 'Town / City', 'whols' ),
                'required'     => false,
            ),
            'state'      => array(
                'enable'       => true,
                'label'        => __( 'State / County', 'whols' ),
                'required'     => false,
                'validate'     => array( 'state' ),
                'type'         => 'state',
            ),
            'postcode'   => array(
                'enable'       => true,
                'label'        => __( 'Postcode / ZIP', 'whols' ),
                'required'     => false,
                'validate'     => array( 'postcode' ),
            ),
            'phone'      => array(
                'enable'       => true,
                'label'        => __( 'Phone', 'whols' ),
                'required'     => false,
                'validate'     => array( 'phone' ),
            )
        );

        $fields = array();
        foreach ( $defaults as $key => $value ) {
            $fields[ $type . $key ] = $value;
        }

        return $fields;
    }
}

if( !function_exists('whols_get_registration_fields') ){
    function whols_get_registration_fields(){
        $default_fields = array(
            'reg_name' => array(
                'label'         => __('Name', 'whols'),
                'type'          => 'text',
                'required'      => true,
                'placeholder'   => __('Your Name', 'whols'),
                'value'         => '',
                'priority'         => 10,
            ),
            'last_name' => array(
                'label'         => __('Last Name', 'whols'),
                'type'          => 'text',
                'required'      => true,
                'placeholder'   => __('Your Last Name', 'whols'),
                'value'         => '',
                'priority'         => 15,
            ),
            'reg_username' => array(
                'label'         => __('Username', 'whols'),
                'type'          => 'text',
                'required'      => true,
                'placeholder'   => __('Username', 'whols'),
                'value'         => '',
                'priority'         => 20,
            ),
            'reg_email' => array(
                'label'         => __('Email', 'whols'),
                'type'          => 'email',
                'required'      => true,
                'placeholder'   => __('Your Email', 'whols'),
                'value'         => '',
                'priority'         => 30,
            ),
            'reg_password' => array(
                'label'         => __('Password', 'whols'),
                'type'          => 'password',
                'required'      => true,
                'placeholder'   => __('Your Password', 'whols'),
                'value'         => '',
                'priority'         => 40,
            ),
        );

        $wc_billing_fields   = whols_wc_get_default_address_fields();

        // When the plugin updated to the version 1.1.7 the registration fields value doesn't updated unless click on the save button.
        $fields = array();
        if( whols_get_option('registration_fields') && is_array(whols_get_option('registration_fields')) ){
            $registration_fields = (array) whols_get_option('registration_fields');

            // Prepare and array of the fields with field key as key
            foreach ($registration_fields as $key => $field) {
                if( empty($field['enable']) ){
                    continue;
                }

                $options = array();

                if( $field['field'] === 'custom' ){ // Custom field
                    $field_name = $field['custom_field_name'];
                    unset($field['custom_field_name']);

                    // A custom field name must be given
                    if( $field_name ){
                        $fields[$field_name] = $field;
                        $fields[$field_name]['is_additional'] = true;
                    }
                } else {
                    $field_name = $field['field'];
                    unset($field['field']);

                    if( isset($wc_billing_fields[$field_name]) ){ // WC Billing field
                        // Set field type for billing_country
                        if( !empty($wc_billing_fields[$field_name]['type']) ){
                            $field['type'] = $wc_billing_fields[$field_name]['type'];
                        }

                        // If label is not given by user get it from wc billing fields
                        if( empty($field['label']) && !empty($wc_billing_fields[$field_name]['label']) ){
                            $field['label'] = $wc_billing_fields[$field_name]['label'];
                        }

                        if( empty($field['placeholder']) && !empty($wc_billing_fields[$field_name]['placeholder']) ){
                            $field['placeholder'] = $wc_billing_fields[$field_name]['placeholder'];
                        }

                        $fields[$field_name] = wp_parse_args( $field, $wc_billing_fields[$field_name] );

                    } elseif( isset($default_fields[$field_name]) ){ // Default field
                        // Forcely assign field type
                        if( $field_name === 'reg_email' ){
                            $field['type'] = 'email';
                        }

                        if( $field_name === 'reg_password' ){
                            $field['type'] = 'password';
                        }

                        $fields[$field_name] = wp_parse_args( $field, $default_fields[$field_name] );
                    } elseif( $field_name === '_whols_role' ){ // Role filed
                        $field['type'] = 'select';
                        $options       = whols_roles_dropdown_options();

                        $fields[$field_name] = $field;
                    }
                }

                $i = (int) $key + 1;
                $fields[$field_name]['priority'] = 10 * $i;
                $fields[$field_name]['class'] = !empty($fields[$field_name]['class']) ? explode(' ', $fields[$field_name]['class']) : array();

                // Prepare options
                if( !empty($fields[$field_name]['options']) && !is_array($fields[$field_name]['options']) ){
                    $options_list = preg_split('/\r\n|\r|\n/', $fields[$field_name]['options']);

                    // Trim values
                    $options_list = array_map('trim', $options_list);

                    foreach ($options_list as $option) {
                        $option = explode('|', $option);

                        if( isset($option[1]) ){
                            $options[$option[0]] = $option[1];
                        } else {
                            $options[$option[0]] = $option[0];
                        }
                    }
                }

                $fields[$field_name]['options'] = $options;
            }
        } else { // support for existing user
            $fields = $default_fields;
        }

        // required field properties are label, type, order, is_additional
        $fields = apply_filters( 'whols_registration_fields', $fields );

        // Ordering support
        // Each field must have the order value otherwise ordering support won't work
        $order = array_column($fields, 'priority');
        if(count($order) == count($fields)){
           array_multisort($order, SORT_ASC, $fields);
        }

        return $fields;
    }
}


if ( !function_exists( 'whols_form_field' ) ) {

    /**
     * Outputs registration form field.
     *
     * @param string $key Key.
     * @param mixed  $args Arguments.
     * @param string $value (default: null).
     * @return string
     */
    function whols_form_field( $key, $args, $value = null ) {
        // add __ with the name to detect the field as additional
        $default_fields = array(
            'last_name' // skip last name as additional field
        );

        if ( !empty($args['is_additional']) && $args['is_additional'] && !in_array($key, $default_fields)) {
            $key = '_whols_' . $key;
        }

        // For become a Wholesaler request
        // if( is_user_logged_in() && strpos($key, '_whols_') === false ){
        //     return;
        // }

        // $is_block_editor = whols_is_block_editor();
        // if( !whols_is_test_mode() && !$is_block_editor ){
        //     if( is_user_logged_in() && strpos($key, '_whols_') === false ){

        //         if( !$is_block_editor ){ // For block editor display the fields
        //             return;
        //         }

        //     }
        // }

        $defaults = array(
            'type'              => 'text',
            'label'             => '',
            'description'       => '',
            'placeholder'       => '',
            'maxlength'         => false,
            'required'          => false,
            'autocomplete'      => false,
            'id'                => $key,
            'class'             => array(),
            'label_class'       => array(),
            'input_class'       => array(),
            'return'            => false,
            'options'           => array(),
            'custom_attributes' => array(),
            'validate'          => array(),
            'default'           => '',
            'autofocus'         => '',
            'priority'          => '99',
            'is_additional'     => false,
        );

        $args = wp_parse_args( $args, $defaults );

        if ( $args['required'] ) {
            $args['class'][] = 'validate-required';
            $required        = '&nbsp;<abbr class="required" title="' . esc_attr__( 'required', 'whols' ) . '">*</abbr>';
        } else {
            $required = '&nbsp;<span class="optional">(' . esc_html__( 'optional', 'whols' ) . ')</span>';
        }

        if ( is_string( $args['label_class'] ) ) {
            $args['label_class'] = array( $args['label_class'] );
        }

        if ( is_null( $value ) ) {
            $value = $args['default'];
        }

        // Custom attribute handling.
        $custom_attributes         = array();
        $args['custom_attributes'] = array_filter( (array) $args['custom_attributes'], 'strlen' );

        if ( $args['maxlength'] ) {
            $args['custom_attributes']['maxlength'] = absint( $args['maxlength'] );
        }

        if ( ! empty( $args['autocomplete'] ) ) {
            $args['custom_attributes']['autocomplete'] = $args['autocomplete'];
        }

        if ( true === $args['autofocus'] ) {
            $args['custom_attributes']['autofocus'] = 'autofocus';
        }

        if ( $args['description'] ) {
            $args['custom_attributes']['aria-describedby'] = $args['id'] . '-description';
        }

        if ( ! empty( $args['custom_attributes'] ) && is_array( $args['custom_attributes'] ) ) {
            foreach ( $args['custom_attributes'] as $attribute => $attribute_value ) {
                $custom_attributes[] = esc_attr( $attribute ) . '="' . esc_attr( $attribute_value ) . '"';
            }
        }

        if ( ! empty( $args['validate'] ) ) {
            foreach ( $args['validate'] as $validate ) {
                $args['class'][] = 'validate-' . $validate;
            }
        }

        $field           = '';
        $label_id        = $args['id'];
        $sort            = $args['priority'] ? $args['priority'] : '';
        $field_container = '<p class="whols-form-row %1$s" id="%2$s" data-priority="' . esc_attr( $sort ) . '">%3$s</p>';

        switch ( $args['type'] ) {
            case 'country':
				$countries = 'shipping_country' === $key ? WC()->countries->get_shipping_countries() : WC()->countries->get_allowed_countries();

				if ( 1 === count( $countries ) ) {

					$field .= '<strong>' . current( array_values( $countries ) ) . '</strong>';

					$field .= '<input type="hidden" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" value="' . current( array_keys( $countries ) ) . '" ' . implode( ' ', $custom_attributes ) . ' class="country_to_state" readonly="readonly" />';

				} else {
					$data_label = ! empty( $args['label'] ) ? 'data-label="' . esc_attr( $args['label'] ) . '"' : '';

					$field = '<select name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" class="country_to_state country_select ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" ' . implode( ' ', $custom_attributes ) . ' data-placeholder="' . esc_attr( $args['placeholder'] ? $args['placeholder'] : esc_attr__( 'Select a country / region&hellip;', 'whols' ) ) . '" ' . $data_label . '><option value="">' . esc_html__( 'Select a country / region&hellip;', 'whols' ) . '</option>';

					foreach ( $countries as $ckey => $cvalue ) {
						$field .= '<option value="' . esc_attr( $ckey ) . '" ' . selected( $value, $ckey, false ) . '>' . esc_html( $cvalue ) . '</option>';
					}

					$field .= '</select>';

					$field .= '<noscript><button type="submit" name="woocommerce_checkout_update_totals" value="' . esc_attr__( 'Update country / region', 'whols' ) . '">' . esc_html__( 'Update country / region', 'whols' ) . '</button></noscript>';

				}

				break;
            case 'state':
                /* Get country this state field is representing */
                $for_country = isset( $args['country'] ) ? $args['country'] : WC()->checkout->get_value( 'billing_state' === $key ? 'billing_country' : 'shipping_country' );
                $states      = WC()->countries->get_states( $for_country );

                if ( is_array( $states ) && empty( $states ) ) {

                    $field_container = '<p class="form-row %1$s" id="%2$s" style="display: none">%3$s</p>';

                    $field .= '<input type="hidden" class="hidden" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" value="" ' . implode( ' ', $custom_attributes ) . ' placeholder="' . esc_attr( $args['placeholder'] ) . '" readonly="readonly" data-input-classes="' . esc_attr( implode( ' ', $args['input_class'] ) ) . '"/>';

                } elseif ( ! is_null( $for_country ) && is_array( $states ) ) {
                    $data_label = ! empty( $args['label'] ) ? 'data-label="' . esc_attr( $args['label'] ) . '"' : '';

                    $field .= '<select name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" class="state_select ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" ' . implode( ' ', $custom_attributes ) . ' data-placeholder="' . esc_attr( $args['placeholder'] ? $args['placeholder'] : esc_html__( 'Select an option&hellip;', 'woocommerce' ) ) . '"  data-input-classes="' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" ' . $data_label . '>
                        <option value="">' . esc_html__( 'Select an option&hellip;', 'woocommerce' ) . '</option>';

                    foreach ( $states as $ckey => $cvalue ) {
                        $field .= '<option value="' . esc_attr( $ckey ) . '" ' . selected( $value, $ckey, false ) . '>' . esc_html( $cvalue ) . '</option>';
                    }

                    $field .= '</select>';

                } else {

                    $field .= '<input type="text" class="input-text ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" value="' . esc_attr( $value ) . '"  placeholder="' . esc_attr( $args['placeholder'] ) . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" ' . implode( ' ', $custom_attributes ) . ' data-input-classes="' . esc_attr( implode( ' ', $args['input_class'] ) ) . '"/>';

                }

                break;
            case 'textarea':
                $field .= '<textarea name="' . esc_attr( $key ) . '" class="input-text ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" id="' . esc_attr( $args['id'] ) . '" placeholder="' . esc_attr( $args['placeholder'] ) . '" ' . ( empty( $args['custom_attributes']['rows'] ) ? ' rows="2"' : '' ) . ( empty( $args['custom_attributes']['cols'] ) ? ' cols="5"' : '' ) . implode( ' ', $custom_attributes ) . '>' . esc_textarea( $value ) . '</textarea>';

                break;
            case 'text':
            case 'password':
            case 'datetime':
            case 'datetime-local':
            case 'date':
            case 'month':
            case 'time':
            case 'week':
            case 'number':
            case 'email':
            case 'url':
            case 'tel':
                $field .= '<input type="' . esc_attr( $args['type'] ) . '"' . 
				' class="input-text ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '"' . 
				' name="' . esc_attr( $key ) . '"' . 
				' id="' . esc_attr( $args['id'] ) . '"' . 
				' placeholder="' . esc_attr( $args['placeholder'] ) . '"' . 
				' value="' . esc_attr( $value ) . '"' . 
				( $args['required'] ? ' required' : '' ) . 
				' ' . implode( ' ', $custom_attributes ) . 
				' />';

                break;
            case 'hidden':
                $field .= '<input type="' . esc_attr( $args['type'] ) . '" class="input-hidden ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" value="' . esc_attr( $value ) . '" ' . implode( ' ', $custom_attributes ) . ' />';

                break;
            case 'select':
                $field   = '';
                $options = '';

                if ( ! empty( $args['options'] ) ) {
                    foreach ( $args['options'] as $option_key => $option_text ) {
                        if ( '' === $option_key ) {
                            // If we have a blank option, select2 needs a placeholder.
                            if ( empty( $args['placeholder'] ) ) {
                                $args['placeholder'] = $option_text ? $option_text : __( 'Choose an option', 'whols' );
                            }
                            $custom_attributes[] = 'data-allow_clear="true"';
                        }
                        $options .= '<option value="' . esc_attr( $option_key ) . '" ' . selected( $value, $option_key, false ) . '>' . esc_html( $option_text ) . '</option>';
                    }

                    $field .= '<select name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" class="select ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" ' . implode( ' ', $custom_attributes ) . ' data-placeholder="' . esc_attr( $args['placeholder'] ) . '">
                            ' . $options . '
                        </select>';
                }

                break;
            case 'radio':
                $label_id .= '_' . current( array_keys( $args['options'] ) );

                if ( ! empty( $args['options'] ) ) {
                    foreach ( $args['options'] as $option_key => $option_text ) {
                        $field .= '<span class="whols-radio-option">';
                        $field .= '<input type="radio" class="input-radio ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" value="' . esc_attr( $option_key ) . '" name="' . esc_attr( $key ) . '" ' . implode( ' ', $custom_attributes ) . ' id="' . esc_attr( $args['id'] ) . '_' . esc_attr( $option_key ) . '"' . checked( $value, $option_key, false ) . ' />';
                        $field .= '<label for="' . esc_attr( $args['id'] ) . '_' . esc_attr( $option_key ) . '" class="radio ' . implode( ' ', $args['label_class'] ) . '">' . esc_html( $option_text ) . '</label>';
                        $field .= '</span>';
                    }
                }

                break;
            case 'checkbox':
                $field = '<input type="' . esc_attr( $args['type'] ) . '" class="input-checkbox ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '" value="1" ' . checked( $value, 1, false ) . ' /> ';

                break;

            case 'file':
                $field .= '<input type="' . esc_attr( $args['type'] ) . '" class="input-text ' . esc_attr( implode( ' ', $args['input_class'] ) ) . '" name="' . esc_attr( $key ) . '" id="' . esc_attr( $args['id'] ) . '"  accept="image/*" ' . implode( ' ', $custom_attributes ) . ' />';

                break;
        }

        if ( ! empty( $field ) ) {
            $field_html = '';

            if ( $args['label'] ) {
                $field_html .= '<label for="' . esc_attr( $label_id ) . '" class="' . esc_attr( implode( ' ', $args['label_class'] ) ) . '">' . wp_kses_post( $args['label'] ) . $required . '</label>';
            }

            $field_html .= '<span class="whols-input-wrapper">' . $field;

            if ( $args['description'] ) {
                $field_html .= '<span class="description" id="' . esc_attr( $args['id'] ) . '-description" aria-hidden="true">' . wp_kses_post( $args['description'] ) . '</span>';
            }

            $field_html .= '</span>';

            $args['class'][] = 'type--'. $args['type'];

            // Add form-row class for the county field
            // Without the class conditional state field doesn't work
            if( in_array($args['type'], array('country', 'state')) ){
                $args['class'][] = 'form-row';
            }

            $container_class = esc_attr( implode( ' ', $args['class'] ) );
            $container_id    = esc_attr( $args['id'] ) . '_field';
            $field           = sprintf( $field_container, $container_class, $container_id, $field_html );
        }

        if ( $args['return'] ) {
            return $field;
        } else {
            // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            echo $field;
            return '';
        }

        return $field;
    }
}

/**
 * backrward compatibility for str_starts_with function, since it is introduced in php 8.0
 * @return string
 */
if (!function_exists('str_starts_with')) {
    function str_starts_with($haystack, $needle) {
        return (string)$needle !== '' && strncmp($haystack, $needle, strlen($needle)) === 0;
    }
}


// Capabilites
if( !function_exists('whols_get_capabilities') ){
    function whols_get_capabilities(){
        $capabilities = array(
            'manage_settings' => 'manage_options',
            'manage_roles'    => 'manage_options',
            'manage_requests' => 'manage_options'
        );

        return apply_filters('whols_capabilities', $capabilities );
    }
}

/**
 * Get the pricing model
 * @return string 'single_role' or 'multiple_role'
 */
if( !function_exists('whols_get_pricing_model') ){
    function whols_get_pricing_model(){
        $pricing_model  = whols_get_option( 'pricing_model' );
        if( $pricing_model  ===  'multiple_role' ){
            return 'multiple_role';
        }

        return 'single_role';
    }
}

if( !function_exists('whols_is_on_wholesale') ){
    /**
     * If the user is logged in, and the product is set to wholesale, and the user has the correct
     * role, then return the wholesale price
     *
     * @param $product_id The product_id/variation_id/Product object
     * @param $variation_id The ID of the variation.
     *
     * @return array
     */
    function whols_is_on_wholesale( $product_id = '', $variation_id = '' ){
        $status = false;

        $p_id = $variation_id ? $variation_id : $product_id;
        $product = wc_get_product($p_id);

        // Validate product exists
        if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
            return $status;
        }

        $product_type     = $product->get_type();
        $pricing_model    = whols_get_option( 'pricing_model' );
        $price_type       = '';
        $price_value      = '';
        $minimum_quantity = '';

        // current user role
        $current_user_roles = whols_get_current_user_roles();

        // Extract wholesale role from user's roles (important for administrators who have multiple roles)
        $wholesale_roles    = array_intersect( $current_user_roles, array_keys( whols_get_taxonomy_terms() ) );
        $current_user_role  = $wholesale_roles ? reset( $wholesale_roles ) : ( $current_user_roles[0] ?? '' );

        if( $pricing_model == 'single_role' ){
            $price_type_1_properties = whols_get_option( 'price_type_1_properties' );
            $enable_this_pricing     = $price_type_1_properties['enable_this_pricing'];
            $price_type              = $price_type_1_properties['price_type'];
            $price_value             = $price_type_1_properties['price_value'];
            $minimum_quantity        = $price_type_1_properties['minimum_quantity'];

            // override from category level
            $term_meta = '';
            $current_product_category_ids = $product->get_category_ids();
            foreach( $current_product_category_ids as $id ){
                $term_meta = whols_get_term_meta( $id, 'whols_product_category_meta' );

                if( isset( $term_meta[ 'price_type_1_properties' ] ) && $term_meta[ 'price_type_1_properties' ] ){
                    $price_type_1_properties = $term_meta[ 'price_type_1_properties' ];
                    if( $price_type_1_properties['enable_this_pricing'] ){
                        $enable_this_pricing = $price_type_1_properties['enable_this_pricing'];
                        $price_type          = $price_type_1_properties['price_type'];
                        $price_value         = $price_type_1_properties['price_value'];
                        $minimum_quantity    = $price_type_1_properties['minimum_quantity'];

                        break;
                    }
                }
            }

            // override from simple product level
            $price_type_1_properties = get_post_meta( $product->get_id(), '_whols_price_type_1_properties', true);
            if( $price_type_1_properties && ($product_type == 'simple' || $product_type == 'variable') ){

                $price_type_1_properties_arr = explode( ':', $price_type_1_properties );
                if( isset( $price_type_1_properties_arr[0] ) && $price_type_1_properties_arr[0] ){

                    $enable_this_pricing = true;
                    $price_type = 'flat_rate';
                    $price_value = $price_type_1_properties_arr[0];
                    $minimum_quantity = isset($price_type_1_properties_arr[1]) ? $price_type_1_properties_arr[1] : '';

                }
            }

            // override from variation product level
            if( $product_type == 'variation' ){
                $new_min_price = 9999999999;
                $new_max_price = 0;
                $has_price     = false;

                $regular_price = (float) get_post_meta( $p_id, '_price', true );
                $meta_info = get_post_meta( $p_id, '_whols_price_type_1_properties', true );
                $meta_arr = explode( ':', $meta_info );
                $meta_price = (float) $meta_arr[0];
                $minimum_quantity = '';

                if( $meta_price ){
                    $has_price = true;
                }

                if( $regular_price && $meta_price ){
                    if( $meta_price && $meta_price != 0 &&  $meta_price < $new_min_price ){
                        $new_min_price = $meta_price;
                    }

                    if( $meta_price &&  $meta_price > $new_max_price ){
                        $new_max_price = $meta_price;
                    }
                } else{
                    if( $regular_price < $new_min_price ){
                        $new_min_price = $regular_price;
                    }

                    if( $regular_price > $new_max_price ){
                        $new_max_price = $regular_price;
                    }
                }

                if( $has_price ){
                    $enable_this_pricing = true;
                    $price_type          = 'flat_rate';
                    $price_value         = "$new_min_price:$new_max_price";
                    $minimum_quantity    = !empty($meta_arr['1']) ? (int) $meta_arr['1'] : 0;
                }
            }else if( $product_type == 'variable' ){
                $old_min_price = $product->get_variation_price('min');
                $old_max_price = $product->get_variation_price('max');
                $current_product_variations = $product->get_available_variations();

                $new_min_price = 9999999999;
                $new_max_price = 0;
                $has_price = false;

                $product_status = whols_get_product_status($product);

                // Track if we're using percentage-based pricing from global/category settings
                $is_percentage_pricing = false;
                $has_variation_specific_prices = false;

                foreach( $current_product_variations as $variation ){
                    $regular_price = (float) get_post_meta( $variation['variation_id'], '_price', true );
                    $meta_info = get_post_meta( $variation['variation_id'], '_whols_price_type_1_properties', true );
                    $meta_arr = explode( ':', $meta_info );
                    $meta_price = (float) $meta_arr[0];

                    if( $meta_price ){
                        $has_price = true;
                        $has_variation_specific_prices = true;

                    // Price not set it meta, get price from global option OR parent product setting
                    } elseif(($product_status['enable_this_pricing'] && $product_status['price_value']) || $enable_this_pricing ){

                        // Use parent product's individual wholesale price if set
                        if( $enable_this_pricing && $price_value && $price_type == 'flat_rate' ){
                            $meta_price = (float) $price_value;
                            $has_price = true;
                        } elseif( $enable_this_pricing && $price_value && ($price_type == 'percent' || $price_type == 'percentage') ){
                            $meta_price = whols_get_percent_of( $variation['display_price'], $price_value );
                            $has_price = true;
                            $is_percentage_pricing = true;
                        } elseif( $product_status['price_type'] == 'flat_rate' ){
                            $meta_price = $product_status['price_value'];
                            $has_price = true;
                        } elseif( $product_status['price_type'] == 'percent' || $product_status['price_type'] == 'percentage' ){
                            $meta_price = whols_get_percent_of( $variation['display_price'], $product_status['price_value'] );
                            $has_price = true;
                            $is_percentage_pricing = true;
                        }
                    }

                    if( $regular_price && $meta_price ){
                        if( $meta_price && $meta_price != 0 &&  $meta_price < $new_min_price ){
                            $new_min_price = $meta_price;
                        }

                        if( $meta_price &&  $meta_price > $new_max_price ){
                            $new_max_price = $meta_price;
                        }
                    } else{
                        if( $regular_price < $new_min_price ){
                            $new_min_price = $regular_price;
                        }

                        if( $regular_price > $new_max_price ){
                            $new_max_price = $regular_price;
                        }
                    }
                }

                if( $has_price ){
                    $enable_this_pricing = true;

                    // Preserve the original price_type if using percentage-based global/category pricing
                    // Only convert to flat_rate if variations have specific prices OR not using percentage
                    if( $has_variation_specific_prices || !$is_percentage_pricing ){
                        $price_type  = 'flat_rate';
                        $price_value = "$new_min_price:$new_max_price";
                    }
                    // else: keep the original $price_type and $price_value (percentage value, not calculated prices)

                    $minimum_quantity = '';
                }
            }

            return array(
                'enable_this_pricing' => $enable_this_pricing,
                'price_type'          => $price_type,
                'price_value'         => $price_value,
                'minimum_quantity'    => $minimum_quantity
            );
        } elseif( $pricing_model == 'multiple_role' ) {
            $wholesale_price_visibility        = whols_get_option('show_wholesale_price_for');
            $select_role_for_all_users_price = whols_get_option('select_role_for_all_users_price');
            $price_type_2_properties         = whols_get_option( 'price_type_2_properties' );

            $product_status = whols_get_product_status($product);

            // Set default role for test mode if not set
            if( $wholesale_price_visibility == 'administrator' && !$select_role_for_all_users_price ){
                $select_role_for_all_users_price = 'whols_default_role';
            }

            // Determine which role to use for pricing based on visibility mode
            // Priority: User's actual wholesale role > select_role_for_all_users_price (for non-wholesalers)
            // This ensures wholesalers always see their role-specific pricing regardless of mode
            $role_for_pricing = $current_user_role;

            // Only use select_role_for_all_users_price if user doesn't have their own wholesale role
            if( empty($wholesale_roles) && in_array($wholesale_price_visibility, ['all_users', 'administrator']) && $select_role_for_all_users_price ){
                $role_for_pricing = $select_role_for_all_users_price;
            }

            $enable_this_pricing = isset($price_type_2_properties[$role_for_pricing. '__enable_this_pricing']) ? $price_type_2_properties[$role_for_pricing. '__enable_this_pricing'] : '';
            $price_type          = isset($price_type_2_properties[$role_for_pricing. '__price_type']) ? $price_type_2_properties[$role_for_pricing. '__price_type'] : '';
            $price_value         = isset($price_type_2_properties[$role_for_pricing. '__price_value']) ? $price_type_2_properties[$role_for_pricing. '__price_value'] : '';
            $minimum_quantity    = isset($price_type_2_properties[$role_for_pricing. '__minimum_quantity']) ? $price_type_2_properties[$role_for_pricing. '__minimum_quantity'] : '';

            // override from category level
            $term_meta = '';
            $current_product_category_ids = $product->get_category_ids();

            // Use the same role determined above for category pricing
            $role_to_check = $role_for_pricing;

            foreach( $current_product_category_ids as $id ){
                $term_meta = whols_get_term_meta( $id, 'whols_product_category_meta' );

                if( isset( $term_meta[ 'price_type_2_properties' ] ) && $term_meta[ 'price_type_2_properties' ] ){
                    $price_type_2_properties = $term_meta[ 'price_type_2_properties' ];
                    if( isset($price_type_2_properties[$role_to_check. '__enable_this_pricing']) && $price_type_2_properties[$role_to_check. '__enable_this_pricing']  ){
                        $enable_this_pricing = $price_type_2_properties[$role_to_check. '__enable_this_pricing'];
                        $price_type          = $price_type_2_properties[$role_to_check. '__price_type'];
                        $price_value         = $price_type_2_properties[$role_to_check. '__price_value'];
                        $minimum_quantity    = $price_type_2_properties[$role_to_check. '__minimum_quantity'];

                        break;
                    }
                }
            }

            // override from product level

            // Get meta value for simple and variable products (not variations)
            $price_type_2_properties = '';
            if( $product->is_type('simple', 'variation', 'variable') ){
                $price_type_2_properties = get_post_meta( $product->get_id(), '_whols_price_type_2_properties', true);
            }

            // Ensure correct role is used for product-level pricing
            // Priority: User's wholesale role > select_role_for_all_users_price (for non-wholesalers)
            // Only add select_role_for_all_users_price if user doesn't have their own wholesale role
            if( empty($wholesale_roles) && in_array($wholesale_price_visibility, ['all_users', 'administrator']) && $select_role_for_all_users_price ){
                $current_user_roles[] = $select_role_for_all_users_price;
            }

            if( $price_type_2_properties ){
                $roles_data_list = explode( ';', $price_type_2_properties );
                $current_role_pricing_arr = array();
                foreach( $roles_data_list as $role_data ){
                    if(
                        in_array( 'any_role', explode( ':', $role_data ) ) ||
                        array_intersect($current_user_roles, explode( ':', $role_data ))
                    ){
                        $current_role_pricing_arr = explode( ':', $role_data );

                        break;
                    }
                }

                if( $current_role_pricing_arr && !empty($current_role_pricing_arr[1]) ){
                    $enable_this_pricing = true;
                    $price_type = 'flat_rate';
                    $price_value = $current_role_pricing_arr[1];
                    $minimum_quantity = $current_role_pricing_arr[2] ? $current_role_pricing_arr[2] : '';
                }
            }

            // override from variation product level
            if( $product_type == 'variable' ){
                $old_min_price = (float) $product->get_variation_price('min');
                $old_max_price = (float) $product->get_variation_price('max');
                $current_product_variations = $product->get_available_variations();

                $new_min_price  = 9999999999;
                $new_max_price  = 0;
                $has_price      = false;

                // New way to extract min & max price
                $all_prices     = array($old_min_price, $old_max_price);

                // Track if we're using percentage-based pricing from global/category settings
                $is_percentage_pricing = false;
                $has_variation_specific_prices = false;

                foreach( $current_product_variations as $variation ){
                    $regular_price = (float) get_post_meta( $variation['variation_id'], '_price', true );
                    $price_type_2_properties = '';

                    $price_type_2_properties_meta = get_post_meta( $variation['variation_id'], '_whols_price_type_2_properties', true );
                    if( $price_type_2_properties_meta ){

                        $roles_data_list = explode( ';', $price_type_2_properties_meta );

                        foreach( $roles_data_list as $role_data ){
                            if(
                                in_array( 'any_role', explode( ':', $role_data ) ) ||
                                array_intersect($current_user_roles, explode( ':', $role_data ))
                            ){
                                $price_type_2_properties = $role_data;

                                break;
                            }
                        }
                    }

                    $meta_arr = explode( ':', $price_type_2_properties );
                    $meta_price = isset( $meta_arr[1] ) ? (float) $meta_arr[1] : 0;

                    if( $meta_price >= 1 ){
                        $all_prices[] = $meta_price;
                    }

                    if( $meta_price ){
                        $has_price = true;
                        $has_variation_specific_prices = true;

                    // Price not set in meta, get price from parent product or global option
                    } elseif( $enable_this_pricing && $price_value ){
                        if( $price_type == 'flat_rate' ){
                            $meta_price = (float) $price_value;
                            if( $meta_price >= 1 ){
                                $all_prices[] = $meta_price;
                            }
                        } elseif( $price_type == 'percent' || $price_type == 'percentage' ){
                            $meta_price = whols_get_percent_of( $variation['display_price'], $price_value );
                            $is_percentage_pricing = true;
                        }
                        $has_price = true;
                    }

                    if( $regular_price && $meta_price ){
                        if( $meta_price && $meta_price != 0 &&  $meta_price < $new_min_price ){
                            $new_min_price = $meta_price;
                        }

                        if( $meta_price &&  $meta_price > $new_max_price ){
                            $new_max_price = $meta_price;
                        }
                    } else{
                        if( $regular_price < $new_min_price ){
                            $new_min_price = $regular_price;
                        }

                        if( $regular_price > $new_max_price ){
                            $new_max_price = $regular_price;
                        }
                    }

                    // Implemented the new way for min/max price for wholesalers (removed again, previous worked better)
                    // $new_min_price = min($all_prices);
                    // $new_max_price = max($all_prices);
                }

                if( $has_price ){
                    $enable_this_pricing = true;

                    // Preserve the original price_type if using percentage-based global/category pricing
                    // Only convert to flat_rate if variations have specific prices OR not using percentage
                    if( $has_variation_specific_prices || !$is_percentage_pricing ){
                        $price_type  = 'flat_rate';
                        $price_value = "$new_min_price:$new_max_price";
                    }
                    // else: keep the original $price_type and $price_value (percentage value, not calculated prices)

                    $minimum_quantity = '';
                }
            }

            $result = array(
                'enable_this_pricing' => $enable_this_pricing,
                'price_type'          => $price_type,
                'price_value'         => $price_value,
                'minimum_quantity'    => $minimum_quantity
            );

            return $result;
        } // endif multiple role

        return array(
            'enable_this_pricing' => false,
            'price_type'          => $pricing_model,
            'price_value'         => '',
            'minimum_quantity'    => ''
        );
    }
}

/**
 * Accepts either normal product or a variation product.
 * Returns the informations about the product info whether it should or not qualified as a wholesale product.
 *
 * @param $product_data Product/Variation object.
 *
 * @return array(
        'enable_this_pricing'  => '', bool
        'price_type'           => '', flat_rate/percent
        'price_value'          => '', input_price/new_input_min_price:new_input_max_price
        'minimum_quantity'     => '', number
    )
 */
if( !function_exists('whols_get_product_status') ){
    function whols_get_product_status( $product_data ) {
        // current user role
        $current_user_roles  = whols_get_current_user_roles();
        $current_user_role   = isset( $current_user_roles[0] ) ? $current_user_roles[0] : '';
        $current_user_id     = get_current_user_id();

        $pricing_model  = whols_get_option( 'pricing_model' );
        $term_meta      = '';
        $show_wholesale_price_for = '';

        $price_type_1_properties = whols_get_option( 'price_type_1_properties' );
        $enable_this_pricing     = $price_type_1_properties['enable_this_pricing'];
        $price_type              = $price_type_1_properties['price_type'];
        $price_value             = $price_type_1_properties['price_value'];
        $minimum_quantity        = $price_type_1_properties['minimum_quantity'];

        if( $product_data->is_type('variation') ){
            $product = wc_get_product( $product_data->get_parent_id() );
        } else {
            $product = $product_data;
        }

        $tiers = whols_get_product_price_tiers( $product_data, true );

        $current_product_category_ids = $product->get_category_ids();

        foreach( $current_product_category_ids as $id ){
            $term_meta = whols_get_term_meta( $id, 'whols_product_category_meta' );

            if( $pricing_model  ==  'single_role' ){
                $price_type_1_properties = whols_get_option( 'price_type_1_properties' );
                $enable_this_pricing     = $price_type_1_properties['enable_this_pricing'];
                $price_type              = $price_type_1_properties['price_type'];
                $price_value             = $price_type_1_properties['price_value'];
                $minimum_quantity        = $price_type_1_properties['minimum_quantity'];

                // override from category level
                if( isset( $term_meta[ 'price_type_1_properties' ] ) && $term_meta[ 'price_type_1_properties' ] ){
                    $price_type_1_properties = $term_meta[ 'price_type_1_properties' ];
                    if( $price_type_1_properties['enable_this_pricing']  ){
                        $enable_this_pricing = $price_type_1_properties['enable_this_pricing'];
                        $price_type          = $price_type_1_properties['price_type'];
                        $price_value         = $price_type_1_properties['price_value'];
                        $minimum_quantity    = $price_type_1_properties['minimum_quantity'];

                        break;
                    }
                }
            } else { // Multiple role
                $price_type_2_properties         = whols_get_option( 'price_type_2_properties' );
                $show_wholesale_price_for        = whols_get_option('show_wholesale_price_for');
                $select_role_for_all_users_price = whols_get_option('select_role_for_all_users_price');

                // Support for test mode
                if( $show_wholesale_price_for == 'administrator' ){
                    $select_role_for_all_users_price = $current_user_role === 'administrator' ? 'whols_default_role' : $current_user_role;
                }

                // Determine the active role to use for pricing
                $active_role_for_pricing = $current_user_role;
                if( in_array($show_wholesale_price_for, array('all_users', 'administrator')) && $select_role_for_all_users_price ){
                    $active_role_for_pricing = $select_role_for_all_users_price;

                    $enable_this_pricing     = isset($price_type_2_properties[$select_role_for_all_users_price. '__enable_this_pricing']) ? $price_type_2_properties[$select_role_for_all_users_price. '__enable_this_pricing'] : '';
                    $price_type              = isset($price_type_2_properties[$select_role_for_all_users_price. '__price_type']) ? $price_type_2_properties[$select_role_for_all_users_price. '__price_type'] : '';
                    $price_value             = isset($price_type_2_properties[$select_role_for_all_users_price. '__price_value']) ? $price_type_2_properties[$select_role_for_all_users_price. '__price_value'] : '';
                    $minimum_quantity        = isset($price_type_2_properties[$select_role_for_all_users_price. '__minimum_quantity']) ? $price_type_2_properties[$select_role_for_all_users_price. '__minimum_quantity'] : '';

                } else { // only wholesalers
                    $enable_this_pricing     = isset($price_type_2_properties[$current_user_role. '__enable_this_pricing']) ? $price_type_2_properties[$current_user_role. '__enable_this_pricing'] : '';
                    $price_type              = isset($price_type_2_properties[$current_user_role. '__price_type']) ? $price_type_2_properties[$current_user_role. '__price_type'] : '';
                    $price_value             = isset($price_type_2_properties[$current_user_role. '__price_value']) ? $price_type_2_properties[$current_user_role. '__price_value'] : '';
                    $minimum_quantity        = isset($price_type_2_properties[$current_user_role. '__minimum_quantity']) ? $price_type_2_properties[$current_user_role. '__minimum_quantity'] : '';
                }


                // override from category level - use the active role for pricing
                if( isset( $term_meta[ 'price_type_2_properties' ] ) && $term_meta[ 'price_type_2_properties' ] ){
                    $price_type_2_properties = $term_meta[ 'price_type_2_properties' ];
                    if( isset($price_type_2_properties[$active_role_for_pricing. '__enable_this_pricing']) && $price_type_2_properties[$active_role_for_pricing. '__enable_this_pricing']  ){
                        $enable_this_pricing = $price_type_2_properties[$active_role_for_pricing. '__enable_this_pricing'];
                        $price_type          = $price_type_2_properties[$active_role_for_pricing. '__price_type'];
                        $price_value         = $price_type_2_properties[$active_role_for_pricing. '__price_value'];
                        $minimum_quantity    = $price_type_2_properties[$active_role_for_pricing. '__minimum_quantity'];

                        break;
                    }
                }
            }
        }

        // override from product level
        if( $pricing_model == 'single_role' ){
            $price_type_1_properties_meta = get_post_meta( $product_data->get_id(), '_whols_price_type_1_properties', true);

            if( $price_type_1_properties_meta ){
                $price_type_1_properties_arr = explode( ':', $price_type_1_properties_meta );

                if( $price_type_1_properties_arr[0] ){
                    $enable_this_pricing = true;
                    $price_type = 'flat_rate';
                    $price_value = $price_type_1_properties_arr[0];
                    $minimum_quantity = $price_type_1_properties_arr[1] ? $price_type_1_properties_arr[1] : 1;
                }
            }

        } elseif( $pricing_model == 'multiple_role' ){
            // Fix, Show price for all user doesn't show for multiple role
            // Support for testing mode
            if( $show_wholesale_price_for == 'administrator' ){
                $select_role_for_all_users_price = $current_user_role === 'administrator' ? 'whols_default_role' : $current_user_role;
            }

            if( in_array($show_wholesale_price_for, array('all_users', 'administrator')) && $select_role_for_all_users_price ){
                $current_user_roles[] = $select_role_for_all_users_price;
            }



            $price_type_2_properties_meta = get_post_meta( $product_data->get_id(), '_whols_price_type_2_properties', true);

            if( $price_type_2_properties_meta ){
                $roles_data_list = explode( ';', $price_type_2_properties_meta );

                foreach( $roles_data_list as $role_data ){
                    $role_data_arr = explode( ':', $role_data );

                    if(
                        ( is_admin() && !wp_doing_ajax() ) || // Don't need to check role for admin
                        in_array( 'any_role',  $role_data_arr ) ||
                        array_intersect($current_user_roles, $role_data_arr) // Fix, Show price for all user doesn't show for multiple role
                    ){
                        if( !empty($role_data_arr[1]) ){
                            $enable_this_pricing = true;
                            $price_type          = 'flat_rate';
                            $price_value         = $role_data_arr[1];
                            $minimum_quantity    = $role_data_arr[2] ? $role_data_arr[2] : 1;
                        }

                        break;
                    }
                }
            }

        }  // elseif multiple_role

        return array(
            'enable_this_pricing'  => $enable_this_pricing,
            'price_type'           => $price_type,
            'price_value'          => $price_value,
            'minimum_quantity'     => $minimum_quantity,
            'tiers'                => $tiers
        );
    }
}


if( !function_exists('whols_insert_element_after_specific_array_key') ){

    /**
     * It takes an array, a specific key, and a new element, and inserts the new element after the
     * specific key
     *
     * @param array arr The array where you want to insert the new element.
     * @param string specific_key The key of the array element you want to insert after.
     * @param array new_element The new element to be inserted.
     *
     * @return array
     */
    function whols_insert_element_after_specific_array_key( $arr, $specific_key, $new_element ){
        if( !is_array($arr) || !is_array($new_element) ){
            return $arr;
        }

        if( !array_key_exists( $specific_key, $arr ) ){
            return $arr;
        }

        $array_keys = array_keys( $arr );
        $start      = (int) array_search( $specific_key, $array_keys, true ) + 1; // Offset

        $spliced_arr                = array_splice( $arr, $start );
        $new_element_key            = $new_element['key'];
        $arr[$new_element_key]      = $new_element['value'];
        $new_arr                    = array_merge( $arr, $spliced_arr );

        return $new_arr;
    }
}

if( !function_exists('whols_product_category_dropdown_options') ){
    function whols_product_category_dropdown_options(){
        $query  = new WP_Term_Query( array(
            'taxonomy'   => 'product_cat',
            'hide_empty' => true,
        ) );

        $options = array();

        if ( ! is_wp_error( $query ) && !empty( $query->terms ) ) {
            foreach ( $query->terms as $item ) {
              $options[$item->slug] = $item->name;
            }
        }

        return $options;
    }
}

if( !function_exists('whols_roles_dropdown_options') ){
    function whols_roles_dropdown_options(){
        $options = array();

        if( class_exists('WP_Term_Query') ) {
            $query  = new WP_Term_Query( array(
                'taxonomy'   => 'whols_role_cat',
                'hide_empty' => false,
            ) );

            if ( ! is_wp_error( $query ) && !empty( $query->terms ) ) {
                foreach ( $query->terms as $item ) {
                  $options[$item->slug] = $item->name;
                }
            }
        }

        return $options;
    }
}

if( !function_exists('whols_is_wholesale_priced') ){
    /**
     * Check wheather the give products is applicable for wholesale price or not.
     *
     * @param $product_id The product ID of the item being added to the cart.
     * @param $qty The quantity of the product being added to the cart.
     *
     * @return array|bool
     */
    function whols_is_wholesale_priced( $product_id, $qty ){
        $product_data = wc_get_product($product_id);

        // Validate product exists
        if ( ! $product_data || ! is_a( $product_data, 'WC_Product' ) ) {
            return false;
        }

		$variation_id = '';

        if($product_data->is_type('simple')){
            $product_id     = $product_data->get_id();
        } elseif( $product_data->is_type('variation') ){
            $product_id     = $product_data->get_parent_id();
            $variation_id   = $product_data->get_id();
        }

        $wholesale_status    = whols_is_on_wholesale( $product_id, $variation_id );
        $enable_this_pricing = $wholesale_status['enable_this_pricing'];
        $price_value         = $wholesale_status['price_value'];
        $minimum_quantity    = $wholesale_status['minimum_quantity'];

        if( whols_is_wholesaler(get_current_user_id()) && $enable_this_pricing && $price_value &&  $qty >= $minimum_quantity  ){
            // Returned array in case we need to pass any other data in the future
            return array(
                'wholesale_priced' => 'yes'
            );
        }

        return false;
    }
}

/**
 * It returns an array of product IDs that have the meta key
 * `_whols_mark_this_product_as_wholesale_only` set to `yes`
 *
 * @return array of product IDs.
 */
if( !function_exists('whols_get_wholesale_only_product_ids') ){
    function whols_get_wholesale_only_product_ids(){

        // Backword compatibility
        $ids = wc_get_products( array(
            'status'        => 'publish',
            'limit'         => -1,
            'whols_custom_query' => 'wholesaler_only',
            'return'        => 'ids',
        ) );

        return $ids;
    }
}

/**
 * It returns an array of product IDs that have the meta key
 * `_whols_product_visibility` set to `retailer_only`
 *
 * @return array of product IDs.
 */
if( !function_exists('whols_get_retail_only_product_ids') ){
    function whols_get_retail_only_product_ids(){
        $ids = wc_get_products( array(
            'status'        => 'publish',
            'limit'         => -1,
			'whols_custom_query' => 'retailer_only',
            'return'        => 'ids',
        ) );

        return $ids;
    }
}

/**
 * @param product The product object
 * @param price_tier If true, it will return all the price tiers for the current user role. If false,
 * it will return only the first price tier.
 *
 * @return array of the current user's role pricing data
 */
function get_current_role_price_for_price_type_2( $product, $price_tier ){
    $price_type_2_properties    = get_post_meta( $product->get_id(), '_whols_price_type_2_properties', true);
    $roles_data_list            = explode( ';', $price_type_2_properties );
    $current_role_pricing_arr   = array();

    if( $price_type_2_properties ){
        foreach( $roles_data_list as $role_data ){
            if(
                in_array( 'any_role', explode( ':', $role_data ) ) ||
                array_intersect( whols_get_current_user_roles(), explode( ':', $role_data ))
            ){
                if( $price_tier ){ // Take all price to the array
                    $current_role_pricing_arr[] = explode( ':', $role_data );
                } else { // Take only the first match
                    $current_role_pricing_arr = explode( ':', $role_data );
                    break;
                }
            }
        }

        // Sort the array by minimum quantity order
        if( $price_tier ){
            usort($current_role_pricing_arr, function($a, $b) {
                return $a[2] - $b[2];
            });
        }
    }

    return $current_role_pricing_arr;
}

if( !function_exists('whols_get_product_price_tiers') ){
    /**
     * It takes a product object and a boolean value as parameters and returns an array of price tiers
     *
     * @param product The product/variation object
     * @param return_prepared_prices If set to true, the function will return an array of min qty =>
     * price pairs. If set to false, it will return an array of arrays, each containing the role, price
     * and min qty.
     *
     * @return array
     */
    function whols_get_product_price_tiers( $product, $return_prepared_prices ){
        $tiers = array(); // tier_qty => price pair

        // For price tyep 2 / multiple role
        $price_type_2_properties    = get_post_meta( $product->get_id(), '_whols_price_type_2_properties', true);
        $roles_data_list            = explode( ';', $price_type_2_properties );

        // Prepare price tiers for multiple role
        if( $price_type_2_properties && whols_get_option('pricing_model') == 'multiple_role' ){
            foreach( $roles_data_list as $role_data ){
                if(
                    ( is_admin() && !wp_doing_ajax() ) || // Don't need to check for admin
                    in_array( 'any_role', explode( ':', $role_data ) ) ||
                    array_intersect( whols_get_current_user_roles(), explode( ':', $role_data ))
                ){

                    $price_data = explode( ':', $role_data );

                    if( $return_prepared_prices ){
                        $min_qty = !empty($price_data[2]) ? $price_data[2] : 1;

                        // Make sure min qty & price has given
                        // then take price to the array
                        if( !empty($price_data[1]) ){
                            $tiers[$min_qty] = $price_data[1];
                        }
                    } else {
                        $tiers[] = explode( ':', $role_data );
                    }
                }
            }
        }

        return $tiers;
    }
}

/**
 * > It takes an array of the tired price list and returns the price that corresponds to the quantity
 *
 * @param prices The tired price list array.
 * @param cart_qty The quantity of the product in the cart.
 *
 * @return int|float
 */
function get_price_by_qty_from_tired_price_list( $prices, $cart_qty ){
    $price = -1;

    // We need to loop through the higer qty first so needed to short the array in desc order
    krsort($prices);

    foreach( $prices as $tier_min_qty => $tier_price ){
        if( $cart_qty >= $tier_min_qty ){
            $price = $tier_price;
            break;
        }
    }

    return $price;
}

if (!function_exists('str_contains')) {
    function str_contains($haystack, $needle) {
        return $needle !== '' && mb_strpos($haystack, $needle) !== false;
    }
}

/**
 * Get countries
 *
 * @return array
 */
if(!function_exists('whols_get_countries')){
    function whols_get_countries() {
        $countries = array();

        if( class_exists('WC_Countries') ){
            if( WC()->countries ){
                $countries = WC()->countries->get_countries();
            } else {
                $c = new WC_Countries(); // WC_Countries instance created after woocommerce_init hook
                $countries = $c->get_countries();
            }
        }

        return $countries;
    }
}

/**
 * Get users dropdown options
 *
 * @return array
 */
if( !function_exists('whols_users_dropdown_options') ){
    function whols_users_dropdown_options() {
        $users = get_users([
            'fields'  => ['ID', 'display_name'],
            'number'  => 200,
            'orderby' => 'display_name',
            'order'   => 'ASC'
        ]);

        return array_reduce($users, function($options, $user) {
            $options[$user->ID] = $user->display_name;
            return $options;
        }, []);
    }
}

/**
 * Check if the current user has the given role
 *
 * @param array $roles
 *
 * @return boolean
 */
function whols_is_user_has_role( $roles ){
    // current user roles
    $current_user_roles = array();
    $user_id = get_current_user_id();
    if( $user_id ){
        $user_obj   = get_user_by( 'id', $user_id );

        if( $user_obj ){
            $current_user_roles = $user_obj->roles;
        }
    }

    if( array_intersect($current_user_roles, $roles) ){
        return true;
    }

    return false;
}

/**
 * Returns true if the request is a non-legacy REST API request.
 *
 * Legacy REST requests should still run some extra code for backwards compatibility.
 *
 * @todo: replace this function once core WP function is available: https://core.trac.wordpress.org/ticket/42061.
 *
 * @return bool
 */
if(!function_exists('whols_is_rest_api_request')){
    function whols_is_rest_api_request() {
        if ( empty( $_SERVER['REQUEST_URI'] ) ) {
            return false;
        }

        $rest_prefix         = trailingslashit( rest_get_url_prefix() );
        $is_rest_api_request = ( false !== strpos( $_SERVER['REQUEST_URI'], $rest_prefix ) ); // phpcs:disable WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

        return $is_rest_api_request;
    }
}

/**
 * What type of request is this?
 *
 * @param  string $type admin, ajax, cron or frontend.
 * @return bool
 */
if(!function_exists('whols_is_request')){
    function whols_is_request( $type ) {
        switch ( $type ) {
            case 'admin':
                return is_admin();
            case 'ajax':
                return defined( 'DOING_AJAX' );
            case 'cron':
                return defined( 'DOING_CRON' );
            case 'frontend':
                return ( ! is_admin() || defined( 'DOING_AJAX' ) ) && ! defined( 'DOING_CRON' ) && ! whols_is_rest_api_request();
        }
    }
}

/**
 * Get conversation count
 *
 * @param string $status
 *
 * @return int
 */
if(!function_exists('whols_get_conversation_count')){
    function whols_get_conversation_count( $status = 'pending' ) {
        $args = array(
            'post_type'      => 'whols_conversation',
            'post_status'    => 'pending',
            'numberposts'    => -1,
            'fields'         => 'ids',
        );

        $conversations = get_posts( $args );

        return count( $conversations );
    }
}

/**
 * Centralized function to manage rewrite rules flushing for all plugin endpoints.
 * 
 * @return void
 */
if(!function_exists('whols_maybe_flush_rewrite_rules')){
    function whols_maybe_flush_rewrite_rules(){
        $flag = get_option('whols_flush_permalink');

        if( $flag === '1' ){
            flush_rewrite_rules();
            delete_option('whols_flush_permalink');
        }
    }
}

/**
 * Check if the checkout page is block based
 *
 * @return bool
 */
if(!function_exists('whols_is_block_based_checkout')){
    function whols_is_block_based_checkout() {
        return WC_Blocks_Utils::has_block_in_page( wc_get_page_id('checkout'), 'woocommerce/checkout' );
    }
}

/**
 * Check if the current scope is block editor or user is editing a block
 *
 * @return bool
 */
if(!function_exists('whols_is_block_editor')){
    function whols_is_block_editor(){
        $is_block_editor = false;

        $request_uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
        if (strpos($request_uri, 'block-renderer') !== false) {
            $is_block_editor = true;
        }

        return $is_block_editor;
    }
}

/**
 * Check if test mode is enabled
 *
 * @return bool
 */
function whols_is_test_mode(){
    $show_wholesale_price_for = whols_get_option('show_wholesale_price_for');

    if($show_wholesale_price_for === 'administrator'){
        return true;
    }

    return false;
}


/**
 * List enabled payment gateways.
 *
 * @return array
 */
if( !function_exists('whols_get_enabled_payment_gateways_old') ) {
    function whols_get_enabled_payment_gateways_old(){
        // This function was not loading all payment gateways
        global $wpdb;
    
        $query = "SELECT option_name, option_value
                    FROM {$wpdb->prefix}options
                    WHERE option_name LIKE 'woocommerce_%_settings'
                    AND option_name NOT LIKE 'woocommerce_settings_%'";
    
        $results = $wpdb->get_results($query);
    
        $enabled_gateways = array();
        foreach ($results as $result) {
            // Extract gateway ID from option name (e.g., 'woocommerce_cod_settings' -> 'cod')
            $gateway_id = str_replace(['woocommerce_', '_settings'], '', $result->option_name);
    
            // Unserialize the settings
            $settings = maybe_unserialize($result->option_value);
    
            $enabled = isset($settings['enabled']) ? $settings['enabled'] : 'no';
            if (is_array($settings) && isset($settings['title']) && $enabled == 'yes') {
                $enabled_gateways[$gateway_id] = $settings['title'];
            }
        }
    
        return $enabled_gateways;
    }
}

/**
 * Get all enabled WooCommerce payment gateways for dropdown
 *
 * @return array Array of gateway data formatted for dropdown
 */
if(!function_exists('whols_get_enabled_payment_gateways')){
    function whols_get_enabled_payment_gateways() {
        if (!class_exists('WooCommerce')) {
            return array();
        }

        $available_gateways = array();
        $gateways = WC()->payment_gateways()->payment_gateways();

        foreach ($gateways as $gateway) {
            if ($gateway->enabled === 'yes') {
                $available_gateways[$gateway->id] = array(
                    'id' => $gateway->id,
                    'title' => $gateway->title,
                    'description' => $gateway->description,
                    'method_title' => $gateway->method_title,
                    'icon' => $gateway->icon,
                );
            }
        }

        return $available_gateways;
    }
}

/**
 * Format gateways for dropdown selection
 *
 * @return array Formatted array for dropdown
 */
if(!function_exists('whols_get_payment_gateways_for_dropdown')){
    function whols_get_payment_gateways_for_dropdown() {
        $gateways = whols_get_enabled_payment_gateways();
        $formatted_gateways = array();

        foreach ($gateways as $id => $gateway) {
            $formatted_gateways[$id] = $gateway['title'];
        }

        return $formatted_gateways;
    }
}

/**
 * Get all WordPress pages for dropdown options
 *
 * @return array Array of pages with id as key and title as value
 */
if(!function_exists('whols_pages_dropdown_options')){
    function whols_pages_dropdown_options( $post_type = 'page' ) {
        $query = new WP_Query(array(
            'post_type' => $post_type,
            'post_status' => 'publish',
            'posts_per_page' => 200, // @todo apply_filter
            'orderby' => 'title',
            'order' => 'ASC',
        ));

        $options = array();

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $options[] = array(
                    'id' => (string) get_the_ID(),
                    'title' => get_the_title()
                );
            }
            wp_reset_postdata();
        }

        return $options;
    }
}

/**
 * Get all WordPress terms for dropdown options
 *
 * @param string $taxonomy Taxonomy name
 * @return array Array of terms with id as key and title as value
 */
if(!function_exists('whols_terms_dropdown_options')){
    function whols_terms_dropdown_options($taxonomy = 'product_cat') {
        $terms = get_terms(array(
            'taxonomy' => $taxonomy,
            'hide_empty' => true,
            'orderby' => 'name',
            'order' => 'ASC',
            'number' => 0, // Get all terms
            'fields' => 'all', // Get all term fields
            'update_term_meta_cache' => false // Don't fetch term meta if not needed
        ));

        if (is_wp_error($terms)) {
            return array();
        }

        // Use array_map for better performance than foreach
        return array_map(function($term) {
            return array(
                'id' => (string) $term->term_id,
                'slug' => $term->slug,
                'title' => $term->name
            );
        }, $terms);
    }
}

/**
 * Include a plugin file safely
 *
 * @param string $path File path relative to plugin directory e.g: 'includes/functions/actions.php'
 * @return bool True if file was included successfully, false otherwise
 */
if( !function_exists('whols_include_plugin_file') ){
    function whols_include_plugin_file( $path ){
        // Get plugin directory path
        $plugin_dir = plugin_dir_path( Whols_Pro\PL_FILE );
        
        // Clean the path and ensure it's relative
        $path = ltrim( str_replace('\\', '/', $path), '/' );
        
        // Build full path
        $full_path = $plugin_dir . $path;
        
        // Validate path is within plugin directory
        if( strpos(realpath($full_path), realpath($plugin_dir)) !== 0 ){
            return false;
        }
        
        if( file_exists($full_path) ){
            return include $full_path;
        }
        
        return false;
    }
}

/**
 * Get wholesale price visibility
 *
 * @return string administrator or all_users or only_wholesalers
 */
function whols_get_wholesale_price_visibility(){
    return whols_get_option('show_wholesale_price_for');
}

/**
 * Check if the onboarding should be shown
 * 
 * @return bool
 */
function whols_should_show_onboarding() {
    $installed_timestamp = get_option( 'whols_pro_installed' );
    $cutoff_timestamp = strtotime('2025-05-10'); // Show onboarding after this date
    $onboarding_status = get_option('whols_onboarding');

    if ( $installed_timestamp > $cutoff_timestamp && $onboarding_status != 'complete' ) {
        return true;
    }

    return false;
}