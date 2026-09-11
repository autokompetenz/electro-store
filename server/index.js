import express from 'express';
import cors from 'cors';
import './env.js';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { fileURLToPath } from 'node:url';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { categories, products } from '../src/data/products.js';
import { sendOrderStatusEmail, sendAdminOrderNotification } from './mailer.js';

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

// ── Database (Neon / PostgreSQL) ────────────────
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgresql://')) {
  console.error(
    '✗ DATABASE_URL manquante ou invalide.\n',
    '→ Remplis le fichier server/.env avec ta string Neon\n',
    '   DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require',
  );
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const q = (text, params = []) => pool.query(text, params).then(r => r.rows);

// ── Uploads → Neon Object Storage (S3) ───────────
const S3_ENDPOINT = process.env.AWS_ENDPOINT_URL_S3;
const S3_BUCKET = process.env.BUCKET_NAME || 'electro-products';

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const uploadImages = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]);

function uploadedFiles(req) {
  const files = [];
  for (const f of req.files?.image || []) files.push(f);
  for (const f of req.files?.images || []) files.push(f);
  return files;
}

function parseJsonList(raw) {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter(x => typeof x === 'string') : [];
  } catch {
    return String(raw).split(',').map(s => s.trim()).filter(Boolean);
  }
}

function imageUrlFromKey(key) { return `${S3_ENDPOINT}/${S3_BUCKET}/${key}`; }
function keyFromImageUrl(url) {
  if (!url) return null;
  const prefix = `${S3_BUCKET}/`;
  const idx = url.indexOf(prefix);
  return idx >= 0 ? url.slice(idx + prefix.length) : null;
}

async function storeProductImage(buffer) {
  const webp = await sharp(buffer)
    .rotate()
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const key = `products/${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;
  await s3.send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: webp,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return imageUrlFromKey(key);
}

async function deleteStoredImage(imageUrl) {
  const key = keyFromImageUrl(imageUrl);
  if (!key) return;
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
  } catch (err) {
    console.warn('⚠ Image S3 non supprimée :', err.message);
  }
}

let dbReadyPromise = null;
const ensureReady = () => dbReadyPromise || (dbReadyPromise = initDb());
app.use(async (_req, res, next) => {
  try { await ensureReady(); next(); }
  catch (err) { return res.status(500).json({ error: `Erreur d'initialisation : ${err.message}` }); }
});

// ── Auth admin ──────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'electro2026';
const JWT_SECRET = process.env.JWT_SECRET || 'electro-store-dev-secret';
const signToken = payload => jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Non autorisé' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Session expirée' });
  }
}

