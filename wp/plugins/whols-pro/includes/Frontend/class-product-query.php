<?php
namespace Whols_Pro\Frontend;

/**
 * Manage_Product_Query
 */
class Manage_Product_Query {

    /**
     * Constructor.
     */
    public function __construct() {
        // Exclude products from archive page
        // add_filter( 'woocommerce_product_query_meta_query', array( $this, 'exclude_products' ), 10, 2 );

        // Implement Wholesale only categories
        if( whols_get_option('enable_wholesale_only_categories') ){
            add_action( 'woocommerce_product_query', array( $this, 'query_for_wholesale_only_category' ) );
        }

        // Product visibility (meta).
		// Prepare a custom query paramter for wc_get_posts() by which the wholesaler only / retailer only meta query is prepared.
        add_filter( 'woocommerce_product_data_store_cpt_get_products_query', array($this, 'custom_meta_query_for_wc_get_products'), 10, 3 );

		// Excude wholesaler only / retailer only products using post__not_in query.
		// It runs after woocommerce_product_data_store_cpt_get_products_query filter.
        add_action( 'woocommerce_product_query', array( $this, 'woocommerce_product_query_cb'));

		// Compatibility for WooLentor addons / shortcode [products].
		// It runs after woocommerce_product_query filter.
		add_filter( 'woocommerce_shortcode_products_query', array( $this, 'woocommerce_shortcode_products_query_cb'), 10, 3);

		// Exclude wholesale only products from related products
        add_filter( 'woocommerce_related_products', array( $this, 'woocommerce_related_products_cb' ), 99, 3 );
    }

    //  Exclude products from archive page
    function exclude_products( $meta_query, $query ) {
        $current_user_id = get_current_user_id();

        // hide wholesale products from other customers
        $hide_wholesale_only_products_from_other_customers = whols_get_option('hide_wholesale_only_products_from_other_customers');

        if( $hide_wholesale_only_products_from_other_customers && !whols_is_wholesaler( $current_user_id ) ){
            $meta_query[] = array(
                'relation' => 'OR',

                // Show all the existing products that doesn't have the old/new meta keys
                array(
                    'relation' => 'AND',
                    array(
                        'key'     => '_whols_mark_this_product_as_wholesale_only',
                        'compare' => 'NOT EXISTS'
                    ),
                    array(
                        'key'     => '_whols_mark_this_product_as_wholesale',
                        'compare' => 'NOT EXISTS'
                    ),
                ),

                // Show all the products that has meta key _whols_mark_this_product_as_wholesale and the value is not not equals yes
                // Support for old meta key
                array(
                    'key'     => '_whols_mark_this_product_as_wholesale',
                    'value'   => 'yes',
                    'compare' => '!='
                ),

                // Show all the products that has meta key _whols_mark_this_product_as_wholesale_only and the value is not not equals yes
                // Support for new meta key
                array(
                    'key'     => '_whols_mark_this_product_as_wholesale_only',
                    'value'   => 'yes',
                    'compare' => '!='
                )
            );
        }

        // hide general products from wholesalers
        $hide_general_products_from_wholesalers = whols_get_option('hide_general_products_from_wholesalers');
        if( $hide_general_products_from_wholesalers && whols_is_wholesaler( $current_user_id ) ){
            $meta_query[] = array(
                'key'     => '_whols_mark_this_product_as_wholesale_only',
                'value'   => 'yes',
                'compare' => '='
            );
        }

        return $meta_query;
    }

