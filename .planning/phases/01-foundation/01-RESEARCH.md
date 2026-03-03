# Phase 01: Foundation & Code Organization - Research

**Researched:** 2026-03-03
**Domain:** Vanilla HTML/CSS/JS Portfolio Foundation
**Confidence:** HIGH

## Summary

This phase involves converting a single-file HTML portfolio (currently 1709 lines with inline CSS and JavaScript) into a well-organized, modular codebase. The current implementation already demonstrates solid fundamentals: CSS custom properties for theming, `prefers-color-scheme` media queries, semantic HTML, and basic accessibility. The research focuses on extraction patterns, theme persistence, responsive design architecture, and WCAG 2.1 AA compliance.

**Primary recommendation:** Extract CSS into base/layout/components files, JS into feature modules, add localStorage theme persistence with system preference fallback, and implement comprehensive accessibility including `prefers-reduced-motion` support.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **File Organization Strategy:** Multiple files (modular approach) — Not single monolithic files
  - CSS files: `base.css`, `layout.css`, `components.css` (minimal naming, not overly granular)
  - JS files: `app.js`, `utils.js`, `animations.js`, `theme.js`
  - Folder structure: Nested directories — `css/`, `js/` folders in project root

- **Theme System Behavior:**
  - Toggle location: Navigation header (top-right corner)
  - Default theme: System preference (follows OS dark/light mode setting)
  - Toggle style: Icon only (sun/moon icons), no text label
  - Transition: Smooth animation when switching themes (200-300ms color transitions)

- **Responsive Approach:**
  - Design approach: Desktop-first (existing portfolio is desktop-optimized)
  - Breakpoints: Standard (640px tablet, 1024px desktop)
  - Testing method: Browser DevTools (Chrome device emulator)
  - Minimum screen: 375px (iPhone standard)

- **Accessibility Scope:**
  - Compliance level: Full WCAG 2.1 AA (not just basics)
  - Motion preferences: Yes — support prefers-reduced-motion to disable/reduce animations
  - Focus indicators: Styled to match design (not browser default)
  - ARIA: Add ARIA labels/roles to essential interactive elements (nav, buttons, forms)

### Claude's Discretion
- Exact CSS organization details within the chosen file structure
- Specific animation timing for theme transitions
- Exact ARIA implementation patterns
- Specific breakpoint implementation details

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

## Standard Stack

### Core (No External Dependencies - Per Requirements)
| Technology | Purpose | Notes |
|------------|---------|-------|
| Vanilla HTML5 | Structure | Semantic elements, proper document structure |
| Vanilla CSS3 | Styling | Custom properties, Grid, Flexbox, media queries |
| Vanilla ES6+ | Interactivity | Modules, async/await, IntersectionObserver |
| localStorage | Theme persistence | Simple key-value storage, ~5MB limit |
| matchMedia API | Theme detection | `prefers-color-scheme`, `prefers-reduced-motion` |

### Supporting Patterns
| Pattern | Purpose | When to Use |
|---------|---------|-------------|
| CSS Custom Properties | Theming | All color values, spacing, transitions |
| CSS `color-mix()` | Transparent overlays | Already used in existing code |
| IntersectionObserver | Scroll animations | `.reveal` class animations |
| Event Delegation | Performance | Palette item interactions |

---

## Architecture Patterns

### Recommended File Organization

```
portfolio_2026/
├── index.html
├── css/
│   ├── base.css          # Reset, variables, typography, utilities
│   ├── layout.css        # Grid, flex, containers, responsive breakpoints
│   └── components.css    # Cards, buttons, terminal, palette, nav
├── js/
│   ├── app.js            # Main entry point, initialization
│   ├── theme.js          # Theme toggle, localStorage, system preference
│   ├── animations.js     # Reveal, typewriter, cursor glow, reduced-motion
│   └── utils.js          # DOM helpers, debounce, throttle, fuzzy search
└── planning/
    └── phases/
```

