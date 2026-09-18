/*
 * graphic-hero.js
 * Pointer parallax for the Graphic Design hero.
 *
 * Writes --gd-mx / --gd-my (-1..1) onto .gd-hero; the CSS in
 * graphic-services.css decides how far each layer drifts. Updates are
 * throttled to one per animation frame, and the whole thing opts out on
 * touch devices and when the visitor prefers reduced motion.
 */
(function () {
  'use strict';

  var hero = document.querySelector('.gd-hero');
  if (!hero) return;

  var noHover = window.matchMedia('(hover: none)').matches;
  var lessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (noHover || lessMotion) return;

  var targetX = 0, targetY = 0;
  var currentX = 0, currentY = 0;
  var frame = null;
  var active = false;

  function render() {
    // ease toward the pointer so the drift feels weighted rather than snappy
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    hero.style.setProperty('--gd-mx', currentX.toFixed(4));
    hero.style.setProperty('--gd-my', currentY.toFixed(4));

    if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      frame = requestAnimationFrame(render);
    } else {
      frame = null;
    }
  }

  function queue() {
    if (frame === null) frame = requestAnimationFrame(render);
  }

  hero.addEventListener('mousemove', function (e) {
    var r = hero.getBoundingClientRect();
    targetX = ((e.clientX - r.left) / r.width - 0.5) * 2;
    targetY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    if (!active) { active = true; hero.classList.add('is-pointer'); }
    queue();
  });

  hero.addEventListener('mouseleave', function () {
    targetX = 0;
    targetY = 0;
    queue();
  });

  // Stop animating while the tab is hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  });
})();
