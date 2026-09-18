/* Google Ads Service section
   - scales the left infographic canvas (design 560x790) to its column
   - spotlights one stage at a time, auto-advancing 01 -> 05
   - drives a coloured progress arc along the curve to the active badge */
(function () {
  'use strict';

  var FALLBACK_W = 560;
  var FALLBACK_H = 790;
  var DWELL = 3600;           // ms each stage stays lit

  // Arc geometry: centre (108.8, 500.8), r 379.7, spanning -76deg to +76deg
  // (measured off the reference). Length = r * 152deg in radians = 1007.3.
  // Offsets below stop the
  // progress stroke exactly on each badge.
  var ARC_LEN = 1008;
  var STOPS = [918.0, 719.5, 499.4, 280.1, 59.6];

  function init() {
    var sections = document.querySelectorAll('.gads-info');
    if (!sections.length) return;

    Array.prototype.forEach.call(sections, function (section) {
      var stage = section.querySelector('.gads-stage');
      var canvas = stage && stage.querySelector('.gads-canvas');
      var progress = section.querySelector('.gads-progress');
      var cards = Array.prototype.slice.call(section.querySelectorAll('.gads-card'));
      var badges = cards.map(function (card) {
        return section.querySelector('.gads-badge[data-step="' + card.getAttribute('data-step') + '"]');
      });

      var reduced = window.matchMedia &&
                    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      /* ---------- proportional scaling of the left canvas ---------- */

      function resize() {
        if (!stage || !canvas) return;
        var w = stage.clientWidth;
        if (!w) return;

        var ss = getComputedStyle(stage);
        var designW = parseFloat(ss.getPropertyValue('--gads-design-w')) || FALLBACK_W;
        var designH = parseFloat(ss.getPropertyValue('--gads-design-h')) || FALLBACK_H;
        var maxH = parseFloat(ss.getPropertyValue('--gads-max-h')) || Infinity;

        var scale = Math.min(w / designW, maxH / designH);
        var offset = Math.max(0, (w - designW * scale) / 2);

        canvas.style.setProperty('--gads-scale', scale);
        canvas.style.setProperty('--gads-offset', offset + 'px');
        stage.style.height = Math.round(designH * scale) + 'px';
      }

      resize();
      if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(resize).observe(stage || section);
      }
      window.addEventListener('resize', resize);
      window.addEventListener('load', resize);

      /* ---------- the spotlight ---------- */

      var current = -1;
      var timer = null;
      var running = false;

      function paint(i) {
        if (i === current) return;
        current = i;

        cards.forEach(function (card, n) {
          var on = n === i;
          card.classList.toggle('is-active', on);
          // restart the timer bar animation from zero
          card.classList.remove('is-timing');
          if (on && running && !reduced) {
            void card.offsetWidth;               // force reflow so it replays
            card.style.setProperty('--gads-dwell', DWELL + 'ms');
            card.classList.add('is-timing');
          }
          if (badges[n]) badges[n].classList.toggle('is-active', on);
        });

        if (progress) {
          var colour = getComputedStyle(cards[i]).getPropertyValue('--c').trim() || '#4285F4';
          progress.style.stroke = colour;
          progress.style.strokeDashoffset = STOPS[i];
        }
      }

      function advance() { paint((current + 1) % cards.length); }

      function play() {
        if (timer || reduced) return;
        running = true;
        if (current < 0) paint(0); else paint(current);
        timer = setInterval(advance, DWELL);
      }

      function pause() {
        running = false;
        clearInterval(timer);
        timer = null;
        cards.forEach(function (c) { c.classList.remove('is-timing'); });
      }

      // pointing at a card or badge takes over from the autoplay
      cards.forEach(function (card, n) {
        function focusStage() { pause(); paint(n); }
        card.addEventListener('mouseenter', focusStage);
        card.addEventListener('focus', focusStage);
        card.addEventListener('click', focusStage);
        if (badges[n]) {
          badges[n].addEventListener('mouseenter', focusStage);
          badges[n].addEventListener('click', focusStage);
        }
      });

      section.addEventListener('mouseleave', function () { play(); });
      section.addEventListener('focusout', function (e) {
        if (!section.contains(e.relatedTarget)) play();
      });

      /* ---------- start when the section scrolls into view ---------- */

      if (typeof IntersectionObserver !== 'undefined') {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              section.classList.add('is-visible');
              setTimeout(play, 900);            // let the entrance land first
            } else {
              pause();
            }
          });
        }, { threshold: 0.25 });
        io.observe(section);
      } else {
        section.classList.add('is-visible');
        play();
      }

      if (reduced) paint(0);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
