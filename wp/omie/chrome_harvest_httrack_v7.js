// ==============================================================================
// 🛡️ CASOSEX HTTRACK-GRADE SPA DEEP HARVESTER V7 (WS / LOCALSTORAGE INGESTION)
// ==============================================================================
// Cole no Console F12 do Chrome logado no Omie.
// Este script varre a página (Links, Forms, iFrames, SVGs e CSS) e PERSISTE
// no localStorage do navegador sob a chave 'CASOSEX_LAST_SNAPSHOT'.
// Além disso, fornece o comando instantâneo copy() para você colar diretamente.
// ==============================================================================

(() => {
  console.log("🚀 [CASOSEX HTTRACK SPA V7] Extraindo Snapshot Completo...");

  const currentRoute = window.location.pathname + window.location.search + window.location.hash;

  // 1. Links Internos & Menus
  const discoveredLinks = Array.from(document.querySelectorAll('a[href], [onclick], [data-route], [role="menuitem"], .tile a, .ui-sidebar-list-link'))
    .map(el => el.href || el.getAttribute('data-route') || (el.innerText ? el.innerText.trim() : null))
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);

  // 2. iFrames
  const iframesData = Array.from(document.querySelectorAll('iframe')).map((iframe, idx) => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      return { id: iframe.id || `iframe_${idx}`, src: iframe.src, innerHTML: doc ? doc.body.innerHTML.substring(0, 30000) : 'cross-origin' };
    } catch (e) {
      return { id: iframe.id || `iframe_${idx}`, src: iframe.src, error: "Restricted" };
    }
  });

  // 3. Formulários e Inputs (Schema)
  const formsData = Array.from(document.querySelectorAll('form, .MuiFormGroup-root, table, .module-dlg-content')).map((form, idx) => {
    const inputs = Array.from(form.querySelectorAll('input, select, textarea')).map(input => ({
      name: input.name || input.id || input.placeholder,
      type: input.type || input.tagName,
      className: input.className
    }));
    return { form_index: idx, id: form.id || `form_${idx}`, inputs: inputs };
  });

  // 4. SVGs
  const svgElements = Array.from(document.querySelectorAll('svg'));
  const svgData = svgElements.map((svg, idx) => ({
    id: svg.id || `svg_${idx}`,
    className: svg.getAttribute('class') || '',
    viewBox: svg.getAttribute('viewBox') || '',
    outerHTML: svg.outerHTML
  }));

  // 5. Estilos Computados
  const keyNodes = Array.from(document.querySelectorAll('header, nav, button, form, table, th, td, div[class*="Mui"], div[class*="css-"], .tile, .ui-sidebar'));
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

  // 6. Payload Final
  const httrackPayload = {
    route: currentRoute,
    url: window.location.href,
    title: document.title,
    links_discovered: discoveredLinks,
    iframes: iframesData,
    forms_schema: formsData,
    svgs: svgData,
    computed_styles: styleMap,
    raw_dom: document.documentElement.outerHTML.substring(0, 150000)
  };

  const jsonStr = JSON.stringify(httrackPayload, null, 2);
  
  // Persiste no localStorage do navegador para recuperação garantida
  localStorage.setItem('CASOSEX_LAST_SNAPSHOT', jsonStr);
  window.__CASOSEX_SNAPSHOT__ = httrackPayload;

  // Executa o comando nativo do DevTools copy()
  try {
    copy(jsonStr);
    console.log("--------------------------------------------------");
    console.log("🎉 [ÉXITO TOTAL] Snapshot da rota " + currentRoute + " extraído!");
    console.log("📋 O JSON já foi copiado para a sua área de transferência!");
    console.log("👉 Basta dar Ctrl+V na conversa ou salvar.");
    console.log("--------------------------------------------------");
  } catch (e) {
    console.log("ℹ️ Execute copy(localStorage.getItem('CASOSEX_LAST_SNAPSHOT')) para copiar.");
  }

  return httrackPayload;
})();
