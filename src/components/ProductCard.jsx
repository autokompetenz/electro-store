import { Link } from 'react-router-dom';
import { StarIcon, CheckIcon } from './Icons';
import ProductVisual from './ProductVisual';
import { productImages } from '../data/images';

export default function ProductCard({ product, selectable, selected, onSelect, maxReached }) {
  const image = product.image || productImages[product.slug];
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const savingsPercent = hasDiscount
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const badgeClass = product.badge === 'eco' ? 'badge-eco' : 'badge-new';
  const badgeLabel = product.badge === 'new'
    ? 'Nouveau'
    : product.badge === 'bestseller'
      ? 'Bestseller'
      : hasDiscount ? `-${savingsPercent}%` : '';

  return (
    <Link to={`/produit/${product.slug}`} className="card product-card" style={{
      textDecoration: 'none', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden', minWidth: 0,
    }}>
      {/* Image area */}
      <div style={{
        padding: image ? 0 : 'clamp(20px, 4vw, 32px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--sand)',
        minHeight: 'clamp(130px, 22vw, 180px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="product-img-zoom">
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              style={{
                width: '100%', height: 'clamp(130px, 22vw, 180px)', display: 'block',
                objectFit: 'cover',
                transition: 'transform 0.5s var(--ease)',
              }}
            />
          ) : (
            <ProductVisual
              category={product.category}
              style={{
                width: 'clamp(110px, 22vw, 170px)', height: 'auto',
                display: 'block', margin: '0 auto',
                transition: 'transform 0.5s var(--ease)',
              }}
            />
          )}
        </div>

        {product.badge && (
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
          </div>
        )}

        {/* Compare checkbox */}
        {selectable && (
          <button
            type="button"
            aria-label={selected ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(product.id);
            }}
            style={{
              position: 'absolute', top: 10, right: 10, zIndex: 2,
              width: 30, height: 30, borderRadius: 6,
              border: `1.5px solid ${selected ? 'var(--terracotta)' : 'var(--border-2)'}`,
              background: selected ? 'var(--terracotta)' : '#fff',
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s var(--ease)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <CheckIcon size={13} />
          </button>
        )}
      </div>

      {/* Info */}
      <div style={{
        padding: '14px 16px 16px',
        flex: 1, display: 'flex', flexDirection: 'column',
      }}>
        {/* Price — highlighted as leboncoin */}
        <div style={{
          fontSize: 'clamp(17px, 3vw, 19px)',
          fontWeight: 700, color: 'var(--bark)', marginBottom: 4,
          display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap',
        }}>
          {product.price.toFixed(2)} €
          {hasDiscount && (
            <span style={{ fontSize: 12, color: 'var(--bark-3)', textDecoration: 'line-through', fontWeight: 400 }}>
              {product.oldPrice.toFixed(2)} €
            </span>
          )}
        </div>

        <h3 style={{
          fontSize: 'clamp(13px, 2.4vw, 15px)',
          fontWeight: 600, marginBottom: 8, lineHeight: 1.3, color: 'var(--bark)',
        }}>
          {product.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--terracotta)' }}>
            {[1, 2, 3, 4, 5].map(n => (
              <StarIcon key={n} size={11} filled={n <= Math.floor(product.rating)} />
            ))}
          </span>
          <span style={{ fontSize: 11.5, color: 'var(--bark-3)', marginLeft: 4 }}>{product.rating} · {product.reviews} avis</span>
        </div>

        {/* Meta line */}
        <div style={{
          fontSize: 11, color: 'var(--bark-3)', lineHeight: 1.5,
          paddingTop: 9, borderTop: '1px solid var(--border)',
        }}>
          {product.features.slice(0, 2).join(' · ')}
        </div>

        <div style={{
          marginTop: 8,
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 11.5, fontWeight: 600, color: 'var(--terracotta)',
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: 'var(--terracotta)', display: 'inline-block',
          }} />
          Livraison 2-5j · Saragosse
        </div>
      </div>

      {/* Max reached alert */}
      {selectable && maxReached && !selected && (
        <span style={{
          position: 'absolute', right: 12, bottom: 12, zIndex: 3,
          fontSize: 10, color: 'var(--terracotta)', fontWeight: 600,
          background: 'var(--cream)', padding: '2px 8px', borderRadius: 6,
          border: '1px solid var(--terracotta-border)',
          boxShadow: 'var(--shadow-sm)',
        }}>Max 3</span>
      )}
    </Link>
  );
}