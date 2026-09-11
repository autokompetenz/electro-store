import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartIcon, CloseIcon } from './Icons';
import { useCart } from '../context/CartContext';
import { productImages } from '../data/images';
import { lockBodyScroll, unlockBodyScroll } from '../utils/bodyLock';

export default function FloatingCart() {
  const { items, removeItem, updateQty, totalPrice, totalSavings, totalItems } = useCart();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [hiddenReasons, setHiddenReasons] = useState(new Set());
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches);

  const onPanierPage = location.pathname === '/panier';
  const onProductPage = location.pathname.startsWith('/produit/');

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-floating-cart', handler);
    return () => window.removeEventListener('open-floating-cart', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const reason = e.detail?.reason;
      if (!reason) return;
      setHiddenReasons(prev => {
        const next = new Set(prev);
        if (e.detail.open) next.add(reason);
        else next.delete(reason);
        return next;
      });
    };
    window.addEventListener('fab-visibility', handler);
    return () => window.removeEventListener('fab-visibility', handler);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const onChange = (ev) => setIsMobile(ev.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
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

  const fabHidden = onPanierPage
    || hiddenReasons.size > 0
    || (isMobile && onProductPage);

  if (onPanierPage && !open) return null;

  return (
    <div style={{ position: 'fixed', right: 'clamp(14px, 3vw, 24px)', bottom: 'clamp(14px, 3vw, 24px)', zIndex: 60, fontFamily: 'var(--font)' }}>
      {/* Panel */}
      {open && (
        <>
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 58, background: 'rgba(27,27,28,0.35)',
              WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)',
              animation: 'fadeInOverlay 0.25s ease both',
            }}
            onClick={() => setOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Votre panier"
            style={{
              position: 'fixed', zIndex: 59,
              bottom: 0, right: 0,
              width: 'min(420px, 100vw)',
              height: 'min(560px, 85vh)',
              display: 'flex', flexDirection: 'column',
              background: 'var(--cream)',
              border: '1px solid var(--border-2)',
              borderBottom: 'none',
              borderTopLeftRadius: 18, borderTopRightRadius: 18,
              boxShadow: '0 -12px 48px rgba(27,27,28,0.18)',
              animation: 'drawerUp 0.32s var(--ease) both',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
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
                  <CartIcon size={16} />
                </span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--bark)' }}>
                    Votre panier
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--bark-3)' }}>
                    {totalItems === 0 ? 'Vide pour le moment' : `${totalItems} article${totalItems > 1 ? 's' : ''}`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer le panier"
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

            {/* Body */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '8px 0',
              scrollbarWidth: 'thin',
            }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>🧺</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--bark)', marginBottom: 6 }}>
                    Votre panier est vide
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--bark-3)', marginBottom: 20, lineHeight: 1.6 }}>
                    Ajoutez des appareils depuis le catalogue pour les retrouver ici.
                  </div>
                  <Link to="/catalogue" className="btn-primary" style={{ fontSize: 12.5 }}
                    onClick={() => setOpen(false)}>
                    Voir le catalogue
                  </Link>
                </div>
              ) : (
                items.map(i => {
                  const image = i.product.image || productImages[i.product.slug];
                  return (
                    <div key={i.product.id} style={{
                      display: 'flex', gap: 12, alignItems: 'center',
                      padding: '12px 18px', borderBottom: '1px solid var(--border)',
                    }}>
                      <Link to={`/produit/${i.product.slug}`} onClick={() => setOpen(false)} style={{ flexShrink: 0 }}>
                        <div style={{
                          width: 56, height: 56, borderRadius: 10, overflow: 'hidden',
                          background: 'var(--sand)', border: '1px solid var(--border)',
                        }}>
                          {image && <img src={image} alt={i.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                      </Link>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link to={`/produit/${i.product.slug}`} onClick={() => setOpen(false)}
                          style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div style={{
                            fontSize: 13, fontWeight: 600, color: 'var(--bark)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>{i.product.name}</div>
                        </Link>
                        <div style={{ fontSize: 12, color: 'var(--bark-3)', marginTop: 2 }}>
                          {(i.product.price * i.qty).toFixed(2)} €
                          {i.product.oldPrice && <s style={{ marginLeft: 6, fontSize: 11 }}>{i.product.oldPrice.toFixed(2)} €</s>}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 7 }}>
                          <button
                            onClick={() => updateQty(i.product.id, i.qty - 1)}
                            aria-label="Diminuer la quantité"
                            style={qtyBtn}
                          >−</button>
                          <span style={{ fontSize: 12.5, fontWeight: 700, minWidth: 20, textAlign: 'center', color: 'var(--bark)' }}>
                            {i.qty}
                          </span>
                          <button
                            onClick={() => updateQty(i.product.id, i.qty + 1)}
                            aria-label="Augmenter la quantité"
                            style={qtyBtn}
                          >+</button>
                          <button
                            onClick={() => removeItem(i.product.id)}
                            aria-label="Retirer l'article"
                            style={{
                              marginLeft: 'auto', border: 'none', background: 'none', cursor: 'pointer',
                              fontSize: 11, color: 'var(--bark-3)', fontWeight: 600, padding: '4px 6px',
                            }}
                          >Retirer</button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{
                borderTop: '1px solid var(--border)',
                padding: '14px 18px 16px', background: 'var(--sand-light)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--bark-3)' }}>Sous-total</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--bark)' }}>{totalPrice.toFixed(2)} €</span>
                </div>
                {totalSavings > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 12.5, color: 'var(--olive-dark)' }}>Vous économisez</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--olive-dark)' }}>
                      −{totalSavings.toFixed(2)} €
                    </span>
                  </div>
                )}
                <Link to="/panier" className="btn-primary" style={{ width: '100%', textAlign: 'center', fontSize: 13.5 }}
                  onClick={() => setOpen(false)}>
                  Commander — {totalPrice.toFixed(2)} €
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: '100%', marginTop: 8, padding: '10px',
                    border: 'none', background: 'none', cursor: 'pointer',
                    fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)',
                  }}
                >Continuer mes achats</button>
              </div>
            )}
          </div>
        </>
      )}

{/* Floating button */}
      {!open && !fabHidden && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le panier"
          aria-expanded={open}
          style={{
            width: 58, height: 58, borderRadius: '50%', cursor: 'pointer',
            position: 'relative',
            background: 'var(--terracotta)', color: '#fff', border: 'none',
            boxShadow: '0 8px 24px rgba(230,116,89,0.45), 0 2px 6px rgba(27,27,28,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.25s var(--ease)',
            animation: 'fabIn 0.25s var(--ease) both',
          }}
        >
          <CartIcon size={22} />

          {totalItems > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              minWidth: 22, height: 22, padding: '0 6px', borderRadius: 100,
              background: 'var(--bark)', color: '#fff',
              fontSize: 11, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--cream)',
            }}>{totalItems}</span>
          )}
        </button>
      )}

      <style>{`
        @keyframes drawerUp {
          from { transform: translateY(40px); opacity: 0.4; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fabIn {
          from { transform: scale(0.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const qtyBtn = {
  width: 26, height: 26, borderRadius: 7, flexShrink: 0,
  border: '1px solid var(--border-2)', background: 'var(--cream)',
  color: 'var(--bark)', fontSize: 14, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  lineHeight: 1,
};