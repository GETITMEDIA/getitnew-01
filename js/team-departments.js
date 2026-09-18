/*
 * team-departments.js — team.html
 *
 *   1. scroll reveal for every [data-rv] block, staggered per section
 *   2. count-up on any [data-count] number (social bar, dashboard KPIs)
 *   3. .is-in on the dashboard cards, which is what fills the KPI meters
 *   4. a light parallax drift on section 01's oversized background word
 *   5. pointer tilt + cursor sheen on the video editor cards
 *   6. cursor ruler guides + a registration snap on the press sheet
 *
 * Progressive enhancement throughout: the hidden state lives behind a
 * .dp-ready class this script adds only after the targets are collected,
 * so a failure can never leave a department blank. Reduced-motion visitors
 * get everything static.
 */
(function () {
  'use strict';

  var lessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ------------------------------------------------------------------
     1 + 3. Reveals
     ------------------------------------------------------------------ */
  var blocks = Array.prototype.slice.call(document.querySelectorAll('[data-rv]'));

  if (blocks.length && hasIO && !lessMotion) {
    // stagger within each section, not across the whole page
    var perSection = new Map();
    blocks.forEach(function (el) {
      var sec = el.closest('section') || document.body;
      var n = perSection.get(sec) || 0;
      perSection.set(sec, n + 1);
      el.style.setProperty('--dp-delay', Math.min(n, 6) * 100 + 'ms');
    });

    document.documentElement.classList.add('dp-ready');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    blocks.forEach(function (b) { io.observe(b); });

    requestAnimationFrame(function () {
      blocks.forEach(function (b) {
        var r = b.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
          b.classList.add('is-in');
          io.unobserve(b);
        }
      });
    });
  } else {
    // no observer (or reduced motion): meters still need .is-in to fill
    blocks.forEach(function (b) { b.classList.add('is-in'); });
  }

  /* ------------------------------------------------------------------
     2. Count-ups
     ------------------------------------------------------------------ */
  var nums = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));

  if (nums.length) {
    if (!hasIO || lessMotion) {
      nums.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
    } else {
      var run = function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var start = null;
        var dur = 1400;

        var step = function (ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };

      var nio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          run(e.target);
          nio.unobserve(e.target);
        });
      }, { threshold: 0.6 });

      nums.forEach(function (n) { nio.observe(n); });
    }
  }

  /* ------------------------------------------------------------------
     4. Parallax on the Design section's background word
     ------------------------------------------------------------------ */
  var word = document.querySelector('.cr__word');
  if (word && !lessMotion) {
    var ticking = false;

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var r = word.getBoundingClientRect();
        // -1 (below the fold) .. 1 (above it)
        var p = 1 - (r.top + r.height / 2) / (window.innerHeight || 1) * 2;
        word.style.transform = 'translate3d(0,' + (p * 26).toFixed(1) + 'px,0)';
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------
     5. Pointer tilt on the video cards

     The frame leans toward the cursor and a soft sheen tracks it. Both
     are written as CSS custom properties so the stylesheet still owns
     the look, and both are skipped for reduced motion and for coarse
     pointers, where a tilt that never resets just looks broken.
     ------------------------------------------------------------------ */
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var cards = Array.prototype.slice.call(document.querySelectorAll('.vd-card'));

  if (cards.length && finePointer && !lessMotion) {
    cards.forEach(function (card) {
      var frame = card.querySelector('.vd-card__img');
      if (!frame) return;

      var raf = null;
      var rx = 0, ry = 0, mx = 50, my = 50;

      var paint = function () {
        raf = null;
        frame.style.setProperty('--vd-rx', rx.toFixed(2) + 'deg');
        frame.style.setProperty('--vd-ry', ry.toFixed(2) + 'deg');
        frame.style.setProperty('--vd-mx', mx.toFixed(1) + '%');
        frame.style.setProperty('--vd-my', my.toFixed(1) + '%');
      };

      var schedule = function () {
        if (raf === null) raf = requestAnimationFrame(paint);
      };

      card.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        var r = frame.getBoundingClientRect();
        if (!r.width || !r.height) return;

        var px = (e.clientX - r.left) / r.width;    // 0 .. 1 across
        var py = (e.clientY - r.top) / r.height;    // 0 .. 1 down

        mx = px * 100;
        my = py * 100;
        rx = (0.5 - py) * 7;      // lean back at the top, forward at the base
        ry = (px - 0.5) * 9;

        card.classList.add('is-tilt');
        schedule();
      });

      var release = function () {
        card.classList.remove('is-tilt');   // hands the return to the slow curve
        rx = 0; ry = 0; mx = 50; my = 50;
        schedule();
      };

      card.addEventListener('pointerleave', release);
      card.addEventListener('pointercancel', release);
    });
  }

  /* ------------------------------------------------------------------
     6. The press sheet

     Ruler guides ride the cursor across the sheet with a live coordinate
     readout, and each plate drops a hair out of register on approach and
     pulls back in. Same guards as the tilt: fine pointers only, and
     nothing at all for reduced motion.
     ------------------------------------------------------------------ */
  var sheets = Array.prototype.slice.call(document.querySelectorAll('.cr__sheet'));

  if (sheets.length && finePointer && !lessMotion) sheets.forEach(function (sheet) {
    var coords = sheet.querySelector('.cr__coords');
    var gRaf = null;
    var gx = 0, gy = 0;

    var paintGuides = function () {
      gRaf = null;
      sheet.style.setProperty('--cr-x', gx + 'px');
      sheet.style.setProperty('--cr-y', gy + 'px');
      if (coords) coords.textContent = 'X ' + gx + '   Y ' + gy;
    };

    sheet.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var r = sheet.getBoundingClientRect();
      gx = Math.round(e.clientX - r.left);
      gy = Math.round(e.clientY - r.top);
      sheet.classList.add('is-live');
      if (gRaf === null) gRaf = requestAnimationFrame(paintGuides);
    });

    sheet.addEventListener('pointerleave', function () {
      sheet.classList.remove('is-live');
    });

    // the registration snap, once per approach
    Array.prototype.slice.call(sheet.querySelectorAll('.cr-plate')).forEach(function (plate) {
      var img = plate.querySelector('.cr-plate__img');
      if (!img) return;

      plate.addEventListener('pointerenter', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        plate.classList.remove('is-reg');
        void img.offsetWidth;          // restart the animation
        plate.classList.add('is-reg');
      });

      img.addEventListener('animationend', function () {
        plate.classList.remove('is-reg');
      });
    });
  });
})();
  }

