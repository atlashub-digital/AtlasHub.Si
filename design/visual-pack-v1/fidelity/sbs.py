import sys
from PIL import Image
m, w, out = sys.argv[1:4]
a = Image.open(m).convert('RGB'); b = Image.open(w).convert('RGB')
W, H = a.size
c = Image.new('RGB', (W, H * 2 + 8), (255, 0, 0)); c.paste(a, (0, 0)); c.paste(b, (0, H + 8))
c.resize((W * 3 // 5, (H * 2 + 8) * 3 // 5), Image.LANCZOS).save(out)