// ── Schéma ──────────────────────────────────────
async function initDb() {
  await q(`
    CREATE TABLE IF NOT EXISTS categories (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      type        TEXT NOT NULL,
      iconKey     TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY,
      name        TEXT NOT NULL,
      slug        TEXT UNIQUE NOT NULL,
      category    TEXT NOT NULL REFERENCES categories(id),
      price       DOUBLE PRECISION NOT NULL,
      oldPrice    DOUBLE PRECISION,
      badge       TEXT,
      rating      DOUBLE PRECISION NOT NULL,
      reviews     INTEGER NOT NULL,
      features    JSONB NOT NULL,
      description TEXT NOT NULL,
      specs       JSONB NOT NULL,
      image       TEXT,
      images      JSONB DEFAULT '[]'::jsonb,
      stock       INTEGER NOT NULL DEFAULT 10,
      brand       TEXT,
      gtin        TEXT,
      mpn         TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      address    TEXT NOT NULL,
      total      DOUBLE PRECISION NOT NULL,
      savings    DOUBLE PRECISION DEFAULT 0,
      status     TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id         SERIAL PRIMARY KEY,
      order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id),
      qty        INTEGER NOT NULL,
      unit_price DOUBLE PRECISION NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      subject    TEXT NOT NULL,
      message    TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS newsletter (
      id         SERIAL PRIMARY KEY,
      email      TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS bank_settings (
      id      INTEGER PRIMARY KEY CHECK (id = 1),
      iban    TEXT DEFAULT '',
      bic     TEXT DEFAULT '',
      titular TEXT DEFAULT '',
      motif   TEXT DEFAULT 'CMD {num} {nom} {produit}'
    );
  `);

  await q(`INSERT INTO bank_settings (id, iban, bic, titular, motif)
           VALUES (1, '', '', '', 'CMD {num} {nom} {produit}') ON CONFLICT (id) DO NOTHING`);
  await q(`UPDATE bank_settings SET motif = 'CMD {num} {nom} {produit}' WHERE motif = 'Commande {num}'`);
  await q(`ALTER TABLE products ADD COLUMN IF NOT EXISTS image TEXT`);
  await q(`ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb`);
  await q(`UPDATE products SET images = CASE WHEN image IS NOT NULL THEN jsonb_build_array(image) ELSE '[]'::jsonb END WHERE images IS NULL OR images = 'null'::jsonb`);
  await q(`ALTER TABLE products ADD COLUMN IF NOT EXISTS stock  INTEGER NOT NULL DEFAULT 10`);
  await q(`ALTER TABLE products ADD COLUMN IF NOT EXISTS brand  TEXT`);
  await q(`ALTER TABLE products ADD COLUMN IF NOT EXISTS gtin   TEXT`);
  await q(`ALTER TABLE products ADD COLUMN IF NOT EXISTS mpn    TEXT`);

  const [{ n }] = await q('SELECT COUNT(*)::int AS n FROM categories');
  if (!n) {
    for (const c of categories) {
      await q(
        'INSERT INTO categories (id,name,type,iconKey,description) VALUES ($1,$2,$3,$4,$5)',
        [c.id, c.name, c.type, c.iconKey, c.description],
      );
    }
    for (const p of products) {
      await q(
        `INSERT INTO products
           (id,name,slug,category,price,oldPrice,badge,rating,reviews,features,description,specs,stock,brand,gtin,mpn)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12::jsonb,$13,$14,$15,$16)`,
        [p.id, p.name, p.slug, p.category, p.price, p.oldPrice ?? null, p.badge ?? null,
         p.rating, p.reviews, JSON.stringify(p.features), p.description, JSON.stringify(p.specs),
         p.stock ?? 10, p.brand ?? null, p.gtin ?? null, p.mpn ?? null],
      );
    }
    console.log(`✓ Seed: ${categories.length} catégories, ${products.length} produits`);
  }

  for (const p of products) {
    await q(
      `UPDATE products SET
         brand = COALESCE(brand, $1),
         gtin  = COALESCE(gtin, $2),
         mpn   = COALESCE(mpn, $3)
       WHERE id = $4`,
      [p.brand ?? null, p.gtin ?? null, p.mpn ?? null, p.id],
    );
  }
  console.log('✓ Gouvernance produits (brand, GTIN, MPN) synchronisée');
}

// ── Helpers ─────────────────────────────────────
function parseProduct(row) {
  const { oldprice, oldPrice, ...rest } = row;
  const rawImages = row.images;
  let images;
  try {
    images = Array.isArray(rawImages) ? rawImages : JSON.parse(rawImages || '[]');
  } catch {
    images = [];
  }
  if (!Array.isArray(images)) images = [];
  const primary = rest.image || images[0] || null;
  const list = primary && (images.length === 0 || images[0] !== primary)
    ? [primary, ...images.filter(i => i && i !== primary)]
    : images.filter(Boolean);
  return {
    ...rest,
    features: Array.isArray(row.features) ? row.features : JSON.parse(row.features),
    specs: row.specs && typeof row.specs === 'object' ? row.specs : JSON.parse(row.specs),
    oldPrice: oldprice ?? oldPrice ?? undefined,
    badge: row.badge ?? undefined,
    image: primary,
    images: list,
    stock: row.stock ?? 0,
    brand: row.brand ?? null,
    gtin: row.gtin ?? null,
    mpn: row.mpn ?? null,
  };
}

