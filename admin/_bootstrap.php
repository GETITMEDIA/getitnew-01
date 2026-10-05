<?php
/** Shared by every admin page: session, auth, CSRF, flash messages, layout. */
declare(strict_types=1);

require __DIR__ . '/../includes/team-lib.php';

const ADMIN_FILE = TEAM_ROOT . '/data/admin.json';
const ADMIN_ATTEMPTS = TEAM_ROOT . '/data/login-attempts.json';
const ADMIN_IDLE = 2 * 60 * 60;           // log out after 2 hours idle
const ADMIN_MAX_FAILS = 5;                // per IP ...
const ADMIN_LOCK_SECONDS = 15 * 60;       // ... then locked for 15 minutes
const PUBLIC_TEAM_URL = '../team.html';

$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_name('gm_admin');
session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => $secure, 'httponly' => true, 'samesite' => 'Strict']);
ini_set('session.use_strict_mode', '1');
session_start();

header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header("Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; form-action 'self'; frame-ancestors 'none'");

function admin_configured(): bool
{
    return is_file(ADMIN_FILE);
}

function admin_logged_in(): bool
{
    if (empty($_SESSION['admin_user'])) {
        return false;
    }
    if (time() - ($_SESSION['admin_seen'] ?? 0) > ADMIN_IDLE) {
        $_SESSION = [];
        session_regenerate_id(true);
        return false;
    }
    $_SESSION['admin_seen'] = time();
    return true;
}

function require_login(): void
{
    if (!admin_configured()) {
        redirect('setup.php');
    }
    if (!admin_logged_in()) {
        redirect('login.php');
    }
}

function redirect(string $to): void
{
    header('Location: ' . $to);
    exit;
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf" value="' . h(csrf_token()) . '">';
}

/** Every state-changing request must be a POST carrying the session token. */
function csrf_check(): void
{
    $sent = $_POST['csrf'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !is_string($sent) || !hash_equals(csrf_token(), $sent)) {
        http_response_code(400);
        exit('Invalid or expired form. Go back, reload the page and try again.');
    }
}

function flash(string $msg, string $type = 'ok'): void
{
    $_SESSION['flash'][] = [$type, $msg];
}

/** Trimmed, length-limited string from POST. */
function post_str(string $key, int $max = 500): string
{
    $v = $_POST[$key] ?? '';
    if (!is_string($v)) {
        return '';
    }
    $v = trim(str_replace("\0", '', $v));
    return mb_substr($v, 0, $max);
}

/** URL fields: allow http(s), mailto, tel, site-relative paths and #anchors only. */
function post_url(string $key): string
{
    $v = post_str($key, 500);
    if ($v === '') {
        return '';
    }
    if (preg_match('~^(https?://|mailto:|tel:|#|[a-z0-9_./-]+(\.html|\.php)?(#[\w-]*)?$)~i', $v) && !preg_match('~^\s*javascript:~i', $v)) {
        return $v;
    }
    throw new RuntimeException('"' . $key . '" must be a web link (https://...), mailto:, tel: or a page on this site');
}

function admin_header(string $title): void
{
    $flashes = $_SESSION['flash'] ?? [];
    unset($_SESSION['flash']);
    $user = $_SESSION['admin_user'] ?? null;
    ?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title><?= h($title) ?> | GetIt Media Admin</title>
  <link rel="stylesheet" href="admin.css">
  <script src="admin.js" defer></script>
</head>
<body>
  <header class="ad-top">
    <a class="ad-brand" href="team.php">GetIt Media <span>Admin</span></a>
    <?php if ($user): ?>
      <nav class="ad-nav">
        <a href="team.php">Team Sections</a>
        <a href="<?= h(PUBLIC_TEAM_URL) ?>" target="_blank" rel="noopener">Open Team Page &#8599;</a>
        <form method="post" action="logout.php"><?= csrf_field() ?><button class="ad-link" type="submit">Log out (<?= h($user) ?>)</button></form>
      </nav>
    <?php endif; ?>
  </header>
  <main class="ad-main" data-csrf="<?= h(csrf_token()) ?>">
    <?php foreach ($flashes as [$type, $msg]): ?>
      <p class="ad-flash ad-flash--<?= h($type) ?>"><?= h($msg) ?></p>
    <?php endforeach; ?>
<?php
}

function admin_footer(): void
{
    echo "  </main>\n</body>\n</html>\n";
}
