# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **single-page portfolio website** built as a pure HTML file (`index.html`) with:
- Inline CSS for styling with light/dark theme support
- Vanilla JavaScript for interactive features
- Terminal/CLI aesthetic design
- No build tools, dependencies, or separate asset files

The site is deployed as a static file and can be opened directly in any browser.

## Quick Commands

**View the site locally:**
```bash
open index.html
```

**Development workflow:**
- Edit `index.html` directly (all code is in this single file)
- Refresh browser to see changes
- No build step or dev server needed

## Architecture & Key Features

### Design System
- **CSS Variables** (`:root`) define colors for dark/light themes
- **Theme Modes:**
  - Auto-detection based on system preference (`prefers-color-scheme`)
  - Manual override via `data-theme` attribute on `<html>`
  - Toggle via command palette (Ctrl+Shift+P)

### Main Sections (via semantic `<section>` elements)
1. **Hero** (`#hero`) — Intro with ASCII art, typewriter animation, buttons
2. **About** (`#about`) — Terminal-style bio with tools list
3. **Projects** (`#projects`) — Grid of project cards
4. **Contact** (`#contact`) — Contact info with links

### JavaScript Features

**Command Palette** (Ctrl+Shift+P / Cmd+Shift+P)
- Fuzzy search across commands, profile info, skills, tools, awards, projects, contact
- Data source: `DATA` array in script (lines 1221–1481)
- Navigation actions trigger smooth scrolling
- Theme toggle available via palette

**Vim Mode Toggle** (enabled via palette)
- `j`/`k` — scroll down/up
- `gg` — jump to top
- `G` — jump to bottom
- `/` — open command palette
- Status indicator at bottom shows mode state

**Reveal Animation**
- Elements with class `reveal` fade in + slide up when scrolled into view
- Uses `IntersectionObserver` (lines 1181–1194)
- Staggered delays via `.d1`–`.d4` classes

**Typewriter Animation** (hero section)
- Cycles through commands: `ls projects/`, `open sclp.co`, `ssh ieliape@work`
- Implementation: lines 1153–1179

**Cursor Glow Effect**
- Follows mouse, fixed position overlay
- Updates position on `mousemove` event (lines 1148–1151)

### Data Structure

The `DATA` array (lines 1221–1481) is the source of truth for:
- Palette items and search results
- Profile bio, skills, awards
- Project links
- Contact info

Add/edit entries here to update palette results. Categories group items in the palette UI.

## File Structure Notes

Everything is in `index.html`:
- Lines 1–739: CSS (styles, animations, theme variables)
- Lines 740–1139: HTML markup
- Lines 1141–1708: JavaScript (logic, data, event handlers)

No separate files, no imports, no package.json.

## Common Edits

**Update portfolio content:**
- Edit text in HTML sections (lines 740–1139)
- Update `DATA` array (lines 1221–1481) for palette results

**Modify colors/theme:**
- CSS variables at lines 20–86 (`:root` selectors)
- Dark theme: `--bg`, `--accent`, `--text`, etc.
- Light theme: same variables under `@media (prefers-color-scheme: light)`

**Add a new project:**
1. Add project card to grid (lines 1013–1080)
2. Add entry to `DATA` array under "Projects" category
3. Ensure tag classes and styling are consistent

**Adjust animations:**
- Reveal animations: lines 370–392 (`.reveal`, `.d1`–`.d4`)
- Typewriter timing: lines 1164–1176 (setTimeout values)
- Transitions: look for `transition:` in CSS

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses CSS Grid, Flexbox, CSS Variables, IntersectionObserver
- No polyfills; assumes evergreen browser support
- Mobile responsive (breakpoint at 620px)

## Notes for Future Work

- The site is entirely self-contained; any changes to links, text, or data should be made directly in `index.html`
- Theme persistence could be added via localStorage if needed
- The `DATA` array could be extracted to an external JSON file if the HTML becomes too large
- No build tools needed for production; commit and deploy `index.html` as-is
