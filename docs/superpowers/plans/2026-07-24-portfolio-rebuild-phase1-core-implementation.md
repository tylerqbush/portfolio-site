# Portfolio Rebuild — Phase 1 (Core) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the foundation, homepage, work index, and three primary case studies (Agile Defense, Novant Health, UNG) of tylerquackenbush.com against the approved design spec (`docs/superpowers/specs/2026-07-24-ux-content-portfolio-rebuild-design.md`) and voice guide (`docs/voice-guide.md`), producing a coherent, deployable subset of the site. Phase 2 (About, Contact, Brand Identity, Design System, Microcopy, demoted case studies) is a separate plan written after this one ships.

**Architecture:** Plain multi-page static HTML/CSS/JS, matching the existing site's approach (no build step, no framework, no npm) — this is also required for the Cloudflare Pages deployment target, which expects a static output with no build command. Every page duplicates its own `<head>` and nav/footer markup (no templating layer exists in this codebase); one shared `css/styles.css` and `js/main.js` are linked from every page.

**Tech Stack:** HTML5, CSS custom properties, vanilla JS (no GSAP, no other runtime dependency — the current site's GSAP-based animations are dropped as part of the full rebuild). Fonts: Space Grotesk, Public Sans, JetBrains Mono via Google Fonts.

**Testing approach for this plan:** This is a static content site with no application logic, no test framework, and no build step (matches the existing codebase — there's no `package.json` here and this plan doesn't add one, since Cloudflare Pages is configured for zero build command). "Tests" here are `grep`-based structural assertions against the actual files: assert a marker doesn't exist yet (red), create the file, assert it now exists (green). Each page task also ends with a manual browser check over a local static server, since grep can confirm content landed but can't confirm the page renders correctly.

**Nav scope note:** Phase 1 ships a nav with only **Work** and the logo/home link — no About, Brand Identity, or Contact links yet, because those pages don't exist until Phase 2. Shipping a nav link to a 404 is worse than a short nav. Phase 2's first task adds those links back in across every page once the targets exist.

---

## Task 1: Global stylesheet — tokens, base, nav, buttons

**Files:**
- Create: `css/styles.css` (replaces the existing file entirely — full rebuild, nothing from the old visual system carries forward per the spec)

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c -- "--color-ink: #16324A" css/styles.css 2>/dev/null || echo 0`
Expected: `0` (file doesn't have the new token yet — it may not exist, or may still hold the old blue/gray token set)

- [ ] **Step 2: Write the full stylesheet**

Create `css/styles.css`:

```css
:root {
  /* Color — Deep Navy / Amber / White, no paper or cream tones anywhere.
     Contrast verified against --color-bg (#FFFFFF), sRGB relative-luminance method:
     --color-ink      13.2:1  (AAA)
     --color-ink-dim   7.5:1  (AAA)
     --color-muted     4.6:1  (AA — thin margin, don't lighten further)
     --color-accent    5.8:1  (AA — safe for body-size text/links)
     --color-accent-strong 3.8:1 (fails AA for normal text — large/bold text and graphic
       fills only, e.g. big stat numbers at 24px+/700 weight, which only need 3:1) */
  --color-ink: #16324A;
  --color-ink-dim: #4A5568;
  --color-muted: #6B7680;
  --color-bg: #FFFFFF;
  --color-surface: #F7F8F9;
  --color-accent: #8C5A1E;
  --color-accent-strong: #B5762A;
  --color-border: #EAEAEA;

  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Public Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --nav-height: 72px;
  --section-padding-x: clamp(24px, 6vw, 96px);
  --section-padding-y: clamp(56px, 9vh, 100px);

  --transition-fast: 0.2s ease;
  --transition-medium: 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 999px;

  --shadow-sm: 0 4px 12px rgba(22, 50, 74, 0.08);
  --shadow-md: 0 8px 20px rgba(22, 50, 74, 0.1);

  --label-size: 0.75rem;
  --label-tracking: 0.08em;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: auto; /* JS drives smooth scroll via scrollIntoView() so anchor clicks aren't double-smoothed */
}

body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-body);
  line-height: 1.55;
  overflow-x: hidden;
}

main {
  padding-top: var(--nav-height);
  display: block;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 600;
  line-height: 1.15;
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

/* Skip link */
.skip-link {
  position: absolute;
  left: 12px;
  top: -48px;
  background: var(--color-ink);
  color: #fff;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  z-index: 100;
  transition: top var(--transition-fast);
}

.skip-link:focus {
  top: 12px;
}

/* Shared mono "eyebrow" label text */
.label-mono {
  font-family: var(--font-mono);
  font-size: var(--label-size);
  text-transform: uppercase;
  letter-spacing: var(--label-tracking);
  color: var(--color-accent);
}

/* ---- Nav ---- */
.site-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 4vw, 48px);
  z-index: 50;
}

.site-nav__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.site-nav__mark {
  display: block;
  flex-shrink: 0;
}

.site-nav__name {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-ink);
}

.site-nav__list {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 28px;
}

.site-nav__link {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--color-ink);
  opacity: 0.75;
  transition: opacity var(--transition-fast);
}

.site-nav__link.active,
.site-nav__link:hover,
.site-nav__link:focus-visible {
  opacity: 1;
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
  background: var(--color-ink);
}

@media (max-width: 780px) {
  .site-nav__list {
    position: fixed;
    top: var(--nav-height);
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    padding: 8px clamp(20px, 4vw, 48px) 24px;
    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-fast), transform var(--transition-fast);
  }

  .site-nav__list.is-open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .site-nav__list li {
    width: 100%;
    padding: 12px 0;
    border-top: 1px solid var(--color-border);
  }

  .site-nav__list li:first-child {
    border-top: none;
  }

  .hamburger {
    display: flex;
  }
}

