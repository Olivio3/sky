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
