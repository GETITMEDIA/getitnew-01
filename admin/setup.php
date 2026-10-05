<?php
/** First run only: creates the admin account. Disabled once data/admin.json exists. */
require __DIR__ . '/_bootstrap.php';

if (admin_configured()) {
    redirect('login.php');
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $user = post_str('username', 60);
    $pass = (string) ($_POST['password'] ?? '');
    $pass2 = (string) ($_POST['password2'] ?? '');
    if (!preg_match('/^[A-Za-z0-9._-]{3,60}$/', $user)) {
        $error = 'Username: 3-60 letters, numbers, dots, dashes or underscores.';
    } elseif (strlen($pass) < 10) {
        $error = 'Password must be at least 10 characters.';
    } elseif (!hash_equals($pass, $pass2)) {
        $error = 'The two passwords do not match.';
    } else {
        $json = json_encode(['username' => $user, 'password_hash' => password_hash($pass, PASSWORD_DEFAULT), 'created_at' => date('c')], JSON_PRETTY_PRINT);
        // x mode: fails if another request created the account first
        $fp = @fopen(ADMIN_FILE, 'x');
        if (!$fp) {
            redirect('login.php');
        }
        fwrite($fp, $json);
        fclose($fp);
        @chmod(ADMIN_FILE, 0600);
        flash('Admin account created. Please log in.');
        redirect('login.php');
    }
}

admin_header('Set up admin');
?>
<section class="ad-card ad-narrow">
  <h1>Create the admin account</h1>
  <p class="ad-muted">This page works once. After the account exists it is switched off.</p>
  <?php if ($error): ?><p class="ad-flash ad-flash--err"><?= h($error) ?></p><?php endif; ?>
  <form method="post" class="ad-form">
    <?= csrf_field() ?>
    <label>Username <input name="username" required pattern="[A-Za-z0-9._-]{3,60}" autocomplete="username" value="<?= h(post_str('username', 60)) ?>"></label>
    <label>Password (10+ characters) <input type="password" name="password" required minlength="10" autocomplete="new-password"></label>
    <label>Confirm password <input type="password" name="password2" required minlength="10" autocomplete="new-password"></label>
    <button class="ad-btn ad-btn--primary" type="submit">Create account</button>
  </form>
</section>
<?php admin_footer();
