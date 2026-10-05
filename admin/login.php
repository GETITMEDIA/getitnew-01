<?php
require __DIR__ . '/_bootstrap.php';

if (!admin_configured()) {
    redirect('setup.php');
}
if (admin_logged_in()) {
    redirect('team.php');
}

/** Failed attempts per IP, kept in data/ (not web-readable). */
function attempts_load(): array
{
    $a = is_file(ADMIN_ATTEMPTS) ? json_decode((string) file_get_contents(ADMIN_ATTEMPTS), true) : [];
    $now = time();
    return array_filter(is_array($a) ? $a : [], fn($r) => ($r['until'] ?? 0) > $now || ($now - ($r['last'] ?? 0)) < ADMIN_LOCK_SECONDS);
}

function attempts_save(array $a): void
{
    file_put_contents(ADMIN_ATTEMPTS, json_encode($a), LOCK_EX);
}

$ip = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
$attempts = attempts_load();
$locked = ($attempts[$ip]['until'] ?? 0) > time();
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    if ($locked) {
        $error = 'Too many failed attempts. Try again in a few minutes.';
    } else {
        $cfg = json_decode((string) file_get_contents(ADMIN_FILE), true);
        $user = post_str('username', 60);
        $pass = (string) ($_POST['password'] ?? '');
        $ok = is_array($cfg) && hash_equals((string) $cfg['username'], $user) && password_verify($pass, (string) $cfg['password_hash']);
        if ($ok) {
            unset($attempts[$ip]);
            attempts_save($attempts);
            if (password_needs_rehash($cfg['password_hash'], PASSWORD_DEFAULT)) {
                $cfg['password_hash'] = password_hash($pass, PASSWORD_DEFAULT);
                file_put_contents(ADMIN_FILE, json_encode($cfg, JSON_PRETTY_PRINT), LOCK_EX);
            }
            session_regenerate_id(true);
            $_SESSION['admin_user'] = $cfg['username'];
            $_SESSION['admin_seen'] = time();
            unset($_SESSION['csrf']);
            redirect('team.php');
        }
        $n = ($attempts[$ip]['count'] ?? 0) + 1;
        $attempts[$ip] = ['count' => $n, 'last' => time(), 'until' => $n >= ADMIN_MAX_FAILS ? time() + ADMIN_LOCK_SECONDS : 0];
        attempts_save($attempts);
        usleep(600000); // slow down guessing
        $error = $n >= ADMIN_MAX_FAILS ? 'Too many failed attempts. Try again in 15 minutes.' : 'Wrong username or password.';
    }
}

admin_header('Log in');
?>
<section class="ad-card ad-narrow">
  <h1>Team Page Admin</h1>
  <?php if ($error): ?><p class="ad-flash ad-flash--err"><?= h($error) ?></p><?php endif; ?>
  <form method="post" class="ad-form">
    <?= csrf_field() ?>
    <label>Username <input name="username" required autocomplete="username" autofocus></label>
    <label>Password <input type="password" name="password" required autocomplete="current-password"></label>
    <button class="ad-btn ad-btn--primary" type="submit">Log in</button>
  </form>
</section>
<?php admin_footer();
