(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Sticky navbar shadow on scroll
  ------------------------------------------------------------------ */
  var navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 8) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ------------------------------------------------------------------
     Desktop Services mega dropdown
     Hover to open (with small close delay so moving the mouse into
     the panel doesn't close it), click/keyboard toggle for a11y.
  ------------------------------------------------------------------ */
  var servicesItem = document.getElementById('servicesItem');
  var servicesTrigger = document.getElementById('servicesTrigger');
  var servicesMenu = document.getElementById('servicesMenu');
  var closeTimer = null;
  var MOBILE_BREAKPOINT = 1024;

  function isDesktop() {
    return window.innerWidth > MOBILE_BREAKPOINT;
  }

  // Tracks whether the current open state came from a hover (mouse) vs. an
  // explicit click/keyboard activation, so a click right after a hover-open
  // doesn't immediately toggle it shut again on desktop.
  var openedViaHover = false;

  function openServices(viaHover) {
    clearTimeout(closeTimer);
    servicesItem.classList.add('is-open');
    servicesTrigger.setAttribute('aria-expanded', 'true');
    openedViaHover = !!viaHover;
  }

  function closeServices(immediate) {
    clearTimeout(closeTimer);
    var delay = immediate ? 0 : 150;
    closeTimer = setTimeout(function () {
      servicesItem.classList.remove('is-open');
      servicesTrigger.setAttribute('aria-expanded', 'false');
      openedViaHover = false;
    }, delay);
  }

  if (servicesItem && servicesTrigger && servicesMenu) {
    servicesItem.addEventListener('mouseenter', function () {
      if (isDesktop()) openServices(true);
    });
    servicesItem.addEventListener('mouseleave', function () {
      if (isDesktop()) closeServices(false);
    });

    servicesTrigger.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = servicesItem.classList.contains('is-open');
      if (isOpen && !openedViaHover) {
        closeServices(true);
      } else {
        openServices(false);
      }
    });

    servicesTrigger.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeServices(true);
        servicesTrigger.blur();
      }
    });

    document.addEventListener('click', function (e) {
      if (!servicesItem.contains(e.target)) {
        closeServices(true);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeServices(true);
    });
  }

  /* ------------------------------------------------------------------
     Mobile off-canvas menu
  ------------------------------------------------------------------ */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileOverlay = document.getElementById('mobileOverlay');
  var mobileClose = document.getElementById('mobileClose');

  function openMobileMenu() {
    mobileMenu.classList.add('is-open');
    mobileOverlay.classList.add('is-visible');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    mobileOverlay.classList.remove('is-visible');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu && mobileOverlay) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('is-open');
      if (isOpen) closeMobileMenu(); else openMobileMenu();
    });
    mobileClose.addEventListener('click', closeMobileMenu);
    mobileOverlay.addEventListener('click', closeMobileMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileMenu();
    });

    // Close mobile menu automatically if resized back to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > MOBILE_BREAKPOINT) closeMobileMenu();
    });
  }

  /* ------------------------------------------------------------------
     Mobile Services accordion
  ------------------------------------------------------------------ */
  var mobileServicesTrigger = document.getElementById('mobileServicesTrigger');
  var mobileAccordion = mobileServicesTrigger ? mobileServicesTrigger.closest('.mobile-accordion') : null;

  if (mobileServicesTrigger && mobileAccordion) {
    mobileServicesTrigger.addEventListener('click', function () {
      var isOpen = mobileAccordion.getAttribute('data-open') === 'true';
      mobileAccordion.setAttribute('data-open', isOpen ? 'false' : 'true');
      mobileServicesTrigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  }

  /* ------------------------------------------------------------------
     Scroll parallax — any element with [data-parallax="0.15"] drifts
     vertically at that fraction of the scroll distance, giving decorative
     background art (e.g. the services shape) a subtle depth effect as the
     page background color/section itself stays put. rAF-throttled so it
     never runs more than once per frame; skipped entirely for
     prefers-reduced-motion.
  ------------------------------------------------------------------ */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));

  if (parallaxEls.length) {
    var parallaxTicking = false;

    function updateParallax() {
      var viewportH = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        var rect = el.getBoundingClientRect();
        // Distance of the element's center from the viewport's center,
        // scaled by speed — 0 when centered, +/- as it scrolls past.
        var offset = (rect.top + rect.height / 2 - viewportH / 2) * speed;
        el.style.transform = 'translate3d(0, ' + (-offset * 0.2).toFixed(2) + 'px, 0)';
      });
      parallaxTicking = false;
    }

    function onParallaxScroll() {
      if (!parallaxTicking) {
        window.requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }

    updateParallax();
    window.addEventListener('scroll', onParallaxScroll, { passive: true });
    window.addEventListener('resize', onParallaxScroll);
  }

  /* ------------------------------------------------------------------
     Services section — per-element scroll-triggered reveal.
     Progressive enhancement only: every [data-reveal] element (the shape,
     the heading block, each card) is fully visible by default in CSS, so
     nothing depends on this running. When IntersectionObserver is
     available, each one is switched to its CSS "hidden" starting state
     and observed on its own, so it plays its entrance right as IT crosses
     into the viewport — cards further down the page animate when you
     actually scroll to them, not all at once when the section top appears.
  ------------------------------------------------------------------ */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) {
      el.classList.add('js-reveal');
      revealObserver.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     Why Choose Us — touch/mouse-reactive background glow.
     While the pointer (mouse, pen, or a finger dragging) moves inside the
     section, the ambient glow nudges a little toward it via the
     --wcu-pointer-x/-y custom properties (consumed by the independent CSS
     `translate` property in why-choose.css, so it composes cleanly with
     the glow's own separate `transform`-based drift animation instead of
     fighting over the same property). Releasing/leaving eases it back to
     center. Purely decorative — skipped under reduced motion.
  ------------------------------------------------------------------ */
  var wcuSection = document.querySelector('.wcu');
  var wcuGlow = wcuSection ? wcuSection.querySelector('.wcu__glow') : null;
  var reduceMotionMedia = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  if (wcuSection && wcuGlow && !(reduceMotionMedia && reduceMotionMedia.matches)) {
    var WCU_MAX_OFFSET = 34; // px, kept small so it reads as a nudge, not a jump

    function moveWcuGlow(clientX, clientY) {
      var rect = wcuSection.getBoundingClientRect();
      var nx = (clientX - rect.left) / rect.width - 0.5;  // -0.5 .. 0.5
      var ny = (clientY - rect.top) / rect.height - 0.5;
      wcuSection.style.setProperty('--wcu-pointer-x', (nx * WCU_MAX_OFFSET * 2).toFixed(1) + 'px');
      wcuSection.style.setProperty('--wcu-pointer-y', (ny * WCU_MAX_OFFSET * 2).toFixed(1) + 'px');
    }

    function resetWcuGlow() {
      wcuSection.style.setProperty('--wcu-pointer-x', '0px');
      wcuSection.style.setProperty('--wcu-pointer-y', '0px');
    }

    wcuSection.addEventListener('pointermove', function (e) {
      moveWcuGlow(e.clientX, e.clientY);
    }, { passive: true });

    wcuSection.addEventListener('pointerleave', resetWcuGlow, { passive: true });
    wcuSection.addEventListener('pointerup', resetWcuGlow, { passive: true });
    wcuSection.addEventListener('pointercancel', resetWcuGlow, { passive: true });
  }

  /* ------------------------------------------------------------------
     Why Choose Us — hovering/touching a card brings in its background
     photo, and it goes back to the plain background the moment you leave
     it. Each of the 4 cards (Affordable / Punctual / Creative / Passionate
     Team) has a matching photo via its [data-bg] path. Uses 'pointerenter'/
     'pointerleave' so mouse, pen, AND touch (a tap registers as a pointer
     enter) all trigger the same behavior; keyboard focus/blur does too, so
     it's reachable without a pointer at all.
  ------------------------------------------------------------------ */
  var wcuBgPhoto = document.getElementById('wcuBgPhoto');
  var wcuCards = Array.prototype.slice.call(document.querySelectorAll('.wcu__card[data-bg]'));

  if (wcuBgPhoto && wcuCards.length) {
    // Small grace period before actually hiding: if the pointer lands on
    // another card within this window, we cancel the hide and crossfade
    // straight to the new photo instead of dipping to empty in between —
    // reads as one smooth handoff rather than a flicker.
    var wcuHideTimer = null;

    function showWcuCard(card) {
      clearTimeout(wcuHideTimer);
      wcuCards.forEach(function (c) {
        c.classList.remove('is-active');
        c.setAttribute('aria-pressed', 'false');
      });
      card.classList.add('is-active');
      card.setAttribute('aria-pressed', 'true');
      wcuBgPhoto.style.backgroundImage = 'url("' + card.getAttribute('data-bg') + '")';
      wcuBgPhoto.classList.add('is-active');
    }

    function hideWcuCard(card) {
      card.classList.remove('is-active');
      card.setAttribute('aria-pressed', 'false');
      clearTimeout(wcuHideTimer);
      wcuHideTimer = setTimeout(function () {
        wcuBgPhoto.classList.remove('is-active');
        // Once faded back down, drop the inline override so the CSS
        // default (team.jpg, dim/ambient) shows through again instead of
        // staying stuck on whichever card photo was last hovered.
        wcuBgPhoto.style.backgroundImage = '';
      }, 1200);
    }

    wcuCards.forEach(function (card) {
      card.addEventListener('pointerenter', function () { showWcuCard(card); });
      card.addEventListener('pointerleave', function () { hideWcuCard(card); });
      card.addEventListener('focus', function () { showWcuCard(card); });
      card.addEventListener('blur', function () { hideWcuCard(card); });

      // Touch devices with no real pointer hover: tapping still shows it,
      // and tapping elsewhere on the page (touchstart outside) hides it.
      card.addEventListener('touchstart', function () { showWcuCard(card); }, { passive: true });
    });

    document.addEventListener('touchstart', function (e) {
      if (!e.target.closest('.wcu__card[data-bg]')) {
        wcuCards.forEach(hideWcuCard);
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     Stats section — repeating settle-in animation.
     Unlike the site's one-shot [data-reveal] pattern, this section's
     scatter-to-grid transition replays every time it crosses the
     viewport boundary in EITHER direction: scrolling down into it plays
     the settle; scrolling back up out of it (or back down past it again)
     un-settles it back to scattered so it's ready to replay. The observer
     is never disconnected — it just keeps toggling .is-revealed to match
     the current intersection state. Progressive enhancement: without this,
     .stats__grid never gets .js-repeat, so CSS shows the cards in their
     flat, final positions the whole time — never stuck scattered.
  ------------------------------------------------------------------ */
  var statsGrid = document.getElementById('statsGrid');

  /* Count-up numbers, looping in sync with the settle animation above:
     every time the section scrolls into view, each value counts up from 0
     to its real number (4.9 / 170+ / 1.7k / 95%); every time it scrolls
     back out, it resets to 0 so the count-up is ready to replay next time
     — same "every time, either direction" behavior as the card settle. */
  var statCountEls = statsGrid ? Array.prototype.slice.call(statsGrid.querySelectorAll('[data-count-target]')) : [];

  function formatCount(value, decimals, suffix) {
    var str = decimals ? value.toFixed(decimals) : Math.round(value).toString();
    return str + suffix;
  }

  function animateStatCount(el) {
    var target = parseFloat(el.getAttribute('data-count-target'));
    var decimals = parseInt(el.getAttribute('data-count-decimals') || '0', 10);
    var suffix = el.getAttribute('data-count-suffix') || '';
    var duration = 1400;
    var startTime = null;

    if (el._countRAF) cancelAnimationFrame(el._countRAF);

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = formatCount(target * eased, decimals, suffix);
      if (progress < 1) {
        el._countRAF = requestAnimationFrame(step);
      }
    }
    el._countRAF = requestAnimationFrame(step);
  }

  function resetStatCount(el) {
    if (el._countRAF) cancelAnimationFrame(el._countRAF);
    var decimals = parseInt(el.getAttribute('data-count-decimals') || '0', 10);
    var suffix = el.getAttribute('data-count-suffix') || '';
    el.textContent = formatCount(0, decimals, suffix);
  }

  if (statsGrid && 'IntersectionObserver' in window && !(reduceMotionMedia && reduceMotionMedia.matches)) {
    statsGrid.classList.add('js-repeat');

    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        statsGrid.classList.toggle('is-revealed', entry.isIntersecting);
        if (entry.isIntersecting) {
          statCountEls.forEach(animateStatCount);
        } else {
          statCountEls.forEach(resetStatCount);
        }
      });
    }, { threshold: 0.25 });

    statsObserver.observe(statsGrid);
  }
})();
