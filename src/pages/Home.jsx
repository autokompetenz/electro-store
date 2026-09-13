import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories as localCategories, products as localProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductGrid from '../components/ProductGrid';
import ProductVisual from '../components/ProductVisual';
import Newsletter from '../components/Newsletter';
import { TruckIcon, ShieldIcon, ReturnIcon, CheckIcon, StarIcon, CartIcon, MailIcon, CardIcon } from '../components/Icons';
import { heroKitchen, heroLaundry, productImages, categoryImages, coupCoeurRobot } from '../data/images';
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
  const deals = products
    .filter(p => p.oldPrice && p.oldPrice > p.price)
    .sort((a, b) => (b.oldPrice / b.price) - (a.oldPrice / a.price))
    .slice(0, 4);

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
              <div className="section-eyebrow">Tienda especializada · Electrodomésticos</div>
              <h1 style={{
                color: 'var(--bark)', marginBottom: 'clamp(16px, 3vw, 22px)',
                fontSize: 'clamp(28px, 5.5vw, 48px)', fontWeight: 700, lineHeight: 1.1,
              }}>
                Electrodomésticos pensados<br />
                <span style={{ color: 'var(--terracotta)' }}>
                  para tu día a día.
                </span>
              </h1>
              <p style={{
                color: 'var(--bark-2)', fontSize: 'clamp(14px, 2vw, 16px)', maxWidth: 460,
                marginBottom: 'clamp(24px, 4vw, 34px)', lineHeight: 1.7,
              }}>
                Descubre una selección de aparatos fiables, modernos y
                eficientes para equipar tu hogar — enviados desde nuestro
                almacén, con garantía y sin sorpresas en la instalación.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/catalogue" className="btn-primary">Descubrir nuestros productos</Link>
                <a href="#offres" className="btn-ghost">Ver las ofertas</a>
              </div>

              {/* Trust */}
              <div style={{
                display: 'flex', gap: 'clamp(20px, 4vw, 30px)', marginTop: 'clamp(28px, 4vw, 40px)',
              }} className="trust-row">
                {[
                  { icon: <TruckIcon />, text: 'Envío 2-5 días' },
                  { icon: <ShieldIcon />, text: 'Garantía 3 años' },
                  { icon: <ReturnIcon />, text: 'Devolución 30 días' },
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
                  alt="Lavadora y secadora empotradas"
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
                  -15% Más vendido
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
                  4.8 · 234 reseñas
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
            { value: '4.7', label: 'nota media', suffix: '★' },
            { value: '487', label: 'reseñas verificadas', suffix: '+' },
            { value: '3', label: 'años de garantía', suffix: '' },
            { value: '98', label: 'de clientes satisfechos', suffix: '%' },
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

      {/* ═══ Nos marques ════════════════════════ */}
      <section style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '26px var(--page-side)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'clamp(14px, 3vw, 28px)',
            justifyContent: 'center',
          }} className="brand-strip">
            {['BOSCH', 'SIEMENS', 'SAMSUNG', 'LG', 'NEFF', 'WHIRLPOOL', 'BEKO', 'ELECTROLUX'].map(b => (
              <span key={b} style={{
                fontSize: 'clamp(12px, 2vw, 15px)', fontWeight: 700,
                letterSpacing: '0.08em', color: 'var(--bark-3)', opacity: 0.7,
                whiteSpace: 'nowrap',
              }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Procédure de commande ═══════════════ */}
      <section className="section-pad" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="section-eyebrow">Proceso de pedido</div>
          <h2 style={{ marginBottom: 'clamp(24px, 4vw, 36px)' }}>¿Cómo hacer un pedido?</h2>
          <div className="proc-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'clamp(14px, 2.5vw, 20px)',
          }}>
            {[
              {
                n: 1, icon: <CartIcon />, title: 'Elige tus productos',
                text: 'Navega por el catálogo, selecciona tus electrodomésticos y añádelos al carrito.',
              },
              {
                n: 2, icon: <MailIcon />, title: 'Haz el pedido',
                text: 'Facilita tus datos de contacto. Recibirás al instante un correo de confirmación con los datos bancarios para pagar por transferencia.',
              },
              {
                n: 3, icon: <CheckIcon />, title: 'Paga por transferencia',
                text: 'Transfiere el importe indicando el concepto que aparece en el correo. Tu pedido se confirma en cuanto recibimos la transferencia.',
              },
              {
                n: 4, icon: <TruckIcon />, title: 'Envío en 2 a 5 días',
                text: 'Enviamos desde nuestro almacén. Puedes seguir el estado de tu pedido en cada paso.',
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
                  Paso {s.n}
                </div>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--bark-3)', lineHeight: 1.7 }}>{s.text}</p>
              </div>
            ))}
          </div>
          <Link to="/comment-commander" className="btn-ghost" style={{ marginTop: 24, fontSize: 13 }}>
            Saber más sobre cómo hacer un pedido →
          </Link>
        </div>
      </section>

      {/* ═══ Suivi de commande ═══════════════════ */}
      <section className="section-pad" style={{ background: 'var(--cream-2)' }}>
        <div className="container">
          <div className="section-eyebrow">Seguimiento en tiempo real</div>
          <h2 style={{ marginBottom: 'clamp(24px, 4vw, 36px)' }}>Sigue tu pedido</h2>
          <div style={{ maxWidth: 600, color: 'var(--bark-3)', lineHeight: 1.7, fontSize: 14, marginBottom: 'clamp(24px, 4vw, 32px)' }}>
            Cada paso de tu pedido genera un correo automático.
            También puedes comprobar el estado en cualquier momento desde la página de seguimiento.
          </div>
          <div className="suivi-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'clamp(14px, 2.5vw, 20px)',
          }}>
            {[
              {
                n: 1, pill: 'Pendiente', pillBg: 'var(--sand)', pillColor: 'var(--bark-3)',
                title: 'Pedido realizado', icon: <CartIcon />,
                text: 'Tu pedido queda registrado. Recibirás el correo con los datos de pago.',
              },
              {
                n: 2, pill: 'Confirmado', pillBg: '#eaf4e6', pillColor: '#2f7d32',
                title: 'Pago recibido', icon: <CheckIcon />,
                text: 'Hemos recibido la transferencia: estamos preparando tu paquete.',
              },
              {
                n: 3, pill: 'Enviado', pillBg: '#eaf4e6', pillColor: '#2f7d32',
                title: 'En camino', icon: <TruckIcon />,
                text: 'Tu paquete está de camino a tu casa.',
              },
              {
                n: 4, pill: 'Entregado', pillBg: 'var(--olive-bg)', pillColor: 'var(--olive-dark)',
                title: 'Pedido entregado', icon: <CheckIcon />,
                text: 'Tu pedido ha llegado. ¡Que lo disfrutes!',
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
            <Link to="/suivi-commande" className="btn-primary">Seguir mi pedido</Link>
            <span style={{ fontSize: 12, color: 'var(--bark-3)' }}>
              Introduce el número de pedido o tu correo electrónico.
            </span>
          </div>
        </div>
      </section>

      {/* ═══ Catégories ══════════════════════════ */}
      <section className="section-pad">
        <div className="container">
          <div className="section-eyebrow">Explorar</div>
          <h2 style={{ marginBottom: 6 }}>Nuestras categorías</h2>
          <p style={{ color: 'var(--bark-3)', fontSize: 13.5, marginBottom: 'clamp(24px, 4vw, 32px)' }}>
            Frío, lavado, cocción y pequeños electrodomésticos: encuentra el aparato que necesitas.
          </p>
          <div className="category-cards" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
            gap: 14,
          }}>
            {categories.map((cat, i) => {
              const isGem = cat.type === 'GEM';
              const count = products.filter(p => p.category === cat.id).length;
              return (
                <Link key={cat.id} to={`/catalogue?cat=${cat.id}`}
                  className="card"
                  style={{
                    textDecoration: 'none', overflow: 'hidden', display: 'flex',
                    flexDirection: 'column',
                    animation: `fadeUp 0.5s var(--ease) ${i * 0.06}s both`,
                  }}
                >
                  <div style={{
                    aspectRatio: '16 / 10',
                    background: 'var(--sand)', overflow: 'hidden', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {categoryImages[cat.id] ? (
                      <img
                        src={categoryImages[cat.id]}
                        alt={cat.name}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s var(--ease)' }}
                        className="product-img-zoom"
                      />
                    ) : (
                      <ProductVisual category={cat.id} style={{ width: '60%', height: 'auto' }} />
                    )}
                  </div>
                  <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.09em',
                      color: isGem ? 'var(--terracotta)' : 'var(--olive-dark)',
                      marginBottom: 4,
                    }}>{cat.type}</div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{cat.name}</h3>
                    <p style={{ fontSize: 12.5, color: 'var(--bark-3)', lineHeight: 1.5, marginBottom: 10 }}>
                      {cat.description}
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 700, color: 'var(--terracotta)' }}>
                      Ver los productos
                      {count > 0 && <span style={{
                        background: 'var(--sand)', color: 'var(--bark-3)',
                        borderRadius: 100, padding: '1px 8px', fontSize: 11, fontWeight: 600,
                      }}>{count}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Pourquoi nous choisir ═════════════ */}
      <section className="section-pad" style={{ background: 'var(--sand)' }}>
        <div className="container">
          <div className="section-eyebrow">Confianza</div>
          <h2 style={{ marginBottom: 'clamp(24px, 4vw, 36px)' }}>¿Por qué elegirnos?</h2>
          <div className="trust-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
            gap: 14,
          }}>
            {[
              { icon: <TruckIcon size={22} />, title: 'Envío rápido', text: 'Envío en 24h desde nuestro almacén. Entrega en 2 a 5 días laborables.' },
              { icon: <ShieldIcon size={22} />, title: 'Garantía del fabricante', text: 'Todos nuestros productos incluyen garantías adaptadas, hasta 3 años.' },
              { icon: <CardIcon size={22} />, title: 'Pago seguro', text: 'Pago por transferencia bancaria segura y verificada, con confirmación por correo.' },
              { icon: <ReturnIcon size={22} />, title: 'Devoluciones fáciles', text: '30 días para cambiar de opinión. Devoluciones sencillas y reembolso rápido.' },
            ].map(s => (
              <div key={s.title} className="card" style={{ padding: 'clamp(18px, 3vw, 24px)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{
                  width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                  background: 'var(--terracotta-bg)', color: 'var(--terracotta)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{s.icon}</span>
                <div>
                  <h3 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 4 }}>{s.title}</h3>
                  <p style={{ fontSize: 12.5, color: 'var(--bark-3)', lineHeight: 1.6 }}>{s.text}</p>
                </div>
              </div>
            ))}
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
                <div className="section-eyebrow" style={{ marginBottom: 14 }}>Nuestra favorita de la semana</div>
                <h2 style={{ fontSize: 'clamp(20px, 4vw, 30px)', marginBottom: 8 }}>
                  {featured.name}
                </h2>
                <p style={{ color: 'var(--bark-3)', fontSize: 13, marginBottom: 14 }}>
                  {featured.rating}/5 · {featured.reviews} reseñas verificadas
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
                  }}>Ahorra {(featured.oldPrice - featured.price).toFixed(2)} €</span>
                </div>

                <Link to={`/produit/${featured.slug}`} className="btn-primary">
                  Ver el producto
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

      {/* ═══ Offres du moment ═══════════════════ */}
      <section id="offres" className="section-pad" style={{ background: 'var(--sand)' }}>
        <div className="container">
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: 'clamp(24px, 4vw, 36px)', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <div className="section-eyebrow" style={{ color: 'var(--olive-dark)' }}>Promociones</div>
              <h2>Nuestras ofertas del momento</h2>
            </div>
            <Link to="/catalogue?promo=1" className="btn-ghost" style={{ fontSize: 12.5 }}>Ver todo →</Link>
          </div>
          {deals.length === 0 ? (
            <p style={{ color: 'var(--bark-3)', fontSize: 14 }}>No hay ofertas por ahora.</p>
          ) : (
            <ProductGrid>
              {deals.map(p => <ProductCard key={p.id} product={p} />)}
            </ProductGrid>
          )}
        </div>
      </section>

      {/* ═══ Bestsellers ═════════════════════════ */}
      <section className="section-pad">
        <div className="container">
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: 'clamp(24px, 4vw, 36px)', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <div className="section-eyebrow">Los más vendidos</div>
              <h2>Más vendidos</h2>
            </div>
            <Link to="/catalogue" className="btn-ghost" style={{ fontSize: 12.5 }}>Ver todo →</Link>
          </div>
          <ProductGrid>
            {bestsellers.map(p => <ProductCard key={p.id} product={p} />)}
          </ProductGrid>
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
              <div className="section-eyebrow">Recién llegados</div>
              <h2>Novedades</h2>
            </div>
            <Link to="/catalogue" className="btn-ghost" style={{ fontSize: 12.5 }}>Ver todo →</Link>
          </div>
          <ProductGrid>
            {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </ProductGrid>
        </div>
      </section>

      {/* ═══ Inspiration ════════════════════════ */}
      <section className="section-pad">
        <div className="container">
          <div className="section-eyebrow">Consejos y guías</div>
          <h2 style={{ marginBottom: 'clamp(24px, 4vw, 36px)' }}>Inspírate</h2>
          <div className="inspo-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: 16,
          }}>
            {[
              {
                img: categoryImages['four-plaque'], tag: 'Cocina',
                title: 'Una cocina moderna empieza por los electrodomésticos adecuados',
                to: '/catalogue?cat=four-plaque', cta: 'Descubrir la cocción',
              },
              {
                img: categoryImages['refrigerateur'], tag: 'Frío',
                title: '¿Cómo elegir tu frigorífico?',
                to: '/catalogue?cat=refrigerateur', cta: 'Ver los frigoríficos',
              },
              {
                img: coupCoeurRobot, tag: 'Mantenimiento',
                title: 'Los imprescindibles para una casa que se mantiene sola',
                to: '/catalogue?cat=aspirateur', cta: 'Ver las aspiradoras',
              },
            ].map((a, i) => (
              <Link key={i} to={a.to} className="card" style={{
                textDecoration: 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                animation: `fadeUp 0.5s var(--ease) ${i * 0.07}s both`,
              }}>
                <div style={{ aspectRatio: '16 / 10', overflow: 'hidden', background: 'var(--sand)', flexShrink: 0 }}>
                  <img src={a.img} alt={a.title} loading="lazy" className="product-img-zoom" style={{
                    width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s var(--ease)',
                  }} />
                </div>
                <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{
                    alignSelf: 'flex-start', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.09em', color: 'var(--terracotta)', marginBottom: 8,
                  }}>{a.tag}</span>
                  <h3 style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.35, marginBottom: 12 }}>{a.title}</h3>
                  <span style={{ marginTop: 'auto', fontSize: 12.5, fontWeight: 700, color: 'var(--terracotta)' }}>
                    {a.cta} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Témoignages ════════════════════════ */}
      <section className="section-pad">
        <div className="container">
          <div className="section-eyebrow">Ellos lo han probado</div>
          <h2 style={{ marginBottom: 'clamp(24px, 4vw, 36px)' }}>Lo que dicen nuestros clientes</h2>
          <div className="reviews-grid" style={{ gap: 14 }}>
            {[
              {
                name: 'Claire', city: 'Lyon', initial: 'C', tint: 'var(--terracotta-bg)',
                product: 'Lave-linge Inverter Pro 9kg',
                text: 'Lo entregaron en 2 días y se instaló sin problemas. El motor inverter es muy silencioso: te olvidas de que está funcionando.',
              },
              {
                name: 'Marc', city: 'Bordeaux', initial: 'M', tint: 'var(--olive-bg)',
                product: 'Robot Aspirateur LiDAR',
                text: 'Cartografía toda la casa y vuelve solo a recargarse. Mi gato lo observa… y yo también.',
              },
              {
                name: 'Sofia', city: 'Zaragoza', initial: 'S', tint: 'var(--sand)',
                product: 'Friteuse à Air Smart 5.5L',
                text: '80% menos de grasa y crujiente de verdad. La relación calidad-precio es inmejorable.',
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
                  Compra verificada · {r.product}
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
              <div className="section-eyebrow">¿Quién está detrás de la tienda?</div>
              <h2 style={{ marginBottom: 14, fontSize: 'clamp(20px, 4vw, 28px)' }}>
                Un distribuidor autorizado del grupo BSH
              </h2>
              <p style={{ color: 'var(--bark-2)', fontSize: 'clamp(13px, 2vw, 14.5px)', lineHeight: 1.7, marginBottom: 22, maxWidth: 460 }}>
                Vendemos las marcas Bosch, Siemens y Neff — sin intermediarios fantasma.
                Envío desde nuestro almacén de Zaragoza, servicio técnico oficial en toda España.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['Bosch', 'Siemens', 'Neff', 'BSH Grupo'].map(brand => (
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
                { value: '2 000', label: 'empleados en el grupo' },
                { value: '1967', label: 'año de fundación' },
                { value: '90 M€', label: 'de capital social' },
                { value: '1', label: 'servicio técnico oficial' },
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
          }}>¿Tienes alguna duda o pregunta?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(13px, 2vw, 15px)', marginBottom: 26, lineHeight: 1.7 }}>
            Respondemos rápido, sin guiones. Presupuesto gratuito en 24h.
          </p>
          <Link to="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--terracotta-dark)' }}>
            Escribir al servicio de atención al cliente
          </Link>
        </div>
      </section>
    </main>
  );
}