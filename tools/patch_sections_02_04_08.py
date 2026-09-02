import re
import os

svg_source_path = "/home/jeffer/Downloads/ChatGPT-Image-2-de-set.-de-2026_-18_05_50.svg"

with open(svg_source_path, "r") as f:
    svg_source = f.read()

paths = re.findall(r'd="([^"]+)"', svg_source)
inner_paths_str = "\n".join([f'    <path d="{p}"/>' for p in paths])

# Group for 1350x1250 viewbox (standalone or 1:1 ratio)
emblem_1350 = f'''<g transform="translate(212.250000, 1013.700000) scale(0.100000, -0.100000)" stroke="none">
{inner_paths_str}
</g>'''

# Helper to create standalone brandmark SVG
def make_brandmark_svg(viewbox="0 0 1350 1250", fill="url(#brandmarkLipVelvetGrad)"):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" fill="none">
  <defs>
    <linearGradient id="brandmarkLipVelvetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="40%" stop-color="#E11D48" />
      <stop offset="80%" stop-color="#9F1239" />
      <stop offset="100%" stop-color="#580A20" />
    </linearGradient>
  </defs>
  <g fill="{fill}">
{emblem_1350}
  </g>
</svg>'''

# Target HTML files
html_files = [
    "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/Brand-oficial/volupia-brand-identity-spec.html",
    "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/brand-spec/volupia-brand-identity-spec.html"
]

for target_file in html_files:
    if not os.path.exists(target_file):
        continue
    with open(target_file, "r") as f:
        html = f.read()

    # 1. Patch Section 02 SVGs
    # Replace SVG 1 in Section 02 (Canonical Master)
    sec2_svg1_old = re.search(r'<svg width="120" height="120" viewBox="0 0 100 100" fill="none">\s*<path d="M 15,15 C 35,5.*?</svg>', html, re.DOTALL)
    
    sec2_svg1_new = '''<svg width="120" height="120" viewBox="0 0 1350 1250" fill="none">
              <defs>
                <linearGradient id="sec2LipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FB7185" />
                  <stop offset="40%" stop-color="#E11D48" />
                  <stop offset="80%" stop-color="#9F1239" />
                  <stop offset="100%" stop-color="#580A20" />
                </linearGradient>
              </defs>
              <g fill="url(#sec2LipGrad)">
''' + emblem_1350 + '''
              </g>
            </svg>'''

    sec2_svg2_new = '''<svg width="120" height="120" viewBox="0 0 1350 1250" fill="none">
              <g fill="#D4A373">
''' + emblem_1350 + '''
              </g>
            </svg>'''

    # Replace legacy path pattern in Section 02
    html = re.sub(
        r'<svg width="120" height="120" viewBox="0 0 100 100" fill="none">\s*<path d="M 15,15 C 35,5.*?</svg>',
        sec2_svg1_new,
        html,
        count=1,
        flags=re.DOTALL
    )

    html = re.sub(
        r'<svg width="120" height="120" viewBox="0 0 100 100" fill="none">\s*<path d="M 15,15 C 35,5.*?</svg>',
        sec2_svg2_new,
        html,
        count=1,
        flags=re.DOTALL
    )

    # 2. Patch Section 04 Lockup SVGs
    sec4_stacked_new = '''<svg width="280" height="220" viewBox="0 0 800 720" fill="none">
              <defs>
                <linearGradient id="sec4StackLipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FB7185" />
                  <stop offset="40%" stop-color="#E11D48" />
                  <stop offset="80%" stop-color="#9F1239" />
                  <stop offset="100%" stop-color="#580A20" />
                </linearGradient>
                <linearGradient id="sec4StackGoldText" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#F7EBE1" />
                  <stop offset="100%" stop-color="#E5C3A6" />
                </linearGradient>
              </defs>
              <g transform="translate(220, 40) scale(0.2667)" fill="url(#sec4StackLipGrad)">
