# MASTER BRIEF v2 — POCKET OS × INFINITE CANVAS

> Working version of the brief. The original is kept in [BRIEF-original.md](BRIEF-original.md).
> Execution is split into stages: see [stages/](stages/) and [PLAN.md](PLAN.md).

## What changed from v1 (and why)

| # | Change | Reason |
|---|---|---|
| 1 | New repo `portfolio-personal`; the old site is read-only (§1, §17) | The current portfolio stays online and untouched until the switch |
| 2 | Site language made an explicit decision, i18n-ready content model (§1, §14) | v1 never said which language the site is in, and it affects the content model and routes |
| 3 | Content model defined up front and filled **before** the canvas (§9, §14) | Canvas cards need real titles, visuals and status; designing with fake content produces generic results |
| 4 | Every factual claim must trace to a source (§9, §10) | Turns "never invent metrics" into something checkable |
| 5 | Screen aspect ratio treated as a design constraint of the transition (§3, §7) | A tall portrait screen expanding into a landscape viewport distorts badly; this decides the silhouette |
| 6 | Transition prototyped early, in its own stage (§17) | It is the riskiest and most defining feature; it must be validated before polishing the hardware |
| 7 | Mobile designed from the first build stage, not at the end (§11, §17) | Avoids the "shrunken desktop" result the brief forbids |
| 8 | Real, prerendered URLs per project instead of relying only on hash routing (§14, §16) | Shareable links, refresh-safe on GitHub Pages, and per-project titles/OG metadata for SEO |
| 9 | Conventional HTML content rendered first; the device enhances it (§15) | "Usable without the device" becomes an architectural guarantee, not a hope |
| 10 | Concrete performance budget (§15) | Lighthouse "diagnostics" needs a target to diagnose against |
| 11 | Six phases → nine stages with explicit approval gates (§17) | Smaller, verifiable steps |

---

## ROLE

Act as a world-class creative developer, senior frontend engineer, interaction designer, digital art director, and industrial product designer.

You specialize in creating extraordinary interactive websites that combine refined visual design, functional software, tactile interactions, and memorable digital experiences.

Your task is to build my new personal portfolio from scratch.

This must not be another generic AI-generated developer portfolio. It should feel like an original, carefully art-directed digital product.

**Project concept: POCKET OS × INFINITE CANVAS**

**Creative balance: 80% Pocket OS / 20% Infinite Canvas.**

The Pocket OS is the central object and recognizable visual identity. The Infinite Canvas is an extension of the Pocket OS, primarily used to explore projects. The two experiences must feel like parts of a single, cohesive interface.

---

# 1. PROJECT CONTEXT

My name is Iñigo Díez.

- Existing portfolio (read-only source of content): https://inigo-diez.github.io/
- Existing repository (read-only, **never modified**): https://github.com/inigo-diez/inigo-diez.github.io
- New repository (this project): https://github.com/inigo-diez/portfolio-personal — private during development; I handle all GitHub operations (push, settings, Pages).
- GitHub profile: https://github.com/inigo-diez

When the new site is finished, the old repo will be renamed to `portfolio-v1` and this one to `inigo-diez.github.io`. The build must make that switch a one-line change.

**Site language: Spanish only** (decided 2026-10-19). All copy, UI labels, device OS text and routes are in Spanish (`/proyectos/<slug>`, `/sobre-mi`, `/trayectoria`, `/archivo`, `/contacto`). User-facing text still lives in content files (good practice), but no second language is planned. English copy examples in this brief are placeholders to be written in Spanish.

**Projects (decided in E1):** all 13 projects of the old portfolio appear, in their **4 original groups**, and **all 4 groups are featured**. Canonical list, slugs, verified headline figures and corrections: [audit/project-map.md](audit/project-map.md).