function toFloat(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function toInt(v) { const n = Number(v); return Number.isFinite(n) ? Math.round(n) : 0; }

function normalizeProduct(body, imageUrl, imageUrls = []) {
  const specs = {};
  for (const line of String(body.specsText || '').split('\n')) {
    const idx = line.indexOf(':');
    if (idx > 0) specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  let images = (imageUrls || []).filter(Boolean);
  if (imageUrl && !images.includes(imageUrl)) images = [imageUrl, ...images];
  return {
    name: String(body.name || '').trim(),
    slug: String(body.slug || '').trim(),
    category: body.category,
    price: toFloat(body.price),
    oldPrice: body.oldPrice ? toFloat(body.oldPrice) : null,
    badge: body.badge || null,
    rating: toFloat(body.rating ?? 5),
    reviews: toInt(body.reviews ?? 0),
    features: String(body.featuresText || '').split('\n').map(s => s.trim()).filter(Boolean),
    description: String(body.description || '').trim(),
    specs,
    image: imageUrl || images[0] || null,
    images,
    stock: toInt(body.stock ?? 10),
    brand: String(body.brand || '').trim() || null,
    gtin: String(body.gtin || '').trim() || null,
    mpn: String(body.mpn || '').trim() || null,
  };
}

async function makeSlug(name, excludeId) {
  const base = String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'produit';
  let slug = base;
  let i = 1;
  for (;;) {
    const [existing] = await q('SELECT id FROM products WHERE slug = $1 AND id != $2', [slug, excludeId ?? -1]);
    if (!existing) return slug;
    slug = `${base}-${i++}`;
  }
}

async function getOrderWithItems(id) {
  const [order] = await q(
    `SELECT id, name, email, address, total, savings, status,
            to_char(created_at AT TIME ZONE 'Europe/Paris', 'DD/MM/YYYY à HH24:MI') AS created_at
     FROM orders WHERE id = $1`,
    [id],
  );
  if (!order) return null;
  const items = await q(
    `SELECT oi.product_id AS id, oi.qty, oi.unit_price, p.name, p.slug, p.image
     FROM order_items oi JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1 ORDER BY oi.id`,
    [id],
  );
  return { ...order, items };
}

async function getBankSettings() {
  const [row] = await q('SELECT iban, bic, titular, motif FROM bank_settings WHERE id = 1');
  return row || { iban: '', bic: '', titular: '', motif: '' };
}

function virementSlug(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase();
}

function buildVirementMotif(template, order, items) {
  const client = virementSlug(order?.name) || 'CLIENT';
  const produits = (items || []).map(it => virementSlug(it.name)).join('-').slice(0, 48) || 'PRODUIT';
  return String(template || '')
    .replace(/\{num}/g, String(order?.id ?? ''))
    .replace(/\{nom}/g, client)
    .replace(/\{produit}/g, produits);
}

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'rejected'];

// ── Routes publiques ────────────────────────────

app.get('/api/categories', async (_req, res) => {
  res.json(await q('SELECT * FROM categories ORDER BY type, name'));
});

app.get('/api/products', async (req, res) => {
  const { cat, q: search, sort, badge, limit } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (cat) { sql += ' AND category = $' + (params.length + 1); params.push(cat); }
  if (badge) { sql += ' AND badge = $' + (params.length + 1); params.push(badge); }
  if (search) {
    sql += ' AND (name ILIKE $' + (params.length + 1)
       + ' OR description ILIKE $' + (params.length + 2)
       + ' OR features::text ILIKE $' + (params.length + 3) + ')';
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  if (sort === 'price-asc') sql += ' ORDER BY price ASC';
  else if (sort === 'price-desc') sql += ' ORDER BY price DESC';
  else if (sort === 'rating') sql += ' ORDER BY rating DESC, reviews DESC';
  else sql += ' ORDER BY name ASC';

  if (limit) { sql += ' LIMIT $' + (params.length + 1); params.push(Number(limit)); }

  const rows = await q(sql, params);
  res.json(rows.map(parseProduct));
});

app.get('/api/products/:slug', async (req, res) => {
  const [row] = await q('SELECT * FROM products WHERE slug = $1', [req.params.slug]);
  if (!row) return res.status(404).json({ error: 'Produit introuvable' });
  res.json(parseProduct(row));
});

// ── Flux Google Shopping (Merchant Center) ──────
const APP_URL = (process.env.APP_URL || 'https://www.electro-domesticos.com').replace(/\/+$/, '');
const GOOGLE_CATEGORY = {
  'lave-linge': 'Home Appliances > Major Appliances > Washers',
  'refrigerateur': 'Home Appliances > Major Appliances > Refrigerators',
  'lave-vaisselle': 'Home Appliances > Major Appliances > Dishwashers',
  'four-plaque': 'Home Appliances > Major Appliances > Cooking Appliances',
  'micro-ondes': 'Home Appliances > Major Appliances > Microwave Ovens',
  'aspirateur': 'Home Appliances > Vacuums and Floor Care',
  'petit-cuisine': 'Home Appliances > Kitchen & Dining Appliances > Small Kitchen Appliances',
};

function xmlEscape(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

app.get('/api/feed/products.xml', async (_req, res) => {
  const rows = await q('SELECT * FROM products ORDER BY id');
  const items = rows.map(p => {
    const g = [];
    g.push(`    <g:id>${xmlEscape(p.id)}</g:id>`);
    g.push(`    <g:title>${xmlEscape(p.name)}</g:title>`);
    g.push(`    <g:description>${xmlEscape(p.description)}</g:description>`);
    g.push(`    <g:link>${APP_URL}/produit/${xmlEscape(p.slug)}</g:link>`);
    g.push(`    <g:image_link>${xmlEscape(p.image && /^https?:\/\//.test(p.image) ? p.image : `${APP_URL}/img/products/${p.slug}.jpg`)}</g:image_link>`);
    for (const extra of (p.images || []).slice(1)) {
      if (extra && /^https?:\/\//.test(extra)) g.push(`    <g:additional_image_link>${xmlEscape(extra)}</g:additional_image_link>`);
    }
    g.push(`    <g:availability>${p.stock > 0 ? 'in stock' : 'out of stock'}</g:availability>`);
    g.push(`    <g:price>${Number(p.price).toFixed(2)} EUR</g:price>`);
    g.push(`    <g:condition>new</g:condition>`);
    g.push(`    <g:brand>${xmlEscape(p.brand || 'Electrodomésticos')}</g:brand>`);
    if (p.gtin) g.push(`    <g:gtin>${xmlEscape(p.gtin)}</g:gtin>`);
    if (p.mpn) g.push(`    <g:mpn>${xmlEscape(p.mpn)}</g:mpn>`);
    if (!p.gtin && !p.mpn) g.push('    <g:identifier_exists>false</g:identifier_exists>');
    const cat = GOOGLE_CATEGORY[p.category];
    if (cat) g.push(`    <g:google_product_category>${xmlEscape(cat)}</g:google_product_category>`);
    g.push('    <g:shipping><g:country>ES</g:country><g:service>Standard</g:service><g:price>0.00 EUR</g:price></g:shipping>');
    return `  <item>\n${g.join('\n')}\n  </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>${xmlEscape('Electro Domésticos')}</title>
  <link>${APP_URL}</link>
  <description>${xmlEscape('Électroménager — Lave-linge, réfrigérateurs, lave-vaisselle, fours et petit électroménager.')}</description>
${items.join('\n')}
</channel>
</rss>
`;
  res.type('application/xml').send(xml);
});

app.post('/api/orders', async (req, res) => {
  const { name, email, address, items } = req.body;
  if (!name || !email || !address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Données manquantes' });
  }

  let total = 0;
  let savings = 0;
  const resolved = [];

  for (const it of items) {
    const [p] = await q('SELECT * FROM products WHERE id = $1', [it.id]);
    if (!p) return res.status(400).json({ error: `Produit #${it.id} introuvable` });
    const qty = Number(it.qty) || 1;
    total += p.price * qty;
    const old = p.oldprice ?? p.oldPrice ?? p.price;
    savings += (old - p.price) * qty;
    resolved.push({ id: p.id, price: p.price, qty, name: p.name, slug: p.slug, image: p.image });
  }

  const [order] = await q(
    'INSERT INTO orders (name, email, address, total, savings) VALUES ($1,$2,$3,$4,$5) RETURNING id',
    [name, email, address, Math.round(total * 100) / 100, Math.round(savings * 100) / 100],
  );

  for (const it of resolved) {
    await q(
      'INSERT INTO order_items (order_id, product_id, qty, unit_price) VALUES ($1,$2,$3,$4)',
      [order.id, it.id, it.qty, it.price],
    );
  }

  const totalRounded = Math.round(total * 100) / 100;
  const savingsRounded = Math.round(savings * 100) / 100;
  const bank = await getBankSettings();
  const bankConfigured = !!(bank && bank.iban);
  const bankInfo = bankConfigured
    ? { iban: bank.iban, bic: bank.bic, titular: bank.titular, motif: buildVirementMotif(bank.motif, { id: order.id, name }, resolved) }
    : null;

  try {
    const mail = await sendOrderStatusEmail(
      { id: order.id, name, email, address },
      resolved,
      { total: totalRounded, savings: savingsRounded },
      'received',
      bankInfo,
    );
    if (mail?.simulated) console.log(`✓ Commande ${order.id} créée (email client simulé)`);
    else console.log(`✓ Commande ${order.id} créée, email envoyé à ${email}`);
  } catch (e) {
    console.error('✗ Email client non envoyé:', e.message);
  }

  try {
    const adminMail = await sendAdminOrderNotification(
      { id: order.id, name, email, address, total: totalRounded, savings: savingsRounded },
      resolved,
      { total: totalRounded, savings: savingsRounded },
      bankInfo,
    );
    if (adminMail?.simulated) console.log(`✓ Notification admin simulée (commande ${order.id})`);
    else console.log(`✓ Notification admin envoyée (commande ${order.id})`);
  } catch (e) {
    console.error('✗ Email admin non envoyé:', e.message);
  }

  res.status(201).json({
    id: order.id,
    total: totalRounded,
    savings: savingsRounded,
    bank: bankInfo,
  });
});

// ── Suivi de commande (public) ──────────────────
app.get('/api/orders/search', async (req, res) => {
  const value = (req.query.q || '').trim();
  if (!value) return res.status(400).json({ error: 'Indique un n° de commande ou un email' });

  let order = null;
  if (/^\d+$/.test(value)) {
    order = await getOrderWithItems(Number(value));
  } else {
    const [o] = await q(
      'SELECT id FROM orders WHERE lower(email) = lower($1) ORDER BY id DESC LIMIT 1',
      [value],
    );
    if (o) order = await getOrderWithItems(o.id);
  }
  if (!order) return res.status(404).json({ error: 'Aucune commande trouvée' });
  res.json(order);
});

app.get('/api/orders/:id', async (req, res) => {
  const order = await getOrderWithItems(Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Commande introuvable' });
  res.json(order);
});

app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Email invalide' });
  try {
    await q('INSERT INTO newsletter (email) VALUES ($1)', [email]);
    res.status(201).json({ ok: true });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Déjà inscrit' });
    throw e;
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) return res.status(400).json({ error: 'Champs manquants' });
  await q('INSERT INTO contact_messages (name, email, subject, message) VALUES ($1,$2,$3,$4)',
    [name, email, subject, message]);
  res.status(201).json({ ok: true });
});

// ── Routes admin ────────────────────────────────
app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ token: signToken({ admin: true }) });
  }
  res.status(401).json({ error: 'Mot de passe incorrect' });
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({ username: req.admin.username });
});

