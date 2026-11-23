// UI polish layer. Everything here is additive: the deck still works without it.
(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  // Staggered entrance: each direct child of a slide gets its own delay index.
  slides.forEach(slide => {
    [...slide.children].forEach((el, i) => el.style.setProperty('--i', i));
  });

  // Clickable progress dots on top of the progress bar.
  const progress = document.querySelector('.progress');
  const dots = slides.map((s, i) => {
    const b = document.createElement('button');
    b.className = 'dot';
    b.style.left = `${(i + 0.5) / slides.length * 100}%`;
    b.setAttribute('aria-label', `Aller à : ${s.dataset.title}`);
    b.title = s.dataset.title;
    b.onclick = () => window.showSlide(i);
    progress.append(b);
    return b;
  });

  // Count-up for the "16 étapes" figure when its slide opens.
  const figure = document.querySelector('.gr-baseline > strong');
  const target = figure ? parseInt(figure.textContent, 10) : NaN;
  const suffix = figure ? figure.textContent.replace(/^\d+/, '') : '';
  let timer = 0;
  function countUp() {
    if (!figure || Number.isNaN(target)) return;
    clearTimeout(timer);
    if (reduced.matches) { figure.textContent = target + suffix; return; }
    // Wait for the slide transition, then count 1, 2, 3... one step at a time,
    // slowing slightly towards the end.
    const stepMs = 130;
    let n = 0;
    figure.textContent = '0' + suffix;
    const step = () => {
      n++;
      figure.textContent = n + suffix;
      if (n < target) timer = setTimeout(step, stepMs + Math.max(0, n - target + 5) * 45);
    };
    timer = setTimeout(step, 1000);
  }

  function sync(index) {
    dots.forEach((d, i) => {
      d.classList.toggle('done', i < index);
      d.classList.toggle('current', i === index);
    });
    if (slides[index].classList.contains('gr-intro')) countUp();
  }

  window.addEventListener('slidechange', e => sync(e.detail.index));
  sync(Math.max(0, slides.findIndex(s => s.classList.contains('active'))));

  // Subtle pointer parallax on the hero badge (desktop pointers only).
  const art = document.querySelector('.hero-art');
  if (art && matchMedia('(pointer: fine)').matches) {
    document.addEventListener('pointermove', e => {
      if (reduced.matches) return;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      art.style.setProperty('--px', x.toFixed(3));
      art.style.setProperty('--py', y.toFixed(3));
    }, { passive: true });
  }
})();
