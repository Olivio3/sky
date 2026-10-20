const menuButton = document.querySelector('.mobile-menu-btn');
const navigation = document.querySelector('.nav-links');
function closeMenu() {
  navigation.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('active');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => {
  if (!event.target.closest('.nav-container')) closeMenu();
});
window.matchMedia('(min-width: 1001px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.querySelectorAll('[data-interest]').forEach(link => {
  link.addEventListener('click', () => { document.getElementById('interest').value = link.dataset.interest; });
});
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('briefing-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const phone = form.elements.phone;
  if (phone.value.replace(/\D/g, '').length < 10) {
    phone.setCustomValidity('Informe seu WhatsApp com DDD.');
    phone.reportValidity();
    return;
  }
  phone.setCustomValidity('');
  const data = new FormData(form);
  const message = `Olá, Sky Marketing! Gostaria de solicitar uma proposta.\n\nNome: ${data.get('name')}\nNegócio: ${data.get('business')}\nWhatsApp: ${data.get('phone')}\nInteresse: ${data.get('interest')}\n\n${data.get('message') || ''}`;
  const destination = `https://wa.me/5511963605954?text=${encodeURIComponent(message)}`;
  window.location.assign(destination);
});
document.querySelector('[name="phone"]').addEventListener('input', event => event.target.setCustomValidity(''));

const siteHeader = document.querySelector('.site-header');
function updateHeader() {
  siteHeader.classList.toggle('scrolled', window.scrollY > 30);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const sitesShowcase = document.querySelector('.website-showcase');
if (sitesShowcase) {
  const group = sitesShowcase.querySelector('.sites-group');
  const duplicate = group.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  duplicate.setAttribute('inert', '');
  duplicate.querySelectorAll('img').forEach(image => { image.alt = ''; });
  sitesShowcase.querySelector('.sites-track').append(duplicate);
  const pauseButton = sitesShowcase.querySelector('.sites-pause');
  pauseButton.addEventListener('click', () => {
    const paused = sitesShowcase.classList.toggle('is-paused');
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.innerHTML = paused
      ? 'Retomar movimento <span aria-hidden="true">▶</span>'
      : 'Pausar movimento <span aria-hidden="true">Ⅱ</span>';
  });
}

document.querySelectorAll('.ambiental-carousel').forEach(carousel => {
  const slides = carousel.querySelector('.ambiental-slides');
  const count = slides.children.length;
  const counter = carousel.querySelector('.ambiental-slide-count');
  carousel.querySelectorAll('[data-slide-direction]').forEach(button => {
    button.addEventListener('click', () => {
      const current = Math.round(slides.scrollLeft / slides.clientWidth);
      const next = (current + Number(button.dataset.slideDirection) + count) % count;
      slides.scrollTo({ left: next * slides.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  });
  slides.addEventListener('scroll', () => { counter.textContent = `${Math.round(slides.scrollLeft / slides.clientWidth) + 1} / ${count}`; }, { passive: true });
});
document.querySelectorAll('.content-gallery video').forEach(video => {
  video.addEventListener('play', () => {
    document.querySelectorAll('.content-gallery video').forEach(other => { if (other !== video) other.pause(); });
  });
});

const contentGallery = document.querySelector('.content-gallery');
if (contentGallery) {
  const arrows = [...document.querySelectorAll('[data-content-direction]')];
  const updateContentArrows = () => {
    arrows[0].disabled = contentGallery.scrollLeft < 2;
    arrows[1].disabled = contentGallery.scrollLeft >= contentGallery.scrollWidth - contentGallery.clientWidth - 2;
  };
  arrows.forEach(button => button.addEventListener('click', () => {
    const card = [...contentGallery.children].find(item => !item.hidden);
    const distance = card.getBoundingClientRect().width + parseFloat(getComputedStyle(contentGallery).gap);
    contentGallery.scrollBy({ left: Number(button.dataset.contentDirection) * distance, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }));
  document.querySelectorAll('[data-client-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-client-filter]').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    contentGallery.querySelectorAll('video').forEach(video => video.pause());
    [...contentGallery.children].forEach(card => { card.hidden = button.dataset.clientFilter !== 'all' && card.dataset.client !== button.dataset.clientFilter; });
    contentGallery.scrollTo({ left: 0, behavior: 'instant' });
    updateContentArrows();
  }));
  contentGallery.addEventListener('scroll', updateContentArrows, { passive: true });
  new ResizeObserver(updateContentArrows).observe(contentGallery);
  updateContentArrows();
}
