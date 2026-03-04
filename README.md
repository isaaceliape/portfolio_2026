# Portfolio Website

A sleek, single-page portfolio website with a terminal/CLI aesthetic. Built as a pure HTML file with no dependencies, build tools, or external assets.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

### Design
- **Terminal/CLI Aesthetic** — Clean, monospace typography with command-line inspired UI
- **Dark/Light Themes** — Automatic theme detection with manual toggle support
- **Responsive Layout** — Optimized for desktop and mobile (breakpoint at 620px)
- **Cursor Glow Effect** — Subtle animated glow that follows mouse movement

### Interactive Features

**Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Fuzzy search across all content
- Quick navigation to sections
- Access to profile info, skills, projects, and contact details
- Theme toggle and vim mode controls

**Vim Navigation Mode**
- `j` / `k` — Scroll down/up
- `gg` — Jump to top of page
- `G` — Jump to bottom of page
- `/` — Open command palette
- Visual mode indicator in status bar

**Animations**
- **Typewriter Effect** — Cycling terminal commands in hero section
- **Reveal on Scroll** — Elements fade in as you scroll down the page
- **Smooth Scrolling** — All navigation uses smooth scroll behavior

## Sections

1. **Hero** — Introduction with ASCII art, animated typewriter text, and CTA buttons
2. **About** — Terminal-style bio with skills and tools
3. **Projects** — Grid of project cards with tags and links
4. **Contact** — Contact information and social links

## Quick Start

### View Locally
```bash
open index.html
```

Or simply double-click `index.html` in your file manager.

### Development
1. Open `index.html` in your preferred code editor
2. Make changes
3. Refresh browser to see updates
4. No build step required!

## Customization

### Update Content

All content is in `index.html`:

- **HTML sections** (lines 740–1139) — Main content markup
- **DATA array** (lines 1221–1481) — Command palette search data

### Modify Colors/Theme

CSS variables are defined at lines 20–86:

```css
:root {
  --bg: #0a0a0a;
  --text: #e0e0e0;
  --accent: #00ff88;
  /* ... */
}
```

Dark and light theme variables are both in `:root` with the light theme scoped to `@media (prefers-color-scheme: light)`.

### Add a New Project

1. **Add project card** to the grid (around line 1013):
```html
<article class="project">
  <h3>Project Name</h3>
  <p>Project description...</p>
  <div class="project-tags">
    <span class="tag">Tag1</span>
    <span class="tag">Tag2</span>
  </div>
  <a href="https://github.com/..." class="project-link">View Project →</a>
</article>
```

2. **Add to DATA array** (around line 1300):
```javascript
{
  id: 'project-id',
  label: 'Project Name',
  category: 'Projects',
  keywords: ['keyword1', 'keyword2'],
  action: () => { /* navigation or external link */ }
}
```

## File Structure

```
portfolio_2026/
└── index.html          # Everything is in this single file
    ├── Lines 1–739     # CSS (styles, animations, themes)
    ├── Lines 740–1139  # HTML markup
    └── Lines 1141–1708 # JavaScript (logic, data, events)
```

That's it! No `package.json`, no `node_modules`, no build configuration.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires a modern browser with support for:
- CSS Grid & Flexbox
- CSS Variables
- IntersectionObserver API

## Deployment

Since this is a single static HTML file, you can deploy it anywhere:

- **GitHub Pages** — Push to a repository, enable Pages
- **Vercel/Netlify** — Drag and drop `index.html`
- **Any web server** — Upload `index.html` to your host
- **CDN** — Serve directly from cloud storage

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Shift + P` | Open command palette |
| `Esc` | Close command palette |
| `j` (in vim mode) | Scroll down |
| `k` (in vim mode) | Scroll up |
| `gg` (in vim mode) | Jump to top |
| `G` (in vim mode) | Jump to bottom |
| `/` (in vim mode) | Open command palette |

## Performance

- **Zero dependencies** — No external libraries or frameworks
- **Single file** — One HTTP request to load everything
- **Minimal CSS/JS** — ~70KB total (uncompressed)
- **No build step** — Instant load, no hydration delays

## License

MIT License — feel free to use this template for your own portfolio!

## Credits

Built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools, no nonsense.
