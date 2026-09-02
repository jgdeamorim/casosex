#!/usr/bin/env python3
import sqlite3
import os

DB_PATH = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/omie/db/omie_sovereign.db"
SCHEMA_PATH = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/omie/db/schema_sovereign.sql"

def seed_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Rodar Schema
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        cursor.executescript(f.read())

    tenant_id = "57997882-gh28f5at"
    app_hash = "57997882-gh28f5at"

    # 1. Workspace
    cursor.execute("INSERT OR REPLACE INTO portal_workspaces (id, tenant_id, app_hash, name, cnpj, active) VALUES (1, ?, ?, ?, ?, 1)",
                   (tenant_id, app_hash, "CASOSEX Distribuidora Eireli", "12.345.678/0001-90"))

    # 2. SFA Clientes
    cursor.executemany("INSERT OR REPLACE INTO sfa_clientes (codigo_cliente_omie, tenant_id, razao_social, cnpj_cpf, email, telefone, etapa) VALUES (?, ?, ?, ?, ?, ?, ?)", [
        (101, tenant_id, "Boutique Amor & Prazer Ltda", "98.765.432/0001-10", "compras@boutiqueamor.com.br", "(31) 98888-1111", "Cliente Ativo"),
        (102, tenant_id, "Sexy Shop Vitoria Eireli", "45.678.912/0001-33", "contato@sexyvitoria.com", "(27) 99999-2222", "Proposta Enviada"),
        (103, tenant_id, "Distribuidora Intima SP", "11.222.333/0001-44", "financeiro@distribuidoraintima.com", "(11) 97777-3333", "Lead Qualificado")
    ])

    # 3. VPR Produtos
    cursor.executemany("INSERT OR REPLACE INTO vpr_produtos (codigo_produto_omie, tenant_id, codigo, descricao, valor_unitario, estoque) VALUES (?, ?, ?, ?, ?, ?)", [
        (201, tenant_id, "PROD-001", "Gel Sensacional Vibrável 15ml", 29.90, 450.0),
        (202, tenant_id, "PROD-002", "Óleo Mágico de Massagem Corporal 100ml", 49.90, 280.0),
        (203, tenant_id, "PROD-003", "Vibrador Silicone Premium Dual Motor", 189.00, 75.0)
    ])

    # 4. VEN Pedidos
    cursor.executemany("INSERT OR REPLACE INTO ven_pedidos (codigo_pedido_omie, tenant_id, numero_pedido, cliente, valor_total, etapa) VALUES (?, ?, ?, ?, ?, ?)", [
        (301, tenant_id, "PED-8801", "Boutique Amor & Prazer Ltda", 2450.00, "Faturado - NF-e 4521"),
        (302, tenant_id, "PED-8802", "Sexy Shop Vitoria Eireli", 1890.00, "Em Aprovacao")
    ])

    # 5. COM Compras
    cursor.executemany("INSERT OR REPLACE INTO com_pedidos (codigo_compras_omie, tenant_id, numero_pedido, fornecedor, valor_total) VALUES (?, ?, ?, ?, ?)", [
        (401, tenant_id, "COMP-101", "Industria Quimica Brasil S/A", 8500.00),
        (402, tenant_id, "COMP-102", "Embalagens & Caixas Flex Eireli", 1200.00)
    ])

    # 6. FIN Títulos
    cursor.executemany("INSERT OR REPLACE INTO fin_titulos (codigo_titulo_omie, tenant_id, tipo, categoria, valor, data_vencimento, status) VALUES (?, ?, ?, ?, ?, ?, ?)", [
        (501, tenant_id, "RECEBER", "Venda de Produtos", 2450.00, "2026-09-15", "Aberto"),
        (502, tenant_id, "PAGAR", "Fornecedores de Materia-Prima", 8500.00, "2026-09-20", "Aberto"),
        (503, tenant_id, "RECEBER", "Venda de Produtos", 1890.00, "2026-09-10", "Liquidado"),
        (504, tenant_id, "PAGAR", "Despesas Operacionais / Logistica", 450.00, "2026-09-05", "Aberto")
    ])

    # 7. CTB DRE
    cursor.execute("INSERT OR REPLACE INTO ctb_dre (id, tenant_id, mes_ano, receita_bruta, custos, lucro_liquido) VALUES (1, ?, '09/2026', 4340.00, 1650.00, 2690.00)", (tenant_id,))

    conn.commit()
    conn.close()
    print(f"🌱 Banco SQLite Soberano semeado com dados em: {DB_PATH}")

if __name__ == "__main__":
    seed_db()
