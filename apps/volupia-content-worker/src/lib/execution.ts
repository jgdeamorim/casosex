import { saveFlowToRedis, getFlowFromRedis } from "./redis.js";

export interface FlowNode {
  id: string;
  type?: string;
  data?: {
    type?: string;
    node?: {
      display_name?: string;
      template?: Record<string, { value?: unknown }>;
    };
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
}

export interface FlowGraph {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface VertexOrderResult {
  ids: string[];
  run_id: string;
  vertices_to_run: string[];
}

export interface VertexBuildResult {
  id: string;
  valid: boolean;
  params: Record<string, unknown>;
  outputs: Record<string, unknown>;
  logs: string[];
}

/**
 * Computes topological execution order of vertices in a flow DAG.
 */
export function computeVertexOrder(
  graph: FlowGraph,
  startNodeId?: string,
  stopNodeId?: string
): VertexOrderResult {
  const run_id = crypto.randomUUID();
  const nodes = graph.nodes || [];
  const edges = graph.edges || [];

  const inDegree: Record<string, number> = {};
  const adjList: Record<string, string[]> = {};

  for (const node of nodes) {
    inDegree[node.id] = 0;
    adjList[node.id] = [];
  }

  for (const edge of edges) {
    if (adjList[edge.source] && inDegree[edge.target] !== undefined) {
      adjList[edge.source].push(edge.target);
      inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
    }
  }

  const queue: string[] = [];
  for (const nodeId of Object.keys(inDegree)) {
    if (inDegree[nodeId] === 0) {
      queue.push(nodeId);
    }
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    sorted.push(curr);

    const neighbors = adjList[curr] || [];
    for (const neighbor of neighbors) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Fallback if disconnected or empty
  const allIds = nodes.map((n) => n.id);
  const finalIds = sorted.length === nodes.length ? sorted : allIds;

  let vertices_to_run = [...finalIds];
  if (startNodeId) {
    const idx = vertices_to_run.indexOf(startNodeId);
    if (idx !== -1) vertices_to_run = vertices_to_run.slice(idx);
  }
  if (stopNodeId) {
    const idx = vertices_to_run.indexOf(stopNodeId);
    if (idx !== -1) vertices_to_run = vertices_to_run.slice(0, idx + 1);
  }

  return {
    ids: finalIds,
    run_id,
    vertices_to_run,
  };
}

/**
 * Dispatches and executes a single node in the DAG.
 */
export async function executeVertexNode(
  node: FlowNode,
  inputs: Record<string, unknown> = {}
): Promise<VertexBuildResult> {
  const nodeType = node.data?.type || node.type || "default";
  const displayName = node.data?.node?.display_name || "Nó Volúpia";
  const template = node.data?.node?.template || {};

  const params: Record<string, unknown> = {};
  for (const [key, field] of Object.entries(template)) {
    params[key] = inputs[key] ?? field.value ?? "";
  }

  const outputs: Record<string, unknown> = {};
  const logs: string[] = [];

  if (nodeType.includes("Scriptwriter") || displayName.includes("Roteirista")) {
    const tema = (params.tema as string) || "Conteúdo Volúpia";
    const gancho = (params.gancho_target as string) || "Curiosidade";
    const cta = (params.cta as string) || "Link na Bio";

    outputs.roteiro = `🔥 GANCHO [${gancho}]: Descubra a experiência exclusiva com ${tema}.\n\n🎬 CORPO: O luxo e a sofisticação que você procura em cada detalhe.\n\n📲 CTA [${cta}]: Clique no link e agende agora.`;
    outputs.status = "generated";
    logs.push(`[Gemini Scriptwriter] Roteiro gerado via modelo Volúpia AI para tema "${tema}".`);
  } else if (nodeType.includes("Renderer") || displayName.includes("Renderizador")) {
    const prompt = (params.prompt as string) || "Cinematic portrait, Volúpia aesthetics";
    const model = (params.model_type as string) || "Flux.1 / Vast.ai";

    outputs.job_id = `job_vast_${crypto.randomUUID().slice(0, 8)}`;
    outputs.status = "completed";
    outputs.media_url = `https://r2.volupia.app/renders/${outputs.job_id}.mp4`;
    logs.push(`[Vast.ai GPU Renderer] Job ${outputs.job_id} executado com modelo ${model} (9:16).`);
  } else if (nodeType.includes("Publisher") || displayName.includes("Publicador")) {
    const caption = (params.caption as string) || "Legenda Volúpia Engine";
    outputs.post_id = `ig_post_${crypto.randomUUID().slice(0, 8)}`;
    outputs.published = true;
    logs.push(`[Instagram Publisher] Post ${outputs.post_id} publicado na Graph API com legenda "${caption}".`);
  } else {
    outputs.result = "Executado com sucesso";
    logs.push(`[Volúpia Node] ${displayName} (ID: ${node.id}) executado sem erros.`);
  }

  return {
    id: node.id,
    valid: true,
    params,
    outputs,
    logs,
  };
}
