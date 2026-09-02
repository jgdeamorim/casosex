import re
import os

svg_source_path = "/home/jeffer/Downloads/ChatGPT-Image-2-de-set.-de-2026_-18_05_50.svg"

with open(svg_source_path, "r") as f:
    svg_source = f.read()

paths = re.findall(r'd="([^"]+)"', svg_source)
inner_paths_str = "\n".join([f'    <path d="{p}"/>' for p in paths])

# Exact center-aligned emblem group template:
# Inside viewBox="0 0 1350 1250", emblem center is CX=675, CY=625 (dead center!)
emblem_group_template = f'''<g transform="translate(212.250000, 1013.700000) scale(0.100000, -0.100000)" stroke="none">
{inner_paths_str}
</g>'''

# 1. Master Brandmark SVG (Standalone Symbol)
master_brandmark_svg = f'''<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1350 1250" width="100%" height="100%">
  <defs>
    <linearGradient id="volupiaMasterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="35%" stop-color="#E11D48" />
      <stop offset="75%" stop-color="#9F1239" />
      <stop offset="100%" stop-color="#4C0519" />
    </linearGradient>
    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#E11D48" flood-opacity="0.25" />
    </filter>
  </defs>
  <g fill="url(#volupiaMasterGrad)" filter="url(#subtleGlow)">
{emblem_group_template}
  </g>
</svg>'''

# 2. Monochrome Brandmark SVG (Champagne Gold)
monochrome_brandmark_svg = f'''<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1350 1250" width="100%" height="100%">
  <g fill="#D4A373">
{emblem_group_template}
  </g>
</svg>'''

# 3. Horizontal Lockup SVG (Perfectly Balanced Grid 1100x320)
# Height = 320, Center Y = 160.
# Emblem scale = 0.16 (Height = 190.3px, Y goes 65..255.3, Center Y = 160.15!)
# Vertical Divider at X=320, Y1=65, Y2=255 (Height 190px, Center Y = 160.0!)
# Typography at X=360:
#   "VOLÚPIA" at Y=168 (Font size 74) -> Visual vertical middle ~140
#   "DESPERTE SEUS SENTIDOS" at Y=225 (Font size 20) -> Overall block center Y = 160.0!
horizontal_lockup_svg = f'''<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 320" width="100%" height="100%">
  <defs>
    <linearGradient id="volupiaHzGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="40%" stop-color="#E11D48" />
      <stop offset="80%" stop-color="#9F1239" />
      <stop offset="100%" stop-color="#580A20" />
    </linearGradient>
    <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F7EBE1" />
      <stop offset="100%" stop-color="#E5C3A6" />
    </linearGradient>
    <filter id="hzGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#E11D48" flood-opacity="0.2" />
    </filter>
  </defs>
  
  <!-- Emblem (Height 190px, Y: 65..255, Center Y=160.0) -->
  <g transform="translate(30, 60) scale(0.16)" fill="url(#volupiaHzGrad)" filter="url(#hzGlow)">
{emblem_group_template}
  </g>

  <!-- Vertical Divider (X=320, Y: 65..255, Height 190px, Center Y=160.0) -->
  <line x1="320" y1="65" x2="320" y2="255" stroke="#D4A373" stroke-width="1.5" stroke-linecap="round" opacity="0.45" />

  <!-- Typography Block (X=360, Vertically Balanced at Y=160.0) -->
  <text x="360" y="168" font-family="'Playfair Display', Georgia, 'Times New Roman', serif" font-size="74" font-weight="700" letter-spacing="14" fill="url(#goldTextGrad)">VOLÚPIA</text>
  <text x="365" y="225" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="20" font-weight="500" letter-spacing="9" fill="#D4A373" opacity="0.9">DESPERTE SEUS SENTIDOS</text>
</svg>'''

# 4. Primary Stacked Lockup SVG (Centered Vertical Composition)
stacked_lockup_svg = f'''<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 720" width="100%" height="100%">
  <defs>
    <linearGradient id="volupiaStackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="40%" stop-color="#E11D48" />
      <stop offset="80%" stop-color="#9F1239" />
      <stop offset="100%" stop-color="#580A20" />
    </linearGradient>
    <linearGradient id="goldTextGradStack" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F7EBE1" />
      <stop offset="100%" stop-color="#E5C3A6" />
    </linearGradient>
    <filter id="stackGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#E11D48" flood-opacity="0.22" />
    </filter>
  </defs>
  
  <!-- Emblem Centered (X=400) -->
  <g transform="translate(220, 40) scale(0.2667)" fill="url(#volupiaStackGrad)" filter="url(#stackGlow)">
{emblem_group_template}
  </g>

  <!-- Horizontal Accent Line -->
  <line x1="320" y1="410" x2="480" y2="410" stroke="#D4A373" stroke-width="1.5" stroke-linecap="round" opacity="0.4" />

  <!-- Typography Centered -->
  <text x="400" y="505" font-family="'Playfair Display', Georgia, serif" font-size="72" font-weight="700" letter-spacing="16" fill="url(#goldTextGradStack)" text-anchor="middle">VOLÚPIA</text>
  <text x="400" y="565" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="500" letter-spacing="10" fill="#D4A373" text-anchor="middle" opacity="0.9">DESPERTE SEUS SENTIDOS</text>
</svg>'''

# Save master SVGs
assets_dir = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/brand-spec/04-assets/svg"
os.makedirs(assets_dir, exist_ok=True)

with open(os.path.join(assets_dir, "brandmark-master.svg"), "w") as f:
    f.write(master_brandmark_svg)

with open(os.path.join(assets_dir, "brandmark-monochrome.svg"), "w") as f:
    f.write(monochrome_brandmark_svg)

with open(os.path.join(assets_dir, "lockup-horizontal.svg"), "w") as f:
    f.write(horizontal_lockup_svg)

with open(os.path.join(assets_dir, "lockup-primary-stacked.svg"), "w") as f:
    f.write(stacked_lockup_svg)

print("Ativos SVG salvos com centralização matemática perfeita!")
