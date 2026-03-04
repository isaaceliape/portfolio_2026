---
phase: 01-foundation
plan: 05
type: execute
wave: 4
depends_on:
  - "01-foundation-01"
  - "01-foundation-03"
  - "01-foundation-04"
files_modified:
  - css/layout.css
  - css/components.css
  - index.html
autonomous: true
must_haves:
  truths:
    - Portfolio displays correctly at 375px, 768px, and 1920px widths
    - No horizontal scrolling at any viewport size
    - Touch targets minimum 44px on mobile
    - Typography remains readable at all sizes
    - Layout adapts gracefully (desktop-first approach)
  artifacts:
    - path: "css/layout.css"
      provides: "Responsive breakpoints and mobile styles"
      contains: ["@media (max-width: 640px)", "@media (max-width: 1024px)"]
    - path: "css/components.css"
      provides: "Component responsive adjustments"
      contains: ["grid-template-columns", "flex-wrap"]
  key_links:
    - from: "css/layout.css"
      to: "responsive behavior"
      via: "media queries"
      pattern: "@media.*max-width"
---

<objective>
Implement responsive design with desktop-first approach, ensuring portfolio works flawlessly from 375px mobile to 1920px desktop. Update breakpoints to 640px (mobile) and 1024px (tablet) per user decisions.

Purpose: Achieve FOUND-01 (responsive on mobile/tablet/desktop) per user locked decisions.
Output: Fully responsive portfolio with graceful degradation from desktop to mobile.
</objective>

<execution_context>
@/Users/isaaceliape/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/isaaceliape/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@/Users/isaaceliape/repos/portfolio_2026/.planning/phases/01-foundation/01-foundation-01-SUMMARY.md
@/Users/isaaceliape/repos/portfolio_2026/.planning/phases/01-foundation/01-foundation-04-SUMMARY.md

## Current Responsive State

From original index.html CSS (lines 725-738):
```css
@media (max-width: 620px) {
  nav {
    padding: 0.7rem 1rem;
  }
  section {
    padding: 4rem 1rem;
  }
  .projects-grid {
    grid-template-columns: 1fr;
  }
  .ascii {
    display: none;
  }
}
```

This was extracted to css/layout.css in Plan 01-01.

## User Locked Decisions

- **Design approach:** Desktop-first (existing portfolio is desktop-optimized)
- **Breakpoints:** 640px (mobile) and 1024px (tablet) - per user decision (standard)
- **Minimum screen:** 375px (iPhone standard)
- **Testing method:** Browser DevTools (Chrome device emulator)

## Responsive Strategy

**Desktop-first approach:**
1. Default styles = Desktop (no media query)
2. @media (max-width: 1024px) = Tablet adjustments
3. @media (max-width: 640px) = Mobile adjustments (updated from 620px)

**Key areas to address:**
- Navigation (may need hamburger or adjusted layout)
- Hero section (ASCII art already hidden on mobile ✓)
- Projects grid (already stacks on mobile ✓)
- Contact section
- Typography scaling
- Touch target sizes (44px minimum)
- Container padding
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update responsive breakpoints to 640px/1024px</name>
  <files>css/layout.css</files>
  <action>
    Refine responsive breakpoints in css/layout.css:
    
    1. Update existing 620px breakpoint to 640px:
       Change `@media (max-width: 620px)` to `@media (max-width: 640px)`
       
    2. Keep existing mobile styles and add improvements:
       ```css
       @media (max-width: 640px) {
         /* Navigation */
         nav {
           padding: 0.7rem 1rem;
         }
         
         /* Sections */
         section {
           padding: 4rem 1rem;
         }
         
         /* Projects grid - stack to single column */
         .projects-grid {
           grid-template-columns: 1fr;
           gap: 0.875rem;
         }
         
         /* Hide ASCII art on small screens */
         .ascii {
           display: none;
         }
         
         /* ADDITIONAL MOBILE IMPROVEMENTS */
         
         /* Adjust hero for mobile */
         #hero {
           min-height: auto;
           padding-top: 4rem;
           padding-bottom: 3rem;
         }
         
         /* Smaller hero buttons */
         .hero-btns {
           flex-direction: column;
           gap: 0.75rem;
         }
         
         .cli-btn {
           width: 100%;
           text-align: center;
         }
         
         /* Adjust terminal font size */
         .term-body {
           padding: 1rem;
         }
         
         /* Contact rows full width */
         .contact-row {
           flex-wrap: wrap;
           gap: 0.5rem;
         }
         
         .contact-row .lbl {
           width: auto;
           font-weight: 500;
         }
       }
       ```
    
    3. Add tablet breakpoint at 1024px:
       ```css
       @media (max-width: 1024px) {
         /* Tablet adjustments */
         section {
           padding: 5rem 1.5rem;
         }
         
         /* Projects - 2 columns but tighter */
         .projects-grid {
           gap: 0.875rem;
         }
         
         /* Navigation adjustments if needed */
         .nav-links {
           gap: 1.5rem;
         }
         
         /* Slightly smaller ASCII art */
         .ascii {
           font-size: clamp(0.35rem, 1.5vw, 0.6rem);
         }
       }
       ```
    
    4. Ensure 375px minimum works:
       Add specific adjustments if needed for very small screens:
       ```css
       @media (max-width: 375px) {
         /* Micro-mobile adjustments */
         .nav-logo {
           font-size: 0.75rem;
         }
         
         .nav-links a {
           font-size: 0.7rem;
         }
         
         /* Hide palette shortcut text, keep just icon */
         .kbd-hint {
           font-size: 0;
           padding: 0.3rem;
         }
         
         .kbd-hint::before {
           content: "⌘";
           font-size: 0.8rem;
         }
       }
       ```
  </action>
  <verify>
    Run: grep -n "@media" css/layout.css
    Expect: Shows 3 media queries: 1024px, 640px, 375px
  </verify>
  <done>
    css/layout.css has 3 breakpoints: 1024px (tablet), 640px (mobile), 375px (minimum) with appropriate adjustments
  </done>
