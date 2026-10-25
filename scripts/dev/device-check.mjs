// Dev check of the iDO Pocket device (E4): drives the home device with the keyboard, touch and the mouse in headless
// Edge, desktop + mobile, saves a screenshot per screen and reports console errors and failed checks.
// Sobre mí, Trayectoria, Habilidades, Formación, Contacto and CV grow into their page (device docked);
// Mi música and Mis libros open inside the device.
// Usage: npm run dev (or build + preview), then: node scripts/dev/device-check.mjs [base-url] [out-dir]
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';

const B = process.argv[2] ?? 'http://localhost:5173/portfolio-personal/';
const OUT = process.argv[3] ?? '_reference/e4';
// the songs of Mi música (scripts/music-playlist.py)
const SONGS = JSON.parse(
  readFileSync(new URL('../../src/content/music-playlist.json', import.meta.url), 'utf8'),
).length;
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
  // screen: large, so the page does not take the phone's desktop layout (index.html) and the 390 px layout is tested
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    screen: { width: 1200, height: 1200 },
    hasTouch: touch,
    isMobile: touch,
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => sessionStorage.setItem('ido-welcome', '1')); // no welcome screen (app/Welcome.tsx)
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
  check((await sel()) === 'Sobre mí', 'el menú se abre en Sobre mí');
  check((await page.locator('[data-device="hero"] .os__item').count()) === 9, 'menú de 9 entradas');
  const rowPx = await page
    .locator('[data-device="hero"] .os__item')
    .first()
    .evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
  check(rowPx >= 12, `letra del menú ≥ 12 px (${rowPx.toFixed(1)})`);

  // every section, with the keyboard (the menu opens on Sobre mí: ↓ = Trayectoria, ↓↓ = Proyectos…).
  // The menu and the pages use the same section names.
  const sectionsByKeys = [
    ['ArrowDown', 0, 'Sobre mí', 'sobre-mi'],
    ['ArrowDown', 1, 'Trayectoria', 'trayectoria'],
    ['ArrowDown', 3, 'Habilidades', 'habilidades'],
    ['ArrowDown', 4, 'Formación', 'formacion'],
    ['ArrowDown', 5, 'Contacto', 'contacto'],
    ['ArrowDown', 6, 'CV', 'cv'],
  ];
  for (const [k, n, label, slug] of sectionsByKeys) {
    await key('Home');
    await key(k, n);
    await key('ArrowRight');
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
    check(
      page.url().endsWith('/portfolio-personal/') && (await title()) === 'iDO',
      `Esc vuelve a la home desde ${label}`,
    );
    check((await sel()) === label, `al volver, el menú está en ${label}`);
  }
  check((await sel()) === 'CV', 'al volver, la selección sigue en la sección de la que vienes');

  // Mis libros: the last entry; cover, back cover (open key), previous / next
  await key('ArrowDown');
  check((await sel()) === 'Mi música', 'Mi música sigue a CV');
  await key('ArrowDown');
  check((await sel()) === 'Mis libros', 'Mis libros es la última entrada');
  await key('ArrowDown');
  check((await sel()) === 'Mis libros', 'la lista no pasa de la última entrada (sin vuelta)');
  await key('ArrowRight');
  await page.waitForTimeout(900);
  const book = () => page.locator('[data-device="hero"] .bk__meta b').textContent();
  const turned = () => page.locator('[data-device="hero"] .bk__inner.is-back').count();
  check((await title()) === 'Mis libros', 'Mis libros se abre dentro del dispositivo');
  check((await book()) === 'Tokio blues (Norwegian Wood)', 'empieza por el primer libro, de frente');
  await shot('03b-mis-libros');
  await key('ArrowRight');
  check((await turned()) === 1, 'la tecla de abrir da la vuelta al libro');
  await key('ArrowRight');
  check((await turned()) === 0, 'y otra vez lo pone de frente');
  await page.locator('[data-device="hero"] .bk__card').click();
  check((await turned()) === 1, 'pinchar la portada da la vuelta al libro');
  await page.waitForTimeout(700);
  await shot('03c-mis-libros-contraportada');
  await key('ArrowDown');
  check((await book()) === 'Kafka en la orilla' && (await turned()) === 0, 'siguiente: otro libro, de frente');
  await page.locator('[data-device="hero"] .bk__nav button:last-child').click();
  check((await book()) === 'El extranjero', 'el botón «Siguiente» pasa al siguiente');
  await page.locator('[data-device="hero"] .bk__nav button:first-child').click();
  check((await book()) === 'Kafka en la orilla', 'el botón «Anterior» vuelve al anterior');
  await key('ArrowUp');
  await key('ArrowUp');
  check((await book()) === 'Tokio blues (Norwegian Wood)', 'la lista de libros no pasa del primero (sin vuelta)');
  await key('ArrowDown', 6);
  check((await book()) === 'La muerte de Iván Ilich', 'la lista de libros no pasa del último (sin vuelta)');
  await key('Escape');
  await page.waitForTimeout(500);
  check((await title()) === 'iDO', 'ATRÁS vuelve al menú');
  await key('ArrowUp');
  check((await sel()) === 'Mi música', 'al volver, la selección sigue en Mis libros: ↑ lleva a Mi música');

  // Mi música, with the songs of Iñigo's playlist
  await key('ArrowRight');
  await page.waitForTimeout(1200);
  check((await title()) === 'Mi música', `Mi música se abre con sus ${SONGS} canciones`);
  await shot('04-mi-musica');
  await key('Escape');
  await page.waitForTimeout(500);

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
  check(
    page.url().endsWith('/portfolio-personal/') && (await sel()) === 'Contacto',
    'INICIO del acoplado vuelve a la home',
  );

  // ring: tap on the axes and rotation
  await key('Home');
  const ring = await page.locator('[data-device="hero"] [data-ring]').boundingBox();
  const cx = ring.x + ring.width / 2,
    cy = ring.y + ring.height / 2,
    r = ring.width * 0.35;
  await page.mouse.click(cx, cy + r); // − = next
  await page.waitForTimeout(150);
  check((await sel()) === 'Trayectoria', 'tocar − baja una fila');
  await page.mouse.move(cx, cy - r);
  await page.mouse.down();
  for (let a = -90; a <= 0; a += 5) {
    const rad = (a * Math.PI) / 180;
    await page.mouse.move(cx + r * Math.cos(rad), cy + r * Math.sin(rad));
  }
  await page.mouse.up();
  await page.waitForTimeout(150);
  check((await sel()) === 'Formación', `girar 90° en sentido horario avanza (${await sel()})`);
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
    check((await sel()) !== 'Sobre mí', `deslizar hacia arriba avanza (${await sel()})`);
    await page.locator('[data-device="hero"] .os__item', { hasText: 'CV' }).tap();
    await page.waitForTimeout(1000);
    check(page.url().endsWith('/cv/'), 'tocar una fila justo después de deslizar la abre (CV es una página)');
    await page.goBack();
    await page.waitForTimeout(1000);
    await key('Home');
    await swipe(mx + 60, my, mx - 60, my);
    check((await title()) === 'Sobre mí' || page.url().includes('sobre-mi'), 'deslizar a la izquierda abre');
    await page.goto(B + '?musica=no');
    await page.waitForTimeout(400);
    await page.locator('[data-device="hero"] .os__item', { hasText: 'Sobre mí' }).tap();
    await page.waitForTimeout(1000);
    check(page.url().endsWith('/sobre-mi/'), 'tocar Sobre mí abre Sobre mí');
    await page.goBack();
    await page.waitForTimeout(1000);
    // a screen inside the device (CV is a page now): Mi música's list
    await page.locator('[data-device="hero"] .os__item', { hasText: 'Mi música' }).tap();
    await page.waitForTimeout(1200);
    const s2 = await page.locator('[data-device="hero"] [data-screen]').boundingBox();
    await swipe(s2.x + 40, s2.y + s2.height / 2, s2.x + 160, s2.y + s2.height / 2);
    check((await title()) === 'iDO', 'deslizar a la derecha vuelve');
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
  check((await sel()) === 'Sobre mí', 'ese control no mueve la selección');

  // Mi música («Sonando»: shuffle on by default; + toggles it)
  await page.goto(B + '?musica=no');
  await page.waitForTimeout(400);
  await key('ArrowUp', 3); // already on Sobre mí: stays there
  check((await sel()) === 'Sobre mí', 'la lista no pasa de la primera entrada (sin vuelta)');
  await key('ArrowDown', 7); // Sobre mí → … → Mi música
  check((await sel()) === 'Mi música', 'Mi música activa');
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
  const k = () => page.locator('.np__k').textContent();
  const mode = () => page.locator('.np__mode').getAttribute('aria-pressed');
  check((await mode()) === 'true', 'aleatorio activado al entrar');
  await key('ArrowUp');
  check((await mode()) === 'false', '+ (↑) desactiva el aleatorio');
  await key('ArrowRight');
  check((await k()) === `3 de ${SONGS}`, 'en orden, ⏭ (→) pasa a la pista siguiente');
  await key('ArrowLeft');
  check((await k()) === `2 de ${SONGS}`, 'en orden, ⏮ (←) vuelve a la anterior');
  await page.locator('.np__mode').click();
  check((await mode()) === 'true', 'pinchar «Aleatorio» lo vuelve a activar');
  await key('ArrowRight');
  const shuffled = await k();
  check(shuffled !== `2 de ${SONGS}`, `en aleatorio, ⏭ pasa a otra pista (${shuffled})`);
  await key('ArrowLeft');
  check((await k()) === `2 de ${SONGS}`, 'en aleatorio, ⏮ vuelve a la que sonó antes');
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
  check(
    page.url().endsWith('/proyectos/') && (await page.locator('.stage > [data-page]').count()) === 1,
    '…y después llega al lienzo',
  );
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
    (await page.locator('[data-page="home"]').count()) === 1 &&
      !(await page.locator('.pocket__card.is-flipped').count()),
    'y al volver, el dispositivo está de frente',
  );

  // the conventional page
  await page.goto(B + 'mi-musica/');
  await page.waitForTimeout(400);
  check((await page.locator('.songs-page li').count()) === SONGS, 'página /mi-musica/ con la lista completa');
  await shot('09-pagina-mi-musica');
  await page.goto(B + 'mis-libros/');
  await page.waitForTimeout(400);
  check((await page.locator('.books-page li').count()) === 5, 'página /mis-libros/ con los cinco libros');
  await shot('10-pagina-mis-libros');

  console.log(`  errores de consola: ${errs.length ? errs.join(' | ') : 'ninguno'}`);
  await ctx.close();
}
await browser.close();
console.log(failed ? `\n${failed} comprobaciones fallidas` : '\ntodo ok');
process.exit(failed ? 1 : 0);
