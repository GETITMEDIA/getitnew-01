/* Meta Ads section
   Scales the fixed 582x550 design canvas to its container so every
   proportion from the reference is preserved at any viewport width,
   and plays the entrance once the section scrolls into view. */
(function () {
  'use strict';

  var DESIGN_W = 582;
  var DESIGN_H = 550;

  function init() {
    var stages = document.querySelectorAll('.meta-stage');
    if (!stages.length) return;

    Array.prototype.forEach.call(stages, function (stage) {
      var canvas = stage.querySelector('.meta-canvas');
      if (!canvas) return;

      function resize() {
        var w = stage.clientWidth;
        if (!w) return;
        var scale = w / DESIGN_W;
        canvas.style.setProperty('--meta-scale', scale);
        stage.style.height = Math.round(DESIGN_H * scale) + 'px';
      }

      resize();
      if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(resize).observe(stage);
      }
      window.addEventListener('resize', resize);
      window.addEventListener('load', resize);

      var section = stage.closest ? stage.closest('.meta-section') : null;
      if (!section) return;

      if (typeof IntersectionObserver !== 'undefined') {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              section.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.2 });
        io.observe(section);
      } else {
        section.classList.add('is-visible');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
