(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const section = document.querySelector('.blueprint-section');
    const timeline = document.querySelector('.blueprint-timeline');
    const progressLine = document.getElementById('bpProgressLine');
    const laserPulse = document.getElementById('bpLaserPulse');
    const steps = document.querySelectorAll('.bp-step');

    if (!section || !timeline || !steps.length) return;

    // Helper: update progress line based on scroll position
    function updateTimelineProgress() {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far into the timeline container we have scrolled (from 25% viewport to 75% viewport)
      const startPoint = windowHeight * 0.7;
      const totalDist = rect.height;
      const currentScroll = startPoint - rect.top;

      let progress = currentScroll / totalDist;
      progress = Math.max(0, Math.min(1, progress));

      const percentage = progress * 100;

      if (progressLine) {
        progressLine.style.height = percentage + '%';
      }

      if (laserPulse) {
        laserPulse.style.top = percentage + '%';
        laserPulse.style.opacity = progress > 0 && progress < 1 ? '1' : '0';
      }

      // Activate steps & nodes as scroll line reaches them
      steps.forEach(function (step) {
        const stepRect = step.getBoundingClientRect();
        const stepCenter = stepRect.top + stepRect.height / 2;

        if (stepCenter < windowHeight * 0.72) {
          step.classList.add('is-active');
        } else {
          step.classList.remove('is-active');
        }
      });
    }

    // Scroll listener with requestAnimationFrame throttling
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateTimelineProgress();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateTimelineProgress();

    // GSAP ScrollTrigger integration if available for extra smooth parallax
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      steps.forEach((step, index) => {
        const node = step.querySelector('.bp-node');
        const content = step.querySelector('.bp-content');

        if (node && content) {
          gsap.fromTo(node, 
            { scale: 0.6, opacity: 0.4 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              scrollTrigger: {
                trigger: step,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
              }
            }
          );

          gsap.fromTo(content,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: 0.1,
              scrollTrigger: {
                trigger: step,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });
    }
  });
})();
