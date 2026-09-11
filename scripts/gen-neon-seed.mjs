import { categories, products } from '../src/data/products.js';
import { writeFileSync } from 'node:fs';

const esc = (s) => String(s ?? '').replace(/'/g, "''");
const num = (v) => (v == null ? 'NULL' : String(v));
const jb = (o) => "'" + esc(JSON.stringify(o)) + "'::jsonb";

let out = '-- Electrodomesticos - seed Neon (categories + produits)\n';
out += 'CREATE TABLE IF NOT EXISTS categories (\n';
out += '  id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL,\n';
out += '  iconKey TEXT NOT NULL, description TEXT NOT NULL\n';
out += ');\n\n';
out += 'CREATE TABLE IF NOT EXISTS products (\n';
out += '  id INTEGER PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,\n';
out += '  category TEXT NOT NULL REFERENCES categories(id),\n';
out += '  price DOUBLE PRECISION NOT NULL, oldPrice DOUBLE PRECISION, badge TEXT,\n';
out += '  rating DOUBLE PRECISION NOT NULL, reviews INTEGER NOT NULL,\n';
out += '  features JSONB NOT NULL, description TEXT NOT NULL, specs JSONB NOT NULL,\n';
out += '  image TEXT, images JSONB DEFAULT \'[]\'::jsonb, stock INTEGER NOT NULL DEFAULT 10,\n';
out += '  brand TEXT, gtin TEXT, mpn TEXT\n';
out += ');\n\n';

out += '-- Categories\n';
for (const c of categories) {
  out += `INSERT INTO categories (id,name,type,iconKey,description) VALUES ('${esc(c.id)}','${esc(c.name)}','${esc(c.type)}','${esc(c.iconKey)}','${esc(c.description)}') ON CONFLICT (id) DO NOTHING;\n`;
}
out += '\n-- Produits (GTIN EAN-13 ES captures, stock, marque, MPN)\n';
out += 'INSERT INTO products (id,name,slug,category,price,oldPrice,badge,rating,reviews,features,description,specs,image,images,stock,brand,gtin,mpn) VALUES\n';
const rows = products.map((p) =>
  `  (${p.id},'${esc(p.name)}','${esc(p.slug)}','${esc(p.category)}',${p.price},${num(p.oldPrice)},${p.badge ? `'${esc(p.badge)}'` : 'NULL'},${p.rating},${p.reviews},${jb(p.features)},'${esc(p.description)}',${jb(p.specs)},NULL,'[]'::jsonb,${p.stock},${p.brand ? `'${esc(p.brand)}'` : 'NULL'},${p.gtin ? `'${esc(p.gtin)}'` : 'NULL'},${p.mpn ? `'${esc(p.mpn)}'` : 'NULL'})`,
);
out += rows.join(',\n') + '\nON CONFLICT (id) DO UPDATE SET\n';
out += '  name = EXCLUDED.name, slug = EXCLUDED.slug, category = EXCLUDED.category,\n';
out += '  price = EXCLUDED.price, oldPrice = EXCLUDED.oldPrice, badge = EXCLUDED.badge,\n';
out += '  rating = EXCLUDED.rating, reviews = EXCLUDED.reviews, features = EXCLUDED.features,\n';
out += '  description = EXCLUDED.description, specs = EXCLUDED.specs, image = EXCLUDED.image,\n';
out += '  images = EXCLUDED.images, stock = EXCLUDED.stock,\n';
out += '  brand = EXCLUDED.brand, gtin = EXCLUDED.gtin, mpn = EXCLUDED.mpn;\n';

writeFileSync(new URL('../server/neon-seed.sql', import.meta.url), out, 'utf8');
console.log('OK - ' + rows.length + ' produits, ' + categories.length + ' categories -> server/neon-seed.sql');