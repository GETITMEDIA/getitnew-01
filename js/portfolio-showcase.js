/* ==========================================================================
   portfolio-showcase.js - interactions for portfolio.html
   --------------------------------------------------------------------------
   Needs css/portfolio-showcase.css. GSAP + ScrollTrigger are optional: the
   modal and filters work without them, and every animated section falls
   back to a static, fully readable layout.

   Load this BEFORE js/scroll-anim.js. Its pinned sections must be created
   first so the reveal triggers further down measure against the pin spacers.
   ========================================================================== */
(function () {
  'use strict';

  /* Project details shown in the case-study modal. Keys match the
     data-project attributes in portfolio.html; this order is also the
     prev / next order inside the modal. */
  var PROJECTS = {
    aurelia: {
      title: 'Aurelia Parfum',
      category: 'Product visual',
      img: 'images/graphic/perfume_bottle_showcase.jpg',
      summary: 'A moody, light-cut key visual that lets the bottle do the talking: amber glow, a lit marble plinth and a single beam of light, built to hold up from billboard to phone screen.',
      service: 'Graphic Design',
      deliverables: 'Hero key visual, e-commerce crops, social teasers',
      tools: 'Photoshop, Blender',
      format: 'Print & digital'
    },
    opulent: {
      title: 'Opulent Timepieces',
      category: 'Social media',
      img: 'images/graphic/mobile_carousel_showcase.jpg',
      summary: 'A premium Instagram feed system for a luxury watch label: dark, tactile product shots, a consistent grid rhythm and carousel templates the brand team can keep extending.',
      service: 'Social Media Marketing',
      deliverables: 'Feed system, carousels, story templates',
      tools: 'Photoshop, Figma',
      format: 'Instagram & Facebook'
    },
    lights: {
      title: 'Festival of Lights',
      category: 'Poster design',
      img: 'images/graphic/festival_poster_showcase.jpg',
      summary: 'Ornate festival key art mixing a glowing mandala, traditional arch framing and a crowd of dancers, designed to feel celebratory at poster size and still read on a phone.',
      service: 'Graphic Design',
      deliverables: 'Event poster, social announcement set, stage backdrop',
      tools: 'Illustrator, Photoshop',
      format: 'Print & social'
    },
    aurora: {
      title: 'Aurora Automotive',
      category: 'Advertising',
      img: 'images/graphic/banner_design_showcase.jpg',
      summary: '"The Future of Drive": a launch campaign built for digital billboards first, then adapted into display banners and a paid social ad set with one consistent visual idea.',
      service: 'Google & Meta Ads',
      deliverables: 'Digital billboard, display banners, launch ad set',
      tools: 'Photoshop, Illustrator',
      format: 'Outdoor & paid digital'
    },
    gcube: {
      title: 'G-Cube Brand Mark',
      category: 'Branding',
      img: 'images/graphic/g_logo_showcase.jpg',
      summary: 'A monogram mark rendered as a machined metal cube with a molten orange edge, giving the brand a 3D hero asset for launches, social avatars and motion stings.',
      service: 'Branding & Logo Design',
      deliverables: '3D logo render, avatar set, motion sting',
      tools: 'Blender, Illustrator',
      format: 'Brand identity'
    },
    aethel: {
      title: 'Aethel Technologies',
      category: 'Corporate identity',
      img: 'images/graphic/id_card_showcase.jpg',
      summary: 'An employee ID and badge system that carries the brand into the office: neon-edged cards, clear role hierarchy and print-ready specs for every department.',
      service: 'Branding & Logo Design',
      deliverables: 'ID cards, badge system, print specifications',
      tools: 'Illustrator, InDesign',
      format: 'Print'
    },
    editorial: {
      title: 'Corporate Editorial Suite',
      category: 'Print & editorial',
      img: 'images/graphic/brochure_grid_showcase.jpg',
      summary: 'A modular editorial system covering annual reports, brochures and a strategy magazine, with one grid, one type scale and an orange accent that ties every title together.',
      service: 'Graphic Design',
      deliverables: 'Annual report, brochure series, magazine layouts',
      tools: 'InDesign, Photoshop',
      format: 'Print & PDF'
    },
    sale: {
      title: 'Seasonal Sale Campaign',
      category: 'Advertising',
      img: 'images/graphic/retail_poster_sale.jpg',
      summary: 'A loud, high-contrast retail sale creative that works in-store and in-feed: one bold offer, one clear call to action, and variants sized for every placement.',
      service: 'Google & Meta Ads',
      deliverables: 'In-store poster, Meta ad variants, WhatsApp creatives',
      tools: 'Illustrator, Photoshop',
      format: 'Print & paid social'
    },
    socialsuite: {
      title: 'Multi-platform Social Launch',
      category: 'Social media',
      img: 'images/video/branding_phones.jpg',
      summary: 'One launch story told natively across Instagram, short-form video and X, with formats, captions and hooks tailored to how people actually scroll on each platform.',
      service: 'Social Media Marketing',
      deliverables: 'Reels, short-form videos, post and story sets',
      tools: 'Premiere Pro, After Effects, Photoshop',
      format: 'Instagram, YouTube Shorts, X'
    },
    press: {
      title: 'Newspaper Ad Placement',
      category: 'Print advertising',
      img: 'images/graphic/newspaper_ad_mockup.jpg',
      summary: 'A print ad and press layout designed around the newspaper grid, so the message stays sharp at small sizes and stands out on a busy page.',
      service: 'Graphic Design',
      deliverables: 'Newspaper ad, press kit layout',
      tools: 'InDesign, Photoshop',
      format: 'Print'
    },
    drone: {
      title: 'Strider X7 Product Film',
      category: 'Video editing',
      img: 'images/video/product_drone.jpg',
      summary: 'A cinematic product film for a performance drone: moody CGI environments, glowing detail shots and a sound-led edit, cut down into teasers for launch week.',
      service: 'Video Editing',
      deliverables: 'Product film, launch teaser, 15s ad cutdowns',
      tools: 'Premiere Pro, After Effects, DaVinci Resolve',
      format: '16:9, 9:16 & 1:1'
    },
    concert: {
      title: 'Live Event Coverage',
      category: 'Event video',
      img: 'images/video/event_concert.jpg',
      summary: 'Full live-event coverage, from the crowd energy to the stage production, delivered as an aftermovie plus same-day highlight reels for social.',
      service: 'Video Editing',
      deliverables: 'Aftermovie, highlight reels, same-day social edits',
      tools: 'Premiere Pro, DaVinci Resolve',
      format: '16:9 & 9:16'
    },
    studio: {
      title: 'Studio Edit & Colour',
      category: 'Post-production',
      img: 'images/graphic/video_editing_console.jpg',
      summary: 'Our in-house finishing pipeline: offline edit, colour grade and sound mix, so every commercial leaves the studio broadcast-ready and social-ready.',
      service: 'Video Editing',
      deliverables: 'Commercial edit, colour grade, sound mix, social cutdowns',
      tools: 'DaVinci Resolve, Premiere Pro, Audition',
      format: 'Broadcast & social'
    }
  };
  var ORDER = Object.keys(PROJECTS);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var animate = hasGsap && !reduceMotion;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ------------------------------------------------------------------ modal */
  function initModal() {
    var modal = $('#pfModal');
    if (!modal) return;
    var dialog = $('.pf-modal__dialog', modal);
    var el = {
      img: $('#pfModalImg'),
      cat: $('#pfModalCat'),
      title: $('#pfModalTitle'),
      summary: $('#pfModalSummary'),
      service: $('#pfModalService'),
      deliverables: $('#pfModalDeliverables'),
      tools: $('#pfModalTools'),
      format: $('#pfModalFormat'),
      count: $('#pfModalCount')
    };
    var current = 0;
    var lastFocus = null;
    var closeTimer = null;

    function fill(i) {
      current = (i + ORDER.length) % ORDER.length;
      var p = PROJECTS[ORDER[current]];
      el.img.src = p.img;
      el.img.alt = p.title;
      el.cat.textContent = p.category;
      el.title.textContent = p.title;
      el.summary.textContent = p.summary;
      el.service.textContent = p.service;
      el.deliverables.textContent = p.deliverables;
      el.tools.textContent = p.tools;
      el.format.textContent = p.format;
      el.count.textContent = (current + 1) + ' / ' + ORDER.length;
    }

    function open(id) {
      var i = ORDER.indexOf(id);
      if (i < 0) return;
      clearTimeout(closeTimer);
      lastFocus = document.activeElement;
      fill(i);
      modal.hidden = false;
      document.documentElement.classList.add('pf-lock');
      /* two frames: the first un-hides, the second starts the transition */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          modal.classList.add('is-open');
          dialog.focus();
        });
      });
    }

    function close() {
      if (modal.hidden) return;
      modal.classList.remove('is-open');
      document.documentElement.classList.remove('pf-lock');
      closeTimer = setTimeout(function () { modal.hidden = true; }, 450);
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-project]');
      if (trigger) { open(trigger.getAttribute('data-project')); return; }
      if (modal.hidden) return;
      if (e.target.closest('[data-close]')) { close(); return; }
      var step = e.target.closest('[data-step]');
      if (step) fill(current + parseInt(step.getAttribute('data-step'), 10));
    });

    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowRight') { fill(current + 1); return; }
      if (e.key === 'ArrowLeft') { fill(current - 1); return; }
      if (e.key !== 'Tab') return;
      /* keep focus inside the dialog */
      var focusables = $$('a[href], button:not([disabled])', dialog);
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------------------------------------------------------------- filters */
  function initFilters() {
    var bento = $('#pfBento');
    if (!bento) return;
    var tiles = $$('.pf-tile', bento);
    var buttons = $$('.pf-filter');

    function matches(tile, filter) {
      return filter === 'all' ||
        (' ' + tile.getAttribute('data-cat') + ' ').indexOf(' ' + filter + ' ') > -1;
    }

    function apply(filter) {
      tiles.forEach(function (t) { t.hidden = !matches(t, filter); });
      bento.classList.toggle('is-filtered', filter !== 'all');
      if (hasGsap) ScrollTrigger.refresh();
    }

    buttons.forEach(function (btn) {
      var filter = btn.getAttribute('data-filter');
      var badge = $('.pf-filter__n', btn);
      if (badge) badge.textContent = tiles.filter(function (t) { return matches(t, filter); }).length;

      btn.addEventListener('click', function () {
        if (btn.classList.contains('is-active')) return;
        buttons.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });

        if (!animate) { apply(filter); return; }

        var visible = tiles.filter(function (t) { return !t.hidden; });
        gsap.to(visible, {
          opacity: 0,
          y: 16,
          duration: 0.2,
          stagger: 0.015,
          ease: 'power2.in',
          overwrite: true,
          onComplete: function () {
            apply(filter);
            var shown = tiles.filter(function (t) { return !t.hidden; });
            shown.forEach(function (t) { t.setAttribute('data-revealed', ''); });
            gsap.fromTo(shown,
              { opacity: 0, y: 28 },
              { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'expo.out', overwrite: true, clearProps: 'transform' });
          }
        });
      });
    });
  }

  /* ------------------------------------------------------- website showcase */
  function initSites() {
    var sec = $('#pfSites');
    if (!sec) return;
    var stage = $('.pf-sites__stage', sec);
    var tabs = $$('.pf-site-tab', sec);
    var screens = $$('.pf-screen', sec);
    var url = $('#pfSiteUrl');
    var link = $('#pfSiteLink');
    var tags = $('#pfSiteTags');
    var current = 0;

    function show(i, focus) {
      current = (i + tabs.length) % tabs.length;
      var tab = tabs[current];
      tabs.forEach(function (t, k) {
        var on = k === current;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      screens.forEach(function (s) {
        s.classList.toggle('is-active', parseInt(s.getAttribute('data-site'), 10) === current);
      });
      url.textContent = tab.getAttribute('data-url');
      link.href = tab.getAttribute('data-href');
      tags.textContent = '';
      tab.getAttribute('data-tags').split('|').forEach(function (label) {
        var li = document.createElement('li');
        li.textContent = label;
        tags.appendChild(li);
      });
      if (focus) tab.focus();
      /* keep the active chip in view on the mobile tab strip */
      if (tab.scrollIntoView && window.matchMedia('(max-width: 960px)').matches) {
        tab.parentNode.scrollTo({ left: tab.offsetLeft - 16, behavior: 'smooth' });
      }
    }

    tabs.forEach(function (tab, k) {
      tab.addEventListener('click', function () { if (k !== current) show(k); });
      /* the progress bar's CSS animation is the autoplay clock, so hover
         pausing (animation-play-state) pauses both at once */
      $('.pf-site-tab__bar span', tab).addEventListener('animationend', function () {
        if (tab.classList.contains('is-active')) show(current + 1);
      });
    });

    $('.pf-sites__tabs', sec).addEventListener('keydown', function (e) {
      var step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      show(current + step, true);
    });

    /* pause while hovered or off-screen */
    var hovering = false;
    var visible = !('IntersectionObserver' in window);
    function syncPause() { sec.classList.toggle('is-paused', hovering || !visible); }
    stage.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse') { hovering = true; syncPause(); }
    });
    stage.addEventListener('pointerleave', function () { hovering = false; syncPause(); });
    if (!visible) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        syncPause();
      }, { threshold: 0.25 }).observe(stage);
    }
    syncPause();
    show(0);
  }

  /* ------------------------------------------------------------------- hero */
  function initHero() {
    var hero = $('.pf-hero');
    if (!hero) return;

    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .fromTo('.pf-hero .pf-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 })
      .fromTo('.pf-hero .pf-line > span', { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: 0.1 }, '-=0.55')
      .fromTo('.pf-hero .pf-lead, .pf-hero__actions', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, '-=0.9')
      .fromTo('.pf-collage__card', { opacity: 0, y: 90, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1.4, stagger: 0.12 }, '-=1.2')
      .fromTo('.pf-badge-spin', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 1 }, '-=0.9')
      .fromTo('.pf-stat', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, '-=1');

    /* the whole collage drifts up a little as the hero scrolls away */
    gsap.to('.pf-hero__visual', {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
    });

    if (!finePointer) return;
    /* cursor parallax on a wrapper, so it never fights the intro tween */
    var layers = $$('.pf-collage__float').map(function (node) {
      return {
        depth: parseFloat(node.getAttribute('data-depth') || '1'),
        x: gsap.quickTo(node, 'x', { duration: 0.9, ease: 'power3' }),
        y: gsap.quickTo(node, 'y', { duration: 0.9, ease: 'power3' })
      };
    });
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach(function (l) { l.x(nx * 30 * l.depth); l.y(ny * 30 * l.depth); });
    });
    hero.addEventListener('pointerleave', function () {
      layers.forEach(function (l) { l.x(0); l.y(0); });
    });
  }

  function initCounters() {
    $$('[data-count]').forEach(function (node) {
      var end = parseFloat(node.getAttribute('data-count'));
      var decimals = parseInt(node.getAttribute('data-decimals') || '0', 10);
      var state = { v: 0 };
      node.textContent = (0).toFixed(decimals);
      gsap.to(state, {
        v: end,
        duration: 2.2,
        delay: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: node, start: 'top 95%', once: true },
        onUpdate: function () { node.textContent = state.v.toFixed(decimals); }
      });
    });
  }

  /* ------------------------------------------------------ pinned WORK stage */
  function pinWork() {
    var sec = $('#pfWork');
    if (!sec) return null;
    var cards = $$('.pf-wcard', sec);
    if (!cards.length) return null;
    var word = $('.pf-work__word', sec);
    var bar = $('.pf-work__bar', sec);
    var countEl = $('#pfWorkCount');
    var nameEl = $('#pfWorkName');

    sec.classList.add('is-pinned');

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: 'top top',
        end: '+=' + (cards.length * 100) + '%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1
      }
    });

    tl.fromTo(word, { scale: 0.9, opacity: 1 }, { scale: 1.25, opacity: 0.16, duration: 1.2, ease: 'power2.inOut' });

    var marks = [];
    cards.forEach(function (card, i) {
      var fromLeft = i % 2 === 0;
      gsap.set(card, { yPercent: -50 });
      tl.fromTo(card,
        { opacity: 0, x: fromLeft ? -180 : 180, rotation: fromLeft ? -8 : 8, scale: 0.86 },
        { opacity: 1, x: 0, rotation: fromLeft ? -2 : 2, scale: 1, duration: 1, ease: 'power3.out' },
        i === 0 ? '-=0.5' : '+=0');
      marks.push(tl.duration() - 1);
      tl.to(card, { scale: 1.03, duration: 0.7, ease: 'none' });
      if (i < cards.length - 1) {
        tl.to(card, { opacity: 0, y: -130, rotation: fromLeft ? -10 : 10, scale: 0.9, duration: 0.9, ease: 'power2.in' });
      }
    });
    tl.to({}, { duration: 0.4 });
    tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: tl.duration(), ease: 'none' }, 0);

    var shown = -1;
    tl.eventCallback('onUpdate', function () {
      var t = tl.time();
      var idx = 0;
      for (var k = 0; k < marks.length; k++) if (t >= marks[k] + 0.3) idx = k;
      if (idx === shown) return;
      shown = idx;
      if (countEl) countEl.textContent = ('0' + (idx + 1)).slice(-2);
      if (nameEl) nameEl.textContent = cards[idx].getAttribute('data-title') || '';
    });

    return function () { sec.classList.remove('is-pinned'); };
  }

  /* ------------------------------------------------------ horizontal reel */
  function pinReel() {
    var sec = $('#pfReel');
    if (!sec) return null;
    var track = $('.pf-reel__track', sec);

    sec.classList.add('is-pinned');

    function distance() { return Math.max(0, track.scrollWidth - window.innerWidth); }

    var move = gsap.to(track, {
      x: function () { return -distance(); },
      ease: 'none',
      scrollTrigger: {
        trigger: sec,
        start: 'top top',
        end: function () { return '+=' + distance(); },
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    /* images slide inside their frames while the track moves */
    $$('.pf-reel__panel img', sec).forEach(function (img) {
      gsap.fromTo(img, { xPercent: 7 }, {
        xPercent: -7,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentNode,
          containerAnimation: move,
          start: 'left right',
          end: 'right left',
          scrub: true
        }
      });
    });

    return function () { sec.classList.remove('is-pinned'); };
  }

  /* ------------------------------------------------------ gallery reveal */
  function initTileReveal() {
    var tiles = $$('.pf-tile');
    if (!tiles.length) return;
    gsap.set(tiles, { opacity: 0, y: 48 });
    ScrollTrigger.batch(tiles, {
      start: 'top 92%',
      once: true,
      onEnter: function (batch) {
        batch = batch.filter(function (t) { return !t.hasAttribute('data-revealed'); });
        batch.forEach(function (t) { t.setAttribute('data-revealed', ''); });
        gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'expo.out', clearProps: 'transform' });
      }
    });
  }

  /* ------------------------------------------------- service hover preview */
  function initServicePreview() {
    var list = $('.pf-svc-list');
    var preview = $('#pfPreview');
    if (!list || !preview) return;
    var img = $('img', preview);

    gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0 });
    var xTo = gsap.quickTo(preview, 'x', { duration: 0.55, ease: 'power3' });
    var yTo = gsap.quickTo(preview, 'y', { duration: 0.55, ease: 'power3' });

    list.addEventListener('pointermove', function (e) { xTo(e.clientX); yTo(e.clientY); });

    $$('.pf-svc', list).forEach(function (row) {
      row.addEventListener('pointerenter', function (e) {
        img.src = row.getAttribute('data-img');
        if (gsap.getProperty(preview, 'opacity') < 0.05) {
          xTo(e.clientX, e.clientX);
          yTo(e.clientY, e.clientY);
        }
        gsap.to(preview, {
          opacity: 1,
          scale: 1,
          rotation: gsap.utils.random(-7, 7),
          duration: 0.45,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });
    });

    list.addEventListener('pointerleave', function () {
      gsap.to(preview, { opacity: 0, scale: 0.6, duration: 0.3, ease: 'power2.in', overwrite: 'auto' });
    });
  }

  function initMagnets() {
    $$('[data-magnet]').forEach(function (node) {
      var xTo = gsap.quickTo(node, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
      var yTo = gsap.quickTo(node, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
      node.addEventListener('pointermove', function (e) {
        var r = node.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.35);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      node.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
    });
  }

  /* ------------------------------------------------------------------- boot */
  initModal();
  initFilters();
  initSites();

  if (!animate) return;

  try {
    gsap.registerPlugin(ScrollTrigger);
    initHero();
    initCounters();

    /* pins in document order: WORK sits above the reel */
    gsap.matchMedia().add('(min-width: 1024px)', function () {
      var undoWork = pinWork();
      var undoReel = pinReel();
      return function () {
        if (undoWork) undoWork();
        if (undoReel) undoReel();
      };
    });

    initTileReveal();
    if (finePointer) {
      initServicePreview();
      initMagnets();
    }

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  } catch (err) {
    /* an animation bug must never hide the portfolio */
    $$('.pf-tile, .pf-collage__card, .pf-stat').forEach(function (n) { n.style.opacity = '1'; });
    if (window.console && console.warn) console.warn('[portfolio-showcase]', err);
  }
})();
