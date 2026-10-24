"""CV sheet image: renders the single page of public/cv.pdf to public/img/cv-preview.webp.

The CV page shows this image as a sheet of paper, linked to the PDF (an embedded PDF viewer is not reliable on
phones, and Iñigo preferred the sheet to the framed viewer, 2026-10-24). Run again whenever public/cv.pdf changes:

    py -3 scripts/cv-preview.py
"""

from io import BytesIO
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "public" / "cv.pdf"
OUT = ROOT / "public" / "img" / "cv-preview.webp"
WIDTH = 1440  # px: sharp at 2x on the 720 px sheet of the CV page

page = pymupdf.open(PDF)[0]
pix = page.get_pixmap(matrix=pymupdf.Matrix(WIDTH / page.rect.width, WIDTH / page.rect.width), alpha=False)
img = Image.open(BytesIO(pix.tobytes("png")))
img.save(OUT, "WEBP", quality=88, method=6)
print(f"{OUT.relative_to(ROOT)}: {img.width} x {img.height}, {OUT.stat().st_size // 1024} KB")
