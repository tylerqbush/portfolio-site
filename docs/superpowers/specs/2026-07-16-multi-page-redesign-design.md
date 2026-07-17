# Multi-Page Site Architecture (Adham-Style) Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement the plan derived from this spec.

**Goal:** Convert the site from a single scrolling homepage into a multi-page site — matching the structure of adhamdannaway.com, the reference site this whole redesign has been modeling itself on — where About, How I Use AI, Tools, Work, and Contact are each their own page, Work has a listing page plus one dedicated page per case study, and Tools is restyled to fix a real layout problem (an increasingly lopsided card grid) while adding four new tools.

**Architecture:** Same static HTML/CSS/vanilla-JS stack, still no build step. The single `index.html` gets split into `index.html` (Home), `about.html`, `ai.html`, `tools.html`, `work.html`, `contact.html`, plus `work/novant-health.html`, `work/acct-international.html`, `work/adventure-careers.html`, `work/discovery-practice.html`. Shared `<head>`/nav/scripts are duplicated across files by hand (no templating layer) — acceptable at this scale (10 pages, one person maintaining it), consistent with how this project has worked from day one.

**Tech Stack:** Unchanged — HTML5, CSS3 custom properties, vanilla JS, GSAP + ScrollTrigger, Google Fonts (Bricolage Grotesque / Instrument Sans / JetBrains Mono). Lenis and Three.js are already gone from prior work in this session.

---

## Background

This follows directly from asking the user what "make navigation and page layout exactly like [Adham Dannaway]'s site" actually meant. The user confirmed the *nav bar chrome itself* (dark fixed bar, mark left, links right) is fine as-is — what needed to change was everything else. Live research on adhamdannaway.com (homepage, portfolio listing, an individual case-study page, and the about page) showed his site is not a single-page scroller at all: every nav item is a separate page, his homepage is lean (hero + a small work teaser, nothing else), his portfolio has a two-tier structure (a listing page of cards, each linking to a full case-study page), and his case-study pages use a specific pattern — title/metadata/intro on the left, hero screenshot framed like a browser window on the right, then a full-width gallery of more screenshots below.

The user separately flagged that they specifically dislike the Tools section's current layout/flow, and asked for four more tools to be added: Copilot, Claude Code, Claude Cowork, and HeyGen (confirmed as two distinct tools, not one).

