// Sync images via Neon HTTP SQL endpoint (port 5432 bloqué localement)
import { readFileSync } from 'node:fs';

const CONN = process.env.DATABASE_URL;
const URL = 'https://ep-still-cherry-aewf9zkz-pooler.c-2.us-east-2.aws.neon.tech/sql';

async function sql(query, params = []) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Neon-Connection-String': CONN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, params }),
  });
  const j = await res.json();
  if (j.message && !j.command) throw new Error(j.message);
  return j;
}

function parseCsv(text) {
  const rows = []; let row = [], cur = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) { if (c === '"') { if (text[i+1] === '"') { cur += '"'; i++; } else inQ = false; } else cur += c; }
    else if (c === '"') inQ = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i+1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; }
    else cur += c;
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  const head = rows.shift();
  return rows.filter(r => r.length === head.length).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

const OLD = 'https://br-rapid-silence-aevow0sn.storage.c-2.us-east-2.aws.neon.tech';
const NEW = 'https://www.electro-domesticos.com';

// 1) remplace toutes les URLs neon.tech dans la DB
const r1 = await sql(
  `UPDATE products SET image = replace(image, $1, $2),
     images = COALESCE((SELECT jsonb_agg(replace(x, $1, $2)) FROM jsonb_array_elements_text(images) x), '[]'::jsonb)
   WHERE image LIKE $3 OR images::text LIKE $3`,
  [OLD, NEW, `%${'br-rapid-silence'}%`],
);
console.log('URLs neon.tech en DB:', r1.rowCount, 'ligne(s) mise(s) a jour');

// 2) met a jour depuis le CSV
const csv = parseCsv(readFileSync(new URL('../produits-electro.csv', import.meta.url), 'utf-8'));
let ok = 0, missing = 0, skipped = 0;
for (const p of csv) {
  let images = [];
  try { images = JSON.parse(p.images || '[]'); } catch { images = []; }
  const image = p.image && /^https?:\/\//.test(p.image) ? p.image : (images[0] || null);
  if (!image) { skipped++; continue; }
  const r = await sql('UPDATE products SET image=$1, images=$2::jsonb WHERE id=$3 OR slug=$4',
    [image, JSON.stringify(images), Number(p.id), p.slug]);
  if (r.rowCount > 0) ok++; else missing++;
}
console.log(`CSV: ${ok} mis a jour, ${missing} absents de la table, ${skipped} sans image (ignores)`);

const c = await sql(`SELECT count(*)::int AS n FROM products WHERE image LIKE '%neon.tech%' OR images::text LIKE '%neon.tech%'`);
console.log('neon.tech restant en DB:', c.rows[0].n);
