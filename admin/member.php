<?php
/** Add a member (?section=) or edit one (?section=&id=), including the photo. */
require __DIR__ . '/_bootstrap.php';
require_login();

$data = team_load();
$sid = (string) ($_GET['section'] ?? '');
$mid = (string) ($_GET['id'] ?? '');
$isNew = $mid === '';
$sec = null;
foreach ($data['sections'] as $s) {
    if ($s['id'] === $sid) {
        $sec = $s;
    }
}
if (!$sec) {
    flash('That section no longer exists.', 'err');
    redirect('team.php');
}
$mem = ['status' => 'active', 'department' => ($sec['kicker'] ?? '') ?: $sec['title']];
$position = count($sec['members']) + 1;
if (!$isNew) {
    $i = array_search($mid, array_column($sec['members'], 'id'), true);
    if ($i === false) {
        flash('That member no longer exists.', 'err');
        redirect('members.php?section=' . rawurlencode($sid));
    }
    $mem = $sec['members'][$i];
    $position = $i + 1;
}
$back = 'members.php?section=' . rawurlencode($sid);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $uploaded = null;
    try {
        $name = post_str('name', 80);
        if ($name === '') {
            throw new RuntimeException('Name is required.');
        }
        $email = post_str('email', 120);
        if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new RuntimeException('Email address is not valid.');
        }
        $phone = post_str('phone', 30);
        if ($phone !== '' && !preg_match('/^[0-9+()\-\s]{6,30}$/', $phone)) {
            throw new RuntimeException('Phone number can only contain digits, spaces, +, - and brackets.');
        }
        $fields = [
            'name' => $name,
            'designation' => post_str('designation', 100),
            'department' => post_str('department', 80),
            'description' => post_str('description', 1000),
            'alt' => post_str('alt', 150),
            'initials' => mb_strtoupper(post_str('initials', 3)),
            'email' => $email,
            'phone' => $phone,
            'linkedin' => post_url('linkedin'),
            'instagram' => post_url('instagram'),
            'facebook' => post_url('facebook'),
            'website' => post_url('website'),
            'skills' => post_str('skills', 300),
            'experience' => post_str('experience', 100),
            'handle' => post_str('handle', 40),
            'badge' => post_str('badge', 20),
            'note' => implode("\n", array_filter(array_map('trim', explode('/', post_str('note', 80))), 'strlen')),
            'card_link' => post_url('card_link'),
            'card_link_label' => post_str('card_link_label', 80),
            'status' => post_str('status', 10) === 'hidden' ? 'hidden' : 'active',
        ];
        if (!empty($_FILES['photo']) && ($_FILES['photo']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
            $uploaded = team_store_upload($_FILES['photo'], $name);
            $fields['image'] = $uploaded;
        } elseif (!empty($_POST['remove_photo'])) {
            $fields['image'] = '';
        }
        $pos = max(1, (int) ($_POST['position'] ?? 1));
        $oldImage = $mem['image'] ?? '';

        team_update(function (array &$d) use ($sid, $mid, $isNew, $fields, $pos) {
            $s = &team_find_section($d, $sid);
            if ($isNew) {
                // + keeps the left-hand value, so the uploaded image must come before the '' default
                $item = ['id' => team_new_id('mem')] + $fields + ['image' => ''];
            } else {
                $i = array_search($mid, array_column($s['members'], 'id'), true);
                if ($i === false) {
                    throw new RuntimeException('That member was deleted meanwhile.');
                }
                $item = array_merge($s['members'][$i], $fields);
                array_splice($s['members'], $i, 1);
            }
            array_splice($s['members'], min($pos - 1, count($s['members'])), 0, [$item]);
        });
        if (array_key_exists('image', $fields) && $oldImage !== $fields['image']) {
            team_delete_upload($oldImage); // only removes photos uploaded through the admin
        }
        flash($isNew ? $name . ' added.' : 'Changes to ' . $name . ' saved.');
        redirect($back);
    } catch (Throwable $e) {
        if ($uploaded) {
            team_delete_upload($uploaded);
        }
        flash($e->getMessage(), 'err');
        redirect('member.php?section=' . rawurlencode($sid) . ($isNew ? '' : '&id=' . rawurlencode($mid)));
    }
}

$mod = $sec['module'];
$v = fn(string $k) => h((string) ($mem[$k] ?? ''));
admin_header($isNew ? 'Add Team Member' : 'Edit Member');
?>
<div class="ad-pagehead">
  <h1><?= $isNew ? 'Add Team Member' : 'Edit Member' ?> <span class="ad-muted">&middot; <?= h(($sec['kicker'] ?? '') ?: $sec['title']) ?></span></h1>
  <a class="ad-btn" href="<?= h($back) ?>">&larr; Back to members</a>
</div>

