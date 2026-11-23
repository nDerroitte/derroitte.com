// Theme switch: "Sapin clair" (default) and "Lin et lagon" (light).
// The saved choice is applied before first paint by an inline script in <head>.
(() => {
  const KEY = 'gr20-theme';
  const COLORS = { sapin: '#1f4a38', lin: '#f7efdc' };
  const btn = document.querySelector('#theme');
  const meta = document.querySelector('meta[name="theme-color"]');
  const current = () => document.documentElement.dataset.theme === 'lin' ? 'lin' : 'sapin';

  function apply(theme, persist) {
    if (theme === 'lin') document.documentElement.dataset.theme = 'lin';
    else delete document.documentElement.dataset.theme;
    if (meta) meta.content = COLORS[theme];
    const label = theme === 'lin' ? 'Passer au thème sombre Sapin clair' : 'Passer au thème clair Lin et lagon';
    btn.setAttribute('aria-label', label);
    btn.title = label + ' (T)';
    if (persist) { try { localStorage.setItem(KEY, theme); } catch {} }
  }

  const toggle = () => apply(current() === 'lin' ? 'sapin' : 'lin', true);
  btn.addEventListener('click', toggle);
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.isContentEditable || e.target.closest('input,textarea,select')) return;
    if (document.querySelector('#menu').open) return;
    if (e.key.toLowerCase() === 't') toggle();
  });
  apply(current(), false);
})();
