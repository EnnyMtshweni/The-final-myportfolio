// ==========================================================================
// main.js
// Day 1-3 scope: footer year, mobile nav toggle, terminal boot-up animation.
// Theme toggle LOGIC is intentionally deferred to Day 8 (see project plan) —
// the button is wired for a11y/visual state only right now.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  initNavBurger();
  initThemeTogglePlaceholder();
  initBootAnimation();
});

/* ---- Footer year ---- */
function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---- Mobile nav burger ---- */
function initNavBurger() {
  const burger = document.getElementById('nav-burger');
  if (!burger) return;

  burger.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---- Theme toggle (visual placeholder only — Day 8 wires the real logic) ---- */
function initThemeTogglePlaceholder() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    // Day 8 TODO: swap html[data-theme], persist choice (e.g. localStorage).
    console.info('Theme toggle clicked — logic scheduled for Day 8.');
  });
}

/* ---- Terminal boot-up animation (Home hero, runs once on load) ---- */
function initBootAnimation() {
  const line = document.getElementById('boot-line');
  if (!line) return;

  const messages = [
    'booting profile.sh ...',
    'auth: verified',
    'status: available for hire',
  ];

  let msgIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const TYPE_SPEED = 45;
  const DELETE_SPEED = 25;
  const HOLD_TIME = 1400;

  function tick() {
    const current = messages[msgIndex];

    if (!deleting) {
      charIndex++;
      line.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        if (msgIndex === messages.length - 1) return; // stop on final line, leave it displayed
        deleting = true;
        setTimeout(tick, HOLD_TIME);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      line.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        msgIndex++;
        setTimeout(tick, TYPE_SPEED);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
}