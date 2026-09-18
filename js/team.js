/*
 * team.js — GetIt Media Solutions team page
 *
 * 1. Count-up on the hero stat strip
 * 2. Scroll reveal for sections
 *
 * Everything is progressive enhancement: the hidden/reveal states live behind
 * a .tm-ready class this script adds, so if it never runs the page still
 * renders in full. Reduced-motion visitors skip the animation entirely.
 */
(function () {
  'use strict';

  var lessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. Stat count-up
     ------------------------------------------------------------------ */
  (function counters() {
    var nums = document.querySelectorAll('[data-count-to]');
    if (!nums.length || lessMotion || !('IntersectionObserver' in window)) return;

    function run(el) {
      var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
      var start = null;
      var dur = 1500;

      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.6 });

    Array.prototype.forEach.call(nums, function (el) { io.observe(el); });
  })();

  /* ------------------------------------------------------------------
     2. Scroll reveal
     ------------------------------------------------------------------ */
  (function reveal() {
    if (lessMotion || !('IntersectionObserver' in window)) return;

    var targets = document.querySelectorAll('[data-tm-reveal]');
    if (!targets.length) return;

    // stagger siblings that share a parent
    var byParent = new Map();
    Array.prototype.forEach.call(targets, function (el) {
      var key = el.parentElement;
      var n = byParent.get(key) || 0;
      byParent.set(key, n + 1);
      el.style.setProperty('--tm-delay', Math.min(n, 8) * 70 + 'ms');
    });

    document.documentElement.classList.add('tm-ready');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });

    // anything already on screen reveals right away
    requestAnimationFrame(function () {
      Array.prototype.forEach.call(targets, function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
    });
  })();
})();
