---
phase: 01-foundation
plan: 04
type: execute
wave: 3
depends_on:
  - "01-foundation-01"
  - "01-foundation-02"
files_modified:
  - index.html
  - css/base.css
  - css/components.css
autonomous: true
must_haves:
  truths:
    - All interactive elements have visible focus indicators
    - User can navigate entire page using only Tab key
    - prefers-reduced-motion disables animations
    - ARIA labels present on navigation, buttons, and command palette
    - Color contrast meets WCAG 2.1 AA standards
  artifacts:
    - path: "index.html"
      provides: "ARIA labels, semantic HTML improvements"
      contains: ["aria-label", "role=", "aria-modal"]
    - path: "css/base.css"
      provides: "Focus styles and reduced-motion support"
      contains: [":focus-visible", "prefers-reduced-motion"]
  key_links:
    - from: "css/base.css"
      to: "focus indicators"
      via: ":focus-visible selector"
      pattern: ":focus-visible"
---

<objective>
Implement full WCAG 2.1 AA accessibility baseline: keyboard navigation, visible focus indicators, ARIA labels, prefers-reduced-motion support, and semantic HTML improvements.

Purpose: Achieve FOUND-03 (semantic HTML with accessibility) per user locked decisions (full WCAG 2.1 AA, styled focus, ARIA labels).
Output: Accessible portfolio with keyboard support, screen reader compatibility, and motion preferences respected.
</objective>

<execution_context>
@/Users/isaaceliape/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/isaaceliape/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@/Users/isaaceliape/repos/portfolio_2026/.planning/phases/01-foundation/01-foundation-01-SUMMARY.md
@/Users/isaaceliape/repos/portfolio_2026/.planning/phases/01-foundation/01-foundation-02-SUMMARY.md
@/Users/isaaceliape/repos/portfolio_2026/.planning/phases/01-foundation/01-foundation-03-SUMMARY.md

## Current Accessibility State

From analysis of index.html:

**Already good:**
- Semantic HTML: nav, section, footer elements present
- Command palette has role="dialog" and aria-modal="true"
- aria-label on palette overlay
- lang="en" on html element
- viewport meta tag present

**Needs improvement:**
- No visible focus indicators (relying on browser defaults)
- Missing ARIA labels on navigation links and buttons
- No skip-to-content link
- prefers-reduced-motion not implemented
- Some interactive elements may not be keyboard accessible
- Heading hierarchy needs verification

## WCAG 2.1 AA Requirements

**Per user decision: Full WCAG 2.1 AA compliance**

Key requirements to implement:
1. **Keyboard Accessible (2.1.1, 2.1.2)**: All functionality available via keyboard
2. **No Keyboard Trap (2.1.2)**: Can Tab through all elements
3. **Focus Visible (2.4.7)**: Visible focus indicators on all interactive elements
4. **Focus Order (2.4.3)**: Logical tab order
5. **Bypass Blocks (2.4.1)**: Skip link to main content
6. **Reduced Motion (2.3.3)**: Respect prefers-reduced-motion
7. **Label in Name (2.5.3)**: Interactive elements have accessible names
8. **Contrast Minimum (1.4.3)**: 4.5:1 for normal text, 3:1 for large text

## User Locked Decisions

- **Focus indicators:** Styled to match design (not browser default)
- **Motion preferences:** Yes — support prefers-reduced-motion
- **ARIA:** Add ARIA labels/roles to essential interactive elements (nav, buttons, forms)
- **Compliance:** Full WCAG 2.1 AA
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add focus-visible styles to CSS</name>
  <files>css/base.css</files>
  <action>
    Add comprehensive focus styles to css/base.css:
    
    1. Global focus-visible style (matching accent color):
       ```css
       /* Focus indicators - styled to match design */
       :focus-visible {
         outline: 2px solid var(--accent);
         outline-offset: 2px;
       }
       
       /* Remove default outline for mouse users, keep for keyboard */
       :focus:not(:focus-visible) {
         outline: none;
       }
       ```
    
    2. Specific focus styles for interactive elements:
       ```css
       /* Links */
       a:focus-visible {
         outline: 2px solid var(--accent);
         outline-offset: 2px;
         border-radius: 2px;
       }
       
       /* Buttons */
       button:focus-visible {
         outline: 2px solid var(--accent);
         outline-offset: 3px;
       }
       
       /* Form inputs (if any added later) */
       input:focus-visible,
       textarea:focus-visible {
         outline: 2px solid var(--accent);
         outline-offset: 1px;
       }
       ```
    
    3. Ensure focus is visible on all current interactive elements:
       - Navigation links
       - Command palette button (.kbd-hint)
       - Theme toggle button
       - Project card links
       - Contact row links
       - Palette items
       - Footer links
    
    4. Add high-contrast mode support:
       ```css
       @media (prefers-contrast: high) {
         :focus-visible {
           outline: 3px solid var(--accent);
           outline-offset: 2px;
         }
       }
       ```
  </action>
  <verify>
    Run: grep -c ":focus-visible" css/base.css
    Expect: At least 5+ focus-visible rules defined
  </verify>
  <done>
    css/base.css contains styled focus-visible rules for all interactive elements, using accent color with 2px outline
  </done>
