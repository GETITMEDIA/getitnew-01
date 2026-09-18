/* Brand CTA band - scroll reveal + badge drift.
   Progressive enhancement: the .js-anim class is added from here, so with JS
   disabled the section renders fully visible with no hidden content. */
(function () {
  "use strict";

  var section = document.querySelector(".cta13-section");
  if (!section) return;

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* stagger: heading lines, paragraph, buttons, then the badges */
  var reveals = section.querySelectorAll(".cta13-title span, .cta13-text, .cta13-actions");
  Array.prototype.forEach.call(reveals, function (el, i) {
    el.classList.add("cta13-reveal");
    el.style.setProperty("--cta13-delay", i * 130 + "ms");
  });

  var badges = section.querySelectorAll(".cta13-badge");
  Array.prototype.forEach.call(badges, function (el, i) {
    el.style.setProperty("--cta13-delay", 420 + i * 110 + "ms");
  });

  section.classList.add("js-anim");

  if (reduced || !("IntersectionObserver" in window)) {
    section.classList.add("is-inview");
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        section.classList.add("is-inview");
        io.disconnect();
        startDrift();
      });
    },
    { threshold: 0.22 }
  );
  io.observe(section);

  /* gentle parallax: badges drift against the scroll direction, the outer
     ones further than the inner ones so the band feels layered */
  function startDrift() {
    if (!badges.length) return;

    var depths = [0.16, 0.1, 0.2, 0.13, 0.18];
    var ticking = false;

    function update() {
      ticking = false;
      var rect = section.getBoundingClientRect();
      /* -1 when the band is entering from below, +1 once it has passed */
      var progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / (window.innerHeight / 2 + rect.height / 2);
      progress = Math.max(-1, Math.min(1, progress));

      Array.prototype.forEach.call(badges, function (el, i) {
        el.style.setProperty("--cta13-drift", (progress * depths[i % depths.length] * -90).toFixed(1) + "px");
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }
})();
