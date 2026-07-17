// ---- Scroll & motion setup ----
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Mobile hamburger menu ----
const hamburger = document.getElementById('hamburger');
const topnavList = document.getElementById('topnav-list');

function openMobileNav() {
  topnavList.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeMobileNav() {
  topnavList.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  const isOpen = topnavList.classList.contains('is-open');
  isOpen ? closeMobileNav() : openMobileNav();
});

// ---- Hero entrance animation ----
if (window.gsap && !prefersReducedMotion) {
  gsap.set(['.hero__name-line', '.hero__label', '.hero__bio', '.hero__ctas .btn'], {
    opacity: 0,
    y: 24,
  });

  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .to('.hero__name-line', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 })
    .to('.hero__label', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .to('.hero__bio', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.35')
    .to('.hero__ctas .btn', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.15 }, '-=0.3');
}

// ---- Generic scroll reveal for grouped elements ----
if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
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

// ---- About index-card scatter-to-grid reveal ----
// Note: gsap.to() leaves a permanent inline transform on each .about__item
// after this animation completes. Harmless today (no CSS rule sets transform
// on .about__item), but if a hover/transform effect is ever added to these
// cards, add clearProps: 'transform' to the gsap.to() call below to avoid
// an inline style silently overriding that future CSS rule.
if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  const aboutItems = document.querySelectorAll('.about__card .about__item');
  const tilts = [
    { rotate: -3, x: -6, y: 8 },
    { rotate: 2, x: 7, y: -5 },
    { rotate: -1.5, x: 4, y: 6 },
    { rotate: 2.5, x: -7, y: -4 },
    { rotate: -2.5, x: 6, y: -6 },
    { rotate: 1.5, x: -5, y: 7 },
    { rotate: -2, x: 3, y: -3 },
  ];
  aboutItems.forEach((item, i) => {
    const tilt = tilts[i % tilts.length];
    gsap.set(item, { opacity: 0, rotate: tilt.rotate, x: tilt.x, y: tilt.y });
  });
  gsap.to(aboutItems, {
    opacity: 1,
    rotate: 0,
    x: 0,
    y: 0,
    duration: 0.7,
    ease: 'power2.out',
    stagger: 0.07,
    scrollTrigger: {
      trigger: '.about__card',
      start: 'top 80%',
    },
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
if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
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
document.querySelectorAll('[data-count-to]').forEach((el) => {
  const target = parseInt(el.dataset.countTo, 10);
  const suffix = el.dataset.countSuffix || '';

  if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) {
    el.textContent = `${target}${suffix}`;
    return;
  }

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
