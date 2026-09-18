/* ==========================================================================
   Main Products Section - Scroll Animations (GSAP)
   ========================================================================== */
(function() {
  // Ensure GSAP and ScrollTrigger are available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  var section = document.getElementById('main-products');
  if (!section) return;

  // Animate the headings
  var headings = section.querySelectorAll('.mp-heading');
  headings.forEach(function(heading) {
    gsap.fromTo(heading, 
      { opacity: 0, y: 50 }, 
      {
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Animate the cards
  var cards = section.querySelectorAll('.mp-card');
  cards.forEach(function(card, index) {
    // Alternate slide-in direction based on index or reverse class
    var isReverse = card.classList.contains('mp-card--reverse');
    var xOffset = isReverse ? 100 : -100; // Slide from right if reverse, left if normal
    
    // On mobile, just slide up instead of sideways to avoid horizontal overflow issues
    if (window.innerWidth < 992) {
      xOffset = 0;
    }
    
    var yOffset = window.innerWidth < 992 ? 50 : 0;

    gsap.fromTo(card,
      { opacity: 0, x: xOffset, y: yOffset },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%', // Start animating when the top of the card is 80% down the viewport
          toggleActions: 'play none none reverse' // Play on enter, reverse on leave back up
        }
      }
    );
    
    // Stagger the list items inside the card
    var listItems = card.querySelectorAll('.mp-card__list li');
    gsap.fromTo(listItems,
      { opacity: 0, x: 20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
})();
