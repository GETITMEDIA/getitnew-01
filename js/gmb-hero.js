/* Google My Business hero — "Watch Video" modal */
(function () {
  var btn = document.getElementById('gmbhVideoBtn');
  var modal = document.getElementById('gmbhVideoModal');
  var closeBtn = document.getElementById('gmbhVideoClose');
  var frame = document.getElementById('gmbhVideoFrame');
  if (!btn || !modal || !frame) return;

  var VIDEO_SRC = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';

  function open() {
    frame.src = VIDEO_SRC;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.remove('is-open');
    frame.src = '';
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
})();

/* Hero entrance: per-letter heading cascade, replayed whenever the hero
   scrolls back into view. Starts once the template preloader has cleared. */
(function () {
  var hero = document.getElementById('gmb-hero');
  if (!hero) return;

  /* --- split the solid heading line into animatable characters ---------- */
  function splitChars(el) {
    if (!el || el.classList.contains('is-split')) return;
    var text = el.textContent;
    var frag = document.createDocumentFragment();
    var i = 0;
    text.split('').forEach(function (ch) {
      var span = document.createElement('span');
      span.className = 'gmbh__ch';
      if (ch === ' ') {
        span.className += ' gmbh__ch--space';
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = ch;
      }
      span.style.setProperty('--i', i++);
      frag.appendChild(span);
    });
    el.textContent = '';
    el.appendChild(frag);
    el.classList.add('is-split');
    el.style.setProperty('--n', i);
  }

  // only the first line: the accent word carries a background-clip gradient
  // that would not survive being cut into transformed child spans.
  splitChars(hero.querySelector('.gmbh__line:first-child i'));

  /* --- first play, under the preloader fade ---------------------------- */
  var started = false;
  function start() {
    if (started) return;
    started = true;
    hero.classList.add('is-ready');
    watch();
  }

  if (document.readyState === 'complete') {
    setTimeout(start, 260);
  } else {
    window.addEventListener('load', function () { setTimeout(start, 260); });
  }
  // safety net if load never fires (slow or blocked asset)
  setTimeout(start, 2600);

  /* --- replay each time the hero comes back into view ------------------ */
  function watch() {
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          hero.classList.add('is-ready');
        } else {
          // fully out of view: reset so the cascade runs again on return
          hero.classList.remove('is-ready');
        }
      });
    }, { threshold: 0.18 }).observe(hero);
  }
})();
