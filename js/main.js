// ---- Mobile hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('site-nav-list');

function openMobileNav() {
  navList.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
  navList.removeAttribute('inert');
}

function closeMobileNav() {
  navList.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  navList.setAttribute('inert', '');
}

if (hamburger && navList) {
  hamburger.addEventListener('click', () => {
    const isOpen = navList.classList.contains('is-open');
    isOpen ? closeMobileNav() : openMobileNav();
  });
}

// ---- Stat counter (elements with data-count-to; suffix via data-count-suffix) ----
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('[data-count-to]').forEach((el) => {
  const target = parseInt(el.dataset.countTo, 10);
  const suffix = el.dataset.countSuffix || '';

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    el.textContent = `${target}${suffix}`;
    return;
  }

  el.textContent = `0${suffix}`;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(el);

      const duration = 900;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });

  observer.observe(el);
});