</task>

<task type="auto">
  <name>Task 2: Implement prefers-reduced-motion support</name>
  <files>css/base.css, js/animations.js</files>
  <action>
    Add reduced motion support per user decision:
    
    1. Add to css/base.css:
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
         
         /* Keep essential transitions for theme changes */
         html[data-theme],
         html[data-theme] * {
           transition-duration: 0.01ms !important;
         }
       }
       ```
    
    2. Update js/animations.js to respect prefers-reduced-motion:
       ```javascript
       // Check if user prefers reduced motion
       export function prefersReducedMotion() {
         return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
       }
       
       // Update init functions to check this
       export function initRevealAnimations() {
         if (prefersReducedMotion()) {
           // Make all reveal elements visible immediately
           document.querySelectorAll('.reveal').forEach(el => {
             el.classList.add('visible');
           });
           return;
         }
         
         // Normal IntersectionObserver setup...
       }
       
       export function initTypewriter() {
         if (prefersReducedMotion()) {
           // Show first line immediately without animation
           const twEl = document.getElementById('tw');
           if (twEl) twEl.textContent = 'ls projects/';
           return;
         }
         
         // Normal typewriter animation...
       }
       ```
    
    3. Update cursor glow initialization:
       ```javascript
       export function initCursorGlow() {
         if (prefersReducedMotion()) {
           // Hide cursor glow for reduced motion preference
           const glowEl = document.getElementById('cursor-glow');
           if (glowEl) glowEl.style.display = 'none';
           return;
         }
         // Normal cursor glow setup...
       }
       ```
  </action>
  <verify>
    Run: grep -c "prefers-reduced-motion" css/base.css && grep -c "prefersReducedMotion" js/animations.js
    Expect: CSS has media query, JS has function checks
  </verify>
  <done>
    prefers-reduced-motion media query in CSS disables animations, JS checks and provides fallbacks for all animated features
  </done>
</task>

<task type="auto">
  <name>Task 3: Add ARIA labels and semantic improvements to HTML</name>
  <files>index.html</files>
  <action>
    Enhance index.html with ARIA labels and semantic improvements:
    
    1. Add skip-to-content link (first focusable element):
       ```html
       <!-- Skip to main content for keyboard users -->
       <a href="#main-content" class="skip-link">Skip to main content</a>
       ```
       Place this immediately after <body> opening tag.
    
    2. Style the skip link in css/components.css:
       ```css
       .skip-link {
         position: absolute;
         top: -40px;
         left: 0;
         background: var(--accent);
         color: var(--bg);
         padding: 8px;
         text-decoration: none;
         z-index: 10000;
         transition: top 0.2s;
       }
       
       .skip-link:focus {
         top: 0;
       }
       ```
    
    3. Add main content wrapper:
       Wrap all sections after nav in:
       ```html
       <main id="main-content">
         <!-- all sections -->
       </main>
       ```
    
    4. Enhance navigation with ARIA:
       ```html
       <nav aria-label="Main navigation">
         <!-- existing content -->
       </nav>
       ```
    
    5. Add ARIA labels to navigation links:
       ```html
       <a href="#about" aria-label="Go to About section">about</a>
       <a href="#projects" aria-label="Go to Projects section">projects</a>
       <a href="#contact" aria-label="Go to Contact section">contact</a>
       ```
    
    6. Update command palette button:
       ```html
       <span 
         class="kbd-hint" 
         id="nav-palette-btn"
         role="button"
         tabindex="0"
         aria-label="Open command palette"
       >
         ⌘ Ctrl+Shift+P
       </span>
       ```
       Note: Add keyboard handler (Enter/Space) for this span in app.js.
    
    7. Add region labels to sections:
       ```html
       <section id="hero" aria-label="Introduction">
       <section id="about" aria-label="About">
       <section id="projects" aria-label="Projects">
       <section id="contact" aria-label="Contact">
       ```
    
    8. Update footer:
       ```html
       <footer role="contentinfo">
         <!-- existing content -->
       </footer>
       ```
    
    9. Verify heading hierarchy (h1 > h2 > h3):
       - Ensure one h1 per page (likely in hero)
       - Logical heading order throughout
    
    10. Add aria-live region for palette announcements (optional but good):
        ```html
        <div aria-live="polite" aria-atomic="true" class="sr-only" id="palette-announce"></div>
        ```
        With CSS:
        ```css
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        ```
  </action>
  <verify>
    Run: grep -c "aria-label" index.html && grep -c "role=" index.html
    Expect: Multiple ARIA labels (10+) and roles (5+) added
  </verify>
  <done>
    index.html has skip link, main landmark, nav aria-label, section aria-labels, button roles, and proper heading hierarchy
  </done>
</task>

<task type="auto">
  <name>Task 4: Ensure keyboard accessibility for all interactive elements</name>
  <files>js/app.js, index.html</files>
  <action>
    Fix any keyboard accessibility gaps:
    
    1. Add keyboard handler for palette button (kbd-hint span):
       In js/app.js, update the palette button listener:
       ```javascript
       const paletteBtn = document.getElementById("nav-palette-btn");
       if (paletteBtn) {
         paletteBtn.addEventListener("click", openPalette);
         paletteBtn.addEventListener("keydown", (e) => {
           if (e.key === "Enter" || e.key === " ") {
             e.preventDefault();
             openPalette();
           }
         });
       }
       ```
    
    2. Ensure project cards are keyboard accessible:
       Project cards with links - verify they use proper <a> elements (not divs with click handlers).
       
       If any project cards are not links, add:
       ```html
       <a href="..." class="proj-link" aria-label="View project: [name]"></a>
       ```
    
    3. Ensure contact rows are keyboard accessible:
       Contact rows should be <a> elements or have proper click + keyboard handlers.
       
    4. Add keyboard trap prevention for palette:
       Ensure Escape key closes palette (already implemented - verify working).
       Ensure Tab cycles within palette when open (focus trap).
       
       Add focus trap to palette:
       ```javascript
       function trapFocus(element) {
         const focusableElements = element.querySelectorAll(
           'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
         );
         const firstFocusable = focusableElements[0];
         const lastFocusable = focusableElements[focusableElements.length - 1];
         
         element.addEventListener('keydown', function(e) {
           if (e.key !== 'Tab') return;
           
           if (e.shiftKey) {
             if (document.activeElement === firstFocusable) {
               lastFocusable.focus();
               e.preventDefault();
             }
           } else {
             if (document.activeElement === lastFocusable) {
               firstFocusable.focus();
               e.preventDefault();
             }
           }
         });
       }
       ```
       Call trapFocus(overlay) when opening palette.
    
    5. Test Tab order:
       Expected order: Skip link → Nav links → Command palette button → Theme toggle → Hero buttons → About → Projects → Contact → Footer
  </action>
  <verify>
    Test manually: Open index.html, press Tab repeatedly, verify all interactive elements get focus
  </verify>
  <done>
    All interactive elements keyboard accessible, Tab order is logical, focus trap works in palette, Escape closes palette
  </done>
</task>

<task type="auto">
  <name>Task 5: Verify color contrast compliance</name>
  <files>css/base.css</files>
  <action>
    Verify and document color contrast ratios:
    
    1. Check current contrast ratios:
       - Dark theme: --text (#c8c8c8) on --bg (#0c0c0c) = ~7:1 ✓ (AA compliant, 4.5:1 required)
       - Light theme: --text (#2c2f3d) on --bg (#f9f9fb) = ~9:1 ✓
       - Accent on background: --accent (#00d4aa) on --bg (#0c0c0c) = ~4.8:1 ✓
       - Muted text: --muted (#555) on --bg (#0c0c0c) = ~3.2:1 (need to verify for large text)
    
    2. If any contrast issues found, adjust colors slightly while maintaining design:
       Only modify if ratios are below:
       - Normal text: 4.5:1
       - Large text (18pt+ or 14pt bold): 3:1
       - UI components: 3:1
    
    3. Document contrast in code comments:
       ```css
       /* Color contrast verified WCAG 2.1 AA:
          - Text on background: 7:1 (pass)
          - Accent on background: 4.8:1 (pass)
          - Links have underline on hover for additional distinction
       */
       ```
    
    4. Add underline on focus for links (in addition to outline):
       ```css
       a:focus-visible {
         outline: 2px solid var(--accent);
         outline-offset: 2px;
         text-decoration: underline;
       }
       ```
  </action>
  <verify>
    Use browser DevTools accessibility panel or online contrast checker on key color combinations
  </verify>
  <done>
    All color combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for text, 3:1 for large text/UI)
  </done>
</task>

</tasks>

<verification>
1. Tab through entire page - all interactive elements reachable
2. Focus indicators visible on all interactive elements (styled with accent color)
3. Skip link appears on first Tab press
4. Command palette opens with keyboard (Ctrl+Shift+P or Enter on palette button)
5. Escape closes palette
6. Enable prefers-reduced-motion in OS settings - animations disabled
7. Screen reader (VoiceOver/NVDA) announces page structure correctly
8. No color contrast warnings in accessibility tools
</verification>

<success_criteria>
- All interactive elements have visible focus indicators (styled, not browser default)
- User can navigate entire page using Tab key only (FOUND-03 achieved)
- prefers-reduced-motion disables all animations per user decision
- ARIA labels on navigation, buttons, sections, and palette
- Skip-to-content link provided
- Color contrast meets WCAG 2.1 AA standards
- Full WCAG 2.1 AA compliance achieved per user decision
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-04-SUMMARY.md`
</output>
