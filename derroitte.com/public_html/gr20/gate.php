<?php
// Every request under /gr20 goes through this file (see .htaccess).
// Without the access cookie: password form. With it: the requested file is served.
// Password hash + cookie token live in .secrets.php (not committed, deployed only).
$SECRETS = require __DIR__ . '/.secrets.php';
$HASH  = $SECRETS['hash'];
$TOKEN = $SECRETS['token'];
$COOKIE = 'gr20_access';
header('Cache-Control: private, no-store');

$authed = isset($_COOKIE[$COOKIE]) && hash_equals($TOKEN, (string)$_COOKIE[$COOKIE]);
$error = false;
if (!$authed && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pw'])) {
    if (password_verify(trim($_POST['pw']), $HASH)) {
        setcookie($COOKIE, $TOKEN, ['expires' => time() + 60*60*24*180, 'path' => '/gr20/',
                  'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
        header('Location: /gr20/');
        exit;
    }
    usleep(800000); // slow down guessing
    $error = true;
}

if ($authed) {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $rel = rawurldecode(substr($path, strlen('/gr20/')));
    if ($rel === '' || substr($rel, -1) === '/') $rel .= 'index.html';
    $base = realpath(__DIR__);
    $file = realpath($base . '/' . $rel);
    $ext = strtolower(pathinfo((string)$file, PATHINFO_EXTENSION));
    $types = ['html' => 'text/html; charset=utf-8', 'css' => 'text/css; charset=utf-8',
              'js' => 'application/javascript; charset=utf-8', 'svg' => 'image/svg+xml',
              'png' => 'image/png', 'webp' => 'image/webp', 'jpg' => 'image/jpeg', 'ico' => 'image/x-icon'];
    if ($file && strpos($file, $base . DIRECTORY_SEPARATOR) === 0 && is_file($file) && isset($types[$ext])
        && basename($file)[0] !== '.') {
        header('Content-Type: ' . $types[$ext]);
        header('Content-Length: ' . filesize($file));
        readfile($file);
        exit;
    }
    http_response_code(404);
    echo 'Introuvable';
    exit;
}

http_response_code(401);
?><!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>GR20 · Ben &amp; Nat</title>
<style>
body{margin:0;min-height:100dvh;display:grid;place-items:center;background:#1f4a38;color:#fff4d6;font-family:"Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif}
form{width:min(340px,88vw);text-align:center}
h1{font-size:30px;margin:0 0 6px;letter-spacing:-.5px}h1 em{color:#f6b525;font-style:normal}
p{color:#d3e2d6;margin:0 0 22px}
input{box-sizing:border-box;width:100%;padding:14px 16px;border-radius:10px;border:1px solid #a9d4cc66;background:#2b5c47;color:#fff4d6;font-size:17px;text-align:center}
input:focus{outline:2px solid #f6b525;border-color:transparent}
button{margin-top:12px;width:100%;padding:14px;border:0;border-radius:10px;background:#f6b525;color:#142a20;font-weight:800;font-size:16px;cursor:pointer}
.err{color:#ff8a8a;margin-top:12px;font-size:14px}
</style></head><body><form method="post" action="/gr20/">
<h1>GR20 <em>entre potes</em></h1><p>Entre le mot de passe pour voir la présentation.</p>
<input type="password" name="pw" placeholder="Mot de passe" autofocus required autocomplete="current-password">
<button type="submit">Entrer →</button>
<?php if ($error): ?><div class="err">Ce n’est pas le bon mot de passe.</div><?php endif; ?>
</form></body></html>
