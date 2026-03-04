---
phase: 01-foundation
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - css/base.css
  - css/layout.css
  - css/components.css
  - index.html
autonomous: true
must_haves:
  truths:
    - CSS is separated into three logical files in css/ folder
    - index.html links to external CSS files instead of inline styles
    - Visual appearance matches original exactly
    - No inline style blocks remain in index.html (except critical CSS placeholder)
  artifacts:
    - path: "css/base.css"
      provides: "CSS variables, reset, typography, animations"
      min_lines: 100
    - path: "css/layout.css"
      provides: "Grid, flexbox, spacing, responsive breakpoints"
      min_lines: 150
    - path: "css/components.css"
      provides: "Buttons, cards, navigation, terminal, palette, project cards"
      min_lines: 300
  key_links:
    - from: "index.html"
      to: "css/base.css"
      via: "<link rel='stylesheet'>"
      pattern: "href=\"css/base.css\""
---

<objective>
Extract all inline CSS from index.html into three organized CSS files (base.css, layout.css, components.css) while preserving visual appearance exactly.

Purpose: Achieve TECH-01 (separated CSS files) and establish maintainable styling architecture.
Output: css/ directory with three CSS files, index.html updated with link tags.
</objective>

<execution_context>
@/Users/isaaceliape/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/isaaceliape/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@index.html (CSS section: lines 11-739)

## CSS Extraction Strategy

Current CSS structure in index.html:
1. **Reset/Base** (lines 11-35): Box-sizing, margins, CSS variables (:root)
2. **Theme variables** (lines 37-86): Dark/light theme definitions
3. **Typography/Base styles** (lines 88-120): html, body, a, scanline effect, cursor glow
4. **Navigation** (lines 139-206): Nav styles, logo, links, kbd hint
5. **Layout/Sections** (lines 208-214): Section padding, max-width
6. **Terminal component** (lines 216-299): Term blocks, prompts, output styling
7. **Hero section** (lines 300-368): ASCII art, typewriter, buttons, fade animations
8. **Reveal animations** (lines 370-392): Scroll-triggered reveals
9. **Projects grid** (lines 394-476): Grid layout, project cards
10. **Contact section** (lines 478-511): Contact rows
11. **Footer** (lines 513-526)
12. **Command palette** (lines 538-700): Full palette overlay and components
13. **Vim indicator** (lines 703-723)
14. **Mobile responsive** (lines 725-738): Single breakpoint at 620px

## Locked Decisions (from CONTEXT.md)
- File organization: css/base.css, css/layout.css, css/components.css
- Theme variables already defined in :root with data-theme support
- Keep existing color scheme and visual design exactly

## File Organization
- **base.css**: CSS variables (all :root), reset, typography, base animations (@keyframes)
- **layout.css**: Section layouts, grid systems, flex utilities, responsive breakpoints (640px, 1024px)
- **components.css**: Navigation, terminal, buttons, project cards, contact, palette, vim indicator
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create css/base.css with variables, reset, and typography</name>
  <files>css/base.css</files>
  <action>
    Create css/ directory if not exists, then create css/base.css containing:
    
    1. CSS Variables section (lines 20-86 from index.html):
       - All :root variables for dark theme (default)
       - @media (prefers-color-scheme: light) for system preference
       - [data-theme="light"] and [data-theme="dark"] attribute selectors
       - Keep exact color values: --bg: #0c0c0c, --accent: #00d4aa, etc.
    
    2. Reset/Base styles (lines 12-18, 88-106):
       - * { box-sizing, margin, padding }
       - html { scroll-behavior: smooth }
       - body { background, color, font-family, font-size, line-height, etc. }
       - a { color: inherit, text-decoration: none }
    
    3. Global effects (lines 107-137):
       - body::before scanline effect
       - #cursor-glow styles
    
    4. Keyframe animations (lines 157-165, 331-339, 527-536, 553-561):
       - @keyframes slideDown
       - @keyframes blink
       - @keyframes fadeUp
       - @keyframes palIn
    
    5. Reveal animation classes (lines 370-392):
       - .reveal, .reveal.visible
       - .d1, .d2, .d3, .d4 delay classes
    
    IMPORTANT: Preserve ALL color values exactly. Do NOT modify any CSS values.
    The goal is pure extraction, not refactoring.
  </action>
  <verify>
    Run: ls -la css/ && wc -l css/base.css
    Expect: css/base.css exists with ~150-200 lines
  </verify>
  <done>
    css/base.css exists containing all CSS variables, reset styles, global effects, keyframes, and reveal animation classes with exact values from original
  </done>
</task>

