#!/usr/bin/env python3
"""Generate favicon ('n' mark) + apple-touch-icon. Sober, white bg, monospace."""
import os
from PIL import Image, ImageDraw, ImageFont

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
TEXT = "n"
BG = (255, 255, 255)
FG = (42, 42, 42)  # #2a2a2a
# Chemin relatif au repo (script dans scripts/), portable.
_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(_ROOT, "derroitte.com", "public_html")


def render(size, font_ratio=0.72):
    img = Image.new("RGB", (size, size), BG)
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(FONT, int(size * font_ratio))
    b = d.textbbox((0, 0), TEXT, font=f)
    tw, th = b[2] - b[0], b[3] - b[1]
    d.text(((size - tw) / 2 - b[0], (size - th) / 2 - b[1]), TEXT, font=f, fill=FG)
    return img


# Multi-size .ico: render one crisp high-res master, let Pillow embed each size.
master = render(256, font_ratio=0.72)
master.save(f"{OUT}/favicon.ico", format="ICO",
            sizes=[(16, 16), (32, 32), (48, 48)])

# Apple touch icon (180x180, a touch more padding)
render(180, font_ratio=0.62).save(f"{OUT}/apple-touch-icon.png")

# PNG favicons for Google SERP (square, multiples of 48px)
render(96, font_ratio=0.72).save(f"{OUT}/favicon-96x96.png")
render(144, font_ratio=0.72).save(f"{OUT}/favicon-144x144.png")

print("OK: favicon.ico (16/32/48) + apple-touch-icon.png (180) + favicon-96/144")
