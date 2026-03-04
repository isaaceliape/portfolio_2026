---
phase: 01-foundation
plan: 06
type: execute
wave: 5
depends_on:
  - "01-foundation-01"
  - "01-foundation-02"
  - "01-foundation-03"
  - "01-foundation-04"
  - "01-foundation-05"
files_modified:
  - index.html
  - css/base.css
  - js/app.js
autonomous: false
must_haves:
  truths:
    - Page loads in under 3 seconds on simulated 4G
    - Lighthouse performance score 90+
    - First Contentful Paint under 1.8s
    - Largest Contentful Paint under 2.5s
    - Cumulative Layout Shift under 0.1
    - No render-blocking resources
  artifacts:
    - path: "index.html"
      provides: "Critical CSS inlined, async loading for non-critical"
      contains: ["media='print'", "onload="]
    - path: "Lighthouse report"
      provides: "Performance audit results"
      score: ">= 90"
  key_links:
    - from: "index.html head"
      to: "css files"
      via: "async loading pattern"
      pattern: "rel=.*stylesheet.*media.*print"
---

<objective>
Optimize portfolio for fast loading: inline critical CSS, load non-critical resources asynchronously, and achieve Lighthouse 90+ score. Target under 3 seconds on 4G.

Purpose: Achieve FOUND-04 (fast load, Lighthouse 90+) and ensure all prior work integrates correctly.
Output: Performance-optimized portfolio with excellent Core Web Vitals scores.
</objective>

<execution_context>
@/Users/isaaceliape/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/isaaceliape/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@/Users/isaaceliape/repos/portfolio_2026/.planning/phases/01-foundation/01-foundation-01-SUMMARY.md
@/Users/isaaceliape/repos/portfolio_2026/.planning/phases/01-foundation/01-foundation-02-SUMMARY.md
@/Users/isaaceliape/repos/portfolio_2026/.planning/phases/01-foundation/01-foundation-03-SUMMARY.md
@/Users/isaaceliape/repos/portfolio_2026/.planning/phases/01-foundation/01-foundation-04-SUMMARY.md
@/Users/isaaceliape/repos/portfolio_2026/.planning/phases/01-foundation/01-foundation-05-SUMMARY.md

## Current Performance State

Portfolio is lightweight (single HTML file becoming multiple files):
- No external images (all CSS/text based)
- Single Google Fonts request
- No JavaScript frameworks
- Expected to perform well already

## Performance Targets (FOUND-04)

**Lighthouse 90+ in all categories:**
- Performance: 90+
- Accessibility: 90+ (should be 100 with our WCAG AA work)
- Best Practices: 90+
- SEO: 90+

**Core Web Vitals:**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.8s

**Load time:** < 3 seconds on 4G connection

## Optimization Strategy

1. **Inline Critical CSS:** CSS needed for above-the-fold content
2. **Async Load Non-Critical CSS:** layout.css, components.css
3. **Preload Key Resources:** Google Fonts
4. **Defer Non-Critical JS:** If any
5. **Font Display Swap:** Prevent invisible text during font load
6. **Minimize Reflows:** Stable layout from start

## Critical CSS (to inline)

