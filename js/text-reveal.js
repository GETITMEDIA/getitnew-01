(function () {
  'use strict';

  if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return; // touch/coarse-pointer: leave plain text, no spotlight
  }

  var targets = Array.prototype.slice.call(document.querySelectorAll('[data-reveal-text]'));
  if (!targets.length) return;

  targets.forEach(function (el) {
    // Clone the element's existing content (including any inline images/
    // spans, e.g. the hero heading's inline icon and the underlined span)
    // into a yellow overlay layer stacked exactly on top of the original.
    var layer = document.createElement('span');
    layer.className = 'reveal-text__layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = el.innerHTML;
    el.appendChild(layer);

    function updateSpotlight(clientX, clientY) {
      var rect = el.getBoundingClientRect();
      layer.style.setProperty('--mx', (clientX - rect.left) + 'px');
      layer.style.setProperty('--my', (clientY - rect.top) + 'px');
    }

    el.addEventListener('mouseenter', function () {
      el.classList.add('is-reveal-active');
    });
    el.addEventListener('mouseleave', function () {
      el.classList.remove('is-reveal-active');
    });

    // Follow the SAME eased coordinate the custom cursor ring uses (see
    // cursor.js), so the text glow and the cursor ring read as one
    // connected light source rather than two separate effects.
    (function tick() {
      if (el.classList.contains('is-reveal-active') && window.__cursorRingPos) {
        updateSpotlight(window.__cursorRingPos.x, window.__cursorRingPos.y);
      }
      requestAnimationFrame(tick);
    })();
  });
})();
