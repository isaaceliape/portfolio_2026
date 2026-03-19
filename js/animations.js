/** Animation module - cursor glow, typewriter, reveal animations, and WebGL ASCII art */
import { initAsciiWebGL } from './ascii-webgl.js';

/**
 * Check if user prefers reduced motion
 * @returns {boolean} true if user prefers reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initialize cursor glow effect that follows mouse movement
 * Respects prefers-reduced-motion preference
 */
export function initCursorGlow() {
  const glowEl = document.getElementById("cursor-glow");
  if (!glowEl) return;

  // Disable cursor glow for users who prefer reduced motion
  if (prefersReducedMotion()) {
    glowEl.classList.add('cursor-glow-disabled');
    return;
  }

  document.addEventListener("mousemove", (e) => {
    glowEl.style.setProperty('--cursor-x', e.clientX + "px");
    glowEl.style.setProperty('--cursor-y', e.clientY + "px");
  });
}

/**
 * Initialize typewriter animation for hero section
 * Cycles through commands: ls projects/, open sclp.co, ssh ieliape@work
 * Respects prefers-reduced-motion preference
 */
export function initTypewriter() {
  const twEl = document.getElementById("tw");
  if (!twEl) return;

  // Show first line immediately without animation for reduced motion
  if (prefersReducedMotion()) {
    twEl.textContent = 'ls projects/';
    return;
  }

  const twLines = ["ls projects/", "open sclp.co", "ssh ieliape@work"];
  let twLi = 0,
    twCi = 0,
    twDel = false;

  function type() {
    const line = twLines[twLi];
    if (!twDel) {
      twEl.textContent = line.slice(0, ++twCi);
      if (twCi === line.length) {
        twDel = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 90);
    } else {
      twEl.textContent = line.slice(0, --twCi);
      if (twCi === 0) {
        twDel = false;
        twLi = (twLi + 1) % twLines.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 45);
    }
  }

  // Start animation after initial delay
  setTimeout(type, 2200);
}

/**
 * Initialize reveal animations using IntersectionObserver
 * Elements with .reveal class fade in and slide up when scrolled into view
 * Respects prefers-reduced-motion preference
 */
export function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  // Make all reveal elements visible immediately for reduced motion
  if (prefersReducedMotion()) {
    revealElements.forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  revealElements.forEach((el) => revealObs.observe(el));
}

/**
 * Initialize all animations
 * Call this on DOMContentLoaded or when DOM is ready
 */
export function initAnimations() {
  initCursorGlow();
  initTypewriter();
  initRevealAnimations();
  initAsciiWebGL();
}
