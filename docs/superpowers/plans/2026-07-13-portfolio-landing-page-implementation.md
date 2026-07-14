# Tyler Quackenbush UX/UI Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, mobile-friendly, awwwards-caliber static portfolio site for Tyler Quackenbush (UX/UI Designer) per `docs/superpowers/specs/2026-07-13-portfolio-landing-page-design.md`.

**Architecture:** Plain HTML/CSS/JS, no build step. Fixed left sidebar nav + scrolling content sections (Home/About/Tools/Work/Contact/Resume). GSAP + ScrollTrigger drive scroll animation, Lenis drives smooth scroll, Three.js renders an interactive flow-field background in the hero only.

**Tech Stack:** HTML5, CSS3 (custom properties, no preprocessor), vanilla JS (ES modules where needed), GSAP 3.12.5 + ScrollTrigger (CDN), Lenis 1.1.13 (CDN), Three.js 0.160.0 (CDN, ES module), Google Fonts (Space Grotesk + Inter).

**Note on verification:** This is a static visual site with no test runner. Every task's "Test"/"Verify" step is a concrete, repeatable manual check (via the `run` skill / Chrome DevTools) instead of an automated test — open the exact URL, look for the exact thing described. Do not skip these; they are the acceptance criteria for the task.

---

## Task 1: Project Scaffold, Git Init & Design Tokens

**Files:**
- Create: `index.html`
- Create: `css/styles.css`
- Create: `js/main.js`
- Create: `.gitignore`
- Create: `assets/images/.gitkeep`

- [ ] **Step 1: Initialize git**

```bash
cd "/Users/tyler/Documents/Portfolio Site"
git init
```

Expected: `Initialized empty Git repository in /Users/tyler/Documents/Portfolio Site/.git/`

- [ ] **Step 2: Create `.gitignore`**

```
.DS_Store
*.log
```

- [ ] **Step 3: Create folder structure**

```bash
mkdir -p css js assets/images
touch assets/images/.gitkeep
```

- [ ] **Step 4: Write `index.html` skeleton with fonts and CDN scripts**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tyler Quackenbush | UX/UI Designer</title>
  <meta name="description" content="Tyler Quackenbush — UX/UI Designer portfolio. Product design, content design, and design systems work." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <!-- Sections and nav added in later tasks -->
  <main id="main-content"></main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
  <script type="module" src="js/hero-scene.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 5: Write `css/styles.css` with reset and design tokens**

```css
:root {
  --color-bg: #141414;
  --color-bg-alt: #1e1e1e;
  --color-bg-card: #232323;
  --color-text: #f5f5f5;
  --color-text-dim: #8a8a8a;
  --color-text-ghost: rgba(245, 245, 245, 0.08);
  --color-accent-wine: #3a1a1a;
  --color-border: rgba(245, 245, 245, 0.12);

  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;

  --nav-width: 220px;
  --section-padding-x: clamp(24px, 6vw, 96px);
  --section-padding-y: clamp(64px, 10vh, 120px);

  --transition-fast: 0.2s ease;
  --transition-medium: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: auto; /* Lenis takes over smooth scroll in JS */
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  line-height: 1.5;
  overflow-x: hidden;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 500;
  line-height: 1.1;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
```

- [ ] **Step 6: Write empty `js/main.js` with a load confirmation**

```javascript
console.log('[portfolio] main.js loaded');
```

- [ ] **Step 7: Verify the scaffold loads with no console errors**

Run:
```bash
cd "/Users/tyler/Documents/Portfolio Site" && python3 -m http.server 8080
```
Open `http://localhost:8080` in the Browser pane. Expected: blank dark page (`#141414` background), no 404s in Network tab for the font or CDN scripts, console shows `[portfolio] main.js loaded`. Note: `js/hero-scene.js` doesn't exist yet — a 404 for that one file is expected until Task 4; confirm no *other* 404s.

- [ ] **Step 8: Commit**

```bash
git add index.html css/styles.css js/main.js .gitignore assets/images/.gitkeep
git commit -m "Scaffold portfolio site with design tokens and CDN dependencies"
```

---

## Task 2: Hero Section Markup & Static Styles

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`

- [ ] **Step 1: Add sidebar nav and hero section markup inside `<main id="main-content">`**

Replace `<main id="main-content"></main>` in `index.html` with:

```html
<main id="main-content">
  <canvas id="hero-canvas"></canvas>

  <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>

  <nav class="sidenav" id="sidenav">
    <ul class="sidenav__list">
      <li><a href="#home" class="sidenav__link" data-section="home">Home</a></li>
      <li><a href="#about" class="sidenav__link" data-section="about">About</a></li>
      <li><a href="#tools" class="sidenav__link" data-section="tools">Tools</a></li>
      <li><a href="#work" class="sidenav__link" data-section="work">Work</a></li>
      <li><a href="#contact" class="sidenav__link" data-section="contact">Contact</a></li>
      <li><a href="assets/resume.pdf" target="_blank" rel="noopener" class="sidenav__link" id="resume-link">Resume</a></li>
    </ul>
  </nav>

  <section id="home" class="hero">
    <div class="hero__ghost-name" aria-hidden="true">TYLER QUACKENBUSH</div>
    <div class="hero__content">
      <p class="hero__label">UX UI DESIGNER</p>
      <div class="hero__photo">
        <img src="assets/images/headshot-placeholder.svg" alt="Tyler Quackenbush" id="headshot-img" />
      </div>
      <p class="hero__bio">
        I'm a Product Designer who crafts dashboards, decision tools, and user journeys that make sense of complexity.
        I turn ambiguity into clean, intuitive experiences&mdash;aligning user needs with business goals.
        Whether it's streamlining workflows or visualizing data, I bring order to chaos and design that gets out of the way.
      </p>
      <div class="hero__ctas">
        <a href="#work" class="btn btn--primary">My Work</a>
        <a href="assets/resume.pdf" target="_blank" rel="noopener" class="btn btn--link">Download Resume</a>
      </div>
    </div>
  </section>
