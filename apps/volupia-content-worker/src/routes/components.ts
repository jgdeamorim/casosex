import { Hono } from "hono";

export const componentsRouter = new Hono();

componentsRouter.get("/all", (c) => {
  return c.json({
    "Volúpia Social Engine": {
      "Gemini Scriptwriter": {
        name: "Gemini Scriptwriter",
        description:
          "Gera roteiros otimizados (gancho + corpo + CTA) via Gemini Flash / DeepSeek V4.",
        display_name: "Roteirista Volúpia (Gemini)",
        field_order: ["tema", "gancho_target", "cta"],
        template: {
          tema: {
            type: "str",
            required: true,
            value: "Acompanhantes de Luxo VIP",
          },
          gancho_target: {
            type: "str",
            required: false,
            value: "Curiosidade / Mistério",
          },
          cta: {
            type: "str",
            required: false,
            value: "Link na Bio / DM Volúpia",
          },
        },
      },
      "Remote Vast.ai Renderer": {
        name: "Remote Vast.ai Renderer",
        description:
          "Dispara job de geração de imagem/vídeo 9:16 na GPU remota Vast.ai / Fal.ai.",
        display_name: "Renderizador GPU (Vast.ai)",
        field_order: ["prompt", "aspect_ratio", "model_type"],
        template: {
          prompt: {
            type: "str",
            required: true,
            value: "Cinematic portrait, Volúpia aesthetics, 8k",
          },
          aspect_ratio: { type: "str", required: true, value: "9:16" },
          model_type: {
            type: "str",
            required: true,
            value: "Flux.1 / SDXL / Kling O3",
          },
        },
      },
      "Instagram Publisher": {
        name: "Instagram Publisher",
        description:
          "Publica Reels/Posts diretamente na API Graph do Instagram com telemetria OODA.",
        display_name: "Publicador Instagram",
        field_order: ["caption", "scheduled_time"],
        template: {
          caption: {
            type: "str",
            required: true,
            value: "Legenda e hashtags automáticas",
          },
          scheduled_time: {
            type: "str",
            required: false,
            value: "Immediate",
          },
        },
      },
    },
  });
});
