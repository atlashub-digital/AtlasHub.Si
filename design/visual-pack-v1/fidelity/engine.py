"""Mockup → clean plate + positioned live text (Visual Pack V1, 1:1 fidelity).

Usage (from the repo root): python3 design/visual-pack-v1/fidelity/engine.py <spec.json> <outdir>
Writes <outdir>/bg.png (plate: the mockup with the copy removed), items.json (each line of copy
with font, size, position and colour measured from the mockup) and preview.png (2x, for review).
Spec: {"src": "...webp", "blocks": [ {r:[x1,y1,x2,y2], lines:[...], w:700, kind:"text"|"tracked",
        tag:"p", href:"...", dark:false, keep:false} ], "hotspots": [ {r, href, label} ] }
Lines may contain {accent} spans: text inside braces gets its own sampled colour.
"""
import json, sys, re, os
import numpy as np, cv2
from PIL import Image, ImageFont, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
FAM = {'bsc': os.path.join(HERE, 'fonts', 'barlow-semi-condensed-{}.ttf'), 'figtree': os.path.join(HERE, 'fonts', 'figtree-{}.ttf')}
BASES = {'bsc': 0.9, 'figtree': 0.85}  # baseline offset (em) at line-height:1, from each font's hhea metrics  # baseline offset (em) at line-height:1 (hhea)
_fc = {}
def font(w, s=100, fam='figtree'):
    k = (fam, w, s)
    if k not in _fc: _fc[k] = ImageFont.truetype(FAM[fam].format(w), s)
    return _fc[k]

def plain(t): return t.replace('{', '').replace('}', '')

def bands(mask, n):
    rows = mask.any(1)
    segs, start = [], None
    for i, v in enumerate(list(rows) + [False]):
        if v and start is None: start = i
        if not v and start is not None: segs.append([start, i - 1]); start = None
    # merge tiny segments (accents, dots) into neighbours, then closest pairs until n
    def h(s): return s[1] - s[0] + 1
    changed = True
    while changed and len(segs) > 1:
        changed = False
        med = np.median([h(s) for s in segs])
        for i, s in enumerate(segs):
            if h(s) < 0.4 * med:
                # merge with nearest neighbour
                if i == 0: j = 1
                elif i == len(segs) - 1: j = i - 1
                else: j = i - 1 if (s[0] - segs[i - 1][1]) <= (segs[i + 1][0] - s[1]) else i + 1
                a, b = sorted([i, j]); segs[a] = [segs[a][0], segs[b][1]]; del segs[b]; changed = True; break
    prof = mask.sum(1)
    while len(segs) < n:
        i = int(np.argmax([h(s) for s in segs])); a, b = segs[i]
        lo, hi = a + int(0.3 * (b - a)), a + int(0.7 * (b - a))
        cut = lo + int(np.argmin(prof[lo:hi + 1]))
        segs[i:i + 1] = [[a, cut - 1], [cut + 1, b]]
    while len(segs) > n:
        gaps = [segs[i + 1][0] - segs[i][1] for i in range(len(segs) - 1)]
        i = int(np.argmin(gaps)); segs[i] = [segs[i][0], segs[i + 1][1]]; del segs[i + 1]
    return segs

