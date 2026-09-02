import re
import os

svg_source_path = "/home/jeffer/Downloads/ChatGPT-Image-2-de-set.-de-2026_-18_05_50.svg"

with open(svg_source_path, "r") as f:
    svg_source = f.read()

paths = re.findall(r'd="([^"]+)"', svg_source)
inner_paths_str = "\n".join([f'    <path d="{p}"/>' for p in paths])

# Exact center-aligned emblem group template:
# Inside viewBox="0 0 1350 1250", emblem center is CX=675, CY=625 (dead center!)
emblem_group = f'''<g transform="translate(212.250000, 1013.700000) scale(0.100000, -0.100000)" stroke="none">
{inner_paths_str}
</g>'''

html_content = f'''<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VOLÚPIA — Sensual Minimalist Brandmark & Spec-Brand</title>
  
  <!-- Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Fira+Code:wght@400;600&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <style>
    :root {{
      --bg-dark: #0D0407;
      --bg-card: rgba(23, 10, 16, 0.65);
      --bg-card-hover: rgba(35, 14, 24, 0.85);
      --border-color: rgba(212, 163, 115, 0.18);
      --border-glow: rgba(225, 29, 72, 0.35);
      --text-main: #F7EBE1;
      --text-muted: #A8959E;
      --accent-gold: #D4A373;
      --accent-gold-light: #F5E6D3;
      --accent-crimson: #E11D48;
      --accent-bordeaux: #881337;
      --font-serif: 'Playfair Display', Georgia, serif;
      --font-sans: 'Plus Jakarta Sans', -apple-system, sans-serif;
      --font-mono: 'Fira Code', monospace;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}

    body {{
      background-color: var(--bg-dark);
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(136, 19, 55, 0.25) 0%, transparent 40%),
        radial-gradient(circle at 85% 60%, rgba(225, 29, 72, 0.15) 0%, transparent 45%),
        radial-gradient(circle at 50% 90%, rgba(212, 163, 115, 0.08) 0%, transparent 50%);
      background-attachment: fixed;
      color: var(--text-main);
      font-family: var(--font-sans);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      padding-bottom: 80px;
    }}

    /* Header Nav */
    header {{
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(20px);
      background: rgba(13, 4, 7, 0.85);
      border-bottom: 1px solid var(--border-color);
      padding: 16px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}

    .nav-brand {{
      display: flex;
      align-items: center;
      gap: 16px;
      text-decoration: none;
      color: var(--text-main);
    }}

    .nav-badge {{
      background: linear-gradient(135deg, rgba(225,29,72,0.2), rgba(136,19,55,0.4));
      border: 1px solid rgba(225,29,72,0.4);
      color: #FB7185;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }}

    .container {{
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 24px;
    }}

    /* Hero Section */
    .hero {{
      padding: 80px 0 60px;
      text-align: center;
      position: relative;
    }}

    .hero-logo-box {{
      max-width: 720px;
      margin: 0 auto 36px;
      padding: 40px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      backdrop-filter: blur(16px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08);
      transition: transform 0.3s ease, border-color 0.3s ease;
    }}

    .hero-logo-box:hover {{
      border-color: var(--border-glow);
      transform: translateY(-2px);
    }}

    .hero-title {{
      font-family: var(--font-serif);
      font-size: 42px;
      font-weight: 700;
      color: var(--accent-gold-light);
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }}

    .hero-subtitle {{
      font-size: 18px;
      color: var(--text-muted);
      max-width: 680px;
      margin: 0 auto 24px;
      font-weight: 300;
    }}

    /* Section Component Cards */
    .section {{
      margin-top: 64px;
    }}

    .section-header {{
      display: flex;
      align-items: baseline;
      gap: 16px;
      margin-bottom: 24px;
      border-bottom: 1px solid rgba(212, 163, 115, 0.15);
      padding-bottom: 12px;
    }}

    .section-num {{
      font-family: var(--font-mono);
      font-size: 14px;
      color: var(--accent-gold);
      font-weight: 600;
    }}

    .section-title {{
      font-family: var(--font-serif);
      font-size: 26px;
      color: var(--text-main);
    }}

    .grid-2 {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 24px;
    }}

    .grid-3 {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 24px;
    }}

    .grid-4 {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }}

    .card {{
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 28px;
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.25s ease;
    }}

    .card:hover {{
      background: var(--bg-card-hover);
      border-color: rgba(212, 163, 115, 0.4);
    }}

    .card-preview {{
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(8, 3, 5, 0.7);
      border-radius: 12px;
      margin-bottom: 20px;
      border: 1px solid rgba(255,255,255,0.04);
      position: relative;
      overflow: hidden;
    }}

    .card-preview.light-bg {{
      background: #FAF7F5;
    }}

    .card-info h4 {{
      font-family: var(--font-serif);
      font-size: 18px;
      color: var(--accent-gold-light);
      margin-bottom: 6px;
    }}

    .card-info p {{
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.5;
    }}

    .code-tag {{
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 11px;
      background: rgba(212, 163, 115, 0.12);
      color: var(--accent-gold);
      padding: 3px 8px;
      border-radius: 4px;
      margin-top: 10px;
    }}

    /* Color Swatches */
    .swatch-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }}

    .swatch-card {{
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
    }}

    .swatch-color {{
      height: 100px;
      width: 100%;
    }}

    .swatch-details {{
      padding: 14px;
    }}

    .swatch-name {{
      font-weight: 600;
      font-size: 14px;
      color: var(--text-main);
    }}

    .swatch-hex {{
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--accent-gold);
    }}

    /* Table Styles */
    .spec-table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 14px;
    }}

    .spec-table th, .spec-table td {{
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid rgba(212, 163, 115, 0.1);
    }}

    .spec-table th {{
      color: var(--accent-gold);
      font-weight: 600;
      font-family: var(--font-mono);
      font-size: 12px;
      text-transform: uppercase;
    }}

    /* Touchpoint Simulator */
    .touchpoint-card {{
      background: #0F0508;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 24px;
      margin-top: 16px;
    }}

    /* Toast Notice */
    #toast {{
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--accent-bordeaux);
      border: 1px solid var(--accent-crimson);
      color: #FFF;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      display: none;
      z-index: 1000;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }}
  </style>
</head>
<body>

  <header>
    <a href="#" class="nav-brand">
      <svg width="32" height="32" viewBox="0 0 1350 1250" fill="none">
        <g fill="#D4A373">
{emblem_group}
        </g>
      </svg>
      <span style="font-family: var(--font-serif); font-weight: 700; font-size: 18px; letter-spacing: 3px; color: var(--accent-gold-light);">VOLÚPIA</span>
    </a>
    <span class="nav-badge">Especificação de Marca Canônica v2.0</span>
  </header>

  <div class="container">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-logo-box">
        <svg viewBox="0 0 1100 320" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="heroLipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FB7185" />
              <stop offset="40%" stop-color="#E11D48" />
              <stop offset="80%" stop-color="#9F1239" />
              <stop offset="100%" stop-color="#580A20" />
            </linearGradient>
            <linearGradient id="heroGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#F7EBE1" />
              <stop offset="100%" stop-color="#E5C3A6" />
            </linearGradient>
            <filter id="heroGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#E11D48" flood-opacity="0.25" />
            </filter>
          </defs>
          <g transform="translate(30, 60) scale(0.16)" fill="url(#heroLipGrad)" filter="url(#heroGlow)">
{emblem_group}
          </g>
          <line x1="320" y1="65" x2="320" y2="255" stroke="#D4A373" stroke-width="1.5" stroke-linecap="round" opacity="0.45" />
          <text x="360" y="168" font-family="'Playfair Display', Georgia, serif" font-size="74" font-weight="700" letter-spacing="14" fill="url(#heroGoldGrad)">VOLÚPIA</text>
          <text x="365" y="225" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="500" letter-spacing="9" fill="#D4A373" opacity="0.9">DESPERTE SEUS SENTIDOS</text>
        </svg>
      </div>

      <h1 class="hero-title">Sensual Minimalist Brandmark System</h1>
      <p class="hero-subtitle">Sistema soberano de identidade visual codificado em especificações orientadas a componentes, vetores nativos e design estrito orientados a Erotic Luxury.</p>
    </section>

    <!-- SECTION 01: Taxonomia -->
    <section class="section">
      <div class="section-header">
        <span class="section-num">01</span>
        <h2 class="section-title">Taxonomia & Doutrina da Marca</h2>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-info">
            <h4>Brandmark (Emblema)</h4>
            <p>Elemento gráfico autônomo. Fusão sutil entre lábios sensuais e o monograma <strong>V</strong> em espaço negativo.</p>
            <span class="code-tag">brandmark-master.svg</span>
          </div>
        </div>
        <div class="card">
          <div class="card-info">
            <h4>Wordmark (Logotipo)</h4>
            <p>Assinatura exclusivamente tipográfica construída sobre a tipografia serifada <em>Playfair Display</em> com tracking expandido.</p>
            <span class="code-tag">wordmark-standalone.svg</span>
          </div>
        </div>
        <div class="card">
          <div class="card-info">
            <h4>System Lockup</h4>
            <p>Arranjo geométrico fixo combinando Brandmark, divisor em Ouro Champanhe, Wordmark e a Tagline oficial.</p>
            <span class="code-tag">lockup-horizontal.svg</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 02: Brandmark Specs -->
    <section class="section">
      <div class="section-header">
        <span class="section-num">02</span>
        <h2 class="section-title">Brandmark — O Emblema Sensual Minimalist</h2>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-preview">
            <svg width="140" height="140" viewBox="0 0 1350 1250" fill="none">
              <defs>
                <linearGradient id="cardMasterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FB7185" />
                  <stop offset="35%" stop-color="#E11D48" />
                  <stop offset="75%" stop-color="#9F1239" />
                  <stop offset="100%" stop-color="#4C0519" />
                </linearGradient>
              </defs>
              <g fill="url(#cardMasterGrad)">
{emblem_group}
              </g>
            </svg>
          </div>
          <div class="card-info">
            <h4>Versão Canônica Master (Bordeaux Gradient)</h4>
            <p>Aplicação principal com degradê carmim que confere tridimensionalidade e brilho sedoso.</p>
            <span class="code-tag">Fundo Escuro / E-commerce / Mobile App</span>
          </div>
        </div>

        <div class="card">
          <div class="card-preview">
            <svg width="140" height="140" viewBox="0 0 1350 1250" fill="none">
              <g fill="#D4A373">
{emblem_group}
              </g>
            </svg>
          </div>
          <div class="card-info">
            <h4>Versão Monocromática (Champagne Gold)</h4>
            <p>Vetor plano em Ouro Champanhe para aplicação em lacres de cera, relevo seco e hot stamping.</p>
            <span class="code-tag">Hot Stamping / Carimbos / Lacres</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 03: System Lockups -->
    <section class="section">
      <div class="section-header">
        <span class="section-num">03</span>
        <h2 class="section-title">System Lockups — Composições Oficiais</h2>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-preview" style="height: 220px;">
            <svg width="340" height="100" viewBox="0 0 1100 320" fill="none">
              <defs>
                <linearGradient id="cardHzGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FB7185" />
                  <stop offset="40%" stop-color="#E11D48" />
                  <stop offset="80%" stop-color="#9F1239" />
                  <stop offset="100%" stop-color="#580A20" />
                </linearGradient>
                <linearGradient id="cardGoldText" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#F7EBE1" />
                  <stop offset="100%" stop-color="#E5C3A6" />
                </linearGradient>
              </defs>
              <g transform="translate(30, 60) scale(0.16)" fill="url(#cardHzGrad)">
{emblem_group}
              </g>
              <line x1="320" y1="65" x2="320" y2="255" stroke="#D4A373" stroke-width="1.5" stroke-linecap="round" opacity="0.45" />
              <text x="360" y="168" font-family="'Playfair Display', Georgia, serif" font-size="74" font-weight="700" letter-spacing="14" fill="url(#cardGoldText)">VOLÚPIA</text>
              <text x="365" y="225" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="500" letter-spacing="9" fill="#D4A373" opacity="0.9">DESPERTE SEUS SENTIDOS</text>
            </svg>
          </div>
          <div class="card-info">
            <h4>Lockup Secundário Horizontal (Navbar)</h4>
            <p>Centralização ótica perfeita entre símbolo, divisor e tipografia em bissecção no eixo Y=160px.</p>
            <span class="code-tag">Navbar / Header E-commerce / E-mail</span>
          </div>
        </div>

        <div class="card">
          <div class="card-preview" style="height: 220px;">
            <svg width="240" height="180" viewBox="0 0 800 720" fill="none">
              <defs>
                <linearGradient id="cardStackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FB7185" />
                  <stop offset="40%" stop-color="#E11D48" />
                  <stop offset="80%" stop-color="#9F1239" />
                  <stop offset="100%" stop-color="#580A20" />
                </linearGradient>
                <linearGradient id="cardGoldTextStack" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#F7EBE1" />
                  <stop offset="100%" stop-color="#E5C3A6" />
                </linearGradient>
              </defs>
              <g transform="translate(220, 40) scale(0.2667)" fill="url(#cardStackGrad)">
{emblem_group}
              </g>
              <line x1="320" y1="410" x2="480" y2="410" stroke="#D4A373" stroke-width="1.5" stroke-linecap="round" opacity="0.4" />
              <text x="400" y="505" font-family="'Playfair Display', Georgia, serif" font-size="72" font-weight="700" letter-spacing="16" fill="url(#cardGoldTextStack)" text-anchor="middle">VOLÚPIA</text>
              <text x="400" y="565" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="500" letter-spacing="10" fill="#D4A373" text-anchor="middle" opacity="0.9">DESPERTE SEUS SENTIDOS</text>
            </svg>
          </div>
          <div class="card-info">
            <h4>Lockup Primário Vertical (Stacked)</h4>
            <p>Composição vertical equilibrada para embalagens institucionais, capas e apresentações.</p>
            <span class="code-tag">Packaging / Capas / Banners</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 04: Sistema Responsivo -->
    <section class="section">
      <div class="section-header">
        <span class="section-num">04</span>
        <h2 class="section-title">Sistema Responsivo (4 Níveis de Escala)</h2>
      </div>

      <div class="grid-4">
        <div class="card">
          <div class="card-preview" style="height: 120px;">
            <span style="font-family: var(--font-serif); font-size: 24px; font-weight: 700; color: var(--accent-gold-light); letter-spacing: 4px;">VOLÚPIA</span>
          </div>
          <div class="card-info">
            <h4>Nível 1 — Master Lockup</h4>
            <p>Breakpoints &gt; 1024px. Exibe marca completa com divisor e tagline.</p>
          </div>
        </div>

        <div class="card">
          <div class="card-preview" style="height: 120px;">
            <svg width="48" height="48" viewBox="0 0 1350 1250" fill="none">
              <g fill="#D4A373">
{emblem_group}
              </g>
            </svg>
          </div>
          <div class="card-info">
            <h4>Nível 2 — Brandmark Only</h4>
            <p>Breakpoints 640px – 1023px. Utiliza apenas o emblema centralizado.</p>
          </div>
        </div>

        <div class="card">
          <div class="card-preview" style="height: 120px;">
            <svg width="32" height="32" viewBox="0 0 1350 1250" fill="none">
              <g fill="#D4A373">
{emblem_group}
              </g>
            </svg>
          </div>
          <div class="card-info">
            <h4>Nível 3 — App Icon (32px)</h4>
            <p>Dispositivos móveis e headers compactos sem perda de nitidez.</p>
          </div>
        </div>

        <div class="card">
          <div class="card-preview" style="height: 120px;">
            <svg width="16" height="16" viewBox="0 0 1350 1250" fill="none">
              <g fill="#FAF7F5">
{emblem_group}
              </g>
            </svg>
          </div>
          <div class="card-info">
            <h4>Nível 4 — Favicon (16px)</h4>
            <p>Micro-redução ótica otimizada para abas do navegador.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 05: Paleta de Cores -->
    <section class="section">
      <div class="section-header">
        <span class="section-num">05</span>
        <h2 class="section-title">Paleta de Cores & Tokens de Design</h2>
      </div>

      <div class="swatch-grid">
        <div class="swatch-card">
          <div class="swatch-color" style="background: #881337;"></div>
          <div class="swatch-details">
            <div class="swatch-name">Bordeaux Velvet</div>
            <div class="swatch-hex">#881337 · Primary</div>
          </div>
        </div>

        <div class="swatch-card">
          <div class="swatch-color" style="background: #E11D48;"></div>
          <div class="swatch-details">
            <div class="swatch-name">Crimson Rose</div>
            <div class="swatch-hex">#E11D48 · Accent</div>
          </div>
        </div>

        <div class="swatch-card">
          <div class="swatch-color" style="background: #D4A373;"></div>
          <div class="swatch-details">
            <div class="swatch-name">Champagne Gold</div>
            <div class="swatch-hex">#D4A373 · Luxury</div>
          </div>
        </div>

        <div class="swatch-card">
          <div class="swatch-color" style="background: #0D0407;"></div>
          <div class="swatch-details">
            <div class="swatch-name">Obsidian Plum</div>
            <div class="swatch-hex">#0D0407 · Background</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 06: Faturamento Discreto -->
    <section class="section">
      <div class="section-header">
        <span class="section-num">06</span>
        <h2 class="section-title">Faturamento & Sigilo Bancário (Soft Descriptor)</h2>
      </div>

      <div class="touchpoint-card">
        <h4 style="font-family: var(--font-serif); color: var(--accent-gold-light); font-size: 18px; margin-bottom: 12px;">Regra de Proteção ao Consumidor (Privacidade 100%)</h4>
        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 16px;">Para garantir a discrição absoluta na fatura do cartão de crédito e extrato bancário dos clientes, o nome <strong>VOLÚPIA</strong> NUNCA é exibido na fatura bancária.</p>
        
        <table class="spec-table">
          <thead>
            <tr>
              <th>Ambiente</th>
              <th>Identificador na Fatura</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cartão de Crédito / PIX</td>
              <td><code>VL*SERVICOS TECNOLOGICOS</code></td>
              <td><span style="color: #4ADE80;">🟢 Homologado</span></td>
            </tr>
            <tr>
              <td>Comprovante de Pagamento</td>
              <td><code>VL*DIGITAL SERVICES BR</code></td>
              <td><span style="color: #4ADE80;">🟢 Homologado</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

  </div>

  <div id="toast">Copiado para a área de transferência!</div>

  <script>
    function copyText(text) {{
      navigator.clipboard.writeText(text);
      const toast = document.getElementById('toast');
      toast.style.display = 'block';
      setTimeout(() => {{ toast.style.display = 'none'; }}, 2000);
    }}
  </script>
</body>
</html>
'''

# Write to both target files
spec_files = [
    "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/Brand-oficial/volupia-brand-identity-spec.html",
    "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/brand-spec/volupia-brand-identity-spec.html"
]

for target in spec_files:
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with open(target, "w") as f:
        f.write(html_content)

print("ULTIMATE SPEC STUDIO HTML gerado com sucesso com 100% de alinhamento visual e seções organizadas!")
