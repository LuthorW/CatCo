const today = document.querySelector('#today');
const menuButton = document.querySelector('#menuButton');
const mainNav = document.querySelector('#mainNav');
const newsletterForm = document.querySelector('.newsletter-form');
const siteHeader = document.querySelector('.site-header');

if (today) {
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  today.textContent = `National City • ${formattedDate}`;
}

if (menuButton && mainNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      mainNav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
}

const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
progressBar.setAttribute('aria-hidden', 'true');
progressBar.innerHTML = '<span></span>';
document.body.prepend(progressBar);

const progressFill = progressBar.querySelector('span');
let ticking = false;

const updateScrollEffects = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(scrollTop / maxScroll, 1);

  if (progressFill) {
    progressFill.style.transform = `scaleX(${progress})`;
  }

  if (siteHeader) {
    siteHeader.classList.toggle('is-scrolled', scrollTop > 24);
  }

  ticking = false;
};

const requestScrollUpdate = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
};

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate, { passive: true });
updateScrollEffects();

const revealSelectors = [
  '.section-block',
  '.latest-panel',
  '.newsletter',
  '.top-stories',
  '.lead-story',
  '.site-footer',
  '.top-stories article',
  '.latest-list article',
  '.article-grid > *',
  '.city-layout > *',
  '.culture-grid > *',
  '.stacked-stories article',
  '.opinion-grid article',
  '.investigation-layout > *',
  '.newsletter-form',
  '.footer-brand',
  '.footer-columns > *'
];

const revealElements = Array.from(document.querySelectorAll(revealSelectors.join(', ')));

const staggerGroups = document.querySelectorAll(
  '.top-stories, .latest-list, .article-grid, .city-layout, .culture-grid, .stacked-stories, .opinion-grid, .investigation-layout, .footer-columns'
);

staggerGroups.forEach((group) => {
  Array.from(group.children).forEach((child, index) => {
    child.style.setProperty('--reveal-delay', `${Math.min(index * 80, 320)}ms`);
  });
});

revealElements.forEach((element) => element.classList.add('reveal-on-scroll'));

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -70px 0px'
  });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

if (mainNav && 'IntersectionObserver' in window) {
  const navLinks = Array.from(mainNav.querySelectorAll('a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, {
    rootMargin: '-42% 0px -50% 0px',
    threshold: 0
  });

  sections.forEach((section) => activeObserver.observe(section));
}

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = newsletterForm.querySelector('input');
    const button = newsletterForm.querySelector('button');

    if (!input.value.trim()) {
      input.focus();
      return;
    }

    const originalText = button.textContent;
    button.textContent = 'Cadastro recebido';
    button.classList.add('is-success');
    input.value = '';

    window.setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('is-success');
    }, 2400);
  });
}

// Tema claro/escuro da CatCo
const themeToggle = document.querySelector('#themeToggle');
const themeToggleLabel = document.querySelector('.theme-toggle-label');
const themeLogos = document.querySelectorAll('[data-light-src][data-dark-src]');

const setCatCoTheme = (theme) => {
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

  themeLogos.forEach((logo) => {
    logo.src = isDark ? logo.dataset.darkSrc : logo.dataset.lightSrc;
  });

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
  }

  if (themeToggleLabel) {
    themeToggleLabel.textContent = isDark ? 'Tema claro' : 'Tema escuro';
  }

  try {
    localStorage.setItem('catco-theme', isDark ? 'dark' : 'light');
  } catch (error) {}
};

(() => {
  let initialTheme = document.documentElement.getAttribute('data-theme') || 'light';

  try {
    const savedTheme = localStorage.getItem('catco-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      initialTheme = savedTheme;
    }
  } catch (error) {}

  setCatCoTheme(initialTheme);
})();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setCatCoTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}
