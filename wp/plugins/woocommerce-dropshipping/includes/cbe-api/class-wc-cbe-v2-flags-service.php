<?php

if ( ! class_exists( 'WC_CBE_V2_Flags_Service' ) ) {

	class WC_CBE_V2_Flags_Service {

		public static function default_feature_flags() {
			$defaults = array(
				'scrapeFallbackEnabled' => true,
				'capturePreviewEnabled' => true,
				'queueStatusUiEnabled' => true,
			);

			return apply_filters( 'woo_aliexpress_v2_feature_flags', $defaults );
		}

		public static function feature_flags() {
			return rest_ensure_response( self::default_feature_flags() );
		}
	}
}