</main>
```

- [ ] **Step 2: Create a placeholder headshot SVG so the `<img>` doesn't 404**

Create `assets/images/headshot-placeholder.svg`:

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
  <rect width="400" height="500" fill="#2a2a2a"/>
  <circle cx="200" cy="190" r="80" fill="#3a3a3a"/>
  <rect x="80" y="290" width="240" height="210" rx="40" fill="#3a3a3a"/>
  <text x="200" y="460" font-family="sans-serif" font-size="18" fill="#8a8a8a" text-anchor="middle">Headshot placeholder</text>
</svg>
```

- [ ] **Step 3: Append hero + sidenav styles to `css/styles.css`**

```css
/* Sidebar nav */
.sidenav {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--nav-width);
  height: 100vh;
  display: flex;
  align-items: center;
  padding-left: clamp(24px, 4vw, 64px);
  z-index: 50;
}

.sidenav__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.sidenav__link {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--color-text-dim);
  transition: color var(--transition-fast);
}

.sidenav__link.active,
.sidenav__link:hover {
  color: var(--color-text);
  font-weight: 700;
}

.hamburger {
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 60;
  width: 44px;
  height: 44px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text);
}

/* Hero */
.hero {
  position: relative;
  min-height: 100vh;
  margin-left: var(--nav-width);
  display: flex;
  align-items: center;
  padding: var(--section-padding-y) var(--section-padding-x);
  overflow: hidden;
}

#hero-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}

.hero__ghost-name {
  position: absolute;
  top: 38%;
  left: 0;
  width: 100%;
  text-align: center;
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 9vw, 7rem);
  color: var(--color-text-ghost);
  white-space: nowrap;
  z-index: 1;
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 2;
  max-width: 720px;
  margin-left: auto;
  text-align: right;
}

.hero__label {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw, 4rem);
  color: var(--color-text-dim);
  margin-bottom: 24px;
}

.hero__photo {
  width: min(320px, 60vw);
  margin-left: auto;
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  filter: grayscale(1);
}

.hero__bio {
  color: var(--color-text);
  font-size: 1.05rem;
  max-width: 520px;
  margin-left: auto;
  margin-bottom: 32px;
}

.hero__ctas {
  display: flex;
  gap: 24px;
  justify-content: flex-end;
  align-items: center;
}

.btn {
  font-family: var(--font-heading);
  padding: 14px 28px;
  border-radius: 999px;
  font-size: 0.95rem;
  transition: transform var(--transition-fast), background var(--transition-fast);
}

.btn--primary {
  background: var(--color-text);
  color: var(--color-bg);
}

.btn--primary:hover {
  transform: translateY(-2px);
}

.btn--link {
  text-decoration: underline;
  color: var(--color-text);
  padding: 14px 0;
}

@media (max-width: 900px) {
  .sidenav {
    transform: translateX(-100%);
    background: var(--color-bg);
    transition: transform var(--transition-medium);
    width: 260px;
  }

  .sidenav.is-open {
    transform: translateX(0);
  }

  .hamburger {
    display: flex;
  }

  .hero {
    margin-left: 0;
    padding-top: 100px;
    text-align: center;
  }

  .hero__content {
    text-align: center;
    margin: 0 auto;
  }

  .hero__photo {
    margin: 0 auto 24px;
  }

  .hero__bio {
    margin: 0 auto 32px;
  }

  .hero__ctas {
    justify-content: center;
  }
}
```

- [ ] **Step 4: Verify layout**

Reload `http://localhost:8080`. Expected: left sidebar with 6 links (Home bold/white, others dimmed gray), hero content right-aligned with ghosted "TYLER QUACKENBUSH" text behind a placeholder headshot box, bio text, two buttons ("My Work" solid pill, "Download Resume" underlined). Resize the Browser pane to 375px width (mobile preset) — sidebar should disappear and a hamburger icon should appear top-left; hero content should center itself.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css assets/images/headshot-placeholder.svg
git commit -m "Add hero section and sidebar navigation markup/styles"
```

---

## Task 3: Sidebar Navigation Behavior (Scroll-Spy, Mobile Menu, Lenis Smooth Scroll)

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Replace `js/main.js` contents with nav + Lenis setup**

```javascript
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
```

- [ ] **Step 2: Verify smooth scroll and active nav state**

Reload the page (only the hero section exists so far — this is expected; scroll-spy will have just one section to observe until later tasks add more). Confirm in the console there are no errors referencing `Lenis`, `gsap`, or `ScrollTrigger` being undefined. Click the "Home" nav link: page should not jump (Lenis is active) and "Home" should be bold/white. Resize to mobile width, click the hamburger: the sidebar should slide in from the left; clicking "Home" again should close it.

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "Add Lenis smooth scroll, scroll-spy nav highlighting, and mobile menu toggle"
```

---

## Task 4: Hero Three.js Flow-Field Scene

**Files:**
- Create: `js/hero-scene.js`

- [ ] **Step 1: Write the flow-field scene**

