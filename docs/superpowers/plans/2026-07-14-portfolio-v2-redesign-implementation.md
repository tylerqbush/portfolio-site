# Portfolio v2 Redesign ("Structured Chaos") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing dark-theme portfolio site into the "Structured Chaos" warm-paper visual system, rewrite all narrative copy in Tyler's voice, add a new "How I Use AI" section, and add a flagship federal UX Discovery case study — per `docs/superpowers/specs/2026-07-14-portfolio-v2-redesign-design.md`.

**Architecture:** Same static HTML/CSS/JS site built in the v1 plan (`docs/superpowers/plans/2026-07-13-portfolio-landing-page-implementation.md`). This plan modifies `index.html`, `css/styles.css`, `js/main.js`, and `js/hero-scene.js` in place, and adds new image assets. No architectural changes — same GSAP/ScrollTrigger/Lenis/Three.js stack, same file structure.

**Tech Stack:** Unchanged from v1 — HTML5, CSS3 custom properties, vanilla JS, GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13, Three.js 0.160.0, Google Fonts (now Fraunces + Inter + IBM Plex Mono, replacing Space Grotesk + Inter).

**Note on verification:** As with v1, this is a static visual site with no test runner — every "Verify" step is a concrete manual check via the `run` skill / Browser tools, not an automated test. Do not skip these.

---

## Task 1: Design Tokens & Fonts — Global Palette Swap

**Files:**
- Modify: `index.html:14` (Google Fonts link)
- Modify: `css/styles.css:1-20` (`:root` block)
- Modify: `css/styles.css` (color token renames throughout, via `sed`)

This task changes ONLY custom-property values and token names — no structural/selector changes. It will leave the Contact section looking visually broken (still dark) until Task 11, and font-family overrides for specific "mono" elements (hero stamp, eyebrows, process numbers, etc.) unhandled until their respective structural tasks — both are expected and noted in Step 5's verification.

- [ ] **Step 1: Update the Google Fonts link in `index.html`**

Find this line (currently line 14):
```html
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

Replace with:
```html
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Replace the `:root` block in `css/styles.css`**

Find the current `:root` block (lines 1-20):
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
```

Replace with:
```css
:root {
  --color-bg: #f4efe6;
  --color-ink: #2a2420;
  --color-ink-dim: #8a7c5f;
  --color-card: #ffffff;
  --color-accent: #c9542c;
  --color-accent-wine: #3a1a1a;
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
}
```

Note: `--color-accent-wine` is kept temporarily (old dark value) so the not-yet-restyled Contact section doesn't render with a missing/transparent background between now and Task 11, which removes it.

- [ ] **Step 3: Rename color tokens throughout the stylesheet**

Run these exact commands, in this order, from the project root:

```bash
cd "/Users/tyler/Documents/Portfolio Site"
sed -i '' 's/var(--color-bg-alt)/var(--color-card)/g' css/styles.css
sed -i '' 's/var(--color-bg-card)/var(--color-card)/g' css/styles.css
sed -i '' 's/var(--color-text-dim)/var(--color-ink-dim)/g' css/styles.css
sed -i '' 's/var(--color-text-ghost)/var(--color-ink-ghost)/g' css/styles.css
sed -i '' 's/var(--color-text)/var(--color-ink)/g' css/styles.css
```

Each command is a literal, exact-string replacement (including the closing parenthesis), so `var(--color-text)` will not accidentally match `var(--color-text-dim)` or `var(--color-text-ghost)` — those are handled by their own, earlier commands.

- [ ] **Step 4: Verify no old token names remain (except the intentionally-kept wine token)**

```bash
grep -n "color-bg-alt\|color-bg-card\|color-text-dim\|color-text-ghost\|var(--color-text)" css/styles.css
```

Expected: no output (empty). Then confirm the wine token is still present exactly once, in `:root`:

```bash
grep -n "color-accent-wine" css/styles.css
```

Expected: two lines — the `:root` declaration and the one usage in `.contact { background: var(--color-accent-wine); }`.

- [ ] **Step 5: Visual verification**

Serve the site (`python3 -m http.server`, fresh port if needed) and load it in the Browser pane. Expected: the whole page now renders in a warm cream/white/rust palette instead of dark — sidebar nav, hero, About, Tools, Work all show cream background with near-black text and white cards. **Exception (expected, not a bug):** the Contact section at the bottom still shows the old dark wine block — this gets fixed in Task 11. **Exception (expected, not a bug):** headings/labels that were previously meant to be small mono annotations (hero label, case-study eyebrows, process step numbers, slider labels, tools category headers) currently render in the new serif (Fraunces) font rather than mono — those get their font-family overridden in their respective structural tasks (2, 5, 7, 8). Confirm no console errors and no 404s (Fraunces/IBM Plex Mono fonts should load with 200s).

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css
git commit -m "Swap to Structured Chaos warm palette and new font stack"
```

---

## Task 2: Hero Redesign

**Files:**
- Modify: `index.html` (headshot src, bio copy, hero label markup)
- Modify: `css/styles.css` (`.hero__label`, `.hero__photo`, `.hero__photo img`)
- Create (git-track): `assets/images/Headshot.jpeg` (already exists on disk, untracked)

- [ ] **Step 1: Swap the headshot image source**

In `index.html`, find:
```html
          <img src="assets/images/headshot-placeholder.svg" alt="Tyler Quackenbush" id="headshot-img" />
```

Replace with:
```html
          <img src="assets/images/Headshot.jpeg" alt="Tyler Quackenbush" id="headshot-img" />
```

- [ ] **Step 2: Rewrite the hero bio copy**

In `index.html`, find:
```html
        <p class="hero__bio">
          I'm a Product Designer who crafts dashboards, decision tools, and user journeys that make sense of complexity.
          I turn ambiguity into clean, intuitive experiences&mdash;aligning user needs with business goals.
          Whether it's streamlining workflows or visualizing data, I bring order to chaos and design that gets out of the way.
        </p>
```

