#!/usr/bin/env python3
"""Generate the 'natan' brand image (PNG) for og:image / label use.
Sober, white background, monospace (matches site typography)."""
from PIL import Image, ImageDraw, ImageFont

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
TEXT = "natan"
BG = (255, 255, 255)       # fond blanc
FG = (42, 42, 42)          # #2a2a2a, gris sobre du site

# --- og:image 1200x630 (partage LinkedIn etc.) ---
W, H = 1200, 630
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)
font = ImageFont.truetype(FONT, 200)
bbox = d.textbbox((0, 0), TEXT, font=font)
tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
d.text(((W - tw) / 2 - bbox[0], (H - th) / 2 - bbox[1]), TEXT, font=font, fill=FG)
img.save("/home/nderroitte/repos/derroitte.com/derroitte.com/public_html/images/natan-og.png")

# --- version carree haute-res pour etiquette/sticker (impression nette) ---
S = 1024
img2 = Image.new("RGB", (S, S), BG)
d2 = ImageDraw.Draw(img2)
font2 = ImageFont.truetype(FONT, 230)
bbox2 = d2.textbbox((0, 0), TEXT, font=font2)
tw2, th2 = bbox2[2] - bbox2[0], bbox2[3] - bbox2[1]
d2.text(((S - tw2) / 2 - bbox2[0], (S - th2) / 2 - bbox2[1]), TEXT, font=font2, fill=FG)
img2.save("/home/nderroitte/repos/derroitte.com/derroitte.com/public_html/images/natan-label.png")

print("OK: natan-og.png (1200x630) + natan-label.png (1024x1024)")
