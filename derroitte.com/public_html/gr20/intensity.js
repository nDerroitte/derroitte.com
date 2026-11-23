// "L'intensité" slide: three moods, stage-by-stage detail and elevation profiles.
(() => {
  const slide = document.querySelector('.intensity');
  if (!slide) return;

  // [from, to, D+, D-, hours (decimal), km]. Source: assets/8j, 9j, 10j screenshots.
  const PLANS = [
    {
      id: '8j', name: 'Mood sportif', icon: '🔥', days: 8,
      stats: [['9h10', 'de marche en moyenne'], ['11h', 'journée la plus longue'], ['0', 'journée « chill »']],
      stages: [
        ['Calenzana', 'Carrozu', 2100, 1000, 10, 18.74],
        ['Carrozu', 'Ballone', 2000, 1640, 9.5, 14.45],
        ['Ballone', 'Manganu', 1270, 1050, 10.5, 30.24],
        ['Manganu', 'Onda', 1250, 1400, 7.5, 18.38],
        ['Onda', 'Capannelle', 1600, 1400, 8.75, 24.04],
        ['Capannelle', 'Usciolu', 1600, 1350, 11, 28.59],
        ['Usciolu', 'Asinau', 1050, 1200, 8, 20.75],
        ['Asinau', 'Conca', 640, 1800, 8, 28.5]
      ]
    },
    {
      id: '9j', name: 'Mood engagé', icon: '⛰️', days: 9,
      stats: [['8h10', 'de marche en moyenne'], ['11h', 'journée la plus longue'], ['2', 'journées « plus chill » au début']],
      stages: [
        ['Calenzana', 'Carrozu', 2100, 1000, 10, 18.74],
        ['Carrozu', 'Asco', 800, 640, 4, 4.86],
        ['Asco', 'Ciottulu', 1820, 1100, 9, 14.81],
        ['Ciottulu', 'Manganu', 650, 700, 7.5, 25.02],
        ['Manganu', 'Onda', 1250, 1400, 7.5, 18.38],
        ['Onda', 'Capannelle', 1600, 1400, 8.75, 24.04],
        ['Capannelle', 'Usciolu', 1600, 1350, 11, 28.59],
        ['Usciolu', 'Asinau', 1050, 1200, 8, 20.75],
        ['Asinau', 'Conca', 640, 1800, 8, 28.5]
      ]
    },
    {
      id: '10j', name: 'Mood plat du pied', icon: '🌿', days: 10,
      stats: [['7h25', 'de marche en moyenne'], ['10h', 'journée la plus longue'], ['2', 'journées très chill, et une seule vraiment engagée']],
      stages: [
        ['Calenzana', 'Carrozu', 2100, 1000, 10, 18.74],
        ['Carrozu', 'Asco', 800, 640, 4, 4.86],
        ['Asco', 'Ballone', 1200, 1100, 5.5, 9.6],
        ['Ballone', 'Vaccaghja', 1150, 1050, 10, 28.21],
        ['Vaccaghja', 'Petra Piana', 850, 600, 5, 10.41],
        ['Petra Piana', 'Vizzavona', 1250, 1400, 8, 20.06],
        ['Vizzavona', 'Col de Verde', 1700, 750, 7.5, 26.97],
        ['Col de Verde', 'Usciolu', 750, 700, 8, 15.62],
        ['Usciolu', 'Asinau', 1050, 1200, 8, 20.75],
        ['Asinau', 'Conca', 640, 1800, 8, 28.5]
      ]
    }
  ];

  const fmtH = h => { const m = Math.round(h * 60); return `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`; };
  const fmtKm = k => k.toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' km';
  const nb = n => n.toLocaleString('fr-FR');

  const wrap = slide.querySelector('.moods');
  wrap.innerHTML = PLANS.map(p => `
    <article class="mood" data-plan="${p.id}">
      <div class="mood-top"><span class="mood-icon" aria-hidden="true">${p.icon}</span><div><h3>${p.name}</h3><p class="mood-days">${p.days} jours</p></div></div>
      <ul class="mood-stats">${p.stats.map(([v, l]) => `<li>${v ? `<b>${v}</b>` : ''}<span>${l}</span></li>`).join('')}</ul>
      <ol class="stages">${p.stages.map((s, i) => `
        <li><button type="button" data-plan="${p.id}" data-day="${i + 1}" aria-label="Jour ${i + 1}, ${s[0]} vers ${s[1]} : voir le profil">
          <span class="d">J${i + 1}</span>
          <span class="route-name">${s[0]} → ${s[1]}</span>
          <span class="t">${fmtH(s[4])}</span>
          <span class="up">+${nb(s[2])}</span>
          <span class="down">−${nb(s[3])}</span>
        </button></li>`).join('')}
      </ol>
    </article>`).join('');

  const toggle = slide.querySelector('#int-toggle');
  toggle.addEventListener('click', () => {
    const open = !slide.classList.contains('detail');
    slide.classList.toggle('detail', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'Revenir aux moods' : 'Voir le détail des étapes';
  });

  // Close the detail view when leaving the slide.
  window.addEventListener('slidechange', () => {
    if (!slide.classList.contains('active') && slide.classList.contains('detail')) toggle.click();
  });

  const dlg = document.querySelector('#profile-dialog');
  wrap.addEventListener('click', e => {
    const b = e.target.closest('button[data-day]');
    if (!b) return;
    const plan = PLANS.find(p => p.id === b.dataset.plan);
    const s = plan.stages[b.dataset.day - 1];
    dlg.querySelector('#profile-plan').textContent = `${plan.name.toUpperCase()} · JOUR ${b.dataset.day}`;
    dlg.querySelector('#profile-title').textContent = `${s[0]} → ${s[1]}`;
    dlg.querySelector('#profile-stats').innerHTML =
      `<b>${fmtH(s[4])}</b> de marche · <b>${fmtKm(s[5])}</b> · <span class="up">+${nb(s[2])} m</span> · <span class="down">−${nb(s[3])} m</span>`;
    const img = dlg.querySelector('#profile-img');
    img.src = `assets/profiles/${plan.id}-${b.dataset.day}.webp`;
    img.alt = `Profil de dénivelé, ${s[0]} vers ${s[1]}`;
    dlg.showModal();
  });
  dlg.querySelector('#profile-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
})();
