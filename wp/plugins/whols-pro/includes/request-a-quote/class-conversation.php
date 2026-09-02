<?php
namespace Whols_Pro;
use const Whols_Pro\PL_PATH;
use const Whols_Pro\PL_VERSION;

class Manage_Conversation {
    public function __construct() {
        $enable_conversation = whols_get_option('enable_conversation');

        if( !$enable_conversation ){
            return;
        }

        // Register the post type.
        add_action( 'init', array( $this, 'register_post_type' ) );
		add_action( 'init', array( $this, 'custom_post_type_status' ) );

		// Add custom status to dropdown menu
		add_action('admin_footer-post.php', array( $this, 'add_custom_status_to_post_type') );
		add_action('admin_footer-post-new.php', array( $this, 'add_custom_status_to_post_type') );

        add_action( 'add_meta_boxes', array( $this, 'register_chat_metabox' ), 10, 2 );

        // Add Conversation tab to the myaccount page.
        add_filter( 'woocommerce_account_menu_items', array( $this, 'add_my_account_menu_item' ) );

        // Register new endpoint (URL) for My Account page.
        add_action( 'init', array( $this, 'register_conversations_endpoint' ) ); // Need to re-save permalink.

        // Add new query var for the conversation endpoint.
        add_filter( 'query_vars', function( $vars ) {
            $vars[] = 'whols-conversations';

            return $vars;
        } );

        // Add content to the new tab
        add_action( 'woocommerce_account_whols-conversations_endpoint', array( $this, 'render_conversation_tab_content' ) );

        add_action( 'admin_init', function() {
            global $wp_post_statuses, $typenow;

            if( $typenow == 'whols_conversation' ) {
                $wp_post_statuses['pending']->show_in_admin_status_list = true;
                $wp_post_statuses['pending']->show_in_admin_all_list = true;
            }
        } );

        // Dont create conversation when request a quote is submitted.
        $location = !empty($_REQUEST['location']) ? sanitize_text_field($_REQUEST['location']) : '';
        $create_conversation_when_request_a_quote = whols_get_option('create_conversation_when_request_a_quote');
        if( !$create_conversation_when_request_a_quote && $location == 'cart' ){
            add_filter( 'whols_create_conversation_when_request_a_quote', '__return_false' );
        }

		// Create conversation after raq
		add_action('whols_after_raq_form_submit', array($this, 'create_conversation_after_raq'));
    }

    public function register_post_type() {
        $labels = array(
            'name'               => esc_html__( 'Conversations', 'whols_pro' ),
            'singular_name'      => esc_html__( 'Conversation', 'whols_pro' ),
            'menu_name'          => esc_html__( 'Conversations', 'whols_pro' ),
            'name_admin_bar'     => esc_html__( 'Conversation', 'whols_pro' ),
            'add_new'            => esc_html__( 'Add New', 'whols_pro' ),
            'add_new_item'       => esc_html__( 'Add New Conversation', 'whols_pro' ),
            'new_item'           => esc_html__( 'New Conversation', 'whols_pro' ),
            'edit_item'          => esc_html__( 'Edit Conversation', 'whols_pro' ),
            'view_item'          => esc_html__( 'View Conversation', 'whols_pro' ),
            'all_items'          => esc_html__( 'Conversations', 'whols_pro' ),
            'search_items'       => esc_html__( 'Search Conversations', 'whols_pro' ),
            'parent_item_colon'  => esc_html__( 'Parent Conversations:', 'whols_pro' ),
            'not_found'          => esc_html__( 'No Conversations found.', 'whols_pro' ),
            'not_found_in_trash' => esc_html__( 'No Conversations found in Trash.', 'whols_pro' )
        );

        $args = array(
            'labels'             => $labels,
            'description'        => esc_html__( 'Description.', 'whols_pro' ),
            'public'             => false,
            'publicly_queryable' => false,
            'show_ui'            => true,
            'show_in_menu'       => 'whols-admin',
            'query_var'          => false,
            'rewrite'            => array( 'slug' => 'conversation' ),
            'capability_type'    => 'post',
            'has_archive'        => false,
            'hierarchical'       => false,
            'menu_position'      => 10,
            'supports'           => array( 'title' ),
            'menu_icon'          => 'dashicons-email-alt',
        );

        register_post_type( 'whols_conversation', $args );
    }

	public function custom_post_type_status(){
		register_post_status('whols-awaiting-reply', array(
			'label'                     => _x('Awaiting Reply', 'post'),
			'public'                    => true,
			'exclude_from_search'       => false,
			'show_in_admin_all_list'    => true,
			'show_in_admin_status_list' => true,
			'label_count'               => _n_noop('Awaiting Reply <span class="count">(%s)</span>', 'Awaiting Reply <span class="count">(%s)</span>'),
		));
	}

