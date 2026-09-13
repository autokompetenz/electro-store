import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products as localProducts } from '../data/products';
import ProductVisual from '../components/ProductVisual';
import { productImages } from '../data/images';
import { CheckIcon } from '../components/Icons';
import { createOrder, getProducts } from '../api';

const FREE_SHIPPING = 99;

export default function Cart() {
  const { items, removeItem, updateQty, addItem, clearCart, totalPrice, totalSavings, totalItems } = useCart();
  const [ordered, setOrdered] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [bank, setBank] = useState(null);
  const [allProducts, setAllProducts] = useState(localProducts);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    let alive = true;
    getProducts()
      .then(list => { if (alive && list?.length) setAllProducts(list); })
      .catch(() => { /* fallback données locales */ });
    return () => { alive = false; };
  }, []);

  const placeOrder = async () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !country.trim() || !address.trim()) {
      setOrderError('Completa todos los campos de envío.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setOrderError('Introduce una dirección de correo electrónico válida.');
      return;
    }
    if (!acceptTerms) {
      setOrderError('Acepta las condiciones de pago y de entrega para finalizar el pedido.');
      return;
    }
    setPlacing(true);
    setOrderError('');
    try {
      const res = await createOrder({
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country: country.trim(),
        address: address.trim(),
        notes: notes.trim(),
        items: items.map(i => ({ id: i.product.id, qty: i.qty })),
      });
      setOrderId(res.id);
      const lastInfo = { ref: res.id, email: email.trim(), phone: phone.trim(), country: country.trim() };
      try { localStorage.setItem('es-last-order', JSON.stringify(lastInfo)); } catch {}
      setBank(res.bank || null);
      clearCart();
      setOrdered(true);
    } catch (e) {
      setOrderError(e.message || "No se ha podido registrar el pedido.");
    } finally {
      setPlacing(false);
    }
  };

  if (ordered) {
    return (
      <main className="section-pad" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 var(--page-side)' }}>
          <div style={{
            width: 68, height: 68, borderRadius: 18, margin: '0 auto 22px',
            background: 'var(--terracotta-bg)', border: '1px solid var(--terracotta-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--terracotta)',
          }}>
            <CheckIcon size={30} />
          </div>
          <h2 style={{ fontSize: 20, marginBottom: 10 }}>
            Pedido {orderId ? `n.º ${orderId} ` : ''}confirmado
          </h2>
          <p style={{ color: 'var(--bark-3)', fontSize: 14.5, marginBottom: 28, lineHeight: 1.7 }}>
            Tu pedido se ha enviado correctamente. Te hemos enviado un correo de confirmación
            con un enlace para seguir tu pedido en tiempo real.
          </p>

          {bank && (
            <div className="card" style={{
              padding: 18, marginBottom: 20,
              background: 'var(--cream)', border: '1px dashed var(--border-2)', textAlign: 'left',
            }}>
              <div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--bark-3)', marginBottom: 10 }}>
                Pago por transferencia: realiza la transferencia con la siguiente información:
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                {[
                  ['Titular', bank.titular],
                  ['IBAN', bank.iban],
                  ['BIC', bank.bic],
                  ['Concepto a indicar', bank.motif],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td style={{ padding: '5px 0', color: 'var(--bark-3)' }}>{label}</td>
                    <td style={{ padding: '5px 0', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', wordBreak: 'break-all', verticalAlign: 'top' }}>{value}</td>
                  </tr>
                ))}
              </table>
              <p style={{ fontSize: 11.5, color: 'var(--bark-3)', marginTop: 10, textAlign: 'center' }}>
                Tu pedido se enviará en cuanto recibamos la transferencia.
              </p>
            </div>
          )}
          {orderId && (
            <Link
              to={`/suivi-commande?ref=${orderId}`}
              className="btn-primary"
              style={{ marginBottom: 10, display: 'inline-block' }}
            >
              Seguir mi pedido
            </Link>
          )}
          <div style={{ marginTop: 10 }}>
            <Link to="/catalogue" style={{
              fontSize: 13.5, color: 'var(--terracotta)', textDecoration: 'none',
              fontWeight: 600,
            }}>Seguir comprando</Link>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="section-pad" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 var(--page-side)' }}>
          <div style={{
            width: 68, height: 68, borderRadius: 18, margin: '0 auto 22px',
            background: 'var(--terracotta-bg)', border: '1px solid var(--terracotta-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--terracotta)',
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <h2 style={{ fontSize: 20, marginBottom: 10 }}>Carrito vacío</h2>
          <p style={{ color: 'var(--bark-3)', fontSize: 14.5, marginBottom: 28 }}>
            Todavía no has añadido nada. Explora nuestra selección.
          </p>
          <Link to="/catalogue" className="btn-primary">Ver el catálogo</Link>
        </div>
      </main>
    );
  }

  const shortage = Math.max(0, FREE_SHIPPING - totalPrice);
  const progress = Math.min(100, (totalPrice / FREE_SHIPPING) * 100);

  // Suggestions : même catégorie d'abord, puis bestsellers hors panier
  const inCart = new Set(items.map(i => i.product.id));
  const sameCat = allProducts.filter(p =>
    p.category === items[0].product.category && !inCart.has(p.id)
  );
  const others = allProducts.filter(p =>
    !inCart.has(p.id) && p.category !== items[0].product.category &&
    (p.badge === 'bestseller' || p.badge === 'eco' || p.rating >= 4.8)
  );
  const suggestions = [...sameCat, ...others].slice(0, 3);

  return (
    <main className="section-pad">
      <div className="container">
        <div className="section-eyebrow">Tu selección</div>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', marginBottom: 'clamp(28px, 4vw, 44px)' }}>
          Carrito{totalItems > 0 && ` (${totalItems})`}
        </h1>

        <div style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr',
          gap: 'clamp(24px, 4vw, 48px)', alignItems: 'start',
        }} className="cart-grid">

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(item => {
              const p = item.product;
              return (
                <div key={p.id} className="card" style={{
                  padding: 'clamp(14px, 2.5vw, 20px)',
                  display: 'grid',
                  gridTemplateColumns: 'clamp(56px, 9vw, 64px) 1fr auto',
                  gap: 'clamp(12px, 2vw, 18px)', alignItems: 'center',
                }}>
                  <div style={{
                    background: 'var(--sand)', border: '1px solid var(--border)',
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 6, overflow: 'hidden',
                  }}>
                    {p.image || productImages[p.slug] ? (
                      <img src={p.image || productImages[p.slug]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }} />
                    ) : (
                      <ProductVisual category={p.category} style={{ width: '100%', height: 'auto' }} />
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <h3 style={{
                      fontSize: 'clamp(13px, 2.2vw, 14.5px)',
                      fontWeight: 600, marginBottom: 3,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{p.name}</h3>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--terracotta)' }}>
                      {p.price.toFixed(2)} €
                      {p.oldPrice && p.oldPrice > p.price && (
                        <span style={{ fontSize: 11.5, color: 'var(--bark-3)', textDecoration: 'line-through', fontWeight: 400, marginLeft: 6 }}>
                          {p.oldPrice.toFixed(2)} €
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <button
                      onClick={() => updateQty(p.id, item.qty - 1)}
                      aria-label="Reducir la cantidad"
                      style={{
                        width: 38, height: 38,
                        border: '1px solid var(--border)', borderRadius: '6px 0 0 6px',
                        background: 'var(--cream)', fontSize: 16, color: 'var(--bark-2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.target.style.background = 'var(--sand)'}
                      onMouseLeave={e => e.target.style.background = 'var(--cream)'}
                    >−</button>
                    <span style={{
                      width: 40, height: 38,
                      borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
                      background: 'var(--cream)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13.5, fontWeight: 600,
                    }}>{item.qty}</span>
                    <button
                      onClick={() => updateQty(p.id, item.qty + 1)}
                      aria-label="Aumentar la cantidad"
                      style={{
                        width: 38, height: 38,
                        border: '1px solid var(--border)', borderRadius: '0 6px 6px 0',
                        background: 'var(--cream)', fontSize: 16, color: 'var(--bark-2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.target.style.background = 'var(--sand)'}
                      onMouseLeave={e => e.target.style.background = 'var(--cream)'}
                    >+</button>
                    <button
                      onClick={() => removeItem(p.id)}
                      aria-label="Eliminar del carrito"
                      style={{
                        marginLeft: 8, width: 36, height: 38,
                        border: 'none', background: 'transparent',
                        color: 'var(--bark-3)', fontSize: 18,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 6, transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.target.style.background = 'rgba(87,187,79,0.08)';
                        e.target.style.color = 'var(--terracotta)';
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--bark-3)';
                      }}
                    >×</button>
                  </div>
                </div>
              );
            })}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="card" style={{ padding: 'clamp(18px, 3vw, 24px)', marginTop: 8 }}>
                <h3 style={{ fontSize: 15, marginBottom: 16 }}>También te puede gustar</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {suggestions.map(p => (
                    <div key={p.id} style={{
                      display: 'grid',
                      gridTemplateColumns: 'clamp(48px, 8vw, 56px) 1fr auto',
                      gap: 12, alignItems: 'center',
                      padding: '10px 12px', borderRadius: 12,
                      border: '1px solid var(--border)',
                      background: 'var(--cream)',
                      transition: 'border-color 0.2s',
                    }}>
                      <div style={{
                        background: 'var(--sand)', borderRadius: 10, padding: 4,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden',
                      }}>
                        {p.image || productImages[p.slug] ? (
                          <img src={p.image || productImages[p.slug]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }} />
                        ) : (
                          <ProductVisual category={p.category} style={{ width: '100%', height: 'auto' }} />
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <Link to={`/produit/${p.slug}`} style={{
                          fontSize: 13, fontWeight: 600, color: 'var(--bark)',
                          textDecoration: 'none', display: 'block',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{p.name}</Link>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--terracotta)', marginTop: 2 }}>
                          {p.price.toFixed(2)} €
                        </div>
                      </div>
                      <button
                        className="btn-primary"
                        style={{ height: 40, padding: '0 14px', fontSize: 12.5 }}
                        onClick={() => addItem(p)}
                      >Añadir</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card" style={{ padding: 'clamp(20px, 3vw, 28px)', position: 'sticky', top: 88 }}>
            <h2 style={{ fontSize: 17, marginBottom: 20 }}>Resumen</h2>

            {/* Livraison progress */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 12.5, marginBottom: 8, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                {shortage > 0 ? (
                  <span style={{ color: 'var(--bark-2)' }}>
                    Te faltan <strong style={{ color: 'var(--terracotta)' }}>{shortage.toFixed(2)} €</strong> para el envío gratis
                  </span>
                ) : (
                  <strong style={{ color: 'var(--olive-dark)' }}>¡Envío gratis conseguido!</strong>
                )}
              </div>
              <div style={{
                height: 6, borderRadius: 100,
                background: 'var(--sand)', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: `${progress}%`,
                  borderRadius: 100,
                  background: shortage > 0 ? 'var(--terracotta)' : 'var(--olive)',
                  transition: 'width 0.4s var(--ease)',
                }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--bark-2)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>{totalPrice.toFixed(2)} €</span>
              </div>
              {totalSavings > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--olive-dark)' }}>Ahorro</span>
                  <span style={{ fontWeight: 600, color: 'var(--olive-dark)' }}>-{totalSavings.toFixed(2)} €</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--bark-2)' }}>Envío</span>
                <span style={{ fontWeight: 600, color: 'var(--olive-dark)' }}>
                  {shortage > 0 ? `${FREE_SHIPPING.toFixed(2)} €` : 'Gratis'}
                </span>
              </div>
            </div>

            <div className="warm-divider" />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, marginBottom: 24 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Total</span>
              <span style={{
                fontSize: 22, fontWeight: 700,
                color: 'var(--bark)',
              }}>{totalPrice.toFixed(2)} €</span>
            </div>

            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Envío y pago</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <div className="cart-fields-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)' }}>
                  Nombre *
                  <input
                    className="input-luxury"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="María"
                    style={{ width: '100%' }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)' }}>
                  Apellidos *
                  <input
                    className="input-luxury"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="García"
                    style={{ width: '100%' }}
                  />
                </label>
              </div>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)' }}>
                Correo electrónico *
                <input
                  className="input-luxury"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="maria@ejemplo.es"
                  style={{ width: '100%' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)' }}>
                Teléfono *
                <input
                  className="input-luxury"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="612 34 56 78"
                  style={{ width: '100%' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)' }}>
                País *
                <input
                  className="input-luxury"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="España"
                  style={{ width: '100%' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)' }}>
                Dirección postal *
                <textarea
                  className="input-luxury"
                  style={{ minHeight: 74 }}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Número y calle, código postal, ciudad"
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)' }}>
                Notas
                <textarea
                  className="input-luxury"
                  style={{ minHeight: 74 }}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Instrucciones de entrega, punto de recogida, etc. (opcional)"
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, lineHeight: 1.5, color: 'var(--bark-2)' }}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  style={{ width: 17, height: 17, marginTop: 1, accentColor: 'var(--terracotta)', cursor: 'pointer' }}
                />
                <span>
                  He leído y acepto las{' '}
                  <Link to="/cgv" style={{ color: 'var(--terracotta)', fontWeight: 600, textDecoration: 'none' }}>Condiciones Generales de Venta</Link>{' '}
                  y las{' '}
                  <Link to="/livraison-retours" style={{ color: 'var(--terracotta)', fontWeight: 600, textDecoration: 'none' }}>condiciones de pago y entrega</Link>. *
                </span>
              </label>
            </div>

            {orderError && (
              <p style={{ color: 'var(--terracotta)', fontSize: 12, marginBottom: 10, textAlign: 'center' }}>
                {orderError}
              </p>
            )}

            <button
              className="btn-primary"
              style={{ width: '100%' }}
              onClick={placeOrder}
              disabled={placing}
            >
              {placing ? 'Registrando…' : 'Realizar pedido'}
            </button>
            <p style={{ fontSize: 11, color: 'var(--bark-3)', textAlign: 'center', marginTop: 12 }}>
              Pago seguro · Devolución gratuita de 30 días
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .cart-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .cart-fields-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}