    public function query_for_wholesale_only_category( $q ){
        if( whols_is_wholesaler() ){

            // get current wholesaler roles
            $current_user_roles    = array_flip(whols_get_current_user_roles()); // convert role elemets as key

            // Prepare didallowed categories
            $disallowed_categories = array();

            // $mapped_roles          = self::get_wholesale_only_categories( 'role' ); // it may need in the futher for debugging
            $mapped_categories     = self::get_wholesale_only_categories();

            // Loop through categories then
            // if the categories are assigned for all roles don't add the categories to the
            // add the categories to the disallowed in which the current role is not exists
            foreach( $mapped_categories as $key => $roles ){
                if(  array_intersect_key(array('all' => ''), array_flip($roles)) ){
                    continue;
                }

                if( !array_intersect_key($current_user_roles, array_flip($roles)) ){
                    $disallowed_categories[] = $key;
                }
            }

        } else { // Not if wholesaler

            $mapped_categories     = self::get_wholesale_only_categories();

            // Fixed array_keys(): Argument #1 ($array) must be of type array, null given
            if( $mapped_categories ){
                $disallowed_categories =  array_keys( $mapped_categories ); // Wholesale only categories.
            }

        } // end if wholesaler

        if( $disallowed_categories ){
            $include_children = (bool) whols_get_option('include_children');
            $tax_query        = (array) $q->get( 'tax_query' );

            $tax_query[] = array(
                'taxonomy' => 'product_cat',
                'field'    => 'slug',
                'terms'    => $disallowed_categories,
                'operator' => 'NOT IN',
                'include_children' => $include_children,
            );

            $q->set( 'tax_query', $tax_query );
        }
    }

    /**
     * Formate the wholesale only categories by categoy OR roles
     *
     * When base = category, the formated array will be like
     *  'shirt' => array('role1', 'role3');
     *
     * When base = role, the formated array will be like
     *  'role1' => array('shirt')
     *  'role3' => array('shirt')
     *
     * @param $base The base to return the data. Can be either 'category' or 'role'.
     */
    public static function get_wholesale_only_categories( $base = 'category' ){
        $categories_list    = (array) whols_get_option('wholesale_only_categories');
        $mapped_categories  = array();
        $mapped_roles       = array();
        $formatted_arr      = array();

        // return defualt
        if( !in_array( $base, array('category', 'role') ) || empty($categories_list) ){
            return array();
        }

        // Prepare and map categories
        foreach( $categories_list as $i => $item ){

            // Map categories
            if( $base === 'category' && !empty($item['categories']) ){
                foreach( $item['categories'] as $category_slug ){
                    $cat_term_object = get_term_by( 'slug', $category_slug, 'product_cat' );

                    // Avoid error
                    if( !is_object($cat_term_object) ){
                        return;
                    }

                    if( empty($item['roles']) ){
                        $mapped_categories[$cat_term_object->slug] = array('all');
                    } else {
                        $mapped_categories[$cat_term_object->slug] = $item['roles'];
                    }
                }

                $formatted_arr = $mapped_categories;
            }

            // Map Roles
            if( $base === 'role' ){

                if( !empty($item['roles']) ){
                    foreach( $item['roles'] as $role_slug ){
                        if( !empty($mapped_roles[$role_slug]) && !empty($item['categories']) ){
                            $mapped_roles[$role_slug] = array_unique( array_merge($mapped_roles[$role_slug], $item['categories']) ); // prevent adding duplicates
                        } elseif( !empty($item['categories']) ){
                            $mapped_roles[$role_slug] = $item['categories'];
                        }
                    }
                } elseif( !empty($item['categories']) ) { // where role is not assigned, make it represnts as All "Wholesale Roles"
                    foreach( $item['categories'] as $category_slug ){
                        $mapped_roles['all'][] = $category_slug;
                    }
                }

                $formatted_arr = $mapped_roles;
            }
        }

        return $formatted_arr;
    }

