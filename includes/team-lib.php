<?php
/**
 * Team page data + rendering.
 *
 * data/team.json is the only store. Every write goes through team_save(),
 * which validates, backs up the previous file, writes to a temp file and
 * renames it into place under an exclusive lock, so a failed write can never
 * leave an empty or half-written JSON file behind.
 *
 * The render_* functions reproduce the markup of the original static
 * team.html section by section; the design (CSS/JS) is untouched.
 */

declare(strict_types=1);

const TEAM_ROOT    = __DIR__ . '/..';
const TEAM_JSON    = TEAM_ROOT . '/data/team.json';
const TEAM_LOCK    = TEAM_ROOT . '/data/team.lock';
const TEAM_BACKUPS = TEAM_ROOT . '/data/backups';
const TEAM_UPLOADS = TEAM_ROOT . '/uploads/team';
const TEAM_UPLOAD_URL = 'uploads/team/';
const TEAM_BACKUP_KEEP = 40;
const TEAM_MAX_UPLOAD = 5 * 1024 * 1024;

/* Modules = the existing section designs. `single` modules show one person
   (their scripts and ids assume one copy per page). */
const TEAM_MODULES = [
    'founder'     => ['label' => 'Founder profile (single person + 3 stats)', 'single' => true],
    'people'      => ['label' => 'People Desk / HR profile (single person + 4 duties)', 'single' => true],
    'telesales'   => ['label' => 'Telesales - arch cards, 2 per row', 'single' => false],
    'development' => ['label' => 'Website Development - tilted stage cards', 'single' => false],
    'social'      => ['label' => 'Social Media - story frames, 4 per row', 'single' => false],
    'video'       => ['label' => 'Video Editor - cutting-room cards, 4 per row', 'single' => false],
    'design'      => ['label' => 'Designer - press-sheet plates, 4 per row', 'single' => false],
];

const TEAM_MEMBER_FIELDS = [
    'name', 'designation', 'department', 'description', 'image', 'alt', 'initials',
    'email', 'phone', 'linkedin', 'instagram', 'facebook', 'website', 'skills', 'experience',
    'handle', 'badge', 'note', 'card_link', 'card_link_label', 'status',
];

/* ------------------------------------------------------------------ helpers */

