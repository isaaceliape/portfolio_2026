/** Main application logic - palette, navigation, vim mode, event handlers */

import { DATA, resolveAction } from "./data.js";
import { fuzzy, esc, highlight } from "./utils.js";
import { initAnimations } from "./animations.js";
import { initTheme, toggleTheme } from "./theme.js";

// DOM Element References
const glowEl = document.getElementById("cursor-glow");
const overlay = document.getElementById("palette-overlay");
const input = document.getElementById("palette-input");
const results = document.getElementById("palette-results");
const vimEl = document.getElementById("vim-indicator");
const announceEl = document.getElementById("palette-announce");

// Palette State
let activeIdx = -1;
let filtered = [];

// Vim Mode State
let vimMode = false;
let gPressed = false;
let gTimer = null;

/**
 * Navigate to a section by selector
 * @param {string} id - CSS selector for the target element
 */
export function navTo(id) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
}

/**
 * Set VIM mode indicator message
 * @param {string} msg - Message to display
 */
function setVimMsg(msg) {
  if (vimEl) vimEl.textContent = msg;
}

/**
 * Toggle VIM navigation mode
 * Enables j/k/G/gg navigation and / for palette
 */
export function toggleVim() {
  vimMode = !vimMode;
  if (vimEl) vimEl.style.opacity = vimMode ? "1" : "0";
  if (vimMode) setVimMsg("-- NORMAL --");
}

// Palette Functions

/**
 * Generate HTML for a palette item
 * @param {Object} item - The data item
 * @param {number} idx - Index of the item
 * @param {string} titleHtml - HTML for the title (possibly highlighted)
 * @param {string} subHtml - HTML for the subtitle (possibly highlighted)
 * @returns {string} HTML string for the item
 */
function itemHTML(item, idx, titleHtml, subHtml) {
  const sub = subHtml !== null ? subHtml : esc(item.sub);
  const badge = item.action ? '<span class="pal-item-badge">↵ open</span>' : "";
  return `<div class="pal-item" data-idx="${idx}">
  <span class="pal-item-icon">${item.icon}</span>
  <span class="pal-item-body">
    <div class="pal-item-title">${titleHtml}</div>
    <div class="pal-item-sub">${sub}</div>
  </span>${badge}</div>`;
}

/**
 * Attach event listeners to palette items
 */
function attachItemEvents() {
  document.querySelectorAll(".pal-item").forEach((el) => {
    el.addEventListener("mouseenter", () => setActive(+el.dataset.idx));
    el.addEventListener("click", () => activate(+el.dataset.idx));
  });
}

/**
 * Set the active item in the palette
 * @param {number} idx - Index of the item to activate
 */
function setActive(idx) {
  activeIdx = idx;
  document
    .querySelectorAll(".pal-item")
    .forEach((el) => el.classList.toggle("active", +el.dataset.idx === idx));
}

/**
 * Activate (execute) the selected item
 * @param {number} idx - Index of the item to activate
 */
function activate(idx) {
  const item = filtered[idx];
  if (item?.action) {
    const actionFn = resolveAction(item, { navTo, toggleTheme, toggleVim });
    if (actionFn) {
      actionFn();
      closePalette();
    }
  }
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
function announce(message) {
  if (announceEl) {
    announceEl.textContent = message;
  }
}

/**
 * Render the palette with optional search query
 * @param {string} query - Search query string (empty shows all)
 */
function render(query) {
  activeIdx = -1;
  const q = query.trim();

  if (!q) {
    // Show all items grouped by category
    filtered = [...DATA];
    const cats = [...new Set(DATA.map((d) => d.category))];
    results.innerHTML = cats
      .map((cat) => {
        const items = DATA.filter((d) => d.category === cat);
        return (
          `<div class="pal-section-label">${cat}</div>` +
          items
            .map((item) => itemHTML(item, DATA.indexOf(item), item.title, null))
            .join("")
        );
      })
      .join("");
  } else {
    // Filter and score items by fuzzy search
    const scored = DATA.map((item) => {
      const t = fuzzy(item.title, q);
      const s = fuzzy(item.sub, q);
      const best = t && s ? (t.score >= s.score ? t : s) : t || s;
      return best
        ? {
            item,
            score: best.score,
            indices: t
              ? { title: t.indices, sub: [] }
              : { title: [], sub: s.indices },
          }
        : null;
    })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);

    filtered = scored.map((r) => r.item);

    if (!scored.length) {
      results.innerHTML = "";
      return;
    }

    results.innerHTML = scored
      .map((r, i) =>
        itemHTML(
          r.item,
          i,
          highlight(r.item.title, r.indices.title),
          highlight(r.item.sub, r.indices.sub),
        ),
      )
      .join("");
  }

  attachItemEvents();

  // Announce results to screen readers
  if (filtered.length > 0) {
    announce(
      `${filtered.length} result${filtered.length === 1 ? "" : "s"} found`,
    );
  } else if (q) {
    announce("No results found");
  }
}

/**
 * Trap focus within an element (for modal dialogs)
 * @param {HTMLElement} element - The element to trap focus within
 */
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])',
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  });
}

