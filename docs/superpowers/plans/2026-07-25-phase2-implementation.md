# Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the portfolio site per the design spec: Contact page, Microcopy & Error Messages page, Brand Identity page, Design System page, rebuild ACCT International and Adventure Careers into the new case-study template, correct site nav everywhere (Work · About · Brand Identity · Contact), and extend the case-study chain to include the two demoted studies.

**Architecture:** Same as Phase 1 and the correction plan — plain multi-page static HTML/CSS/JS, no build step, no framework. New pages reuse existing component classes (`.about-header`, `.about-block`, `.tools-grid`, `.pull-quote`, `.cs-*`, `.tag-list`, `.btn`) wherever the content shape matches, to keep `css/styles.css` from growing unnecessarily.

**Tech Stack:** Same as prior plans (HTML5, CSS custom properties, vanilla JS).

**Testing approach:** Same grep-assertion + manual browser check pattern used throughout this project. No test framework, no build step.

---

## Task 1: Nav correction across all 6 existing pages

**Files:**
- Modify: `index.html`, `work.html`, `about.html`, `work/agile-defense.html`, `work/novant-health.html`, `work/ung.html`

The nav currently reads `Work · About · Resume` (Resume as a direct link) because Brand Identity and Contact didn't exist yet. Now they will (this plan builds them). Nav becomes `Work · About · Brand Identity · Contact` — the standalone Resume link is dropped (resume access stays available via the hero button, About page, and the new Contact page).

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "Brand Identity" index.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Edit `index.html`**

Find:
```html
      <ul class="site-nav__list" id="site-nav-list">
        <li><a href="work.html" class="site-nav__link">Work</a></li>
        <li><a href="about.html" class="site-nav__link">About</a></li>
        <li><a href="assets/resume.pdf" target="_blank" rel="noopener" class="site-nav__link">Resume</a></li>
      </ul>
```
Replace with:
```html
      <ul class="site-nav__list" id="site-nav-list">
        <li><a href="work.html" class="site-nav__link">Work</a></li>
        <li><a href="about.html" class="site-nav__link">About</a></li>
        <li><a href="brand-identity.html" class="site-nav__link">Brand Identity</a></li>
        <li><a href="contact.html" class="site-nav__link">Contact</a></li>
      </ul>
```

- [ ] **Step 3: Edit `work.html`**

Same replacement, keeping `class="site-nav__link active"` on the Work `<li>`.

- [ ] **Step 4: Edit `about.html`**

Same replacement, keeping `class="site-nav__link active"` on the About `<li>`.

- [ ] **Step 5: Edit `work/agile-defense.html`, `work/novant-health.html`, `work/ung.html`**

Same replacement, but with `../` prefixes (`../work.html`, `../about.html`, `../brand-identity.html`, `../contact.html`), keeping `class="site-nav__link active"` on the Work `<li>` in all three.

- [ ] **Step 6: Run the assertion again, verify it passes**

Run: `grep -c "Brand Identity" index.html`
Expected: `1`

