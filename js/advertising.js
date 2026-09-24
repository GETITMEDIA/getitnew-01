/* ==========================================================================
   Advertising Shoots page (advertising.html)
   Vanilla JS, no dependencies. The shared navbar / mobile menu are driven by
   js/navbar.js; everything here is scoped to the .as page content.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  root.classList.add('as-js');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }

  /* ---------------- opening: letterbox + title ---------------- */
  function opened() { root.classList.add('as-loaded'); }
  if (document.readyState === 'complete') requestAnimationFrame(opened);
  else window.addEventListener('load', function () { requestAnimationFrame(opened); });
  setTimeout(opened, 1800); // never leave the bars closed if an image stalls

  /* ---------------- smooth in-page scrolling ---------------- */
  function headerOffset() {
    var nav = document.getElementById('navbar');
    var bar = document.getElementById('asJourney');
    var h = nav ? nav.getBoundingClientRect().height : 0;
    return h + (bar ? bar.getBoundingClientRect().height : 0) - 4;
  }
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href');
    if (id.length < 2) return;
    var target = document.getElementById(id.slice(1));
    if (!target) return;
    e.preventDefault();
    var y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------------- viewfinder timecode ---------------- */
  var tc = document.getElementById('asTimecode');
  if (tc && !reduceMotion) {
    var t0 = performance.now();
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    setInterval(function () {
      var ms = performance.now() - t0;
      var f = Math.floor((ms % 1000) / (1000 / 24));
      var s = Math.floor(ms / 1000);
      tc.textContent = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60) + ':' + pad(f);
    }, 42);
  }

  /* ---------------- clapperboard: claps and counts takes ---------------- */
  var clap = document.getElementById('asClap');
  var take = document.getElementById('asTake');
  if (clap && !reduceMotion) {
    var takeNo = 3;
    setInterval(function () {
      clap.classList.add('is-clapping');
      setTimeout(function () {
        clap.classList.remove('is-clapping');
        takeNo = takeNo >= 9 ? 1 : takeNo + 1;
        if (take) take.textContent = (takeNo < 10 ? '0' : '') + takeNo;
      }, 260);
    }, 3800);
  }

  /* ---------------- mouse depth in the hero ---------------- */
  var hero = $('.as-hero');
  if (hero && clap && finePointer && !reduceMotion) {
    var depthEls = $$('[data-depth]', hero);
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      clap.style.setProperty('--ry', (-18 + x * 22).toFixed(2) + 'deg');
      clap.style.setProperty('--rx', (8 - y * 16).toFixed(2) + 'deg');
      depthEls.forEach(function (el) {
        var d = parseFloat(el.getAttribute('data-depth')) || 1;
        el.style.translate = (x * -24 * d).toFixed(1) + 'px ' + (y * -24 * d).toFixed(1) + 'px';
      });
    });
    hero.addEventListener('mouseleave', function () {
      clap.style.setProperty('--ry', '-18deg');
      clap.style.setProperty('--rx', '8deg');
      depthEls.forEach(function (el) { el.style.translate = ''; });
    });
  }

  /* ---------------- statement: split into words ---------------- */
  var statement = document.getElementById('asStatement');
  var words = [];
  if (statement) {
    var hot = /^(planning|lighting|location|photography|videography|post-production|editing|engaging)/i;
    var parts = statement.textContent.replace(/\s+/g, ' ').trim().split(' ');
    statement.textContent = '';
    parts.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'as-word' + (hot.test(w) ? ' as-word--hot' : '');
      span.textContent = w;
      statement.appendChild(span);
      if (i < parts.length - 1) statement.appendChild(document.createTextNode(' '));
      words.push(span);
    });
    if (reduceMotion) words.forEach(function (w) { w.classList.add('is-lit'); });
  }

  /* ---------------- scroll reveal + image reveal ---------------- */
  var revealEls = $$('[data-as-reveal], .as-reveal-img, .as-cta');
  revealEls.forEach(function (el) {
    if (!el.hasAttribute('data-as-reveal')) return;
    var sibs = $$(':scope > [data-as-reveal]', el.parentElement);
    var i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', Math.min(i, 6) * 110 + 'ms');
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------- interactive stage item lists ---------------- */
  $$('[data-items]').forEach(function (box) {
    var btns = $$('.as-items__list button', box);
    var panel = $('.as-items__panel', box);
    var icon = $('.as-items__icon i', box);
    var name = $('.as-items__name', box);
    var text = $('.as-items__text', box);
    function pick(btn) {
      btns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      icon.className = 'fa-solid ' + btn.getAttribute('data-icon');
      name.textContent = btn.textContent;
      text.innerHTML = btn.getAttribute('data-text');
      panel.classList.remove('is-swap'); void panel.offsetWidth; panel.classList.add('is-swap');
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { pick(b); });
      if (finePointer) b.addEventListener('mouseenter', function () { pick(b); });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = btns[(i + 1) % btns.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = btns[(i - 1 + btns.length) % btns.length];
        if (n) { e.preventDefault(); pick(n); n.focus(); }
      });
    });
    pick(btns[0]);
  });

  /* ---------------- lighting set ---------------- */
  var set = document.getElementById('asSet');
  var meta = document.getElementById('asLightMeta');
  if (set) {
    var lights = $$('.as-set__controls button');
    lights.forEach(function (b) {
      b.addEventListener('click', function () {
        set.setAttribute('data-light', b.getAttribute('data-light'));
        if (meta) meta.innerHTML = b.getAttribute('data-meta');
        lights.forEach(function (x) {
          var on = x === b;
          x.classList.toggle('is-on', on);
          x.setAttribute('aria-checked', on ? 'true' : 'false');
        });
      });
    });
  }

  /* ---------------- before / after grade ---------------- */
  var compare = document.getElementById('asCompare');
  if (compare) {
    var range = $('.as-compare__range', compare);
    var setPos = function (v) { compare.style.setProperty('--pos', v + '%'); };
    range.addEventListener('input', function () { setPos(range.value); });
    // a gentle hint sweep the first time it comes into view
    if ('IntersectionObserver' in window && !reduceMotion) {
      var hinted = false;
      new IntersectionObserver(function (en, obs) {
        if (!en[0].isIntersecting || hinted) return;
        hinted = true; obs.disconnect();
        var start = null;
        (function sweep(t) {
          if (!start) start = t;
          var p = Math.min((t - start) / 1600, 1);
          var v = 50 + Math.sin(p * Math.PI * 2) * 22;
          setPos(v.toFixed(1)); range.value = v;
          if (p < 1) requestAnimationFrame(sweep); else { setPos(50); range.value = 50; }
        })(performance.now());
      }, { threshold: 0.6 }).observe(compare);
    }
  }

  /* ---------------- final ad devices follow the mouse ---------------- */
  var devices = document.getElementById('asDevices');
  if (devices && finePointer && !reduceMotion) {
    devices.addEventListener('mousemove', function (e) {
      var r = devices.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      devices.style.setProperty('--ty', (x * 10).toFixed(2) + 'deg');
      devices.style.setProperty('--tx', (-y * 8).toFixed(2) + 'deg');
    });
    devices.addEventListener('mouseleave', function () {
      devices.style.setProperty('--ty', '0deg');
      devices.style.setProperty('--tx', '0deg');
    });
  }

  /* ---------------- magnetic buttons ---------------- */
  if (finePointer && !reduceMotion) {
    $$('[data-magnet]').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.2).toFixed(1) + 'px,' +
          ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------------- one scroll loop: parallax, words, journey ---------------- */
  var parallaxEls = $$('[data-scroll-speed]');
  var stagesWrap = document.getElementById('as-journey');
  var journey = document.getElementById('asJourney');
  var nodes = journey ? $$('.as-journey__node', journey) : [];
  var s1 = document.getElementById('as-stage-1');
  var s2 = document.getElementById('as-stage-2');
  var s3 = document.getElementById('as-stage-3');
  var fin = document.getElementById('as-final');
  var ticking = false;

  function docTop(el) { return el.getBoundingClientRect().top + window.pageYOffset; }

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var y = window.pageYOffset;

    // section parallax only where there is room for it; on phones everything stacks
    var roomy = window.innerWidth >= 768;
    if (!reduceMotion) {
      parallaxEls.forEach(function (el) {
        if (!roomy) { el.style.translate = ''; return; }
        var speed = parseFloat(el.getAttribute('data-scroll-speed')) || 0;
        var host = el.closest('section') || el.parentElement;
        var r = host.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var center = r.top + r.height / 2 - vh / 2;
        el.style.translate = '0 ' + (center * -speed).toFixed(1) + 'px';
      });
    }

    // statement: light words as the paragraph passes the middle of the screen
    if (statement && words.length && !reduceMotion) {
      var sr = statement.getBoundingClientRect();
      var p = clamp((vh * 0.82 - sr.top) / (sr.height + vh * 0.35), 0, 1);
      var lit = Math.round(p * words.length);
      for (var i = 0; i < words.length; i++) words[i].classList.toggle('is-lit', i < lit);
    }

    // journey: IDEA (0) → PLAN (1) → SHOOT (2) → EDIT (3) → FINAL AD (4)
    if (journey && s1 && s2 && s3 && fin) {
      var probe = y + vh * 0.45;
      var marks = [docTop(s1), docTop(s1) + s1.offsetHeight * 0.5, docTop(s2), docTop(s3), docTop(fin)];
      var active = -1;
      for (var m = 0; m < marks.length; m++) if (probe >= marks[m]) active = m;
      var progress = 0;
      if (active >= 0 && active < marks.length - 1) {
        progress = active + clamp((probe - marks[active]) / (marks[active + 1] - marks[active]), 0, 1);
      } else if (active === marks.length - 1) {
        progress = marks.length - 1;
      }
      journey.style.setProperty('--jp', (progress / (marks.length - 1) * 100).toFixed(2) + '%');
      nodes.forEach(function (n, k) {
        n.classList.toggle('is-active', k === active);
        n.classList.toggle('is-done', k < active);
        if (k === active) n.setAttribute('aria-current', 'step'); else n.removeAttribute('aria-current');
      });
    }

  }

  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
