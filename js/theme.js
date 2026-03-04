/** Theme system - detection, persistence, toggle functionality */

const STORAGE_KEY = 'portfolio-theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

// Callback function to run when theme changes
let onThemeChangeCallback = null;

/**
 * Detect system theme preference
 * @returns {string} "light" or "dark"
 */
export function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches 
    ? THEME_LIGHT 
    : THEME_DARK;
}

/**
 * Get current theme (with fallback chain: explicit > localStorage > system)
 * @returns {string} "light" or "dark"
 */
export function getCurrentTheme() {
  // Check explicit data attribute first
  const explicit = document.documentElement.dataset.theme;
  if (explicit) return explicit;
  
  // Then check localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
  } catch (e) {
    // Silent fail for private browsing
  }
  
  // Fall back to system preference
  return getSystemTheme();
}

/**
 * Update the toggle button icon and aria-label based on current theme
 * @param {string} theme - "light" or "dark"
 */
function updateToggleIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  
  // Update aria-label
  btn.setAttribute('aria-label', 
    theme === THEME_DARK ? 'Switch to light mode' : 'Switch to dark mode'
  );
  
  // Update icon (sun for dark mode, moon for light mode)
  // Sun icon means clicking will switch to light
  // Moon icon means clicking will switch to dark
  btn.innerHTML = theme === THEME_DARK 
    ? '☀'  // Sun icon - clicking will switch to light
    : '☾'; // Moon icon - clicking will switch to dark
}

/**
 * Apply theme to document
 * @param {string} theme - "light" or "dark"
 * @param {boolean} triggerCallback - whether to trigger the onThemeChangeCallback (default: true)
 */
export function applyTheme(theme, triggerCallback = true) {
  document.documentElement.dataset.theme = theme;
  updateToggleIcon(theme);
  
  // Trigger callback if provided and theme actually changed
  if (triggerCallback && onThemeChangeCallback) {
    // Small delay to allow CSS variables to update
    setTimeout(onThemeChangeCallback, 50);
  }
}

/**
 * Save theme preference to localStorage
 * @param {string} theme - "light" or "dark"
 */
export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (e) {
    // Silent fail for Safari private mode
    console.log('Could not save theme preference');
  }
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme() {
  const current = getCurrentTheme();
  const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
  applyTheme(next, true); // true to trigger callback
  saveTheme(next);
}

/**
 * Setup the theme toggle button event listener
 */
function setupToggleButton() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  
  btn.addEventListener('click', toggleTheme);
  
  // Set initial icon
  updateToggleIcon(getCurrentTheme());
}

/**
 * Watch for system preference changes
 * Auto-switch only if user hasn't set explicit preference
 */
function watchSystemPreference() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  mediaQuery.addEventListener('change', (e) => {
    // Only auto-switch if user hasn't set explicit preference
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        const newTheme = e.matches ? THEME_LIGHT : THEME_DARK;
        applyTheme(newTheme);
      }
    } catch (e) {
      // Silent fail
    }
  });
}

/**
 * Initialize the theme system
 * @param {Function} onChangeCallback - Optional callback function to run when theme changes
 */
export function initTheme(onChangeCallback = null) {
  // Store the callback for later use
  onThemeChangeCallback = onChangeCallback;
  
  setupToggleButton();
  watchSystemPreference();
  
  // Ensure icon matches current theme
  updateToggleIcon(getCurrentTheme());
}
