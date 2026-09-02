/**
 * Frontend JS
 */
;( function ( $ ) {
    'use strict';

    if ( typeof whols_params === 'undefined' ) {
		return false;
	}

	const wholsForntend = {
		selectors: {
			loadingIcon: '<i class="dashicons dashicons-update"></i>',
			formWalletRecharge: 'form.whols-wallet-recharge-form',
		 	buttonSendOTP: '.whols-wallet-otp a.whols-send-otp',
		 	buttonReSendOTP: '.whols-wallet-otp a.whols-resend-otp',
			ajaxNotificationDiv: '<div class="whols-ajax-notification"></div>',
		},
		init: function() {
			// Auto apply minimum quantity support for variable products.
			if( whols_params.auto_apply_minimum_quantity ){
				$( '.variations_form' ).on( 'found_variation', this.setDefaultInputValue );
				$( '.variations_form' ).on( 'reset_data', this.resetDefaultInputValue );
			}

			// Wallet features
			$(this.selectors.formWalletRecharge).on('submit', this.handleWalletProductAddToCart);
			$('body').on('click', '.whols-wallet-otp a.whols-send-otp, .whols-wallet-otp a.whols-resend-otp', this.handleSendOtp);
		},

		setDefaultInputValue: function( event, variation ) {
			// If the variation has truthy value for whols_quantity_input_value set the quantity as default value.
			if( variation.whols_quantity_input_value ){
				$( '.woocommerce-variation-add-to-cart .input-text.qty' ).val( variation.whols_quantity_input_value );
			} else {
				$( '.woocommerce-variation-add-to-cart .input-text.qty' ).val( variation.min_qty );
			}
		},

		showLoadingButton: function( $button ){
            $button.append( wholsForntend.selectors.loadingIcon );
        },

        hideLoadingButton: function( $button ){
            $button.find('.dashicons-update').remove();
        },

		resetDefaultInputValue: function( e ) {
			$( '.woocommerce-variation-add-to-cart .input-text.qty' ).val( 1 );
		},

		handleWalletProductAddToCart( e ) {
			e.preventDefault();
			const formData = new FormData(this);

			// Append custom data to the server
			formData.append('action', 'whols_wallet_add_to_cart');
			formData.append('nonce', whols_params.nonce);
	
			if( Number(formData.get('recharge_amount')) <= 0 ){
				alert('Please enter a valid amount.');
				return;
			}
			
			$.ajax({
				url: whols_params.ajax_url,
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				beforeSend:function(){
				},
		
				success:function(response) {
					if( response.success ){
						$('.woocommerce-notices-wrapper').html(response.data.message);
					}
				},
		
				complete:function( response ){
				},
		
				error: function(errorThrown){
					console.log(errorThrown);
				}
			});
		},

		handleSendOtp( e ) {
			e.preventDefault();

			const $notification = $(wholsForntend.selectors.ajaxNotificationDiv);
			$("body").append($notification);

			const _this = this;

			$.ajax({
				url: whols_params.ajax_url,
				type: 'POST',
				data: {
					'action': 'whols_send_otp',
					'nonce' : whols_params.nonce
				},
		
				beforeSend:function(){
					wholsForntend.showLoadingButton( $(_this) );
				},
		
				success:function(response) { 
					$notification.html(response.data).addClass('open');

					wholsForntend.handleCloseNotification();

					// Remove the button after sending OTP
					if($(_this).is(wholsForntend.selectors.buttonSendOTP)){
						$(_this).remove();
					}
				},
		
				complete:function( response ){
					wholsForntend.hideLoadingButton( $(_this) );
				},
		
				error: function(errorThrown){
					console.log(errorThrown);
				}
			});
		},

		handleCloseNotification( e ) {
			if($('.whols-ajax-notification').length){
				$('body').on('click', function(){
					$('.whols-ajax-notification').removeClass('open');
				});
			}
		}
	};

    $( document ).ready( function () {
		wholsForntend.init();
    });

} )( jQuery );
