import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { StarIcon, TruckIcon, ShieldIcon, ReturnIcon } from '../components/Icons';
import ProductVisual from '../components/ProductVisual';
import { productImages } from '../data/images';

export default function Product({ product }) {
  const { addItem } = useCart();
  const image = product.image || productImages[product.slug];
  const images = Array.isArray(product.images) && product.images.length
    ? product.images.filter(Boolean)
    : (image ? [image] : []);
  const [activeImg, setActiveImg] = useState(0);
  useEffect(() => { setActiveImg(0); }, [product.id]);
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const savingsPercent = hasDiscount
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  // Sticky mobile add-to-cart bar
  const mainBtnRef = useRef(null);
  const [sticky, setSticky] = useState(false);
  useEffect(() => {
    const el = mainBtnRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      setSticky(!entry.isIntersecting);
    }, { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <main className="section-pad" style={{ paddingBottom: 'clamp(40px, 6vw, 72px)' }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{
            fontSize: 12.5, color: 'var(--bark-3)', marginBottom: 'clamp(24px, 4vw, 40px)',
            display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', fontWeight: 500,
          }}>
            <Link to="/" style={{ color: 'var(--bark-3)', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--terracotta)'}
              onMouseLeave={e => e.target.style.color = 'var(--bark-3)'}
            >Accueil</Link>
            <span style={{ opacity: 0.4 }}>/</span>
            <Link to="/catalogue" style={{ color: 'var(--bark-3)', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--terracotta)'}
              onMouseLeave={e => e.target.style.color = 'var(--bark-3)'}
            >Catalogue</Link>
            <span style={{ opacity: 0.4 }}>/</span>
            <span style={{ color: 'var(--bark)' }}>{product.name}</span>
          </nav>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(28px, 5vw, 56px)', alignItems: 'start',
          }} className="product-detail-grid">

            {/* Image */}
            <div className="card" style={{
              padding: 'clamp(32px, 6vw, 56px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 'clamp(240px, 40vw, 380px)',
              background: 'linear-gradient(170deg, var(--sand) 0%, var(--sand-dark) 100%)',
              border: 'none', position: 'relative',
            }}>
              {product.badge && (
                <span className={`badge ${product.badge === 'eco' ? 'badge-eco' : 'badge-new'}`}
                  style={{ position: 'absolute', top: 16, left: 16 }}>
                  {product.badge === 'new' ? 'Nouveau' : product.badge === 'bestseller' ? '★ Bestseller' : `-${savingsPercent}%`}
                </span>
              )}
              <div style={{ background: 'var(--cream)', borderRadius: 'clamp(18px, 4vw, 28px)', padding: 'clamp(16px, 4vw, 32px)' }}>
                {images.length > 0 ? (
                  <img src={images[activeImg % images.length]} alt={product.name} style={{
                    width: 'clamp(200px, 34vw, 320px)', height: 'clamp(200px, 34vw, 320px)',
                    objectFit: 'cover', display: 'block', borderRadius: 'clamp(12px, 2vw, 16px)',
                    transition: 'opacity .18s ease',
                  }} />
                ) : (
                  <ProductVisual category={product.category} style={{
                    width: 'clamp(200px, 34vw, 320px)', height: 'auto', display: 'block',
                  }} />
                )}
                {images.length > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 'clamp(12px, 2vw, 18px)' }}>
                    <button
                      type="button" aria-label="Image précédente"
                      onClick={() => setActiveImg(a => (a - 1 + images.length) % images.length)}
                      style={{ border: '1px solid var(--border-2)', background: 'transparent', color: 'var(--bark-2)', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontWeight: 700, lineHeight: 1 }}>
                      ‹
                    </button>
                    {images.map((src, i) => (
                      <button
                        key={i} type="button" aria-label={`Image ${i + 1}`}
                        onClick={() => setActiveImg(i)}
                        style={{
                          width: 34, height: 34, padding: 0, border: 'none', cursor: 'pointer', overflow: 'hidden',
                          borderRadius: 8, opacity: activeImg % images.length === i ? 1 : 0.45,
                          outline: activeImg % images.length === i ? '2px solid var(--terracotta)' : 'none',
                          outlineOffset: 1, background: 'var(--sand)', flexShrink: 0,
                        }}>
                        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </button>
                    ))}
                    <button
                      type="button" aria-label="Image suivante"
                      onClick={() => setActiveImg(a => (a + 1) % images.length)}
                      style={{ border: '1px solid var(--border-2)', background: 'transparent', color: 'var(--bark-2)', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontWeight: 700, lineHeight: 1 }}>
                      ›
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div>
              {product.badge && (
                <span className={`badge ${product.badge === 'eco' ? 'badge-eco' : 'badge-new'}`}
                  style={{ marginBottom: 16 }}>
                  {product.badge === 'new' ? 'Nouveau' : product.badge === 'bestseller' ? '★ Bestseller' : `-${savingsPercent}%`}
                </span>
              )}

              <h1 style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', marginBottom: 14, lineHeight: 1.2 }}>
                {product.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 20 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <StarIcon key={n} size={13} filled={n <= Math.floor(product.rating)} />
                ))}
                <span style={{ fontSize: 13, color: 'var(--bark-3)', marginLeft: 4, fontWeight: 500 }}>
                  {product.rating}/5 — {product.reviews} avis
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 'clamp(26px, 4vw, 34px)',
                  fontWeight: 700, color: 'var(--bark)', letterSpacing: '-0.02em',
                }}>
                  {product.price.toFixed(2)} €
                </span>
                {hasDiscount && (
                  <>
                    <span style={{ fontSize: 16, color: 'var(--bark-3)', textDecoration: 'line-through', fontWeight: 500 }}>
                      {product.oldPrice.toFixed(2)} €
                    </span>
                    <span className="badge badge-eco" style={{ marginLeft: 4 }}>-{savingsPercent}%</span>
                  </>
                )}
              </div>

              <p style={{ color: 'var(--bark-2)', lineHeight: 1.75, marginBottom: 24, fontSize: 'clamp(13px, 2vw, 14.5px)' }}>
                {product.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 28 }}>
                {product.features.map((f, i) => (
                  <span key={i} style={{
                    padding: '6px 14px', borderRadius: 100, fontSize: 11.5, fontWeight: 500,
                    background: 'var(--sand)', color: 'var(--bark-2)',
                    border: '1px solid var(--border)',
                  }}>{f}</span>
                ))}
              </div>

              <button
                ref={mainBtnRef}
                className="btn-primary"
                style={{ width: '100%', marginBottom: 16 }}
                onClick={() => addItem(product)}
              >
                Ajouter au panier — {product.price.toFixed(2)} €
              </button>

              <div style={{
                display: 'flex', gap: 'clamp(12px, 2vw, 20px)', fontSize: 12, color: 'var(--bark-3)',
                paddingTop: 4, flexWrap: 'wrap',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <TruckIcon size={14} /> Livraison 2-5j
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ReturnIcon size={14} /> Retour 30j
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ShieldIcon size={14} /> Garantie 3 ans
                </span>
              </div>
            </div>
          </div>

          {/* Specs */}
          <div style={{ marginTop: 'clamp(40px, 7vw, 72px)' }}>
            <div className="section-eyebrow">Détails</div>
            <h2 style={{ fontSize: 20, marginBottom: 24 }}>Caractéristiques</h2>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
              gap: 1, background: 'var(--border)', borderRadius: 14, overflow: 'hidden',
            }}>
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} style={{
                  background: 'var(--cream)', padding: '14px 18px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  gap: 12, transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--sand)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--cream)'}
                >
                  <span style={{ fontSize: 12.5, color: 'var(--bark-3)', fontWeight: 500 }}>{key}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--bark)', textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .product-detail-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          }
        `}</style>
      </main>

      {/* Sticky mobile add-to-cart */}
      <div className="sticky-add" style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 60,
        background: 'rgba(253,251,247,0.94)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border)',
        padding: '10px var(--page-side) calc(10px + env(safe-area-inset-bottom))',
        display: 'flex', alignItems: 'center', gap: 12,
        transform: sticky ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 0.35s var(--ease)',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 18, fontWeight: 700,
            color: 'var(--bark)',
          }}>{product.price.toFixed(2)} €</div>
          <div style={{ fontSize: 11, color: 'var(--bark-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.name}
          </div>
        </div>
        <button className="btn-primary" style={{ marginBottom: 0, flexShrink: 0 }} onClick={() => addItem(product)}>
          Ajouter au panier
        </button>
      </div>

      <style>{`
        @media (min-width: 641px) {
          .sticky-add { display: none !important; }
        }
      `}</style>
    </>
  );
}