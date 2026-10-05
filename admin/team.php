<?php
require __DIR__ . '/_bootstrap.php';
require_login();

try {
    $data = team_load();
} catch (Throwable $e) {
    $data = ['sections' => []];
    flash('Could not read data/team.json: ' . $e->getMessage(), 'err');
}

/** The action buttons are small POST forms (no state changes over GET). */
function action_btn(string $action, string $label, array $fields, string $class = '', string $confirm = ''): string
{
    $html = '<form method="post" action="action.php" class="ad-inline"' . ($confirm ? ' data-confirm="' . h($confirm) . '"' : '') . '>' . csrf_field()
        . '<input type="hidden" name="action" value="' . h($action) . '">';
    foreach ($fields as $k => $v) {
        $html .= '<input type="hidden" name="' . h($k) . '" value="' . h($v) . '">';
    }
    return $html . '<button type="submit" class="ad-btn ' . h($class) . '">' . h($label) . '</button></form>';
}

admin_header('Team Page Management');
?>
<div class="ad-pagehead">
  <div>
    <h1>Team Page Management</h1>
    <p class="ad-muted">Team page: <a href="<?= h(PUBLIC_TEAM_URL) ?>" target="_blank" rel="noopener">team.html</a>
      &middot; Drag a section by its handle, or use Move Up / Move Down. The public page follows this order.</p>
  </div>
  <div class="ad-pagehead__btns">
    <a class="ad-btn" href="<?= h(PUBLIC_TEAM_URL) ?>" target="_blank" rel="noopener">Open Team Page &#8599;</a>
    <a class="ad-btn ad-btn--primary" href="section.php">+ Add New Section</a>
  </div>
</div>

<?php if (!$data['sections']): ?>
  <p class="ad-card">No sections yet. Use <b>+ Add New Section</b> to create the first one.</p>
<?php endif; ?>

<ol class="ad-list" data-sortable="section_reorder">
  <?php foreach ($data['sections'] as $i => $sec):
      $total = count($sec['members']);
      $shown = count(team_visible_members($sec));
      $hidden = ($sec['status'] ?? 'published') !== 'published';
      $single = TEAM_MODULES[$sec['module']]['single'];
      $ids = ['section' => $sec['id']];
      $name = trim(($sec['kicker'] ?? '') !== '' ? $sec['kicker'] : ($sec['title'] ?? 'Untitled'));
  ?>
  <li class="ad-row<?= $hidden ? ' is-hidden' : '' ?>" data-id="<?= h($sec['id']) ?>" draggable="true">
    <span class="ad-handle" title="Drag to reorder" aria-hidden="true">&#8942;&#8942;</span>
    <div class="ad-row__main">
      <h2><?= h($name) ?> <?php if ($hidden): ?><span class="ad-tag ad-tag--off">Hidden</span><?php else: ?><span class="ad-tag">Published</span><?php endif; ?></h2>
      <p class="ad-muted">
        <?= $i + 1 ?>. <?= h(strip_tags(str_replace('*', '', $sec['title'] ?? ''))) ?>
        &middot; Design: <?= h(TEAM_MODULES[$sec['module']]['label']) ?>
        &middot; Members: <b><?= $shown ?></b><?= $shown !== $total ? ' shown of ' . $total : '' ?>
        <?php if ($single && $shown > 1): ?><br><span class="ad-warn">This design shows only the first active member.</span><?php endif; ?>
        <?php if ($shown === 0): ?><br><span class="ad-warn">No active members - this section is not shown on the page.</span><?php endif; ?>
      </p>
    </div>
    <div class="ad-row__btns">
      <a class="ad-btn" href="section.php?id=<?= h(rawurlencode($sec['id'])) ?>">Edit</a>
      <a class="ad-btn ad-btn--primary" href="members.php?section=<?= h(rawurlencode($sec['id'])) ?>">Manage Members</a>
      <a class="ad-btn" href="section.php?id=<?= h(rawurlencode($sec['id'])) ?>#design">Design</a>
      <?= $i > 0 ? action_btn('section_up', 'Move Up', $ids) : '' ?>
      <?= $i < count($data['sections']) - 1 ? action_btn('section_down', 'Move Down', $ids) : '' ?>
      <?= action_btn('section_toggle', $hidden ? 'Show' : 'Hide', $ids) ?>
      <?= action_btn('section_delete', 'Delete', $ids, 'ad-btn--danger', 'Delete the section "' . $name . '" and all ' . $total . ' member(s)? A backup of the data is kept in data/backups.') ?>
    </div>
  </li>
  <?php endforeach; ?>
</ol>
<?php admin_footer();