Then confirm all 6 files: `grep -l "brand-identity.html" index.html work.html about.html work/agile-defense.html work/novant-health.html work/ung.html` should list all 6. Confirm the old Resume link is gone: `grep -c "id=\"resume-link\"\|>Resume<" index.html work.html about.html work/agile-defense.html work/novant-health.html work/ung.html` should be `0` for each (the string "Resume" may still appear elsewhere, e.g. "Download resume" buttons — that's fine and expected; this check is specifically for the nav link text `>Resume<`).

- [ ] **Step 7: Commit**

```bash
git add index.html work.html about.html work/agile-defense.html work/novant-health.html work/ung.html
git commit -m "Correct nav to Work / About / Brand Identity / Contact across all pages"
```

## Context

Tasks 2-5 of this plan create `brand-identity.html` and `contact.html`, so these nav links will 404 until those tasks land — expected mid-plan, matching the pattern used throughout this project (Phase 1 case-study links, the About link before About existed).

## Before You Begin

If you have questions, ask them now.

## Your Job

1. Implement exactly what's specified across all 6 files
2. Run all verification commands
3. Commit with the exact message given
4. Self-review
5. Report back

Work from: `/Users/tyler/Documents/Portfolio Site`

## Code Organization

Six files, nav `<ul>` only in each — don't touch anything else.

## When You're in Over Your Head

If the current nav markup in any file doesn't match what's described, STOP and report BLOCKED or NEEDS_CONTEXT with the actual content.

## Before Reporting Back: Self-Review

Check: all 6 files updated identically (accounting for `../` prefix and `active` class placement), old Resume link fully removed, all verification commands passed, commit succeeded, git status clean.

## Report Format

- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- What you implemented
- Verification command output
- Files changed
- Git commit SHA
- Self-review findings
- Any issues or concerns

---

## Task 2: Contact page

**Files:**
- Create: `contact.html` (full rewrite — the existing file is in the old visual system)

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "Let's make the next thing clearer" contact.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Write the full page**

Create `contact.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contact | Tyler Quackenbush</title>
  <meta name="description" content="Get in touch with Tyler Quackenbush — UX content designer and writer, open to content design and content strategy roles." />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="Contact | Tyler Quackenbush" />
  <meta property="og:description" content="Get in touch with Tyler Quackenbush — UX content designer and writer, open to content design and content strategy roles." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Contact | Tyler Quackenbush" />
  <meta name="twitter:description" content="Get in touch with Tyler Quackenbush — UX content designer and writer, open to content design and content strategy roles." />
  <meta name="twitter:image" content="assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Public+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css?v=20260725" />
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
        <li><a href="about.html" class="site-nav__link">About</a></li>
        <li><a href="brand-identity.html" class="site-nav__link">Brand Identity</a></li>
        <li><a href="contact.html" class="site-nav__link active">Contact</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-list">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <main id="main-content">
    <section class="about-header">
      <p class="label-mono">Contact</p>
      <h1 class="about-header__title">Let's make the next thing clearer.</h1>
      <p class="about-header__intro">Open to UX content design and content strategy roles — healthcare, federal, B2B, anywhere someone needs a translator between what legal or compliance wrote and what the reader actually needs. Email's the fastest way to reach me.</p>
      <div class="hero__ctas" style="margin-top:24px;">
        <a href="mailto:tyler.qbush@gmail.com" class="btn btn--primary">Email Tyler</a>
        <a href="assets/resume.pdf" target="_blank" rel="noopener" class="btn btn--outline">Download resume</a>
      </div>
    </section>

    <section class="about-block">
      <div class="tools-grid">
        <div class="tools-grid__col">
          <p class="label-mono tools-grid__label">Email</p>
          <p class="tools-grid__value"><a href="mailto:tyler.qbush@gmail.com">tyler.qbush@gmail.com</a></p>
        </div>
        <div class="tools-grid__col">
          <p class="label-mono tools-grid__label">LinkedIn</p>
          <p class="tools-grid__value"><a href="https://linkedin.com/in/tyler-qbush" target="_blank" rel="noopener">linkedin.com/in/tyler-qbush</a></p>
        </div>
        <div class="tools-grid__col">
          <p class="label-mono tools-grid__label">Based In</p>
          <p class="tools-grid__value">Dahlonega, GA &middot; Remote</p>
        </div>
      </div>
      <blockquote class="pull-quote">Jargon in. Clarity out. That's the whole pitch.</blockquote>
    </section>
  </main>

  <footer class="site-footer">
    <div class="site-footer__wrap">
      <span class="site-footer__name">Tyler Quackenbush</span>
      <a href="mailto:tyler.qbush@gmail.com" class="site-footer__email">tyler.qbush@gmail.com</a>
    </div>
  </footer>

  <script src="js/main.js?v=20260725"></script>
</body>
</html>
```

No new CSS needed — this page reuses `.about-header`, `.about-block`, `.tools-grid`, `.pull-quote`, and `.btn` exactly as already defined.

- [ ] **Step 3: Run the assertion again, verify it passes**

Run: `grep -c "Let's make the next thing clearer" contact.html`
Expected: `1`

- [ ] **Step 4: Manual verification check**

Start a local server: `python3 -m http.server 8000 --directory "$(pwd)" &`
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/contact.html` → should be 200
- `curl -s http://localhost:8000/contact.html | grep -c 'mailto:tyler.qbush@gmail.com'` → should be at least 2 (Email Tyler button + email link in the info grid + footer)
- `curl -s http://localhost:8000/contact.html | grep -c 'linkedin.com/in/tyler-qbush'` → should be 1
- `curl -s http://localhost:8000/contact.html | grep -c 'site-nav__link active'` → should be 1
Stop the server: `kill %1`

- [ ] **Step 5: Commit**

```bash
git add contact.html
git commit -m "Build Contact page reusing existing about-header/tools-grid/pull-quote components"
```

## Context

This is Task 2 of the Phase 2 plan. Task 1 (nav correction, already complete) added the `brand-identity.html` and `contact.html` nav links across the site — `brand-identity.html` still 404s until Task 4, that's expected. This task builds Contact using entirely reused CSS classes already defined in `css/styles.css` (from the homepage and About page work) — no new stylesheet rules needed.

## Before You Begin

If you have questions, ask them now.

## Your Job

1. Implement exactly what's specified (create contact.html)
2. Run all verification commands
3. Commit with the exact message given
4. Self-review
5. Report back

Work from: `/Users/tyler/Documents/Portfolio Site`

## Code Organization

One file: contact.html. Do not modify css/styles.css in this task — everything needed already exists.

## When You're in Over Your Head

If anything is unexpected, STOP and report BLOCKED or NEEDS_CONTEXT with specifics.

## Before Reporting Back: Self-Review

Check: HTML matches spec exactly, no CSS file touched, all curl checks passed, commit succeeded, git status clean.

## Report Format

- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- What you implemented
- All verification command outputs
- Files changed
- Git commit SHA
- Self-review findings
- Any issues or concerns

---

## Task 3: Microcopy & Error Messages page

**Files:**
- Create: `work/microcopy.html`
- Modify: `work.html` (add a link to the new page)

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "Microcopy" work/microcopy.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Write the full page**

Create `work/microcopy.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Microcopy &amp; Error Messages | Tyler Quackenbush</title>
  <meta name="description" content="Before-and-after microcopy specimens: error messages, button labels, empty states, and status messages." />
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="Microcopy &amp; Error Messages | Tyler Quackenbush" />
  <meta property="og:description" content="Before-and-after microcopy specimens: error messages, button labels, empty states, and status messages." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="../assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Microcopy &amp; Error Messages | Tyler Quackenbush" />
  <meta name="twitter:description" content="Before-and-after microcopy specimens: error messages, button labels, empty states, and status messages." />
  <meta name="twitter:image" content="../assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Public+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css?v=20260725" />
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to content</a>

  <nav class="site-nav">
    <div class="site-nav__wrap">
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
        <li><a href="../about.html" class="site-nav__link">About</a></li>
        <li><a href="../brand-identity.html" class="site-nav__link">Brand Identity</a></li>
        <li><a href="../contact.html" class="site-nav__link">Contact</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-list">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <main id="main-content">
    <section class="cs">
      <a href="../work.html" class="label-mono cs__back">&larr; All case studies</a>
      <p class="label-mono cs__eyebrow">Writing Sample</p>
      <h1 class="cs__title">Microcopy &amp; error messages, before and after</h1>
      <p class="cs__meta">Short-form UX writing &middot; Error states, button labels, empty states, status messages</p>

      <div class="cs-section">
        <p class="cs-section__body">The three case studies show the strategy. This page is just the sentences: the small, easy-to-get-wrong UI text that decides whether someone finishes a task or calls support. Specimens below are drawn from patterns I've written and rewritten across healthcare, federal, and e-commerce-style flows, restated here without client-confidential specifics.</p>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Error Messages</h2>
        <div class="micro-specimen">
          <p class="label-mono micro-specimen__label micro-specimen__label--before">Before</p>
          <p class="micro-specimen__text micro-specimen__text--before">"Error: Invalid input. Please try again."</p>
          <p class="label-mono micro-specimen__label micro-specimen__label--after">After</p>
          <p class="micro-specimen__text micro-specimen__text--after">"That doesn't look like a valid email — check for a typo after the @."</p>
        </div>
        <div class="micro-specimen">
          <p class="label-mono micro-specimen__label micro-specimen__label--before">Before</p>
          <p class="micro-specimen__text micro-specimen__text--before">"An unexpected error has occurred. Please contact your administrator."</p>
          <p class="label-mono micro-specimen__label micro-specimen__label--after">After</p>
          <p class="micro-specimen__text micro-specimen__text--after">"Something broke on our end, not yours. Try again in a minute — if it keeps happening, contact support."</p>
        </div>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Button Labels</h2>
        <div class="micro-specimen">
          <p class="label-mono micro-specimen__label micro-specimen__label--before">Before</p>
          <p class="micro-specimen__text micro-specimen__text--before">"Submit"</p>
          <p class="label-mono micro-specimen__label micro-specimen__label--after">After</p>
          <p class="micro-specimen__text micro-specimen__text--after">"Send my request"</p>
        </div>
        <div class="micro-specimen">
          <p class="label-mono micro-specimen__label micro-specimen__label--before">Before</p>
          <p class="micro-specimen__text micro-specimen__text--before">"Yes" / "No" (on a dialog asking whether to delete an account)</p>
          <p class="label-mono micro-specimen__label micro-specimen__label--after">After</p>
          <p class="micro-specimen__text micro-specimen__text--after">"Delete my account" / "Keep my account"</p>
        </div>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Empty States</h2>
        <div class="micro-specimen">
          <p class="label-mono micro-specimen__label micro-specimen__label--before">Before</p>
          <p class="micro-specimen__text micro-specimen__text--before">"No results found."</p>
          <p class="label-mono micro-specimen__label micro-specimen__label--after">After</p>
          <p class="micro-specimen__text micro-specimen__text--after">"No appointments match those filters. Try widening the date range, or clear filters to see everything."</p>
        </div>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Status Messages</h2>
        <div class="micro-specimen">
          <p class="label-mono micro-specimen__label micro-specimen__label--before">Before</p>
          <p class="micro-specimen__text micro-specimen__text--before">"Your request is being processed."</p>
          <p class="label-mono micro-specimen__label micro-specimen__label--after">After</p>
          <p class="micro-specimen__text micro-specimen__text--after">"We've got your request. Most take under 24 hours — we'll email you the second it's done."</p>
        </div>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Why This Matters</h2>
        <p class="cs-section__body">None of these before-versions are technically wrong. They're just written for the system, not the person reading them under stress: the moment something failed, or they're not sure they clicked the right button, or they're staring at a blank screen wondering if it's broken. The fix is rarely more words. It's naming the actual thing that happened and the actual next step, instead of a generic placeholder a developer typed in five seconds and never revisited.</p>
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
    <div class="site-footer__wrap">
      <span class="site-footer__name">Tyler Quackenbush</span>
      <a href="mailto:tyler.qbush@gmail.com" class="site-footer__email">tyler.qbush@gmail.com</a>
    </div>
  </footer>

  <script src="../js/main.js?v=20260725"></script>
</body>
</html>
```

- [ ] **Step 3: Add the microcopy specimen CSS**

Append to `css/styles.css` (at the very end):

```css
/* ---- Microcopy specimens (work/microcopy.html) ---- */
.micro-specimen {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  margin-bottom: 14px;
}

.micro-specimen__label--before {
  color: var(--color-muted);
  margin-bottom: 4px;
}

.micro-specimen__label--after {
  margin-top: 12px;
  margin-bottom: 4px;
}

.micro-specimen__text {
  font-size: 0.95rem;
}

.micro-specimen__text--before {
  color: var(--color-muted);
  font-style: italic;
}

.micro-specimen__text--after {
  color: var(--color-ink);
  font-weight: 500;
}
```

- [ ] **Step 4: Add the link on `work.html`**

Find the closing `</article>` of the UNG entry (the last `work-list__item`) in `work.html`:

```html
        <a href="work/ung.html" class="label-mono work-list__link">Read the case study &rarr;</a>
      </article>
    </section>
```

Replace with (adding a new microcopy entry after UNG, before the closing `</section>`):

```html
        <a href="work/ung.html" class="label-mono work-list__link">Read the case study &rarr;</a>
      </article>

      <article class="work-list__item work-list__item--last">
        <p class="label-mono work-list__eyebrow">Writing Sample</p>
        <h2 class="work-list__title">Microcopy &amp; Error Messages</h2>
        <p class="work-list__meta">Short-form UX writing</p>
        <p class="work-list__desc">Before-and-after specimens: error messages, button labels, empty states, and status messages — the small sentences that decide whether someone finishes a task or calls support.</p>
        <a href="work/microcopy.html" class="label-mono work-list__link">Read the samples &rarr;</a>
      </article>
    </section>
```

Note: this means the UNG `<article>` immediately above loses its own `work-list__item--last` class (since it's no longer the last item) — remove `work-list__item--last` from the UNG article's class attribute, so it reads `class="work-list__item"` only. The new Microcopy article gets `work-list__item--last` instead, since it's now the final item in the list (closing the bottom border).

- [ ] **Step 5: Run the assertion again, verify it passes**

Run: `grep -c "Microcopy" work/microcopy.html`
Expected: `1`

- [ ] **Step 6: Manual verification check**

Start a local server: `python3 -m http.server 8000 --directory "$(pwd)" &`
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/work/microcopy.html` → should be 200
- `curl -s http://localhost:8000/work/microcopy.html | grep -c 'micro-specimen'` → should be non-zero (multiple specimens present)
- `curl -s http://localhost:8000/work.html | grep -c 'href="work/microcopy.html"'` → should be 1
- `curl -s http://localhost:8000/work.html | grep -c 'work-list__item--last'` → should be 1 (only the new Microcopy entry, not UNG anymore)
Stop the server: `kill %1`

- [ ] **Step 7: Commit**

```bash
git add work/microcopy.html work.html css/styles.css
git commit -m "Add Microcopy & Error Messages writing sample page, link from work index"
```

## Context

This is Task 3 of the Phase 2 plan. This page directly answers a requirement from the target job posting (AT&T Senior Content Writer) that explicitly calls out microcopy, error messages, button labels, and status messages — none of the three narrative case studies show this craft directly, so this page fills that gap. It's linked only from the work index, not from primary site nav (it's a supplementary writing sample, not a fourth "engagement" — the homepage's "Three engagements..." copy stays accurate).

## Before You Begin

If you have questions, ask them now.

## Your Job

1. Implement exactly what's specified (create work/microcopy.html, update work.html, append CSS)
2. Run all verification commands
3. Commit with the exact message given
4. Self-review
5. Report back

Work from: `/Users/tyler/Documents/Portfolio Site`

## Code Organization

Three changes: work/microcopy.html (new), work.html (add one list item, remove `--last` modifier from UNG's item), css/styles.css (append-only).

## When You're in Over Your Head

If anything is unexpected, STOP and report BLOCKED or NEEDS_CONTEXT with specifics.

## Before Reporting Back: Self-Review

Check: HTML matches spec exactly, work.html's UNG item no longer has `--last`, new Microcopy item does, CSS appended cleanly, all curl checks passed, commit succeeded, git status clean.

## Report Format

- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- What you implemented
- All verification command outputs
- Files changed
- Git commit SHA
- Self-review findings
- Any issues or concerns

---

## Task 4: Brand Identity page

**Files:**
- Create: `brand-identity.html`

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "Take the dense thing" brand-identity.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Write the full page**

Create `brand-identity.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Brand Identity | Tyler Quackenbush</title>
  <meta name="description" content="The idea, mark, type, and color behind Tyler Quackenbush's own brand identity — a systems-thinking case study in itself." />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="Brand Identity | Tyler Quackenbush" />
  <meta property="og:description" content="The idea, mark, type, and color behind Tyler Quackenbush's own brand identity — a systems-thinking case study in itself." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Brand Identity | Tyler Quackenbush" />
  <meta name="twitter:description" content="The idea, mark, type, and color behind Tyler Quackenbush's own brand identity — a systems-thinking case study in itself." />
  <meta name="twitter:image" content="assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Public+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css?v=20260725" />
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
        <li><a href="about.html" class="site-nav__link">About</a></li>
        <li><a href="brand-identity.html" class="site-nav__link active">Brand Identity</a></li>
        <li><a href="contact.html" class="site-nav__link">Contact</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-list">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <main id="main-content">
    <section class="about-header">
      <p class="label-mono">Brand Identity</p>
      <h1 class="about-header__title">Take the dense thing. Hand back the clear one.</h1>
      <p class="about-header__intro">This is the identity system behind this site: the idea, the mark, the type, and the color that make every page read as one voice. Where the <a href="design-system/index.html">Design System</a> documents the code, this page documents the thinking.</p>
    </section>

    <section class="about-block">
      <h2 class="label-mono">01 &middot; The Idea</h2>
      <p class="lede">Every piece of content on this site starts as something too complicated for the person reading it: a legal clause, a clinical process, a compliance requirement nobody asked for in plain words.</p>
      <p class="lede">The job is translation, not simplification for its own sake. Keep what's true, cut what's just there to sound careful, and hand back a sentence someone can act on without a second read. The mark, the type, the color: all of it is built around that one move.</p>
    </section>

    <section class="about-block">
      <h2 class="label-mono">02 &middot; The Mark</h2>
      <p class="lede">One bar, one line. Complexity, resolved into a path.</p>
      <div class="brand-mark-display">
        <svg width="96" height="96" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="40" height="40" rx="9" fill="#16324A"/>
          <line x1="13" y1="10" x2="13" y2="30" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
          <line x1="13" y1="20" x2="29" y2="20" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
        </svg>
      </div>
      <p class="lede">The mark is two strokes: a vertical bar and a horizontal line meeting it, like a flag catching a signal. Read one way, it's a compressed version of the before/after on this site's own homepage &mdash; dense text on the left, a single clear line exiting on the right. Two gestures, so it survives at 16 pixels and still holds up at billboard scale.</p>
    </section>

    <section class="about-block">
      <h2 class="label-mono">03 &middot; The Wordmark</h2>
      <p class="label-mono" style="margin-bottom:16px;">Space Grotesk &middot; 600 &middot; Wide Tracking</p>
      <p class="lede" style="font-family:'Space Grotesk',sans-serif;font-size:2rem;font-weight:600;color:var(--color-ink);margin-bottom:20px;">Tyler Quackenbush</p>
      <p class="lede">Set in Space Grotesk at a confident weight with the tracking opened up &mdash; the same treatment used for every heading on this site. Geometric enough to read as "systems," not "casual blog," without tipping into the cold, over-engineered feel a lot of tech wordmarks land on. No custom ligatures, no shrinking the counters for style: a UX writer's logo should be exactly as legible as the writing underneath it.</p>
    </section>

    <section class="about-block">
      <h2 class="label-mono">04 &middot; Lockups</h2>
      <p class="lede">Three sanctioned configurations. Choose by space, not by mood &mdash; the horizontal lockup leads everywhere there's room for it.</p>
      <div class="tools-grid">
        <div class="tools-grid__col">
          <div class="brand-mock">
            <div style="display:flex;align-items:center;gap:8px;">
              <svg width="28" height="28" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#16324A"/><line x1="13" y1="10" x2="13" y2="30" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/><line x1="13" y1="20" x2="29" y2="20" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/></svg>
              <span style="font-family:'Space Grotesk',sans-serif;font-weight:600;">Tyler Quackenbush</span>
            </div>
          </div>
          <p class="label-mono tools-grid__label" style="margin-top:10px;">Horizontal &middot; Nav / Header</p>
        </div>
        <div class="tools-grid__col">
          <div class="brand-mock" style="text-align:center;">
            <svg width="36" height="36" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#16324A"/><line x1="13" y1="10" x2="13" y2="30" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/><line x1="13" y1="20" x2="29" y2="20" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/></svg>
            <p style="font-family:'Space Grotesk',sans-serif;font-weight:600;margin-top:8px;">Tyler<br/>Quackenbush</p>
          </div>
          <p class="label-mono tools-grid__label" style="margin-top:10px;">Stacked &middot; Square Contexts</p>
        </div>
        <div class="tools-grid__col">
          <div class="brand-mock" style="text-align:center;">
            <svg width="36" height="36" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#16324A"/><line x1="13" y1="10" x2="13" y2="30" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/><line x1="13" y1="20" x2="29" y2="20" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/></svg>
          </div>
          <p class="label-mono tools-grid__label" style="margin-top:10px;">Mark Only &middot; Favicon / Small UI</p>
        </div>
      </div>
    </section>

    <section class="about-block">
      <h2 class="label-mono">05 &middot; Clear Space &amp; Minimum Size</h2>
      <p class="lede">Clear space equal to the mark's stroke weight, on all sides, non-negotiable &mdash; the mark's whole argument is that less is more legible, and crowding it undercuts its own point.</p>
      <div class="tools-grid">
        <div class="tools-grid__col">
          <p class="label-mono tools-grid__label">Digital Minimum</p>
          <p class="tools-grid__value">16px &middot; Favicon</p>
        </div>
        <div class="tools-grid__col">
          <p class="label-mono tools-grid__label">App Icon</p>
          <p class="tools-grid__value">32px &ndash; 512px</p>
        </div>
        <div class="tools-grid__col">
          <p class="label-mono tools-grid__label">Print Minimum</p>
          <p class="tools-grid__value">10mm</p>
        </div>
      </div>
    </section>

    <section class="about-block">
      <h2 class="label-mono">06 &middot; Color</h2>
      <div class="tools-grid">
        <div class="tools-grid__col">
          <div class="swatch" style="background:#16324A;"></div>
          <p class="label-mono tools-grid__label" style="margin-top:10px;">Deep Navy &middot; #16324A</p>
          <p class="tools-grid__value">Primary. Text, nav, footer, primary actions.</p>
        </div>
        <div class="tools-grid__col">
          <div class="swatch" style="background:#FFFFFF;border:1px solid var(--color-border);"></div>
          <p class="label-mono tools-grid__label" style="margin-top:10px;">True White &middot; #FFFFFF</p>
          <p class="tools-grid__value">Ground. No paper or cream tones anywhere.</p>
        </div>
        <div class="tools-grid__col">
          <div class="swatch" style="background:#8C5A1E;"></div>
          <p class="label-mono tools-grid__label" style="margin-top:10px;">Amber &middot; #8C5A1E / #B5762A</p>
          <p class="tools-grid__value">The plain-language moment. Reserved for the one line that just got clearer.</p>
        </div>
      </div>
      <p class="lede" style="margin-top:20px;">An earlier direction tested a green-teal palette, closer to a clinical or regulatory register, before landing on navy, which read as more editorial and less corporate-medical. The accent moved from a cooler green to a warmer amber for the same reason a highlighter is amber and not green: it behaves like a mark drawing the eye to the exact sentence that changed, which is the one visual metaphor this whole brand is built on.</p>
    </section>

    <section class="about-block">
      <h2 class="label-mono">07 &middot; Typography</h2>
      <div class="tools-grid">
        <div class="tools-grid__col">
          <p style="font-family:'Space Grotesk',sans-serif;font-size:1.4rem;font-weight:600;color:var(--color-ink);">Aa Gg Hh 0123</p>
          <p class="label-mono tools-grid__label" style="margin-top:10px;">Space Grotesk</p>
          <p class="tools-grid__value">Headings, wordmark. The order voice.</p>
        </div>
        <div class="tools-grid__col">
          <p style="font-family:'Public Sans',sans-serif;font-size:1.4rem;color:var(--color-ink);">Aa Gg Hh 0123</p>
          <p class="label-mono tools-grid__label" style="margin-top:10px;">Public Sans</p>
          <p class="tools-grid__value">Body copy &mdash; also the U.S. federal plain-language/accessibility standard typeface (USWDS), a quiet nod given how much of this work has been federal and accessibility-driven.</p>
        </div>
        <div class="tools-grid__col">
          <p style="font-family:'JetBrains Mono',monospace;font-size:1.4rem;color:var(--color-ink);">Aa Gg Hh 0123</p>
          <p class="label-mono tools-grid__label" style="margin-top:10px;">JetBrains Mono</p>
          <p class="tools-grid__value">Eyebrows, labels, stats. The spec voice.</p>
        </div>
      </div>
    </section>

    <section class="about-block">
      <h2 class="label-mono">08 &middot; In The World</h2>
      <div class="tools-grid">
        <div class="tools-grid__col">
          <div class="brand-mock">
            <p style="font-family:'Space Grotesk',sans-serif;font-weight:600;color:var(--color-ink);">Tyler Quackenbush</p>
            <p class="label-mono" style="margin-top:4px;color:var(--color-muted);">UX Content Designer</p>
            <p style="font-size:0.8rem;color:var(--color-ink-dim);margin-top:10px;">tyler.qbush@gmail.com<br/>tquack.com</p>
          </div>
          <p class="label-mono tools-grid__label" style="margin-top:10px;">Business Card</p>
        </div>
        <div class="tools-grid__col">
          <div class="brand-mock">
            <div style="display:flex;align-items:center;gap:8px;"><svg width="20" height="20" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#16324A"/><line x1="13" y1="10" x2="13" y2="30" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/><line x1="13" y1="20" x2="29" y2="20" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/></svg><span style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:0.85rem;">Tyler Quackenbush</span></div>
            <p style="font-size:0.75rem;color:var(--color-muted);margin-top:8px;">Senior UX Content Writer / Content Strategist</p>
          </div>
          <p class="label-mono tools-grid__label" style="margin-top:10px;">Resume Header</p>
        </div>
        <div class="tools-grid__col">
          <div class="brand-mock">
            <p class="label-mono" style="color:var(--color-accent);">UX CONTENT DESIGNER</p>
            <p style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:1.1rem;color:var(--color-ink);margin-top:6px;">Jargon in. Clarity out.</p>
          </div>
          <p class="label-mono tools-grid__label" style="margin-top:10px;">Social Share Card</p>
        </div>
      </div>
    </section>

    <section class="about-block">
      <h2 class="label-mono">09 &middot; Rationale &amp; Positioning</h2>
      <p class="lede">Tyler is the person a team hands the sentence nobody else wants to touch. Not flashy, not clever for its own sake &mdash; just reliably clearer than what came before it.</p>
      <p class="lede">Two strokes read "simple" faster than an illustrated icon could, and that's the point: a brand about plain language can't have a complicated logo. Navy over green because editorial reads more honest than clinical. One accent color, rationed, because amber only means one thing everywhere it appears &mdash; this is the part that got clearer. Ration it and the metaphor stays honest instead of decorative.</p>
    </section>

    <section class="cta-band">
      <h2 class="cta-band__title">See the system applied everywhere on this site.</h2>
      <div class="cta-band__links">
        <a href="work.html" class="btn btn--primary">View case studies</a>
        <a href="design-system/index.html" class="label-mono cta-band__link">See the Design System &rarr;</a>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="site-footer__wrap">
      <span class="site-footer__name">Tyler Quackenbush</span>
      <a href="mailto:tyler.qbush@gmail.com" class="site-footer__email">tyler.qbush@gmail.com</a>
    </div>
  </footer>

  <script src="js/main.js?v=20260725"></script>
</body>
</html>
```

- [ ] **Step 3: Add the Brand Identity–specific CSS**

Append to `css/styles.css` (at the very end):

```css
/* ---- Brand Identity page ---- */
.brand-mark-display {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 32px;
  display: inline-flex;
  margin: 16px 0 20px;
}

.swatch {
  width: 100%;
  height: 72px;
  border-radius: var(--radius-md);
}

.brand-mock {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 18px 20px;
}
```

- [ ] **Step 4: Run the assertion again, verify it passes**

Run: `grep -c "Take the dense thing" brand-identity.html`
Expected: `1`

- [ ] **Step 5: Manual verification check**

Start a local server: `python3 -m http.server 8000 --directory "$(pwd)" &`
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/brand-identity.html` → should be 200
- `curl -s http://localhost:8000/brand-identity.html | grep -c '<h2 class="label-mono">0'` → should be 9 (nine numbered sections, 01 through 09)
- `curl -s http://localhost:8000/brand-identity.html | grep -c 'swatch'` → should be non-zero
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/design-system/index.html` → will likely be 404 right now (Task 5 hasn't run yet) — that's expected, don't fix it in this task
Stop the server: `kill %1`

- [ ] **Step 6: Commit**

```bash
git add brand-identity.html css/styles.css
git commit -m "Build Brand Identity page: idea, mark, wordmark, lockups, color, type, in-the-world, rationale"
```

## Context

This is Task 4 of the Phase 2 plan, modeled directly on gabbyhon.com/brand-identity/. It links to `design-system/index.html`, which doesn't exist until Task 5 — that link will 404 until then, expected mid-plan. This page reuses `.about-header`, `.about-block`, `.lede`, `.tools-grid`, and `.pull-quote`-adjacent patterns already established; only three small new rules are needed (`.brand-mark-display`, `.swatch`, `.brand-mock`).

## Before You Begin

If you have questions, ask them now.

## Your Job

1. Implement exactly what's specified (create brand-identity.html, append CSS)
2. Run all verification commands
3. Commit with the exact message given
4. Self-review
5. Report back

Work from: `/Users/tyler/Documents/Portfolio Site`

## Code Organization

Two files: brand-identity.html (new), css/styles.css (append-only, three small rules).

## When You're in Over Your Head

If anything is unexpected, STOP and report BLOCKED or NEEDS_CONTEXT with specifics.

## Before Reporting Back: Self-Review

Check: HTML matches spec exactly (all 9 numbered sections present), CSS appended cleanly, all curl checks passed (except the expected design-system 404), commit succeeded, git status clean.

## Report Format

- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- What you implemented
- All verification command outputs
- Files changed
- Git commit SHA
- Self-review findings
- Any issues or concerns

---

## Task 5: Design System page

**Files:**
- Create: `design-system/index.html`

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "Design System" design-system/index.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Write the full page**

Create `design-system/index.html`. This page documents the REAL, already-shipped CSS in `css/styles.css` — every token, color, and component shown must match what's actually defined there (don't invent values). The page is marked `noindex, nofollow` since it's an internal reference, not a primary destination:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Design System | Tyler Quackenbush</title>
  <meta name="robots" content="noindex, nofollow" />
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Public+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css?v=20260725" />
  <style>
    .ds-nav { position: sticky; top: var(--nav-height); background: var(--color-bg); border-bottom: 1px solid var(--color-border); padding: 12px var(--section-padding-x); display: flex; gap: 20px; overflow-x: auto; z-index: 40; }
    .ds-nav a { font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-muted); white-space: nowrap; }
    .ds-nav a:hover { color: var(--color-ink); }
    .ds-row { display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0; }
    .ds-token { background: var(--color-surface); border-radius: var(--radius-md); padding: 14px 16px; min-width: 160px; }
    .ds-token code { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-ink); display: block; margin-bottom: 6px; }
    .ds-swatch { width: 100%; height: 48px; border-radius: var(--radius-sm); margin-bottom: 8px; }
    .ds-code { background: var(--color-ink); color: #E8EEF2; font-family: var(--font-mono); font-size: 0.8rem; padding: 14px 16px; border-radius: var(--radius-md); overflow-x: auto; margin-top: 10px; }
  </style>
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to content</a>

  <nav class="site-nav">
    <div class="site-nav__wrap">
      <a href="../index.html" class="site-nav__brand">
        <svg class="site-nav__mark" width="34" height="34" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="40" height="40" rx="9" fill="#16324A"/>
          <line x1="13" y1="10" x2="13" y2="30" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
          <line x1="13" y1="20" x2="29" y2="20" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
        </svg>
        <span class="site-nav__name">Tyler Quackenbush</span>
      </a>
      <ul class="site-nav__list" id="site-nav-list">
        <li><a href="../work.html" class="site-nav__link">Work</a></li>
        <li><a href="../about.html" class="site-nav__link">About</a></li>
        <li><a href="../brand-identity.html" class="site-nav__link">Brand Identity</a></li>
        <li><a href="../contact.html" class="site-nav__link">Contact</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-list">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <div class="ds-nav">
    <a href="#color">Color</a>
    <a href="#type">Typography</a>
    <a href="#spacing">Spacing</a>
    <a href="#buttons">Buttons</a>
    <a href="#cards">Cards</a>
    <a href="#nav">Navigation</a>
    <a href="#states">States</a>
    <a href="#future">Future</a>
  </div>

  <main id="main-content">
    <section class="about-header">
      <p class="label-mono">Design System</p>
      <h1 class="about-header__title">The tokens and components behind this site, rendered from the real stylesheet.</h1>
      <p class="about-header__intro">This page uses <code>css/styles.css</code> directly &mdash; nothing here is a screenshot or a separate design file. If it looks wrong here, it looks wrong in production. See the <a href="../brand-identity.html">Brand Identity</a> page for the thinking behind these choices.</p>
    </section>

    <section class="about-block" id="color">
      <h2 class="label-mono">Color</h2>
      <div class="ds-row">
        <div class="ds-token"><div class="ds-swatch" style="background:#16324A;"></div><code>--color-ink</code>#16324A &middot; 13.2:1</div>
        <div class="ds-token"><div class="ds-swatch" style="background:#4A5568;"></div><code>--color-ink-dim</code>#4A5568 &middot; 7.5:1</div>
        <div class="ds-token"><div class="ds-swatch" style="background:#6B7680;"></div><code>--color-muted</code>#6B7680 &middot; 4.6:1</div>
        <div class="ds-token"><div class="ds-swatch" style="background:#FFFFFF;border:1px solid var(--color-border);"></div><code>--color-bg</code>#FFFFFF</div>
        <div class="ds-token"><div class="ds-swatch" style="background:#F7F8F9;"></div><code>--color-surface</code>#F7F8F9</div>
        <div class="ds-token"><div class="ds-swatch" style="background:#8C5A1E;"></div><code>--color-accent</code>#8C5A1E &middot; 5.8:1</div>
        <div class="ds-token"><div class="ds-swatch" style="background:#B5762A;"></div><code>--color-accent-strong</code>#B5762A &middot; 3.8:1, large-text only</div>
        <div class="ds-token"><div class="ds-swatch" style="background:#EAEAEA;"></div><code>--color-border</code>#EAEAEA</div>
      </div>
    </section>

    <section class="about-block" id="type">
      <h2 class="label-mono">Typography</h2>
      <div class="ds-row">
        <div class="ds-token" style="min-width:280px;">
          <p style="font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:2rem;color:var(--color-ink);">Space Grotesk</p>
          <code>--font-heading</code>Headings, 500/600/700
        </div>
        <div class="ds-token" style="min-width:280px;">
          <p style="font-family:'Public Sans',sans-serif;font-size:2rem;color:var(--color-ink);">Public Sans</p>
          <code>--font-body</code>Body copy, 400/500/600
        </div>
        <div class="ds-token" style="min-width:280px;">
          <p style="font-family:'JetBrains Mono',monospace;font-size:2rem;color:var(--color-ink);">JetBrains Mono</p>
          <code>--font-mono</code>Eyebrows, labels
        </div>
      </div>
      <div class="ds-code">.label-mono { font-family: var(--font-mono); font-size: var(--label-size); text-transform: uppercase; letter-spacing: var(--label-tracking); color: var(--color-accent); }</div>
    </section>

    <section class="about-block" id="spacing">
      <h2 class="label-mono">Spacing &amp; Radius</h2>
      <div class="ds-row">
        <div class="ds-token"><code>--radius-sm</code>4px</div>
        <div class="ds-token"><code>--radius-md</code>8px</div>
        <div class="ds-token"><code>--radius-lg</code>12px</div>
        <div class="ds-token"><code>--radius-xl</code>16px</div>
        <div class="ds-token"><code>--radius-pill</code>999px</div>
        <div class="ds-token"><code>--section-padding-x</code>clamp(24px, 6vw, 96px)</div>
        <div class="ds-token"><code>--section-padding-y</code>clamp(56px, 9vh, 100px)</div>
        <div class="ds-token"><code>--content-max-width</code>1120px</div>
      </div>
    </section>

    <section class="about-block" id="buttons">
      <h2 class="label-mono">Buttons</h2>
      <div class="ds-row" style="align-items:center;">
        <a href="#" class="btn btn--primary" onclick="return false;">Primary button</a>
        <a href="#" class="btn btn--outline" onclick="return false;">Outline button</a>
      </div>
      <details>
        <summary class="label-mono" style="cursor:pointer;">View markup</summary>
        <div class="ds-code">&lt;a href="#" class="btn btn--primary"&gt;Primary button&lt;/a&gt;
&lt;a href="#" class="btn btn--outline"&gt;Outline button&lt;/a&gt;</div>
      </details>
    </section>

    <section class="about-block" id="cards">
      <h2 class="label-mono">Cards</h2>
      <div class="cs-stats" style="max-width:600px;">
        <div class="cs-stat">
          <span class="cs-stat__value">40+</span>
          <p class="label-mono cs-stat__label">Stat card</p>
        </div>
        <div class="cs-stat">
          <span class="cs-stat__value">90%</span>
          <p class="label-mono cs-stat__label">Stat card</p>
        </div>
      </div>
      <p class="tools-grid__value" style="margin-top:8px;">Used across case studies (<code>.cs-stat</code>) and the About/Brand Identity pages (<code>.tools-grid__col</code>).</p>
    </section>

    <section class="about-block" id="nav">
      <h2 class="label-mono">Navigation</h2>
      <p class="lede">Full-width bar, centered 1120px inner wrap (<code>.site-nav</code> / <code>.site-nav__wrap</code>). Mobile collapses to a hamburger-triggered dropdown below 780px, using <code>inert</code> to remove the closed menu from the tab order and accessibility tree.</p>
    </section>

    <section class="about-block" id="states">
      <h2 class="label-mono">States &amp; Feedback</h2>
      <p class="lede">Every interactive element (<code>.btn</code>, <code>.site-nav__link</code>, <code>.work-list__link</code>, <code>.cs-next__link</code>, <code>.cta-band__link</code>) pairs <code>:hover</code> with <code>:focus-visible</code> so keyboard users get the same feedback as mouse users. The stat counter (<code>[data-count-to]</code>) respects <code>prefers-reduced-motion</code> and jumps straight to the final value rather than animating for users who've opted out.</p>
    </section>

    <section class="about-block" id="future">
      <h2 class="label-mono">Future Components</h2>
      <p class="lede">Not yet built, but the visual language already implies these if they're ever needed: a form/input pattern (this site has no forms yet &mdash; contact is mailto-only, deliberately, to avoid collecting data this site has no server to handle securely), a loading/skeleton state for the stat counter's pre-animation moment, and a toast/inline-confirmation pattern for a future "copy to clipboard" affordance on the microcopy specimens.</p>
    </section>
  </main>

  <footer class="site-footer">
    <div class="site-footer__wrap">
      <span class="site-footer__name">Tyler Quackenbush</span>
      <a href="mailto:tyler.qbush@gmail.com" class="site-footer__email">tyler.qbush@gmail.com</a>
    </div>
  </footer>

  <script src="../js/main.js?v=20260725"></script>
</body>
</html>
```

Note: this page's `<style>` block in `<head>` is intentional and scoped only to `.ds-*` classes used exclusively on this page (sticky sub-nav, token cards, code blocks) — everything else on the page reuses the site's real, shared classes (`.about-header`, `.about-block`, `.btn`, `.cs-stat`, `.label-mono`, `.lede`). Do not move the `.ds-*` rules into the shared `css/styles.css` file; they're single-page-only by design, matching how this page is explicitly an internal reference rather than a primary site page.

- [ ] **Step 3: Run the assertion again, verify it passes**

Run: `grep -c "Design System" design-system/index.html`
Expected: at least `1`

- [ ] **Step 4: Manual verification check**

Start a local server: `python3 -m http.server 8000 --directory "$(pwd)" &`
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/design-system/index.html` → should be 200
- `curl -s http://localhost:8000/design-system/index.html | grep -c 'noindex, nofollow'` → should be 1
- `curl -s http://localhost:8000/design-system/index.html | grep -c 'ds-swatch'` → should be non-zero
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/brand-identity.html` → should now be 200, and its Design System link should resolve: `curl -s http://localhost:8000/brand-identity.html | grep -o 'href="design-system/index.html"'` should return the match
Stop the server: `kill %1`

- [ ] **Step 5: Commit**

```bash
git add design-system/index.html
git commit -m "Add Design System reference page (Super Pages pattern), rendered from the real production CSS"
```

## Context

This is Task 5 of the Phase 2 plan, and the last one Brand Identity (Task 4) links to. Follows the Super Pages pattern: real production CSS, no separate design file, `noindex, nofollow` since it's an internal reference. This is a new subdirectory (`design-system/`), so double-check relative paths use `../` throughout, same convention as `work/`.

## Before You Begin

If you have questions, ask them now.

## Your Job

1. Implement exactly what's specified (create design-system/index.html)
2. Run all verification commands
3. Commit with the exact message given
4. Self-review
5. Report back

Work from: `/Users/tyler/Documents/Portfolio Site`

## Code Organization

One new file in a new subdirectory: design-system/index.html. Do not modify css/styles.css — this page's page-specific styles live in its own `<style>` block, deliberately not in the shared stylesheet.

## When You're in Over Your Head

If anything is unexpected, STOP and report BLOCKED or NEEDS_CONTEXT with specifics.

## Before Reporting Back: Self-Review

Check: HTML matches spec exactly, all relative paths use `../` correctly, `noindex, nofollow` present, all curl checks passed, commit succeeded, git status clean.

## Report Format

- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- What you implemented
- All verification command outputs
- Files changed
- Git commit SHA
- Self-review findings
- Any issues or concerns

---

## Task 6: Rebuild ACCT International case study

**Files:**
- Modify: `work/acct-international.html` (full rewrite into the new template)
- Modify: `work/ung.html` (update "Next case study" link to point to ACCT International instead of Agile Defense — extending the chain)

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "Building a brand board members" work/acct-international.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Overwrite `work/acct-international.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ACCT International | Tyler Quackenbush</title>
  <meta name="description" content="Rebuilding a brand identity system that could hold up next to safety regulators and insurance auditors." />
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="ACCT International | Tyler Quackenbush" />
  <meta property="og:description" content="Rebuilding a brand identity system that could hold up next to safety regulators and insurance auditors." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="../assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="ACCT International | Tyler Quackenbush" />
  <meta name="twitter:description" content="Rebuilding a brand identity system that could hold up next to safety regulators and insurance auditors." />
  <meta name="twitter:image" content="../assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Public+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css?v=20260725" />
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to content</a>

  <nav class="site-nav">
    <div class="site-nav__wrap">
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
        <li><a href="../about.html" class="site-nav__link">About</a></li>
        <li><a href="../brand-identity.html" class="site-nav__link">Brand Identity</a></li>
        <li><a href="../contact.html" class="site-nav__link">Contact</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-list">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <main id="main-content">
    <section class="cs">
      <a href="../work.html" class="label-mono cs__back">&larr; All case studies</a>
      <p class="label-mono cs__eyebrow">Brand Identity</p>
      <h1 class="cs__title">Building a brand board members, regulators, and instructors could all stand behind</h1>
      <p class="cs__meta">Brand Redesign &middot; ACCT International &middot; Figma</p>

      <div class="cs-stats">
        <div class="cs-stat">
          <span class="cs-stat__value" data-count-to="6">0</span>
          <p class="label-mono cs-stat__label">Brand system phases</p>
        </div>
        <div class="cs-stat">
          <span class="cs-stat__value" data-count-to="3">0</span>
          <p class="label-mono cs-stat__label">Stakeholder groups aligned</p>
        </div>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Situation</h2>
        <p class="cs-section__body">ACCT teaches people to build and inspect challenge courses, the ropes-and-ziplines kind, where a mistake is not hypothetical. Their brand looked like a hobbyist forum. That's a trust problem, not just a design one, when the people reading it are safety regulators and insurance auditors deciding whether to take you seriously.</p>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Approach</h2>
        <p class="cs-section__body">I rebuilt the identity system from the ground up: logo, type, the whole visual language, running it through discovery with board members and staff, a brand audit, and a strategy phase that settled on three themes &mdash; trust, structure, adventure. Getting board members, safety regulators, and industry veterans to agree on anything is rare. They agreed on this one.</p>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Outcome</h2>
        <p class="cs-section__body">The system rolled out across print, digital, and event materials with one toolkit to keep it consistent going forward. A board member's reaction after rollout: "the first time we've ever felt truly professional." I'm still thinking about what the brand must have looked like before that.</p>
        <ul class="cs-outcome-list">
          <li>6-phase brand system, discovery through rollout</li>
          <li>3 stakeholder groups (board, regulators, industry veterans) aligned on one direction</li>
          <li>Full toolkit delivered for consistent use across print, digital, and events</li>
        </ul>
      </div>

      <div class="cs-next">
        <p class="label-mono">Next case study</p>
        <a href="adventure-careers.html" class="cs-next__link">Adventure Careers &rarr;</a>
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
    <div class="site-footer__wrap">
      <span class="site-footer__name">Tyler Quackenbush</span>
      <a href="mailto:tyler.qbush@gmail.com" class="site-footer__email">tyler.qbush@gmail.com</a>
    </div>
  </footer>

  <script src="../js/main.js?v=20260725"></script>
</body>
</html>
```

Note the stat values use `data-count-to="6"` and `data-count-to="3"` with no suffix (unlike the primary case studies' `+`/`%` suffixes) since these are plain counts, not percentages or open-ended figures — and the starting text is `0`, not `0+`/`0%`, matching that.

- [ ] **Step 3: Update `work/ung.html`'s next-case-study link**

Find:
```html
      <div class="cs-next">
        <p class="label-mono">Next case study</p>
        <a href="agile-defense.html" class="cs-next__link">Agile Defense &rarr;</a>
      </div>
```
Replace with:
```html
      <div class="cs-next">
        <p class="label-mono">Next case study</p>
        <a href="acct-international.html" class="cs-next__link">ACCT International &rarr;</a>
      </div>
```

- [ ] **Step 4: Run the assertion again, verify it passes**

Run: `grep -c "Building a brand board members" work/acct-international.html`
Expected: `1`

- [ ] **Step 5: Manual verification check**

Start a local server: `python3 -m http.server 8000 --directory "$(pwd)" &`
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/work/acct-international.html` → should be 200
- `curl -s http://localhost:8000/work/acct-international.html | grep -c 'cs-stat__value'` → should be 2
- `curl -s http://localhost:8000/work/acct-international.html | grep -c '<img'` → should be 0 (text-only, no exceptions)
- `curl -s http://localhost:8000/work/ung.html | grep -o 'href="acct-international.html"'` → should return the match
Stop the server: `kill %1`

- [ ] **Step 6: Commit**

```bash
git add work/acct-international.html work/ung.html
git commit -m "Rebuild ACCT International into the new case-study template, extend chain from UNG"
```

## Context

This is Task 6 of the Phase 2 plan. ACCT International is a demoted (secondary) case study — visual/brand-identity work, off-thesis for a content-design role but good for range. Per the spec, it gets no numbered eyebrow (unlike the primary three's "01 · Federal" etc.) since it's not part of the "three engagements" the homepage narrates. This task also extends the case-study "Next" chain: it used to close as UNG → Agile Defense; now it's UNG → ACCT International → (Task 7 will make Adventure Careers → Agile Defense, closing the full 5-way loop).

## Before You Begin

If you have questions, ask them now.

## Your Job

1. Implement exactly what's specified (rewrite work/acct-international.html, update work/ung.html's next-link)
2. Run all verification commands
3. Commit with the exact message given
4. Self-review
5. Report back

Work from: `/Users/tyler/Documents/Portfolio Site`

## Code Organization

Two files: work/acct-international.html (full rewrite), work/ung.html (one link changed).

## When You're in Over Your Head

If anything is unexpected, STOP and report BLOCKED or NEEDS_CONTEXT with specifics.

## Before Reporting Back: Self-Review

Check: HTML matches spec exactly, no images anywhere, UNG's next-link updated correctly, all curl checks passed, commit succeeded, git status clean.

## Report Format

- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- What you implemented
- All verification command outputs
- Files changed
- Git commit SHA
- Self-review findings
- Any issues or concerns

---

## Task 7: Rebuild Adventure Careers case study

**Files:**
- Modify: `work/adventure-careers.html` (full rewrite into the new template, closing the case-study chain back to Agile Defense)

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "Making a two-person outdoor-jobs startup" work/adventure-careers.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Overwrite `work/adventure-careers.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Adventure Careers | Tyler Quackenbush</title>
  <meta name="description" content="Building the brand and the site at once for a mobile-first outdoor-industry job board." />
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:title" content="Adventure Careers | Tyler Quackenbush" />
  <meta property="og:description" content="Building the brand and the site at once for a mobile-first outdoor-industry job board." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="../assets/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Adventure Careers | Tyler Quackenbush" />
  <meta name="twitter:description" content="Building the brand and the site at once for a mobile-first outdoor-industry job board." />
  <meta name="twitter:image" content="../assets/images/og-image.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Public+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css?v=20260725" />
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to content</a>

  <nav class="site-nav">
    <div class="site-nav__wrap">
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
        <li><a href="../about.html" class="site-nav__link">About</a></li>
        <li><a href="../brand-identity.html" class="site-nav__link">Brand Identity</a></li>
        <li><a href="../contact.html" class="site-nav__link">Contact</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav-list">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <main id="main-content">
    <section class="cs">
      <a href="../work.html" class="label-mono cs__back">&larr; All case studies</a>
      <p class="label-mono cs__eyebrow">Brand &amp; Web</p>
      <h1 class="cs__title">Making a two-person outdoor-jobs startup look like a company worth trusting</h1>
      <p class="cs__meta">Website and Brand &middot; Adventure Careers &middot; Figma</p>

      <div class="cs-stats">
        <div class="cs-stat">
          <span class="cs-stat__value" data-count-to="40" data-count-suffix="%">0%</span>
          <p class="label-mono cs-stat__label">Bounce rate reduction</p>
        </div>
        <div class="cs-stat">
          <span class="cs-stat__value" data-count-to="6">0</span>
          <p class="label-mono cs-stat__label">Project phases, insight to launch</p>
        </div>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Situation</h2>
        <p class="cs-section__body">Adventure Careers needed to look like a real company before it quite was one yet. Job boards for outdoor and experiential-ed work tend to look like a Craigslist post that got ambitious, and the people checking listings were doing it on a phone between shifts, not at a desk with time to squint.</p>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Approach</h2>
        <p class="cs-section__body">I built the brand and the site at the same time instead of one then the other, mobile-first from the start. That meant talking to users on both sides of the platform &mdash; job seekers and the employers posting listings &mdash; then designing a bold, youthful identity system and an intuitive job-search flow around what I heard, with specs and live support handed off to dev.</p>
      </div>

      <div class="cs-section">
        <h2 class="label-mono cs-section__label">Outcome</h2>
        <p class="cs-section__body">Bounce rate dropped 40%. Clean navigation and a site that didn't feel like homework got people past the first click. The founder's read on it: "it looks and feels like a real company now." I'll take it.</p>
        <ul class="cs-outcome-list">
          <li>40% reduction in bounce rate</li>
          <li>Mobile-first job-search flow shipped for both sides of the platform</li>
          <li>Full brand and UI system handed off with dev specs and live support</li>
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
    <div class="site-footer__wrap">
      <span class="site-footer__name">Tyler Quackenbush</span>
      <a href="mailto:tyler.qbush@gmail.com" class="site-footer__email">tyler.qbush@gmail.com</a>
    </div>
  </footer>

  <script src="../js/main.js?v=20260725"></script>
</body>
</html>
```

This closes the full 5-way case-study chain: Agile Defense &rarr; Novant Health &rarr; UNG &rarr; ACCT International &rarr; Adventure Careers &rarr; Agile Defense.

- [ ] **Step 3: Run the assertion again, verify it passes**

Run: `grep -c "Making a two-person outdoor-jobs startup" work/adventure-careers.html`
Expected: `1`

- [ ] **Step 4: Manual verification check**

Start a local server: `python3 -m http.server 8000 --directory "$(pwd)" &`
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/work/adventure-careers.html` → should be 200
- `curl -s http://localhost:8000/work/adventure-careers.html | grep -c '<img'` → should be 0
- `curl -s http://localhost:8000/work/adventure-careers.html | grep -o 'href="agile-defense.html"'` → should return the match (closing the loop)
- Now verify the full 5-way chain end to end: `curl -s http://localhost:8000/work/agile-defense.html | grep -o 'href="novant-health.html"'`, `curl -s http://localhost:8000/work/novant-health.html | grep -o 'href="ung.html"'`, `curl -s http://localhost:8000/work/ung.html | grep -o 'href="acct-international.html"'`, `curl -s http://localhost:8000/work/acct-international.html | grep -o 'href="adventure-careers.html"'`, and this task's own `href="agile-defense.html"` check above — all five should return matches, confirming a genuinely closed loop.
Stop the server: `kill %1`

- [ ] **Step 5: Commit**

```bash
git add work/adventure-careers.html
git commit -m "Rebuild Adventure Careers into the new case-study template, close the 5-way chain"
```

## Context

This is Task 7 of the Phase 2 plan, the last case-study rebuild. Closes the full chain (Agile Defense → Novant Health → UNG → ACCT International → Adventure Careers → Agile Defense) started across Phase 1 and Task 6.

## Before You Begin

If you have questions, ask them now.

## Your Job

1. Implement exactly what's specified (rewrite work/adventure-careers.html)
2. Run all verification commands, including the full 5-way chain check
3. Commit with the exact message given
4. Self-review
5. Report back

Work from: `/Users/tyler/Documents/Portfolio Site`

## Code Organization

One file: work/adventure-careers.html (full rewrite).

## When You're in Over Your Head

If anything is unexpected, STOP and report BLOCKED or NEEDS_CONTEXT with specifics.

## Before Reporting Back: Self-Review

Check: HTML matches spec exactly, no images anywhere, the full 5-way chain is genuinely closed (verify by reading each file's next-link directly, not just trusting the plan), commit succeeded, git status clean.

## Report Format

- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- What you implemented
- All verification command outputs (including the full chain check)
- Files changed
- Git commit SHA
- Self-review findings
- Any issues or concerns

---

## Task 8: "Also along the way" section on the work index

**Files:**
- Modify: `work.html`

- [ ] **Step 1: Write the failing assertion**

Run: `grep -c "Also along the way" work.html 2>/dev/null || echo 0`
Expected: `0`

- [ ] **Step 2: Add the demoted-work section**

Find the closing of the `work-list` section in `work.html` — the Microcopy `</article>` followed by `</section>` (added in Task 3):

```html
      <article class="work-list__item work-list__item--last">
        <p class="label-mono work-list__eyebrow">Writing Sample</p>
        <h2 class="work-list__title">Microcopy &amp; Error Messages</h2>
        <p class="work-list__meta">Short-form UX writing</p>
        <p class="work-list__desc">Before-and-after specimens: error messages, button labels, empty states, and status messages &mdash; the small sentences that decide whether someone finishes a task or calls support.</p>
        <a href="work/microcopy.html" class="label-mono work-list__link">Read the samples &rarr;</a>
      </article>
    </section>
```

Replace with (removing `work-list__item--last` from the Microcopy article since it's no longer the final item, and adding a new demoted-work section after the closing `</section>`):

```html
      <article class="work-list__item">
        <p class="label-mono work-list__eyebrow">Writing Sample</p>
        <h2 class="work-list__title">Microcopy &amp; Error Messages</h2>
        <p class="work-list__meta">Short-form UX writing</p>
        <p class="work-list__desc">Before-and-after specimens: error messages, button labels, empty states, and status messages &mdash; the small sentences that decide whether someone finishes a task or calls support.</p>
        <a href="work/microcopy.html" class="label-mono work-list__link">Read the samples &rarr;</a>
      </article>
    </section>

    <section class="also-along">
      <p class="label-mono">Also Along the Way</p>
      <p class="also-along__intro">Two earlier brand and visual-identity projects &mdash; good for range, off-thesis for a content-design role.</p>
      <div class="also-along__grid">
        <a href="work/acct-international.html" class="also-along__item">
          <p class="label-mono also-along__eyebrow">Brand Identity</p>
          <h3 class="also-along__title">ACCT International</h3>
          <p class="also-along__desc">Rebuilding a brand system to hold up next to safety regulators and insurance auditors.</p>
        </a>
        <a href="work/adventure-careers.html" class="also-along__item">
          <p class="label-mono also-along__eyebrow">Brand &amp; Web</p>
          <h3 class="also-along__title">Adventure Careers</h3>
          <p class="also-along__desc">Building the brand and the site at once for a mobile-first outdoor-industry job board.</p>
        </a>
      </div>
    </section>
```

- [ ] **Step 3: Add the "Also along the way" CSS**

Append to `css/styles.css` (at the very end):

```css
/* ---- Also along the way (work.html demoted case studies) ---- */
.also-along {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 48px var(--section-padding-x) 64px;
  border-top: 1px solid var(--color-border);
}

.also-along__intro {
  font-size: 0.9rem;
  color: var(--color-muted);
  margin: 6px 0 24px;
  max-width: 520px;
}

.also-along__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.also-along__item {
  display: block;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 22px 24px;
  transition: transform var(--transition-fast);
}

.also-along__item:hover,
.also-along__item:focus-visible {
  transform: translateY(-2px);
}

.also-along__eyebrow {
  margin-bottom: 8px;
}

.also-along__title {
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.also-along__desc {
  font-size: 0.85rem;
  color: var(--color-ink-dim);
  line-height: 1.55;
}

@media (max-width: 700px) {
  .also-along__grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Run the assertion again, verify it passes**

Run: `grep -c "Also along the way" work.html`
Expected: `1`

- [ ] **Step 5: Manual verification check**

Start a local server: `python3 -m http.server 8000 --directory "$(pwd)" &`
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/work.html` → should be 200
- `curl -s http://localhost:8000/work.html | grep -c 'also-along__item'` → should be 2
- `curl -s http://localhost:8000/work.html | grep -c 'href="work/acct-international.html"'` → should be 1
- `curl -s http://localhost:8000/work.html | grep -c 'href="work/adventure-careers.html"'` → should be 1
Stop the server: `kill %1`

- [ ] **Step 6: Commit**

```bash
git add work.html css/styles.css
git commit -m "Add demoted-work section to work index: ACCT International and Adventure Careers"
```

## Context

This is Task 8 of the Phase 2 plan. Tasks 6-7 (already complete) rebuilt both demoted case studies into the new template; this task surfaces them on the work index under a lighter, visually de-emphasized "Also along the way" heading, per the spec — not in the primary 3-item list, not on the homepage.

## Before You Begin

If you have questions, ask them now.

## Your Job

1. Implement exactly what's specified (edit work.html, append CSS)
2. Run all verification commands
3. Commit with the exact message given
4. Self-review
5. Report back

Work from: `/Users/tyler/Documents/Portfolio Site`

## Code Organization

Two files: work.html (one section added, one class removed), css/styles.css (append-only).

## When You're in Over Your Head

If anything is unexpected, STOP and report BLOCKED or NEEDS_CONTEXT with specifics.

## Before Reporting Back: Self-Review

Check: HTML matches spec exactly, Microcopy item no longer has `--last`, both demoted studies link correctly, CSS appended cleanly, all curl checks passed, commit succeeded, git status clean.

## Report Format

- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- What you implemented
- All verification command outputs
- Files changed
- Git commit SHA
- Self-review findings
- Any issues or concerns

---

## Task 9: Full verification pass and redeploy

**Files:** none (verification and deployment only)

- [ ] **Step 1: Check every path resolves**

```bash
python3 -m http.server 8000 --directory "$(pwd)" &
sleep 1
```
Then individually (not in a loop):
```bash
curl -s -o /dev/null -w "index.html -> %{http_code}\n" "http://localhost:8000/index.html"
curl -s -o /dev/null -w "about.html -> %{http_code}\n" "http://localhost:8000/about.html"
curl -s -o /dev/null -w "work.html -> %{http_code}\n" "http://localhost:8000/work.html"
curl -s -o /dev/null -w "contact.html -> %{http_code}\n" "http://localhost:8000/contact.html"
curl -s -o /dev/null -w "brand-identity.html -> %{http_code}\n" "http://localhost:8000/brand-identity.html"
curl -s -o /dev/null -w "design-system/index.html -> %{http_code}\n" "http://localhost:8000/design-system/index.html"
curl -s -o /dev/null -w "work/agile-defense.html -> %{http_code}\n" "http://localhost:8000/work/agile-defense.html"
curl -s -o /dev/null -w "work/novant-health.html -> %{http_code}\n" "http://localhost:8000/work/novant-health.html"
curl -s -o /dev/null -w "work/ung.html -> %{http_code}\n" "http://localhost:8000/work/ung.html"
curl -s -o /dev/null -w "work/acct-international.html -> %{http_code}\n" "http://localhost:8000/work/acct-international.html"
curl -s -o /dev/null -w "work/adventure-careers.html -> %{http_code}\n" "http://localhost:8000/work/adventure-careers.html"
curl -s -o /dev/null -w "work/microcopy.html -> %{http_code}\n" "http://localhost:8000/work/microcopy.html"
```
Expected: all `200`.

- [ ] **Step 2: Confirm nav consistency across every page**

```bash
grep -L "brand-identity.html" index.html work.html about.html contact.html brand-identity.html design-system/index.html work/agile-defense.html work/novant-health.html work/ung.html work/acct-international.html work/adventure-careers.html work/microcopy.html
```
Expected: no output (empty) — every page's nav includes the Brand Identity link (`grep -L` lists files that DON'T match; empty means all matched).

- [ ] **Step 3: Confirm the full 5-way case-study chain one more time, end to end**

```bash
curl -s http://localhost:8000/work/agile-defense.html | grep -o 'href="novant-health.html"'
curl -s http://localhost:8000/work/novant-health.html | grep -o 'href="ung.html"'
curl -s http://localhost:8000/work/ung.html | grep -o 'href="acct-international.html"'
curl -s http://localhost:8000/work/acct-international.html | grep -o 'href="adventure-careers.html"'
curl -s http://localhost:8000/work/adventure-careers.html | grep -o 'href="agile-defense.html"'
```
Expected: all 5 return a match.

- [ ] **Step 4: Visual pass across breakpoints**

With the server running, open every new/changed page (`contact.html`, `brand-identity.html`, `design-system/index.html`, `work.html`, the rebuilt `work/acct-international.html` and `work/adventure-careers.html`) at desktop (1280px), tablet (768px), and mobile (375px). Confirm: no horizontal scrollbar at any width, content stays centered and capped at 1120px on wide screens (this was the whole point of the earlier correction — don't regress it), the Brand Identity page's lockup/color/typography/in-the-world grids collapse sensibly on mobile, the Design System page's sticky sub-nav doesn't overlap the main site nav, and the "Also along the way" 2-column grid on work.html collapses to 1 column under 700px.

Stop the server: `kill %1`

- [ ] **Step 5: Commit any fixes found during verification**

If Steps 1-4 surfaced any fix, make it, then `git add -A && git commit -m "Fix issues found in Phase 2 verification pass"`. If nothing needed fixing, skip this step — no empty commits.

- [ ] **Step 6: Push to redeploy**

This repo is connected to Cloudflare Pages (pushes to `master` auto-deploy, live at tquack.com). Confirm before pushing — this goes live immediately.

```bash
git push origin master
```

- [ ] **Step 7: Verify the live deployment**

Once Cloudflare Pages finishes building, fetch a couple of key pages with cache disabled to confirm the deploy landed (not just that a build kicked off):

```bash
curl -s "https://tquack.com/brand-identity.html" | grep -c "Take the dense thing"
curl -s "https://tquack.com/contact.html" | grep -c "Let's make the next thing clearer"
```
Both should return `1`. Then re-run the same visual checklist from Step 4 against the live site.
