<?php
namespace Whols_Pro\Blocks;
use const Whols_Pro\PL_PATH;

/**
 * Block Registration Class
 */
class Block_Registration {
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', [$this, 'register_blocks']);
    }

    /**
     * Register blocks
     */
    public function register_blocks() {
        // Register blocks directory path
        register_block_type_from_metadata(
            PL_PATH . '/build/blocks/registration-form',
            array(
                'render_callback' => [$this, 'render_registration_form'],
            )
        );
    }

    /**
     * Render registration form block
     *
     * @param array $attributes Block attributes
     * @return string
     */
    public function render_registration_form($attributes) {
        // Start output buffering
        ob_start();

        // Add style tag with CSS variables
        $this->print_block_styles($attributes);

        // Get registration form shortcode content
        echo do_shortcode('[whols_registration_form]');

        echo '</div> <!-- block_wrapper -->';

        // Return buffered content
        return ob_get_clean();
    }

    /**
     * Print block styles
     *
     * @param array $attributes Block attributes
     */
    private function print_block_styles($attributes) {
        $label_styles       = !empty($attributes['labelStyles']) ? $attributes['labelStyles'] : [];
        $description_styles = !empty($attributes['descriptionStyles']) ? $attributes['descriptionStyles'] : [];
        $input_styles       = !empty($attributes['inputStyles']) ? $attributes['inputStyles'] : [];
        $select_styles      = !empty($attributes['selectStyles']) ? $attributes['selectStyles'] : [];
        $button_styles      = !empty($attributes['buttonStyles']) ? $attributes['buttonStyles'] : [];

        // Generate unique ID for this instance
        $unique_id = uniqid('whols-form-');

        ?>
        <div id="<?php echo esc_attr($unique_id); ?>" class="wp-block-whols-registration-form">
        <style>
            #<?php echo esc_attr($unique_id); ?> {
                <?php
                // Label styles
                if (!empty($label_styles)) {
                    echo '--whols-label-color: ' . esc_attr($this->array_get($label_styles, 'textColor')) . ';';
                    echo '--whols-label-font-size: ' . esc_attr($this->array_get($label_styles, 'fontSize')) . 'px;';
                    echo '--whols-label-font-weight: ' . esc_attr($this->array_get($label_styles, 'fontWeight')) . ';';
                    echo '--whols-label-margin: ' . esc_attr($this->array_get($label_styles, 'marginBottom')) . 'px;';
                }

                if (!empty($description_styles)) {
                    echo '--whols-description-color: ' . esc_attr($this->array_get($description_styles, 'textColor')) . ';';
                    echo '--whols-description-font-size: ' . esc_attr($this->array_get($description_styles, 'fontSize')) . 'px;';
                    echo '--whols-description-font-style: ' . esc_attr($this->array_get($description_styles, 'fontStyle')) . ';';
                    echo '--whols-description-margin: ' . esc_attr($this->array_get($description_styles, 'marginTop')) . 'px;';
                }

                // Input styles
                if (!empty($input_styles)) {
                    echo '--whols-input-bg: ' . esc_attr($this->array_get($input_styles, 'backgroundColor')) . ';';
                    echo '--whols-input-color: ' . esc_attr($this->array_get($input_styles, 'color')) . ';';
                    echo '--whols-input-border: ' . esc_attr($this->array_get($input_styles, 'borderColor')) . ';';
                    echo '--whols-input-border-width: ' . esc_attr($this->array_get($input_styles, 'borderWidth')) . 'px;';
                    echo '--whols-input-radius: ' . esc_attr($this->array_get($input_styles, 'borderRadius')) . 'px;';
                    echo '--whols-input-padding: ' . esc_attr($this->array_get($input_styles, 'padding')) . 'px;';
                    echo '--whols-input-font-size: ' . esc_attr($this->array_get($input_styles, 'fontSize')) . 'px;';
                    echo '--whols-input-focus-border: ' . esc_attr($this->array_get($input_styles, 'focusBorderColor')) . ';';
                    echo '--whols-input-placeholder: ' . esc_attr($this->array_get($input_styles, 'placeholderColor')) . ';';
                }

                if (!empty($select_styles)) {
                    echo '--whols-select-bg: ' . esc_attr($this->array_get($select_styles, 'backgroundColor')) . ';';
                    echo '--whols-select-color: ' . esc_attr($this->array_get($select_styles, 'textColor')) . ';';
                    echo '--whols-select-border: ' . esc_attr($this->array_get($select_styles, 'borderColor')) . ';';
                    echo '--whols-select-border-width: ' . esc_attr($this->array_get($select_styles, 'borderWidth')) . 'px;';
                    echo '--whols-select-radius: ' . esc_attr($this->array_get($select_styles, 'borderRadius')) . 'px;';
                    echo '--whols-select-padding: ' . esc_attr($this->array_get($select_styles, 'padding')) . 'px;';
                    echo '--whols-select-font-size: ' . esc_attr($this->array_get($select_styles, 'fontSize')) . 'px;';
                    echo '--whols-select-height: ' . esc_attr($this->array_get($select_styles, 'height')) . 'px;';
                }

                // Button styles
                if (!empty($button_styles)) {
                    echo '--whols-btn-bg: ' . esc_attr($this->array_get($button_styles, 'backgroundColor')) . ';';
                    echo '--whols-btn-color: ' . esc_attr($this->array_get($button_styles, 'textColor')) . ';';
                    echo '--whols-btn-hover-bg: ' . esc_attr($this->array_get($button_styles, 'hoverBackgroundColor')) . ';';
                    echo '--whols-btn-hover-color: ' . esc_attr($this->array_get($button_styles, 'hoverTextColor')) . ';';
                    echo '--whols-btn-padding: ' . esc_attr($this->array_get($button_styles, 'padding')) . ';';
                    echo '--whols-btn-radius: ' . esc_attr($this->array_get($button_styles, 'borderRadius')) . 'px;';
                    echo '--whols-btn-font-size: ' . esc_attr($this->array_get($button_styles, 'fontSize')) . 'px;';
                    echo '--whols-btn-width: ' . esc_attr($this->array_get($button_styles, 'width')) . ';';
                }
                ?>
            }
        </style>
        <?php
    }

    public function array_get($array, $key, $default = '') {
        return isset($array[$key]) ? $array[$key] : $default;
    }
}