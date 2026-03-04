---
phase: quick
plan: 2
type: execute
wave: 1
depends_on: []
files_modified: [index.html]
autonomous: true

must_haves:
  truths:
    - "Blog link appears in main navigation"
    - "Blog link is positioned between existing nav items"
    - "Blog link uses same styling as other nav links"
  artifacts:
    - path: "index.html"
      provides: "Navigation with blog link"
      contains: "blog/index.html"
  key_links:
    - from: "index.html"
      to: "blog/index.html"
      via: "navigation anchor"
      pattern: "href=\"blog/index.html\""
---

<objective>
Add "Blog" link to the main header navigation

Purpose: Make the blog discoverable from the main navigation menu, completing the v1.1 Blog Addition milestone integration tasks.
Output: Updated index.html with blog link in nav
</objective>

<execution_context>
@/Users/isaaceliape/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/isaaceliape/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@index.html
@blog/index.html
</context>

<tasks>

<task type="auto">
  <name>Add blog link to main navigation</name>
  <files>index.html</files>
  <action>
    In the <nav> element, add a "blog" link in the nav-links div.

    Current structure (lines 268-274):
    ```html
    <div class="nav-links">
      <a href="#about">about</a>
      <a href="#projects">projects</a>
      <a href="#contact">contact</a>
      <span class="kbd-hint" id="nav-palette-btn">...</span>
      <button id="theme-toggle">...</button>
    </div>
    ```

    Insert the blog link after "contact" and before the command palette button:
    ```html
    <a href="blog/index.html" aria-label="Go to Blog">blog</a>
    ```

    The link should:
    - Use relative path "blog/index.html"
    - Have aria-label for accessibility
    - Match existing link styling (no class needed, inherits from nav-links)
    - Be positioned consistently with other nav items
  </action>
  <verify>
    1. Open index.html and confirm blog link exists in nav-links
    2. Run: `grep -n "blog/index.html" index.html` — should return the nav link line
  </verify>
  <done>
    Blog link appears in main navigation between "contact" and the command palette button, uses same styling as other nav items, links to blog/index.html
  </done>
</task>

</tasks>

<verification>
1. Blog link visible in header navigation when viewing index.html locally
2. Clicking blog link navigates to blog/index.html
3. Link has proper aria-label for screen readers
</verification>

<success_criteria>
- index.html contains `<a href="blog/index.html"` in nav-links section
- Navigation maintains consistent visual styling
- Link is keyboard accessible and has proper aria-label
</success_criteria>

<output>
After completion, create `.planning/quick/2-add-the-blog-link-to-the-header-nav/2-SUMMARY.md`
</output>