	public function add_custom_status_to_post_type() {
		global $post;
		if ($post->post_type == 'whols_conversation') {
			$selected_attr = '';
			$label = '';

			if ($post->post_status == 'whols-awaiting-reply') {
				$selected_attr = ' selected="selected"';
				$label = '<span id="post-status-display"> Awaiting Reply</span>';
			}

			echo '
			<script>
			jQuery(document).ready(function($){
				$("select#post_status").append("<option value=\"whols-awaiting-reply\" ' . $selected_attr . '>Awaiting Reply</option>");
				$(".misc-pub-section label").append("' . $label . '");
			});
			</script>
			';
		}
	}

    public function register_chat_metabox(){
        add_meta_box(
            'conversation_metabox',
            __( 'Conversations', 'whols' ),
            array( $this, 'conversation_metabox_callback' ),
            array( 'whols_conversation' ),
            'advanced',
            'default'
        );
    }

    public function add_my_account_menu_item( $items ) {
        if( $this->is_eligible_customer() ){
            $items_count = count( $items );

            $first_slice = array_slice($items, 0, $items_count - 1);
            $second_slice = array_slice($items, $items_count - 1);

            // Add new item
            $first_slice['whols-conversations'] = esc_html__( 'Conversations', 'whols' );
            $items = array_merge($first_slice, $second_slice);
        }

        return $items;
    }

    public function register_conversations_endpoint() {
        add_rewrite_endpoint( 'whols-conversations', EP_ROOT | EP_PAGES );

        // Maybe flush rewrite rule
        whols_maybe_flush_rewrite_rules('conversations');
    }

    public function render_conversation_tab_content(){
        if( ! $this->is_eligible_customer() ) {
            echo '<div class="whols-conversation-tab-content">';
            printf( '<h3>%s</h3>', esc_html__( 'You are not authorized to access this page!', 'whols' ) );
            echo '</div>';
            return;
        }

        $conversation_id = isset( $_GET['post'] ) ? absint($_GET['post']) : -1;
        $conversation = get_post( $conversation_id );

        echo '<div class="whols-conversation-tab-content">';

        // Single conversation
        if( $conversation_id > 0 && !get_post( $conversation_id ) || ($conversation && $conversation->post_status == 'trash') ){
            printf( '<h3>%s</h3>', esc_html__( 'Conversation not found!', 'whols' ) );
        } elseif( $conversation_id > 0 && $conversation ){
            $conversation_title = $conversation->post_title;
            ?>
                <div class="whols-conversation-title">
                    <?php echo esc_html__('Subject:', 'whols') ?> <?php echo esc_html($conversation_title) ?>
                </div>
                <?php $this->render_conversation_chatbox($conversation_id); ?>
            <?php
        }

        // All conversations
        if( $conversation_id < 1 ) {
            if( $this->is_eligible_customer() ) {
                ?>
                    <a href="#" class="whols-start-conversation" data-location="conversation"><?php echo esc_html__('Start New Conversation', 'whols') ?></a>
                <?php include PL_PATH . '/includes/request-a-quote/html-conversation-list.php'; ?>
                <?php
            }
        }

        echo '</div> <!-- end whols-conversation-tab-content -->';
    }

	public function create_conversation_after_raq( $posted_data ){
		$create_conversation = whols_get_option('create_conversation_when_request_a_quote');

		if( !$create_conversation ){
			error_log('Can\'t create conversation because, conversation feature is not enabled!');
		}

		$user_info = $this->get_raq_user_info();

		$post_id = wp_insert_post(array(
			'post_title'   => $posted_data['subject'],
			'post_status'  => 'pending',
			'post_type'    => 'whols_conversation',
			'meta_input'   => array(
				'_client_id' => $user_info['id'],
				'_products_data' => $posted_data['products_data'],
				'_conversations' => array(
					'sendar'   => $user_info['id'],
					'sendar_type' => $user_info['sendar_type'],
					'name'     => $user_info['name'],
					'email'    => $user_info['email'],
					'message'  => $posted_data['message'],
					'time'     => time(),
				)
			),
		));

		if( $post_id ){
			// Send email notification
			do_action( 'whols_conversation_created', $posted_data );
		} else {
			error_log('There is something wrong. Can\'t create conversation!');
		}
	}

	public function is_conversation_page( $page = 'any' ){
		$is_conversation_page_endpoint = isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'whols-conversations');
		$post_id = !empty($_GET['post']) ? sanitize_text_field($_GET['post']) : '';

		if( $page == 'single' && $is_conversation_page_endpoint && $post_id ){
			return true;
		} elseif( $page = 'any' && $is_conversation_page_endpoint ) {
			return true;;
		}

