# Nav, Scroll & Visual Identity Redesign (v3) Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement the plan derived from this spec.

**Goal:** Replace the fixed left sidebar, Lenis-driven smooth scroll, and scroll-spy active-link tracking with a conventional fixed top nav and native browser scroll, and adopt a new "Cool Modern Tech" visual identity, while keeping the existing seven sections of content.

**Architecture:** This is a chrome-and-identity redesign, not a content rewrite. Section markup and copy for About/How I Use AI/Tools/Work/Contact/Resume stay as they are today; what changes is the nav (sidebar → top bar), the scroll mechanics (Lenis smooth-scroll + sidebar scroll-spy → native scroll + top-nav active-link tracking), the hero (asymmetric right-aligned layout → oversized full-width type treatment), and the color/type system (warm "Structured Chaos" cream/rust → cool light "Cool Modern Tech" off-white/blue).

**Tech Stack:** Same as today — plain HTML/CSS/vanilla JS, no build step. GSAP + ScrollTrigger and Three.js stay (used for reveal animations, hero entrance, stat counters, and the flow-field hero canvas). Lenis is removed entirely.

---

## Background

The current site (built across two prior redesign passes) uses a persistent 220px-wide left sidebar for navigation, Lenis for forced smooth-scrolling, and an IntersectionObserver-based scroll-spy that highlights the active sidebar link. The user explicitly rejected carrying any part of this nav/scroll treatment into the next version: *"We are still using the scroll treatment and menu from the original design. I don't want to bring any part of that design over at all."*

To find a direction, we researched real, currently-live portfolio sites (Adham Dannaway, Lionel Taurus/filsdegraphiste.fr, Ian Coad) representing three different approaches — conventional/legible, bold/maximalist, and minimal/cinematic. The user chose the conventional direction (Adham Dannaway: fixed top bar, plain-text nav links, no sidebar, no forced smooth-scroll).

Separately, the user asked whether the visual identity should also change (not just structure) and, after reviewing three palette/type directions in the visual brainstorming companion, chose "Cool Modern Tech" (cool neutral background, near-black ink, one blue accent, clean sans typography) over keeping the existing warm cream/rust system.

The user raised a specific concern: the redesign should not read as generic/"AI-built." An attempt to address this by pre-baking trendy typography (Cabinet Grotesk/Switzer/JetBrains Mono) and a moodier dark-mode palette into the mockup was rejected — the user felt the *original*, simpler light-mode swatch actually read as less generic than the "refined" one. The conclusion: avoiding a generic look is an execution discipline to apply during implementation (via the `frontend-design` skill, installed in this environment specifically to avoid "AI slop" aesthetics), not something to solve by pre-selecting trendy fonts/colors in the spec.

