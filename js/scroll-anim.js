/* ==========================================================================
   scroll-anim.js - full-page scroll reveal system (GSAP + ScrollTrigger)
   --------------------------------------------------------------------------
   Drop-in: needs gsap + ScrollTrigger loaded before it, plus css/scroll-anim.css
   and the small inline bootstrap in <head> that adds `sa-armed` to <html>.

   It walks every <section> and <footer> on the page and animates what it
   finds, so new sections are picked up automatically with no markup changes:

     headings    word-by-word, y -80 -> 0, blur 10 -> 0, scale .95 -> 1
     paragraphs  y -60 -> 0, blur 6 -> 0, after the heading
     buttons     y -30 -> 0, after the paragraph
     cards       y -60 -> 0, rotateX 8deg -> 0, staggered
     images      slow parallax drift, scrubbed to scroll position

   Opt out of a whole section with  data-sa-skip  on the <section>.
   Opt out of a single element with data-sa-ignore.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  /* Remove the pre-hide gate. Called on success AND on every bail-out path,
     so there is no route through this file that leaves content invisible. */
  function disarm() {
    root.classList.remove('sa-armed');
  }

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 767px)').matches;

  /* Motion budget. Mobile drops blur and rotateX entirely - they are the two
     most expensive properties here - and shortens the travel so the reveal
     still reads on a short viewport. */
  var M = isMobile
    ? { yHead: -34, yPara: -26, yBtn: -16, blurHead: 0, blurPara: 0, rotX: 0,
        dur: 0.7, stagger: 0.04, start: 'top 88%' }
    : { yHead: -80, yPara: -60, yBtn: -30, blurHead: 10, blurPara: 6, rotX: 8,
        dur: 1.0, stagger: 0.075, start: 'top 80%' };

  var EASE = 'expo.out';

  /* ---------------------------------------------------------------- helpers */

  function toArray(nodes) {
    return Array.prototype.slice.call(nodes);
  }

  /* True if `el` sits inside any node in `containers` - used to stop a card's
     inner text from being animated twice (once by the card, once on its own). */
  function isInside(el, containers) {
    for (var i = 0; i < containers.length; i++) {
      if (containers[i] !== el && containers[i].contains(el)) return true;
    }
    return false;
  }

  function isHidden(el) {
    return el.hasAttribute('hidden') ||
           window.getComputedStyle(el).display === 'none';
  }

  /* Split a heading into per-word spans.
     Bails (returns null) when the heading contains ANY element children - a
     <br>, a gradient <span>, an <i>. Rebuilding those safely is not worth the
     risk of breaking a background-clip:text gradient or a line break, so those
     headings animate as a single block instead. */
  function splitWords(el) {
    if (el.children.length) return null;
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return null;
    var words = text.split(' ');
    if (words.length < 2 || words.length > 40) return null;

    el.textContent = '';
    var spans = [];
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'sa-word';
      s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      spans.push(s);
    });
    return spans;
  }

  /* ------------------------------------------------------------ per section */

  function setupSection(sec) {
    if (sec.hasAttribute('data-sa-skip') || isHidden(sec)) return;

    /* --- cards -----------------------------------------------------------
       A grid counts as a card row only at 3+ children. That deliberately
       excludes two-column page layouts (hero content + hero visual), which
       should not be tilting in 3D. */
    var cards = [];
    toArray(sec.querySelectorAll('.grid')).forEach(function (grid) {
      var kids = toArray(grid.children).filter(function (k) {
        return k.nodeType === 1 && !k.hasAttribute('data-sa-ignore');
      });
      if (kids.length >= 3) {
        grid.classList.add('sa-3d');
        kids.forEach(function (k) { k.classList.add('sa-card'); });
        cards = cards.concat(kids);
      }
    });

    /* --- text, excluding anything already covered by a card -------------- */
    function pick(selector) {
      return toArray(sec.querySelectorAll(selector)).filter(function (el) {
        return !el.hasAttribute('data-sa-ignore') &&
               !isInside(el, cards) &&
               !isHidden(el);
      });
    }

    var headings = pick('h1, h2, h3');
    var paras = pick('p');
    var buttons = pick(
      'a.btn-magnetic, button.btn-magnetic, .gmbh-btn, .cta13-btn, .lt-btn, ' +
      'a[class*="rounded-xl"][class*="px-"], a[class*="rounded-full"][class*="px-8"]'
    );
    /* a button already counted as text elsewhere would animate twice */
    buttons = buttons.filter(function (b) { return paras.indexOf(b) === -1; });
    buttons.forEach(function (b) { b.classList.add('sa-btn'); });

    if (!headings.length && !paras.length && !buttons.length && !cards.length) return;

    /* --- one timeline per section, fired once ---------------------------- */
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: M.start,
        once: true            /* never replays - no restart-on-scroll jitter */
      },
      defaults: { ease: EASE, duration: M.dur }
    });

    /* fromTo, not from, throughout.
       A `from` tween infers its end state by reading the element's current
       computed style, which on these Tailwind nodes yields junk (an observed
       `opacity: 9`) and leaves the tween stranded at its start values. Naming
       both ends explicitly makes every reveal deterministic.

       clearProps on completion strips GSAP's inline transform/filter/opacity
       so the CSS :hover scale on .sa-btn is not permanently outranked by an
       inline transform. */
    var CLEAR = 'transform,opacity,filter,willChange';

    headings.forEach(function (h, i) {
      var words = splitWords(h);
      var target = words || h;
      var blur = M.blurHead;
      tl.fromTo(target,
        {
          y: M.yHead,
          opacity: 0,
          scale: 0.95,
          filter: blur ? 'blur(' + blur + 'px)' : 'blur(0px)'
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          transformOrigin: '50% 100%',
          stagger: words ? M.stagger : 0,
          clearProps: CLEAR
        },
        i === 0 ? 0 : '<0.12');
    });

    if (paras.length) {
      tl.fromTo(paras,
        {
          y: M.yPara,
          opacity: 0,
          filter: M.blurPara ? 'blur(' + M.blurPara + 'px)' : 'blur(0px)'
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          stagger: M.stagger,
          duration: M.dur * 0.85,
          clearProps: CLEAR
        },
        headings.length ? '-=0.55' : 0);
    }

    if (buttons.length) {
      tl.fromTo(buttons,
        { y: M.yBtn, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.08,
          duration: M.dur * 0.7,
          clearProps: CLEAR
        },
        '-=0.45');
    }

    if (cards.length) {
      tl.fromTo(cards,
        { y: -60, opacity: 0, rotateX: M.rotX },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          transformOrigin: '50% 0%',
          stagger: isMobile ? 0.06 : 0.11,
          duration: M.dur * 0.95,
          clearProps: CLEAR
        },
        headings.length || paras.length ? '-=0.4' : 0);
    }

    /* --- image parallax --------------------------------------------------
       Desktop only. Scrubbed rather than tweened, so it tracks the scrollbar
       instead of running on its own clock. */
    if (!isMobile) {
      toArray(sec.querySelectorAll('img')).forEach(function (img) {
        if (img.hasAttribute('data-sa-ignore')) return;
        if (img.closest('[data-sa-no-parallax]')) return;
        if (img.offsetHeight < 120) return;   /* skip icons and avatars */
        img.classList.add('sa-parallax');
        gsap.fromTo(img,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6
            }
          });
      });
    }
  }

  /* ------------------------------------------------------------------ boot */

  function boot() {
    if (prefersReduced || !window.gsap || !window.ScrollTrigger) {
      disarm();
      return;
    }

    try {
      gsap.registerPlugin(ScrollTrigger);

      /* Hand reveal duties over from AOS. Leaving both running means two
         systems writing opacity on the same nodes; AOS would win the initial
         state and strand elements at opacity 0. */
      toArray(document.querySelectorAll('[data-aos]')).forEach(function (el) {
        el.removeAttribute('data-aos');
        el.removeAttribute('data-aos-delay');
        el.removeAttribute('data-aos-duration');
        el.classList.remove('aos-init', 'aos-animate');
        el.style.removeProperty('opacity');
        el.style.removeProperty('transform');
      });

      toArray(document.querySelectorAll('section, footer')).forEach(setupSection);

      disarm();

      /* Late-loading images change page height and would leave every trigger
         measuring against stale offsets. */
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    } catch (err) {
      /* Never let an animation bug take the content down with it. */
      disarm();
      if (window.console && console.warn) console.warn('[scroll-anim]', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
