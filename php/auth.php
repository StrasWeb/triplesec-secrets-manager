<?php

require_once 'conf.php';
/**
 * HTTP Digest Authentication.
 *
 * @return void
 * */
function auth()
{
    global $nonce, $config;
    header('HTTP/1.1 401 Unauthorized');
    header(
        'WWW-Authenticate: Digest realm="'.REALM.'"'.
        ', qop="auth", nonce="'.$nonce.
        '", opaque="'.md5(REALM).'"'
    );
    exit;
}
$nonce = md5(
    $_SERVER['REMOTE_ADDR'].':'.SALT.':'.
    $_SERVER['HTTP_HOST'].':'.date('zo')
);

if (empty($_SERVER['PHP_AUTH_DIGEST'])
    && empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])
) {
    auth();
} else {
    if (empty($_SERVER['PHP_AUTH_DIGEST'])) {
        $auth = explode(', ', $_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
    } else {
        $auth = explode(', ', $_SERVER['PHP_AUTH_DIGEST']);
    }
    foreach ($auth as $value) {
        $arr = explode('=', str_replace('"', '', $value));
        $auth[$arr[0]] = $arr[1];
    }
    $valid = md5(
        AUTH.':'.$nonce.':'.$auth['nc'].':'.
        $auth['cnonce'].':'.$auth['qop'].':'.
        md5(
            $_SERVER['REQUEST_METHOD'].':'.$_SERVER['REQUEST_URI']
        )
    );

    if ((isset($auth)
        && $auth['opaque'] == md5(REALM)
        && $auth['response'] == $valid)
    ) {
    } else {
        echo json_encode(['error' => 'Invalid credentials']).PHP_EOL;
        auth();
    }
}
