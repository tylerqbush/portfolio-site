# Multi-Page Site Architecture (Adham-Style) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the single scrolling `index.html` into a multi-page site — Home, About, How I Use AI, Tools, Work (listing), Contact, plus one dedicated page per case study — per `docs/superpowers/specs/2026-07-16-multi-page-redesign-design.md`.

**Architecture:** Same static HTML/CSS/vanilla-JS stack, still no build step. 10 HTML files total, replacing the current single-page `index.html`. Shared `<head>`/nav/scripts are hand-duplicated across files — no templating layer. `js/main.js` loses its scroll-spy and anchor-smooth-scroll logic (both become dead code once nav links point at real pages instead of `#anchors`) and gains a small amount of new logic for the case-study gallery arrows.

**Tech Stack:** Unchanged — HTML5, CSS3 custom properties, vanilla JS, GSAP 3.12.5 + ScrollTrigger, Google Fonts (Bricolage Grotesque / Instrument Sans / JetBrains Mono).

**Note on verification:** Static site, no test runner — every "Verify" step is a manual browser check via the Browser tools, not an automated test.

**A note on relative paths:** Six pages live at the project root (`index.html`, `about.html`, `ai.html`, `tools.html`, `work.html`, `contact.html`) and reference `css/styles.css`, `assets/...`, `js/main.js` directly. Four pages live one level deeper, in `work/` (`work/novant-health.html`, `work/acct-international.html`, `work/adventure-careers.html`, `work/discovery-practice.html`) — every one of those references needs a `../` prefix instead (`../css/styles.css`, `../assets/...`, `../js/main.js`), and their nav links need `../` prefixes too (`../index.html`, `../about.html`, etc.), except links to sibling case-study pages, which stay relative to the `work/` folder (e.g. `novant-health.html`, no prefix needed from within `work/`).

---

## Task 1: Remove Scroll-Spy and Anchor-Scroll JS, Drop the Now-Dead CSS Rule

**Files:**
- Modify: `js/main.js`
- Modify: `css/styles.css`

Once every nav link points at a real page instead of an in-page `#anchor`, the scroll-spy (which highlights the nav link matching whichever section is currently scrolled into view) and the anchor-click smooth-scroll handler have nothing left to do — no page will have more than one top-level content section, and no nav link will start with `#`. Removing both up front, before rebuilding any pages, avoids carrying dead code through the rest of this plan.

- [ ] **Step 1: Remove the anchor-click handler and scroll-spy from `js/main.js`**

Find (the entire block from the top of the file through `checkBottomOfPage();`, lines 1–83):
```js
// ---- Scroll & motion setup ----
// Lenis (forced smooth-scroll) has been removed — this site now uses native
// browser scroll. ScrollTrigger works fine off native scroll events on its own.
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Anchor links scroll natively ----
document.querySelectorAll('.topnav__link[href^="#"], .topnav__mark[href^="#"]').forEach((link) => {
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

Replace with:
```js
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
```

Note: `closeMobileNav` is no longer called from anywhere else in this file (it used to be called after an anchor click) — that's fine, it's still exported implicitly as a top-level function declaration in case a later task needs it, but nothing currently calls it besides the toggle logic above. Clicking a real nav link now just navigates to a new page, which resets all JS state for free.

- [ ] **Step 2: Remove the now-dead `scroll-margin-top` rule from `css/styles.css`**

Find:
```css
main section[id] {
  scroll-margin-top: var(--nav-height);
}
```

Delete this rule entirely (no replacement — it existed only to stop `scrollIntoView()` from landing a section under the fixed nav bar, and nothing calls `scrollIntoView()` at an in-page anchor anymore).

- [ ] **Step 3: Verify**

```bash
cd "/Users/tyler/Documents/Portfolio Site"
grep -n "setActiveLink\|spyObserver\|checkBottomOfPage\|data-section\|scroll-margin-top" js/main.js css/styles.css
```

Expected: no output. The site will not render correctly yet (index.html still has old anchor-based nav markup referencing `data-section`, and other sections are still inline) — that's expected, later tasks rebuild every page. Don't try to load the site in a browser yet.

- [ ] **Step 4: Commit**

```bash
git add js/main.js css/styles.css
git commit -m "Remove scroll-spy and anchor-scroll JS ahead of multi-page split"
```

---

## Task 2: Add Shared CSS Components for the New Pages

**Files:**
- Modify: `css/styles.css`
- Modify: `js/main.js`

This task adds every new CSS component the later page-building tasks need (work card grid, framed case-study hero, gallery strip, two-column tools layout) and the small bit of new JS the gallery arrows need — all before any page is rebuilt, so later tasks are pure markup work referencing components that already exist and are already correct.

- [ ] **Step 1: Add the work card grid (used by both the Home teaser and the full Work listing)**

Find the end of the Contact section's CSS (the last rule in the file):
```css
.contact__icon {
  font-size: 1.4rem;
}
```

Add immediately after it:
```css

/* Work grid (Home page teaser + full Work listing page) */
.work-teaser {
  padding: var(--section-padding-y) var(--section-padding-x);
}

.work-teaser__label {
  margin-bottom: 24px;
}

.work-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.work-card {
  display: block;
  background: var(--color-card);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-fast);
}

.work-card:hover {
  transform: translateY(-4px);
}

.work-card__media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.work-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.work-card__title {
  font-size: 1.1rem;
  padding: 16px 16px 4px;
}

