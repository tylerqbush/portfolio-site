# Nav, Scroll & Visual Identity Redesign (v3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fixed left sidebar, Lenis smooth-scroll, and sidebar scroll-spy with a fixed top nav and native scroll; adopt the "Cool Modern Tech" light visual identity; rebuild the hero as an oversized-type wordmark with "QUACK" picked out in the accent color; and relocate the headshot photo into the About section — per `docs/superpowers/specs/2026-07-15-nav-scroll-visual-redesign-design.md`.

**Architecture:** Same static HTML/CSS/JS site built across the v1 and v2 plans. This plan modifies `index.html`, `css/styles.css`, `js/main.js`, and `js/hero-scene.js` in place. No new files, no build step introduced. Lenis is removed from the stack entirely; GSAP + ScrollTrigger and Three.js stay.

**Tech Stack:** HTML5, CSS3 custom properties, vanilla JS, GSAP 3.12.5 + ScrollTrigger, Three.js 0.160.0, Google Fonts (now Bricolage Grotesque + Instrument Sans + JetBrains Mono, replacing Fraunces + Inter + IBM Plex Mono).

**Note on verification:** This is a static visual site with no test runner — every "Verify" step is a concrete manual check via the Browser tools, not an automated test. Do not skip these.

---

## Task 1: Design Tokens & Fonts — Cool Modern Tech Palette Swap

**Files:**
- Modify: `index.html` (Google Fonts link)
- Modify: `css/styles.css` (`:root` block, plus two remaining raw-rgba usages)

This task changes only custom-property values, token names, and the two leftover hardcoded `rgba(42, 36, 32, ...)` usages that live outside `:root`. It will leave every section still laid out with the old sidebar-offset margins and old nav/hero markup until Tasks 2–5 — that's expected. The goal here is purely: after this task, every element that already reads its color from a CSS variable shows the new palette.

- [ ] **Step 1: Update the Google Fonts link in `index.html`**

Find (currently around line 22):
```html
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Replace with:
```html
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Replace the `:root` block in `css/styles.css`**

Find the current `:root` block (lines 1–41):
```css
:root {
  --color-bg: #f4efe6;
  --color-ink: #2a2420;
  --color-ink-dim: #6b5d47; /* passes AA on --color-bg/--color-card with room to spare, but only 4.71:1 on --color-kraft (Work section case-study body text) — a thin margin above the 4.5:1 floor, so don't darken --color-kraft or lighten this without re-checking */
  --color-card: #ffffff;
  --color-accent: #8f3a1a; /* darkened again from #a8451f for WCAG AA contrast when used as text on --color-kraft backgrounds (upcoming Work section restyle); still passes as badge background text/bg and as text on white/cream */
  --color-border: rgba(42, 36, 32, 0.12);
  --color-ink-ghost: rgba(42, 36, 32, 0.06);
  --color-kraft: #e8dcc4;

  --font-heading: 'Fraunces', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  --nav-width: 220px;
  --section-padding-x: clamp(24px, 6vw, 96px);
  --section-padding-y: clamp(64px, 10vh, 120px);

  --transition-fast: 0.2s ease;
  --transition-medium: 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* Radius scale */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-pill: 999px;

  /* Shadow scale (all on --color-ink at varying opacity/spread) */
  --shadow-sm: 0 4px 12px rgba(42, 36, 32, 0.1);
  --shadow-md: 0 8px 20px rgba(42, 36, 32, 0.1);
  --shadow-lg: 0 12px 32px rgba(42, 36, 32, 0.12);
  --shadow-lg-strong: 0 12px 32px rgba(42, 36, 32, 0.18);

  /* Mono "eyebrow" label text (case-study eyebrows, tool group headings,
     process steps, slider labels, hero badge) */
  --label-size: 0.8rem;
  --label-tracking: 0.06em;
}
```

