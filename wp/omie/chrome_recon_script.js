// ==============================================================================
// 🛡️ OODA / BOA RECON SCRIPT - SOBERANO OMIE DASHBOARD RECONNAISSANCE
// ==============================================================================
// Este script realiza varredura passiva de metadados das aplicações registradas
// na sua conta Omie (versões de API, endpoints expostos na UI, chaves e namespaces).
//
// ⚠️ INSTRUÇÕES DE EXECUÇÃO:
// 1. Abra o Chrome no seu painel: https://portal.omie.com.br/meus-aplicativos/
// 2. Abra o DevTools (F12 -> aba Console).
// 3. Cole este script e aperte ENTER.
// 4. Copie a saída JSON estruturada retornada no console.
// ==============================================================================

(() => {
  console.log("🚀 [CASOSEX RECON] Iniciando Mapeamento UI/UX da Conta Omie...");

  const appCards = Array.from(document.querySelectorAll('.app-card, [data-app-id], .card-aplicativo, .box-app')).map(el => {
    return {
      title: el.querySelector('h3, h4, .title, .app-name')?.innerText?.trim() || "N/A",
      id: el.getAttribute('data-app-id') || el.id || "N/A",
      text: el.innerText?.replace(/\s+/g, ' ').substring(0, 150) || "N/A"
    };
  });

  const pageMetadata = {
    title: document.title,
    url: window.location.href,
    origin: window.location.origin,
    pathname: window.location.pathname,
    timestamp: new Date().toISOString(),
    apps_found: appCards.length,
    apps: appCards,
    meta_tags: Array.from(document.querySelectorAll('meta')).map(m => ({ name: m.name || m.getAttribute('property'), content: m.content })),
    scripts_detected: Array.from(document.querySelectorAll('script[src]')).map(s => s.src).filter(src => src.includes('omie') || src.includes('api'))
  };

  console.log("✅ [CASOSEX RECON] Mapeamento Concluído! Copie a estrutura abaixo:");
  console.log(JSON.stringify(pageMetadata, null, 2));

  return pageMetadata;
})();
