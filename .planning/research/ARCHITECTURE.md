# Architecture Patterns

**Domain:** Modern Developer Portfolio (Single-Page Application)
**Researched:** 2026-03-03
**Overall Confidence:** HIGH

## Executive Summary

Modern developer portfolios follow a component-based architecture organized around semantic HTML sections (hero, about, projects, contact) with separated CSS and JavaScript concerns. The recommended approach uses a data-driven model where a centralized data source feeds multiple UI components, with modular JavaScript handling DOM manipulation, interactivity, and state updates. This pattern balances simplicity with maintainability while avoiding heavy framework dependencies.

## Recommended Architecture

### Core Philosophy

**Separation of Concerns:**
- HTML: semantic structure and content containers
- CSS: presentation, animations, responsive behavior
- JavaScript: interactivity, data management, DOM updates

**Data-Driven Design:**
- Single source of truth for portfolio content (projects, skills, contact)
- Components consume data and render accordingly
- Easy content updates without touching presentation logic

**Module-Based Organization:**
- Each major feature (command palette, theme toggle, reveal animations) in its own module
- Clear dependencies between modules
- Vanilla JavaScript modules using ES6 module syntax

---

## Component Structure

### Primary Components (Semantic Sections)

| Component | Responsibility | Contains | Interacts With |
|-----------|---|---|---|
| **Navigation** | Site navigation header with logo/name | Logo, nav links, theme toggle button | Router (scroll-to-section), Theme Manager |
| **Hero** | First impression landing area | Title, subtitle, typewriter animation, CTA buttons | Typewriter module, scroll handlers |
| **About** | Personal bio and skills showcase | Bio text, tools list, terminal-style formatting | Data store (skills, bio) |
| **Projects** | Showcases portfolio work | Project grid/cards, images, descriptions, tags | Data store (projects), card reveal animations |
| **Contact** | Contact information and links | Email, social links, contact methods | Data store (contact info), link handlers |
| **Footer** | Page footer | Copyright, secondary links | Theme indicator |

### Supporting Components (Functional Modules)

| Component | Responsibility | Used By |
|-----------|---|---|
| **Command Palette** | Fuzzy search interface for navigation | Global (Ctrl+Shift+P trigger) |
| **Theme Manager** | Light/dark mode detection and toggle | Navigation, All sections |
| **Reveal Animation Engine** | Fade-in + slide-up on scroll | Projects, About (via `.reveal` class) |
| **Typewriter Animation** | Cycling text effect in hero | Hero section |
| **Router/Scroll Handler** | Smooth scrolling between sections | Navigation links, Command Palette |

---

## File Organization

### Recommended Structure

```
portfolio_2026/
├── index.html                    # Main HTML structure (semantic markup)
├── css/
│   ├── styles.css                # All styles (colors, layout, animations, responsive)
│   └── theme-variables.css       # CSS custom properties (optional: if too large)
├── js/
│   ├── main.js                   # Entry point, module initialization
│   ├── modules/
│   │   ├── data.js              # Central data store (projects, skills, contact)
│   │   ├── dom.js               # DOM query and manipulation helpers
│   │   ├── theme.js             # Theme detection, toggle, persistence
│   │   ├── animations/
│   │   │   ├── reveal.js        # Scroll-triggered reveal animation
│   │   │   ├── typewriter.js    # Hero typewriter effect
│   │   │   └── cursor-glow.js   # Mouse-follow cursor effect (if included)
│   │   ├── features/
│   │   │   ├── command-palette.js  # Fuzzy search interface
│   │   │   ├── vim-mode.js         # Vim keybindings (optional feature)
│   │   │   └── scroll-spy.js       # Nav highlight based on scroll position
│   │   └── router.js            # Scroll-based navigation and hash routing
│   └── vendor/                  # Third-party scripts (if any)
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/                   # Web fonts (if external)
└── .planning/research/          # Research and planning docs
```

### Rationale for Separation

**HTML (`index.html`)**
- Semantic structure using `<header>`, `<nav>`, `<section>`, `<footer>`
- Data attributes (`data-*`) for JavaScript hooks
- No inline CSS or JavaScript

**CSS (`css/styles.css`)**
- All visual styling and animations
- CSS custom properties (variables) for theme colors
- Responsive breakpoints
- Animation keyframes

