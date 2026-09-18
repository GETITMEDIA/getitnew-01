import re

with open('d:\\new-getit\\nexella-html\\js\\smm-animations.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_logic = """
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
"""

with open('d:\\new-getit\\nexella-html\\js\\smm-animations.js', 'a', encoding='utf-8') as f:
    f.write(new_logic)
print("Updated js/smm-animations.js with counter logic.")