/**
 * Open the command palette
 */
export function openPalette() {
  if (!overlay || !input) return;
  overlay.classList.add("open");
  input.value = "";
  render("");
  setTimeout(() => input.focus(), 50);
  trapFocus(overlay);
}

/**
 * Close the command palette
 */
export function closePalette() {
  if (!overlay) return;
  overlay.classList.remove("open");
}

/**
 * Setup all event listeners for the application
 */
function setupEventListeners() {
  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    const paletteOpen = overlay?.classList.contains("open");
    const inInput = ["INPUT", "TEXTAREA"].includes(
      document.activeElement?.tagName,
    );

    // Toggle palette with Ctrl/Cmd+Shift+P
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "p") {
      e.preventDefault();
      paletteOpen ? closePalette() : openPalette();
      return;
    }

    // Palette navigation
    if (paletteOpen) {
      const items = document.querySelectorAll(".pal-item");

      if (e.key === "Escape") {
        closePalette();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const n = Math.min(activeIdx + 1, filtered.length - 1);
        setActive(n);
        items[n]?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const n = Math.max(activeIdx - 1, 0);
        setActive(n);
        items[n]?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        if (activeIdx >= 0) activate(activeIdx);
      }
      return;
    }

    // Vim mode navigation
    if (!vimMode || inInput) return;

    switch (e.key) {
      case "j":
        e.preventDefault();
        window.scrollBy({ top: 80, behavior: "smooth" });
        break;
      case "k":
        e.preventDefault();
        window.scrollBy({ top: -80, behavior: "smooth" });
        break;
      case "G":
        e.preventDefault();
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
        setVimMsg("-- NORMAL -- [G: bottom]");
        setTimeout(() => setVimMsg("-- NORMAL --"), 1200);
        break;
      case "g":
        e.preventDefault();
        if (gPressed) {
          clearTimeout(gTimer);
          gPressed = false;
          window.scrollTo({ top: 0, behavior: "smooth" });
          setVimMsg("-- NORMAL -- [gg: top]");
          setTimeout(() => setVimMsg("-- NORMAL --"), 1200);
        } else {
          gPressed = true;
          gTimer = setTimeout(() => {
            gPressed = false;
          }, 500);
        }
        break;
      case "/":
        e.preventDefault();
        openPalette();
        break;
      case "Escape":
        setVimMsg("-- NORMAL --");
        break;
    }
  });

  // Search input listener
  input?.addEventListener("input", () => render(input.value));

  // Close palette when clicking overlay
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closePalette();
  });

  // Palette button in navbar (with keyboard support)
  const navPaletteBtn = document.getElementById("nav-palette-btn");
  if (navPaletteBtn) {
    navPaletteBtn.addEventListener("click", openPalette);
    navPaletteBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPalette();
      }
    });
  }
}

/**
 * Print ASCII art and contact info to console with current theme colors
 * Called on init and whenever theme changes
 */
export function printConsoleArt() {
  // Get current accent color from CSS variables (changes with theme)
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00d4aa';
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#c8c8c8';

  console.log(
    `%c
 ██╗  ██╗ ██╗ ██████╗  ███████╗     ███╗   ███╗ ███████╗             ██████╗
 ██║  ██║ ██║ ██╔══██╗ ██╔════╝     ████╗ ████║ ██╔════╝     ██████╗ ██╔══██╗
 ███████║ ██║ ██████╔╝ █████╗       ██╔████╔██║ █████╗       ╚═════╝ ██║  ██║
 ██╔══██║ ██║ ██╔══██╗ ██╔══╝       ██║╚██╔╝██║ ██╔══╝       ██████╗ ██║  ██║
 ██║  ██║ ██║ ██║  ██║ ███████╗     ██║ ╚═╝ ██║ ███████╗     ╚═════╝ ██████╔╝
 ╚═╝  ╚═╝ ╚═╝ ╚═╝  ╚═╝ ╚══════╝     ╚═╝     ╚═╝ ╚══════╝             ╚═════╝
    `,
    `color: ${accentColor}; font-family: monospace; font-weight: bold;`,
  );

  console.log(
    `%c👋 Hello! Thanks for checking out my portfolio.\n\n` +
      `📧 Email: isaaceliape@me.com\n` +
      `💼 LinkedIn: linkedin.com/in/isaaceliape\n` +
      `💻 GitHub: github.com/isaaceliape\n` +
      `🐦 X/Twitter: x.com/isaaceliape\n\n` +
      `Open to new opportunities, collaborations & frontend chat!`,
    `color: ${textColor}; font-family: "JetBrains Mono", monospace; font-size: 13px;`,
  );
}

/**
 * Initialize the application
 */
function init() {
  initTheme(refreshConsoleOnThemeChange);
  initAnimations();
  setupEventListeners();

  printConsoleArt();
  console.log("Portfolio app initialized");
}

/**
 * Callback function to refresh console when theme changes
 */
function refreshConsoleOnThemeChange() {
  console.clear();
  printConsoleArt();
  console.log("Theme changed — colors updated");
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// All key functions already exported at function definitions
export { toggleTheme };