app.get('/api/admin/stats', requireAdmin, async (_req, res) => {
  const [
    [orders], [revenue], [productsCount], [categoriesCount],
    [newsletter], [contacts], recentOrders, topProducts, byCategory, daily,
  ] = await Promise.all([
    q('SELECT COUNT(*)::int AS n FROM orders'),
    q('SELECT COALESCE(SUM(total), 0)::float AS revenue FROM orders'),
    q('SELECT COUNT(*)::int AS n FROM products'),
    q('SELECT COUNT(*)::int AS n FROM categories'),
    q('SELECT COUNT(*)::int AS n FROM newsletter'),
    q('SELECT COUNT(*)::int AS n FROM contact_messages'),
    q(`SELECT id, name, email, total, status,
              to_char(created_at AT TIME ZONE 'Europe/Paris', 'DD/MM/YYYY HH24:MI') AS created_at
       FROM orders ORDER BY id DESC LIMIT 8`),
    q(`SELECT p.name, p.slug, SUM(oi.qty)::int AS qty,
              ROUND(SUM(oi.qty * oi.unit_price)::numeric, 2)::float AS revenue
       FROM order_items oi JOIN products p ON p.id = oi.product_id
       GROUP BY p.id, p.name, p.slug ORDER BY qty DESC LIMIT 5`),
    q(`SELECT c.name, ROUND(SUM(oi.qty * oi.unit_price)::numeric, 2)::float AS revenue,
              COUNT(DISTINCT oi.order_id)::int AS orders
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       JOIN categories c ON c.id = p.category
       GROUP BY c.id, c.name ORDER BY revenue DESC`),
    q(`SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day,
              COUNT(*)::int AS orders,
              ROUND(SUM(total)::numeric, 2)::float AS revenue
       FROM orders GROUP BY date_trunc('day', created_at) ORDER BY day DESC LIMIT 14`),
  ]);

  res.json({
    orders: orders.n,
    revenue,
    avgOrder: orders.n ? revenue / orders.n : 0,
    products: productsCount.n,
    categories: categoriesCount.n,
    newsletter: newsletter.n,
    contacts: contacts.n,
    recentOrders,
    topProducts,
    byCategory,
    daily: daily.reverse().map(d => ({ ...d, label: d.day.slice(5) })),
  });
});

