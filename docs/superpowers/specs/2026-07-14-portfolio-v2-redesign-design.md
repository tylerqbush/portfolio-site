# Tyler Quackenbush Portfolio — v2 Redesign ("Structured Chaos")

## Purpose & relationship to v1

This spec supersedes the visual system, voice, and Work section content of `docs/superpowers/specs/2026-07-13-portfolio-landing-page-design.md`. It does **not** change the underlying architecture: still plain HTML/CSS/JS, still GSAP + ScrollTrigger + Lenis + Three.js, still the fixed left sidebar nav with scroll-spy, still fully responsive down to 375px and `prefers-reduced-motion`-aware. Accessibility patterns already built (heading hierarchy, ARIA on the slider, keyboard support, focus-visible states) carry forward and must be preserved through this redesign, not regressed.

**Why v2 exists:** v1 followed Tyler's original Figma prototype closely (dark theme, thin glowing lines, sidebar nav) — a competent but generic "trendy portfolio" look. Tyler explicitly asked for creative latitude to stand out, confirmed a real headshot and additional federal/defense project material, and asked for the site's writing to sound like him specifically rather than resume-speak.

## Visual system: "Structured Chaos"

Selected by Tyler from three options (over the visual companion) specifically because it visually enacts his stated theme — "I bring structure to chaos" — rather than just describing it.

