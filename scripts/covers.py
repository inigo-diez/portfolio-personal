"""Canvas covers of the 13 projects (E8, 2026-10-24) -> public/img/covers/.

Each cover shows a real result or a real view of the project, at the size of the cover's image slot (260 x 120
world px; about 161 x 74 on screen at the canvas's opening zoom). Iñigo chose or approved each one on
2026-10-24; whole figures, never cropped inside a plot, except where noted. Sources, all checked that day:

- simulacion-wti-montecarlo: redrawn fan chart, P5-P95 / P25-P75 bands and median of the paths saved by the
  published run (Part2/outputs/mc_paths_base.parquet: 500 of the 2,000 paths per scenario; its validation table
  matches the README's), in the scenario colours of the published fig_mc_fan_chart.png (blue, amber, red).
  Log price, as the model (x_t = log P_t).
- biomarcadores-salud-mental: a capture of the project's real dashboard (report_mhb.html, 38,952 entries; taken
  by scripts/covers-capture.mjs into materials/covers).
- priorizacion-metabolitos: the README's whole ranking figure, its bars only: the text (names, values, axes) is
  turned white and the bars are fitted to the slot, which shortens their spacing but keeps every length and
  the order. Its value labels look swapped against the bar lengths (told to Iñigo), so none is shown.
- estres-petroleo-gdelt: the first two panels (armed conflict, sanctions) of the README's fig_event_wti_path.
- figuris: the whole docs/img/fig01-visor.png (local repository, README identical to the published copy).
- the other README figures listed in FIGURES, whole, and the picture Iñigo gave for the sensor analyser.

Run (throwaway environment, nothing installed):
  node scripts/covers-capture.mjs   # only to retake the dashboard capture
  uv run --with pandas --with pyarrow --with pillow scripts/covers.py
"""

import math
from pathlib import Path

import pandas as pd
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "img" / "covers"
READMES = ROOT / "public" / "img" / "readmes"
MATERIALS = ROOT / "materials" / "covers"
WTI = Path(r"C:\Users\usuario\Desktop\2020-2026\PROYECTOS GITHUB\Geopolitica Simulación Crudo Parte 2\Part2\outputs\mc_paths_base.parquet")
FIG = Path(r"C:\Users\usuario\Documents\PROYECTOS GITHUB\scientific-figure-intelligence\docs\img\fig01-visor.png")

W, H = 260, 120
AXIS = "#252525"
OUT.mkdir(parents=True, exist_ok=True)
for old in ("morosidad-crediticia.svg", "biomarcadores-salud-mental.svg"):  # earlier covers, replaced
    (OUT / old).unlink(missing_ok=True)


def poly(pts):
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)


def write_svg(name, body):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><rect width="{W}" height="{H}" fill="#fff"/>{body}</svg>\n'
    (OUT / name).write_text(svg, encoding="utf-8")


