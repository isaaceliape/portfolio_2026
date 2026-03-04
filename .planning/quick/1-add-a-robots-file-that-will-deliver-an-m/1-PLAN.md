---
phase: quick
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [robots.txt]
autonomous: true

must_haves:
  truths:
    - "Search engines can crawl all public pages"
    - "Private/admin paths are blocked from crawling"
    - "Sitemap location is declared for future use"
  artifacts:
    - path: "robots.txt"
      provides: "Crawler instructions"
      min_lines: 5
  key_links:
    - from: "robots.txt"
      to: "sitemap.xml"
      via: "Sitemap directive"
      pattern: "Sitemap:.*sitemap\\.xml"
---

<objective>
Create robots.txt file to control search engine crawling behavior for the static portfolio site.

Purpose: Guide search engine bots to crawl public content while blocking private/admin paths, and declare sitemap location for SEO.
Output: robots.txt file at project root
</objective>

<execution_context>
@/Users/isaaceliape/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/isaaceliape/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
</context>

<tasks>

<task type="auto">
  <name>Create robots.txt with crawler rules</name>
  <files>robots.txt</files>
  <action>
    Create robots.txt at project root with:
    1. User-agent: * (apply to all crawlers)
    2. Allow: / (crawl all public pages — index.html, blog/, css/, js/)
    3. Disallow: /*.png$ (block direct image crawling, OG images are large)
    4. Disallow: /.git/ (block version control directory)
    5. Disallow: /.planning/ (block planning documents)
    6. Disallow: /.claude/ (block Claude config)
    7. Sitemap: https://YOUR_GITHUB_USERNAME.github.io/portfolio_2026/sitemap.xml
    8. Add comment explaining sitemap URL needs to be updated with actual GitHub username

    Use standard robots.txt syntax with proper comments.
  </action>
  <verify>
    1. File exists: test -f robots.txt
    2. Contains required directives: grep -E "User-agent|Allow|Disallow|Sitemap" robots.txt
  </verify>
  <done>
    robots.txt exists at project root with crawler rules for all bots, blocks private directories and large images, declares sitemap location
  </done>
</task>

</tasks>

<verification>
1. robots.txt present in project root
2. File allows crawling of public pages (/, /blog/)
3. File blocks private paths (/.git/, /.planning/, /.claude/)
4. Sitemap directive present with placeholder URL
</verification>

<success_criteria>
- robots.txt file created and committed
- Search engines can crawl portfolio and blog pages
- Private directories protected from crawling
</success_criteria>

<output>
After completion, create `.planning/quick/1-add-a-robots-file-that-will-deliver-an-m/quick-01-SUMMARY.md`
</output>