function h(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** "Always *On*" -> Always <em>On</em> (text is escaped first). */
function team_em(string $s): string
{
    return preg_replace('/\*([^*]+)\*/u', '<em>$1</em>', h($s));
}

/** Multi-line text -> escaped lines joined with <br>. */
function team_br(string $s): string
{
    $lines = preg_split('/\r\n|\r|\n/', trim($s));
    return implode('<br>', array_map('h', $lines));
}

function team_initials(array $m): string
{
    if (!empty($m['initials'])) {
        return $m['initials'];
    }
    $parts = preg_split('/\s+/u', trim(preg_replace('/[^\p{L}\s]/u', ' ', $m['name'] ?? '')));
    $ini = '';
    foreach (array_slice(array_filter($parts), 0, 2) as $p) {
        $ini .= mb_strtoupper(mb_substr($p, 0, 1));
    }
    return $ini ?: '?';
}

function team_alt(array $m): string
{
    if (!empty($m['alt'])) {
        return $m['alt'];
    }
    return trim(($m['name'] ?? '') . (!empty($m['designation']) ? ', ' . $m['designation'] : ''));
}

function team_new_id(string $prefix): string
{
    return $prefix . '_' . bin2hex(random_bytes(5));
}

/* --------------------------------------------------------------- storage */

function team_load(): array
{
    if (!is_file(TEAM_JSON)) {
        return ['sections' => []];
    }
    $fp = fopen(TEAM_JSON, 'rb');
    if (!$fp) {
        throw new RuntimeException('Cannot open team.json');
    }
    flock($fp, LOCK_SH);
    $raw = stream_get_contents($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    $data = json_decode((string) $raw, true);
    if (!is_array($data) || !isset($data['sections']) || !is_array($data['sections'])) {
        throw new RuntimeException('team.json is not valid team data');
    }
    return $data;
}

/**
 * Read-modify-write under one exclusive lock. $fn receives the current data
 * by reference; whatever it leaves there is validated and saved.
 */
function team_update(callable $fn): array
{
    $lock = fopen(TEAM_LOCK, 'c');
    if (!$lock || !flock($lock, LOCK_EX)) {
        throw new RuntimeException('Cannot lock team data');
    }
    try {
        $data = team_load();
        $fn($data);
        team_save($data);
        return $data;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

/** Only call from inside team_update() (it holds the lock). */
function team_save(array $data): void
{
    team_validate($data);
    foreach ($data['sections'] as $i => &$sec) {
        $sec['order'] = $i + 1;
        foreach ($sec['members'] as $j => &$mem) {
            $mem['order'] = $j + 1;
        }
        unset($mem);
    }
    unset($sec);
    $data['updated_at'] = date('c');

    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false || json_decode($json, true) === null) {
        throw new RuntimeException('Refusing to save: data did not encode to valid JSON');
    }

    if (is_file(TEAM_JSON)) {
        if (!is_dir(TEAM_BACKUPS)) {
            mkdir(TEAM_BACKUPS, 0750, true);
        }
        copy(TEAM_JSON, TEAM_BACKUPS . '/team-' . date('Y-m-d-His') . '-' . substr(bin2hex(random_bytes(2)), 0, 4) . '.json');
        $old = glob(TEAM_BACKUPS . '/team-*.json') ?: [];
        sort($old);
        foreach (array_slice($old, 0, max(0, count($old) - TEAM_BACKUP_KEEP)) as $f) {
            @unlink($f);
        }
    }

    $tmp = TEAM_JSON . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) !== strlen($json)) {
        @unlink($tmp);
        throw new RuntimeException('Could not write team data');
    }
    if (!rename($tmp, TEAM_JSON)) {
        @unlink($tmp);
        throw new RuntimeException('Could not replace team.json');
    }
}

function team_validate(array $data): void
{
    if (!isset($data['sections']) || !is_array($data['sections'])) {
        throw new RuntimeException('Invalid data: no sections list');
    }
    $singles = [];
    foreach ($data['sections'] as $sec) {
        if (empty($sec['id']) || !isset(TEAM_MODULES[$sec['module'] ?? ''])) {
            throw new RuntimeException('Invalid section (missing id or unknown module)');
        }
        if (TEAM_MODULES[$sec['module']]['single']) {
            if (isset($singles[$sec['module']])) {
                throw new RuntimeException('Only one "' . $sec['module'] . '" section is allowed on the page');
            }
            $singles[$sec['module']] = true;
        }
        if (!isset($sec['members']) || !is_array($sec['members'])) {
            throw new RuntimeException('Invalid section members');
        }
    }
}

function &team_find_section(array &$data, string $id): array
{
    foreach ($data['sections'] as &$sec) {
        if ($sec['id'] === $id) {
            return $sec;
        }
    }
    throw new RuntimeException('Section not found');
}

/* --------------------------------------------------------------- uploads */

/**
 * Validates and stores an uploaded photo; returns its public path.
 * Extension, real MIME type (finfo), image dimensions and size are all
 * checked; the stored name is generated, never taken from the upload.
 */
function team_store_upload(array $file, string $nameHint): string
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Upload failed (error ' . (int) ($file['error'] ?? -1) . ')');
    }
    if ($file['size'] > TEAM_MAX_UPLOAD) {
        throw new RuntimeException('Image is larger than 5 MB');
    }
    if (!is_uploaded_file($file['tmp_name'])) {
        throw new RuntimeException('Invalid upload');
    }
    $ext = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp'];
    if (!isset($allowed[$ext])) {
        throw new RuntimeException('Only JPG, JPEG, PNG or WEBP images are allowed');
    }
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    if ($mime !== $allowed[$ext]) {
        throw new RuntimeException('The file content does not match its extension');
    }
    $info = @getimagesize($file['tmp_name']);
    if (!$info || $info[0] < 1 || $info[1] < 1 || $info[0] > 8000 || $info[1] > 8000) {
        throw new RuntimeException('Not a valid image');
    }
    if (!is_dir(TEAM_UPLOADS)) {
        mkdir(TEAM_UPLOADS, 0755, true);
    }
    $slug = trim(preg_replace('/[^a-z0-9]+/', '-', strtolower($nameHint)), '-') ?: 'member';
    $out = $slug . '-' . bin2hex(random_bytes(4)) . '.' . ($ext === 'jpeg' ? 'jpg' : $ext);
    $dest = TEAM_UPLOADS . '/' . $out;

    // Re-encode when GD is available: drops anything hidden after the image data.
    if (function_exists('imagecreatefromstring')) {
        $img = @imagecreatefromstring((string) file_get_contents($file['tmp_name']));
        if (!$img) {
            throw new RuntimeException('Not a valid image');
        }
        $ok = match ($allowed[$ext]) {
            'image/png'  => (imagesavealpha($img, true) && imagepng($img, $dest, 7)),
            'image/webp' => imagewebp($img, $dest, 85),
            default      => imagejpeg($img, $dest, 85),
        };
        imagedestroy($img);
        if (!$ok) {
            throw new RuntimeException('Could not save the image');
        }
    } elseif (!move_uploaded_file($file['tmp_name'], $dest)) {
        throw new RuntimeException('Could not save the image');
    }
    @chmod($dest, 0644);
    return TEAM_UPLOAD_URL . $out;
}

