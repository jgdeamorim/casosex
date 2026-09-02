/**
 * Whols Admin JS
 *
 * @since 1.0.0
 */
;( function ( $ ) {
    'use strict';

    if ( typeof whols_params === 'undefined' ) {
		return false;
	}

    $( document ).ready( function () {
        var roles_json = JSON.parse(whols_params.roles),
            $roles = '';
        $roles +=  `<option value="any_role">Any Role</option>`;
        for (let i in roles_json) {
            $roles +=  `<option value="${i}">${roles_json[i]}</option>`;
        }


    	$('body').on('click', '.whols_button_clone', function() {
    		var id = $(this).data('id');
    	    if( id != undefined ){
    	    	$(this).parent().find('.whols_product_meta_type_2_pricing_wrapper').append('<span class="wrap whols_product_meta_wrap"><span class="whols_field_wrap"><span class="whols_lbl">Role</span><select name="whols_price_type_2_role_'+ id +'[]">'+ $roles +'</select></span><span class="whols_field_wrap"><span class="whols_lbl">Price</span><input name="whols_price_type_2_price_'+ id +'[]" class="wc_input_price" type="text" step="any" min="0" value=""></span><span class="whols_field_wrap"><span class="whols_lbl">Min. Quantity</span><input name="whols_price_type_2_min_quantity_'+ id +'[]" class="" type="number" step="any" min="0" value=""></span><i class="dashicons-before dashicons-no"></i></span>');

    	    	return false; //prevent form submission
    		} else {
    	    	$(this).parent().find('.whols_product_meta_type_2_pricing_wrapper').append('<span class="wrap whols_product_meta_wrap"><span class="whols_field_wrap"><span class="whols_lbl">Role</span><select name="whols_price_type_2_role[]">'+ $roles +'</select></span><span class="whols_field_wrap"><span class="whols_lbl">Price</span><input name="whols_price_type_2_price[]" class="wc_input_price" type="text" step="any" min="0" value=""></span><span class="whols_field_wrap"><span class="whols_lbl">Min. Quantity</span><input name="whols_price_type_2_min_quantity[]" class="" type="number" step="any" min="0" value=""></span><i class="dashicons-before dashicons-no"></i></span>');
    	    }
    	});

        // active settigns page
        // if (typeof whols_is_settings_page != "undefined" && whols_is_settings_page === 1){
        //     $('li.toplevel_page_whols-admin .wp-first-item').addClass('current');
        // }

        // Help image
        $('.csf-title .dashicons-before').on('mouseover', function(){
            $(this).parent().find('.whols_help_image').show();
        }).on('mouseout',function(){
            $(this).parent().find('.whols_help_image').hide();
        });

        // Review fields
        $('body').on('click', '.whols_product_meta_wrap i', function(){
			var $input_price = $(this).closest('.variable_pricing').find('.wc_input_price');
				$input_price = $input_price.length > 1 ? $input_price.eq(0) : $input_price;

			$($input_price).trigger('change'); // trigger change event to enable the save button

			$(this).parent().remove();
        });

        //
        // Field Manager
        //
        $('.csf-cloneable-wrapper .csf-cloneable-value').each(function(){
            var $this = $(this),
                $parent = $this.closest('.csf-cloneable-item');

            var default_fields = ['reg_name', 'reg_username', 'reg_email', 'reg_password'];
            if( $.inArray( $this.text(), default_fields ) > -1 ){

                // Remove handlers
                $(this).closest('.csf-cloneable-item').find('.csf-cloneable-helper').remove();

                // Disable fields
                $parent.find('.csf-field-select').hide();
                $parent.find('.csf-field-checkbox').hide();
            } else {
                $parent.find('optgroup[label="Default"]').remove();
            }
        });

        // Disable default field options
        $('.csf-cloneable-hidden optgroup[label="Default"]').each(function(){
            var $this = $(this);
                $this.remove();
        });

        // Add "New!" ribbon
        var $selector = $('.whols_global_options [data-tab-id="product-settings/wholesaler-only-categories"], .whols_global_options [data-tab-id="message-email-notifications/custom-thank-you-message"],[data-tab-id="wallet"]');
            $selector.append(' <h1 class="whols-ribbon">New!</h1>');

        // For manual order
        // Add the selected wholesaler role into $_REQUEST to recalculate the order item price
        $(document).on('order-totals-recalculate-before', function(event,eventObj){
			eventObj.manual_whols_role = $('#whols_manual_role').val();
		});

    });

} )( jQuery );