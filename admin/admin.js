/* GetIt Media admin: confirmations, drag-and-drop ordering, form helpers.
   Every change is sent to action.php (PHP); nothing here touches the JSON. */
(function () {
  'use strict';
  var main = document.querySelector('.ad-main');
  var csrf = main ? main.getAttribute('data-csrf') : '';

  /* 1. confirm before destructive actions */
  document.querySelectorAll('form[data-confirm]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!window.confirm(form.getAttribute('data-confirm'))) e.preventDefault();
    });
  });

  /* 2. drag-and-drop reordering for sections and members */
  document.querySelectorAll('[data-sortable]').forEach(function (list) {
    var dragged = null;
    var before = '';
    var ids = function () {
      return Array.prototype.map.call(list.children, function (li) { return li.getAttribute('data-id'); });
    };

    list.addEventListener('dragstart', function (e) {
      dragged = e.target.closest('[data-id]');
      if (!dragged) return;
      before = ids().join(',');
      dragged.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', dragged.getAttribute('data-id'));
    });

    list.addEventListener('dragover', function (e) {
      if (!dragged) return;
      e.preventDefault();
      var over = e.target.closest('[data-id]');
      if (!over || over === dragged) return;
      var r = over.getBoundingClientRect();
      var horizontal = list.classList.contains('ad-members');
      var after = horizontal ? (e.clientX > r.left + r.width / 2) : (e.clientY > r.top + r.height / 2);
      list.insertBefore(dragged, after ? over.nextSibling : over);
    });

    list.addEventListener('dragend', function () {
      if (!dragged) return;
      dragged.classList.remove('is-dragging');
      dragged = null;
      var order = ids();
      if (order.join(',') === before) return;

      var body = new FormData();
      body.append('csrf', csrf);
      body.append('action', list.getAttribute('data-sortable'));
      if (list.hasAttribute('data-section')) body.append('section', list.getAttribute('data-section'));
      order.forEach(function (id) { body.append('order[]', id); });
      list.classList.add('is-saving');

      fetch('action.php', { method: 'POST', body: body, headers: { 'Accept': 'application/json' }, credentials: 'same-origin' })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.ok) window.alert(res.message || 'Could not save the new order.');
          window.location.reload();
        })
        .catch(function () {
          window.alert('Could not save the new order. The page will reload.');
          window.location.reload();
        });
    });
  });

  /* 3. section form: show only the fields the chosen design uses */
  var form = document.querySelector('[data-module-form]');
  if (form) {
    var sync = function () {
      var checked = form.querySelector('input[name="module"]:checked');
      var mod = checked ? checked.value : '';
      form.querySelectorAll('[data-modules]').forEach(function (el) {
        var on = el.getAttribute('data-modules').split(' ').indexOf(mod) !== -1;
        el.hidden = !on;
        el.querySelectorAll('input, textarea, select').forEach(function (f) { f.disabled = !on; });
      });
    };
    form.addEventListener('change', function (e) { if (e.target.name === 'module') sync(); });
    sync();

    /* extra initial member slots (4 is only the default) */
    var add = form.querySelector('[data-add-init]');
    var rows = form.querySelector('[data-init-rows]');
    var count = form.querySelector('[data-init-count]');
    if (add && rows && count) {
      add.addEventListener('click', function () {
        var n = rows.children.length;
        var row = rows.lastElementChild.cloneNode(true);
        row.querySelectorAll('input').forEach(function (inp) {
          inp.value = '';
          inp.name = inp.name.replace(/_\d+$/, '_' + n);
        });
        var label = row.querySelector('label');
        if (label && label.firstChild) label.firstChild.nodeValue = 'Member ' + (n + 1) + ' name';
        rows.appendChild(row);
        count.value = n + 1;
      });
    }
  }
})();