/** Deletes a photo only if it is one we uploaded (never the original site images). */
function team_delete_upload(?string $path): void
{
    if ($path && str_starts_with($path, TEAM_UPLOAD_URL) && !str_contains($path, '..')) {
        $f = TEAM_ROOT . '/' . $path;
        if (is_file($f)) {
            @unlink($f);
        }
    }
}

/* ------------------------------------------------------------- rendering */

function team_visible_members(array $sec): array
{
    return array_values(array_filter($sec['members'], fn($m) => ($m['status'] ?? 'active') === 'active'));
}

function team_render_sections(array $data): string
{
    $out = '';
    foreach ($data['sections'] as $sec) {
        if (($sec['status'] ?? 'published') !== 'published') {
            continue;
        }
        $members = team_visible_members($sec);
        if (!$members) {
            continue; // never render a section with no cards
        }
        $fn = 'team_render_' . $sec['module'];
        $out .= "\n" . $fn($sec, $members) . "\n";
    }
    return $out;
}

function team_anchor(array $sec, string $fallback): string
{
    $a = preg_replace('/[^A-Za-z0-9_-]/', '', $sec['anchor'] ?? '');
    return $a !== '' ? $a : $fallback;
}

function team_img(array $m, string $attrs = 'loading="lazy" onerror="this.remove();"', ?string $alt = null): string
{
    if (empty($m['image'])) {
        return '';
    }
    return '<img src="' . h($m['image']) . '" alt="' . h($alt ?? team_alt($m)) . '" ' . $attrs . '>';
}

