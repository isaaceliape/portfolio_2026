---
phase: 01-foundation
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - js/utils.js
  - js/data.js
  - js/app.js
  - js/animations.js
  - index.html
autonomous: true
must_haves:
  truths:
    - JavaScript is separated into modular files in js/ folder
    - DATA array lives in dedicated data.js file (data-driven architecture)
    - index.html loads JS files in correct dependency order
    - All existing functionality works: palette, vim mode, typewriter, reveal animations, theme toggle
  artifacts:
    - path: "js/utils.js"
      provides: "Utility functions (fuzzy search, escape, helpers)"
      exports: ["fuzzy", "esc", "highlight"]
    - path: "js/data.js"
      provides: "DATA array with all palette items"
      exports: ["DATA"]
    - path: "js/app.js"
      provides: "Main application logic, event handlers"
      exports: ["navTo", "openPalette", "closePalette"]
    - path: "js/animations.js"
      provides: "Reveal animations, typewriter, cursor glow"
      exports: ["initAnimations"]
  key_links:
    - from: "js/app.js"
      to: "js/data.js"
      via: "import { DATA }"
      pattern: "import.*DATA.*from.*data"
---

<objective>
Extract all inline JavaScript from index.html into four organized JS files (utils.js, data.js, app.js, animations.js) while implementing data-driven architecture (TECH-02).

Purpose: Achieve TECH-01 (separated JS files), TECH-02 (data-driven architecture), and TECH-03 (modern JS patterns).
Output: js/ directory with four JS files, index.html updated with script tags, DATA array externalized.
</objective>

<execution_context>
@/Users/isaaceliape/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/isaaceliape/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@index.html (JavaScript section: lines 1141-1708)

## JavaScript Extraction Strategy

Current JS structure in index.html:

1. **Element references** (lines 1142-1146):
   - glowEl, overlay, input, results, vimEl

2. **Cursor glow** (lines 1148-1151): Mousemove event listener

3. **Typewriter animation** (lines 1153-1179):
   - twLines array, twLi, twCi, twDel variables
   - type() function with setTimeout logic

4. **Reveal animations** (lines 1181-1194):
   - IntersectionObserver setup
   - Observing all .reveal elements

5. **Theme functions** (lines 1196-1207):
   - getSystemTheme(), getCurrentTheme(), toggleTheme()
   - Will be enhanced in Plan 01-03 with persistence

6. **Vim mode** (lines 1209-1219):
   - vimMode, gPressed, gTimer variables
   - setVimMsg(), toggleVim() functions

7. **DATA array** (lines 1221-1481):
   - Large array with categories: Theme, VIM, Navigate, Profile, Skills, Tools, Awards, Projects, Contact
   - Each item has: category, icon, title, sub, action (function or null)
   - This is the core data structure to externalize for TECH-02

8. **Navigation** (lines 1483-1485): navTo() function

9. **Palette state** (lines 1487-1488): activeIdx, filtered variables

10. **Fuzzy search** (lines 1490-1519):
    - fuzzy() algorithm
    - highlight() function
    - esc() function

11. **Palette rendering** (lines 1521-1574): render() function

12. **Item handling** (lines 1576-1608):
    - itemHTML(), attachItemEvents(), setActive(), activate()

13. **Palette open/close** (lines 1609-1617)

14. **Event listeners** (lines 1619-1706):
    - Keydown handler (palette + vim mode)
    - Input listener for search
    - Overlay click listener
    - Palette button click listener

## File Organization (per user decision)
- **js/utils.js**: Pure utility functions (fuzzy, esc, highlight)
- **js/data.js**: DATA array only (data-driven architecture)
- **js/app.js**: Main app logic (navTo, palette functions, event handlers)
- **js/animations.js**: Cursor glow, typewriter, reveal animations
- Note: theme.js and Vim will be created in Plan 01-03 (needs special handling for persistence)

