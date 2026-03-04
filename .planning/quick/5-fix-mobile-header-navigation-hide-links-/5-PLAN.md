---
phase: quick
plan: 05
type: quick
date: 2026-03-04
files_modified:
  - css/layout.css
autonomous: false
must_haves:
  truths:
    - Mobile navigation shows only command palette button
    - All nav links (about, projects, blog, contact) hidden on mobile
    - Theme toggle remains accessible or hidden based on space
  artifacts:
    - path: "css/layout.css"
      provides: "Mobile navigation CSS fix"
      contains: ["@media (max-width: 640px)", ".nav-links a"]
---

<objective>
Fix mobile header navigation visibility issue by hiding all navigation links (about, projects, blog, contact) and keeping only the command palette button visible on screens ≤640px.
</objective>

<tasks>
1. Update CSS media query @media (max-width: 640px) in layout.css
2. Hide .nav-links a elements (the text links) on mobile
3. Keep .kbd-hint (command palette button) visible
4. Optionally hide theme toggle if needed for space
5. Verify logo remains visible
</tasks>
