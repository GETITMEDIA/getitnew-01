document.addEventListener('DOMContentLoaded', () => {

  // 1. Scroll Reveal Animations (Intersection Observer)
  const scrollElements = document.querySelectorAll('[data-scroll]');
  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optional: unobserve if we only want to animate once
        // scrollObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  scrollElements.forEach(el => scrollObserver.observe(el));


  // 2. 3D Card Hover Tilt Effect
  const cards = document.querySelectorAll('.smm-card, .comp-item');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update CSS variables for the radial gradient glow position
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      // Calculate tilt angles
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      // Reset transition for smooth return
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => {
        card.style.transition = 'transform 0.1s, box-shadow 0.3s, border-color 0.3s';
      }, 500);
    });
  });

});

  // 3. Animated Number Counters
  const counters = document.querySelectorAll('.counter');
  let animationStarted = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = +entry.target.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / target));
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
