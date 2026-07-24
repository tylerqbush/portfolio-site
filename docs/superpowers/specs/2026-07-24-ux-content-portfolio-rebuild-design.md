# UX Content Designer Portfolio — Full Rebuild

**Date:** 2026-07-24
**Status:** Approved for planning

## Goal

Rebuild tylerquackenbush.com (working title) from scratch as a portfolio for UX Content Designer / Senior Content Writer roles — driven immediately by an application to AT&T's Senior Content Writer, B2B role, and durable for the broader job search. Full rebuild: new visual system, new brand identity, new copy, reconsidered case study lineup. Nothing from the current site's visual design or images carries forward. The whole site, including every case study, is text-forward — no photography, screenshots, or exhibit images anywhere, following the gabbyhon.com case-study format exactly. Existing case-study prose is reused only as source material for rewriting into that format, not as final copy.

## Brand concept: The Plain-Language Translator

Positioning: Tyler takes dense legal, clinical, and technical language and turns it into content a person can act on immediately. This is a direct, literal match for the target role ("turn technical and legal jargon into clear, plain-language content") and it gives every case study a natural before/after spine.

Two alternate directions were considered and rejected: "Systems Builder" (modular-grid mark, more product-ops in tone) and "The Bridge" (two-pillar mark, warmer/more generalist). Translator was chosen as the most honest fit for the work being applied to.

## Visual system

**Palette**

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#16324A` (Deep Navy) | Primary text, nav, footer, primary buttons |
| `--color-bg` | `#FFFFFF` | Page background — true white, no cream/paper tones anywhere in the system |
| `--color-accent` | `#B5762A` (Amber) | CTAs, eyebrows, before/after "after" state, links, active states |
| `--color-ink-dim` | `#4A5568` | Body copy on white |
| `--color-muted` | `#6B7680` | Secondary text, captions |
| `--color-surface` | `#F7F8F9` | Card/strip backgrounds (proof strip, code blocks) |
| `--color-border` | `#EAEAEA` | Hairline dividers |

Verify `--color-accent` on white meets WCAG AA (4.5:1) for body-size text before shipping; if it falls short, darken slightly for text use and reserve the lighter value for large/graphic elements only (mirrors the contrast-margin comments already present in the old `styles.css`).

**Type**

- Headings: Space Grotesk (500/600/700)
- Body: Public Sans (400/500/600) — also the U.S. federal plain-language/accessibility standard typeface (USWDS), a quiet nod to the federal + plain-language throughline
- Eyebrows/labels/mono accents: JetBrains Mono (400/500), uppercase, tracked out
- All-sans system. No serif anywhere.

**Logo**

Lockup A from brainstorming: a rounded-square badge (`--color-ink` fill, 9px corner radius at 40px reference size) containing a bold two-stroke white mark — a vertical bar meeting a horizontal bar (a simplified "flag" gesture reading as compression-into-clarity). Chosen over a looser unboxed version and a wordmark-only "TQ." option because it's the most legible at favicon/app-icon size and gives the brand-identity page a real symbol to document, which the original brief asked for.

Deliverables for the brand-identity page: the mark alone, the mark + wordmark lockup (horizontal, for nav/header), a stacked lockup (for square contexts — social avatar, app icon), clear-space rule (equal to the stroke weight on all sides), and a minimum-size test (16px favicon, 32px app icon, print).

**Structural tokens** (radius scale, shadow scale, spacing scale, transition timing) carry forward from the current `css/styles.css` — that architecture is sound, only the color/type values are being replaced.

## Voice

All copy on the site follows [`docs/voice-guide.md`](../../../voice-guide.md), distilled from the "Can you detect AI" rules the user provided: vary sentence rhythm, name concrete things instead of placeholders, cut em dashes to ~1 per section, avoid the banned-word list, let sections carry one honest opinion instead of uniform positivity, use contractions. Every page of copy (hero, case studies, about, brand-identity rationale, microcopy samples) gets written or reviewed against this file before ship.

## Site architecture

Nav (5 items): **Work · About · Brand Identity · Contact**, plus the logo/home link. `ai.html` and `tools.html` are retired as standalone nav items; their content is folded into About.

