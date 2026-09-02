// ==============================================================================
// 🛡️ CASOSEX RECON V2 - OODA HIGH-PRECISION PORTAL MAPPER
// ==============================================================================
// Suporta a nova UI em React 19/Vite do Portal Omie (classes com hash dinamico)
// ==============================================================================

(() => {
  console.log("🚀 [CASOSEX RECON V2] Iniciando Varredura High-Precision do Portal Omie...");

  // 1. Captura de elementos interativos e cards dinâmicos do React
  const allElements = Array.from(document.querySelectorAll('div, section, article, a, button'));
  
  const suspiciousCards = allElements.filter(el => {
    const text = el.innerText || "";
    return (text.includes("Empresa") || text.includes("Aplicativo") || text.includes("CNPJ") || text.includes("Acessar")) && text.length < 300;
  }).slice(0, 15).map(el => ({
    tagName: el.tagName,
    className: el.className,
    text: el.innerText.replace(/\s+/g, ' ').trim()
  }));

  // 2. Extração do estado global do React / Vite / Redux / Context se presente
  let reactStateKeys = [];
  try {
    const rootEl = document.querySelector('#root, #app, body');
    if (rootEl) {
      reactStateKeys = Object.keys(rootEl).filter(k => k.startsWith('__react') || k.startsWith('__vite'));
    }
  } catch (e) {
    void e;
  }

  const outputData = {
    portal: "Omie SPA (React/Vite)",
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString(),
    api_gateway_detected: "https://portalapi.omie.com.br/api/portal",
    react_keys: reactStateKeys,
    detected_cards: suspiciousCards
  };

  console.log("✅ [CASOSEX RECON V2] Mapeamento concluído!");
  console.log(JSON.stringify(outputData, null, 2));

  return outputData;
})();
