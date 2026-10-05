<?php
/**
 * Public Team page. team.html is the design: this script serves it with the
 * block between the TEAM:SECTIONS markers replaced by the sections saved in
 * data/team.json. .htaccess routes /team.html here on PHP hosting, so every
 * existing link keeps working. If the data cannot be read, the static
 * team.html content is served unchanged.
 */
declare(strict_types=1);

require __DIR__ . '/includes/team-lib.php';

$page = file_get_contents(__DIR__ . '/team.html');
$start = '<!-- TEAM:SECTIONS:START';
$end = '<!-- TEAM:SECTIONS:END -->';
$a = strpos($page, $start);
$b = strpos($page, $end);

if ($a !== false && $b !== false && $b > $a) {
    try {
        $html = team_render_sections(team_load());
        $page = substr($page, 0, $a) . "<!-- team sections: rendered from data/team.json -->\n" . $html . substr($page, $b + strlen($end));
    } catch (Throwable $e) {
        error_log('team.php: ' . $e->getMessage()); // fall back to the static sections
    }
}

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache');
echo $page;
