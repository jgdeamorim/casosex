<?php

if ( ! class_exists( 'WC_CBE_V2_Telemetry_Service' ) ) {

	class WC_CBE_V2_Telemetry_Service {

		public static function record_event( $event, $meta = array(), $at = 0 ) {
			$event = sanitize_text_field( $event );
			if ( empty( $event ) ) {
				return false;
			}

			$entries = self::get_telemetry_store();
			$entries[] = array(
				'event' => $event,
				'meta' => is_array( $meta ) ? $meta : array(),
				'at' => $at > 0 ? (int) $at : round( microtime( true ) * 1000 ),
			);

			if ( count( $entries ) > 300 ) {
				$entries = array_slice( $entries, -300 );
			}

			self::save_telemetry_store( $entries );
			return true;
		}

		public static function get_telemetry_store() {
			$entries = get_option( 'woo_aliexpress_v2_telemetry', array() );
			if ( ! is_array( $entries ) ) {
				return array();
			}

			return $entries;
		}

		public static function save_telemetry_store( $entries ) {
			update_option( 'woo_aliexpress_v2_telemetry', array_values( $entries ), false );
		}

		public static function telemetry_create( WP_REST_Request $request ) {
			$payload = WC_CBE_V2_Service::get_payload( $request );
			$event = isset( $payload['event'] ) ? sanitize_text_field( $payload['event'] ) : '';

			if ( empty( $event ) ) {
				return new WP_Error( 'bad_request', esc_html__( 'Telemetry event is required.', 'my-text-domain' ), array( 'status' => 400 ) );
			}

			self::record_event(
				$event,
				( isset( $payload['meta'] ) && is_array( $payload['meta'] ) ) ? $payload['meta'] : array(),
				isset( $payload['at'] ) ? (int) $payload['at'] : 0
			);

			return rest_ensure_response(
				array(
					'ok' => true,
					'stored' => true,
				)
			);
		}

		public static function telemetry_list( WP_REST_Request $request ) {
			$entries = self::get_telemetry_store();
			$limit = absint( $request->get_param( 'limit' ) );

			if ( $limit <= 0 ) {
				$limit = 50;
			}

			$limit = min( $limit, 300 );

			return rest_ensure_response(
				array(
					'count' => min( count( $entries ), $limit ),
					'entries' => array_slice( array_reverse( $entries ), 0, $limit ),
				)
			);
		}
	}
}