</task>

<task type="auto">
  <name>Task 2: Ensure minimum touch target sizes (44px)</name>
  <files>css/components.css</files>
  <action>
    Ensure all interactive elements meet 44px minimum touch target:
    
    1. Navigation links:
       ```css
       .nav-links a {
         min-height: 44px;
         display: flex;
         align-items: center;
         padding: 0.25rem 0.5rem;
       }
       ```
    
    2. Palette button:
       ```css
       .kbd-hint {
         min-height: 44px;
         min-width: 44px;
         display: flex;
         align-items: center;
         justify-content: center;
       }
       ```
    
    3. Theme toggle button:
       ```css
       .theme-toggle {
         min-height: 44px;
         min-width: 44px;
         display: flex;
         align-items: center;
         justify-content: center;
       }
       ```
    
    4. CLI buttons:
       ```css
       .cli-btn {
         min-height: 44px;
         padding: 0.5rem 1.1rem;
       }
       ```
    
    5. Project cards (if clickable):
       ```css
       .proj {
         /* Already has padding, but ensure clickable area */
       }
       
       .proj-link {
         min-height: 44px;
         display: inline-flex;
         align-items: center;
       }
       ```
    
    6. Contact rows:
       ```css
       .contact-row {
         min-height: 44px;
       }
       ```
    
    7. Palette items:
       ```css
       .pal-item {
         min-height: 44px;
       }
       ```
    
    8. Add visual spacing for mobile touch:
       ```css
       @media (max-width: 640px) {
         /* Increase spacing between touch targets */
         .projects-grid {
           gap: 1rem; /* Larger gap for mobile touch */
         }
         
         .contact-grid {
           gap: 0.75rem;
         }
       }
       ```
  </action>
  <verify>
    Use DevTools device emulator, inspect interactive elements, verify computed height/width >= 44px
  </verify>
  <done>
    All interactive elements have minimum 44px touch target size
  </done>
</task>

<task type="auto">
  <name>Task 3: Optimize typography for mobile readability</name>
  <files>css/base.css, css/layout.css</files>
  <action>
    Ensure typography remains readable at all viewport sizes:
    
    1. Fluid typography using clamp():
       Current body font-size is fixed at 14px. Consider fluid sizing:
       ```css
       body {
         font-size: clamp(13px, 0.8vw + 11px, 16px);
       }
       ```
       Or keep 14px minimum for consistency.
    
    2. Adjust for mobile:
       ```css
       @media (max-width: 640px) {
         body {
           font-size: 13px;
           line-height: 1.6;
         }
         
         /* Larger text for readability */
         .output p {
           font-size: 0.9rem;
         }
         
         .proj-desc {
           font-size: 0.85rem;
         }
         
         /* Ensure headings don't get too small */
         /* If h1/h2 exist, ensure minimum sizes */
       }
       ```
    
    3. Prevent text overflow:
       ```css
       body {
         overflow-x: hidden;
         word-wrap: break-word;
       }
       
       pre, code {
         overflow-x: auto;
         max-width: 100%;
       }
       ```
    
    4. Ensure line length remains readable (45-75 characters):
       Current max-width: 860px on sections is good.
       On mobile, the narrower width automatically limits line length.
    
    5. Check project tags don't overflow:
       ```css
       .proj-tags {
         flex-wrap: wrap;
       }
       ```
  </action>
  <verify>
    View at 375px width - text should be readable without zooming
  </verify>
  <done>
    Typography scales appropriately, minimum 13px on mobile, text remains readable without horizontal scrolling
  </done>