## Modern JS Patterns (TECH-03)
- Use ES6 modules with import/export
- Clear initialization pattern (init() or DOMContentLoaded)
- Separate concerns: data, utilities, UI logic, animations
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create js/utils.js with utility functions</name>
  <files>js/utils.js</files>
  <action>
    Create js/utils.js containing pure utility functions:
    
    1. Fuzzy search algorithm (lines 1490-1506):
       ```javascript
       export function fuzzy(str, pattern) {
         // Implementation from original
       }
       ```
    
    2. HTML escape function (lines 1514-1519):
       ```javascript
       export function esc(s) {
         // Implementation from original
       }
       ```
    
    3. Highlight function (lines 1507-1513):
       ```javascript
       export function highlight(text, indices) {
         // Implementation from original
       }
       ```
    
    4. Additional helpers that might be useful:
       - debounce utility for search input
       - throttle utility for scroll events
    
    All functions should be pure (no side effects, no DOM manipulation).
    Use ES6 export syntax for each function.
  </action>
  <verify>
    Run: ls js/utils.js && head -20 js/utils.js
    Expect: File exists, starts with export functions
  </verify>
  <done>
    js/utils.js exists with exported fuzzy(), esc(), and highlight() functions
  </done>
</task>

<task type="auto">
  <name>Task 2: Create js/data.js with DATA array (data-driven architecture)</name>
  <files>js/data.js</files>
  <action>
    Create js/data.js containing the complete DATA array:
    
    1. Extract DATA array (lines 1221-1481) from index.html completely
    
    2. Since actions are functions that reference navTo() and open(), handle carefully:
       - For actions that call navTo("#section"): store as string "nav:#section"
       - For actions that call open(url): store as string "open:url"
       - For toggleTheme and toggleVim: store as string "theme:toggle" and "vim:toggle"
       - For null actions: keep as null
    
    3. Structure:
       ```javascript
       export const DATA = [
         {
           category: "Theme",
           icon: "◑",
           title: "Toggle Light / Dark",
           sub: "switch color theme",
           action: "theme:toggle"
         },
         // ... all items with action strings instead of functions
       ];
       ```
    
    4. Add a helper function to resolve action strings:
       ```javascript
       export function resolveAction(item, context) {
         // Parse action string and return executable function
       }
       ```
    
    5. This achieves TECH-02: Data-driven architecture where content is separated from presentation logic.
    
    Preserve ALL data exactly as in original, only change action functions to action strings.
  </action>
  <verify>
    Run: wc -l js/data.js && grep -c "category:" js/data.js
    Expect: File exists with ~100-150 lines, contains all 40+ data items
  </verify>
  <done>
    js/data.js exists with complete DATA array, all items have action strings instead of function references, exports DATA and resolveAction
  </done>
</task>

<task type="auto">
  <name>Task 3: Create js/animations.js with all animation logic</name>
  <files>js/animations.js</files>
  <action>
    Create js/animations.js containing:
    
    1. Cursor glow effect (lines 1142, 1148-1151):
       ```javascript
       export function initCursorGlow() {
         const glowEl = document.getElementById("cursor-glow");
         if (!glowEl) return;
         document.addEventListener("mousemove", (e) => {
           glowEl.style.left = e.clientX + "px";
           glowEl.style.top = e.clientY + "px";
         });
       }
       ```
    
    2. Typewriter animation (lines 1153-1179):
       ```javascript
       export function initTypewriter() {
         const twLines = ["ls projects/", "open sclp.co", "ssh ieliape@work"];
         // ... implementation with setTimeout logic
       }
       ```
    
    3. Reveal animations (lines 1181-1194):
       ```javascript
       export function initRevealAnimations() {
         const revealObs = new IntersectionObserver(
           // ... implementation
         );
         document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));
       }
       ```
    
    4. Main init function:
       ```javascript
       export function initAnimations() {
         initCursorGlow();
         initTypewriter();
         initRevealAnimations();
       }
       ```
    
    All functions should check for element existence before attaching listeners.
    Use requestAnimationFrame where appropriate for performance.
  </action>
  <verify>
    Run: wc -l js/animations.js && grep -c "export function" js/animations.js
    Expect: File exists with ~80-100 lines, contains 4 exported functions
  </verify>
  <done>
    js/animations.js exists with initCursorGlow(), initTypewriter(), initRevealAnimations(), and initAnimations() all exported
  </done>
</task>

