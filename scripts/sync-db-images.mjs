// Synchronise image / images depuis produits-electro.csv vers la table products (Neon).
// Usage: DATABASE_URL=postgresql://... node scripts/sync-db-images.mjs
import { readFileSync } from 'node:fs';
import pg from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL manquante');
  process.exit(1);
}

// mini-parse CSV (gere les guillemets doubles)
function parseCsv(text) {
  const rows = [];
  let row = [], cur = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; }
        else inQ = false;
      } else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cur); rows.push(row); row = []; cur = '';
    } else cur += c;
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  const head = rows.shift();
  return rows.filter(r => r.length === head.length).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

// 1) recalcul toutes les URLs neon.tech -> www.electro-domesticos.com en DB
const pool = new pg.Pool({ connectionString: DATABASE_URL });
const N = 'br-rapid-silence-aevow0sn.storage.c-2.us-east-2.aws.neon.tech';
await pool.query(
  `UPDATE products SET image = replace(image, $1, 'https://www.electro-domesticos.com'),
     images = to_jsonb(array(select replace(x, $1, 'https://www.electro-domesticos.com') from jsonb_array_elements_text(images) x))
   WHERE image LIKE $2 OR images::text LIKE $2`,
  [`https://${N}`, `%${N}%`],
);
console.log('URLs neon.tech remplacees en DB');

// 2) met a jour image/images depuis le CSV (uniquement quand le CSV a des images)
const csv = parseCsv(readFileSync(new URL('../produits-electro.csv', import.meta.url), 'utf-8'));
const pool2 = pool;
let ok = 0, missing = 0, skipped = 0;
for (const p of csv) {
  let images = [];
  try { images = JSON.parse(p.images || '[]'); } catch { images = []; }
  const image = p.image && /^https?:\/\//.test(p.image) ? p.image : (images[0] || null);
  if (!image) { skipped++; continue; }
  const r = await pool2.query(
    'UPDATE products SET image = $1, images = $2::jsonb WHERE id = $3 OR slug = $4',
    [image, JSON.stringify(images), Number(p.id), p.slug],
  );
  if (r.rowCount > 0) ok++; else missing++;
}
console.log(`OK: ${ok} mis a jour, ${missing} absents de la table, ${skipped} sans image dans le CSV (DB conservee)`);
await pool.end();
