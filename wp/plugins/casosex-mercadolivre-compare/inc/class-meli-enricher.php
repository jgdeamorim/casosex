<?php
/**
 * Módulo de Enriquecimento de Atributos Globais WooCommerce
 * Converte atributos MeLi em taxonomias pa_* nativas
 * ADR-0239
 */

if (!defined('ABSPATH')) {
    exit;
}

class CasoSex_MeLi_Enricher {

    public static function enrich_product_attributes($product_id, $meli_attributes) {
        $product = wc_get_product($product_id);
        if (!$product || empty($meli_attributes) || !is_array($meli_attributes)) {
            return false;
        }

        $attr_tax_ids = [
            'pa_modos-vibracao'   => wc_attribute_taxonomy_id_by_name('modos-vibracao'),
            'pa_material'         => wc_attribute_taxonomy_id_by_name('material'),
            'pa_resistencia-agua' => wc_attribute_taxonomy_id_by_name('resistencia-agua'),
            'pa_alimentacao'      => wc_attribute_taxonomy_id_by_name('alimentacao'),
            'pa_volume'           => wc_attribute_taxonomy_id_by_name('volume')
        ];

        // Mapeamento dos IDs de atributo do MeLi para taxonomias WC
        $meli_map = [];
        foreach ($meli_attributes as $attr) {
            $attr_id = isset($attr['id']) ? $attr['id'] : '';
            $val = isset($attr['value_name']) ? trim($attr['value_name']) : '';
            if ($attr_id && $val) {
                $meli_map[$attr_id] = $val;
            }
        }

        $applied = [];

        // 1. Modos de vibração
        if (!empty($meli_map['QUANTITY_OF_VIBRATION_MODES'])) {
            $val = $meli_map['QUANTITY_OF_VIBRATION_MODES'] . ' Modos';
            self::set_term_attribute($product_id, $product, 'pa_modos-vibracao', $val, $attr_tax_ids['pa_modos-vibracao']);
            $applied['pa_modos-vibracao'] = $val;
        }

        // 2. Material
        if (!empty($meli_map['MATERIALS'])) {
            $val = $meli_map['MATERIALS'];
            if (stripos($val, 'silicone') !== false) {
                $val = 'Silicone de Grau Médico';
            } elseif (stripos($val, 'abs') !== false) {
                $val = 'ABS / Acrílico';
            }
            self::set_term_attribute($product_id, $product, 'pa_material', $val, $attr_tax_ids['pa_material']);
            $applied['pa_material'] = $val;
        }

        // 3. Resistência à água
        if (!empty($meli_map['WATER_RESISTANCE_TYPE'])) {
            $val = $meli_map['WATER_RESISTANCE_TYPE'];
            if (stripos($val, 'ipx7') !== false || stripos($val, 'submersível') !== false) {
                $val = "100% À Prova D'água (IPX7)";
            } elseif (stripos($val, 'ipx4') !== false || stripos($val, 'respingos') !== false) {
                $val = "Resistente a Respingos (IPX4)";
            }
            self::set_term_attribute($product_id, $product, 'pa_resistencia-agua', $val, $attr_tax_ids['pa_resistencia-agua']);
            $applied['pa_resistencia-agua'] = $val;
        }

        // 4. Alimentação / Bateria
        if (!empty($meli_map['POWER_SUPPLY_TYPE'])) {
            $val = $meli_map['POWER_SUPPLY_TYPE'];
            if (stripos($val, 'recarregável') !== false || stripos($val, 'usb') !== false) {
                $val = 'Bateria Recarregável USB';
            }
            self::set_term_attribute($product_id, $product, 'pa_alimentacao', $val, $attr_tax_ids['pa_alimentacao']);
            $applied['pa_alimentacao'] = $val;
        }

        $product->save();
        return $applied;
    }

    private static function set_term_attribute($product_id, &$product, $taxonomy, $term_label, $tax_id) {
        $term_slug = sanitize_title($term_label);
        $term = get_term_by('slug', $term_slug, $taxonomy);
        if (!$term) {
            $ins = wp_insert_term($term_label, $taxonomy, ['slug' => $term_slug]);
            $term_id = is_array($ins) ? $ins['term_id'] : 0;
        } else {
            $term_id = $term->term_id;
        }

        if ($term_id) {
            wp_set_object_terms($product_id, [(int)$term_id], $taxonomy, false);

            $attributes = $product->get_attributes();
            $attr_obj = new WC_Product_Attribute();
            $attr_obj->set_id($tax_id ?: 0);
            $attr_obj->set_name($taxonomy);
            $attr_obj->set_options([(int)$term_id]);
            $attr_obj->set_position(count($attributes) + 1);
            $attr_obj->set_visible(true);
            $attr_obj->set_variation(false);

            $attributes[$taxonomy] = $attr_obj;
            $product->set_attributes($attributes);
        }
    }
}