function team_render_founder(array $sec, array $members): string
{
    $this_h = 'h'; $this_em = 'team_em'; $this_img = 'team_img'; // callables for heredoc interpolation
    $m = $members[0];
    $x = $sec['extra'] ?? [];
    $subs = array_filter(array_map('trim', explode('|', $m['designation'] ?? '')), 'strlen');
    $sub = implode('<span class="jbs__sep">|</span>', array_map(fn($s) => '<span>' . h($s) . '</span>', $subs));
    $stats = '';
    foreach (($x['stats'] ?? []) as $st) {
        if (($st['value'] ?? '') === '' && ($st['label'] ?? '') === '') {
            continue;
        }
        $stats .= '            <li class="jbs__stat"><span class="jbs__stat-value">' . h($st['value']) . '</span><span class="jbs__stat-label">' . h($st['label']) . "</span></li>\n";
    }
    $id = team_anchor($sec, 'founder');
    $wh = (!empty($x['image_width']) && !empty($x['image_height'])) ? ' width="' . (int) $x['image_width'] . '" height="' . (int) $x['image_height'] . '"' : '';
    return <<<HTML
      <!-- Founder Intro - {$this_h($m['name'])} -->
      <section class="jbs" id="{$id}" aria-labelledby="jbs-title" data-sa-skip>
        <div class="jbs__stage">
          <h2 class="jbs__title" id="jbs-title">{$this_h($m['name'])}</h2>
          <p class="jbs__subtitle">
            {$sub}
          </p>

          <figure class="jbs__person">
            <img src="{$this_h($m['image'] ?? '')}" alt="{$this_h(team_alt(['name' => $m['name'], 'alt' => $m['alt'] ?? $m['name']]))}"{$wh} loading="lazy" decoding="async">
          </figure>

          <ul class="jbs__card" aria-label="Highlights">
{$stats}          </ul>

          <a href="{$this_h($x['cta_link'] ?? 'index.html#home')}" class="jbs__cta">
            {$this_h($x['cta_text'] ?? 'Who I Am')}
            <span class="jbs__cta-icon" aria-hidden="true">
              <svg viewBox="0 0 14 24" fill="none"><path d="M2.5 2.5 11.5 12l-9 9.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
          </a>
        </div>
      </section>
HTML;
}

function team_render_people(array $sec, array $members): string
{
    $this_h = 'h'; $this_em = 'team_em'; $this_img = 'team_img'; // callables for heredoc interpolation
    $m = $members[0];
    $x = $sec['extra'] ?? [];
    $parts = preg_split('/\s+/u', trim($m['name']));
    $last = count($parts) > 1 ? array_pop($parts) : '';
    $nameHtml = h(implode(' ', $parts)) . ($last !== '' ? ' <em>' . h($last) . '</em>' : '');
    // vertical watermark: drop a trailing initial ("Shivani P" -> "Shivani"),
    // which read as a stray shape when turned sideways
    $bgName = trim(preg_replace('/\s+\p{L}\.?$/u', '', trim($m['name']))) ?: $m['name'];
    $duties = array_slice(array_values($x['duties'] ?? []), 0, 4);
    $nodes = $slides = '';
    foreach ($duties as $i => $d) {
        $n = $i + 1;
        $nn = sprintf('%02d', $n);
        $sel = $i === 0 ? 'true' : 'false';
        $tab = $i === 0 ? '0' : '-1';
        $icon = h(preg_replace('/[^a-z0-9 -]/', '', $d['icon'] ?? 'fa-solid fa-circle'));
        $nodes .= <<<HTML
              <button class="ho-node ho-node--{$n}" type="button" id="hoN{$nn}"
                      aria-controls="hoS{$nn}" aria-selected="{$sel}" tabindex="{$tab}">
                <i class="{$icon}" aria-hidden="true"></i>
                <span class="ho-node__tip">{$this_h($d['title'] ?? '')}</span>
              </button>

HTML;
        $active = $i === 0 ? ' is-active' : '';
        $slides .= <<<HTML
              <article class="ho-slide{$active}" id="hoS{$nn}" role="region" aria-labelledby="hoN{$nn}">
                <span class="ho-slide__no">{$nn}</span>
                <h3>{$this_h($d['title'] ?? '')}</h3>
                <p>{$this_h($d['text'] ?? '')}</p>
              </article>

HTML;
    }
    $video = '';
    if (!empty($x['video'])) {
        $video = '
              <video class="ho__video" preload="none" playsinline controls
                     poster="' . h($m['image'] ?? '') . '">
                <source src="' . h($x['video']) . '" type="video/mp4">
              </video>';
    }
    $id = team_anchor($sec, 'hr-profile');
    $cta = '';
    if (!empty($x['cta_text'])) {
        $cta = '
            <a class="ho__cta" href="' . h($x['cta_link'] ?? '#') . '">
              ' . h($x['cta_text']) . '
              <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </a>';
    }
    return <<<HTML
      <section class="ho" id="{$id}" aria-labelledby="hoName">
        <span class="ho__bgname" aria-hidden="true">{$this_h($bgName)}</span>
        <div class="tm-wrap ho__inner">

          <div class="ho__stage">
            <svg class="ho__ring" viewBox="0 0 100 100" aria-hidden="true">
              <circle class="ho__track" cx="50" cy="50" r="49"></circle>
              <circle class="ho__sweep" cx="50" cy="50" r="49"></circle>
            </svg>

            <figure class="ho__figure">
              <img class="ho__shot" src="{$this_h($m['image'] ?? '')}"
                   alt="{$this_h(team_alt($m))}" loading="lazy">{$video}
            </figure>

{$nodes}          </div>

          <div class="ho__body">
            <p class="ho__eyebrow"><b>{$this_h($sec['number'] ?? '')}</b> {$this_h($sec['kicker'] ?? '')}</p>
            <h2 class="ho__name" id="hoName">{$nameHtml}</h2>
            <p class="ho__role">{$this_h($m['designation'] ?? '')}</p>

            <div class="ho__slides">
{$slides}            </div>
{$cta}
          </div>

        </div>
      </section>
HTML;
}

