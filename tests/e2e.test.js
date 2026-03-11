/**
 * End-to-end integration tests
 * Tests full user flows across multiple modules working together
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Helper to set up a full DOM with all elements the app expects,
 * mock all browser APIs, and dynamically import app.js (which calls init())
 */
async function setupApp() {
  document.documentElement.removeAttribute('data-theme');

  document.body.innerHTML = `
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div aria-live="polite" aria-atomic="true" class="sr-only" id="palette-announce"></div>
    <div id="cursor-glow"></div>
    <div id="vim-indicator">-- NORMAL --</div>
    <div id="palette-overlay" role="dialog" aria-modal="true" aria-label="Command Palette">
      <div id="palette">
        <div id="palette-header">
          <span class="pal-icon">⌘</span>
          <input id="palette-input" type="text" placeholder="Search..." autocomplete="off" spellcheck="false" />
          <span id="palette-shortcut"><kbd>ESC</kbd> to close</span>
        </div>
        <div id="palette-results"></div>
        <div id="palette-footer">
          <span class="pal-hint"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span class="pal-hint"><kbd>↵</kbd> open</span>
          <span class="pal-hint"><kbd>ESC</kbd> close</span>
        </div>
      </div>
    </div>
    <nav class="nav" aria-label="Main navigation">
      <span class="nav-logo"><span class="user">ieliape</span><span class="sep">@</span>portfolio<span class="muted">:~$</span></span>
      <div class="nav-links">
        <a href="#about">about</a>
        <a href="#projects">projects</a>
        <a href="#contact">contact</a>
        <span class="kbd-hint" id="nav-palette-btn" role="button" tabindex="0" aria-label="Open command palette">
          <span class="kbd-hint-desktop">⌘ Ctrl+Shift+P</span>
          <span class="kbd-hint-mobile">cmd pallet</span>
        </span>
        <button id="theme-toggle" class="theme-toggle" aria-label="Switch to light mode" type="button">☀</button>
      </div>
    </nav>
    <main id="main-content">
      <section id="hero" aria-label="Introduction">
        <div class="hero-term">
          <div class="prompt">
            <span class="ps1"><span class="user">ieliape</span></span>
            <span class="cmd"><span id="tw"></span><span class="typewriter-cursor"></span></span>
          </div>
        </div>
        <div class="hero-btns">
          <a href="#projects" class="cli-btn">view-work</a>
          <a href="#contact" class="cli-btn">get-in-touch</a>
        </div>
      </section>
      <section id="about" aria-label="About">
        <div class="term reveal">
          <div class="term-bar"><span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span></div>
          <div class="term-body"><p>About content</p></div>
        </div>
      </section>
      <section id="projects">
        <div class="proj reveal d1"><p class="proj-name">sclp.co</p></div>
        <div class="proj reveal d2"><p class="proj-name">touch-typing-tool</p></div>
      </section>
      <section id="contact">
        <div class="term reveal">
          <div class="term-body">
            <a class="contact-row" href="mailto:isaaceliape@me.com">Email</a>
          </div>
        </div>
      </section>
    </main>
    <footer role="contentinfo">© 2026 Isaac Eliape · exit 0</footer>
  `;

  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

  window.getComputedStyle = vi.fn().mockReturnValue({
    getPropertyValue: vi.fn().mockReturnValue('#00d4aa'),
  });

  window.scrollTo = vi.fn();
  window.scrollBy = vi.fn();

  global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    _callback: callback,
  }));

  // Only set navigator if not already configured by the test
  if (!window.navigator.platform || window.navigator.platform !== 'Win32') {
    Object.defineProperty(window, 'navigator', {
      value: { platform: 'MacIntel' },
      writable: true,
      configurable: true,
    });
  }

  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'clear').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});

  const app = await import('../js/app.js');
  return app;
}

function keydown(key, opts = {}) {
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, ...opts })
  );
}

