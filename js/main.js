// ---- Smooth scroll (Lenis) ----
const lenis = new Lenis({
  duration: 1.1,
  smoothWheel: true,
});

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

// ---- Hero entrance animation ----
if (window.gsap) {
  gsap.set(['.hero__label', '.hero__ghost-name', '.hero__photo', '.hero__bio', '.hero__ctas .btn'], {
    opacity: 0,
    y: 24,
  });

  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .to('.hero__label', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
    .to('.hero__ghost-name', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.5')
    .to('.hero__photo', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
    .to('.hero__bio', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .to('.hero__ctas .btn', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.15, clearProps: 'transform' }, '-=0.3');
}

// ---- Generic scroll reveal for grouped elements ----
if (window.gsap && window.ScrollTrigger) {
  document.querySelectorAll('.reveal-group').forEach((group) => {
    gsap.from(group, {
      opacity: 0,
      y: 32,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: group,
        start: 'top 85%',
      },
    });
  });
}
