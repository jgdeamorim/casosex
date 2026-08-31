import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'volupia_dev_store.json');

export interface DevStoreData {
  posts: Record<string, Record<string, unknown>>;
  brandDna: Record<string, Record<string, unknown>>;
  characters: Record<string, Record<string, unknown>>;
  assets: Record<string, Record<string, unknown>>;
  events: Record<string, unknown>[];
  metrics: Record<string, Record<string, unknown>>;
}

const initialData: DevStoreData = {
  posts: {},
  brandDna: {},
  characters: {},
  assets: {},
  events: [],
  metrics: {},
};

export class DevStore {
  private static data: DevStoreData = { ...initialData };

  public static init(): DevStoreData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(STORE_FILE)) {
        const content = fs.readFileSync(STORE_FILE, 'utf-8');
        DevStore.data = JSON.parse(content);
        console.log(`💾 Local DevStore loaded from ${STORE_FILE}`);
      } else {
        DevStore.save();
        console.log(`💾 Local DevStore initialized at ${STORE_FILE}`);
      }
    } catch (e: unknown) {
      void e;
      console.warn('⚠️ Failed to load Local DevStore, using memory fallback.');
    }
    return DevStore.data;
  }

  public static get(): DevStoreData {
    return DevStore.data;
  }

  public static save(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_FILE, JSON.stringify(DevStore.data, null, 2), 'utf-8');
    } catch (e: unknown) {
      void e;
      console.warn('⚠️ Failed to save Local DevStore to disk.');
    }
  }
}