<task type="auto">
  <name>Task 4: Create js/app.js with main application logic</name>
  <files>js/app.js</files>
  <action>
    Create js/app.js as the main application entry point:
    
    1. Imports at top:
       ```javascript
       import { DATA, resolveAction } from './data.js';
       import { fuzzy, esc, highlight } from './utils.js';
       import { initAnimations } from './animations.js';
       ```
    
    2. Navigation function (lines 1483-1485):
       ```javascript
       export function navTo(id) {
         document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
       }
       ```
    
    3. Palette state and functions (lines 1487-1617):
       - activeIdx, filtered variables
       - render(), itemHTML(), attachItemEvents(), setActive(), activate()
       - openPalette(), closePalette()
       - Update to use resolveAction() for executing item actions
    
    4. Event listeners setup function:
       ```javascript
       function setupEventListeners() {
         // Keydown handler for palette and vim (lines 1619-1697)
         // Input listener for search (line 1700)
         // Overlay click listener (lines 1701-1703)
         // Palette button click listener (lines 1704-1706)
       }
       ```
    
    5. Vim mode support (lines 1209-1219, 1655-1697):
       - vimMode, gPressed, gTimer variables
       - toggleVim(), setVimMsg() functions
       - Vim navigation in keydown handler
       - Export toggleVim for use by theme/palette
    
    6. Theme toggle placeholder (will be properly implemented in Plan 01-03):
       ```javascript
       export function toggleTheme() {
         // Temporary implementation, will be replaced in Plan 01-03
         const current = document.documentElement.dataset.theme;
         document.documentElement.dataset.theme = current === "dark" ? "light" : "dark";
       }
       ```
    
    7. Initialization:
       ```javascript
       function init() {
         initAnimations();
         setupEventListeners();
         console.log('Portfolio app initialized');
       }
       
       if (document.readyState === 'loading') {
         document.addEventListener('DOMContentLoaded', init);
       } else {
         init();
       }
       ```
    
    8. Export key functions that other modules might need:
       ```javascript
       export { navTo, openPalette, closePalette, toggleVim, toggleTheme };
       ```
  </action>
  <verify>
    Run: wc -l js/app.js && grep -c "^import" js/app.js
    Expect: File exists with ~200-250 lines, contains imports from data.js, utils.js, animations.js
  </verify>
  <done>
    js/app.js exists as main entry point, imports from other modules, exports navTo, openPalette, closePalette, toggleVim, toggleTheme, initializes on DOMContentLoaded
  </done>
</task>

<task type="auto">
  <name>Task 5: Update index.html to load JavaScript modules</name>
  <files>index.html</files>
  <action>
    Update index.html to reference external JavaScript:
    
    1. Remove inline script block (lines 1141-1708) completely
    
    2. Add script tag for ES modules:
       ```html
       <script type="module" src="js/app.js"></script>
       ```
    
    3. Since app.js imports from other modules, no additional script tags needed
    
    4. Ensure script tag is placed before closing </body> tag
    
    5. Verify no inline script remains (except any that might be needed for critical FOUC prevention - will be handled in Plan 01-05)
    
    6. Test that module loading works by checking console for "Portfolio app initialized" message
    
    Note: Theme persistence code will be added in Plan 01-03 via inline script in <head> to prevent FOUC.
  </action>
  <verify>
    Run: grep -c "<script" index.html && grep -c "type=\"module\"" index.html
    Expect: Script tags present, at least one with type="module"
  </verify>
  <done>
    index.html loads js/app.js as ES module, inline script removed, all JS functionality externalized
  </done>
</task>

</tasks>

<verification>
1. All four JS files exist in js/ directory
2. index.html loads js/app.js as ES module
3. Command palette works (Ctrl+Shift+P opens it)
4. Fuzzy search works in palette
5. Vim mode works (toggle via palette, then j/k/G/gg navigation)
6. Typewriter animation runs in hero
7. Reveal animations work on scroll
8. Cursor glow follows mouse
9. No console errors
</verification>

<success_criteria>
- JavaScript successfully extracted into 4 organized files per architecture
- DATA array externalized to data.js (data-driven architecture achieved)
- ES6 modules used with proper import/export (modern JS patterns)
- All existing functionality preserved: palette, vim, typewriter, reveal, cursor glow
- index.html is clean with no inline JavaScript
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-02-SUMMARY.md`
</output>