### CSS Architecture Strategy

**base.css** (~200-250 lines from current)
- CSS reset (`* { box-sizing: border-box; margin: 0; padding: 0; }`)
- All CSS custom properties (dark theme as default)
- `prefers-color-scheme: light` media query
- `[data-theme]` attribute selectors for manual override
- Base typography (font-family, font-size, line-height)
- Smooth scroll behavior
- Scanline overlay effect
- Cursor glow base styles

**layout.css** (~150-200 lines)
- Container patterns (`section`, `.wrapper`)
- Navigation layout (fixed positioning, flexbox)
- Grid layouts (`.projects-grid`)
- Responsive breakpoints:
  - Desktop default (no query)
  - Tablet: `@media (max-width: 1024px)`
  - Mobile: `@media (max-width: 640px)`
  - Small mobile: `@media (max-width: 375px)`
- Footer layout

**components.css** (~300-400 lines)
- Terminal window (`.term`, `.term-bar`, `.term-body`)
- Project cards (`.proj`, hover states)
- Command palette (modal, input, results)
- Buttons (`.cli-btn`)
- Contact rows
- Vim indicator
- Animations keyframes (fadeUp, slideDown, blink, palIn)

### JavaScript Module Strategy

**theme.js**
```javascript
// Theme management module
const ThemeManager = {
  STORAGE_KEY: 'portfolio-theme',
  
  init() {
    this.applyTheme(this.getStoredOrSystemTheme());
    this.setupToggle();
    this.setupSystemListener();
  },
  
  getStoredOrSystemTheme() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  },
  
  applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    this.updateToggleIcon(theme);
  },
  
  toggle() {
    const current = document.documentElement.dataset.theme || this.getStoredOrSystemTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
    localStorage.setItem(this.STORAGE_KEY, next);
  },
  
  setupSystemListener() {
    window.matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set preference
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.applyTheme(e.matches ? 'light' : 'dark');
        }
      });
  }
};
```

**animations.js**
```javascript
// Animation module with reduced-motion support
const AnimationController = {
  reducedMotion: false,
  
  init() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.setupRevealAnimations();
    this.setupTypewriter();
    if (!this.reducedMotion) {
      this.setupCursorGlow();
    }
  },
  
  setupRevealAnimations() {
    if (this.reducedMotion) {
      // Show all immediately without animation
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
};
```

### Desktop-First Responsive Pattern

```css
/* Desktop (default) - 1025px and above */
section {
  padding: 6rem 2rem;
  max-width: 860px;
}

.projects-grid {
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Tablet - 640px to 1024px */
@media (max-width: 1024px) {
  section {
    padding: 5rem 1.5rem;
  }
}

/* Mobile - 639px and below */
@media (max-width: 640px) {
  section {
    padding: 4rem 1rem;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .ascii {
    display: none;
  }
  
  .nav-links {
    gap: 1rem;
  }
}

/* Small mobile - 375px (minimum supported) */
@media (max-width: 375px) {
  nav {
    padding: 0.7rem 0.75rem;
  }
  
  .nav-links a {
    font-size: 0.7rem;
  }
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme state management | Custom state object | `data-theme` attribute + localStorage | Simple, CSS-selectable, persists across sessions |
| System theme detection | Poll with setInterval | `matchMedia()` API | Native, performant, event-driven |
| Smooth scroll polyfill | Custom scroll animation | `scroll-behavior: smooth` + `scrollIntoView()` | Native browser support since 2020 |
| Reduced motion detection | User preference cookies | `prefers-reduced-motion` media query | Respects OS-level accessibility settings |
| Element visibility detection | Scroll event listeners | `IntersectionObserver` | Performant, no scroll jank |
| Fuzzy search algorithm | Complex regex | Simple character-matching loop | Already implemented in current code, works well |
| DOM element creation | Template strings + innerHTML | `document.createElement` for dynamic, template literals for static | Security (XSS prevention), clarity |

---

## Common Pitfalls

### Pitfall 1: FOUC (Flash of Unstyled Content) on Theme Load
**What goes wrong:** Page briefly shows wrong theme before JavaScript applies stored preference.
**Why it happens:** Script loads and executes after initial paint.
**How to avoid:** 
- Add inline script in `<head>` that runs immediately (before CSS)
- Or use `color-scheme` meta tag as hint: `<meta name="color-scheme" content="dark light">`
- Apply theme class server-side if possible

### Pitfall 2: Theme Toggle Icon Flash
**What goes wrong:** Wrong icon shown briefly before JavaScript updates it.
**Why it happens:** Initial HTML has placeholder icon.
**How to avoid:** Use CSS to show/hide icons based on `data-theme` attribute, no JS needed for initial state.

```css
.theme-icon-sun { display: none; }
.theme-icon-moon { display: block; }

