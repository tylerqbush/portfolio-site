// Mobile menu and enlarged-illustration dialog. Both work with the keyboard and return focus.
(function () {
  var btn = document.querySelector('.nav__toggle');
  var list = document.getElementById('site-nav-list');

  function setOpen(open) {
    list.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.querySelector('.nav__toggle-text').textContent = open ? 'Close' : 'Menu';
  }

  if (btn && list) {
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        btn.focus();
      }
    });
  }

  document.querySelectorAll('[data-lightbox]').forEach(function (opener) {
    var dialog = document.getElementById(opener.getAttribute('data-lightbox'));
    if (!dialog || typeof dialog.showModal !== 'function') return;
    var img = dialog.querySelector('img[data-src]');
    var close = dialog.querySelector('.lightbox__close');

    opener.addEventListener('click', function () {
      if (img && !img.getAttribute('src')) img.setAttribute('src', img.getAttribute('data-src'));
      dialog.showModal();
      document.body.classList.add('has-dialog');
      close.focus();
    });
    close.addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () {
      document.body.classList.remove('has-dialog');
      opener.focus();
    });
  });
})();
