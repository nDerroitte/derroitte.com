// "Qui va où ?" slide: participants enter one by one, then get dragged into a formula.
(() => {
  const slide = document.querySelector('.sorter');
  if (!slide) return;
  const STORE = 'gr20-sorter-v2';
  // Default formula of each participant (entry order = this order).
  const DEFAULT = {
    ben: 'a', nat: 'a', coline: 'a', eme: 'a', jojo: 'a', mimi: 'a', sami: 'a',
    ju: 'b',
    choup: 'c', estel: 'c', lolo: 'c',
    tom: 'u', melv: 'u'
  };
  const PEOPLE = Object.keys(DEFAULT);
  const label = n => n.charAt(0).toUpperCase() + n.slice(1);

  const zones = [...slide.querySelectorAll('.zone')];
  const dropOf = z => slide.querySelector(`.zone[data-zone="${z}"] .drop`);
  const startBtn = slide.querySelector('#sorter-start');

  // state: shown = how many have entered; place = {name: zone}
  let state = { shown: 0, place: {} };
  try { state = Object.assign(state, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch {}
  const persist = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch {} };

  const tokens = {};
  PEOPLE.forEach(n => {
    const t = document.createElement('button');
    t.className = 'person';
    t.type = 'button';
    t.dataset.name = n;
    t.setAttribute('aria-label', label(n));
    t.innerHTML = `<span class="ring"><img src="assets/people/${n}.webp" alt="" draggable="false"></span><span class="pname">${label(n)}</span>`;
    tokens[n] = t;
  });

  function render(animateName) {
    PEOPLE.forEach((n, i) => {
      const t = tokens[n];
      if (i >= state.shown) { t.remove(); return; }
      const target = dropOf(state.place[n] || DEFAULT[n]);
      if (t.parentElement !== target) target.append(t);
      t.classList.toggle('enter', n === animateName);
    });
    slide.classList.toggle('started', state.shown > 0);
    slide.classList.toggle('all-in', state.shown >= PEOPLE.length);
    startBtn.hidden = state.shown > 0;
    zones.forEach(z => z.classList.toggle('has-people', !!z.querySelector('.person')));
  }

  function reveal() {
    if (state.shown >= PEOPLE.length) return false;
    state.shown++;
    persist();
    render(PEOPLE[state.shown - 1]);
    return true;
  }

  startBtn.addEventListener('click', reveal);
  slide.querySelector('#sorter-reset').addEventListener('click', () => {
    state = { shown: 0, place: {} };
    persist();
    render();
  });

  // Right arrow / next button: while people are still entering, add one more instead of leaving.
  const prevHook = window.beforeNext;
  window.beforeNext = () => {
    if (slide.classList.contains('active') && state.shown > 0 && state.shown < PEOPLE.length) return reveal();
    return prevHook ? prevHook() : false;
  };

  // Drag and drop with pointer events (mouse, touch, pen).
  let drag = null;
  slide.addEventListener('pointerdown', e => {
    const t = e.target.closest('.person');
    if (!t || e.button > 0) return;
    e.preventDefault();
    const r = t.getBoundingClientRect();
    drag = { t, dx: e.clientX - r.left, dy: e.clientY - r.top, x0: e.clientX, y0: e.clientY, moved: false };
    t.setPointerCapture(e.pointerId);
  });
  document.addEventListener('pointermove', e => {
    if (!drag) return;
    const { t } = drag;
    if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 4) return;
    if (!drag.moved) {
      drag.moved = true;
      const r = t.getBoundingClientRect();
      t.classList.add('dragging');
      t.style.width = r.width + 'px';
      // The slide is transformed, which would offset position:fixed; drag from <body>.
      document.body.append(t);
    }
    t.style.left = (e.clientX - drag.dx) + 'px';
    t.style.top = (e.clientY - drag.dy) + 'px';
    const over = zoneAt(e.clientX, e.clientY);
    zones.forEach(z => z.classList.toggle('over', z === over));
  });
  const end = e => {
    if (!drag) return;
    const { t, moved } = drag;
    drag = null;
    zones.forEach(z => z.classList.remove('over'));
    if (!moved) return;
    t.classList.remove('dragging');
    t.style.left = t.style.top = t.style.width = '';
    const z = zoneAt(e.clientX, e.clientY);
    if (z) {
      const name = t.dataset.name;
      if (z.dataset.zone === DEFAULT[name]) delete state.place[name]; else state.place[name] = z.dataset.zone;
      persist();
    }
    render(); // dropped outside a column: goes back where it was
    t.classList.remove('enter', 'dropped'); void t.offsetWidth; t.classList.add('dropped');
  };
  document.addEventListener('pointerup', end);
  document.addEventListener('pointercancel', end);

  function zoneAt(x, y) {
    const el = document.elementsFromPoint(x, y).find(el => !el.closest('.dragging') && el.closest('.zone'));
    return el ? el.closest('.zone') : null;
  }

  // Don't let a drag on a photo turn into a slide swipe.
  for (const ev of ['touchstart', 'touchend']) slide.addEventListener(ev, e => {
    if (e.target.closest('.person')) e.stopPropagation();
  }, { passive: true });

  render();
})();