```javascript
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('hero-canvas');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && !prefersReducedMotion) {
  initHeroScene(canvas);
} else if (canvas) {
  canvas.style.display = 'none';
}

function initHeroScene(canvas) {
  const isSmallScreen = window.innerWidth < 700;
  const LINE_COUNT = isSmallScreen ? 40 : 90;
  const POINTS_PER_LINE = 60;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
  camera.position.z = 1;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const lines = [];
  const mouse = { x: 0, y: 0, target: { x: 0, y: 0 } };

  function createLine(index) {
    const yBase = (index / LINE_COUNT) * 2 - 1;
    const positions = new Float32Array(POINTS_PER_LINE * 3);
    for (let i = 0; i < POINTS_PER_LINE; i++) {
      const x = (i / (POINTS_PER_LINE - 1)) * 2 - 1;
      positions[i * 3] = x;
      positions[i * 3 + 1] = yBase;
      positions[i * 3 + 2] = 0;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06 + (index % 5) * 0.01,
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    return { line, yBase, geometry };
  }

  for (let i = 0; i < LINE_COUNT; i++) {
    lines.push(createLine(i));
  }

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', (e) => {
    mouse.target.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.target.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    mouse.x += (mouse.target.x - mouse.x) * 0.05;
    mouse.y += (mouse.target.y - mouse.y) * 0.05;

    lines.forEach(({ geometry, yBase }, lineIndex) => {
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < POINTS_PER_LINE; i++) {
        const x = positions[i * 3];
        const wave = Math.sin(x * 2 + t * 0.6 + lineIndex * 0.3) * 0.04;
        const distToMouse = Math.hypot(x - mouse.x, yBase - mouse.y);
        const mouseInfluence = Math.max(0, 0.4 - distToMouse) * 0.6;
        positions[i * 3 + 1] = yBase + wave + mouseInfluence;
      }
      geometry.attributes.position.needsUpdate = true;
    });

    renderer.render(scene, camera);
  }
  animate();
}
```

- [ ] **Step 2: Verify the flow-field renders**

Reload the page. Expected: thin, faint white horizontal lines fill the hero background and gently ripple; moving the mouse over the hero should cause nearby lines to bulge toward the cursor. Open Chrome DevTools' Rendering tab, enable "Emulate CSS media feature prefers-reduced-motion: reduce", reload — canvas should disappear entirely (falls back to plain dark background). Turn the emulation back off afterward.

- [ ] **Step 3: Commit**

```bash
git add js/hero-scene.js
git commit -m "Add interactive Three.js flow-field background for hero section"
```

---

## Task 5: Hero GSAP Entrance Animation

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Add entrance timeline to the end of `js/main.js`**

```javascript
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
    .to('.hero__ctas .btn', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.15 }, '-=0.3');
}
```

- [ ] **Step 2: Verify**

Hard-reload the page (cmd+shift+r equivalent / disable cache in DevTools Network tab). Expected: on load, the "UX UI DESIGNER" label fades/slides up first, then the ghost name, photo, bio, and buttons follow in a staggered sequence rather than all appearing at once.

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "Add GSAP staggered entrance animation for hero content"
```

---

## Task 6: About Section Markup, Styles & Scroll Reveal

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`
- Modify: `js/main.js`

- [ ] **Step 1: Insert About section markup in `index.html` immediately after `</section>` that closes `#home`**

```html
<section id="about" class="about">
  <h2 class="section-heading">About Me</h2>
  <div class="about__card reveal-group">
    <div class="about__col">
      <div class="about__item">
        <h3>Superpower</h3>
        <p>Operating from high-agency and turning ideas into action</p>
      </div>
      <div class="about__item">
        <h3>Weakness</h3>
        <p>Getting caught in optimization mode instead of shipping</p>
      </div>
      <div class="about__item">
        <h3>Favorite tools</h3>
        <p>Airtable, ChatGPT, Figma, and a well-worn Bullet Journal</p>
      </div>
      <div class="about__item">
        <h3>Favorite part</h3>
        <p>Structuring chaos</p>
      </div>
    </div>
    <div class="about__col">
      <div class="about__item">
        <h3>Best time of day/place to be productive</h3>
        <p>Early morning with coffee and clear intentions, or any time I'm focused on outcome over process</p>
      </div>
      <div class="about__item">
        <h3>I want to be good at</h3>
        <p>Trusting timing while staying in motion; persuasive copywriting</p>
      </div>
      <div class="about__item">
        <h3>I don't want to be good at</h3>
        <p>Doing things just because &ldquo;that's how it's always been done&rdquo;</p>
      </div>
      <div class="about__slider">
        <div class="about__slider-labels">
          <span>Introvert</span>
          <span>Extrovert</span>
        </div>
        <div class="about__slider-track" id="ie-slider-track">
          <div class="about__slider-handle" id="ie-slider-handle"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="about__statement reveal-group">
    <p>
      One of my most valuable qualities is intentional curiosity. I excel at taking complex, ambiguous
      problems and building clear, actionable systems around them. I bring structure, clarity, and momentum
      to every team I'm part of.
    </p>
  </div>
</section>
```

- [ ] **Step 2: Append About styles to `css/styles.css`**

