// Dev check of the Infinite Canvas (E5, the universe): enter, explore, open a project and come back without getting lost.
// Drives the canvas with the mouse, the keyboard, the docked device and touch in headless Edge (desktop), and
// the projects list on a phone; saves screenshots and reports console errors and failed checks.
// Usage: npm run build && npx vite preview --port 4173, then: node scripts/dev/canvas-check.mjs [base-url] [out-dir]
import { chromium } from 'playwright-core';

const B = process.argv[2] ?? 'http://localhost:4173/portfolio-personal/';
const OUT = process.argv[3] ?? '_reference/e5';
const browser = await chromium.launch({ channel: 'msedge', args: ['--enable-gpu', '--ignore-gpu-blocklist'] });
let failed = 0;
const check = (ok, what) => {
  if (!ok) failed++;
  console.log(`  ${ok ? 'ok  ' : 'FALLA'} ${what}`);
};
const watch = (page) => {
  const errs = [];
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 160)));
  page.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  return errs;
};
/** One page on the stage, nothing animating, nothing left transformed. */
const clean = (page) =>
  page.evaluate(() => {
    const pages = document.querySelectorAll('.stage > [data-page]').length;
    const running = document
      .getAnimations()
      .filter((a) => a.playState !== 'finished' && !(a instanceof CSSAnimation) && !(a instanceof CSSTransition));
    return pages === 1 && !document.querySelector('[data-transitioning]') && running.length === 0;
  });
const cam = (page) => page.evaluate(() => document.querySelector('[data-world]').style.transform);
const openProject = (page) => page.evaluate(() => document.querySelector('.proj.is-open')?.dataset.project ?? null);
/** Every element fully inside the viewport. */
const allInView = (page, sel) =>
  page.evaluate(
    (s) =>
      [...document.querySelectorAll(s)].every((el) => {
        const r = el.getBoundingClientRect();
        return r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1;
      }),
    sel,
  );

