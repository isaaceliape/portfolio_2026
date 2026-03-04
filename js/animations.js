/** Animation module - cursor glow, typewriter, and reveal animations */

/**
 * Initialize cursor glow effect that follows mouse movement
 */
export function initCursorGlow() {
  const glowEl = document.getElementById("cursor-glow");
  if (!glowEl) return;

  document.addEventListener("mousemove", (e) => {
    glowEl.style.left = e.clientX + "px";
    glowEl.style.top = e.clientY + "px";
  });
}

/**
 * Initialize typewriter animation for hero section
 * Cycles through commands: ls projects/, open sclp.co, ssh ieliape@work
 */
export function initTypewriter() {
  const twEl = document.getElementById("tw");
  if (!twEl) return;

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
 */
export function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

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
}
