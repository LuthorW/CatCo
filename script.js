const today = document.querySelector('#today');
const menuButton = document.querySelector('#menuButton');
const mainNav = document.querySelector('#mainNav');
const newsletterForm = document.querySelector('.newsletter-form');

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
}

const revealElements = document.querySelectorAll(
  '.section-block, .latest-panel, .newsletter, .top-stories, .lead-story'
);

revealElements.forEach((element) => element.classList.add('reveal-on-scroll'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -80px 0px'
});

revealElements.forEach((element) => observer.observe(element));

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = newsletterForm.querySelector('input');
    const button = newsletterForm.querySelector('button');

    if (!input.value.trim()) {
      input.focus();
      return;
    }

    button.textContent = 'Cadastro recebido';
    input.value = '';
  });
}
