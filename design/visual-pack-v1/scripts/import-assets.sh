#!/usr/bin/env bash
# Imports the Visual Pack V1 ZIP into design/visual-pack-v1/assets (see assets/README.md).
# Usage: bash design/visual-pack-v1/scripts/import-assets.sh /caminho/AtlasHub_Visual_Implementation_Pack_V1_20261008.zip
# - accepts the normalised names (asset-inventory.json "name") or the original ones ("source"), at any depth in the ZIP
# - only PNGs are read; paths inside the ZIP are never used to write (no zip-slip)
# - validates PNG signature and size, verifies SHA256SUMS.txt from the ZIP when present, writes assets/SHA256SUMS.txt
# - fails if the official logo or any of the 8 screens is missing; concepts are reported but optional
set -euo pipefail
ZIP=${1:?usage: import-assets.sh <zip>}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
python3 - "$ZIP" "$ROOT" <<'EOF'
import hashlib, json, os, struct, sys, unicodedata, zipfile
zpath, root = sys.argv[1], sys.argv[2]
inv = json.load(open(os.path.join(root, 'asset-inventory.json')))
norm = lambda s: unicodedata.normalize('NFC', os.path.basename(s)).lower()
want = [('brand', a['name'], a['source'], True) for a in inv['brand']] + \
       [('screens', a['name'], a['source'], True) for a in inv['images']] + \
       [('concepts', a['name'], a['source'], False) for a in inv['additionalConcepts']]
z = zipfile.ZipFile(zpath)
members = {norm(i.filename): i for i in z.infolist() if not i.is_dir() and i.filename.lower().endswith('.png') and '__macosx' not in i.filename.lower()}
sums = {}
for i in z.infolist():
    if os.path.basename(i.filename).upper() == 'SHA256SUMS.TXT':
        for line in z.read(i).decode('utf-8', 'replace').splitlines():
            parts = line.strip().split(None, 1)
            if len(parts) == 2: sums[norm(parts[1].lstrip('*'))] = parts[0].lower()
out, missing, problems = [], [], []
for folder, name, source, required in want:
    m = members.get(norm(name)) or members.get(norm(source))
    if not m:
        (missing if required else problems).append(f'{folder}/{name}' + ('' if required else ' (opcional)'))
        continue
    if m.file_size > 15 * 1024 * 1024: problems.append(f'{name}: maior que 15 MB'); continue
    data = z.read(m)
    if data[:8] != b'\x89PNG\r\n\x1a\n': problems.append(f'{name}: não é PNG'); continue
    w, h = struct.unpack('>II', data[16:24])
    digest = hashlib.sha256(data).hexdigest()
    expected = sums.get(norm(m.filename)) or sums.get(norm(name))
    if expected and expected != digest: problems.append(f'{name}: SHA256 não confere'); continue
    os.makedirs(os.path.join(root, 'assets', folder), exist_ok=True)
    with open(os.path.join(root, 'assets', folder, name), 'wb') as f: f.write(data)
    out.append((f'{folder}/{name}', digest, w, h, 'verificado' if expected else 'sem SHA no ZIP'))
with open(os.path.join(root, 'assets', 'SHA256SUMS.txt'), 'w') as f:
    for path, digest, *_ in out: f.write(f'{digest}  {path}\n')
for path, digest, w, h, check in out: print(f'OK  {path:52} {w}x{h}  {check}')
for p in problems: print(f'AVISO  {p}')
for m in missing: print(f'FALTA  {m}')
print(f'\n{len(out)} importados · {len(missing)} obrigatórios em falta · SHA256 em assets/SHA256SUMS.txt')
sys.exit(1 if missing or any('SHA256' in p or 'não é PNG' in p for p in problems) else 0)
EOF