<task type="auto">
  <name>Task 2: Create css/layout.css with layout systems and responsive breakpoints</name>
  <files>css/layout.css</files>
  <action>
    Create css/layout.css containing:
    
    1. Section layout (lines 208-214):
       - section { padding, max-width, margin, position, z-index }
    
    2. Grid and flex utilities:
       - .projects-grid (lines 394-398): grid-template-columns, gap
       - .contact-grid (lines 478-482): flex-direction, gap
       - .hero-btns (lines 340-347): display flex, gap, flex-wrap
    
    3. Container patterns:
       - .term-body { padding } from terminal component
       - .output { padding-left, margin-bottom }
    
    4. Responsive breakpoints (desktop-first per user decision):
       - Default: Desktop styles (no media query)
       - @media (max-width: 1024px): Tablet adjustments
       - @media (max-width: 640px): Mobile adjustments (move content from existing 620px breakpoint, adjust to 640px per user decision)
       
       Specific mobile adjustments to include:
       - nav { padding: 0.7rem 1rem }
       - section { padding: 4rem 1rem }
       - .projects-grid { grid-template-columns: 1fr }
       - .ascii { display: none }
       - Add any other responsive improvements while preserving design
    
    5. Responsive improvements for 375px minimum (per user decision):
       - Ensure touch targets minimum 44px
       - Prevent horizontal overflow
       - Ensure text remains readable at small sizes
  </action>
  <verify>
    Run: wc -l css/layout.css && grep -c "@media" css/layout.css
    Expect: File exists with ~100-150 lines, contains 2-3 media query blocks
  </verify>
  <done>
    css/layout.css exists with section layouts, grid/flex patterns, and responsive breakpoints at 640px and 1024px (desktop-first), supporting 375px minimum width
  </done>
</task>

<task type="auto">
  <name>Task 3: Create css/components.css with all UI components</name>
  <files>css/components.css</files>
  <action>
    Create css/components.css containing all component styles:
    
    1. Navigation (lines 139-206):
       - nav { fixed positioning, flex layout, backdrop blur }
       - .nav-logo, .nav-logo span
       - .nav-links, .nav-links a, .nav-links a::before, .nav-links a:hover
       - .kbd-hint and .kbd-hint:hover
    
    2. Terminal component (lines 216-299):
       - .term, .term-bar, .dot, .dot-r, .dot-y, .dot-g
       - .term-title, .term-body
       - .prompt, .ps1 (and child spans: .user, .sep, .dir)
       - .cmd, .output, .output p and modifier classes (.hl, .acc, .acc2, .wrn)
    
    3. Hero section components (lines 300-368):
       - #hero { min-height, flex layout }
       - .ascii { font-size, line-height, animation }
       - .hero-term { animation }
       - .typewriter-cursor { animation }
       - .cli-btn and .cli-btn:hover, .cli-btn::before
    
    4. Project cards (lines 400-476):
       - .proj and all hover states
       - .proj::before gradient line
       - .proj-name, .proj-name::before
       - .proj-desc, .proj-tags, .proj-tag
       - .proj-link, .proj-link:hover
    
    5. Contact section (lines 484-511):
       - .contact-row and hover states
       - .contact-row .lbl, .contact-row .val
    
    6. Footer (lines 513-526)
    
    7. Command palette (lines 538-700):
       - #palette-overlay and .open state
       - #palette
       - #palette-header, .pal-icon, #palette-input
       - #palette-shortcut
       - #palette-results, .pal-section-label
       - .pal-item and all states (.active, :hover)
       - .pal-item-icon, .pal-item-body, .pal-item-title
       - .pal-item-sub, .pal-item-badge
       - #palette-footer, .pal-hint
       - kbd styling
       - mark styling for search highlights
    
    8. Vim indicator (lines 703-723):
       - #vim-indicator
    
    IMPORTANT: Include all transition properties for theme switching (0.3s transitions on color-related properties).
  </action>
  <verify>
    Run: wc -l css/components.css
    Expect: File exists with ~400-500 lines
  </verify>
  <done>
    css/components.css exists with all component styles: navigation, terminal, hero, projects, contact, palette, and vim indicator with exact styling from original
  </done>
</task>

<task type="auto">
  <name>Task 4: Update index.html to reference external CSS files</name>
  <files>index.html</files>
  <action>
    Update index.html head section:
    
    1. Remove inline style block (lines 11-739) completely
    
    2. Add link tags in this order (base first for variables):
       ```html
       <link rel="stylesheet" href="css/base.css" />
       <link rel="stylesheet" href="css/layout.css" />
       <link rel="stylesheet" href="css/components.css" />
       ```
    
    3. Keep the Google Fonts link (lines 7-10) - do not modify
    
    4. Leave a placeholder comment for critical CSS (for Plan 01-05):
       ```html
       <!-- Critical CSS will be inlined here in Plan 01-05 -->
       ```
    
    5. Ensure proper HTML structure is maintained
    
    6. Verify no style attribute remains on any element (search for `style=`)
    
    7. Do NOT remove JavaScript section yet (handled in Plan 01-02)
  </action>
  <verify>
    Run: grep -c "<style" index.html && grep -c "css/base.css" index.html
    Expect: <style count = 0 (or 1 if keeping critical placeholder), css/base.css count >= 1
  </verify>
  <done>
    index.html no longer contains inline CSS (except placeholder), links to css/base.css, css/layout.css, and css/components.css in correct order
  </done>
</task>

</tasks>

<verification>
1. All three CSS files exist in css/ directory
2. index.html references external CSS files, not inline styles
3. Opening index.html in browser shows identical visual appearance to original
4. No console errors related to missing CSS
5. Responsive behavior works (test by resizing browser)
</verification>

<success_criteria>
- CSS successfully extracted into 3 organized files per user decision
- index.html links to external CSS instead of inline styles
- Visual appearance preserved exactly (no visual regressions)
- File structure: css/base.css, css/layout.css, css/components.css
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-01-SUMMARY.md`
</output>