.work-card__category {
  padding: 0 16px 16px;
  color: var(--color-ink-dim);
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .work-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .work-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Add the case-study hero (framed browser-window) component**

Add immediately after the block from Step 1:
```css

/* Case study page: hero region */
.case-hero {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 48px;
  align-items: start;
  padding: var(--section-padding-y) var(--section-padding-x) 64px;
}

.case-hero__title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  margin-bottom: 16px;
}

.case-hero__meta {
  display: flex;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: var(--label-size);
  letter-spacing: var(--label-tracking);
  text-transform: uppercase;
  color: var(--color-ink-dim);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 12px 0;
  margin-bottom: 20px;
}

.case-hero__desc {
  color: var(--color-ink-dim);
  font-size: 1.05rem;
}

.case-hero__frame {
  background: var(--color-muted-bg);
  border-radius: var(--radius-lg);
  padding: 16px 16px 0;
  box-shadow: var(--shadow-lg);
}

.case-hero__frame-dots {
  display: flex;
  gap: 6px;
  padding-bottom: 12px;
}

.case-hero__frame-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-border);
  display: block;
}

.case-hero__frame img {
  width: 100%;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

@media (max-width: 900px) {
  .case-hero {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Add the gallery strip component**

Add immediately after the block from Step 2:
```css

/* Case study page: gallery strip */
.case-gallery {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 var(--section-padding-x) 64px;
}

.case-gallery__arrow {
  font-size: 1.5rem;
  color: var(--color-ink-dim);
  flex-shrink: 0;
  transition: color var(--transition-fast);
}

.case-gallery__arrow:hover {
  color: var(--color-ink);
}

.case-gallery__track {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.case-gallery__track::-webkit-scrollbar {
  display: none;
}

.case-gallery__frame {
  flex: 0 0 calc(33.333% - 14px);
  scroll-snap-align: start;
  background: var(--color-card);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.case-gallery__frame img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

@media (max-width: 900px) {
  .case-gallery__frame {
    flex: 0 0 calc(70% - 10px);
  }
}
```

- [ ] **Step 4: Add the case-body wrapper (holds description/highlights/process below the hero and gallery)**

Add immediately after the block from Step 3:
```css

/* Case study page: body content below hero/gallery */
.case-body {
  padding: 0 var(--section-padding-x) var(--section-padding-y);
  max-width: 800px;
}

.case-body__desc {
  color: var(--color-ink-dim);
  margin-bottom: 16px;
  font-size: 1.05rem;
}
```

The existing `.case-study__highlights`, `.highlight`, `.case-study__process`, `.case-study__exhibits`, `.exhibit`, and `.case-study__reflection` rules (already in the file, unchanged by this task) get reused as-is inside `.case-body` in later tasks — no new CSS needed for those.

- [ ] **Step 5: Replace the Tools card grid with the two-column layout**

Find:
```css
/* Tools */
.tools__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  align-items: start;
}

.tools__intro {
  color: var(--color-ink-dim);
  max-width: 520px;
  margin-bottom: 32px;
}

.tools__group {
  background: var(--color-card);
  border-left: 3px solid var(--color-accent);
  border-radius: var(--radius-sm) var(--radius-xl) var(--radius-xl) var(--radius-sm);
  padding: 28px;
}

.tools__group h3 {
  font-family: var(--font-mono);
  font-size: var(--label-size);
  text-transform: uppercase;
  letter-spacing: var(--label-tracking);
  color: var(--color-accent);
  margin-bottom: 16px;
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

Replace with:
```css
/* Tools */
.tools__intro {
  color: var(--color-ink-dim);
  max-width: 520px;
  margin-bottom: 48px;
}

.tools__columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
}

.tools__group-list {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.tools__group-title {
  font-size: 1.4rem;
  margin-bottom: 16px;
}

.tools__group-title--accent {
  color: var(--color-accent);
}

.tools__group-list ul {
  list-style: none;
  color: var(--color-ink-dim);
  font-size: 1.05rem;
  line-height: 2.1;
}

@media (max-width: 900px) {
  .tools__columns {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
```

- [ ] **Step 6: Add the gallery arrow JS**

In `js/main.js`, find the last block in the file (the stat counter):
```js
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
```

Add immediately after it (at the end of the file):
```js

// ---- Case study gallery arrows ----
document.querySelectorAll('.case-gallery').forEach((gallery) => {
  const track = gallery.querySelector('.case-gallery__track');
  const prev = gallery.querySelector('.case-gallery__arrow--prev');
  const next = gallery.querySelector('.case-gallery__arrow--next');
  if (!track || !prev || !next) return;

  const scrollAmount = () => track.clientWidth * 0.8;
  prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
});
```

This degrades gracefully — the gallery track is a native horizontally-scrollable/swipeable element even without JS or with reduced-motion; the arrows are a convenience on top, not the only way to see more images.

- [ ] **Step 7: Verify**

```bash
cd "/Users/tyler/Documents/Portfolio Site"
node -e "require('fs').readFileSync('css/styles.css','utf8')" && echo "CSS file readable"
grep -c "^}" css/styles.css
grep -n "case-gallery gallery arrows\|querySelectorAll('.case-gallery')" js/main.js
```

Expected: no syntax errors reading the file, the grep for the new JS block returns a match. No pages exist yet that use these components, so there's nothing to visually check in-browser until later tasks — that's expected.

- [ ] **Step 8: Commit**

```bash
git add css/styles.css js/main.js
git commit -m "Add shared CSS components for work grid, case-study pages, and two-column tools layout"
```

---

## Task 3: Rebuild Home (`index.html`)

**Files:**
- Modify: `index.html` (full rewrite)

- [ ] **Step 1: Replace the entire contents of `index.html`**

Replace the whole file with:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tyler Quackenbush | UX/UI Designer</title>
  <meta name="description" content="Tyler Quackenbush — UX/UI Designer portfolio. Product design, content design, and design systems work." />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="Tyler Quackenbush | UX/UI Designer" />
  <meta property="og:description" content="Product design, content design, and design systems work." />
  <meta property="og:type" content="website" />
  <!-- og:image/twitter:image should be absolute URLs once this site has a production domain -->
  <meta property="og:image" content="assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Tyler Quackenbush | UX/UI Designer" />
  <meta name="twitter:description" content="Product design, content design, and design systems work." />
  <meta name="twitter:image" content="assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <main id="main-content">
    <nav class="topnav" id="topnav">
      <a href="index.html" class="topnav__mark">TQ</a>
      <ul class="topnav__list" id="topnav-list">
        <li><a href="index.html" class="topnav__link active">Home</a></li>
        <li><a href="about.html" class="topnav__link">About</a></li>
        <li><a href="ai.html" class="topnav__link">How I Use AI</a></li>
        <li><a href="tools.html" class="topnav__link">Tools</a></li>
        <li><a href="work.html" class="topnav__link">Work</a></li>
        <li><a href="contact.html" class="topnav__link">Contact</a></li>
        <li><a href="assets/resume.pdf" target="_blank" rel="noopener" class="topnav__link" id="resume-link">Resume</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="topnav-list">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <section class="hero">
      <div class="hero__content">
        <h1 class="hero__name">
          <span class="hero__name-line"><span class="hero__name-accent">T</span>YLER</span>
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
          <a href="work.html" class="btn btn--primary">My Work</a>
          <a href="assets/resume.pdf" target="_blank" rel="noopener" class="btn btn--link">Download Resume</a>
        </div>
      </div>
    </section>

    <section class="work-teaser">
      <p class="label-mono work-teaser__label">Some of My Latest Work</p>
      <div class="work-grid">
        <a href="work/discovery-practice.html" class="work-card">
          <div class="work-card__media">
            <img src="assets/images/exhibit-threat-readiness.svg" alt="Concept dashboard exhibit from the UX Discovery practice" />
          </div>
          <h3 class="work-card__title">Designing the Discovery Practice</h3>
          <p class="work-card__category">UX Discovery Practice</p>
        </a>
        <a href="work/novant-health.html" class="work-card">
          <div class="work-card__media">
            <img src="assets/images/novant-mockup.jpg" alt="Novant Health maternity care services page, desktop view" />
          </div>
          <h3 class="work-card__title">System-Wide Website Redesign</h3>
          <p class="work-card__category">Website Redesign</p>
        </a>
        <a href="work/acct-international.html" class="work-card">
          <div class="work-card__media">
            <img src="assets/images/acct-placeholder.svg" alt="ACCT International brand redesign mockup" />
          </div>
          <h3 class="work-card__title">Brand Redesign</h3>
          <p class="work-card__category">Brand Redesign</p>
        </a>
      </div>
    </section>
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Serve the site and load `index.html` in the Browser pane. Confirm: nav shows "Home" highlighted active; hero renders exactly as before (wordmark, label, bio, CTAs, entrance animation); "My Work" button and Download Resume link both work; below the hero, "Some of My Latest Work" appears as a small mono label followed by 3 cards (Discovery Practice, Novant Health, ACCT International) in that order, each showing an image, title, and category; clicking a card attempts to navigate to a `work/*.html` file that doesn't exist yet (expected — 404, fixed in later tasks). No console errors. Confirm the page no longer has an About/Tools/AI/Contact section anywhere.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Rebuild Home page: hero + Work preview teaser only"
```

---

## Task 4: Create About, How I Use AI, and Contact Pages

**Files:**
- Create: `about.html`
- Create: `ai.html`
- Create: `contact.html`

Straight extraction — same content and styling as before, moved into standalone pages with the new nav pattern. No content or layout changes.

- [ ] **Step 1: Create `about.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>About | Tyler Quackenbush</title>
  <meta name="description" content="About Tyler Quackenbush — UX/UI Designer background, working style, and how he thinks about the job." />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="About | Tyler Quackenbush" />
  <meta property="og:description" content="About Tyler Quackenbush — UX/UI Designer background, working style, and how he thinks about the job." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="About | Tyler Quackenbush" />
  <meta name="twitter:description" content="About Tyler Quackenbush — UX/UI Designer background, working style, and how he thinks about the job." />
  <meta name="twitter:image" content="assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <main id="main-content">
    <nav class="topnav" id="topnav">
      <a href="index.html" class="topnav__mark">TQ</a>
      <ul class="topnav__list" id="topnav-list">
        <li><a href="index.html" class="topnav__link">Home</a></li>
        <li><a href="about.html" class="topnav__link active">About</a></li>
        <li><a href="ai.html" class="topnav__link">How I Use AI</a></li>
        <li><a href="tools.html" class="topnav__link">Tools</a></li>
        <li><a href="work.html" class="topnav__link">Work</a></li>
        <li><a href="contact.html" class="topnav__link">Contact</a></li>
        <li><a href="assets/resume.pdf" target="_blank" rel="noopener" class="topnav__link" id="resume-link">Resume</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="topnav-list">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <section class="about">
      <div class="about__intro">
        <h2 class="section-heading">About Me</h2>
        <div class="about__photo">
          <img src="assets/images/Headshot.jpeg" alt="Tyler Quackenbush" id="headshot-img" width="640" height="640" />
        </div>
      </div>
      <div class="about__card">
        <div class="about__col">
          <div class="about__item">
            <h3>Superpower</h3>
            <p>I can walk into a mess, a spreadsheet with fourteen tabs, a Slack thread that never resolved, and find the one decision that makes everything else fall into place. Usually by asking the question everyone else was too embarrassed to ask.</p>
          </div>
          <div class="about__item">
            <h3>Weakness</h3>
            <p>I'll polish a Figma file for four hours before admitting the real problem is I haven't started the part that actually matters.</p>
          </div>
          <div class="about__item">
            <h3>Favorite tools</h3>
            <p>Airtable, ChatGPT, Figma, and a bullet journal that's seen better days.</p>
          </div>
          <div class="about__item">
            <h3>Favorite part</h3>
            <p>Taking something scattered across six different tools and three people's heads and turning it into one thing that makes sense on its own.</p>
          </div>
        </div>
        <div class="about__col">
          <div class="about__item">
            <h3>Best time of day/place to be productive</h3>
            <p>Early morning, coffee, before anyone's slacked me a &ldquo;quick question.&rdquo; Otherwise: whenever I'm actually focused on the outcome instead of performing the process.</p>
          </div>
          <div class="about__item">
            <h3>I want to be good at</h3>
            <p>Trusting timing while I'm still in motion. Also, writing that actually convinces someone, not just describes the thing.</p>
          </div>
          <div class="about__item">
            <h3>I don't want to be good at</h3>
            <p>Doing something a certain way just because that's how it's always been done. I'll ask why every single time, even when it's annoying.</p>
          </div>
          <div class="about__slider">
            <div class="about__slider-labels">
              <span>Introvert</span>
              <span>Extrovert</span>
            </div>
            <div class="about__slider-track" id="ie-slider-track">
              <div class="about__slider-handle" id="ie-slider-handle" role="slider" tabindex="0" aria-label="Introvert to extrovert scale" aria-valuemin="0" aria-valuemax="100" aria-valuenow="55"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="about__statement reveal-group">
        <p>
          I'm nosy in a useful way. Hand me something confusing (an outdated wiki, a form nobody quite
          remembers the purpose of) and I'll ask enough annoying questions to figure out what it's actually
          supposed to do. I've made peace with being the person who asks the dumb question in the room,
          because usually it's the one nobody else wanted to ask, and everyone leaves the meeting actually
          agreeing on what happens next. That's the job, as far as I'm concerned.
        </p>
      </div>
    </section>
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `ai.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>How I Use AI | Tyler Quackenbush</title>
  <meta name="description" content="How Tyler Quackenbush actually uses AI in his design and development workflow — not the theory, the real process." />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="How I Use AI | Tyler Quackenbush" />
  <meta property="og:description" content="How Tyler Quackenbush actually uses AI in his design and development workflow — not the theory, the real process." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="How I Use AI | Tyler Quackenbush" />
  <meta name="twitter:description" content="How Tyler Quackenbush actually uses AI in his design and development workflow — not the theory, the real process." />
  <meta name="twitter:image" content="assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <main id="main-content">
    <nav class="topnav" id="topnav">
      <a href="index.html" class="topnav__mark">TQ</a>
      <ul class="topnav__list" id="topnav-list">
        <li><a href="index.html" class="topnav__link">Home</a></li>
        <li><a href="about.html" class="topnav__link">About</a></li>
        <li><a href="ai.html" class="topnav__link active">How I Use AI</a></li>
        <li><a href="tools.html" class="topnav__link">Tools</a></li>
        <li><a href="work.html" class="topnav__link">Work</a></li>
        <li><a href="contact.html" class="topnav__link">Contact</a></li>
        <li><a href="assets/resume.pdf" target="_blank" rel="noopener" class="topnav__link" id="resume-link">Resume</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="topnav-list">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <section class="ai">
      <h2 class="section-heading">How I Use AI, Actually</h2>
      <div class="ai__card reveal-group">
        <p>I'll say the thing everyone's dancing around: working with AI mostly feels solo, and calling it a &ldquo;team&rdquo; flattens something real. My mentor Russ Unger writes about this better than I do (<a href="https://russunger.com" target="_blank" rel="noopener noreferrer">go read him</a>). The short version I've landed on through my own work: AI gets you to a rough, working draft fast. Embarrassingly fast. Getting from that draft to something you'd put your name on is still the job, and no model does that part for you.</p>
        <p>I test this against my own work, not just theory. This site went through a written plan, then every task got implemented, then reviewed twice (once for whether it matched the spec, once for whether the code itself held up) before I'd call it done. That second pass caught real bugs: a slider that snapped where it shouldn't, images that would've gone permanently invisible if a script failed to load. Nobody catches those by trusting the first draft.</p>
        <p>That's the workflow at Agile Defense too. We build concept prototypes fast, sometimes in days, because the fastest way to find out if an idea holds up is to put it in front of someone who actually knows the problem. AI gets the prototype into someone's hands quickly. My job (and my team's) is reviewing what comes out before it goes anywhere near a client, same judgment, just applied earlier.</p>
        <p>Land to Land Holdings runs the same principle at a smaller scale: AI drafts the listing copy and social content, and I read every word before it goes out. That's the actual workflow. Nothing ships without a human, me, reading it first.</p>
      </div>
    </section>
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Create `contact.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contact | Tyler Quackenbush</title>
  <meta name="description" content="Get in touch with Tyler Quackenbush." />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="Contact | Tyler Quackenbush" />
  <meta property="og:description" content="Get in touch with Tyler Quackenbush." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Contact | Tyler Quackenbush" />
  <meta name="twitter:description" content="Get in touch with Tyler Quackenbush." />
  <meta name="twitter:image" content="assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <main id="main-content">
    <nav class="topnav" id="topnav">
      <a href="index.html" class="topnav__mark">TQ</a>
      <ul class="topnav__list" id="topnav-list">
        <li><a href="index.html" class="topnav__link">Home</a></li>
        <li><a href="about.html" class="topnav__link">About</a></li>
        <li><a href="ai.html" class="topnav__link">How I Use AI</a></li>
        <li><a href="tools.html" class="topnav__link">Tools</a></li>
        <li><a href="work.html" class="topnav__link">Work</a></li>
        <li><a href="contact.html" class="topnav__link active">Contact</a></li>
        <li><a href="assets/resume.pdf" target="_blank" rel="noopener" class="topnav__link" id="resume-link">Resume</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="topnav-list">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <section class="contact">
      <div class="contact__inner reveal-group">
        <h2 class="section-heading contact__heading">You can reach me at</h2>
        <a href="mailto:tyler.qbush@gmail.com" class="contact__row">
          <span class="contact__icon" aria-hidden="true">&#9993;&#65038;</span>
          <span>tyler.qbush@gmail.com</span>
        </a>
        <a href="tel:+16784514471" class="contact__row">
          <span class="contact__icon" aria-hidden="true">&#9742;&#65038;</span>
          <span>(678) 451-4471</span>
        </a>
      </div>
    </section>
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Verify**

Serve the site. Load each of the three new pages directly. Confirm on each: the correct nav link is highlighted active, the hamburger/mobile menu works, and the page's content and interactions match what they looked like on the old single-page site — specifically, on About: the photo renders, the 7 fact cards render, the Introvert/Extrovert slider still drags and responds to arrow keys, and the scatter-to-grid entrance animation still plays; on How I Use AI: the Russ Unger link works; on Contact: both contact links work. No console errors on any of the three pages.

- [ ] **Step 5: Commit**

```bash
git add about.html ai.html contact.html
git commit -m "Extract About, How I Use AI, and Contact into standalone pages"
```

---

## Task 5: Restyle and Rebuild the Tools Page

**Files:**
- Create: `tools.html`

- [ ] **Step 1: Create `tools.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tools | Tyler Quackenbush</title>
  <meta name="description" content="The design, research, and AI tools Tyler Quackenbush actually reaches for day to day." />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="Tools | Tyler Quackenbush" />
  <meta property="og:description" content="The design, research, and AI tools Tyler Quackenbush actually reaches for day to day." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Tools | Tyler Quackenbush" />
  <meta name="twitter:description" content="The design, research, and AI tools Tyler Quackenbush actually reaches for day to day." />
  <meta name="twitter:image" content="assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <main id="main-content">
    <nav class="topnav" id="topnav">
      <a href="index.html" class="topnav__mark">TQ</a>
      <ul class="topnav__list" id="topnav-list">
        <li><a href="index.html" class="topnav__link">Home</a></li>
        <li><a href="about.html" class="topnav__link">About</a></li>
        <li><a href="ai.html" class="topnav__link">How I Use AI</a></li>
        <li><a href="tools.html" class="topnav__link active">Tools</a></li>
        <li><a href="work.html" class="topnav__link">Work</a></li>
        <li><a href="contact.html" class="topnav__link">Contact</a></li>
        <li><a href="assets/resume.pdf" target="_blank" rel="noopener" class="topnav__link" id="resume-link">Resume</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="topnav-list">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <section class="tools">
      <h2 class="section-heading">Tools</h2>
      <p class="tools__intro">The stuff I actually reach for, sorted the way I'd sort it in real life, not the way a resume wants it sorted.</p>
      <div class="tools__columns reveal-group">
        <div class="tools__group-list">
          <div>
            <h3 class="tools__group-title">Design &amp; Prototyping</h3>
            <ul>
              <li>Figma</li>
              <li>Webflow</li>
              <li>Photoshop</li>
              <li>Illustrator</li>
            </ul>
          </div>
          <div>
            <h3 class="tools__group-title">Research &amp; Ops</h3>
            <ul>
              <li>Airtable</li>
              <li>Jira</li>
              <li>Confluence</li>
            </ul>
          </div>
        </div>
        <div class="tools__group-list">
          <div>
            <h3 class="tools__group-title tools__group-title--accent">AI-Assisted Workflow</h3>
            <ul>
              <li>Claude</li>
              <li>ChatGPT</li>
              <li>Copilot</li>
              <li>Claude Code</li>
              <li>Claude Cowork</li>
              <li>HeyGen</li>
            </ul>
          </div>
          <div>
            <h3 class="tools__group-title">Front-End Basics</h3>
            <ul>
              <li>HTML &amp; CSS</li>
              <li>GitHub</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Serve the site and load `tools.html`. Confirm: "Tools" is highlighted active in the nav; two wide columns render (Design & Prototyping + Research & Ops on the left, AI-Assisted Workflow + Front-End Basics on the right); AI-Assisted Workflow's heading renders in the accent blue and lists all 6 tools (Claude, ChatGPT, Copilot, Claude Code, Claude Cowork, HeyGen); no card/box styling remains; resize to mobile width and confirm the two columns stack into one. No console errors.

- [ ] **Step 3: Commit**

```bash
git add tools.html
git commit -m "Rebuild Tools page: two-column layout, add Copilot/Claude Code/Claude Cowork/HeyGen"
```

---

## Task 6: Create the Work Listing Page

**Files:**
- Create: `work.html`

- [ ] **Step 1: Create `work.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Work | Tyler Quackenbush</title>
  <meta name="description" content="UX/UI case studies from Tyler Quackenbush — product design, content design, and design systems work." />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="Work | Tyler Quackenbush" />
  <meta property="og:description" content="UX/UI case studies from Tyler Quackenbush — product design, content design, and design systems work." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Work | Tyler Quackenbush" />
  <meta name="twitter:description" content="UX/UI case studies from Tyler Quackenbush — product design, content design, and design systems work." />
  <meta name="twitter:image" content="assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <main id="main-content">
    <nav class="topnav" id="topnav">
      <a href="index.html" class="topnav__mark">TQ</a>
      <ul class="topnav__list" id="topnav-list">
        <li><a href="index.html" class="topnav__link">Home</a></li>
        <li><a href="about.html" class="topnav__link">About</a></li>
        <li><a href="ai.html" class="topnav__link">How I Use AI</a></li>
        <li><a href="tools.html" class="topnav__link">Tools</a></li>
        <li><a href="work.html" class="topnav__link active">Work</a></li>
        <li><a href="contact.html" class="topnav__link">Contact</a></li>
        <li><a href="assets/resume.pdf" target="_blank" rel="noopener" class="topnav__link" id="resume-link">Resume</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="topnav-list">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <section class="work">
      <h2 class="section-heading">Work</h2>
      <div class="work-grid">
        <a href="work/discovery-practice.html" class="work-card">
          <div class="work-card__media">
            <img src="assets/images/exhibit-threat-readiness.svg" alt="Concept dashboard exhibit from the UX Discovery practice" />
          </div>
          <h3 class="work-card__title">Designing the Discovery Practice</h3>
          <p class="work-card__category">UX Discovery Practice</p>
        </a>
        <a href="work/novant-health.html" class="work-card">
          <div class="work-card__media">
            <img src="assets/images/novant-mockup.jpg" alt="Novant Health maternity care services page, desktop view" />
          </div>
          <h3 class="work-card__title">System-Wide Website Redesign</h3>
          <p class="work-card__category">Website Redesign</p>
        </a>
        <a href="work/acct-international.html" class="work-card">
          <div class="work-card__media">
            <img src="assets/images/acct-placeholder.svg" alt="ACCT International brand redesign mockup" />
          </div>
          <h3 class="work-card__title">Brand Redesign</h3>
          <p class="work-card__category">Brand Redesign</p>
        </a>
        <a href="work/adventure-careers.html" class="work-card">
          <div class="work-card__media">
            <img src="assets/images/adventure-placeholder.svg" alt="Adventure Careers website and brand mockup" />
          </div>
          <h3 class="work-card__title">Website and Brand</h3>
          <p class="work-card__category">Website &amp; Brand</p>
        </a>
      </div>
    </section>
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Serve the site and load `work.html`. Confirm: "Work" is highlighted active in the nav; all 4 case studies render as cards (image, title, category), wrapping to a second row of 1 item on desktop (3-column grid); every card links to a `work/*.html` file that doesn't exist yet (expected — fixed in the next three tasks); resize to mobile and confirm the grid collapses to 2 then 1 column. No console errors.

- [ ] **Step 3: Commit**

```bash
git add work.html
git commit -m "Add Work listing page with all 4 case studies"
```

---

## Task 7: Create the Novant Health Case Study Page (with Gallery)

**Files:**
- Create: `work/novant-health.html`

This is the first of the individual case-study pages, and the one with the richest image set (5 real screenshots already in `assets/images/`) — it uses the full hero + gallery pattern.

- [ ] **Step 1: Create the `work/` directory and the page**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Novant Health — System-Wide Website Redesign | Tyler Quackenbush</title>
  <meta name="description" content="Redesigning Novant Health's appointment scheduling and provider search — a case study by Tyler Quackenbush." />
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="Novant Health — System-Wide Website Redesign | Tyler Quackenbush" />
  <meta property="og:description" content="Redesigning Novant Health's appointment scheduling and provider search — a case study by Tyler Quackenbush." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="../assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Novant Health — System-Wide Website Redesign | Tyler Quackenbush" />
  <meta name="twitter:description" content="Redesigning Novant Health's appointment scheduling and provider search — a case study by Tyler Quackenbush." />
  <meta name="twitter:image" content="../assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css" />
</head>
<body>
  <main id="main-content">
    <nav class="topnav" id="topnav">
      <a href="../index.html" class="topnav__mark">TQ</a>
      <ul class="topnav__list" id="topnav-list">
        <li><a href="../index.html" class="topnav__link">Home</a></li>
        <li><a href="../about.html" class="topnav__link">About</a></li>
        <li><a href="../ai.html" class="topnav__link">How I Use AI</a></li>
        <li><a href="../tools.html" class="topnav__link">Tools</a></li>
        <li><a href="../work.html" class="topnav__link active">Work</a></li>
        <li><a href="../contact.html" class="topnav__link">Contact</a></li>
        <li><a href="../assets/resume.pdf" target="_blank" rel="noopener" class="topnav__link" id="resume-link">Resume</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="topnav-list">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <section class="case-hero">
      <div>
        <h1 class="case-hero__title">System-Wide Website Redesign</h1>
        <div class="case-hero__meta">
          <span>Novant Health</span><span>&middot;</span><span>Done in Figma</span>
        </div>
        <p class="case-hero__desc">
          Novant Health had a scheduling flow that technically worked, the way a filing cabinet technically
          works if you already know which drawer everything's in. Patients didn't have that internal map.
          Providers weren't much better off.
        </p>
      </div>
      <div class="case-hero__frame reveal-image">
        <div class="case-hero__frame-dots"><span></span><span></span><span></span></div>
        <img src="../assets/images/novant-mockup.jpg" alt="Novant Health maternity care services page, desktop view" />
      </div>
    </section>

    <section class="case-gallery">
      <button class="case-gallery__arrow case-gallery__arrow--prev" aria-label="Previous image">&#8249;</button>
      <div class="case-gallery__track">
        <div class="case-gallery__frame">
          <img src="../assets/images/Rectangle 29.png" alt="Novant Health mobile screen" />
        </div>
        <div class="case-gallery__frame">
          <img src="../assets/images/Rectangle 30.png" alt="Novant Health mobile screen" />
        </div>
        <div class="case-gallery__frame">
          <img src="../assets/images/Rectangle 30-1.png" alt="Novant Health mobile screen" />
        </div>
        <div class="case-gallery__frame">
          <img src="../assets/images/1231123.png" alt="Novant Health mobile screen" />
        </div>
      </div>
      <button class="case-gallery__arrow case-gallery__arrow--next" aria-label="Next image">&#8250;</button>
    </section>

    <section class="case-body">
      <p class="case-body__desc">
        I redesigned the pieces that mattered most: appointment scheduling, provider search, the pages
        people hit when they're anxious and one thumb away from giving up. Tested with real prototypes,
        rolled out in phases, built to survive contact with an actual dev team.
      </p>
      <div class="case-study__highlights">
        <div class="highlight">
          <span class="highlight__stat">Streamlined Appointment Flow</span>
          <p>Fewer people gave up mid-booking once the path stopped assuming everyone already knew where to look.</p>
        </div>
        <div class="highlight">
          <span class="highlight__stat">Recognized by Internal UX Team</span>
          <p>The system I built got reused by other teams, which is the only compliment that actually matters to me.</p>
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
    </section>
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
```

Note the 4 gallery images referenced (`Rectangle 29.png`, `Rectangle 30.png`, `Rectangle 30-1.png`, `1231123.png`) already exist in `assets/images/` — confirm this with `ls "assets/images/Rectangle 29.png" "assets/images/Rectangle 30.png" "assets/images/Rectangle 30-1.png" assets/images/1231123.png` before moving on; if any filename doesn't match exactly (spaces in filenames are easy to get wrong), fix the `src` in the HTML above to match reality.

- [ ] **Step 2: Verify**

Serve the site and load `work/novant-health.html` directly. Confirm: nav renders correctly with all links working (including relative `../` links back to Home/About/etc. and to `../work.html`), "Work" shows active; the hero region shows title/metadata/description on the left and the framed screenshot (with the 3-dot browser-chrome treatment) on the right, with the clip-path wipe-in animation playing on load; below it, the gallery strip shows 4 images with working left/right arrow buttons (click each, confirm the track scrolls); below that, the two highlight cards and the 6-step process list render exactly as they used to on the single-page site. Check the Network tab for any 404s on the 4 gallery images. No console errors.

- [ ] **Step 3: Commit**

```bash
git add "work/novant-health.html"
git commit -m "Add Novant Health case study page with image gallery"
```

---

## Task 8: Create the Discovery Practice Case Study Page (with Captioned Exhibit Grid)

**Files:**
- Create: `work/discovery-practice.html`

This case study already has 4 well-captioned exhibit images (Threat Readiness, DREAMS, GUARD, COMPLY) — richer than a bare gallery strip would allow. It keeps its existing captioned 2-column exhibit grid instead of the arrow-nav gallery strip, placed in the body section below the hero (no separate `.case-gallery` section on this page).

- [ ] **Step 1: Create the page**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Designing the Discovery Practice | Tyler Quackenbush</title>
  <meta name="description" content="Building a repeatable federal UX discovery practice at Agile Defense — a case study by Tyler Quackenbush." />
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="Designing the Discovery Practice | Tyler Quackenbush" />
  <meta property="og:description" content="Building a repeatable federal UX discovery practice at Agile Defense — a case study by Tyler Quackenbush." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="../assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Designing the Discovery Practice | Tyler Quackenbush" />
  <meta name="twitter:description" content="Building a repeatable federal UX discovery practice at Agile Defense — a case study by Tyler Quackenbush." />
  <meta name="twitter:image" content="../assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css" />
</head>
<body>
  <main id="main-content">
    <nav class="topnav" id="topnav">
      <a href="../index.html" class="topnav__mark">TQ</a>
      <ul class="topnav__list" id="topnav-list">
        <li><a href="../index.html" class="topnav__link">Home</a></li>
        <li><a href="../about.html" class="topnav__link">About</a></li>
        <li><a href="../ai.html" class="topnav__link">How I Use AI</a></li>
        <li><a href="../tools.html" class="topnav__link">Tools</a></li>
        <li><a href="../work.html" class="topnav__link active">Work</a></li>
        <li><a href="../contact.html" class="topnav__link">Contact</a></li>
        <li><a href="../assets/resume.pdf" target="_blank" rel="noopener" class="topnav__link" id="resume-link">Resume</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="topnav-list">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <section class="case-hero">
      <div>
        <h1 class="case-hero__title">Designing the Discovery Practice</h1>
        <div class="case-hero__meta">
          <span>Agile Defense (formerly IntelliBridge)</span><span>&middot;</span><span>UX Discovery Practice</span>
        </div>
        <p class="case-hero__desc">
          Federal agencies don't hand out multi-month discovery engagements on spec. If you want to win the
          work, you have to show, not tell, and you have to do it in about the time it takes most teams to
          schedule a kickoff call.
        </p>
      </div>
      <div class="case-hero__frame reveal-image">
        <div class="case-hero__frame-dots"><span></span><span></span><span></span></div>
        <img src="../assets/images/exhibit-threat-readiness.svg" alt="Threat Readiness concept dashboard" />
      </div>
    </section>

    <section class="case-body">
      <p class="case-body__desc">
        I helped build and run the practice that solved that: a repeatable way to go from &ldquo;here's a
        rough problem&rdquo; to a working, clickable concept prototype in around ten days, used across
        defense readiness, federal law enforcement, and crisis-response engagements. Every one of them
        helped win the contract it was built to pitch.
      </p>
      <ol class="case-study__process">
        <li><span>01</span><h4>Mission Orientation</h4><p>Get honest about what the environment can actually support, before promising anything.</p></li>
        <li><span>02</span><h4>Mission Calibration</h4><p>Workshop the real need against value, speed, and cost, with the people who'll live with the answer.</p></li>
        <li><span>03</span><h4>Research &amp; Investigation</h4><p>Map the journey, sketch the personas, find where the legacy system is actually failing people.</p></li>
        <li><span>04</span><h4>Analysis &amp; Modeling</h4><p>Turn findings into something with edges: a prototype, not a slide.</p></li>
        <li><span>05</span><h4>Synthesis Alignment</h4><p>Bring it back to leadership as a strategic case, not just a screen.</p></li>
        <li><span>06</span><h4>Mission Validation</h4><p>Test it against the roadmap and the room. If it survives that, it's ready to pitch.</p></li>
      </ol>
      <ul class="case-study__exhibits">
        <li class="exhibit">
          <figure>
            <img src="../assets/images/exhibit-threat-readiness.svg" alt="Threat Readiness concept dashboard" />
            <figcaption>
              <strong>Exhibit A &mdash; Threat Readiness</strong>
              <p>A concept dashboard for a federal defense client, built to make threat and readiness data legible to leadership in one screen instead of six reports.</p>
            </figcaption>
          </figure>
        </li>
        <li class="exhibit">
          <figure>
            <img src="../assets/images/exhibit-dreams.svg" alt="DREAMS concept HR platform" />
            <figcaption>
              <strong>Exhibit B &mdash; DREAMS</strong>
              <p>A concept HR platform for federal law enforcement recruiting, turning a fragmented hiring pipeline into one dashboard leadership could actually read.</p>
            </figcaption>
          </figure>
        </li>
        <li class="exhibit">
          <figure>
            <img src="../assets/images/exhibit-guard.svg" alt="GUARD concept crisis response dashboard" />
            <figcaption>
              <strong>Exhibit C &mdash; GUARD</strong>
              <p>A crisis-response concept unifying health, infrastructure, and cyber risk data that used to live in three separate systems nobody cross-checked.</p>
            </figcaption>
          </figure>
        </li>
        <li class="exhibit">
          <figure>
            <img src="../assets/images/exhibit-comply.svg" alt="COMPLY concept compliance tracker" />
            <figcaption>
              <strong>Exhibit D &mdash; COMPLY</strong>
              <p>A compliance and threat-assessment tracker built to surface the one &ldquo;not compliant&rdquo; flag that actually mattered, out of thousands of records.</p>
            </figcaption>
          </figure>
        </li>
      </ul>
      <p class="case-body__desc case-study__reflection">
        Every one of these stayed a concept prototype until it won the room. That's the actual metric I
        care about: not whether it looked good in a deck, but whether it was specific enough for someone to
        say &ldquo;yes, build that.&rdquo;
      </p>
    </section>
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Serve the site and load `work/discovery-practice.html` directly. Confirm: hero region shows title/metadata/description and the framed Threat Readiness exhibit image with the wipe-in animation; body section shows the 6-step process list, then the 4-exhibit captioned grid (2x2 on desktop, each with its own image/title/description), then the italic reflection paragraph at the end — same content and order as the old single-page version. No `.case-gallery` section on this page (intentional). No console errors, no 404s.

- [ ] **Step 3: Commit**

```bash
git add "work/discovery-practice.html"
git commit -m "Add Discovery Practice case study page with captioned exhibit grid"
```

---

## Task 9: Create the ACCT International and Adventure Careers Case Study Pages

**Files:**
- Create: `work/acct-international.html`
- Create: `work/adventure-careers.html`

Both currently have only a single placeholder SVG each — no gallery section on either page yet (real assets are a separate follow-up, tracked outside this plan). Each page still gets the full hero + body treatment, just with only one framed image and no gallery strip.

- [ ] **Step 1: Create `work/acct-international.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ACCT International — Brand Redesign | Tyler Quackenbush</title>
  <meta name="description" content="Rebuilding ACCT International's brand identity to hold up next to regulators and auditors — a case study by Tyler Quackenbush." />
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="ACCT International — Brand Redesign | Tyler Quackenbush" />
  <meta property="og:description" content="Rebuilding ACCT International's brand identity to hold up next to regulators and auditors — a case study by Tyler Quackenbush." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="../assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="ACCT International — Brand Redesign | Tyler Quackenbush" />
  <meta name="twitter:description" content="Rebuilding ACCT International's brand identity to hold up next to regulators and auditors — a case study by Tyler Quackenbush." />
  <meta name="twitter:image" content="../assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css" />
</head>
<body>
  <main id="main-content">
    <nav class="topnav" id="topnav">
      <a href="../index.html" class="topnav__mark">TQ</a>
      <ul class="topnav__list" id="topnav-list">
        <li><a href="../index.html" class="topnav__link">Home</a></li>
        <li><a href="../about.html" class="topnav__link">About</a></li>
        <li><a href="../ai.html" class="topnav__link">How I Use AI</a></li>
        <li><a href="../tools.html" class="topnav__link">Tools</a></li>
        <li><a href="../work.html" class="topnav__link active">Work</a></li>
        <li><a href="../contact.html" class="topnav__link">Contact</a></li>
        <li><a href="../assets/resume.pdf" target="_blank" rel="noopener" class="topnav__link" id="resume-link">Resume</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="topnav-list">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <section class="case-hero">
      <div>
        <h1 class="case-hero__title">Brand Redesign</h1>
        <div class="case-hero__meta">
          <span>ACCT International</span><span>&middot;</span><span>Done in Figma</span>
        </div>
        <p class="case-hero__desc">
          ACCT teaches people to build and inspect challenge courses (the ropes-and-ziplines kind, where a
          mistake is not hypothetical). Their brand looked like a hobbyist forum. That's a trust problem, not
          just a design one.
        </p>
      </div>
      <div class="case-hero__frame reveal-image">
        <div class="case-hero__frame-dots"><span></span><span></span><span></span></div>
        <img src="../assets/images/acct-placeholder.svg" alt="ACCT International brand redesign mockup" />
      </div>
    </section>

    <section class="case-body">
      <p class="case-body__desc">
        I rebuilt the identity system from the ground up (logo, type, the whole language) so it could hold
        up next to industry regulators and insurance auditors, without losing the part of ACCT that's
        genuinely about adventure.
      </p>
      <div class="case-study__highlights">
        <div class="highlight">
          <span class="highlight__stat">Unified Diverse Stakeholders</span>
          <p>Board members, safety regulators, and industry veterans do not agree on much. They agreed on this.</p>
        </div>
        <div class="highlight">
          <span class="highlight__stat">&ldquo;The first time we've ever felt truly professional.&rdquo;</span>
          <p>A board member said that after rollout. I'm still thinking about what the brand must have looked like before.</p>
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
    </section>
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `work/adventure-careers.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Adventure Careers — Website and Brand | Tyler Quackenbush</title>
  <meta name="description" content="Building the brand and site at once for a mobile-first outdoor-industry job board — a case study by Tyler Quackenbush." />
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="Adventure Careers — Website and Brand | Tyler Quackenbush" />
  <meta property="og:description" content="Building the brand and site at once for a mobile-first outdoor-industry job board — a case study by Tyler Quackenbush." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="../assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Adventure Careers — Website and Brand | Tyler Quackenbush" />
  <meta name="twitter:description" content="Building the brand and site at once for a mobile-first outdoor-industry job board — a case study by Tyler Quackenbush." />
  <meta name="twitter:image" content="../assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css" />
</head>
<body>
  <main id="main-content">
    <nav class="topnav" id="topnav">
      <a href="../index.html" class="topnav__mark">TQ</a>
      <ul class="topnav__list" id="topnav-list">
        <li><a href="../index.html" class="topnav__link">Home</a></li>
        <li><a href="../about.html" class="topnav__link">About</a></li>
        <li><a href="../ai.html" class="topnav__link">How I Use AI</a></li>
        <li><a href="../tools.html" class="topnav__link">Tools</a></li>
        <li><a href="../work.html" class="topnav__link active">Work</a></li>
        <li><a href="../contact.html" class="topnav__link">Contact</a></li>
        <li><a href="../assets/resume.pdf" target="_blank" rel="noopener" class="topnav__link" id="resume-link">Resume</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="topnav-list">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <section class="case-hero">
      <div>
        <h1 class="case-hero__title">Website and Brand</h1>
        <div class="case-hero__meta">
          <span>Adventure Careers</span><span>&middot;</span><span>Done in Figma</span>
        </div>
        <p class="case-hero__desc">
          Adventure Careers needed to look like a real company before it quite was one yet. Job boards for
          outdoor and experiential-ed work tend to look like a Craigslist post that got ambitious.
        </p>
      </div>
      <div class="case-hero__frame reveal-image">
        <div class="case-hero__frame-dots"><span></span><span></span><span></span></div>
        <img src="../assets/images/adventure-placeholder.svg" alt="Adventure Careers website and brand mockup" />
      </div>
    </section>

    <section class="case-body">
      <p class="case-body__desc">
        I built the brand and the site at the same time, mobile-first, because the actual users were
        checking listings between shifts, not sitting at a desk.
      </p>
      <div class="case-study__highlights">
        <div class="highlight">
          <span class="highlight__stat" data-count-to="40" data-count-suffix="%">0%</span>
          <p>Reduced bounce rate. Clean navigation and a site that didn't feel like homework got people past the first click.</p>
        </div>
        <div class="highlight">
          <span class="highlight__stat">&ldquo;It looks and feels like a real company now.&rdquo;</span>
          <p>Founder's words, not mine. I'll take it.</p>
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
    </section>
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Verify**

Serve the site and load both pages directly. Confirm: both render the hero region correctly (title/metadata/description, framed placeholder image); ACCT's page shows its 2 highlight cards and 6-step process; Adventure Careers' page shows its stat-counter highlight (confirm it animates from 0% to 40% on scroll) plus its quote highlight and 6-step process; neither page has a `.case-gallery` section (intentional — no real gallery images yet); no console errors, no 404s.

- [ ] **Step 4: Commit**

```bash
git add "work/acct-international.html" "work/adventure-careers.html"
git commit -m "Add ACCT International and Adventure Careers case study pages"
```

---

## Task 10: Full-Site Verification Pass

**Files:** none up front (verification only, plus any fix commits needed)

- [ ] **Step 1: Link-check every page**

Serve the site. Starting from `index.html`, click through every nav link on every one of the 10 pages (including the 4 `work/*.html` pages, which need correctly-prefixed `../` links back out). Confirm every single link resolves (200, not 404) and lands on the expected page with the correct nav item highlighted active. Pay special attention to the `work/*.html` pages' nav — those are the ones most likely to have a wrong or missing `../` prefix.

- [ ] **Step 2: Card links**

From `index.html`, click each of the 3 Work teaser cards — confirm each lands on the correct case-study page. From `work.html`, click each of the 4 full listing cards — same check.

- [ ] **Step 3: Mobile pass**

Resize to a mobile viewport (< 900px) and repeat a sample of the above on at least 3 pages (Home, Work listing, one case study) — hamburger opens/closes, links work, no horizontal scroll, the case-study gallery strip is swipeable.

- [ ] **Step 4: Interaction pass**

On `about.html`: confirm the slider still drags and responds to keyboard arrows, and the scatter-to-grid entrance animation still plays. On `work/novant-health.html`: confirm the gallery arrows scroll the strip. On `work/adventure-careers.html`: confirm the stat counter animates. On `index.html`: confirm the hero entrance animation plays. On every page: confirm `.reveal-group`/`.reveal-image` elements fade/wipe in on scroll.

- [ ] **Step 5: Reduced motion pass**

Enable OS-level "reduce motion" (or emulate it) and spot-check `index.html` and one case-study page — confirm entrance/reveal/wipe animations are skipped and content appears immediately in its final state, same as before this redesign.

- [ ] **Step 6: Console and network check**

Across all 10 pages, confirm zero console errors and zero 404s (fonts, images, CSS, JS all load with 200s).

- [ ] **Step 7: Fix anything found, then final commit**

If any step above surfaces a broken link, wrong relative path, missing active-nav state, or any other issue, fix it and commit the fix separately with a message describing what broke and why.