Replace with:
```css
:root {
  --color-bg: #f5f6f8;
  --color-ink: #12151b;
  --color-ink-dim: #5b6470; /* ~5.5:1 on --color-bg/--color-card, ~4.9:1 on --color-muted-bg — thin-ish margin on muted-bg, don't darken it or lighten this without re-checking */
  --color-card: #ffffff;
  --color-accent: #0b63c4; /* ~5.4:1 on --color-bg, ~5.8:1 on --color-card as text — for use as text/fill on light surfaces only */
  --color-accent-on-dark: #4a9eff; /* lighter tint for the accent on --color-ink surfaces (e.g. active top-nav link on the dark bar) — flat --color-accent only hits ~3.1:1 there, below the 4.5:1 AA floor for normal text */
  --color-border: rgba(18, 21, 27, 0.12);
  --color-ink-ghost: rgba(18, 21, 27, 0.05);
  --color-muted-bg: #e9ebef;

  --font-heading: 'Bricolage Grotesque', sans-serif;
  --font-body: 'Instrument Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --nav-height: 72px;
  --section-padding-x: clamp(24px, 6vw, 96px);
  --section-padding-y: clamp(64px, 10vh, 120px);

  --transition-fast: 0.2s ease;
  --transition-medium: 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* Radius scale */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-pill: 999px;

  /* Shadow scale (all on --color-ink at varying opacity/spread) */
  --shadow-sm: 0 4px 12px rgba(18, 21, 27, 0.1);
  --shadow-md: 0 8px 20px rgba(18, 21, 27, 0.1);
  --shadow-lg: 0 12px 32px rgba(18, 21, 27, 0.12);
  --shadow-lg-strong: 0 12px 32px rgba(18, 21, 27, 0.18);

  /* Mono "eyebrow" label text (case-study eyebrows, tool group headings,
     process steps, hero label) */
  --label-size: 0.8rem;
  --label-tracking: 0.06em;
}
```

Note: `--nav-width` (220px, sidebar) is replaced by `--nav-height` (72px, top bar) — every usage of `--nav-width` elsewhere in the file gets removed in Task 5, not renamed, since the layout pattern it drove (`margin-left`) no longer applies. `--color-kraft` is replaced by `--color-muted-bg` — its two usages get updated in Task 5.

- [ ] **Step 3: Replace the two remaining hardcoded rgba usages**

These live in the `.contact` background-image (outside `:root`, so Step 2's replacement didn't touch them):

```bash
cd "/Users/tyler/Documents/Portfolio Site"
sed -i '' 's/rgba(42,36,32,/rgba(18,21,27,/g' css/styles.css
```

- [ ] **Step 4: Verify no old token names or colors remain**

```bash
grep -n "color-kraft\|nav-width\|42, *36, *32\|42,36,32\|#f4efe6\|#2a2420\|#6b5d47\|#8f3a1a" css/styles.css index.html
```

Expected: no output. (It's fine and expected that `css/styles.css` still *references* `var(--color-kraft)` and `var(--nav-width)` in a couple of places — those are separate token *usages*, not the definitions this grep is checking for token *names* colliding with old hex values. If the grep flags `--color-kraft` or `--nav-width` usages, that's expected until Task 5; this step is only confirming the old hex values and the literal `42, 36, 32` / `42,36,32` rgba triples are gone.)

- [ ] **Step 5: Visual verification**

