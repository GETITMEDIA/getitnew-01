/*
 * team-hero.js — interaction for the team hero (#team-hero)
 *
 *   1. settles the section once the entrance has played, which frees the
 *      `transform` property for hover states. The entrance animations use
 *      fill:both, so while they exist they hold transform and any :hover
 *      transform is silently ignored.
 *   2. pointer parallax: publishes --mx / --my on the section and lets CSS
 *      move each layer by its own depth, using the `translate` property so
 *      it composes with (rather than fights) transform.
 *
 * Progressive enhancement: if this never runs, the hero still renders and
 * animates in; it simply does not respond to the pointer.
 */
(function () {
  'use strict';

  var hero = document.getElementById('team-hero');
  if (!hero) return;

  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  /* ------------------------------------------------------------------
     1. Settle
     ------------------------------------------------------------------ */
  if (still) {
    hero.classList.add('is-settled');
    return;                       /* no parallax, no hover motion */
  }

  /* the longest entrance finishes at ~1.07s */
  setTimeout(function () { hero.classList.add('is-settled'); }, 1200);

  /* ------------------------------------------------------------------
     2. Pointer parallax — mouse only. A touch pointer never fires
        pointerleave, so the layers would stay stuck at the last tap.
     ------------------------------------------------------------------ */
  if (!fine) return;

  var raf = null;
  var mx = 0;
  var my = 0;

  function paint() {
    raf = null;
    hero.style.setProperty('--mx', mx.toFixed(3));
    hero.style.setProperty('--my', my.toFixed(3));
  }

  function queue() {
    if (raf === null) raf = requestAnimationFrame(paint);
  }

  hero.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    var r = hero.getBoundingClientRect();
    if (!r.width || !r.height) return;
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    queue();
  });

  hero.addEventListener('pointerleave', function () {
    mx = 0;
    my = 0;
    queue();
  });
})();