// ── Desktop ──
{
  console.log('\n1440 × 900');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = watch(page);
  const shot = (n) => page.screenshot({ path: `${OUT}/${n}.png` });

  await page.goto(B, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.locator('.home__cta .pill').click();
  await page.waitForTimeout(1300);
  check(page.url().endsWith('/proyectos/') && (await clean(page)), 'desde la home, la pantalla crece hasta el lienzo');
  const start = await page.evaluate(() => ({
    covers: document.querySelectorAll('[data-cover]').length,
    labels: document.querySelectorAll('[data-label]').length,
    open: document.querySelectorAll('.sats:not([inert])').length,
    seen: [...document.querySelectorAll('[data-cover]')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight;
    }).length,
  }));
  check(start.covers === 13 && start.labels === 4 && start.open === 0, 'el universo: 13 proyectos en 4 colecciones, ninguno abierto');
  check(start.seen >= 6, `al entrar se ven varios proyectos enteros (${start.seen})`);
  check(await page.evaluate(() => document.activeElement?.hasAttribute('data-canvas-layer')), 'el foco queda en el lienzo');
  await shot('01-universo');

  // keyboard: arrows pan, + / − zoom, 0 resets
  let c0 = await cam(page);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');
  check((await cam(page)) !== c0, 'las flechas desplazan el lienzo');
  c0 = await cam(page);
  await page.keyboard.press('+');
  check((await cam(page)) !== c0, '+ acerca');
  await page.keyboard.press('0');
  await page.waitForTimeout(700);

  // open a project: its cards unfold around the cover, the README loads, the camera frames it
  await page.locator('[data-slug="figuris"] .cover__open').click();
  await page.waitForTimeout(1500);
  check((await openProject(page)) === 'figuris', 'pinchar Figuris lo abre');
  const sats = await page.evaluate(() => ({
    cards: document.querySelectorAll('#detalle-figuris .sat').length,
    facts: document.querySelectorAll('#detalle-figuris .sat--fact').length,
    readme: document.querySelector('#detalle-figuris .readme')?.textContent.includes('Figuris') ?? false,
    github: document.querySelector('#detalle-figuris a[href^="https://github.com/inigo-diez/Figuris"]') !== null,
  }));
  check(sats.facts === 4 && sats.cards === 6, `se despliega en «De qué va», ${sats.facts} destacados y el README`);
  check(sats.readme && sats.github, 'el README completo se carga, con su enlace a GitHub');
  check(await allInView(page, '[data-project="figuris"] [data-card]'), 'la cámara encuadra el proyecto abierto entero');
  await shot('02-figuris-abierto');
  // the README scrolls itself; the canvas does not move
  c0 = await cam(page);
  const readme = page.locator('#detalle-figuris .readme');
  const rb = await readme.boundingBox();
  await page.mouse.move(rb.x + rb.width / 2, rb.y + rb.height / 2);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(300);
  check((await cam(page)) === c0 && (await readme.evaluate((e) => e.scrollTop)) > 0, 'la rueda sobre el README lo desplaza a él, no al lienzo');
  // Tab from the cover goes into its cards
  await page.locator('[data-slug="figuris"] .cover__open').focus();
  await page.keyboard.press('Tab');
  check(await page.evaluate(() => !!document.activeElement?.closest('#detalle-figuris')), 'Tab pasa de la portada a sus tarjetas');
  check(await page.evaluate(() => document.querySelector('#detalle-gcms, #detalle-analisis-metabolomico-gcms').inert), 'las tarjetas de los proyectos cerrados no reciben el foco');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  check((await openProject(page)) === null, 'Esc cierra el proyecto');
  // open another, then a click on the background closes it
  await page.locator('[data-slug="precio-vehiculos"] .cover__open').click();
  await page.waitForTimeout(1200);
  await page.mouse.click(1380, 140);
  await page.waitForTimeout(800);
  check((await openProject(page)) === null, 'un clic en el fondo cierra el proyecto abierto');

  // the docked device frames a collection
  await page.locator('[data-device="dock"]').first().focus();
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(800);
  check(await allInView(page, '[data-cover][data-collection="04"]'), 'el dispositivo acoplado encuadra la colección 04');

  // touch: pinch zoom on the background
  c0 = await page.locator('.hud__zoom').textContent();
  await page.evaluate(() => {
    const el = document.querySelector('[data-canvas-layer]');
    const ev = (type, id, x, y) =>
      el.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: id, pointerType: 'touch', clientX: x, clientY: y, isPrimary: id === 1 }));
    ev('pointerdown', 1, 700, 130);
    ev('pointerdown', 2, 760, 130);
    for (let i = 1; i <= 10; i++) {
      ev('pointermove', 1, 700 - i * 8, 130);
      ev('pointermove', 2, 760 + i * 8, 130);
    }
    ev('pointerup', 1, 620, 130);
    ev('pointerup', 2, 840, 130);
  });
  check((await page.locator('.hud__zoom').textContent()) !== c0, `pellizcar con dos dedos cambia el zoom (${c0} → ${await page.locator('.hud__zoom').textContent()})`);

  // list view (and opening from it: a plain page change, the covers are behind the list)
  await page.locator('.hud__bar button', { hasText: 'Lista' }).click();
  check((await page.locator('#lista-proyectos li').count()) === 13, 'la vista Lista tiene los 13 proyectos');
  await shot('03-lista');
  await page.keyboard.press('Escape');
  check(await page.locator('#lista-proyectos').isHidden(), 'Esc cierra la lista');
  await page.locator('.hud__bar button', { hasText: 'Lista' }).click();
  const before = await page.evaluate(() => (window.__e3?.transitions ?? []).length);
  await page.locator('#lista-proyectos a', { hasText: 'Alerta temprana' }).click();
  await page.waitForTimeout(500);
  const labels = await page.evaluate((n) => (window.__e3?.transitions ?? []).slice(n).map((t) => t.label), before);
  check(
    page.url().endsWith('/proyectos/morosidad-crediticia/') && !labels.some((l) => l.startsWith('tarjeta')),
    'desde la vista Lista se abre el proyecto con un cambio de página normal',
  );
  await page.goBack();
  await page.waitForTimeout(600);

  // case study: from an open project, «Página del proyecto» grows the cover into it; back, same point
  await page.locator('.hud__bar button', { hasText: 'Reset' }).click();
  await page.waitForTimeout(700);
  await page.locator('[data-slug="figuris"] .cover__open').click();
  await page.waitForTimeout(1300);
  const camBefore = await cam(page);
  await page.locator('#detalle-figuris a', { hasText: 'Página del proyecto' }).click();
  await page.waitForTimeout(250);
  const growing = await page.evaluate(() => {
    const r = document.querySelector('.stage > .layered [data-layer]')?.getBoundingClientRect();
    return r ? r.width > 0 && r.width < innerWidth - 10 : false;
  });
  check(growing, 'la portada crece hasta el caso de estudio (a mitad de camino)');
  await shot('04-portada-creciendo');
  await page.waitForTimeout(1000);
  check(page.url().endsWith('/proyectos/figuris/') && (await clean(page)), 'llega al caso de estudio');
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(300);
  await page.goBack();
  await page.waitForTimeout(1300);
  check(
    page.url().endsWith('/proyectos/') && (await clean(page)) && (await openProject(page)) === 'figuris' && (await cam(page)) === camBefore,
    'atrás: la página se encoge en su portada y el lienzo sigue igual (misma cámara, Figuris abierto)',
  );
  check(await page.evaluate(() => document.activeElement?.closest('[data-slug]')?.dataset.slug === 'figuris'), 'el foco vuelve a la portada');
  // interrupted: forward, then back mid-flight
  await page.locator('#detalle-figuris a', { hasText: 'Página del proyecto' }).click();
  await page.waitForTimeout(200);
  await page.goBack();
  await page.waitForTimeout(1300);
  check(page.url().endsWith('/proyectos/') && (await clean(page)), 'atrás a mitad de camino: vuelve a la portada sin romperse');

  // home: the canvas closes the project and returns to its initial composition first, then the screen shrinks
  await page.locator('.hud__bar button', { hasText: 'Inicio' }).click();
  await page.waitForTimeout(200);
  check((await openProject(page)) === null && (await page.locator('.stage > [data-page]').count()) === 1, 'Inicio: primero cierra el proyecto y vuelve a la composición inicial');
  await page.waitForTimeout(1500);
  check(page.url().endsWith('/portfolio-personal/') && (await clean(page)), '…y después la pantalla se encoge hasta la home');

  // Mi música from the docked device (test data: only the dev server has them, a build ignores ?musica=prueba)
  await page.goto(B + 'proyectos/?musica=prueba', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const musicRow = page.locator('[data-device="dock"]').first().getByRole('option', { name: /Mi música/ });
  if ((await musicRow.getAttribute('aria-disabled')) === 'true') {
    console.log('  info  Mi música desde el acoplado: sin datos de prueba en una build (pásalo con el servidor de desarrollo)');
  } else {
    await page.locator('[data-device="dock"]').first().focus();
    for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2600);
    check(
      (await page.locator('[data-device="hero"] .os__title').textContent()) === 'Mi música' && (await page.locator('.acc.is-plugged').count()) === 1,
      'Mi música desde el acoplado: vuelve a la home, se abre y se conectan los auriculares',
    );
  }
  await page.goto(B + '?musica=no');

  console.log(`  errores de consola: ${errs.length ? errs.join(' | ') : 'ninguno'}`);
  await ctx.close();
}