/* ---- Buttons ---- */
.btn {
  display: inline-block;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.9rem;
  padding: 13px 24px;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast), transform var(--transition-fast), border-color var(--transition-fast);
}

.btn--primary {
  background: var(--color-ink);
  color: #fff;
}

.btn--primary:hover,
.btn--primary:focus-visible {
  transform: translateY(-2px);
}

.btn--outline {
  border: 1.5px solid var(--color-ink);
  color: var(--color-ink);
}

.btn--outline:hover,
.btn--outline:focus-visible {
  background: var(--color-surface);
}

/* ---- Footer ---- */
.site-footer {
  background: var(--color-ink);
  color: #fff;
  padding: 28px clamp(20px, 4vw, 48px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.site-footer__name {
  font-family: var(--font-mono);
  font-size: var(--label-size);
  letter-spacing: var(--label-tracking);
  text-transform: uppercase;
  opacity: 0.85;
}

.site-footer__email {
  font-size: 0.9rem;
}

.site-footer__email:hover,
.site-footer__email:focus-visible {
  text-decoration: underline;
}
```

- [ ] **Step 3: Run the assertion again, verify it passes**

Run: `grep -c -- "--color-ink: #16324A" css/styles.css`
Expected: `1`

- [ ] **Step 4: Commit**

```bash
git add css/styles.css
git commit -m "Replace stylesheet with new navy/amber design system tokens and nav/button/footer base"
```

---

## Task 2: Global JS — mobile nav + stat counter

**Files:**
- Create: `js/main.js` (replaces the existing GSAP-based file — full rebuild drops the GSAP dependency)

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "openMobileNav" js/main.js 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Write the full script**

Create `js/main.js`:

```js
// ---- Mobile hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('site-nav-list');

function openMobileNav() {
  navList.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeMobileNav() {
  navList.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
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
```

- [ ] **Step 3: Run the assertion again, verify it passes**

Run: `grep -c "openMobileNav" js/main.js`
Expected: `1`

- [ ] **Step 4: Commit**

```bash
git add js/main.js
git commit -m "Replace main.js with vanilla mobile-nav toggle and stat counter, drop GSAP dependency"
```

---

## Task 3: Logo mark and favicon

**Files:**
- Create: `assets/favicon.svg` (replaces the existing favicon)

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "16324A" assets/favicon.svg 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Write the favicon**

Create `assets/favicon.svg`:

```svg
<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="9" fill="#16324A"/>
  <line x1="13" y1="10" x2="13" y2="30" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="13" y1="20" x2="29" y2="20" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
</svg>
```

This is the "boxed badge" mark validated in brainstorming — a rounded navy square with a bold two-stroke white mark (vertical bar meeting a horizontal bar). The same markup, inlined, is reused in the nav on every page so it renders crisp without an extra image request.

- [ ] **Step 3: Run the assertion again, verify it passes**

Run: `grep -c "16324A" assets/favicon.svg`
Expected: `1`

- [ ] **Step 4: Commit**

```bash
git add assets/favicon.svg
git commit -m "Add new badge-mark favicon"
```

---

## Task 4: Homepage

**Files:**
- Create: `index.html` (replaces the existing homepage)

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "Jargon in" index.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Write the full page**

Create `index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tyler Quackenbush | UX Content Designer</title>
  <meta name="description" content="Tyler Quackenbush — UX content designer and UX writer. Content design, content strategy, and design systems work across healthcare, federal, and B2B products." />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="Tyler Quackenbush | UX Content Designer" />
  <meta property="og:description" content="Content design, content strategy, and design systems work across healthcare, federal, and B2B products." />
  <meta property="og:type" content="website" />
  <!-- og:image/twitter:image should be absolute URLs once this site has a production domain -->
  <meta property="og:image" content="assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Tyler Quackenbush | UX Content Designer" />
  <meta name="twitter:description" content="Content design, content strategy, and design systems work across healthcare, federal, and B2B products." />
  <meta name="twitter:image" content="assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Public+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to content</a>

  <nav class="site-nav">
    <a href="index.html" class="site-nav__brand">
      <svg class="site-nav__mark" width="34" height="34" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="40" height="40" rx="9" fill="#16324A"/>
        <line x1="13" y1="10" x2="13" y2="30" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="13" y1="20" x2="29" y2="20" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
      </svg>
      <span class="site-nav__name">Tyler Quackenbush</span>
    </a>
    <ul class="site-nav__list" id="site-nav-list">
      <li><a href="work.html" class="site-nav__link">Work</a></li>
      <li><a href="assets/resume.pdf" target="_blank" rel="noopener" class="site-nav__link">Resume</a></li>
    </ul>
    <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-list">
      <span></span><span></span><span></span>
    </button>
  </nav>

  <main id="main-content">
    <section class="hero">
      <p class="label-mono hero__eyebrow">UX Content Designer &middot; 8 Years</p>
      <h1 class="hero__title">Jargon in.<br />Clarity out.</h1>
      <p class="hero__lede">I'm Tyler. I take dense legal, clinical, and technical language and turn it into something a person can act on in five seconds instead of re-reading three times.</p>
      <p class="hero__lede">Eight years doing this for hospitals, a federal contractor, and a public university. Most recently: rewriting error messages and account flows so people stop calling support to ask what a sentence meant.</p>
      <div class="hero__ctas">
        <a href="work.html" class="btn btn--primary">View case studies</a>
        <a href="assets/resume.pdf" target="_blank" rel="noopener" class="btn btn--outline">Download resume</a>
      </div>
    </section>

    <section class="proof">
      <div class="proof__pair">
        <div class="proof__col">
          <p class="label-mono proof__label proof__label--before">Before &mdash; Legal Draft</p>
          <p class="proof__text proof__text--before">"Failure to submit required documentation within the specified timeframe may result in delay or denial of the requested action."</p>
        </div>
        <span class="proof__arrow" aria-hidden="true">&rarr;</span>
        <div class="proof__col">
          <p class="label-mono proof__label">After &mdash; What Shipped</p>
          <p class="proof__text proof__text--after">"Submit your documents by March 3, or we can't process your request."</p>
        </div>
      </div>
    </section>

    <section class="work-list">
      <p class="label-mono">Selected Work</p>
      <p class="work-list__intro">Three engagements, and the plain-language problem each one actually was.</p>

      <article class="work-list__item">
        <p class="label-mono work-list__eyebrow">01 &middot; Federal</p>
        <h2 class="work-list__title">Agile Defense</h2>
        <p class="work-list__meta">Senior Content Designer &middot; 2021&ndash;Present</p>
        <p class="work-list__desc">Federal content has to satisfy accessibility law, legal review, and an actual human reading it, usually in that order of who complains loudest. I built the content audits, voice and tone standards, and style guide that got all three to agree.</p>
        <p class="work-list__result"><strong>Result:</strong> 40+ initiatives delivered on time, 90% stakeholder satisfaction.</p>
        <a href="work/agile-defense.html" class="label-mono work-list__link">Read the case study &rarr;</a>
      </article>

      <article class="work-list__item">
        <p class="label-mono work-list__eyebrow">02 &middot; Healthcare</p>
        <h2 class="work-list__title">Novant Health</h2>
        <p class="work-list__meta">UX Content Designer &middot; Accrue Partners &middot; 2021</p>
        <p class="work-list__desc">Patients hit a scheduling flow that technically worked, the way a filing cabinet works if you already know which drawer. I rewrote the patient-facing content into new templates and design-system components across the system-wide redesign.</p>
        <p class="work-list__result"><strong>Result:</strong> 50+ content pages shipped weekly, revision cycles cut to under 10 minutes a page.</p>
        <a href="work/novant-health.html" class="label-mono work-list__link">Read the case study &rarr;</a>
      </article>

      <article class="work-list__item work-list__item--last">
        <p class="label-mono work-list__eyebrow">03 &middot; Higher Ed</p>
        <h2 class="work-list__title">University of North Georgia</h2>
        <p class="work-list__meta">Web Designer &middot; 2016&ndash;2021</p>
        <p class="work-list__desc">A public university site grows one department at a time, for twenty years, with nobody in charge of the whole thing. Mine had 20-plus navigation menus. I decided what stayed, what merged, and what finally got cut.</p>
        <p class="work-list__result"><strong>Result:</strong> 35% increase in engagement across a 5,000+ page site.</p>
        <a href="work/ung.html" class="label-mono work-list__link">Read the case study &rarr;</a>
      </article>
    </section>

    <section class="about-teaser">
      <img src="assets/images/Headshot.jpeg" alt="Tyler Quackenbush" class="about-teaser__photo" width="88" height="88" />
      <div class="about-teaser__body">
        <p>Eight years in content design and UX writing &mdash; federal compliance, healthcare, now e-commerce and B2B. I use Claude for research synthesis and first-pass drafts. I still edit every line myself.</p>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <span class="site-footer__name">Tyler Quackenbush</span>
    <a href="mailto:tyler.qbush@gmail.com" class="site-footer__email">tyler.qbush@gmail.com</a>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Add the homepage-specific CSS**

Append to `css/styles.css`:

```css
/* ---- Hero ---- */
.hero {
  padding: 60px var(--section-padding-x) 48px;
  max-width: 800px;
}

.hero__eyebrow {
  color: var(--color-accent);
  margin-bottom: 14px;
}

.hero__title {
  font-size: clamp(2.1rem, 5vw, 2.8rem);
  margin-bottom: 20px;
}

.hero__lede {
  font-size: 1.05rem;
  color: #333;
  max-width: 560px;
  margin-bottom: 12px;
}

.hero__ctas {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

/* ---- Proof strip ---- */
.proof {
  padding: 0 var(--section-padding-x) 56px;
}

.proof__pair {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 22px 26px;
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.proof__col {
  flex: 1;
  min-width: 220px;
}

.proof__label {
  color: var(--color-muted);
  margin-bottom: 8px;
}

.proof__label--before {
  color: var(--color-muted);
}

.proof__text {
  font-size: 0.9rem;
}

.proof__text--before {
  color: var(--color-muted);
  font-style: italic;
}

.proof__text--after {
  color: var(--color-ink);
  font-weight: 500;
}

.proof__arrow {
  align-self: center;
  color: var(--color-accent);
  font-size: 1.3rem;
}

/* ---- Work list (homepage + work index share this) ---- */
.work-list {
  padding: 0 var(--section-padding-x) 8px;
}

.work-list__intro {
  font-size: 0.95rem;
  color: var(--color-muted);
  margin: 6px 0 28px;
  max-width: 520px;
}

.work-list__item {
  border-top: 1px solid var(--color-border);
  padding: 26px 0;
}

.work-list__item--last {
  border-bottom: 1px solid var(--color-border);
}

.work-list__eyebrow {
  margin-bottom: 6px;
}

.work-list__title {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.work-list__meta {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: var(--label-tracking);
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: 12px;
}

.work-list__desc {
  font-size: 0.95rem;
  color: #333;
  max-width: 640px;
  line-height: 1.6;
}

.work-list__result {
  font-size: 0.9rem;
  margin-top: 10px;
}

.work-list__link {
  display: inline-block;
  color: var(--color-ink);
  margin-top: 12px;
}

.work-list__link:hover,
.work-list__link:focus-visible {
  color: var(--color-accent);
}

/* ---- About teaser (homepage only) ---- */
.about-teaser {
  padding: 48px var(--section-padding-x) 64px;
  display: flex;
  gap: 28px;
  align-items: center;
}

.about-teaser__photo {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.about-teaser__body p {
  font-size: 0.95rem;
  color: #333;
  max-width: 560px;
  line-height: 1.65;
}

@media (max-width: 780px) {
  .proof__pair {
    flex-direction: column;
  }

  .proof__arrow {
    transform: rotate(90deg);
  }
}
```

- [ ] **Step 4: Run the assertion again, verify it passes**

Run: `grep -c "Jargon in" index.html`
Expected: `1`

- [ ] **Step 5: Manual browser check**

Run: `python3 -m http.server 8000 --directory "$(pwd)" &` then open `http://localhost:8000/index.html`.

Verify: nav shows the navy badge mark + "Tyler Quackenbush" + "Work"/"Resume" links; hero shows "Jargon in. Clarity out." with the two lede paragraphs; the before/after proof strip renders side by side on desktop and stacked on narrow viewports; all three work-list items show eyebrow/title/meta/description/result/link in that order; the about-teaser shows the real headshot photo (not a broken image icon); footer is navy with white text. Resize below 780px and confirm the hamburger appears and toggles the nav list.

Stop the server: `kill %1` (or note the PID and `kill` it).

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css
git commit -m "Rebuild homepage: Plain-Language Translator hero, proof strip, selected work, about teaser"
```

---

## Task 5: Work index page

**Files:**
- Create: `work.html` (replaces the existing work index)

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "Three engagements" work.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Write the full page**

Create `work.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Work | Tyler Quackenbush</title>
  <meta name="description" content="Case studies in content design and UX writing: Agile Defense, Novant Health, and the University of North Georgia." />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Public+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to content</a>

  <nav class="site-nav">
    <a href="index.html" class="site-nav__brand">
      <svg class="site-nav__mark" width="34" height="34" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="40" height="40" rx="9" fill="#16324A"/>
        <line x1="13" y1="10" x2="13" y2="30" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="13" y1="20" x2="29" y2="20" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
      </svg>
      <span class="site-nav__name">Tyler Quackenbush</span>
    </a>
    <ul class="site-nav__list" id="site-nav-list">
      <li><a href="work.html" class="site-nav__link active">Work</a></li>
      <li><a href="assets/resume.pdf" target="_blank" rel="noopener" class="site-nav__link">Resume</a></li>
    </ul>
    <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-list">
      <span></span><span></span><span></span>
    </button>
  </nav>

  <main id="main-content">
    <section class="work-list work-list--page">
      <h1 class="work-list__page-title">Work</h1>
      <p class="work-list__intro">Three engagements, and the plain-language problem each one actually was.</p>

      <article class="work-list__item">
        <p class="label-mono work-list__eyebrow">01 &middot; Federal</p>
        <h2 class="work-list__title">Agile Defense</h2>
        <p class="work-list__meta">Senior Content Designer &middot; 2021&ndash;Present</p>
        <p class="work-list__desc">Federal content has to satisfy accessibility law, legal review, and an actual human reading it, usually in that order of who complains loudest. I built the content audits, voice and tone standards, and style guide that got all three to agree.</p>
        <p class="work-list__result"><strong>Result:</strong> 40+ initiatives delivered on time, 90% stakeholder satisfaction.</p>
        <a href="work/agile-defense.html" class="label-mono work-list__link">Read the case study &rarr;</a>
      </article>

      <article class="work-list__item">
        <p class="label-mono work-list__eyebrow">02 &middot; Healthcare</p>
        <h2 class="work-list__title">Novant Health</h2>
        <p class="work-list__meta">UX Content Designer &middot; Accrue Partners &middot; 2021</p>
        <p class="work-list__desc">Patients hit a scheduling flow that technically worked, the way a filing cabinet works if you already know which drawer. I rewrote the patient-facing content into new templates and design-system components across the system-wide redesign.</p>
        <p class="work-list__result"><strong>Result:</strong> 50+ content pages shipped weekly, revision cycles cut to under 10 minutes a page.</p>
        <a href="work/novant-health.html" class="label-mono work-list__link">Read the case study &rarr;</a>
      </article>

      <article class="work-list__item work-list__item--last">
        <p class="label-mono work-list__eyebrow">03 &middot; Higher Ed</p>
        <h2 class="work-list__title">University of North Georgia</h2>
        <p class="work-list__meta">Web Designer &middot; 2016&ndash;2021</p>
        <p class="work-list__desc">A public university site grows one department at a time, for twenty years, with nobody in charge of the whole thing. Mine had 20-plus navigation menus. I decided what stayed, what merged, and what finally got cut.</p>
        <p class="work-list__result"><strong>Result:</strong> 35% increase in engagement across a 5,000+ page site.</p>
        <a href="work/ung.html" class="label-mono work-list__link">Read the case study &rarr;</a>
      </article>
    </section>
  </main>

  <footer class="site-footer">
    <span class="site-footer__name">Tyler Quackenbush</span>
    <a href="mailto:tyler.qbush@gmail.com" class="site-footer__email">tyler.qbush@gmail.com</a>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

Note: the "Also along the way" section for ACCT International and Adventure Careers is intentionally not added here yet — it ships in Phase 2 once those two pages are rebuilt into the new template. Adding it now would link to pages still in the old visual style.

- [ ] **Step 3: Add the work-index-specific CSS**

Append to `css/styles.css`:

```css
/* ---- Work index page (standalone page, not homepage teaser) ---- */
.work-list--page {
  padding-top: var(--section-padding-y);
}

.work-list__page-title {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  margin-bottom: 8px;
}
```

- [ ] **Step 4: Run the assertion again, verify it passes**

Run: `grep -c "Three engagements" work.html`
Expected: `1`

- [ ] **Step 5: Manual browser check**

With the local server running (`python3 -m http.server 8000 --directory "$(pwd)" &`), open `http://localhost:8000/work.html`. Verify: "Work" nav link shows as active (full opacity), page title "Work" renders above the intro line, all three case studies list in the locked order (Agile Defense, Novant Health, UNG), and each "Read the case study" link points to the right path (`work/agile-defense.html`, `work/novant-health.html`, `work/ung.html` — these don't exist yet until the next tasks, so expect 404s until Task 6-8 land). Stop the server: `kill %1`.

- [ ] **Step 6: Commit**

```bash
git add work.html css/styles.css
git commit -m "Rebuild work index with text-forward case study list in locked order"
```

---

## Task 6: Case study — Agile Defense

**Files:**
- Create: `work/agile-defense.html`
- Delete: `work/discovery-practice.html` (replaced — the program-specific framing is superseded by this broader content-design case study per the spec)

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "same sentence" work/agile-defense.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Write the full page**

Create `work/agile-defense.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Agile Defense | Tyler Quackenbush</title>
  <meta name="description" content="Building the content audits, voice and tone standards, and legal/compliance workflow behind 40+ federal and commercial content initiatives at Agile Defense." />
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Public+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css" />
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to content</a>

  <nav class="site-nav">
    <a href="../index.html" class="site-nav__brand">
      <svg class="site-nav__mark" width="34" height="34" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="40" height="40" rx="9" fill="#16324A"/>
        <line x1="13" y1="10" x2="13" y2="30" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="13" y1="20" x2="29" y2="20" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
      </svg>
      <span class="site-nav__name">Tyler Quackenbush</span>
    </a>
    <ul class="site-nav__list" id="site-nav-list">
      <li><a href="../work.html" class="site-nav__link active">Work</a></li>
      <li><a href="../assets/resume.pdf" target="_blank" rel="noopener" class="site-nav__link">Resume</a></li>
    </ul>
    <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-list">
      <span></span><span></span><span></span>
    </button>
  </nav>

  <main id="main-content">
    <section class="cs">
      <a href="../work.html" class="label-mono cs__back">&larr; All case studies</a>
      <p class="label-mono cs__eyebrow">01 &middot; Federal</p>
      <h1 class="cs__title">Getting legal, compliance, and design to agree on the same sentence, before it shipped</h1>
      <p class="cs__meta">Senior Content Designer &middot; Agile Defense (formerly Intellibridge) &middot; 2021&ndash;Present</p>

      <div class="cs-stats">
        <div class="cs-stat">
          <span class="cs-stat__value" data-count-to="40" data-count-suffix="+">0+</span>
          <p class="label-mono cs-stat__label">Initiatives delivered on time</p>
        </div>
        <div class="cs-stat">
          <span class="cs-stat__value" data-count-to="90" data-count-suffix="%">0%</span>
          <p class="label-mono cs-stat__label">Stakeholder satisfaction</p>
        </div>
        <div class="cs-stat">
          <span class="cs-stat__value" data-count-to="70" data-count-suffix="%">0%</span>
          <p class="label-mono cs-stat__label">Reduction in scope ambiguity</p>
        </div>
        <div class="cs-stat">
          <span class="cs-stat__value" data-count-to="100" data-count-suffix="%">0%</span>
          <p class="label-mono cs-stat__label">On-time delivery record</p>
        </div>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Situation</h2>
        <p class="cs-section__body">Federal content has three approvers who rarely agree: an accessibility standard, a legal or compliance reviewer, and the person actually trying to complete a task on the page. Most projects treated those as sequential hurdles, so content got rewritten three times by three different people, on federal and commercial engagements running on Agile and SAFe timelines. Nobody owned the words, and rework ate the schedule.</p>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Approach</h2>
        <p class="cs-section__body">I built the standards teams needed to stop guessing: content audits across the affected products to flag what to keep, revise, consolidate, or cut, then voice and tone guidelines and a style guide that became the shared reference, not just documentation nobody opened. I sat directly with legal and compliance reviewers on federal engagements so 508 and regulatory requirements got resolved before launch, not after. And because a lot of our schedule slippage traced back to unclear project scope, I co-led an intake framework that made teams answer the hard questions on day one instead of week six.</p>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Outcome</h2>
        <p class="cs-section__body">The guidelines got adopted across design teams, not just used once and shelved. Scope ambiguity dropped 70%. Across more than 40 initiatives, we hit a 100% on-time delivery record and 90% stakeholder satisfaction &mdash; numbers I still track, because "the client didn't complain" isn't actually a metric.</p>
        <ul class="cs-outcome-list">
          <li>40+ design and content initiatives delivered, 100% on time</li>
          <li>90% stakeholder satisfaction across engagements</li>
          <li>70% reduction in scope ambiguity from the new intake framework</li>
        </ul>
      </div>

      <div class="cs-next">
        <p class="label-mono">Next case study</p>
        <a href="novant-health.html" class="cs-next__link">Novant Health &rarr;</a>
      </div>

      <div class="cs-cta">
        <p>Want to talk about a role like this?</p>
        <div class="cs-cta__links">
          <a href="mailto:tyler.qbush@gmail.com" class="btn btn--primary">Get in touch</a>
          <a href="../work.html" class="label-mono cs-cta__all">All case studies &rarr;</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <span class="site-footer__name">Tyler Quackenbush</span>
    <a href="mailto:tyler.qbush@gmail.com" class="site-footer__email">tyler.qbush@gmail.com</a>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Add the case-study template CSS** (shared by all case study pages — only written once, here)

Append to `css/styles.css`:

```css
/* ---- Case study template (shared by all case study pages) ---- */
.cs {
  padding: var(--section-padding-y) var(--section-padding-x);
  max-width: 800px;
}

.cs__back {
  display: inline-block;
  color: var(--color-ink);
  margin-bottom: 24px;
}

.cs__back:hover,
.cs__back:focus-visible {
  color: var(--color-accent);
}

.cs__eyebrow {
  margin-bottom: 10px;
}

.cs__title {
  font-size: clamp(1.7rem, 4vw, 2.3rem);
  margin-bottom: 16px;
}

.cs__meta {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: var(--label-tracking);
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: 32px;
}

.cs-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 48px;
}

.cs-stat {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 18px 16px;
}

.cs-stat__value {
  display: block;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.7rem;
  color: var(--color-accent-strong);
  margin-bottom: 6px;
}

.cs-stat__label {
  color: var(--color-muted);
  font-size: 0.65rem;
}

.cs-section {
  margin-bottom: 36px;
}

.cs-section__label {
  margin-bottom: 10px;
}

.cs-section__body {
  font-size: 1rem;
  color: #333;
  line-height: 1.65;
}

.cs-outcome-list {
  list-style: none;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cs-outcome-list li {
  font-size: 0.9rem;
  color: var(--color-ink-dim);
  padding-left: 18px;
  position: relative;
}

.cs-outcome-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent-strong);
}

.cs-next {
  border-top: 1px solid var(--color-border);
  padding-top: 24px;
  margin-top: 8px;
  margin-bottom: 32px;
}

.cs-next__link {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 1.3rem;
  display: inline-block;
  margin-top: 6px;
  color: var(--color-ink);
}

.cs-next__link:hover,
.cs-next__link:focus-visible {
  color: var(--color-accent);
}

.cs-cta {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 28px;
  text-align: center;
}

.cs-cta p {
  font-size: 1.05rem;
  margin-bottom: 16px;
}

.cs-cta__links {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.cs-cta__all {
  color: var(--color-ink);
}

.cs-cta__all:hover,
.cs-cta__all:focus-visible {
  color: var(--color-accent);
}

@media (max-width: 700px) {
  .cs-stats {
    grid-template-columns: 1fr 1fr;
  }
}
```

- [ ] **Step 4: Delete the superseded page**

```bash
git rm work/discovery-practice.html
```

- [ ] **Step 5: Run the assertion again, verify it passes**

Run: `grep -c "same sentence" work/agile-defense.html`
Expected: `1`

- [ ] **Step 6: Manual browser check**

With the local server running, open `http://localhost:8000/work/agile-defense.html`. Verify: back link goes to Work, eyebrow reads "01 · FEDERAL", the four stat numbers count up from 0 on scroll into view (40+, 90%, 70%, 100%), Situation/Approach/Outcome sections render in order with the outcome bullet list beneath, "Next case study" links to Novant Health, and the closing CTA block shows both links. Check that the favicon and stylesheet load correctly from the `work/` subdirectory (relative `../` paths).

- [ ] **Step 7: Commit**

```bash
git add work/agile-defense.html css/styles.css
git commit -m "Add Agile Defense case study, replacing Discovery Practice framing; add shared case-study template CSS"
```

---

## Task 7: Case study — Novant Health

**Files:**
- Modify: `work/novant-health.html` (full rewrite — replaces the existing brand/visual-design framing with the content-design rewrite from the spec; the old file's supporting gallery images are no longer used per the "text-only, no exceptions" decision)

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "scheduling maze" work/novant-health.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Write the full page**

Create `work/novant-health.html` (overwrite existing):

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Novant Health | Tyler Quackenbush</title>
  <meta name="description" content="Rewriting patient-facing content into new templates and design-system components for a system-wide healthcare website redesign." />
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Public+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css" />
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to content</a>

  <nav class="site-nav">
    <a href="../index.html" class="site-nav__brand">
      <svg class="site-nav__mark" width="34" height="34" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="40" height="40" rx="9" fill="#16324A"/>
        <line x1="13" y1="10" x2="13" y2="30" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="13" y1="20" x2="29" y2="20" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
      </svg>
      <span class="site-nav__name">Tyler Quackenbush</span>
    </a>
    <ul class="site-nav__list" id="site-nav-list">
      <li><a href="../work.html" class="site-nav__link active">Work</a></li>
      <li><a href="../assets/resume.pdf" target="_blank" rel="noopener" class="site-nav__link">Resume</a></li>
    </ul>
    <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-list">
      <span></span><span></span><span></span>
    </button>
  </nav>

  <main id="main-content">
    <section class="cs">
      <a href="../work.html" class="label-mono cs__back">&larr; All case studies</a>
      <p class="label-mono cs__eyebrow">02 &middot; Healthcare</p>
      <h1 class="cs__title">Turning a scheduling maze into content patients could actually follow</h1>
      <p class="cs__meta">UX Content Designer &middot; Novant Health (via Accrue Partners) &middot; 2021</p>

      <div class="cs-stats">
        <div class="cs-stat">
          <span class="cs-stat__value" data-count-to="50" data-count-suffix="+">0+</span>
          <p class="label-mono cs-stat__label">Content pages shipped weekly</p>
        </div>
        <div class="cs-stat">
          <span class="cs-stat__value">&lt;10 min</span>
          <p class="label-mono cs-stat__label">Revision cycle per page</p>
        </div>
        <div class="cs-stat">
          <span class="cs-stat__value" data-count-to="75" data-count-suffix="%">0%</span>
          <p class="label-mono cs-stat__label">Faster image asset migration</p>
        </div>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Situation</h2>
        <p class="cs-section__body">Novant Health's scheduling flow technically worked, the way a filing cabinet works if you already know which drawer. Patients didn't have that map, and neither did a lot of providers. The system-wide redesign meant migrating years of patient-facing content, built by different teams at different times, into new templates and a new design system, all while keeping it accurate, accessible, and compliant.</p>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Approach</h2>
        <p class="cs-section__body">I worked embedded with the design team in Figma, rewriting and restructuring content page by page instead of copy-pasting the old version into a new template and calling it done. That meant deciding, for each page, what a patient actually needed to know first (can I get an appointment this week) versus what could move lower (billing codes, provider credentialing language). I also rebuilt how the team found and reused image assets, which sounds like a small thing until you're the third person that week hunting for the same photo.</p>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Outcome</h2>
        <p class="cs-section__body">Fifty-plus content pages shipped weekly, with revision cycles down to under 10 minutes a page &mdash; fast enough that stakeholders could review same-day instead of waiting on a Friday batch. Asset search time dropped 75%. The scheduling flow patients hit now reads like someone actually expected a human on the other end of it.</p>
        <ul class="cs-outcome-list">
          <li>50+ high-fidelity content pages built weekly in Figma</li>
          <li>Revision cycles cut to under 10 minutes per page</li>
          <li>75% faster image asset search and retrieval</li>
        </ul>
      </div>

      <div class="cs-next">
        <p class="label-mono">Next case study</p>
        <a href="ung.html" class="cs-next__link">University of North Georgia &rarr;</a>
      </div>

      <div class="cs-cta">
        <p>Want to talk about a role like this?</p>
        <div class="cs-cta__links">
          <a href="mailto:tyler.qbush@gmail.com" class="btn btn--primary">Get in touch</a>
          <a href="../work.html" class="label-mono cs-cta__all">All case studies &rarr;</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <span class="site-footer__name">Tyler Quackenbush</span>
    <a href="mailto:tyler.qbush@gmail.com" class="site-footer__email">tyler.qbush@gmail.com</a>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Run the assertion again, verify it passes**

Run: `grep -c "scheduling maze" work/novant-health.html`
Expected: `1`

- [ ] **Step 4: Manual browser check**

Open `http://localhost:8000/work/novant-health.html`. Verify the same structural checklist as Task 6 (back link, eyebrow "02 · HEALTHCARE", three stats — note the middle stat, "<10 min", is static text with no `data-count-to`, since it's not a countable integer — Situation/Approach/Outcome, Next links to UNG, closing CTA).

- [ ] **Step 5: Commit**

```bash
git add work/novant-health.html
git commit -m "Rewrite Novant Health case study through a content-design lens, drop supporting gallery images"
```

---

## Task 8: Case study — University of North Georgia

**Files:**
- Create: `work/ung.html`

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "20-plus navigation menus" work/ung.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Write the full page**

Create `work/ung.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>University of North Georgia | Tyler Quackenbush</title>
  <meta name="description" content="Site-wide content and information architecture redesign across a 5,000+ page public university site." />
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Public+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css" />
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to content</a>

  <nav class="site-nav">
    <a href="../index.html" class="site-nav__brand">
      <svg class="site-nav__mark" width="34" height="34" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="40" height="40" rx="9" fill="#16324A"/>
        <line x1="13" y1="10" x2="13" y2="30" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="13" y1="20" x2="29" y2="20" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
      </svg>
      <span class="site-nav__name">Tyler Quackenbush</span>
    </a>
    <ul class="site-nav__list" id="site-nav-list">
      <li><a href="../work.html" class="site-nav__link active">Work</a></li>
      <li><a href="../assets/resume.pdf" target="_blank" rel="noopener" class="site-nav__link">Resume</a></li>
    </ul>
    <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-list">
      <span></span><span></span><span></span>
    </button>
  </nav>

  <main id="main-content">
    <section class="cs">
      <a href="../work.html" class="label-mono cs__back">&larr; All case studies</a>
      <p class="label-mono cs__eyebrow">03 &middot; Higher Ed</p>
      <h1 class="cs__title">Cutting 20-plus navigation menus down to one a student could use</h1>
      <p class="cs__meta">Web Designer &middot; University of North Georgia &middot; 2016&ndash;2021</p>

      <div class="cs-stats">
        <div class="cs-stat">
          <span class="cs-stat__value" data-count-to="35" data-count-suffix="%">0%</span>
          <p class="label-mono cs-stat__label">Increase in engagement</p>
        </div>
        <div class="cs-stat">
          <span class="cs-stat__value" data-count-to="5000" data-count-suffix="+">0+</span>
          <p class="label-mono cs-stat__label">Pages redesigned</p>
        </div>
        <div class="cs-stat">
          <span class="cs-stat__value" data-count-to="20000" data-count-suffix="+">0+</span>
          <p class="label-mono cs-stat__label">Users on the 2FA onboarding flow</p>
        </div>
        <div class="cs-stat">
          <span class="cs-stat__value" data-count-to="20" data-count-suffix="+">0+</span>
          <p class="label-mono cs-stat__label">Navigation menus consolidated</p>
        </div>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Situation</h2>
        <p class="cs-section__body">A public university site grows the way most of them do: one department adds a page, then a menu, then a sub-menu, for twenty years, with nobody responsible for the whole thing. By the time I got there, the site had grown past 5,000 pages and 20-plus separate navigation structures, and admissions alone was pulling more than a million views a year through a maze nobody had audited.</p>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Approach</h2>
        <p class="cs-section__body">I led the content and information-architecture side of a site-wide redesign: deciding what to keep, merge, or cut across those navigation menus, building new content templates and landing pages, and designing custom iconography so the admissions section could be scanned instead of read line by line. Later, when the university rolled out two-factor authentication, I built and shipped the onboarding landing page that walked 20,000-plus users through it without a support ticket spike.</p>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Outcome</h2>
        <p class="cs-section__body">Engagement rose 35% across the redesign. Twenty-plus menus became one structure people could actually navigate. I still think about that project every time a client asks me to "just add one more link" to a nav bar that already has twelve.</p>
        <ul class="cs-outcome-list">
          <li>35% increase in engagement site-wide</li>
          <li>5,000+ pages restructured</li>
          <li>20+ navigation menus consolidated into one structure</li>
          <li>2FA onboarding landing page shipped for 20,000+ users</li>
        </ul>
      </div>

      <div class="cs-next">
        <p class="label-mono">Next case study</p>
        <a href="agile-defense.html" class="cs-next__link">Agile Defense &rarr;</a>
      </div>

      <div class="cs-cta">
        <p>Want to talk about a role like this?</p>
        <div class="cs-cta__links">
          <a href="mailto:tyler.qbush@gmail.com" class="btn btn--primary">Get in touch</a>
          <a href="../work.html" class="label-mono cs-cta__all">All case studies &rarr;</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <span class="site-footer__name">Tyler Quackenbush</span>
    <a href="mailto:tyler.qbush@gmail.com" class="site-footer__email">tyler.qbush@gmail.com</a>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>
```

Note the `cs-next` link here loops back to Agile Defense, closing the three-way chain (Agile Defense → Novant Health → UNG → Agile Defense) as described in the spec.

- [ ] **Step 3: Run the assertion again, verify it passes**

Run: `grep -c "20-plus navigation menus" work/ung.html`
Expected: `1`

- [ ] **Step 4: Manual browser check**

Open `http://localhost:8000/work/ung.html`. Verify the same structural checklist, plus confirm the "Next case study" link loops back to `agile-defense.html` (completing the chain), and the four stat numbers (35%, 5,000+, 20,000+, 20+) all count up correctly, including the two 4-5 digit ones.

- [ ] **Step 5: Commit**

```bash
git add work/ung.html
git commit -m "Add University of North Georgia case study"
```

---

## Task 9: Swap in the tailored resume

**Files:**
- Modify: `assets/resume.pdf` (replaced with the version tailored to "Senior UX Content Writer / Content Strategist")

- [ ] **Step 1: Copy the new resume into place**

```bash
cp "/Users/tyler/Desktop/Tyler_Quackenbush_Resume_UXContentWriter.pdf" "assets/resume.pdf"
```

- [ ] **Step 2: Verify the file changed**

Run: `git status --short assets/resume.pdf`
Expected: ` M assets/resume.pdf`

- [ ] **Step 3: Commit**

```bash
git add assets/resume.pdf
git commit -m "Swap in resume tailored to Senior UX Content Writer / Content Strategist"
```

---

## Task 10: Full-site verification pass

**Files:** none (verification only)

- [ ] **Step 1: Check for broken internal links within Phase 1's scope**

Run:
```bash
python3 -m http.server 8000 --directory "$(pwd)" &
sleep 1
for path in "index.html" "work.html" "work/agile-defense.html" "work/novant-health.html" "work/ung.html" "assets/favicon.svg" "assets/resume.pdf" "css/styles.css" "js/main.js" "assets/images/Headshot.jpeg"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/$path")
  echo "$path -> $code"
done
kill %1
```

Expected: every path returns `200`. If `assets/images/Headshot.jpeg` returns `404`, check the actual filename casing in `assets/images/` (case-sensitive on Cloudflare Pages even if the local filesystem isn't) and fix the `<img src>` in `index.html` to match exactly.

- [ ] **Step 2: Confirm no dead links to Phase-2-only pages exist yet**

Run: `grep -rn "about.html\|contact.html\|brand-identity.html\|design-system" index.html work.html work/agile-defense.html work/novant-health.html work/ung.html`
Expected: no output (empty) — Phase 1 intentionally has no links to pages that don't exist until Phase 2.

- [ ] **Step 3: Verify old pages that no longer belong are actually gone or untouched appropriately**

Run: `git status --short`
Expected: `work/discovery-practice.html` shows as deleted (from Task 6); `about.html`, `ai.html`, `tools.html`, `contact.html`, `work/acct-international.html`, `work/adventure-careers.html` are untouched and still exist in their old form — that's expected, they're in scope for Phase 2, not this plan. They're simply not linked from anywhere in the new nav yet.

- [ ] **Step 4: Visual pass across breakpoints**

With the server running, open `index.html`, `work.html`, and each case study at desktop width (1280px), tablet width (768px), and mobile width (375px). Confirm: no horizontal scrollbar at any width, the stat grid drops from 4 columns to 2 columns under 700px (case studies) without overlap, the hamburger menu opens/closes and traps no focus incorrectly, and body text stays readable (no text touching viewport edges) at 375px.

- [ ] **Step 5: Commit any fixes found during verification**

If Steps 1-4 surfaced any fix, make it, then:

```bash
git add -A
git commit -m "Fix issues found in Phase 1 verification pass"
```

If nothing needed fixing, skip this step — no empty commits.

---

## Task 11: Deployment prep (Cloudflare Pages)

**Files:** none (infrastructure step, gated on user confirmation before any push)

- [ ] **Step 1: Confirm before pushing anywhere**

This repo currently has no GitHub remote (`git remote -v` returns nothing). Before running any of the commands below, confirm with the user: which GitHub account/org the repo should live in, whether it should be public or private, and get explicit go-ahead to push. Do not run `gh repo create` or `git push` without that confirmation, even if the rest of this task is otherwise ready.

- [ ] **Step 2: Create the GitHub repo and push (only after confirmation)**

```bash
gh repo create <owner>/<repo-name> --private --source=. --remote=origin
git push -u origin master
```

(Replace `<owner>/<repo-name>` with whatever was confirmed in Step 1. Use `--public` instead of `--private` if that's what was confirmed.)

- [ ] **Step 3: Connect Cloudflare Pages**

In the Cloudflare dashboard: Workers & Pages → Create → Pages → Connect to Git → select the repo pushed in Step 2. Build settings: **Framework preset:** None, **Build command:** (leave empty), **Build output directory:** `/`. Save and deploy.

- [ ] **Step 4: Verify the deployed site**

Once Cloudflare Pages finishes its first build, open the `*.pages.dev` URL it generates and re-run the same manual checklist from Task 10, Step 4, against the live deployment instead of localhost.

- [ ] **Step 5: Connect the custom domain**

Once the domain purchase (handled separately by the user through Cloudflare) is complete, connect it in the same Pages project under Custom Domains. This is a dashboard action with no code change, so there's nothing to commit here.
