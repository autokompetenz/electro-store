// GET /api/img/:file — telecharge l'image depuis le stockage S3 neon et la convertit en JPEG.
// Usage: https://www.electro-domesticos.com/api/img/1789263994024-549391.webp -> image/jpeg
const SHARP_PKG = 'sharp';
const S3_BASE = 'https://br-rapid-silence-aevow0sn.storage.c-2.us-east-2.aws.neon.tech/electro-products/products';

export async function imgConverter(req, res) {
  const file = String(req.params?.file || '');
  const m = /^([\w-]+)\.(webp|jpg|jpeg|png)$/.exec(file);
  if (!m) return res.status(400).type('text').send('bad file');
  try {
    let upstream = await fetch(`${S3_BASE}/${m[1]}.webp`);
    if (!upstream.ok) upstream = await fetch(`${S3_BASE}/${m[1]}.jpg`);
    if (!upstream.ok) return res.status(404).type('text').send('not found');
    const sharp = (await import(SHARP_PKG)).default;
    const buf = Buffer.from(await upstream.arrayBuffer());
    const jpg = await sharp(buf).rotate().resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(jpg);
  } catch (e) {
    res.status(500).type('text').send('img error');
  }
}
