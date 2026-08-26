import urllib.request
import urllib.parse
import re
import os
import sys

BASE_BACKUP_DIR = '/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/apps/v8-cockpit_atual'

PAGES = {
    'landing': {
        'url': 'https://usevolupia.com.br',
        'dir': os.path.join(BASE_BACKUP_DIR, 'landing'),
        'file': 'index.html'
    },
    'login': {
        'url': 'https://app.usevolupia.com.br/login',
        'dir': os.path.join(BASE_BACKUP_DIR, 'login'),
        'file': 'index.html'
    },
    'admin': {
        'url': 'https://app.usevolupia.com.br/admin',
        'dir': os.path.join(BASE_BACKUP_DIR, 'admin'),
        'file': 'index.html'
    }
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def fetch_url(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as response:
        return response.read()

def download_asset(asset_url, target_path):
    try:
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        content = fetch_url(asset_url)
        with open(target_path, 'wb') as f:
            f.write(content)
        print(f'  [✓] Salvo: {target_path}')
        return content
    except Exception as e:
        print(f'  [✕] Erro ao baixar asset {asset_url}: {e}')
        return None

def process_page(key, info):
    print(f'\n--- Baixando página: {key} ({info["url"]}) ---')
    os.makedirs(info['dir'], exist_ok=True)
    
    html_content = fetch_url(info['url'])
    html_str = html_content.decode('utf-8', errors='ignore')
    
    # Salvar o HTML original
    html_path = os.path.join(info['dir'], info['file'])
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_str)
    print(f'  [✓] HTML principal salvo em: {html_path}')
    
    # Extrair scripts e stylesheets vinculados
    src_assets = re.findall(r'(?:src|href)=["\']([^"\']+\.(?:js|css|json|svg|png|jpg|ico))["\']', html_str)
    
    for asset in set(src_assets):
        if asset.startswith('http://') or asset.startswith('https://'):
            # Ignorar cdn externos genéricos como googleapis se quiser, ou baixar locais se relativo
            if not ('usevolupia.com.br' in asset or asset.startswith('/')):
                continue
            full_url = asset
            rel_path = asset.split('usevolupia.com.br/')[-1]
        else:
            full_url = urllib.parse.urljoin(info['url'], asset)
            rel_path = asset.lstrip('/')
            
        target_path = os.path.join(info['dir'], rel_path)
        download_asset(full_url, target_path)

print('=== Iniciando Backup Soberano da Cloudflare ===')
for key, info in PAGES.items():
    process_page(key, info)
print('\n=== Backup Concluído com Sucesso! ===')