function team_render_telesales(array $sec, array $members): string
{
    $this_h = 'h'; $this_em = 'team_em'; $this_img = 'team_img'; // callables for heredoc interpolation
    $cards = '';
    foreach ($members as $i => $m) {
        $no = sprintf('%02d', $i + 1);
        $cards .= <<<HTML
            <article class="bz-card" data-rv>
              <span class="bz-card__no">{$no}</span>
              <div class="bz-card__arch">{$this_img($m)}<span class="bz-ini">{$this_h(team_initials($m))}</span></div>
              <div class="bz-card__txt">
                <span class="bz-card__role">{$this_h($m['designation'] ?? '')}</span>
                <h4 class="bz-card__name">{$this_h($m['name'])}</h4>
              </div>
            </article>

HTML;
    }
    $sub = !empty($sec['description']) ? "\n            <p class=\"bz__sub\">" . h($sec['description']) . '</p>' : '';
    $id = team_anchor($sec, 'dept-' . $sec['id']);
    return <<<HTML
      <section class="dp bz" id="{$id}">
        <div class="dp__wrap">
          <header class="bz__head" data-rv>
            <span class="dp__no">{$this_h($sec['number'] ?? '')}</span>
            <p class="dp__kicker">{$this_h($sec['kicker'] ?? '')}</p>
            <h3 class="bz__title">{$this_em($sec['title'] ?? '')}</h3>
            <span class="bz__rule" aria-hidden="true"></span>{$sub}
          </header>

          <div class="bz__row">
{$cards}          </div>
        </div>
      </section>
HTML;
}

