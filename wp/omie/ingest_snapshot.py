#!/usr/bin/env python3
import json
import sys
import os

SNAPSHOT_PATH = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/omie/extracted_ui"

def main():
    print("📥 [INGESTOR DE SNAPSHOT OMIE]")
    print("Cole o JSON do Snapshot (ou pressione Ctrl+D se estiver redirecionando o input):")
    
    try:
        raw_data = sys.stdin.read().strip()
        if not raw_data:
            print("❌ Erro: Nenhum conteúdo recebido.")
            return

        payload = json.loads(raw_data)
        route = payload.get("route", "/root")
        route_clean = route.replace("/", "_")
        
        route_dir = os.path.join(SNAPSHOT_PATH, "routes", route_clean)
        os.makedirs(route_dir, exist_ok=True)
        
        # Salvar snapshot da rota
        snapshot_file = os.path.join(route_dir, "snapshot.json")
        with open(snapshot_file, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)

        # Salvar SVGs
        svgs = payload.get("svgs", [])
        if svgs:
            svg_dir = os.path.join(SNAPSHOT_PATH, "svgs")
            os.makedirs(svg_dir, exist_ok=True)
            for idx, svg in enumerate(svgs):
                svg_content = svg.get("outerHTML", "")
                if svg_content:
                    svg_file = os.path.join(svg_dir, f"icon_{route_clean}_{idx}.svg")
                    with open(svg_file, "w", encoding="utf-8") as sf:
                        sf.write(svg_content)

        print(f"\n🎉 [INGESTÃO COM SUCESSO!]")
        print(f"📍 Rota Ingerida: {route}")
        print(f"📂 Arquivo Gravado: {snapshot_file}")
        print(f"🔗 Links Descobertos: {len(payload.get('links_discovered', []))}")
        print(f"📝 Formulários Mapeados: {len(payload.get('forms_schema', []))}")
        print(f"🖼️ SVGs Gravados: {len(svgs)}")
        
    except json.JSONDecodeError as e:
        print(f"❌ Erro de Sintaxe JSON: {e}")
    except Exception as e:
        print(f"❌ Erro ao ingerir: {e}")

if __name__ == "__main__":
    main()
