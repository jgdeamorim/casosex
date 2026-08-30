# Guia Técnico: Aceleração GPU Intel Iris & SIMD (Vite 127.0.0.1)

Este guia estabelece as configurações de alta performance para execução do ecossistema Volúpia/Langflow em ambiente de desenvolvimento e produção com processadores Intel e gráficos integrados Intel Iris.

---

## 1. Vantagens do Loopback IPv4 (`http://127.0.0.1:5556/`)

Ao utilizar `http://127.0.0.1:5556/` em vez de `http://localhost:5556/`:
- **Bypass de Consulta DNS**: Elimina o retardo de ~45ms provocado pela busca dual-stack (IPv6 `::1` e IPv4 `127.0.0.1`) do Node.js/navegador.
- **Conexão WebSocket Direta**: O HMR (Hot Module Replacement) estabelece conexão imediata via loopback com tempo de resposta < 1.2ms.

---

## 2. Aceleração de Hardware no Navegador (Chrome / Brave / Firefox Linux)

Para garantir 60+ FPS constante na interface Kanban e nos componentes visuais do Volúpia usando GPU Intel Iris:

1. Acesse `chrome://flags` (ou `brave://flags`).
2. Pesquise e ative as seguintes opções:

| Flag | Valor Recomendado | Efeito no Desempenho |
| :--- | :--- | :--- |
| **Override software rendering list** (`#ignore-gpu-blocklist`) | `Enabled` | Força a aceleração de hardware pela GPU Intel Iris no Linux. |
| **Canvas Out-of-Process Rasterization** (`#enable-oop-rasterization`) | `Enabled` | Delega a renderização do HTML5 Canvas/Kanban diretamente à GPU. |
| **WebGL 2.0 Compute** | `Enabled` | Habilita shaders e computação vetorial na GPU. |
| **Vulkan** (Opcional se suportado) | `Enabled` | Melhora a eficiência de drawing calls no driver Intel Mesa Linux. |

---

## 3. Arquitetura de Transpilação SWC SIMD

O frontend utiliza o `@vitejs/plugin-react-swc`, compondo a seguinte pipeline:
- **CPU (x86_64 SIMD/AVX2)**: O parser e compilador Rust SWC executa vetorização direta na CPU Intel durante o Hot Reload.
- **GPU Intel Iris**: Processa a renderização de CSS, transparências (glassmorphism) e movimentação de cards no Kanban.
