/*
 * JS for both frontend and backend.
 */

;( function ( $ ) {
    'use strict';

    if ( typeof whols_params === 'undefined' ) {
		return false;
	}

    const wholsPro = {
        selectors: {    
            sendButton: '.whols-message-box button',
            modalForm: '.whols-raq-form',
            loadingIcon: '<i class="dashicons dashicons-update"></i>',
            modalFormSubmit: '.whols-raq-modal button[type="submit"]',
            modalFormMessage: '.whols-raq-modal .whols-raq-form-message',
        },
        conversationID: '',
        sendarType: '',

        init: function() {
            $( document ).on( 'click', '.whols-request-a-quote,.whols-start-conversation', this.openModalAjax );
            $( document ).on( 'submit', wholsPro.selectors.modalForm, this.submitRequestQuoteForm );
            $( document ).on( 'click', wholsPro.selectors.sendButton, this.sendMessage );

            $( document ).on( 'click', '.whols-raq-modal-dismiss', wholsPro.dismissModal );
        },

        submitRequestQuoteForm: function( e ) {
			e.preventDefault();
		
			const $form = $( this );

            const $button = $( wholsPro.selectors.modalFormSubmit );
            const postedData = wholsPro.getFormDataAfterSubmit( $form );
            
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url:  whols_params.ajax_url,
                data: {
                    action: "whols_request_raq_form_submit",
                    nonce: whols_params.nonce,
                    fields: postedData,
                    location: $(wholsPro.selectors.modalFormSubmit).data('location'),
                },
                beforeSend: function(){
                    wholsPro.showLoadingButton( $button );
                },
                success: function( response ){
                    if( response.success ){
                        wholsPro.displayMessage( response.data.message, 'success' );
                        $( wholsPro.selectors.modalForm ).trigger( 'reset' );
                    } else {
                        wholsPro.displayMessage(response.data.message, 'error');
                    }
                },
                complete:function( response ){
                    wholsPro.hideLoadingButton( $button );
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var errorMessage = "An error occurred during the AJAX request.";

                    if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                        errorMessage = jqXHR.responseJSON.message;
                    } else if (textStatus === "timeout") {
                        errorMessage = "The request timed out. Please try again.";
                    } else if (textStatus === "abort") {
                        errorMessage = "The request was aborted. Please try again.";
                    }

                    wholsPro.displayMessage(errorMessage, 'error');
					console.log( 'error', errorThrown );
                },
            });
		},

        getFormDataAfterSubmit: function( $form ){
            const postedData = {};
			const formData = new FormData($form[0]);
			[...formData.entries()].forEach(([key, value]) => {
				postedData[key] = value;
			});

            return postedData;
        },

		openModalAjax: function( e ) {
			e.preventDefault();

            const location = $(e.target).data('location');
            const target = $(e.target);
            
			$.ajax({
				url: whols_params.ajax_url,
				type: 'POST',
				data: {
					action: 'whols_open_raq_modal',
					nonce: whols_params.nonce,
                    fields: {
                        location: location
                    }
				},
				beforeSend: function() {
					wholsPro.showLoadingButton( target );
				},
				success: function( response ) {
					if( response.success && response.data.modal_content ){
						$('body').append( $(response.data.modal_content) );
					} else {
						console.log( 'error', response );
					}
				},
				complete: function() {
					wholsPro.hideLoadingButton( target );
				},
				error: function( response ) {
					console.log( 'error', response );
				}
			});

			$('body').addClass('whols-raq-modal-open');
		},

        sendMessage: function( e ) {
            e.preventDefault();

            wholsPro.conversationID = $('input#post_ID').val();

            if( !wholsPro.conversationID ){
                let currentPageURL = new URL(window.location.href);
                wholsPro.conversationID = currentPageURL.searchParams.get('post');
            }

            if( !wholsPro.conversationID ){
                alert( 'Conversation ID not found.' );
                return false;
            }

            const message = $('.whols-message-box textarea').val();

            if( message === '' ){
                alert( 'Please enter a message.' );
                return false;
            }

			$.ajax({
				url: whols_params.ajax_url,
				type: 'POST',
				data: {
					action: 'whols_raq_send_message',
					nonce: whols_params.nonce,
                    post_id: wholsPro.conversationID,
                    sendar_type: whols_params.sendarType,
                    message: message,
				},
				beforeSend: function() {
                    $(wholsPro.sendButton).append(wholsPro.selectors.loadingIcon);
				},
				success: function( response ) {
                    $(wholsPro.sendButton).find('.dashicons-update').remove();
                    window.location.reload();
				},
				error: function( response ) {
					console.log( 'error', response );
				}
			});
        },

        showLoadingButton: function( $button ){
            $button.append( wholsPro.selectors.loadingIcon );
        },

        hideLoadingButton: function( $button ){
            $button.find('.dashicons-update').remove();
        },

        displayMessage: function( message, type ){
            let noticeClass = 'woocommerce-message';
            if( type == 'error' ){
                noticeClass = 'woocommerce-error'
            }

            $( wholsPro.selectors.modalFormMessage ).html('<div class="woocommerce"><div class="woocommerce-notices-wrapper"><div class=" '+ noticeClass +' " role="alert">'+ message +'</div></div></div>');
        },

        dismissModal: function( e ) {
			e.preventDefault();

			$('.whols-raq-modal').remove();
		},

    }

    $(document).ready(function(){
        wholsPro.init();
    });
} )( jQuery );