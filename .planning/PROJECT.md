# Frontend Developer Portfolio

## What This Is

A modernized developer portfolio with a terminal/CLI aesthetic and integrated blog. The portfolio showcases creative development work with a focus on AI enthusiasm and technical craftsmanship. Features a responsive design, dark/light themes, keyboard-navigable command palette, and a simple blog for sharing thoughts and project updates.

## Core Value

Convey that you're a creative developer who loves technology and is excited about AI.

## Requirements

### Validated

- ✓ **FOUND-01**: CSS organized into modular files (base, layout, components)
- ✓ **FOUND-02**: JavaScript extracted into ES6 modules
- ✓ **FOUND-03**: Theme system with dark/light toggle and persistence
- ✓ **FOUND-04**: WCAG 2.1 AA accessibility (keyboard nav, ARIA labels, focus management)
- ✓ **FOUND-05**: Responsive design (mobile, tablet, desktop breakpoints)

### Active

- [ ] **BLOG-01**: Blog index page listing all posts with titles, dates, and excerpts
- [ ] **BLOG-02**: Individual blog post pages (3 posts to start)
- [ ] **BLOG-03**: Blog matches portfolio design system (CSS, fonts, terminal aesthetic)
- [ ] **BLOG-04**: Blog accessible from main navigation and command palette
- [ ] **BLOG-05**: Blog posts use semantic HTML and maintain accessibility standards
- [ ] **BLOG-06**: Blog is responsive across all device sizes

### Out of Scope

- **RSS feed** — Can be added later if there's demand
- **Comments system** — Keep it simple, no backend complexity
- **Search within blog** — Command palette covers site-wide search
- **Tag/category filtering** — List view sufficient for 3-5 posts
- **Markdown processing** — HTML files adequate for current scope

## Context

**Current state:** Portfolio has modular CSS/JS, theme system, accessibility baseline, and responsive design. Blog will extend this foundation with new pages following established patterns.

**Brand positioning:** Creative developer, technology enthusiast, AI-focused. Blog content will reflect ongoing learning and project work.

**Audience:** Hiring managers evaluating portfolio; fellow developers reading technical content.

## Constraints

- **Architecture**: Keep implementation simple (vanilla HTML/CSS/JS, no heavy frameworks)
- **Design consistency**: Blog must match existing portfolio aesthetic
- **No backend**: Static files only, no server-side processing
- **GitHub Pages compatible**: Must deploy to existing hosting

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Separate CSS/JS from HTML | Better maintainability while keeping implementation simple | ✓ Complete — modular file structure established |
| Keep no-framework approach | Fast, simple, deployable anywhere | ✓ Complete — vanilla JS/CSS working well |
| Modern & polished aesthetic | Appeal to hiring managers while reflecting personality | ✓ Complete — terminal aesthetic implemented |
| Blog as separate HTML files | Simple, no build step needed, matches existing architecture | — Pending |
| Blog design matches portfolio | Consistent brand experience | — Pending |

## Current Milestone: v1.1 Blog Addition

**Goal:** Add a simple blog with 3 posts, integrated into portfolio navigation

**Target features:**
- Blog index page (`blog/index.html`) listing all posts
- 3 individual blog post pages (`blog/post-*.html`)
- Navigation link in header + command palette integration
- Consistent design with portfolio theme
- Responsive layout following existing patterns

---
*Last updated: 2026-03-04 after milestone v1.1 start*