// ── Phone: the projects list ──
{
  console.log('\n390 × 844');
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errs = watch(page);
  await page.goto(B, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.locator('.home__cta .pill').tap();
  await page.waitForTimeout(300);
  // mid-flight: the list page is what the window compensates (not the hidden canvas world)
  const compensated = await page.evaluate(() => {
    const w = document.querySelector('.canvas-page__mobile [data-world]');
    return !!w && w.getAnimations().length > 0;
  });
  check(compensated, 'a mitad de camino, la lista se muestra a escala uniforme (sin estirarse)');
  await page.waitForTimeout(1000);
  const list = await page.evaluate(() => ({
    canvas: getComputedStyle(document.querySelector('.canvas')).display,
    items: document.querySelectorAll('.canvas-page__mobile .list-view__group li').length,
    scrolls: getComputedStyle(document.documentElement).overflow !== 'hidden',
  }));
  check(page.url().endsWith('/proyectos/') && (await clean(page)), 'la pantalla crece hasta la lista de proyectos');
  check(list.canvas === 'none' && list.items === 13 && list.scrolls, 'en móvil: lista de 13 proyectos que se desplaza, sin lienzo');
  await page.screenshot({ path: `${OUT}/06-movil-lista.png` });
  const fig = page.locator('.canvas-page__mobile a', { hasText: 'Figuris' });
  await fig.scrollIntoViewIfNeeded();
  const y = await page.evaluate(() => scrollY);
  await fig.tap();
  await page.waitForTimeout(600);
  check(page.url().endsWith('/proyectos/figuris/'), 'tocar un proyecto abre su caso de estudio');
  await page.goBack();
  await page.waitForTimeout(600);
  check((await page.evaluate(() => scrollY)) === y, `al volver, la lista sigue donde estaba (${y} px)`);
  await page.locator('[data-device="dock"]').filter({ visible: true }).locator('.key--home').tap();
  await page.waitForTimeout(1300);
  check(page.url().endsWith('/portfolio-personal/') && (await clean(page)), 'INICIO del acoplado vuelve a la home');
  console.log(`  errores de consola: ${errs.length ? errs.join(' | ') : 'ninguno'}`);
  await ctx.close();
}

await browser.close();
console.log(failed ? `\n${failed} comprobaciones fallidas` : '\ntodo ok');
process.exit(failed ? 1 : 0);
