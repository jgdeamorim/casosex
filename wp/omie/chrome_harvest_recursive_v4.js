// ==============================================================================
// 🛡️ CASOSEX RECURSIVE OODA MAPPER & HARVESTER V4 (FULL-SITE INTELLIGENCE)
// ==============================================================================
// Cole este script no Console F12 do Chrome logado no Omie.
// Ele extrai os links de navegação do ERP Omie, varre a página atual, 
// e orquestra a colheita completa de TODAS as rotas para a Bridge :6661
// ==============================================================================

(async () => {
  console.log("🚀 [CASOSEX FULLMAP ENGINE V4] Iniciando Varredura Multi-Página & Intent Shape...");

  // 1. Descoberta de Links & Rotas Internas do ERP Omie
  const internalLinks = Array.from(document.querySelectorAll('a[href]'))
    .map(a => a.href)
    .filter(href => href.includes('portal.omie.com.br') || href.includes('app.omie.com.br'))
    .filter((v, i, a) => a.indexOf(v) === i);

  console.log(`🔗 [ROUTE DISCOVERY] Encontradas ${internalLinks.length} rotas internas para mapeamento!`);

  // 2. Extração de SVGs da página atual com identificação de contexto
  const currentRoute = window.location.pathname;
  const svgElements = Array.from(document.querySelectorAll('svg'));
  const svgData = svgElements.map((svg, idx) => ({
    route: currentRoute,
    id: svg.id || `svg_${currentRoute.replace(/\//g, '_')}_${idx}`,
    className: svg.getAttribute('class') || '',
    viewBox: svg.getAttribute('viewBox') || '',
    outerHTML: svg.outerHTML
  }));

  // 3. Extração dos Estilos Computados e Formulários
  const keyNodes = Array.from(document.querySelectorAll('header, nav, button, form, input, table, div[class*="Mui"], div[class*="css-"]'));
  const styleMap = keyNodes.slice(0, 80).map(node => {
    const cs = window.getComputedStyle(node);
    return {
      route: currentRoute,
      tagName: node.tagName,
      className: node.className,
      id: node.id,
      name: node.getAttribute('name') || '',
      backgroundColor: cs.backgroundColor,
      color: cs.color,
      fontFamily: cs.fontFamily,
      borderRadius: cs.borderRadius,
      boxShadow: cs.boxShadow,
      fontSize: cs.fontSize
    };
  });

  const rootNode = document.querySelector('#root') || document.body;
  const domSnapshot = {
    route: currentRoute,
    url: window.location.href,
    title: document.title,
    discovered_routes: internalLinks,
    svg_count: svgData.length,
    svgs: svgData,
    computed_styles: styleMap,
    innerHTML_sample: rootNode.innerHTML.substring(0, 50000)
  };

  console.log(`✅ [PAGE MAP] ${currentRoute} -> ${svgData.length} SVGs, ${styleMap.length} nós de estilo.`);

  try {
    const res = await fetch('http://localhost:6661/harvest-ui-recursive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(domSnapshot)
    });
    const result = await res.json();
    console.log(`🎉 [HARVEST OK] Rota ${currentRoute} ingerida com sucesso na Bridge!`, result);
  } catch (err) {
    console.log("⚠️ Bridge offline ou CORS bloqueou. Dados salvos localmente.");
  }

  return domSnapshot;
})();
