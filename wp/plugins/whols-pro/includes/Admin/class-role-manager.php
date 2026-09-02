<?php
/**
 * Role Manager.
 *
 * Create, Edit & Delete roles.
 *
 * @since 1.0.0
 */

namespace Whols_Pro\Admin;

/**
 * Role_Manager class.
 */
class Role_Manager{
    /**
     * Role mannager constructor.
     *
     * @since 1.0.0
     */
    public function __construct() {
        add_action( 'created_whols_role_cat', array( $this, 'create_role' ), 10, 2 );
        add_action( 'delete_whols_role_cat', array( $this, 'delete_role' ), 10, 4 );
        add_action('post_updated', array( $this, 'update_user_role' ), 10, 3 );

        // Change label of the role in the list of user edit page
        add_filter( 'editable_roles', array( $this, 'change_role_label' ) );

        // Change slug description in the role edit page
        add_filter( 'gettext', array( $this, 'change_term_slug_desc_text' ), 20, 3 );
    }

    /**
     * Create a new role
     *
     * @since 1.0.0
     */
    public function create_role( $term_id, $tt_id ){
        $term_obj = get_term( $term_id, 'whols_role_cat' );
        add_role( $term_obj->slug, $term_obj->name . esc_html__( ' - Whols Role', 'whols' ), array( 'read' => true, 'level_0' => true ) );
    }

    /**
     * Update user role
     *
     * @since 1.0.0
     */
    public function update_user_role( $post_ID ){
        if( get_post_type( $post_ID ) == 'whols_user_request' ){
            $meta_prev       = get_post_meta( $post_ID, 'whols_user_request_meta', true );
            // $meta_new = isset( $_POST['whols_user_request_meta'] ) ? array_map( 'sanitize_text_field', $_POST['whols_user_request_meta'] ) : array();
            $meta_new        = isset( $_POST['whols_user_request_meta'] ) ? array_map( 'sanitize_text_field', $_POST['whols_user_request_meta'] ) : array(
                'assign_role' => 'subscriber'
            );

            $user_id         = $meta_prev['user_id'];
            $assign_role_new = array_key_exists( $meta_new['assign_role'], whols_get_taxonomy_terms( 'whols_role_cat' )) ? $meta_new['assign_role'] : 'subscriber';
            $status_new      = isset( $meta_new['status'] ) ? $meta_new['status'] : '';

            // update role when previous role & new role is not same
            if( $assign_role_new && $status_new == 'approve' ){

                $user = new \WP_User( $user_id );

                // add new role
                $user->set_role( $assign_role_new );
                // $user->add_role( $assign_role_new );


            } else if( $status_new == 'reject' ||  empty( $assign_role_new ) ){
                $user = new \WP_User( $user_id );

                // remove all roles
                // @todo remove only whols roles
                $user->set_role('');

                // add subscriber role
                $user->set_role('subscriber');
            }
        }
    }

    /**
     * Delete role
     *
     * @since 1.0.0
     */
    public function delete_role( $term_id, $tt_id, $deleted_term_id, $object_ids ){
        $term_obj = get_term( $deleted_term_id, 'whols_role_cat' );
        remove_role( $term_obj->slug );
    }

    /**
     * It loops through all the roles, checks if there's a term with the same slug as the role, and if
     * there is, it changes the role name to the term name
     *
     * @param all_roles This is an array of all the roles in the system.
     *
     * @return array
     */
    public function change_role_label( $all_roles ){
        foreach( $all_roles as $role => $role_info ){
            $role_term = get_term_by('slug', $role, 'whols_role_cat');

            if( $role_term ){
                $all_roles[$role]['name'] =  $role_term->name . __( ' - Whols Role', 'whols' );
            }
        }

        return $all_roles;
    }

    /**
     * It changes the description text of the "slug" field in the "Add New Role" page
     *
     * @param translated_text The translated text.
     * @param text The text to be translated.
     * @param domain The text domain of the string.
     *
     * @return string translated text.
     */
    public function change_term_slug_desc_text( $translated_text, $text, $domain ){
        $taxonomy = isset($_GET['taxonomy']) ? sanitize_text_field( $_GET['taxonomy'] ) : '';

        if ( $taxonomy === 'whols_role_cat' ) {
            if( $text === 'The &#8220;slug&#8221; is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.' ){
                $translated_text = __('URL-friendly version of the name. It is used to identify the role. It should be all lowercase and contains only letters, numbers, and hyphens. <br><br> It cannot be changed, but you can use the "Name" field to specify a different name.', 'whols');
            }
        }

        return $translated_text;
    }
}