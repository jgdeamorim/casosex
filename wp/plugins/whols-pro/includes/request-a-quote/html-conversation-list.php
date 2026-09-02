<table>
    <tr>
		<td><?php esc_html_e('Subject', 'whols'); ?></td>

        <?php if(current_user_can('manage_options')): ?>
            <td><?php esc_html_e('Client', 'whols'); ?></td>
            <td><?php esc_html_e('Email', 'whols'); ?></td>
        <?php endif; ?>

        <td><?php esc_html_e('Date', 'whols'); ?></td>
        <td><?php esc_html_e('Action', 'whols'); ?></td>
    </tr>
    <?php
    // Get all conversations whols_conversation post type.
    $args = array(
        'post_type' => 'whols_conversation',
        'posts_per_page' => -1,
        'post_status' => array('publish', 'pending', 'whols-awaiting-reply'),
        'fields' => 'ids',
    );

    if( whols_is_wholesaler() ){
        $args['meta_query'] = array(
            array(
                'key' => '_client_id',
                'value' => get_current_user_id(),
                'compare' => '=',
            ),
        );
    }

    $conversations = get_posts( $args );

    if ($conversations) {
        foreach ($conversations as $conversation_id) {
            global $wp;
            $current_page_url = home_url( $wp->request );

            $meta_data_arr = get_post_meta($conversation_id, '_conversations', false);

            // Get the array element which has sendar_type = 'client'
            $client_message = array_filter($meta_data_arr, function ($meta_data) {
                if( isset($meta_data['sendar_type']) && $meta_data['sendar_type'] == 'client' ){
                    return $meta_data;
                }
            });

            $client_message = current($client_message);
            
            $defaults = array(
                'name' => '',
                'email' => '',
                'time' => '',
            );

            $conversation_data = wp_parse_args($client_message, $defaults);
            $current_page_url = add_query_arg( 'post', $conversation_id, $current_page_url );

            if( current_user_can('manage_options') ){
                printf(
                    '<tr class="%s">
                        <td>%s</td>
                        <td>%s</td>
                        <td>%s</td>
                        <td>%s</td>
                        <td>
                            <a href="%s" class="button">View</a>
                        </td>
                    </tr>',
					esc_attr(get_post_status($conversation_id)),
					esc_html(get_the_title($conversation_id)),
                    esc_html($conversation_data['name']),
                    esc_html($conversation_data['email']),
                    esc_html(wp_date(get_option('date_format'), $conversation_data['time'])),
                    esc_url($current_page_url)
                );
            } elseif( whols_is_wholesaler() ){
                printf(
                    '<tr class="%s">
                        <td><a href="%s">%s</a></td>
                        <td>%s</td>
                        <td>
                            <a href="%s" class="button">View</a>
                        </td>
                    </tr>',
					esc_attr(get_post_status($conversation_id)),
					esc_url($current_page_url),
                    esc_html(get_the_title($conversation_id)),
					esc_html(wp_date(get_option('date_format'), $conversation_data['time'])),
                    esc_url($current_page_url)
                );
            }
        }
    } else {
        printf('<tr><td colspan="6">%s</td></tr>', esc_html__('No Conversations found!', 'whols'));
    }
    ?>
</table>
