---
phase: quick-3
plan: 1
type: execute
wave: 1
depends_on: []
files_modified: [css/components.css]
autonomous: true

must_haves:
  truths:
    - "Blog post title uses theme colors (--accent or --text)"
    - "Blog post content has appropriate max-width and line-height for readability"
    - "Blog post metadata (date, reading time) uses muted theme color"
    - "Blog tags display with theme-colored borders/backgrounds"
    - "Navigation buttons in footer use consistent button styling"
  artifacts:
    - path: "css/components.css"
      provides: "Blog post component styles"
      contains: ".blog-post-header, .blog-post-title, .blog-post-content"
  key_links:
    - from: "blog/post-1.html"
      to: "css/components.css"
      via: "stylesheet link"
      pattern: "blog-post-.*\\{"
---

<objective>
Add blog post component styles to components.css using existing theme variables
</objective>

Purpose: Blog post pages currently have no CSS styles defined, causing them to render with default browser styling (too large, no theme colors). This plan adds proper styling that matches the portfolio's terminal aesthetic.

Output: Blog post styles in components.css with theme-aware colors, proper typography scale, and consistent spacing.

<execution_context>
@/Users/isaaceliape/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/isaaceliape/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@css/components.css
@css/base.css
@blog/post-1.html
</context>

<tasks>

<task type="auto">
  <name>Add blog post layout and header styles</name>
  <files>css/components.css</files>
  <action>
    Add the following CSS rules after the Vim indicator section (end of file):
    
    1. Blog post container and header:
    - .blog-post: max-width 720px, margin 0 auto, padding-top 6rem (below nav)
    - .blog-post-header: margin-bottom 2rem, terminal prompt styling
    - .blog-post-title: font-size clamp(1.5rem, 4vw, 2rem), color var(--accent), margin-bottom 0.5rem
    - .blog-post-meta: display flex, gap 1rem, color var(--muted), font-size 0.85rem
    
    Use theme variables (--accent, --muted, --text, --bg) for all colors.
    Match existing terminal aesthetic (prompt styling like .ps1 class).
  </action>
  <verify>
    Run: grep -A 20 "\.blog-post-header" css/components.css
    Should show: .blog-post, .blog-post-header, .blog-post-title, .blog-post-meta rules
  </verify>
  <done>
    Blog post header section styled with:
    - Proper max-width constraint (720px)
    - Title in accent color with responsive font size
    - Metadata (date, reading time) in muted color
    - Terminal-style prompt above title
  </done>
</task>

<task type="auto">
  <name>Add blog post content and footer styles</name>
  <files>css/components.css</files>
  <action>
    Add the following CSS rules:
    
    2. Blog post content:
    - .blog-post-content: line-height 1.8, font-size 0.95rem, color var(--text)
    - .blog-post-content h2: color var(--accent2), margin-top 2rem, margin-bottom 1rem, font-size 1.25rem
    - .blog-post-content p: margin-bottom 1.25rem
    - .blog-post-content code: background var(--surface2), padding 0.2rem 0.4rem, border-radius 3px, color var(--accent)
    - .blog-post-content pre: background var(--surface), padding 1rem, border-radius 6px, border 1px solid var(--border-bright), overflow-x auto, margin-bottom 1.5rem
    - .blog-post-content ul, .blog-post-content ol: margin-bottom 1.25rem, padding-left 1.5rem
    - .blog-post-content li: margin-bottom 0.5rem
    
    3. Blog post footer:
    - .blog-post-footer: margin-top 3rem, padding-top 2rem, border-top 1px solid var(--border)
    - .blog-post-tags: display flex, gap 0.5rem, flex-wrap wrap, margin-bottom 1.5rem
    - .blog-tag: font-size 0.75rem, padding 0.25rem 0.75rem, border-radius 3px, border 1px solid var(--border-bright), color var(--accent2)
    - .blog-post-nav: display flex, gap 1rem, flex-wrap wrap
    - .blog-post-nav .btn: font-size 0.85rem, padding 0.5rem 1rem, border 1px solid var(--border-bright), border-radius 4px, color var(--muted), transition all 0.2s
    - .blog-post-nav .btn:hover: border-color var(--accent), color var(--accent)
  </action>
  <verify>
    Run: grep -A 40 "\.blog-post-content" css/components.css
    Should show: content typography, code blocks, lists, footer, tags, and nav styles
  </verify>
  <done>
    Blog post content and footer styled with:
    - Readable typography (line-height 1.8, proper margins)
    - Headings in accent2 color
    - Code blocks with theme background and borders
    - Tags with accent2 borders
    - Navigation buttons with hover states
  </done>
</task>

</tasks>

<verification>
1. Open blog/post-1.html in browser
2. Verify: Title displays in accent color (--accent)
3. Verify: Content text uses theme color (--text), not default black
4. Verify: Headings (h2) display in accent2 color
5. Verify: Code blocks have dark background with accent-colored inline code
6. Verify: Tags show with colored borders
7. Verify: Footer nav buttons have hover effects
8. Toggle theme (light/dark) - all colors should adapt correctly
</verification>

<success_criteria>
- [ ] Blog post renders with proper typography scale (not too large)
- [ ] All text uses theme colors (--text, --accent, --accent2, --muted)
- [ ] Code blocks styled with theme backgrounds
- [ ] Footer and navigation consistent with portfolio design
- [ ] Theme toggle works correctly on blog post page
</success_criteria>

<output>
After completion, create `.planning/quick/3-fix-blog-post-1-layout-too-large-and-use/3-SUMMARY.md`
</output>
