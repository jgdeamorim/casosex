import re
import os

svg_source_path = "/home/jeffer/Downloads/ChatGPT-Image-2-de-set.-de-2026_-18_05_50.svg"
spec_files = [
    "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/Brand-oficial/volupia-brand-identity-spec.html",
    "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/brand-spec/volupia-brand-identity-spec.html"
]

with open(svg_source_path, "r") as f:
    svg_source = f.read()

paths = re.findall(r'<path\s+d="([^"]+)"', svg_source)
inner_paths = "\n".join([f'    <path d="{p}"/>' for p in paths])

emblem_g = f'''<g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" stroke="none">\n{inner_paths}\n  </g>'''

for target_file in spec_files:
    if not os.path.exists(target_file):
        continue

    with open(target_file, "r") as f:
        html = f.read()

    # 1. Replace Hero Logo SVG (line 517)
    hero_pattern = r'<svg class="hero-logo-svg".*?</svg>'
    hero_replacement = f'''<svg class="hero-logo-svg" viewBox="0 0 1200 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="heroLipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="50%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#881337" />
    </linearGradient>
  </defs>
  <g transform="translate(40, 20) scale(0.25)">
    <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="url(#heroLipGrad)" stroke="none">
{inner_paths}
    </g>
  </g>
  <line x1="380" y1="80" x2="380" y2="280" stroke="#D4A373" stroke-width="2" opacity="0.4" />
  <text x="430" y="195" font-family="'Playfair Display', Georgia, serif" font-size="80" font-weight="700" letter-spacing="16" fill="#FAF7F5">VOLÚPIA</text>
  <text x="435" y="250" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="500" letter-spacing="8" fill="#D4A373">DESPERTE SEUS SENTIDOS</text>
</svg>'''
    html = re.sub(hero_pattern, hero_replacement, html, flags=re.DOTALL)

    # 2. Replace Master Brandmark Card (Line 634)
    # Search for <svg width="120" height="120"...> before Brandmark Master label
    master_pattern = r'<svg width="120" height="120" viewBox="0 0 100 100" fill="none">.*?</svg>'
    master_replacement = f'''<svg width="120" height="120" viewBox="100 0 1336 1024" fill="none">
  <defs>
    <linearGradient id="masterLipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="50%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#881337" />
    </linearGradient>
  </defs>
  <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="url(#masterLipGrad)" stroke="none">
{inner_paths}
  </g>
</svg>'''
    html = re.sub(master_pattern, master_replacement, html, count=1, flags=re.DOTALL)

    # 3. Replace Monochrome Brandmark Card (Line 653)
    mono_pattern = r'<svg width="120" height="120" viewBox="0 0 100 100" fill="none">.*?</svg>'
    mono_replacement = f'''<svg width="120" height="120" viewBox="100 0 1336 1024" fill="none">
  <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="#D4A373" stroke="none">
{inner_paths}
  </g>
</svg>'''
    html = re.sub(mono_pattern, mono_replacement, html, count=1, flags=re.DOTALL)

    # 4. Replace Primary Stacked Lockup Card (Line 728)
    stacked_pattern = r'<svg width="280" height="180" viewBox="0 0 280 180" fill="none">.*?</svg>'
    stacked_replacement = f'''<svg width="280" height="180" viewBox="0 0 1000 800" fill="none">
  <defs>
    <linearGradient id="stackedLipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="50%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#881337" />
    </linearGradient>
  </defs>
  <g transform="translate(250, 40) scale(0.35)">
    <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="url(#stackedLipGrad)" stroke="none">
{inner_paths}
    </g>
  </g>
  <text x="500" y="580" font-family="'Playfair Display', Georgia, serif" font-size="72" font-weight="700" letter-spacing="18" fill="#FAF7F5" text-anchor="middle">VOLÚPIA</text>
  <text x="500" y="650" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="600" letter-spacing="8" fill="#D4A373" text-anchor="middle">DESPERTE SEUS SENTIDOS</text>
</svg>'''
    html = re.sub(stacked_pattern, stacked_replacement, html, flags=re.DOTALL)

    # 5. Replace Horizontal Lockup Card (Line 758)
    hz_pattern = r'<svg width="340" height="100" viewBox="0 0 340 100" fill="none">.*?</svg>'
    hz_replacement = f'''<svg width="340" height="100" viewBox="0 0 1200 360" fill="none">
  <defs>
    <linearGradient id="hzCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="50%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#881337" />
    </linearGradient>
  </defs>
  <g transform="translate(40, 20) scale(0.25)">
    <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="url(#hzCardGrad)" stroke="none">
{inner_paths}
    </g>
  </g>
  <line x1="380" y1="80" x2="380" y2="280" stroke="#D4A373" stroke-width="2" opacity="0.4" />
  <text x="430" y="195" font-family="'Playfair Display', Georgia, serif" font-size="80" font-weight="700" letter-spacing="16" fill="#FAF7F5">VOLÚPIA</text>
  <text x="435" y="250" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="500" letter-spacing="8" fill="#D4A373">DESPERTE SEUS SENTIDOS</text>
</svg>'''
    html = re.sub(hz_pattern, hz_replacement, html, flags=re.DOTALL)

    # 6. Replace Favicons (Line 852, 868, 884)
    fav_pattern36 = r'<svg width="36" height="36" viewBox="0 0 100 100" fill="none">.*?</svg>'
    fav_replacement36 = f'''<svg width="36" height="36" viewBox="100 0 1336 1024" fill="none">
  <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="#D4A373" stroke="none">
{inner_paths}
  </g>
</svg>'''
    html = re.sub(fav_pattern36, fav_replacement36, html, flags=re.DOTALL)

    fav_pattern20 = r'<svg width="20" height="20" viewBox="0 0 100 100" fill="none">.*?</svg>'
    fav_replacement20 = f'''<svg width="20" height="20" viewBox="100 0 1336 1024" fill="none">
  <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="#D4A373" stroke="none">
{inner_paths}
  </g>
</svg>'''
    html = re.sub(fav_pattern20, fav_replacement20, html, flags=re.DOTALL)

    fav_pattern10 = r'<svg width="10" height="10" viewBox="0 0 100 100" fill="none">.*?</svg>'
    fav_replacement10 = f'''<svg width="10" height="10" viewBox="100 0 1336 1024" fill="none">
  <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="#FAF7F5" stroke="none">
{inner_paths}
  </g>
</svg>'''
    html = re.sub(fav_pattern10, fav_replacement10, html, flags=re.DOTALL)

    # 7. Replace E-commerce Header Simulator (Line 910)
    sim_pattern = r'<svg width="320" height="90" viewBox="0 0 340 100" fill="none">.*?</svg>'
    sim_replacement = f'''<svg width="320" height="90" viewBox="0 0 1200 360" fill="none">
  <defs>
    <linearGradient id="simLipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="50%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#881337" />
    </linearGradient>
  </defs>
  <g transform="translate(40, 20) scale(0.25)">
    <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="url(#simLipGrad)" stroke="none">
{inner_paths}
    </g>
  </g>
  <line x1="380" y1="80" x2="380" y2="280" stroke="#D4A373" stroke-width="2" opacity="0.4" />
  <text x="430" y="195" font-family="'Playfair Display', Georgia, serif" font-size="80" font-weight="700" letter-spacing="16" fill="#FAF7F5">VOLÚPIA</text>
  <text x="435" y="250" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="500" letter-spacing="8" fill="#D4A373">DESPERTE SEUS SENTIDOS</text>
</svg>'''
    html = re.sub(sim_pattern, sim_replacement, html, flags=re.DOTALL)

    with open(target_file, "w") as f:
        f.write(html)

print("ATUALIZAÇÃO COMPLETA: Todos os 10 blocos de SVG em volupia-brand-identity-spec.html foram atualizados com o novo logo!")
