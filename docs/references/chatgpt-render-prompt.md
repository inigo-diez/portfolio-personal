# Prompts para ChatGPT (renders de referencia para E2)

**Cómo usarlo**
1. Abre un chat nuevo en ChatGPT y pega primero el bloque **0 · Contexto**.
2. Después pide las imágenes **una a una** (1 → 7), pegando cada prompt. Si una no te gusta, pide "another variation" antes de pasar a la siguiente.
3. Guarda las que te gusten en `materials/renders/` con el número del prompt en el nombre (p. ej. `1-wheel-front-v2.png`). Las que no te convenzan también me sirven, si me dices por qué no te gustan.
4. Lo importante son la **1–4** (el dispositivo). La 5–7 son opcionales.

Los prompts están en inglés porque los generadores de imágenes responden mejor en inglés.

---

## 0 · Contexto (pegar primero)

```
I'm designing my personal portfolio website. Its centerpiece is a fictional, original pocket device rendered in the browser with CSS/SVG: a cross between an early-2000s digital music player, a vintage PDA (Palm V, Compaq iPAQ) and a compact futuristic computer. Its screen runs a tiny custom operating system ("Pocket OS") used to navigate my work. When the visitor opens "Projects", the device's screen expands into a full-page white "infinite canvas" of project cards.

I need concept renders to define the industrial design before building it. Rules for every image:
- Original design. NOT an iPod, Playdate, Game Boy or any real product. No real brand logos.
- Premium, calm, slightly retro, unmistakably technological. Think Dieter Rams / Braun, Teenage Engineering, early Apple industrial design — restraint, precision, few elements.
- Materials: pearl-white or brushed-silver housing, fine metallic edge, matte surfaces, restrained reflections, soft realistic shadows.
- Palette: background #F7F7F5, white #FFFFFF, light grey #E5E6E8, metal #CFD2D6, text #252525, single accent blue #4F75AD (only for selection/indicator), optional tiny mint #A8D5CB LED.
- No neon, no purple gradients, no glassmorphism, no cyberpunk, no particles, no busy backgrounds.
- Keep any text on the device minimal (short labels in a small monospace font); don't fill the screen with fake paragraphs.
- Studio product photography lighting, plain #F7F7F5 background.
Acknowledge and wait for my image requests.
```

## 1 · Concepto A "Wheel" — vista frontal

```
Image 1 — Concept A "Wheel". Strict front orthographic view (no perspective), device centered, full device visible, on a plain #F7F7F5 background.
Portrait device, roughly 62 x 104 mm proportions, rounded-rectangle silhouette with softly radiused corners. Pearl-white front with a thin brushed-aluminium edge band.
Top ~50%: a screen LARGER than a classic MP3 player screen, nearly square or slightly landscape (around 4:3), set in a subtle dark bezel, showing a minimal monochrome menu (6 short items, one highlighted in blue #4F75AD) and a tiny status bar.
Bottom: a simplified circular navigation wheel, flatter and more minimal than an iPod click wheel, with a center select button; tiny engraved monospace labels.
Plus ONE unexpected secondary control on the right edge (a small thumb dial or slider).
Hardware details: a tiny engraved logo mark, a serial-number style label "POCKET OS / 001", one small indicator LED, a fine speaker-grille slot near the top.
```

## 2 · Concepto A "Wheel" — foto de producto 3/4

```
Image 2 — Same Concept A device from Image 1, now as a premium product photo in three-quarter view, lying slightly tilted on the #F7F7F5 surface, showing the side profile, the aluminium edge, the thumb dial on the side and the thickness (thin, about 11 mm). Soft shadow, restrained highlights. Keep every detail consistent with Image 1.
```

## 3 · Concepto B "Slate" — vista frontal

```
Image 3 — Concept B "Slate". Strict front orthographic view, device centered, plain #F7F7F5 background.
Landscape-ish / nearly square handheld, roughly 110 x 84 mm proportions, inspired by vintage PDAs but more minimal. Two-tone housing: upper zone brushed-silver frame around a large LANDSCAPE screen (about 16:10) with a thin dark bezel; lower band in a slightly darker warm grey (like the Palm V's lower band) holding the controls.
Controls in the lower band: a compact circular navigation ring on the left with a center button, two small round buttons on the right (BACK and HOME, tiny engraved labels).
Details: four tiny visible screws at the corners of the screen frame, a vertical speaker-grille slot, one small mint LED, engraved monospace label "POCKET OS / 001".
Screen shows a minimal monochrome menu with one item highlighted in blue #4F75AD and a tiny status bar.
```

## 4 · Concepto B "Slate" — foto de producto 3/4

```
Image 4 — Same Concept B device from Image 3, as a premium product photo in three-quarter view, standing slightly angled on the #F7F7F5 surface, showing thickness, the two-tone split, the edge detailing and the controls. Soft shadow, restrained highlights. Keep every detail consistent with Image 3.
```

## 5 · (Opcional) Primer plano de la pantalla: el sistema operativo

```
Image 5 — Close-up, straight-on, of the device screen only (no housing), landscape 4:3. A tiny custom operating system called "Pocket OS": very light grey-white display (#FFFFFF / #E5E6E8), dark text #252525, a thin top status bar (time, small battery icon, "POCKET OS"), a vertical menu: Inicio, Proyectos, Sobre mí, Trayectoria, Habilidades, Archivo, Contacto, CV — "Proyectos" selected with a blue #4F75AD highlight bar. Small monochrome line icons. Precise, Swiss-style, compact typography (a clean sans-serif plus a small monospace for metadata). Subtle LCD feel without looking cheap or pixelated.
```

## 6 · (Opcional) Composición de la página de inicio

```
Image 6 — Website homepage mockup, desktop 16:10, flat UI screenshot style (not a photo of a monitor). Nearly white background #F7F7F5. The Pocket OS device (choose the design you consider strongest from Images 1–4) sits near the center as the clear focal point, large and crisp. Around it, restrained editorial typography with lots of negative space: the name "Iñigo Díez" small but confident at top-left, a short line "Tecnología · Datos · Resolución de problemas", a discreet hint "Explora el dispositivo" near the device, and subtle text links around the edges: Proyectos, Sobre mí, GitHub, Contacto, CV. Swiss editorial layout, asymmetric balance, no hero banner, no cards, no gradients.
```

## 7 · (Opcional) El "infinite canvas" de proyectos

```
Image 7 — Website mockup, desktop 16:10, flat UI screenshot style. A spacious white "infinite canvas" with a very faint dot grid. Four curated piles of project cards spread across the space at different sizes (one larger in the center-left), each pile slightly fanned like stacked editorial cards; one pile is unfolded into 3 cards. Each card: a real-looking data chart thumbnail in the site palette (white, dark grey, blue #4F75AD), a short title, one big number and a small label. A minimal technical HUD in small monospace type: zoom percentage "100%", coordinates, and controls "Zoom + / −", "Reset", "Lista", "Inicio" in a corner. Calm, curated, lots of white space — not a messy whiteboard. Optionally show, small in a corner, the Pocket OS device whose screen the canvas grew out of.
```
