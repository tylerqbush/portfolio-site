// ---- Smooth scroll (Lenis) ----
const lenis = new Lenis({
  duration: 1.1,
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

// ---- Anchor links use Lenis scrollTo ----
document.querySelectorAll('.sidenav__link[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      lenis.scrollTo(target, { offset: 0 });
    }
    closeMobileNav();
  });
});

// ---- Mobile hamburger menu ----
const hamburger = document.getElementById('hamburger');
const sidenav = document.getElementById('sidenav');

function openMobileNav() {
  sidenav.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeMobileNav() {
  sidenav.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  const isOpen = sidenav.classList.contains('is-open');
  isOpen ? closeMobileNav() : openMobileNav();
});

// ---- Scroll-spy: highlight active nav link ----
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.sidenav__link[data-section]');

function setActiveLink(sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });
}

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
);

sections.forEach((section) => spyObserver.observe(section));