Replace with:
```html
        <p class="hero__bio">
          I can walk into a mess (a spreadsheet with fourteen tabs, a stakeholder meeting that raised more
          questions than it answered) and find the one decision that makes everything else fall into place.
          Eight years of dashboards and decision tools, for a hospital system, federal defense and law
          enforcement agencies, and a couple of teams who just needed someone to stop the redesign meetings
          from restarting every sprint. Give me the mess. I'll hand you back something that makes sense.
        </p>
```

- [ ] **Step 3: Restyle `.hero__label` as a rotated rust stamp badge**

In `css/styles.css`, find:
```css
.hero__label {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw, 4rem);
  color: var(--color-ink-dim);
  margin-bottom: 24px;
}
```

Replace with:
```css
.hero__label {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-bg);
  background: var(--color-accent);
  padding: 8px 16px;
  border-radius: 4px;
  transform: rotate(-2deg);
  margin-bottom: 24px;
}
```

- [ ] **Step 4: Restyle `.hero__photo` as a corkboard-taped polaroid**

In `css/styles.css`, find:
```css
.hero__photo {
  width: min(320px, 60vw);
  margin-left: auto;
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  filter: grayscale(1);
}
```

Replace with:
```css
.hero__photo {
  position: relative;
  width: min(320px, 60vw);
  margin-left: auto;
  margin-bottom: 24px;
  padding: 12px;
  background: var(--color-card);
  border-radius: 4px;
  box-shadow: 0 12px 32px rgba(42, 36, 32, 0.18);
  transform: rotate(-3deg);
}

.hero__photo img {
  display: block;
  width: 100%;
  border-radius: 2px;
}
```

(This removes the v1 grayscale filter — the real photo's warm tones fit the new palette better in color than desaturated.)

- [ ] **Step 5: Track the real headshot file in git**

```bash
cd "/Users/tyler/Documents/Portfolio Site"
git add assets/images/Headshot.jpeg
```

- [ ] **Step 6: Verify**

Reload the page. Expected: the hero shows the real color headshot, tilted slightly and framed like a photo taped to a corkboard (white border, shadow, slight rotation); the "UX UI DESIGNER" label is now a small rotated rust badge with cream mono text instead of giant serif text; the bio reads the new copy. Confirm no console errors, confirm the image loads (Network tab, 200 for `Headshot.jpeg`). Check at 375px width too — photo and badge should still look correct, centered per the existing mobile rules.

- [ ] **Step 7: Commit**

```bash
git add index.html css/styles.css
git commit -m "Redesign hero: real headshot, rust stamp badge, corkboard photo treatment, new bio copy"
```

---

## Task 3: Hero Three.js Re-theme

**Files:**
- Modify: `js/hero-scene.js:38-42`

- [ ] **Step 1: Change the flow-field line color from white to warm ink**

In `js/hero-scene.js`, find:
```javascript
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06 + (index % 5) * 0.01,
    });
```

Replace with:
```javascript
    const material = new THREE.LineBasicMaterial({
      color: 0x2a2420,
      transparent: true,
      opacity: 0.06 + (index % 5) * 0.01,
    });
```

- [ ] **Step 2: Verify**

Reload the page. Expected: the hero's animated flow-field lines are now faint warm dark ink strokes on the cream background (a "pencil sketch" texture) instead of white glowing lines on black. Moving the mouse over the hero should still cause nearby lines to bulge toward the cursor, exactly as before — only the color changed. Confirm reduced-motion still hides the canvas entirely (re-verify via the same `window.matchMedia` override approach used in the v1 build, or defer full re-verification to Task 12's comprehensive pass).

- [ ] **Step 3: Commit**

```bash
git add js/hero-scene.js
git commit -m "Re-theme hero Three.js flow-field to warm ink tone"
```

---

## Task 4: About Content Rewrite

**Files:**
- Modify: `index.html:59-105` (About section copy only — no layout/class changes yet, those are Task 5)

- [ ] **Step 1: Replace all About Q&A content and the closing statement**

In `index.html`, find the entire About section content from `<h3>Superpower</h3>` through the closing `</section>` for `#about` — specifically, replace each of these existing blocks:

Find:
```html
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
```

Replace with:
```html
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
            <p>Making the complicated thing make sense. Bonus points if I get there by asking the question that makes me sound a little slow.</p>
          </div>
```

Find:
```html
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
```

Replace with:
```html
          <div class="about__item">
            <h3>Best time of day/place to be productive</h3>
            <p>Early morning, coffee, before anyone's slacked me a &ldquo;quick question.&rdquo; Otherwise: whenever I'm actually focused on the outcome instead of performing the process.</p>
          </div>
          <div class="about__item">
            <h3>I want to be good at</h3>
            <p>Trusting that timing while I'm still in motion. Also, writing that actually convinces someone, not just describes the thing.</p>
          </div>
          <div class="about__item">
            <h3>I don't want to be good at</h3>
            <p>Doing something a certain way just because that's how it's always been done. I'll ask why every single time, even when it's annoying.</p>
          </div>
```

Find:
```html
      <div class="about__statement reveal-group">
        <p>
          One of my most valuable qualities is intentional curiosity. I excel at taking complex, ambiguous
          problems and building clear, actionable systems around them. I bring structure, clarity, and momentum
          to every team I'm part of.
        </p>
      </div>
```

Replace with:
```html
      <div class="about__statement reveal-group">
        <p>
          I'm nosy in a useful way. Hand me something confusing (an outdated wiki, a form nobody quite
          remembers the purpose of) and I'll ask enough annoying questions to figure out what it's actually
          supposed to do. I've made peace with being the person who asks the dumb question in the room,
          because usually it's the one nobody else wanted to ask, and everyone leaves the meeting actually
          agreeing on what happens next. That's the job, as far as I'm concerned.
        </p>
      </div>
```

- [ ] **Step 2: Verify**

Reload, scroll to About. Confirm all seven Q&A items and the closing statement show the new copy exactly as written above (no leftover v1 text). Confirm no HTML entity rendering issues (curly quotes should render correctly, not as literal `&ldquo;`).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Rewrite About section copy in Tyler's voice"
```

---

## Task 5: About — Index-Card Scatter-to-Grid Layout & Animation

**Files:**
- Modify: `index.html` (remove `reveal-group` class from `.about__card`)
- Modify: `css/styles.css` (`.about__card`, new `.about__item` card styling, `.about__slider-labels` font)
- Modify: `js/main.js` (new scatter-to-grid GSAP block, replacing the generic reveal-group behavior for this specific container)

- [ ] **Step 1: Remove `reveal-group` from the About card container**

In `index.html`, find:
```html
      <div class="about__card reveal-group">