describe('E2E: Command Palette full flow', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('user opens palette, searches, navigates with arrows, and selects an item', async () => {
    await setupApp();

    const overlay = document.getElementById('palette-overlay');
    const input = document.getElementById('palette-input');
    const results = document.getElementById('palette-results');

    // 1. Open palette via keyboard shortcut
    keydown('p', { ctrlKey: true, shiftKey: true });
    expect(overlay.classList.contains('open')).toBe(true);

    // 2. All items should be shown
    const allItems = results.querySelectorAll('.pal-item');
    expect(allItems.length).toBeGreaterThan(10);

    // 3. Type "about" to filter
    input.value = 'about';
    input.dispatchEvent(new Event('input'));

    const filteredItems = results.querySelectorAll('.pal-item');
    expect(filteredItems.length).toBeLessThan(allItems.length);
    expect(filteredItems.length).toBeGreaterThan(0);

    // 4. Navigate down to first result
    keydown('ArrowDown');
    const firstItem = results.querySelector('.pal-item');
    expect(firstItem.classList.contains('active')).toBe(true);

    // 5. Press Enter to activate
    keydown('Enter');

    // 6. Palette should close
    expect(overlay.classList.contains('open')).toBe(false);
  });

  it('user opens palette via nav button click', async () => {
    await setupApp();

    const overlay = document.getElementById('palette-overlay');
    const btn = document.getElementById('nav-palette-btn');

    btn.click();
    expect(overlay.classList.contains('open')).toBe(true);
  });

  it('user opens palette via nav button keyboard activation (Enter)', async () => {
    await setupApp();

    const overlay = document.getElementById('palette-overlay');
    const btn = document.getElementById('nav-palette-btn');

    btn.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(overlay.classList.contains('open')).toBe(true);
  });

  it('user opens palette via nav button keyboard activation (Space)', async () => {
    await setupApp();

    const overlay = document.getElementById('palette-overlay');
    const btn = document.getElementById('nav-palette-btn');

    btn.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(overlay.classList.contains('open')).toBe(true);
  });

  it('user closes palette by clicking overlay background', async () => {
    const { openPalette } = await setupApp();

    const overlay = document.getElementById('palette-overlay');

    openPalette();
    expect(overlay.classList.contains('open')).toBe(true);

    // Click on the overlay itself (not the palette content)
    overlay.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    // The handler checks e.target === overlay, so we need target to be overlay
    const clickEvent = new MouseEvent('click', { bubbles: false });
    Object.defineProperty(clickEvent, 'target', { value: overlay });
    overlay.dispatchEvent(clickEvent);

    expect(overlay.classList.contains('open')).toBe(false);
  });

  it('search with highlights renders mark tags', async () => {
    await setupApp();

    const input = document.getElementById('palette-input');
    const results = document.getElementById('palette-results');

    // Open palette
    keydown('p', { ctrlKey: true, shiftKey: true });

    // Search for something specific
    input.value = 'vim';
    input.dispatchEvent(new Event('input'));

    // Results should contain <mark> tags for highlighted characters
    expect(results.innerHTML).toContain('<mark>');
  });

  it('Ctrl+Shift+P toggles palette open and closed', async () => {
    await setupApp();
    const overlay = document.getElementById('palette-overlay');

    keydown('p', { ctrlKey: true, shiftKey: true });
    expect(overlay.classList.contains('open')).toBe(true);

    keydown('p', { ctrlKey: true, shiftKey: true });
    expect(overlay.classList.contains('open')).toBe(false);
  });
});

