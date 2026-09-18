/* =====================================================================
   GETIT MEDIA — WEB DEVELOPMENT SHOWCASE
   Companion to css/web-showcase.css.

     1. env        feature flags shared by every module
     2. cursor     dot + trailing ring, widens over interactive things
     3. progress   scroll position bar
     4. splitLines masks headings line-by-line for the reveal
     5. reveal     one IntersectionObserver for every [data-reveal]
     5b slats     opens one WHAT WE BUILD panel at a time
     5c phases    walks the hero preview through Build / Design / Launch
     6. counters   hero figures count up once
     7. magnetic   buttons lean toward the pointer
     8. heroShow   cycles the full-bleed client captures + rail
     9. motion     scroll drives the two counter-travelling rails
    10. particles  hero field on canvas

   Each module is independent and self-guarding: if its markup is absent,
   or the device cannot support it, it returns and the rest still runs.
   The page is complete and readable with this file blocked.

   All continuous work shares the single rAF loop at the bottom.
   ===================================================================== */
(function () {
  'use strict';

  /* ===================================================================
     1. ENV
     =================================================================== */
  var MOBILE = '(max-width: 760px)';

  var env = {
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    fine: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    observe: 'IntersectionObserver' in window
  };

  function isMobile() { return window.matchMedia(MOBILE).matches; }

  var jobs = [];
  var pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  document.addEventListener('mousemove', function (e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  }, { passive: true });

  function lerp(a, b, n) { return a + (b - a) * n; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function all(sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); }

  /* ===================================================================
     2. CUSTOM CURSOR
     =================================================================== */
  (function cursor() {
    if (!env.fine || env.reduced) return;

    var dot = document.createElement('div');
    var ring = document.createElement('div');
    dot.className = 'wx-cursor';
    ring.className = 'wx-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var rx = pointer.x;
    var ry = pointer.y;

    jobs.push(function () {
      rx = lerp(rx, pointer.x, 0.16);
      ry = lerp(ry, pointer.y, 0.16);
      dot.style.transform = 'translate3d(' + pointer.x + 'px,' + pointer.y + 'px,0)';
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
    });

    var wide = 'a, button, .wx-slat, [data-cursor="wide"]';

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest && e.target.closest(wide)) ring.classList.add('is-wide');
    }, { passive: true });

    document.addEventListener('mouseout', function (e) {
      if (e.target.closest && e.target.closest(wide)) ring.classList.remove('is-wide');
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      dot.style.opacity = ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function () {
      dot.style.opacity = ring.style.opacity = '';
    });
  })();

  /* ===================================================================
     3. SCROLL PROGRESS
     =================================================================== */
  (function progress() {
    var bar = document.querySelector('.wx-progress');
    if (!bar) return;

    function draw() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? clamp(window.pageYOffset / max, 0, 1) : 0) + ')';
    }

    window.addEventListener('scroll', draw, { passive: true });
    window.addEventListener('resize', draw, { passive: true });
    draw();
  })();

  /* ===================================================================
     4. LINE SPLITTING
     Wraps each rendered line of a [data-split] heading in .wx-line so the
     CSS can mask and lift them one at a time.
     =================================================================== */
  (function splitLines() {
    var heads = all('[data-split]');
    if (!heads.length) return;

    heads.forEach(function (head) {
      head.setAttribute('data-html', head.innerHTML);
      split(head);
    });

    function splitAll() { heads.forEach(split); }

    /* The first pass measures against whatever face is loaded, which on a
       cold visit is the fallback. Re-split once the real faces arrive and
       after a width change, so the masked lines always match what is drawn.
       Safe mid-reveal: .is-in lives on the heading, not on the lines, so
       rebuilt lines inherit the revealed state immediately. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(splitAll).catch(function () {});
    }

    var t;
    var lastW = window.innerWidth;
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastW) return;   /* ignore mobile URL-bar resizes */
      lastW = window.innerWidth;
      clearTimeout(t);
      t = setTimeout(splitAll, 250);
    }, { passive: true });

    function split(head) {
      head.innerHTML = head.getAttribute('data-html');

      /* Wrap every word in its own element so its line box can be read. A
         word inside <i> or <em> becomes that same tag and inherits the
         parent's classes, so regrouping cannot strip its styling. */
      var walker = document.createTreeWalker(head, NodeFilter.SHOW_TEXT, null, false);
      var texts = [];
      var node;
      while ((node = walker.nextNode())) texts.push(node);

      texts.forEach(function (t2) {
        var parent = t2.parentNode;
        if (!parent) return;

        var tag = parent === head ? 'span' : parent.tagName.toLowerCase();
        var cls = parent === head ? '' : parent.className;
        var frag = document.createDocumentFragment();

        t2.nodeValue.split(/(\s+)/).forEach(function (chunk) {
          if (!chunk) return;
          if (/^\s+$/.test(chunk)) {
            frag.appendChild(document.createTextNode(' '));
            return;
          }
          var w = document.createElement(tag);
          w.className = ('wx-w ' + cls).trim();
          w.textContent = chunk;
          frag.appendChild(w);
        });

        parent.replaceChild(frag, t2);
      });

      var words = all('.wx-w', head);
      if (!words.length) return;

      /* group words by the top of their rect — one group per rendered line */
      var lines = [];
      var lastTop = null;
      words.forEach(function (w) {
        var top = Math.round(w.getBoundingClientRect().top);
        if (lastTop === null || Math.abs(top - lastTop) > 4) {
          lines.push([]);
          lastTop = top;
        }
        lines[lines.length - 1].push(w);
      });

      var out = document.createDocumentFragment();
      lines.forEach(function (group, i) {
        var line = document.createElement('span');
        var inner = document.createElement('span');
        line.className = 'wx-line';
        inner.style.setProperty('--d', (i * 0.09).toFixed(2) + 's');

        group.forEach(function (w, j) {
          if (j) inner.appendChild(document.createTextNode(' '));
          inner.appendChild(w);
        });

        line.appendChild(inner);
        out.appendChild(line);
      });

      head.innerHTML = '';
      head.appendChild(out);
    }
  })();

  /* ===================================================================
     5. REVEAL
     =================================================================== */
  (function reveal() {
    var items = all('[data-reveal]');

    all('[data-stagger]').forEach(function (group) {
      var step = parseFloat(group.getAttribute('data-stagger')) || 0.08;
      all('[data-reveal]', group).forEach(function (el, i) {
        el.style.setProperty('--d', (i * step).toFixed(2) + 's');
      });
    });

    if (!items.length) return;

    if (env.reduced || !env.observe) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

    items.forEach(function (el) { io.observe(el); });

    /* Safety net: an element taller than the viewport can never reach the
       threshold, and anything already on screen at load should not wait.
       Sweep once after load and reveal whatever is in view. */
    window.addEventListener('load', function () {
      items.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
    });
  })();

  /* ===================================================================
     5b. SLATS
     Opens one panel of the WHAT WE BUILD band at a time.

     Pointer devices open on hover, because reaching for a panel and
     having it answer is the whole point of the interaction. Every device
     also opens on click and on keyboard focus, so the band works on
     touch and from the keyboard without a pointer. The panel that is
     already open is never re-opened, which stops a hover that crosses
     the open panel from restarting its transition.
     =================================================================== */
  (function slats() {
    var band = document.querySelector('.wx-slats');
    if (!band) return;

    var items = all('.wx-slat', band);
    var tally = all('.wx-slats__tally li');
    if (!items.length) return;

    function open(slat) {
      if (slat.classList.contains('is-open')) return;

      items.forEach(function (el, i) {
        var on = el === slat;
        el.classList.toggle('is-open', on);

        var spine = el.querySelector('.wx-spine');
        if (spine) spine.setAttribute('aria-expanded', String(on));
        if (tally[i]) tally[i].classList.toggle('is-on', on);
      });
    }

    items.forEach(function (slat) {
      var spine = slat.querySelector('.wx-spine');

      /* click anywhere on a closed slat, not just on the spine button */
      slat.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;      /* let View Project through */
        open(slat);
      });

      if (spine) {
        /* focus reaches this via Tab, so the band is keyboard-operable */
        spine.addEventListener('focus', function () { open(slat); });
      }

      if (env.fine && !env.reduced) {
        slat.addEventListener('mouseenter', function () { open(slat); });
      }
    });
  })();

  /* ===================================================================
     5c. PHASE SEQUENCE
     Walks the hero preview through Build, Design, Launch — the three
     stages the headline names — by setting data-phase on the stage.

     It pauses while the pointer is over the stage, so anyone reading a
     particular state can hold it, and it never starts at all under
     reduced motion: the markup ships at phase 2 (Launch, the complete
     state), so with this module inert the hero is simply finished.
     =================================================================== */
  (function phases() {
    var stage = document.querySelector('.wx-stage');
    if (!stage) return;

    var steps = all('.wx-phases li');
    if (!steps.length || env.reduced) return;

    var i = 2;              /* the markup's resting state */
    var held = false;
    var timer;

    function show(n) {
      i = n;
      stage.setAttribute('data-phase', String(n));
      steps.forEach(function (li, k) { li.classList.toggle('is-on', k === n); });
    }

    function tick() {
      if (!held) show((i + 1) % 3);
      timer = setTimeout(tick, i === 2 ? 3400 : 2400);   /* hold Launch longer */
    }

    stage.addEventListener('mouseenter', function () { held = true; });
    stage.addEventListener('mouseleave', function () { held = false; });

    /* only run while the hero is actually on screen */
    if (env.observe) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          if (!timer) timer = setTimeout(tick, 1800);
        } else {
          clearTimeout(timer);
          timer = null;
        }
      }, { threshold: 0.25 }).observe(stage);
    } else {
      timer = setTimeout(tick, 1800);
    }
  })();

  /* ===================================================================
     6. COUNTERS
     =================================================================== */
  (function counters() {
    var nums = all('[data-count-to]');
    if (!nums.length) return;

    function settle(el) { el.textContent = el.getAttribute('data-count-to'); }

    if (env.reduced || !env.observe) {
      nums.forEach(settle);
      return;
    }

    function run(el) {
      var to = parseFloat(el.getAttribute('data-count-to')) || 0;
      var dp = (String(to).split('.')[1] || '').length;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / 1600, 1);
        el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dp);
        if (p < 1) requestAnimationFrame(step);
        else settle(el);
      }

      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ===================================================================
     7. MAGNETIC BUTTONS
     =================================================================== */
  (function magnetic() {
    if (!env.fine || env.reduced) return;

    all('[data-magnet]').forEach(function (el) {
      var pull = parseFloat(el.getAttribute('data-magnet')) || 0.3;

      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform =
          'translate3d(' + (e.clientX - (r.left + r.width / 2)) * pull + 'px,' +
                           (e.clientY - (r.top + r.height / 2)) * pull + 'px,0)';
      });

      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  })();

  /* ===================================================================
     8. HERO — "Now Showing"
     Cycles the client captures inside the browser frame and keeps the
     address bar in step. Each capture carries its own data-domain, so the
     cycle no longer depends on a thumbnail rail being present; when one is
     present it is still kept in step and remains clickable.

     Pauses while the pointer is anywhere in the hero, so you can read a
     site rather than having it taken away. Under reduced motion it shows
     the first capture and never moves.
     =================================================================== */
  (function heroShow() {
    var hero = document.querySelector('.wx-hero');
    if (!hero) return;

    var shots = all('.wx-hero__shot', hero);
    var thumbs = all('.wx-thumb', hero);
    var now = document.getElementById('wxNow');
    if (shots.length < 2) return;

    var DWELL = 6000;
    var i = 0;
    var timer = null;
    var held = false;

    /* the CSS progress hairline reads its duration from here, so the two
       can never drift apart */
    hero.style.setProperty('--dwell', (DWELL / 1000) + 's');

    function show(n) {
      i = n;

      shots.forEach(function (el, k) { el.classList.toggle('is-on', k === n); });

      thumbs.forEach(function (el, k) {
        /* removing and re-adding restarts the progress animation, which a
           class toggle alone would not do when the same thumb is reselected */
        el.classList.remove('is-on');
        if (k === n) {
          void el.offsetWidth;
          el.classList.add('is-on');
        }
        el.setAttribute('aria-current', k === n ? 'true' : 'false');
      });

      /* the capture is the source of truth for the domain; the thumbnail
         label is only a fallback for markup that still carries a rail */
      var label = thumbs[n] && thumbs[n].querySelector('.wx-thumb__label');
      var domain = (shots[n] && shots[n].getAttribute('data-domain')) ||
                   (label && label.textContent);
      if (now && domain) now.textContent = domain;
    }

    function schedule() {
      clearTimeout(timer);
      if (env.reduced) return;
      timer = setTimeout(function () {
        if (!held) show((i + 1) % shots.length);
        schedule();
      }, DWELL);
    }

    thumbs.forEach(function (t, k) {
      t.addEventListener('click', function () { show(k); schedule(); });
    });

    hero.addEventListener('mouseenter', function () { held = true; });
    hero.addEventListener('mouseleave', function () { held = false; });

    show(0);

    /* do not cycle a hero nobody is looking at */
    if (env.observe) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) schedule();
        else clearTimeout(timer);
      }, { threshold: 0.2 }).observe(hero);
    } else {
      schedule();
    }
  })();

  /* ===================================================================
     9. IN MOTION
     While the band is pinned, scroll position maps to a horizontal offset:
     the browser rail travels right, the phone rail travels left, and the
     background grid drifts a fraction of the same distance. The applied
     value is eased every frame rather than set on scroll, which keeps it
     smooth on a trackpad.
     =================================================================== */
  (function motion() {
    var section = document.querySelector('.wx-motion');
    if (!section) return;

    var rails = all('.wx-rail', section);
    var bg = section.querySelector('.wx-motion__bg');
    if (!rails.length) return;

    /* phone and reduced-motion layouts swipe natively — leave them be */
    if (env.reduced || isMobile()) return;

    var cur = 0;      /* eased scroll progress, 0..1 */
    var drive = 0;    /* the longest rail's travel, which sizes the section */

    /* Each rail records its own travel distance. A rail whose content is
       narrower than the rail itself has nowhere to go, so it is padded
       with clones first — cheaper than writing the markup out three times,
       and the whole band is decorative (aria-hidden) so the clones carry
       no meaning to assistive tech. */
    var lanes = rails.map(function (el) {
      return { el: el, span: 0, dir: el.getAttribute('data-dir') === 'left' ? -1 : 1 };
    });

    /* The one honest way to measure these rails: scrollWidth only reports
       overflow on a scroll box, and a rail is overflow:visible on desktop.
       Rect deltas are also transform-invariant, so this stays correct
       however far the rail has already travelled. */
    function contentWidth(rail) {
      var last = rail.lastElementChild;
      if (!last) return 0;
      var rr = rail.getBoundingClientRect();
      var lr = last.getBoundingClientRect();
      return (lr.right - rr.left) + (parseFloat(getComputedStyle(rail).paddingRight) || 0);
    }

    function fill(rail) {
      var originals = [].slice.call(rail.children);
      if (!originals.length) return;

      var guard = 0;
      /* 1.8x the rail width guarantees something to travel through at any
         viewport; the guard stops a zero-width measurement looping */
      while (contentWidth(rail) < rail.clientWidth * 1.8 && guard < 6) {
        originals.forEach(function (node) { rail.appendChild(node.cloneNode(true)); });
        guard++;
      }
    }

    function measure() {
      /* a resize across the breakpoint hands the rails back to swiping */
      if (isMobile()) {
        section.classList.remove('is-pinned');
        section.style.height = '';
        lanes.forEach(function (l) { l.el.style.transform = ''; });
        return;
      }

      section.classList.add('is-pinned');

      drive = 0;
      lanes.forEach(function (l) {
        l.span = Math.max(contentWidth(l.el) - l.el.getBoundingClientRect().width, 0);
        drive = Math.max(drive, l.span);
      });

      section.style.height = Math.round(window.innerHeight + drive * 0.9) + 'px';
      apply(cur);
    }

    /* browsers travel left-to-right: they start pulled back by their whole
       span and arrive at 0. Phones do the reverse. Each lane uses its own
       span, so neither runs out of content before the band is done. */
    function apply(p) {
      lanes.forEach(function (l) {
        var x = l.dir > 0 ? -l.span * (1 - p) : -l.span * p;
        l.el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      });

      if (bg) bg.style.transform = 'translate3d(' + (-drive * p * 0.08).toFixed(2) + 'px,0,0)';
    }

    rails.forEach(fill);
    measure();
    window.addEventListener('resize', measure, { passive: true });

    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(measure);
      rails.forEach(function (r) { ro.observe(r); });
    } else {
      window.addEventListener('load', measure);
    }

    jobs.push(function () {
      if (!section.classList.contains('is-pinned')) return;

      var rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;   /* off screen */

      var run = section.offsetHeight - window.innerHeight;
      if (run <= 0) return;

      cur = lerp(cur, clamp(-rect.top / run, 0, 1), 0.09);
      apply(cur);
    });
  })();

  /* ===================================================================
     10. HERO PARTICLES
     A capped field of drifting points joined by short lines. Count scales
     with viewport area and is hard-capped; skipped on reduced motion and
     on phones, where it is weight without benefit.
     =================================================================== */
  (function particles() {
    var canvas = document.querySelector('.wx-hero__canvas');
    if (!canvas) return;

    if (env.reduced || isMobile()) {
      canvas.remove();
      return;
    }

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0;
    var h = 0;
    var dots = [];
    var LINK = 126;

    function build() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      if (!w || !h) return;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var n = Math.min(Math.round((w * h) / 20000), 76);
      dots = [];
      for (var i = 0; i < n; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.4 + 0.5,
          warm: Math.random() > 0.72
        });
      }
    }

    build();
    window.addEventListener('resize', build, { passive: true });

    var visible = true;
    if (env.observe) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }, { threshold: 0 }).observe(canvas);
    }

    jobs.push(function () {
      if (!visible || !w) return;

      ctx.clearRect(0, 0, w, h);

      var i, j, a, b, dx, dy, d;

      for (i = 0; i < dots.length; i++) {
        a = dots[i];
        a.x += a.vx;
        a.y += a.vy;

        if (a.x < -20) a.x = w + 20;
        if (a.x > w + 20) a.x = -20;
        if (a.y < -20) a.y = h + 20;
        if (a.y > h + 20) a.y = -20;

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = a.warm ? 'rgba(255,138,61,0.75)' : 'rgba(255,255,255,0.38)';
        ctx.fill();
      }

      /* O(n²), but n is capped at 76 */
      for (i = 0; i < dots.length; i++) {
        a = dots[i];
        for (j = i + 1; j < dots.length; j++) {
          b = dots[j];
          dx = a.x - b.x;
          dy = a.y - b.y;
          d = dx * dx + dy * dy;
          if (d > LINK * LINK) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(255,255,255,' + (0.1 * (1 - Math.sqrt(d) / LINK)).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });
  })();

  /* ===================================================================
     THE LOOP — one rAF for every continuous job, paused when hidden
     =================================================================== */
  (function frame() {
    if (!jobs.length) return;

    var running = true;

    document.addEventListener('visibilitychange', function () {
      var wake = !running && !document.hidden;
      running = !document.hidden;
      if (wake) requestAnimationFrame(tick);
    });

    function tick() {
      for (var i = 0; i < jobs.length; i++) jobs[i]();
      if (running) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  })();
})();
