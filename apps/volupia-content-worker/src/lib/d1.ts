import fs from "fs";
import path from "path";


const SECRETS_PATH = "/media/jeffer/5aab5a95-8290-d3f7-2e4f-8c27cc2d09a93/CASOSEX/.secrets/.evn.CLOUDFLARE-VOLUPIA";

let cfCredentials: { accountId: string; token: string; dbId: string } | null = null;

function loadCredentials() {
  if (cfCredentials) return cfCredentials;
  try {
    if (!fs.existsSync(SECRETS_PATH)) return null;
    const text = fs.readFileSync(SECRETS_PATH, "utf-8");
    const accMatch = text.match(/Account ID\s*[:=]?\s*([a-f0-9]{32})/i);
    const tokenMatch = text.match(/Bearer\s+([A-Za-z0-9_\-]+)/i) || text.match(/Token\s*[:=]?\s*([A-Za-z0-9_\-]+)/i);
    if (accMatch && tokenMatch) {
      cfCredentials = {
        accountId: accMatch[1],
        token: tokenMatch[1],
        dbId: "a7e5672c-8eb6-4871-a60b-17541e2da457", // volupia-db
      };
      return cfCredentials;
    }
  } catch (e: unknown) {
    void e;
  }
  return null;
}

export async function queryCloudflareD1(sql: string) {
  const creds = loadCredentials();
  if (!creds) return null;
  
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${creds.accountId}/d1/database/${creds.dbId}/query`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { success: boolean; result?: Array<{ results?: Array<Record<string, unknown>> }> };
    if (data.success && data.result && data.result[0]) {
      return data.result[0].results || [];
    }
  } catch (e: unknown) {
    void e;
  }
  return null;
}

// Flow D1 Sync
export async function syncFlowToD1(flow: Record<string, unknown>) {
  const id = (flow.id as string) || crypto.randomUUID();
  const name = (flow.name as string) || "Novo Fluxo Volúpia";
  const desc = (flow.description as string) || "";
  const folder_id = (flow.folder_id as string) || "00000000-0000-0000-0000-000000000001";
  const dataStr = JSON.stringify(flow.data || {});
  const tagsStr = JSON.stringify(flow.tags || []);
  const updatedAt = (flow.updated_at as string) || new Date().toISOString();

  const sql = `INSERT INTO volupia_flows (id, folder_id, name, description, data, is_component, tags, updated_at)
               VALUES ('${id}', '${folder_id}', '${name.replace(/'/g, "''")}', '${desc.replace(/'/g, "''")}', '${dataStr.replace(/'/g, "''")}', ${flow.is_component ? 1 : 0}, '${tagsStr.replace(/'/g, "''")}', '${updatedAt}')
               ON CONFLICT(id) DO UPDATE SET name=excluded.name, description=excluded.description, data=excluded.data, updated_at=excluded.updated_at;`;

  await queryCloudflareD1(sql);
}

export async function deleteFlowFromD1(id: string) {
  const sql = `DELETE FROM volupia_flows WHERE id='${id}';`;
  await queryCloudflareD1(sql);
}

// Project D1 Sync
export async function syncProjectToD1(project: Record<string, unknown>) {
  const id = (project.id as string) || crypto.randomUUID();
  const name = (project.name as string) || "Volúpia Social Engine";
  const desc = (project.description as string) || "";
  const parentId = (project.parent_id as string) || "";
  const compStr = JSON.stringify(project.components || []);
  const updatedAt = (project.updated_at as string) || new Date().toISOString();

  const sql = `INSERT INTO volupia_projects (id, name, description, parent_id, components, created_at, updated_at)
               VALUES ('${id}', '${name.replace(/'/g, "''")}', '${desc.replace(/'/g, "''")}', '${parentId}', '${compStr.replace(/'/g, "''")}', '${updatedAt}', '${updatedAt}')
               ON CONFLICT(id) DO UPDATE SET name=excluded.name, description=excluded.description, components=excluded.components, updated_at=excluded.updated_at;`;

  await queryCloudflareD1(sql);
}

// Variable D1 Sync
export async function syncVariableToD1(variable: Record<string, unknown>) {
  const id = (variable.id as string) || crypto.randomUUID();
  const name = (variable.name as string) || "";
  const val = (variable.value as string) || "";
  const type = (variable.type as string) || "secret";
  const createdAt = new Date().toISOString();

  const sql = `INSERT INTO volupia_variables (id, name, value, type, created_at)
               VALUES ('${id}', '${name.replace(/'/g, "''")}', '${val.replace(/'/g, "''")}', '${type}', '${createdAt}')
               ON CONFLICT(id) DO UPDATE SET value=excluded.value, type=excluded.type;`;

  await queryCloudflareD1(sql);
}

export async function deleteVariableFromD1(id: string) {
  const sql = `DELETE FROM volupia_variables WHERE id='${id}';`;
  await queryCloudflareD1(sql);
}

// Memory D1 Sync
export async function syncMemoryToD1(memory: Record<string, unknown>) {
  const id = (memory.id as string) || crypto.randomUUID();
  const name = (memory.name as string) || "Nova Memória Volúpia";
  const flowId = (memory.flow_id as string) || "";
  const userId = (memory.user_id as string) || "00000000-0000-0000-0000-000000000001";
  const threshold = typeof memory.threshold === "number" ? memory.threshold : 1.0;
  const autoCapture = memory.auto_capture ? 1 : 0;
  const createdAt = (memory.created_at as string) || new Date().toISOString();

  const sql = `INSERT INTO volupia_memories (id, name, flow_id, user_id, threshold, auto_capture, created_at)
               VALUES ('${id}', '${name.replace(/'/g, "''")}', '${flowId}', '${userId}', ${threshold}, ${autoCapture}, '${createdAt}')
               ON CONFLICT(id) DO UPDATE SET name=excluded.name, threshold=excluded.threshold, auto_capture=excluded.auto_capture;`;

  await queryCloudflareD1(sql);
}

export async function deleteMemoryFromD1(id: string) {
  const sql = `DELETE FROM volupia_memories WHERE id='${id}';`;
  await queryCloudflareD1(sql);
}
