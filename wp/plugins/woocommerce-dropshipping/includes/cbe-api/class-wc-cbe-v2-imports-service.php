<?php

if ( ! class_exists( 'WC_CBE_V2_Imports_Service' ) ) {

	class WC_CBE_V2_Imports_Service {

		public static function get_import_store() {
			$store = get_option( 'woo_aliexpress_v2_import_store', array() );

			if ( ! is_array( $store ) ) {
				$store = array();
			}

			if ( ! isset( $store['next_id'] ) || ! is_numeric( $store['next_id'] ) ) {
				$store['next_id'] = 1;
			}

			if ( ! isset( $store['items'] ) || ! is_array( $store['items'] ) ) {
				$store['items'] = array();
			}

			return $store;
		}

		public static function save_import_store( $store ) {
			update_option( 'woo_aliexpress_v2_import_store', $store, false );
		}

		public static function validate_kind( $kind ) {
			return in_array( $kind, array( 'woo-product-create', 'woo-product-update' ), true );
		}

		private static function find_duplicate_product_id( $product_payload ) {
			if ( ! is_array( $product_payload ) || ! isset( $product_payload['sku'] ) ) {
				return 0;
			}

			$sku = sanitize_text_field( (string) $product_payload['sku'] );
			if ( '' === $sku || ! function_exists( 'wc_get_product_id_by_sku' ) ) {
				return 0;
			}

			$existing_id = (int) wc_get_product_id_by_sku( $sku );
			return $existing_id > 0 ? $existing_id : 0;
		}

		private static function record_import_telemetry( $event, $meta = array() ) {
			if ( class_exists( 'WC_CBE_V2_Telemetry_Service' ) ) {
				WC_CBE_V2_Telemetry_Service::record_event( $event, $meta );
			}
		}

		public static function import_preview( WP_REST_Request $request ) {
			$payload = WC_CBE_V2_Service::get_payload( $request );
			$source_type = isset( $payload['source_type'] ) ? sanitize_text_field( $payload['source_type'] ) : 'SCRAPE_FALLBACK';
			$product_payload = ( isset( $payload['payload'] ) && is_array( $payload['payload'] ) ) ? $payload['payload'] : array();
			$normalized_payload = WC_CBE_V2_Product_Import_Schema::normalize( $product_payload, $source_type );

			$warnings = ( isset( $normalized_payload['validation_warnings'] ) && is_array( $normalized_payload['validation_warnings'] ) )
				? $normalized_payload['validation_warnings']
				: array();
			$images = ( isset( $normalized_payload['images'] ) && is_array( $normalized_payload['images'] ) ) ? $normalized_payload['images'] : array();

			return rest_ensure_response(
				array(
					'title' => isset( $normalized_payload['product_title'] ) ? (string) $normalized_payload['product_title'] : '',
					'price' => isset( $normalized_payload['sale_price'] ) && '' !== $normalized_payload['sale_price']
						? $normalized_payload['sale_price']
						: ( isset( $normalized_payload['regular_price'] ) ? $normalized_payload['regular_price'] : null ),
					'images' => array_slice( $images, 0, 8 ),
					'variationsCount' => ( isset( $normalized_payload['variations'] ) && is_array( $normalized_payload['variations'] ) ) ? count( $normalized_payload['variations'] ) : 0,
					'validationWarnings' => $warnings,
					'validation_warnings' => $warnings,
					'sourceUsed' => 'v2-preview',
					'source_type' => isset( $normalized_payload['source_type'] ) ? $normalized_payload['source_type'] : $source_type,
					'sourceUrl' => isset( $payload['sourceUrl'] ) ? esc_url_raw( $payload['sourceUrl'] ) : '',
				)
			);
		}

		public static function import_create( WP_REST_Request $request ) {
			$payload = WC_CBE_V2_Service::get_payload( $request );
			$kind = isset( $payload['kind'] ) ? sanitize_text_field( $payload['kind'] ) : 'woo-product-create';
			$started_at = microtime( true );

			if ( ! self::validate_kind( $kind ) ) {
				return new WP_Error( 'bad_request', esc_html__( 'Invalid import kind.', 'my-text-domain' ), array( 'status' => 400 ) );
			}

			$product_payload = ( isset( $payload['payload'] ) && is_array( $payload['payload'] ) ) ? $payload['payload'] : array();
			if ( empty( $product_payload ) ) {
				return new WP_Error( 'bad_request', esc_html__( 'Import payload is required.', 'my-text-domain' ), array( 'status' => 400 ) );
			}

			$source_type = isset( $payload['source_type'] ) ? sanitize_text_field( $payload['source_type'] ) : 'SCRAPE_FALLBACK';
			$normalized_payload = WC_CBE_V2_Product_Import_Schema::normalize( $product_payload, $source_type );
			$source_type = isset( $normalized_payload['source_type'] ) ? $normalized_payload['source_type'] : $source_type;
			$warnings = ( isset( $normalized_payload['validation_warnings'] ) && is_array( $normalized_payload['validation_warnings'] ) )
				? $normalized_payload['validation_warnings']
				: array();

			$now_ms = round( microtime( true ) * 1000 );
			$store = self::get_import_store();
			$import_id = (int) $store['next_id'];
			$store['next_id'] = $import_id + 1;
			$duplicate_of = self::find_duplicate_product_id( $normalized_payload );

			if ( 'woo-product-create' === $kind && $duplicate_of > 0 ) {
				$duration_ms = (int) round( ( microtime( true ) - $started_at ) * 1000 );
				$message = sprintf( 'Duplicate SKU detected. Existing product ID: %d.', $duplicate_of );

				$record = array(
					'id' => $import_id,
					'kind' => $kind,
					'sourceUrl' => isset( $payload['sourceUrl'] ) ? esc_url_raw( $payload['sourceUrl'] ) : '',
					'captureJobId' => isset( $payload['captureJobId'] ) ? absint( $payload['captureJobId'] ) : 0,
					'source_type' => $source_type,
					'duplicate_of' => $duplicate_of,
					'validation_warnings' => array_merge( $warnings, array( 'duplicate_sku' ) ),
					'payload' => $normalized_payload,
					'attempts' => 0,
					'status' => 'failed',
					'lastError' => $message,
					'createdAt' => $now_ms,
					'updatedAt' => $now_ms,
					'result' => array(
						'httpStatus' => 409,
						'message' => $message,
					),
				);

				$store['items'][ (string) $import_id ] = $record;
				self::save_import_store( $store );

				self::record_import_telemetry(
					'import_failure',
					array(
						'import_id' => $import_id,
						'kind' => $kind,
						'source_type' => $source_type,
						'reason' => 'duplicate_sku',
						'duplicate_of' => $duplicate_of,
						'queue_processing_ms' => $duration_ms,
					)
				);

				self::record_import_telemetry(
					'queue_processing_time',
					array(
						'import_id' => $import_id,
						'kind' => $kind,
						'ms' => $duration_ms,
					)
				);

				return rest_ensure_response(
					array(
						'importId' => $import_id,
						'promotedJobId' => $import_id,
						'status' => $record['status'],
						'message' => $message,
						'lastError' => $record['lastError'],
						'source_type' => $source_type,
						'duplicate_of' => $duplicate_of,
						'validation_warnings' => $record['validation_warnings'],
					)
				);
			}

			$execution = WC_CBE_V2_Service::execute_import( $kind, $normalized_payload, $source_type );
			$duration_ms = (int) round( ( microtime( true ) - $started_at ) * 1000 );

			$record = array(
				'id' => $import_id,
				'kind' => $kind,
				'sourceUrl' => isset( $payload['sourceUrl'] ) ? esc_url_raw( $payload['sourceUrl'] ) : '',
				'captureJobId' => isset( $payload['captureJobId'] ) ? absint( $payload['captureJobId'] ) : 0,
				'source_type' => $source_type,
				'duplicate_of' => $duplicate_of,
				'validation_warnings' => $warnings,
				'payload' => $normalized_payload,
				'attempts' => 1,
				'status' => $execution['ok'] ? 'completed' : 'failed',
				'lastError' => $execution['ok'] ? null : $execution['message'],
				'createdAt' => $now_ms,
				'updatedAt' => $now_ms,
				'result' => array(
					'httpStatus' => $execution['status'],
					'message' => $execution['message'],
				),
			);

			$store['items'][ (string) $import_id ] = $record;
			self::save_import_store( $store );

			self::record_import_telemetry(
				$execution['ok'] ? 'import_success' : 'import_failure',
				array(
					'import_id' => $import_id,
					'kind' => $kind,
					'source_type' => $source_type,
					'status' => $record['status'],
					'http_status' => $execution['status'],
					'queue_processing_ms' => $duration_ms,
				)
			);

			self::record_import_telemetry(
				'queue_processing_time',
				array(
					'import_id' => $import_id,
					'kind' => $kind,
					'ms' => $duration_ms,
				)
			);

			if ( 'SCRAPE_FALLBACK' === $source_type ) {
				self::record_import_telemetry(
					'scrape_fallback_used',
					array(
						'import_id' => $import_id,
						'kind' => $kind,
						'validation_warnings' => $warnings,
					)
				);
			}

			return rest_ensure_response(
				array(
					'importId' => $import_id,
					'promotedJobId' => $import_id,
					'status' => $record['status'],
					'message' => $execution['message'],
					'lastError' => $record['lastError'],
					'source_type' => $source_type,
					'duplicate_of' => $duplicate_of,
					'validation_warnings' => $warnings,
				)
			);
		}

		public static function import_list( WP_REST_Request $request ) {
			$store = self::get_import_store();
			$items = array_values( $store['items'] );

			usort(
				$items,
				function ( $a, $b ) {
					$a_updated = isset( $a['updatedAt'] ) ? (int) $a['updatedAt'] : 0;
					$b_updated = isset( $b['updatedAt'] ) ? (int) $b['updatedAt'] : 0;

					if ( $a_updated === $b_updated ) {
						return 0;
					}

					return ( $a_updated > $b_updated ) ? -1 : 1;
				}
			);

			$status = $request->get_param( 'status' );
			if ( ! empty( $status ) ) {
				$items = array_values(
					array_filter(
						$items,
						function ( $item ) use ( $status ) {
							return isset( $item['status'] ) && $item['status'] === $status;
						}
					)
				);
			}

			$limit = absint( $request->get_param( 'limit' ) );
			if ( $limit <= 0 ) {
				$limit = 20;
			}

			$limit = min( $limit, 100 );
			$items = array_slice( $items, 0, $limit );

			return rest_ensure_response(
				array(
					'count' => count( $items ),
					'imports' => $items,
					'jobs' => $items,
				)
			);
		}

		public static function import_get( WP_REST_Request $request ) {
			$id = absint( $request->get_param( 'id' ) );
			$store = self::get_import_store();
			$key = (string) $id;

			if ( ! isset( $store['items'][ $key ] ) ) {
				return new WP_Error( 'not_found', esc_html__( 'Import not found.', 'my-text-domain' ), array( 'status' => 404 ) );
			}

			return rest_ensure_response(
				array(
					'import' => $store['items'][ $key ],
				)
			);
		}

		public static function import_retry( WP_REST_Request $request ) {
			$id = absint( $request->get_param( 'id' ) );
			$store = self::get_import_store();
			$key = (string) $id;

			if ( ! isset( $store['items'][ $key ] ) ) {
				return new WP_Error( 'not_found', esc_html__( 'Import not found.', 'my-text-domain' ), array( 'status' => 404 ) );
			}

			$record = $store['items'][ $key ];
			$execution = WC_CBE_V2_Service::execute_import(
				$record['kind'],
				$record['payload'],
				isset( $record['source_type'] ) ? $record['source_type'] : 'SCRAPE_FALLBACK'
			);

			$record['attempts'] = isset( $record['attempts'] ) ? ( (int) $record['attempts'] + 1 ) : 1;
			$record['status'] = $execution['ok'] ? 'completed' : 'failed';
			$record['lastError'] = $execution['ok'] ? null : $execution['message'];
			$record['updatedAt'] = round( microtime( true ) * 1000 );
			$record['result'] = array(
				'httpStatus' => $execution['status'],
				'message' => $execution['message'],
			);

			$store['items'][ $key ] = $record;
			self::save_import_store( $store );

			self::record_import_telemetry(
				$execution['ok'] ? 'import_success' : 'import_failure',
				array(
					'import_id' => $id,
					'kind' => $record['kind'],
					'source_type' => isset( $record['source_type'] ) ? $record['source_type'] : 'SCRAPE_FALLBACK',
					'retry' => true,
					'attempts' => $record['attempts'],
					'http_status' => $execution['status'],
				)
			);

			self::record_import_telemetry(
				'import_retry',
				array(
					'import_id' => $id,
					'status' => $record['status'],
					'attempts' => $record['attempts'],
				)
			);

			return rest_ensure_response(
				array(
					'importId' => $id,
					'status' => $record['status'],
					'lastError' => $record['lastError'],
					'attempts' => $record['attempts'],
				)
			);
		}

		public static function import_retry_failed() {
			$store = self::get_import_store();
			$affected = 0;

			foreach ( $store['items'] as $key => $record ) {
				if ( ! isset( $record['status'] ) || 'failed' !== $record['status'] ) {
					continue;
				}

				$execution = WC_CBE_V2_Service::execute_import(
					$record['kind'],
					$record['payload'],
					isset( $record['source_type'] ) ? $record['source_type'] : 'SCRAPE_FALLBACK'
				);
				$record['attempts'] = isset( $record['attempts'] ) ? ( (int) $record['attempts'] + 1 ) : 1;
				$record['status'] = $execution['ok'] ? 'completed' : 'failed';
				$record['lastError'] = $execution['ok'] ? null : $execution['message'];
				$record['updatedAt'] = round( microtime( true ) * 1000 );
				$record['result'] = array(
					'httpStatus' => $execution['status'],
					'message' => $execution['message'],
				);

				$store['items'][ $key ] = $record;
				$affected++;

				self::record_import_telemetry(
					$execution['ok'] ? 'import_success' : 'import_failure',
					array(
						'import_id' => isset( $record['id'] ) ? (int) $record['id'] : 0,
						'kind' => $record['kind'],
						'source_type' => isset( $record['source_type'] ) ? $record['source_type'] : 'SCRAPE_FALLBACK',
						'retry' => true,
						'attempts' => $record['attempts'],
						'http_status' => $execution['status'],
					)
				);
			}

			self::save_import_store( $store );

			return rest_ensure_response(
				array(
					'action' => 'retry-failed',
					'affected' => $affected,
				)
			);
		}

		public static function import_clear_completed() {
			$store = self::get_import_store();
			$before = count( $store['items'] );

			$store['items'] = array_filter(
				$store['items'],
				function ( $record ) {
					return ! isset( $record['status'] ) || 'completed' !== $record['status'];
				}
			);

			$store['items'] = array_values( $store['items'] );
			$rekeyed = array();
			foreach ( $store['items'] as $record ) {
				$rekeyed[ (string) $record['id'] ] = $record;
			}
			$store['items'] = $rekeyed;

			self::save_import_store( $store );

			return rest_ensure_response(
				array(
					'action' => 'clear-completed',
					'affected' => $before - count( $store['items'] ),
				)
			);
		}
	}
}
