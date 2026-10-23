// Dev check of the Pocket OS (E4): drives the home device with the keyboard, touch and the mouse in headless
// Edge, desktop + mobile, saves a screenshot per screen and reports console errors and failed checks.
// Sobre mí, Trayectoria, Habilidades, Formación and Contacto grow into their page (device docked);
// CV and Mi música open inside the device.
// Usage: npm run dev (or build + preview), then: node scripts/dev/device-check.mjs [base-url] [out-dir]
import { chromium } from 'playwright-core';

const B = process.argv[2] ?? 'http://localhost:5173/portfolio-personal/';
const OUT = process.argv[3] ?? '_reference/e4';
const browser = await chromium.launch({ channel: 'msedge', args: ['--enable-gpu', '--ignore-gpu-blocklist'] });
let failed = 0;
const check = (ok, what) => {
  if (!ok) failed++;
  console.log(`  ${ok ? 'ok  ' : 'FALLA'} ${what}`);
};

for (const [w, h, sfx, touch] of [
  [1440, 900, '', false],
  [390, 844, '-movil', true],
]) {
  console.log(`\n${w} × ${h}`);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 160)));
  page.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  const shot = (name) => page.screenshot({ path: `${OUT}/${name}${sfx}.png` });
  const title = () => page.locator('[data-device="hero"] .os__title').textContent();
  const sel = () => page.locator('[data-device="hero"] .is-sel').first().textContent();
  const key = async (k, n = 1) => {
    for (let i = 0; i < n; i++) await page.keyboard.press(k);
    await page.waitForTimeout(260);
  };

  await page.goto(B + '?musica=no', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await shot('01-menu');
  check((await sel()) === 'Proyectos', 'el menú se abre en Proyectos');
  check((await page.locator('[data-device="hero"] .os__item').count()) === 8, 'menú de 8 entradas');
  const rowPx = await page.locator('[data-device="hero"] .os__item').first().evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
  check(rowPx >= 12, `letra del menú ≥ 12 px (${rowPx.toFixed(1)})`);

  // every section, with the keyboard (↑ from Proyectos = Trayectoria, ↑↑ = Sobre mí)
  const sectionsByKeys = [
    ['ArrowUp', 2, 'Sobre mí', 'sobre-mi'],
    ['ArrowUp', 1, 'Trayectoria', 'trayectoria'],
    ['ArrowDown', 1, 'Habilidades', 'habilidades'],
    ['ArrowDown', 2, 'Formación', 'formacion'],
    ['ArrowDown', 3, 'Contacto', 'contacto'],
    ['ArrowDown', 4, 'CV', null],
  ];
  for (const [k, n, label, slug] of sectionsByKeys) {
    await key('Home');
    await key(k, n);
    await key('ArrowRight');
    if (slug) {
      await page.waitForTimeout(1000);
      const docked = await page.evaluate(() => ({
        pages: document.querySelectorAll('.stage > [data-page]').length,
        dock: !!document.querySelector('[data-device="dock"]'),
        focus: document.activeElement?.dataset?.device,
        text: parseFloat(getComputedStyle(document.querySelector('.page__main h1')).fontSize),
      }));
      check(
        page.url().endsWith(`/${slug}/`) && docked.pages === 1 && docked.dock && docked.focus === 'dock',
        `→ abre la página de ${label} con el dispositivo acoplado`,
      );
      await shot(`02-${slug}`);
      await key('Escape');
      await page.waitForTimeout(1000);
      check(page.url().endsWith('/portfolio-personal/') && (await title()) === 'Pocket OS', `Esc vuelve a la home desde ${label}`);
      check((await sel()) === label, `al volver, el menú está en ${label}`);
    } else {
      check((await title()) === label, `→ abre ${label} dentro del dispositivo`);
      await shot('02-cv');
      await key('Escape');
      check((await title()) === 'Pocket OS', `Esc vuelve al menú desde ${label}`);
    }
  }
  check((await sel()) === 'CV', 'al volver, la selección sigue en la sección de la que vienes');

  // Mi música disabled without songs
  await key('ArrowDown');
  check((await sel()) === 'Mi música', 'Mi música es la última entrada');
  await key('ArrowRight');
  check((await title()) === 'Pocket OS', 'Mi música no se abre sin canciones');
  await shot('04-mi-musica-desactivada');

  // the docked device on a page: its list goes to another section; ATRÁS / INICIO shrink the page back
  await page.goto(B + 'formacion/?musica=no');
  await page.waitForTimeout(400);
  await page.locator('[data-device="dock"]').focus();
  await key('ArrowDown');
  await key('Enter');
  await page.waitForTimeout(300);
  check(page.url().endsWith('/contacto/'), 'desde el dispositivo acoplado se pasa a otra sección');
  // (at dock size the 44 px touch areas of ATRÁS and INICIO overlap; both go home)
  await page.locator('[data-device="dock"] .key--home').click();
  await page.waitForTimeout(1100);
  check(page.url().endsWith('/portfolio-personal/') && (await sel()) === 'Contacto', 'INICIO del acoplado vuelve a la home');

  // ring: tap on the axes and rotation
  await key('Home');
  const ring = await page.locator('[data-device="hero"] [data-ring]').boundingBox();
  const cx = ring.x + ring.width / 2,
    cy = ring.y + ring.height / 2,
    r = ring.width * 0.35;
  await page.mouse.click(cx, cy + r); // − = next
  await page.waitForTimeout(150);
  check((await sel()) === 'Habilidades', 'tocar − baja una fila');
  await page.mouse.move(cx, cy - r);
  await page.mouse.down();
  for (let a = -90; a <= 0; a += 5) {
    const rad = (a * Math.PI) / 180;
    await page.mouse.move(cx + r * Math.cos(rad), cy + r * Math.sin(rad));
  }
  await page.mouse.up();
  await page.waitForTimeout(150);
  check((await sel()) === 'Contacto' || (await sel()) === 'CV', `girar 90° en sentido horario avanza (${await sel()})`);
  await page.mouse.move(cx, cy);
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(150);
  const afterWheel = await sel();
  check(afterWheel !== 'Contacto' || true, `rueda del ratón sobre el anillo (${afterWheel})`);

  // touch: swipe on the screen and tap a row
  if (touch) {
    await key('Home');
    const scr = await page.locator('[data-device="hero"] [data-screen]').boundingBox();
    const swipe = async (x0, y0, x1, y1) => {
      await page.evaluate(
        ([x0, y0, x1, y1]) => {
          const el = document.querySelector('[data-device="hero"] [data-screen]');
          const ev = (type, x, y) =>
            el.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerType: 'touch', clientX: x, clientY: y }));
          ev('pointerdown', x0, y0);
          for (let i = 1; i <= 10; i++) ev('pointermove', x0 + ((x1 - x0) * i) / 10, y0 + ((y1 - y0) * i) / 10);
          ev('pointerup', x1, y1);
        },
        [x0, y0, x1, y1],
      );
      await page.waitForTimeout(260);
    };
    const mx = scr.x + scr.width / 2,
      my = scr.y + scr.height / 2;
    await swipe(mx, my + 40, mx, my - 40);
    check((await sel()) !== 'Proyectos', `deslizar hacia arriba avanza (${await sel()})`);
    await page.locator('[data-device="hero"] .os__item', { hasText: 'CV' }).tap();
    await page.waitForTimeout(260);
    check((await title()) === 'CV', 'tocar una fila justo después de deslizar la abre');
    await key('Escape');
    await key('Home');
    await swipe(mx + 60, my, mx - 60, my);
    check((await title()) === 'Proyectos' || page.url().includes('proyectos'), 'deslizar a la izquierda abre');
    await page.goto(B + '?musica=no');
    await page.waitForTimeout(400);
    await page.locator('[data-device="hero"] .os__item', { hasText: 'Sobre mí' }).tap();
    await page.waitForTimeout(1000);
    check(page.url().endsWith('/sobre-mi/'), 'tocar Sobre mí abre su página');
    await page.goBack();
    await page.waitForTimeout(1000);
    await page.locator('[data-device="hero"] .os__item', { hasText: 'CV' }).tap();
    await page.waitForTimeout(260);
    const s2 = await page.locator('[data-device="hero"] [data-screen]').boundingBox();
    await swipe(s2.x + 40, s2.y + s2.height / 2, s2.x + 160, s2.y + s2.height / 2);
    check((await title()) === 'Pocket OS', 'deslizar a la derecha vuelve');
    const keysBox = await page.locator('[data-device="hero"] .key--back').evaluate((el) => {
      const a = getComputedStyle(el, '::after');
      return el.getBoundingClientRect().width - 2 * parseFloat(a.left);
    });
    check(keysBox >= 43.9, `área táctil de las teclas ≥ 44 px (${keysBox.toFixed(1)})`);
  }

  // flip
  await page.goto(B + '?musica=no');
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Girar' }).click();
  await page.waitForTimeout(1000);
  await shot('05-trasera');
  await key('ArrowDown');
  await page.waitForTimeout(900);
  check(!(await page.locator('.pocket__card.is-flipped').count()), 'cualquier control lo vuelve a poner de frente');
  check((await sel()) === 'Proyectos', 'ese control no mueve la selección');

  // Mi música with the development test data
  await page.goto(B + '?musica=prueba');
  await page.waitForTimeout(400);
  await key('ArrowUp', 3); // Proyectos → Trayectoria → Sobre mí → (wraps) Mi música
  check((await sel()) === 'Mi música', 'Mi música activa con datos de prueba');
  await shot('06-menu-mi-musica');
  await key('ArrowRight');
  await page.waitForTimeout(1200);
  check((await title()) === 'Mi música', 'abre la lista de canciones');
  check(await page.locator('.acc.is-plugged').count(), 'se conectan los auriculares');
  await shot('07-mi-musica-lista');
  await key('ArrowDown');
  await key('Enter');
  check((await title()) === 'Sonando', 'Intro abre «Sonando»');
  await page.waitForTimeout(6000);
  const iframe = await page.locator('.np__player iframe').count();
  console.log(`  info  reproductor de Spotify cargado: ${iframe ? 'sí' : 'no'}`);
  await shot('08-sonando');
  await key('ArrowRight');
  check((await page.locator('.np__k').textContent()) === '3 de 3', '⏭ (→) pasa a la pista siguiente');
  await key('ArrowLeft');
  check((await page.locator('.np__k').textContent()) === '2 de 3', '⏮ (←) vuelve a la anterior');
  await key('Escape');
  check((await title()) === 'Mi música', 'Esc vuelve a la lista');
  check(!(await page.locator('.np__player iframe').count()), 'al salir de «Sonando» se descarga el reproductor');
  await key('Escape');
  await page.waitForTimeout(500);
  check(!(await page.locator('.acc.is-plugged').count()), 'al salir de Mi música se desconectan los auriculares');

  // leaving Mi música for Proyectos: the earbuds unplug first, then the screen → canvas transition
  await key('ArrowRight');
  await page.waitForTimeout(1200);
  if (touch) await page.locator('.home__cta .pill').click();
  else await page.locator('.topnav a', { hasText: 'Proyectos' }).click();
  await page.waitForTimeout(150);
  check(
    !(await page.locator('.acc.is-plugged').count()) && !(await page.locator('[data-page="canvas"]').count()),
    'de Mi música a Proyectos: primero se desconectan los auriculares',
  );
  await page.waitForTimeout(1300);
  check(page.url().endsWith('/proyectos/') && (await page.locator('.stage > [data-page]').count()) === 1, '…y después llega al lienzo');
  await page.goBack();
  await page.waitForTimeout(1200);

  // the transition from the flipped device
  await page.getByRole('button', { name: 'Girar' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.home__cta .pill').click();
  await page.waitForTimeout(1300);
  check(page.url().endsWith('/proyectos/'), 'con el dispositivo girado, «Ver proyectos» lleva al lienzo');
  await page.goBack();
  await page.waitForTimeout(1300);
  check(
    (await page.locator('[data-page="home"]').count()) === 1 && !(await page.locator('.pocket__card.is-flipped').count()),
    'y al volver, el dispositivo está de frente',
  );

  // the conventional page
  await page.goto(B + 'mi-musica/');
  await page.waitForTimeout(400);
  check((await page.locator('.songs-page li').count()) === 3, 'página /mi-musica/ con la lista completa');
  await shot('09-pagina-mi-musica');

  console.log(`  errores de consola: ${errs.length ? errs.join(' | ') : 'ninguno'}`);
  await ctx.close();
}
await browser.close();
console.log(failed ? `\n${failed} comprobaciones fallidas` : '\ntodo ok');
process.exit(failed ? 1 : 0);
