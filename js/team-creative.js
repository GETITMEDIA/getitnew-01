/*
 * team-creative.js — the "Meet The Creative Minds" section (#creative-team)
 *
 *   1. entrance: heading lines out of their masks, then the cards, held by
 *      an IntersectionObserver rather than a scroll trigger so a fault can
 *      never leave the section blank
 *   2. a very slight pointer parallax across the stage
 *   3. the scroll indicator jumps to whatever section follows
 *
 * Standalone — shares no scope with the other team scripts, so a fault in
 * either cannot take this one down. Progressive enhancement throughout:
 * the hidden start state lives behind an .is-live class this file adds
 * only once it has decided to animate.
 */
(function () {
  'use strict';

  var section = document.querySelector('.cm');
  if (!section) return;

  var lessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var wideEnough = window.matchMedia('(min-width: 1025px)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';

  var stage = section.querySelector('.cm__stage');
  var cards = Array.prototype.slice.call(section.querySelectorAll('.cm-card'));

  /* ------------------------------------------------------------------
     1. Entrance
     ------------------------------------------------------------------ */
  if (hasGsap && !lessMotion) {
    section.classList.add('is-live');

    var tl = window.gsap.timeline({ defaults: { ease: 'power3.out' }, paused: true });

    /* fromTo, not to: the CSS start state is translateY(112%), which GSAP
       reads off the matrix as y:100.52px / yPercent:0 — tweening yPercent
       to 0 would then be a no-op and the heading would never arrive. The
       explicit from state hands GSAP the percentage it needs and zeroes y. */
    tl.fromTo(section.querySelectorAll('.cm__mask > span'),
      { yPercent: 112, y: 0 },
      { yPercent: 0, duration: 0.9, stagger: 0.1 }, 0)
      .to(section.querySelectorAll('.cm__eyebrow, .cm__lead'), {
        opacity: 1, duration: 0.65, stagger: 0.09
      }, '-=0.55');

    // 02 lands first — it leads the composition — then the others settle
    var order = [1, 0, 2, 3];
    order.forEach(function (idx, step) {
      var card = cards[idx];
      if (!card) return;
      /* --enter, not y: the card's transform is built from custom
         properties (--ty, --rz, --ry and the pointer's --cm-mx/--cm-my),
         and an inline transform from GSAP would flatten the staggered
         depths and freeze the parallax. */
      tl.fromTo(card,
        { '--enter': '60px' },
        { '--enter': '0px', opacity: 1, duration: 0.95 },
        0.3 + step * 0.12);
    });

    var played = false;
    var play = function () {
      if (played) return;
      played = true;
      tl.play();
    };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          play();
          io.disconnect();
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
      io.observe(section);

      requestAnimationFrame(function () {
        var r = section.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) play();
      });
    } else {
      play();
    }
  }

  /* ------------------------------------------------------------------
     2. Pointer parallax — desktop only. On touch there is no leave
        event, so the stage would freeze at the last tap angle.
     ------------------------------------------------------------------ */
  if (stage && finePointer && wideEnough && !lessMotion) {
    var raf = null;
    var mx = 0, my = 0;

    var paint = function () {
      raf = null;
      stage.style.setProperty('--cm-mx', mx.toFixed(3));
      stage.style.setProperty('--cm-my', my.toFixed(3));
    };

    stage.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var r = stage.getBoundingClientRect();
      if (!r.width || !r.height) return;
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (raf === null) raf = requestAnimationFrame(paint);
    });

    stage.addEventListener('pointerleave', function () {
      mx = 0; my = 0;
      if (raf === null) raf = requestAnimationFrame(paint);
    });
  }

  /* If we never took over, make certain the cards are showing —
     .is-live is what hides them. */
  if (!section.classList.contains('is-live')) {
    cards.forEach(function (c) { c.style.opacity = '1'; });
  }
})();
