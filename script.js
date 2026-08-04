// ==========================================================================
// main.js
// Scope: footer year, mobile nav toggle, full-screen boot overlay,
// hero status line, floating AI-speaking ping.
// Theme toggle LOGIC is intentionally deferred to Day 8 (see project plan) —
// the button is wired for a11y/visual state only right now.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  initNavBurger();
  initThemeTogglePlaceholder();
  initBootOverlay();
  initBootAnimation();
  initAiPing();
  initSkillBars();
  initCvViewer();
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
    'status: available for hire',
    'stack: secure fintech systems',
    'currently shipping: payment infrastructure',
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

/* ---- Full-screen boot overlay (runs once, before content is revealed) ---- */
function initBootOverlay() {
  const overlay = document.getElementById('boot-overlay');
  const logEl = document.getElementById('boot-log');
  const fillEl = document.getElementById('boot-progress-fill');
  const pctEl = document.getElementById('boot-progress-pct');
  if (!overlay || !logEl || !fillEl || !pctEl) return;

  const lines = [
    'Booting system',
    'Initializing boot sequence...',
    'Loading core modules...',
    'Authenticating user access...',
    'Establishing secure connection...',
    'Loading portfolio assets...',
    'Compiling interface components...',
    'Rendering network visualization...',
  ];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Respect reduced-motion users: skip the sequence, remove the overlay immediately.
  if (reduceMotion) {
    overlay.remove();
    return;
  }

  document.body.classList.add('boot-lock');

  const LINE_DELAY = 260;
  const END_HOLD = 450;
  let i = 0;

  function addLine() {
    if (i >= lines.length) {
      setTimeout(finishBoot, END_HOLD);
      return;
    }

    const li = document.createElement('li');
    li.className = 'boot-log__line';
    li.innerHTML = `<span>&gt; ${lines[i]}</span><span class="boot-log__check">[\u2713]</span>`;
    logEl.appendChild(li);
    requestAnimationFrame(() => li.classList.add('is-visible'));

    const progress = Math.min(100, Math.round(((i + 1) / lines.length) * 100));
    fillEl.style.width = progress + '%';
    pctEl.textContent = progress + '%';

    i++;
    setTimeout(addLine, LINE_DELAY);
  }

  function finishBoot() {
    overlay.classList.add('is-done');
    document.body.classList.remove('boot-lock');
    setTimeout(() => overlay.remove(), 550);
  }

  addLine();
}

/* ---- Floating "AI speaking" ping — slides in/out on the right edge on a loop ---- */
function initAiPing() {
  const ping = document.getElementById('ai-ping');
  const msgEl = document.getElementById('ai-ping-message');
  if (!ping || !msgEl) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const messages = [
    'Currently reviewing a fraud-detection edge case.',
    'Tip: every project below shipped to production.',
    'This site stores nothing about you — no tracking.',
    'Ask about the stack — it is all under Technologies.',
  ];

  let index = 0;
  const INITIAL_DELAY = 3400;
  const SHOW_TIME = 4200;
  const GAP_TIME = 3400;

  function cycle() {
    msgEl.textContent = messages[index % messages.length];
    ping.classList.add('is-visible');

    setTimeout(() => {
      ping.classList.remove('is-visible');
      index++;
      setTimeout(cycle, GAP_TIME);
    }, SHOW_TIME);
  }

  setTimeout(cycle, INITIAL_DELAY);
}

/* ---- Technologies: animate skill bars in once, on scroll into view ---- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fill(bar) {
    const level = parseInt(bar.dataset.level, 10) || 0;
    const fillEl = bar.querySelector('.skill-bar__fill');
    const valueEl = bar.querySelector('.skill-bar__value');
    if (!fillEl || !valueEl) return;

    if (reduceMotion) {
      fillEl.style.width = level + '%';
      valueEl.textContent = level + '%';
      return;
    }

    fillEl.style.width = level + '%';

    // Count the label up alongside the width transition (roughly 1s, matches CSS).
    const DURATION = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min(1, (now - start) / DURATION);
      valueEl.textContent = Math.round(progress * level) + '%';
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (!('IntersectionObserver' in window)) {
    bars.forEach(fill); // fallback: just fill them
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fill(entry.target);
          obs.unobserve(entry.target); // animate once, then stay filled
        }
      });
    },
    { threshold: 0.35 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* ---- About page: non-downloadable CV viewer, rendered to <canvas> via pdf.js ---- */
function initCvViewer() {
  const viewer = document.getElementById('cv-viewer');
  const pagesEl = document.getElementById('cv-viewer-pages');
  const statusEl = document.getElementById('cv-viewer-status');
  const prevBtn = document.getElementById('cv-prev');
  const nextBtn = document.getElementById('cv-next');
  const indicator = document.getElementById('cv-page-indicator');
  if (!viewer || !pagesEl) return;

  if (typeof pdfjsLib === 'undefined') {
    if (statusEl) statusEl.textContent = 'CV preview unavailable — pdf.js failed to load.';
    return;
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const src = viewer.dataset.src;
  let pdfDoc = null;
  let currentPage = 1;

  // Block the easy right-click "save image as" path on the rendered canvas.
  viewer.addEventListener('contextmenu', (e) => e.preventDefault());

  function renderPage(num) {
    pdfDoc.getPage(num).then((page) => {
      const viewport = page.getViewport({ scale: 1.3 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      page.render({ canvasContext: ctx, viewport }).promise.then(() => {
        pagesEl.innerHTML = '';
        pagesEl.appendChild(canvas);
      });
    });

    currentPage = num;
    if (indicator) indicator.textContent = `${num} / ${pdfDoc.numPages}`;
    if (prevBtn) prevBtn.disabled = num <= 1;
    if (nextBtn) nextBtn.disabled = num >= pdfDoc.numPages;
  }

  pdfjsLib.getDocument(src).promise
    .then((doc) => {
      pdfDoc = doc;
      renderPage(1);
    })
    .catch(() => {
      if (statusEl) statusEl.textContent = 'CV preview unavailable right now.';
    });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (pdfDoc && currentPage > 1) renderPage(currentPage - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (pdfDoc && currentPage < pdfDoc.numPages) renderPage(currentPage + 1);
    });
  }
}