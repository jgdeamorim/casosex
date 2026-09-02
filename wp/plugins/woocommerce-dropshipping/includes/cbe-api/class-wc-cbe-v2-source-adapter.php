<?php

if ( ! class_exists( 'WC_CBE_V2_Source_Adapter' ) ) {

	class WC_CBE_V2_Source_Adapter {

		public static function normalize( $source_type, $payload ) {
			$normalized_source_type = self::sanitize_source_type( $source_type );
			$base_payload = self::map_shared_schema_fields( $payload );

			switch ( $normalized_source_type ) {
				case 'API':
					return self::normalize_api_payload( $base_payload );
				case 'SCRAPE_FALLBACK':
					return self::normalize_scrape_payload( $base_payload );
				case 'MANUAL':
				default:
					return self::normalize_manual_payload( $base_payload );
			}
		}

		private static function sanitize_source_type( $source_type ) {
			if ( ! is_string( $source_type ) || '' === trim( $source_type ) ) {
				return 'MANUAL';
			}

			$candidate = strtoupper( trim( $source_type ) );
			if ( in_array( $candidate, array( 'API', 'SCRAPE_FALLBACK', 'MANUAL' ), true ) ) {
				return $candidate;
			}

			return 'MANUAL';
		}

		private static function map_shared_schema_fields( $payload ) {
			if ( ! is_array( $payload ) ) {
				$payload = array();
			}

			$mapped = $payload;
			$field_map = array(
				'product_title' => 'title',
				'regular_price' => 'regular_price',
				'sale_price' => 'sale_price',
				'currency' => 'ali_currency',
				'description' => 'description',
				'stock' => 'stock_quantity',
				'shipping_data' => 'shipping_data',
				'validation_warnings' => 'validation_warnings',
				'supplier_id' => 'supplier_id',
				'product_id' => 'product_id',
			);

			foreach ( $field_map as $source_key => $target_key ) {
				if ( ! isset( $mapped[ $target_key ] ) && isset( $payload[ $source_key ] ) ) {
					$mapped[ $target_key ] = $payload[ $source_key ];
				}
			}

			if ( ! isset( $mapped['short_description'] ) && isset( $mapped['description'] ) ) {
				$mapped['short_description'] = $mapped['description'];
			}

			if ( ! isset( $mapped['sku'] ) && isset( $mapped['product_id'] ) ) {
				$mapped['sku'] = 'ALI-' . sanitize_text_field( (string) $mapped['product_id'] );
			}

			if ( isset( $mapped['images'] ) && is_array( $mapped['images'] ) ) {
				$mapped['images'] = self::normalize_images( $mapped['images'] );
			}

			if ( ! isset( $mapped['attributes'] ) || ! is_array( $mapped['attributes'] ) ) {
				$mapped['attributes'] = array();
			}

			if ( ! isset( $mapped['variations'] ) || ! is_array( $mapped['variations'] ) ) {
				$mapped['variations'] = array();
			}

			return $mapped;
		}

		private static function normalize_images( $images ) {
			$normalized = array();

			foreach ( $images as $image ) {
				if ( is_string( $image ) ) {
					$image_url = esc_url_raw( $image );
					if ( '' !== $image_url ) {
						$normalized[] = array( 'src' => $image_url );
					}
					continue;
				}

				if ( is_array( $image ) && isset( $image['src'] ) ) {
					$image_url = esc_url_raw( $image['src'] );
					if ( '' !== $image_url ) {
						$normalized[] = array( 'src' => $image_url );
					}
				}
			}

			return $normalized;
		}

		private static function normalize_api_payload( $payload ) {
			if ( ! isset( $payload['source_type'] ) ) {
				$payload['source_type'] = 'API';
			}

			return $payload;
		}

		private static function normalize_scrape_payload( $payload ) {
			if ( ! isset( $payload['source_type'] ) ) {
				$payload['source_type'] = 'SCRAPE_FALLBACK';
			}

			return $payload;
		}

		private static function normalize_manual_payload( $payload ) {
			if ( ! isset( $payload['source_type'] ) ) {
				$payload['source_type'] = 'MANUAL';
			}

			return $payload;
		}
	}
}