</task>

<task type="auto">
  <name>Task 4: Handle navigation for mobile viewports</name>
  <files>css/components.css, js/app.js, index.html</files>
  <action>
    Ensure navigation works well on mobile:
    
    1. Current navigation might be too wide for mobile.
       Check if it needs adjustment at 375px.
    
    2. If nav is too wide, options:
       a) Hide some nav items on smallest screens
       b) Stack navigation vertically
       c) Use a hamburger menu (more complex)
    
    3. Conservative approach - adjust spacing:
       ```css
       @media (max-width: 640px) {
         nav {
           padding: 0.6rem 0.75rem;
         }
         
         .nav-logo {
           font-size: 0.8rem;
         }
         
         .nav-links {
           gap: 0.75rem;
         }
         
         .nav-links a {
           font-size: 0.7rem;
           padding: 0.2rem;
         }
         
         /* Hide keyboard hint text on mobile */
         .kbd-hint {
           display: none;
         }
       }
       ```
    
    4. For 375px, may need to further reduce:
       ```css
       @media (max-width: 375px) {
         .nav-links {
           gap: 0.5rem;
         }
         
         .nav-links a {
           font-size: 0.65rem;
         }
       }
       ```
    
    5. Alternative: Show only icons in nav on very small screens
       (Would require adding icons, skip for now unless needed)
    
    6. Ensure theme toggle remains visible and usable on all sizes.
  </action>
  <verify>
    Test navigation at 375px - all items should be visible and clickable
  </verify>
  <done>
    Navigation adapts to mobile, all items accessible, theme toggle visible, no overflow
  </done>
</task>

<task type="auto">
  <name>Task 5: Test and document responsive behavior</name>
  <files>index.html (add meta tags if needed)</files>
  <action>
    Final responsive optimizations and documentation:
    
    1. Verify viewport meta tag exists:
       ```html
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       ```
       (Already present in index.html)
    
    2. Add theme-color meta for mobile browsers:
       ```html
       <meta name="theme-color" content="#0c0c0c" media="(prefers-color-scheme: dark)" />
       <meta name="theme-color" content="#f9f9fb" media="(prefers-color-scheme: light)" />
       ```
    
    3. Test common device sizes in DevTools:
       - iPhone SE (375px)
       - iPhone 12/13/14 (390px)
       - Pixel 5 (393px)
       - iPad Mini (768px)
       - iPad Pro (1024px)
       - Desktop (1440px, 1920px)
    
    4. Document breakpoints in CSS comment:
       ```css
       /* Responsive Breakpoints (Desktop-first)
          - Desktop: default (1024px+)
          - Tablet: max-width 1024px
          - Mobile: max-width 640px
          - Minimum: max-width 375px (iPhone SE)
       */
       ```
    
    5. Check for horizontal overflow:
       Add to base.css if not present:
       ```css
       html, body {
         overflow-x: hidden;
       }
       ```
    
    6. Verify images (if any) are responsive:
       ```css
       img {
         max-width: 100%;
         height: auto;
       }
       ```
  </action>
  <verify>
    Run through DevTools device emulator at all key sizes, verify no horizontal scrollbars
  </verify>
  <done>
    Responsive design tested at 375px, 640px, 768px, 1024px, and 1920px with no horizontal overflow
  </done>
</task>

</tasks>

<verification>
1. Test at 375px - layout works, no horizontal scroll
2. Test at 768px (tablet) - layout adapts
3. Test at 1920px (desktop) - full layout displayed
4. All interactive elements have 44px+ touch targets
5. Typography readable at all sizes
6. Navigation accessible on mobile
7. Projects grid stacks correctly on mobile
8. Theme toggle works at all sizes
</verification>

<success_criteria>
- Desktop-first responsive design implemented (per user decision)
- Breakpoints at 640px (mobile) and 1024px (tablet) per user decision
- Minimum 375px width support (iPhone SE) per user decision
- No horizontal scrolling at any viewport size
- All touch targets minimum 44px
- Typography remains readable on mobile
- FOUND-01 achieved: Responsive on mobile/tablet/desktop
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-05-SUMMARY.md`
</output>
