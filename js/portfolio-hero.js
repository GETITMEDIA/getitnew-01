/* ==========================================================================
   Portfolio — 3D Creative Hero interactions
   Pure DOM/CSS-3D + canvas: mouse parallax, scroll camera, particles,
   counters and card tilt. No WebGL dependency, ~0 layout thrash (all
   updates are CSS custom properties written inside a single rAF loop).
   ========================================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var hero = document.querySelector('.ph-hero');
    if (!hero) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ---------------- Entrance ---------------- */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { hero.classList.add('is-ready'); });
    });

    /* ---------------- Mouse parallax + scroll camera ---------------- */
    var stage = hero.querySelector('.ph-stage');

    if (stage && !reduced) {
      var targetX = 0, targetY = 0;   // -1 .. 1
      var currentX = 0, currentY = 0;
      var scrollRx = 0, scrollCam = 0;
      var ticking = false;

      var onMove = function (e) {
        var rect = hero.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        start();
      };

      var onLeave = function () { targetX = 0; targetY = 0; start(); };

      var onScroll = function () {
        var rect = hero.getBoundingClientRect();
        // 0 while the hero fills the viewport, 1 once it has scrolled past
        var progress = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1);
        scrollRx = progress * 8;        // camera pitches down as you scroll
        scrollCam = progress * -140;    // and pulls back
        start();
      };

      var tick = function () {
        // critically damped follow — keeps the motion premium, never twitchy
        currentX += (targetX - currentX) * 0.075;
        currentY += (targetY - currentY) * 0.075;

        stage.style.setProperty('--ph-ry', (currentX * 9).toFixed(3) + 'deg');
        stage.style.setProperty('--ph-rx', (currentY * -6).toFixed(3) + 'deg');
        stage.style.setProperty('--ph-tx', (currentX * -22).toFixed(2) + 'px');
        stage.style.setProperty('--ph-ty', (currentY * -14).toFixed(2) + 'px');
        stage.style.setProperty('--ph-scroll-rx', scrollRx.toFixed(2) + 'deg');
        stage.style.setProperty('--ph-cam', scrollCam.toFixed(1) + 'px');

        if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
          requestAnimationFrame(tick);
        } else {
          ticking = false;
        }
      };

      var start = function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(tick);
      };

      if (finePointer) {
        hero.addEventListener('mousemove', onMove);
        hero.addEventListener('mouseleave', onLeave);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      // Stage transitions only smooth the resting state; the rAF loop drives motion
      stage.style.transition = 'none';
    }

    /* ---------------- 3D tilt on the floating portfolio cards ---------------- */
    if (finePointer && !reduced) {
      Array.prototype.forEach.call(hero.querySelectorAll('.ph-card'), function (card) {
        card.addEventListener('mouseenter', function () { card.classList.add('is-tilting'); });

        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty('--ph-tilt-y', (px * 16).toFixed(2) + 'deg');
          card.style.setProperty('--ph-tilt-x', (py * -14).toFixed(2) + 'deg');
        });

        card.addEventListener('mouseleave', function () {
          card.classList.remove('is-tilting');
          card.style.setProperty('--ph-tilt-y', '0deg');
          card.style.setProperty('--ph-tilt-x', '0deg');
        });
      });
    }

    /* ---------------- Animated stat counters ---------------- */
    var counters = hero.querySelectorAll('.ph-stat__num[data-count]');

    var runCounter = function (el) {
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || '';
      var duration = 1800;
      var startTime = performance.now();

      if (reduced) { el.textContent = target + suffix; return; }

      var step = function (now) {
        var p = Math.min((now - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      Array.prototype.forEach.call(counters, function (el) { counterObserver.observe(el); });
    } else {
      Array.prototype.forEach.call(counters, runCounter);
    }

    /* ---------------- Glowing particle field ---------------- */
    var canvas = hero.querySelector('.ph-particles');
    if (!canvas || reduced) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var width = 0, height = 0, dpr = 1;
    var running = true;
    var rafId = null;

    // Three-colour palette: mostly brand orange, a few white sparks
    var COLORS = ['234, 90, 6', '234, 90, 6', '234, 90, 6', '255, 255, 255'];

    var resize = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.offsetWidth;
      height = hero.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Lighter particle load on small screens
      var count = width < 720 ? 26 : width < 1200 ? 48 : 78;
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 0.8 + 0.2,       // depth — drives size and speed
          r: Math.random() * 1.6 + 0.5,
          vx: (Math.random() - 0.5) * 0.16,
          vy: -(Math.random() * 0.24 + 0.05),
          a: Math.random() * 0.5 + 0.2,
          tw: Math.random() * Math.PI * 2,
          c: COLORS[(Math.random() * COLORS.length) | 0]
        });
      }
    };

    var draw = function () {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;
        p.tw += 0.02;

        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        var alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        var radius = p.r * p.z;

        var glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 6);
        glow.addColorStop(0, 'rgba(' + p.c + ',' + alpha.toFixed(3) + ')');
        glow.addColorStop(1, 'rgba(' + p.c + ',0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(' + p.c + ',' + Math.min(alpha * 1.6, 1).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running) rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    // Stop painting when the hero is off-screen or the tab is hidden
    var setRunning = function (state) {
      if (state === running) return;
      running = state;
      if (running) { rafId = requestAnimationFrame(draw); }
      else if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    };

    document.addEventListener('visibilitychange', function () {
      setRunning(!document.hidden);
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        setRunning(entries[0].isIntersecting && !document.hidden);
      }, { threshold: 0 }).observe(hero);
    }
  });
})();