app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  const { status, q: search } = req.query;
  let sql = `SELECT o.id, o.name, o.email, o.total, o.savings, o.status,
             (SELECT COUNT(*)::int FROM order_items oi WHERE oi.order_id = o.id) AS items_count,
             to_char(o.created_at AT TIME ZONE 'Europe/Paris', 'DD/MM/YYYY HH24:MI') AS created_at
             FROM orders o WHERE 1=1`;
  const params = [];
  if (status && STATUSES.includes(status)) { sql += ' AND o.status = $' + (params.length + 1); params.push(status); }
  if (search) {
    sql += ' AND (o.id::text = $' + (params.length + 1)
        + ' OR lower(o.email) LIKE $' + (params.length + 2)
        + ' OR lower(o.name) LIKE $' + (params.length + 3) + ')';
    const like = `%${String(search).toLowerCase()}%`;
    params.push(search, like, like);
  }
  sql += ' ORDER BY o.id DESC LIMIT 100';
  res.json(await q(sql, params));
});

app.get('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  const order = await getOrderWithItems(Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Commande introuvable' });
  res.json(order);
});

app.patch('/api/admin/orders/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Statut invalide' });
  const id = Number(req.params.id);
  const rows = await q(
    'UPDATE orders SET status = $1 WHERE id = $2 RETURNING status',
    [status, id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Commande introuvable' });

  if (status !== 'pending') {
    try {
      const order = await getOrderWithItems(id);
      if (order) {
        const mail = await sendOrderStatusEmail(
          order,
          order.items,
          { total: order.total, savings: order.savings },
          status,
        );
        if (mail?.simulated) console.log(`✓ Statut ${status} comm. ${id} (email client simulé)`);
        else console.log(`✓ Statut ${status} comm. ${id}, email envoyé à ${order.email}`);
      }
    } catch (e) {
      console.error(`✗ Email statut ${status} non envoyé (comm. ${id}) :`, e.message);
    }
  }

  res.json({ id, status: rows[0].status });
});

