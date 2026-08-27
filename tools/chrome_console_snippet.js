/**
 * 🚀 ADSENTICE SOVEREIGN CHROME CONSOLE BRIDGE (Port 6669)
 * Cole este código diretamente no Console do Chrome (F12 -> Console).
 */
(function() {
  const BRIDGE_URL = 'http://localhost:6669/push';

  // Função global para enviar JSON direto pelo Console
  window.pushIncrementalJSON = async function(dataCustom = {}) {
    const payload = {
      timestamp: new Date().toISOString(),
      action: dataCustom.action || 'incremental_change',
      metadata: {
        url: window.location.href,
        title: document.title,
        userAgent: navigator.userAgent
      },
      payload: dataCustom
    };

    try {
      const response = await fetch(BRIDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();
      console.log('%c ⚡ [Adsentice 6669] Push Enviado com Sucesso!', 'color: #10b981; font-weight: bold; font-size: 13px;', resData);
      return resData;
    } catch (err) {
      console.error('❌ [Adsentice 6669] Erro ao enviar push para o Bridge:', err);
    }
  };

  // Cria um botão flutuante discreto no canto inferior direito da tela
  if (!document.getElementById('adsentice-bridge-btn')) {
    const btn = document.createElement('button');
    btn.id = 'adsentice-bridge-btn';
    btn.innerHTML = '⚡ Push Incremental (6669)';
    btn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      background: #059669;
      color: #ffffff;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      font-family: system-ui, sans-serif;
      font-weight: 600;
      font-size: 13px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
      cursor: pointer;
      transition: all 0.2s ease;
    `;

    btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
    btn.onmouseout = () => btn.style.transform = 'scale(1.0)';
    
    btn.onclick = async () => {
      btn.innerHTML = '⏳ Enviando...';
      btn.style.background = '#d97706';
      
      const snap = {
        action: 'ui_button_click',
        page: window.location.pathname,
        activeElement: document.activeElement ? document.activeElement.tagName : null,
        selectedText: window.getSelection().toString()
      };
      
      await window.pushIncrementalJSON(snap);
      
      btn.innerHTML = '✅ Push OK!';
      btn.style.background = '#10b981';
      setTimeout(() => {
        btn.innerHTML = '⚡ Push Incremental (6669)';
        btn.style.background = '#059669';
      }, 2000);
    };

    document.body.appendChild(btn);
  }

  console.log('%c 🚀 [Adsentice 6669] Bridge Ativado! Use window.pushIncrementalJSON({ ... }) ou clique no botão flutuante.', 'color: #3b82f6; font-weight: bold;');
})();
