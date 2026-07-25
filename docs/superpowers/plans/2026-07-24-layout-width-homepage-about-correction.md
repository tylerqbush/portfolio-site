# Layout Width & Homepage/About Correction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the site-wide layout width problem (no consistent centered container, content flush-left on wide screens) and restructure the homepage and About page to match gabbyhon.com's numbered-section pattern, per the spec correction dated 2026-07-24.

**Architecture:** Same as Phase 1 — plain multi-page static HTML/CSS/JS, no build step. This plan modifies the shared `css/styles.css`, updates nav/footer markup on 5 existing pages, rewrites `index.html`, and creates `about.html` for the first time.

**Tech Stack:** Same as Phase 1 (HTML5, CSS custom properties, vanilla JS).

**Testing approach:** Same grep-assertion + manual browser check pattern used in Phase 1. No test framework, no build step.

---

## Task 1: CSS foundation for the width fix and new components

**Files:**
- Modify: `css/styles.css` (append/modify — do not remove anything unrelated)

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c -- "--content-max-width" css/styles.css 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Add the content-max-width token**

In `css/styles.css`, inside the `:root { ... }` block, add this line right after `--label-tracking: 0.08em;`:

```css
  --content-max-width: 1120px;
```

- [ ] **Step 3: Restructure `.site-nav` to use an inner wrap**

Find the existing `.site-nav` rule:

```css
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
```

Replace it with:

```css
.site-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  z-index: 50;
}

.site-nav__wrap {
  max-width: var(--content-max-width);
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 4vw, 48px);
}
```

- [ ] **Step 4: Restructure `.site-footer` to use an inner wrap**

Find the existing `.site-footer` rule:

```css
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
```

Replace it with:

```css
.site-footer {
  background: var(--color-ink);
  color: #fff;
}

.site-footer__wrap {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 28px clamp(20px, 4vw, 48px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
```

- [ ] **Step 5: Center and cap the hero**

Find `.hero { padding: 60px var(--section-padding-x) 48px; max-width: 800px; }` and replace the `max-width: 800px;` line with:

```css
  max-width: var(--content-max-width);
  margin: 0 auto;
```

(full rule becomes `padding: 60px var(--section-padding-x) 48px; max-width: var(--content-max-width); margin: 0 auto;`)

- [ ] **Step 6: Remove `.hero__lede` and add a generic `.lede` class**

Find and delete this rule entirely:

```css
.hero__lede {
  font-size: 1.05rem;
  color: var(--color-ink-dim);
  max-width: 560px;
  margin-bottom: 12px;
}
```

In its place, add:

```css
.lede {
  font-size: 1.05rem;
  color: var(--color-ink-dim);
  max-width: 640px;
  margin-bottom: 12px;
}
```

- [ ] **Step 7: Add the `.work-intro` section (homepage "01 The Work")**

Add this new rule block right after the `.hero__ctas` rule:

```css
/* ---- 01 The Work (homepage) ---- */
.work-intro {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--section-padding-x) 56px;
}

.work-intro .label-mono {
  margin-bottom: 14px;
}
```

- [ ] **Step 8: Simplify `.proof` — it's now nested inside `.work-intro`, so drop its own horizontal padding**

Find:

```css
.proof {
  padding: 0 var(--section-padding-x) 56px;
}
```

Replace with:

```css
.proof {
  margin-top: 28px;
}
```

(Leave every other `.proof__*` rule untouched.)

- [ ] **Step 9: Center and cap `.work-list`**

Find `.work-list { padding: 0 var(--section-padding-x) 8px; }` and add `max-width: var(--content-max-width); margin: 0 auto;` to it, so it reads:

```css
.work-list {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--section-padding-x) 8px;
}
```

- [ ] **Step 10: Add the `.approach` section (homepage "03 The Approach") and its 3-step grid**

