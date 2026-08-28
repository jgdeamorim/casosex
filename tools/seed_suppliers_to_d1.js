const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const suppliersPath = path.join(__dirname, '../apps/cockpit/public/suppliers.json');
if (!fs.existsSync(suppliersPath)) {
  console.error('public/suppliers.json não encontrado para seeding.');
  process.exit(1);
}

const suppliers = JSON.parse(fs.readFileSync(suppliersPath, 'utf8'));

// 1. Criar tabela suppliers
const createTableSql = `
CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  place_id TEXT,
  name TEXT NOT NULL,
  trade_name TEXT,
  cnpj TEXT,
  category TEXT,
  subcategory TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude REAL,
  longitude REAL,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  gmb_url TEXT,
  rating REAL,
  reviews_count INTEGER,
  status TEXT DEFAULT 'VISITA_PENDENTE'
);
`;

console.log('Criando tabela suppliers no D1 remoto...');
const createCmd = `npx wrangler d1 execute volupia-db --remote --config apps/cockpit/wrangler.toml --command "${createTableSql.replace(/\n/g, ' ')}"`;
execSync(createCmd, { stdio: 'inherit' });

// 2. Batch insert em chunks de 50 para não estourar limite do SQL
const chunkSize = 50;
for (let i = 0; i < suppliers.length; i += chunkSize) {
  const chunk = suppliers.slice(i, i + chunkSize);
  const values = chunk.map(s => {
    const esc = (val) => val === undefined || val === null ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`;
    const num = (val) => val === undefined || val === null || isNaN(val) ? 'NULL' : Number(val);
    return `(${esc(s.id)}, ${esc(s.place_id)}, ${esc(s.name)}, ${esc(s.trade_name)}, ${esc(s.cnpj)}, ${esc(s.category)}, ${esc(s.subcategory)}, ${esc(s.address)}, ${esc(s.city)}, ${esc(s.state)}, ${esc(s.zip_code)}, ${num(s.latitude)}, ${num(s.longitude)}, ${esc(s.phone)}, ${esc(s.whatsapp)}, ${esc(s.email)}, ${esc(s.website)}, ${esc(s.gmb_url)}, ${num(s.rating)}, ${num(s.reviews_count)}, ${esc(s.status || 'VISITA_PENDENTE')})`;
  }).join(',\n');

  const insertSql = `INSERT OR REPLACE INTO suppliers (id, place_id, name, trade_name, cnpj, category, subcategory, address, city, state, zip_code, latitude, longitude, phone, whatsapp, email, website, gmb_url, rating, reviews_count, status) VALUES ${values};`;
  
  const tmpFile = path.join(__dirname, `../tmp_seed_${i}.sql`);
  fs.writeFileSync(tmpFile, insertSql);

  console.log(`Inserindo lote ${i / chunkSize + 1} (${chunk.length} fornecedores)...`);
  try {
    execSync(`npx wrangler d1 execute volupia-db --remote --config apps/cockpit/wrangler.toml --file "${tmpFile}"`, { stdio: 'inherit' });
  } finally {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }
}

console.log('Seeding concluído com sucesso!');