A "duck motif" idea tied to the "Quack" in Quackenbush was explored visually (three directions: a duck integrated into the Q's letterform, a standalone duck logomark, and a recurring quiet motif) and explicitly retired by the user as "silly." The only surviving piece of that exploration is coloring just the substring "QUACK" within "QUACKENBUSH" in the accent color — a typographic detail, no duck iconography.

---

## Visual Identity

**Direction:** "Cool Modern Tech" — light mode.

- Background: cool off-white/soft gray (approximate reference: `#f7f8fa`; exact value to be finalized during implementation)
- Text: near-black ink (approximate reference: `#14151a`)
- Accent: a single blue, used sparingly (exact shade to be chosen during implementation — see guardrails below)
- No secondary/tertiary decorative colors beyond ink, background, and the one accent, consistent with "dominant colors with sharp accents outperform timid, evenly-distributed palettes"

**Typography:** Not pre-selected in this spec. During implementation, choose a distinctive-but-not-trying-too-hard sans-serif pairing (display + body, optionally a mono for labels) using the `frontend-design` skill's guidance.

**Guardrails (from user feedback during brainstorming, apply during implementation):**
- Avoid the most obvious "AI-generated" tells: default Inter/Arial/system-font stacks, flat corporate blue (`#2d5bff`-style), purple gradients, centered-hero-plus-three-cards layout patterns
- But also avoid *overcorrecting* into try-hard trendiness (e.g. stacking multiple currently-fashionable display fonts, decorative gradient blobs) — the user rejected that direction as feeling *more* generic-AI, not less. Simple and considered beats maximally distinctive.
- When in doubt, prefer restraint and precision over adding more visual devices

**Retired from consideration:** the current warm "Structured Chaos" cream/rust/Fraunces system is being replaced, not extended. Any duck-related iconography or wordplay beyond coloring the "QUACK" substring.

---

## Navigation

**Structure:** Solid, always-fixed dark top bar (not transparent, not scroll-triggered — same treatment at all scroll positions, matching the Adham Dannaway reference).

- Left: name/wordmark (small scale, e.g. "TQ" or "Tyler Quackenbush")
- Right: plain-text links for each section (Home, About, How I Use AI, Tools, Work, Contact) plus the Resume link, same set as today
- The link matching the currently-scrolled section is picked out in the accent color (replaces today's bold-weight `.active` treatment on the sidebar)
- Bar height: conventional fixed-header scale (e.g. ~64–72px) — exact value during implementation

**Mobile:** Collapses to a hamburger icon that opens the same link set (dropdown or overlay — implementer's choice, whichever is simpler to build well). A hamburger itself is not "the original design" the user objected to — the persistent sidebar was the problem, not the concept of a mobile menu icon.

**Removed entirely:** the `--nav-width` left-margin layout pattern currently applied to `.hero`, `.about`, `.tools`, `.ai`, `.work`, `.contact`. Sections become full-width (within normal `--section-padding-x`), offset only by the fixed top bar's height (via `padding-top` on `<main>` or the first section).

---

## Hero

**Layout:** Oversized typographic treatment, full width (no longer constrained to the right-hand column the sidebar used to leave available). No photo in the hero.

- "TYLER" on one line, ink color
- "QUACKENBUSH" on the next, with the substring "QUACK" in the accent color and "ENBUSH" in ink — a single wordmark-level color detail, not a logo or icon
- Existing supporting content (role label, short bio, CTA buttons) stays, restyled to the new full-width layout

**Motion:** The existing Three.js flow-field canvas animation behind the ghost-name background text is retained, re-themed to the new cool palette (replace the current warm-ink line color with a value that fits the new system — likely the ink or accent color).

**Photo:** The headshot currently in the hero's polaroid-style frame relocates to the About section (exact placement within About is an implementation detail — the polaroid visual treatment itself, established in the current design, can carry over since it's a photo treatment, not part of the rejected nav/scroll chrome).

---

## Scroll & Motion

**Removed:** Lenis (and its CDN script tag + fallback object in `js/main.js`). Scrolling becomes native browser scroll — `scroll-behavior` can stay `auto` or move to `smooth` for anchor-link jumps (implementer's choice), but no scroll-hijacking library.

**Removed:** the sidebar-specific scroll-spy logic (`spyObserver`, `checkBottomOfPage`, `setActiveLink` as currently wired to `.sidenav__link`) — replaced by an equivalent IntersectionObserver-based mechanism that highlights the active link in the *new top nav* instead. The underlying technique (observe `main section[id]`, highlight by id, handle the short-final-section edge case) can be reused; only the DOM it targets changes.

**Kept:** GSAP + ScrollTrigger, and the reveal animations already built on them — hero entrance timeline, the about-card scatter-to-grid stagger, the case-study image clip-path wipe, and the stat counter tween. These are independent polish, not part of the rejected "menu and scroll treatment," and the user did not ask for them to be removed. `prefers-reduced-motion` gating stays as-is.

**Anchor-link clicks:** currently routed through `lenis.scrollTo()`; once Lenis is removed, these go back to native `element.scrollIntoView({ behavior: 'smooth' })` or a CSS `scroll-behavior: smooth` approach.

---

## Content Structure

No content rewrite. The seven existing sections (Home/Hero, About, How I Use AI, Tools, Work, Contact, Resume) and their copy carry over unchanged, except:

- The hero's headshot photo moves to About (see Hero section above)
- Any layout adjustments strictly required by the sidebar → top-nav change (e.g. `.about__card` grid, `.tools__grid`, `.case-study` grid no longer need to account for a 220px-narrower available width)

The user confirmed they were open to restructuring sections but had no specific structural complaint beyond the chrome itself — so information architecture (section order, what's grouped where) is treated as validated and out of scope for this pass.

---

## Out of Scope

- Resume content rewrite for job-listing relevance (explicitly deferred by the user to a later, separate effort)
- ACCT International / Adventure Careers placeholder images (still waiting on real assets from the user)
- The favicon redesign (already tracked as a separate, previously-spawned background task) — should end up visually consistent with whatever accent color this redesign lands on, but is not implemented as part of this spec
- Duck iconography in any form