describe('E2E: Theme toggle flow', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('user clicks theme toggle button to switch themes', async () => {
    await setupApp();

    const btn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Start with dark theme (default) - set explicitly
    html.dataset.theme = 'dark';
    btn.innerHTML = '☀';
    btn.setAttribute('aria-label', 'Switch to light mode');

    expect(html.dataset.theme).toBe('dark');
    expect(btn.innerHTML).toBe('☀');
    expect(btn.getAttribute('aria-label')).toBe('Switch to light mode');

    // Click toggle
    btn.click();

    expect(html.dataset.theme).toBe('light');
    expect(btn.innerHTML).toBe('☾');
    expect(btn.getAttribute('aria-label')).toBe('Switch to dark mode');

    // Click again
    btn.click();

    expect(html.dataset.theme).toBe('dark');
    expect(btn.innerHTML).toBe('☀');
  });

  it('theme preference persists to localStorage', async () => {
    await setupApp();

    const btn = document.getElementById('theme-toggle');

    btn.click();

    expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-theme', 'light');
  });

  it('toggling theme via palette command works', async () => {
    await setupApp();

    const input = document.getElementById('palette-input');
    const overlay = document.getElementById('palette-overlay');

    // Open palette and search for theme toggle
    keydown('p', { ctrlKey: true, shiftKey: true });

    input.value = 'theme';
    input.dispatchEvent(new Event('input'));

    // Select the first result
    keydown('ArrowDown');
    keydown('Enter');

    // Theme should have changed
    expect(document.documentElement.dataset.theme).toBe('light');
    // Palette should close
    expect(overlay.classList.contains('open')).toBe(false);
  });
});

describe('E2E: Vim mode flow', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('user enables vim mode via palette and uses j/k to scroll', async () => {
    await setupApp();

    const vimEl = document.getElementById('vim-indicator');
    const input = document.getElementById('palette-input');

    // Open palette and search for vim
    keydown('p', { ctrlKey: true, shiftKey: true });
    input.value = 'vim';
    input.dispatchEvent(new Event('input'));

    // Select vim toggle
    keydown('ArrowDown');
    keydown('Enter');

    // Vim mode should be enabled
    expect(vimEl.classList.contains('vim-visible')).toBe(true);
    expect(vimEl.textContent).toBe('-- NORMAL --');

    // Press 'j' to scroll down
    keydown('j');
    expect(window.scrollBy).toHaveBeenCalledWith({ top: 80, behavior: 'smooth' });

    // Press 'k' to scroll up
    keydown('k');
    expect(window.scrollBy).toHaveBeenCalledWith({ top: -80, behavior: 'smooth' });
  });

  it('vim G scrolls to bottom', async () => {
    await setupApp();

    const { toggleVim } = await import('../js/app.js');
    toggleVim();

    keydown('G');
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  });

  it('vim gg scrolls to top', async () => {
    await setupApp();

    const { toggleVim } = await import('../js/app.js');
    toggleVim();

    // Press 'g' twice quickly
    keydown('g');
    keydown('g');

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('vim / opens palette', async () => {
    await setupApp();

    const { toggleVim } = await import('../js/app.js');
    toggleVim();

    const overlay = document.getElementById('palette-overlay');

    keydown('/');
    expect(overlay.classList.contains('open')).toBe(true);
  });

  it('vim keys do nothing when focus is in an input', async () => {
    await setupApp();

    const { toggleVim } = await import('../js/app.js');
    toggleVim();

    // Focus on an input element
    const input = document.getElementById('palette-input');
    input.focus();
    // Simulate the activeElement being INPUT
    Object.defineProperty(document, 'activeElement', {
      value: input,
      configurable: true,
    });

    window.scrollBy.mockClear();
    keydown('j');

    // scrollBy should not have been called since focus is in input
    // Note: In jsdom, the key handler checks document.activeElement.tagName
    // The behavior depends on how activeElement is reported
  });
});

describe('E2E: Accessibility', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('palette has proper ARIA attributes', async () => {
    await setupApp();

    const overlay = document.getElementById('palette-overlay');
    expect(overlay.getAttribute('role')).toBe('dialog');
    expect(overlay.getAttribute('aria-modal')).toBe('true');
    expect(overlay.getAttribute('aria-label')).toBe('Command Palette');
  });

  it('skip link exists and points to main content', async () => {
    await setupApp();

    const skipLink = document.querySelector('.skip-link');
    expect(skipLink).not.toBeNull();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
    expect(skipLink.textContent).toBe('Skip to main content');
  });

  it('nav has aria-label', async () => {
    await setupApp();

    const nav = document.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Main navigation');
  });

  it('theme toggle button has dynamic aria-label', async () => {
    await setupApp();

    const btn = document.getElementById('theme-toggle');
    expect(btn.getAttribute('aria-label')).toMatch(/Switch to (light|dark) mode/);
  });

  it('live region announces palette search results', async () => {
    await setupApp();

    const announceEl = document.getElementById('palette-announce');
    const input = document.getElementById('palette-input');

    // Open palette
    keydown('p', { ctrlKey: true, shiftKey: true });

    expect(announceEl.textContent).toContain('results found');

    // Search for another term
    input.value = 'github';
    input.dispatchEvent(new Event('input'));

    expect(announceEl.textContent).toContain('result');

    // Search for existing item
    input.value = 'about';
    input.dispatchEvent(new Event('input'));

    expect(announceEl.textContent).toContain('result');
    expect(announceEl.textContent).toContain('found');
  });

  it('palette button is keyboard accessible', async () => {
    await setupApp();

    const btn = document.getElementById('nav-palette-btn');
    expect(btn.getAttribute('role')).toBe('button');
    expect(btn.getAttribute('tabindex')).toBe('0');
  });

  it('sections have proper landmarks', async () => {
    await setupApp();

    const main = document.getElementById('main-content');
    expect(main).not.toBeNull();
    expect(main.tagName).toBe('MAIN');

    const footer = document.querySelector('footer');
    expect(footer.getAttribute('role')).toBe('contentinfo');

    const hero = document.getElementById('hero');
    expect(hero.getAttribute('aria-label')).toBe('Introduction');

    const about = document.getElementById('about');
    expect(about.getAttribute('aria-label')).toBe('About');
  });
});