function team_render_development(array $sec, array $members): string
{
    $this_h = 'h'; $this_em = 'team_em'; $this_img = 'team_img'; // callables for heredoc interpolation
    $x = $sec['extra'] ?? [];
    $cards = '';
    foreach ($members as $i => $m) {
        $v = ($i % 4) + 1; // the four hand-tuned card variants repeat
        $no = sprintf('%02d', $i + 1);
        $note = !empty($m['note']) ? "\n              <span class=\"cm-card__note\" aria-hidden=\"true\">" . team_br($m['note']) . '</span>' : '';
        $go = !empty($m['card_link']) ? "\n              <a class=\"cm-card__go\" href=\"" . h($m['card_link']) . '" aria-label="' . h($m['card_link_label'] ?? '') . '"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' : '';
        $cards .= <<<HTML
            <article class="cm-card cm-card--{$v}">
              <div class="cm-card__shot">
                {$this_img($m)}
                <span class="cm-card__ini" aria-hidden="true">{$this_h(team_initials($m))}</span>
              </div>
              <span class="cm-card__no">{$no}</span>{$note}
              <div class="cm-card__body">
                <h3 class="cm-card__name">{$this_h($m['name'])}</h3>
                <p class="cm-card__role">{$this_h($m['designation'] ?? '')}</p>
              </div>{$go}
            </article>


HTML;
    }
    $wrap = count($members) > 4 ? ' cm__stage--wrap' : '';
    $id = team_anchor($sec, 'creative-team');
    $tid = $id === 'creative-team' ? 'cmTitle' : 'cmTitle-' . $id;
    return <<<HTML
      <section class="cm" id="{$id}" aria-labelledby="{$tid}">
        <span class="cm__bg" aria-hidden="true">{$this_h($x['bg_word'] ?? '')}</span>
        <span class="cm__ridge" aria-hidden="true"></span>

        <span class="cm__seal" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <defs><path id="cmArc-{$id}" d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0"></path></defs>
            <text><textPath href="#cmArc-{$id}">{$this_h($x['seal_text'] ?? '')}</textPath></text>
          </svg>
          <i class="fa-solid fa-arrow-right"></i>
        </span>

        <div class="cm__wrap">
          <header class="cm__head">
            <span class="cm__eyebrow">{$this_h($sec['kicker'] ?? '')}</span>
            <h2 class="cm__title" id="{$tid}">
              <span class="cm__mask"><span><span class="dp__no">{$this_h($sec['number'] ?? '')}</span></span></span>
              <em class="cm__mask"><span>{$this_h($sec['title'] ?? '')}</span></em>
            </h2>
            <p class="cm__lead">{$this_h($sec['description'] ?? '')}</p>
          </header>

          <div class="cm__stage{$wrap}">
{$cards}          </div>

        </div>

      </section>
HTML;
}

