import { useEffect } from 'react';
import { StarIcon, CloseIcon } from './Icons';
import ProductVisual from './ProductVisual';
import { productImages } from '../data/images';
import { lockBodyScroll, unlockBodyScroll } from '../utils/bodyLock';

export default function CompareModal({ products, onClose }) {
  const allKeys = [...new Set(products.flatMap(p => Object.keys(p.specs)))];

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    lockBodyScroll();
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockBodyScroll();
    };
  }, [onClose]);

  const best = products.reduce((acc, p) => (p.rating > acc.rating ? p : acc), products[0]);

  return (
    <div className="compare-overlay" onClick={onClose}>
      <div className="compare-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Comparer les produits">
        {/* Header */}
        <div className="compare-header" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 0 20px', borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div className="section-eyebrow">Côte à côte</div>
            <h2 style={{ fontSize: 20, margin: 0 }}>Comparer {products.length} produits</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              width: 40, height: 40, borderRadius: 10,
              border: '1px solid var(--border)', background: 'var(--cream)',
              color: 'var(--bark-2)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Table */}
        <div className="compare-scroll">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 640 }}>
            <thead>
              <tr>
                <th style={{ width: 140, textAlign: 'left' }}></th>
                {products.map(p => {
                  return (
                    <th key={p.id} style={{ textAlign: 'center', padding: '8px 12px' }}>
                      <div style={{
                        width: 56, height: 56, margin: '0 auto 10px', borderRadius: 14,
                        background: 'var(--sand)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 5, overflow: 'hidden',
                      }}>
                        {p.image || productImages[p.slug] ? (
                          <img src={p.image || productImages[p.slug]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                        ) : (
                          <ProductVisual category={p.category} style={{ width: '100%', height: 'auto' }} />
                        )}
                      </div>
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: 'var(--bark)',
                        lineHeight: 1.3, minHeight: 34, display: 'flex', alignItems: 'center',
                        justifyContent: 'center',
                      }}>{p.name}</div>
                      <div style={{
                        fontSize: 17, fontWeight: 700,
                        color: 'var(--bark)', margin: '6px 0',
                      }}>{p.price.toFixed(2)} €</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <StarIcon key={n} size={10} filled={n <= Math.floor(p.rating)} />
                        ))}
                        <span style={{ fontSize: 11, color: 'var(--bark-3)', marginLeft: 3 }}>{p.rating}</span>
                      </div>
                      <div style={{
                        marginTop: 8, fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: p.id === best.id ? 'var(--terracotta)' : 'var(--bark-3)',
                      }}>
                        {p.id === best.id ? '★ Meilleure note' : ''}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {allKeys.map(key => (
                <tr key={key} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{
                    padding: '12px 8px', fontSize: 12.5, fontWeight: 600,
                    color: 'var(--bark-3)', background: 'var(--sand)',
                    borderTop: '1px solid var(--border)',
                  }}>
                    {key}
                  </td>
                  {products.map(p => {
                    const val = p.specs[key];
                    return (
                      <td key={p.id} style={{
                        padding: '12px 8px', textAlign: 'center',
                        fontSize: 13, fontWeight: 500, color: 'var(--bark)',
                        background: 'var(--cream)', borderTop: '1px solid var(--border)',
                      }}>
                        {val ?? '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 12,
          paddingTop: 20, borderTop: '1px solid var(--border)', marginTop: 20,
        }}>
          <button className="btn-ghost" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}