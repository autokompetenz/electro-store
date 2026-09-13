import { Link } from 'react-router-dom';
import { StarIcon, HeartIcon, CartIcon } from './Icons';
import ProductVisual from './ProductVisual';
import { productImages } from '../data/images';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function ProductCard({ product, selectable, selected, onSelect, maxReached }) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const image = product.image || productImages[product.slug];
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const savingsPercent = hasDiscount
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const fav = isFavorite(product.id);

  const inStock = (product.stock ?? 1) > 0;

  const badgeClass = product.badge === 'eco' ? 'badge-eco' : 'badge-new';
  const badgeLabel = product.badge === 'new'
    ? 'Nouveau'
    : product.badge === 'bestseller'
      ? 'Bestseller'
      : hasDiscount ? `-${savingsPercent}%` : '';

  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem(product);
    window.dispatchEvent(new CustomEvent('open-floating-cart'));
  };

  const toggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

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
                objectFit: 'contain',
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

        {/* Discount badge (promo) */}
        {hasDiscount && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: 'var(--olive)', color: '#fff',
            borderRadius: 7, padding: '4px 9px',
            fontSize: 11.5, fontWeight: 800, letterSpacing: '0.02em',
          }}>-{savingsPercent}%</span>
        )}

        {/* Brand/promo badge */}
        {!hasDiscount && product.badge && (
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
          </div>
        )}

        {/* Favorite toggle */}
        {!selectable && (
          <button
            type="button"
            aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            onClick={toggleFav}
            style={{
              position: 'absolute', top: 10, right: 10, zIndex: 2,
              width: 32, height: 32, borderRadius: '50%',
              border: '1px solid var(--border-2)',
              background: 'rgba(253,251,247,0.92)',
              color: fav ? '#c4453a' : 'var(--bark-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s var(--ease)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <HeartIcon size={15} filled={fav} />
          </button>
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </button>
        )}
      </div>

      {/* Info */}
      <div style={{
        padding: '14px 16px 16px',
        flex: 1, display: 'flex', flexDirection: 'column',
      }}>
        {/* Marque */}
        {product.brand && (
          <div style={{
            fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.09em', color: 'var(--bark-3)', marginBottom: 3,
          }}>
            {product.brand}
          </div>
        )}

        <h3 style={{
          fontSize: 'clamp(13px, 2.4vw, 15px)',
          fontWeight: 600, marginBottom: 6, lineHeight: 1.3, color: 'var(--bark)',
        }}>
          {product.name}
        </h3>

        {/* Note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--terracotta)' }}>
            {[1, 2, 3, 4, 5].map(n => (
              <StarIcon key={n} size={11} filled={n <= Math.round(product.rating)} />
            ))}
          </span>
          <span style={{ fontSize: 11.5, color: 'var(--bark-3)', marginLeft: 4 }}>{product.rating} · {product.reviews} avis</span>
        </div>

        {/* Prix */}
        <div style={{
          fontSize: 'clamp(17px, 3vw, 19px)',
          fontWeight: 700, color: 'var(--bark)', marginBottom: 10,
          display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap',
        }}>
          {product.price.toFixed(2)} €
          {hasDiscount && (
            <span style={{ fontSize: 12, color: 'var(--bark-3)', textDecoration: 'line-through', fontWeight: 400 }}>
              {product.oldPrice.toFixed(2)} €
            </span>
          )}
          {hasDiscount && (
            <span style={{
              fontSize: 10.5, fontWeight: 800, color: 'var(--olive-dark)',
              background: 'var(--olive-bg)', borderRadius: 5, padding: '2px 6px',
            }}>Éco {savingsPercent}%</span>
          )}
        </div>

        {/* Stock */}
        <div style={{
          marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
          marginBottom: 10,
        }}>
          <span className={`stock-pill ${inStock ? 'stock-in' : 'stock-out'}`}>
            <span className="stock-dot" />
            {inStock ? 'En stock' : 'Rupture de stock'}
          </span>
          {inStock && (
            <span style={{ fontSize: 10.5, color: 'var(--bark-3)', fontWeight: 600 }}>
              Livraison 2-5j
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={addToCart}
          disabled={!inStock}
          className="btn-primary"
          style={{
            width: '100%', minHeight: 40, padding: '9px 14px', fontSize: 12.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            ...(!inStock && {
              opacity: 0.5, cursor: 'not-allowed', transform: 'none',
              background: 'var(--bark-3)', boxShadow: 'none',
            }),
          }}
        >
          <CartIcon size={14} />
          {inStock ? 'Ajouter au panier' : 'Bientôt disponible'}
        </button>
      </div>

      {/* Max reached alert */}
      {selectable && maxReached && !selected && (
        <span style={{
          position: 'absolute', right: 12, bottom: 92, zIndex: 3,
          fontSize: 10, color: 'var(--terracotta)', fontWeight: 600,
          background: 'var(--cream)', padding: '2px 8px', borderRadius: 6,
          border: '1px solid var(--terracotta-border)',
          boxShadow: 'var(--shadow-sm)',
        }}>Max 3</span>
      )}
    </Link>
  );
}