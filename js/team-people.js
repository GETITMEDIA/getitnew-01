/*
 * team-people.js — "the wall" composition on team.html
 *
 *   1. staggered entrance as the canvas scrolls in
 *   2. depth parallax: each portrait drifts by its own --tp-d multiplier
 *   3. an elegant cursor bubble that reads VIEW over a portrait
 *
 * All three are progressive enhancement. The entrance's hidden state lives
 * behind .tp-ready, which is only added once the figures have been collected,
 * so a script failure can never leave the section blank. Touch devices and
 * reduced-motion visitors get the static composition.
 */
(function () {
  'use strict';

  var section = document.querySelector('.tp');
  if (!section) return;

  var figures = Array.prototype.slice.call(section.querySelectorAll('.tp-fig'));
  if (!figures.length) return;

  var lessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------
     1. Entrance
     ------------------------------------------------------------------ */
  if (!lessMotion && 'IntersectionObserver' in window) {
    figures.forEach(function (fig, i) {
      // stagger across the band, not straight down the list
      fig.style.setProperty('--tp-delay', (i % 4) * 90 + Math.floor(i / 4) * 60 + 'ms');
    });

    document.documentElement.classList.add('tp-ready');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

    figures.forEach(function (f) { io.observe(f); });

    requestAnimationFrame(function () {
      figures.forEach(function (f) {
        var r = f.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
          f.classList.add('is-in');
          io.unobserve(f);
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     2. Depth parallax
     ------------------------------------------------------------------ */
  if (finePointer && !lessMotion) {
    var tx = 0, ty = 0, cx = 0, cy = 0, frame = null;

    var depths = figures.map(function (f) {
      return parseFloat(getComputedStyle(f).getPropertyValue('--tp-d')) || 1;
    });

    function render() {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;

      for (var i = 0; i < figures.length; i++) {
        var d = depths[i];
        figures[i].style.setProperty('--tp-px', (cx * 16 * d).toFixed(2) + 'px');
        figures[i].style.setProperty('--tp-py', (cy * 12 * d).toFixed(2) + 'px');
      }

      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        frame = requestAnimationFrame(render);
      } else {
        frame = null;
      }
    }

    function queue() { if (frame === null) frame = requestAnimationFrame(render); }

    section.addEventListener('mousemove', function (e) {
      var r = section.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      queue();
    });

    section.addEventListener('mouseleave', function () { tx = 0; ty = 0; queue(); });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden && frame !== null) { cancelAnimationFrame(frame); frame = null; }
    });
  }

  /* ------------------------------------------------------------------
     3. Cursor bubble
     ------------------------------------------------------------------ */
  if (finePointer && !lessMotion) {
    var dot = document.createElement('div');
    dot.className = 'tp__cursor';
    dot.setAttribute('aria-hidden', 'true');
    dot.textContent = 'View';
    document.body.appendChild(dot);

    var px = 0, py = 0, dx = 0, dy = 0, dFrame = null, on = false;

    function dRender() {
      dx += (px - dx) * 0.18;
      dy += (py - dy) * 0.18;
      dot.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)' + (on ? ' scale(1)' : ' scale(0.3)');
      if (Math.abs(px - dx) > 0.1 || Math.abs(py - dy) > 0.1) {
        dFrame = requestAnimationFrame(dRender);
      } else {
        dFrame = null;
      }
    }

    section.addEventListener('mousemove', function (e) {
      px = e.clientX;
      py = e.clientY;
      if (dFrame === null) dFrame = requestAnimationFrame(dRender);
    });

    figures.forEach(function (f) {
      f.addEventListener('mouseenter', function () { on = true; dot.classList.add('is-on'); });
      f.addEventListener('mouseleave', function () { on = false; dot.classList.remove('is-on'); });
    });

    section.addEventListener('mouseleave', function () {
      on = false;
      dot.classList.remove('is-on');
    });
  }
})();
