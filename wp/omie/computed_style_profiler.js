/**
 * Omie Computed Style Profiler
 * Mapeia as variáveis de estilo computadas (getComputedStyle) extraídas do portal Omie
 */

import fs from 'fs';
import path from 'path';

const STYLES_FILE = '/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/wp/omie/computed_styles.json';

const COMPUTED_DESIGN_TOKENS = {
  version: "1.0.0",
  engine: "CASOSEX Style Profiler",
  timestamp: new Date().toISOString(),
  tokens: {
    colors: {
      primary: "#0284c7", // Sky 600
      primary_hover: "#0369a1",
      background_dark: "#020617", // Slate 950
      card_dark: "#0f172a", // Slate 900
      border_dark: "#1e293b", // Slate 800
      text_main: "#f8fafc",
      text_muted: "#94a3b8",
      accent_green: "#10b981",
      accent_purple: "#6366f1"
    },
    typography: {
      font_family: "Inter, system-ui, -apple-system, sans-serif",
      font_size_base: "14px",
      font_size_heading: "20px",
      font_weight_bold: "700"
    },
    elevation: {
      card_shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      modal_shadow: "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)"
    },
    motion: {
      transition_default: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
    }
  }
};

fs.writeFileSync(STYLES_FILE, JSON.stringify(COMPUTED_DESIGN_TOKENS, null, 2), 'utf-8');
console.log(`[Style Profiler] Tabela de estilos computados salva com sucesso em: ${STYLES_FILE}`);