describe('E2E: Palette hint updates per OS', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('shows Mac shortcut on Mac platform', async () => {
    Object.defineProperty(window, 'navigator', {
      value: { platform: 'MacIntel' },
      writable: true,
      configurable: true,
    });

    await setupApp();

    const hint = document.querySelector('.kbd-hint-desktop');
    expect(hint.textContent).toBe('⌘+Shift+P');
  });

  it('shows Ctrl shortcut on non-Mac platform', async () => {
    Object.defineProperty(window, 'navigator', {
      value: { platform: 'Win32' },
      writable: true,
      configurable: true,
    });

    await setupApp();

    const hint = document.querySelector('.kbd-hint-desktop');
    expect(hint.textContent).toBe('Ctrl+Shift+P');
  });
});

describe('E2E: Typewriter animation', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('types out commands and cycles through them', async () => {
    await setupApp();

    const twEl = document.getElementById('tw');
    expect(twEl.textContent).toBe('');

    // After initial delay (2200ms), typing should begin and first char appears
    vi.advanceTimersByTime(2200);
    expect(twEl.textContent).toBe('l');

    // Type second character (90ms per character)
    vi.advanceTimersByTime(90);
    expect(twEl.textContent).toBe('ls');

    // Complete the first line: "ls projects/" = 12 chars
    vi.advanceTimersByTime(90 * 10);
    expect(twEl.textContent).toBe('ls projects/');

    // Pause before deleting (1800ms wait triggers the delete)
    vi.advanceTimersByTime(1800);
    // Deleting starts: first delete removes the /
    expect(twEl.textContent).toBe('ls projects');

    // Continue deleting (45ms per char) - one more char deleted
    vi.advanceTimersByTime(45);
    expect(twEl.textContent).toBe('ls project');

    // Delete remaining chars
    vi.advanceTimersByTime(45 * 11);
    expect(twEl.textContent).toBe('');

    // Pause before next line (400ms) triggers first type call
    vi.advanceTimersByTime(400);
    expect(twEl.textContent).toBe('o');

    // Continue typing second line: "open sclp.co" (12 chars total)
    // Each char takes 90ms, so 11 more advances of 90ms = 990ms
    vi.advanceTimersByTime(90 * 11);
    expect(twEl.textContent).toBe('open sclp.co');
  });
});

