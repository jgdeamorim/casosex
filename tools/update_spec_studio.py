import re
import os

svg_source_path = "/home/jeffer/Downloads/ChatGPT-Image-2-de-set.-de-2026_-18_05_50.svg"
html_spec_path = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/Brand-oficial/volupia-brand-identity-spec.html"
target_spec_path = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/brand-spec/volupia-brand-identity-spec.html"

with open(svg_source_path, "r") as f:
    svg_source = f.read()

paths = re.findall(r'<path\s+d="([^"]+)"', svg_source)

path_elements = ""
for p in paths:
    path_elements += f'<path d="{p}"/>\n'

# Create the inline SVG template for Master Emblem
master_emblem_svg = f'''<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="100 0 1336 1024" style="max-height: 140px; width: auto; filter: drop-shadow(0 6px 12px rgba(225,29,72,0.25));">
  <defs>
    <linearGradient id="studioLipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="50%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#881337" />
    </linearGradient>
  </defs>
  <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="url(#studioLipGrad)" stroke="none">
    {path_elements}
  </g>
</svg>'''

# Create Monochrome Gold Emblem
gold_emblem_svg = f'''<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="100 0 1336 1024" style="max-height: 120px; width: auto;">
  <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="#D4A373" stroke="none">
    {path_elements}
  </g>
</svg>'''

# Create Horizontal Lockup SVG
horizontal_lockup_svg = f'''<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360" style="max-height: 70px; width: auto;">
  <defs>
    <linearGradient id="studioHzGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="50%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#881337" />
    </linearGradient>
  </defs>
  <g transform="translate(40, 20) scale(0.25)">
    <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="url(#studioHzGrad)" stroke="none">
      {path_elements}
    </g>
  </g>
  <line x1="380" y1="80" x2="380" y2="280" stroke="#D4A373" stroke-width="2" opacity="0.4" />
  <text x="430" y="195" font-family="'Playfair Display', Georgia, serif" font-size="80" font-weight="700" letter-spacing="16" fill="#FAF7F5">VOLÚPIA</text>
  <text x="435" y="250" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="500" letter-spacing="8" fill="#D4A373">DESPERTE SEUS SENTIDOS</text>
</svg>'''

# Read original HTML
with open(html_spec_path, "r") as f:
    html = f.read()

# Update title and descriptions
html = html.replace("Especificação Soberana do Sistema de Identidade de Marca", "VOLÚPIA — Sensual Minimalist Brandmark & Spec-Brand")

# Save updated HTML to both locations
with open(html_spec_path, "w") as f:
    f.write(html)

with open(target_spec_path, "w") as f:
    f.write(html)

print("HTML Spec Studio sincronizado com sucesso nos dois diretórios!")
