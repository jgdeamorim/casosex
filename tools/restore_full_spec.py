import subprocess
import shutil
import os

# 1. Checkout/extract the rich 1258-line version from commit 0a2a3c6f
target_file_official = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/Brand-oficial/volupia-brand-identity-spec.html"
target_file_spec = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/brand-spec/volupia-brand-identity-spec.html"

cmd = ["git", "show", "0a2a3c6f:docs/Brand-oficial/volupia-brand-identity-spec.html"]
result = subprocess.run(cmd, capture_output=True, text=True, cwd="/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX")

if result.returncode == 0:
    with open(target_file_official, "w") as f:
        f.write(result.stdout)
    with open(target_file_spec, "w") as f:
        f.write(result.stdout)
    print(f"Restaurada a versão completa de 1258 linhas de 0a2a3c6f com sucesso!")
else:
    print(f"Erro ao obter commit: {result.stderr}")

# 2. Run patch_all_html_svgs.py to apply perfect SVG centered geometry
subprocess.run(["python3", "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/tools/patch_all_html_svgs.py"])