		return false;
	}

 	/**
     * Get user info
     *
     * @return array
     */
    public function get_raq_user_info(){
        $user_info = array();
        $current_user = wp_get_current_user();

        // User is guest
        if( !is_user_logged_in() ){
            $user_info = array(
                'id'    => 0,
                'sendar_type' => 'guest',
                'name'  => !empty($_REQUEST['fields']['name']) ? sanitize_text_field($_REQUEST['fields']['name']) : '',
                'email' => !empty($_REQUEST['fields']['email']) ? sanitize_email($_REQUEST['fields']['email']) : ''
            );
        }

        if( is_user_logged_in() ){
            $user_info['id'] = $current_user->ID;
            $user_info['name'] = $current_user->data->display_name;
            $user_info['email'] = $current_user->data->user_email;

            // User is wholesaler
            if( whols_is_wholesaler() ){
                $user_info['sendar_type'] = 'client';
            }
        }

        return $user_info;
    }

    public function conversation_metabox_callback() {
        $this->render_conversation_chatbox( get_the_id() );
    }

    public function render_conversation_chatbox( $conversation_id = '' ) {
        if( ! $conversation_id ) {
            $conversation_id = get_the_id();
        }

		// Update status

		$post_status = get_post_status($conversation_id);

        // Include defaults
        $defaults = include PL_PATH . '/includes/Admin/defaults.php';
        $meta_defaults = $defaults['raq_data_defaults'];

        $conversation_messages = get_post_meta( $conversation_id, '_conversations', false );
        $remember_last_date = '';
        ?>
            <div class="whols-conversations-area whols-conversations">
                <div class="whols-chat-threads">
                    <ul>
						<?php foreach($conversation_messages as $key => $item):
                            $item = wp_parse_args( $item, $meta_defaults );
							$alignnment_class = $this->get_alighment_class( $item );

                            $name = $item['sendar'];
                            if( $item['sendar_type'] == 'guest' ) {
                                $name = 'Guest';
                            } elseif( $item['sendar'] ) {
                                $user = get_user_by( 'ID', $item['sendar'] );
                                $name = $user->display_name;
                            }

                            $timestamp = $item['time'];

                            $only_date = wp_date( get_option('date_format'), $timestamp );
                            $only_time = wp_date( get_option('time_format'), $timestamp );
						?>
                        <li class="<?php echo esc_attr($alignnment_class) ?>">
                            <?php if( $remember_last_date != $only_date ) {
                                echo '<div class="whols-date-separator">'. $only_date .'</div>';
                            } ?>
                            <div class="whols-message-data" title="<?php echo esc_attr($only_date) ?>">
								<span class="message-data-name"><?php echo esc_html($name) ?></span> |
                                <span class="message-data-time"><?php echo esc_html($only_time) ?></span>
                            </div>
                            <div class="whols-message">
                                <?php echo wp_kses_post($item['message']) ?>
                            </div>

                            <?php
                            if( $key == 0 ) {
                                $products_data = get_post_meta( $conversation_id, '_products_data', true );
                                if( $products_data && $conversation_id > 0 ){
                                    $products_data = json_decode( $products_data, true );
                                    include PL_PATH . '/includes/request-a-quote/html-product-data.php';
                                }
                            }
                            ?>
                        </li>
						<?php
                        $remember_last_date = $only_date;
                        endforeach; ?>
                    </ul>

                </div> <!-- end whols-chat-threads -->

                <div class="whols-message-box clearfix">
                    <textarea name="message" placeholder ="Your message" rows="3"></textarea>
                    <button><?php echo esc_html__('Send', 'whols') ?></button>
                </div>
            </div>

        <style>


        </style>
        <?php
    }

    public function get_alighment_class( $item ) {
		if( $this->is_conversation_page() ){
			$alignnment_class = 'whols-other-message';

			if($item['sendar_type'] == 'client' || $item['sendar_type'] == 'guest'){
				$alignnment_class = 'whols-my-message';
			}
		} else {
			$alignnment_class = 'whols-my-message';

			if($item['sendar_type'] == 'client' || $item['sendar_type'] == 'guest'){
				$alignnment_class = 'whols-other-message';
			}
		}

        return $alignnment_class;
    }

    public function get_complete_post_meta( $post_id, $meta_key ) {
        global $wpdb;

        $complete_meta = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $wpdb->postmeta WHERE post_id = %d AND meta_key = %s", $post_id, $meta_key ), ARRAY_A );

        if(  $complete_meta != '' ) {
            return $complete_meta;
        }

        return false;
    }

    public function is_eligible_customer(){
        global $current_user;

        // Handle the case when the user is not logged in
        if( ! is_user_logged_in() ){
            return false;
        }

        if( whols_is_wholesaler() || in_array( 'customer', $current_user->roles ) ){
            return true;
        }

        return false;
    }
}
