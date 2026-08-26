#!/usr/bin/env python3
"""
Sovereign Ultra-Meta Synthesizer: Mercado Pago Mobile AppShell
1. Parses Android XML Vector drawables and synthesizes Web SVG path tokens.
2. Catalogs WebP / PNG graphical assets by density, size, and category.
3. Cross-references layout XMLs for component route trees, user action triggers, and state controllers.
4. Outputs comprehensive YAML metadata in docs/spec/mobile-app-first/.
"""

import os
import json
import re
import glob
import xml.etree.ElementTree as ET
from pathlib import Path

RES_DIR = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/adsentice/self-iinspirations/com.mercadopago.wallet_2.449.0-1816181509_4arch_7dpi_4feat_6f8d1808e3179e8ff153d9ad52410688_apkmirror.com/decompiled_apktool/res"
OUT_DIR = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/docs/spec/mobile-app-first"

def parse_vector_drawable(filepath):
    try:
        tree = ET.parse(filepath)
        root = tree.getroot()
        tag = root.tag.lower()
        if "vector" in tag:
            viewport_w = root.attrib.get("{http://schemas.android.com/apk/res/android}viewportWidth", "24")
            viewport_h = root.attrib.get("{http://schemas.android.com/apk/res/android}viewportHeight", "24")
            width = root.attrib.get("{http://schemas.android.com/apk/res/android}width", "24dp")
            height = root.attrib.get("{http://schemas.android.com/apk/res/android}height", "24dp")
            
            paths = []
            for child in root.iter():
                if "path" in child.tag.lower():
                    d = child.attrib.get("{http://schemas.android.com/apk/res/android}pathData")
                    fill = child.attrib.get("{http://schemas.android.com/apk/res/android}fillColor", "currentColor")
                    if d:
                        paths.append({"d": d, "fill": fill})
            
            return {
                "name": os.path.basename(filepath),
                "viewport": f"0 0 {viewport_w} {viewport_h}",
                "dimensions": f"{width} x {height}",
                "paths_count": len(paths),
                "svg_sample": f'<svg viewBox="0 0 {viewport_w} {viewport_h}">' + "".join([f'<path d="{p["d"]}" fill="currentColor" />' for p in paths[:2]]) + '</svg>'
            }
    except Exception:
        pass
    return None

def scan_assets(res_dir):
    vector_drawables = []
    webp_assets = []
    png_assets = []
    
    for root_dir, dirs, files in os.walk(res_dir):
        folder_name = os.path.basename(root_dir)
        if "drawable" in folder_name or "mipmap" in folder_name:
            for f in files:
                fpath = os.path.join(root_dir, f)
                ext = f.split(".")[-1].lower()
                if ext == "xml":
                    vd = parse_vector_drawable(fpath)
                    if vd:
                        vector_drawables.append(vd)
                elif ext == "webp":
                    webp_assets.append({
                        "name": f,
                        "folder": folder_name,
                        "size_bytes": os.path.getsize(fpath)
                    })
                elif ext == "png":
                    png_assets.append({
                        "name": f,
                        "folder": folder_name,
                        "size_bytes": os.path.getsize(fpath)
                    })
    return vector_drawables, webp_assets, png_assets

def scan_component_routes_and_actions(res_dir):
    layout_dir = os.path.join(res_dir, "layout")
    components_meta = []
    user_actions = set()
    
    if os.path.exists(layout_dir):
        for f in os.listdir(layout_dir):
            if f.endswith(".xml"):
                fpath = os.path.join(layout_dir, f)
                try:
                    tree = ET.parse(fpath)
                    root = tree.getroot()
                    
                    root_widget = root.tag.split(".")[-1]
                    widget_nodes = set()
                    interactive_nodes = []
                    
                    for elem in root.iter():
                        wname = elem.tag.split(".")[-1]
                        widget_nodes.add(wname)
                        
                        # Detect user action triggers & handlers
                        onclick = elem.attrib.get("{http://schemas.android.com/apk/res/android}onClick")
                        if onclick:
                            user_actions.add(onclick)
                            interactive_nodes.append({"widget": wname, "action": "onClick", "handler": onclick})
                        
                        if any(k in wname.lower() for k in ["button", "card", "switch", "tab", "dock", "chip", "fab", "seek"]):
                            interactive_nodes.append({"widget": wname, "action": "touch/click"})
                            
                    components_meta.append({
                        "layout_file": f,
                        "root_widget": root_widget,
                        "total_widgets": len(list(root.iter())),
                        "widgets_types": list(widget_nodes)[:10],
                        "interactive_elements_count": len(interactive_nodes)
                    })
                except Exception:
                    pass
    return components_meta, list(user_actions)

