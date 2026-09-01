const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal on scroll
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

// Theme toggle (persisted)
const root = document.documentElement;
const themeToggle = document.querySelector('[data-theme-toggle]');
const storedTheme = localStorage.getItem('theme');
if (storedTheme) root.setAttribute('data-theme', storedTheme);

function syncThemeToggle() {
  if (!themeToggle) return;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
  themeToggle.textContent = current === 'dark' ? '☀' : '☾';
  themeToggle.setAttribute('aria-label', current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
syncThemeToggle();

themeToggle?.addEventListener('click', () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  syncThemeToggle();
});

// Scroll progress bar
const progressBar = document.querySelector('.scroll-progress');
if (progressBar) {
  const updateProgress = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const ratio = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    progressBar.style.width = ratio + '%';
  };
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navCollapsible = document.querySelector('.nav-collapsible');
navToggle?.addEventListener('click', () => {
  const isOpen = navCollapsible.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navCollapsible?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navCollapsible.classList.remove('open'));
});

// Typewriter role rotator
const rotator = document.querySelector('[data-roles]');
if (rotator) {
  const roles = JSON.parse(rotator.getAttribute('data-roles'));
  const span = rotator.querySelector('.role-text');
  if (reduceMotion || !span) {
    if (span) span.textContent = roles[0];
  } else {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const tick = () => {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex += 1;
        span.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1500);
          return;
        }
      } else {
        charIndex -= 1;
        span.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 65);
    };
    tick();
  }
}

// Animated counters
const counters = document.querySelectorAll('[data-counter]');
if (counters.length) {
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) {
      el.textContent = prefix + target + suffix;
      return;
    }
    const duration = 1300;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => counterObserver.observe(c));
  } else {
    counters.forEach(animateCounter);
  }
}

// Filter chips (timeline / projects)
document.querySelectorAll('[data-filter-group]').forEach((group) => {
  const items = document.querySelectorAll(group.getAttribute('data-filter-group'));
  group.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      group.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-filter');
      items.forEach((item) => {
        item.hidden = filter !== 'all' && item.getAttribute('data-type') !== filter;
      });
    });
  });
});

// Cursor spotlight on hero
const spotlightHost = document.querySelector('.hero-section');
if (spotlightHost && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
  spotlightHost.addEventListener('mousemove', (event) => {
    const rect = spotlightHost.getBoundingClientRect();
    spotlightHost.style.setProperty('--x', `${event.clientX - rect.left}px`);
    spotlightHost.style.setProperty('--y', `${event.clientY - rect.top}px`);
  });
}
