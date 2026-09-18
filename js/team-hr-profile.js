/*
 * team-hr-profile.js — the orbit (#hr-profile)
 *
 *   1. four nodes on a ring select the slide beside them, by pointer,
 *      click or keyboard
 *   2. the set advances on its own while on screen, the ring's stroke
 *      sweeping toward the next node; the first interaction takes over
 *   3. the play button reveals the video over the portrait
 *
 * Progressive enhancement: the markup ships with node 1 selected and its
 * slide active, so without this file the section is still correct.
 */
(function () {
  'use strict';

  var root = document.getElementById('hr-profile');
  if (!root) return;

  var nodes = Array.prototype.slice.call(root.querySelectorAll('.ho-node'));
  var slides = Array.prototype.slice.call(root.querySelectorAll('.ho-slide'));
  if (!nodes.length || nodes.length !== slides.length) return;

  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DUR = 5000;                    /* mirrors --ho-dur in the stylesheet */
  var at = 0;
  var timer = null;
  var taken = false;

  /* ------------------------------------------------------------------
     1. Selection
     ------------------------------------------------------------------ */
  function select(i) {
    if (i === at) return;

    nodes[at].setAttribute('aria-selected', 'false');
    nodes[at].setAttribute('tabindex', '-1');
    slides[at].classList.remove('is-active');

    at = i;

    nodes[at].setAttribute('aria-selected', 'true');
    nodes[at].setAttribute('tabindex', '0');
    slides[at].classList.add('is-active');
  }

  nodes.forEach(function (node, i) {
    node.addEventListener('mouseenter', function () { stop(); select(i); });
    node.addEventListener('focus', function () { stop(); select(i); });
    node.addEventListener('click', function (e) { e.preventDefault(); stop(); select(i); });

    node.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % nodes.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + nodes.length) % nodes.length;
      if (n === null) return;
      e.preventDefault();
      stop();
      select(n);
      nodes[n].focus();
    });
  });

  /* ------------------------------------------------------------------
     2. Auto-advance, with the ring's sweep as the clock
     ------------------------------------------------------------------ */
  function stop() {
    taken = true;
    root.classList.remove('is-auto');
    if (timer) { clearInterval(timer); timer = null; }
  }

  function pause() {
    root.classList.remove('is-auto');
    if (timer) { clearInterval(timer); timer = null; }
  }

  function start() {
    if (taken || still || timer) return;
    root.classList.add('is-auto');
    timer = setInterval(function () {
      select((at + 1) % nodes.length);
    }, DUR);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) start(); else pause(); });
    }, { threshold: 0.3 });
    io.observe(root);
  } else {
    start();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pause(); else start();
  });

  /* ------------------------------------------------------------------
     3. The video
     ------------------------------------------------------------------ */
  var figure = root.querySelector('.ho__figure');
  var play = root.querySelector('.ho__play');
  var video = root.querySelector('.ho__video');
  if (!figure || !play || !video) return;

  play.addEventListener('click', function () {
    stop();                           /* the ring stops competing for attention */
    figure.classList.add('is-playing');
    var started = video.play();
    if (started && typeof started.catch === 'function') { started.catch(function () {}); }
  });

  video.addEventListener('ended', function () {
    figure.classList.remove('is-playing');
    video.currentTime = 0;
  });
})();
