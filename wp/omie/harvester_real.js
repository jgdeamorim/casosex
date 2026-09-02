#!/usr/bin/env node
/**
 * Omie Sovereign Visual & Payload Harvester
 * Conecta via Bridge Militar (:6661) para extrair os payloads REAIS e mapear o DOM/Assets
 */

import fs from 'fs';
import path from 'path';

const BRIDGE_URL = 'http://localhost:6661';
const OUT_DIR = '/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/omie/extracted';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function harvestEndpoints() {
  console.log('🚀 [HARVESTER] Iniciando colheita de dados REAIS do Omie via Bridge :6661...');

  const endpoints = [
    { name: 'empresas', path: '/api/v1/geral/empresas/', call: 'ListarEmpresas', param: { pagina: 1, registros_por_pagina: 10 } },
    { name: 'clientes', path: '/api/v1/geral/clientes/', call: 'ListarClientes', param: { pagina: 1, registros_por_pagina: 10 } },
    { name: 'pedidos', path: '/api/v1/produtos/pedido/', call: 'ListarPedidos', param: { pagina: 1, registros_por_pagina: 10 } },
    { name: 'produtos', path: '/api/v1/geral/produtos/', call: 'ListarProdutos', param: { pagina: 1, registros_por_pagina: 10 } }
  ];

  for (const ep of endpoints) {
    try {
      console.log(`📡 [HARVESTER] Colhendo ${ep.name}...`);
      const res = await fetch(`${BRIDGE_URL}${ep.path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call: ep.call,
          param: [ep.param]
        })
      });

      const data = await res.json();
      const filePath = path.join(OUT_DIR, `${ep.name}_real_payload.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`  ✅ ${ep.name} salvo com sucesso em: ${filePath}`);
    } catch (err) {
      console.error(`  ❌ Erro em ${ep.name}:`, err.message);
    }
  }

  console.log('\n✨ Colheita de payloads reais concluída com sucesso sob medido=verdade!');
}

harvestEndpoints();