app.get('/api/admin/settings/bank', requireAdmin, async (_req, res) => {
  res.json(await getBankSettings());
});

app.put('/api/admin/settings/bank', requireAdmin, async (req, res) => {
  const { iban = '', bic = '', titular = '', motif = '' } = req.body;
  await q(
    'UPDATE bank_settings SET iban=$1, bic=$2, titular=$3, motif=$4 WHERE id=1',
    [iban, bic, titular, motif],
  );
  res.json({ ok: true });
});

app.post('/api/admin/products', requireAdmin, uploadImages, async (req, res) => {
  const newUrls = [];
  try {
    for (const f of uploadedFiles(req)) newUrls.push(await storeProductImage(f.buffer));
  } catch (err) {
    await Promise.allSettled(newUrls.map(deleteStoredImage));
    return res.status(400).json({ error: `Image invalide : ${err.message}` });
  }
  const p = normalizeProduct(req.body, newUrls[0] || null, newUrls);
  if (!p.name || !p.category || !(p.price >= 0)) {
    await Promise.allSettled(newUrls.map(deleteStoredImage));
    return res.status(400).json({ error: 'Nom, catégorie et prix requis' });
  }
  if (!p.slug) p.slug = await makeSlug(p.name);
  const [{ n: nextId }] = await q('SELECT COALESCE(MAX(id), 0) + 1 AS n FROM products');
  const [row] = await q(
    `INSERT INTO products (id, name, slug, category, price, oldPrice, badge, rating, reviews, features, description, specs, image, images, stock, brand, gtin, mpn)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12::jsonb,$13,$14::jsonb,$15,$16,$17,$18)
     RETURNING *`,
    [nextId, p.name, p.slug, p.category, p.price, p.oldPrice, p.badge, p.rating, p.reviews,
     JSON.stringify(p.features), p.description, JSON.stringify(p.specs), p.image,
     JSON.stringify(p.images), p.stock, p.brand, p.gtin, p.mpn],
  );
  res.status(201).json(parseProduct(row));
});