This spec covers items **C** (navigation, layout, information architecture) and **D** (Tools additions) from an earlier scope breakdown. Two other items from that breakdown — **A** (rewriting site copy to sound more confident, less self-deprecating) and **B** (new case-study visuals matching the user's white papers) — are explicitly out of scope here; both are separate follow-on passes, and B is still waiting on the user re-uploading reference files.

---

## Site Architecture

Ten HTML files, replacing the current single `index.html`:

| File | Content |
|---|---|
| `index.html` | Home: hero only, plus a 3-card Work preview teaser. Nothing else. |
| `about.html` | Current About section content, unchanged, on its own page. |
| `ai.html` | Current "How I Use AI, Actually" section content, unchanged, on its own page. |
| `tools.html` | Tools content, restyled (see below), plus the 4 new tools. |
| `work.html` | Full portfolio listing: all 4 case studies as cards (image, title, category), linking out to their individual pages. |
| `work/novant-health.html` | Novant Health case study, full page. |
| `work/acct-international.html` | ACCT International case study, full page. |
| `work/adventure-careers.html` | Adventure Careers case study, full page. |
| `work/discovery-practice.html` | Agile Defense / Discovery Practice case study (the current flagship), full page. |
| `contact.html` | Current Contact section content, unchanged, on its own page. |

The Resume link stays exactly as it is today — a direct link to `assets/resume.pdf`, not a page.

Every page shares the same fixed top nav, fonts, and `css/styles.css`. Each page gets its own `<title>` and meta description reflecting its content (important now that individual case studies are shareable URLs) — no new social-preview images are generated per page as part of this work; that stays out of scope.

---

## Navigation Mechanism

The current sidebar-era leftover — an IntersectionObserver-based "scroll-spy" that highlights the nav link matching whatever section is in view — no longer applies once content isn't scroll-anchored sections on one page. It gets removed entirely from `js/main.js`.

Replacement: each page's nav marks its own corresponding link `active` directly in the HTML (a static class on page load), the same way a normal multi-page site does it — no JS needed to compute it. `js/main.js` keeps the mobile hamburger toggle logic (still needed, unchanged) but drops the scroll-spy `IntersectionObserver`/`checkBottomOfPage`/`setActiveLink` machinery and the "short final section" / "leading edge" edge-case handling that existed solely to make scroll-spy behave — none of that is needed once nav highlighting is just "which page am I on."

Anchor-based CTAs that pointed at in-page sections change to real page links — e.g. the hero's "My Work" button goes from `href="#work"` to `href="work.html"`.

---

## Home Page

`index.html` becomes just: the existing hero (wordmark, label, bio, CTAs — unchanged from the current build), followed by a new 3-card Work preview teaser (image/title/category, same visual treatment as the full listing page's cards) that links to `work.html`. Everything else currently on the homepage (About, How I Use AI, Tools, Contact) is removed from `index.html` — it now lives only on its own page.

**Which 3 case studies appear in the teaser:** Discovery Practice (the flagship case study, has the strongest content) first, then Novant Health (has real, multi-image assets already), then ACCT International. Adventure Careers is left out of the homepage teaser — it's still on the full `work.html` listing, just not one of the 3 featured on Home. (ACCT and Adventure Careers currently have equally-thin image assets; ACCT was picked arbitrarily as the third slot since a choice has to be made either way.)

---

## Work: Listing Page (`work.html`)

A grid of all 4 case studies, each card showing: case-study hero image, title, and a category label (e.g. "Website Redesign," "Brand Redesign," "Website & Brand," "UX Discovery Practice"). Clicking a card goes to that case study's full page. This is the same card component used for the Home page's 3-card teaser, just showing all 4 items instead of 3.

---

## Work: Case Study Page Template

Applies to all 4 `work/*.html` pages. Two parts:

**Top (hero) region:** title, metadata row (client · project type, in the existing mono/eyebrow style), and a short intro paragraph on the left; the case study's primary image on the right, presented inside a framed "browser window" treatment (rounded container, three small dots along the top like a browser chrome, subtle shadow) rather than a bare image — this is the "more impactful image area" fix.

**Gallery region (full width, below the hero region):** a horizontal strip of additional screenshots, each in a smaller version of the same framed treatment, with left/right arrow controls. This is the "more than one image per case study" fix.

**Below the gallery:** the case study's existing content — description paragraphs, highlights, process steps — carries over from the current single-page version largely unchanged, just laid out for a full page instead of a homepage section.

**Image availability per case study, right now:**
- **Novant Health** has 5 real screenshots already in `assets/images/` (the desktop mockup already in use, plus 4 more phone/desktop screens) — enough to populate a real gallery immediately.
- **Discovery Practice** has 4 existing exhibit SVGs (Threat Readiness, DREAMS, GUARD, COMPLY) already built for this exact purpose (they're already presented as a 4-item exhibit list on the current single-page version) — these become the gallery strip.
- **ACCT International** and **Adventure Careers** currently have only one placeholder SVG each. Their pages get the new template structure, but their galleries will be sparse (one image, or none) until real assets arrive — this is a known gap, not something this pass fixes. That's tracked separately as B.

---

## Tools Page (`tools.html`)

Replaces the current 4-column card grid with two wide columns, no card/box styling — plain grouped lists with generous line spacing, matching the "Part designer / Part coder" pattern seen on Adham's about page. Groups pair up left/right:

- Left column: Design & Prototyping, then Research & Ops
- Right column: AI-Assisted Workflow (styled in the accent color, since it's the group getting the most real content), then Front-End Basics

**AI-Assisted Workflow's updated list:** Claude, ChatGPT, Copilot, Claude Code, Claude Cowork, HeyGen (adds the 4 new tools to the existing 2).

This directly fixes the layout problem the user flagged: in the current 4-column grid, adding 4 more items to AI-Assisted Workflow would make that one card visibly taller than the other three, throwing off the grid. The two-column list layout doesn't have that failure mode.

---

## About / How I Use AI / Contact

Move to their own pages (`about.html`, `ai.html`, `contact.html`) with no content or layout changes — this pass is purely about extracting them from the single scrolling page into standalone pages that match the rest of the new multi-page structure.

---

## Out of Scope

- Copy/voice tone rewrite (item A) — separate follow-on pass
- New case-study visual designs matching the user's white papers (item B) — separate follow-on pass, blocked on the user re-uploading reference files
- Any change to the nav bar's own chrome (logo style, social icons, link set) — user explicitly confirmed this is fine as-is
- Generating new social-preview (`og:image`) assets per page
- A dedicated Resume page (Resume stays a direct PDF link)