| Page | Path | Purpose |
|---|---|---|
| Home | `index.html` | Hero, before/after proof strip, 3 featured case studies, about teaser, footer. Validated in brainstorming — see Homepage section below. |
| Work index | `work.html` | All case studies. 3 primary cards in the locked order, plus a demoted "Also along the way" row for ACCT International and Adventure Careers (visual-identity work — good for range, off-thesis for this role) |
| Agile Defense case study | `work/agile-defense.html` | New page (replaces the program-specific "Discovery Practice" framing) |
| Novant Health case study | `work/novant-health.html` | Rewritten through a content lens |
| UNG case study | `work/ung.html` | New page |
| Microcopy & Error Messages | `work/microcopy.html` | New. Short before/after specimens: error states, button labels, empty states, status messages — answers the AT&T ask directly |
| ACCT International | `work/acct-international.html` | Kept, demoted, rebuilt into the same text-only case study template (images removed) |
| Adventure Careers | `work/adventure-careers.html` | Kept, demoted, rebuilt into the same text-only case study template (images removed) |
| About | `about.html` | Bio, skills, tools, AI-assisted workflow (absorbed from old `ai.html`/`tools.html`), resume download |
| Brand Identity | `brand-identity.html` | The repurposed "world-class brand identity designer" brief, applied to Tyler's own mark — idea, mark, wordmark, lockups, clear space, color, type, "in the world" mockups, rationale. Modeled on gabbyhon.com/brand-identity/ |
| Design System | `design-system/index.html` | Super Pages–style living reference rendered from the real production CSS: tokens, type scale, spacing, buttons, cards, forms, nav, states, future components. Follows `docs/superpowers/SUPER_PAGES.md` if present, otherwise the standard pattern (color → typography → spacing → buttons → cards → forms → navigation → layout → states → future components) |
| Contact | `contact.html` | Contact + resume download |

**Case study order is fixed everywhere:** Agile Defense, Novant Health, UNG.

## Case study content plan

Each primary case study maps to specific resume bullets rather than being invented:

**01 — Agile Defense** (Senior Content Designer, 2021–Present). Content design work broadly, not the narrower "Discovery Practice" program: content audits across digital products, voice/tone guidelines and style guides adopted across teams, legal/compliance collaboration on federal 508 requirements, microcopy and in-product prompts, the intake framework (70% reduction in scope ambiguity), 40+ initiatives on time at 90% stakeholder satisfaction.

**02 — Novant Health** (UX Content Designer via Accrue Partners, 2021). Patient-facing content rewritten into new templates and design-system components during the system-wide redesign; content migration with clarity/accessibility/compliance in mind; 50+ content page builds weekly; revision cycles under 10 minutes/page; image asset migration streamlined 75%. Existing case-study prose (the "filing cabinet" framing, the scheduling-flow narrative) is strong and reused/adapted rather than discarded — it already matches the target voice register.

**03 — UNG** (Web Designer, 2016–2021). Site-wide content and IA redesign across 5,000+ pages, 35% engagement increase; consolidated 20+ navigation menus; content templates, landing pages, and iconography for scannability/accessibility; 2FA onboarding landing page for 20,000+ users.

**Microcopy & Error Messages** page: a scannable gallery of short specimens (error messages, button labels, empty states, status messages), each with a one-line "why" — pulled from the AT&T posting's explicit requirement and not otherwise covered by the three narrative case studies.

**Demoted work** (ACCT International, Adventure Careers): visual/brand-identity projects. Kept for range under an "Also along the way" heading on the work index, not in primary nav rotation, not featured on the homepage.

## Case study template (applies to all 5 case study pages)

Structure follows gabbyhon.com's individual case-study pages exactly, adapted to the locked type system (sans-serif throughout — Space Grotesk for the headline, not Gabby's serif):

