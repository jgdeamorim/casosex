#!/usr/bin/env python3
import os
import json
import re
import sys

def get_gtk_clipboard():
    try:
        import gi
        gi.require_version('Gtk', '3.0')
        from gi.repository import Gtk, Gdk
        clipboard = Gtk.Clipboard.get(Gdk.SELECTION_CLIPBOARD)
        text = clipboard.wait_for_text()
        return text or ""
    except Exception as e:
        print(f"⚠️ Erro ao ler GTK Clipboard: {e}")
        return ""

def process_and_ingest(raw_text):
    if not raw_text:
        print("❌ Clipboard vazio.")
        return False

    out_dir = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/omie/extracted_ui"
    os.makedirs(out_dir, exist_ok=True)

    # Tenta extrair JSON válido do texto
    json_payload = None
    try:
        json_payload = json.loads(raw_text)
    except Exception:
        # Se não for JSON direto, procura por bloco JSON dentro de texto de console log
        match = re.search(r'\{[\s\S]*"route"[\s\S]*\}', raw_text)
        if match:
            try:
                json_payload = json.loads(match.group(0))
            except Exception as ex:
                print(f"⚠️ Erro ao decodificar JSON extraído: {ex}")

    if not json_payload or not isinstance(json_payload, dict):
        print("ℹ️ O texto do Clipboard não contém um snapshot JSON formatado.")
        return False

    route = json_payload.get("route", "/root")
    route_clean = route.replace("/", "_").strip("_") or "root"
    route_dir = os.path.join(out_dir, "routes", f"_{route_clean}")
    os.makedirs(route_dir, exist_ok=True)

    snapshot_file = os.path.join(route_dir, "snapshot.json")
    with open(snapshot_file, "w", encoding="utf-8") as f:
        json.dump(json_payload, f, indent=2, ensure_ascii=False)

    # Extrair SVGs
    svgs = json_payload.get("svgs", [])
    if svgs:
        svg_dir = os.path.join(out_dir, "svgs")
        os.makedirs(svg_dir, exist_ok=True)
        for idx, svg in enumerate(svgs):
            svg_content = svg.get("outerHTML", "")
            if svg_content:
                svg_file = os.path.join(svg_dir, f"icon_{route_clean}_{idx}.svg")
                with open(svg_file, "w", encoding="utf-8") as sf:
                    sf.write(svg_content)

    print(f"🎉 [INGESTÃO SOBERANA AUTOMÁTICA VIA GTK CLIPBOARD]")
    print(f"📍 Rota Mapeada: {route}")
    print(f"💾 Snapshot Gravado em: {snapshot_file}")
    print(f"🔗 Links Descobertos: {len(json_payload.get('links_discovered', []))}")
    print(f"📝 Formulários Identificados: {len(json_payload.get('forms_schema', []))}")
    print(f"🎨 Estilos Computados: {len(json_payload.get('computed_styles', []))}")
    print(f"🖼️ SVGs Extraídos: {len(svgs)}")
    return True

if __name__ == "__main__":
    text = get_gtk_clipboard()
    process_and_ingest(text)
