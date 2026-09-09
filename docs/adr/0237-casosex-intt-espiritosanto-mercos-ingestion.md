# ADR-0237: Integração do Atacadista INTT Espírito Santo via Plataforma Mercos B2B (`meuspedidos.com.br`)

- **Data / Timestamp:** 2026-09-09T08:36:00-03:00
- **Status:** Ratificado (Accepted)
- **Domínio:** Suprimentos / Dropshipping Regional ES / Mercos B2B Engine / CASOSEX

---

## 1. Contexto e Problema

Além do portal matriz da fábrica INTT (`lojaintt.com.br/v2/`), a **CASOSEX** possui um fornecedor atacadista regional representante exclusivo no estado do Espírito Santo:
- **Razão / Nome:** INTT ES (Atacadista Representante Espírito Santo)
- **Portal B2B:** `https://inttespiritosanto.meuspedidos.com.br/entrar`
- **Plataforma Tecnológica:** Mercos B2B Engine (`app.mercos.com`)
- **Account ID:** `229987`
- **Client ID B2B:** `2417652`

A inclusão deste fornecedor regional viabiliza **entregas ultra-rápidas no ES** (Same-Day / Next-Day Delivery em Vitória, Vila Velha, Serra e Cariacica) e redundância de catálogo quando o estoque da matriz estiver indisponível.

---

## 2. Decisão Arquitetural

1. **Protocolo de Autenticação Direta B2B (`app.mercos.com`):**
   - **Endpoint de Login:** `POST https://app.mercos.com/api_b2b/v1/login`
   - **Payload JSON:** `{"email": "contatevolupia@gmail.com", "senha": "...", "subdominio": "inttespiritosanto"}`
   - **Headers Obrigatórios:** `Origin: https://inttespiritosanto.meuspedidos.com.br`, `Referer: https://inttespiritosanto.meuspedidos.com.br/entrar`.
   - **Validação Empírica (`medido=verdade`):** Retorna HTTP 200 com Token de Sessão `Token <hash>` e `account_id: 229987`.

2. **Mapeamento no Redis (`:6396`):**
   - Chave `casosex:suppliers:intt_es` cadastrada com metadados do fornecedor e status `authenticated`.

3. **Duplo Roteamento Regional de Pedidos (Multi-Supplier Routing):**
   - Produtos da INTT ES receberão a tag `_casosex_supplier_id = 70` (INTT ES) versus `69` (INTT Matriz).
   - Pedidos com destino a CEPs do Espírito Santo (`29000-000` a `29999-999`) priorizam a consulta de estoque e despacho no portal `inttespiritosanto.meuspedidos.com.br`.

---

## 3. Consequências

- **Redundância de Estoque:** Fallback automático entre matriz nacional e representante regional ES.
- **Logística Otimizada:** Redução drástica no prazo e custo de frete para clientes locais no ES.
- **Auditabilidade Medida (`medido=verdade`):** Telemetria de autenticação e requisições sincronizada com o Redis `:6396` e Qdrant `casosex-self`.