[data-theme="light"] .theme-icon-sun { display: block; }
[data-theme="light"] .theme-icon-moon { display: none; }
```

### Pitfall 3: localStorage Throws in Private Mode (Safari)
**What goes wrong:** Safari private mode throws `QuotaExceededError` on localStorage.setItem().
**Why it happens:** Storage APIs disabled/limited in private browsing.
**How to avoid:** Wrap localStorage calls in try-catch; gracefully degrade to session-only theme.

### Pitfall 4: prefers-reduced-motion Not Respected
**What goes wrong:** Animations play even when user has motion sensitivity.
**Why it happens:** Developer forgets to check media query.
**How to avoid:** Always check `matchMedia('(prefers-reduced-motion: reduce)')` before starting animations; provide instant alternatives.

### Pitfall 5: Missing Focus Indicators (WCAG 2.4.7)
**What goes wrong:** Custom CSS removes outline but doesn't provide alternative.
**Why it happens:** `outline: none` applied globally without replacement.
**How to avoid:** 
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### Pitfall 6: Insufficient Color Contrast
**What goes wrong:** Text doesn't meet 4.5:1 contrast ratio (AA) or 3:1 for large text.
**Why it happens:** Using muted colors that look good but fail accessibility.
**How to avoid:** Test all color combinations with contrast checker; current portfolio uses `--text: #c8c8c8` on `--bg: #0c0c0c` which passes.

---

## Code Examples

### Theme System with Persistence

```javascript
// js/theme.js
(function() {
  const STORAGE_KEY = 'portfolio-theme';
  
  function getTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
    } catch (e) {
      // Safari private mode fallback
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // Ignore storage errors
    }
  }
  
  // Apply immediately to prevent FOUC
  setTheme(getTheme());
  
  // Export for module usage
  window.ThemeManager = { getTheme, setTheme, toggle: () => setTheme(getTheme() === 'dark' ? 'light' : 'dark') };
})();
```

### prefers-reduced-motion Integration

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .reveal {
    opacity: 1;
    transform: none;
  }
  
  #cursor-glow {
    display: none;
  }
}
```

### Semantic HTML with ARIA

```html
<!-- Before -->
<nav>
  <span class="nav-logo">...</span>
  <div class="nav-links">
    <a href="#about">about</a>
  </div>
</nav>

<!-- After -->
<nav aria-label="Main navigation">
  <a href="#" class="nav-logo" aria-label="Home - Isaac Eliape Portfolio">
    <span class="user">ieliape</span><span class="sep">@</span>portfolio
  </a>
  <ul class="nav-links" role="menubar">
    <li role="none">
      <a href="#about" role="menuitem">about</a>
    </li>
  </ul>
  <button 
    id="theme-toggle" 
    aria-label="Toggle dark/light theme"
    aria-pressed="false"
  >
    <span class="theme-icon-sun" aria-hidden="true">☀</span>
    <span class="theme-icon-moon" aria-hidden="true">☾</span>
  </button>
</nav>
```

### Lighthouse 90+ Optimization Patterns

```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.googleapis.com">

