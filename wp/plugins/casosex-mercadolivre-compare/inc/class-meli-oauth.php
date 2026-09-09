<?php
/**
 * Gerenciador de Autenticação OAuth 2.0 Mercado Livre
 * ADR-0239
 */

if (!defined('ABSPATH')) {
    exit;
}

class CasoSex_MeLi_OAuth {

    const TOKEN_TRANSIENT = 'casosex_meli_access_token';
    const ENV_PATH = '/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/adsentice/.secret/.env.MERCADOLIVRE';

    public static function get_credentials() {
        // Valores default das credenciais oficiais registradas
        $app_id = '5355247799238397';
        $secret = 'sdZajGGk578WQwB6Qnl7wVDntjvErh0T';

        if (file_exists(self::ENV_PATH) && is_readable(self::ENV_PATH)) {
            $lines = file(self::ENV_PATH, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || $line[0] === '#') continue;
                if (stripos($line, 'ID do aplicativo:') !== false) {
                    $parts = explode(':', $line, 2);
                    $app_id = trim($parts[1]);
                } elseif (stripos($line, 'Chave secreta:') !== false) {
                    $parts = explode(':', $line, 2);
                    $secret = trim($parts[1]);
                }
            }
        }

        return [
            'app_id' => $app_id,
            'secret' => $secret
        ];
    }

    public static function get_access_token($force_refresh = false) {
        if (!$force_refresh) {
            $cached = get_transient(self::TOKEN_TRANSIENT);
            if (!empty($cached)) {
                return $cached;
            }
        }

        $creds = self::get_credentials();
        if (empty($creds['app_id']) || empty($creds['secret'])) {
            return new WP_Error('missing_credentials', 'Credenciais do Mercado Livre não configuradas.');
        }

        $response = wp_remote_post('https://api.mercadolibre.com/oauth/token', [
            'timeout' => 15,
            'headers' => [
                'Content-Type' => 'application/x-www-form-urlencoded'
            ],
            'body' => [
                'grant_type'    => 'client_credentials',
                'client_id'     => $creds['app_id'],
                'client_secret' => $creds['secret']
            ]
        ]);

        if (is_wp_error($response)) {
            return $response;
        }

        $code = wp_remote_retrieve_response_code($response);
        $body = json_decode(wp_remote_retrieve_body($response), true);

        if ($code !== 200 || empty($body['access_token'])) {
            return new WP_Error('oauth_error', 'Falha ao autenticar no Mercado Livre: ' . wp_remote_retrieve_body($response));
        }

        $token = $body['access_token'];
        $expires_in = isset($body['expires_in']) ? intval($body['expires_in']) - 300 : 21000;
        set_transient(self::TOKEN_TRANSIENT, $token, $expires_in);

        return $token;
    }
}