Serve the site and load it in the Browser pane. Expected: background is now a cool off-white/gray instead of warm cream, text is near-black instead of warm brown-black, and any element using `var(--color-accent)` now shows blue instead of rust. **Exception (expected, not a bug):** layout is still broken — sidebar still overlaps content, hero still shows the old photo/badge treatment, Contact section may show a transparent gap where `--color-kraft` was used (until Task 5). Confirm no console errors and that the new fonts load with 200s in the Network tab.

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css
git commit -m "Swap to Cool Modern Tech palette and new font stack"
```

---

## Task 2: Top Nav & Scroll Behavior

**Files:**
- Modify: `index.html` (replace hamburger + sidenav markup; remove Lenis script tag)
- Modify: `css/styles.css` (replace `.sidenav`/`.hamburger` CSS with `.topnav` CSS, including the mobile media query rules)
- Modify: `js/main.js` (remove Lenis, rewire scroll-spy and anchor clicks to the new nav)

- [ ] **Step 1: Replace the nav markup in `index.html`**

Find (lines 29–43):
```html
    <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <nav class="sidenav" id="sidenav">
      <ul class="sidenav__list">
        <li><a href="#home" class="sidenav__link" data-section="home">Home</a></li>
        <li><a href="#about" class="sidenav__link" data-section="about">About</a></li>
        <li><a href="#ai" class="sidenav__link" data-section="ai">How I Use AI</a></li>
        <li><a href="#tools" class="sidenav__link" data-section="tools">Tools</a></li>
        <li><a href="#work" class="sidenav__link" data-section="work">Work</a></li>
        <li><a href="#contact" class="sidenav__link" data-section="contact">Contact</a></li>
        <li><a href="assets/resume.pdf" target="_blank" rel="noopener" class="sidenav__link" id="resume-link">Resume</a></li>
      </ul>
    </nav>
```

Replace with:
```html
    <nav class="topnav" id="topnav">
      <a href="#home" class="topnav__mark">TQ</a>
      <ul class="topnav__list" id="topnav-list">
        <li><a href="#home" class="topnav__link" data-section="home">Home</a></li>
        <li><a href="#about" class="topnav__link" data-section="about">About</a></li>
        <li><a href="#ai" class="topnav__link" data-section="ai">How I Use AI</a></li>
        <li><a href="#tools" class="topnav__link" data-section="tools">Tools</a></li>
        <li><a href="#work" class="topnav__link" data-section="work">Work</a></li>
        <li><a href="#contact" class="topnav__link" data-section="contact">Contact</a></li>
        <li><a href="assets/resume.pdf" target="_blank" rel="noopener" class="topnav__link" id="resume-link">Resume</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="topnav-list">
        <span></span><span></span><span></span>
      </button>
    </nav>
```

- [ ] **Step 2: Remove the Lenis script tag**

Find (near the end of `index.html`):
```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
  <script type="module" src="js/hero-scene.js"></script>
  <script src="js/main.js"></script>
```

Replace with:
```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script type="module" src="js/hero-scene.js"></script>
  <script src="js/main.js"></script>
```

- [ ] **Step 3: Replace the sidenav/hamburger CSS with topnav CSS**

Find (lines 103–158):
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
  color: var(--color-ink-dim);
  transition: color var(--transition-fast);
}

.sidenav__link.active,
.sidenav__link:hover {
  color: var(--color-ink);
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
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-ink);
}
```

Replace with:
```css
/* Top nav */
.topnav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: var(--color-ink);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 4vw, 48px);
  z-index: 50;
}

.topnav__mark {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--color-bg);
}

.topnav__list {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 32px;
}

.topnav__link {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-bg);
  opacity: 0.75;
  transition: opacity var(--transition-fast), color var(--transition-fast);
}

.topnav__link.active,
.topnav__link:hover {
  opacity: 1;
  color: var(--color-accent-on-dark);
}

.hamburger {
  display: none;
  z-index: 60;
  width: 32px;
  height: 32px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-bg);
}
```

- [ ] **Step 4: Replace the sidenav-related mobile rules**

Find (lines 274–288, the first part of the `@media (max-width: 900px)` block — leave the `.hero`/`.hero__content`/etc. rules that follow untouched, those get handled in Task 3):
```css
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
```

