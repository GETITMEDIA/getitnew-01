/* ==========================================================================
   GetIt Media — Hero Cinematic Video Fade System + Entrance Animations
   Pure Vanilla JavaScript — No frameworks
   ========================================================================== */

(function () {
  'use strict';

  // ── Reduced motion check ──
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Video Fade System (only if video element exists) ──
  var video = document.getElementById('gmHeroVideo');
  if (video) {

  // Fades are left to the CSS transition on .gm-hero__video (opacity 0.8s):
  // the script only says "show" or "hide". A frame-by-frame fade stalls
  // whenever the page is throttled, and a stalled fade-out left the video
  // invisible for good.
  var FADE_OUT_BEFORE_END = 0.8; // s — matches the transition length
  var hidden = true;
  var lastTime = 0;
  var reshowTimer = null;

  function show() {
    if (reshowTimer) { clearTimeout(reshowTimer); reshowTimer = null; }
    hidden = false;
    video.style.opacity = '1';
  }

  function hideForLoop() {
    hidden = true;
    video.style.opacity = '0';
    // whatever else happens, never leave the video hidden for long
    reshowTimer = setTimeout(show, 1200);
  }

  function tryPlay() {
    var p = video.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked, ignore */ });
  }

  // ── Fade in once there is a frame to show ──
  if (video.readyState >= 2) {
    show();
  } else {
    video.addEventListener('loadeddata', show, { once: true });
  }

  // Autoplay can be refused before the first frame; ask again once data is in
  video.addEventListener('canplay', function () {
    if (video.paused) tryPlay();
  }, { once: true });

  // ── Fade out just before the end, back in as soon as it has looped ──
  // With the `loop` attribute the browser restarts the video itself and
  // never fires `ended`, so the loop is detected from the playhead.
  video.addEventListener('timeupdate', function () {
    if (!video.duration || isNaN(video.duration)) return;

    if (hidden && video.currentTime < lastTime) show();
    lastTime = video.currentTime;

    if (!hidden && video.duration - video.currentTime <= FADE_OUT_BEFORE_END) {
      hideForLoop();
    }
  });

  video.addEventListener('seeked', function () {
    if (hidden) show();
  });

  // Without `loop`, restart by hand
  video.addEventListener('ended', function () {
    video.currentTime = 0;
    tryPlay();
    show();
  });

  // ── Visibility API: pause video when tab is hidden ──
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      video.pause();
    } else {
      tryPlay();
    }
  });

  } // end if (video)

  // ── Entrance Animations (staggered reveal) ──
  if (!prefersReducedMotion) {
    var revealElements = document.querySelectorAll('.gm-reveal');
    var baseDelay = 300; // ms after page load

    // Stagger content reveal
    setTimeout(function () {
      for (var i = 0; i < revealElements.length; i++) {
        (function (el, index) {
          setTimeout(function () {
            el.classList.add('gm-reveal--visible');
          }, index * 200);
        })(revealElements[i], i);
      }
    }, baseDelay);
  } else {
    // Immediately show all elements for reduced motion
    var revealElements = document.querySelectorAll('.gm-reveal');
    for (var i = 0; i < revealElements.length; i++) {
      revealElements[i].classList.add('gm-reveal--visible');
    }
  }

})();

/* ──────────────────────────────────────────────────────────────
   Hero accent typewriter: types the accent word, erases it, then
   cycles to the next one (Grow. → Connect. → Convert. → …).
   Words come from data-type-words on the accent span.
   ────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var accent = document.querySelector('.gm-hero__heading-accent.gm-type');
  if (!accent) return;

  var textEl  = accent.querySelector('.gm-hero__type-text');
  var sizerEl = accent.querySelector('.gm-hero__type-sizer');
  var caretEl = accent.querySelector('.gm-hero__type-caret');
  if (!textEl || !sizerEl) return;

  var words = (accent.getAttribute('data-type-words') || '').split('|');
  var cleaned = [];
  for (var i = 0; i < words.length; i++) {
    if (words[i]) cleaned.push(words[i]);
  }
  words = cleaned;
  if (words.length < 2) return;

  // Reserve the width of the widest word so the centred headline never reflows
  function lockWidth() {
    var widest = words[0];
    var max = 0;
    for (var i = 0; i < words.length; i++) {
      sizerEl.textContent = words[i];
      if (sizerEl.offsetWidth > max) {
        max = sizerEl.offsetWidth;
        widest = words[i];
      }
    }
    sizerEl.textContent = widest;
  }
  lockWidth();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(lockWidth).catch(function () {});
  }

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    textEl.textContent = words[0];
    if (caretEl) caretEl.style.display = 'none';
    return;
  }

  var TYPE_MS  = 95;   // per character while typing
  var ERASE_MS = 45;   // per character while erasing
  var HOLD_MS  = 1900; // pause on the finished word
  var GAP_MS   = 420;  // pause after erasing, before the next word

  var wordIndex = 0;
  var charIndex = 0;
  var erasing   = false;

  function moveCaret() {
    if (caretEl) caretEl.style.transform = 'translateX(' + textEl.offsetWidth + 'px)';
  }

  function tick() {
    var word = words[wordIndex];

    if (!erasing) {
      charIndex++;
      textEl.textContent = word.slice(0, charIndex);
      moveCaret();
      if (charIndex >= word.length) {
        erasing = true;
        setTimeout(tick, HOLD_MS);
        return;
      }
      setTimeout(tick, TYPE_MS);
      return;
    }

    charIndex--;
    textEl.textContent = word.slice(0, charIndex);
    moveCaret();
    if (charIndex <= 0) {
      erasing = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(tick, GAP_MS);
      return;
    }
    setTimeout(tick, ERASE_MS);
  }

  // Start from the word already in the markup, after the hero reveal settles
  charIndex = words[0].length;
  erasing = true;
  moveCaret();
  setTimeout(tick, 1600);

  window.addEventListener('resize', moveCaret);
})();
