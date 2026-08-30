import { Hono } from "hono";

export const componentsRouter = new Hono();

function enrichComponentTemplates<T extends Record<string, any>>(categories: T): T {
  for (const categoryKey of Object.keys(categories)) {
    const category = categories[categoryKey];
    if (category && typeof category === "object") {
      for (const compKey of Object.keys(category)) {
        const comp = category[compKey];
        if (comp && typeof comp === "object" && comp.template && typeof comp.template === "object") {
          for (const fieldKey of Object.keys(comp.template)) {
            const field = comp.template[fieldKey];
            if (field && typeof field === "object") {
              if (field.show === undefined) field.show = true;
              if (field.advanced === undefined) field.advanced = false;
            }
          }
        }
      }
    }
  }
  return categories;
}

componentsRouter.get("/all", (c) => {
  return c.json(
    enrichComponentTemplates({
      inputs: {
        ChatInput: {
          name: "ChatInput",
          description: "Entrada de texto interativa para bate-papo e comandos.",
          display_name: "Entrada de Chat",
          field_order: ["input_value"],
          template: {
            input_value: {
              type: "str",
              required: true,
              value: "",
              multiline: true,
              show: true,
              advanced: false,
            },
          },
        },
        TextInput: {
          name: "TextInput",
          description: "Entrada de texto simples ou multilinha.",
          display_name: "Entrada de Texto",
          field_order: ["value"],
          template: {
            value: { type: "str", required: true, value: "", show: true, advanced: false },
          },
        },
      },
      outputs: {
        ChatOutput: {
          name: "ChatOutput",
          description: "Saída de resposta formatada para o chat do usuário.",
          display_name: "Saída de Chat",
          field_order: ["text"],
          template: {
            text: { type: "str", required: true, value: "", show: true, advanced: false },
          },
        },
        TextOutput: {
          name: "TextOutput",
          description: "Saída de texto bruto ou markdown.",
          display_name: "Saída de Texto",
          field_order: ["text"],
          template: {
            text: { type: "str", required: true, value: "", show: true, advanced: false },
          },
        },
        "Instagram Publisher": {
          name: "Instagram Publisher",
          description:
            "Publica Reels/Posts diretamente na API Graph do Instagram com telemetria OODA.",
          display_name: "Publicador Instagram (Volúpia)",
          field_order: ["caption", "scheduled_time"],
          template: {
            caption: {
              type: "str",
              required: true,
              value: "Legenda e hashtags automáticas",
              show: true,
              advanced: false,
            },
            scheduled_time: {
              type: "str",
              required: false,
              value: "Immediate",
              show: true,
              advanced: false,
            },
          },
        },
      },
      prompts: {
        PromptTemplate: {
          name: "PromptTemplate",
          description: "Cria prompts dinâmicos substituindo variáveis em chaves {var}.",
          display_name: "Template de Prompt",
          field_order: ["template"],
          template: {
            template: {
              type: "str",
              required: true,
              value: "Crie um post sobre {tema} com estilo {estilo}.",
              multiline: true,
              show: true,
              advanced: false,
            },
          },
        },
      },
      models: {
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
              show: true,
              advanced: false,
            },
            gancho_target: {
              type: "str",
              required: false,
              value: "Curiosidade / Mistério",
              show: true,
              advanced: false,
            },
            cta: {
              type: "str",
              required: false,
              value: "Link na Bio / DM Volúpia",
              show: true,
              advanced: false,
            },
          },
        },
        DeepSeekModel: {
          name: "DeepSeekModel",
          description: "Modelo DeepSeek V4 para raciocínio e geração de código/copy.",
          display_name: "DeepSeek V4 Árbitro",
          field_order: ["api_key", "model_name", "temperature"],
          template: {
            model_name: { type: "str", required: true, value: "deepseek-chat", show: true, advanced: false },
            temperature: { type: "float", required: false, value: 0.7, show: true, advanced: false },
          },
        },
      },
      helpers: {
        CombineText: {
          name: "CombineText",
          description: "Concatena múltiplos textos usando um separador configurável.",
          display_name: "Combinar Textos",
          field_order: ["text1", "text2", "delimiter"],
          template: {
            text1: { type: "str", required: true, value: "", show: true, advanced: false },
            text2: { type: "str", required: true, value: "", show: true, advanced: false },
            delimiter: { type: "str", required: false, value: "\n\n", show: true, advanced: false },
          },
        },
        ParseData: {
          name: "ParseData",
          description: "Extrai e converte campos JSON/Data em texto puro.",
          display_name: "Processar Dados",
          field_order: ["data"],
          template: {
            data: { type: "str", required: true, value: "{}", show: true, advanced: false },
          },
        },
      },
      logic: {
        IfElse: {
          name: "IfElse",
          description: "Roteia o fluxo condicionalmente com base no valor de entrada.",
          display_name: "Se / Senão (Condicional)",
          field_order: ["condition"],
          template: {
            condition: { type: "bool", required: true, value: true, show: true, advanced: false },
          },
        },
      },
      vectorstores: {
        QdrantStore: {
          name: "QdrantStore",
          description: "Busca vetorial de embeddings no Qdrant :6352.",
          display_name: "Vetores Qdrant (Adsentice)",
          field_order: ["collection_name"],
          template: {
            collection_name: { type: "str", required: true, value: "volupia-self", show: true, advanced: false },
          },
        },
      },
      processing: {
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
              show: true,
              advanced: false,
            },
            aspect_ratio: { type: "str", required: true, value: "9:16", show: true, advanced: false },
            model_type: {
              type: "str",
              required: true,
              value: "Flux.1 / SDXL / Kling O3",
              show: true,
              advanced: false,
            },
          },
        },
      },
      saved_components: {
        "Volúpia Social Engine": {
          name: "Volúpia Social Engine",
          description: "Estúdio de Conteúdo Mestre Volúpia",
          display_name: "Volúpia Social Engine",
          field_order: [],
          template: {},
        },
      },
      custom_component: {
        CustomComponent: {
          name: "CustomComponent",
          description: "Componente Customizado Volúpia",
          display_name: "Componente Customizado",
          field_order: ["code"],
          template: {
            code: {
              type: "code",
              required: true,
              value: "",
              show: true,
              advanced: false,
            },
          },
        },
      },
    })
  );
});

// Custom component code validation endpoint
componentsRouter.post("/custom_component", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as {
    code?: string;
    frontend_node?: Record<string, unknown>;
  };

  const nodeName =
    (body.frontend_node?.name as string) || "CustomComponent";
  const displayName =
    (body.frontend_node?.display_name as string) || "Componente Customizado Volúpia";

  return c.json({
    data: {
      name: nodeName,
      display_name: displayName,
      description: "Componente Customizado Volúpia Ativo",
      field_order: ["code"],
      template: {
        code: {
          type: "code",
          required: true,
          value: body.code || "",
          show: true,
          advanced: false,
        },
      },
    },
  });
});

componentsRouter.post("/custom_component/update", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  return c.json({ status: "updated", data: body });
});