```

Replace with:
```html
      <div class="about__card">
```

(The `.about__statement` div below it keeps its `reveal-group` class unchanged — only the Q&A grid gets the new dedicated animation.)

- [ ] **Step 2: Restyle `.about__card` as a "desk" background and add individual index-card styling for `.about__item`**

In `css/styles.css`, find:
```css
.about__card {
  background: var(--color-card);
  border-radius: 20px;
  padding: clamp(24px, 4vw, 56px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 32px;
}
```

Replace with:
```css
.about__card {
  background: var(--color-bg);
  border: 1px dashed var(--color-border);
  border-radius: 20px;
  padding: clamp(24px, 4vw, 56px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 32px;
}

.about__item {
  background: var(--color-card);
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(42, 36, 32, 0.1);
}
```

- [ ] **Step 3: Switch the Introvert/Extrovert slider labels to mono**

In `css/styles.css`, find:
```css
.about__slider-labels {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-heading);
  margin-bottom: 12px;
}
```

Replace with:
```css
.about__slider-labels {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-ink-dim);
  margin-bottom: 12px;
}
```

- [ ] **Step 4: Add the scatter-to-grid GSAP animation to `js/main.js`**

Find the existing generic scroll-reveal block:
```javascript
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
```

Immediately after that block, add:
```javascript