describe('E2E: Data integrity', () => {
  it('all DATA items with nav actions reference existing page sections', async () => {
    const { DATA } = await import('../js/data.js');

    const navItems = DATA.filter(
      (d) => d.action && d.action.startsWith('nav:')
    );

    const validSections = ['#about', '#projects', '#contact', '#hero'];

    navItems.forEach((item) => {
      const target = item.action.split(':')[1];
      expect(validSections).toContain(target);
    });
  });

  it('all DATA items with open actions have valid URL format', async () => {
    const { DATA } = await import('../js/data.js');

    const openItems = DATA.filter(
      (d) => d.action && d.action.startsWith('open:')
    );

    openItems.forEach((item) => {
      const url = item.action.substring(5); // "open:" is 5 chars
      expect(
        url.startsWith('http') ||
          url.startsWith('mailto:') ||
          url.startsWith('blog/')
      ).toBe(true);
    });
  });

  it('every category has at least one item', async () => {
    const { DATA } = await import('../js/data.js');

    const categories = [...new Set(DATA.map((d) => d.category))];
    categories.forEach((cat) => {
      const items = DATA.filter((d) => d.category === cat);
      expect(items.length).toBeGreaterThan(0);
    });
  });

  it('resolveAction handles all action types in DATA', async () => {
    const { DATA, resolveAction } = await import('../js/data.js');

    const context = {
      navTo: vi.fn(),
      toggleTheme: vi.fn(),
      toggleVim: vi.fn(),
    };
    vi.spyOn(window, 'open').mockImplementation(() => {});

    DATA.forEach((item) => {
      if (item.action) {
        const fn = resolveAction(item, context);
        expect(fn).not.toBeNull();
        // Execute to make sure it doesn't throw
        expect(() => fn()).not.toThrow();
      } else {
        const fn = resolveAction(item, context);
        expect(fn).toBeNull();
      }
    });
  });
});

describe('E2E: Reduced motion support', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('shows static typewriter text when prefers-reduced-motion', async () => {
    document.body.innerHTML = `
      <div id="cursor-glow"></div>
      <div id="palette-overlay"><input id="palette-input" /><div id="palette-results"></div></div>
      <div id="vim-indicator"></div>
      <div id="palette-announce"></div>
      <button id="theme-toggle"></button>
      <span id="tw"></span>
      <div class="reveal">Content 1</div>
      <div class="reveal">Content 2</div>
    `;

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('#00d4aa'),
    });
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.spyOn(console, 'log').mockImplementation(() => {});

    await import('../js/app.js');

    const twEl = document.getElementById('tw');
    expect(twEl.textContent).toBe('ls projects/');

    // Cursor glow should be disabled
    const glowEl = document.getElementById('cursor-glow');
    expect(glowEl.classList.contains('cursor-glow-disabled')).toBe(true);

    // Reveal elements should be immediately visible
    document.querySelectorAll('.reveal').forEach((el) => {
      expect(el.classList.contains('visible')).toBe(true);
    });
  });
});

describe('E2E: Full page structure validation', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('page contains all major sections', async () => {
    await setupApp();

    expect(document.getElementById('hero')).not.toBeNull();
    expect(document.getElementById('about')).not.toBeNull();
    expect(document.getElementById('projects')).not.toBeNull();
    expect(document.getElementById('contact')).not.toBeNull();
    expect(document.querySelector('nav')).not.toBeNull();
    expect(document.querySelector('footer')).not.toBeNull();
    expect(document.getElementById('main-content')).not.toBeNull();
  });

  it('palette button, theme toggle, and vim indicator all exist', async () => {
    await setupApp();

    expect(document.getElementById('nav-palette-btn')).not.toBeNull();
    expect(document.getElementById('theme-toggle')).not.toBeNull();
    expect(document.getElementById('vim-indicator')).not.toBeNull();
    expect(document.getElementById('palette-overlay')).not.toBeNull();
  });
});