**Palette** (pulled from Tyler's actual headshot, not generic branding colors):
```
--color-bg: #f4efe6        /* warm paper cream, replaces near-black */
--color-ink: #2a2420        /* warm near-black, replaces --color-text */
--color-ink-dim: #8a7c5f    /* muted olive-brown, replaces --color-text-dim */
--color-card: #ffffff       /* index-card white, replaces --color-bg-alt/-card */
--color-accent: #c9542c     /* rust/terracotta stamp accent, replaces wine */
--color-border: rgba(42,36,32,0.12)  /* warm-toned border, was cool gray */
--color-ink-ghost: rgba(42,36,32,0.06)  /* warm-toned ghost-name text, replaces --color-text-ghost */
```

All other v1 tokens not listed here (`--font-body`, `--nav-width`, `--section-padding-x/-y`, `--transition-fast/-medium`) are unchanged and carry forward as-is.

**Type:**
- Headings: **Fraunces** (Google Fonts) — warm, slightly quirky serif, still professional
- Body: **Inter** (unchanged from v1)
- Annotations/kickers/stamps/eyebrows: **IBM Plex Mono** (Google Fonts, new) — sells the "index card / annotation" feel

All three load via the existing Google Fonts `<link>` in `index.html`'s `<head>`, replacing the Space Grotesk + Inter pairing.

## Section-by-section redesign

### Sidebar nav
Same structure and scroll-spy/mobile-hamburger behavior as v1 (Tasks 2–3, 13 fixes all carry forward unchanged). Restyle only: warm palette, active-link color becomes `--color-accent` instead of white, hamburger background becomes `--color-card` with a warm shadow instead of `--color-bg-alt`.

Nav items gain one entry: **Home / About / How I Use AI / Tools / Work / Contact / Resume** — "How I Use AI" is a new section between About and Tools (see below).

### Hero
Same layout skeleton (ghost name behind photo, label, bio, CTAs), restyled:
- Photo: rotated slightly (`-3deg`), framed like it's taped to a corkboard (white "tape" corners via CSS, subtle drop shadow), **using the real headshot** (`assets/images/Headshot.jpeg`, replacing `headshot-placeholder.svg`)
- `.hero__label` (the `<h1>`): becomes a rust-colored "stamp" badge rather than giant background type — smaller, rotated slightly, rust background, cream text
- Ghost name: kept as a large, very faint background typographic element, now in warm ink-on-cream rather than white-on-black — still `aria-hidden`
- Three.js hero scene: re-themed, not discarded (see Technical Notes below)

**Final hero bio copy** (replaces v1's resume-toned paragraph):

> I can walk into a mess (a spreadsheet with fourteen tabs, a stakeholder meeting that raised more questions than it answered) and find the one decision that makes everything else fall into place. Eight years of dashboards and decision tools, for a hospital system, federal defense and law enforcement agencies, and a couple of teams who just needed someone to stop the redesign meetings from restarting every sprint. Give me the mess. I'll hand you back something that makes sense.

CTAs unchanged in function ("My Work" scrolls to Work, "Download Resume" opens the PDF).

### About
Layout concept change: the personality Q&A grid becomes literal **index cards** — each `.about__item` starts at a slightly random rotation/offset (baked in via a small set of CSS modifier classes, e.g. `.about__item--tilt-1` through `--tilt-4`, cycling), and GSAP animates them from scattered to a perfectly aligned grid as the section scrolls into view. This replaces the current single-block `.reveal-group` fade for `.about__card` with a per-card stagger animation. The closing statement card keeps a simple fade/slide reveal (it's the "and then it's organized" payoff, not part of the scatter).

**Final About copy** (replaces all v1 placeholder answers):

| Label | Copy |
|---|---|
| Superpower | I can walk into a mess, a spreadsheet with fourteen tabs, a Slack thread that never resolved, and find the one decision that makes everything else fall into place. Usually by asking the question everyone else was too embarrassed to ask. |
| Weakness | I'll polish a Figma file for four hours before admitting the real problem is I haven't started the part that actually matters. |
| Favorite tools | Airtable, ChatGPT, Figma, and a bullet journal that's seen better days. |
| Favorite part | Making the complicated thing make sense. Bonus points if I get there by asking the question that makes me sound a little slow. |
| Best time/place to be productive | Early morning, coffee, before anyone's slacked me a "quick question." Otherwise: whenever I'm actually focused on the outcome instead of performing the process. |
| I want to be good at | Trusting that timing while I'm still in motion. Also, writing that actually convinces someone, not just describes the thing. |
| I don't want to be good at | Doing something a certain way just because that's how it's always been done. I'll ask why every single time, even when it's annoying. |

Introvert/Extrovert slider: unchanged functionally (Task 7 + its accessibility fixes carry forward), restyled to the warm palette.

**Closing statement** (replaces v1's):

> I'm nosy in a useful way. Hand me something confusing (an outdated wiki, a form nobody quite remembers the purpose of) and I'll ask enough annoying questions to figure out what it's actually supposed to do. I've made peace with being the person who asks the dumb question in the room, because usually it's the one nobody else wanted to ask, and everyone leaves the meeting actually agreeing on what happens next. That's the job, as far as I'm concerned.

### How I Use AI (new section)

Inserted between About and Tools. Uses the `.section-heading` + `.about__statement`-style card treatment (a single warm card, not a grid) since it's one continuous piece of writing, not a Q&A list. Add `id="ai"` / `data-section="ai"` to match the new nav entry.

**Final copy:**

> **How I Use AI, Actually**
>
> I'll say the thing everyone's dancing around: working with AI mostly feels solo, and calling it a "team" flattens something real. My mentor Russ Unger writes about this better than I do (go read him). The short version I've landed on through my own work: AI gets you to a rough, working draft fast. Embarrassingly fast. Getting from that draft to something you'd put your name on is still the job, and no model does that part for you.
>
> I test this against my own work, not just theory. This site went through a written plan, then every task got implemented, then reviewed twice (once for whether it matched the spec, once for whether the code itself held up) before I'd call it done. That second pass caught real bugs: a slider that snapped where it shouldn't, images that would've gone permanently invisible if a script failed to load. Nobody catches those by trusting the first draft.
>
> That's the workflow at Agile Defense too. We build concept prototypes fast, sometimes in days, because the fastest way to find out if an idea holds up is to put it in front of someone who actually knows the problem. AI gets the prototype into someone's hands quickly. My job (and my team's) is reviewing what comes out before it goes anywhere near a client, same judgment, just applied earlier.
>
> Land to Land Holdings runs the same principle at a smaller scale: AI drafts the listing copy and social content, and I read every word before it goes out. That's the actual workflow. Nothing ships without a human, me, reading it first.

No em dashes anywhere in this copy (confirmed, per Tyler's explicit request — parenthetical asides used instead, consistent with his voice guide).

### Tools
Same 4-category grid, restyled as labeled tabs/drawer (warm card background, rust-colored category label instead of the old uppercase-dim-kicker treatment that a prior code review already flagged as inconsistent — this redesign resolves that flag by design). Add one line of framing copy above the grid:

> The stuff I actually reach for, sorted the way I'd sort it in real life, not the way a resume wants it sorted.

Category contents unchanged from v1 (Figma/Webflow/Photoshop/Illustrator, Claude/ChatGPT, Airtable/Jira/Confluence, HTML&CSS/GitHub).

### Work — four case studies

Layout concept: each case study becomes a **case file** — manila-folder-style framing (a warm tan/kraft-paper card background distinct from the white index-card tone, a small "EXHIBIT" or file-tab label), highlight callouts become **stamped** (rust rubber-stamp visual treatment, rotated slightly), process steps keep the existing numbered-grid pattern (already works well, no structural change needed).

**Case study order:** Novant Health, ACCT International, Adventure Careers, then **Designing the Discovery Practice** (flagship, closes the section — most impressive, most current work last).

#### 1. Novant Health — System-Wide Website Redesign
*(Eyebrow: Novant Health · Done in Figma)*

> Novant Health had a scheduling flow that technically worked, the way a filing cabinet technically works if you already know which drawer everything's in. Patients didn't have that internal map. Providers weren't much better off.
>
> I redesigned the pieces that mattered most: appointment scheduling, provider search, the pages people hit when they're anxious and one thumb away from giving up. Tested with real prototypes, rolled out in phases, built to survive contact with an actual dev team.

Highlights:
- **Streamlined Appointment Flow** — Fewer people gave up mid-booking once the path stopped assuming everyone already knew where to look.
- **Recognized by Internal UX Team** — The system I built got reused by other teams, which is the only compliment that actually matters to me.

Process grid: unchanged from v1 (UX Audit, Team Alignment, Journey Mapping, Accessibility Design, Modular UI, QA & Rollout).

#### 2. ACCT International — Brand Redesign
*(Eyebrow: ACCT International · Done in Figma)*

> ACCT teaches people to build and inspect challenge courses (the ropes-and-ziplines kind, where a mistake is not hypothetical). Their brand looked like a hobbyist forum. That's a trust problem, not just a design one.
>
> I rebuilt the identity system from the ground up (logo, type, the whole language) so it could hold up next to industry regulators and insurance auditors, without losing the part of ACCT that's genuinely about adventure.

Highlights:
- **Unified Diverse Stakeholders** — Board members, safety regulators, and industry veterans do not agree on much. They agreed on this.
- **"The first time we've ever felt truly professional."** — A board member said that after rollout. I'm still thinking about what the brand must have looked like before.

Process grid: unchanged from v1 (Discovery, Brand Audit, Strategy Definition, Visual Design, Brand Rollout, Delivery).

#### 3. Adventure Careers — Website and Brand
*(Eyebrow: Adventure Careers · Done in Figma)*

> Adventure Careers needed to look like a real company before it quite was one yet. Job boards for outdoor and experiential-ed work tend to look like a Craigslist post that got ambitious.
>
> I built the brand and the site at the same time, mobile-first, because the actual users were checking listings between shifts, not sitting at a desk.

Highlights:
- **40% (animated counter, unchanged mechanism)** — Reduced bounce rate. Clean navigation and a site that didn't feel like homework got people past the first click.
- **"It looks and feels like a real company now."** — Founder's words, not mine. I'll take it.

Process grid: unchanged from v1 (Audience Insights, Brand Design, Site Architecture, UI Design, Dev Collaboration, Launch Review).

#### 4. Designing the Discovery Practice (flagship, NEW)
*(Eyebrow: Agile Defense (formerly IntelliBridge) · UX Discovery Practice)*

> Federal agencies don't hand out multi-month discovery engagements on spec. If you want to win the work, you have to show, not tell, and you have to do it in about the time it takes most teams to schedule a kickoff call.
>
> I helped build and run the practice that solved that: a repeatable way to go from "here's a rough problem" to a working, clickable concept prototype in around ten days, used across defense readiness, federal law enforcement, and crisis-response engagements. Every one of them helped win the contract it was built to pitch.

**Process grid (6 steps, replaces the standard 2-desc-paragraph pattern's process — reuses the "Agile Discovery" pipeline from Tyler's own methodology work):**

| # | Step | Description |
|---|---|---|
| 01 | Mission Orientation | Get honest about what the environment can actually support, before promising anything. |
| 02 | Mission Calibration | Workshop the real need against value, speed, and cost, with the people who'll live with the answer. |
| 03 | Research & Investigation | Map the journey, sketch the personas, find where the legacy system is actually failing people. |
| 04 | Analysis & Modeling | Turn findings into something with edges: a prototype, not a slide. |
| 05 | Synthesis Alignment | Bring it back to leadership as a strategic case, not just a screen. |
| 06 | Mission Validation | Test it against the roadmap and the room. If it survives that, it's ready to pitch. |

**Exhibits (NEW layout variant — a 4-item grid replacing the standard 2-highlight pattern; needs new `.case-study__exhibits` / `.exhibit` CSS, not a reuse of `.case-study__highlights`):**

- **Exhibit A — Threat Readiness**: A concept dashboard for a federal defense client, built to make threat and readiness data legible to leadership in one screen instead of six reports.
- **Exhibit B — DREAMS**: A concept HR platform for federal law enforcement recruiting, turning a fragmented hiring pipeline into one dashboard leadership could actually read.
- **Exhibit C — GUARD**: A crisis-response concept unifying health, infrastructure, and cyber risk data that used to live in three separate systems nobody cross-checked.
- **Exhibit D — COMPLY**: A compliance and threat-assessment tracker built to surface the one "not compliant" flag that actually mattered, out of thousands of records.

Each exhibit gets a recreated screen callout (see Assets section below) as its visual, styled consistently with the site's palette rather than the white papers' original blue/yellow IntelliBridge branding.

**Closing reflection paragraph** (sits after the exhibits grid, before/instead of a second highlight row):

> Every one of these stayed a concept prototype until it won the room. That's the actual metric I care about: not whether it looked good in a deck, but whether it was specific enough for someone to say "yes, build that."

**Client naming:** the original defense/threat-readiness white paper had its client name redacted in the source material. Per Tyler's earlier decision, refer to it generically ("a federal defense client") — never invent or guess the redacted name.

### Contact
Structurally unchanged (mailto/tel links, same functions). Restyle: replace the dark wine accent block with a warm postcard/index-card treatment consistent with the rest of the page (no more jarring dark section at the very bottom — the whole site now stays in the warm paper palette start to finish). Heading copy ("You can reach me at") already fits the voice, unchanged.

### Resume
Unchanged in function and file (`assets/resume.pdf`, `assets/resume-print.html`) — the resume stays in standard professional format per Tyler's earlier explicit decision (voice treatment applies to the site, not the downloadable resume). Sidebar/hero links unchanged.

## Assets

- **Real headshot**: `assets/images/Headshot.jpeg` already exists in the project (Tyler dropped it in). Wire it into the hero, replacing `headshot-placeholder.svg`. Given its size (2048×2048, ~1.6MB), the implementation should reference it directly (existing `.hero__photo img` sizing/styling already constrains display size via CSS) — no resizing pipeline exists in this project, so if load performance is a concern it's a candidate for a manual pre-resize by Tyler, noted as a follow-up rather than blocking.
- **Exhibit screen recreations** (4, for the flagship case study): built fresh as simple styled mockups (not photographs of the actual white paper pages) in the site's own warm palette, showing a representative simplified view of each system (a dashboard-style layout with a few stat tiles and a map/list, matching the general shape of what the white papers showed). Per Tyler's confirmation, the source white papers are public (published on IntelliBridge's LinkedIn) and use entirely synthetic data, so faithful recreation is not a confidentiality concern — but recreations should still use **generic, clearly-fictional placeholder data** (e.g., "Agent A," round numbers, no realistic-looking names/emails/addresses) rather than reproducing the specific synthetic PII-style details from the source (e.g., the "James Mitchell" surveillance narrative), because that level of specificity doesn't serve the portfolio's purpose and adds visual noise/confusion about what's real.
- **Novant/ACCT/Adventure Careers placeholders**: still placeholder SVGs pending Tyler's real exports, unchanged follow-up item from v1.

## Technical notes

- **Font swap**: replace Space Grotesk with Fraunces in the Google Fonts `<link>`; add IBM Plex Mono. Update `--font-heading` / add `--font-mono` custom property.
- **Palette swap**: full replacement of the color custom properties in `:root` per the table above. Every existing component (`.sidenav`, `.hero`, `.about__card`, `.tools__group`, `.case-study`, `.contact`, buttons) already references these tokens rather than hardcoded colors (confirmed during v1's code reviews), so this is a low-risk, mostly-contained change — but every section needs a visual re-check after, since contrast ratios must be re-verified against the new light background (v1's contrast checks were against a dark background and do not carry over).
- **Three.js hero re-theme**: `js/hero-scene.js`'s existing flow-field logic (line count, mouse-reactivity, reduced-motion gating, small-screen scaling) is structurally reused. Visual change only: line color/opacity shifts from white-on-transparent to a warm ink tone at low opacity, suggesting sketch/paper-scrap texture rather than glowing tech lines. No change to the reduced-motion fallback behavior (already correct from v1).
- **New component patterns required**: index-card scatter-to-grid (About), exhibits grid (flagship case study), case-file/manila-folder card treatment (Work), stamped highlight badges. These are new CSS (and for the scatter-to-grid, new GSAP timeline logic) — not reuses of v1 patterns, and should get their own implementation tasks.
- **New nav entry**: "How I Use AI" added to the sidebar list and scroll-spy `sections`/`navLinks` queries (both already generic `querySelectorAll` calls that will pick up the new section automatically, per v1's Task 13 code review confirming the `.reveal-group` mechanism has no hardcoded count assumption — the scroll-spy mechanism was verified to have the same property).

## Copyright note (for whoever implements this)

The "How I Use AI" copy above is Tyler's own original writing, informed by (but not copied from) his mentor Russ Unger's LinkedIn writing on the same topic. No phrases, extended metaphors, or specific examples from Russ's posts appear in this spec — the examples used (this site's build process, Agile Defense prototyping, Land to Land Holdings) are Tyler's own real work. Do not add material from Russ's posts beyond what's captured here.

## Deferred / follow-up items (unchanged from v1, still outstanding)

- `og:image` / `twitter:card` meta tags still missing (site has no image preview for link shares yet)
- No `apple-touch-icon`
- Novant Health / ACCT International / Adventure Careers mockup images still placeholders pending Tyler's real exports
- Resume content (separate from this redesign) should still be proofread by Tyler for defensible stat claims before being sent to employers
