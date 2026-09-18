(function () {
  'use strict';

  // Skip entirely on touch/coarse-pointer devices
  if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }

  // Custom cursor elements disabled & hidden.
  // `ring` still has to exist: tick() below reads it, and an undeclared
  // reference threw a ReferenceError on the first frame, which killed the
  // rAF loop and stopped window.__cursorRingPos from ever updating
  // (text-reveal.js reads that position).
  var dot = null;
  var ring = null;

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var ringX = mouseX;
  var ringY = mouseY;
  var EASE = 0.16; /* <- CHANGE CURSOR TRAIL SPEED HERE (0..1, higher = snappier) */

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.documentElement.classList.remove('cursor-hidden');
  }, { passive: true });

  document.addEventListener('mouseleave', function () {
    document.documentElement.classList.add('cursor-hidden');
  });
  document.addEventListener('mouseenter', function () {
    document.documentElement.classList.remove('cursor-hidden');
  });

  document.addEventListener('mousedown', function () {
    document.documentElement.classList.add('cursor-down');
  });
  document.addEventListener('mouseup', function () {
    document.documentElement.classList.remove('cursor-down');
  });

  // Ring trails the dot with easing for a smooth premium feel. Also drives
  // any active [data-reveal-text] spotlight (see text-reveal.js) off the
  // exact same eased coordinate, so the cursor ring and the text glow read
  // as one connected light source instead of two separate effects.
  window.__cursorRingPos = { x: ringX, y: ringY };

  function tick() {
    ringX += (mouseX - ringX) * EASE;
    ringY += (mouseY - ringY) * EASE;
    if (ring && ring.parentNode) {
      ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
    }
    window.__cursorRingPos.x = ringX;
    window.__cursorRingPos.y = ringY;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Grow the ring only over real, small clickable controls — never a large
  // wrapping block (a heading, a card, a whole section) that would place the
  // grown state on top of text and make it unreadable.
  var hoverSelector = 'a, button, input, textarea, select, [role="button"]';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest && e.target.closest(hoverSelector)) {
      document.documentElement.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest && e.target.closest(hoverSelector)) {
      document.documentElement.classList.remove('cursor-hover');
    }
  });
})();