```css
.section-heading {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--color-text-dim);
  margin-bottom: 48px;
}

.about,
.tools,
.work,
.contact {
  margin-left: var(--nav-width);
  padding: var(--section-padding-y) var(--section-padding-x);
}

.about__card {
  background: var(--color-bg-alt);
  border-radius: 20px;
  padding: clamp(24px, 4vw, 56px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 32px;
}

.about__col {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.about__item h3 {
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.about__item p {
  color: var(--color-text-dim);
}

.about__slider {
  margin-top: 8px;
}

.about__slider-labels {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-heading);
  margin-bottom: 12px;
}

.about__slider-track {
  position: relative;
  height: 6px;
  border-radius: 999px;
  background: var(--color-border);
  cursor: pointer;
}

.about__slider-handle {
  position: absolute;
  top: 50%;
  left: 55%;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-text);
  transform: translate(-50%, -50%);
  touch-action: none;
}

.about__statement {
  background: var(--color-bg-card);
  border-radius: 20px;
  padding: clamp(24px, 3vw, 40px);
  font-size: 1.1rem;
}

@media (max-width: 900px) {
  .about,
  .tools,
  .work,
  .contact {
    margin-left: 0;
  }

  .about__card {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Append scroll-reveal animation to `js/main.js`**

```javascript
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
```

- [ ] **Step 4: Verify**

Reload the page and scroll to the About section. Expected: the personality-grid card and the closing-statement card each fade/slide up into place as they enter the viewport (not before). Layout should show two columns of Q&A items side by side on desktop, one column on mobile width.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "Add About section content, styles, and scroll-reveal animation"
```

---

## Task 7: About — Interactive Introvert/Extrovert Slider

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Append draggable slider logic to `js/main.js`**

```javascript
// ---- Introvert/Extrovert draggable slider ----
const sliderTrack = document.getElementById('ie-slider-track');
const sliderHandle = document.getElementById('ie-slider-handle');

if (sliderTrack && sliderHandle) {
  let dragging = false;

  function setHandlePosition(clientX) {
    const rect = sliderTrack.getBoundingClientRect();
    let ratio = (clientX - rect.left) / rect.width;
    ratio = Math.min(1, Math.max(0, ratio));
    sliderHandle.style.left = `${ratio * 100}%`;
  }

  sliderHandle.addEventListener('pointerdown', (e) => {
    dragging = true;
    sliderHandle.setPointerCapture(e.pointerId);
  });

  sliderTrack.addEventListener('pointerdown', (e) => {
    setHandlePosition(e.clientX);
  });

  window.addEventListener('pointermove', (e) => {
    if (dragging) setHandlePosition(e.clientX);
  });

  window.addEventListener('pointerup', () => {
    dragging = false;
  });
}
```

- [ ] **Step 2: Verify**

Reload, scroll to About. Click anywhere on the Introvert/Extrovert track: the handle should jump to that position. Press and drag the handle itself: it should follow the cursor smoothly and stop at the track edges (0% and 100%), not slide past them.

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "Make Introvert/Extrovert slider draggable"
```

---

## Task 8: Tools Section Markup, Content & Scroll Reveal

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`

- [ ] **Step 1: Insert Tools section markup after `</section>` that closes `#about`**

```html
<section id="tools" class="tools">
  <h2 class="section-heading">Tools</h2>
  <div class="tools__grid reveal-group">
    <div class="tools__group">
      <h3>Design &amp; Prototyping</h3>
      <ul>
        <li>Figma</li>
        <li>Webflow</li>
        <li>Photoshop</li>
        <li>Illustrator</li>
      </ul>
    </div>
    <div class="tools__group">
      <h3>AI-Assisted Workflow</h3>
      <ul>
        <li>Claude</li>
        <li>ChatGPT</li>
      </ul>
    </div>
    <div class="tools__group">
      <h3>Research &amp; Ops</h3>
      <ul>
        <li>Airtable</li>
        <li>Jira</li>
        <li>Confluence</li>
      </ul>
    </div>
    <div class="tools__group">
      <h3>Front-End Basics</h3>
      <ul>
        <li>HTML &amp; CSS</li>
        <li>GitHub</li>
      </ul>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append Tools styles to `css/styles.css`**

```css
.tools__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.tools__group {
  background: var(--color-bg-alt);
  border-radius: 16px;
  padding: 28px;
}

.tools__group h3 {
  font-size: 1rem;
  color: var(--color-text-dim);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tools__group ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 1.05rem;
}