Add this new rule block after the work-list rules (before the `/* ---- About teaser ---- */` comment, or at the end of the homepage section if that comment no longer exists):

```css
/* ---- 03 The Approach (homepage) ---- */
.approach {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 48px var(--section-padding-x) 8px;
}

.approach .label-mono {
  margin-bottom: 24px;
}

.approach__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.approach__step-num {
  margin-bottom: 10px;
}

.approach__step-title {
  font-size: 1.15rem;
  margin-bottom: 8px;
}

.approach__step-desc {
  font-size: 0.9rem;
  color: var(--color-ink-dim);
  line-height: 1.6;
}

@media (max-width: 780px) {
  .approach__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
```

- [ ] **Step 11: Add the `.cta-band` closing section**

Add this new rule block right after the `.approach` rules:

```css
/* ---- Closing CTA band (homepage + about) ---- */
.cta-band {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 56px var(--section-padding-x) 64px;
  text-align: center;
}

.cta-band__title {
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  max-width: 640px;
  margin: 0 auto 24px;
}

.cta-band__links {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-band__link {
  color: var(--color-ink);
}

.cta-band__link:hover,
.cta-band__link:focus-visible {
  color: var(--color-accent);
}
```

- [ ] **Step 12: Remove the now-unused `.about-teaser` rules (dropped from the homepage per the spec correction)**

