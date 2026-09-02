<?php
/**
 * Default template for Bulk Order Form
 *
 * This template displays the bulk order form with product search, quantity selection,
 * and cart functions.
 */

defined('ABSPATH') || exit;

// Get unique ID for the form
$form_id = 'whols-bulk-order-form-' . uniqid();

// Get form attributes
$min_quantity = esc_attr($atts['min_quantity']);
$step_quantity = esc_attr($atts['step_quantity']);
$title = esc_html($atts['title']);
?>

<div class="whols-bulk-order-form" 
    id="<?php echo esc_attr($form_id); ?>" 
    data-min-quantity="<?php echo $min_quantity; ?>" 
    data-step-quantity="<?php echo $step_quantity; ?>">
    
    <?php if (!empty($title)) : ?>
        <h2 class="whols-bulk-order-form__title"><?php echo esc_html($title); ?></h2>
    <?php endif; ?>
    
    <!-- Top Filter Section -->
    <div class="whols-bulk-order-form__top-filters">
        <div class="whols-bulk-order-form__filter-row">
            <!-- Category Filter -->
            <div class="whols-bulk-order-form__filter-column whols-bulk-order-form__filter-column--category">
                <label for="<?php echo esc_attr($form_id); ?>-top-category" class="whols-bulk-order-form__filter-label">
                    <?php echo esc_html__('Select Category', 'whols'); ?>
                </label>
                <div class="whols-bulk-order-form__category-select-wrapper">
                    <div class="whols-bulk-order-form__category-control">
                        <select id="<?php echo esc_attr($form_id); ?>-top-category" class="whols-bulk-order-form__top-category-select">
                            <option value=""><?php esc_html_e('All Categories', 'whols'); ?></option>
                            <?php
                            // Get product categories
                            $product_categories = get_terms(array(
                                'taxonomy'   => 'product_cat',
                                'hide_empty' => true,
                                'orderby'    => 'name',
                                'order'      => 'ASC',
                            ));
                            
                            $product_categories = apply_filters('whols_bulk_order_product_categories', $product_categories);
                            
                            if (!is_wp_error($product_categories) && !empty($product_categories)) {
                                foreach ($product_categories as $category) {
                                    // Skip uncategorized
                                    if ($category->slug === 'uncategorized') continue;
                                    
                                    echo '<option value="' . esc_attr($category->term_id) . '">' . esc_html($category->name) . '</option>';
                                }
                            }
                            ?>
                        </select>
                        <span class="whols-bulk-order-form__category-lock" title="<?php esc_attr_e('Lock category filter', 'whols'); ?>"><i class="dashicons dashicons-unlock"></i></span>
                    </div>
                </div>
            </div>
            
            <!-- Product Search -->
            <div class="whols-bulk-order-form__filter-column whols-bulk-order-form__filter-column--search">
                <label for="<?php echo esc_attr($form_id); ?>-top-search" class="whols-bulk-order-form__filter-label">
                    <?php echo esc_html__('Search Products', 'whols'); ?>
                </label>
                <div class="whols-bulk-order-form__product-search">
                    <input type="text" 
                        id="<?php echo esc_attr($form_id); ?>-top-search" 
                        class="whols-bulk-order-form__top-product-input" 
                        placeholder="<?php echo esc_attr__('Search Products', 'whols'); ?>">
                    <div class="whols-bulk-order-form__search-results" style="display: none;"></div>
                </div>
            </div>
            
            <!-- Hidden default quantity input -->
            <input type="hidden" 
                id="<?php echo esc_attr($form_id); ?>-top-quantity" 
                class="whols-bulk-order-form__top-quantity" 
                value="<?php echo $min_quantity; ?>" 
                min="<?php echo $min_quantity; ?>" 
                step="<?php echo $step_quantity; ?>">
        </div>
    </div>
    
    <!-- Main Content Area -->
    <div class="whols-bulk-order-form__content">
        <!-- Table Header -->
        <div class="whols-bulk-order-form__header">
            <div class="whols-bulk-order-form__column whols-bulk-order-form__column--product" style="margin-left: 35px;">
                <?php esc_html_e('Products', 'whols'); ?>
            </div>
            <div class="whols-bulk-order-form__column whols-bulk-order-form__column--price">
                <?php esc_html_e('Price', 'whols'); ?>
            </div>
            <div class="whols-bulk-order-form__column whols-bulk-order-form__column--stock">
                <?php esc_html_e('Stock', 'whols'); ?>
            </div>
            <div class="whols-bulk-order-form__column whols-bulk-order-form__column--quantity">
                <?php esc_html_e('Qty', 'whols'); ?>
            </div>
            <div class="whols-bulk-order-form__column whols-bulk-order-form__column--subtotal">
                <?php esc_html_e('Subtotal', 'whols'); ?>
            </div>
        </div>
        
        <!-- Product Rows Container -->
        <div class="whols-bulk-order-form__body">
            <!-- Template Row (hidden) - Used by JavaScript to create new rows -->
            <div class="whols-bulk-order-form__row whols-bulk-order-form__row--template" style="display: none;">
                <div class="whols-bulk-order-form__column whols-bulk-order-form__column--remove">
                    <span class="whols-bulk-order-form__remove-row">×</span>
                </div>
                <div class="whols-bulk-order-form__column whols-bulk-order-form__column--product">
                    <div class="whols-bulk-order-form__product-info">
                        <div class="whols-bulk-order-form__product-image"></div>
                        <div class="whols-bulk-order-form__product-details">
                            <a href="" target="_blank" class="whols-bulk-order-form__product-name"></a>
                            <input type="hidden" class="whols-bulk-order-form__product-id" value="">
                            <input type="hidden" class="whols-bulk-order-form__product-variation-id" value="">
                        </div>
                    </div>
                </div>
                <div class="whols-bulk-order-form__column whols-bulk-order-form__column--price">
                    <span class="whols-bulk-order-form__product-price">0.00</span>
                    <input type="hidden" class="whols-bulk-order-form__product-price-input" value="0">
                </div>
                <div class="whols-bulk-order-form__column whols-bulk-order-form__column--stock">
                    <span class="whols-bulk-order-form__product-stock"></span>
                </div>
                <div class="whols-bulk-order-form__column whols-bulk-order-form__column--quantity">
                    <div class="whols-bulk-order-form__quantity-wrapper">
                        <input type="number" class="whols-bulk-order-form__quantity" 
                            value="<?php echo $min_quantity; ?>" 
                            placeholder="<?php echo $min_quantity; ?>"
                            min="<?php echo $min_quantity; ?>" 
                            step="<?php echo $step_quantity; ?>">
                    </div>
                </div>
                <div class="whols-bulk-order-form__column whols-bulk-order-form__column--subtotal">
                    <span class="whols-bulk-order-form__subtotal">0.00</span>
                </div>
            </div>
            
            <!-- Initial empty message - JavaScript will remove this when products are added -->
            <div class="whols-bulk-order-form__empty-message">
                <?php echo esc_html__('No products added yet. Use the search to add products.', 'whols'); ?>
            </div>
        </div>
        
        <!-- Form Footer with Totals and Actions -->
        <div class="whols-bulk-order-form__footer">
            <div class="whols-bulk-order-form__buttons">
                <button type="button" class="whols-bulk-order-form__add-to-cart whols-bulk-order-form__add-to-cart--disabled" disabled>
                    <?php echo esc_html__('Add to Cart', 'whols'); ?>
                </button>
                <?php if (is_user_logged_in()): ?>

                <?php endif; ?>
            </div>
            <div class="whols-bulk-order-form__total">
                <span class="whols-bulk-order-form__total-label"><?php echo esc_html__('Total:', 'whols'); ?></span>
                <span class="whols-bulk-order-form__total-value">0.00</span>
            </div>
        </div>
    </div>
    

    
    <!-- Notifications Container -->
    <div class="whols-bulk-order-form__notifications"></div>
</div>