def run(spec_path, outdir):
    spec = json.load(open(spec_path))
    img = np.array(Image.open(spec['src']).convert('RGB')).astype(np.float32)
    H, W = img.shape[:2]
    lum = img @ np.array([0.299, 0.587, 0.114], np.float32)
    inpaint = np.zeros((H, W), np.uint8)
    out, warns = [], []
    for bi, b in enumerate(spec['blocks']):
        x1, y1, x2, y2 = b['r']
        # auto-extend to the right while the copy keeps going past the given region
        if not b.get('edge_ok'):
            for _ in range(20):
                reg0 = lum[y1:y2, x1:x2]; bg0 = float(np.median(reg0))
                ext0 = float(np.percentile(reg0, 1 if b.get('dark') else 99.5))
                d0 = (bg0 - reg0) if b.get('dark') else (reg0 - bg0)
                m0 = d0 > max(b.get('thr', 0.38) * abs(ext0 - bg0), 18)
                if not m0[:, -2:].any() or x2 >= W - 2: break
                x2 += 2
            b['r'] = [x1, y1, x2, y2]
        reg = lum[y1:y2, x1:x2]
        bg = float(np.median(reg))
        dark = b.get('dark', False)
        ext = float(np.percentile(reg, 1 if dark else 99.5))
        d = (bg - reg) if dark else (reg - bg)
        thr = max(b.get('thr', 0.38) * abs(ext - bg), 18)
        m = d > thr
        lines = b['lines']
        segs = bands(m, len(lines))
        if len(segs) != len(lines):
            warns.append(f"block {bi} {lines[0][:30]!r}: found {len(segs)} bands for {len(lines)} lines"); continue
        acc_samples = []
        for li, (t, (sy, ey)) in enumerate(zip(lines, segs)):
            sub = m[sy:ey + 1]
            cols = np.where(sub.any(0))[0]
            if cols[-1] >= (x2 - x1) - 2 and not b.get('edge_ok'):
                warns.append(f"block {bi} line {plain(t)[:30]!r}: ink touches right edge")
            bx1, bx2 = x1 + cols[0], x1 + cols[-1] + 1
            by1, by2 = y1 + sy, y1 + ey + 1
            bw, bh = bx2 - bx1, by2 - by1
            wt = b.get('w', 400)
            fam = b.get('f') or 'figtree'
            BASE = BASES[fam]
            f = font(wt, 100, fam)
            pt = plain(t)
            l, tp, r, bt = f.getbbox(pt, anchor='ls')
            inkw, inkh = r - l, bt - tp
            size_w = bw / inkw * 100
            size_h = bh / inkh * 100
            ls = 0.0
            if b.get('kind') == 'tracked':
                size = size_h if b.get('size') is None else b['size']
                n = max(len(pt) - 1, 1)
                ls = (bw - inkw * size / 100) / n
            elif b.get('kind') == 'width':
                size = size_w
            else:
                size = min(size_h, size_w * 1.22) if len(pt) > 2 else size_w
                n = max(len(pt) - 1, 1)
                ls = (bw - inkw * size / 100) / n
                if ls < -0.09 * size:
                    ls = -0.09 * size; warns.append(f"block {bi} line {pt[:30]!r}: clamped ls")
            fs = font(wt, max(1, round(size * 4)), fam)  # high-res measure
            k = size / max(1, round(size * 4))
            l2, t2, _, _ = fs.getbbox(pt, anchor='ls')
            left = bx1 - l2 * k
            top = by1 - (BASE * size + t2 * k)
            if b.get('anchor') == 'base':
                top = by2 - BASE * size
            # colour: strongest glyph pixels
            core = sub.copy()
            dl = d[sy:ey + 1, cols[0]:cols[-1] + 1][core[:, cols[0]:cols[-1] + 1]]
            px = img[y1 + sy:y1 + ey + 1, bx1:bx2][core[:, cols[0]:cols[-1] + 1]]
            strong = px[dl >= np.percentile(dl, 88)]
            # split by chroma: accent (saturated) vs neutral
            mx, mn = strong.max(1), strong.min(1)
            sat = (mx - mn) / np.maximum(mx, 1)
            neutral = strong[sat < 0.35]
            acc = strong[sat >= 0.35]
            col = np.median(neutral if len(acc) < len(neutral) * 0.8 or len(acc) == 0 else acc, 0)
            # keep the hue/saturation of the glyph cores, take the lightness of the brightest cores
            if not b.get('dark'):
                peak = np.percentile(strong, 97, axis=0).max()
                col = np.clip(col * (peak / max(col.max(), 1)), 0, 255)
            if '{' in t:
                mx2, mn2 = px.max(1), px.min(1)
                sat2 = (mx2 - mn2) / np.maximum(mx2, 1)
                accp = px[(sat2 >= 0.4) & (mx2 > 120)]
                if len(accp): acc_samples.append(np.percentile(accp, 75, axis=0))
            if b.get('col'): col = np.array([int(b['col'][k:k + 2], 16) for k in (1, 3, 5)], float)
            out.append(dict(block=bi, text=t, x=round(float(left), 2), y=round(float(top), 2), size=round(float(size), 2),
                            ls=round(float(ls), 3), w=wt, color='#%02x%02x%02x' % tuple(int(c) for c in col),
                            fam=fam, tag=b.get('tag', 'p'), href=b.get('href'), first=li == 0, nl=len(lines),
                            box=[int(bx1), int(by1), int(bw), int(bh)], cls=b.get('cls')))
            if not b.get('keep'):
                mm = np.zeros((H, W), np.uint8)
                mm[by1 - 1:by2 + 1, bx1 - 1:bx2 + 1] = sub[:, cols[0] - 1 if cols[0] else 0:cols[-1] + 2][:by2 - by1 + 2, :bx2 - bx1 + 2].astype(np.uint8) if False else 0
                py1, py2 = max(y1, y1 + sy - 3), min(y2, y1 + ey + 4)
                px1, px2 = max(x1, bx1 - 3), min(x2, bx2 + 3)
                soft = (d[py1 - y1:py2 - y1, px1 - x1:px2 - x1] > max(0.14 * abs(ext - bg), 9)).astype(np.uint8)
                r = 1 + (ey - sy) // 12
                soft = cv2.dilate(soft, np.ones((2 * r + 1, 2 * r + 1), np.uint8))
                mm[py1:py2, px1:px2] = soft
                inpaint |= mm
        blk = [o for o in out if o['block'] == bi]
        if len(blk) > 1 and b.get('kind') != 'tracked' and not b.get('mixed'):
            med = float(np.median([o['size'] for o in blk]))
            for o in blk:
                if abs(o['size'] / med - 1) > 0.04:
                    warns.append(f"block {bi} line {o['text'][:30]!r}: size {o['size']:.1f} -> {med:.1f}")
                base = o['y'] + BASES[o['fam']] * o['size']
                o['size'] = round(med, 2); o['y'] = round(base - BASES[o['fam']] * med, 2)
        if b.get('acc'):
            for o in out:
                if o['block'] == bi: o['accent'] = b['acc']
        elif acc_samples:
            ac = np.median(np.array(acc_samples), 0)
            for o in out:
                if o['block'] == bi: o['accent'] = '#%02x%02x%02x' % tuple(int(c) for c in ac)
    for e in spec.get('erase', []):
        x1, y1, x2, y2 = e[:4]; dark = len(e) > 4 and e[4]
        reg = lum[y1:y2, x1:x2]; bg = float(np.median(reg))
        ext = float(np.percentile(reg, 1 if dark else 99.5))
        d = (bg - reg) if dark else (reg - bg)
        soft = (d > max(0.14 * abs(ext - bg), 9)).astype(np.uint8)
        soft = cv2.dilate(soft, np.ones((5, 5), np.uint8))
        inpaint[y1:y2, x1:x2] |= soft
    # inpaint via normalized convolution (smooth background reconstruction)
    k = np.ones((3, 3), np.uint8)
    mask = cv2.dilate(inpaint, k, iterations=1).astype(bool)
    clean = img.copy()
    known = (~mask).astype(np.float32)
    res = img.copy()
    bright = (lum > 150) & ~mask
    known = (~mask & ~bright).astype(np.float32)
    for sigma in (2, 3, 5, 7):
        num = cv2.GaussianBlur(img * known[..., None], (0, 0), sigma)
        den = cv2.GaussianBlur(known, (0, 0), sigma)[..., None]
        est = num / np.maximum(den, 1e-4)
        fill = mask & (den[..., 0] > 0.25) & ~getattr(run, '_done', np.zeros_like(mask))
        res[fill] = est[fill]
        run._done = getattr(run, '_done', np.zeros_like(mask)) | fill
    rest = mask & ~run._done
    if rest.any():
        res = cv2.inpaint(res.astype(np.uint8), rest.astype(np.uint8), 5, cv2.INPAINT_TELEA).astype(np.float32)
    run._done = np.zeros_like(mask)
    # tiny grain so filled areas don't look plastic
    rng = np.random.default_rng(1)
    res[mask] += rng.normal(0, 1.2, res[mask].shape)
    os.makedirs(outdir, exist_ok=True)
    Image.fromarray(np.clip(res, 0, 255).astype(np.uint8)).save(os.path.join(outdir, 'bg.png'))
    json.dump(dict(W=W, H=H, items=out, hotspots=spec.get('hotspots', [])), open(os.path.join(outdir, 'items.json'), 'w'), ensure_ascii=False, indent=1)
    # PIL preview
    pv = Image.fromarray(np.clip(res, 0, 255).astype(np.uint8)).resize((W * 2, H * 2), Image.LANCZOS)
    dr = ImageDraw.Draw(pv)
    for o in out:
        S = 2
        f = font(o['w'], max(1, round(o['size'] * S)), o['fam'])
        x = o['x'] * S; base = o['y'] * S + BASES[o['fam']] * o['size'] * S
        for part, acc in re.findall(r'\{([^}]*)\}|([^{}]+)', o['text']) and [(p, True) if p else (q, False) for p, q in re.findall(r'\{([^}]*)\}|([^{}]+)', o['text'])]:
            colr = o.get('accent', o['color']) if acc else o['color']
            for ch in part:
                dr.text((x, base), ch, font=f, fill=colr, anchor='ls')
                x += f.getlength(ch) + o['ls'] * S
    pv.save(os.path.join(outdir, 'preview.png'))
    for w in warns: print('WARN', w)
    print(len(out), 'lines')

if __name__ == '__main__':
    run(sys.argv[1], sys.argv[2])