function team_render_social(array $sec, array $members): string
{
    $this_h = 'h'; $this_em = 'team_em'; $this_img = 'team_img'; // callables for heredoc interpolation
    $cards = '';
    foreach ($members as $m) {
        $ini = h(team_initials($m));
        $live = !empty($m['badge']) ? "\n                <span class=\"sm-story__live\">" . h($m['badge']) . '</span>' : '';
        $handle = h($m['handle'] ?? '');
        $avatar = team_img($m, 'loading="lazy"
                    onerror="this.remove();"', '');
        $media = team_img($m, 'loading="lazy" onerror="this.remove();"');
        $cards .= <<<HTML
            <article class="sm-story" data-rv>
              <span class="sm-story__bars" aria-hidden="true"><i class="is-done"></i><i class="is-on"></i><i></i></span>
              <span class="sm-story__top">
                <span class="sm-story__av">{$avatar}<span class="sm-ini">{$ini}</span></span>
                <span class="sm-story__handle">{$handle}</span>{$live}
              </span>
              <span class="sm-story__media">{$media}<span
                  class="sm-ini sm-ini--big">{$ini}</span></span>
              <div class="sm-story__foot">
                <h4 class="sm-story__name">{$this_h($m['name'])}</h4>
                <p class="sm-story__role">{$this_h($m['designation'] ?? '')}</p>
              </div>
            </article>


HTML;
    }
    $id = team_anchor($sec, 'dept-' . $sec['id']);
    return <<<HTML
      <section class="dp sm" id="{$id}">
        <div class="dp__wrap">
          <header class="sm__head" data-rv>
            <span class="dp__no">{$this_h($sec['number'] ?? '')}</span>
            <p class="dp__kicker">{$this_h($sec['kicker'] ?? '')}</p>
            <h3 class="sm__title">{$this_em($sec['title'] ?? '')}</h3>
          </header>

          <div class="sm__rail">
{$cards}          </div>
        </div>
      </section>
HTML;
}

function team_render_video(array $sec, array $members): string
{
    $this_h = 'h'; $this_em = 'team_em'; $this_img = 'team_img'; // callables for heredoc interpolation
    $cards = '';
    foreach ($members as $m) {
        $cards .= <<<HTML
            <article class="vd-card" data-rv>
              <div class="vd-card__img">
                {$this_img($m)}<span class="vd-ini">{$this_h(team_initials($m))}</span>
                <span class="vd-card__play" aria-hidden="true"><i class="fa-solid fa-play"></i></span>
              </div>
              <h4 class="vd-card__name">{$this_h($m['name'])}</h4>
              <p class="vd-card__role">{$this_h($m['designation'] ?? '')}</p>
            </article>


HTML;
    }
    $sub = !empty($sec['description']) ? "\n            <p class=\"vd__sub\"><span class=\"vd__dot\" aria-hidden=\"true\"></span>" . h($sec['description']) . '</p>' : '';
    $id = team_anchor($sec, 'dept-' . $sec['id']);
    return <<<HTML
      <section class="dp vd" id="{$id}">
        <div class="dp__wrap">
          <header class="vd__head" data-rv>
            <span class="dp__no">{$this_h($sec['number'] ?? '')}</span>
            <p class="dp__kicker">{$this_h($sec['kicker'] ?? '')}</p>
            <h3 class="vd__title">{$this_em($sec['title'] ?? '')}</h3>{$sub}
          </header>

          <div class="vd__grid">
{$cards}          </div>
        </div>
      </section>
HTML;
}

function team_render_design(array $sec, array $members): string
{
    $this_h = 'h'; $this_em = 'team_em'; $this_img = 'team_img'; // callables for heredoc interpolation
    $x = $sec['extra'] ?? [];
    $plates = '';
    foreach ($members as $i => $m) {
        $no = sprintf('%02d', $i + 1);
        $plates .= <<<HTML
              <figure class="cr-plate">
                <span class="cr-plate__no">Plate {$no}</span>
                <div class="cr-plate__img">{$this_img($m)}<span class="cr-ini">{$this_h(team_initials($m))}</span></div>
                <figcaption class="cr-plate__slug">
                  <h4 class="cr-plate__name">{$this_h($m['name'])}</h4>
                  <span class="cr-plate__role">{$this_h($m['designation'] ?? '')}</span>
                </figcaption>
              </figure>


HTML;
    }
    $id = team_anchor($sec, 'dept-' . $sec['id']);
    return <<<HTML
      <section class="dp cr" id="{$id}">
        <div class="dp__wrap">
          <header class="cr__head" data-rv>
            <span class="dp__no">{$this_h($sec['number'] ?? '')}</span>
            <p class="dp__kicker">{$this_h($sec['kicker'] ?? '')}</p>
            <h3 class="cr__title">{$this_em($sec['title'] ?? '')}</h3>
          </header>

          <div class="cr__sheet" data-rv>
            <span class="cr__word" aria-hidden="true">{$this_h($x['bg_word'] ?? '')}</span>

            <span class="cr__crop cr__crop--tl" aria-hidden="true"></span>
            <span class="cr__crop cr__crop--tr" aria-hidden="true"></span>
            <span class="cr__crop cr__crop--bl" aria-hidden="true"></span>
            <span class="cr__crop cr__crop--br" aria-hidden="true"></span>
            <span class="cr__target cr__target--l" aria-hidden="true"></span>
            <span class="cr__target cr__target--r" aria-hidden="true"></span>

            <span class="cr__guides" aria-hidden="true">
              <i class="cr__guide cr__guide--x"></i>
              <i class="cr__guide cr__guide--y"></i>
              <b class="cr__coords">X 0 &nbsp; Y 0</b>
            </span>

            <div class="cr__plates">
{$plates}            </div>

            <div class="cr__bar">
              <span class="cr__inks" aria-hidden="true">
                <i class="cr__ink cr__ink--c"></i><i class="cr__ink cr__ink--m"></i><i class="cr__ink cr__ink--y"></i><i
                  class="cr__ink cr__ink--k"></i>
                <i class="cr__ink cr__ink--s1"></i><i class="cr__ink cr__ink--s2"></i><i
                  class="cr__ink cr__ink--s3"></i><i class="cr__ink cr__ink--s4"></i>
              </span>
              <span class="cr__slug">{$this_h($x['slug'] ?? '')}</span>
            </div>
          </div>
        </div>
      </section>
HTML;
}

