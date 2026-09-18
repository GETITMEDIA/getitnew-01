document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Category filter ---------- */
  const filters = document.querySelectorAll('.pf-filter');
  const items = document.querySelectorAll('.pf-item');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;

      filters.forEach(f => f.classList.remove('is-active'));
      btn.classList.add('is-active');

      items.forEach(item => {
        const match = category === 'all' || item.dataset.category.split(' ').includes(category);
        item.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- Stat counters ---------- */
  const counters = document.querySelectorAll('.pf-stat-num[data-count]');

  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => counterObserver.observe(el));

  /* ---------- Seamless logo marquee ---------- */
  const track = document.querySelector('.pf-marquee-track');
  if (track && !track.dataset.cloned) {
    track.innerHTML += track.innerHTML;
    track.dataset.cloned = 'true';
  }

});