Must have immediately for first paint:
- CSS variables (all :root)
- Base reset styles
- Navigation styles (fixed header)
- Hero section basic layout
- Theme FOUC prevention
- Font face definition (if self-hosting, but we're using Google)

Non-critical (can load async):
- Projects grid styles
- Contact section styles  
- Detailed component hover states
- Animation keyframes (except hero fade-in)
- Command palette styles (below fold initially)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Inline critical CSS in index.html head</name>
  <files>index.html</files>
  <action>
    Inline critical CSS to prevent FOUC and improve FCP:
    
    1. In index.html <head>, after FOUC prevention script, add:
       ```html
       <!-- Critical CSS - inlined for fast first paint -->
       <style>
         /* CSS Variables (needed for theming immediately) */
         :root {
           --bg: #0c0c0c;
           --surface: #111;
           --surface2: #161616;
           --border: #1e1e1e;
           --border-bright: #2e2e2e;
           --text: #c8c8c8;
           --muted: #555;
           --accent: #00d4aa;
           --accent2: #7c6af7;
           --warn: #e5a84b;
           --err: #e06c75;
           --term-bar: #161616;
           --scanline: rgba(0, 0, 0, 0.04);
           --glow-color: rgba(0, 212, 170, 0.05);
         }
         
         /* Light theme variables */
         @media (prefers-color-scheme: light) {
           :root:not([data-theme]) {
             --bg: #f9f9fb;
             --surface: #ffffff;
             --surface2: #f0f1f5;
             --border: #dde0ea;
             --border-bright: #c8ccd8;
             --text: #2c2f3d;
             --muted: #8b90a8;
             --accent: #008ec4;
             --accent2: #7c5af5;
             --warn: #da6800;
             --err: #d43552;
             --term-bar: #e8eaf0;
             --scanline: rgba(0, 0, 0, 0.015);
             --glow-color: rgba(0, 142, 196, 0.06);
           }
         }
         
         /* Base reset */
         *, *::before, *::after {
           box-sizing: border-box;
           margin: 0;
           padding: 0;
         }
         
         html {
           scroll-behavior: smooth;
         }
         
         body {
           background: var(--bg);
           color: var(--text);
           font-family: "JetBrains Mono", "Fira Code", monospace;
           font-size: 14px;
           line-height: 1.7;
           -webkit-font-smoothing: antialiased;
           overflow-x: hidden;
         }
         
         a {
           color: inherit;
           text-decoration: none;
         }
         
         /* Critical navigation styles */
         nav {
           position: fixed;
           top: 0;
           left: 0;
           right: 0;
           z-index: 100;
           display: flex;
           align-items: center;
           justify-content: space-between;
           padding: 0.8rem 2rem;
           background: color-mix(in srgb, var(--bg) 88%, transparent);
           backdrop-filter: blur(12px);
           border-bottom: 1px solid var(--border);
         }
         
         /* Critical hero styles */
         #hero {
           min-height: 100vh;
           display: flex;
           flex-direction: column;
           justify-content: center;
           padding: 5rem 2rem 2rem;
           max-width: 860px;
           margin: 0 auto;
         }
         
         section {
           padding: 6rem 2rem;
           max-width: 860px;
           margin: 0 auto;
         }
       </style>
       ```
    
    2. This ensures first paint has proper styling without waiting for external CSS.
    
    3. Keep external CSS links below this inline style, they will override/extend.
  </action>
  <verify>
    Run: grep -c "Critical CSS" index.html
    Expect: Inline critical CSS block present in head
  </verify>
  <done>
    Critical CSS inlined in index.html head: variables, reset, navigation, hero, and section base styles
  </done>
</task>

<task type="auto">
  <name>Task 2: Load non-critical CSS asynchronously</name>
  <files>index.html</files>
  <action>
    Optimize CSS loading to prevent render blocking:
    
    1. Update CSS link tags to load asynchronously:
       ```html
       <!-- Non-critical CSS loaded asynchronously -->
       <link rel="preload" href="css/base.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
       <link rel="preload" href="css/layout.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
       <link rel="preload" href="css/components.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
       
       <noscript>
         <link rel="stylesheet" href="css/base.css" />
         <link rel="stylesheet" href="css/layout.css" />
         <link rel="stylesheet" href="css/components.css" />
       </noscript>
       ```
    
    2. Add preload polyfill for older browsers (inline in head):
       ```html
       <script>
         /*! CSS rel=preload polyfill */
         (function() {
           var css = document.querySelectorAll('link[rel="preload"][as="style"]');
           css.forEach(function(link) {
             link.addEventListener('load', function() {
               this.rel = 'stylesheet';
             });
           });
         })();
       </script>
       ```
    
    3. Alternative simpler approach (if preload seems too complex):
       ```html
       <link rel="stylesheet" href="css/base.css" media="print" onload="this.media='all'" />
       <link rel="stylesheet" href="css/layout.css" media="print" onload="this.media='all'" />
       <link rel="stylesheet" href="css/components.css" media="print" onload="this.media='all'" />
       ```
       
       Use the simpler media="print" approach for clarity and broad compatibility.
    
    4. Order of resources in head should be:
       - Meta charset/viewport
       - Title
       - Preconnect to Google Fonts (optional optimization)
       - Google Fonts with display=swap
       - FOUC prevention script
       - Critical CSS (inline)
       - Async CSS links (media="print" technique)
  </action>
  <verify>
    Run: grep "media=\"print\"" index.html
    Expect: All 3 CSS files loaded with media="print" onload pattern
  </verify>
  <done>
    Non-critical CSS files load asynchronously using media="print" technique with onload handler
  </done>
</task>

<task type="auto">
  <name>Task 3: Optimize font loading with font-display swap</name>
  <files>index.html</files>
  <action>
    Ensure fonts don't block rendering:
    
    1. Check Google Fonts URL includes display=swap:
       Current: `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap`
       
       If not present, add `&display=swap` to the URL.
       
       This tells browser to use fallback font immediately, swap to JetBrains Mono when loaded.
    
    2. Add preconnect for faster font loading:
       ```html
       <link rel="preconnect" href="https://fonts.googleapis.com" />
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
       ```
       Place these before the Google Fonts link.
    
    3. Add font-display: swap to @font-face if self-hosting fonts (we're using Google, so this is automatic).
    
    4. Consider system font stack fallback for even faster initial paint:
       Already have: `"JetBrains Mono", "Fira Code", monospace`
       This is good - monospace is the ultimate fallback.
  </action>
  <verify>
    Run: grep "display=swap" index.html && grep "preconnect" index.html
    Expect: Google Fonts URL has display=swap, preconnect links present
  </verify>
  <done>
    Fonts load with display=swap, preconnect hints added for faster font loading
  </done>
</task>

<task type="auto">
  <name>Task 4: Minimize layout shifts (CLS optimization)</name>
  <files>index.html, css/base.css</files>
  <action>
    Ensure layout is stable from initial render:
    
    1. Set explicit dimensions on key elements:
       - Hero section: min-height: 100vh (already set)
       - Navigation: explicit height prevents shift when content loads
       
    2. Add explicit size to prevent font loading shift:
       The monospace font stack should minimize this, but ensure:
       ```css
       body {
         /* Already set, but verify font-size is in px not relative units that might shift */
         font-size: 14px;
       }
       ```
    
    3. Reserve space for dynamic content:
       - Typewriter text: ensure container has minimum height
         ```css
         #tw {
           min-height: 1.2em;
           display: inline-block;
         }
         ```
    
    4. Ensure images (if added later) have width/height attributes or aspect-ratio.
       Currently no images, but good practice:
       ```css
       img {
         max-width: 100%;
         height: auto;
         aspect-ratio: attr(width) / attr(height);
       }
       ```
    
    5. Avoid injecting content above existing content:
       - Skip link is positioned absolute (won't shift)
       - Navigation is fixed (already accounted for)
       - No dynamic content injection that would push things down
    
    6. Check for any font-size-adjust that might help:
       ```css
       body {
         font-size-adjust: 0.5; /* Helps with font swapping */
       }
       ```
       (Optional, may not be needed with monospace fonts)
  </action>
  <verify>
    Use Lighthouse in DevTools to check CLS score
  </verify>
  <done>
    CLS optimizations applied: explicit dimensions, reserved space for dynamic content, stable layout
  </done>
</task>

<task type="auto">
  <name>Task 5: Run Lighthouse audit and document results</name>
  <files>(Verification only)</files>
  <action>
    Run performance audit using Lighthouse:
    
    1. Open index.html in Chrome (or serve via simple HTTP server)
    
    2. Open DevTools → Lighthouse tab
    
    3. Configure audit:
       - Device: Mobile
       - Categories: All (Performance, Accessibility, Best Practices, SEO)
       - Throttling: Simulated 4G
    
    4. Run audit
    
    5. Record scores and key metrics:
       - Performance score (target: 90+)
       - Accessibility score (target: 90+)
       - Best Practices (target: 90+)
       - SEO (target: 90+)
       - FCP (target: < 1.8s)
       - LCP (target: < 2.5s)
       - CLS (target: < 0.1)
       - TTI (target: < 3.8s)
    
    6. Address any issues:
       - If Performance < 90: Check render-blocking resources, optimize further
       - If Accessibility < 90: Review ARIA labels, contrast, focus indicators
       - If Best Practices < 90: Check for console errors, HTTPS issues
       - If SEO < 90: Verify meta tags, heading structure
    
    7. Document results in comments:
       ```html
       <!-- 
         Lighthouse Scores (Mobile, 4G):
         - Performance: XX
         - Accessibility: XX
         - Best Practices: XX
         - SEO: XX
         
         Core Web Vitals:
         - FCP: X.Xs
         - LCP: X.Xs
         - CLS: X.XX
       -->
       ```
    
    8. Test on slow 3G as well to ensure under 3 seconds:
       DevTools → Network → Slow 3G preset
  </action>
  <verify>
    Run Lighthouse audit, record scores in verification section
  </verify>
  <done>
    Lighthouse audit complete, all scores 90+, Core Web Vitals within targets, documented in HTML comments
  </done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 6: Final visual verification and testing</name>
  <files>All files</files>
  <action>
    Final comprehensive verification before completing phase.
  </action>
  <verify>
    
    ## Verification Checklist
    
    **Visual Consistency:**
    - [ ] Open index.html in browser
    - [ ] Visual appearance matches original exactly (no regressions)
    - [ ] All sections visible: Hero, About, Projects, Contact
    - [ ] No console errors in DevTools
    
    **Theme System (FOUND-02):**
    - [ ] Theme toggle button visible in navigation
    - [ ] Click toggle switches dark/light with smooth transition
    - [ ] Refresh page - theme persists
    - [ ] Clear localStorage - theme follows system preference
    - [ ] No flash of wrong theme on load
    
    **Accessibility (FOUND-03):**
    - [ ] Tab through entire page - all interactive elements reachable
    - [ ] Focus indicators visible (styled with accent color)
    - [ ] Skip link appears on first Tab
    - [ ] Command palette opens with Ctrl+Shift+P
    - [ ] Vim mode toggle works, j/k/G/gg navigation works
    - [ ] Escape closes palette
    
    **Responsive (FOUND-01):**
    - [ ] Test at 375px width - layout works, no horizontal scroll
    - [ ] Test at 768px width - layout adapts correctly
    - [ ] Test at 1920px width - full desktop layout
    - [ ] Projects grid stacks on mobile
    - [ ] Touch targets are adequate size
    
    **Performance (FOUND-04):**
    - [ ] Lighthouse Performance score >= 90
    - [ ] Lighthouse Accessibility score >= 90
    - [ ] Page loads reasonably fast (subjective check)
    - [ ] No render-blocking warnings
    
    **Code Organization (TECH-01, TECH-02, TECH-03):**
    - [ ] Files organized in css/ and js/ directories
    - [ ] No inline CSS (except critical inline block)
    - [ ] No inline JavaScript (except FOUC script)
    - [ ] DATA array in separate data.js file
    - [ ] ES6 modules used
    
  </verify>
  <done>
    All verification items checked and passing
  </done>
  <resume-signal>
    Confirm all items above pass, or describe any issues found. Type "approved" if ready to complete phase.
  </resume-signal>
</task>

</tasks>

<verification>
1. Critical CSS inlined in head
2. Non-critical CSS loads asynchronously
3. Google Fonts uses display=swap and preconnect
4. Lighthouse Performance score >= 90
5. Lighthouse Accessibility score >= 90
6. Core Web Vitals within targets
7. Page loads under 3 seconds on 4G
8. All Phase 1 requirements verified by human
</verification>

<success_criteria>
- Critical CSS inlined for fast first paint
- Non-critical resources load asynchronously (no render blocking)
- Lighthouse Performance 90+ (FOUND-04 achieved)
- Lighthouse Accessibility 90+ (FOUND-03 achieved)
- Core Web Vitals: FCP < 1.8s, LCP < 2.5s, CLS < 0.1
- Page loads in under 3 seconds on 4G (FOUND-04 achieved)
- All functionality verified working
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-06-SUMMARY.md`

Phase 1 is complete when:
- FOUND-01: Responsive on all viewports ✓
- FOUND-02: Theme toggle with persistence ✓
- FOUND-03: Accessibility baseline ✓
- FOUND-04: Fast load, Lighthouse 90+ ✓
- TECH-01: Separated CSS/JS files ✓
- TECH-02: Data-driven architecture ✓
- TECH-03: Modern JS patterns ✓
- TECH-04: No external dependencies ✓
</output>
