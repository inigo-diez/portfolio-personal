/* Pocket OS — E2 prototype.
   One input model: every physical input (ring rotation, ring axes, buttons, side dial,
   keyboard) becomes one of five commands — next, prev, select, back, home — consumed
   by a tiny navigation state machine. Content is real (CV / old portfolio / project map). */
(function () {
  const ICONS = {
    folder: '<path d="M3.5 6.5h6l2 2h9v10h-17z"/>',
    user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1.2-3.3 3.8-5 7-5s5.8 1.7 7 5"/>',
    path: '<circle cx="6" cy="18" r="1.6"/><circle cx="18" cy="6" r="1.6"/><path d="M7.5 17c4-1 2.5-8 9-9.5"/>',
    cube: '<path d="M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7z"/><path d="M4.5 7.7L12 12l7.5-4.3M12 12v8.5"/>',
    mail: '<rect x="3.5" y="6" width="17" height="12" rx="1"/><path d="M4 7l8 6 8-6"/>',
    doc: '<path d="M6.5 3.5h7.5l4 4v13h-11.5z"/><path d="M14 3.5v4h4M9 12h6M9 15.5h6"/>',
    canvas: '<rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="5.5" width="7" height="5" rx="1"/><rect x="5.5" y="13.5" width="6" height="7" rx="1"/><rect x="14.5" y="13.5" width="6" height="6" rx="1"/>',
    stack: '<path d="M4 9l8-4 8 4-8 4z"/><path d="M4 13l8 4 8-4M4 17l8 4 8-4"/>',
    link: '<path d="M10 14l4-4M8.5 11.5l-2 2a3 3 0 004.2 4.2l2-2M15.5 12.5l2-2a3 3 0 00-4.2-4.2l-2 2"/>',
    chev: '<path d="M9 5.5l6.5 6.5L9 18.5"/>',
    back: '<path d="M19 12H5.5M11 6l-6 6 6 6"/>',
    home: '<path d="M4 11l8-6.5 8 6.5"/><path d="M6.5 9.5v10h11v-10"/>',
  };
  const svg = (name, cls = '') =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

  // Same seven sections, in the same order, as the old portfolio's navigation
  const MENU = [
    { id: 'sobre-mi',    label: 'Sobre mí',    icon: 'user' },
    { id: 'trayectoria', label: 'Trayectoria', icon: 'path' },
    { id: 'proyectos',   label: 'Proyectos',   icon: 'folder' },
    { id: 'habilidades', label: 'Habilidades', icon: 'cube' },
    { id: 'formacion',   label: 'Formación',   icon: 'doc' },
    { id: 'contacto',    label: 'Contacto',    icon: 'mail' },
    { id: 'cv',          label: 'CV',          icon: 'doc' },
  ];
  // The menu opens (and INICIO returns) with Proyectos selected: it is the main destination
  const DEFAULT_ENTRY = MENU.findIndex(m => m.id === 'proyectos');

  const SECTIONS = {
    'sobre-mi': { text: [
      'Graduado en Química por la EHU y cursando el Máster en Ciencia de Datos e Inteligencia Artificial en Afi Global Education.',
      'Combino el rigor del método científico con la programación: formular hipótesis, contrastarlas con datos reales y llegar a conclusiones que se puedan defender.',
      'Mis proyectos van de la metabolómica a los mercados de petróleo y a la IA generativa verificable.',
    ] },
    // Old portfolio "Experiencia": degree + final project (no professional experience yet)
    trayectoria: { rows: [
      { label: 'TFG · Datos metabolómicos', meta: 'EHU' },
      { label: 'Grado en Química', meta: 'EHU' },
    ] },
    proyectos: { rows: [
      { label: 'Abrir lienzo', meta: '13', icon: 'canvas', action: 'canvas', strong: true },
      { label: 'Metabolómica & Biomarcadores', meta: '5', icon: 'stack', action: 'canvas' },
      { label: 'Geopolítica y Crudo WTI', meta: '3', icon: 'stack', action: 'canvas' },
      { label: 'ML Aplicado · Kaggle', meta: '3', icon: 'stack', action: 'canvas' },
      { label: 'IA Generativa', meta: '2', icon: 'stack', action: 'canvas' },
    ] },
    habilidades: { rows: [
      { label: 'Python · SQL', meta: '' },
      { label: 'pandas · scikit-learn · SHAP', meta: '' },
      { label: 'XGBoost · TensorFlow', meta: '' },
      { label: 'Estadística · DoE', meta: '' },
      { label: 'LLMs · LangChain', meta: '' },
    ] },
    // Old portfolio "Formación": degrees + complementary training (dates as listed there)
    formacion: { rows: [
      { label: 'Máster CD e IA · Afi', meta: '26–27', strong: true },
      { label: 'Grado en Química · EHU', meta: '', strong: true },
      { label: 'Python Data Fundamentals', meta: 'ene 26' },
      { label: 'Statistics Fundamentals in Python', meta: 'ene 26' },
      { label: 'Applied Statistics in Python', meta: 'ene 26' },
      { label: 'Machine Learning Specialization', meta: '' },
      { label: 'SQL Fundamentals', meta: 'mar 26' },
      { label: 'De 0 a Data Scientist', meta: 'abr 26' },
      { label: 'AI Engineering with LangChain', meta: 'oct 26' },
    ] },
    contacto: { rows: [
      { label: 'idiezosua@gmail.com', icon: 'mail', href: 'mailto:idiezosua@gmail.com' },
      { label: 'github.com/inigo-diez', icon: 'link', href: 'https://github.com/inigo-diez' },
      { label: 'LinkedIn', icon: 'link', href: 'https://www.linkedin.com/in/i%C3%B1igo-d%C3%ADez-os%C3%BAa-233642401/' },
    ] },
    cv: { rows: [
      { label: 'Ver CV', icon: 'doc', href: '../../materials/cv/Inigo_Diez_Osua_cv.pdf' },
      { label: 'Descargar PDF', icon: 'doc', href: '../../materials/cv/Inigo_Diez_Osua_cv.pdf' },
    ] },
  };

  // Back-face mark candidates (decision 7 pending). All drawn with strokes, no filled dots.
  const S = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
  const MARKS = {
    anillo: { name: 'Anillo y barra', note: 'La marca actual sin el punto: el círculo pasa a ser el anillo de control.',
      svg: `<svg viewBox="0 0 40 20" aria-hidden="true" ${S}><circle cx="9" cy="10" r="6.6" stroke-width="2.6"/><path d="M23 18L33 2" stroke-width="3.2"/></svg>` },
    ido: { name: 'Monograma IDO', note: 'Iniciales de Iñigo Díez Osúa, dibujadas con trazos geométricos.',
      svg: `<svg viewBox="0 0 45 20" aria-hidden="true" ${S} stroke-width="2.4"><path d="M3.5 3v14"/><path d="M11 3h3.5a7 7 0 0 1 0 14H11z"/><circle cx="34.5" cy="10" r="7"/></svg>` },
    ejes: { name: 'Cuatro ejes', note: 'El anillo de control visto de frente: círculo y sus cuatro ejes.',
      svg: `<svg viewBox="0 0 20 20" aria-hidden="true" ${S} stroke-width="2"><circle cx="10" cy="10" r="8.4"/><path d="M10 3.6v2.6M10 13.8v2.6M3.6 10h2.6M13.8 10h2.6"/></svg>` },
    silueta: { name: 'Silueta', note: 'El propio dispositivo reducido a pictograma: cuerpo, pantalla y anillo.',
      svg: `<svg viewBox="0 0 17 21" aria-hidden="true" ${S} stroke-width="1.3"><rect x="1" y="1" width="15" height="18.6" rx="2.2"/><rect x="2.9" y="2.9" width="11.2" height="8.4" rx=".6" fill="currentColor" stroke="none"/><circle cx="5.9" cy="15.2" r="2.4"/><path d="M10.6 15.2h3.2"/></svg>` },
  };
  const DEFAULT_MARK = 'anillo';

  // Axis symbols chosen by Iñigo (2026-10-20) from his reference photo: + − ⏮ ⏭. They are labels only:
  // the commands stay prev / next / back / select (the page cannot change the Spotify player's volume).
  const TRI = {
    up: '<path d="M10.5 5h3v5.5H19v3h-5.5V19h-3v-5.5H5v-3h5.5z"/>', down: '<path d="M5 10.5h14v3H5z"/>',
    left: '<path d="M3.5 6.5h2.4v11H3.5zM5.9 12l7.6-5.5v11zM13 12l7.6-5.5v11z"/>',
    right: '<path d="M20.5 6.5h-2.4v11h2.4zM18.1 12l-7.6-5.5v11zM11 12L3.4 6.5v11z"/>',
  };
  const AXES = { up: 'prev', down: 'next', left: 'back', right: 'select' };
  const AXIS_OF = { prev: 'up', next: 'down', back: 'left', select: 'right' };

  const BATT = '<svg class="os__batt" viewBox="0 0 26 13" aria-hidden="true"><rect x=".7" y=".7" width="22" height="11.6" rx="2" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="2.6" y="2.6" width="16" height="7.8" rx=".8" fill="currentColor"/><rect x="23.6" y="4.2" width="1.8" height="4.6" rx=".6" fill="currentColor"/></svg>';

  function hardware(mark) {
    const screen = `<div class="pocket__glass"><div class="pocket__screen"><div class="os" data-os></div></div></div>`;
    const axes = Object.keys(TRI).map(a =>
      `<span class="ring__axis ring__axis--${a}" data-axis="${a}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${TRI[a]}</svg></span>`).join('');
    const ring = `<div class="ring" data-ring aria-hidden="true"><span class="ring__spin"></span>${axes}<button class="ring__center" data-cmd="select" aria-label="Seleccionar" tabindex="-1"></button></div>`;
    const keys = `<button class="key key--back" data-cmd="back" aria-label="Atrás">${svg('back')}</button>
         <button class="key key--home" data-cmd="home" aria-label="Inicio">${svg('home')}</button>`;
    const back = `<div class="pocket__back" aria-hidden="true"><div class="engr">
        <span class="back__mark" data-mark>${MARKS[mark].svg}</span>
        <div class="back__line">Pocket OS</div>
        <div class="back__fine">ID-01 · Iñigo Díez Osúa · 2026</div></div></div>`;
    return `<div class="pocket__tilt"><div class="pocket__card">
        <div class="pocket__front">${screen}${ring}${keys}
          <button class="side-key" data-dial aria-label="Botón lateral: desplazar"></button></div>
        ${back}</div></div>`;
  }

  function mount(el, opts = {}) {
    el.classList.add('pocket', 'pocket--slate');
    el.tabIndex = 0;
    el.setAttribute('role', 'group');
    el.setAttribute('aria-roledescription', 'dispositivo');
    el.setAttribute('aria-label', 'Pocket OS: flechas arriba y abajo para moverte, derecha o Intro para abrir, izquierda o Escape para volver');
    el.innerHTML = hardware(opts.mark || DEFAULT_MARK) + '<span class="sr-only" aria-live="polite" data-live></span>';

    if (opts.reflect) el.classList.add('pocket--reflect');
    const osEl = el.querySelector('[data-os]');
    const card = el.querySelector('.pocket__card');
    const live = el.querySelector('[data-live]');
    const state = { view: 'menu', menuIndex: DEFAULT_ENTRY, row: 0, top: 0, dir: '' };

    function rowsOf(view) { return view === 'menu' ? MENU : (SECTIONS[view].rows || null); }

    // Right-hand preview of the selected menu entry (real content only)
    const PEEK = {
      'sobre-mi': () => `<div class="peek__mono">ID</div><div class="peek__label">Iñigo Díez Osúa<br>Química · Ciencia de datos · IA</div>`,
      trayectoria: () => `<div class="peek__kicker">Trabajo Fin de Grado · EHU</div><div class="peek__title">Datos metabolómicos</div>
        <div class="peek__chips">${['PCA', 'PLS-DA', 'DoE · RSM'].map(t => `<span>${t}</span>`).join('')}</div>`,
      proyectos: () => `<div class="peek__map">${['01', '02', '03', '04'].map((n, i) => `<i class="${i ? '' : 'on'}">${n}</i>`).join('')}</div>
        <div class="peek__big">13</div><div class="peek__label">proyectos en<br>4 colecciones</div>`,
      habilidades: () => `<div class="peek__chips">${['Python', 'SQL', 'scikit-learn', 'XGBoost', 'TensorFlow', 'LLMs'].map(t => `<span>${t}</span>`).join('')}</div>`,
      formacion: () => `<ul class="peek__time"><li><b>Máster CD e IA</b><span>Afi · 2026–27</span></li><li><b>Grado en Química</b><span>EHU</span></li></ul>
        <div class="peek__label">+ 7 cursos complementarios</div>`,
      contacto: () => `${svg('mail', 'peek__icon')}<div class="peek__label">idiezosua@gmail.com<br>LinkedIn · GitHub</div>`,
      cv: () => `<div class="peek__doc"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="peek__label">Currículum · PDF</div>`,
    };

    function render() {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      let body = '', title = 'Pocket OS', split = false;
      if (state.view === 'menu') {
        split = true;
        const cur = MENU[state.menuIndex];
        body = `<div class="os__main"><ul class="os__list" role="listbox" aria-label="Menú">${MENU.map((m, i) =>
          `<li class="os__item${i === state.menuIndex ? ' is-sel' : ''}" role="option" aria-selected="${i === state.menuIndex}" data-i="${i}"><span>${m.label}</span>${svg('chev', 'chev')}</li>`).join('')}</ul></div>
          <div class="os__peek" aria-hidden="true">${PEEK[cur.id]()}</div>`;
      } else {
        const sec = SECTIONS[state.view];
        title = MENU.find(m => m.id === state.view).label;
        if (sec.rows) {
          body = `<div class="os__main"><ul class="os__list" role="listbox" aria-label="${title}">${sec.rows.map((r, i) =>
            `<li class="os__item${i === state.row ? ' is-sel' : ''}${r.strong ? ' is-strong' : ''}" role="option" aria-selected="${i === state.row}" data-i="${i}">${r.icon ? svg(r.icon) : ''}<span>${r.label}</span>${r.meta ? `<span class="meta">${r.meta}</span>` : ''}</li>`).join('')}</ul><div class="os__scroll" hidden><i></i></div></div>`;
        } else {
          body = `<div class="os__main"><div class="os__text" data-text>${sec.text.map(p => `<p>${p}</p>`).join('')}</div><div class="os__scroll"><i></i></div></div>`;
        }
      }
      osEl.innerHTML = `<div class="os__status"><span class="os__time">${time}</span><span class="os__title">${title}</span>${BATT}</div><div class="os__view${split ? ' os__split' : ''}${state.dir ? ' anim-' + state.dir : ''}">${body}</div>`;
      state.dir = '';
      const sel = osEl.querySelector('.is-sel');
      if (sel) live.textContent = sel.textContent.trim();
      const text = osEl.querySelector('[data-text]');
      if (text) updateScrollbar(text);
      if (sel && state.view !== 'menu') keepInView(sel);
    }

    // Long lists (Formación) scroll so the selected row stays visible, with a position bar
    function keepInView(sel) {
      const list = sel.parentElement, bar = osEl.querySelector('.os__scroll');
      const n = list.children.length;
      bar.hidden = false;
      const rowH = sel.offsetHeight, visible = Math.max(1, Math.floor(list.clientHeight / rowH));
      if (n <= visible) { bar.hidden = true; state.top = 0; return; }
      if (state.row < state.top) state.top = state.row;
      if (state.row >= state.top + visible) state.top = state.row - visible + 1;
      list.scrollTop = state.top * rowH;
      bar.querySelector('i').style.setProperty('--p', (100 * (state.top + visible) / n).toFixed(1) + '%');
    }

    function updateScrollbar(text) {
      const max = text.scrollHeight - text.clientHeight;
      const p = max <= 0 ? 100 : 30 + 70 * (text.scrollTop / max);
      osEl.querySelector('.os__scroll i').style.setProperty('--p', p + '%');
    }

    function enter(view) {
      state.view = view; state.row = 0; state.top = 0; state.dir = 'fwd';
    }

    function cmd(c) {
      if (card.classList.contains('is-flipped')) { card.classList.remove('is-flipped'); return; }
      const rows = rowsOf(state.view);
      if (c === 'next' || c === 'prev') {
        const d = c === 'next' ? 1 : -1;
        if (state.view === 'menu') state.menuIndex = (state.menuIndex + d + MENU.length) % MENU.length;
        else if (rows) state.row = Math.max(0, Math.min(rows.length - 1, state.row + d));
        else {
          const text = osEl.querySelector('[data-text]');
          text.scrollTop += d * text.clientHeight * 0.4;
          updateScrollbar(text);
          return;
        }
        render();
      } else if (c === 'select') {
        if (state.view === 'menu') {
          enter(MENU[state.menuIndex].id); render();
        } else if (rows) {
          const r = rows[state.row];
          if (r.action === 'canvas' && opts.onCanvas) opts.onCanvas(state.row);
          else if (r.href) window.open(r.href, r.href.startsWith('mailto') ? '_self' : '_blank', 'noopener');
        }
      } else if (c === 'back') {
        if (state.view !== 'menu') { state.view = 'menu'; state.dir = 'back'; render(); }
      } else if (c === 'home') {
        if (opts.onHome) { opts.onHome(); return; }
        const was = state.view;
        state.view = 'menu'; state.menuIndex = DEFAULT_ENTRY; state.dir = was === 'menu' ? '' : 'back'; render();
      }
    }

    function flash(sel) {
      const b = el.querySelector(sel);
      if (!b) return;
      b.classList.add('is-pressed');
      setTimeout(() => b.classList.remove('is-pressed'), 110);
    }

    // Buttons
    el.querySelectorAll('[data-cmd]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); cmd(b.dataset.cmd); }));

    // Tapping a row on the screen selects it (touch / mouse shortcut)
    osEl.addEventListener('click', e => {
      const li = e.target.closest('.os__item');
      if (!li) return;
      const i = +li.dataset.i;
      if (state.view === 'menu') state.menuIndex = i; else state.row = i;
      cmd('select');
    });

    // Ring: real circular gesture (30° of rotation = one step, clockwise = next).
    // A tap without rotation presses the nearest of the four axes.
    const ring = el.querySelector('[data-ring]');
    const spin = ring.querySelector('.ring__spin');
    const STEP = Math.PI / 6;
    let drag = null, totalRot = 0;
    ring.addEventListener('pointerdown', e => {
      if (e.target.closest('.ring__center')) return;
      ring.setPointerCapture(e.pointerId);
      const r = ring.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      drag = { cx, cy, last: Math.atan2(dy, dx), acc: 0, moved: false,
        axis: Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down') };
    });
    ring.addEventListener('pointermove', e => {
      if (!drag) return;
      const a = Math.atan2(e.clientY - drag.cy, e.clientX - drag.cx);
      let d = a - drag.last;
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      drag.last = a; drag.acc += d;
      while (drag.acc > STEP)  { cmd('next'); drag.acc -= STEP; drag.moved = true; totalRot += 30; }
      while (drag.acc < -STEP) { cmd('prev'); drag.acc += STEP; drag.moved = true; totalRot -= 30; }
      spin.style.setProperty('--rot', totalRot + (drag.acc * 180 / Math.PI) + 'deg');
    });
    const end = () => {
      if (!drag) return;
      if (!drag.moved) { flash(`[data-axis="${drag.axis}"]`); cmd(AXES[drag.axis]); }
      spin.style.setProperty('--rot', totalRot + 'deg');
      drag = null;
    };
    ring.addEventListener('pointerup', end);
    ring.addEventListener('pointercancel', end);

    // Mouse wheel over the ring: one notch = one step (scroll down = next), and the metal turns 30° with it.
    // Trackpads send many small deltas, so they are accumulated until they add up to a notch.
    let wheelAcc = 0;
    ring.addEventListener('wheel', e => {
      e.preventDefault();
      wheelAcc += e.deltaMode === 1 ? e.deltaY * 34 : e.deltaY;   // lines → pixels (Firefox: 3 lines per notch)
      while (Math.abs(wheelAcc) >= 100) {             // one notch = 100 px in Chromium and Safari
        const d = Math.sign(wheelAcc);
        wheelAcc -= d * 100;
        cmd(d > 0 ? 'next' : 'prev');
        totalRot += d * 30;
        spin.style.setProperty('--rot', totalRot + 'deg');
      }
    }, { passive: false });

    // Side dial: mouse wheel or vertical drag scrolls
    const dial = el.querySelector('[data-dial]');
    let dialY = null, dialAcc = 0;
    dial.addEventListener('wheel', e => { e.preventDefault(); cmd(e.deltaY > 0 ? 'next' : 'prev'); }, { passive: false });
    dial.addEventListener('pointerdown', e => { dial.setPointerCapture(e.pointerId); dialY = e.clientY; dialAcc = 0; });
    dial.addEventListener('pointermove', e => {
      if (dialY === null) return;
      dialAcc += e.clientY - dialY; dialY = e.clientY;
      while (dialAcc > 14)  { cmd('next'); dialAcc -= 14; }
      while (dialAcc < -14) { cmd('prev'); dialAcc += 14; }
    });
    dial.addEventListener('pointerup', () => { dialY = null; });

    // Keyboard: arrows mirror the ring's four axes (← back, → open, like a column browser)
    const keyTarget = opts.globalKeys ? document : el;
    keyTarget.addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input, textarea, a, nav')) return;
      // a focused button already handles Enter/Space as its own click
      if ((e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('button')) return;
      const map = { ArrowDown: 'next', ArrowRight: 'select', ArrowUp: 'prev', ArrowLeft: 'back', Enter: 'select', ' ': 'select', Escape: 'back', Backspace: 'back', Home: 'home' };
      const c = map[e.key];
      if (!c) return;
      e.preventDefault();
      cmd(c);
      if (e.key.startsWith('Arrow')) flash(`[data-axis="${AXIS_OF[c]}"]`);
      else if (c === 'select') flash('.ring__center');
      else if (c === 'back') flash('.key--back');
      else if (c === 'home') flash('.key--home');
    });

    function open(view) {
      if (!SECTIONS[view]) return;
      card.classList.remove('is-flipped');
      state.menuIndex = MENU.findIndex(m => m.id === view);
      enter(view); render();
    }

    // Physical-object touches (home only): gentle tilt towards the pointer + flip to see the back
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    if (opts.tilt) {
      const tilt = el.querySelector('.pocket__tilt'), front = el.querySelector('.pocket__front');
      addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse' || still.matches) return;
        const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
        tilt.style.setProperty('--ry', (nx * 9).toFixed(2) + 'deg');
        tilt.style.setProperty('--rx', (-ny * 7).toFixed(2) + 'deg');
        front.style.setProperty('--sx', (32 + nx * 50).toFixed(1) + '%');
        front.style.setProperty('--sy', (ny * 30).toFixed(1) + '%');
      });
      document.documentElement.addEventListener('pointerleave', () => { tilt.style.setProperty('--rx', '0deg'); tilt.style.setProperty('--ry', '0deg'); });
    }
    function flip() { card.classList.toggle('is-flipped'); return card.classList.contains('is-flipped'); }
    function setMark(name) { if (MARKS[name]) el.querySelector('[data-mark]').innerHTML = MARKS[name].svg; }

    if (opts.startView) {
      state.view = opts.startView;
      state.menuIndex = MENU.findIndex(m => m.id === opts.startView);
    }
    render();
    setInterval(() => { if (state.view === 'menu') render(); }, 30000);
    return { cmd, open, flip, setMark };
  }

  window.PocketOS = { mount, MARKS, DEFAULT_MARK };
})();