// ---- About index-card scatter-to-grid reveal ----
if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  const aboutItems = document.querySelectorAll('.about__card .about__item');
  const tilts = [
    { rotate: -3, x: -6, y: 8 },
    { rotate: 2, x: 7, y: -5 },
    { rotate: -1.5, x: 4, y: 6 },
    { rotate: 2.5, x: -7, y: -4 },
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
```

This mirrors the existing pattern of gating ambient animation behind `!prefersReducedMotion`: under reduced motion, this whole block is skipped, so the `.about__item` elements never get an inline `opacity`/`transform` set by JS and simply render at their normal CSS state (fully visible, no rotation) — same safe-degradation pattern already used elsewhere in this file.

- [ ] **Step 5: Verify**

Reload, scroll to About. Expected: before scrolling into view, the seven Q&A index cards are invisible; as the section scrolls into view, they fade and animate in with a staggered, slightly-scattered-to-aligned motion (each card starts faintly rotated/offset and settles into the grid). The closing statement card still does its simple fade (unchanged `reveal-group` behavior). Confirm via `getComputedStyle` or visual inspection that the "Introvert"/"Extrovert" labels now render in the small uppercase mono style. Simulate `prefers-reduced-motion: reduce` (matchMedia override, as done in prior work) and confirm the seven cards are immediately visible with no scatter/rotation and no animation delay. Confirm no console errors in either mode.

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "Add index-card scatter-to-grid layout and animation to About section"
```

---

## Task 6: New "How I Use AI" Section

**Files:**
- Modify: `index.html` (new nav link, new section, inserted between About and Tools)
- Modify: `css/styles.css` (add `.ai` to shared section-margin rule, new `.ai__card` styles)

No JS changes needed — the new section's card reuses the existing generic `.reveal-group` mechanism, and the scroll-spy's `main section[id]` / `.sidenav__link[data-section]` queries are already generic enough to pick up the new section and nav link automatically (confirmed in the v1 build's code review).

- [ ] **Step 1: Add the new nav link**

In `index.html`, find:
```html
        <li><a href="#about" class="sidenav__link" data-section="about">About</a></li>
        <li><a href="#tools" class="sidenav__link" data-section="tools">Tools</a></li>
```

Replace with:
```html
        <li><a href="#about" class="sidenav__link" data-section="about">About</a></li>
        <li><a href="#ai" class="sidenav__link" data-section="ai">How I Use AI</a></li>
        <li><a href="#tools" class="sidenav__link" data-section="tools">Tools</a></li>
```

- [ ] **Step 2: Insert the new section between About and Tools**

In `index.html`, find the `</section>` that closes `#about` immediately followed by the `<section id="tools" ...>` opening tag:
```html
    </section>
    <section id="tools" class="tools">
```

Replace with:
```html
    </section>

    <section id="ai" class="ai">
      <h2 class="section-heading">How I Use AI, Actually</h2>
      <div class="ai__card reveal-group">
        <p>I'll say the thing everyone's dancing around: working with AI mostly feels solo, and calling it a &ldquo;team&rdquo; flattens something real. My mentor Russ Unger writes about this better than I do (go read him). The short version I've landed on through my own work: AI gets you to a rough, working draft fast. Embarrassingly fast. Getting from that draft to something you'd put your name on is still the job, and no model does that part for you.</p>
        <p>I test this against my own work, not just theory. This site went through a written plan, then every task got implemented, then reviewed twice (once for whether it matched the spec, once for whether the code itself held up) before I'd call it done. That second pass caught real bugs: a slider that snapped where it shouldn't, images that would've gone permanently invisible if a script failed to load. Nobody catches those by trusting the first draft.</p>
        <p>That's the workflow at Agile Defense too. We build concept prototypes fast, sometimes in days, because the fastest way to find out if an idea holds up is to put it in front of someone who actually knows the problem. AI gets the prototype into someone's hands quickly. My job (and my team's) is reviewing what comes out before it goes anywhere near a client, same judgment, just applied earlier.</p>
        <p>Land to Land Holdings runs the same principle at a smaller scale: AI drafts the listing copy and social content, and I read every word before it goes out. That's the actual workflow. Nothing ships without a human, me, reading it first.</p>
      </div>
    </section>

    <section id="tools" class="tools">
```

- [ ] **Step 3: Add `.ai` to the shared section layout rule (both desktop and mobile)**

In `css/styles.css`, find:
```css
.about,
.tools,
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
  margin-left: var(--nav-width);
  padding: var(--section-padding-y) var(--section-padding-x);
}
```

Then find (in the `@media (max-width: 900px)` block for About):
```css
  .about,
  .tools,
  .work,
  .contact {
    margin-left: 0;
  }
```

Replace with:
```css
  .about,
  .tools,
  .ai,
  .work,
  .contact {
    margin-left: 0;
  }
```

- [ ] **Step 4: Add `.ai__card` styles**

In `css/styles.css`, immediately after the closing `}` of the `@media (max-width: 900px)` block that contains `.about__card { grid-template-columns: 1fr; }` (i.e., right before the `/* Tools */` comment), add:

```css
/* How I Use AI */
.ai__card {
  background: var(--color-card);
  border-radius: 20px;
  padding: clamp(24px, 4vw, 56px);
  max-width: 720px;
}

.ai__card p {
  color: var(--color-ink-dim);
  font-size: 1.05rem;
  margin-bottom: 20px;
}

.ai__card p:last-child {
  margin-bottom: 0;
}
```

- [ ] **Step 5: Verify**

Reload the page. Confirm the sidebar now shows "How I Use AI" between "About" and "Tools", and clicking it smooth-scrolls to the new section without a page jump. Confirm the section renders as a single warm white card containing the four paragraphs, with a fade-in on scroll (reusing the standard `reveal-group` behavior — verify by checking it's invisible before scroll and fades in around 85% viewport entry, same as other `reveal-group` elements). Confirm scroll-spy correctly highlights "How I Use AI" in the nav while that section is centered in the viewport, and correctly moves to "Tools" once you scroll past it. Confirm no console errors.

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css
git commit -m "Add new How I Use AI section between About and Tools"
```

---

## Task 7: Tools Restyle

**Files:**
- Modify: `index.html` (add intro paragraph)
- Modify: `css/styles.css` (`.tools__group`, `.tools__group h3`, new `.tools__intro`)

- [ ] **Step 1: Add the framing intro line**

In `index.html`, find:
```html
      <h2 class="section-heading">Tools</h2>
      <div class="tools__grid reveal-group">
```

Replace with:
```html
      <h2 class="section-heading">Tools</h2>
      <p class="tools__intro">The stuff I actually reach for, sorted the way I'd sort it in real life, not the way a resume wants it sorted.</p>
      <div class="tools__grid reveal-group">
```

- [ ] **Step 2: Restyle `.tools__group` as a labeled tab/drawer**

In `css/styles.css`, find:
```css
.tools__group {
  background: var(--color-card);
  border-radius: 16px;
  padding: 28px;
}

.tools__group h3 {
  font-size: 1.1rem;
  margin-bottom: 16px;
}
```

Replace with:
```css
.tools__intro {
  color: var(--color-ink-dim);
  max-width: 520px;
  margin-bottom: 32px;
}

.tools__group {
  background: var(--color-card);
  border-left: 3px solid var(--color-accent);
  border-radius: 4px 16px 16px 4px;
  padding: 28px;
}

.tools__group h3 {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-accent);
  margin-bottom: 16px;
}
```

- [ ] **Step 3: Verify**

Reload, scroll to Tools. Confirm the intro line appears above the grid. Confirm each of the four category cards now has a rust-colored left accent border and an asymmetric border-radius (suggesting a file tab), and each category heading (e.g. "Design & Prototyping") renders in small uppercase rust-colored mono type instead of the previous serif style. Confirm the 900px/520px responsive column collapse still works (unchanged from v1).

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "Restyle Tools section as labeled tabs with framing copy"
```

---

## Task 8: Work — Rewrite Existing Three Case Studies & Case-File Restyle

**Files:**
- Modify: `index.html` (Novant Health, ACCT International, Adventure Careers description/highlight copy)
- Modify: `css/styles.css` (`.case-study__media`, new `.case-study__body`, `.case-study__eyebrow`, `.highlight`, `.highlight__stat`, `.case-study__process span`)

Process grids for all three case studies are unchanged — only the description paragraphs, highlight captions, and visual treatment change in this task.

- [ ] **Step 1: Rewrite Novant Health's description and highlights**

In `index.html`, find:
```html
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
```

Replace with:
```html
          <p class="case-study__desc">
            Novant Health had a scheduling flow that technically worked, the way a filing cabinet technically
            works if you already know which drawer everything's in. Patients didn't have that internal map.
            Providers weren't much better off.
          </p>
          <p class="case-study__desc">
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
```

- [ ] **Step 2: Rewrite ACCT International's description and highlights**

In `index.html`, find:
```html
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
```

Replace with:
```html
          <p class="case-study__desc">
            ACCT teaches people to build and inspect challenge courses (the ropes-and-ziplines kind, where a
            mistake is not hypothetical). Their brand looked like a hobbyist forum. That's a trust problem, not
            just a design one.
          </p>
          <p class="case-study__desc">
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
```

- [ ] **Step 3: Rewrite Adventure Careers' description and highlights**

In `index.html`, find:
```html
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
```

Replace with:
```html
          <p class="case-study__desc">
            Adventure Careers needed to look like a real company before it quite was one yet. Job boards for
            outdoor and experiential-ed work tend to look like a Craigslist post that got ambitious.
          </p>
          <p class="case-study__desc">
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
```

- [ ] **Step 4: Restyle case studies as "case files"**

In `css/styles.css`, find:
```css
.case-study__media {
  position: sticky;
  top: 80px;
  border-radius: 16px;
  overflow: hidden;
}
```

Replace with:
```css
.case-study__media {
  position: sticky;
  top: 80px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(42, 36, 32, 0.12);
}
```

Find:
```css
.case-study__eyebrow {
  color: var(--color-ink-dim);
  font-family: var(--font-heading);
  margin-bottom: 8px;
}
```

Replace with:
```css
.case-study__body {
  background: var(--color-kraft);
  border-radius: 16px;
  padding: clamp(24px, 3vw, 40px);
}

.case-study__eyebrow {
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}
```

Find:
```css
.highlight {
  background: var(--color-card);
  border-radius: 12px;
  padding: 20px;
}

.highlight__stat {
  display: block;
  font-family: var(--font-heading);
  font-size: 1.15rem;
  margin-bottom: 8px;
}
```

Replace with:
```css
.highlight {
  background: var(--color-card);
  border: 2px solid var(--color-accent);
  border-radius: 4px;
  padding: 18px 20px;
  transform: rotate(-1deg);
}

.case-study__highlights .highlight:nth-child(2) {
  transform: rotate(1deg);
}

.highlight__stat {
  display: block;
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--color-accent);
  font-size: 1.1rem;
  margin-bottom: 8px;
}
```

Find:
```css
.case-study__process span {
  color: var(--color-ink-dim);
  font-family: var(--font-heading);
  font-size: 0.85rem;
}
```

Replace with:
```css
.case-study__process span {
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 0.85rem;
}
```

- [ ] **Step 5: Verify**

Reload, scroll to Work. Confirm all three case studies (Novant Health, ACCT International, Adventure Careers) show the new copy. Confirm each case study's text content now sits inside a visible kraft-paper-toned card (`.case-study__body`), the eyebrow line ("Novant Health · Done in Figma") renders in small rust-colored mono type, the two highlight cards are white with a rust border and a slight opposing rotation (one tilted left, one right), and the process step numbers ("01", "02"...) render in rust mono type. Confirm the Adventure Careers stat counter still animates 0%→40% correctly (mechanism unchanged, only visual styling changed). Confirm responsive stacking at 900px still works.

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css
git commit -m "Rewrite Novant/ACCT/Adventure Careers copy and restyle case studies as case files"
```

---

## Task 9: Work — New Flagship Case Study ("Designing the Discovery Practice")

**Files:**
- Modify: `index.html` (new 4th `<article class="case-study">`, inserted after Adventure Careers)
- Modify: `css/styles.css` (new `.case-study__exhibits`, `.exhibit`, `.case-study__reflection`; mobile override addition)

This case study uses the existing `.case-study__process` pattern (unchanged structurally) but replaces the standard 2-item `.case-study__highlights` with a new 4-item `.case-study__exhibits` grid.

- [ ] **Step 1: Insert the new case study article**

In `index.html`, find the `</article>` that closes the Adventure Careers case study, immediately followed by `</section>` closing Work:
```html
      </article>
    </section>
```

Replace with:
```html
      </article>

      <article class="case-study case-study--flagship" data-case="discovery-practice">
        <div class="case-study__media reveal-image">
          <img src="assets/images/exhibit-threat-readiness.svg" alt="Concept dashboard exhibit from the UX Discovery practice" />
        </div>
        <div class="case-study__body">
          <p class="case-study__eyebrow">Agile Defense (formerly IntelliBridge) &middot; UX Discovery Practice</p>
          <h3>Designing the Discovery Practice</h3>
          <p class="case-study__desc">
            Federal agencies don't hand out multi-month discovery engagements on spec. If you want to win the
            work, you have to show, not tell, and you have to do it in about the time it takes most teams to
            schedule a kickoff call.
          </p>
          <p class="case-study__desc">
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
          <div class="case-study__exhibits">
            <div class="exhibit">
              <img src="assets/images/exhibit-threat-readiness.svg" alt="Threat Readiness concept dashboard" />
              <h4>Exhibit A &mdash; Threat Readiness</h4>
              <p>A concept dashboard for a federal defense client, built to make threat and readiness data legible to leadership in one screen instead of six reports.</p>
            </div>
            <div class="exhibit">
              <img src="assets/images/exhibit-dreams.svg" alt="DREAMS concept HR platform" />
              <h4>Exhibit B &mdash; DREAMS</h4>
              <p>A concept HR platform for federal law enforcement recruiting, turning a fragmented hiring pipeline into one dashboard leadership could actually read.</p>
            </div>
            <div class="exhibit">
              <img src="assets/images/exhibit-guard.svg" alt="GUARD concept crisis response dashboard" />
              <h4>Exhibit C &mdash; GUARD</h4>
              <p>A crisis-response concept unifying health, infrastructure, and cyber risk data that used to live in three separate systems nobody cross-checked.</p>
            </div>
            <div class="exhibit">
              <img src="assets/images/exhibit-comply.svg" alt="COMPLY concept compliance tracker" />
              <h4>Exhibit D &mdash; COMPLY</h4>
              <p>A compliance and threat-assessment tracker built to surface the one &ldquo;not compliant&rdquo; flag that actually mattered, out of thousands of records.</p>
            </div>
          </div>
          <p class="case-study__desc case-study__reflection">
            Every one of these stayed a concept prototype until it won the room. That's the actual metric I
            care about: not whether it looked good in a deck, but whether it was specific enough for someone to
            say &ldquo;yes, build that.&rdquo;
          </p>
        </div>
      </article>
    </section>
```

- [ ] **Step 2: Add exhibits grid CSS**

In `css/styles.css`, immediately after the `.case-study__process p` rule and before the existing `@media (max-width: 900px)` block for Work, add:

```css
.case-study__exhibits {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 32px 0;
}

.exhibit {
  background: var(--color-card);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(42, 36, 32, 0.1);
}

.exhibit img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.exhibit h4 {
  font-family: var(--font-heading);
  font-size: 0.95rem;
  padding: 14px 16px 4px;
}

.exhibit p {
  color: var(--color-ink-dim);
  font-size: 0.85rem;
  padding: 0 16px 16px;
}

.case-study__reflection {
  margin-top: 8px;
  font-style: italic;
}
```

- [ ] **Step 3: Add the exhibits grid to the existing Work mobile override**

In `css/styles.css`, find the existing Work section's mobile block:
```css
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

Replace with:
```css
@media (max-width: 900px) {
  .case-study {
    grid-template-columns: 1fr;
  }

  .case-study__media {
    position: static;
  }

  .case-study__highlights,
  .case-study__process,
  .case-study__exhibits {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Verify**

Reload, scroll to the bottom of Work (this new case study should be last, after Adventure Careers). Confirm the flagship case study renders with: eyebrow "Agile Defense (formerly IntelliBridge) · UX Discovery Practice", title "Designing the Discovery Practice", two description paragraphs, the 6-step process grid with the new Mission Orientation → Mission Validation labels, a 2×2 grid of four exhibit cards (each showing a placeholder SVG image, title, and caption — the actual SVGs are created in Task 10, so at this point confirm the `<img>` tags are correctly placed and will show broken-image icons until then, which is expected), and the italicized reflection paragraph at the end. Confirm at 900px width the exhibits grid collapses to a single column like the other grids.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css
git commit -m "Add flagship Discovery Practice case study with process grid and exhibits layout"
```

---

## Task 10: Exhibit Screen Recreation Assets

**Files:**
- Create: `assets/images/exhibit-threat-readiness.svg`
- Create: `assets/images/exhibit-dreams.svg`
- Create: `assets/images/exhibit-guard.svg`
- Create: `assets/images/exhibit-comply.svg`

These are simple styled mockups in the site's own warm palette using entirely generic, clearly-fictional placeholder data — not reproductions of the source white papers' specific (if synthetic) names/data. Per the design spec, this keeps the recreations visually consistent with the rest of the site and avoids reproducing unnecessary specific detail from the source material.

- [ ] **Step 1: Create `assets/images/exhibit-threat-readiness.svg`**

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#f4efe6"/>
  <rect x="0" y="0" width="800" height="56" fill="#2a2420"/>
  <text x="24" y="35" font-family="monospace" font-size="18" fill="#f4efe6">THREAT READINESS</text>
  <rect x="24" y="80" width="230" height="100" rx="6" fill="#ffffff"/>
  <text x="44" y="115" font-family="sans-serif" font-size="14" fill="#8a7c5f">Personnel</text>
  <text x="44" y="150" font-family="sans-serif" font-size="28" fill="#c9542c" font-weight="bold">72%</text>
  <rect x="272" y="80" width="230" height="100" rx="6" fill="#ffffff"/>
  <text x="292" y="115" font-family="sans-serif" font-size="14" fill="#8a7c5f">Equipment</text>
  <text x="292" y="150" font-family="sans-serif" font-size="28" fill="#c9542c" font-weight="bold">88%</text>
  <rect x="520" y="80" width="230" height="100" rx="6" fill="#ffffff"/>
  <text x="540" y="115" font-family="sans-serif" font-size="14" fill="#8a7c5f">Supply</text>
  <text x="540" y="150" font-family="sans-serif" font-size="28" fill="#c9542c" font-weight="bold">91%</text>
  <rect x="24" y="200" width="752" height="376" rx="6" fill="#ffffff"/>
  <text x="44" y="230" font-family="sans-serif" font-size="14" fill="#8a7c5f">Regional Overview</text>
  <circle cx="200" cy="340" r="6" fill="#c9542c"/>
  <circle cx="340" cy="300" r="6" fill="#8a7c5f"/>
  <circle cx="480" cy="380" r="6" fill="#c9542c"/>
  <circle cx="600" cy="320" r="6" fill="#8a7c5f"/>
  <circle cx="260" cy="450" r="6" fill="#8a7c5f"/>
  <circle cx="520" cy="470" r="6" fill="#c9542c"/>
  <text x="44" y="560" font-family="sans-serif" font-size="12" fill="#8a7c5f">Region A &middot; Region B &middot; Region C &middot; Region D</text>
</svg>
```

- [ ] **Step 2: Create `assets/images/exhibit-dreams.svg`**

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#f4efe6"/>
  <rect x="0" y="0" width="800" height="56" fill="#2a2420"/>
  <text x="24" y="35" font-family="monospace" font-size="18" fill="#f4efe6">DREAMS &middot; HR PIPELINE</text>
  <rect x="24" y="80" width="230" height="100" rx="6" fill="#ffffff"/>
  <text x="44" y="115" font-family="sans-serif" font-size="14" fill="#8a7c5f">Open Roles</text>
  <text x="44" y="150" font-family="sans-serif" font-size="28" fill="#c9542c" font-weight="bold">64</text>
  <rect x="272" y="80" width="230" height="100" rx="6" fill="#ffffff"/>
  <text x="292" y="115" font-family="sans-serif" font-size="14" fill="#8a7c5f">Screened</text>
  <text x="292" y="150" font-family="sans-serif" font-size="28" fill="#c9542c" font-weight="bold">32</text>
  <rect x="520" y="80" width="230" height="100" rx="6" fill="#ffffff"/>
  <text x="540" y="115" font-family="sans-serif" font-size="14" fill="#8a7c5f">Placed</text>
  <text x="540" y="150" font-family="sans-serif" font-size="28" fill="#c9542c" font-weight="bold">12</text>
  <rect x="24" y="200" width="752" height="376" rx="6" fill="#ffffff"/>
  <text x="44" y="230" font-family="sans-serif" font-size="14" fill="#8a7c5f">Candidates by Field Office</text>
  <rect x="44" y="250" width="712" height="28" rx="4" fill="#f4efe6"/>
  <rect x="44" y="288" width="712" height="28" rx="4" fill="#f4efe6"/>
  <rect x="44" y="326" width="712" height="28" rx="4" fill="#f4efe6"/>
  <rect x="44" y="364" width="712" height="28" rx="4" fill="#f4efe6"/>
  <text x="60" y="269" font-family="sans-serif" font-size="12" fill="#2a2420">Office A &middot; Candidate 001 &middot; 96% match</text>
  <text x="60" y="307" font-family="sans-serif" font-size="12" fill="#2a2420">Office B &middot; Candidate 002 &middot; 94% match</text>
  <text x="60" y="345" font-family="sans-serif" font-size="12" fill="#2a2420">Office C &middot; Candidate 003 &middot; 91% match</text>
  <text x="60" y="383" font-family="sans-serif" font-size="12" fill="#2a2420">Office D &middot; Candidate 004 &middot; 89% match</text>
</svg>
```

- [ ] **Step 3: Create `assets/images/exhibit-guard.svg`**

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#f4efe6"/>
  <rect x="0" y="0" width="800" height="56" fill="#2a2420"/>
  <text x="24" y="35" font-family="monospace" font-size="18" fill="#f4efe6">GUARD &middot; CRISIS RESPONSE</text>
  <rect x="24" y="80" width="230" height="100" rx="6" fill="#ffffff"/>
  <text x="44" y="115" font-family="sans-serif" font-size="14" fill="#8a7c5f">Health Systems</text>
  <text x="44" y="150" font-family="sans-serif" font-size="24" fill="#c9542c" font-weight="bold">Elevated</text>
  <rect x="272" y="80" width="230" height="100" rx="6" fill="#ffffff"/>
  <text x="292" y="115" font-family="sans-serif" font-size="14" fill="#8a7c5f">Infrastructure</text>
  <text x="292" y="150" font-family="sans-serif" font-size="24" fill="#8a7c5f" font-weight="bold">Guarded</text>
  <rect x="520" y="80" width="230" height="100" rx="6" fill="#ffffff"/>
  <text x="540" y="115" font-family="sans-serif" font-size="14" fill="#8a7c5f">Digital</text>
  <text x="540" y="150" font-family="sans-serif" font-size="24" fill="#c9542c" font-weight="bold">Critical</text>
  <rect x="24" y="200" width="752" height="376" rx="6" fill="#ffffff"/>
  <text x="44" y="230" font-family="sans-serif" font-size="14" fill="#8a7c5f">Regional Risk Map</text>
  <circle cx="220" cy="360" r="40" fill="#c9542c" opacity="0.25"/>
  <circle cx="220" cy="360" r="8" fill="#c9542c"/>
  <circle cx="420" cy="420" r="28" fill="#8a7c5f" opacity="0.25"/>
  <circle cx="420" cy="420" r="6" fill="#8a7c5f"/>
  <circle cx="580" cy="320" r="34" fill="#c9542c" opacity="0.25"/>
  <circle cx="580" cy="320" r="7" fill="#c9542c"/>
  <text x="44" y="560" font-family="sans-serif" font-size="12" fill="#8a7c5f">Region A &middot; Region B &middot; Region C</text>
</svg>
```

- [ ] **Step 4: Create `assets/images/exhibit-comply.svg`**

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#f4efe6"/>
  <rect x="0" y="0" width="800" height="56" fill="#2a2420"/>
  <text x="24" y="35" font-family="monospace" font-size="18" fill="#f4efe6">COMPLY &middot; COMPLIANCE TRACKER</text>
  <rect x="24" y="80" width="230" height="100" rx="6" fill="#ffffff"/>
  <text x="44" y="115" font-family="sans-serif" font-size="14" fill="#8a7c5f">Open Assessments</text>
  <text x="44" y="150" font-family="sans-serif" font-size="28" fill="#c9542c" font-weight="bold">2,116</text>
  <rect x="272" y="80" width="230" height="100" rx="6" fill="#ffffff"/>
  <text x="292" y="115" font-family="sans-serif" font-size="14" fill="#8a7c5f">Compliant</text>
  <text x="292" y="150" font-family="sans-serif" font-size="28" fill="#8a7c5f" font-weight="bold">1,842</text>
  <rect x="520" y="80" width="230" height="100" rx="6" fill="#ffffff"/>
  <text x="540" y="115" font-family="sans-serif" font-size="14" fill="#8a7c5f">Flagged</text>
  <text x="540" y="150" font-family="sans-serif" font-size="28" fill="#c9542c" font-weight="bold">17</text>
  <rect x="24" y="200" width="752" height="376" rx="6" fill="#ffffff"/>
  <text x="44" y="230" font-family="sans-serif" font-size="14" fill="#8a7c5f">Not-in-Compliance Results</text>
  <rect x="44" y="250" width="712" height="28" rx="4" fill="#f4efe6"/>
  <rect x="44" y="288" width="712" height="28" rx="4" fill="#f4efe6"/>
  <rect x="44" y="326" width="712" height="28" rx="4" fill="#f4efe6"/>
  <text x="60" y="269" font-family="sans-serif" font-size="12" fill="#2a2420">Assessment 001 &middot; Region A &middot; Flagged</text>
  <text x="60" y="307" font-family="sans-serif" font-size="12" fill="#2a2420">Assessment 002 &middot; Region B &middot; Flagged</text>
  <text x="60" y="345" font-family="sans-serif" font-size="12" fill="#2a2420">Assessment 003 &middot; Region C &middot; Flagged</text>
</svg>
```

- [ ] **Step 5: Verify**

Reload, scroll to the flagship case study. Confirm the main media image (top of the case study) now shows the Threat Readiness dashboard mockup instead of a broken image icon, and all four exhibit cards in the 2×2 grid show their respective mockups (Threat Readiness again for Exhibit A, then DREAMS, GUARD, COMPLY). Confirm no console 404s for any of the four new image files.

- [ ] **Step 6: Commit**

```bash
git add assets/images/exhibit-threat-readiness.svg assets/images/exhibit-dreams.svg assets/images/exhibit-guard.svg assets/images/exhibit-comply.svg
git commit -m "Add recreated exhibit screen mockups for the Discovery Practice case study"
```

---

## Task 11: Contact Restyle

**Files:**
- Modify: `css/styles.css` (`.contact`, new `.contact__inner` card, remove unused `--color-accent-wine` token)

- [ ] **Step 1: Replace the Contact background and add the postcard inner-card treatment**

In `css/styles.css`, find:
```css
/* Contact */
.contact {
  position: relative;
  background: var(--color-accent-wine);
  background-image:
    repeating-linear-gradient(0deg, rgba(245,245,245,0.05) 0 1px, transparent 1px 64px),
    repeating-linear-gradient(90deg, rgba(245,245,245,0.05) 0 1px, transparent 1px 64px);
}
```

Replace with:
```css
/* Contact */
.contact {
  position: relative;
  background: var(--color-kraft);
  background-image:
    repeating-linear-gradient(0deg, rgba(42,36,32,0.05) 0 1px, transparent 1px 64px),
    repeating-linear-gradient(90deg, rgba(42,36,32,0.05) 0 1px, transparent 1px 64px);
}

.contact__inner {
  background: var(--color-card);
  border-radius: 16px;
  padding: clamp(24px, 4vw, 56px);
  max-width: 520px;
  box-shadow: 0 12px 32px rgba(42, 36, 32, 0.12);
}
```

- [ ] **Step 2: Remove the now-unused `--color-accent-wine` token**

In `css/styles.css`, find (in `:root`):
```css
  --color-accent-wine: #3a1a1a;
```

Delete this line entirely.

- [ ] **Step 3: Verify no remaining references**

```bash
cd "/Users/tyler/Documents/Portfolio Site"
grep -n "color-accent-wine" css/styles.css
```

Expected: no output (empty) — confirms the token is fully removed with no dangling references.

- [ ] **Step 4: Visual verification**

Reload, scroll to Contact. Confirm the section now shows a warm kraft-paper background with a faint grid pattern (matching the site's overall palette, no more dark wine block), and the email/phone content sits inside a white "postcard" card with rounded corners and a soft shadow. Confirm the email and phone links still work (`mailto:`/`tel:` hrefs unchanged) and the hover/focus-visible dimming still applies (unchanged from v1, just now reading `var(--color-ink-dim)` instead of the old dark-theme dim tone). Confirm text contrast: near-black text (`--color-ink`) on the white `.contact__inner` card should read clearly.

- [ ] **Step 5: Commit**

```bash
git add css/styles.css
git commit -m "Restyle Contact as a warm postcard card, remove unused wine accent token"
```

---

## Task 12: Full-Site Verification Pass

**Files:** None modified — verification only. Record and fix any issues found in Step 6.

The palette flipped from dark to light, so v1's prior contrast/responsive/reduced-motion verification does not carry over automatically — everything must be re-checked against the new warm theme.

- [ ] **Step 1: Contrast check**

Using the Browser pane's `javascript_tool`, check computed contrast for these text/background pairings across the live page (compute via a quick relative-luminance check, or visually confirm text reads clearly against each background at normal reading distance):
- `--color-ink` (#2a2420) on `--color-bg` (#f4efe6) — body text, headings
- `--color-ink-dim` (#8a7c5f) on `--color-bg` (#f4efe6) — dimmed labels/eyebrows outside cards
- `--color-ink` on `--color-card` (#ffffff) — text inside white cards (About items, AI card, exhibits, contact postcard)
- `--color-ink-dim` on `--color-card` — dimmed text inside white cards
- `--color-bg` (cream) on `--color-accent` (#c9542c) — hero stamp badge text
- `--color-accent` on `--color-bg` and on `--color-kraft` — eyebrows, process numbers, tools category labels

Confirm all pairings are comfortably readable (no low-contrast text). If any pairing reads as too low-contrast on visual inspection, flag it and adjust the specific color value (not the whole palette) before proceeding.

- [ ] **Step 2: Desktop pass (1280x800)**

Resize to 1280x800. Scroll the entire page top to bottom (Home → About → How I Use AI → Tools → Work [4 case studies] → Contact). Confirm: sidebar nav stays fixed and highlights the correct section throughout, including the new "How I Use AI" entry; no horizontal scrollbar at any point; no layout overlap; the About index-card scatter animation, the four Work case studies (including the new flagship with its exhibits grid), and the Contact postcard all render correctly.

- [ ] **Step 3: Tablet pass (768x1024)**

Resize to 768x1024. Confirm: hamburger nav active, About grid reflows to 1 column, Tools grid reflows to 2 columns, case studies stack with non-sticky media, the flagship case study's exhibits grid collapses to 1 column, no text overflow anywhere.

- [ ] **Step 4: Mobile pass (375x812)**

Resize to 375x812. Confirm: hamburger opens/closes correctly and closes after clicking a link (including the new "How I Use AI" link); hero content (stamp badge, tilted photo, bio) is centered and readable without zooming; tap targets remain comfortably sized; the About index cards, AI card, Tools tabs, case-file cards, exhibits grid, and Contact postcard all render without overflow or visual breakage at this width.

- [ ] **Step 5: Reduced-motion pass**

Simulate `prefers-reduced-motion: reduce` (via the `window.matchMedia` override approach used throughout this build). Reload. Confirm: hero Three.js canvas is hidden; hero entrance content is immediately visible with no animation; the About index cards are immediately visible with no scatter/rotation (this is the new animation added in Task 5 — confirm it correctly respects the flag); all `reveal-group` sections (About statement, How I Use AI, Tools, Contact) are immediately visible; case-study image reveals show fully visible (unclipped) images immediately; the Adventure Careers stat shows "40%" immediately with no count-up. Turn emulation back off afterward.

- [ ] **Step 6: Console/network check and fix any issues found**

Hard-reload with DevTools Console and Network tabs open. Confirm: zero console errors, zero unexpected 404s (Fraunces/Inter/IBM Plex Mono fonts, all image assets including the four new exhibit SVGs and the real headshot JPEG, all CDN scripts should resolve). If Steps 1-5 or this step surfaced any issue, fix it in the relevant file and commit separately:

```bash
git add -A
git commit -m "Fix issues found in v2 redesign verification pass"
```

If no issues are found, skip the commit for this step.

- [ ] **Step 7: Confirm clean git state**

```bash
cd "/Users/tyler/Documents/Portfolio Site"
git status
git log --oneline -15
```

Expected: working tree clean (aside from pre-existing unrelated untracked items like `.claude/`, `docs/` if not yet committed, stray OS files), and a clean sequential commit history for this redesign from Task 1 through Task 12 (plus any fix commit from Step 6).

---

## Follow-ups (not in this plan, flag to Tyler)

- Novant Health / ACCT International / Adventure Careers mockup images are still placeholder SVGs (unchanged carryover from v1) — pending Tyler's real exports.
- `og:image` / `twitter:card` meta tags still missing.
- No `apple-touch-icon`.
- Resume content (`assets/resume-print.html` / `assets/resume.pdf`) is unchanged by this redesign and should still be proofread by Tyler for defensible stat claims before being sent to employers.
- The four exhibit SVGs created in Task 10 are simple generic mockups, not pixel-accurate recreations of the source white papers — if Tyler wants higher-fidelity recreations later, that's a follow-up design pass, not a bug in this implementation.