**JavaScript modules (`js/`)**
- `data.js`: Single source of truth for portfolio content
- `dom.js`: Reusable DOM utilities (query, create elements)
- Feature modules handle specific interactivity
- Clean imports/exports using ES6 modules

---

## Data Flow

### Data → DOM Rendering Flow

```
DATA STORE (data.js)
    ↓
[Projects, Skills, Bio, Contact]
    ↓
COMPONENT MODULES (theme.js, animations, features)
    ↓
Query DOM elements via selectors/data-attributes
    ↓
Render content into sections
    ↓
Attach event listeners
    ↓
USER INTERACTION
    ↓
State update → DOM update (re-render or mutate)
```

### Event Flow Example: Command Palette

```
User presses Ctrl+Shift+P
    ↓
Keyboard event listener triggers
    ↓
Fuzzy search across DATA.items
    ↓
Render filtered results in palette UI
    ↓
User selects item
    ↓
Navigation action (scroll to section, toggle theme, open link)
    ↓
Smooth scroll animation or DOM state update
```

### Animation Trigger Flow

```
User scrolls page
    ↓
IntersectionObserver detects `.reveal` elements in viewport
    ↓
Add `.in-view` class to element
    ↓
CSS animation (fade-in + slide-up) via keyframes
    ↓
Element transitions in over 0.6s with stagger delay
```

---

## Component Boundaries & Communication

### Clear Separation

**HTML Layer** — Contains only markup with semantic tags
- Does NOT contain logic
- Uses `data-*` attributes to signal JavaScript hooks

**CSS Layer** — Controls all presentation
- Does NOT contain logic
- Provides `.in-view` class for animations
- Supports theme variables for dark/light mode

**JavaScript Layer** — Manages behavior
- Queries DOM elements (via classes, IDs, data attributes)
- Listens for events (scroll, click, keyboard, theme preference)
- Mutates DOM or applies CSS classes
- Fetches/updates from data store

### Module Interdependencies

```
main.js (orchestrator)
├── data.js (no dependencies)
├── dom.js (no dependencies)
├── theme.js → dom.js
├── router.js → dom.js
├── animations/reveal.js → dom.js
├── animations/typewriter.js → dom.js
├── features/command-palette.js → data.js, dom.js, router.js, theme.js
├── features/vim-mode.js → router.js
└── features/scroll-spy.js → dom.js, router.js
```

**Low coupling:** Modules communicate through DOM state and the data store, not direct method calls.

---

## Build Sequence & Initialization Order

### Why Order Matters

1. **Data first** — Everything depends on having content available
2. **DOM utilities** — Other modules use these helpers
3. **Theme detection** — Should run early to avoid flash of wrong theme
4. **Animation engines** — Set up observers and event listeners
5. **Feature modules** — Wire up interactivity once structure is ready

### Recommended Initialization (`main.js`)

```javascript
// 1. Load data and utilities (blocking)
import { DATA } from './modules/data.js';
import * as dom from './modules/dom.js';

// 2. Setup theme early (prevents FOUC — flash of unstyled content)
import { initTheme } from './modules/theme.js';
initTheme();

// 3. Initialize animation engines
import { initRevealAnimation } from './modules/animations/reveal.js';
import { initTypewriter } from './modules/animations/typewriter.js';
initRevealAnimation();
initTypewriter();

// 4. Setup navigation and routing
import { initRouter } from './modules/router.js';
initRouter();

// 5. Wire up interactive features
import { initCommandPalette } from './modules/features/command-palette.js';
import { initVimMode } from './modules/features/vim-mode.js';
initCommandPalette();
initVimMode();

console.log('Portfolio initialized');
```

### Why This Order

| Step | Why First |
|------|-----------|
| Data & DOM utils | All modules need these |
| Theme detection | Run before layout paint to avoid theme flashing |
| Animations | Set up IntersectionObservers early |
| Router | Wire up navigation before interactive features |
| Features | Depend on everything being ready |

---

## Scalability Patterns

### At Current Scale (Single Developer Portfolio)

**Current approach is appropriate:**
- Single `data.js` file holds all content
- All CSS in one file with variables for theming
- Simple ES6 modules organized by feature

### At 10x Scale (Growing with multiple projects, case studies)

**Considerations:**

