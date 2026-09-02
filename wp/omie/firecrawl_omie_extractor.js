import fetch from 'node-fetch';

/**
 * Firecrawl Omie UI Extractor Client
 * Conecta com a instância do Firecrawl e orquestra a raspagem das telas do Omie
 */
async function extractOmiePage(url, pageName) {
  console.log(`[Firecrawl Extractor] Iniciando extração da tela: ${pageName} (${url})...`);

  try {
    const response = await fetch('http://localhost:3002/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown', 'html', 'extract'],
        onlyMainContent: false,
        waitFor: 3000
      })
    });

    if (!response.ok) {
      console.error(`[Firecrawl Extractor] Erro na resposta HTTP: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    console.log(`[Firecrawl Extractor] Sucesso! Conteúdo extraído para ${pageName}.`);
    return data;
  } catch (error) {
    console.error(`[Firecrawl Extractor] Erro ao conectar ao Firecrawl:`, error.message);
    return null;
  }
}

// Teste de conexão local
if (process.argv[1].endsWith('firecrawl_omie_extractor.js')) {
  console.log('[Firecrawl Client] Teste de conectividade com o container do Firecrawl (:3002)...');
}
