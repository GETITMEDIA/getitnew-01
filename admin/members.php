<?php
/** Members of one section: list, reorder, hide/show, delete, add. */
require __DIR__ . '/_bootstrap.php';
require_login();

$data = team_load();
$sid = (string) ($_GET['section'] ?? '');
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

function m_btn(string $action, string $label, string $sid, string $mid, string $class = '', string $confirm = ''): string
{
    return '<form method="post" action="action.php" class="ad-inline"' . ($confirm ? ' data-confirm="' . h($confirm) . '"' : '') . '>' . csrf_field()
        . '<input type="hidden" name="action" value="' . h($action) . '">'
        . '<input type="hidden" name="section" value="' . h($sid) . '">'
        . '<input type="hidden" name="member" value="' . h($mid) . '">'
        . '<button type="submit" class="ad-btn ad-btn--sm ' . h($class) . '">' . h($label) . '</button></form>';
}

$name = ($sec['kicker'] ?? '') !== '' ? $sec['kicker'] : $sec['title'];
$single = TEAM_MODULES[$sec['module']]['single'];
$n = count($sec['members']);
admin_header('Members - ' . $name);
?>
<div class="ad-pagehead">
  <div>
    <h1><?= h($name) ?> <span class="ad-muted">&middot; <?= count(team_visible_members($sec)) ?> shown / <?= $n ?> total</span></h1>
    <p class="ad-muted">Design: <?= h(TEAM_MODULES[$sec['module']]['label']) ?>. Drag cards to reorder - the page shows them in this order,
      and the layout adjusts to however many members are shown.
      <?php if ($single): ?><br><b>This design shows only the first active member.</b><?php endif; ?></p>
  </div>
  <div class="ad-pagehead__btns">
    <a class="ad-btn" href="team.php">&larr; All sections</a>
    <a class="ad-btn" href="section.php?id=<?= h(rawurlencode($sid)) ?>">Edit section</a>
  </div>
</div>

<?php if (!$n): ?>
  <p class="ad-card ad-muted">This section has no members yet, so it is not shown on the page.</p>
<?php endif; ?>

<ol class="ad-members" data-sortable="member_reorder" data-section="<?= h($sid) ?>">
  <?php foreach ($sec['members'] as $i => $m):
      $hidden = ($m['status'] ?? 'active') !== 'active';
      $img = $m['image'] ?? '';
  ?>
  <li class="ad-member<?= $hidden ? ' is-hidden' : '' ?>" data-id="<?= h($m['id']) ?>" draggable="true">
    <span class="ad-handle" aria-hidden="true" title="Drag to reorder">&#8942;&#8942;</span>
    <div class="ad-member__photo">
      <?php if ($img !== ''): ?><img src="../<?= h($img) ?>" alt="" loading="lazy"><?php else: ?><span><?= h(team_initials($m)) ?></span><?php endif; ?>
    </div>
    <p class="ad-member__no">Member <?= $i + 1 ?><?= $hidden ? ' <span class="ad-tag ad-tag--off">Hidden</span>' : '' ?></p>
    <h3><?= h($m['name']) ?></h3>
    <p class="ad-muted"><?= h($m['designation'] ?? '') ?></p>
    <div class="ad-member__btns">
      <a class="ad-btn ad-btn--sm ad-btn--primary" href="member.php?section=<?= h(rawurlencode($sid)) ?>&amp;id=<?= h(rawurlencode($m['id'])) ?>">Edit</a>
      <?= m_btn('member_delete', 'Delete', $sid, $m['id'], 'ad-btn--danger', 'Delete ' . $m['name'] . '? The remaining members move up to fill the gap.') ?>
      <?= $i > 0 ? m_btn('member_up', '←', $sid, $m['id']) : '' ?>
      <?= $i < $n - 1 ? m_btn('member_down', '→', $sid, $m['id']) : '' ?>
      <?= m_btn('member_toggle', $hidden ? 'Show' : 'Hide', $sid, $m['id']) ?>
    </div>
  </li>
  <?php endforeach; ?>
</ol>

<div class="ad-addmember">
  <a class="ad-btn ad-btn--primary ad-btn--lg" href="member.php?section=<?= h(rawurlencode($sid)) ?>">+ Add Member</a>
</div>
<?php admin_footer();