| Concern | Solution |
|---------|----------|
| Large data file | Split into `data/projects.js`, `data/skills.js`, etc. |
| CSS file size | Organize into `css/components/`, `css/layout/`, etc. and use CSS preprocessor (Sass) |
| Complex interactivity | Extract common patterns into helper utilities |
| Asset management | Add build step (11ty, Astro) if moving to 100+ images |

### At 100x Scale (Multiple sections, blog, admin)

**Would require rethinking:**
- Consider static site generator (11ty, Astro, Next.js) for blog content
- Move to TypeScript for larger codebase
- Add build tooling (webpack, esbuild) for asset optimization
- Introduce proper state management (Proxy-based store pattern)

**For this project:** Vanilla approach scales well to 2-3x current size. Reassess if portfolio grows significantly.

---

## Patterns to Follow

### Pattern 1: Data-Driven Components

**What:** Component rendering driven by centralized data store.

**When:** Portfolio content (projects, skills) that needs to be displayed in multiple places.

**Example:**

```javascript
// data.js
export const DATA = {
  projects: [
    { id: 'project-1', title: 'AI Research Tool', tags: ['React', 'ML'] },
    // ...
  ]
};

// main.js
import { DATA } from './modules/data.js';

const projectsContainer = document.querySelector('[data-section="projects"]');
DATA.projects.forEach(project => {
  const card = document.createElement('div');
  card.innerHTML = `<h3>${project.title}</h3>...`;
  projectsContainer.appendChild(card);
});
```

**Benefit:** Change a project once in data.js; automatically reflects everywhere.

### Pattern 2: Event Delegation

**What:** Attach one listener to parent, handle child clicks via event.target.

**When:** Projects grid, command palette results, nav links.

**Example:**

```javascript
// Instead of adding listener to each project card:
document.querySelector('[data-section="projects"]').addEventListener('click', (e) => {
  if (e.target.closest('.project-card')) {
    // Handle project card click
  }
});
```

**Benefit:** Works for dynamically added elements, fewer listeners in memory.

### Pattern 3: Module Initialization Pattern

**What:** Each module exports an `init()` function called from main.js.

**When:** Every feature module (theme, animations, features).

**Example:**

```javascript
// modules/theme.js
export function initTheme() {
  detectSystemTheme();
  attachToggleListener();
  applyStoredPreference();
}

// main.js
import { initTheme } from './modules/theme.js';
initTheme();
```

**Benefit:** Modules are independent; can disable features by commenting out init call.

### Pattern 4: Semantic HTML with Data Attributes

**What:** Use `data-*` attributes as selectors instead of class names for JS hooks.

**When:** When you need JavaScript to target elements reliably.

**Example:**

```html
<section data-section="projects" data-auto-reveal="true">
  <article class="project-card" data-project-id="project-1"></article>
</section>
```

```javascript
const projects = document.querySelectorAll('[data-project-id]');
```

**Benefit:** Separates CSS classes (for styling) from JS selectors (for behavior).

### Pattern 5: CSS Classes for State

**What:** Use CSS classes to represent state (e.g., `.in-view`, `.active`, `.dark-mode`).

**When:** Animations, theme switching, active nav states.

**Example:**

```javascript
// Reveal animation adds class when in viewport
element.classList.add('in-view');

// CSS handles the visual change
.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}
```

**Benefit:** JavaScript controls state; CSS controls appearance. Clean separation.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Inline Event Handlers

**What:** Event logic mixed into HTML or inline JavaScript.

```html
<!-- DON'T DO THIS -->
<button onclick="toggleTheme()">Toggle</button>
```

**Why Bad:**
- Hard to test
- Difficult to refactor
- Easy to create global scope pollution
- Mixes concerns

**Instead:** Attach listeners in modules via `addEventListener`.

### Anti-Pattern 2: Global Variables

**What:** Storing state in window or global scope.

```javascript
// DON'T DO THIS
window.currentTheme = 'dark';
window.toggleTheme = function() { ... };
```

**Why Bad:**
- Namespace pollution
- Hard to track state mutations
- Testing complexity

**Instead:** Use ES6 modules; keep state local or in data.js exports.

### Anti-Pattern 3: Monolithic JavaScript File

**What:** All JavaScript in one large file without modular organization.

**Why Bad:**
- Hard to locate features
- Difficult to disable/enable features
- Poor reusability
- Testing nightmare

**Instead:** Organize into modules by feature/concern.

### Anti-Pattern 4: DOM Selectors in Styles