Replace with:
```css
@media (max-width: 900px) {
  .topnav__list {
    position: fixed;
    top: var(--nav-height);
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    background: var(--color-ink);
    padding: 8px clamp(20px, 4vw, 48px) 24px;
    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-fast), transform var(--transition-fast);
  }

  .topnav__list.is-open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .topnav__list li {
    width: 100%;
    padding: 12px 0;
    border-top: 1px solid rgba(245, 246, 248, 0.1);
  }

  .topnav__list li:first-child {
    border-top: none;
  }

  .hamburger {
    display: flex;
  }
```

- [ ] **Step 5: Rewire `js/main.js` — remove Lenis, point scroll-spy and anchor clicks at the new nav**

Find (lines 1–95, from the top of the file through the `checkBottomOfPage();` call):
```js
// ---- Smooth scroll (Lenis) ----
// Fall back to a no-op stand-in if the Lenis CDN script failed to load, so the
// rest of this file (nav, scroll-spy, slider, etc.) still runs. Native scroll
// still works without Lenis — you just lose the smoothing/easing.
const lenis = window.Lenis
  ? new Lenis({ duration: 1.1, smoothWheel: true })
  : { scrollTo: (target) => target?.scrollIntoView({ behavior: 'smooth' }), raf: () => {}, on: () => {} };

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
const lastSectionId = sections.length ? sections[sections.length - 1].id : null;

function checkBottomOfPage() {
  if (!lastSectionId) return false;
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  if (atBottom) setActiveLink(lastSectionId);
  return atBottom;
}

// Note: the equivalent "section too short for the rootMargin band" bug on the
// leading edge (Home) is currently prevented only because .hero has
// min-height: 100vh in css/styles.css — if that changes, this same class of
// bug could resurface on the first section with no override to catch it.
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

// Lenis (initialized without wrapper/content) drives native window scrolling,
// so the listener below already fires for every Lenis-driven scroll change.
window.addEventListener('scroll', checkBottomOfPage, { passive: true });
checkBottomOfPage();
```

Replace with:
```js
// ---- Scroll & motion setup ----
// Lenis (forced smooth-scroll) has been removed — this site now uses native
// browser scroll. ScrollTrigger works fine off native scroll events on its own.
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Anchor links scroll natively ----
document.querySelectorAll('.topnav__link[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
    closeMobileNav();
  });
});

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

// ---- Scroll-spy: highlight active nav link ----
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.topnav__link[data-section]');

function setActiveLink(sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });
}

// Short final sections (e.g. Contact) can be too small to ever enter the
// IntersectionObserver's center band once the page hits max scroll, so they'd
// never get highlighted by the observer alone. Treat "scrolled to the bottom"
// as an override that always wins, regardless of what the observer reports.
const lastSectionId = sections.length ? sections[sections.length - 1].id : null;

function checkBottomOfPage() {
  if (!lastSectionId) return false;
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  if (atBottom) setActiveLink(lastSectionId);
  return atBottom;
}

// Note: the equivalent "section too short for the rootMargin band" bug on the
// leading edge (Home) is currently prevented only because .hero has
// min-height: 100vh in css/styles.css — if that changes, this same class of
// bug could resurface on the first section with no override to catch it.
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
checkBottomOfPage();
```

- [ ] **Step 6: Verify**

Serve the site and load it in the Browser pane.

- Desktop: a solid dark bar spans the full width at the top, "TQ" on the left, links on the right. The link matching the section in view should highlight in light blue (`--color-accent-on-dark`). Click each link and confirm the page scrolls to the right section.
- Resize to mobile width (< 900px): the link list should disappear, replaced by a hamburger icon. Click it — the link list should drop down below the bar. Click a link — it should navigate and the dropdown should close.
- Open the Network tab and confirm no request to `unpkg.com/lenis` is made.
- Open the browser console and confirm `window.Lenis` is `undefined` and there are no errors.
- Note: the page layout above/below the bar will still look broken (old hero/photo, sidebar-width gaps) — that's expected until Tasks 3–5.

