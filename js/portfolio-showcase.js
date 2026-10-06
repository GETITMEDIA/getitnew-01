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
    waker: {
      title: 'Waker Earbuds',
      category: 'Product ad',
      img: 'images/1/web/waker-earbuds.jpg',
      summary: 'A premium launch poster for Welcord’s Waker true-wireless earbuds: the charging case lit on a marble plinth under a glowing arch, with a “Pure Sound, Zero Noise” line that sells the product in one glance.',
      service: 'Graphic Design',
      deliverables: 'Launch poster, social posts, e-commerce banners',
      tools: 'Photoshop, 3D render',
      format: 'Print & digital'
    },
    seyon: {
      title: 'Seyon Herbal Hair Oil',
      category: 'Social ad',
      img: 'images/1/web/seyon-hair-oil.jpg',
      summary: 'A warm, festive social ad for Seyon herbal hair oil: a confident model, the bottle front and centre, and a clear price badge so the offer reads instantly in the feed.',
      service: 'Social Media Marketing',
      deliverables: 'Offer creative, feed posts, story variants',
      tools: 'Photoshop',
      format: 'Instagram & Facebook'
    },
    myden: {
      title: 'Myden Pillows',
      category: 'Product ad',
      img: 'images/1/web/myden-pillow.jpg',
      summary: '“Dream deeper, Sleep softer”: a calm, night-sky product ad for Myden that makes softness feel visible, with floating feathers and a clear shop-now call to action.',
      service: 'Graphic Design',
      deliverables: 'Product ad, social posts, marketplace banners',
      tools: 'Photoshop',
      format: 'Print & digital'
    },
    betapower: {
      title: 'Beta Power Solar',
      category: 'Campaign poster',
      img: 'images/1/web/beta-power-solar.jpg',
      summary: 'A story-led campaign for Beta Power Corporation and Luminous hybrid solar: a child studying in a lit room while the street is dark, turning a technical product into an emotional reason to buy.',
      service: 'Google & Meta Ads',
      deliverables: 'Campaign poster, social ads, subsidy creatives',
      tools: 'Photoshop, Illustrator',
      format: 'Print & paid social'
    },
    psnk: {
      title: 'PSNK Jewellery',
      category: 'Product visual',
      img: 'images/1/web/psnk-jewellery.jpg',
      summary: 'A rich, minimal product visual for PSNK Fashion Jewellery: an emerald pendant against deep maroon drapes, lit to bring out the gold and stone detail.',
      service: 'Graphic Design',
      deliverables: 'Product visual, catalogue images, social posts',
      tools: 'Photography & retouching',
      format: 'Print & digital'
    },
    seagull: {
      title: 'Seagull Cruise',
      category: 'Tourism poster',
      img: 'images/1/web/seagull-cruise.jpg',
      summary: '“Where the Sea Meets Your Next Memory”: bright, sunny key art for Seagull Cruise, with the boat, lighthouse and coastline composed to make people want to book the trip.',
      service: 'Graphic Design',
      deliverables: 'Tourism poster, social posts, booking banners',
      tools: 'Photoshop',
      format: 'Print & social'
    },
    welcord: {
      title: 'Welcord',
      category: 'Website',
      img: 'images/sites/welcord-desktop.jpg',
      summary: 'A corporate website for Welcord, an Indian electronics manufacturer: company story, product range, infrastructure and units, with enquiry points on every page.',
      service: 'Website Development',
      deliverables: 'Corporate website, product pages, enquiry forms',
      tools: 'Design & development',
      format: 'Responsive web'
    },
    hrapp: {
      title: 'GetIt HR App',
      category: 'App design',
      img: 'images/app/hrm-dashboard.jpg',
      summary: 'A mobile HR app for day-to-day team operations: one-tap attendance check-in, holiday alerts, requests, payroll and an employee directory, in a dark interface built for quick daily use.',
      service: 'App Development',
      deliverables: 'Mobile app UI, attendance, directory, payroll screens',
      tools: 'Design & development',
      format: 'Android & iOS'
    },
    frenchcity: {
      title: 'Hotel French City',
      category: 'Website',
      img: 'images/sites/02-desktop.jpg',
      summary: 'A heritage hotel website for Puducherry’s French Quarter: rich photography, a room showcase and clear booking calls-to-action that send guests straight to reserve.',
      service: 'Website Development',
      deliverables: 'Hotel website, rooms & amenities pages, booking flow',
      tools: 'Design & development',
      format: 'Responsive web'
    },
    mydenoffer: {
      title: 'Myden Christmas Offer',
      category: 'Offer poster',
      img: 'images/graphic/myden_offer_poster.jpg',
      summary: 'A festive Christmas offer poster for Myden’s natural rattan baskets: a bold 35% OFF headline, warm red-and-gold seasonal styling and the product front and centre, built to stop the scroll and drive store visits.',
      service: 'Graphic Design',
      deliverables: 'Offer poster, Instagram post, WhatsApp status creative',
      tools: 'Photoshop, Illustrator',
      format: 'Social & print'
    },
    /* gpinterior hidden on request
    gpinterior: {
      title: 'GP Interior: Process to Result',
      category: 'Carousel',
      img: 'images/graphic/carousel_process_result.jpg',
      contain: true,
      summary: 'A before-and-after Instagram carousel for GP Interior: the first slide shows the team mid-installation, the swipe reveals the finished living room, with showroom, retail and factory addresses on every slide.',
      service: 'Social Media Marketing',
      deliverables: 'Swipe carousel, Process & Result slides',
      tools: 'Photoshop',
      format: 'Instagram & Facebook'
    },
    */
    kothari: {
      title: 'Kothari Vidya Mandir Admissions',
      category: 'Banner',
      img: 'images/graphic/kothari_school_banner.jpg',
      contain: true,
      summary: 'A roadside admission hoarding for Kothari Vidya Mandir: a clear “admissions open” message, smiling students and contact details sized to read from a moving vehicle.',
      service: 'Graphic Design',
      deliverables: 'Hoarding banner, flex print file, social version',
      tools: 'Photoshop, Illustrator',
      format: 'Outdoor print'
    },
    trending: {
      title: 'Digital Growth Journey',
      category: 'Trending carousel',
      img: 'images/graphic/trending_carousel.jpg?v=hd4',
      contain: true,
      summary: 'Our trending seamless swipe carousel: one continuous journey that walks followers from GMB through Instagram, Facebook, YouTube, Google Ads and Meta Ads to a single message — your digital growth partner.',
      service: 'Social Media Marketing',
      deliverables: 'Seamless panorama carousel',
      tools: 'Photoshop, Illustrator',
      format: 'Instagram carousel'
    },
    press: {
      title: 'The Pondy Times Front Page',
      category: 'Newspaper ad',
      img: 'images/graphic/pondy_times_newspaper_ad.jpg',
      contain: true,
      summary: 'A front-page “Breaking News” style newspaper ad in The Pondy Times that announces Getit Media as Pondicherry’s name for digital marketing and advertising, laid out to the paper’s grid.',
      service: 'Graphic Design',
      deliverables: 'Front-page newspaper ad',
      tools: 'InDesign, Photoshop',
      format: 'Print'
    },
    drone: {
      title: 'Myden Natural Baskets',
      category: 'Product video',
      img: 'images/video/myden_baskets.jpg?v=hq1',
      reel: 'https://www.instagram.com/reel/DZzLXeDima_/',
      summary: 'A clean studio product reel for Myden’s handwoven rattan baskets: soft natural light, slow reveals of the weave from three angles and bold “Natural Baskets” titling, cut vertical for Instagram.',
      service: 'Video Editing',
      deliverables: 'Product reel, Instagram cut',
      tools: 'Premiere Pro, After Effects',
      format: '9:16 Reel'
    },
    concert: {
      title: 'Piaggio Launch Event',
      category: 'Event video',
      img: 'images/video/event_piaggio_launch.jpg',
      reel: 'https://www.instagram.com/reel/Da5SLBQkbhK/',
      summary: 'Launch-day coverage of the Piaggio Ape E-City Swap unveiling: the ribbon reveal, sparklers, guests and the vehicle itself, cut into a fast highlight reel while the launch was still news.',
      service: 'Video Editing',
      deliverables: 'Event highlight reel, social cutdowns',
      tools: 'Premiere Pro, DaVinci Resolve',
      format: '9:16 Reel'
    },
    studio: {
      title: 'Cinematic Short Film',
      category: 'Short film',
      img: 'images/video/landscape_short_film.jpg?v=hd1',
      reel: 'https://www.instagram.com/reel/Da2uzMST4w8/',
      summary: 'A wide-format short film shot on the heritage streets of Pondicherry: scripted scenes, cinematic 16:9 framing, colour grade and a sound-led edit built to hold the viewer to the last frame.',
      service: 'Video Editing',
      deliverables: 'Short film, Instagram cut',
      tools: 'Premiere Pro, DaVinci Resolve',
      format: '16:9 cinematic'
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
      count: $('#pfModalCount'),
      watch: $('#pfModalWatch')
    };
    var current = 0;
    var lastFocus = null;
    var closeTimer = null;

    function fill(i) {
      current = (i + ORDER.length) % ORDER.length;
      var p = PROJECTS[ORDER[current]];
      el.img.src = p.img;
      el.img.alt = p.title;
      el.img.classList.toggle('is-contain', !!p.contain);
      el.cat.textContent = p.category;
      el.title.textContent = p.title;
      el.summary.textContent = p.summary;
      el.service.textContent = p.service;
      el.deliverables.textContent = p.deliverables;
      el.tools.textContent = p.tools;
      el.format.textContent = p.format;
      el.count.textContent = (current + 1) + ' / ' + ORDER.length;
      if (el.watch) {
        el.watch.hidden = !p.reel;
        if (p.reel) el.watch.href = p.reel;
      }
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
      /* client sites live on their own domains: open those in a new tab */
      if (/^https?:/.test(link.href) && link.hostname !== location.hostname) {
        link.target = '_blank';
        link.rel = 'noopener';
      } else {
        link.removeAttribute('target');
        link.removeAttribute('rel');
      }
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

  /* ------------------------------------------------------- reel playback */
  /* Reel panels keep their poster frame until the clip is on screen, then
     play muted and loop. Nothing here depends on GSAP, so it also works on
     mobile and with reduced motion, and a missing .mp4 simply leaves the
     poster in place. */
  function initReelVideos() {
    var vids = $$('.pf-reel__panel video');
    if (!vids.length) return;

    if (reduceMotion || !window.IntersectionObserver) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var vid = entry.target;
        if (entry.isIntersecting) {
          if (vid.preload === 'none') vid.preload = 'auto';
          var played = vid.play();
          if (played && played.catch) played.catch(function () { /* autoplay blocked */ });
        } else {
          vid.pause();
        }
      });
    }, { threshold: 0.35 });

    vids.forEach(function (vid) { io.observe(vid); });
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

    /* images and reel videos slide inside their frames while the track moves */
    $$('.pf-reel__panel img, .pf-reel__panel video', sec).forEach(function (img) {
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
  initReelVideos();

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