**What:** Using CSS to query/style elements based on JavaScript state in confusing ways.

```css
/* DON'T DO THIS */
.theme-toggle:hover {
  /* styling that depends on JS state */
}
```

**Why Bad:**
- Couples CSS to specific DOM structure
- Hard to maintain
- Difficult to refactor HTML

**Instead:** JavaScript applies classes; CSS styles classes consistently.

### Anti-Pattern 5: Unnecessary Abstraction

**What:** Creating complex wrapper functions for simple DOM operations.

```javascript
// DON'T DO THIS
function createButtonElement(text, callback) {
  return new Button(text, { onClick: callback });
}
```

**Why Bad:**
- Adds complexity without benefit in a small project
- Harder to understand
- Overhead of extra function calls

**Instead:** For a portfolio, use simple DOM methods. Abstract only when pattern repeats 3+ times.

---

## Recommended Tech Stack

### HTML
- **Standard:** HTML5 with semantic elements
- **Why:** Proper structure, accessibility, SEO, no dependencies

### CSS
- **Core:** Native CSS with custom properties (CSS variables)
- **Why:** Modern browsers all support; no preprocessor needed for portfolio scale
- **Consider:** Sass if portfolio grows to 3000+ lines of CSS

### JavaScript
- **Standard:** Vanilla JavaScript (ES6 modules)
- **Why:** No build step, works everywhere, demonstrates core skills
- **Avoid:** React/Vue (overcomplicated for single-page portfolio)
- **Consider TypeScript:** Only if codebase grows significantly

### Build Tools
- **Current:** None needed (single HTML, CSS, JS files)
- **Consider Later:** 11ty/Astro if adding blog, case studies, or significantly more content

### Asset Delivery
- **Images:** Optimize for web (WebP with fallback PNG)
- **Icons:** SVG inline or sprite sheet
- **Fonts:** System fonts + 1-2 web fonts (Google Fonts)

---

## Performance Considerations

### Critical Rendering Path

1. HTML parses → creates DOM
2. CSS loads → CSSOM created
3. JavaScript executes → DOM updated, listeners attached
4. Animations begin → IntersectionObserver triggers reveal effects

**Optimization strategies:**

| Concern | Solution |
|---------|----------|
| Flash of wrong theme | Inline critical theme detection in `<head>` |
| Cumulative Layout Shift | Define image dimensions, reserve space for animations |
| Large JS file | Code splitting by feature (only if >50KB) |
| Paint performance | Use transform/opacity for animations (not top/left) |

### Recommended Metrics

| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |

---

## Sources

- [Building a Modern Developer Portfolio: A Technical Deep Dive | Medium](https://medium.com/@zulfikarditya/building-a-modern-developer-portfolio-a-technical-deep-dive-a95d068b99fd)
- [How to Create a Portfolio Website using HTML CSS and JavaScript | GeeksforGeeks](https://www.geeksforgeeks.org/javascript/how-to-create-a-portfolio-website-using-html-css-and-javascript/)
- [How to Write Modular and Scalable Code in Vanilla JavaScript | jamal-mvc.com](https://jamal-mvc.com/2025/12/12/how-to-write-modular-and-scalable-code-in-vanilla-javascript-best-practices-and-proven-strategies/)
- [Mastering Modules and Modular Design Patterns in Vanilla JavaScript | procodebase.com](https://procodebase.com/article/mastering-modules-and-modular-design-patterns-in-vanilla-javascript)
- [State Management in Vanilla JS: 2026 Trends | Medium](https://medium.com/@chirag.dave/state-management-in-vanilla-js-2026-trends-f9baed7599de)
- [Front-end JavaScript single page application architecture | marcobotto.com](https://marcobotto.com/blog/frontend-javascript-single-page-application-architecture/)
- [Semantic HTML Portfolio Project | GitHub](https://github.com/codeschool-projects/SemanticHTMLPortfolioProject)
- [W3Schools: How to Create a Portfolio](https://www.w3schools.com/howto/howto_website_create_portfolio.asp)
- [The Top Five Static Site Generators for 2025 | CloudCannon](https://cloudcannon.com/blog/the-top-five-static-site-generators-for-2025-and-when-to-use-them/)
- [Modern State Management in Vanilla JavaScript | Medium](https://medium.com/@orami98/modern-state-management-in-vanilla-javascript-2026-patterns-and-beyond-ce00425f7ac5)
