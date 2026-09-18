document.addEventListener('DOMContentLoaded', () => {

  // 1. Scroll Reveal Animations (Intersection Observer)
  const scrollElements = document.querySelectorAll('[data-seo-scroll]');
  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  scrollElements.forEach(el => scrollObserver.observe(el));


  // 2. Animated Number Counters
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = +entry.target.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        let current = 0;
        
        const timer = setInterval(() => {
          current += Math.ceil(target / 50); // Increment speed
          if (current >= target) {
            entry.target.innerText = target;
            clearInterval(timer);
          } else {
            entry.target.innerText = current;
          }
        }, 40);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

});
