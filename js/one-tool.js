/* One Tool / 5 Solutions
   - plays the diagram when it scrolls into view
   - hover / focus previews a solution, click or tap pins it open */
(function () {
  var section = document.getElementById('one-tool');
  if (!section) return;

  /* ---------- scroll-in playback ---------- */
  if (!('IntersectionObserver' in window)) {
    section.classList.add('is-in');
  } else {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          section.classList.add('is-in');
        } else {
          // fully out of view: reset so it replays on the way back
          section.classList.remove('is-in');
          clear(true);
        }
      });
    }, { threshold: 0.25 }).observe(section);
  }

  /* ---------- interactive hub ---------- */
  var nodes = Array.prototype.slice.call(section.querySelectorAll('[data-ot-node]'));
  if (!nodes.length) return;

  var pinned = null;
  var hasHover = !window.matchMedia || window.matchMedia('(hover: hover)').matches;

  function render(active) {
    if (active) {
      section.setAttribute('data-active', active);
    } else {
      section.removeAttribute('data-active');
    }
    nodes.forEach(function (node) {
      var on = node.getAttribute('data-ot-node') === active;
      node.classList.toggle('is-active', on);
      node.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
  }

  function preview(id) {
    if (!pinned) render(id);
  }

  function clear(force) {
    if (force) pinned = null;
    if (!pinned) render(null);
  }

  nodes.forEach(function (node) {
    var id = node.getAttribute('data-ot-node');

    node.addEventListener('mouseenter', function () { preview(id); });
    node.addEventListener('mouseleave', function () { clear(false); });
    node.addEventListener('focus', function () { preview(id); });
    node.addEventListener('blur', function () { clear(false); });

    node.addEventListener('click', function () {
      pinned = (pinned === id) ? null : id;
      // unpinning on a mouse leaves it lit — the cursor is still on it
      render(pinned || (hasHover ? id : null));
    });
  });

  // clicking away releases a pinned solution
  document.addEventListener('click', function (event) {
    if (pinned && !section.contains(event.target)) clear(true);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && pinned) clear(true);
  });
})();
