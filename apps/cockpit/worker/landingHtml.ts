export const LANDING_HTML = `<!DOCTYPE html>
<html lang="pt-BR" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Volúpia | Desperte Seus Sentidos — B2B · B2C · B2E</title>
  <meta name="description" content="Volúpia — O prazer sensorial sofisticado que transforma a intimidade em experiência. Ecossistema B2B, B2C e B2E de Sexual Wellness no Brasil.">
  <meta name="theme-color" content="#0d0a0f">

  <!-- Typography & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg-gradient: radial-gradient(circle at 50% 15%, #251227 0%, #0e0a11 65%, #050406 100%);
      --surface-glass: rgba(26, 18, 28, 0.75);
      --surface-glass-hover: rgba(38, 26, 42, 0.85);
      --surface-glass-border: rgba(212, 163, 115, 0.22);
      --surface-glass-border-active: rgba(225, 29, 72, 0.45);
      --text-main: #FAF7F5;
      --text-muted: #B3A4A4;
      --accent-gold: #D4A373;
      --accent-gold-light: #F7E4D0;
      --accent-rose: #E11D48;
      --accent-rose-soft: #FB7185;
      --accent-coral: #F9603F;
      --glow-rose: rgba(225, 29, 72, 0.22);
      --glow-gold: rgba(212, 163, 115, 0.18);
      --radius-xl: 24px;
      --radius-lg: 18px;
      --radius-md: 14px;
      --radius-pill: 9999px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-tap-highlight-color: transparent; }
    
    html, body {
      width: 100%;
      min-height: 100%;
      min-height: 100dvh;
      overflow-x: hidden;
      overflow-y: auto;
      overscroll-behavior-y: auto;
      -webkit-overflow-scrolling: touch;
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

    /* Ambient Motion Mesh Background */
    .ambient-blur-1 {
      position: fixed;
      top: -12%;
      left: 50%;
      transform: translateX(-50%);
      width: clamp(340px, 85vw, 680px);
      height: clamp(340px, 85vw, 680px);
      background: radial-gradient(circle, var(--glow-rose) 0%, rgba(0,0,0,0) 70%);
      border-radius: 50%;
      pointer-events: none;
      filter: blur(90px);
      z-index: 0;
      animation: floatGlow1 12s ease-in-out infinite alternate;
    }
    .ambient-blur-2 {
      position: fixed;
      bottom: -5%;
      right: -10%;
      width: clamp(280px, 60vw, 520px);
      height: clamp(280px, 60vw, 520px);
      background: radial-gradient(circle, var(--glow-gold) 0%, rgba(0,0,0,0) 70%);
      border-radius: 50%;
      pointer-events: none;
      filter: blur(90px);
      z-index: 0;
      animation: floatGlow2 14s ease-in-out infinite alternate;
    }

    @keyframes floatGlow1 {
      0% { transform: translateX(-50%) translateY(0) scale(1); }
      100% { transform: translateX(-48%) translateY(30px) scale(1.1); }
    }
    @keyframes floatGlow2 {
      0% { transform: translateY(0) scale(1); }
      100% { transform: translateY(-25px) scale(1.15); }
    }

    /* Header Nav */
    header {
      width: 100%;
      max-width: 1100px;
      padding: max(16px, env(safe-area-inset-top)) 20px 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 20;
    }

    .brand-mark {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .brand-logo-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, rgba(225, 29, 72, 0.25), rgba(212, 163, 115, 0.25));
      border: 1px solid var(--surface-glass-border);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    }
    .brand-logo-icon span {
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--accent-gold);
    }

    .brand-name {
      font-family: 'Playfair Display', serif;
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: var(--text-main);
    }

    .btn-login-header {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      min-height: 42px;
      background: var(--surface-glass);
      border: 1px solid var(--surface-glass-border);
      border-radius: var(--radius-pill);
      color: var(--text-main);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .btn-login-header:hover {
      border-color: var(--accent-rose-soft);
      box-shadow: 0 4px 20px rgba(225, 29, 72, 0.25);
    }
    .btn-login-header:active { transform: scale(0.96); }

    /* Main Container */
    main {
      width: 100%;
      max-width: 900px;
      padding: 16px 20px 32px 20px;
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
      font-size: 0.76rem;
      font-weight: 700;
      color: var(--accent-rose-soft);
      margin-bottom: 16px;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      backdrop-filter: blur(8px);
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
      font-size: clamp(2.6rem, 7.5vw, 4.8rem);
      line-height: 1.05;
      font-weight: 700;
      margin-bottom: 4px;
      background: linear-gradient(180deg, #FFFFFF 0%, #E8DDD4 55%, var(--accent-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.1em;
    }

    .hero-tagline-quote {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: clamp(1.15rem, 3.2vw, 1.5rem);
      color: var(--accent-gold-light);
      margin-bottom: 18px;
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    p.hero-subtitle {
      font-size: clamp(0.92rem, 2.2vw, 1.1rem);
      color: var(--text-muted);
      max-width: 700px;
      line-height: 1.65;
      margin-bottom: 28px;
      font-weight: 400;
    }
    p.hero-subtitle strong {
      color: var(--text-main);
      font-weight: 600;
    }

    /* BENTO GRID (RESPONSIVE MOBILE SCHEMA) */
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      width: 100%;
      max-width: 820px;
      margin-bottom: 30px;
    }

    .bento-card {
      background: var(--surface-glass);
      border: 1px solid var(--surface-glass-border);
      border-radius: var(--radius-lg);
      padding: 18px 16px;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      transition: all 0.35 cubic-bezier(0.16, 1, 0.3, 1);
    }

    .bento-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
      opacity: 0.3;
      transition: opacity 0.3s ease;
    }

    .bento-card:hover {
      transform: translateY(-3px);
      border-color: var(--surface-glass-border-active);
      background: var(--surface-glass-hover);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35), 0 0 20px var(--glow-rose);
    }
    .bento-card:hover::before { opacity: 0.8; }

    .bento-icon {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: rgba(212, 163, 115, 0.12);
      border: 1px solid rgba(212, 163, 115, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-gold-light);
      margin-bottom: 12px;
    }

    .bento-card h3 {
      font-size: 1rem;
      color: var(--text-main);
      margin-bottom: 6px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .bento-card p {
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.45;
    }

    .bento-pill {
      display: inline-block;
      align-self: flex-start;
      margin-top: 12px;
      padding: 3px 10px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: var(--radius-pill);
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--accent-gold);
    }

    /* VIP Access Box */
    .vip-card {
      width: 100%;
      max-width: 520px;
      background: linear-gradient(145deg, rgba(32, 21, 35, 0.85) 0%, rgba(18, 12, 20, 0.9) 100%);
      border: 1px solid var(--surface-glass-border-active);
      border-radius: var(--radius-xl);
      padding: 28px 24px;
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      box-shadow: 0 24px 60px rgba(0,0,0,0.55), 0 0 30px rgba(225, 29, 72, 0.15);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      position: relative;
    }

    .vip-badge-top {
      position: absolute;
      top: -12px;
      padding: 4px 14px;
      background: linear-gradient(135deg, var(--accent-rose) 0%, var(--accent-coral) 100%);
      border-radius: var(--radius-pill);
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #FFF;
      box-shadow: 0 4px 14px rgba(225, 29, 72, 0.4);
    }

    .vip-card h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--accent-gold-light);
      margin-top: 4px;
    }
    .vip-card p {
      font-size: 0.86rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .btn-whatsapp-vip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 15px 22px;
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      border: none;
      border-radius: var(--radius-pill);
      color: #FFF;
      font-size: 0.95rem;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      min-height: 50px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 10px 28px rgba(37, 211, 102, 0.32);
    }
    .btn-whatsapp-vip:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 36px rgba(37, 211, 102, 0.45);
    }
    .btn-whatsapp-vip:active { transform: scale(0.97); }

    .vip-live-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: #25D366;
      font-weight: 600;
    }

    /* Footer */
    footer {
      width: 100%;
      padding: 16px 20px max(16px, env(safe-area-inset-bottom)) 20px;
      text-align: center;
      font-size: 0.78rem;
      color: var(--text-muted);
      border-top: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    footer span.sub { font-size: 0.7rem; opacity: 0.75; }

    /* RESPONSIVE MOBILE SCHEMA AUDIT (MODE:MOBILE) */
    @media (max-width: 768px) {
      header { padding-left: 16px; padding-right: 16px; }
      main { padding-left: 16px; padding-right: 16px; }
      .bento-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .bento-card {
        padding: 16px;
      }
      .vip-card {
        padding: 24px 18px;
      }
      h1.hero-title {
        font-size: 2.5rem;
      }
    }

    @media (max-height: 700px) {
      main { padding-top: 8px; padding-bottom: 16px; }
      h1.hero-title { font-size: 2.2rem; }
      p.hero-subtitle { margin-bottom: 18px; font-size: 0.85rem; }
      .bento-grid { margin-bottom: 18px; }
      .vip-card { padding: 20px 16px; }
    }
  </style>
</head>
<body>

  <div class="ambient-blur-1"></div>
  <div class="ambient-blur-2"></div>

  <!-- Header -->
  <header>
    <a href="/" class="brand-mark">
      <div class="brand-logo-icon">
        <span>V</span>
      </div>
      <span class="brand-name">VOLÚPIA</span>
    </a>

    <a href="https://app.usevolupia.com.br/login" class="btn-login-header">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
      Entrar no Cockpit
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
      O prazer sensorial sofisticado que transforma a intimidade em experiência. Construindo a infraestrutura definitiva para o mercado de Sexual Wellness no Brasil — integrando os ecossistemas <strong>B2B</strong>, <strong>B2C</strong> e <strong>B2E</strong> em uma arquitetura unificada.
    </p>

    <!-- BENTO GRID (B2B, B2C, B2E) -->
    <div class="bento-grid">
      
      <!-- B2B Card -->
      <div class="bento-card">
        <div>
          <div class="bento-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <h3>B2B · Atacado Homologado</h3>
          <p>Rede de fornecedores, distribuidores e lojistas com precificação dinâmica e inteligência de oferta.</p>
        </div>
        <span class="bento-pill">Faturamento Direct</span>
      </div>

      <!-- B2C Card -->
      <div class="bento-card">
        <div>
          <div class="bento-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <h3>B2C · Experiência Íntima</h3>
          <p>Curadoria exclusiva de produtos sensoriais de alto padrão, focados em bem-estar e auto-cuidado.</p>
        </div>
        <span class="bento-pill">Entrega Discreta</span>
      </div>

      <!-- B2E Card -->
      <div class="bento-card">
        <div>
          <div class="bento-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
          <h3>B2E · Ecossistema Corporativo</h3>
          <p>Parcerias executivas, distribuição estratégica e infraestrutura de alta conversão de mercado.</p>
        </div>
        <span class="bento-pill">Expansão Nacional</span>
      </div>

    </div>

    <!-- VIP Early Access Box -->
    <div class="vip-card">
      <div class="vip-badge-top">Exclusividade</div>
      <h3>Acesso VIP & Lançamentos</h3>
      <p>Junte-se ao canal oficial do WhatsApp para receber prioridade em pré-lançamentos, novidades e tabelas exclusivas do ecossistema Volúpia.</p>
      
      <a href="https://chat.whatsapp.com/IFZwYz8EXCLLUodeFN8HDC?s=sh&p=a&ilr=1" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-vip">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.399.637-1.152 4.211 4.314-1.131.582.35zm11.233-6.273c-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/></svg>
        <span>Solicitar Convite VIP no WhatsApp</span>
      </a>

      <div class="vip-live-status">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
        <span>Lote Ativo · Vagas Limitadas</span>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer>
    <div>Volúpia OS &nbsp;·&nbsp; Sexual Wellness (B2B · B2C · B2E)</div>
    <span class="sub">Plataforma Soberana &nbsp;·&nbsp; Brasil 2026</span>
  </footer>
</body>
</html>`;