- [ ] **Step 7: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "Replace sidebar nav and Lenis smooth-scroll with a fixed top nav and native scroll"
```

---

## Task 3: Hero Redesign

**Files:**
- Modify: `index.html` (hero markup)
- Modify: `css/styles.css` (hero CSS, mobile hero rules)
- Modify: `js/main.js` (hero entrance animation target selectors)
- Modify: `js/hero-scene.js` (flow-field line color)

- [ ] **Step 1: Replace the hero markup**

Find (lines 45–64):
```html
    <section id="home" class="hero">
      <div class="hero__ghost-name" aria-hidden="true">TYLER QUACKENBUSH</div>
      <div class="hero__content">
        <h1 class="hero__label"><span class="visually-hidden">Tyler Quackenbush &mdash; </span>UX UI DESIGNER</h1>
        <div class="hero__photo">
          <img src="assets/images/Headshot.jpeg" alt="Tyler Quackenbush" id="headshot-img" width="640" height="640" />
        </div>
        <p class="hero__bio">
          I can walk into a mess (a spreadsheet with fourteen tabs, a stakeholder meeting that raised more
          questions than it answered) and find the one decision that makes everything else fall into place.
          Eight years of dashboards and decision tools, for a hospital system, federal defense and law
          enforcement agencies, and a couple of teams who just needed someone to stop the redesign meetings
          from restarting every sprint. Give me the mess. I'll hand you back something that makes sense.
        </p>
        <div class="hero__ctas">
          <a href="#work" class="btn btn--primary">My Work</a>
          <a href="assets/resume.pdf" target="_blank" rel="noopener" class="btn btn--link">Download Resume</a>
        </div>
      </div>
    </section>
```

Replace with:
```html
    <section id="home" class="hero">
      <div class="hero__content">
        <h1 class="hero__name">
          <span class="hero__name-line">TYLER</span>
          <span class="hero__name-line"><span class="hero__name-accent">QUACK</span>ENBUSH</span>
        </h1>
        <p class="hero__label">UX / UI Designer</p>
        <p class="hero__bio">
          I can walk into a mess (a spreadsheet with fourteen tabs, a stakeholder meeting that raised more
          questions than it answered) and find the one decision that makes everything else fall into place.
          Eight years of dashboards and decision tools, for a hospital system, federal defense and law
          enforcement agencies, and a couple of teams who just needed someone to stop the redesign meetings
          from restarting every sprint. Give me the mess. I'll hand you back something that makes sense.
        </p>
        <div class="hero__ctas">
          <a href="#work" class="btn btn--primary">My Work</a>
          <a href="assets/resume.pdf" target="_blank" rel="noopener" class="btn btn--link">Download Resume</a>
        </div>
      </div>
    </section>
```

Note: the `<h1>` now visually contains Tyler's name directly ("TYLER" / "QUACKENBUSH"), so the old `.visually-hidden` name-prefix workaround is no longer needed — this is a small accessibility improvement over the previous version, where the page's only `<h1>` never visually showed the name at all.

The headshot `<img>` is intentionally not carried over here — it moves to the About section in Task 4.

- [ ] **Step 2: Replace the hero CSS**

Find (lines 160–249, from `/* Hero */` through the end of `.hero__ctas`):
```css
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
  font-size: clamp(1.4rem, 9vw, 7rem);
  color: var(--color-ink-ghost);
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
  display: inline-block;
  font-family: var(--font-mono);
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: var(--label-tracking);
  text-transform: uppercase;
  color: var(--color-bg);
  background: var(--color-accent);
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  transform: rotate(-2deg);
  margin-bottom: 24px;
}

.hero__photo {
  position: relative;
  width: min(320px, 60vw);
  margin-left: auto;
  margin-bottom: 24px;
  padding: 12px;
  background: var(--color-card);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg-strong);
  transform: rotate(-3deg);
}

.hero__photo img {
  display: block;
  width: 100%;
  border-radius: var(--radius-xs);
}

