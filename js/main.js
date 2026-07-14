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

// Short final sections (e.g. Contact) can be too small to ever enter the
// IntersectionObserver's center band once the page hits max scroll, so they'd
// never get highlighted by the observer alone. Treat "scrolled to the bottom"
// as an override that always wins, regardless of what the observer reports.
const lastSectionId = sections[sections.length - 1].id;

function checkBottomOfPage() {
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  if (atBottom) setActiveLink(lastSectionId);
  return atBottom;
}

const spyObserver = new IntersectionObserver(
  (entries) => {
    if (checkBottomOfPage()) return;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
);

sections.forEach((section) => spyObserver.observe(section));

window.addEventListener('scroll', checkBottomOfPage, { passive: true });
lenis.on('scroll', checkBottomOfPage);
checkBottomOfPage();

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

// ---- Introvert/Extrovert draggable slider ----
const sliderTrack = document.getElementById('ie-slider-track');
const sliderHandle = document.getElementById('ie-slider-handle');

if (sliderTrack && sliderHandle) {
  let dragging = false;
  let activePointerId = null;

  function setHandleRatio(ratio) {
    ratio = Math.min(1, Math.max(0, ratio));
    sliderHandle.style.left = `${ratio * 100}%`;
    sliderHandle.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
  }

  function setHandlePosition(clientX) {
    const rect = sliderTrack.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    setHandleRatio(ratio);
  }

  sliderHandle.addEventListener('pointerdown', (e) => {
    dragging = true;
    activePointerId = e.pointerId;
    sliderHandle.setPointerCapture(e.pointerId);
    e.stopPropagation();
  });

  sliderTrack.addEventListener('pointerdown', (e) => {
    setHandlePosition(e.clientX);
  });

  window.addEventListener('pointermove', (e) => {
    if (dragging && e.pointerId === activePointerId) setHandlePosition(e.clientX);
  });

  function endDrag(e) {
    if (e.pointerId === activePointerId) {
      dragging = false;
      activePointerId = null;
    }
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  const currentRatio = () => {
    const value = parseFloat(sliderHandle.getAttribute('aria-valuenow'));
    return (Number.isNaN(value) ? 55 : value) / 100;
  };

  sliderHandle.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setHandleRatio(currentRatio() + step);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setHandleRatio(currentRatio() - step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setHandleRatio(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setHandleRatio(1);
    }
  });
}

// ---- Case study image reveal (clip-path wipe) ----
if (window.gsap && window.ScrollTrigger) {
  document.querySelectorAll('.reveal-image img').forEach((img) => {
    gsap.set(img, { clipPath: 'inset(0 0 100% 0)' });
    gsap.to(img, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: img,
        start: 'top 80%',
      },
    });
  });
}

// ---- Stat counter (only elements with data-count-to) ----
if (window.gsap && window.ScrollTrigger) {
  document.querySelectorAll('[data-count-to]').forEach((el) => {
    const target = parseInt(el.dataset.countTo, 10);
    const suffix = el.dataset.countSuffix || '';
    const counter = { value: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          value: target,
          duration: 1.2,
          ease: 'power1.out',
          onUpdate: () => {
            el.textContent = `${Math.round(counter.value)}${suffix}`;
          },
        });
      },
    });
  });
}
