<?php
/** Add a new team section, or edit an existing one (?id=). */
require __DIR__ . '/_bootstrap.php';
require_login();

$data = team_load();
$id = (string) ($_GET['id'] ?? '');
$isNew = $id === '';
$sec = null;
if (!$isNew) {
    foreach ($data['sections'] as $s) {
        if ($s['id'] === $id) {
            $sec = $s;
        }
    }
    if (!$sec) {
        flash('That section no longer exists.', 'err');
        redirect('team.php');
    }
}
$sec = $sec ?? ['module' => 'video', 'status' => 'published', 'extra' => [], 'members' => []];
$x = $sec['extra'] ?? [];
$count = count($data['sections']);
$position = $isNew ? $count + 1 : (array_search($id, array_column($data['sections'], 'id'), true) + 1);
$usedSingles = [];
foreach ($data['sections'] as $s) {
    if (TEAM_MODULES[$s['module']]['single'] && $s['id'] !== $id) {
        $usedSingles[$s['module']] = true;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    try {
        $module = post_str('module', 30);
        if (!isset(TEAM_MODULES[$module])) {
            throw new RuntimeException('Choose a design module.');
        }
        if (isset($usedSingles[$module])) {
            throw new RuntimeException('The page already has a "' . TEAM_MODULES[$module]['label'] . '" section. That design can only be used once.');
        }
        $title = post_str('title', 120);
        if ($title === '') {
            throw new RuntimeException('Section title is required.');
        }
        $extra = [];
        if (in_array($module, ['development', 'design'], true)) {
            $extra['bg_word'] = post_str('bg_word', 40);
        }
        if ($module === 'development') {
            $extra['seal_text'] = post_str('seal_text', 80);
        }
        if ($module === 'design') {
            $extra['slug'] = post_str('slug', 120);
        }
        if (in_array($module, ['founder', 'people'], true)) {
            $extra['cta_text'] = post_str('cta_text', 60);
            $extra['cta_link'] = post_url('cta_link');
        }
        if ($module === 'founder') {
            $extra['stats'] = [];
            for ($k = 0; $k < 3; $k++) {
                $extra['stats'][] = ['value' => post_str("stat_value_$k", 20), 'label' => post_str("stat_label_$k", 40)];
            }
            $extra['image_width'] = max(0, (int) ($_POST['image_width'] ?? 0)) ?: null;
            $extra['image_height'] = max(0, (int) ($_POST['image_height'] ?? 0)) ?: null;
        }
        if ($module === 'people') {
            $extra['video'] = post_url('video');
            $extra['duties'] = [];
            for ($k = 0; $k < 4; $k++) {
                $extra['duties'][] = [
                    'icon' => preg_replace('/[^a-z0-9 -]/', '', strtolower(post_str("duty_icon_$k", 60))) ?: 'fa-solid fa-circle',
                    'title' => post_str("duty_title_$k", 60),
                    'text' => post_str("duty_text_$k", 300),
                ];
            }
        }
        $anchor = preg_replace('/[^A-Za-z0-9_-]/', '', str_replace(' ', '-', post_str('anchor', 60)));
        $fields = [
            'module' => $module,
            'title' => $title,
            'kicker' => post_str('kicker', 80),
            'description' => post_str('description', 400),
            'number' => post_str('number', 6),
            'status' => post_str('status', 12) === 'hidden' ? 'hidden' : 'published',
            'extra' => $extra,
        ];
        $pos = max(1, (int) ($_POST['position'] ?? 1));

        $newId = $isNew ? team_new_id('sec') : $id;
        team_update(function (array &$d) use ($isNew, $newId, $fields, $anchor, $pos) {
            $taken = [];
            foreach ($d['sections'] as $s) {
                if ($s['id'] !== $newId) {
                    $taken[$s['anchor'] ?? ''] = true;
                }
            }
            $base = $anchor !== '' ? $anchor : 'dept-' . trim(preg_replace('/[^a-z0-9]+/', '-', strtolower($fields['title'])), '-');
            $a = $base;
            for ($n = 2; isset($taken[$a]); $n++) {
                $a = $base . '-' . $n;
            }
            $fields['anchor'] = $a;

            if ($isNew) {
                $members = [];
                $count = min(50, max(0, (int) ($_POST['initial_count'] ?? 4)));
                for ($k = 0; $k < $count; $k++) {
                    $name = post_str("init_name_$k", 80);
                    $members[] = [
                        'id' => team_new_id('mem'),
                        'name' => $name !== '' ? $name : 'Member ' . ($k + 1),
                        'designation' => post_str("init_role_$k", 80),
                        'department' => $fields['kicker'] ?: $fields['title'],
                        'image' => '',
                        // unnamed slots stay hidden until filled in: no empty cards on the page
                        'status' => $name !== '' ? 'active' : 'hidden',
                    ];
                }
                $item = ['id' => $newId] + $fields + ['members' => $members];
            } else {
                $i = array_search($newId, array_column($d['sections'], 'id'), true);
                if ($i === false) {
                    throw new RuntimeException('That section was deleted meanwhile.');
                }
                $item = array_merge($d['sections'][$i], $fields);
                array_splice($d['sections'], $i, 1);
            }
            array_splice($d['sections'], min($pos - 1, count($d['sections'])), 0, [$item]);
        });
        flash($isNew ? 'Section created. Add photos and details to its members.' : 'Section saved.');
        redirect($isNew ? 'members.php?section=' . rawurlencode($newId) : 'team.php');
    } catch (Throwable $e) {
        flash($e->getMessage(), 'err');
        redirect('section.php' . ($isNew ? '' : '?id=' . rawurlencode($id)));
    }
}

$v = fn(string $k) => h((string) ($sec[$k] ?? ''));
$xv = fn(string $k) => h((string) ($x[$k] ?? ''));
admin_header($isNew ? 'Add New Section' : 'Edit Section');
?>
<div class="ad-pagehead">
  <h1><?= $isNew ? 'Create New Team Section' : 'Edit Section' ?></h1>
  <a class="ad-btn" href="team.php">&larr; Back to sections</a>
</div>

<form method="post" class="ad-card ad-form" data-module-form>
  <?= csrf_field() ?>
  <div class="ad-grid">
    <label>Section Title *<input name="title" required maxlength="120" value="<?= $v('title') ?>">
      <small>Shown as the big heading. Wrap a word in *stars* to put it in the accent style, e.g. Always *On*.</small></label>
    <label>Section Label / Subtitle<input name="kicker" maxlength="80" value="<?= $v('kicker') ?>">
      <small>The small label above the title, e.g. "Video Editor".</small></label>
    <label class="ad-span2">Section Description<textarea name="description" maxlength="400" rows="2"><?= $v('description') ?></textarea>
      <small>Short line under the title (used by the Telesales, Website Development and Video designs).</small></label>
    <label>Section Number<input name="number" maxlength="6" value="<?= $v('number') ?>"><small>The "01", "02" badge.</small></label>
    <label>Link Anchor (id)<input name="anchor" maxlength="60" value="<?= $v('anchor') ?>"><small>Used in links like team.html#dept-video. Leave blank to generate.</small></label>
    <label>Display Order
      <select name="position">
        <?php for ($p = 1; $p <= $count + ($isNew ? 1 : 0); $p++): ?>
          <option value="<?= $p ?>"<?= $p === $position ? ' selected' : '' ?>>Position <?= $p ?></option>
        <?php endfor; ?>
      </select></label>
    <label>Status
      <select name="status">
        <option value="published"<?= ($sec['status'] ?? '') === 'published' ? ' selected' : '' ?>>Published</option>
        <option value="hidden"<?= ($sec['status'] ?? '') === 'hidden' ? ' selected' : '' ?>>Hidden</option>
      </select></label>
  </div>

  <fieldset id="design">
    <legend>Section Design / Module</legend>
    <p class="ad-muted">Each design is one of the existing Team page designs. The card design, background and layout come from it.</p>
    <div class="ad-modules">
      <?php foreach (TEAM_MODULES as $key => $mod): $dis = isset($usedSingles[$key]); ?>
        <label class="ad-module<?= $dis ? ' is-disabled' : '' ?>">
          <input type="radio" name="module" value="<?= h($key) ?>"<?= $sec['module'] === $key ? ' checked' : '' ?><?= $dis ? ' disabled' : '' ?>>
          <span><?= h($mod['label']) ?><?= $dis ? ' <em>(already used)</em>' : '' ?></span>
        </label>
      <?php endforeach; ?>
    </div>
  </fieldset>

  <fieldset data-modules="development design">
    <legend>Background text</legend>
    <label>Large background word<input name="bg_word" maxlength="40" value="<?= $xv('bg_word') ?>"></label>
    <label data-modules="development">Rotating seal text<input name="seal_text" maxlength="80" value="<?= $xv('seal_text') ?>"></label>
    <label data-modules="design">Sheet footer text<input name="slug" maxlength="120" value="<?= $xv('slug') ?>"></label>
  </fieldset>

  <fieldset data-modules="founder">
    <legend>Founder stats</legend>
    <?php for ($k = 0; $k < 3; $k++): $st = $x['stats'][$k] ?? []; ?>
      <div class="ad-grid">
        <label>Stat <?= $k + 1 ?> value<input name="stat_value_<?= $k ?>" maxlength="20" value="<?= h($st['value'] ?? '') ?>"></label>
        <label>Stat <?= $k + 1 ?> label<input name="stat_label_<?= $k ?>" maxlength="40" value="<?= h($st['label'] ?? '') ?>"></label>
      </div>
    <?php endfor; ?>
    <div class="ad-grid">
      <label>Photo width (px)<input type="number" name="image_width" min="0" value="<?= $xv('image_width') ?>"></label>
      <label>Photo height (px)<input type="number" name="image_height" min="0" value="<?= $xv('image_height') ?>"></label>
    </div>
  </fieldset>

  <fieldset data-modules="people">
    <legend>People Desk duties (4 points around the photo)</legend>
    <label>Video file (optional)<input name="video" maxlength="300" value="<?= $xv('video') ?>"><small>e.g. images/video/1.mp4</small></label>
    <?php for ($k = 0; $k < 4; $k++): $du = $x['duties'][$k] ?? []; ?>
      <div class="ad-grid ad-grid--3">
        <label>Duty <?= $k + 1 ?> icon<input name="duty_icon_<?= $k ?>" maxlength="60" value="<?= h($du['icon'] ?? '') ?>"><small>Font Awesome class</small></label>
        <label>Duty <?= $k + 1 ?> title<input name="duty_title_<?= $k ?>" maxlength="60" value="<?= h($du['title'] ?? '') ?>"></label>
        <label>Duty <?= $k + 1 ?> text<textarea name="duty_text_<?= $k ?>" maxlength="300" rows="2"><?= h($du['text'] ?? '') ?></textarea></label>
      </div>
    <?php endfor; ?>
  </fieldset>

  <fieldset data-modules="founder people">
    <legend>Button</legend>
    <div class="ad-grid">
      <label>Button text<input name="cta_text" maxlength="60" value="<?= $xv('cta_text') ?>"></label>
      <label>Button link<input name="cta_link" maxlength="300" value="<?= $xv('cta_link') ?>"></label>
    </div>
  </fieldset>

  <?php if ($isNew): ?>
  <fieldset>
    <legend>Initial Members</legend>
    <p class="ad-muted">A new section starts with 4 member slots - this is not a limit. Slots you leave blank are created as
      hidden placeholders, so no empty cards appear on the page. Add photos and details on the next screen.</p>
    <input type="hidden" name="initial_count" value="4" data-init-count>
    <div data-init-rows>
      <?php for ($k = 0; $k < 4; $k++): ?>
        <div class="ad-grid">
          <label>Member <?= $k + 1 ?> name<input name="init_name_<?= $k ?>" maxlength="80"></label>
          <label>Designation<input name="init_role_<?= $k ?>" maxlength="80"></label>
        </div>
      <?php endfor; ?>
    </div>
    <button type="button" class="ad-btn" data-add-init>+ Add another slot</button>
  </fieldset>
  <?php endif; ?>

  <div class="ad-actions">
    <button class="ad-btn ad-btn--primary" type="submit"><?= $isNew ? 'Create Section' : 'Save Section' ?></button>
    <a class="ad-btn" href="team.php">Cancel</a>
  </div>
</form>
<?php admin_footer();