    public function custom_meta_query_for_wc_get_products( $wp_query_args, $query_vars, $data_store_cpt ) {
        if ( ! empty( $query_vars['whols_custom_query'] ) &&  $query_vars['whols_custom_query'] == 'wholesaler_only') {
            $wp_query_args['meta_query']['relation'] = 'OR';

            $wp_query_args['meta_query'][] = array(
                'key'     => '_whols_product_visibility', // any meta key
                'value'   => 'wholesaler_only', // value under that meta
                'compare' => '='
            );

            $wp_query_args['meta_query'][] = array(
                'key'     => '_whols_mark_this_product_as_wholesale_only', // any meta key
                'value'   => 'yes', // value under that meta
                'compare' => '='
            );
        }

		if ( ! empty( $query_vars['whols_custom_query'] ) &&  $query_vars['whols_custom_query'] == 'retailer_only') {
            $wp_query_args['meta_query']['relation'] = 'OR';

            $wp_query_args['meta_query'][] = array(
                'key'     => '_whols_product_visibility', // any meta key
                'value'   => 'retailer_only', // value under that meta
                'compare' => '=',
            );
        }

        return $wp_query_args;
    }


	/**
	 * Based on the configured settings and the current user role, it returns the include/exclude product ids.
	 *
	 * @return arrary
	 */
	public function get_include_exclude_ids(){
		$ids = array(
			'post__in'     => array(),
			'post__not_in' => array()
		);

		if( whols_is_wholesaler() ){ // for wholesaler - exclude retailer only products
			$hide_general_products_from_wholesalers       = whols_get_option('hide_general_products_from_wholesalers');
			$hide_retailer_only_products_from_wholesalers = whols_get_option('hide_retailer_only_products_from_wholesalers', true);

			if( $hide_general_products_from_wholesalers ){

				$wholesaler_only_product_ids = whols_get_wholesale_only_product_ids();
				$ids['post__in'] = !empty($wholesaler_only_product_ids) ? $wholesaler_only_product_ids : array(0);

			} else if( $hide_retailer_only_products_from_wholesalers ) {

				$ids['post__not_in'] = whols_get_retail_only_product_ids();

			}

        } else { // for retailer - exclude wholesaler only products
			$hide_wholesale_only_products_fron_non_wholesalers = whols_get_option('hide_wholesale_only_products_from_other_customers', true);

			if( $hide_wholesale_only_products_fron_non_wholesalers ){

				$ids['post__not_in'] = whols_get_wholesale_only_product_ids();

			}
        }

		return $ids;
	}

	public function woocommerce_product_query_cb( $q ){
        // Compatibility: Goldish Theme - Ajax search of the theme was making infinite loop, so added this check
        if ( isset( $_REQUEST['action'] ) && strpos( $_REQUEST['action'], 'ideapark_ajax_' ) === 0 ) {
            return;
        }

		$include_exclude_ids = $this->get_include_exclude_ids();

		if( !empty($include_exclude_ids['post__not_in']) ){
			$q->set( 'post__not_in', $include_exclude_ids['post__not_in'] );
		}

		if( !empty($include_exclude_ids['post__in']) ){
			$q->set( 'post__in', $include_exclude_ids['post__in'] );
		}
    }

	public function woocommerce_shortcode_products_query_cb($args, $atts, $loop_name){
		$include_exclude_ids = $this->get_include_exclude_ids();

		if( !empty($include_exclude_ids['post__not_in']) ){
			// If the shortcode query already has post__not_in, don't override it.
			if( empty($args['post__not_in']) ){
				$args['post__not_in'] = $include_exclude_ids['post__not_in'];
			}
		}

		if( !empty($include_exclude_ids['post__in']) ){

			// If the shortcode query already has post__in, don't override it.
			if( empty($args['post__in']) ){
				$args['post__in'] = $include_exclude_ids['post__in'];
			}
		}

		return $args;
	}

	public function woocommerce_related_products_cb( $related_posts, $product_id, $args  ){
        $wholesale_only_product_ids = whols_get_wholesale_only_product_ids();

        // For wholesaler - remove all products which is not wholesaler only
        if( whols_is_wholesaler() ){
            $related_posts = array_intersect( $related_posts, $wholesale_only_product_ids );
        }

        // For retiler - remove all products which is wholesaler only
        if( !whols_is_wholesaler() ){
            // Get the wholesale only product ids
            $related_posts = array_diff( $related_posts, $wholesale_only_product_ids );
        }

        return $related_posts;
    }
}
