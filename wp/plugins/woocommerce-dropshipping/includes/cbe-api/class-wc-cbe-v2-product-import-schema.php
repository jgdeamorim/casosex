<?php

if ( ! class_exists( 'WC_CBE_V2_Product_Import_Schema' ) ) {

	class WC_CBE_V2_Product_Import_Schema {

		private static function sanitize_source_type( $source_type ) {
			if ( ! is_string( $source_type ) ) {
				return 'MANUAL';
			}

			$candidate = strtoupper( trim( $source_type ) );
			if ( in_array( $candidate, array( 'API', 'SCRAPE_FALLBACK', 'MANUAL' ), true ) ) {
				return $candidate;
			}

			return 'MANUAL';
		}

		private static function as_text( $value ) {
			if ( is_string( $value ) ) {
				return sanitize_text_field( $value );
			}

			if ( is_numeric( $value ) ) {
				return sanitize_text_field( (string) $value );
			}

			return '';
		}

		private static function as_description( $value ) {
			if ( is_string( $value ) ) {
				return (string) $value;
			}

			return '';
		}

		private static function as_money_string( $value ) {
			if ( is_numeric( $value ) ) {
				$number = (float) $value;
				if ( $number < 0 ) {
					$number = 0;
				}
				return number_format( $number, 2, '.', '' );
			}

			if ( is_string( $value ) ) {
				$trimmed = trim( $value );
				if ( '' === $trimmed ) {
					return '';
				}

				$normalized = preg_replace( '/[^\d.,-]/', '', $trimmed );
				$normalized = str_replace( ',', '', (string) $normalized );
				if ( '' === $normalized ) {
					return '';
				}

				$float = (float) $normalized;
				if ( $float < 0 ) {
					$float = 0;
				}
				return number_format( $float, 2, '.', '' );
			}

			return '';
		}

		private static function as_stock( $value ) {
			if ( is_numeric( $value ) ) {
				$stock = (int) $value;
				return $stock >= 0 ? $stock : 0;
			}

			if ( is_string( $value ) ) {
				$normalized = preg_replace( '/[^\d-]/', '', $value );
				if ( '' === $normalized ) {
					return 0;
				}

				$stock = (int) $normalized;
				return $stock >= 0 ? $stock : 0;
			}

			return 0;
		}

		private static function normalize_images( $images ) {
			if ( ! is_array( $images ) ) {
				return array();
			}

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

		private static function collect_validation_warnings( $normalized ) {
			$warnings = array();

			if ( empty( $normalized['product_title'] ) ) {
				$warnings[] = 'product_title';
			}

			if ( empty( $normalized['regular_price'] ) ) {
				$warnings[] = 'regular_price';
			}

			if ( empty( $normalized['images'] ) ) {
				$warnings[] = 'images';
			}

			if ( empty( $normalized['product_id'] ) ) {
				$warnings[] = 'product_id';
			}

			if ( empty( $normalized['supplier_id'] ) ) {
				$warnings[] = 'supplier_id';
			}

			if ( empty( $normalized['currency'] ) ) {
				$warnings[] = 'currency';
			}

			if ( isset( $normalized['validation_warnings'] ) && is_array( $normalized['validation_warnings'] ) ) {
				foreach ( $normalized['validation_warnings'] as $warning ) {
					if ( is_string( $warning ) && '' !== trim( $warning ) ) {
						$warnings[] = sanitize_text_field( $warning );
					}
				}
			}

			return array_values( array_unique( $warnings ) );
		}

		public static function normalize( $payload, $source_type = 'MANUAL' ) {
			if ( ! is_array( $payload ) ) {
				$payload = array();
			}

			$product_title = self::as_text( isset( $payload['product_title'] ) ? $payload['product_title'] : ( isset( $payload['title'] ) ? $payload['title'] : '' ) );
			$legacy_sku = self::as_text( isset( $payload['sku'] ) ? $payload['sku'] : '' );
			$product_id = self::as_text( isset( $payload['product_id'] ) ? $payload['product_id'] : $legacy_sku );
			$supplier_id = self::as_text( isset( $payload['supplier_id'] ) ? $payload['supplier_id'] : ( isset( $payload['ali_store_name'] ) ? $payload['ali_store_name'] : '' ) );
			$regular_price = self::as_money_string( isset( $payload['regular_price'] ) ? $payload['regular_price'] : ( isset( $payload['price'] ) ? $payload['price'] : '' ) );
			$sale_price = self::as_money_string( isset( $payload['sale_price'] ) ? $payload['sale_price'] : '' );
			$currency = self::as_text( isset( $payload['currency'] ) ? $payload['currency'] : ( isset( $payload['ali_currency'] ) ? $payload['ali_currency'] : '' ) );
			$description = self::as_description( isset( $payload['description'] ) ? $payload['description'] : '' );
			$images = self::normalize_images( isset( $payload['images'] ) ? $payload['images'] : array() );
			$attributes = ( isset( $payload['attributes'] ) && is_array( $payload['attributes'] ) ) ? $payload['attributes'] : array();
			$variations = ( isset( $payload['variations'] ) && is_array( $payload['variations'] ) ) ? $payload['variations'] : array();
			$stock = self::as_stock( isset( $payload['stock'] ) ? $payload['stock'] : ( isset( $payload['stock_quantity'] ) ? $payload['stock_quantity'] : 0 ) );
			$shipping_data = ( isset( $payload['shipping_data'] ) && is_array( $payload['shipping_data'] ) ) ? $payload['shipping_data'] : array();
			$legacy_type = self::as_text( isset( $payload['type'] ) ? $payload['type'] : '' );
			$product_type = in_array( $legacy_type, array( 'simple', 'variable' ), true )
				? $legacy_type
				: ( ( ! empty( $variations ) ) ? 'variable' : 'simple' );
			$effective_sku = '' !== $legacy_sku ? $legacy_sku : $product_id;

			$normalized = array(
				'product_title' => $product_title,
				'product_id' => $product_id,
				'supplier_id' => $supplier_id,
				'regular_price' => $regular_price,
				'sale_price' => $sale_price,
				'currency' => $currency,
				'description' => $description,
				'images' => $images,
				'attributes' => $attributes,
				'variations' => $variations,
				'stock' => $stock,
				'shipping_data' => $shipping_data,
				'source_type' => self::sanitize_source_type( isset( $payload['source_type'] ) ? $payload['source_type'] : $source_type ),
				'validation_warnings' => ( isset( $payload['validation_warnings'] ) && is_array( $payload['validation_warnings'] ) ) ? $payload['validation_warnings'] : array(),

				// Backward-compatible keys used by existing import internals.
				'title' => $product_title,
				'type' => $product_type,
				'sku' => $effective_sku,
				'price' => '' !== $sale_price ? $sale_price : $regular_price,
				'short_description' => $description,
				'stock_quantity' => $stock,
				'ali_currency' => $currency,
				'cost_of_product' => '' !== $regular_price ? $regular_price : '0.00',
				'ali_store_name' => $supplier_id,
				'ali_product_url' => isset( $payload['ali_product_url'] ) ? esc_url_raw( $payload['ali_product_url'] ) : '',
				'ali_store_url' => isset( $payload['ali_store_url'] ) ? esc_url_raw( $payload['ali_store_url'] ) : '',
				'ali_store_price_range' => isset( $payload['ali_store_price_range'] ) ? (string) $payload['ali_store_price_range'] : ( '' !== $regular_price ? $regular_price : '' ),
			);

			$normalized['validation_warnings'] = self::collect_validation_warnings( $normalized );

			return $normalized;
		}
	}
}