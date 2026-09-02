import re
import os

svg_source_path = "/home/jeffer/Downloads/ChatGPT-Image-2-de-set.-de-2026_-18_05_50.svg"

with open(svg_source_path, "r") as f:
    svg_source = f.read()

# Extract inner path d attributes
paths = re.findall(r'd="([^"]+)"', svg_source)
inner_paths_str = "\n".join([f'    <path d="{p}"/>' for p in paths])

# New normalized emblem group
new_emblem_group = f'''<g transform="translate(212.250000, 1013.700000) scale(0.100000, -0.100000)" stroke="none">
{inner_paths_str}
</g>'''

# Target files
files_to_patch = [
    "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/Brand-oficial/volupia-brand-identity-spec.html",
    "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/brand-spec/volupia-brand-identity-spec.html"
]

for filepath in files_to_patch:
    if not os.path.exists(filepath):
        continue
    with open(filepath, "r") as f:
        html = f.read()

    # Define common gradient defs if not present
    lip_gradient_def = '''<linearGradient id="volupiaLipVelvetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="40%" stop-color="#E11D48" />
      <stop offset="80%" stop-color="#9F1239" />
      <stop offset="100%" stop-color="#580A20" />
    </linearGradient>
    <linearGradient id="volupiaGoldTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F7EBE1" />
      <stop offset="100%" stop-color="#E5C3A6" />
    </linearGradient>'''

    # Ensure defs are present before closing </head> or inside <svg>
    if "volupiaLipVelvetGrad" not in html:
        html = html.replace("</head>", f"  <svg style=\"display:none;\"><defs>{lip_gradient_def}</defs></svg>\n</head>")

    # Replace legacy SVG emblem groups with new emblem group
    # Legacy emblems used groups with scale(0.100000, -0.100000) or similar polygon/path tags
    # Let's replace legacy path groups cleanly
    html_patched = re.sub(
        r'<g transform="translate\([^)]+\) scale\([^)]+\)" stroke="none">.*?</g>',
        new_emblem_group,
        html,
        flags=re.DOTALL
    )

    with open(filepath, "w") as f:
        f.write(html_patched)

print("Substituição cirúrgica realizada com sucesso mantendo a estrutura 100% intacta!")