<form method="post" enctype="multipart/form-data" class="ad-card ad-form">
  <?= csrf_field() ?>
  <fieldset>
    <legend>Profile Photo</legend>
    <div class="ad-photo">
      <div class="ad-member__photo ad-member__photo--lg">
        <?php if (!empty($mem['image'])): ?><img src="../<?= $v('image') ?>" alt="Current photo"><?php else: ?><span><?= h(team_initials($mem + ['name' => ''])) ?></span><?php endif; ?>
      </div>
      <div>
        <label><?= empty($mem['image']) ? 'Upload Photo' : 'Change Photo' ?>
          <input type="file" name="photo" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"></label>
        <small>JPG, JPEG, PNG or WEBP, up to 5 MB. Portrait photos work best.</small>
        <?php if (!empty($mem['image'])): ?>
          <label class="ad-check"><input type="checkbox" name="remove_photo" value="1"> Remove current photo (initials are shown instead)</label>
        <?php endif; ?>
      </div>
    </div>
  </fieldset>

  <div class="ad-grid">
    <label>Name *<input name="name" required maxlength="80" value="<?= $v('name') ?>"></label>
    <label>Designation<input name="designation" maxlength="100" value="<?= $v('designation') ?>">
      <?php if ($mod === 'founder'): ?><small>Separate titles with | e.g. Founder | Project Leader</small><?php endif; ?></label>
    <label>Department<input name="department" maxlength="80" value="<?= $v('department') ?>"></label>
    <label>Experience<input name="experience" maxlength="100" value="<?= $v('experience') ?>" placeholder="e.g. 5 years"></label>
    <label class="ad-span2">Description<textarea name="description" rows="3" maxlength="1000"><?= $v('description') ?></textarea></label>
    <label class="ad-span2">Skills<input name="skills" maxlength="300" value="<?= $v('skills') ?>" placeholder="Comma separated"></label>
    <label>Email<input type="email" name="email" maxlength="120" value="<?= $v('email') ?>"></label>
    <label>Phone<input name="phone" maxlength="30" value="<?= $v('phone') ?>"></label>
    <label>LinkedIn<input name="linkedin" maxlength="300" value="<?= $v('linkedin') ?>" placeholder="https://"></label>
    <label>Instagram<input name="instagram" maxlength="300" value="<?= $v('instagram') ?>" placeholder="https://"></label>
    <label>Facebook<input name="facebook" maxlength="300" value="<?= $v('facebook') ?>" placeholder="https://"></label>
    <label>Website<input name="website" maxlength="300" value="<?= $v('website') ?>" placeholder="https://"></label>
  </div>

  <fieldset>
    <legend>Card details</legend>
    <div class="ad-grid">
      <label>Initials<input name="initials" maxlength="3" value="<?= $v('initials') ?>"><small>Shown if the photo fails to load. Blank = from the name.</small></label>
      <label>Photo description (alt text)<input name="alt" maxlength="150" value="<?= $v('alt') ?>"><small>Blank = "Name, Designation".</small></label>
      <?php if ($mod === 'social'): ?>
        <label>Story handle<input name="handle" maxlength="40" value="<?= $v('handle') ?>" placeholder="@name"></label>
        <label>Story badge<input name="badge" maxlength="20" value="<?= $v('badge') ?>" placeholder="live"><small>Optional small badge, e.g. "live".</small></label>
      <?php endif; ?>
      <?php if ($mod === 'development'): ?>
        <label>Card note<input name="note" maxlength="80" value="<?= h(str_replace("\n", ' / ', (string) ($mem['note'] ?? ''))) ?>" data-lines placeholder="Code / Test / Ship"><small>Handwritten note on the card. Separate lines with /</small></label>
        <label>Card arrow link<input name="card_link" maxlength="300" value="<?= $v('card_link') ?>" placeholder="#dept-design"></label>
        <label>Card arrow label<input name="card_link_label" maxlength="80" value="<?= $v('card_link_label') ?>"></label>
      <?php endif; ?>
    </div>
  </fieldset>

  <div class="ad-grid">
    <label>Display Order
      <select name="position">
        <?php for ($p = 1; $p <= count($sec['members']) + ($isNew ? 1 : 0); $p++): ?>
          <option value="<?= $p ?>"<?= $p === $position ? ' selected' : '' ?>>Position <?= $p ?></option>
        <?php endfor; ?>
      </select></label>
    <label>Status
      <select name="status">
        <option value="active"<?= ($mem['status'] ?? '') === 'active' ? ' selected' : '' ?>>Active (shown)</option>
        <option value="hidden"<?= ($mem['status'] ?? '') === 'hidden' ? ' selected' : '' ?>>Hidden</option>
      </select></label>
  </div>

  <div class="ad-actions">
    <button class="ad-btn ad-btn--primary" type="submit"><?= $isNew ? 'Save Member' : 'Save Changes' ?></button>
    <a class="ad-btn" href="<?= h($back) ?>">Cancel</a>
  </div>
</form>
<?php admin_footer();
