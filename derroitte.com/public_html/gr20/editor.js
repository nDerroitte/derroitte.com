// Text editor mode. Click "Modifier" (or press E), edit any text in place.
// Edits are saved in this browser automatically. "Exporter" downloads an
// index.html with the edits written in, to replace the one in the repository.
(() => {
  const STORE = 'gr20-text-edits-v2';
  const SELECTOR = 'h1,h2,h3,h4,p,li,figcaption,summary,.hero-bottom,.callout,.calendar-legend span,.question-grid h4';
  const SKIP = '[data-no-edit],#option-detail,#calendar-status,dialog,.sr-only';

  // Stable list of editable elements, computed the same way on the live page
  // and on a freshly parsed index.html, so keys match for export.
  function targets(root) {
    const all = [...root.querySelectorAll('main ' + SELECTOR.split(',').join(',main '))]
      .filter(el => !el.closest(SKIP));
    // keep only outermost matches (a callout contains a span, etc.)
    return all.filter(el => !all.some(o => o !== el && o.contains(el)));
  }

  const els = targets(document);
  const originals = els.map(el => el.innerHTML);
  let edits = {};
  try { edits = JSON.parse(localStorage.getItem(STORE) || '{}'); } catch {}
  els.forEach((el, i) => { if (edits[i] != null) el.innerHTML = edits[i]; });

  const bar = document.createElement('div');
  bar.id = 'editor-bar';
  bar.innerHTML = `
    <button id="ed-toggle" title="Mode édition (E)">✎ Modifier</button>
    <span id="ed-tools" hidden>
      <span class="ed-hint">Clique sur un texte pour le modifier. Sauvegarde automatique.</span>
      <button id="ed-export" title="Télécharger index.html avec tes textes">Exporter</button>
      <button id="ed-reset" title="Revenir aux textes d'origine">Réinitialiser</button>
      <button id="ed-done" class="ed-primary">Terminer</button>
    </span>
    <span id="ed-status" role="status" aria-live="polite"></span>`;
  document.body.append(bar);
  const $ = s => bar.querySelector(s);
  const status = msg => { $('#ed-status').textContent = msg; clearTimeout(status.t); status.t = setTimeout(() => $('#ed-status').textContent = '', 2500); };

  let editing = false;
  function setMode(on) {
    editing = on;
    document.body.classList.toggle('editing', on);
    $('#ed-toggle').hidden = on;
    $('#ed-tools').hidden = !on;
    els.forEach(el => { el.contentEditable = on ? 'true' : 'false'; el.spellcheck = on; });
  }

  function save() {
    // Only elements the user actually typed in (animations rewrite some texts).
    touched.forEach(i => {
      if (els[i].innerHTML !== originals[i]) edits[i] = els[i].innerHTML; else delete edits[i];
    });
    try { localStorage.setItem(STORE, JSON.stringify(edits)); } catch {}
    status(`${Object.keys(edits).length} texte(s) modifié(s), enregistré`);
  }

  const touched = new Set();
  els.forEach((el, i) => el.addEventListener('input', () => {
    touched.add(i); clearTimeout(save.t); save.t = setTimeout(save, 400); }));

  // While editing, clicks on texts must not trigger buttons, links or slide changes.
  document.addEventListener('click', e => {
    if (editing && e.target.closest('[contenteditable="true"]')) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
  for (const t of ['touchstart', 'touchend']) document.addEventListener(t, e => {
    if (editing && e.target.closest('[contenteditable="true"]')) e.stopPropagation();
  }, { capture: true, passive: true });
  // Enter inserts a line break instead of a new block.
  document.addEventListener('keydown', e => {
    if (!editing || !e.target.isContentEditable) return;
    if (e.key === 'Enter') { e.preventDefault(); document.execCommand('insertLineBreak'); }
    if (e.key === 'Escape') e.target.blur();
  });
  // Paste as plain text.
  document.addEventListener('paste', e => {
    if (!editing || !e.target.isContentEditable) return;
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  });

  document.addEventListener('keydown', e => {
    if (e.target.isContentEditable || e.target.closest('input,textarea') || document.querySelector('#menu').open) return;
    if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.metaKey) setMode(!editing);
  });

  $('#ed-toggle').onclick = () => setMode(true);
  $('#ed-done').onclick = () => { save(); setMode(false); };
  $('#ed-reset').onclick = () => {
    if (!confirm('Revenir aux textes d’origine ? Tes modifications locales seront perdues.')) return;
    els.forEach((el, i) => el.innerHTML = originals[i]);
    edits = {};
    try { localStorage.removeItem(STORE); } catch {}
    status('Textes d’origine restaurés');
  };
  $('#ed-export').onclick = async () => {
    save();
    try {
      // Snapshot taken in index.html before any script changed the page: works over file:// too.
      const src = window.__pristine || await (await fetch(location.pathname.replace(/[^/]*$/, '') + 'index.html', { cache: 'no-store' })).text();
      const doc = new DOMParser().parseFromString(src, 'text/html');
      doc.documentElement.removeAttribute('data-theme');
      // The snapshot stops where it was taken: add back the script tags that follow it.
      if (window.__pristine) document.querySelectorAll('body > script[src]').forEach(s => {
        const n = doc.createElement('script'); n.src = s.getAttribute('src'); doc.body.append(n);
      });
      const fresh = targets(doc);
      if (fresh.length !== els.length) throw new Error('structure');
      fresh.forEach((el, i) => { if (edits[i] != null) el.innerHTML = edits[i]; });
      const html = '<!doctype html>' + doc.documentElement.outerHTML;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
      a.download = 'index.html';
      a.click();
      URL.revokeObjectURL(a.href);
      status('index.html téléchargé : remplace le fichier du projet par celui-ci');
    } catch {
      status('Export impossible : recharge la page et réessaie');
    }
  };
})();