.hero__bio {
  color: var(--color-ink);
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
```

Replace with:
```css
/* Hero */
.hero {
  position: relative;
  min-height: 100vh;
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

.hero__content {
  position: relative;
  z-index: 2;
  max-width: 900px;
}

.hero__name {
  font-family: var(--font-heading);
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: -0.02em;
  color: var(--color-ink);
}

.hero__name-line {
  display: block;
  font-size: clamp(3rem, 11vw, 8rem);
}

.hero__name-accent {
  color: var(--color-accent);
}

.hero__label {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--label-size);
  letter-spacing: var(--label-tracking);
  text-transform: uppercase;
  color: var(--color-ink-dim);
  margin-top: 20px;
  margin-bottom: 24px;
}

.hero__bio {
  color: var(--color-ink-dim);
  font-size: 1.05rem;
  max-width: 560px;
  margin-bottom: 32px;
}

.hero__ctas {
  display: flex;
  gap: 24px;
  align-items: center;
}
```

- [ ] **Step 3: Remove the now-obsolete mobile hero rules**

Find (the hero-related rules inside the `@media (max-width: 900px)` block — this immediately follows the `.hamburger { display: flex; }` rule from Task 2, Step 4):
```css
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

Replace with just the closing brace:
```css
}
```

(These rules existed to re-center the old right-aligned hero and clear the old floating hamburger button on mobile. The new hero is left-aligned by default at all widths via `clamp()`, and the nav offset is handled globally by `main`'s `padding-top` in Task 5 — so none of this is needed anymore.)

- [ ] **Step 4: Update the hero entrance animation in `js/main.js`**

Find:
```js
// ---- Hero entrance animation ----
// Note: clearProps: 'transform' on .hero__label/.hero__photo leaves a tiny
// decomposed-rotation residual (e.g. rotate(-2.00003deg)) in the inline style
// rather than a truly empty string, since both have a CSS-authored
// transform: rotate(...) that gsap.set() bakes in before the tween starts.
// Harmless today (visually identical, no rule currently touches their
// transform), but an inline style still beats any future :hover/media rule
// on these two elements — revisit if a transform-based effect is ever added.
if (window.gsap && !prefersReducedMotion) {
  gsap.set(['.hero__label', '.hero__ghost-name', '.hero__photo', '.hero__bio', '.hero__ctas .btn'], {
    opacity: 0,
    y: 24,
  });

  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .to('.hero__label', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'transform' })
    .to('.hero__ghost-name', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.5')
    .to('.hero__photo', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'transform' }, '-=0.5')
    .to('.hero__bio', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .to('.hero__ctas .btn', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.15, clearProps: 'transform' }, '-=0.3');
}
```

Replace with:
```js
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
```

The `clearProps: 'transform'` workaround is dropped because none of the new hero elements have a CSS-authored `transform` for `gsap.set()` to collide with (the old `.hero__label`/`.hero__photo` badge/photo rotation is gone).

- [ ] **Step 5: Re-theme the Three.js flow-field line color**

In `js/hero-scene.js`, find:
```js
    const material = new THREE.LineBasicMaterial({
      color: 0x2a2420,
      transparent: true,
      opacity: 0.06 + (index % 5) * 0.01,
    });
```

Replace with:
```js
    const material = new THREE.LineBasicMaterial({
      color: 0x12151b,
      transparent: true,
      opacity: 0.06 + (index % 5) * 0.01,
    });
```

- [ ] **Step 6: Verify**

Serve the site and load it in the Browser pane.

- Desktop: "TYLER" and "QUACKENBUSH" render at large scale, left-aligned, with "QUACK" in blue and the rest in near-black. The flow-field line animation is visible behind the text in the new cool ink color (not the old warm brown). No leftover ghost-name watermark text.
- Confirm the entrance animation plays once on load (name lines, then label, then bio, then buttons) — or, with OS-level reduced-motion turned on, confirm everything appears immediately with no animation.
- Resize to mobile width: hero text scales down via `clamp()` and stays left-aligned; nothing overlaps the nav bar.
- Check the console for errors (a common one to watch for: a typo'd selector in the GSAP timeline silently animating nothing).

- [ ] **Step 7: Commit**

```bash
git add index.html css/styles.css js/main.js js/hero-scene.js
git commit -m "Rebuild hero as oversized-type wordmark with QUACK accent, re-theme flow-field"
```

---

## Task 4: About Section — Relocate Headshot Photo

**Files:**
- Modify: `index.html` (About section markup)
- Modify: `css/styles.css` (new `.about__intro`/`.about__photo` rules, mobile stacking)

- [ ] **Step 1: Add the photo to the About section markup**

Find (lines 66–67):
```html
    <section id="about" class="about">
      <h2 class="section-heading">About Me</h2>
```

Replace with:
```html
    <section id="about" class="about">
      <div class="about__intro">
        <h2 class="section-heading">About Me</h2>
        <div class="about__photo">
          <img src="assets/images/Headshot.jpeg" alt="Tyler Quackenbush" id="headshot-img" width="640" height="640" />
        </div>
      </div>
```

Note: `<div class="about__card">` and everything after it stays exactly as-is and is not part of this replacement — only the two lines shown in "Find" are replaced, and the replacement block above already closes `.about__intro` before that point. Confirm the result reads:

```html
    <section id="about" class="about">
      <div class="about__intro">
        <h2 class="section-heading">About Me</h2>
        <div class="about__photo">
          <img src="assets/images/Headshot.jpeg" alt="Tyler Quackenbush" id="headshot-img" width="640" height="640" />
        </div>
      </div>
      <div class="about__card">
```

- [ ] **Step 2: Add the About photo CSS**

Find (lines 314–319, the start of the About section's CSS):
```css
/* About */
.section-heading {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--color-ink-dim);
  margin-bottom: 48px;
}
```

Replace with:
```css
/* About */
.section-heading {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--color-ink-dim);
  margin-bottom: 48px;
}

.about__intro {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
}

.about__intro .section-heading {
  margin-bottom: 0;
}

.about__photo {
  flex-shrink: 0;
  width: 140px;
  padding: 8px;
  background: var(--color-card);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg-strong);
  transform: rotate(3deg);
  margin-bottom: 48px;
}

.about__photo img {
  display: block;
  width: 100%;
  border-radius: var(--radius-xs);
}
```

- [ ] **Step 3: Stack the photo on mobile**

Find (lines 410–417, inside the existing `@media (max-width: 900px)` block for About/Tools/etc.):
```css
@media (max-width: 900px) {
  .about,
  .tools,
  .ai,
  .work,
  .contact {
    margin-left: 0;
  }

  .about__card {
    grid-template-columns: 1fr;
  }
}
```

Replace with:
```css
@media (max-width: 900px) {
  .about__intro {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .about__card {
    grid-template-columns: 1fr;
  }
}
```

(The `margin-left: 0;` override is removed here because Task 5 removes `margin-left` from these sections on desktop too — there's nothing left to override on mobile.)

- [ ] **Step 4: Verify**

Serve the site and load it in the Browser pane. Scroll to the About section — the headshot should now appear as a small rotated polaroid-style photo next to the "About Me" heading. Resize to mobile width: the photo should stack below the heading instead of sitting beside it. Confirm the hero section no longer shows a photo at all.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css
git commit -m "Relocate headshot photo from hero to About section"
```

---

## Task 5: Sitewide Layout Cleanup

**Files:**
- Modify: `css/styles.css` (remove the `--nav-width` margin-left pattern, add the `--nav-height` offset, finish the `--color-kraft` → `--color-muted-bg` rename)

- [ ] **Step 1: Add the global nav-height offset**

Find:
```css
body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-body);
  line-height: 1.5;
  overflow-x: hidden;
}
```

Replace with:
```css
body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-body);
  line-height: 1.5;
  overflow-x: hidden;
}

main {
  padding-top: var(--nav-height);
}
```

- [ ] **Step 2: Remove the `--nav-width` margin-left from the shared section selector**

Find (lines 321–328):
```css
.about,
.tools,
.ai,
.work,
.contact {
  margin-left: var(--nav-width);
  padding: var(--section-padding-y) var(--section-padding-x);
}
```

Replace with:
```css
.about,
.tools,
.ai,
.work,
.contact {
  padding: var(--section-padding-y) var(--section-padding-x);
}
```

- [ ] **Step 3: Rename the remaining `--color-kraft` usages**

```bash
cd "/Users/tyler/Documents/Portfolio Site"
sed -i '' 's/var(--color-kraft)/var(--color-muted-bg)/g' css/styles.css
```

- [ ] **Step 4: Verify no old tokens remain**

```bash
grep -n "color-kraft\|nav-width" css/styles.css
```

Expected: no output.

- [ ] **Step 5: Verify**

Serve the site and load it in the Browser pane. Every section (Home, About, How I Use AI, Tools, Work, Contact) should now span the full width below the fixed top bar, with no left gap and no overlap with the nav. Scroll the whole page top to bottom and confirm nothing is clipped or overlapping. The Work section's case-study body cards and the Contact card background should show the new cool muted-gray (`--color-muted-bg`) instead of the old warm kraft tone.

- [ ] **Step 6: Commit**

```bash
git add css/styles.css
git commit -m "Remove sidebar-width layout pattern, add top-nav offset, finish palette token cleanup"
```

---

## Task 6: Full-Site Verification Pass

**Files:** none (verification only, plus the resulting commit if fixes are needed)

- [ ] **Step 1: Desktop pass**

Load the site at a desktop viewport width. Walk through Home → About → How I Use AI → Tools → Work → Contact → Resume via the top nav links. Confirm:
- The nav bar stays fixed and solid at all scroll positions
- The active link highlights in `--color-accent-on-dark` as each section comes into view, including the Contact section at the very bottom of the page
- The hero name renders large with "QUACK" in blue
- The About section shows the relocated photo
- Existing scroll-triggered animations still fire: the About cards scatter-to-grid, the case-study images wipe in, the Adventure Careers stat counter counts up
- The Introvert/Extrovert slider in About still drags and responds to keyboard arrows

- [ ] **Step 2: Mobile pass**

Resize to a mobile viewport (< 900px). Confirm:
- The nav collapses to "TQ" + hamburger
- Tapping the hamburger opens a dropdown list of links below the bar; tapping a link navigates and closes the dropdown
- The hero, About intro (photo below heading), and all other sections stack cleanly with no horizontal scroll

- [ ] **Step 3: Reduced motion pass**

Enable OS-level "reduce motion" and reload. Confirm:
- The Three.js canvas is hidden (existing `prefersReducedMotion` check in `js/hero-scene.js` still applies)
- Hero content appears immediately with no entrance animation
- Scroll-triggered reveals show final state immediately rather than animating in
- The stat counter shows its final value immediately (per the existing reduced-motion handling)

- [ ] **Step 4: Console and network check**

Confirm zero console errors across all of the above, and confirm in the Network tab that no request is made to `unpkg.com/lenis` and that Bricolage Grotesque / Instrument Sans / JetBrains Mono all return 200.

- [ ] **Step 5: Fix anything found, then final commit**

If any of the above steps surface an issue, fix it and commit the fix separately with a message describing what broke and why. Once everything passes cleanly, this task needs no additional commit beyond any fix commits already made.

---

## Note for later (not part of this plan)

`assets/images/og-image.jpg` (the social-preview card) was designed in the old warm "Structured Chaos" palette and will look inconsistent with the site once this redesign ships. Regenerating it in the new Cool Modern Tech palette is a reasonable follow-up but wasn't part of the approved spec for this plan, so it's called out here rather than added as a task.
