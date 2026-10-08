"""
Rebuilds the self-hosted Playfair files in /public/fonts.

Playfair is pinned to weight 400 / width 100 with the optical-size axis kept,
then subset per language: English (Latin) and Macedonian (Latin + Cyrillic),
one file per style. Only needed if you want different glyphs or weights.

  pip install fonttools brotli
  # Download Playfair[opsz,wdth,wght].ttf and Playfair-Italic[opsz,wdth,wght].ttf
  # from https://github.com/google/fonts/tree/main/ofl/playfair
  python scripts/subset-playfair.py path/to/Playfair[...].ttf path/to/Playfair-Italic[...].ttf
"""
import os
import sys
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

roman, italic = sys.argv[1], sys.argv[2]
out_dir = os.path.join(os.path.dirname(__file__), "..", "public", "fonts")

common = (
    list(range(0x20, 0x7F))  # Basic Latin
    + list(range(0xA0, 0x100))  # Latin-1
    + list(range(0x2010, 0x2028))  # dashes, quotes, ellipsis
    + list(range(0x2030, 0x203B))
    + [0x20AC, 0x2122]
)
sets = {"en": common, "mk": common + [0x0301, 0x2116] + list(range(0x400, 0x460))}

for src, style in [(roman, "normal"), (italic, "italic")]:
    for name, unicodes in sets.items():
        font = instancer.instantiateVariableFont(TTFont(src), {"wght": 400, "wdth": 100})
        options = subset.Options()
        options.flavor = "woff2"
        options.hinting = False
        options.notdef_outline = True
        options.layout_features = ["kern", "liga", "locl", "mark", "mkmk", "ccmp"]
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=unicodes)
        subsetter.subset(font)
        font.flavor = "woff2"
        path = os.path.join(out_dir, f"playfair-{name}-{style}.woff2")
        font.save(path)
        print(path, os.path.getsize(path))
