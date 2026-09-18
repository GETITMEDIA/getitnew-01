/*
 * graphic-text-anim.js
 * Scroll-triggered text choreography for graphic.html.
 *
 * Two reveal types:
 *   words  - the element's text is split into words, each rising from behind a
 *            clipped edge on a stagger. Used for headings.
 *   rise   - the element as a whole fades and lifts. Used for body copy,
 *            eyebrows, list items, buttons.
 *
 * Safety: the "hidden" start state lives behind a .gd-anim-ready class that
 * only this script adds. If the script never runs, every element renders
 * normally. Visitors who prefer reduced motion are opted out entirely.
 */
(function () {
  'use strict';

  var root = document.documentElement;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  /* Which elements animate, and how. Order matters only within a group:
     `stagger` spaces siblings inside the same parent. */
  var PLAN = [
    { sel: '.gd-section-header__num', type: 'rise', delay: 0 },
    { sel: '.gd-section-header__title', type: 'words', delay: 80 },
    { sel: '.gd-section-header__line', type: 'line', delay: 320 },
    { sel: '.gd-section-header__desc', type: 'rise', delay: 400 },

    { sel: '.gd-split__num', type: 'pop', delay: 0 },
    { sel: '.gd-split__title', type: 'words', delay: 90 },
    { sel: '.gd-split__desc', type: 'rise', delay: 320 },
    { sel: '.gd-split__features li', type: 'rise', delay: 420, stagger: 90 },

    /* Bento overlay copy only appears on hover, so it is left to its own
       CSS transition rather than a scroll reveal. */

    { sel: '.gd-phone-text .gd-split__num', type: 'pop', delay: 0 },
    { sel: '.gd-phone-text__title', type: 'words', delay: 90 },
    { sel: '.gd-phone-text__desc', type: 'rise', delay: 320 },
    { sel: '.gd-phone-text__tag', type: 'rise', delay: 420, stagger: 80 },

    { sel: '.gd-cta__title', type: 'words', delay: 60 },
    { sel: '.gd-cta__subtitle', type: 'rise', delay: 340 },
    { sel: '.gd-cta__btn', type: 'rise', delay: 460 },
    { sel: '.gd-social-btn', type: 'pop', delay: 560, stagger: 60 }
  ];

  /* Wrap each word so it can be clipped and lifted independently.
     Only touches elements whose content is plain text - anything with child
     markup is left alone so existing spans/links are never destroyed. */
  function splitWords(el) {
    if (el.dataset.gdSplit === 'done') return true;
    if (el.children.length) return false;

    var words = el.textContent.trim().split(/\s+/);
    if (!words.length) return false;

    var frag = document.createDocumentFragment();
    words.forEach(function (word, i) {
      var outer = document.createElement('span');
      outer.className = 'gd-w';
      outer.style.setProperty('--gd-i', i);

      var inner = document.createElement('span');
      inner.textContent = word;

      outer.appendChild(inner);
      frag.appendChild(outer);
      if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
    });

    el.textContent = '';
    el.appendChild(frag);
    el.dataset.gdSplit = 'done';
    return true;
  }

  var targets = [];

  PLAN.forEach(function (rule) {
    var nodes = document.querySelectorAll(rule.sel);
    var byParent = new Map();

    Array.prototype.forEach.call(nodes, function (el) {
      var type = rule.type;

      if (type === 'words' && !splitWords(el)) type = 'rise';

      /* siblings sharing a parent get spaced apart */
      var extra = 0;
      if (rule.stagger) {
        var key = el.parentElement;
        var n = byParent.get(key) || 0;
        extra = n * rule.stagger;
        byParent.set(key, n + 1);
      }

      el.setAttribute('data-gd-anim', type);
      el.style.setProperty('--gd-delay', (rule.delay + extra) + 'ms');
      targets.push(el);
    });
  });

  if (!targets.length) return;

  /* Only now hide things - so a mid-script failure can never leave the page blank */
  root.classList.add('gd-anim-ready');

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(function (el) { io.observe(el); });

  /* Anything already on screen at load reveals immediately rather than
     waiting for a scroll that may never come. */
  requestAnimationFrame(function () {
    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        el.classList.add('is-in');
        io.unobserve(el);
      }
    });
  });
})();
