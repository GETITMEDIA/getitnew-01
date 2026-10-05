<?php
/**
 * Local preview only:  php -S 127.0.0.1:8000 tools/dev-router.php
 * PHP's built-in server ignores .htaccess, so this repeats its one rule:
 * /team.html is served by team.php (the admin-managed Team page).
 * Everything else is served as normal files.
 */
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path === '/team.html') {
    chdir(__DIR__ . '/..');
    require __DIR__ . '/../team.php';
    return true;
}
return false;
