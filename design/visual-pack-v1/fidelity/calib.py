"""Check (and correct) browser text widths against the engine measurements.
python3 calib.py <screen.json> <meas.json>   (meas.json from: node shoot.cjs <url> <png> 1672 <meas.json>)
Only rewrites sizes that deviate by more than 0.2 %; run it on a freshly measured build."""
import json, sys
from PIL import ImageFont
import os
HERE = os.path.dirname(os.path.abspath(__file__))
FAM = {'figtree': os.path.join(HERE, 'fonts', 'figtree-{}.ttf'), 'bsc': os.path.join(HERE, 'fonts', 'barlow-semi-condensed-{}.ttf')}
scr = json.load(open(sys.argv[1])); meas = json.load(open(sys.argv[2]))
assert len(meas) == len(scr['items'])
worst = []
for it, m in zip(scr['items'], meas):
    t = it['t'].replace('{', '').replace('}', '')
    f = ImageFont.truetype(FAM[it['f']].format(it['w']), 200)
    pil = f.getlength(t) * it['s'] / 200 + it.get('ls', 0) * len(t)
    if m['w'] <= 0: continue
    k = pil / m['w']
    worst.append((abs(k - 1), t[:40], round(k, 4)))
    if abs(k - 1) > 0.002:
        # scale font size so the advance width matches; keep ink-left by scaling the left bearing offset
        it['s'] = round(it['s'] * k, 3)
print('max dev', max(worst)[:3] if worst else None, 'mean', round(sum(w[0] for w in worst) / len(worst), 4))
json.dump(scr, open(sys.argv[1], 'w'), ensure_ascii=False, indent=0)
