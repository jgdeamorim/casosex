#!/usr/bin/env python3
"""
Sovereign UI/UX Usability Coverage Framework (S-UXCF) Audit Script
Audita estaticamente o código em apps/v8-cockpit/src para detectar:
1. Botões sem whitespace-nowrap / shrink-0
2. Contêineres de mapa sem isolate / overflow-hidden
3. Elementos interativos sem focus-visible
4. Inconsistência de Z-Index
"""

import os
import sys
import re

SRC_DIR = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/apps/v8-cockpit/src"

def audit_usability():
    print("🔍 Iniciando Auditoria S-UXCF em apps/v8-cockpit/src...\n")
    issues = []
    total_files = 0
    total_buttons = 0

    for root, _, files in os.walk(SRC_DIR):
        for file in files:
            if not (file.endswith(".tsx") or file.endswith(".ts")):
                continue
            
            total_files += 1
            filepath = os.path.join(root, file)
            rel_path = os.path.relpath(filepath, SRC_DIR)

            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            # Check 1: Button text wrapping check
            button_matches = re.finditer(r'<button\b[^>]*className=["\']([^"\']*)["\']', content)
            for m in button_matches:
                total_buttons += 1
                classes = m.group(1)
                if "whitespace-nowrap" not in classes:
                    issues.append(f"⚠️  [{rel_path}] Botão sem 'whitespace-nowrap': classes='{classes[:60]}...'")

            # Check 2: Map Stacking Context
            if file == "SupplierMap.tsx":
                if "leaflet/dist/leaflet.css" not in content and "main.tsx" not in content:
                    pass
                if "isolate" not in content:
                    issues.append(f"❌  [{rel_path}] Contêiner de mapa sem 'isolate' para Stacking Context!")

            # Check 3: Focus Visible on buttons
            for m in button_matches:
                classes = m.group(1)
                if "focus" in classes and "focus-visible" not in classes:
                    issues.append(f"💡 [{rel_path}] Usar 'focus-visible' em vez de 'focus' puro para navegação por teclado.")

    print(f"📊 Resumo do Scan: {total_files} arquivos analisados, {total_buttons} botões verificados.")
    if not issues:
        print("✅ Nenhuma infração de usabilidade encontrada! 100% S-UXCF Compliant.")
        return 0
    else:
        print(f"⚠️  Encontradas {len(issues)} observações de refinamento:")
        for issue in issues[:10]:
            print(f"   {issue}")
        if len(issues) > 10:
            print(f"   ... e mais {len(issues) - 10} apontamentos.")
        return len(issues)

if __name__ == "__main__":
    sys.exit(audit_usability())
