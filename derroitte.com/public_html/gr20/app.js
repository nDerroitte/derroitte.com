const slides = [...document.querySelectorAll('.slide')];
const menu = document.querySelector('#menu');
let current = 0;

const sheet = window.GR20_SHEET || '#';   // set in config.js (not committed)
document.querySelectorAll('.sheet-link').forEach(a => a.href = sheet);

const pad = n => String(n).padStart(2, '0');

function show(n) {
  const previous = current;
  current = Math.max(0, Math.min(slides.length - 1, n));
  document.body.dataset.dir = current < previous ? 'back' : 'forward';
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === current);
    s.inert = i !== current;
    s.setAttribute('aria-hidden', i !== current);
  });
  slides[current].scrollTop = 0;
  document.querySelector('#count').textContent = `${pad(current + 1)} / ${pad(slides.length)}`;
  document.querySelector('#chapter').textContent = slides[current].dataset.title;
  document.querySelector('#progress').style.width = (current + 1) / slides.length * 100 + '%';
  document.querySelector('#prev').disabled = current === 0;
  document.querySelector('#next').disabled = current === slides.length - 1;
  history.replaceState(null, '', '#' + (current + 1));
  window.dispatchEvent(new CustomEvent('slidechange', { detail: { index: current } }));
}
window.showSlide = show;

document.querySelector('#prev').onclick = () => show(current - 1);
// A slide can intercept 'next' (e.g. to reveal one more participant).
function next() { if (window.beforeNext && window.beforeNext()) return; show(current + 1); }
document.querySelector('#next').onclick = next;
document.querySelectorAll('[data-next]').forEach(b => b.onclick = next);
document.querySelector('.brand').onclick = e => { e.preventDefault(); show(0); };

slides.forEach((s, i) => {
  const b = document.createElement('button');
  b.innerHTML = `<span>${pad(i + 1)}</span>${s.dataset.title}`;
  b.onclick = () => { menu.close(); show(i); };
  document.querySelector('#menu-items').append(b);
});
document.querySelector('#overview').onclick = () => menu.showModal();
document.querySelector('#close-menu').onclick = () => menu.close();
menu.addEventListener('click', e => { if (e.target === menu) menu.close(); });

async function fullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    const btn = document.querySelector('#full');
    btn.textContent = 'Indisponible';
    btn.title = 'Le plein écran n’est pas disponible dans ce navigateur.';
  }
}
document.querySelector('#full').onclick = fullscreen;

document.addEventListener('keydown', e => {
  if (document.querySelector('dialog[open]') || e.target.closest('input,select,textarea') || e.target.isContentEditable) return;
  if (e.key === ' ' && e.target.closest('button,a,summary')) return;
  if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
  if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); show(current - 1); }
  if (e.key === 'Home') show(0);
  if (e.key === 'End') show(slides.length - 1);
  if (e.key.toLowerCase() === 'f') fullscreen();
});

let startX = 0, startY = 0;
const main = document.querySelector('main');
main.addEventListener('touchstart', e => {
  startX = e.changedTouches[0].clientX;
  startY = e.changedTouches[0].clientY;
}, { passive: true });
main.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX;
  const dy = e.changedTouches[0].clientY - startY;
  if (Math.abs(dx) > 90 && Math.abs(dx) > Math.abs(dy) * 2) (dx < 0 ? next() : show(current - 1));
}, { passive: true });

// "Comment participer ?" option cards. The original site routed this text through
// the ChatGPT-hosted text editor; it is now written directly.
const choices = [
  'Toute la rando puis la villa : prévoir la durée complète, la préparation et un rythme compatible avec la traversée retenue.',
  'Un bout de rando puis la villa : identifier ensemble un point de jonction accessible et une portion adaptée.',
  'Juste la villa : coordonner les dates et l’arrivée pour rejoindre le groupe après la randonnée.'
];
const optionDetail = document.querySelector('#option-detail');
document.querySelectorAll('[data-option]').forEach(b => b.onclick = () => {
  document.querySelectorAll('[data-option]').forEach(x => {
    x.classList.toggle('selected', x === b);
    x.setAttribute('aria-pressed', x === b);
  });
  if (!optionDetail) return;
  optionDetail.textContent = choices[+b.dataset.option];
  optionDetail.classList.remove('swap');
  void optionDetail.offsetWidth;
  optionDetail.classList.add('swap');
});

show((parseInt(location.hash.slice(1)) || 1) - 1);
