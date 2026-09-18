/*
 * team-studio.js — the 3D card stages on team.html
 *
 * Drives every .ts section: "Meet The Creative Minds" and the Web
 * Development desk both use the same glass stage.
 *
 *   1. entrance timeline (heading mask reveal + staggered card arrival)
 *   2. TEAM word drift + portrait parallax, both tied to scroll
 *   3. pointer parallax across the stage, and a depth push on hover
 *
 * Deliberately standalone: it shares no scope with team-departments.js so
 * a fault in either cannot take the other down.
 *
 * Progressive enhancement throughout. The hidden start state lives behind
 * an .is-ready class this file adds only once it has decided to animate,
 * so a missing GSAP, a coarse pointer or a reduced-motion preference all
 * end with the section simply visible.
 */
(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('.ts'));
  if (!sections.length) return;

  var lessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var wideEnough = window.matchMedia('(min-width: 1025px)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';

  var hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  if (hasST) window.gsap.registerPlugin(window.ScrollTrigger);

  // every .ts section gets its own stage, timeline and observer
  sections.forEach(function (section) {

  var stage = section.querySelector('.ts__stage');
  var cards = Array.prototype.slice.call(section.querySelectorAll('.ts-card'));
  var word = section.querySelector('.ts__bg');

  /* ------------------------------------------------------------------
     1. Entrance
     ------------------------------------------------------------------ */
  if (hasGsap && !lessMotion) {
    section.classList.add('is-ready');

    /* The entrance is held by an IntersectionObserver rather than a
       ScrollTrigger. Everything in this timeline is what makes the section
       visible at all, so it must not hang off the most fragile link in the
       chain — a trigger that mis-computes its start leaves the section
       blank. ScrollTrigger is kept below for the decorative drift, where
       failing silently costs nothing. */
    var tl = window.gsap.timeline({
      defaults: { ease: 'power3.out' },
      paused: true
    });

    tl.to(section.querySelectorAll('.ts__line > span'), {
      yPercent: 0, duration: 0.95, stagger: 0.11
    })
      .to(section.querySelectorAll('.ts__eyebrow, .ts__lead'), {
        opacity: 1, duration: 0.7, stagger: 0.1
      }, '-=0.6');

    // the cards arrive from different directions, with a little rotation
    cards.forEach(function (card, i) {
      var fromLeft = i % 2 === 0;
      tl.to(card, {
        opacity: 1,
        x: 0,
        y: 0,
        rotateY: 0,
        duration: 1.05,
        startAt: {
          x: fromLeft ? -90 : 90,
          y: 70,
          rotateY: fromLeft ? -22 : 22
        }
      }, 0.35 + i * 0.13);
    });

    // play once the section is actually on screen, and never later than
    // the first scroll — whichever the browser gives us first
    var played = false;
    var play = function () {
      if (played) return;
      played = true;
      tl.play();
    };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          play();
          io.disconnect();
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      io.observe(section);

      // already in view on load (deep link, short page) — the observer
      // fires for that too, but this covers a zero-height first paint
      requestAnimationFrame(function () {
        var r = section.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) play();
      });
    } else {
      play();
    }

    /* --------------------------------------------------------------
       2. Scroll-linked drift — decorative only
       -------------------------------------------------------------- */
    if (hasST) {
      if (word) {
        window.gsap.to(word, {
          xPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
        });
      }

      // portraits creep in as the section passes — written to the same
      // custom property the stylesheet already scales by
      cards.forEach(function (card) {
        var img = card.querySelector('.ts-card__img img');
        if (!img) return;
        window.gsap.fromTo(img,
          { '--ts-zoom': 1 },
          {
            '--ts-zoom': 1.12,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
          }
        );
      });
    }
  }

  /* ------------------------------------------------------------------
     3. Pointer parallax + depth push

     Desktop only. On touch there is no leave event, so the stage would
     stay frozen at whatever angle the last tap left it.
     ------------------------------------------------------------------ */
  if (stage && finePointer && wideEnough && !lessMotion) {
    var raf = null;
    var mx = 0, my = 0;

    var paint = function () {
      raf = null;
      stage.style.setProperty('--ts-mx', mx.toFixed(3));
      stage.style.setProperty('--ts-my', my.toFixed(3));
    };

    stage.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var r = stage.getBoundingClientRect();
      if (!r.width || !r.height) return;
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;    // -1 .. 1
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (raf === null) raf = requestAnimationFrame(paint);
    });

    stage.addEventListener('pointerleave', function () {
      mx = 0; my = 0;
      if (raf === null) raf = requestAnimationFrame(paint);
    });

    // hovering one card eases its siblings back, so the active one reads
    // as genuinely nearer rather than just larger
    cards.forEach(function (card) {
      var settle = function () {
        cards.forEach(function (other) { other.style.removeProperty('--ts-push'); });
      };

      card.addEventListener('pointerenter', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        cards.forEach(function (other) {
          if (other !== card) other.style.setProperty('--ts-push', '-70px');
        });
      });

      card.addEventListener('pointerleave', settle);
      card.addEventListener('pointercancel', settle);
    });
  }

  /* If we never took over — no GSAP, reduced motion, anything — make
     certain the section is showing. .is-ready is what hides it. */
  if (!section.classList.contains('is-ready')) {
    cards.forEach(function (c) { c.style.opacity = '1'; });
  }

  });
})();
