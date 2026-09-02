/**
 * Omie ERP Sovereign Knockout.js Deep Module Inspector (V9)
 * Autor: Antigravity (CASOSEX Sovereign Engine)
 * 
 * Copie e cole no console F12 do navegador logado na Omie:
 */
(function harvestOmieKnockoutState() {
  console.log("%c[Omie Sovereign Harvester V9] Iniciando Inspeção de Estado Knockout.js...", "color: #00E2F4; font-weight: bold; font-size: 14px;");

  if (typeof omie === "undefined" || !omie.global) {
    console.error("[ERROR] Objeto global omie.global não encontrado no escopo window!");
    return;
  }

  const activeModule = omie.global.activeModule ? omie.global.activeModule() : null;
  const activeModules = omie.global.activeModules ? omie.global.activeModules() : [];
  const userInfo = omie.global.userInfo ? omie.global.userInfo.displayName() : "Usuário Omie";
  const appName = omie.global.appName ? omie.global.appName() : "App Omie";

  const moduleMap = {
    "SFA": { name: "CRM", hash: "#SFA", mid: "10000" },
    "VPR": { name: "Vendas e Produção / Estoque", hash: "#VPR", mid: "20000" },
    "VEN": { name: "Vendas e NF-e", hash: "#VEN", mid: "30000" },
    "COM": { name: "Compras e Suprimentos", hash: "#COM", mid: "40000" },
    "FIN": { name: "Finanças e DRE", hash: "#FIN", mid: "50000" },
    "CTB": { name: "Contabilidade / Painel Contador", hash: "#CTB", mid: "60000" }
  };

  const payload = {
    timestamp: new Date().toISOString(),
    engine: "RSXT Knockout.js Deep State Inspector V9",
    user_info: userInfo,
    app_name: appName,
    active_module: activeModule,
    all_active_modules: activeModules,
    canonical_modules: moduleMap,
    window_hash: window.location.hash,
    window_url: window.location.href
  };

  console.log("%c[SUCCESS] Payload do Módulo Ativo Extraído:", "color: #00E2F4; font-weight: bold;", payload);

  // COPIA O RESULTADO DIRETAMENTE PARA O CLIPBOARD
  if (typeof copy === "function") {
    copy(JSON.stringify(payload, null, 2));
    console.log("%c[CLIPBOARD] Payload JSON copiado para a Área de Transferência!", "color: #00FF66; font-weight: bold;");
  } else {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
      console.log("%c[CLIPBOARD] Payload JSON copiado via Navigator Clipboard API!", "color: #00FF66; font-weight: bold;");
    });
  }
})();