<!-- Inline critical CSS (first render styles) -->
<style>
  /* Above-fold critical styles */
  :root { --bg: #0c0c0c; /* ... */ }
  body { margin: 0; font-family: "JetBrains Mono", monospace; }
</style>

<!-- Defer non-critical CSS -->
<link rel="preload" href="css/base.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="css/base.css"></noscript>
```

---

## WCAG 2.1 AA Checklist

| Criterion | Requirement | Implementation |
|-----------|-------------|----------------|
| 1.4.3 Contrast (Minimum) | 4.5:1 for normal text, 3:1 for large | Verify all `--text` vs `--bg` combinations |
| 1.4.4 Resize text | 200% zoom without horizontal scroll | Use relative units (rem), test at 200% |
| 1.4.10 Reflow | Content readable at 320px width | Mobile-first responsive design |
| 1.4.11 Non-text Contrast | 3:1 for UI components and graphics | Buttons, borders, focus indicators |
| 2.1.1 Keyboard | All functionality via keyboard | Tab navigation, Enter/Space activation |
| 2.4.3 Focus Order | Logical navigation sequence | DOM order matches visual order |
| 2.4.7 Focus Visible | Visible focus indicator | `:focus-visible` with 3:1 contrast |
| 2.5.3 Label in Name | Accessible name contains visible text | `aria-label` includes visible text |
| 4.1.2 Name, Role, Value | All components have name and role | Buttons have aria-label, roles defined |

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `prefers-color-scheme` only | `data-theme` attribute + `prefers-color-scheme` | User override capability |
| CSS `@import` for modular CSS | Separate `<link>` tags | Parallel loading, better performance |
| JavaScript animation libraries | CSS animations + `IntersectionObserver` | Smaller bundle, better performance |
| jQuery-style DOM manipulation | Vanilla JS with `querySelector` | No dependencies, modern APIs |
| Cookie-based theme storage | localStorage | Simpler API, no server required |

---

## Open Questions

1. **Critical CSS extraction**
   - What we know: Above-fold styles should be inlined
   - What's unclear: Exactly which styles are critical for first paint
   - Recommendation: Inline CSS variables and base typography, defer component styles

2. **Theme toggle icon accessibility**
   - What we know: Icons need text alternatives
   - What's unclear: Whether to use SVG or Unicode characters
   - Recommendation: Use inline SVG with `aria-hidden="true"` and button `aria-label`

3. **Palette focus management**
   - What we know: Modal needs focus trap
   - What's unclear: Whether to implement full focus trap or simple Escape close
   - Recommendation: Implement `focus-trap` pattern for palette modal (can be lightweight custom implementation)

---

## Sources

### Primary (HIGH confidence)
- WCAG 2.1 Guidelines - https://www.w3.org/WAI/WCAG21/quickref/
- MDN prefers-reduced-motion - https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- MDN matchMedia API - https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
- localStorage API - https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

### Secondary (MEDIUM confidence)
- Lighthouse Performance Audits - https://developer.chrome.com/docs/lighthouse/performance/
- CSS Architecture patterns from existing codebase analysis

### Tertiary (LOW confidence)
- Theme FOUC prevention strategies (varies by implementation)
- Safari private mode behavior (version-dependent)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Vanilla JS/CSS well-documented
- Architecture: HIGH - Based on current working codebase
- Pitfalls: MEDIUM-HIGH - Common patterns with established solutions
- WCAG compliance: HIGH - Well-defined standards with clear criteria

**Research date:** 2026-03-03
**Valid until:** 2026-06-03 (stable domain)

**Current codebase analysis:**
- Lines 1-739: CSS (will extract to 3 files)
- Lines 740-1139: HTML (will add semantic/ARIA improvements)
- Lines 1141-1708: JavaScript (will modularize to 4 files)
- Existing features to preserve: Command palette, Vim mode, Typewriter, Reveal animations, Theme toggle, Cursor glow
