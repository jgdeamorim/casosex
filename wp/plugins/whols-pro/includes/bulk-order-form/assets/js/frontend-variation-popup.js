/**
 * Whols Variation Popup Handler
 * 
 * Handles all functionality related to the variation popup in the Whols Bulk Order Form including:
 * - Variation form initialization
 * - Variation selection
 * - Image updates
 * - Add to cart functionality
 */
;(function($) {
    'use strict';
    
    // Check if the required parameters exist
    if (typeof wc_add_to_cart_variation_params === 'undefined' || typeof wc_add_to_cart_params === 'undefined') {
        return false;
    }
    
    /**
     * Centralized selectors grouped by functional area
     */
    const SELECTORS = {
        popup: {
            container: '#whols-popup-bof_variation-content',
            form: '#whols-popup-bof_variation-content .variations_form',
            productImage: '.whols-bof__variation-popup__product-thumbnail',
            successMessage: '.whols-popup-success',
            errorMessage: '.whols-popup-error'
        },
        form: {
            variations: '.variations select',
            variationId: 'input[name="variation_id"]',
            addToCartButton: '.single_add_to_cart_button'
        }
    };
    
    /**
     * Main Variation Popup controller
     */
    const WholsVariationPopup = {
        /**
         * Initialize the module
         */
        init: function() {
            this.bindEvents();
        },
        
        /**
         * Bind all event listeners
         */
        bindEvents: function() {
            // Document-level event delegation for dynamic elements
            $(document)
                // Popup events
                .on('whols/popup/content_loaded', Events.handlePopupContentLoaded)
                .on('found_variation', SELECTORS.popup.form, Events.handleFoundVariation)
                .on('reset_image', SELECTORS.popup.form, Events.handleResetImage)
                .on('submit', SELECTORS.popup.form, Events.handleFormSubmit);
                
            // Trigger custom events for extensibility
            $(document).trigger('whols/variation_popup/initialized');
        }
    };
    
    /**
     * Event Handlers
     * Handles all event bindings and callbacks
     */
    const Events = {
        /**
         * Handle popup content loaded event
         * 
         * @param {Event} event - The event object
         * @param {string} popupName - The name of the popup
         * @param {Object} data - The popup data
         */
        handlePopupContentLoaded: function(event, popupName, data) {
            if (popupName !== 'bof_variation') {
                return;
            }
            
            Content.initializeVariationForm();
        },
        
        /**
         * Handle found variation event
         * 
         * @param {Event} event - The event object
         * @param {Object} variation - The variation data
         */
        handleFoundVariation: function(event, variation) {
            if (!$(this).closest(SELECTORS.popup.container).length) {
                return;
            }
            
            if (variation.image && variation.image.src) {
                Content.updateVariationImage(variation.image.src);
            }
        },
        
        /**
         * Handle reset image event
         * 
         * @param {Event} event - The event object
         */
        handleResetImage: function(event) {
            if (!$(this).closest(SELECTORS.popup.container).length) {
                return;
            }
            
            const originalImage = $(this).data('original-image');
            if (originalImage) {
                Content.updateVariationImage(originalImage);
            }
        },
        
        /**
         * Handle form submission
         * 
         * @param {Event} e - The event object
         */
        handleFormSubmit: function(e) {
            e.preventDefault();
            
            const $form = $(this);
            const $button = $form.find(SELECTORS.form.addToCartButton);
            
            if ($button.is('.disabled')) {
                return false;
            }
            
            // Check if all variations are selected
            if ($form.find(SELECTORS.form.variations).length && !$form.find(SELECTORS.form.variationId).val()) {
                Utils.showError('Please select all product options before adding to cart.');
                return false;
            }
            
            Cart.addToCart($form, $button);
        }
    };
    
    /**
     * Content Management
     * Handles content manipulation and display
     */
    const Content = {
        /**
         * Initialize the variation form
         */
        initializeVariationForm: function() {
            const $form = $(SELECTORS.popup.form);
            
            if (!$form.length) {
                return;
            }
            
            // Store original image for reset
            const originalImage = $(SELECTORS.popup.productImage).attr('src');
            $form.data('original-image', originalImage);
            
            // Initialize WooCommerce variation form
            $form.wc_variation_form();
            
            // Modify form action to add to cart via AJAX
            $form.attr('action', '');
            $form.addClass('cart-popup-form');
        },
        
        /**
         * Update variation image
         * 
         * @param {string} imageUrl - The URL of the image to display
         */
        updateVariationImage: function(imageUrl) {
            // Simply update the image source directly without animations
            // This eliminates all fade issues when changing variations
            $(SELECTORS.popup.productImage).attr('src', imageUrl);
        },
        
        /**
         * Show success message and close popup
         */
        showSuccess: function() {
            $(SELECTORS.popup.container).html(
                '<div class="whols-popup-success">' + 
                '<p>Product added to cart successfully!</p>' + 
                '<a href="' + wc_add_to_cart_params.cart_url + '" class="button">View Cart</a>' + 
                '</div>'
            );
            
            // Close popup after 2 seconds
            setTimeout(function() {
                if (typeof WholsPopup !== 'undefined' && typeof WholsPopup.closePopup === 'function') {
                    WholsPopup.closePopup();
                }
            }, 2000);
        }
    };
    
    /**
     * Cart Functionality
     * Handles adding products to cart
     */
    const Cart = {
        /**
         * Add to cart via AJAX
         * 
         * @param {jQuery} $form - The form element
         * @param {jQuery} $button - The add to cart button
         */
        addToCart: function($form, $button) {
            // Show loading state
            $button.addClass('loading');
            
            const formData = $form.serialize() + '&action=woocommerce_add_to_cart';
            
            // Add to cart via AJAX
            $.ajax({
                url: wc_add_to_cart_params.wc_ajax_url.toString().replace('%%endpoint%%', 'add_to_cart'),
                type: 'POST',
                data: formData,
                success: function(response) {
                    $button.removeClass('loading');
                    
                    if (response.error && response.product_url) {
                        window.location = response.product_url;
                        return;
                    }
                    
                    // Success
                    if (response.fragments) {
                        // Update cart fragments
                        $.each(response.fragments, function(key, value) {
                            $(key).replaceWith(value);
                        });
                        
                        // Show success message
                        Content.showSuccess();
                        
                        // Trigger event so themes can refresh other areas
                        $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, $button]);
                    }
                },
                error: function() {
                    $button.removeClass('loading');
                    Utils.showError('Error adding to cart. Please try again.');
                }
            });
        }
    };
    
    /**
     * Utility functions
     */
    const Utils = {
        /**
         * Show error message
         * 
         * @param {string} message - The error message to display
         */
        showError: function(message) {
            // Remove any existing error messages
            $(SELECTORS.popup.errorMessage).remove();
            
            // Add new error message
            $(SELECTORS.popup.container).append('<div class="whols-popup-error">' + message + '</div>');
        }
    };
    
    // Initialize the module when document is ready
    $(document).ready(function() {
        WholsVariationPopup.init();
    });
    
})(jQuery);