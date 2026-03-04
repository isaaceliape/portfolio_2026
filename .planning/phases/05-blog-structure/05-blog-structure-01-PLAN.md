---
phase: 05-blog-structure
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - blog/index.html
  - blog/post-1.html
  - blog/post-2.html
  - blog/post-3.html
autonomous: true

must_haves:
  truths:
    - User visits blog/index.html and sees list of 3 blog posts with titles, dates, and excerpts
    - User clicks on any post excerpt and navigates to individual post page with full content
    - User can navigate directly to blog/post-*.html via URL
    - Blog pages load without console errors and render semantic HTML structure
    - Post pages link back to blog index and main portfolio
  artifacts:
    - path: blog/index.html
      provides: Blog index page listing all posts
      min_lines: 80
    - path: blog/post-1.html
      provides: First blog post page
      min_lines: 60
    - path: blog/post-2.html
      provides: Second blog post page
      min_lines: 60
    - path: blog/post-3.html
      provides: Third blog post page
      min_lines: 60
  key_links:
    - from: blog/index.html
      to: css/*.css
      via: link rel="stylesheet" tags
      pattern: "link.*stylesheet.*css/"
    - from: blog/index.html
      to: blog/post-*.html
      via: article card links
      pattern: "a href=\"post-"
    - from: blog/post-*.html
      to: blog/index.html
      via: back navigation link
      pattern: "a href=\"index.html\"
    - from: blog/post-*.html
      to: index.html
      via: portfolio home link
      pattern: "a href=\"../index.html\""
---

<objective>
Create blog infrastructure with index page and 3 post pages using established file patterns from Phase 1.

Purpose: Establish the blog section structure that Phase 6 will integrate into the portfolio navigation and polish.
Output: blog/index.html, blog/post-1.html, blog/post-2.html, blog/post-3.html
</objective>

<execution_context>
@/Users/isaaceliape/.config/opencode/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@/Users/isaaceliape/repos/portfolio_2026/index.html
@/Users/isaaceliape/repos/portfolio_2026/css/base.css
@/Users/isaaceliape/repos/portfolio_2026/css/layout.css
@/Users/isaaceliape/repos/portfolio_2026/css/components.css
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create blog directory and index page</name>
  <files>blog/index.html</files>
  <action>
Create the blog directory structure and index page at blog/index.html.

**Structure to create:**
- blog/ directory at repository root
- blog/index.html with semantic HTML structure

**Page requirements:**
1. Copy the HTML structure from the main portfolio (index.html) including:
   - DOCTYPE, html lang="en"
   - Full head section with all meta tags, Open Graph, Twitter cards
   - Preconnect to Google Fonts
   - Theme initialization script (copy from index.html lines ~33-52)
   - Critical CSS link (css/critical.css)
   - Async CSS links for base.css, layout.css, components.css
   - noscript fallback links

2. Header/navigation:
   - Replicate the header from index.html with logo link to portfolio home (../index.html)
   - Include the command palette button
   - Include theme toggle button
   - Navigation links: About, Projects, Blog (active), Contact

3. Main content section:
   - Section with id="blog-index" or semantic main element
   - Page title: "Blog" or "Writing"
   - Subtitle/description about the blog
   
4. Blog post list:
   - 3 article elements representing blog posts
   - Each article contains:
     - h2 or h3 title (e.g., "Building Accessible React Components", "The Future of AI in Web Development", "Optimizing Performance in Modern JavaScript")
     - Date (e.g., "March 4, 2026")
     - Excerpt (2-3 sentences summarizing the post)
     - "Read more" link to respective post-*.html
   - Cards should use existing component classes from components.css

5. Footer:
   - Replicate footer from index.html
   - Include social links, copyright, back to top link

6. Scripts:
   - Include all script tags from index.html (defer attributes)
   - src="../js/utils.js", "../js/data.js", "../js/theme.js", "../js/animations.js", "../js/app.js"
   - Note the ../ prefix since blog is in subdirectory

**CSS path adjustments:**
- Change css/ references to ../css/ in link tags
- Change js/ references to ../js/ in script tags
- Keep font URLs absolute (they're external)

**Content:**
Use realistic placeholder content that matches the technical writing style:
- Post 1: Frontend/React/Accessibility topic
- Post 2: AI/Web Development topic  
- Post 3: Performance/JavaScript topic

**Don't:**
- Don't create inline styles - use existing CSS classes
- Don't modify existing CSS files
- Don't add new JavaScript functionality (that's Phase 6)
</action>
  <verify>cat blog/index.html | head -50 && echo "..." && ls -la blog/</verify>
  <done>blog/index.html exists with proper structure, imports CSS correctly with ../css/ paths, contains 3 post previews with titles, dates, excerpts, and links to post pages</done>
</task>

<task type="auto">
  <name>Task 2: Create blog post pages</name>
  <files>blog/post-1.html, blog/post-2.html, blog/post-3.html</files>
  <action>
Create three individual blog post pages at blog/post-1.html, blog/post-2.html, and blog/post-3.html.

**Common structure for all post pages:**

1. **HTML head** (same as index.html):
   - Copy the entire head section from blog/index.html
   - Update title: "Post Title - Isaac Eliape" format
   - Update meta description to match post content

2. **Header/navigation** (same as blog/index.html):
   - Identical header with navigation
   - Logo links to portfolio home (../index.html)

3. **Article content** (main difference from index):
   - Use semantic article element
   - Header with:
     - h1 for post title
     - time element with datetime attribute (e.g., datetime="2026-03-04")
     - Optional: reading time estimate
   - Article body with:
     - Multiple paragraphs of content (300-500 words each)
     - Use semantic HTML: p, h2, h3, ul/li for lists, code for inline code, pre/code for code blocks
     - Match the terminal/CLI aesthetic of the portfolio
   - Article footer with:
     - Tags/categories (span elements with classes)
     - Author info

4. **Navigation between posts**:
   - "Back to Blog" link to blog/index.html
   - Optional: Previous/Next post navigation

5. **Footer** (same as blog/index.html)

6. **Scripts** (same as blog/index.html)

**Content for each post:**

**post-1.html: "Building Accessible React Components"**
- Focus: Accessibility, React, ARIA patterns
- Topics: Semantic HTML, keyboard navigation, screen readers, focus management
- Include code examples using pre/code blocks
- Tone: Technical but approachable

**post-2.html: "The Future of AI in Web Development"**
- Focus: AI, LLMs, Developer tools
- Topics: AI-assisted coding, automation, maintaining human creativity
- Mix of conceptual and practical content
- Tone: Forward-thinking, balanced perspective

**post-3.html: "Optimizing Performance in Modern JavaScript"**
- Focus: Performance, JavaScript optimization
- Topics: Bundle size, lazy loading, code splitting, Core Web Vitals
- Include practical tips and metrics
- Tone: Practical, data-informed

**Styling:**
- Use existing CSS classes from components.css
- Article content will mostly use base typography styles from base.css
- Code blocks should use the monospace font (JetBrains Mono) already loaded

**Links:**
- All internal links use relative paths
- Back to blog: index.html (same directory)
- Back to portfolio: ../index.html
</action>
  <verify>ls -la blog/post-*.html && head -30 blog/post-1.html</verify>
  <done>All three post pages exist with proper structure, unique content (300-500 words each), semantic HTML, back navigation to blog index, and consistent styling with portfolio</done>
</task>

<task type="auto">
  <name>Task 3: Verify page loading and console errors</name>
  <files>blog/index.html, blog/post-1.html, blog/post-2.html, blog/post-3.html</files>
  <action>
Verify all blog pages load correctly without console errors and render semantic HTML.

**Validation steps:**

1. **HTML validation:**
   - Check each page has DOCTYPE, lang attribute
   - Check each page has title, meta charset, viewport
   - Verify all tags are properly closed
   - Verify semantic structure (header, main, article, footer)

2. **Path validation:**
   - Verify CSS links use ../css/ paths
   - Verify JS links use ../js/ paths
   - Verify internal links (index.html, post-*.html) use correct relative paths
   - Verify portfolio home links use ../index.html

3. **Content validation:**
   - Index page has 3 post previews with:
     - Titles (h2 or h3)
     - Dates (time elements)
     - Excerpts (paragraphs)
     - Links to post pages
   - Each post page has:
     - Article element with h1 title
     - time element with datetime
     - Substantial content (multiple paragraphs)
     - Back to blog link
     - Back to portfolio link

4. **Console error check:**
   - Look for missing file references
   - Verify no inline JavaScript errors
   - Check that all referenced files exist (css files, js files)

5. **Accessibility check:**
   - All images have alt attributes (if any)
   - All links have descriptive text
   - Headings follow proper hierarchy (h1 → h2 → h3)
   - Semantic landmarks present (header, main, footer)

**Quick local test:**
If possible, open blog/index.html in browser or use a simple HTTP server to verify rendering.
</action>
  <verify>echo "=== File Structure ===" && find blog -type f && echo "" && echo "=== Index Preview ===" && grep -E "(h1|h2|h3|article|time)" blog/index.html | head -20</verify>
  <done>All pages pass HTML validation, have correct paths, semantic structure, proper links between pages, no console errors anticipated</done>
</task>

</tasks>

<verification>
After plan execution, verify:
1. blog/ directory exists with 4 HTML files
2. blog/index.html renders 3 post previews with titles, dates, excerpts
3. Each post-*.html has unique content, h1 title, time element, back navigation
4. All CSS/JS paths use ../ prefix for subdirectory
5. Pages follow semantic HTML structure
6. No broken internal links (index.html ↔ post-*.html ↔ ../index.html)
</verification>

<success_criteria>
Phase 5 is complete when:
- blog/index.html exists and lists 3 posts with titles, dates, excerpts
- blog/post-1.html, blog/post-2.html, blog/post-3.html exist with full content
- Each post page links back to blog index and main portfolio
- Pages render without console errors
- Semantic HTML structure is used throughout
- Design is consistent with portfolio (imports same CSS)
</success_criteria>

<output>
After completion, create `.planning/phases/05-blog-structure/05-blog-structure-01-SUMMARY.md`
</output>
