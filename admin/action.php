<?php
/**
 * Quick actions on sections and members: delete, move, hide/show, reorder.
 * POST only, CSRF-checked. Drag-and-drop reorder calls this with fetch and
 * gets JSON back; everything else redirects back to the page it came from.
 */
require __DIR__ . '/_bootstrap.php';
require_login();
csrf_check();

$action = post_str('action', 40);
$sid = post_str('section', 40);
$mid = post_str('member', 40);
$ajax = ($_SERVER['HTTP_ACCEPT'] ?? '') === 'application/json';
$back = $sid !== '' && str_starts_with($action, 'member_') ? 'members.php?section=' . rawurlencode($sid) : 'team.php';
$photosToDelete = [];

function move_item(array &$list, int $i, int $dir): void
{
    $j = $i + $dir;
    if ($j < 0 || $j >= count($list)) {
        return;
    }
    [$list[$i], $list[$j]] = [$list[$j], $list[$i]];
}

function index_of(array $list, string $id): int
{
    foreach ($list as $i => $item) {
        if ($item['id'] === $id) {
            return $i;
        }
    }
    throw new RuntimeException('Item not found - it may have been deleted already.');
}

/** New order from drag-and-drop: must be exactly the existing ids. */
function reorder(array $list, $ids): array
{
    if (!is_array($ids)) {
        throw new RuntimeException('Bad order');
    }
    $byId = array_column($list, null, 'id');
    $ids = array_values(array_filter($ids, 'is_string'));
    if (count($ids) !== count($byId) || array_diff($ids, array_keys($byId))) {
        throw new RuntimeException('The list changed while you were reordering. Reload and try again.');
    }
    return array_map(fn($id) => $byId[$id], $ids);
}

try {
    team_update(function (array &$data) use ($action, $sid, $mid, &$photosToDelete) {
        switch ($action) {
            case 'section_delete':
                $i = index_of($data['sections'], $sid);
                foreach ($data['sections'][$i]['members'] as $m) {
                    $photosToDelete[] = $m['image'] ?? '';
                }
                array_splice($data['sections'], $i, 1);
                break;
            case 'section_up':
            case 'section_down':
                move_item($data['sections'], index_of($data['sections'], $sid), $action === 'section_up' ? -1 : 1);
                break;
            case 'section_toggle':
                $sec = &team_find_section($data, $sid);
                $sec['status'] = ($sec['status'] ?? 'published') === 'published' ? 'hidden' : 'published';
                break;
            case 'section_reorder':
                $data['sections'] = reorder($data['sections'], $_POST['order'] ?? null);
                break;
            case 'member_delete':
                $sec = &team_find_section($data, $sid);
                $i = index_of($sec['members'], $mid);
                $photosToDelete[] = $sec['members'][$i]['image'] ?? '';
                array_splice($sec['members'], $i, 1);
                break;
            case 'member_up':
            case 'member_down':
                $sec = &team_find_section($data, $sid);
                move_item($sec['members'], index_of($sec['members'], $mid), $action === 'member_up' ? -1 : 1);
                break;
            case 'member_toggle':
                $sec = &team_find_section($data, $sid);
                $m = &$sec['members'][index_of($sec['members'], $mid)];
                $m['status'] = ($m['status'] ?? 'active') === 'active' ? 'hidden' : 'active';
                break;
            case 'member_reorder':
                $sec = &team_find_section($data, $sid);
                $sec['members'] = reorder($sec['members'], $_POST['order'] ?? null);
                break;
            default:
                throw new RuntimeException('Unknown action');
        }
    });
    // only after the JSON is safely saved
    foreach ($photosToDelete as $p) {
        team_delete_upload($p);
    }
    $msg = [
        'section_delete' => 'Section deleted.', 'member_delete' => 'Member deleted.',
        'section_toggle' => 'Section visibility changed.', 'member_toggle' => 'Member visibility changed.',
    ][$action] ?? 'Order saved.';
    if ($ajax) {
        header('Content-Type: application/json');
        echo json_encode(['ok' => true, 'message' => $msg]);
        exit;
    }
    flash($msg);
} catch (Throwable $e) {
    if ($ajax) {
        http_response_code(409);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'message' => $e->getMessage()]);
        exit;
    }
    flash($e->getMessage(), 'err');
}
redirect($back);
