/* ==========================================================================
   Services Cards — scroll-driven up/down parallax (GSAP ScrollTrigger)
   ========================================================================== */

(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const section = document.getElementById('scServices');
  if (!section) return;

  // phones stack the cards in one column - drifting them there makes
  // neighbours collide, so the parallax is desktop/tablet only
  if (window.matchMedia('(max-width: 767px)').matches) return;

  const cards = section.querySelectorAll('.sc-card');
  if (!cards.length) return;

  // each card drifts a different distance for a layered, non-uniform parallax
  const distances = [-70, 50, -40, 65];

  cards.forEach((card, i) => {
    const distance = distances[i % distances.length];

    gsap.to(card, {
      y: distance,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
    });
  });
})();
