---
phase: 01-foundation
plan: 03
type: execute
wave: 2
depends_on:
  - "01-foundation-01"
  - "01-foundation-02"
files_modified:
  - js/theme.js
  - index.html
  - css/components.css
autonomous: true
must_haves:
  truths:
    - Theme toggle button appears in navigation header
    - Clicking toggle switches between dark/light themes
    - Theme preference persists across page reloads (localStorage)
    - Default theme follows system preference (prefers-color-scheme)
    - Theme transition is smooth (200-300ms)
    - No "flash of wrong theme" on page load
  artifacts:
    - path: "js/theme.js"
      provides: "Theme detection, persistence, toggle logic"
      exports: ["initTheme", "toggleTheme", "getCurrentTheme"]
    - path: "index.html"
      provides: "Inline theme script to prevent FOUC"
      contains: "script.*data-theme.*localStorage"
  key_links:
    - from: "js/theme.js"
      to: "localStorage"
      via: "localStorage.getItem/setItem"
      pattern: "localStorage.*theme"
    - from: "index.html head"
      to: "theme state"
      via: "data-theme attribute set before render"
      pattern: "document.documentElement.dataset.theme"
---

<objective>
Implement complete theme system with system preference detection, localStorage persistence, smooth transitions, and header toggle button. Prevent FOUC (flash of unstyled content) on theme load.

Purpose: Achieve FOUND-02 (dark/light theme toggle with persistence) per user locked decisions.
Output: js/theme.js module, theme toggle UI in navigation, FOUC prevention inline script.
</objective>

<execution_context>
@/Users/isaaceliape/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/isaaceliape/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@/Users/isaaceliape/repos/portfolio_2026/.planning/phases/01-foundation/01-foundation-02-SUMMARY.md (from previous plan)
@/Users/isaaceliape/repos/portfolio_2026/index.html (navigation section)

## Current Theme Implementation

Existing code in index.html (lines 1196-1207):
```javascript
function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
function getCurrentTheme() {
  return document.documentElement.dataset.theme || getSystemTheme();
}
function toggleTheme() {
  document.documentElement.dataset.theme = getCurrentTheme() === "dark" ? "light" : "dark";
}
```

## User Locked Decisions

1. **Toggle location:** Navigation header (top-right corner)
2. **Toggle style:** Icon only (sun/moon), no text label
3. **Default theme:** System preference (follows OS setting)
4. **Persistence:** localStorage with Safari private mode protection
5. **Transition:** Smooth animation (200-300ms color transitions)

## FOUC Prevention Strategy

To prevent "flash of wrong theme":
1. Inline script in <head> runs before body renders
2. Script reads localStorage or detects system preference
3. Sets data-theme attribute immediately on <html> element
4. Body renders with correct theme already applied

## Theme Toggle Icons

Use SVG icons embedded directly (no external dependencies):
- Sun icon (for dark mode - clicking switches to light)
- Moon icon (for light mode - clicking switches to dark)
- Or use Unicode characters: ☀ (sun) and ☾ (moon)

## CSS Variables Already Support Themes

