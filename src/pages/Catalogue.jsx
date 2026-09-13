import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { categories as localCategories, products as localProducts, getCategoryById } from '../data/products';
import { getCategories, getProducts } from '../api';
import ProductCard from '../components/ProductCard';
import ProductGrid from '../components/ProductGrid';
import ProductVisual from '../components/ProductVisual';
import CompareModal from '../components/CompareModal';
import { productImages } from '../data/images';
import { categoryIcons, StarIcon, CompareIcon, CheckIcon, ChevronIcon } from '../components/Icons';

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCat = searchParams.get('cat') || 'all';
  const searchQ = (searchParams.get('q') || '').trim().toLowerCase();
  const [sort, setSort] = useState('name');
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ promo: false, inStock: false, maxPrice: '', energy: '' });
  const [categories, setCategories] = useState(localCategories);
  const [products, setProducts] = useState(localProducts);

  useEffect(() => {
    Promise
      .all([getCategories(), getProducts()])
      .then(([cats, prods]) => {
        if (cats?.length) setCategories(cats);
        if (prods?.length) setProducts(prods);
      })
      .catch(() => { /* fallback données locales */ });
  }, []);

  const featured = products.filter(p => p.badge === 'bestseller').slice(0, 3);
  const activeCategory = activeCat !== 'all' ? getCategoryById(activeCat) : null;

  const promoParam = searchParams.get('promo') === '1';
  const promoActive = promoParam || filters.promo;
  const energyClasses = [...new Set(products.flatMap(p => (
    p.specs && p.specs['Classe énergie'] ? [p.specs['Classe énergie']] : []
  )))];

  const setFilter = (key, value) => setFilters(f => ({ ...f, [key]: value }));
  const togglePromo = () => {
    if (promoParam) {
      const next = new URLSearchParams(searchParams);
      next.delete('promo');
      setSearchParams(next);
    } else {
      setFilter('promo', !filters.promo);
    }
  };
  const resetFilters = () => setFilters({ promo: false, inStock: false, maxPrice: '', energy: '' });

  const filtered = (() => {
    let list = activeCat === 'all'
      ? products
      : products.filter(p => p.category === activeCat);

    if (promoActive) {
      list = list.filter(p => p.oldPrice && p.oldPrice > p.price);
    }
    if (filters.inStock) {
      list = list.filter(p => p.stock > 0);
    }
    if (filters.maxPrice) {
      list = list.filter(p => p.price <= Number(filters.maxPrice));
    }
    if (filters.energy) {
      list = list.filter(p => (p.specs && p.specs['Classe énergie']) === filters.energy);
    }

    if (searchQ) {
      const q = searchQ;
      list = list.filter(p => {
        const hay = [
          p.name,
          p.category,
          getCategoryById(p.category)?.name || '',
          (p.features || []).join(' '),
          p.description,
        ].join(' ').toLowerCase();
        return q.split(/\s+/).every(part => hay.includes(part));
      });
    }
    return list;
  })();

  const hasActiveFilter = promoActive || filters.inStock || Boolean(filters.maxPrice) || Boolean(filters.energy);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'discount') {
      const da = (a.oldPrice && a.oldPrice > a.price) ? (1 - a.price / a.oldPrice) : 0;
      const db = (b.oldPrice && b.oldPrice > b.price) ? (1 - b.price / b.oldPrice) : 0;
      return db - da;
    }
    return a.name.localeCompare(b.name);
  });

  const selectable = compareMode;
  const maxReached = selected.length >= 3;

  const toggleSelect = (id) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const selectedProducts = products.filter(p => selected.includes(p.id));
  const countFor = (catId) => products.filter(p => p.category === catId).length;

  const compareVisible = selected.length > 0 || compareOpen;
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('fab-visibility', {
      detail: { reason: 'compare', open: compareVisible },
    }));
  }, [compareVisible]);

  return (
    <main className="section-pad">
      <div className="container">
        <div className="section-eyebrow">Notre sélection</div>

        {/* ═══ Vedettes ═══════════════════════════ */}
        {activeCat === 'all' && (
          <section style={{ marginBottom: 'clamp(36px, 6vw, 56px)' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              marginBottom: 'clamp(20px, 3vw, 32px)', flexWrap: 'wrap', gap: 12,
            }}>
              <div>
                <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)' }}>Le coup de cœur</h1>
              </div>
              <a href="#tous" className="btn-ghost" style={{ fontSize: 11 }}>Tout voir →</a>
            </div>

            <div className="featured-grid">
              {featured.map((p, i) => {
                const hasDiscount = p.oldPrice && p.oldPrice > p.price;
                const saved = hasDiscount ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
                return (
                  <div key={p.id} className="card featured-card" style={{ animation: `fadeUp 0.5s var(--ease) ${i * 0.08}s both` }}>
                    <Link to={`/produit/${p.slug}`} className="featured-img" style={{
                      textDecoration: 'none', color: 'inherit',
                    }}>
                      <div style={{
                        width: 'clamp(84px, 13vw, 104px)', aspectRatio: '1',
                        borderRadius: 'clamp(14px, 3vw, 20px)',
                        background: 'var(--sand)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 6, overflow: 'hidden',
                      }}>
                        {p.image || productImages[p.slug] ? (
                          <img src={p.image || productImages[p.slug]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 'clamp(12px, 2.5vw, 16px)' }} />
                        ) : (
                          <ProductVisual category={p.category} style={{ width: '100%', height: 'auto' }} />
                        )}
                      </div>
                    </Link>
                    <div className="featured-content">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span className="badge badge-new">★ Coup de cœur</span>
                        {saved > 0 && <span className="badge badge-eco">-{saved}%</span>}
                      </div>
                      <Link to={`/produit/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 style={{ fontSize: 'clamp(15px, 2.2vw, 17px)', fontWeight: 600, marginBottom: 6 }}>
                          {p.name}
                        </h3>
                      </Link>
                      <p className="featured-desc" style={{
                        fontSize: 'clamp(12px, 1.8vw, 13px)', color: 'var(--bark-2)',
                        lineHeight: 1.6, marginBottom: 10,
                      }}>
                        {p.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <StarIcon key={n} size={11} filled={n <= Math.floor(p.rating)} />
                        ))}
                        <span style={{ fontSize: 11.5, color: 'var(--bark-3)' }}>
                          {p.rating}/5 · {p.reviews} avis
                        </span>
                      </div>
                      <div style={{
                        marginTop: 'auto', display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
                      }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--bark)' }}>
                          {p.price.toFixed(2)} €
                        </span>
                        <Link to={`/produit/${p.slug}`} className="btn-primary" style={{ minHeight: 40, padding: '10px 20px', fontSize: 12 }}>
                          Découvrir
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══ En-tête recherche ═══════════════════ */}
        {searchQ && activeCat === 'all' && (
          <div style={{ marginBottom: 'clamp(28px, 4vw, 44px)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(24px, 5vw, 34px)' }}>
                Résultats pour «&nbsp;{searchQ}&nbsp;»
              </h1>
            </div>
            <p style={{ fontSize: 13, color: 'var(--bark-3)', marginTop: 4 }}>
              {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* ═══ En-tête catégorie filtrée ═══════════ */}
        {activeCategory && (
          <div style={{ marginBottom: 'clamp(28px, 4vw, 44px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 'clamp(44px, 7vw, 56px)', height: 'clamp(44px, 7vw, 56px)',
                borderRadius: 14, background: 'var(--terracotta-bg)',
                border: '1px solid var(--terracotta-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--terracotta)',
              }}>
                {(() => { const I = categoryIcons[activeCategory.iconKey]; return I && <I size={24} />; })()}
              </div>
              <div>
                <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)' }}>{activeCategory.name}</h1>
                <p style={{ fontSize: 13, color: 'var(--bark-3)', marginTop: 2 }}>
                  {filtered.length} produit{filtered.length > 1 ? 's' : ''} · {activeCategory.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ Bannière promo ═══════════════════ */}
        {promoParam && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, flexWrap: 'wrap',
            background: 'var(--olive-bg)', border: '1px solid rgba(255,139,0,0.3)',
            color: 'var(--olive-dark)', borderRadius: 12, padding: '14px 18px',
            marginBottom: 'clamp(28px, 4vw, 44px)', fontSize: 13.5, fontWeight: 600,
          }}>
            <span>Offres du moment — des réductions sur une sélection d'appareils.</span>
            {hasActiveFilter === false && (
              <Link
                to="/catalogue"
                onClick={() => resetFilters()}
                className="btn-ghost"
                style={{ fontSize: 11, padding: '8px 14px', minHeight: 36 }}
              >Tout le catalogue</Link>
            )}
          </div>
        )}

        {/* ═══ Layout sidebar + grille ═════════════ */}
        <div className="catalog-layout" id="tous">
          {/* Sidebar (desktop) */}
          <aside className="catalog-sidebar" style={{
            position: 'sticky', top: 'calc(var(--header-h) + 24px)',
          }}>
            <h4 style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.12em', color: 'var(--bark-3)', marginBottom: 14,
            }}>Catégories</h4>

            <button className={`cat-row ${activeCat === 'all' ? 'active' : ''}`}
              onClick={() => setSearchParams({})}
            >
              Tout le catalogue
              <span className="count">{products.length}</span>
            </button>

            <div style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.12em', color: 'var(--terracotta)',
              margin: '18px 0 8px',
            }}>GEM</div>
            {categories.filter(c => c.type === 'GEM').map(cat => (
              <SidebarRow
                key={cat.id}
                cat={cat}
                active={activeCat === cat.id}
                count={countFor(cat.id)}
                onClick={() => setSearchParams({ cat: cat.id })}
              />
            ))}

            <div style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.12em', color: 'var(--olive-dark)',
              margin: '18px 0 8px',
            }}>PEM</div>
            {categories.filter(c => c.type === 'PEM').map(cat => (
              <SidebarRow
                key={cat.id}
                cat={cat}
                active={activeCat === cat.id}
                count={countFor(cat.id)}
                onClick={() => setSearchParams({ cat: cat.id })}
              />
            ))}

            <div style={{ height: 1, background: 'var(--border)', margin: '20px 0 16px' }} />
            <h4 style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.12em', color: 'var(--bark-3)', marginBottom: 10,
            }}>Comparer</h4>
            <button
              className={`compare-toggle ${compareMode ? 'active' : ''}`}
              onClick={() => {
                setCompareMode(!compareMode);
                setSelected([]);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                border: compareMode ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border-2)',
                background: compareMode ? 'var(--terracotta-bg)' : 'transparent',
                color: compareMode ? 'var(--terracotta)' : 'var(--bark-2)',
                borderRadius: 8, padding: '10px 12px', fontSize: 12.5, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <CompareIcon size={15} />
              {compareMode ? 'Choisir les produits' : 'Mode comparatif'}
            </button>
            <p style={{ fontSize: 11, color: 'var(--bark-3)', marginTop: 8, lineHeight: 1.5 }}>
              Cochez 2 à 3 produits pour comparer leurs specs.
            </p>

            <div style={{ height: 1, background: 'var(--border)', margin: '20px 0 16px' }} />
            <FilterPanel
              filters={filters}
              setFilter={setFilter}
              promoActive={promoActive}
              togglePromo={togglePromo}
              energyClasses={energyClasses}
              resetFilters={resetFilters}
              variant="sidebar"
            />
          </aside>

          {/* Main */}
          <div>
            {/* Barre outils */}
            <div className="catalog-toolbar" style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 'clamp(20px, 3vw, 32px)', flexWrap: 'wrap', gap: 12,
            }}>
              <div className="catalog-toolbar-row" style={{ fontSize: 13, color: 'var(--bark-3)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {sorted.length} produit{sorted.length > 1 ? 's' : ''}
                {activeCat !== 'all' && ` · ${activeCategory.name}`}
                {hasActiveFilter && (
                  <button
                    onClick={() => {
                      resetFilters();
                      if (promoParam) {
                        const next = new URLSearchParams(searchParams);
                        next.delete('promo');
                        setSearchParams(next);
                      }
                    }}
                    style={{
                      border: '1px solid var(--border-2)', background: 'var(--sand)',
                      color: 'var(--bark-2)', borderRadius: 100,
                      padding: '4px 12px', fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                    }}
                  >&#10005; Réinitialiser les filtres</button>
                )}
              </div>
              <div className="catalog-toolbar-row" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  className={`btn-ghost mobile-filter-btn ${mobileFiltersOpen ? 'active' : ''}`}
                  style={{
                    fontSize: 11, padding: '10px 16px', minHeight: 40,
                    ...(mobileFiltersOpen ? {
                      background: 'var(--terracotta)', color: '#fff', borderColor: 'var(--terracotta)',
                    } : {}),
                  }}
                  onClick={() => setMobileFiltersOpen(o => !o)}
                  aria-expanded={mobileFiltersOpen}
                >
                  Filtres
                </button>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="input-luxury"
                  style={{ width: 'auto', padding: '10px 14px', fontSize: 13, minHeight: 40 }}
                >
                  <option value="name">A → Z</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="rating">Meilleures notes</option>
                  <option value="discount">Meilleures promos</option>
                </select>
                <button
                  className={`btn-ghost compare-btn ${compareMode ? 'active' : ''}`}
                  style={{
                    fontSize: 11, padding: '10px 16px', minHeight: 40,
                    ...(compareMode ? {
                      background: 'var(--terracotta)', color: '#fff', borderColor: 'var(--terracotta)',
                    } : {}),
                  }}
                  onClick={() => {
                    setCompareMode(!compareMode);
                    setSelected([]);
                  }}
                >
                  <CompareIcon size={14} />
                  {compareMode ? 'Mode actif' : 'Comparer'}
                </button>
              </div>
            </div>

            {/* Filtre déroulant (mobile) */}
            <div className="mobile-cat-filter" style={{ display: 'none', marginBottom: 20 }}>
              <button
                type="button"
                aria-expanded={mobileCatOpen}
                onClick={() => setMobileCatOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 10, width: '100%',
                  background: 'var(--cream)', border: '1.5px solid var(--border-2)',
                  borderRadius: 10, padding: '13px 16px',
                  fontFamily: 'var(--font)', fontSize: 13.5, fontWeight: 600,
                  color: 'var(--bark)', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  {activeCategory && (() => { const I = categoryIcons[activeCategory.iconKey]; return I && <I size={16} />; })()}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeCategory ? activeCategory.name : 'Toutes les catégories'}
                  </span>
                </span>
                <ChevronIcon size={16} style={{ flexShrink: 0, transform: mobileCatOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s var(--ease)' }} />
              </button>

              {mobileCatOpen && (
                <div style={{
                  marginTop: 8, border: '1px solid var(--border-2)',
                  borderRadius: 10, background: 'var(--cream)',
                  overflow: 'hidden',
                }}>
                  <OptionRow
                    label="Toutes les catégories"
                    active={activeCat === 'all'}
                    count={products.length}
                    onClick={() => { setSearchParams({}); setMobileCatOpen(false); }}
                  />
                  {categories.map(cat => (
                    <OptionRow
                      key={cat.id}
                      label={cat.name}
                      group={cat.type}
                      iconKey={cat.iconKey}
                      active={activeCat === cat.id}
                      count={countFor(cat.id)}
                      onClick={() => { setSearchParams({ cat: cat.id }); setMobileCatOpen(false); }}
                    />
                  ))}
                </div>
              )}
            </div>

            <style>{`
              @media (max-width: 640px) {
                .mobile-cat-filter { display: block !important; }
                .filter-scroll { display: none !important; }
              }
              @media (min-width: 901px) {
                .mobile-filter-btn { display: none !important; }
              }
              @media (max-width: 900px) {
                .mobile-filters-panel { display: block !important; }
              }
              .mobile-cat-filter button + .mobile-option { border-top: 1px solid var(--border); }
            `}</style>

            {mobileFiltersOpen && (
              <div className="mobile-filters-panel" style={{
                display: 'none', marginBottom: 20,
                background: 'var(--cream)', border: '1px solid var(--border-2)',
                borderRadius: 12, padding: 18,
              }}>
                <FilterPanel
                  filters={filters}
                  setFilter={setFilter}
                  promoActive={promoActive}
                  togglePromo={togglePromo}
                  energyClasses={energyClasses}
                  resetFilters={resetFilters}
                  variant="mobile"
                />
              </div>
            )}

            {/* Grille */}
            {sorted.length === 0 ? (
              <p style={{ color: 'var(--bark-3)', fontSize: 15 }}>Aucun produit dans cette catégorie.</p>
            ) : (
              <ProductGrid>
                {sorted.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    selectable={selectable}
                    selected={selected.includes(p.id)}
                    onSelect={toggleSelect}
                    maxReached={maxReached}
                  />
                ))}
              </ProductGrid>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Barre comparatif ═════════════════════ */}
      {selected.length > 0 && !compareOpen && (
        <div className="compare-bar">
          <span style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 'clamp(12px, 2vw, 13.5px)', fontWeight: 500,
            color: 'var(--bark-inv)',
          }}>
            <CheckIcon size={14} style={{ color: 'var(--terracotta-light)' }} />
            {selected.length} / 3 sélectionné{selected.length > 1 ? 's' : ''}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setSelected([])}
              style={{
                border: '1px solid rgba(255,255,255,0.18)', background: 'transparent',
                color: 'rgba(255,255,255,0.68)', borderRadius: 100,
                padding: '10px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                minHeight: 40,
              }}
            >Vider</button>
            <button
              onClick={() => setCompareOpen(true)}
              className="btn-primary"
              style={{ minHeight: 40, padding: '10px 20px', fontSize: 12 }}
            >
              <CompareIcon size={14} />
              Comparer
            </button>
          </div>
        </div>
      )}

      {/* ═══ Modal comparatif ═════════════════════ */}
      {compareOpen && selectedProducts.length >= 2 && (
        <CompareModal products={selectedProducts} onClose={() => setCompareOpen(false)} />
      )}
    </main>
  );
}

/* ── Sidebar row ─────────────────────────────── */
function SidebarRow({ cat, active, count, onClick }) {
  const Icon = categoryIcons[cat.iconKey];
  return (
    <button
      className={`cat-row ${active ? 'active' : ''}`}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '9px 12px', border: 'none', background: 'transparent',
        borderRadius: 8, fontFamily: 'var(--font)', fontSize: 13.5,
        color: active ? 'var(--terracotta)' : 'var(--bark-2)',
        fontWeight: active ? 600 : 400, cursor: 'pointer',
        textAlign: 'left', transition: 'all 0.2s',
      }}
    >
      <span style={{
        width: 24, height: 24, borderRadius: 7, flexShrink: 0,
        background: active ? 'var(--terracotta-bg)' : 'var(--sand)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: active ? 'var(--terracotta)' : 'var(--bark-3)',
      }}>
        {Icon && <Icon size={13} />}
      </span>
      {cat.name}
      <span style={{
        marginLeft: 'auto', fontSize: 11, color: active ? 'var(--terracotta)' : 'var(--bark-3)',
      }}>{count}</span>
    </button>
  );
}

/* ── Option du filtre déroulant mobile ───────── */
function OptionRow({ label, group, iconKey, active, count, onClick }) {
  const Icon = iconKey && categoryIcons[iconKey];
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '12px 16px', border: 'none', background: 'transparent',
        fontFamily: 'var(--font)', fontSize: 13.5, fontWeight: 500,
        color: active ? 'var(--terracotta)' : 'var(--bark)',
        cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--sand)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{
        width: 26, height: 26, borderRadius: 8, flexShrink: 0,
        background: active ? 'var(--terracotta-bg)' : 'var(--sand)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: active ? 'var(--terracotta)' : 'var(--bark-3)',
      }}>
        {Icon ? <Icon size={14} /> : <StarIcon size={13} filled />}
      </span>
      <span style={{
        minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: 1.2,
      }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        {group && <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--bark-3)', marginTop: 1 }}>{group}</span>}
      </span>
      <span style={{ flex: 1 }} />
      {active && <CheckIcon size={14} style={{ color: 'var(--terracotta)', flexShrink: 0 }} />}
      <span style={{
        fontSize: 11, color: 'var(--bark-3)', flexShrink: 0,
        background: 'var(--sand)', padding: '2px 8px', borderRadius: 100,
      }}>{count}</span>
    </button>
  );
}

/* ── Panneau filtres ─────────────────────────── */
const BUDGET_OPTIONS = [
  { value: '', label: 'Tous les budgets' },
  { value: '200', label: 'Moins de 200 €' },
  { value: '400', label: 'Entre 200 et 400 €' },
  { value: '700', label: 'Entre 400 et 700 €' },
  { value: '1000', label: 'Entre 700 et 1000 €' },
  { value: '2000', label: 'Plus de 1000 €' },
];

function FilterPanel({ filters, setFilter, promoActive, togglePromo, energyClasses, resetFilters, variant }) {
  const heading = variant === 'sidebar' ? 'Affiner' : 'Affiner la recherche';
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <h4 style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.12em', color: 'var(--bark-3)', margin: 0,
        }}>{heading}</h4>
        {(promoActive || filters.inStock || filters.maxPrice || filters.energy) && (
          <button
            onClick={resetFilters}
            style={{
              border: 'none', background: 'transparent', fontSize: 11,
              color: 'var(--terracotta)', fontWeight: 600, cursor: 'pointer',
              padding: 4, fontFamily: 'var(--font)',
            }}
          >Réinitialiser</button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <FilterToggleRow
          checked={promoActive}
          label="En promotion"
          hint="Appareils avec -%"
          onChange={togglePromo}
        />
        <FilterToggleRow
          checked={filters.inStock}
          label="En stock"
          hint="Disponible immédiatement"
          onChange={() => setFilter('inStock', !filters.inStock)}
        />
      </div>

      <div style={{ marginTop: 14 }}>
        <label style={{
          display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--bark-2)',
          marginBottom: 6,
        }}>Budget max</label>
        <select
          value={filters.maxPrice}
          onChange={e => setFilter('maxPrice', e.target.value)}
          className="input-luxury"
          style={{ width: '100%', padding: '9px 12px', fontSize: 12.5 }}
        >
          {BUDGET_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {energyClasses.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <label style={{
            display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--bark-2)',
            marginBottom: 6,
          }}>Classe énergétique</label>
          <select
            value={filters.energy}
            onChange={e => setFilter('energy', e.target.value)}
            className="input-luxury"
            style={{ width: '100%', padding: '9px 12px', fontSize: 12.5 }}
          >
            <option value="">Toutes les classes</option>
            {energyClasses.slice().sort((a, b) => rankClass(b) - rankClass(a)).map(c => (
              <option key={c} value={c}>Classe {c}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

function rankClass(c) {
  const plusses = (c.match(/\+/g) || []).length;
  return c === 'A' ? -1 : plusses;
}

function FilterToggleRow({ checked, label, hint, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="checkbox"
      aria-checked={checked}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        border: `1px solid ${checked ? 'var(--terracotta-border)' : 'var(--border-2)'}`,
        background: checked ? 'var(--terracotta-bg)' : 'var(--sand)',
        borderRadius: 9, padding: '9px 12px', cursor: 'pointer',
        fontFamily: 'var(--font)', textAlign: 'left',
        transition: 'all 0.2s',
      }}
    >
      <span style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
        border: `1.5px solid ${checked ? 'var(--terracotta)' : 'var(--border-2)'}`,
        background: checked ? 'var(--terracotta)' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
      }}>
        {checked && <CheckIcon size={12} />}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25, minWidth: 0 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--bark)' }}>{label}</span>
        {hint && <span style={{ fontSize: 10.5, color: 'var(--bark-3)' }}>{hint}</span>}
      </span>
    </button>
  );
}