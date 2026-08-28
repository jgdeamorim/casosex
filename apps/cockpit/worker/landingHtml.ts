export const LANDING_HTML = `<!DOCTYPE html>
<html lang="pt-BR" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Volúpia | Desperte Seus Sentidos — B2B · B2C · B2E</title>
  <meta name="description" content="Volúpia — O prazer sensorial sofisticado que transforma a intimidade em experiência. Ecossistema B2B, B2C e B2E de Sexual Wellness no Brasil.">
  <meta name="theme-color" content="#0d0a0f">

  <!-- Typography & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg-gradient: radial-gradient(circle at 50% 20%, #211322 0%, #0d0a0f 70%, #050406 100%);
      --surface-glass: rgba(28, 20, 30, 0.72);
      --surface-glass-border: rgba(212, 163, 115, 0.28);
      --text-main: #FAF7F5;
      --text-muted: #A89B9B;
      --accent-gold: #D4A373;
      --accent-gold-light: #F5D0A9;
      --accent-rose: #E11D48;
      --accent-rose-soft: #FB7185;
      --accent-coral: #F9603F;
      --glow-rose: rgba(225, 29, 72, 0.28);
      --glow-gold: rgba(212, 163, 115, 0.22);
      --radius-xl: 24px;
      --radius-lg: 18px;
      --radius-md: 14px;
      --radius-pill: 9999px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-tap-highlight-color: transparent; }
    
    html, body {
      width: 100%;
      height: 100%;
      height: 100dvh;
      overflow: hidden;
    }

    body {
      background: var(--bg-gradient);
      color: var(--text-main);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      position: relative;
    }

    /* Ambient Blur FX */
    .ambient-blur-1 {
      position: fixed;
      top: -10%;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, var(--glow-rose) 0%, rgba(0,0,0,0) 70%);
      border-radius: 50%;
      pointer-events: none;
      filter: blur(80px);
      z-index: 0;
    }
    .ambient-blur-2 {
      position: fixed;
      bottom: 0%;
      right: -5%;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, var(--glow-gold) 0%, rgba(0,0,0,0) 70%);
      border-radius: 50%;
      pointer-events: none;
      filter: blur(80px);
      z-index: 0;
    }

    /* Header */
    header {
      width: 100%;
      max-width: 1200px;
      padding: max(16px, env(safe-area-inset-top)) 24px 12px 24px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: relative;
      z-index: 10;
    }

    .btn-login-header {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 22px;
      min-height: 44px;
      background: var(--surface-glass);
      border: 1px solid var(--surface-glass-border);
      border-radius: var(--radius-pill);
      color: var(--text-main);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .btn-login-header:hover {
      border-color: var(--accent-rose-soft);
      box-shadow: 0 4px 20px rgba(225, 29, 72, 0.2);
    }
    .btn-login-header:active { transform: scale(0.96); }

    /* Main Hero Area */
    main {
      width: 100%;
      max-width: 860px;
      padding: 10px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
      z-index: 10;
      margin: auto 0;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(225, 29, 72, 0.12);
      border: 1px solid rgba(225, 29, 72, 0.35);
      border-radius: var(--radius-pill);
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--accent-rose-soft);
      margin-bottom: 14px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .status-badge span.pulse-dot {
      width: 8px;
      height: 8px;
      background-color: var(--accent-rose);
      border-radius: 50%;
      box-shadow: 0 0 12px var(--accent-rose);
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.35); opacity: 1; box-shadow: 0 0 20px var(--accent-rose); }
      100% { transform: scale(0.95); opacity: 0.8; }
    }

    h1.hero-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.5rem, 6.5vw, 4.2rem);
      line-height: 1.08;
      font-weight: 700;
      margin-bottom: 6px;
      background: linear-gradient(180deg, #FFFFFF 0%, #E2D7CE 60%, var(--accent-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.08em;
    }

    .hero-tagline-quote {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: clamp(1.15rem, 3vw, 1.45rem);
      color: var(--accent-gold-light);
      margin-bottom: 16px;
    }

    p.hero-subtitle {
      font-size: clamp(0.92rem, 2.2vw, 1.08rem);
      color: var(--text-muted);
      max-width: 680px;
      line-height: 1.6;
      margin-bottom: 24px;
      font-weight: 400;
    }
    p.hero-subtitle strong {
      color: var(--text-main);
      font-weight: 600;
    }

    /* BRAND PILLARS ROW */
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      width: 100%;
      max-width: 680px;
      margin-bottom: 26px;
    }
    .pillar-card {
      background: var(--surface-glass);
      border: 1px solid var(--surface-glass-border);
      border-radius: var(--radius-md);
      padding: 14px 10px;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      text-align: center;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .pillar-card:hover {
      transform: translateY(-2px);
      border-color: var(--accent-rose-soft);
      box-shadow: 0 8px 24px rgba(225, 29, 72, 0.15);
    }
    .pillar-card h4 {
      font-size: 0.92rem;
      color: var(--accent-gold-light);
      margin-bottom: 4px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .pillar-card p {
      font-size: 0.78rem;
      color: var(--text-muted);
      line-height: 1.3;
    }

    /* VIP Access Box */
    .vip-card {
      width: 100%;
      max-width: 500px;
      background: var(--surface-glass);
      border: 1px solid var(--surface-glass-border);
      border-radius: var(--radius-xl);
      padding: 24px 20px;
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.45);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .vip-card h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--accent-gold-light);
    }
    .vip-card p {
      font-size: 0.84rem;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .btn-whatsapp-vip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 14px 20px;
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      border: none;
      border-radius: var(--radius-pill);
      color: #FFF;
      font-size: 0.95rem;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      min-height: 48px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 8px 24px rgba(37, 211, 102, 0.28);
    }
    .btn-whatsapp-vip:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(37, 211, 102, 0.4);
    }
    .btn-whatsapp-vip:active { transform: scale(0.97); }

    /* Footer */
    footer {
      width: 100%;
      padding: 14px 20px max(14px, env(safe-area-inset-bottom)) 20px;
      text-align: center;
      font-size: 0.78rem;
      color: var(--text-muted);
      border-top: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 10;
    }

    @media (max-height: 700px) {
      main { padding: 10px 16px; }
      h1.hero-title { font-size: 2.2rem; }
      p.hero-subtitle { margin-bottom: 16px; font-size: 0.86rem; }
      .pillars-grid { margin-bottom: 16px; }
      .vip-card { padding: 18px 16px; }
    }
  </style>
</head>
<body>

  <div class="ambient-blur-1"></div>
  <div class="ambient-blur-2"></div>

  <!-- Header -->
  <header>
    <a href="https://app.usevolupia.com.br/login" class="btn-login-header">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
      Entrar
    </a>
  </header>

  <!-- Hero Main -->
  <main>
    <div class="status-badge">
      <span class="pulse-dot"></span>
      Plataforma Tecnológica Soberana
    </div>

    <h1 class="hero-title">VOLÚPIA</h1>
    <div class="hero-tagline-quote">“Desperte seus sentidos”</div>

    <p class="hero-subtitle">
      O prazer sensorial sofisticado que transforma a intimidade em experiência. Construindo a infraestrutura definitiva para o mercado de Sexual Wellness no Brasil — integrando os ecossistemas <strong>B2B</strong>, <strong>B2C</strong> e <strong>B2E</strong> em uma plataforma unificada.
    </p>

    <!-- BRAND PILLARS -->
    <div class="pillars-grid">
      <div class="pillar-card">
        <h4>B2B · Atacado</h4>
        <p>Lojistas e distribuidores homologados</p>
      </div>
      <div class="pillar-card">
        <h4>B2C · Consumidor</h4>
        <p>Experiências diretas de auto-cuidado</p>
      </div>
      <div class="pillar-card">
        <h4>B2E · Ecossistema</h4>
        <p>Parceiros e executivos integrados</p>
      </div>
    </div>

    <!-- VIP Early Access -->
    <div class="vip-card">
      <h3>Acesso VIP & Lançamentos</h3>
      <p>Entre no grupo oficial do WhatsApp para obter prioridade em pré-lançamentos, novidades e tabelas exclusivas.</p>
      
      <a href="https://chat.whatsapp.com/IFZwYz8EXCLLUodeFN8HDC?s=sh&p=a&ilr=1" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-vip">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.637-1.152 4.211 4.314-1.131.582.35zm11.233-6.273c-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/></svg>
        <span>Entre no Grupo para Convite de Acesso VIP</span>
      </a>
    </div>
  </main>

  <!-- Footer -->
  <footer>
    Volúpia OS &nbsp;·&nbsp; Sexual Wellness (B2B · B2C · B2E) &nbsp;·&nbsp; Brasil 2026
  </footer>
</body>
</html>`;
