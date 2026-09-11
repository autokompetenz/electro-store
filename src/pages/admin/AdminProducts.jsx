import { useEffect, useState } from 'react';
import { CloseIcon, CheckIcon } from '../../components/Icons';
import { productImages } from '../../data/images';
import ProductVisual from '../../components/ProductVisual';
import {
  getAdminCategories, createAdminProduct, updateAdminProduct, deleteAdminProduct,
} from '../../adminApi';

const euro = n => `${Number(n).toFixed(2)} €`;

const BADGES = [
  { value: '', label: 'Aucun' },
  { value: 'new', label: 'Nouveau' },
  { value: 'bestseller', label: 'Best-seller' },
  { value: 'eco', label: 'Éco' },
];

const emptyForm = {
  name: '', slug: '', category: '', price: '', oldPrice: '', badge: '',
  rating: '5', reviews: '0', description: '', featuresText: '', specsText: '',
  stock: '10', brand: '', gtin: '', mpn: '',
};

function decodeProduct(p, set) {
  const specsText = p.specs && typeof p.specs === 'object'
    ? Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join('\n')
    : '';
  set({
    name: p.name, slug: p.slug, category: p.category,
    price: String(p.price), oldPrice: p.oldPrice ? String(p.oldPrice) : '',
    badge: p.badge || '', rating: String(p.rating), reviews: String(p.reviews),
    description: p.description || '',
    featuresText: (p.features || []).join('\n'),
    specsText,
    image: p.image || null,
    images: Array.isArray(p.images) ? p.images.filter(Boolean) : [],
    stock: String(p.stock ?? 10),
    brand: p.brand || '',
    gtin: p.gtin || '',
    mpn: p.mpn || '',
  });
  return { primary: p.image || null, gallery: Array.isArray(p.images) ? p.images.filter(Boolean) : [] };
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [savedMsg, setSavedMsg] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      getAdminCategories(),
      fetch('/api/products').then(r => r.json()),
    ])
      .then(([cats, prods]) => {
        setCategories(cats);
        setProducts(prods);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!savedMsg) return undefined;
    const t = setTimeout(() => setSavedMsg(''), 3000);
    return () => clearTimeout(t);
  }, [savedMsg]);

  useEffect(() => () => newPreviews.forEach(URL.revokeObjectURL), [newPreviews]);

  const set = (patch) => setForm(f => ({ ...f, ...patch }));

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setGallery([]);
    setNewFiles([]);
    setNewPreviews([]);
    setShowForm(true);
  };

  const openEdit = p => {
    setEditing({ id: p.id });
    const { gallery: gal } = decodeProduct(p, set);
    setGallery(gal);
    setNewFiles([]);
    setNewPreviews([]);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setGallery([]);
    setNewFiles([]);
    setNewPreviews([]);
    setShowForm(false);
  };

  const onFiles = e => {
    const files = [...(e.target.files || [])];
    if (!files.length) return;
    const previews = files.map(f => URL.createObjectURL(f));
    setNewFiles(prev => [...prev, ...files]);
    setNewPreviews(prev => [...prev, ...previews]);
    e.target.value = '';
  };

  const moveGallery = (idx, dir) => {
    setGallery(prev => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return next;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const removeExisting = idx => setGallery(prev => prev.filter((_, i) => i !== idx));

  const removeNew = idx => {
    URL.revokeObjectURL(newPreviews[idx]);
    setNewFiles(prev => prev.filter((_, i) => i !== idx));
    setNewPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v != null && v !== 'images') fd.append(k, v);
      });
      fd.append('existingImages', JSON.stringify(gallery));
      for (const f of newFiles) fd.append('images', f);
      if (editing) {
        await updateAdminProduct(editing.id, fd);
      } else {
        await createAdminProduct(fd);
      }
      setSavedMsg(editing ? 'Produit mis à jour.' : 'Produit ajouté.');
      closeForm();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async p => {
    if (!window.confirm(`Supprimer « ${p.name} » ?`)) return;
    try {
      await deleteAdminProduct(p.id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const displayImage = p => (Array.isArray(p.images) && p.images[0]) || p.image || productImages[p.slug];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Produits</h1>
          <p style={{ color: 'var(--bark-3)', fontSize: 13.5 }}>{products.length} produit(s)</p>
        </div>
        <button className="btn-primary" onClick={openNew}>+ Ajouter un produit</button>
      </div>

      {savedMsg && (
        <div style={{
          background: 'var(--olive-bg)', color: 'var(--olive-dark)', borderRadius: 10,
          padding: '10px 14px', fontSize: 13, fontWeight: 600, marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <CheckIcon size={14} /> {savedMsg}
        </div>
      )}

      {(showForm) && (
        <form onSubmit={submit} className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16 }}>{editing ? `Modifier #${editing.id}` : 'Nouveau produit'}</h2>
            <button type="button" onClick={closeForm}
              style={{ border: 'none', background: 'transparent', color: 'var(--bark-3)', cursor: 'pointer' }}>
              <CloseIcon size={18} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr 1fr 1fr', gap: 12 }} className="admin-form-grid">
            <div style={{ gridRow: '1 / span 12', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="admin-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 6 }}>
                {gallery.map((url, i) => (
                  <div key={`ex-${i}`} className="admin-thumb-wrap" style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--sand)' }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="admin-thumb-actions" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, opacity: 0, background: 'rgba(0,0,0,.35)', transition: 'opacity .15s' }}>
                      {i > 0 && <button type="button" onClick={() => moveGallery(i, -1)} className="admin-thumb-btn">←</button>}
                      {i < gallery.length - 1 && <button type="button" onClick={() => moveGallery(i, 1)} className="admin-thumb-btn">→</button>}
                      <button type="button" onClick={() => removeExisting(i)} className="admin-thumb-btn admin-thumb-btn-del">×</button>
                    </div>
                  </div>
                ))}
                {newPreviews.map((url, i) => (
                  <div key={`nw-${i}`} className="admin-thumb-wrap" style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, border: '1.5px dashed var(--olive, #6b8f5e)', overflow: 'hidden', background: 'var(--sand)' }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="admin-thumb-actions" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, background: 'rgba(0,0,0,.35)', transition: 'opacity .15s' }}>
                      <button type="button" onClick={() => removeNew(i)} className="admin-thumb-btn admin-thumb-btn-del">×</button>
                    </div>
                  </div>
                ))}
              </div>
              {gallery.length === 0 && newPreviews.length === 0 && (
                <div style={{ aspectRatio: '1', width: '100%', background: 'var(--sand)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {form.image ? (
                    <img src={form.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ProductVisual category={form.category || 'petit-cuisine'} style={{ width: '70%', height: 'auto' }} />
                  )}
                </div>
              )}
              <label htmlFor="admin-prod-images"
                style={{ border: '1.5px dashed var(--border-2)', borderRadius: 10, padding: '10px', textAlign: 'center', fontSize: 12.5, color: 'var(--bark-2)', cursor: 'pointer', display: 'block' }}>
                + Ajouter des images
              </label>
              <input id="admin-prod-images" type="file" accept="image/*" multiple onChange={onFiles} style={{ display: 'none' }} />
              <style>{`
                .admin-thumb-wrap:hover .admin-thumb-actions { opacity: 1 !important; }
                .admin-thumb-btn { border: none; background: rgba(255,255,255,.85); border-radius: 5px; width: 24px; height: 24px; font-size: 13px; font-weight: 700; cursor: pointer; line-height: 1; color: var(--bark-2); }
                .admin-thumb-btn-del { background: rgba(200,60,60,.85); color: #fff; }
              `}</style>
            </div>

            <AdminField label="Nom *"><input className="input-luxury" style={{ width: '100%' }} value={form.name} onChange={e => set({ name: e.target.value })} required /></AdminField>
            <AdminField label="Catégorie *">
              <select className="input-luxury" style={{ width: '100%' }} value={form.category} onChange={e => set({ category: e.target.value })} required>
                <option value="">— Choisir —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Prix (€) *"><input className="input-luxury" style={{ width: '100%' }} type="number" step="0.01" min="0" value={form.price} onChange={e => set({ price: e.target.value })} required /></AdminField>
            <AdminField label="Prix barré (€)"><input className="input-luxury" style={{ width: '100%' }} type="number" step="0.01" min="0" value={form.oldPrice} onChange={e => set({ oldPrice: e.target.value })} /></AdminField>
            <AdminField label="Badge">
              <select className="input-luxury" style={{ width: '100%' }} value={form.badge} onChange={e => set({ badge: e.target.value })}>
                {BADGES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </AdminField>
            <AdminField label="Note /5">
              <input className="input-luxury" style={{ width: '100%' }} type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => set({ rating: e.target.value })} />
            </AdminField>
            <AdminField label="Nb d'avis">
              <input className="input-luxury" style={{ width: '100%' }} type="number" min="0" value={form.reviews} onChange={e => set({ reviews: e.target.value })} />
            </AdminField>
            <AdminField label="Slug (laisser vide = auto)">
              <input className="input-luxury" style={{ width: '100%' }} value={form.slug} onChange={e => set({ slug: e.target.value })} />
            </AdminField>
            <AdminField label="Stock disponible"><input className="input-luxury" style={{ width: '100%' }} type="number" min="0" value={form.stock} onChange={e => set({ stock: e.target.value })} /></AdminField>
            <AdminField label="Marque (brand)"><input className="input-luxury" style={{ width: '100%' }} value={form.brand} onChange={e => set({ brand: e.target.value })} /></AdminField>
            <AdminField label="GTIN / EAN"><input className="input-luxury" style={{ width: '100%' }} value={form.gtin} onChange={e => set({ gtin: e.target.value })} /></AdminField>
            <AdminField label="MPN (réf. fabricant)"><input className="input-luxury" style={{ width: '100%' }} value={form.mpn} onChange={e => set({ mpn: e.target.value })} /></AdminField>

            <AdminField label="Description" wide>
              <textarea className="input-luxury" rows={3} style={{ width: '100%' }} value={form.description} onChange={e => set({ description: e.target.value })} />
            </AdminField>
            <AdminField label="Points forts (1 par ligne)" wide>
              <textarea className="input-luxury" rows={3} style={{ width: '100%' }} value={form.featuresText} onChange={e => set({ featuresText: e.target.value })} />
            </AdminField>
            <AdminField label="Specs (une par ligne · Format : Libellé: Valeur)" wide>
              <textarea className="input-luxury" rows={3} style={{ width: '100%' }} value={form.specsText} onChange={e => set({ specsText: e.target.value })} />
            </AdminField>
          </div>

          {error && <p style={{ color: 'var(--terracotta)', fontSize: 13, marginTop: 12 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Créer le produit'}
            </button>
            <button type="button" onClick={closeForm}
              style={{ border: '1px solid var(--border-2)', background: 'transparent', borderRadius: 10, padding: '0 18px', fontSize: 13, color: 'var(--bark-2)', cursor: 'pointer' }}>
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: 'var(--bark-3)' }}>Chargement…</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }} className="admin-prods">
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 8px', width: 56 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 10, background: 'var(--sand)',
                    border: '1px solid var(--border)', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                  }}>
                    {displayImage(p) ? (
                      <img src={displayImage(p)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ProductVisual category={p.category} style={{ width: '100%', height: 'auto' }} />
                    )}
                    {Array.isArray(p.images) && p.images.length > 1 && (
                      <span style={{ position: 'absolute', bottom: 2, right: 2, background: 'rgba(0,0,0,.65)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 5, padding: '1px 5px', lineHeight: 1.4 }}>{p.images.length}</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '10px 8px', minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--bark-3)' }}>#{p.id} · {p.slug} · {p.rating}/5 ({p.reviews})</div>
                </td>
                <td style={{ padding: '10px 8px', color: 'var(--bark-2)', whiteSpace: 'nowrap' }}>
                  {p.category}
                  {p.badge && <span className="badge badge-new" style={{ marginLeft: 8 }}>{p.badge}</span>}
                </td>
                <td style={{ padding: '10px 8px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {euro(p.price)}
                  {p.oldPrice && (
                    <span style={{ fontSize: 11.5, color: 'var(--bark-3)', textDecoration: 'line-through', marginLeft: 6 }}>{euro(p.oldPrice)}</span>
                  )}
                </td>
                <td style={{ padding: '10px 8px', whiteSpace: 'nowrap', textAlign: 'right' }}>
                  <button onClick={() => openEdit(p)} className="btn-ghost" style={{ padding: '8px 14px', fontSize: 12 }}>Modifier</button>
                  <button onClick={() => remove(p)} style={{
                    marginLeft: 8, border: 'none', background: 'transparent', color: 'var(--terracotta)',
                    fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <style>{`
        @media (max-width: 900px) {
          .admin-form-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .admin-form-grid { grid-template-columns: 1fr !important; }
          .admin-prods td:nth-child(3), .admin-prods td:nth-child(4) { display: none; }
        }
      `}</style>
    </div>
  );
}

function AdminField({ label, children, wide }) {
  return (
    <div style={{ gridColumn: wide ? '1 / -1' : undefined }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--bark-2)', marginBottom: 5, display: 'block' }}>
        {label}
      </label>
      {children}
    </div>
  );
}