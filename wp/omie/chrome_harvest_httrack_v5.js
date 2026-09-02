// ==============================================================================
// 🛡️ CASOSEX HTTRACK-GRADE SPA DEEP HARVESTER V5 (FULL-SITE RECURSIVE ENGINE)
// ==============================================================================
// Cole no Console F12 do Chrome logado no Omie.
// Este script varre a página atual, detecta TODOS os links internos, iFrames, 
// menus do ERP, formulários e modais, e envia tudo estruturado para a Bridge :6661
// ==============================================================================

(async () => {
  console.log("🚀 [CASOSEX HTTRACK SPA V5] Iniciando Varredura Profunda Multi-Camada...");

  const currentRoute = window.location.pathname + window.location.search + window.location.hash;

  // 1. Extração de Links Internos (Menu Principal, Submenus, Modais e Links de ERP)
  const discoveredLinks = Array.from(document.querySelectorAll('a[href], [onclick], [data-route], [role="menuitem"]'))
    .map(el => {
      if (el.href) return el.href;
      if (el.getAttribute('data-route')) return el.getAttribute('data-route');
      return el.innerText ? el.innerText.trim() : null;
    })
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);

  // 2. Extração de iFrames Internos (Muitas telas do Omie usam iFrames legados)
  const iframesData = Array.from(document.querySelectorAll('iframe')).map((iframe, idx) => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      return {
        id: iframe.id || `iframe_${idx}`,
        src: iframe.src,
        innerHTML: doc ? doc.body.innerHTML.substring(0, 30000) : 'cross-origin-restricted'
      };
    } catch (e) {
      return { id: iframe.id || `iframe_${idx}`, src: iframe.src, error: "Access Restricted" };
    }
  });

  // 3. Mapeamento de Formulários & Campos de Entrada (Intent Schema Input Mating)
  const formsData = Array.from(document.querySelectorAll('form, .MuiFormGroup-root, table')).map((form, idx) => {
    const inputs = Array.from(form.querySelectorAll('input, select, textarea')).map(input => ({
      name: input.name || input.id || input.placeholder,
      type: input.type || input.tagName,
      className: input.className
    }));
    return {
      form_index: idx,
      id: form.id || `form_${idx}`,
      inputs: inputs
    };
  });

  // 4. SVGs & Ícones Visuais
  const svgElements = Array.from(document.querySelectorAll('svg'));
  const svgData = svgElements.map((svg, idx) => ({
    id: svg.id || `svg_${idx}`,
    className: svg.getAttribute('class') || '',
    viewBox: svg.getAttribute('viewBox') || '',
    outerHTML: svg.outerHTML
  }));

  // 5. Estilos Computados Reais
  const keyNodes = Array.from(document.querySelectorAll('header, nav, button, form, table, th, td, div[class*="Mui"], div[class*="css-"]'));
  const styleMap = keyNodes.slice(0, 100).map(node => {
    const cs = window.getComputedStyle(node);
    return {
      tagName: node.tagName,
      className: node.className,
      backgroundColor: cs.backgroundColor,
      color: cs.color,
      fontFamily: cs.fontFamily,
      borderRadius: cs.borderRadius,
      boxShadow: cs.boxShadow,
      fontSize: cs.fontSize
    };
  });

  // 6. Payload Final Sintetizado no Padrão HTTrack SPA
  const httrackPayload = {
    route: currentRoute,
    url: window.location.href,
    title: document.title,
    links_discovered: discoveredLinks,
    iframes: iframesData,
    forms_schema: formsData,
    svgs: svgData,
    computed_styles: styleMap,
    raw_dom: document.documentElement.outerHTML.substring(0, 100000)
  };

  console.log(`📦 [HTTRACK PAYLOAD READY] Route: ${currentRoute} | Links: ${discoveredLinks.length} | Forms: ${formsData.length} | SVGs: ${svgData.length}`);

  try {
    const res = await fetch('http://localhost:6661/harvest-ui-recursive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(httrackPayload)
    });
    const result = await res.json();
    console.log(`🎉 [SOVEREIGN HARVEST SUCCESS] Tela ${currentRoute} persistida em disco!`, result);
  } catch (err) {
    console.log("⚠️ Bridge offline ou bloqueado:", err);
  }

  return httrackPayload;
})();
