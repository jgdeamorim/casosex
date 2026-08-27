/**
 * ⚡ ADSENTICE CHATGPT CONSOLE EXTRACTOR & INGESTER (Port 6669)
 * 
 * Instalação:
 * 1. Abra a aba do ChatGPT (chatgpt.com) no seu navegador.
 * 2. Abra o Console do Chrome (F12 -> Console).
 * 3. Cole este código na íntegra e pressione ENTER.
 */
(function() {
  const BRIDGE_URL = 'http://localhost:6669/push';

  window.extractAndPushChatGPT = async function() {
    console.log('🔍 [Adsentice 6669] Extraindo mensagens da conversa ativa...');
    
    // Extrai mensagens da UI do ChatGPT
    const articles = document.querySelectorAll('article');
    const messages = [];

    articles.forEach((art, index) => {
      const isUser = art.querySelector('[data-message-author-role="user"]') || art.innerText.includes('Você disse:');
      const isAssistant = art.querySelector('[data-message-author-role="assistant"]') || !isUser;
      
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
      metadata: {
        url: window.location.href,
        title: document.title,
        message_count: messages.length
      },
      payload: {
        title: document.title,
        messages: messages
      }
    };

    try {
      const res = await fetch(BRIDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log('%c ✅ [Adsentice 6669] Conversa enviada para o Bridge com Sucesso!', 'color: #10b981; font-weight: bold; font-size: 14px;', data);
      alert(`✅ Conversa capturada com sucesso! ${messages.length} mensagens enviadas ao Adsentice Bridge.`);
      return data;
    } catch (err) {
      console.error('❌ [Adsentice 6669] Erro ao enviar conversa:', err);
      alert('❌ Erro ao conectar ao Bridge na porta 6669. Verifique se o servidor está rodando.');
    }
  };

  // Cria o botão flutuante de extração instantânea
  if (!document.getElementById('adsentice-chatgpt-btn')) {
    const btn = document.createElement('button');
    btn.id = 'adsentice-chatgpt-btn';
    btn.innerHTML = '📥 Ingerir Conversa no Adsentice (6669)';
    btn.style.cssText = `
      position: fixed; top: 15px; right: 180px; z-index: 999999;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      color: #ffffff; border: 1px solid rgba(255,255,255,0.2);
      padding: 8px 14px; border-radius: 8px; font-family: system-ui, sans-serif;
      font-weight: 600; font-size: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      cursor: pointer; transition: all 0.2s ease;
    `;
    btn.onclick = () => window.extractAndPushChatGPT();
    document.body.appendChild(btn);
  }

  console.log('%c 🚀 [Adsentice] Script de Ingestão ChatGPT Ativo! Clique no botão no topo ou digite extractAndPushChatGPT()', 'color: #3b82f6; font-weight: bold;');
})();