def save_fit(im, name, note):
    """The whole image, scaled to fit the slot at 2x with a small margin and centred on white."""
    pad = 8
    k = min((W * 2 - 2 * pad) / im.width, (H * 2 - 2 * pad) / im.height)
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    slot = Image.new("RGB", (W * 2, H * 2), "white")
    slot.paste(im, ((W * 2 - im.width) // 2, (H * 2 - im.height) // 2))
    slot.save(OUT / name, "WEBP", quality=88)
    print(f"{name}: {note}, {im.width}x{im.height} de {W * 2}x{H * 2}")


def fit(src, name, bleed=False):
    """A whole image file. bleed: a picture already in the slot's shape fills it edge to edge (loses < 1 %)."""
    im = Image.open(src).convert("RGB")
    if bleed:
        assert abs(im.width / im.height - W / H) / (W / H) < 0.01, f"{name}: not the slot's shape"
        ImageOps.fit(im, (W * 2, H * 2), Image.LANCZOS).save(OUT / name, "WEBP", quality=88)
        print(f"{name}: {Path(src).name} a sangre")
        return
    save_fit(im, name, f"{Path(src).name} entera")


# WTI: one fan per scenario (low, base, high geopolitical tension), side by side, on one log price scale, in the
# published figure's colours; bands strong enough to read at the cover's size.
COLOURS = {"low_geo": "#2196F3", "base": "#FF9800", "high_geo": "#F44336"}  # sampled from fig_mc_fan_chart.png
p = pd.read_parquet(WTI)
q = p.groupby(["scenario", "t"]).P_t.quantile([0.05, 0.25, 0.5, 0.75, 0.95]).unstack()
lo, hi = math.log(50), math.log(360)
gap, pad = 12, 16
pw = (W - 2 * pad - 2 * gap) / 3
T, B = 12, H - 12
yy = lambda v: B - (math.log(v) - lo) / (hi - lo) * (B - T)
parts = []
for i, (sc, colour) in enumerate(COLOURS.items()):
    d = q.xs(sc, level="scenario").iloc[::3]
    x0 = pad + i * (pw + gap)
    xs = [x0 + t / 252 * pw for t in d.index]
    band = lambda a, b: poly(list(zip(xs, map(yy, d[a]))) + list(zip(xs[::-1], map(yy, d[b][::-1]))))
    parts.append(f'<polygon points="{band(0.05, 0.95)}" fill="{colour}" fill-opacity="0.22"/>')
    parts.append(f'<polygon points="{band(0.25, 0.75)}" fill="{colour}" fill-opacity="0.45"/>')
    parts.append(f'<polyline points="{poly(zip(xs, map(yy, d[0.5])))}" fill="none" stroke="{colour}" stroke-width="2.5" stroke-linejoin="round"/>')
    parts.append(f'<line x1="{x0:.1f}" y1="{B}" x2="{x0 + pw:.1f}" y2="{B}" stroke="{AXIS}" stroke-opacity="0.25"/>')
write_svg("simulacion-wti-montecarlo.svg", "".join(parts))
print("simulacion-wti-montecarlo.svg: abanicos en azul, ámbar y rojo")

# Biomarcadores: the dashboard capture (header and first rows of the real table).
fit(MATERIALS / "biomarcadores-dashboard.png", "biomarcadores-salud-mental.webp")

# Priorización: the bars of the whole ranking, without text. A pixel is kept if it is coloured (its channels
# differ); the names, values, title and axes are grey or black, so they turn white. Then the bars' box is fitted
# to the slot: the same horizontal scale for every bar (lengths and order kept), less space between them.
rank = Image.open(READMES / "priorizacion-metabolitos" / "561104312-013793cc-000f-4ec7-96b8-abfa1d2fdf80.png").convert("RGB")
px = rank.load()
for y in range(rank.height):
    for x in range(rank.width):
        r, g, b = px[x, y]
        if max(r, g, b) - min(r, g, b) < 10:
            px[x, y] = (255, 255, 255)
box = ImageOps.invert(rank).getbbox()
bars = rank.crop(box)
margin = 10
slot = Image.new("RGB", (W * 2, H * 2), "white")
slot.paste(bars.resize((W * 2 - 2 * margin, H * 2 - 2 * margin), Image.LANCZOS), (margin, margin))
slot.save(OUT / "priorizacion-metabolitos.webp", "WEBP", quality=88)
print(f"priorizacion-metabolitos.webp: barras del ranking {box}, sin texto")

# GDELT: the first two of the five panels of the WTI paths around events (armed conflict and sanctions), with
# their panel titles; the figure's own title, which spans the five, is left out.
paths = Image.open(READMES / "estres-petroleo-gdelt" / "fig_event_wti_path.png").convert("RGB")
two = paths.crop((0, round(paths.height * 0.06), round(paths.width * 0.4), paths.height))
save_fit(two, "estres-petroleo-gdelt.webp", "fig_event_wti_path, paneles 1 y 2")

# Figuris: its whole viewer screenshot.
fit(FIG, "figuris.webp")

# The other projects: one whole figure of each README, taken from the copies scripts/readmes.mjs makes of Iñigo's
# local repositories (public/img/readmes; how each copy was checked is in that script), in their original
# colours. A landscape figure is preferred: a tall one would be tiny in the wide slot. Morosidad: a description
# of the data (default rate by region), not one of the README's model figures, which belong to the evaluation
# with repeated records.
FIGURES = {
    "morosidad-crediticia": "img_06.png",
    "analisis-metabolomico-gcms": "05_cluster_profiles.png",
    "optimizacion-rsm": "Y1_Superficies.png",
    "optimizacion-ml-vs-rsm": "05_03_rsm_surface_contour.png",
    "contagio-eeuu-iran": "polymarket_heatmap.png",
    "precio-vehiculos": "22_kmeans_scatter_mileage_vs_year.png",
    "precio-portatiles": "fig_15.png",
}
for slug, name in FIGURES.items():
    fit(READMES / slug / name, f"{slug}.webp")

# Analizador de sensores: its README has no image; the cover is the picture Iñigo gave for it, kept as it is.
fit(MATERIALS / "analizador-sensores-llm.png", "analizador-sensores-llm.webp", bleed=True)
print("portadas en", OUT)
