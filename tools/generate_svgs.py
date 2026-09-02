import re
import os

svg_source_path = "/home/jeffer/Downloads/ChatGPT-Image-2-de-set.-de-2026_-18_05_50.svg"
target_dir = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/brand-spec/04-assets/svg/"

with open(svg_source_path, "r") as f:
    content = f.read()

paths = re.findall(r'<path\s+d="([^"]+)"', content)

# 1. Master Color SVG
master_svg = '''<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="100 0 1336 1024" width="100%" height="100%">
  <defs>
    <linearGradient id="volupiaBordeauxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#881337" />
      <stop offset="50%" stop-color="#7A0E2B" />
      <stop offset="100%" stop-color="#4C0719" />
    </linearGradient>
  </defs>
  <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="url(#volupiaBordeauxGrad)" stroke="none">
'''
for p in paths:
    master_svg += f'    <path d="{p}"/>\n'
master_svg += '''  </g>
</svg>'''

with open(os.path.join(target_dir, "brandmark-master.svg"), "w") as f:
    f.write(master_svg)

# 2. Monochrome Gold SVG
mono_gold = '''<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="100 0 1336 1024" width="100%" height="100%">
  <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="#D4A373" stroke="none">
'''
for p in paths:
    mono_gold += f'    <path d="{p}"/>\n'
mono_gold += '''  </g>
</svg>'''

with open(os.path.join(target_dir, "brandmark-monochrome.svg"), "w") as f:
    f.write(mono_gold)

# 3. Lockup Primary Stacked SVG
stacked = '''<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800" width="100%" height="100%">
  <defs>
    <linearGradient id="lockupLipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="50%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#881337" />
    </linearGradient>
  </defs>
  <g transform="translate(250, 40) scale(0.35)">
    <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="url(#lockupLipGrad)" stroke="none">
'''
for p in paths:
    stacked += f'      <path d="{p}"/>\n'

stacked += '''    </g>
  </g>
  <text x="500" y="580" font-family="\'Playfair Display\', Georgia, serif" font-size="72" font-weight="700" letter-spacing="18" fill="#FAF7F5" text-anchor="middle">VOLÚPIA</text>
  <text x="500" y="650" font-family="\'Plus Jakarta Sans\', sans-serif" font-size="20" font-weight="600" letter-spacing="8" fill="#D4A373" text-anchor="middle">DESPERTE SEUS SENTIDOS</text>
</svg>'''

with open(os.path.join(target_dir, "lockup-primary-stacked.svg"), "w") as f:
    f.write(stacked)

# 4. Lockup Horizontal SVG
horizontal = '''<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360" width="100%" height="100%">
  <defs>
    <linearGradient id="hzLipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="50%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#881337" />
    </linearGradient>
  </defs>
  <g transform="translate(40, 20) scale(0.25)">
    <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="url(#hzLipGrad)" stroke="none">
'''
for p in paths:
    horizontal += f'      <path d="{p}"/>\n'

horizontal += '''    </g>
  </g>
  <line x1="380" y1="80" x2="380" y2="280" stroke="#D4A373" stroke-width="2" opacity="0.4" />
  <text x="430" y="195" font-family="\'Playfair Display\', Georgia, serif" font-size="80" font-weight="700" letter-spacing="16" fill="#FAF7F5">VOLÚPIA</text>
  <text x="435" y="250" font-family="\'Plus Jakarta Sans\', sans-serif" font-size="22" font-weight="500" letter-spacing="8" fill="#D4A373">DESPERTE SEUS SENTIDOS</text>
</svg>'''

with open(os.path.join(target_dir, "lockup-horizontal.svg"), "w") as f:
    f.write(horizontal)

print("SUCESSO ABSOLUTO: Todos os ativos SVG nativos foram gerados e otimizados!")