def main():
    print("⚡ Executing Ultra-Meta Synthesizer on Mercado Pago APK...")
    os.makedirs(OUT_DIR, exist_ok=True)
    
    vectors, webps, pngs = scan_assets(RES_DIR)
    components_meta, user_actions = scan_component_routes_and_actions(RES_DIR)
    
    print(f"🎨 Extracted Assets: {len(vectors)} SVG Vector Drawables, {len(webps)} WebP Assets, {len(pngs)} PNG Assets.")
    print(f"📱 Extracted Component Routes: {len(components_meta)} Layout Route Trees, {len(user_actions)} User Action Triggers.")
    
    # 1. Assets Catalog YAML
    assets_yaml = f"""# Graphical Assets & SVG Vector Tokens Catalog
metadata:
  title: Mercado Pago Assets & Vector Path Catalog
  generated_at: 2026-08-26
  target: CASOSEX Volúpia Cockpit V8 (mode:mobile-app-first)

summary_stats:
  svg_vector_drawables_count: {len(vectors)}
  webp_raster_assets_count: {len(webps)}
  png_raster_assets_count: {len(pngs)}

svg_vector_tokens_sample:
{[f"  - name: '{v['name']}'\n    dimensions: '{v['dimensions']}'\n    paths_count: {v['paths_count']}\n    svg_sample: '{v['svg_sample']}'" for v in vectors[:15]]}

webp_assets_sample:
{[f"  - name: '{w['name']}'\n    folder: '{w['folder']}'\n    size_bytes: {w['size_bytes']}" for w in webps[:15]]}
"""
    with open(os.path.join(OUT_DIR, "assets-catalog.yaml"), "w", encoding="utf-8") as fp:
        fp.write(assets_yaml + "\n")
        
    # 2. Component Routes & Metadata YAML
    routes_yaml = f"""# Component Route Trees & End-to-End Execution Metadata
metadata:
  title: Mobile AppShell Component Routes & Action Metadata
  total_layout_routes: {len(components_meta)}
  total_action_triggers: {len(user_actions)}

component_hierarchies:
  app_shell_root:
    type: "CoordinatorLayout + DrawerLayout"
    top_bar: "AppBarLayout (48px Top Actions Bar)"
    content_area: "ViewPager2 / RecyclerView Carousel Snap"
    bottom_dock: "BottomGlassDock (64px, blur 16px)"
    drawer_layer: "BottomSheetBehavior (radius 24px)"

interactive_user_action_triggers:
{json.dumps(user_actions[:30], indent=2)}

layout_routes_metadata_sample:
{json.dumps(components_meta[:20], indent=2)}
"""
    with open(os.path.join(OUT_DIR, "component-routes-metadata.yaml"), "w", encoding="utf-8") as fp:
        fp.write(routes_yaml + "\n")
        
    # 3. Interactive States & Actions YAML
    states_yaml = f"""# Interactive States & User Actions Matrix
metadata:
  title: User Action Triggers & Touch State Transitions
  target: React 19 / Tailwind v4 Mobile AppShell

touch_states:
  default: "opacity-100 scale-100"
  hover_desktop: "hover:opacity-90 transition-opacity duration-150"
  active_pressed: "active:scale-95 active:opacity-80 transition-transform duration-100"
  focus_accessible: "focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
  disabled: "opacity-50 cursor-not-allowed pointer-events-none"

gesture_actions:
  tap: "Triggers immediate state update or navigation sheet"
  swipe_horizontal: "Scrolls carousels with snap-x mandatory alignment"
  swipe_vertical: "Expands/Collapses BottomSheet modal sheet"
  long_press: "Triggers quick context menu or detail preview"
  privacy_toggle_tap: "Toggles sensitivity mode (hides/shows financial KPIs)"
"""
    with open(os.path.join(OUT_DIR, "interactive-states-actions.yaml"), "w", encoding="utf-8") as fp:
        fp.write(states_yaml + "\n")

    # Update Index YAML
    index_yaml_path = os.path.join(OUT_DIR, "index.yaml")
    if os.path.exists(index_yaml_path):
        with open(index_yaml_path, "r", encoding="utf-8") as fp:
            content = fp.read()
        
        content += f"""
ultra_meta_synthesis:
  svg_vector_drawables: {len(vectors)}
  webp_assets: {len(webps)}
  png_assets: {len(pngs)}
  layout_routes_count: {len(components_meta)}
  user_action_triggers: {len(user_actions)}
  artifacts_generated:
    - "assets-catalog.yaml"
    - "component-routes-metadata.yaml"
    - "interactive-states-actions.yaml"
"""
        with open(index_yaml_path, "w", encoding="utf-8") as fp:
            fp.write(content)

    print("✅ Ultra-Meta Synthesis complete! All asset and route metadata artifacts written.")

if __name__ == "__main__":
    main()
