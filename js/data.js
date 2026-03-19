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
    category: "Profile",
    icon: "@",
    title: "Isaac Eliape",
    sub: "Frontend Engineer · Dublin, Ireland",
    action: null,
  },
  {
    category: "Profile",
    icon: "@",
    title: "10+ years experience",
    sub: "Commercial UI engineering",
    action: null,
  },
  {
    category: "Profile",
    icon: "@",
    title: "Based in Dublin",
    sub: "Originally from Brazil 🇧🇷",
    action: null,
  },
  {
    category: "Profile",
    icon: "@",
    title: "Bilingual",
    sub: "Portuguese (native) · English (fluent)",
    action: null,
  },
  {
    category: "Profile",
    icon: "@",
    title: "Currently @ Unum Ireland",
    sub: "Frontend Developer",
    action: null,
  },
  {
    category: "Profile",
    icon: "@",
    title: "B.Sc. Systems and Web Technologies",
    sub: "Centro Universitário Senac",
    action: null,
  },
  {
    category: "Skills",
    icon: "$",
    title: "JavaScript",
    sub: "Core language",
    action: null,
  },
  {
    category: "Skills",
    icon: "$",
    title: "TypeScript",
    sub: "Typed JavaScript",
    action: null,
  },
  {
    category: "Skills",
    icon: "$",
    title: "React",
    sub: "UI framework",
    action: null,
  },
  {
    category: "Skills",
    icon: "$",
    title: "CSS & HTML",
    sub: "Styling & markup",
    action: null,
  },
  {
    category: "Skills",
    icon: "$",
    title: "Animations",
    sub: "Motion & interaction",
    action: null,
  },
  {
    category: "Skills",
    icon: "$",
    title: "API Integrations",
    sub: "REST, CMS, third-party",
    action: null,
  },
  {
    category: "Skills",
    icon: "$",
    title: "Accessibility",
    sub: "WCAG, semantic HTML",
    action: null,
  },
  {
    category: "Tools",
    icon: "⚙",
    title: "Zed",
    sub: "Fast, minimal, multiplayer editor",
    action: null,
  },
  {
    category: "Tools",
    icon: "⚙",
    title: "Ghostty",
    sub: "GPU-accelerated terminal",
    action: null,
  },
  {
    category: "Tools",
    icon: "⚙",
    title: "Opencode",
    sub: "AI coding agent in the terminal",
    action: null,
  },
  {
    category: "Tools",
    icon: "⚙",
    title: "Tmux",
    sub: "Persistent sessions, panes & windows",
    action: null,
  },
  {
    category: "Tools",
    icon: "⚙",
    title: "fzf · ripgrep · eza · bat · zoxide · jq",
    sub: "CLI tools",
    action: null,
  },
  {
    category: "Awards",
    icon: "★",
    title: "Cannes Lions ×2",
    sub: "International advertising awards",
    action: null,
  },
  {
    category: "Awards",
    icon: "★",
    title: "Awwwards ×3",
    sub: "Web design recognition",
    action: null,
  },
  {
    category: "Awards",
    icon: "★",
    title: "CSS Awards",
    sub: "cssawards.com",
    action: null,
  },
  {
    category: "Awards",
    icon: "★",
    title: "CSS Light",
    sub: "csslightbox.com",
    action: null,
  },
  {
    category: "Awards",
    icon: "★",
    title: "CSS Nectar",
    sub: "cssnectar.com",
    action: null,
  },
  {
    category: "Awards",
    icon: "★",
    title: "Site Inspire",
    sub: "siteinspire.com",
    action: null,
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
    title: "task-time-tracker",
    sub: "Time → money converter",
    action: "open:https://github.com/isaaceliape",
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

  const [type, value] = item.action.split(":");

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
