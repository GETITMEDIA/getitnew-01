(function () {
  'use strict';

  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var progressBar = document.getElementById('legalProgress');
  var backToTopWrap = document.querySelector('.back-to-top-wrapper');
  var backToTopBtn = document.getElementById('back_to_top');
  var blocks = Array.prototype.slice.call(document.querySelectorAll('.legal-card, .legal-clause'));
  var preamble = document.querySelector('.legal-preamble');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.legal-tab'));
  var tocBox = document.getElementById('legalToc');
  var tocToggle = document.getElementById('legalTocToggle');
  var tocList = document.getElementById('legalTocList');
  var tocLinks = tocBox ? Array.prototype.slice.call(tocBox.querySelectorAll('.legal-toc__link')) : [];
  var activeCounter = document.getElementById('legalActiveCounter');
  var searchInput = document.getElementById('legalSearchInput');
  var searchClear = document.getElementById('legalSearchClear');
  var statusLabel = document.getElementById('legalToolbarStatus');
  var emptyState = document.getElementById('legalEmpty');
  var emptyReset = document.getElementById('legalEmptyReset');
  var printBtn = document.getElementById('legalPrintBtn');
  var totalCount = blocks.length;
  var activeCat = 'all';

  function pad2(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  /* ---------------- Active Section & Read-Trail Tracking ---------------- */
  function setActiveSection(id) {
    var activeIdx = -1;
    blocks.forEach(function (blk, idx) {
      var isCur = blk.id === id;
      blk.classList.toggle('is-reading', isCur);
      if (isCur) activeIdx = idx;
    });

    if (tocLinks.length) {
      tocLinks.forEach(function (link, idx) {
        var match = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', match);
        if (activeIdx >= 0) {
          link.classList.toggle('is-visited', idx < activeIdx);
        }
        if (match && tocList) {
          var top = link.offsetTop;
          var h = tocList.clientHeight;
          if (top < tocList.scrollTop || top + link.offsetHeight > tocList.scrollTop + h) {
            tocList.scrollTop = Math.max(0, top - h * 0.35);
          }
        }
      });
    }

    if (activeCounter && activeIdx >= 0) {
      activeCounter.textContent = pad2(activeIdx + 1) + ' / ' + pad2(totalCount);
    }
  }

  /* ---------------- Combined Tab + Keyword Filter ---------------- */
  function applyFilters(animateTabSwitch) {
    var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (searchClear) searchClear.classList.toggle('is-visible', q.length > 0);

    var visibleBlocks = [];
    blocks.forEach(function (blk) {
      var cat = blk.getAttribute('data-cat') || 'all';
      var catMatch = activeCat === 'all' || cat === activeCat;
      var textMatch = !q || blk.textContent.toLowerCase().indexOf(q) !== -1;
      var show = catMatch && textMatch;
      blk.hidden = !show;
      if (show) {
        blk.style.opacity = '1';
        blk.style.transform = '';
        visibleBlocks.push(blk);
      }
    });

    if (tocLinks.length) {
      tocLinks.forEach(function (link) {
        var targetId = (link.getAttribute('href') || '').slice(1);
        var blk = document.getElementById(targetId);
        link.hidden = blk ? blk.hidden : false;
      });
    }

    if (preamble) {
      preamble.hidden = (activeCat !== 'all' && activeCat !== 'access') || (q.length > 0 && visibleBlocks.length === 0);
    }

    if (statusLabel) {
      if (q || activeCat !== 'all') {
        statusLabel.textContent = 'Showing ' + visibleBlocks.length + ' of ' + totalCount;
      } else {
        statusLabel.textContent = 'All ' + totalCount + ' Sections Open';
      }
    }

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visibleBlocks.length === 0);
    }

    if (animateTabSwitch && !prefersReduced && window.gsap && visibleBlocks.length) {
      window.gsap.fromTo(
        visibleBlocks.slice(0, 8),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.36, stagger: 0.04, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    }

    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  }

  function setActiveTab(cat, animate) {
    activeCat = cat || 'all';
    tabs.forEach(function (tab) {
      var isAct = tab.getAttribute('data-cat') === activeCat;
      tab.classList.toggle('is-active', isAct);
      tab.setAttribute('aria-selected', isAct ? 'true' : 'false');
    });
    applyFilters(animate);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var cat = tab.getAttribute('data-cat') || 'all';
      if (cat === activeCat) return;
      setActiveTab(cat, true);
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      applyFilters(false);
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      applyFilters(false);
      searchInput.focus();
    });
  }

  if (emptyReset) {
    emptyReset.addEventListener('click', function () {
      if (searchInput) searchInput.value = '';
      setActiveTab('all', true);
    });
  }

  /* ---------------- Jump Links & Mini Cards ---------------- */
  function jumpToHash(hash, shouldScroll) {
    if (!hash || hash.length < 2) return;
    var target = document.getElementById(hash.slice(1));
    if (!target) return;

    if (target.hidden) {
      if (searchInput) searchInput.value = '';
      setActiveTab('all', false);
    }
    setActiveSection(target.id);

    if (shouldScroll) {
      setTimeout(function () {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    }
  }

  if (tocToggle && tocBox) {
    tocToggle.addEventListener('click', function () {
      var isOpen = tocBox.classList.toggle('is-open');
      tocToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  var jumpLinks = tocLinks.slice();

  jumpLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href && href.charAt(0) === '#') {
        e.preventDefault();
        if (tocBox && tocBox.classList.contains('is-open')) {
          tocBox.classList.remove('is-open');
          if (tocToggle) tocToggle.setAttribute('aria-expanded', 'false');
        }
        history.replaceState(null, '', href);
        jumpToHash(href, true);
      }
    });
  });

  if (window.location.hash) {
    jumpToHash(window.location.hash, true);
  }
  window.addEventListener('hashchange', function () {
    jumpToHash(window.location.hash, true);
  });

  if ('IntersectionObserver' in window && blocks.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.hidden) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-18% 0px -64% 0px', threshold: 0.01 });

    blocks.forEach(function (blk) { observer.observe(blk); });
  }

  /* ---------------- Print Action ---------------- */
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      window.print();
    });
  }

  /* ---------------- Scroll Progress & Back-to-top ---------------- */
  function onScroll() {
    var scrollTop = window.scrollY || window.pageYOffset || 0;
    if (progressBar) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      progressBar.style.width = pct.toFixed(2) + '%';
    }
    if (backToTopWrap) {
      backToTopWrap.classList.toggle('back-to-top-btn-show', scrollTop > 260);
    }
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- GSAP Choreography ---------------- */
  if (!prefersReduced && window.gsap) {
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    var mastheadEls = document.querySelectorAll('.legal-hub-title-col > *, .legal-hub-controls');
    if (mastheadEls.length) {
      gsap.fromTo(mastheadEls,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.52, stagger: 0.06, ease: 'power3.out', clearProps: 'transform,opacity' }
      );
    }

    if (tabs.length) {
      gsap.fromTo(tabs,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.42, stagger: 0.05, delay: 0.14, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    }

    var miniCards = document.querySelectorAll('.legal-mini-card');
    if (miniCards.length) {
      gsap.fromTo(miniCards,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.46, stagger: 0.06, delay: 0.18, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    }

    if (window.ScrollTrigger) {
      var firstBatch = blocks.slice(0, 3);
      if (firstBatch.length) {
        gsap.fromTo(firstBatch,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, delay: 0.22, ease: 'power2.out', clearProps: 'transform,opacity' }
        );
      }

      blocks.slice(3).forEach(function (blk) {
        gsap.fromTo(blk,
          { y: 18, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.44, ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: blk, start: 'top 93%', once: true }
          }
        );
      });

      var officeCard = document.querySelector('.legal-office-card');
      if (officeCard) {
        gsap.fromTo(officeCard,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.55, ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: officeCard, start: 'top 92%', once: true }
          }
        );
      }
    }
  }
})();
