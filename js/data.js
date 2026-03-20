/** Data-driven architecture - DATA array for command palette */

/**
 * Main data array containing all palette items
 * Actions are stored as strings for data-driven architecture:
 * - "theme:toggle" - Toggle light/dark theme
 * - "vim:toggle" - Toggle VIM mode
 * - "nav:#section" - Navigate to section (e.g., "nav:#about")
 * - "open:url" - Open URL in new tab or mailto
 * - null - No action (informational item)
 */
export const DATA = [
  {
    category: "Theme",
    icon: "◑",
    title: "Toggle Light / Dark",
    sub: "switch color theme",
    action: "theme:toggle",
  },
  {
    category: "VIM",
    icon: "⌨",
    title: "Toggle VIM Mode",
    sub: "enable j/k/g/G// navigation",
    action: "vim:toggle",
  },
  {
    category: "Navigate",
    icon: "#",
    title: "Go to About",
    sub: "./about.sh",
    action: "nav:#about",
  },
  {
    category: "Navigate",
    icon: "#",
    title: "Go to Projects",
    sub: "ls -la ./work",
    action: "nav:#projects",
  },
  {
    category: "Navigate",
    icon: "#",
    title: "Go to Contact",
    sub: "cat contact.json",
    action: "nav:#contact",
  },
  {
    category: "Navigate",
    icon: "#",
    title: "Go to Blog",
    sub: "open blog/index.html",
    action: "open:blog/index.html",
  },
  {
    category: "Projects",
    icon: "▶",
    title: "sclp.co",
    sub: "UI engineering portfolio",
    action: "open:http://www.isaaceliape.com",
  },
  {
    category: "Projects",
    icon: "▶",
    title: "touch-typing-tool",
    sub: "Practice typing speed",
    action: "open:https://isaaceliape.github.io/typee/",
  },
  {
    category: "Projects",
    icon: "▶",
    title: "mark-board",
    sub: "File-based Kanban with AI",
    action: "open:https://github.com/isaaceliape/mark-board",
  },
  {
    category: "Projects",
    icon: "▶",
    title: "splitfair",
    sub: "Bill splitting for groups",
    action: "open:https://isaaceliape.github.io/splitfair-app/",
  },
  {
    category: "Projects",
    icon: "▶",
    title: "FASE",
    sub: "AI workflow framework for devs",
    action: "open:https://isaaceliape.github.io/FASE/",
  },
  {
    category: "Projects",
    icon: "▶",
    title: "unum-ireland",
    sub: "Global insurance platform UI",
    action: "open:https://www.unum.com",
  },
  {
    category: "Contact",
    icon: "✉",
    title: "Email",
    sub: "isaaceliape@me.com",
    action: "open:mailto:isaaceliape@me.com",
  },
  {
    category: "Contact",
    icon: "✉",
    title: "LinkedIn",
    sub: "linkedin.com/in/isaaceliape",
    action: "open:https://linkedin.com/in/isaaceliape",
  },
  {
    category: "Contact",
    icon: "✉",
    title: "GitHub",
    sub: "github.com/isaaceliape",
    action: "open:https://github.com/isaaceliape",
  },
  {
    category: "Contact",
    icon: "✉",
    title: "X / Twitter",
    sub: "x.com/isaaceliape",
    action: "open:https://x.com/isaaceliape",
  },
];

/**
 * Resolve action string to executable function
 * @param {Object} item - The DATA item with action string
 * @param {Object} context - Context containing functions needed for resolution
 * @param {Function} context.navTo - Navigation function
 * @param {Function} context.toggleTheme - Theme toggle function
 * @param {Function} context.toggleVim - Vim toggle function
 * @returns {Function|null} Executable function or null
 */
export function resolveAction(item, context) {
  if (!item.action) return null;

  const colonIdx = item.action.indexOf(":");
  const type = item.action.slice(0, colonIdx);
  const value = item.action.slice(colonIdx + 1);

  switch (type) {
    case "theme":
      return context.toggleTheme;
    case "vim":
      return context.toggleVim;
    case "nav":
      return () => context.navTo(value);
    case "open":
      return () => {
        if (value.startsWith("mailto:")) {
          window.location.href = value;
        } else {
          window.open(value, "_blank");
        }
      };
    default:
      console.warn(`Unknown action type: ${type}`);
      return null;
  }
}
