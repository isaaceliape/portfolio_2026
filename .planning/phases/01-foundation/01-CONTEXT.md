# Phase 01: Foundation & Code Organization - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Convert single-file HTML portfolio into organized codebase with separated CSS and JavaScript files. Establish responsive foundation (desktop-first), implement theme system with system preference default, and meet full WCAG 2.1 AA accessibility baseline. This phase sets the structure that all subsequent phases build on.

</domain>

<decisions>
## Implementation Decisions

### File Organization Strategy
- **Multiple files (modular approach)** — Not single monolithic files
- **CSS files:** base.css, layout.css, components.css (minimal naming, not overly granular)
- **JS files:** app.js, utils.js, animations.js, theme.js
- **Folder structure:** Nested directories — css/, js/ folders in project root

### Theme System Behavior
- **Toggle location:** Navigation header (top-right corner)
- **Default theme:** System preference (follows OS dark/light mode setting)
- **Toggle style:** Icon only (sun/moon icons), no text label
- **Transition:** Smooth animation when switching themes (200-300ms color transitions)

### Responsive Approach
- **Design approach:** Desktop-first (existing portfolio is desktop-optimized)
- **Breakpoints:** Standard (640px tablet, 1024px desktop)
- **Testing method:** Browser DevTools (Chrome device emulator) — quick and standard
- **Minimum screen:** 375px (iPhone standard)

### Accessibility Scope
- **Compliance level:** Full WCAG 2.1 AA (not just basics)
- **Motion preferences:** Yes — support prefers-reduced-motion to disable/reduce animations
- **Focus indicators:** Styled to match design (not browser default)
- **ARIA:** Add ARIA labels/roles to essential interactive elements (nav, buttons, forms)

### Claude's Discretion
- Exact CSS organization details within the chosen file structure
- Specific animation timing for theme transitions
- Exact ARIA implementation patterns
- Specific breakpoint implementation details

</decisions>

<specifics>
## Specific Ideas

- Current portfolio has inline CSS and JavaScript that need extraction
- Preserve existing visual appearance during reorganization
- Theme system should feel modern and intentional
- Mobile experience must work well on 375px minimum width

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-03*