/* ------------------------------------------------------------------
   8. 3D Magnetic Parallax Card Tilt
   ------------------------------------------------------------------ */
var cyberCards = Array.prototype.slice.call(document.querySelectorAll('.cyber-card'));

if (cyberCards.length && finePointer && !lessMotion) {
  cyberCards.forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;

      var rx = (0.5 - py) * 14;
      var ry = (px - 0.5) * 16;

      card.style.transform = 'perspective(1000px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale3d(1.02, 1.02, 1.02)';
    });

    var resetCard = function () {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    card.addEventListener('pointerleave', resetCard);
    card.addEventListener('pointercancel', resetCard);
  });
}

/* ------------------------------------------------------------------
   9. Cyber Data Core Modal Handler
   ------------------------------------------------------------------ */
var cyberModal = document.getElementById('cyberModal') || document.getElementById('dvModal');
var cyberModalClose = document.getElementById('cyberModalClose') || document.getElementById('dvModalClose');
var modalBtns = Array.prototype.slice.call(document.querySelectorAll('[data-modal-trigger]'));

if (cyberModal && modalBtns.length) {
  var avatarEl = document.getElementById('cyberModalAvatar') || document.getElementById('dvModalAvatar');
  var nameEl = document.getElementById('cyberModalName') || document.getElementById('dvModalName');
  var roleEl = document.getElementById('cyberModalRole') || document.getElementById('dvModalRole');
  var descEl = document.getElementById('cyberModalDesc') || document.getElementById('dvModalDesc');
  var metricEl = document.getElementById('cyberModalMetric') || document.getElementById('dvModalMetric');
  var stackEl = document.getElementById('cyberModalStack') || document.getElementById('dvModalStack');
  var tagEl = document.getElementById('cyberModalTag') || document.getElementById('dvModalTag');

  var openModal = function (card) {
    if (!card) return;
    var devId = card.getAttribute('data-dev-id') || 'DEV';
    var name = card.getAttribute('data-name') || '';
    var role = card.getAttribute('data-role') || '';
    var img = card.getAttribute('data-img') || '';
    var desc = card.getAttribute('data-desc') || '';
    var stack = card.getAttribute('data-stack') || '';
    var metric = card.getAttribute('data-metric') || '100%';

    if (tagEl) tagEl.textContent = 'DATA CORE // ' + devId.toUpperCase();
    if (nameEl) nameEl.textContent = name;
    if (roleEl) roleEl.textContent = role;
    if (avatarEl) { avatarEl.src = img; avatarEl.alt = name; }
    if (descEl) descEl.textContent = desc;
    if (metricEl) metricEl.textContent = metric;
    if (stackEl) stackEl.textContent = stack;

    cyberModal.classList.add('is-open');
    cyberModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  var closeModal = function () {
    cyberModal.classList.remove('is-open');
    cyberModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  modalBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var card = btn.closest('.cyber-card, .dv-card, .dv-mod');
      openModal(card);
    });
  });

  if (cyberModalClose) {
    cyberModalClose.addEventListener('click', closeModal);
  }

  cyberModal.addEventListener('click', function (e) {
    if (e.target === cyberModal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cyberModal.classList.contains('is-open')) {
      closeModal();
    }
  });
}
}) ();

