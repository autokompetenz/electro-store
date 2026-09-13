import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartIcon, CloseIcon } from './Icons';
import { useFavorites } from '../context/FavoritesContext';
import { productImages } from '../data/images';
import { lockBodyScroll, unlockBodyScroll } from '../utils/bodyLock';

export default function FavoritesDrawer() {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-favorites', handler);
    return () => window.removeEventListener('open-favorites', handler);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    if (open) lockBodyScroll();
    else unlockBodyScroll();
    return () => {
      window.removeEventListener('keydown', onKey);
      if (open) unlockBodyScroll();
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 63, background: 'rgba(27,27,28,0.35)',
          WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)',
          animation: 'favFadeIn 0.25s ease both',
        }}
        onClick={() => setOpen(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tus favoritos"
        style={{
          position: 'fixed', zIndex: 64,
          bottom: 0, right: 0,
          width: 'min(420px, 100vw)',
          height: 'min(560px, 85vh)',
          display: 'flex', flexDirection: 'column',
          background: 'var(--cream)',
          border: '1px solid var(--border-2)',
          borderBottom: 'none',
          borderTopLeftRadius: 18, borderTopRightRadius: 18,
          boxShadow: '0 -12px 48px rgba(27,27,28,0.18)',
          animation: 'favDrawerUp 0.32s var(--ease) both',
          overflow: 'hidden', fontFamily: 'var(--font)',
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 18px', borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: 'var(--terracotta-bg)', color: 'var(--terracotta)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <HeartIcon size={16} filled />
            </span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--bark)' }}>Tus favoritos</div>
              <div style={{ fontSize: 11.5, color: 'var(--bark-3)' }}>
                {favorites.length === 0 ? 'Ninguno por ahora' : `${favorites.length} electrodoméstico${favorites.length > 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar favoritos"
            style={{
              width: 38, height: 38, borderRadius: 10, cursor: 'pointer',
              border: '1px solid var(--border)', background: 'var(--sand)',
              color: 'var(--bark-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <CloseIcon size={15} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0', scrollbarWidth: 'thin' }}>
          {favorites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px',
                background: 'var(--sand)', border: '1px solid var(--border-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--bark-3)',
              }}>
                <HeartIcon size={26} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--bark)', marginBottom: 6 }}>
                Aún no tienes favoritos
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--bark-3)', marginBottom: 20, lineHeight: 1.6 }}>
                Toca el corazón en un producto para encontrarlo aquí.
              </div>
              <Link to="/catalogue" className="btn-primary" style={{ fontSize: 12.5 }}
                onClick={() => setOpen(false)}>
                Ver el catálogo
              </Link>
            </div>
          ) : (
            favorites.map(p => {
              const image = p.image || productImages[p.slug];
              return (
                <div key={p.id} style={{
                  display: 'flex', gap: 12, alignItems: 'center',
                  padding: '12px 18px', borderBottom: '1px solid var(--border)',
                }}>
                  <Link to={`/produit/${p.slug}`} onClick={() => setOpen(false)} style={{ flexShrink: 0 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 10, overflow: 'hidden',
                      background: 'var(--sand)', border: '1px solid var(--border)',
                    }}>
                      {image && <img src={image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                    </div>
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/produit/${p.slug}`} onClick={() => setOpen(false)}
                      style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: 'var(--bark)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{p.name}</div>
                    </Link>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--bark)', marginTop: 3 }}>
                      {p.price.toFixed(2)} €
                      {p.oldPrice && <s style={{ marginLeft: 6, fontSize: 11, color: 'var(--bark-3)', fontWeight: 400 }}>{p.oldPrice.toFixed(2)} €</s>}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(p)}
                    aria-label="Quitar de favoritos"
                    style={{
                      width: 36, height: 36, borderRadius: 9, flexShrink: 0, cursor: 'pointer',
                      border: '1px solid #f0d4cd', background: '#fdf3f1', color: '#c4453a',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <HeartIcon size={16} filled />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {favorites.length > 0 && (
          <div style={{
            borderTop: '1px solid var(--border)',
            padding: '14px 18px 16px', background: 'var(--sand-light)',
            display: 'flex', gap: 10,
          }}>
            <Link to="/catalogue" className="btn-primary" style={{ flex: 1, textAlign: 'center', fontSize: 13 }}
              onClick={() => setOpen(false)}>
              Ver los productos
            </Link>
            <button
              onClick={clearFavorites}
              style={{
                padding: '0 16px', borderRadius: 10, cursor: 'pointer',
                border: '1px solid var(--border-2)', background: 'transparent',
                fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)', fontFamily: 'var(--font)',
              }}
            >Vaciar todo</button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes favDrawerUp {
          from { transform: translateY(40px); opacity: 0.4; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes favFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
}