''' + emblem_1350 + '''
              </g>
              <line x1="320" y1="410" x2="480" y2="410" stroke="#D4A373" stroke-width="1.5" stroke-linecap="round" opacity="0.4" />
              <text x="400" y="505" font-family="'Playfair Display', Georgia, serif" font-size="72" font-weight="700" letter-spacing="16" fill="url(#sec4StackGoldText)" text-anchor="middle">VOLÚPIA</text>
              <text x="400" y="565" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="500" letter-spacing="10" fill="#D4A373" text-anchor="middle" opacity="0.9">DESPERTE SEUS SENTIDOS</text>
            </svg>'''

    html = re.sub(
        r'<svg width="280" height="180" viewBox="0 0 280 180" fill="none">.*?</svg>',
        sec4_stacked_new,
        html,
        count=1,
        flags=re.DOTALL
    )

    # 3. Patch Section 08 Icon & Favicon SVGs
    sec8_icon64_new = '''<svg width="64" height="64" viewBox="0 0 1350 1250" fill="none">
                <defs>
                  <linearGradient id="fav64Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FB7185" />
                    <stop offset="40%" stop-color="#E11D48" />
                    <stop offset="80%" stop-color="#9F1239" />
                    <stop offset="100%" stop-color="#580A20" />
                  </linearGradient>
                </defs>
                <g fill="url(#fav64Grad)">
''' + emblem_1350 + '''
                </g>
              </svg>'''

    sec8_fav32_new = '''<svg width="32" height="32" viewBox="0 0 1350 1250" fill="none">
                <g fill="#D4A373">
''' + emblem_1350 + '''
                </g>
              </svg>'''

    sec8_fav16_new = '''<svg width="16" height="16" viewBox="0 0 1350 1250" fill="none">
                <g fill="#FAF7F5">
''' + emblem_1350 + '''
                </g>
              </svg>'''

    html = re.sub(
        r'<svg width="36" height="36" viewBox="0 0 100 100" fill="none">.*?</svg>',
        sec8_icon64_new,
        html,
        count=1,
        flags=re.DOTALL
    )

    html = re.sub(
        r'<svg width="20" height="20" viewBox="0 0 100 100" fill="none">.*?</svg>',
        sec8_fav32_new,
        html,
        count=1,
        flags=re.DOTALL
    )

    html = re.sub(
        r'<svg width="10" height="10" viewBox="0 0 100 100" fill="none">.*?</svg>',
        sec8_fav16_new,
        html,
        count=1,
        flags=re.DOTALL
    )

    with open(target_file, "w") as f:
        f.write(html)

# Also update individual standalone SVG asset files in docs/brand-spec/04-assets/
svg_assets_dir = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/brand-spec/04-assets/svg"
fav_assets_dir = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/brand-spec/04-assets/favicon"

os.makedirs(svg_assets_dir, exist_ok=True)
os.makedirs(fav_assets_dir, exist_ok=True)

with open(os.path.join(svg_assets_dir, "brandmark-master.svg"), "w") as f:
    f.write(make_brandmark_svg(fill="url(#brandmarkLipVelvetGrad)"))

with open(os.path.join(svg_assets_dir, "brandmark-monochrome.svg"), "w") as f:
    f.write(make_brandmark_svg(fill="#D4A373"))

with open(os.path.join(fav_assets_dir, "icon-64.svg"), "w") as f:
    f.write(make_brandmark_svg(fill="url(#brandmarkLipVelvetGrad)"))

with open(os.path.join(fav_assets_dir, "favicon-32.svg"), "w") as f:
    f.write(make_brandmark_svg(fill="#D4A373"))

with open(os.path.join(fav_assets_dir, "favicon-16.svg"), "w") as f:
    f.write(make_brandmark_svg(fill="#FAF7F5"))

print("Seções 02, 04 e 08 atualizadas com sucesso em todos os HTMLs e assets vetoriais salvos!")