1. **Back link** — "← All case studies," top of page, links to `work.html`
2. **Eyebrow** — numbered + category, mono, e.g. "01 · FEDERAL"
3. **Headline** — sentence-case, can wrap 2–3 lines, states the reframe rather than just naming the project (Gabby's pattern: "Reshaping the operating model: turning a reactive service into a roadmapped, product-led design system," not just "Design System Project")
4. **Metadata line** — org · role · years, mono, muted color
5. **Stat grid** — 3–4 cards in a row, each a big number (navy, Space Grotesk) over a mono label; every number must be a real figure from the resume, never invented
6. **Situation** — mono eyebrow label, sentence-case body paragraph(s), no images
7. **Approach** — same pattern; this is where the actual content decisions go (what was audited, what the voice/tone guide said, what got cut and why)
8. **Outcome** — body paragraph plus a restated bullet list of the same metrics from the stat grid, in sentence form
9. **Next case study →** — links to the next entry in the fixed order (Agile Defense → Novant Health → UNG → back to Agile Defense; the two demoted studies link into and out of this same chain at the end)
10. **Closing CTA** — "Want to talk about a role like this?" or similar, linking to Contact, plus a link back to All case studies

No photography, screenshots, or exhibit graphics on any case study page — proof lives in the specificity of the writing and the stat grid, not in visuals. This applies uniformly, including ACCT International and Adventure Careers.

## Homepage (validated in brainstorming)

Structure, locked:

1. **Nav** — badge mark + "Tyler Quackenbush" wordmark, links (Work / About / Brand Identity), Contact as a filled button.
2. **Hero** — eyebrow "UX CONTENT DESIGNER · 8 YEARS," headline "Jargon in. Clarity out.," two-sentence intro naming hospitals/federal contractor/public university and the AT&T-relevant work (error messages, account flows), two CTAs (View case studies / Download resume).
3. **Proof strip** — a real before/after specimen (dense legal draft → plain-language rewrite) directly under the hero, before the reader even reaches case studies.
4. **Selected work** — three case study entries in the locked order, text-forward (no thumbnail images): numbered eyebrow + category, title, role/org/dates in mono, 2–3 sentence situation/approach, bolded Result line with a real metric, "Read the case study →."
5. **About teaser** — real headshot (`assets/images/Headshot.jpeg`), short bio paragraph ending on the AI-workflow disclosure ("I use Claude for research synthesis and first-pass drafts. I still edit every line myself."), link to About.
6. **Footer** — name, email, dark navy field.

## Brand Identity page

Sections, following the Gabby Hon reference structure adapted to Tyler's concept:

1. The idea — plain-language translation as the throughline, tied explicitly to the resume/target-role language
2. The mark — the two-stroke "flag" gesture, what it represents (compression → clarity), why two strokes
3. The wordmark — type choice rationale (Space Grotesk weight/tracking)
4. Lockups — horizontal (mark + name), stacked (square contexts), mark-only
5. Clear space & minimum size — favicon (16px), app icon (32/512px), print
6. Color — the navy/amber/white system with rationale (why navy over the earlier green/teal test, why amber is rationed to "the plain-language moment")
7. Typography — Space Grotesk / Public Sans / JetBrains Mono pairing rationale, including the Public Sans → USWDS/plain-language connection
8. In the world — mockups: business card, resume header, site nav, a "before you scroll" social share card
9. Rationale & positioning — short closing section stating the brand's point of view, written to the voice guide (one real opinion, not uniform positivity)

This page is itself a portfolio artifact: proof of systems-thinking and self-directed brand work, not just a decorative extra.

## Design System page

Standard Super Pages sections, generated from the real production CSS once it exists (not written by hand ahead of the implementation): Color, Typography, Spacing, Buttons, Cards, Forms, Navigation, Layout, States & Feedback, Future Components. `noindex, nofollow`, sticky section nav, collapsible code snippets per the pattern in the project's Super Pages documentation if one is added to this repo, otherwise the standard structure is sufficient.

## Accessibility

Given the target roles explicitly value 508/WCAG compliance, treat AA as a hard floor: contrast-check every color pairing before ship (amber-on-white in particular), full keyboard navigation, meaningful alt text on the headshot (the only photo on the site), semantic heading order (one h1 per page, already a stated convention from the prior redesign's commit history), visible focus states.

## Resolved decisions

1. **Text-only, everywhere, no exceptions.** Case study detail pages carry no supporting screenshots or exhibit images — same treatment as the homepage/index list, matching gabbyhon.com's case-study pages exactly. The existing Novant Health gallery images and ACCT exhibit SVGs are not used in the rebuild.
2. **ACCT International and Adventure Careers get rebuilt into the new case study template** (eyebrow, headline, metadata, stat grid, Situation/Approach/Outcome, Next/CTA) rather than kept as standalone pages in the old format. Existing prose is source material for that rebuild, not final copy, since the template itself is new.
3. Resume file at `assets/resume.pdf` will be replaced with the version tailored to "Senior UX Content Writer / Content Strategist" (the one supplied during brainstorming).