app.put('/api/admin/products/:id', requireAdmin, uploadImages, async (req, res) => {
  const id = Number(req.params.id);
  const prevRows = await q('SELECT image, images FROM products WHERE id = $1', [id]);
  const prev = prevRows[0];
  if (!prev) return res.status(404).json({ error: 'Produit introuvable' });
  let prevImages = [];
  try {
    prevImages = Array.isArray(prev.images) ? prev.images : JSON.parse(prev.images || '[]');
  } catch { /* ignore */ }
  if (!Array.isArray(prevImages)) prevImages = [];
  if (prev.image && !prevImages.includes(prev.image)) prevImages.unshift(prev.image);

  const existing = parseJsonList(req.body.existingImages);
  const newUrls = [];
  try {
    for (const f of uploadedFiles(req)) newUrls.push(await storeProductImage(f.buffer));
  } catch (err) {
    await Promise.allSettled(newUrls.map(deleteStoredImage));
    return res.status(400).json({ error: `Image invalide : ${err.message}` });
  }
  const final = [...existing.filter(Boolean), ...newUrls];
  const primary = final[0] || null;

  const p = normalizeProduct(req.body, primary, final);
  if (!p.name || !p.category || !(p.price >= 0)) {
    await Promise.allSettled(newUrls.map(deleteStoredImage));
    return res.status(400).json({ error: 'Nom, catégorie et prix requis' });
  }
  if (!p.slug) p.slug = await makeSlug(p.name, id);

  const orphaned = prevImages.filter(u => !final.includes(u));
  if (orphaned.length) await Promise.allSettled(orphaned.map(deleteStoredImage));

  const rows = await q(
    `UPDATE products SET name=$1, slug=$2, category=$3, price=$4, oldPrice=$5, badge=$6,
            rating=$7, reviews=$8, features=$9::jsonb, description=$10, specs=$11::jsonb, image=$12,
            images=$18::jsonb, stock=$14, brand=$15, gtin=$16, mpn=$17
     WHERE id=$13 RETURNING *`,
    [p.name, p.slug, p.category, p.price, p.oldPrice, p.badge, p.rating, p.reviews,
     JSON.stringify(p.features), p.description, JSON.stringify(p.specs), p.image, id,
     p.stock, p.brand, p.gtin, p.mpn, JSON.stringify(p.images)],
  );
  if (!rows[0]) {
    await Promise.allSettled(newUrls.map(deleteStoredImage));
    return res.status(404).json({ error: 'Produit introuvable' });
  }
  res.json(parseProduct(rows[0]));
});

app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const [{ n }] = await q('SELECT COUNT(*)::int AS n FROM order_items WHERE product_id = $1', [id]);
  if (n > 0) {
    return res.status(400).json({ error: `Impossible : produit référencé dans ${n} commande(s)` });
  }
  const [prev] = await q('SELECT image, images FROM products WHERE id = $1', [id]);
  const rows = await q('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
  if (!rows[0]) return res.status(404).json({ error: 'Produit introuvable' });
  let imgs = [];
  try {
    imgs = Array.isArray(prev?.images) ? prev.images : JSON.parse(prev?.images || '[]');
  } catch { /* ignore */ }
  if (!Array.isArray(imgs)) imgs = [];
  if (prev?.image && !imgs.includes(prev.image)) imgs.unshift(prev.image);
  await Promise.allSettled(imgs.map(deleteStoredImage));
  res.json({ ok: true });
});

// ── Start (local) / Export (Vercel) ─────────────
const norm = p => String(p || '').toLowerCase().replace(/\\/g, '/');
const isDirectRun = !!process.argv[1] && norm(fileURLToPath(import.meta.url)) === norm(process.argv[1]);

if (isDirectRun) {
  ensureReady()
    .then(() => app.listen(PORT, () => console.log(`✓ API sur http://localhost:${PORT}`)))
    .catch(err => {
      console.error('✗ Échec initialisation DB :', err.message);
      process.exit(1);
    });
}

export default app;