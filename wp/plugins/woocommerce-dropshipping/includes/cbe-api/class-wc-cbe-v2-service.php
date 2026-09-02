<?php

require_once __DIR__ . '/class-wc-cbe-v2-flags-service.php';
require_once __DIR__ . '/class-wc-cbe-v2-telemetry-service.php';
require_once __DIR__ . '/class-wc-cbe-v2-imports-service.php';
require_once __DIR__ . '/class-wc-cbe-v2-source-adapter.php';
require_once __DIR__ . '/class-wc-cbe-v2-product-import-schema.php';

if ( ! class_exists( 'WC_CBE_V2_Service' ) ) {

	class WC_CBE_V2_Service {

		public static function default_feature_flags() {
			return WC_CBE_V2_Flags_Service::default_feature_flags();
		}

		public static function feature_flags() {
			return WC_CBE_V2_Flags_Service::feature_flags();
		}

		public static function get_import_store() {
			return WC_CBE_V2_Imports_Service::get_import_store();
		}

		public static function save_import_store( $store ) {
			WC_CBE_V2_Imports_Service::save_import_store( $store );
		}

		public static function get_telemetry_store() {
			return WC_CBE_V2_Telemetry_Service::get_telemetry_store();
		}

		public static function save_telemetry_store( $entries ) {
			WC_CBE_V2_Telemetry_Service::save_telemetry_store( $entries );
		}

		public static function get_payload( $request ) {
			$payload = $request->get_json_params();
			if ( ! is_array( $payload ) ) {
				$payload = array();
			}

			return $payload;
		}

		public static function extract_result( $result ) {
			if ( is_wp_error( $result ) ) {
				$status = (int) $result->get_error_data( 'status' );
				if ( $status <= 0 ) {
					$status = 400;
				}

				return array(
					'ok' => false,
					'status' => $status,
					'message' => $result->get_error_message(),
					'raw' => array(
						'code' => $result->get_error_code(),
						'data' => $result->get_error_data(),
					),
				);
			}

			if ( is_array( $result ) ) {
				$is_success = ( isset( $result['code'] ) && 'success' === $result['code'] );
				$status = 200;
				if ( isset( $result['data']['status'] ) ) {
					$status = (int) $result['data']['status'];
				}

				return array(
					'ok' => $is_success,
					'status' => $status,
					'message' => isset( $result['message'] ) ? (string) $result['message'] : ( $is_success ? 'Import completed.' : 'Import failed.' ),
					'raw' => $result,
				);
			}

			return array(
				'ok' => false,
				'status' => 500,
				'message' => 'Unexpected import response.',
				'raw' => array(),
			);
		}

		public static function execute_import( $kind, $product_payload, $source_type = 'SCRAPE_FALLBACK' ) {
			$schema_payload = WC_CBE_V2_Product_Import_Schema::normalize( $product_payload, $source_type );
			$adapted_payload = WC_CBE_V2_Source_Adapter::normalize( $source_type, $schema_payload );
			$normalized_payload = self::normalize_import_payload( $kind, $adapted_payload );
			$internal_request = new WP_REST_Request( 'POST', '/woo-aliexpress/v1/product' );
			$internal_request->set_header( 'content-type', 'application/json' );
			$internal_request->set_body( wp_json_encode( $normalized_payload ) );

			if ( 'woo-product-update' === $kind ) {
				$result = update_ali_product_in_woo( $internal_request );
			} else {
				$result = import_ali_product_in_woo( $internal_request );
			}

			return self::extract_result( $result );
		}

		private static function normalize_import_payload( $kind, $payload ) {
			if ( ! is_array( $payload ) ) {
				$payload = array();
			}

			$title = isset( $payload['title'] ) ? sanitize_text_field( $payload['title'] ) : '';
			$sku = isset( $payload['sku'] ) ? sanitize_text_field( $payload['sku'] ) : '';
			$ali_product_url = isset( $payload['ali_product_url'] ) ? esc_url_raw( $payload['ali_product_url'] ) : '';

			$type = isset( $payload['type'] ) ? sanitize_text_field( $payload['type'] ) : '';
			if ( ! in_array( $type, array( 'simple', 'variable' ), true ) ) {
				$type = ( isset( $payload['variations'] ) && is_array( $payload['variations'] ) && ! empty( $payload['variations'] ) ) ? 'variable' : 'simple';
			}

			$price = isset( $payload['price'] ) ? $payload['price'] : ( isset( $payload['regular_price'] ) ? $payload['regular_price'] : '' );
			$regular_price = isset( $payload['regular_price'] ) ? $payload['regular_price'] : $price;

			$images = array();
			if ( isset( $payload['images'] ) && is_array( $payload['images'] ) ) {
				foreach ( $payload['images'] as $image ) {
					if ( is_string( $image ) ) {
						$image_url = esc_url_raw( $image );
						if ( ! empty( $image_url ) ) {
							$images[] = array( 'src' => $image_url );
						}
						continue;
					}

					if ( is_array( $image ) && isset( $image['src'] ) ) {
						$image_url = esc_url_raw( $image['src'] );
						if ( ! empty( $image_url ) ) {
							$images[] = array( 'src' => $image_url );
						}
					}
				}
			}

			$ali_store_url = isset( $payload['ali_store_url'] ) ? esc_url_raw( $payload['ali_store_url'] ) : '';
			if ( empty( $ali_store_url ) && ! empty( $ali_product_url ) ) {
				$parts = wp_parse_url( $ali_product_url );
				if ( isset( $parts['scheme'] ) && isset( $parts['host'] ) ) {
					$ali_store_url = $parts['scheme'] . '://' . $parts['host'] . '/store';
				}
			}

			$normalized = array(
				'title' => $title,
				'type' => $type,
				'sku' => $sku,
				'price' => $price,
				'regular_price' => $regular_price,
				'sale_price' => isset( $payload['sale_price'] ) ? $payload['sale_price'] : '',
				'description' => isset( $payload['description'] ) ? (string) $payload['description'] : '',
				'short_description' => isset( $payload['short_description'] ) ? (string) $payload['short_description'] : '',
				'manage_stock' => true,
				'stock_quantity' => isset( $payload['stock_quantity'] ) ? absint( $payload['stock_quantity'] ) : 1,
				'variations' => array(),
				'number_of_orders' => isset( $payload['number_of_orders'] ) ? $payload['number_of_orders'] : 0,
				'cost_of_product' => isset( $payload['cost_of_product'] ) ? $payload['cost_of_product'] : $regular_price,
				'ali_product_url' => $ali_product_url,
				'ali_store_url' => $ali_store_url,
				'ali_store_name' => isset( $payload['ali_store_name'] ) ? sanitize_text_field( $payload['ali_store_name'] ) : 'AliExpress',
				'ali_store_price_range' => isset( $payload['ali_store_price_range'] ) ? (string) $payload['ali_store_price_range'] : (string) $regular_price,
				'ali_currency' => isset( $payload['ali_currency'] ) ? sanitize_text_field( $payload['ali_currency'] ) : 'USD',
			);

			if ( ! empty( $images ) ) {
				$normalized['images'] = $images;
			}

			if ( isset( $payload['categories'] ) && is_array( $payload['categories'] ) && ! empty( $payload['categories'] ) ) {
				$normalized['categories'] = $payload['categories'];
			}

			if ( isset( $payload['tags'] ) && is_array( $payload['tags'] ) && ! empty( $payload['tags'] ) ) {
				$normalized['tags'] = $payload['tags'];
			}

			if ( isset( $payload['attributes'] ) && is_array( $payload['attributes'] ) && ! empty( $payload['attributes'] ) ) {
				$normalized['attributes'] = $payload['attributes'];
			}

			if ( isset( $payload['default_attributes'] ) && is_array( $payload['default_attributes'] ) && ! empty( $payload['default_attributes'] ) ) {
				$normalized['default_attributes'] = $payload['default_attributes'];
			}

			if ( isset( $payload['variations'] ) && is_array( $payload['variations'] ) && ! empty( $payload['variations'] ) ) {
				$normalized['variations'] = $payload['variations'];
			}

			if ( 'woo-product-update' === $kind && isset( $payload['manage_stock'] ) && is_bool( $payload['manage_stock'] ) ) {
				$normalized['manage_stock'] = $payload['manage_stock'];
			}

			return $normalized;
		}

		public static function validate_kind( $kind ) {
			return WC_CBE_V2_Imports_Service::validate_kind( $kind );
		}

		public static function telemetry_create( WP_REST_Request $request ) {
			return WC_CBE_V2_Telemetry_Service::telemetry_create( $request );
		}

		public static function telemetry_list( WP_REST_Request $request ) {
			return WC_CBE_V2_Telemetry_Service::telemetry_list( $request );
		}

		public static function import_preview( WP_REST_Request $request ) {
			return WC_CBE_V2_Imports_Service::import_preview( $request );
		}

		public static function import_create( WP_REST_Request $request ) {
			return WC_CBE_V2_Imports_Service::import_create( $request );
		}

		public static function import_list( WP_REST_Request $request ) {
			return WC_CBE_V2_Imports_Service::import_list( $request );
		}

		public static function import_get( WP_REST_Request $request ) {
			return WC_CBE_V2_Imports_Service::import_get( $request );
		}

		public static function import_retry( WP_REST_Request $request ) {
			return WC_CBE_V2_Imports_Service::import_retry( $request );
		}

		public static function import_retry_failed() {
			return WC_CBE_V2_Imports_Service::import_retry_failed();
		}

		public static function import_clear_completed() {
			return WC_CBE_V2_Imports_Service::import_clear_completed();
		}
	}
}
