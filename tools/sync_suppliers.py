#!/usr/bin/env python3
import json
import os
import sys

# Initial seed data for Volúpia B2B Sexual Wellness & Erotic Product Suppliers (RJ/SP Polo)
SUPPLIERS_SEED = [
    {
        "id": "sup_001",
        "place_id": "ChIJN1t_t_wZmQAR7qX4v6u7W1A",
        "name": "Intt Cosméticos Eróticos & Sensuais",
        "trade_name": "Intt Brand Industry",
        "cnpj": "14.882.341/0001-92",
        "category": "Fabricante",
        "subcategory": "Cosméticos Eróticos & Géis corporais",
        "address": "Rua São Cristóvão, 450 - São Cristóvão",
        "city": "Rio de Janeiro",
        "state": "RJ",
        "zip_code": "20940-000",
        "latitude": -22.8985,
        "longitude": -43.2231,
        "phone": "+55 21 3890-1200",
        "whatsapp": "5521988991100",
        "email": "contato@intt.com.br",
        "website": "https://intt.com.br",
        "gmb_url": "https://maps.google.com/?cid=1234567890",
        "rating": 4.9,
        "reviews_count": 142,
        "status": "HOMOLOGADO"
    },
    {
        "id": "sup_002",
        "place_id": "ChIJd8123_wZmQAR8xY4v6u7W1B",
        "name": "Distribuidora Sexy Fantasy Fluminense",
        "trade_name": "Sexy Fantasy Atacado",
        "cnpj": "23.441.890/0001-15",
        "category": "Distribuidor",
        "subcategory": "Acessórios & Próteses Body-Safe",
        "address": "Rodovia Washington Luiz, 2400 - Parque Duque",
        "city": "Duque de Caxias",
        "state": "RJ",
        "zip_code": "25085-009",
        "latitude": -22.7850,
        "longitude": -43.3120,
        "phone": "+55 21 2671-5500",
        "whatsapp": "5521971234455",
        "email": "atacado@sexyfantasy.com.br",
        "website": "https://sexyfantasy.com.br",
        "gmb_url": "https://maps.google.com/?cid=2345678901",
        "rating": 4.7,
        "reviews_count": 89,
        "status": "HOMOLOGADO"
    },
    {
        "id": "sup_003",
        "place_id": "ChIJa9012_wZmQAR9zZ4v6u7W1C",
        "name": "Feiticeira Cosméticos Eróticos Ltda",
        "trade_name": "Feiticeira Indústria",
        "cnpj": "08.112.567/0001-44",
        "category": "Fabricante",
        "subcategory": "Lubrificantes & Óleos de Massagem",
        "address": "Av. Feliciano Sodré, 180 - Centro",
        "city": "Niterói",
        "state": "RJ",
        "zip_code": "24030-012",
        "latitude": -22.8870,
        "longitude": -43.1250,
        "phone": "+55 21 2719-8800",
        "whatsapp": "5521998877665",
        "email": "b2b@feiticeira.com.br",
        "website": "https://feiticeiracosmeticos.com.br",
        "gmb_url": "https://maps.google.com/?cid=3456789012",
        "rating": 4.8,
        "reviews_count": 67,
        "status": "VISITA_PENDENTE"
    },
    {
        "id": "sup_004",
        "place_id": "ChIJb7890_wZmQAR0aA4v6u7W1D",
        "name": "Soft Love Indústria e Comércio",
        "trade_name": "Soft Love B2B Hub",
        "cnpj": "05.991.332/0001-88",
        "category": "Fabricante",
        "subcategory": "Cosméticos & Acessórios Eróticos",
        "address": "Rua Barão de Mesquita, 600 - Tijuca",
        "city": "Rio de Janeiro",
        "state": "RJ",
        "zip_code": "20540-002",
        "latitude": -22.9230,
        "longitude": -43.2380,
        "phone": "+55 21 2568-9900",
        "whatsapp": "5521987654321",
        "email": "vendas@softlove.com.br",
        "website": "https://softlove.com.br",
        "gmb_url": "https://maps.google.com/?cid=4567890123",
        "rating": 4.6,
        "reviews_count": 112,
        "status": "PROSPECCAO"
    },
    {
        "id": "sup_005",
        "place_id": "ChIJc6789_wZmQAR1bB4v6u7W1E",
        "name": "Lovert Lingerie Sensual Atacado",
        "trade_name": "Lovert Lingerie",
        "cnpj": "31.229.001/0001-77",
        "category": "Atacadista",
        "subcategory": "Lingerie Fina & Moda Íntima B2B",
        "address": "Rua Carolina Machado, 350 - Madureira",
        "city": "Rio de Janeiro",
        "state": "RJ",
        "zip_code": "21351-000",
        "latitude": -22.8710,
        "longitude": -43.3360,
        "phone": "+55 21 3359-4400",
        "whatsapp": "5521995544332",
        "email": "comercial@lovertlingerie.com.br",
        "website": "https://lovertlingerie.com.br",
        "gmb_url": "https://maps.google.com/?cid=5678901234",
        "rating": 4.9,
        "reviews_count": 94,
        "status": "VISITA_PENDENTE"
    }
]

def main():
    target_json = "apps/volupia-dist/suppliers.json"
    os.makedirs(os.path.dirname(target_json), exist_ok=True)
    with open(target_json, "w", encoding="utf-8") as f:
        json.dump(SUPPLIERS_SEED, f, ensure_ascii=False, indent=2)
    print(f"✓ Saved {len(SUPPLIERS_SEED)} suppliers to {target_json}")

if __name__ == "__main__":
    main()