The existing CSS (already extracted in Plan 01-01) has:
- :root default (dark theme colors)
- @media (prefers-color-scheme: light) for auto-detection
- [data-theme="light"] for explicit light mode
- [data-theme="dark"] for explicit dark mode
- Transition properties on color-related properties
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create js/theme.js with full theme system</name>
  <files>js/theme.js</files>
  <action>
    Create js/theme.js containing complete theme system:
    
    1. Constants:
       ```javascript
       const STORAGE_KEY = 'portfolio-theme';
       const THEME_LIGHT = 'light';
       const THEME_DARK = 'dark';
       ```
    
    2. Detect system preference:
       ```javascript
       export function getSystemTheme() {
         return window.matchMedia('(prefers-color-scheme: light)').matches 
           ? THEME_LIGHT 
           : THEME_DARK;
       }
       ```
    
    3. Get current theme (with fallback chain: explicit > localStorage > system):
       ```javascript
       export function getCurrentTheme() {
         // Check explicit data attribute first
         const explicit = document.documentElement.dataset.theme;
         if (explicit) return explicit;
         
         // Then check localStorage
         try {
           const saved = localStorage.getItem(STORAGE_KEY);
           if (saved) return saved;
         } catch (e) {
           // Silent fail for private browsing
         }
         
         // Fall back to system preference
         return getSystemTheme();
       }
       ```
    
    4. Apply theme to document:
       ```javascript
       export function applyTheme(theme) {
         document.documentElement.dataset.theme = theme;
         updateToggleIcon(theme);
       }
       ```
    
    5. Save theme preference:
       ```javascript
       export function saveTheme(theme) {
         try {
           localStorage.setItem(STORAGE_KEY, theme);
         } catch (e) {
           // Silent fail for Safari private mode
           console.log('Could not save theme preference');
         }
       }
       ```
    
    6. Toggle theme:
       ```javascript
       export function toggleTheme() {
         const current = getCurrentTheme();
         const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
         applyTheme(next);
         saveTheme(next);
       }
       ```
    
    7. Update toggle button icon:
       ```javascript
       function updateToggleIcon(theme) {
         const btn = document.getElementById('theme-toggle');
         if (!btn) return;
         
         // Update aria-label
         btn.setAttribute('aria-label', 
           theme === THEME_DARK ? 'Switch to light mode' : 'Switch to dark mode'
         );
         
         // Update icon (sun for dark mode, moon for light mode)
         btn.innerHTML = theme === THEME_DARK 
           ? '☀' // Sun icon - clicking will switch to light
           : '☾'; // Moon icon - clicking will switch to dark
       }
       ```
    
    8. Setup toggle button:
       ```javascript
       function setupToggleButton() {
         const btn = document.getElementById('theme-toggle');
         if (!btn) return;
         
         btn.addEventListener('click', toggleTheme);
         
         // Set initial icon
         updateToggleIcon(getCurrentTheme());
       }
       ```
    
    9. Watch system preference changes:
       ```javascript
       function watchSystemPreference() {
         const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
         mediaQuery.addEventListener('change', (e) => {
           // Only auto-switch if user hasn't set explicit preference
           try {
             const saved = localStorage.getItem(STORAGE_KEY);
             if (!saved) {
               const newTheme = e.matches ? THEME_LIGHT : THEME_DARK;
               applyTheme(newTheme);
             }
           } catch (e) {
             // Silent fail
           }
         });
       }
       ```
    
    10. Initialize:
        ```javascript
        export function initTheme() {
          setupToggleButton();
          watchSystemPreference();
          
          // Ensure icon matches current theme
          updateToggleIcon(getCurrentTheme());
        }
        ```
    
    11. Export all public functions:
        ```javascript
        export { getSystemTheme, getCurrentTheme, applyTheme, saveTheme, toggleTheme, initTheme };
        ```
  </action>
  <verify>
    Run: wc -l js/theme.js && grep -c "export function" js/theme.js
    Expect: File exists with ~120-150 lines, contains 6+ exported functions
  </verify>
  <done>
    js/theme.js exists with complete theme system: system detection, localStorage persistence, toggle function, icon updates, and initialization
  </done>
</task>

<task type="auto">
  <name>Task 2: Add inline FOUC prevention script to index.html head</name>
  <files>index.html</files>
  <action>
    Add inline script to <head> to prevent FOUC:
    
    1. Place this script immediately after the Google Fonts link and before any CSS links:
       ```html
       <!-- Prevent Flash of Wrong Theme (FOUC) -->
       <script>
         (function() {
           const STORAGE_KEY = 'portfolio-theme';
           
           // Get saved theme or detect system preference
           let theme;
           try {
             theme = localStorage.getItem(STORAGE_KEY);
           } catch (e) {
             // Silent fail for private browsing
           }
           
           if (!theme) {
             theme = window.matchMedia('(prefers-color-scheme: light)').matches 
               ? 'light' 
               : 'dark';
           }
           
           // Apply immediately before body renders
           document.documentElement.dataset.theme = theme;
         })();
       </script>
       ```
    
    2. This ensures the theme is set BEFORE the body renders, preventing any flash.
    
    3. The inline script duplicates minimal logic from theme.js to avoid async loading issues.
    
    4. Order in <head> should be:
       - Meta tags
       - Title
       - Google Fonts
       - FOUC prevention script (NEW)
       - CSS links (base.css, layout.css, components.css)
  </action>
  <verify>
    Run: grep -A 5 "Prevent Flash of Wrong Theme" index.html
    Expect: Inline script exists in head, sets document.documentElement.dataset.theme
  </verify>
  <done>
    FOUC prevention script added to index.html head, runs immediately to set data-theme before body renders
  </done>
</task>

