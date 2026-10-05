import csv, json, os, ssl, urllib.request

CONN = os.environ['DATABASE_URL']
URL = 'https://ep-still-cherry-aewf9zkz-pooler.c-2.us-east-2.aws.neon.tech/sql'

def sql(query, params=None):
    body = {'query': query}
    if params is not None: body['params'] = params
    req = urllib.request.Request(URL, data=json.dumps(body).encode(),
        headers={'Neon-Connection-String': CONN, 'Content-Type': 'application/json'})
    r = json.loads(urllib.request.urlopen(req, timeout=60).read())
    return r

OLD = 'br-rapid-silence-aevow0sn.storage.c-2.us-east-2.aws.neon.tech'
r = sql("""UPDATE products SET image = replace(image, $1, $2),
  images = COALESCE((SELECT jsonb_agg(replace(x, $1, $2)) FROM jsonb_array_elements_text(images) x), '[]'::jsonb)
  WHERE image LIKE $3 OR images::text LIKE $3""",
  ['https://' + OLD, 'https://www.electro-domesticos.com', '%' + OLD + '%'])
print('URLs neon.tech corrigees en DB:', r.get('rowCount'))

with open('produits-electro.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))
ok = missing = skipped = 0
for p in rows:
    try: images = json.loads(p['images'] or '[]')
    except Exception: images = []
    image = p['image'] if p['image'].startswith('http') else (images[0] if images else None)
    if not image: skipped += 1; continue
    r = sql("UPDATE products SET image=$1, images=$2::jsonb WHERE id=$3 OR slug=$4",
            [image, json.dumps(images), int(p['id']), p['slug']])
    if r.get('rowCount', 0) > 0: ok += 1
    else: missing += 1
print(f'CSV: {ok} maj, {missing} absents, {skipped} ignores')

r = sql("SELECT count(*)::int AS n FROM products WHERE image LIKE '%neon.tech%' OR images::text LIKE '%neon.tech%'")
print('neon.tech restant:', r['rows'][0]['n'])
