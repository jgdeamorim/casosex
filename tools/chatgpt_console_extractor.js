/**
 * ⚡ ADSENTICE CHATGPT CONSOLE EXTRACTOR (User-Initiated Popup Bypass)
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

    if (typeof copy === 'function') {
      copy(JSON.stringify(payload, null, 2));
      console.log('%c 📋 JSON Copiado para a Área de Transferência!', 'color: #3b82f6; font-weight: bold;');
    }

    try {
      // Janela iniciada pelo clique do usuário (Chrome não bloqueia)
      const popup = window.open('about:blank', 'adsentice_win', 'width=400,height=300');
      
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = BRIDGE_URL;
      form.target = 'adsentice_win';

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'payload';
      input.value = JSON.stringify(payload);
      form.appendChild(input);

      document.body.appendChild(form);
      form.submit();
      setTimeout(() => form.remove(), 500);

      console.log('%c ✅ [Adsentice 6669] Envio realizado com sucesso!', 'color: #10b981; font-weight: bold; font-size: 14px;');
      alert(`✅ Conversa capturada! ${messages.length} mensagens enviadas ao Adsentice.`);
    } catch (e) {
      console.error('❌ Erro no Form Submit:', e);
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
