/**
 * Bulk Order Form JavaScript
 * 
 * Handles all frontend functionality of the Whols Bulk Order Form including:
 * - Product search and selection
 * - Adding/removing product rows
 * - Quantity adjustments 
 * - Price calculations
 * - Cart manipulation
 */
;(function($) {
    'use strict';

    // Check if the required parameters exist
    if (typeof wholsBulkOrder === 'undefined') {
        return false;
    }

    /**
     * Centralized selectors grouped by functional area
     */
    const SELECTORS = {
        form: {
            container: '.whols-bulk-order-form',
            title: '.whols-bulk-order-form__title',
            body: '.whols-bulk-order-form__body',
            footer: '.whols-bulk-order-form__footer',
            emptyMessage: '.whols-bulk-order-form__empty-message'
        },
        topFilters: {
            container: '.whols-bulk-order-form__top-filters',
            categorySelect: '.whols-bulk-order-form__top-category-select',
            productInput: '.whols-bulk-order-form__top-product-input',
            quantityInput: '.whols-bulk-order-form__top-quantity',
            searchResults: '.whols-bulk-order-form__top-filters .whols-bulk-order-form__search-results',
            categoryLock: '.whols-bulk-order-form__category-lock',
            selectedProduct: '.whols-bulk-order-form__top-selected-product',
            removeSelectedProduct: '.whols-bulk-order-form__remove-top-product'
        },
        row: {
            container: '.whols-bulk-order-form__row',
            template: '.whols-bulk-order-form__row--template',
            remove: '.whols-bulk-order-form__remove-row',
            productColumn: '.whols-bulk-order-form__column--product',
            productId: '.whols-bulk-order-form__product-id',
            productVariationId: '.whols-bulk-order-form__product-variation-id',
            productName: '.whols-bulk-order-form__product-name',
            productImage: '.whols-bulk-order-form__product-image',
            productInfo: '.whols-bulk-order-form__product-info',
            productRemove: '.whols-bulk-order-form__remove-product',
            productSearch: '.whols-bulk-order-form__product-search',
            productInput: '.whols-bulk-order-form__product-input',
            productPrice: '.whols-bulk-order-form__product-price',
            productPriceInput: '.whols-bulk-order-form__product-price-input',
            productStock: '.whols-bulk-order-form__product-stock',
            quantity: '.whols-bulk-order-form__quantity',
            quantityWrapper: '.whols-bulk-order-form__quantity-wrapper',
            // Update quantity functionality removed
            subtotal: '.whols-bulk-order-form__subtotal',
            selectedProduct: '.whols-bulk-order-form__selected-product',
            searchResults: '.whols-bulk-order-form__search-results',
            searchItem: '.whols-bulk-order-form__search-item',
            wholesaleActive: 'whols-bulk-order-form__row--wholesale-active',
            tierActive: 'whols-bulk-order-form__row--tier-active'
        },
        search: {
            input: '.whols-bulk-order-form__product-input',
            results: '.whols-bulk-order-form__search-results',
            item: '.whols-bulk-order-form__search-item',
            loading: '.whols-bulk-order-form__loading',
            noResults: '.whols-bulk-order-form__no-results',
            error: '.whols-bulk-order-form__error'
        },
        actions: {
            addToCart: '.whols-bulk-order-form__add-to-cart',
            addVariation: '.whols-bof-variation-add',
            // Save list functionality removed
        },
        // Save form selectors removed
        notifications: {
            container: '.whols-bulk-order-form__notifications',
            notification: '.whols-bulk-order-form__notification'
        },
        summary: {
            totalLabel: '.whols-bulk-order-form__total-label',
            totalValue: '.whols-bulk-order-form__total-value'
        }
    };

    /**
     * Main Bulk Order Form controller
     */
    const WholsBulkOrderForm = {
        /**
         * Initialize the module
         */
        init: function() {
            this.bindEvents();
            
            const $form = $(SELECTORS.form.container);
            Cart.updateAddToCartButtonState($form, false);
            
            // Initialize category lock visibility
            this.initCategoryLockVisibility();
        },
        
        /**
         * Initialize category lock visibility based on category select value
         */
        initCategoryLockVisibility: function() {
            const $forms = $(SELECTORS.form.container);
            
            $forms.each(function() {
                const $form = $(this);
                const $categorySelect = $form.find(SELECTORS.topFilters.categorySelect);
                const $categoryLock = $form.find(SELECTORS.topFilters.categoryLock);
                
                // Initially hide the lock if no category is selected
                if (!$categorySelect.val()) {
                    $categoryLock.addClass('whols-bulk-order-form__category-lock--hidden');
                }
            });
        },
        
        /**
         * Bind all event listeners
         */
        bindEvents: function() {
            // Document-level event delegation for dynamic elements
            $(document)
                // Row management
                .on('click', SELECTORS.row.remove, Rows.removeRow)
                .on('click', SELECTORS.row.productRemove, Rows.removeProduct)
                
                // Search functionality
                .on('focus', SELECTORS.topFilters.productInput, Search.handleSearchFocus)
                .on('keyup', SELECTORS.topFilters.productInput, Utils.debounce(Search.searchProductsFrom, 300))
                .on('change', SELECTORS.topFilters.categorySelect, Filters.handleCategoryChange)
                .on('change', SELECTORS.topFilters.quantityInput, Filters.handleQuantityChange)
                .on('click', SELECTORS.topFilters.categoryLock, Filters.toggleCategoryLock)
                .on('click', SELECTORS.topFilters.removeSelectedProduct, Filters.removeSelectedProduct)
                
                // Quantity and pricing
                .on('change input blur', SELECTORS.row.quantity, function() {
                    Pricing.validateQuantity.call(this);
                    Pricing.updateRowSubtotal.call(this);
                })
                .on('keyup', SELECTORS.row.quantity, Utils.debounce(function() {
                    Pricing.validateQuantity.call(this);
                    Pricing.updateRowSubtotal.call(this);
                }, 300))
                // Update quantity functionality removed
                
                // Cart actions
                .on('click', SELECTORS.actions.addToCart, Cart.addToCart)
                
                // Save list functionality removed
            
            // Hide search results when clicking outside
            $(document).on('click', function(e) {
                if (!$(e.target).closest(SELECTORS.row.productSearch).length) {
                    $(SELECTORS.search.results).hide();
                }
            });

            // Trigger custom events for extensibility
            $(SELECTORS.form.container).trigger('whols/bulk_order/form_initialized');
        }
    };

    /**
     * Row Management
     * Handles adding, removing, and manipulating product rows
     */
    const Rows = {
        /**
         * Add a new product row
         * @param {Object} product - The product data to add
         * @param {jQuery} $form - The form container
         */
        addNewRow: function(product, $form) {
            if (!$form) {
                $form = $(SELECTORS.form.container).first();
            }
            
            // Remove empty message if it exists
            $form.find(SELECTORS.form.emptyMessage).remove();
            
            // Create a new row from template
            const $template = $form.find(SELECTORS.row.template).clone();
            $template.removeClass('whols-bulk-order-form__row--template').css('display', '');
            
            // Get default quantity from form data or hidden input
            const defaultQuantity = $form.data('default-quantity') || 
                parseInt($form.find(SELECTORS.topFilters.quantityInput).val(), 10) || 
                $form.data('min-quantity') || 1;
            
            // Ensure quantity is at least 1
            const quantity = Math.max(1, defaultQuantity);
            
            // Set quantity from top filter
            $template.find(SELECTORS.row.quantity)
                .attr('min', $form.data('min-quantity') || 1)
                .attr('step', $form.data('step-quantity') || 1)
                .val(quantity);
            
            // Add to form body
            $form.find(SELECTORS.form.body).append($template);
            
            // If product data is provided, populate the row
            if (product) {
                this.populateRow($template, product, quantity);
            }
            
            // Update total price
            Pricing.updateTotalPrice($form);
            
            // Enable the Add to Cart button
            Cart.updateAddToCartButtonState($form, true);
            
            // Trigger custom event
            $form.trigger('whols/bulk_order/row_added', [$template, product]);
            
            return $template;
        },
        
        /**
         * Populate a row with product data
         * @param {jQuery} $row - The row element
         * @param {Object} product - The product data
         * @param {number} quantity - The quantity
         */
        populateRow: function($row, product, quantity) {
            // Set product data
            const encodedProductJson = encodeURIComponent(JSON.stringify(product));
            $row.attr('data-product', encodedProductJson);
            $row.find(SELECTORS.row.productId).val(product.id);
            $row.find(SELECTORS.row.productVariationId).val(product.variation_id);
            
            // Update product info
            $row.find(SELECTORS.row.productName).text(product.name).attr('href', product.url);
            if (product.image) {
                $row.find(SELECTORS.row.productImage).html(`<img src="${product.image}" alt="${product.name}">`);
            }

            // Update stock info
            const stockQuantity = product.stock;
            const stockStatus = product.stock_status;
            const manageStock = product.manage_stock;
            let stockDisplay = '';

            if (manageStock && stockQuantity !== null && stockQuantity !== undefined) {
                // Stock is managed - show the actual quantity
                if (parseInt(stockQuantity) === 0) {
                    stockDisplay = '<span class="whols-bulk-order-form__stock--out-of-stock">' + (wholsBulkOrder.config.outOfStockText || 'Out of stock') + '</span>';
                } else {
                    stockDisplay = stockQuantity;
                }
            } else {
                // Stock not managed - show status text
                if (stockStatus === 'outofstock') {
                    stockDisplay = '<span class="whols-bulk-order-form__stock--out-of-stock">' + (wholsBulkOrder.config.outOfStockText || 'Out of stock') + '</span>';
                } else if (stockStatus === 'onbackorder') {
                    stockDisplay = wholsBulkOrder.config.onBackorderText || 'On backorder';
                } else {
                    stockDisplay = wholsBulkOrder.config.inStockText || 'In stock';
                }
            }
            $row.find(SELECTORS.row.productStock).html(stockDisplay);

            // Determine which price to use
            const priceData = Pricing.determinePriceToUse(product, quantity, $row);
            
            // Update price display
            $row.find(SELECTORS.row.productPrice).html(priceData.priceHtml);
            $row.find(SELECTORS.row.productPriceInput).val(priceData.price);
            
            // Calculate subtotal
            const subtotal = (quantity * priceData.price).toFixed(2);
            $row.find(SELECTORS.row.subtotal).text(subtotal);
        },
        
        /**
         * Remove a product from a row (reset to empty state)
         */
        removeProduct: function() {
            const $row = $(this).closest(SELECTORS.row.container);
            Rows.clearRow($row);
            
            // Update totals
            const $form = $row.closest(SELECTORS.form.container);
            Pricing.updateTotalPrice($form);
            
            // Trigger custom event
            $form.trigger('whols/bulk_order/product_removed', [$row]);
        },
        
        /**
         * Remove an entire row
         */
        removeRow: function() {
            const $row = $(this).closest(SELECTORS.row.container);
            const $form = $row.closest(SELECTORS.form.container);
            const $body = $form.find(SELECTORS.form.body);
            
            // Trigger custom event before removing
            $form.trigger('whols/bulk_order/row_removing', [$row]);
            
            // Remove the row
            $row.remove();
            
            // Check if there are any product rows left (excluding the template)
            const visibleRows = $body.find(SELECTORS.row.container).not(SELECTORS.row.template).length;
            
            // If no rows left, show the empty message
            if (visibleRows === 0) {
                if ($body.find(SELECTORS.form.emptyMessage).length === 0) {
                    $body.append('<div class="whols-bulk-order-form__empty-message">' + wholsBulkOrder.config.emptyTableText + '</div>');
                }
                
                // Disable the Add to Cart button
                Cart.updateAddToCartButtonState($form, false);
            } else {
                // Enable the Add to Cart button
                Cart.updateAddToCartButtonState($form, true);
            }
            
            // Update totals
            Pricing.updateTotalPrice($form);
            
            // Trigger custom event after removing
            $form.trigger('whols/bulk_order/row_removed');
        },
        
        /**
         * Clear a product row (reset it to empty state)
         * @param {jQuery} $row - The row to clear
         */
        clearRow: function($row) {
            const $form = $row.closest(SELECTORS.form.container);
            const minQuantity = $form.data('min-quantity') || 1;
            
            $row.find(SELECTORS.row.productSearch).show();
            $row.find(SELECTORS.row.productInput).val('');
            $row.find(SELECTORS.row.productId).val('');
            $row.find(SELECTORS.row.productVariationId).val('');
            $row.find(SELECTORS.row.productPriceInput).val('0');
            $row.find(SELECTORS.row.selectedProduct).hide();
            $row.find(SELECTORS.row.productName).text('');
            $row.find(SELECTORS.row.quantity).val(minQuantity);
            $row.find(SELECTORS.row.subtotal).text('0.00');
            $row.find(SELECTORS.row.searchResults).hide().empty();
            
            // Remove any class modifiers
            $row.removeClass(SELECTORS.row.wholesaleActive);
            $row.removeClass(SELECTORS.row.tierActive);
            
            // Trigger custom event
            $form.trigger('whols/bulk_order/row_cleared', [$row]);
        },
    };

    /**
     * Search Functionality
     * Handles product search and selection
     */
    const Search = {                        
        /**
         * Select a product from search results
         */
        selectProduct: function() {
            const $item = $(this);
            const $row = $item.closest(SELECTORS.row.container);
            const $form = $row.closest(SELECTORS.form.container);
            
            // Get and parse the product data from JSON
            const encodedProductJson = $item.data('product');
            const product = JSON.parse(decodeURIComponent(encodedProductJson));
            
            // Hide search results
            $row.find(SELECTORS.search.results).hide();
            
            // Set values
            $row.find(SELECTORS.row.productId).val(product.id);
            $row.find(SELECTORS.row.productPrice).val(product.price);
            $row.find(SELECTORS.row.productName).text(product.name);
            
            // Hide search and show selected product
            $row.find(SELECTORS.row.productSearch).hide();
            $row.find(SELECTORS.row.selectedProduct).show();
            
            // Populate the row with product info
            const quantity = parseInt($row.find(SELECTORS.row.quantity).val(), 10) || 1;
            Rows.populateRow($row, product, quantity);
            
            // Update subtotal and total
            Pricing.updateRowSubtotal.call($row.find(SELECTORS.row.quantity));
            Pricing.updateTotalPrice($form);
            
            // Trigger custom event
            $form.trigger('whols/bulk_order/product_selected', [$row, product]);
        },
        
        /**
         * Handle focus on the top search input
         */
        handleSearchFocus: function() {
            const $input = $(this);
            const $searchResults = $input.siblings(SELECTORS.search.results);
            
            // If there's already content in the input, trigger search
            if ($input.val().length > 2) {
                Search.searchProductsFrom.call($input);
            }
        },
        
        /**
         * Search products from the top search input
         */
        searchProductsFrom: function() {
            const $input = $(this);
            const $form = $input.closest(SELECTORS.form.container);
            const $searchResults = $input.siblings(SELECTORS.search.results);
            const searchTerm = $input.val();
            const categoryId = $form.find(SELECTORS.topFilters.categorySelect).val();
            
            // Don't search if term is too short
            if (searchTerm.length < 3) {
                $searchResults.hide();
                return;
            }
            
            // Show loading indicator with configured text
            $searchResults.html('<div class="whols-bulk-order-form__search-loading">' + wholsBulkOrder.config.searchingText + '</div>').show();
            
            // Trigger custom event before search
            $form.trigger('whols/bulk_order/search_started', [searchTerm, categoryId]);
            
            // Make AJAX request to search products
            $.ajax({
                url: wholsBulkOrder.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'whols_search_products',
                    search: searchTerm,
                    category: categoryId,
                    security: wholsBulkOrder.nonce
                },
                success: function(response) {
                    if (response.success && response.data) {
                        Search.renderSearchResults($searchResults, response.data, $form);
                        $form.trigger('whols/bulk_order/search_completed', [response.data]);
                    } else {
                        $searchResults.html('<div class="whols-bulk-order-form__search-no-results">' + wholsBulkOrder.config.productNotFoundText + '</div>');
                        $form.trigger('whols/bulk_order/search_no_results');
                    }
                },
                error: function(xhr, status, error) {
                    $searchResults.html('<div class="whols-bulk-order-form__search-error">Error searching products</div>');
                    $form.trigger('whols/bulk_order/search_error', [xhr, status, error]);
                }
            });
        },
        
        /**
         * Render search results for the top search
         * 
         * @param {jQuery} $searchResults - The search results container
         * @param {Object} data - The response data containing products
         * @param {jQuery} $form - The form element
         */
        renderSearchResults: function($searchResults, data, $form) {
            if (!data.products || data.products.length === 0) {
                $searchResults.html('<div class="whols-bulk-order-form__search-no-results">' + wholsBulkOrder.config.productNotFoundText + '</div>');
                return;
            }
            
            let html = '';
            
            data.products.forEach(function(product) {
                // Store all product data as JSON in a single data attribute
                const productJson = JSON.stringify(product);
                const productType = product.product_type;
                
                const isVariable = productType === 'variable';
                const attributes = isVariable ? ' data-role="popup-trigger" data-product_id="' + product.id + '" data-popup-name="bof_variation"' : ' data-product_id="' + product.id + '"';
                const className = `whols-bulk-order-form__search-item whols-bulk-order-form__search-item--${productType}`;
                
                html += `<div class="${className}"${attributes} data-product="${encodeURIComponent(productJson)}">`;
                
                // Add product thumbnail
                html += '<div class="whols-bulk-order-form__search-item-image">';
                html += '<img src="' + product.image + '" alt="' + product.name + '">';
                html += '</div>';
                
                // Add product details
                html += '<div class="whols-bulk-order-form__search-item-details">';
                html += '<span class="whols-bulk-order-form__product-name">' + product.name + '</span>';
                if (product.sku) {
                    html += '<span class="whols-bulk-order-form__search-item-sku">SKU: ' + product.sku + '</span>';
                }
                html += '</div>';
                
                html += '</div>';
            });
            
            $searchResults.html(html);
            
            // Add click handler to directly add product to a new row
            $searchResults.find(SELECTORS.search.item).on('click', function() {
                const $item = $(this);
                
                // Get and parse the product data from JSON
                const encodedProductJson = $item.data('product');
                const product = JSON.parse(decodeURIComponent(encodedProductJson));
                
                // Hide search results
                $searchResults.hide();
                
                if (product.product_type === 'simple') {
                    // Create a new row with the selected product
                    Rows.addNewRow(product, $form);
                    
                    // Clear the search input and focus it for next product selection
                    const $searchInput = $form.find(SELECTORS.topFilters.productInput);
                    $searchInput.val('').focus();
                    
                    // Clear the category select if it's not locked
                    const $categoryLock = $form.find(SELECTORS.topFilters.categoryLock);
                    if (!$categoryLock.hasClass('whols-bulk-order-form__category-lock--locked')) {
                        const $categorySelect = $form.find(SELECTORS.topFilters.categorySelect);
                        $categorySelect.val('');
                        
                        // Hide the category lock since category is now empty
                        $categoryLock.addClass('whols-bulk-order-form__category-lock--hidden');
                    }
                    
                    // Trigger custom event
                    $form.trigger('whols/bulk_order/search_product_added', [product]);
                }
            });
        }
    };

    /**
     * Filters Functionality
     * Handles category selection and filtering
     */
    const Filters = {
        /**
         * Handle change of the top category select
         */
        handleCategoryChange: function() {
            const $select = $(this);
            const $form = $select.closest(SELECTORS.form.container);
            const categoryId = $select.val();
            const $categoryLock = $form.find(SELECTORS.topFilters.categoryLock);
            
            // Show/hide the category lock based on whether a category is selected
            if (categoryId) {
                $categoryLock.removeClass('whols-bulk-order-form__category-lock--hidden');
            } else {
                $categoryLock.addClass('whols-bulk-order-form__category-lock--hidden');
            }
            
            // Trigger custom event
            $form.trigger('whols/bulk_order/category_changed', [categoryId]);
        },
        
        /**
         * Handle change of the top quantity input
         */
        handleQuantityChange: function() {
            const $input = $(this);
            const $form = $input.closest(SELECTORS.form.container);
            const quantity = parseInt($input.val(), 10) || 1;
            
            // Store the default quantity value for use when adding new rows
            $form.data('default-quantity', quantity);
            
            // Trigger custom event
            $form.trigger('whols/bulk_order/default_quantity_changed', [quantity]);
        },
        
        /**
         * Toggle category lock status
         */
        toggleCategoryLock: function() {
            const $lock = $(this);
            const $form = $lock.closest(SELECTORS.form.container);
            const isLocked = $lock.hasClass('whols-bulk-order-form__category-lock--locked');
            
            if (isLocked) {
                // Unlock
                $lock.removeClass('whols-bulk-order-form__category-lock--locked');
                $lock.html('<i class="dashicons dashicons-unlock"></i>'); // Unlocked icon
                $lock.attr('title', 'Lock category filter');
                $form.trigger('whols/bulk_order/category_unlocked');
            } else {
                // Lock
                $lock.addClass('whols-bulk-order-form__category-lock--locked');
                $lock.html('<i class="dashicons dashicons-lock"></i>'); // Locked icon
                $lock.attr('title', 'Unlock category filter');
                $form.trigger('whols/bulk_order/category_locked');
            }
        },
        
        /**
         * Remove the selected product from the top search area
         */
        removeSelectedProduct: function() {
            const $removeIcon = $(this);
            const $selectedProduct = $removeIcon.closest(SELECTORS.topFilters.selectedProduct);
            const $form = $selectedProduct.closest(SELECTORS.form.container);
            
            // Hide the selected product container
            $selectedProduct.hide();
            
            // Show the search input again
            $form.find(SELECTORS.topFilters.productInput).val('').show();
            
            // Clear the selected product data
            $selectedProduct.removeData('product');
            $selectedProduct.find('.whols-bulk-order-form__top-product-name').text('').attr('title', '');
            
            // Trigger custom event
            $form.trigger('whols/bulk_order/top_product_removed');
        }
    };

    /**
     * Pricing Functionality
     * Handles price calculations and updates
     */
    const Pricing = {
        /**
         * Determine which price to use based on product and quantity
         * 
         * @param {Object} product - The product data
         * @param {number} quantity - The quantity
         * @param {jQuery} $row - The row element
         * @returns {Object} - Object with price and priceHtml properties
         */
        determinePriceToUse: function(product, quantity, $row) {
            const productPrice = parseFloat(product.price) || 0;
            const productWholesalePrice = parseFloat(product.wholesale_price) || 0;
            const productPriceHtml = product.price_html;
            const productWholesalePriceHtml = product.wholesale_price_html;
            const discountMinimumQuantity = product.discount_minimum_quantity;
            
            let priceToUse = productPrice;
            let priceHtmlToUse = productPriceHtml;
            
            // Helper function to apply regular pricing
            function useRegularPrice() {
                priceToUse = productPrice;
                priceHtmlToUse = productPriceHtml;
                $row.removeClass(SELECTORS.row.wholesaleActive);
                $row.removeClass(SELECTORS.row.tierActive);
            }
            
            // Helper function to check and apply wholesale pricing
            function checkWholesalePricing() {
                if (productWholesalePrice && productWholesalePrice > 0) {
                    const minQuantity = parseInt(discountMinimumQuantity, 10) || 0;

                    // Use wholesale price when: no minimum required (0) OR quantity meets minimum
                    if (minQuantity === 0 || quantity >= minQuantity) {
                        // Use wholesale price for calculation, but keep original price_html for display
                        // price_html already contains formatted display with both prices and savings
                        priceToUse = productWholesalePrice;
                        // Keep productPriceHtml - it already shows "Retailer Price / Wholesaler Price / Save:%"
                        $row.addClass(SELECTORS.row.wholesaleActive);
                        $row.removeClass(SELECTORS.row.tierActive);
                    } else {
                        // Use regular price
                        useRegularPrice();
                    }
                } else {
                    // Use regular price
                    useRegularPrice();
                }
            }
            
            // Check if product has tiered pricing
            if (product.has_tiered_pricing && product.price_tiers) {
                // Find the appropriate tier price based on quantity
                const tiers = product.price_tiers;
                let tierPrice = null;
                let tierApplied = false;
                
                // Sort tiers by quantity in descending order to find the highest applicable tier
                const sortedTiers = Object.keys(tiers).sort((a, b) => parseInt(b) - parseInt(a));
                
                // Find the applicable tier
                for (const tierQty of sortedTiers) {
                    if (quantity >= parseInt(tierQty)) {
                        tierPrice = parseFloat(tiers[tierQty]);
                        tierApplied = true;
                        break;
                    }
                }
                
                if (tierApplied) {
                    // Use tier price
                    priceToUse = tierPrice;
                    // Create tier price HTML
                    const formattedPrice = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                    }).format(tierPrice);
                    priceHtmlToUse = `<span class="whols-bulk-order-form__tier-price">${formattedPrice}</span>`;
                    $row.addClass(SELECTORS.row.tierActive);
                    $row.removeClass(SELECTORS.row.wholesaleActive);
                } else {
                    // No tier applies, check for wholesale pricing
                    checkWholesalePricing();
                }
            } else {
                // No tiered pricing, check for wholesale pricing
                checkWholesalePricing();
            }
            
            return {
                price: priceToUse,
                priceHtml: priceHtmlToUse
            };
        },
        
        /**
         * Update the subtotal for a row
         */
        updateRowSubtotal: function() {
            const $quantityInput = $(this);
            const $row = $quantityInput.closest(SELECTORS.row.container);
            const $form = $row.closest(SELECTORS.form.container);
            
            // Get the product data
            const encodedProductJson = $row.attr('data-product');
            if (!encodedProductJson) {
                return; // No product selected
            }
            
            const product = JSON.parse(decodeURIComponent(encodedProductJson));
            
            // Get the input value
            const inputValue = $quantityInput.val();
            
            // Prevent quantity from being empty, 0, or less than 1
            if (inputValue === '' || inputValue === null || isNaN(parseInt(inputValue, 10)) || parseInt(inputValue, 10) < 1) {
                $quantityInput.val(1);
            }
            
            // Use at least 1 for calculations
            const quantity = Math.max(1, parseInt($quantityInput.val(), 10) || 1);
            
            // Determine which price to use
            const priceData = Pricing.determinePriceToUse(product, quantity, $row);
            
            // Update price display
            $row.find(SELECTORS.row.productPrice).html(priceData.priceHtml);
            $row.find(SELECTORS.row.productPriceInput).val(priceData.price);
            
            // Update quantity functionality removed
            
            // Calculate subtotal with the appropriate price
            const subtotal = (quantity * priceData.price).toFixed(2);
            $row.find(SELECTORS.row.subtotal).text(subtotal);
            
            // Update total price
            Pricing.updateTotalPrice($form);
            
            // Trigger custom event
            $row.trigger('whols/bulk_order/subtotal_updated', [subtotal, quantity, priceData.price]);
        },
        
        // Update quantity functionality removed
        
        /**
         * Update the total price for the form
         * 
         * @param {jQuery} $form - The form element
         */
        updateTotalPrice: function($form) {
            let total = 0;
            
            $form.find(SELECTORS.row.container).each(function() {
                if (!$(this).hasClass('whols-bulk-order-form__row--template')) {
                    // Get subtotal for each row
                    const subtotalText = $(this).find(SELECTORS.row.subtotal).text();
                    const subtotal = parseFloat(subtotalText) || 0;
                    total += subtotal;
                }
            });
            
            // Update the total price display
            $form.find(SELECTORS.summary.totalValue).html(Utils.formatPrice(total));
            
            // Trigger custom event
            $form.trigger('whols/bulk_order/total_updated', [total]);
        },
        
        /**
         * Validate quantity input to ensure it's at least 1
         */
        validateQuantity: function() {
            const $input = $(this);
            const inputValue = $input.val();
            const minQuantity = $input.attr('min') || 1;
            
            // Check for empty or invalid input
            if (inputValue === '' || inputValue === null || isNaN(parseInt(inputValue, 10)) || parseInt(inputValue, 10) < minQuantity) {
                $input.val(minQuantity);
                return false;
            }
            
            return true;
        }
    };

    /**
     * Cart Functionality
     * Handles adding products to cart
     */
    const Cart = {
        /**
         * Update the Add to Cart button state
         * 
         * @param {jQuery} $form - The form element
         * @param {boolean} enable - Whether to enable or disable the button
         */
        updateAddToCartButtonState: function($form, enable) {
            const $button = $form.find(SELECTORS.actions.addToCart);
            
            if (enable) {
                $button.prop('disabled', false).removeClass('whols-bulk-order-form__add-to-cart--disabled');
            } else {
                $button.prop('disabled', true).addClass('whols-bulk-order-form__add-to-cart--disabled');
            }
        },
        
        /**
         * Add products to cart
         */
        addToCart: function() {
            const $button = $(this);
            const $form = $button.closest(SELECTORS.form.container);
            const products = [];
            const originalButtonText = $button.text();
            
            // Get all product rows with products selected
            $form.find(SELECTORS.row.container).each(function() {
                if (!$(this).hasClass('whols-bulk-order-form__row--template')) {
                    const productId = $(this).find(SELECTORS.row.productId).val();
                    const productVariationId = $(this).find(SELECTORS.row.productVariationId).val();
                    const quantity = parseInt($(this).find(SELECTORS.row.quantity).val(), 10) || 0;
                    
                    if (productId && quantity > 0) {
                        products.push({
                            id: productId,
                            variation_id: productVariationId,
                            quantity: quantity
                        });
                    }
                }
            });
            
            // If no products selected, show error
            if (products.length === 0) {
                Notifications.showNotification('Please select at least one product', 'error');
                return;
            }
            
            // Trigger custom event before adding to cart
            $form.trigger('whols/bulk_order/cart_adding', [products]);
            
            // Disable button and show loading
            $button.prop('disabled', true).addClass('loading').text('Adding...');
            
            // Make AJAX request to add products to cart
            $.ajax({
                url: wholsBulkOrder.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'whols_add_to_cart',
                    nonce: wholsBulkOrder.nonce,
                    products: products
                },
                success: function(response) {
                    if (response.success) {
                        Notifications.showNotification(response.data.message, 'success');
                        $form.trigger('whols/bulk_order/cart_added', [response.data]);
                        
                        // Redirect to cart page if provided
                        if (response.data.redirect) {
                            setTimeout(function() {
                                window.location.href = response.data.redirect;
                            }, 1000);
                        }
                    } else {
                        Notifications.showNotification(response.data.message || wholsBulkOrder.config.errorAddingToCart, 'error');
                        $form.trigger('whols/bulk_order/cart_error', [response.data]);
                    }
                },
                error: function(xhr, status, error) {
                    Notifications.showNotification(wholsBulkOrder.config.errorAddingToCart, 'error');
                    $form.trigger('whols/bulk_order/cart_ajax_error', [xhr, status, error]);
                },
                complete: function() {
                    // Re-enable button with original text
                    $button.prop('disabled', false).removeClass('loading').text(originalButtonText);
                }
            });
        }
    };

    // SaveList functionality removed

    /**
     * Notifications
     * Handles displaying notifications to the user
     */
    const Notifications = {
        /**
         * Show notification message
         * 
         * @param {jQuery} $form - The form element
         * @param {string} message - The message to display
         * @param {string} type - The notification type (success, error, etc.)
         */
        showNotification: function(message, type) {
            const $notifications = $(SELECTORS.notifications.container);
            const $notification = $('<div class="whols-bulk-order-form__notification whols-bulk-order-form__notification--' + type + '">' + message + '</div>');
            
            $notifications.empty().append($notification);
            
            // Auto-hide after 5 seconds
            setTimeout(function() {
                $notification.fadeOut(300, function() {
                    $(this).remove();
                });
            }, 5000);
            
            // Trigger custom event
            $(document).trigger('whols/ajax_notification_shown', [message, type]);
        }
    };

    /**
     * Utility functions
     */
    const Utils = {
        /**
         * Debounce function to limit how often a function is called
         * 
         * @param {Function} func - The function to debounce
         * @param {number} wait - The debounce delay in milliseconds
         * @returns {Function} - The debounced function
         */
        debounce: function(func, wait) {
            let timeout;
            
            return function() {
                const context = this, args = arguments;
                clearTimeout(timeout);
                
                timeout = setTimeout(function() {
                    func.apply(context, args);
                }, wait);
            };
        },
        
        /**
         * Format price with proper currency symbol and decimals
         * 
         * @param {number} price - The price to format
         * @return {string} - Formatted price HTML
         */
        formatPrice: function(price) {
            if (typeof wholsBulkOrder !== 'undefined' && wholsBulkOrder.currency_format) {
                // Use the currency format from the localized data
                return wholsBulkOrder.currency_format.replace('%s', price.toFixed(2));
            } else {
                // Fallback to a basic format
                return '$' + price.toFixed(2);
            }
        }
    };

    /**
     * Variation Handling
     * Handles adding variation products to the form
     */
    const Variations = {
        /**
         * Initialize variation handlers
         */
        init: function() {
            this.bindEvents();
        },
        
        /**
         * Bind variation-related events
         */
        bindEvents: function() {
            $(document).on('click', SELECTORS.actions.addVariation, this.handleVariationAdd);
        },
        
        /**
         * Handle adding a variation to the form
         */
        handleVariationAdd: function() {
            const $button = $(this);
            const $form = $button.closest('.variations_form');
            const $popup = $button.closest('#whols-popup-bof_variation-content');
            
            // Check if all variations are selected
            const hasSelects = $form.find('.variations select').length > 0;
            const variationId = $form.find('input[name="variation_id"]').val();
            const noValidVariation = !variationId || variationId === '0' || variationId === 0;
            
            if (hasSelects && noValidVariation) {
                // Fallback to a default message if the config value is missing
                alert(wholsBulkOrder.config.pleaseSelectAllOptions || 'Please select all product options before adding to the form.');
                return false;
            }
            
            // Already have variationId from above
            const productId = $form.find('input[name="product_id"]').val();
            
            // Get the bulk order form
            const $bulkForm = $('.whols-bulk-order-form');
            
            // Get variation data
            const variationData = {};
            $form.find('.variations select').each(function() {
                const $select = $(this);
                const attributeName = $select.attr('name');
                variationData[attributeName] = $select.val();
            });
            
            // Add loading state to button
            const originalButtonText = $button.text();
            $button.prop('disabled', true)
                  .addClass('loading')
                  .text(wholsBulkOrder.config.loading || 'Loading...');

            // Make AJAX request to get the variation pricing using Wholesale_Product_Pricing class
            $.ajax({
                url: wholsBulkOrder.ajaxUrl,
                data: {
                    action: 'whols_get_wholesale_pricing_data',
                    product_id: productId,
                    variation_id: variationId,
                    nonce: wholsBulkOrder.nonce
                },
                method: 'POST',
                success: function(response) {
                    // Restore button state
                    $button.prop('disabled', false)
                           .removeClass('loading')
                           .text(originalButtonText);

                    const variationProduct = response.data;

                    // Add the variation to the form
                    Rows.addNewRow(variationProduct, $bulkForm);

                    // Show success notification
                    Notifications.showNotification('Variation product added successfully', 'success');

                    // Close the popup
                    if (typeof WholsPopup !== 'undefined') {
                        // WholsPopup.closePopup();
                    }

                    // Clear the search input and focus it for next product selection
                    const $searchInput = $bulkForm.find(SELECTORS.topFilters.productInput);
                    $searchInput.val('').focus();

                    // Trigger custom event
                    $bulkForm.trigger('whols/bulk_order/variation_added', [variationProduct]);
                },
                error: function(xhr, status, error) {
                    // Restore button state
                    $button.prop('disabled', false)
                           .removeClass('loading')
                           .text(originalButtonText);
                    
                    console.error('Error getting variation data:', error);
                    alert('Error getting variation data. Please try again.');
                }
            });
        }
};

    // Initialize the form when document is ready
    $(document).ready(function() {
        // Initialize the form
        WholsBulkOrderForm.init();
        
        // Initialize variation handlers
        Variations.init();
    });
    
    // Make API globally accessible
    window.WholsBulkOrderForm = {
        init: WholsBulkOrderForm.init,
        addNewRow: Rows.addNewRow,
        updateTotalPrice: Pricing.updateTotalPrice,
        showNotification: Notifications.showNotification,
        handleVariationAdd: Variations.handleVariationAdd
    };

})(jQuery);