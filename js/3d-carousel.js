/**
 * 3D Services Carousel Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.carousel-card');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dots = document.querySelectorAll('.dot');
  
  let activeIndex = 2; // Initial featured card is index 2 (Search Engine)
  const totalCards = cards.length;

  function updateCarousel() {
    cards.forEach((card, i) => {
      // Remove all existing state classes
      card.classList.remove(
        'card-state--3', 'card-state--2', 'card-state--1', 
        'card-state-0', 
        'card-state-1', 'card-state-2', 'card-state-3'
      );

      // Calculate relative position to active index
      let offset = i - activeIndex;

      // Handle wrapping for infinite loop effect dynamically
      const half = Math.floor(totalCards / 2);
      if (offset < -half) offset += totalCards;
      if (offset > (totalCards % 2 === 0 ? half - 1 : half)) offset -= totalCards;

      // Assign new state class
      const stateClass = `card-state-${offset}`;
      card.classList.add(stateClass);
      
      // Update featured styling (add .card-featured only to active card if we wanted to change sizes dynamically)
      // But in our case, the center card is structurally different.
      // Wait, in a true rotating carousel, any card can become the center card.
      // However, the prompt specifically says "SERVICE 3 - CENTER FEATURED CARD". 
      // If the user rotates, does the new center card become the big one with the dashboard?
      // "When the slide changes: Cards move in 3D, Cards scale, Cards rotate, Active card becomes prominent"
      // This implies we need to toggle a 'featured-active' state. 
      // Let's just manage the 3D positioning for now. The CSS handles the scaling via state classes if we make them uniform.
      // But in our HTML, card index 2 is permanently larger.
      // Let's apply a scale via CSS for the active state regardless of the card's base size.
    });

    // Update pagination
    dots.forEach((dot, i) => {
      if (i === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Next Button
  nextBtn.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % totalCards;
    updateCarousel();
  });

  // Prev Button
  prevBtn.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + totalCards) % totalCards;
    updateCarousel();
  });

  // Pagination Dots
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      activeIndex = parseInt(e.target.getAttribute('data-index'));
      updateCarousel();
    });
  });

  // Basic touch / swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  const carouselWrapper = document.getElementById('carouselWrapper');

  carouselWrapper.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carouselWrapper.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      // Swipe left -> Next
      activeIndex = (activeIndex + 1) % totalCards;
      updateCarousel();
    }
    if (touchEndX > touchStartX + threshold) {
      // Swipe right -> Prev
      activeIndex = (activeIndex - 1 + totalCards) % totalCards;
      updateCarousel();
    }
  }

  // Initialize
  updateCarousel();

  // Auto Slider Logic
  let autoSlideInterval;
  const autoSlideDelay = 3000; // 3 seconds

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      activeIndex = (activeIndex + 1) % totalCards;
      updateCarousel();
    }, autoSlideDelay);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Start auto slide initially
  startAutoSlide();

  // Pause on hover
  carouselWrapper.addEventListener('mouseenter', stopAutoSlide);
  carouselWrapper.addEventListener('mouseleave', startAutoSlide);

  // Pause on interaction with buttons/dots
  const allControls = [prevBtn, nextBtn, ...dots];
  allControls.forEach(control => {
    control.addEventListener('mouseenter', stopAutoSlide);
    control.addEventListener('mouseleave', startAutoSlide);
    
    // Also reset interval on click to avoid double-slide if clicked right before tick
    control.addEventListener('click', () => {
      stopAutoSlide();
      startAutoSlide();
    });
  });
});
