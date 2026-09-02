/**
 * Registration JS
 */
;( function ( $ ) {
    'use strict';

    if ( typeof whols_params === 'undefined' ) {
		return false;
	}

	const wholsRegistration = {
		init: function() {
            // Submit registration form
			$( '.whols_registration_form form' ).on('submit', this.submitForm); // What if shortcode placed on gutenberg editor.

            this.disableRecaptchaBadge();
		},

        submitForm: function(e){
            e.preventDefault();
            e.stopPropagation();

            var myformData = new FormData(this);

            myformData.append('action', 'whols_ajax_user_register');
            myformData.append('nonce', whols_params.nonce);
            myformData.append('recaptcha_token', '');

            // Recaptcha is active
            if( typeof grecaptcha !== "undefined" ){
                grecaptcha.ready(function() {
                    // If site key is not valid throws an error, so handle the error
                    try {
                        grecaptcha.execute(whols_params.recaptcha_site_key, {action: 'submit'}).then(function(token) {
                            myformData.set('recaptcha_token', token);
                            wholsRegistration.runAjaxRequest(myformData);
                        });
                    } catch (error) {
                        wholsRegistration.displayMessage( error.message, 'error' );
                    }
                });

            // Recaptcha is not active
            } else {
                wholsRegistration.runAjaxRequest(myformData);
            }
        },

        displayMessage: function( message, type ){
            let noticeClass = 'woocommerce-message';
            if( type == 'error' ){
                noticeClass = 'woocommerce-error'
            }

            $('#whols_user_reg_message').html('<div class="woocommerce"><div class="woocommerce-notices-wrapper"><div class="whols_invalid_msg '+ noticeClass +' " role="alert">'+ message +'</div></div></div>').fadeIn();
            $.scroll_to_notices( $( '[role="alert"]' ) );
        },

        runAjaxRequest: function( myformData ){
            $.ajax({
                type: 'POST',
                url:  woocommerce_params.ajax_url,
                data: myformData,
                cache: false,
                processData: false,
                contentType: false,
                enctype: 'multipart/form-data',
                beforeSend: function(){
                    $('.whols_registration_form #whols_reg_submit').addClass('whols_loading');
                },
                success: function( response ){
                    console.log(response);
                    
                    if( response.success && response.data.registerauth == true ){
                        var redirect_url = response.data.redirect_url;
                        
                        wholsRegistration.displayMessage( response.data.message );

                        if( redirect_url ){
                            document.location.href = redirect_url;
                        }
                    } else {
                        wholsRegistration.displayMessage(response.data.message, 'error');
                    }
                },
                complete:function( response ){
                    $('.whols_registration_form #whols_reg_submit').removeClass('whols_loading');
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

                    wholsRegistration.displayMessage(errorMessage, 'error');
                },
            });
        },

        disableRecaptchaBadge: function(){
            // Recaptcha is active
            if( typeof grecaptcha !== "undefined" ){
                grecaptcha.ready(function() {
                    let status = Boolean(Number(whols_params.recaptcha_badge_disable));

                    if(status){
                        $('.grecaptcha-badge').hide();
                    }
                });
            }
        }
	};


    $( document ).ready( function () {
		wholsRegistration.init();
    });

} )( jQuery );
