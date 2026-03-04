---
phase: 01-foundation
plan: 02
name: Extract JavaScript into Modular Files
subsystem: JavaScript Architecture
tags: [javascript, modules, data-driven, es6, architecture]
requires: []
provides: [TECH-01, TECH-02, TECH-03]
affects: [js/utils.js, js/data.js, js/app.js, js/animations.js, index.html]
tech-stack:
  added: []
  patterns: [ES6 modules, data-driven architecture, separation of concerns]
key-files:
  created:
    - js/utils.js (83 lines)
    - js/data.js (307 lines)
    - js/animations.js (86 lines)
    - js/app.js (341 lines)
  modified:
    - index.html (removed 567 lines of inline JS)
decisions:
  - Convert action functions to action strings for data-driven architecture
  - Use ES6 modules with import/export for clean dependency management
  - Separate concerns: data, utilities, UI logic, animations
  - Each module has single responsibility
---

# Phase 01 Plan 02: Extract JavaScript into Modular Files

## One-Liner
Extracted all inline JavaScript from index.html into four organized ES6 modules (utils.js, data.js, app.js, animations.js) implementing data-driven architecture with clean separation of concerns.

## What Was Built

### JavaScript Module Architecture

**js/utils.js** — Pure utility functions
- `fuzzy(str, pattern)` — Fuzzy search algorithm with scoring
- `highlight(text, indices)` — Highlight matched characters in search results
- `esc(s)` — HTML escape to prevent XSS
- `debounce(fn, delay)` — Debounce utility for performance
- `throttle(fn, limit)` — Throttle utility for scroll events

**js/data.js** — Data-driven architecture core
- Complete `DATA` array with 37 items across 9 categories
- Action strings instead of function references:
  - `"theme:toggle"` for theme toggle
  - `"vim:toggle"` for VIM mode
  - `"nav:#section"` for navigation
  - `"open:url"` for external links
- `resolveAction(item, context)` — Parse action strings to executable functions

**js/animations.js** — Animation module
- `initCursorGlow()` — Mouse-following cursor effect
- `initTypewriter()` — Hero section command cycling animation
- `initRevealAnimations()` — IntersectionObserver-based scroll reveals
- `initAnimations()` — Main entry point for all animations

**js/app.js** — Main application logic
- Imports: data.js, utils.js, animations.js
- Navigation: `navTo(id)` for smooth scrolling
- Palette: open, close, render, search with fuzzy matching
- VIM mode: j/k/G/gg navigation, / for palette
- Theme: toggle function (persistence in Plan 01-03)
- Event listeners: keyboard shortcuts, click handlers

### Architecture Achievements

**TECH-01: Separated JS Files** ✅
- No inline JavaScript in index.html
- 4 organized modules in js/ directory
- Clean dependency tree with ES6 imports

**TECH-02: Data-Driven Architecture** ✅
- DATA array externalized to data.js
- Content separated from presentation logic
- Action strings allow data to be JSON-serializable
- Easy to add/modify palette items without touching logic

**TECH-03: Modern JS Patterns** ✅
- ES6 modules with import/export
- Clear initialization pattern (DOMContentLoaded)
- JSDoc comments for all functions
- Pure functions where possible

## Deviations from Plan

### Auto-fixed Issues

**[Rule 1 - Bug] Fixed duplicate exports in app.js**
- **Found during:** Task 5 verification
- **Issue:** Functions exported both at definition and at end of file caused "Duplicate export" SyntaxError
- **Fix:** Removed redundant export statement at end of app.js (functions already exported at definitions)
- **Files modified:** js/app.js
- **Commit:** d3fa8b4

## Verification Results

| Test | Status |
|------|--------|
| All 4 JS files exist in js/ | ✅ |
| index.html loads js/app.js as ES module | ✅ |
| No console errors on load | ✅ |
| "Portfolio app initialized" message appears | ✅ |
| Command palette opens (Ctrl+Shift+P) | ✅ |
| Fuzzy search works | ✅ |
| Highlighting in search results | ✅ |
| Typewriter animation running | ✅ |
| All 37 data items render | ✅ |

## Commits

```
d3fa8b4 fix(01-foundation-02): remove duplicate exports in app.js
55b2231 feat(01-foundation-02): update index.html to load JS modules
b389cbc feat(01-foundation-02): create app.js with main application logic
c38d72d feat(01-foundation-02): create animations.js with animation logic
7a0e7ba feat(01-foundation-02): create data.js with DATA array
d834982 feat(01-foundation-02): create utils.js with pure utility functions
```

## Self-Check: PASSED

- [x] js/utils.js exists (83 lines, 5 exported functions)
- [x] js/data.js exists (307 lines, 37 data items, resolveAction)
- [x] js/animations.js exists (86 lines, 4 exported functions)
- [x] js/app.js exists (341 lines, imports from all modules)
- [x] index.html loads js/app.js as module (1 script tag, type="module")
- [x] All commits exist in git history
- [x] No inline JavaScript remaining
- [x] Page loads without console errors
- [x] All functionality verified working

## Metrics

- **Duration:** ~10 minutes
- **Tasks Completed:** 5/5
- **Files Created:** 4
- **Lines Added:** 817 (across 4 JS files)
- **Lines Removed:** 567 (from index.html)
- **Net Change:** +250 lines (better organization)
- **Bugs Fixed:** 1 (duplicate exports)