Find and delete these four rules entirely: `.about-teaser`, `.about-teaser__photo`, `.about-teaser__body p`, and the `.about-teaser__body p` reference inside any media query if present. (There is no `.about-teaser` usage anywhere else in the site after this plan's Task 3, so this is safe dead-code removal, not a behavior change.)

- [ ] **Step 13: Center and cap the case-study `.cs` container**

Find `.cs { padding: var(--section-padding-y) var(--section-padding-x); max-width: 800px; }` and add `margin: 0 auto;`:

```css
.cs {
  padding: var(--section-padding-y) var(--section-padding-x);
  max-width: 800px;
  margin: 0 auto;
}
```

(Case-study body text intentionally stays narrower than the 1120px content-max-width for readability — per the spec correction, it just needs to be centered instead of flush-left, which this fixes.)

- [ ] **Step 14: Run the assertion again, verify it passes**

Run: `grep -c -- "--content-max-width" css/styles.css`
Expected: `1` (only the `:root` declaration — Steps 3-13 all reference it via `var(--content-max-width)`, which won't match the literal string `--content-max-width`)

- [ ] **Step 15: Commit**

```bash
git add css/styles.css
git commit -m "Add site-wide 1120px content max-width; new .approach and .cta-band components"
```

---

## Task 2: Add nav wrap, footer wrap, and About link across the 5 existing pages

**Files:**
- Modify: `index.html`, `work.html`, `work/agile-defense.html`, `work/novant-health.html`, `work/ung.html`

This is the same mechanical change repeated identically across 5 files. For each file, make both edits below.

- [ ] **Step 1: Write the failing assertion (checked once, against index.html, as a representative sample)**

Run: `grep -c "site-nav__wrap" index.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Edit `index.html`**

Find:

```html
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
```

Replace with:

```html
  <nav class="site-nav">
    <div class="site-nav__wrap">
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
        <li><a href="about.html" class="site-nav__link">About</a></li>
        <li><a href="assets/resume.pdf" target="_blank" rel="noopener" class="site-nav__link">Resume</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-list">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
```

Then find:

```html
  <footer class="site-footer">
    <span class="site-footer__name">Tyler Quackenbush</span>
    <a href="mailto:tyler.qbush@gmail.com" class="site-footer__email">tyler.qbush@gmail.com</a>
  </footer>
```

Replace with:

```html
  <footer class="site-footer">
    <div class="site-footer__wrap">
      <span class="site-footer__name">Tyler Quackenbush</span>
      <a href="mailto:tyler.qbush@gmail.com" class="site-footer__email">tyler.qbush@gmail.com</a>
    </div>
  </footer>
```

- [ ] **Step 3: Edit `work.html`**

Same two replacements as Step 2, except the nav's "Work" link keeps `class="site-nav__link active"` (it's already active on this page) — insert the About link the same way: `<li><a href="about.html" class="site-nav__link">About</a></li>` right after the Work `<li>`. Wrap the footer identically.

- [ ] **Step 4: Edit `work/agile-defense.html`, `work/novant-health.html`, `work/ung.html`**

Same two replacements, but every href needs the `../` prefix consistent with the rest of each file (`../index.html`, `../work.html`, `../about.html`, `../assets/resume.pdf`, and the SVG mark is identical). The "Work" link keeps `class="site-nav__link active"` on all three (already the case). Insert `<li><a href="../about.html" class="site-nav__link">About</a></li>` right after the Work `<li>` in each file. Wrap each footer identically to Step 2's pattern.

- [ ] **Step 5: Run the assertion again, verify it passes**

Run: `grep -c "site-nav__wrap" index.html`
Expected: `1`

Then confirm all 5 files were updated:
Run: `grep -l "site-nav__wrap" index.html work.html work/agile-defense.html work/novant-health.html work/ung.html`
Expected: all 5 filenames listed

Run: `grep -l "site-footer__wrap" index.html work.html work/agile-defense.html work/novant-health.html work/ung.html`
Expected: all 5 filenames listed

Run: `grep -c 'about.html' index.html work.html work/agile-defense.html work/novant-health.html work/ung.html`
Expected: at least 1 for each (About nav link present; about.html itself doesn't exist until Task 4, so this will still 404 if clicked right now — that's expected mid-task)

- [ ] **Step 6: Commit**

```bash
git add index.html work.html work/agile-defense.html work/novant-health.html work/ung.html
git commit -m "Add nav/footer wrap containers and About nav link across all pages"
```

---

## Task 3: Restructure the homepage body

**Files:**
- Modify: `index.html` (body content only — nav/footer already updated in Task 2)

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "The Approach" index.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Replace the homepage body content**

Find everything between `<main id="main-content">` and `</main>` in `index.html` (the hero section through the about-teaser section) and replace it entirely with:

```html
  <main id="main-content">
    <section class="hero">
      <p class="label-mono hero__eyebrow">UX Content Designer &middot; 8 Years</p>
      <h1 class="hero__title">Jargon in.<br />Clarity out.</h1>
      <div class="hero__ctas">
        <a href="work.html" class="btn btn--primary">View case studies</a>
        <a href="assets/resume.pdf" target="_blank" rel="noopener" class="btn btn--outline">Download resume</a>
      </div>
    </section>

    <section class="work-intro">
      <p class="label-mono">01 &middot; The Work</p>
      <p class="lede">I'm Tyler. I take dense legal, clinical, and technical language and turn it into something a person can act on in five seconds instead of re-reading three times.</p>
      <p class="lede">Eight years doing this for hospitals, a federal contractor, and a public university. Most recently: rewriting error messages and account flows so people stop calling support to ask what a sentence meant.</p>

      <div class="proof">
        <div class="proof__pair">
          <div class="proof__col">
            <p class="label-mono proof__label">Before &mdash; Legal Draft</p>
            <p class="proof__text proof__text--before">"Failure to submit required documentation within the specified timeframe may result in delay or denial of the requested action."</p>
          </div>
          <span class="proof__arrow" aria-hidden="true">&rarr;</span>
          <div class="proof__col">
            <p class="label-mono proof__label">After &mdash; What Shipped</p>
            <p class="proof__text proof__text--after">"Submit your documents by March 3, or we can't process your request."</p>
          </div>
        </div>
      </div>
    </section>

    <section class="work-list">
      <p class="label-mono">02 &middot; Selected Work</p>
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
        <p class="work-list__desc">A public university site grows one department at a time, for twenty years, and nobody's responsible for the whole thing. Mine had 20-plus navigation menus. I decided what stayed, what merged, and what finally got cut.</p>
        <p class="work-list__result"><strong>Result:</strong> 35% increase in engagement across a 5,000+ page site.</p>
        <a href="work/ung.html" class="label-mono work-list__link">Read the case study &rarr;</a>
      </article>
    </section>

    <section class="approach">
      <p class="label-mono">03 &middot; The Approach</p>
      <div class="approach__grid">
        <div class="approach__step">
          <p class="label-mono approach__step-num">01</p>
          <h3 class="approach__step-title">Audit</h3>
          <p class="approach__step-desc">Read what's already live and flag what's unclear, redundant, or failing an accessibility check before writing anything new.</p>
        </div>
        <div class="approach__step">
          <p class="label-mono approach__step-num">02</p>
          <h3 class="approach__step-title">Draft</h3>
          <p class="approach__step-desc">Write the plain-language version first. Then fold back in the legal, brand, or technical requirements without losing the clarity.</p>
        </div>
        <div class="approach__step">
          <p class="label-mono approach__step-num">03</p>
          <h3 class="approach__step-title">Ship</h3>
          <p class="approach__step-desc">Test it with the people who'll actually push back &mdash; legal, dev, a real user &mdash; and hold the line through revisions.</p>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <h2 class="cta-band__title">There's always a clearer way to say it. Let's find it.</h2>
      <div class="cta-band__links">
        <a href="mailto:tyler.qbush@gmail.com" class="btn btn--primary">Get in touch</a>
        <a href="about.html" class="label-mono cta-band__link">More about me &rarr;</a>
      </div>
    </section>
  </main>
```

Note: the case-study eyebrows inside the "02 · Selected Work" list (e.g. "01 · Federal") are a separate, pre-existing numbering scheme for the case studies themselves — unrelated to the page-level "01/02/03" section numbering. This nested-but-distinct numbering already existed before this task and is intentional (matches how the case study pages number themselves independently).

- [ ] **Step 3: Run the assertion again, verify it passes**

Run: `grep -c "The Approach" index.html`
Expected: `1`

- [ ] **Step 4: Manual verification check**

Start a local server: `python3 -m http.server 8000 --directory "$(pwd)" &`
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/index.html` → should be 200
- `curl -s http://localhost:8000/index.html | grep -c 'hero__lede'` → should be 0 (old class fully removed from hero)
- `curl -s http://localhost:8000/index.html | grep -c 'class="lede"'` → should be 2 (the two intro paragraphs, now in section 01)
- `curl -s http://localhost:8000/index.html | grep -c 'approach__step'` → should be at least 6 (3 steps × 2 classes each: approach__step-num appears 3x, approach__step-title 3x — grep -c counts matching lines, so this should be at least 3 given each step is on its own set of lines; just confirm it's non-zero and roughly matches 3 steps)
- `curl -s http://localhost:8000/index.html | grep -c 'about-teaser'` → should be 0 (fully removed)
- `curl -s http://localhost:8000/index.html | grep -c 'cta-band'` → should be at least 1
Stop the server: `kill %1`

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Restructure homepage into numbered sections (01 The Work / 02 Selected Work / 03 The Approach) with closing CTA band"
```

---

## Task 4: Build the About page

**Files:**
- Create: `about.html` (full rewrite — the existing file is in the old visual system and gets completely replaced)

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "make hard things sound simple" about.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Write the full page**

Create `about.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>About | Tyler Quackenbush</title>
  <meta name="description" content="UX content designer and writer with 8+ years across healthcare, federal, and B2B products. Experience, competencies, and tools." />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="About | Tyler Quackenbush" />
  <meta property="og:description" content="UX content designer and writer with 8+ years across healthcare, federal, and B2B products. Experience, competencies, and tools." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="About | Tyler Quackenbush" />
  <meta name="twitter:description" content="UX content designer and writer with 8+ years across healthcare, federal, and B2B products. Experience, competencies, and tools." />
  <meta name="twitter:image" content="assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Public+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to content</a>

  <nav class="site-nav">
    <div class="site-nav__wrap">
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
        <li><a href="about.html" class="site-nav__link active">About</a></li>
        <li><a href="assets/resume.pdf" target="_blank" rel="noopener" class="site-nav__link">Resume</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-list">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <main id="main-content">
    <section class="about-header">
      <img src="assets/images/Headshot.jpeg" alt="Tyler Quackenbush" class="about-header__photo" width="96" height="96" />
      <p class="label-mono">About</p>
      <h1 class="about-header__title">A writer whose job is to make hard things sound simple.</h1>
      <p class="about-header__intro">I'm Tyler Quackenbush. Content strategist and UX writer with 8+ years across product design, content design, and design systems, for healthcare, federal, and B2B products. I turn technical and legal jargon into plain language, then stay in the room through legal review, accessibility checks, and dev handoff until it actually ships that way.</p>
    </section>

    <section class="about-block">
      <p class="label-mono">01 &middot; How I Work</p>
      <p class="lede">I start with what the reader needs on the page, not what the org wants to say about itself. Most content problems aren't writing problems. They're clarity problems that showed up as a paragraph nobody wanted to touch.</p>
      <p class="lede">I use Claude for research synthesis and first-draft speed. I still write and edit every sentence that ships, because the judgment call about what to cut is the actual job.</p>
      <blockquote class="pull-quote">I'd rather ship one honest sentence than five that sound impressive.</blockquote>
    </section>

    <section class="about-block">
      <p class="label-mono">02 &middot; Experience</p>

      <article class="experience-item">
        <p class="experience-item__dates">2021&ndash;Present</p>
        <h3 class="experience-item__role">Senior Content Designer</h3>
        <p class="label-mono experience-item__org">Agile Defense (formerly Intellibridge)</p>
        <p class="experience-item__desc">Lead content design and UX writing across federal and commercial digital products. Built the content audits, voice and tone standards, and style guide adopted across design teams, working directly with legal and compliance reviewers on 508 requirements.</p>
      </article>

      <article class="experience-item">
        <p class="experience-item__dates">2021</p>
        <h3 class="experience-item__role">UX Content Designer</h3>
        <p class="label-mono experience-item__org">Novant Health (via Accrue Partners)</p>
        <p class="experience-item__desc">Embedded content designer on a system-wide healthcare website redesign. Rewrote patient-facing content into new templates and design-system components in Figma, shipping 50+ pages a week.</p>
      </article>

      <article class="experience-item experience-item--last">
        <p class="experience-item__dates">2016&ndash;2021</p>
        <h3 class="experience-item__role">Web Designer</h3>
        <p class="label-mono experience-item__org">University of North Georgia</p>
        <p class="experience-item__desc">Led content and information architecture for a 5,000+ page public university site, consolidating 20+ navigation menus and shipping a 2FA onboarding flow for 20,000+ users.</p>
      </article>
    </section>

    <section class="about-block">
      <p class="label-mono">03 &middot; Core Competencies</p>
      <ul class="tag-list">
        <li class="tag-list__item">UX Writing &amp; Microcopy</li>
        <li class="tag-list__item">Content Strategy</li>
        <li class="tag-list__item">Content Audits &amp; Inventory</li>
        <li class="tag-list__item">B2B Content Design</li>
        <li class="tag-list__item">E-Commerce &amp; Account Management Flows</li>
        <li class="tag-list__item">Information Architecture</li>
        <li class="tag-list__item">Voice &amp; Tone Development</li>
        <li class="tag-list__item">Design Systems</li>
        <li class="tag-list__item">Accessibility (508 Compliance)</li>
        <li class="tag-list__item">Agile/Scrum Collaboration</li>
        <li class="tag-list__item">Cross-Functional Stakeholder Management</li>
      </ul>
    </section>

    <section class="about-block">
      <p class="label-mono">04 &middot; Tools &amp; Education</p>
      <div class="tools-grid">
        <div class="tools-grid__col">
          <p class="label-mono tools-grid__label">Design &amp; Prototyping</p>
          <p class="tools-grid__value">Figma, Photoshop, Illustrator</p>
        </div>
        <div class="tools-grid__col">
          <p class="label-mono tools-grid__label">Project &amp; Collaboration</p>
          <p class="tools-grid__value">Jira, Confluence, Webflow, Airtable, GitHub</p>
        </div>
        <div class="tools-grid__col">
          <p class="label-mono tools-grid__label">Other</p>
          <p class="tools-grid__value">CMS Platforms, Claude &amp; AI-Assisted Writing Tools, HTML/CSS</p>
        </div>
        <div class="tools-grid__col">
          <p class="label-mono tools-grid__label">Certifications</p>
          <p class="tools-grid__value">Certified ScrumMaster (CSM), SAFe for Teams Certified</p>
        </div>
        <div class="tools-grid__col">
          <p class="label-mono tools-grid__label">Education</p>
          <p class="tools-grid__value">BA English Literature &mdash; University of North Georgia</p>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <h2 class="cta-band__title">Want to talk about a role like this?</h2>
      <div class="cta-band__links">
        <a href="mailto:tyler.qbush@gmail.com" class="btn btn--primary">Get in touch</a>
        <a href="work.html" class="label-mono cta-band__link">See the case studies &rarr;</a>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="site-footer__wrap">
      <span class="site-footer__name">Tyler Quackenbush</span>
      <a href="mailto:tyler.qbush@gmail.com" class="site-footer__email">tyler.qbush@gmail.com</a>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Add the About-page-specific CSS**

Append to `css/styles.css` (at the very end of the file):

```css
/* ---- About page ---- */
.about-header {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--section-padding-y) var(--section-padding-x) 40px;
}

.about-header__photo {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 24px;
}

.about-header .label-mono {
  margin-bottom: 14px;
}

.about-header__title {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  max-width: 720px;
  margin-bottom: 20px;
}

.about-header__intro {
  font-size: 1.05rem;
  color: var(--color-ink-dim);
  max-width: 680px;
  line-height: 1.65;
}

.about-block {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 40px var(--section-padding-x);
  border-top: 1px solid var(--color-border);
}

.about-block .label-mono {
  margin-bottom: 20px;
}

.pull-quote {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--color-ink);
  max-width: 600px;
  margin: 24px 0 0;
  padding-left: 20px;
  border-left: 3px solid var(--color-accent-strong);
}

.experience-item {
  padding: 24px 0;
  border-top: 1px solid var(--color-border);
}

.experience-item:first-of-type {
  border-top: none;
  padding-top: 0;
}

.experience-item__dates {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: var(--label-tracking);
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: 6px;
}

.experience-item__role {
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.experience-item__org {
  margin-bottom: 10px;
}

.experience-item__desc {
  font-size: 0.95rem;
  color: var(--color-ink-dim);
  max-width: 680px;
  line-height: 1.6;
}

.tag-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-list__item {
  background: var(--color-surface);
  border-radius: var(--radius-pill);
  padding: 8px 16px;
  font-size: 0.85rem;
  color: var(--color-ink);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.tools-grid__label {
  margin-bottom: 8px;
}

.tools-grid__value {
  font-size: 0.9rem;
  color: var(--color-ink-dim);
  line-height: 1.5;
}

@media (max-width: 780px) {
  .tools-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 500px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
}
```

Note: `--radius-pill` is referenced here for the first time in the shipped stylesheet — it was already defined in the `:root` token block from Task 1 of the Phase 1 plan but never used until now, so no new token needs to be added, just this usage.

- [ ] **Step 4: Run the assertion again, verify it passes**

Run: `grep -c "make hard things sound simple" about.html`
Expected: `1`

- [ ] **Step 5: Manual verification check**

Start a local server: `python3 -m http.server 8000 --directory "$(pwd)" &`
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/about.html` → should be 200
- `curl -s http://localhost:8000/about.html | grep -c 'experience-item'` → should be greater than 0 (3 experience entries present)
- `curl -s http://localhost:8000/about.html | grep -c 'tag-list__item'` → should be 11 (11 competency tags)
- `curl -s http://localhost:8000/about.html | grep -c 'site-nav__link active'` → should be 1 (About marked active)
Stop the server: `kill %1`

- [ ] **Step 6: Commit**

```bash
git add about.html css/styles.css
git commit -m "Build About page: How I Work, Experience, Core Competencies, Tools & Education"
```

---

## Task 5: Full verification pass and redeploy

**Files:** none (verification and deployment only)

- [ ] **Step 1: Check every path resolves**

Run individually (not in a loop, to avoid shell issues seen previously):

```bash
python3 -m http.server 8000 --directory "$(pwd)" &
sleep 1
curl -s -o /dev/null -w "index.html -> %{http_code}\n" "http://localhost:8000/index.html"
curl -s -o /dev/null -w "about.html -> %{http_code}\n" "http://localhost:8000/about.html"
curl -s -o /dev/null -w "work.html -> %{http_code}\n" "http://localhost:8000/work.html"
curl -s -o /dev/null -w "work/agile-defense.html -> %{http_code}\n" "http://localhost:8000/work/agile-defense.html"
curl -s -o /dev/null -w "work/novant-health.html -> %{http_code}\n" "http://localhost:8000/work/novant-health.html"
curl -s -o /dev/null -w "work/ung.html -> %{http_code}\n" "http://localhost:8000/work/ung.html"
```

Expected: all `200`.

- [ ] **Step 2: Confirm the About link resolves correctly from every page**

```bash
curl -s http://localhost:8000/work/agile-defense.html | grep -o 'href="../about.html"'
curl -s http://localhost:8000/work/novant-health.html | grep -o 'href="../about.html"'
curl -s http://localhost:8000/work/ung.html | grep -o 'href="../about.html"'
```

Expected: each returns the matched string (confirms the relative path is correct from within `work/`).

- [ ] **Step 3: Visual pass across breakpoints**

With the server running, open `index.html` and `about.html` in a browser at desktop (1280px), tablet (768px), and mobile (375px) widths. Confirm:
- No horizontal scrollbar at any width
- On desktop, content is visibly centered with balanced margins on both sides (not flush-left) — this is the core fix, verify it directly by eye
- The homepage's 01/02/03 sections read in order with consistent left-edge alignment relative to each other
- The `.approach__grid` (3 steps) collapses to 1 column under 780px
- The About page's `.tools-grid` collapses from 3 → 2 → 1 columns as the viewport narrows
- The mobile hamburger menu opens and now shows Work / About / Resume

Stop the server: `kill %1`

- [ ] **Step 4: Commit any fixes found during verification**

If Steps 1-3 surfaced any fix, make it, then `git add -A && git commit -m "Fix issues found in layout/homepage/about verification pass"`. If nothing needed fixing, skip this step.

- [ ] **Step 5: Push to redeploy**

This repo is already connected to Cloudflare Pages (pushes to `master` auto-deploy). Confirm before pushing — this goes live immediately on tquack.com.

```bash
git push origin master
```

- [ ] **Step 6: Verify the live deployment**

Once Cloudflare Pages finishes building (usually under a minute), open `https://tquack.com` and re-run the same visual checklist from Step 3 against the live site, plus specifically confirm `https://tquack.com/about.html` loads and the width fix is visible on a wide browser window.