My background includes chemistry, scientific research, quantitative analysis, Data Science, Machine Learning, Artificial Intelligence (Master's in Data Science and AI at Afi Global Education, 2026–2027, in progress), quantitative finance projects, and interdisciplinary technical projects.

However, an essential requirement is that **the visual identity must NOT associate me exclusively with any particular profession, industry, or academic discipline.**

My portfolio should be equally appropriate for opportunities in:

- Data Science and Machine Learning
- Artificial Intelligence
- Analytics and quantitative roles
- Finance and consulting
- Technology and software
- Research and innovation
- Other multidisciplinary technical sectors

These are potential application areas, not categories that must dominate the website.

The central identity should be my name, my work, my approach to solving problems, and my curiosity.

**Do not create a finance-themed, chemistry-themed, laboratory-themed, or AI-themed website.** Use the projects themselves to communicate technical expertise.

---

# 2. CREATIVE VISION

Imagine a fictional piece of premium consumer technology designed sometime between 2003 and 2035.

It combines the physical design language of an early digital music player with the functionality of a pocket computer.

This object is my personal operating system. Visitors discover my work by interacting with it. The device is not a prop. It is the starting point of the entire experience.

The website must create three feelings:

1. Immediate curiosity: "What is this device?"
2. Delightful discovery: "I can actually interact with it."
3. Professional confidence: "The projects behind this interface are serious and technically substantial."

The final result should be visually distinctive without becoming childish, overly experimental, or difficult to navigate.

## Visual references

Study these for their design principles, not for direct imitation. Notes on what to take from each are in [references/MOODBOARD.md](references/MOODBOARD.md).

- **iPodfolio** — functional click-wheel navigation: https://www.framer.com/marketplace/templates/ipodfolio/
- **Infinite Canvas (KEZ Works)** — spatial exploration, unfolding project piles, catalog view: https://www.framer.com/marketplace/templates/infinite-canvas/
- **Infinite Canvas (Richard Segura)** — depth with plain CSS transforms, deterministic placement: https://webflow.com/made-in-webflow/website/inifinite-canvas
- **Neither/Nor** — white space, asymmetric floating composition: https://www.awwwards.com/inspiration/thumbnail-submission-65a4d4c774548514328131
- **Hardware:** iPod classic, Compaq/HP iPAQ, Palm V, Braun T3, Panic Playdate, Teenage Engineering.

Do not copy the layout, branding, artwork, or proprietary components of these projects. Create an original visual and interaction system.

---

# 3. INDUSTRIAL DESIGN OF THE POCKET OS

The Pocket OS device is the most important visual component of the entire website. It must look like a believable, meticulously designed physical object.

## Form factor

Explore a design combining:

- A premium digital MP3 player.
- A vintage PDA.
- A compact futuristic computer.
- A custom experimental electronic device.

The device should be compact, elegant, slightly retro, and unmistakably technological.

Suggested features:

- White or brushed-silver housing.
- Carefully designed rounded rectangular silhouette.
- Premium metallic edge detailing.
- Small but readable display.
- Circular navigation control, tactile directional pad, or hybrid input system.
- Minimal physical buttons.
- Subtle hardware markings.
- Carefully positioned sensors or indicator lights.
- Delicate physical shadows.
- Realistic material separation.
- Restrained surface reflections.

Avoid excessive realism that makes the interface look like a static photograph. It must feel like an interactive product rendered in a browser.

## Originality

Do not make an exact iPod replica. Create an original silhouette, proportions, control layout, and brand identity.

For example, explore a device with:

- A screen larger than a traditional iPod screen.
- A simplified navigation wheel.
- A secondary small control.
- A unique device identifier or engraved logo.
- A coherent custom operating system.

## Screen geometry is a transition constraint

The screen is the element that grows into the Infinite Canvas (§7). Its aspect ratio therefore matters:

- A landscape or near-square screen (≈ 4:3 to 16:10) expands into a desktop viewport naturally.
- A tall portrait screen needs an intermediate reshape step, which is harder to make feel physical.

Evaluate both silhouette concepts against this constraint, not only on looks.

Before implementation, present two device silhouette concepts and recommend one. Prioritize visual harmony and ease of navigation.

---

# 4. VISUAL DESIGN SYSTEM

## Color palette

| Role | Value |
|---|---|
| Primary background | `#F7F7F5` |
| Primary surface | `#FFFFFF` |
| Secondary surface | `#E5E6E8` |
| Metallic detail | `#CFD2D6` |
| Primary text | `#252525` |
| Secondary text | `#777777` |
| Main accent | `#4F75AD` |
| Optional subtle secondary accent | `#A8D5CB` |

White must remain the dominant color. Color should primarily communicate interaction states, hierarchy, and selection. Do not introduce unnecessary gradients or highly saturated decorative elements.

Check contrast: `#777777` on `#F7F7F5` is borderline for small text; use it only at sizes/weights that pass WCAG AA, or darken it slightly.

## Typography

Prefer:

- Geist
- Inter
- A refined modern sans-serif
- A restrained monospace for device labels and technical metadata

The typography should feel precise and editorial. Use generous negative space. Avoid oversized generic SaaS headlines. Self-host fonts (no render-blocking third-party font requests).

## Art direction

Combine:

- Early 2000s consumer electronics.
- Modern minimalist web interfaces.
- Swiss editorial design.
- Premium industrial design.
- Contemporary interaction design.

The result should feel like a carefully designed product rather than a fashionable website template.

## Texture

Allowed:

- Extremely subtle paper-like background.
- Soft metallic surfaces.
- Fine separators.
- Delicate geometric patterns.
- Very subtle dot grids within the canvas.

Avoid:

- Cyberpunk neon.
- Purple AI gradients.
- Excessive glassmorphism.
- Generic abstract blobs.
- Floating particles.
- Overdecorated dashboards.
- Heavy background videos.

---

# 5. HOMEPAGE

The homepage must be immediately memorable.

## Initial composition

Use a nearly white full-screen background. Place the Pocket OS near the center. Give the device enough visual prominence to become the focal point. Around it, use restrained editorial typography.

Suggested content (starting points, not final copy):

**Iñigo Díez**

**Technology · Data · Problem Solving**

**A different way to explore my work.**

The hero should be minimal but not visually empty. Use careful alignment, negative space, and scale.

## Initial interaction

When the website loads:

1. The device becomes visible.
2. Its display subtly activates.
3. A small visual cue indicates that it is interactive.
4. Users can immediately navigate.

Do not create a mandatory loading animation, boot sequence, or introductory cinematic. The user should be able to access content without waiting.

## Navigation shortcuts

Even with the Pocket OS as the central interface, provide clear external navigation shortcuts for:

- Projects
- About
- GitHub
- Contact
- CV

These can appear as subtle textual controls around the composition. The user must not be forced to understand the device before reaching the important content.

---

# 6. CUSTOM OPERATING SYSTEM

Create a functional miniature operating system inside the device.

Working name: **Pocket OS**. The interface should have its own visual identity.

## Main sections

Home · Projects · About · Experience · Skills · Archive · Contact · CV

## Interaction behavior

The device must support:

- Mouse input.
- Keyboard input.
- Touch interaction.
- Directional navigation.
- Menu selection.
- Back navigation.
- Clear active states.

If using a circular control, implement real circular gesture handling (angle tracking with detents), not click zones on a decorative ring.

Create one input model: every physical input (wheel rotation, button press, key, swipe) is translated into the same small set of abstract commands (`next`, `prev`, `select`, `back`, `home`) consumed by one navigation state machine.

## Operating system interface

The screen should contain:

- Small navigation headers.
- Compact typography.
- Minimal interface icons.
- Clear active-item selection.
- Restrained status indicators.
- Smooth internal transitions.

Optional details:

- Device serial number.
- Custom OS version.
- Small battery-style indicator.
- Context-sensitive button labels.

Do not let decorative interface elements obscure the actual controls.

## Interaction feedback

Use subtle:

- Press depth.
- Material highlights.
- Selection animations.
- Button movement.
- Haptic-inspired visual feedback.

Optional sounds may exist but must be off by default.

---

# 7. THE SIGNATURE TRANSFORMATION

This transition is the main creative feature of the portfolio. It must be implemented exceptionally well.

## Trigger

The user navigates to Projects inside the Pocket OS and selects it.

## Animation sequence

1. The selected menu item responds.
2. The display becomes the visual focus.
3. The device subtly shifts or scales.
4. The screen expands into a much larger interface.
5. The new interface grows into a spatial project environment.
6. Project cards become visible.
7. The user gains control of the Infinite Canvas.

The visual connection between the screen and the canvas must be obvious. Use a shared-element transition, FLIP-style animation, or another suitable technique. Do not fake the transition with an unrelated page reload or an abrupt replacement.

## Returning

The experience must be reversible. When the user chooses Home or Back:

1. The canvas returns to its initial visual state.
2. The expanded space contracts.
3. The screen becomes part of the device again.
4. The Pocket OS returns to its original position.

Avoid awkward jumps or resetting the entire page unexpectedly. Browser back/forward must trigger the same transitions as the device controls.

## Interaction timing

Transitions should feel polished, not slow. Main transformation ≈ 500–800 ms; microinteractions ≤ 200 ms. Interruptible: input during the transition must not break state.

With `prefers-reduced-motion`, replace the expansion with a short crossfade.

## Validation

The transition is prototyped in its own stage (see §17, stage E3) with placeholder cards, in the real stack, before the device and canvas are polished.

---

# 8. INFINITE CANVAS

The Infinite Canvas is the secondary experience. It should be impressive but restrained. Its purpose is to create a memorable and flexible way to browse projects.

## Overall appearance

Use a large, clean white space. Include a very subtle grid or coordinate system if appropriate. Distribute project cards across a carefully planned spatial composition.

Use variation in:

- Position.
- Scale.
- Orientation, very sparingly.
- Card size.
- Visual hierarchy.

The canvas should feel spacious and curated. It should not resemble an uncontrolled brainstorming whiteboard.

## Interaction

Implement:

- Click-and-drag panning.
- Smooth trackpad interaction.
- Controlled zooming, anchored at the cursor / pinch midpoint.
- Touch dragging.
- Pinch zoom on supported devices.
- Reset-view control.
- Return-to-device control.
- A conventional project-list alternative.
- Keyboard: arrow keys pan, +/− zoom, Tab moves through cards in a logical order.

The user should never become lost inside the canvas.

Include subtle controls such as: Projects / Explore · Zoom + / − · Reset · List View · Home

## Layout strategy

Use a defined starting composition. When entering the canvas, the user must immediately see several real projects. Do not place all content outside the initial viewport.

Project positions are deterministic and stored in data (not random at runtime). Clamp panning and zoom to the content bounds plus a margin. A spatial illusion is more important than mathematically infinite dimensions.

## Project cards

Cards should feel like premium editorial objects. Use real previews, graphics, screenshots, or meaningful project visuals.

Each card should show:

- Project title.
- Short description.
- Relevant technologies.
- A visual preview.
- Status (completed / ongoing).
- A clear action to open the project.

Cards can expand, unfold, or move forward when selected. Avoid generic gradient backgrounds or meaningless stock imagery.

---

# 9. PROJECT CASE STUDIES

Professional project presentation is a top priority. The Infinite Canvas is the discovery interface; the case-study page is the professional explanation.

When a project is opened, transition to a clean, readable, full-width editorial layout.

## Case-study structure

Each project should support:

1. Title and concise summary.
2. The problem or research question.
3. Context and motivation.
4. Approach and methodology.
5. Technical implementation.
6. Tools and technologies.
7. Results and evidence.
8. Limitations and lessons learned.
9. Screenshots or data visualizations.
10. Repository and demo links.

Sections without real content are omitted, not filled with filler.

## Truthfulness

- Never invent metrics. Never exaggerate the performance of a model.
- Every number and factual claim records its source (repo README, notebook, old portfolio, CV, or my confirmation) in the content file.
- Distinguish clearly between completed projects and ongoing work.
- Missing information becomes an explicit `TODO(content)` and is listed in PLAN.md, never silently invented.

## Existing project sources

Inspect my existing GitHub repositories and current portfolio. Relevant repositories may include:

- Figuris.
- Mental Health Biomarkers Database.
- Statistical analysis of GC-MS metabolomics.
- Experimental optimization and response surface methodology.
- Oil market stress prediction using GDELT.
- LLM-based electrolyzer sensor analysis.
- Credit risk prediction.
- Other verified projects.

Do not simply copy every repository into the homepage. Select the strongest projects based on completeness, technical substance, and breadth. Use a balanced selection across different problem types. Do not classify the entire website around one employment sector.

## Featured projects

A curated selection of approximately 4–6 featured projects, depending on verified content quality, chosen by me from a proposal. Other work remains accessible in the Archive or project index.

Each featured project should communicate what I actually built and why it matters.

---

# 10. ABOUT, EXPERIENCE AND SKILLS

## About

Present an intelligent, concise introduction.

Avoid phrases like: "Passionate about technology." "Always eager to learn." "Driven by innovation."

Instead, emphasize verifiable experience, curiosity, analytical thinking, and practical problem-solving. Explain my professional evolution without making chemistry the dominant identity.

## Experience

Use a refined chronological view. Include verified education, research, and professional experience. Do not invent company roles or professional achievements.

## Skills

Organize skills around capabilities rather than decorative proficiency bars.

Potential categories:

- Programming and data processing.
- Statistics and quantitative methods.
- Machine Learning.
- AI systems and tools.
- Data visualization.
- Software and analytical workflows.

Only include skills supported by the existing content, and link each skill to at least one project where it was used when possible. Keep the presentation flexible enough to accommodate future growth.

## Archive

A secondary archive for:

- Smaller projects.
- Technical experiments.
- Selected notes.
- Interesting explorations.
- Personal or creative work.

Keep the archive separate from the main selection of professional projects.

---

# 11. MOBILE EXPERIENCE

Desktop is the primary showcase. Mobile must still be excellent, and it is designed and tested from the first build stage onward, not retrofitted.

Do not shrink the entire desktop device and infinite canvas into a small screen.

## Mobile Pocket OS

Adapt the device to available screen width. Ensure the controls remain comfortable for touch input (targets ≥ 44 × 44 px). Keep the main navigation usable without hovering.

## Mobile projects

Use a simplified browsing interface. A curated project list or swipeable gallery is preferable to a difficult-to-control miniature Infinite Canvas. The screen-expansion transition can still lead into it.

Retain the identity of Pocket OS without forcing identical interactions across all devices. Maintain direct access to projects, CV and contact details.

---

# 12. MOTION AND MICROINTERACTIONS

Motion should communicate a physical or spatial relationship.

Use:

- Spring-inspired controls.
- Controlled device movement.
- Shared-element transitions.
- Refined card unfolding.
- Subtle scale changes.
- Delicate shadow changes.
- Precise navigation feedback.

Avoid:

- Long forced sequences.
- Excessive parallax.
- Constant floating animations.
- Animations on every scroll event.
- Gratuitous cursor effects.

Motion must be responsive and meaningful. Implement reduced-motion fallbacks. No important information should require watching an animation.

---

# 13. SIGNATURE DETAILS

Create two or three distinctive design details that make the portfolio memorable.

Potential ideas:

- **Device identity** — A custom symbol or small logo engraved into the hardware.
- **System details** — Unique file labels, device metadata, and subtle interface terminology.
- **Spatial transition** — The Pocket OS display becoming the Infinite Canvas.
- **Personal archive** — A small, carefully designed library of technical experiments or ideas.
- **Easter egg** — One unobtrusive interaction discovered through exploration.

Avoid fake system errors, intrusive mini-games, distracting music players, or gimmicks unrelated to the overall experience.

---

# 14. TECHNICAL ARCHITECTURE

Build from scratch in the new repository. The old site is only a content source.

Preferred technologies:

- React.
- TypeScript.
- Vite.
- Tailwind CSS or a similarly maintainable styling system.
- Motion for interactive transitions.
- SVG and CSS for the device.
- Lightweight project-data management (typed content files in the repo, no CMS).

Avoid unnecessary dependencies. Do not use Three.js unless a specific visual requirement genuinely cannot be achieved using CSS, SVG, and lightweight transforms.

## Repository layout

The planned layout is documented in `CLAUDE.md`. Content is separate from presentation; there is no monolithic application component.

Components cover: app shell, design tokens, Pocket device, device controls, OS UI, navigation state, transition system, project canvas, project card, case study, conventional navigation, About/Experience/Skills, Contact.

## Content model

Each project is one content entry with at least:

`slug`, `title`, `summary`, `status` (completed / ongoing), `year`, `featured` (bool), `tags` (capabilities, not sectors), `stack`, `cover` (image + alt), `canvas` (x, y, size), `links` (repo, demo, paper), `sections` (the case-study blocks of §9), `sources` (where each claim comes from).

All user-facing strings live in content files, so a second language can be added later.

## State model

Explicit navigation states such as:

- home
- device-menu
- device-section
- canvas-transition
- canvas
- project-detail

Make transitions predictable. Keyboard, pointer, touch and browser history all feed the same state machine.

## Canvas architecture

A lightweight coordinate-space implementation with CSS transforms on one layer (`translate` + `scale`), updated outside React's render cycle during pointer movement. Controlled pan and zoom. Cards keep readable size and clickable targets.

## Routes and hosting

- Real paths: `/`, `/projects`, `/projects/<slug>`, `/about`, `/experience`, `/archive`, `/contact`.
- At build time, emit a prerendered `index.html` per route with its own `<title>`, description and Open Graph tags, so direct links and refresh work on GitHub Pages and links preview correctly when shared.
- Add a `404.html` fallback.
- The Vite `base` is `/portfolio-personal/` during development hosting and `/` after the switch; it is defined in one place.
- Deployment via a GitHub Actions workflow to GitHub Pages (I trigger and manage it).

---

# 15. ACCESSIBILITY AND PERFORMANCE

Treat usability as an essential part of the design.

Requirements:

- Semantic HTML.
- Full keyboard navigation.
- Visible focus states.
- Appropriate accessible names.
- Screen-reader-compatible project navigation.
- Sufficient text contrast.
- Responsive touch targets.
- No mandatory gestures for accessing content.
- Alternative conventional navigation.
- Support for prefers-reduced-motion.
- No forced sound.
- No unnecessary animation during scrolling.

**Progressive enhancement:** the prerendered HTML contains the real content and conventional navigation. The device and canvas enhance it. If JavaScript fails or the device is unavailable, the portfolio is still complete and navigable.

Target WCAG 2.2 AA conformance where applicable.

## Performance budget

- Initial JS ≤ ~150 KB gzipped on the home route; canvas and case-study code loaded on demand.
- LCP < 2.5 s and CLS < 0.1 on a mid-range phone.
- Images in modern formats (AVIF/WebP) with explicit dimensions; lazy-load below the fold and off-screen canvas cards.
- 60 fps during pan/zoom and the main transition on a typical laptop.

Treat Lighthouse results as diagnostics and validate real interaction behavior, not only numerical scores.

---

# 16. SEO AND PROFESSIONAL PRESENTATION

The portfolio must be discoverable and shareable.

Include:

- Appropriate metadata.
- A meaningful page title.
- Open Graph information, including a designed OG image (the device).
- Project-specific titles and descriptions (from the prerendered routes).
- Accessible headings.
- Sitemap.
- Appropriate robots configuration (`noindex` while hosted at the development path).
- A professional favicon derived from the device identity.
- Clearly visible GitHub and LinkedIn links.
- A functioning CV download or view link.

The homepage should communicate my name and general professional direction without tying the visual branding to a specific sector.

---

# 17. IMPLEMENTATION PLAN — NINE STAGES

Do not attempt to implement everything in one uncontrolled coding pass. Each stage has its own file in [stages/](stages/) with tasks, deliverables and an approval gate. **Stop at every gate and wait for my approval.**

| Stage | Name | Gate |
|---|---|---|
| E0 | Setup | — |
| E1 | Content audit | Featured projects chosen |
| E2 | Art direction | Device silhouette + home composition approved |
| E3 | Scaffold + transition prototype | Transition technique validated in the real stack |
| E4 | Pocket OS | Device works with mouse, keyboard, touch; mobile version |
| E5 | Infinite Canvas | Enter, explore, open, return without getting lost |
| E6 | Real content | Complete professional portfolio, no unlisted placeholders |
| E7 | Refinement | Cohesive, distinctive, finished |
| E8 | Validation + launch | Tested, deployed, switched to root |

Do not overwrite production without a suitable backup or version-control checkpoint.

---

# 18. IMPORTANT ANTI-GENERIC DESIGN RULES

- Do not use a standard hero-section-plus-cards template.
- Do not replace the device with a decorative illustration beside a heading.
- Do not make the Infinite Canvas the default homepage.
- Do not produce a generic desktop OS clone.
- Do not create fake terminal windows just to communicate technical expertise.
- Do not introduce irrelevant visualizations, random 3D objects, fake achievements, or meaningless dashboard metrics.
- Do not use placeholder text in the final completed portfolio unless a required real detail remains unavailable; identify any such placeholder explicitly.
- Do not claim that unfinished demonstrations are functional.
- Do not accept a first device that is "a white rectangle with a screen and four buttons": it needs proportions, convincing surfaces, functional controls and design details.
- Avoid overengineering. Make every interaction serve a purpose.

The strongest result is not the one with the most animations or features. It is the one with the most coherent design.

---

# 19. ACCEPTANCE CRITERIA

The project is successful only if:

1. The homepage immediately feels visually distinctive.
2. The Pocket OS looks like an original and carefully designed piece of technology.
3. Its controls genuinely function.
4. The interface is visually coherent.
5. Entering Projects produces a convincing transformation into the Infinite Canvas, and back.
6. The canvas is enjoyable and easy to navigate.
7. Project case studies are professional, substantial, and every claim is traceable.
8. The site does not visually pigeonhole me into one career sector.
9. The mobile experience remains practical.
10. Accessibility and performance meet the targets in §15.
11. The existing portfolio content is preserved or improved.
12. The resulting system can be maintained and expanded (adding a project = adding one content file + images).
13. Every project URL works when opened directly or refreshed, and previews correctly when shared.

---

# 20. HOW TO BEGIN

Start with stage E1. Read [PLAN.md](PLAN.md) and the stage file before starting any stage, and update PLAN.md at the end.

The result should not feel like a website decorated with a gadget.

**The device should feel like the website, and the website should feel like an extension of the device.**

Build a coherent, memorable digital identity — not another portfolio template.