<task type="auto">
  <name>Task 3: Add theme toggle button to navigation</name>
  <files>index.html</files>
  <action>
    Add theme toggle button to navigation header:
    
    1. Locate navigation HTML (around lines 784-797 in original):
       ```html
       <nav>
         <span class="nav-logo">...</span>
         <div class="nav-links">
           <a href="#about">about</a>
           <a href="#projects">projects</a>
           <a href="#contact">contact</a>
           <span class="kbd-hint" id="nav-palette-btn">⌘ Ctrl+Shift+P</span>
           <!-- ADD THEME TOGGLE HERE -->
         </div>
       </nav>
       ```
    
    2. Add theme toggle button after the palette hint:
       ```html
       <button 
         id="theme-toggle" 
         class="theme-toggle" 
         aria-label="Switch to light mode"
         type="button"
       >
         ☀
       </button>
       ```
    
    3. Note: Using ☀ initially (dark mode default). Icon will be updated by JavaScript based on actual theme.
    
    4. Add appropriate ARIA attributes:
       - aria-label that updates dynamically
       - type="button" to prevent form submission
    
    5. The button will be styled in Task 4.
  </action>
  <verify>
    Run: grep -c "id=\"theme-toggle\"" index.html
    Expect: Button exists in navigation
  </verify>
  <done>
    Theme toggle button added to navigation with id="theme-toggle", proper ARIA attributes, and initial icon
  </done>
</task>

<task type="auto">
  <name>Task 4: Style theme toggle button in CSS</name>
  <files>css/components.css</files>
  <action>
    Add theme toggle button styles to css/components.css:
    
    1. Add to navigation section or create new "Theme Toggle" section:
       ```css
       /* Theme Toggle Button */
       .theme-toggle {
         background: transparent;
         border: 1px solid var(--border-bright);
         border-radius: 6px;
         color: var(--text);
         cursor: pointer;
         font-family: inherit;
         font-size: 1rem;
         line-height: 1;
         padding: 0.4rem 0.6rem;
         transition: 
           border-color 0.2s,
           color 0.2s,
           background 0.2s;
       }
       
       .theme-toggle:hover {
         border-color: var(--accent);
         color: var(--accent);
         background: color-mix(in srgb, var(--accent) 6%, transparent);
       }
       
       .theme-toggle:focus-visible {
         outline: 2px solid var(--accent);
         outline-offset: 2px;
       }
       ```
    
    2. Ensure nav-links has appropriate gap to accommodate the new button:
       Check that .nav-links { gap: 2rem } has enough space, or adjust to include the toggle.
    
    3. Add responsive adjustment for mobile if needed:
       ```css
       @media (max-width: 640px) {
         .theme-toggle {
           padding: 0.35rem 0.5rem;
           font-size: 0.9rem;
         }
       }
       ```
    
    4. Verify transition properties align with user decision (200-300ms smooth transition).
  </action>
  <verify>
    Run: grep -A 10 "theme-toggle" css/components.css
    Expect: Styles exist for .theme-toggle, .theme-toggle:hover, and .theme-toggle:focus-visible
  </verify>
  <done>
    Theme toggle button styled with proper hover states, focus indicators, and transitions
  </done>
</task>

<task type="auto">
  <name>Task 5: Import and initialize theme system in app.js</name>
  <files>js/app.js</files>
  <action>
    Update js/app.js to import and initialize the theme system:
    
    1. Add import at top of app.js:
       ```javascript
       import { initTheme, toggleTheme } from './theme.js';
       ```
    
    2. In the init() function, add theme initialization:
       ```javascript
       function init() {
         initTheme();  // ADD THIS
         initAnimations();
         setupEventListeners();
         console.log('Portfolio app initialized');
       }
       ```
    
    3. Update the exported toggleTheme to use the imported one:
       ```javascript
       // Remove the placeholder toggleTheme implementation
       // Export the real one from theme.js
       export { toggleTheme } from './theme.js';
       ```
       Or simply:
       ```javascript
       export { toggleTheme };
       ```
       (where toggleTheme is imported from theme.js)
    
    4. Update data.js action resolution to use the proper toggleTheme:
       Ensure that when action is "theme:toggle", it calls the imported toggleTheme.
    
    5. Ensure initTheme() is called early in the initialization sequence.
  </action>
  <verify>
    Run: grep -c "import.*initTheme.*from.*theme" js/app.js
    Expect: Import statement exists
  </verify>
  <done>
    app.js imports and initializes theme system, exports toggleTheme from theme.js
  </done>
</task>

</tasks>

<verification>
1. Theme toggle button visible in navigation (sun/moon icon)
2. Clicking toggle switches theme immediately with smooth transition
3. Refresh page - theme preference persists
4. Clear localStorage, refresh - theme follows system preference
5. Change OS theme - portfolio updates automatically (if no explicit preference set)
6. No flash of wrong theme on page load
7. Theme toggle works from command palette as well
</verification>

<success_criteria>
- js/theme.js created with system detection, localStorage persistence, and toggle functionality
- Theme toggle button added to navigation header (icon only, per user decision)
- FOUC prevention script runs in head before body renders
- Smooth 200-300ms transitions between themes
- Theme preference persists across reloads (FOUND-02 achieved)
- Default theme follows system preference (FOUND-02 achieved)
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-03-SUMMARY.md`
</output>