@media (max-width: 900px) {
  .tools__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 520px) {
  .tools__grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Verify**

Reload, scroll to Tools. Expected: four cards (Design & Prototyping, AI-Assisted Workflow, Research & Ops, Front-End Basics) fade up together as a group when scrolled into view (reusing the `.reveal-group` behavior from Task 6). At 900px width, the grid should reflow to 2 columns; below 520px, 1 column.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "Add Tools section with current AI-era tool grouping"
```

---

## Task 9: Work Section — Case Study Markup & Styles

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`

- [ ] **Step 1: Insert Work section markup after `</section>` that closes `#tools`**

```html
<section id="work" class="work">
  <h2 class="section-heading">Work</h2>

  <article class="case-study" data-case="novant">
    <div class="case-study__media reveal-image">
      <img src="assets/images/novant-placeholder.svg" alt="Novant Health website redesign mockup" />
    </div>
    <div class="case-study__body">
      <p class="case-study__eyebrow">Novant Health &middot; Done in Figma</p>
      <h3>System-Wide Website Redesign</h3>
      <p class="case-study__desc">
        The aim of this project was to improve how patients access care online across Novant Health's digital
        ecosystem. The project goal was to simplify key flows&mdash;like scheduling and provider search&mdash;while
        improving accessibility and scalability.
      </p>
      <p class="case-study__desc">
        As part of the UX team, I redesigned key sections of Novant Health's website to improve appointment
        scheduling, care access, and overall usability, especially for mobile users. I worked closely with
        developers and stakeholders to test prototypes and roll out components in a phased release.
      </p>
      <div class="case-study__highlights">
        <div class="highlight">
          <span class="highlight__stat">Streamlined Appointment Flow</span>
          <p>Helped reduce drop-offs in online scheduling by simplifying key paths and improving mobile UX</p>
        </div>
        <div class="highlight">
          <span class="highlight__stat">Recognized by Internal UX Team</span>
          <p>Praised for creating a modular, reusable system that accelerated rollout across multiple departments</p>
        </div>
      </div>
      <ol class="case-study__process">
        <li><span>01</span><h4>UX Audit</h4><p>Reviewed data and identified user pain points</p></li>
        <li><span>02</span><h4>Team Alignment</h4><p>Facilitated design priorities across departments</p></li>
        <li><span>03</span><h4>Journey Mapping</h4><p>Focused on care search and scheduling flows</p></li>
        <li><span>04</span><h4>Accessibility Design</h4><p>Ensured WCAG compliance from the start</p></li>
        <li><span>05</span><h4>Modular UI</h4><p>Built scalable, dev-ready design components</p></li>
        <li><span>06</span><h4>QA &amp; Rollout</h4><p>Tested live environments and supported implementation</p></li>
      </ol>
    </div>
  </article>

  <article class="case-study" data-case="acct">
    <div class="case-study__media reveal-image">
      <img src="assets/images/acct-placeholder.svg" alt="ACCT International brand redesign mockup" />
    </div>
    <div class="case-study__body">
      <p class="case-study__eyebrow">ACCT International &middot; Done in Figma</p>
      <h3>Brand Redesign</h3>
      <p class="case-study__desc">
        The aim of this project was to modernize the ACCT brand, helping it better communicate safety,
        structure, and leadership in the challenge course industry. The project goal was to create a scalable
        identity system that would work across digital, print, and industry-facing platforms.
      </p>
      <p class="case-study__desc">
        I led a complete brand overhaul for the Association for Challenge Course Technology (ACCT), aligning
        their visual identity with a modern, professional tone while preserving their roots in adventure and
        safety. This included a new logo system, typography, and design language extended across digital and
        print.
      </p>
      <div class="case-study__highlights">
        <div class="highlight">
          <span class="highlight__stat">Unified Diverse Stakeholders</span>
          <p>Successfully aligned voices from nonprofit leadership, regulators, and industry pros into a cohesive brand direction</p>
        </div>
        <div class="highlight">
          <span class="highlight__stat">&ldquo;The first time we've ever felt truly professional.&rdquo;</span>
          <p>Shared by a board member after rollout, speaking to the credibility the new brand brought to the mission</p>
        </div>
      </div>
      <ol class="case-study__process">
        <li><span>01</span><h4>Discovery</h4><p>Captured voice, values, and vision from board and staff</p></li>
        <li><span>02</span><h4>Brand Audit</h4><p>Assessed gaps in visual identity and brand perception</p></li>
        <li><span>03</span><h4>Strategy Definition</h4><p>Clarified core themes: trust, structure, adventure</p></li>
        <li><span>04</span><h4>Visual Design</h4><p>Created scalable identity system and brand assets</p></li>
        <li><span>05</span><h4>Brand Rollout</h4><p>Applied across print, digital, and event materials</p></li>
        <li><span>06</span><h4>Delivery</h4><p>Finalized toolkit for consistent brand use</p></li>
      </ol>
    </div>
  </article>

  <article class="case-study" data-case="adventure">
    <div class="case-study__media reveal-image">
      <img src="assets/images/adventure-placeholder.svg" alt="Adventure Careers website and brand mockup" />
    </div>
    <div class="case-study__body">
      <p class="case-study__eyebrow">Adventure Careers &middot; Done in Figma</p>
      <h3>Website and Brand</h3>
      <p class="case-study__desc">
        The aim of this project was to build a fresh, mission-driven brand and job board website that connects
        young adults with meaningful outdoor work. The project goal was to create an intuitive, visually
        appealing site that encourages exploration and drives job applications.
      </p>
      <p class="case-study__desc">
        For this startup, I built a fresh brand identity and responsive website to connect young adults with
        outdoor and experiential education jobs. The site needed to feel like a real company now, with fresh
        visuals and a simple job application flow while keeping it easy to use.
      </p>
      <div class="case-study__highlights">
        <div class="highlight">
          <span class="highlight__stat" data-count-to="40" data-count-suffix="%">0%</span>
          <p>Reduced bounce rate &mdash; clean navigation and mobile-first design drove a major boost in on-site engagement</p>
        </div>
        <div class="highlight">
          <span class="highlight__stat">&ldquo;It looks and feels like a real company now.&rdquo;</span>
          <p>The founder's feedback, capturing how the brand elevated their credibility with job seekers and partners</p>
        </div>
      </div>
      <ol class="case-study__process">
        <li><span>01</span><h4>Audience Insights</h4><p>Spoke to users on both sides of the job platform</p></li>
        <li><span>02</span><h4>Brand Design</h4><p>Built a bold, youthful identity system</p></li>
        <li><span>03</span><h4>Site Architecture</h4><p>Planned intuitive, mobile-first job flow</p></li>
        <li><span>04</span><h4>UI Design</h4><p>Crafted clean, energetic interface mockups</p></li>
        <li><span>05</span><h4>Dev Collaboration</h4><p>Provided assets, specs, and live support</p></li>
        <li><span>06</span><h4>Launch Review</h4><p>Analyzed usage and optimized post-launch</p></li>
      </ol>
    </div>
  </article>
</section>
```

Note: only the Adventure Careers stat (`40%`) has a real number to animate, so it's the only one wired with `data-count-to`/`data-count-suffix` — the other highlights are text-based accomplishments, not numeric stats, and intentionally have no counter attributes.

- [ ] **Step 2: Create placeholder SVGs for the three case studies**

Create `assets/images/novant-placeholder.svg`:

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <rect width="800" height="500" fill="#2a2a2a"/>
  <text x="400" y="250" font-family="sans-serif" font-size="24" fill="#8a8a8a" text-anchor="middle">Novant Health mockup placeholder</text>
</svg>
```

Create `assets/images/acct-placeholder.svg`:

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <rect width="800" height="500" fill="#2a2a2a"/>
  <text x="400" y="250" font-family="sans-serif" font-size="24" fill="#8a8a8a" text-anchor="middle">ACCT International mockup placeholder</text>
</svg>
```

Create `assets/images/adventure-placeholder.svg`:

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <rect width="800" height="500" fill="#2a2a2a"/>
  <text x="400" y="250" font-family="sans-serif" font-size="24" fill="#8a8a8a" text-anchor="middle">Adventure Careers mockup placeholder</text>
</svg>
```

- [ ] **Step 3: Append Work/case-study styles to `css/styles.css`**

```css
.case-study {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: start;
  padding: 64px 0;
  border-top: 1px solid var(--color-border);
}

.case-study:first-of-type {
  border-top: none;
}

.case-study__media {
  position: sticky;
  top: 80px;
  border-radius: 16px;
  overflow: hidden;
}

.case-study__eyebrow {
  color: var(--color-text-dim);
  font-family: var(--font-heading);
  margin-bottom: 8px;
}

.case-study__body h3 {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  margin-bottom: 20px;
}

.case-study__desc {
  color: var(--color-text-dim);
  margin-bottom: 16px;
}

.case-study__highlights {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 32px 0;
}

.highlight {
  background: var(--color-bg-alt);
  border-radius: 12px;
  padding: 20px;
}

.highlight__stat {
  display: block;
  font-family: var(--font-heading);
  font-size: 1.15rem;
  margin-bottom: 8px;
}

.highlight p {
  color: var(--color-text-dim);
  font-size: 0.9rem;
}

.case-study__process {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
}

.case-study__process li {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.case-study__process span {
  color: var(--color-text-dim);
  font-family: var(--font-heading);
  font-size: 0.85rem;
}

.case-study__process h4 {
  font-size: 1rem;
}

.case-study__process p {
  color: var(--color-text-dim);
  font-size: 0.85rem;
}

@media (max-width: 900px) {
  .case-study {
    grid-template-columns: 1fr;
  }

  .case-study__media {
    position: static;
  }

  .case-study__highlights,
  .case-study__process {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Verify**

Reload, scroll to Work. Expected: three case studies (Novant Health, ACCT International, Adventure Careers) stacked vertically, each with a placeholder image on the left (sticky while its text scrolls past, on desktop widths), title/description/two highlight cards/6-step process grid on the right. At 900px width, media should stop being sticky and stack above the text.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css assets/images/*.svg
git commit -m "Add Work section with three full case studies"
```

---

## Task 10: Work Section — Scroll Animations (Image Reveal + Stat Counter)

**Files:**
- Modify: `css/styles.css`
- Modify: `js/main.js`

- [ ] **Step 1: Append clip-path reveal starting state to `css/styles.css`**

```css
.reveal-image img {
  clip-path: inset(0 0 100% 0);
}
```

- [ ] **Step 2: Append image-reveal and stat-counter animation to `js/main.js`**

```javascript
// ---- Case study image reveal (clip-path wipe) ----
if (window.gsap && window.ScrollTrigger) {
  document.querySelectorAll('.reveal-image img').forEach((img) => {
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
```

- [ ] **Step 3: Verify**

Reload, scroll to the Novant Health case study image: it should wipe in from top to bottom as it enters the viewport, not just appear instantly. Continue scrolling to the Adventure Careers highlight showing "0%" — it should count up to "40%" once that card enters the viewport, and only run once (scroll back up and down again; it should not restart).

- [ ] **Step 4: Commit**

```bash
git add css/styles.css js/main.js
git commit -m "Add scroll-triggered image reveal and stat counter animations"
```

---

## Task 11: Contact Section Markup & Styles

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`

- [ ] **Step 1: Insert Contact section markup after `</section>` that closes `#work`**

```html
<section id="contact" class="contact">
  <div class="contact__inner reveal-group">
    <h2 class="section-heading contact__heading">You can reach me at</h2>
    <a href="mailto:tyler.qbush@gmail.com" class="contact__row">
      <span class="contact__icon" aria-hidden="true">&#9993;</span>
      <span>tyler.qbush@gmail.com</span>
    </a>
    <a href="tel:+16784514471" class="contact__row">
      <span class="contact__icon" aria-hidden="true">&#9742;</span>
      <span>(678) 451-4471</span>
    </a>
  </div>
</section>
```

- [ ] **Step 2: Append Contact styles to `css/styles.css`**

```css
.contact {
  position: relative;
  background: var(--color-accent-wine);
  background-image:
    repeating-linear-gradient(0deg, rgba(245,245,245,0.05) 0 1px, transparent 1px 64px),
    repeating-linear-gradient(90deg, rgba(245,245,245,0.05) 0 1px, transparent 1px 64px);
}

.contact__heading {
  color: var(--color-text);
  margin-bottom: 32px;
}

.contact__row {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 1.3rem;
  margin-bottom: 20px;
  width: fit-content;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.contact__icon {
  font-size: 1.4rem;
}
```

- [ ] **Step 3: Verify**

Reload, scroll to Contact. Expected: dark wine-toned section with a faint grid pattern, "You can reach me at" heading, email and phone each on their own underlined row with an icon. Click the email row — it should open the system mail client compose (`mailto:`); on the phone row on a desktop browser this typically no-ops or offers to open a calling app, which is expected `tel:` behavior.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "Add Contact section with mailto/tel links and wine-accent background"
```

---

## Task 12: Resume Content & PDF Generation

**Files:**
- Create: `assets/resume-print.html`
- Create: `assets/resume.pdf` (generated, not hand-written)

- [ ] **Step 1: Write the synthesized resume as a standalone printable HTML file**

Create `assets/resume-print.html`:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Tyler Quackenbush — Resume</title>
<style>
  @page { margin: 0.6in; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; font-size: 11pt; line-height: 1.4; }
  h1 { font-size: 22pt; margin-bottom: 2pt; }
  h2 { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.08em; color: #555; border-bottom: 1px solid #ccc; padding-bottom: 4pt; margin: 18pt 0 8pt; }
  .contact-line { color: #444; margin-bottom: 14pt; }
  .role { margin-bottom: 12pt; }
  .role__header { display: flex; justify-content: space-between; font-weight: bold; }
  .role__title { font-style: italic; color: #444; margin-bottom: 4pt; }
  ul { margin: 4pt 0 0 16pt; padding: 0; }
  li { margin-bottom: 2pt; }
  .skills { color: #333; }
</style>
</head>
<body>
  <h1>Tyler Quackenbush</h1>
  <p class="contact-line">UX/UI Designer &middot; Dahlonega, GA &middot; tyler.qbush@gmail.com &middot; (678) 451-4471 &middot; linkedin.com/in/tyler-qbush</p>

  <h2>Summary</h2>
  <p>
    UX/UI Designer with 8+ years across product design, content design, and design systems work,
    spanning healthcare, federal, nonprofit, and startup clients. Combines hands-on Figma design and
    prototyping with content strategy and information architecture, and brings a modern, AI-assisted
    workflow (Claude, ChatGPT) to research synthesis, content production, and design documentation.
    Track record of leading redesigns that measurably improve engagement, accessibility, and stakeholder
    satisfaction, and of owning a product end-to-end as a founder.
  </p>

  <h2>Skills</h2>
  <p class="skills">
    Figma &middot; Webflow &middot; Wireframing &amp; Prototyping &middot; Design Systems &middot; Information Architecture
    &middot; User &amp; Usability Testing &middot; UX Writing &middot; Journey Mapping &middot; Claude &amp; AI-Assisted
    Workflows &middot; Airtable &middot; Jira &middot; Confluence &middot; HTML/CSS &middot; GitHub
  </p>

  <h2>Experience</h2>

  <div class="role">
    <div class="role__header"><span>Senior UX Designer / UX Program Delivery Lead</span><span>2021 &ndash; Present</span></div>
    <div class="role__title">Agile Defense (formerly Intellibridge) &middot; Remote</div>
    <ul>
      <li>Led design and rollout of an internal UX intranet platform, increasing employee productivity 30% through centralized design resources.</li>
      <li>Designed wireframes and prototypes for web redesign projects, driving a 25% increase in engagement and 20% increase in conversion.</li>
      <li>Conducted user research and usability testing that cut user errors 40% and raised satisfaction 50%.</li>
      <li>Co-led an intake framework adopted across design and delivery teams, reducing scope ambiguity 70%.</li>
      <li>Delivered 40+ design initiatives with a 100% on-time record and 90% stakeholder satisfaction.</li>
    </ul>
  </div>

  <div class="role">
    <div class="role__header"><span>Founder / Content Lead</span><span>2023 &ndash; Present</span></div>
    <div class="role__title">Land to Land Holdings</div>
    <ul>
      <li>Own product, content, and design for a real estate investment company's web presence end-to-end.</li>
      <li>Designed and operate AI-assisted content systems that draft SEO-optimized listings and marketing content under a structured human-review model.</li>
      <li>Built and maintain a structured-data-driven website with pages generated from a live content database.</li>
    </ul>
  </div>

  <div class="role">
    <div class="role__header"><span>UX Content Designer</span><span>2022</span></div>
    <div class="role__title">Novant Health (via Accrue Partners) &middot; Remote</div>
    <ul>
      <li>Produced 50+ high-fidelity Figma prototypes weekly for a system-wide healthcare website redesign.</li>
      <li>Cut per-page production time to under 10 minutes via Figma auto-layout systems.</li>
      <li>Streamlined the image migration process, reducing asset search time 75%.</li>
    </ul>
  </div>

  <div class="role">
    <div class="role__header"><span>Web Designer</span><span>2016 &ndash; 2021</span></div>
    <div class="role__title">University of North Georgia &middot; Dahlonega, GA</div>
    <ul>
      <li>Led a site-wide redesign of a 5,000+ page site, increasing engagement 35%.</li>
      <li>Consolidated 20+ site menus and designed custom iconography for an admissions page with 1M+ annual views.</li>
      <li>Maintained 128 departmental sites and led rollout of a 2FA onboarding landing page for 20,000+ users.</li>
    </ul>
  </div>

  <h2>Education &amp; Certifications</h2>
  <p>Bachelor of Arts, English Literature &mdash; University of North Georgia</p>
  <p>Certified ScrumMaster (CSM) &middot; SAFe for Teams Certified &middot; UX/UI Design for Gaming (ELVTR) &middot; Interaction Design Foundation coursework (User Research Methods, Human-Computer Interaction, Affordances in UI Design, Gestalt Psychology in Web Design)</p>
</body>
</html>
```

- [ ] **Step 2: Generate the PDF with headless Chrome**

```bash
cd "/Users/tyler/Documents/Portfolio Site"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --print-to-pdf="assets/resume.pdf" "file://$(pwd)/assets/resume-print.html"
```

Expected: command exits with no error, and `assets/resume.pdf` exists. Verify:

```bash
ls -la assets/resume.pdf
```

Expected: a file listing showing non-zero size (typically 40-90KB).

If Chrome isn't at that path (check with `mdfind "kMDItemCFBundleIdentifier == 'com.google.Chrome'"` or `ls /Applications | grep -i chrome`), substitute the correct path before running.

- [ ] **Step 3: Verify the PDF content**

Open `assets/resume.pdf` (e.g., `open "assets/resume.pdf"` on macOS) and visually confirm: single page, all four experience entries present (Agile Defense, Land to Land Holdings, Novant Health, University of North Georgia), contact info correct, no obvious text cutoff or overflow.

- [ ] **Step 4: Commit**

```bash
git add assets/resume-print.html assets/resume.pdf
git commit -m "Add synthesized resume content and generated PDF for download"
```

---

## Task 13: Responsive & Reduced-Motion Verification Pass

**Files:** None modified — verification only. Record any fixes needed as follow-up steps in this task if found.

- [ ] **Step 1: Desktop pass (1280x800)**

Using the Browser pane, resize to 1280x800 (desktop preset). Scroll the entire page top to bottom. Confirm: sidebar nav stays fixed and highlights the correct section as you scroll past Home/About/Tools/Work/Contact; no horizontal scrollbar appears at any point; no layout overlap between the sidebar and content.

- [ ] **Step 2: Tablet pass (768x1024)**

Resize to 768x1024 (tablet preset). Confirm: layout has switched to the mobile hamburger nav (per the 900px breakpoint), About/Tools grids have reflowed to fewer columns, case studies stack with non-sticky images, no text overflows its container.

- [ ] **Step 3: Mobile pass (375x812)**

Resize to 375x812 (mobile preset). Confirm: hamburger opens/closes the nav correctly and closes after clicking a link; hero content is centered and readable without zooming; tap targets (nav links, buttons, contact rows) are comfortably sized (not visually cramped or overlapping).

- [ ] **Step 4: Reduced-motion pass**

In Chrome DevTools, open the Rendering tab and set "Emulate CSS media feature prefers-reduced-motion" to `reduce`. Reload the page. Confirm: hero canvas is hidden (per Task 4's fallback) and the page is otherwise fully readable and usable without it. Turn the emulation back to "No emulation" afterward.

- [ ] **Step 5: Lighthouse performance sanity check**

In Chrome DevTools, open the Lighthouse tab, select "Performance" + "Accessibility" categories with the "Desktop" device setting, and click "Analyze page load" against `http://localhost:8080`. Confirm: Performance score is not in the red (below ~50) due to the Three.js scene — if it is, reduce `LINE_COUNT` in `js/hero-scene.js` (Task 4) further and re-run. Confirm: Accessibility score has no critical flags (e.g., missing alt text — all `<img>` tags added in this plan already include `alt`).

- [ ] **Step 6: Console/network check**

Open DevTools Console and Network tabs, hard-reload the page. Confirm: zero console errors, zero 404s (all placeholder SVGs, `resume.pdf`, and CDN scripts should resolve).

- [ ] **Step 7: Fix any issues found, then commit**

If Steps 1-6 surface any issue, fix it in the relevant file (`index.html`, `css/styles.css`, or `js/main.js`) and commit separately with a message describing the fix, e.g.:

```bash
git add -A
git commit -m "Fix responsive/reduced-motion issues found in verification pass"
```

If no issues are found, skip the commit for this task.

---

## Task 14: Final Polish

**Files:**
- Create: `assets/favicon.svg`
- Modify: `index.html`

- [ ] **Step 1: Create a simple monogram favicon**

Create `assets/favicon.svg`:

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="12" fill="#141414"/>
  <text x="32" y="42" font-family="'Space Grotesk', sans-serif" font-size="28" fill="#f5f5f5" text-anchor="middle">TQ</text>
</svg>
```

- [ ] **Step 2: Link the favicon and add social meta tags in `index.html`'s `<head>`**

Add immediately after the existing `<meta name="description" ...>` line:

```html
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
<meta property="og:title" content="Tyler Quackenbush | UX/UI Designer" />
<meta property="og:description" content="Product design, content design, and design systems work." />
<meta property="og:type" content="website" />
```

- [ ] **Step 3: Verify**

Reload the page; confirm the browser tab shows the "TQ" monogram icon and there's no console error for the favicon request. View page source (or DevTools Elements) and confirm the `og:` meta tags are present in `<head>`.

- [ ] **Step 4: Final commit**

```bash
git add assets/favicon.svg index.html
git commit -m "Add favicon and social meta tags"
```

- [ ] **Step 5: Confirm full git history**

```bash
git log --oneline
```

Expected: a clean, sequential commit history from "Scaffold portfolio site..." through "Add favicon and social meta tags," with no uncommitted changes (`git status` shows "working tree clean").

---

## Follow-ups (not in this plan, flag to Tyler)

- Real image assets (headshot, Novant Health/ACCT/Adventure Careers mockups, ACCT/Adventure Careers logos) still need to be exported from Figma and dropped into `assets/images/`, replacing the placeholder SVGs referenced by the same filenames used in Task 2 and Task 9 (`headshot-placeholder.svg`, `novant-placeholder.svg`, `acct-placeholder.svg`, `adventure-placeholder.svg`) — simplest swap is to keep the same filenames.
- Resume content in Task 12 was synthesized from 5 source resumes; Tyler should proofread `assets/resume-print.html` for accuracy before treating `assets/resume.pdf` as final.
