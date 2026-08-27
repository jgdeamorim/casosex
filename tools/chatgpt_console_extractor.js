/**
 * ⚡ ADSENTICE CHATGPT CONSOLE EXTRACTOR (Bypass CSP via Form Submit + Copy Fallback)
 * 
 * Cole no Console do Chrome na aba do ChatGPT (F12 -> Console).
 */
(function() {
  const BRIDGE_URL = 'http://localhost:6669/push';

  window.extractAndPushChatGPT = function() {
    console.log('🔍 [Adsentice 6669] Extraindo mensagens da conversa...');
    const articles = document.querySelectorAll('article');
    const messages = [];

    articles.forEach((art, index) => {
      const isUser = art.querySelector('[data-message-author-role="user"]') || art.innerText.includes('Você disse:');
      const content = art.innerText.replace(/^[0-9]+\s*\/\s*[0-9]+/, '').trim();
      if (content) {
        messages.push({
          index: index + 1,
          role: isUser ? 'user' : 'assistant',
          content: content
        });
      }
    });

    const payload = {
      action: 'chatgpt_conversation_ingest',
      timestamp: new Date().toISOString(),
      metadata: { url: window.location.href, title: document.title, message_count: messages.length },
      payload: { title: document.title, messages: messages }
    };

    // Copia para a área de transferência do DevTools como backup infalível
    if (typeof copy === 'function') {
      copy(JSON.stringify(payload, null, 2));
      console.log('%c 📋 JSON Copiado automaticamente para a Área de Transferência (DevTools copy)', 'color: #3b82f6; font-weight: bold;');
    }

    // Tenta Form Submit via Iframe Oculto (ignora connect-src do CSP)
    try {
      let iframe = document.getElementById('adsentice_bridge_iframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.name = 'adsentice_bridge_iframe';
        iframe.id = 'adsentice_bridge_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = BRIDGE_URL;
      form.target = 'adsentice_bridge_iframe';

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'payload';
      input.value = JSON.stringify(payload);
      form.appendChild(input);

      document.body.appendChild(form);
      form.submit();
      setTimeout(() => form.remove(), 1000);

      console.log('%c ✅ [Adsentice 6669] Conversa enviada via Form Submit (Bypass CSP)!', 'color: #10b981; font-weight: bold; font-size: 14px;');
      alert(`✅ Conversa enviada com sucesso! ${messages.length} mensagens enviadas ao Adsentice.`);
    } catch (e) {
      console.error('❌ Erro no Form Submit:', e);
      alert('⚠️ O envio HTTP falhou, mas o JSON foi COPIADO para a Área de Transferência! Você pode colar no arquivo.');
    }
  };

  if (!document.getElementById('adsentice-chatgpt-btn')) {
    const btn = document.createElement('button');
    btn.id = 'adsentice-chatgpt-btn';
    btn.innerHTML = '📥 Ingerir Conversa no Adsentice (6669)';
    btn.style.cssText = `
      position: fixed; top: 15px; right: 180px; z-index: 999999;
      background: linear-gradient(135deg, #2563eb, #7c3aed); color: #ffffff;
      border: 1px solid rgba(255,255,255,0.2); padding: 8px 14px; border-radius: 8px;
      font-family: system-ui, sans-serif; font-weight: 600; font-size: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3); cursor: pointer; transition: all 0.2s ease;
    `;
    btn.onclick = () => window.extractAndPushChatGPT();
    document.body.appendChild(btn);
  }
})();
