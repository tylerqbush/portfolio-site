# Tyler Quackenbush UX/UI Portfolio — Landing Page Design

## Purpose

A single-page, awwwards-caliber portfolio site for Tyler Quackenbush, UX/UI Designer. Source of truth for content and layout is Tyler's Figma prototype (`Tyler Quackenbush | UX/UI Portfolio`), captured via browser screenshots and pasted screenshots during brainstorming. Content beyond the Figma (resume synthesis, Tools section) is written fresh to reflect Tyler's current, AI-era skill set.

## Tech stack

Plain HTML/CSS/JS. No build step, no framework. Deployable anywhere (Vercel/Netlify/static host).

Libraries (via CDN):
- **GSAP + ScrollTrigger** — scroll-driven animation (text reveals, stat counters, image wipes, staggered reveals)
- **Lenis** — smooth scroll (MIT licensed, free)
- **Three.js** — hero background flow-field only

Fonts (Google Fonts, free): **Space Grotesk** (headings — geometric, matches Figma's look) + **Inter** (body).

## File structure

```
index.html
css/
  styles.css
js/
  main.js          — nav state, GSAP scroll animations, Lenis init
  hero-scene.js    — Three.js flow-field scene
assets/
  images/          — headshot, project mockups, logos (Tyler will export from Figma; placeholders until then)
  resume.pdf       — synthesized resume, linked from hero CTA + sidebar nav
```

## Layout & navigation

Fixed left-side vertical nav: Home / About / Tools / Work / Contact / Resume. Stays in place while page content scrolls past on the right. Active section is bold/white; others dimmed gray — matches Figma exactly. Anchor-link scrolling to `#home #about #tools #work #contact`; Resume opens `assets/resume.pdf` in a new tab.

**Mobile (<900px):** sidebar collapses into a hamburger-triggered slide-out menu.

## Motion direction: Hybrid (approved)

Faithful to Figma's layout and IA. One elevated "wow" moment: the hero's wavy-line background becomes an interactive Three.js flow-field — thin lines that drift and bend toward the cursor, textural not distracting. Everywhere else, GSAP ScrollTrigger drives: staggered text/element reveals, animated stat counters, clip-path image wipes, and Lenis-smoothed scrolling throughout.

**Performance/reduced-motion:** particle count and draw calls scale down under a viewport-width check; entire Three.js scene disabled under `prefers-reduced-motion: reduce`, falling back to a static/CSS version of the wavy lines.

## Sections & content

### Hero (Home)
- Real headshot (black & white, per Figma)
- "UX UI DESIGNER" oversized label, ghosted "TYLER QUACKENBUSH" behind photo
- Bio: "I'm a Product Designer who crafts dashboards, decision tools, and user journeys that make sense of complexity. I turn ambiguity into clean, intuitive experiences—aligning user needs with business goals. Whether it's streamlining workflows or visualizing data, I bring order to chaos and design that gets out of the way."
- CTAs: "My Work" (scrolls to Work), "Download Resume" (opens PDF)
- GSAP load animation: title → name → bio → CTAs, staggered

### About
Personality Q&A grid, two columns:
- Superpower: Operating from high-agency and turning ideas into action
- Weakness: Getting caught in optimization mode instead of shipping
- Favorite tools: Airtable, ChatGPT, Figma, and a well-worn Bullet Journal
- Favorite part: Structuring chaos
- Best time of day/place to be productive: Early morning with coffee and clear intentions, or any time I'm focused on outcome over process
- I want to be good at: Trusting timing while staying in motion; persuasive copywriting
- I don't want to be good at: Doing things just because "that's how it's always been done"
- Introvert/Extrovert slider (interactive, draggable — not just decorative), positioned center-right per Figma
- Closing statement card: "One of my most valuable qualities is intentional curiosity. I excel at taking complex, ambiguous problems and building clear, actionable systems around them. I bring structure, clarity, and momentum to every team I'm part of."

Staggered card reveal on scroll; slider is a real draggable UI element.

### Tools
Written fresh (not from the original Figma frame, per Tyler's direction that AI has changed his tool set). Grouped:
- **Design & Prototyping:** Figma, Webflow, Photoshop, Illustrator
- **AI-Assisted Workflow:** Claude, ChatGPT
- **Research & Ops:** Airtable, Jira, Confluence
- **Front-end basics:** HTML/CSS, GitHub

Simple animated grid/icon layout, staggered reveal on scroll.

### Work
Three full case studies, in order: Novant Health, ACCT International, Adventure Careers. Each includes:
1. Client name, project title, "Done in: Figma" badge with Figma icon
2. Description paragraph (aim/goal of project)
3. Two highlight callouts (stat + quote, or two stats)
4. "My Process" — 6-step numbered grid (01–06)
5. Supporting images (hero mockup + 2 detail shots) — placeholders until Tyler exports Figma assets

**Novant Health — System-Wide Website Redesign**
> The aim of this project was to improve how patients access care online across Novant Health's digital ecosystem. The project goal was to simplify key flows—like scheduling and provider search—while improving accessibility and scalability.

Detail copy: "Novant Health Website Redesign" — "Simplifying care access for thousands of patients." As part of the UX team, redesigned key sections of Novant Health's website to improve appointment scheduling, care access, and overall usability, especially for mobile users. Worked closely with developers and stakeholders to test prototypes and roll out components in a phased release.

Highlights:
- **Streamlined Appointment Flow** — Helped reduce drop-offs in online scheduling by simplifying key paths and improving mobile UX
- **Recognized by Internal UX Team** — Praised for creating a modular, reusable system that accelerated rollout across multiple departments

Process: 01 UX Audit — Reviewed data and identified user pain points · 02 Team Alignment — Facilitated design priorities across departments · 03 Journey Mapping — Focused on care search and scheduling flows · 04 Accessibility Design — Ensured WCAG compliance from the start · 05 Modular UI — Built scalable, dev-ready design components · 06 QA & Rollout — Tested live environments and supported implementation

**ACCT International — Brand Redesign**
> The aim of this project was to modernize the ACCT brand, helping it better communicate safety, structure, and leadership in the challenge course industry. The project goal was to create a scalable identity system that would work across digital, print, and industry-facing platforms.

Detail copy: "ACCT Brand Redesign" — "Modernizing trust in the challenge course industry." Led a complete brand overhaul for the Association for Challenge Course Technology (ACCT), aligning their visual identity with a modern, professional tone while preserving their roots in adventure and safety. Included a new logo system, typography, and design language extended across digital and print.

Highlights:
- **Unified Diverse Stakeholders** — Successfully aligned voices from nonprofit leadership, regulators, and industry pros into a cohesive brand direction
- **"The first time we've ever felt truly professional."** — Shared by a board member after rollout, speaking to the credibility the new brand brought to the mission

Process: 01 Discovery — Captured voice, values, and vision from board and staff · 02 Brand Audit — Assessed gaps in visual identity and brand perception · 03 Strategy Definition — Clarified core themes: trust, structure, adventure · 04 Visual Design — Created scalable identity system and brand assets · 05 Brand Rollout — Applied across print, digital, and event materials · 06 Delivery — Finalized toolkit for consistent brand use

**Adventure Careers — Website and Brand**
> The aim of this project was to build a fresh, mission-driven brand and job board website that connects young adults with meaningful outdoor work. The project goal was to create an intuitive, visually appealing site that encourages exploration and drives job applications.

Detail copy: "Adventure Careers Branding & Website" — For this startup, built a fresh brand identity and responsive website to connect young adults with outdoor and experiential education jobs. Needed the site to feel like a real company, with fresh visuals and a simple job application flow while keeping it easy to use.

Highlights:
- **Reduced Bounce Rate by 40%** — Clean navigation and mobile-first design drove a major boost in on-site engagement
- **"It looks and feels like a real company now."** — The founder's feedback, capturing how the brand elevated their credibility with job seekers and partners

Process: 01 Audience Insights — Spoke to users on both sides of the job platform · 02 Brand Design — Built a bold, youthful identity system · 03 Site Architecture — Planned intuitive, mobile-first job flow · 04 UI Design — Crafted clean, energetic interface mockups · 05 Dev Collaboration — Provided assets, specs, and live support · 06 Launch Review — Analyzed usage and optimized post-launch

Scroll behavior: each case study briefly pins while images crossfade/wipe (clip-path reveal); stat numbers (e.g. "40%") count up on viewport entry.

### Contact
"You can reach me at" heading, email and phone as tappable/clickable links:
- tyler.qbush@gmail.com (mailto:)
- (678) 451-4471 (tel:)

Styled against the dark, textured background from the Figma screenshot (deep maroon/wine tone in that frame — treat as an accent variation of the site's dark theme, not a literal color match requirement).

### Resume
One synthesized resume (written fresh, not a direct copy of any single source PDF), leading with UX/UI Designer identity, blending in content-strategy/UX-writing depth and the AI-assisted workflow angle as a differentiator. Includes Land to Land Holdings (Founder/Content Lead, 2023–present) as work experience, framed around owning a structured-data-driven website and AI-assisted content systems end-to-end — demonstrating full-stack ownership beyond pure design execution.

Experience included: Agile Defense (formerly Intellibridge, 2021–present), Novant Health (2022), Land to Land Holdings (2023–present), University of North Georgia (2016–2021). Education: BA English Literature, UNG. Certifications: CSM, SAFe for Teams, UX/UI Design for Gaming (ELVTR), Interaction Design Foundation coursework.

Tyler will export this to PDF once the text is approved; the file lands at `assets/resume.pdf`.

## Assets

Tyler will export from Figma and provide a folder path: headshot (b&w), Novant Health mockups, ACCT logo/brand mockups, Adventure Careers mockups. Until provided, these are built with clearly-marked placeholders in the correct positions/aspect ratios so swapping in real assets later requires no layout changes.

## Verification plan

- Chrome DevTools device toolbar checks at mobile (375px), tablet (768px), and desktop (1280px+) breakpoints
- `prefers-reduced-motion` fallback verified
- Manual click-through of nav, scroll animations, case study reveals, contact links, resume download
- Lighthouse pass for basic performance sanity given Three.js hero
