import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories as localCategories, products as localProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductVisual from '../components/ProductVisual';
import Newsletter from '../components/Newsletter';
import { TruckIcon, ShieldIcon, ReturnIcon, CheckIcon, StarIcon, CartIcon, MailIcon, } from '../components/Icons';
import { heroKitchen, heroLaundry, productImages, categoryImages } from '../data/images';
import { getCategories, getProducts } from '../api';

export default function Home() {
  const [categories, setCategories] = useState(localCategories);
  const [products, setProducts] = useState(localProducts);

  useEffect(() => {
    let alive = true;
    Promise
      .all([getCategories(), getProducts()])
      .then(([cats, prods]) => {
        if (!alive) return;
        if (cats?.length) setCategories(cats);
        if (prods?.length) setProducts(prods);
      })
      .catch(() => { /* fallback données locales */ });
    return () => { alive = false; };
  }, []);

  const bestsellers = products.filter(p => p.badge === 'bestseller');
  const newProducts = products.filter(p => p.badge === 'new');
  const featured = products.find(p => p.slug === 'robot-aspirateur-lidar-navigate');

  return (
    <main>
      {/* ═══ Hero ═══════════════════════════════ */}
      <section className="hero-bg" style={{
        padding: 'clamp(52px, 9vw, 88px) var(--page-side) clamp(44px, 7vw, 72px)',
        position: 'relative', overflow: 'hidden',
        backgroundImage: `linear-gradient(rgba(253,248,237,0.88), rgba(253,248,237,0.9)), url(${heroKitchen})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 'clamp(32px, 6vw, 60px)',
            alignItems: 'center',
          }} className="hero-grid">

            <div className="animate-fade-up">
              <div className="section-eyebrow">Sélection 2026</div>
              <h1 style={{
                color: 'var(--bark)', marginBottom: 'clamp(16px, 3vw, 22px)',
                fontSize: 'clamp(28px, 5.5vw, 48px)', fontWeight: 700, lineHeight: 1.1,
              }}>
                Pas tout.<br />
                <span style={{ color: 'var(--terracotta)' }}>
                  Juste ce qui compte.
                </span>
              </h1>
              <p style={{
                color: 'var(--bark-2)', fontSize: 'clamp(14px, 2vw, 16px)', maxWidth: 460,
                marginBottom: 'clamp(24px, 4vw, 34px)', lineHeight: 1.7,
              }}>
                On a choisi les électroménagers les plus fiables pour vous — pas besoin
                de feuilleter 200 pages qui ne servent à rien. Lave-linge, réfrigérateurs,
                robots aspirateurs. Le reste, c'est du bruit.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/catalogue" className="btn-primary">Voir la sélection</Link>
                <Link to="/contact" className="btn-ghost">Nous écrire</Link>
              </div>

              {/* Trust */}
              <div style={{
                display: 'flex', gap: 'clamp(20px, 4vw, 30px)', marginTop: 'clamp(28px, 4vw, 40px)',
              }} className="trust-row">
                {[
                  { icon: <TruckIcon />, text: 'Livraison 2-5j' },
                  { icon: <ShieldIcon />, text: 'Garantie 3 ans' },
                  { icon: <ReturnIcon />, text: 'Retour 30j' },
                ].map(b => (
                  <div key={b.text} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    color: 'var(--bark-3)', fontSize: 'clamp(11px, 1.5vw, 12px)', fontWeight: 500,
                  }}>
                    <span style={{ display: 'flex', color: 'var(--terracotta)' }}>{b.icon}</span>
                    {b.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Product visual */}
            <div className="hero-visual animate-float" style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative',
            }}>
              <div style={{
                width: 'clamp(220px, 26vw, 320px)', height: 'clamp(220px, 26vw, 320px)',
                borderRadius: 14,
                background: 'var(--cream)',
                border: '1px solid var(--border-2)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <img
                  src={heroLaundry}
                  alt="Lave-linge et sèche-linge encastrés"
                  style={{
                    width: '110%', height: '110%', objectFit: 'cover', borderRadius: 0,
                    transform: 'rotate(-2deg)', transformOrigin: 'center',
                    flexShrink: 0, minWidth: '110%', minHeight: '110%',
                  }}
                />

                {/* Floating chips */}
                <div style={{
                  position: 'absolute', top: '5%', right: '-3%',
                  background: 'var(--olive)', color: '#fff',
                  borderRadius: 6, padding: '6px 12px',
                  fontSize: 12, fontWeight: 700,
                  boxShadow: 'var(--shadow-sm)',
                  transform: 'rotate(3deg)',
                }}>
                  -15% Bestseller
                </div>
                <div style={{
                  position: 'absolute', bottom: '6%', left: '-4%',
                  background: 'var(--cream)', border: '1px solid var(--border-2)',
                  color: 'var(--bark)', borderRadius: 6, padding: '7px 12px',
                  fontSize: 11.5, fontWeight: 600,
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex', alignItems: 'center', gap: 5,
                  transform: 'rotate(-2deg)',
                }}>
                  <span style={{ display: 'flex', color: 'var(--terracotta)' }}>
                    {[1, 2, 3, 4, 5].map(n => <StarIcon key={n} size={11} />)}
                  </span>
                  4.8 · 234 avis
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-visual { display: none !important; }
          .trust-row { gap: 16px !important; flex-wrap: wrap; }
        }
      `}</style>

      {/* ═══ Preuve & réassurance ═══════════════ */}
      <section style={{ background: 'var(--sand)', borderTop: '1px solid var(--border)' }}>
        <div className="container stats-grid" style={{
          padding: 'clamp(24px, 4vw, 36px) var(--page-side)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(16px, 3vw, 32px)', textAlign: 'center',
        }}>
          {[
            { value: '4.7', label: 'note moyenne', suffix: '★' },
            { value: '487', label: 'avis vérifiés', suffix: '+' },
            { value: '3', label: 'ans de garantie', suffix: '' },
            { value: '98', label: 'de clients satisfaits', suffix: '%' },
          ].map(s => (
            <div key={s.label}>
              <div style={{
                fontSize: 'clamp(26px, 5vw, 34px)',
                fontWeight: 700, color: 'var(--terracotta)', letterSpacing: '-0.02em',
              }}>
                {s.value}<span style={{ fontSize: 'clamp(14px, 2.5vw, 18px)' }}>{s.suffix}</span>
              </div>
              <div style={{
                fontSize: 'clamp(10px, 1.5vw, 11.5px)', color: 'var(--bark-3)', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4,
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ═══ Procédure de commande ═══════════════ */}
      <section className="section-pad" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="section-eyebrow">Procédure de commande</div>
          <h2 style={{ marginBottom: 'clamp(24px, 4vw, 36px)' }}>Comment commander ?</h2>
          <div className="proc-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'clamp(14px, 2.5vw, 20px)',
          }}>
            {[
              {
                n: 1, icon: <CartIcon />, title: 'Choisissez vos produits',
                text: 'Parcourez le catalogue, sélectionnez vos appareils et ajoutez-les au panier.',
              },
              {
                n: 2, icon: <MailIcon />, title: 'Passez commande',
                text: 'Renseignez vos coordonnées. Vous recevez immédiatement un email de confirmation avec les coordonnées bancaires pour régler par virement.',
              },
              {
                n: 3, icon: <CheckIcon />, title: 'Réglez par virement',
                text: 'Virez le montant en indiquant le motif indiqué dans l\'email. Votre commande est confirmée dès réception du virement.',
              },
              {
                n: 4, icon: <TruckIcon />, title: 'Livraison sous 2 à 5 jours',
                text: 'Nous expédions depuis notre entrepôt. Vous suivez l\'avancement de votre commande à chaque étape.',
              },
            ].map(s => (
              <div key={s.n} className="card" style={{ padding: 'clamp(18px, 3vw, 24px)' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--terracotta)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                }}>{s.icon}</div>
                <div style={{ color: 'var(--terracotta)', fontWeight: 800, fontSize: 12, marginBottom: 4 }}>
                  Étape {s.n}
                </div>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--bark-3)', lineHeight: 1.7 }}>{s.text}</p>
              </div>
            ))}
          </div>
          <Link to="/comment-commander" className="btn-ghost" style={{ marginTop: 24, fontSize: 13 }}>
            En savoir plus sur la commande →
          </Link>
        </div>
      </section>

      {/* ═══ Suivi de commande ═══════════════════ */}
      <section className="section-pad" style={{ background: 'var(--cream-2)' }}>
        <div className="container">
          <div className="section-eyebrow">Suivi en temps réel</div>
          <h2 style={{ marginBottom: 'clamp(24px, 4vw, 36px)' }}>Suivez votre commande</h2>
          <div style={{ maxWidth: 600, color: 'var(--bark-3)', lineHeight: 1.7, fontSize: 14, marginBottom: 'clamp(24px, 4vw, 32px)' }}>
            Chaque étape de votre commande déclenche un email automatique.
            Vous pouvez aussi vérifier l'avancement à tout moment sur la page de suivi.
          </div>
          <div className="suivi-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'clamp(14px, 2.5vw, 20px)',
          }}>
            {[
              {
                n: 1, pill: 'En attente', pillBg: 'var(--sand)', pillColor: 'var(--bark-3)',
                title: 'Commande passée', icon: <CartIcon />,
                text: 'Votre commande est enregistrée. Vous recevez l\'email avec les coordonnées de paiement.',
              },
              {
                n: 2, pill: 'Confirmée', pillBg: '#eaf4e6', pillColor: '#2f7d32',
                title: 'Paiement reçu', icon: <CheckIcon />,
                text: 'Le virement est réceptionné : nous préparons votre colis.',
              },
              {
                n: 3, pill: 'Expédiée', pillBg: '#eaf4e6', pillColor: '#2f7d32',
                title: 'En cours de livraison', icon: <TruckIcon />,
                text: 'Votre colis est en route vers votre domicile.',
              },
              {
                n: 4, pill: 'Livrée', pillBg: 'var(--olive-bg)', pillColor: 'var(--olive-dark)',
                title: 'Commande livrée', icon: <CheckIcon />,
                text: 'Votre commande est arrivée. Bonne utilisation !',
              },
            ].map(s => (
              <div key={s.n} className="card" style={{ padding: 'clamp(18px, 3vw, 24px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--terracotta)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{s.icon}</div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 100,
                    background: s.pillBg, color: s.pillColor,
                  }}>{s.pill}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--bark-2)', lineHeight: 1.7 }}>{s.text}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/suivi-commande" className="btn-primary">Suivre ma commande</Link>
            <span style={{ fontSize: 12, color: 'var(--bark-3)' }}>
              Renseignez le n° de commande ou votre email.
            </span>
          </div>
        </div>
      </section>

      {/* ═══ Catégories ══════════════════════════ */}
      <section className="section-pad">
        <div className="container">
          <div className="section-eyebrow">Parcourir</div>
          <h2 style={{ marginBottom: 'clamp(24px, 4vw, 36px)' }}>Nos catégories</h2>
          <div className="categories-grid" style={{ gap: 14 }}>
            {categories.map((cat, i) => {
              const isGem = cat.type === 'GEM';
              return (
                <Link key={cat.id} to={`/catalogue?cat=${cat.id}`}
                  className="card"
                  style={{
                    padding: 'clamp(18px, 3vw, 24px) clamp(16px, 3vw, 22px)',
                    textDecoration: 'none',
                    animation: `fadeUp 0.5s var(--ease) ${i * 0.06}s both`,
                  }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    marginBottom: 12,
                  }}>
                    <div style={{
                      width: 'clamp(48px, 8vw, 56px)', height: 'clamp(48px, 8vw, 56px)',
                      flexShrink: 0,
                      background: isGem ? 'var(--terracotta-bg)' : 'var(--olive-bg)',
                      border: `1px solid ${isGem ? 'var(--terracotta-border)' : 'rgba(255,139,0,0.25)'}`,
                      borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: 5,
                      overflow: 'hidden',
                    }}>
                      {categoryImages[cat.id] ? (
                        <img
                          src={categoryImages[cat.id]}
                          alt={cat.name}
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                        />
                      ) : (
                        <ProductVisual category={cat.id} style={{ width: '100%', height: 'auto' }} />
                      )}
                    </div>
                    <div style={{
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.09em',
                      color: isGem ? 'var(--terracotta)' : 'var(--olive-dark)',
                    }}>{cat.type}</div>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{cat.name}</h3>
                  <p style={{ fontSize: 12.5, color: 'var(--bark-3)', lineHeight: 1.5 }}>
                    {cat.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Coup de cœur ═══════════════════════ */}
      {featured && (
        <section className="section-pad" style={{ background: 'var(--sand)' }}>
          <div className="container">
            <div className="card featured-grid" style={{
              display: 'grid', gridTemplateColumns: '1fr 1.15fr',
              gap: 'clamp(24px, 5vw, 56px)',
              padding: 'clamp(24px, 5vw, 48px)',
              alignItems: 'center', overflow: 'hidden',
            }}>
              {/* Visual */}
              <div style={{
                background: 'var(--sand-light)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 'clamp(20px, 4vw, 36px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <img
                  src={productImages['robot-aspirateur-lidar-navigate']}
                  alt={featured.name}
                  loading="lazy"
                  style={{
                    width: 'calc(100% - clamp(20px, 4vw, 36px))',
                    maxHeight: 'clamp(220px, 34vw, 320px)', objectFit: 'cover',
                    borderRadius: 10, display: 'block',
                  }}
                />
                <span className="badge badge-eco" style={{
                  position: 'absolute', top: 14, left: 14,
                }}>-22%</span>
              </div>

              {/* Contenu */}
              <div>
                <div className="section-eyebrow" style={{ marginBottom: 14 }}>Coup de cœur de la semaine</div>
                <h2 style={{ fontSize: 'clamp(20px, 4vw, 30px)', marginBottom: 8 }}>
                  {featured.name}
                </h2>
                <p style={{ color: 'var(--bark-3)', fontSize: 13, marginBottom: 14 }}>
                  {featured.rating}/5 · {featured.reviews} avis vérifiés
                </p>
                <p style={{ color: 'var(--bark-2)', lineHeight: 1.7, marginBottom: 20, fontSize: 'clamp(13px, 2vw, 14.5px)' }}>
                  {featured.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>
                  {featured.features.slice(0, 4).map((f, i) => (
                    <span key={i} style={{
                      padding: '6px 13px', borderRadius: 6, fontSize: 11.5, fontWeight: 600,
                      background: 'var(--sand)', color: 'var(--bark-2)',
                      border: '1px solid var(--border)',
                    }}>{f}</span>
                  ))}
                </div>

                <div style={{
                  display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 22, flexWrap: 'wrap',
                }}>
                  <span style={{
                    fontSize: 'clamp(30px, 5vw, 40px)',
                    fontWeight: 700, color: 'var(--bark)', letterSpacing: '-0.02em',
                  }}>{featured.price.toFixed(2)} €</span>
                  <span style={{ fontSize: 15, color: 'var(--bark-3)', textDecoration: 'line-through' }}>
                    {featured.oldPrice.toFixed(2)} €
                  </span>
                  <span style={{
                    background: 'var(--olive-bg)', color: 'var(--olive-dark)', fontWeight: 700,
                    fontSize: 12, borderRadius: 6, padding: '5px 12px',
                  }}>Économisez {(featured.oldPrice - featured.price).toFixed(2)} €</span>
                </div>

                <Link to={`/produit/${featured.slug}`} className="btn-primary">
                  Voir le produit
                </Link>
              </div>
            </div>
          </div>

          <style>{`
            @media (max-width: 640px) {
              .featured-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>
      )}

      {/* ═══ Bestsellers ═════════════════════════ */}
      <section className="section-pad">
        <div className="container">
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: 'clamp(24px, 4vw, 36px)', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <div className="section-eyebrow">Les plus vendus</div>
              <h2>Bestsellers</h2>
            </div>
            <Link to="/catalogue" className="btn-ghost" style={{ fontSize: 12.5 }}>Tout voir →</Link>
          </div>
          <div className="product-grid">
            {bestsellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ═══ Nouveautés ══════════════════════════ */}
      <section className="section-pad" style={{ background: 'var(--sand)' }}>
        <div className="container">
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: 'clamp(24px, 4vw, 36px)', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <div className="section-eyebrow">Fraîchement arrivés</div>
              <h2>Nouveautés</h2>
            </div>
            <Link to="/catalogue" className="btn-ghost" style={{ fontSize: 12.5 }}>Tout voir →</Link>
          </div>
          <div className="product-grid">
            {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ═══ Témoignages ════════════════════════ */}
      <section className="section-pad">
        <div className="container">
          <div className="section-eyebrow">Ils l'ont testé</div>
          <h2 style={{ marginBottom: 'clamp(24px, 4vw, 36px)' }}>Ce que nos clients en disent</h2>
          <div className="reviews-grid" style={{ gap: 14 }}>
            {[
              {
                name: 'Claire', city: 'Lyon', initial: 'C', tint: 'var(--terracotta-bg)',
                product: 'Lave-linge Inverter Pro 9kg',
                text: 'Livré en 2 jours, installé sans accroc. Le moteur inverter est vraiment silencieux — on oublie qu\'il tourne.',
              },
              {
                name: 'Marc', city: 'Bordeaux', initial: 'M', tint: 'var(--olive-bg)',
                product: 'Robot Aspirateur LiDAR',
                text: 'Il cartographie toute la maison et rentre tout seul se recharger. Mon chat l\'observe… et moi aussi.',
              },
              {
                name: 'Sofia', city: 'Saragosse', initial: 'S', tint: 'var(--sand)',
                product: 'Friteuse à Air Smart 5.5L',
                text: '80% de gras en moins et ça croustille pour de vrai. Le rapport qualité-prix est imbattable.',
              },
            ].map(r => (
              <div key={r.name} className="card" style={{
                padding: 'clamp(20px, 3vw, 26px)',
                display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: r.tint, border: '1px solid var(--border-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 15, color: 'var(--bark)',
                  }}>{r.initial}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{r.name} — {r.city}</div>
                    <div style={{ display: 'flex', gap: 2, marginTop: 3, color: 'var(--terracotta)' }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <StarIcon key={n} size={11} />
                      ))}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--bark-2)', flex: 1 }}>
                  « {r.text} »
                </p>
                <div style={{
                  fontSize: 11, color: 'var(--bark-3)', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', color: 'var(--terracotta)' }}>
                    <CheckIcon size={12} />
                  </span>
                  Achat vérifié · {r.product}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Crédibilité marque ═════════════════ */}
      <section className="section-pad" style={{ background: 'var(--sand)' }}>
        <div className="container">
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 6vw, 64px)',
            alignItems: 'center',
          }} className="brand-grid">
            <div>
              <div className="section-eyebrow">Qui se cache derrière la boutique ?</div>
              <h2 style={{ marginBottom: 14, fontSize: 'clamp(20px, 4vw, 28px)' }}>
                Un distributeur agréé du groupe BSH
              </h2>
              <p style={{ color: 'var(--bark-2)', fontSize: 'clamp(13px, 2vw, 14.5px)', lineHeight: 1.7, marginBottom: 22, maxWidth: 460 }}>
                Nous vendons les marques Bosch, Siemens et Neff — sans intermédiaire fantôme.
                Livraison depuis notre entrepôt de Saragosse, service technique officiel sur toute l'Espagne.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['Bosch', 'Siemens', 'Neff', 'BSH Groupe'].map(brand => (
                  <span key={brand} style={{
                    background: 'var(--cream)', border: '1px solid var(--border-2)',
                    borderRadius: 6, padding: '8px 16px',
                    fontSize: 13, fontWeight: 700, color: 'var(--bark)',
                  }}>{brand}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="brand-stats">
              {[
                { value: '2 000', label: 'employés dans le groupe' },
                { value: '1967', label: 'année de fondation' },
                { value: '90 M€', label: 'de capital social' },
                { value: '1', label: 'service technique officiel' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--cream)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: 'clamp(16px, 3vw, 22px)',
                }}>
                  <div style={{
                    fontSize: 'clamp(24px, 4vw, 32px)',
                    fontWeight: 700, color: 'var(--terracotta)',
                  }}>{s.value}</div>
                  <div style={{ fontSize: 11.5, marginTop: 4, color: 'var(--bark-3)' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .brand-grid { grid-template-columns: 1fr !important; }
            .brand-stats { grid-template-columns: 1fr 1fr !important; }
            .suivi-grid { grid-template-columns: 1fr !important; }
            .proc-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══ Newsletter ═════════════════════════ */}
      <Newsletter />

      {/* ═══ CTA ═════════════════════════════════ */}
      <section style={{
        padding: 'clamp(48px, 8vw, 80px) var(--page-side)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
        background: 'var(--terracotta)',
      }}>
        <div style={{ maxWidth: 520, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            color: '#fff', fontSize: 'clamp(20px, 4vw, 28px)',
            marginBottom: 12, fontWeight: 700,
          }}>Un doute, une question ?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(13px, 2vw, 15px)', marginBottom: 26, lineHeight: 1.7 }}>
            On répond vite, sans script. Devis gratuit sous 24h.
          </p>
          <Link to="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--terracotta-dark)' }}>
            Écrire au service client
          </Link>
        </div>
      </section>
    </main>
  );
}