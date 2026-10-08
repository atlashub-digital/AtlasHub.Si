"""Export engine output (o{i}/items.json + bg.png) into a repo as compact JSON + webp.

Usage: python3 export.py <outdir> <screen-id> <title> <json-out> <webp-out> [links.json]
<outdir> is the engine output folder; links.json lists the clickable areas (mockup px).
"""
import json, sys, re
from PIL import Image

odir, sid, title, jout, wout = sys.argv[1:6]
links = json.load(open(sys.argv[6])) if len(sys.argv) > 6 else []
src = json.load(open(f'{odir}/items.json'))
items = []
for o in src['items']:
    it = {"t": o['text'], "x": round(o['x'], 2), "y": round(o['y'], 2), "s": round(o['size'], 2),
          "w": o['w'], "f": 'bsc' if o['fam'] == 'bsc' else 'figtree', "c": o['color']}
    if abs(o.get('ls', 0)) > 0.005: it['ls'] = round(o['ls'], 3)
    if '{' in o['text'] and o.get('accent'): it['a'] = o['accent']
    tag = o.get('tag') or 'p'
    if tag == 'h1': tag = 'span'
    if tag != 'p': it['tag'] = tag
    if not o.get('first', True) and tag in ('h1', 'h2', 'h3'): it['tag'] = 'span'
    items.append(it)
Image.open(f'{odir}/bg.png').save(wout, 'WEBP', quality=88, method=6)
json.dump({"id": sid, "title": title, "W": src['W'], "H": src['H'], "bg": f"/mockups/{sid}.webp",
           "items": items, "links": links}, open(jout, 'w'), ensure_ascii=False, indent=0)
print(sid, len(items), 'items', len(links), 'links')
