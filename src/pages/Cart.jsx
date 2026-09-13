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
      setOrderError('Merci de remplir tous les champs de livraison.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setOrderError('Merci de saisir une adresse email valide.');
      return;
    }
    if (!acceptTerms) {
      setOrderError('Merci d\'accepter les conditions de paiement et de livraison pour finaliser la commande.');
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
      setOrderError(e.message || "Impossible d'enregistrer la commande.");
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
            Commande {orderId ? `n°${orderId} ` : ''}confirmée
          </h2>
          <p style={{ color: 'var(--bark-3)', fontSize: 14.5, marginBottom: 28, lineHeight: 1.7 }}>
            Un email de confirmation vient de partir vers votre boîte mail,
            avec un lien pour suivre votre commande en direct.
          </p>

          {bank && (
            <div className="card" style={{
              padding: 18, marginBottom: 20,
              background: 'var(--cream)', border: '1px dashed var(--border-2)', textAlign: 'left',
            }}>
              <div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--bark-3)', marginBottom: 10 }}>
                Règlement par virement — effectuez le virement avec les informations suivantes :
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                {[
                  ['Titulaire', bank.titular],
                  ['IBAN', bank.iban],
                  ['BIC', bank.bic],
                  ['Motif à indiquer', bank.motif],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td style={{ padding: '5px 0', color: 'var(--bark-3)' }}>{label}</td>
                    <td style={{ padding: '5px 0', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', wordBreak: 'break-all', verticalAlign: 'top' }}>{value}</td>
                  </tr>
                ))}
              </table>
              <p style={{ fontSize: 11.5, color: 'var(--bark-3)', marginTop: 10, textAlign: 'center' }}>
                Votre commande sera expédiée dès réception du virement.
              </p>
            </div>
          )}
          {orderId && (
            <Link
              to={`/suivi-commande?ref=${orderId}`}
              className="btn-primary"
              style={{ marginBottom: 10, display: 'inline-block' }}
            >
              Suivre ma commande
            </Link>
          )}
          <div style={{ marginTop: 10 }}>
            <Link to="/catalogue" style={{
              fontSize: 13.5, color: 'var(--terracotta)', textDecoration: 'none',
              fontWeight: 600,
            }}>Continuer mes achats</Link>
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
          <h2 style={{ fontSize: 20, marginBottom: 10 }}>Panier vide</h2>
          <p style={{ color: 'var(--bark-3)', fontSize: 14.5, marginBottom: 28 }}>
            Vous n'avez encore rien ajouté. Parcourez notre sélection.
          </p>
          <Link to="/catalogue" className="btn-primary">Voir le catalogue</Link>
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
        <div className="section-eyebrow">Votre sélection</div>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', marginBottom: 'clamp(28px, 4vw, 44px)' }}>
          Panier{totalItems > 0 && ` (${totalItems})`}
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
                      aria-label="Diminuer la quantité"
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
                      aria-label="Augmenter la quantité"
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
                      aria-label="Supprimer du panier"
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
                <h3 style={{ fontSize: 15, marginBottom: 16 }}>Vous pourriez aussi aimer</h3>
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
                      >Ajouter</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card" style={{ padding: 'clamp(20px, 3vw, 28px)', position: 'sticky', top: 88 }}>
            <h2 style={{ fontSize: 17, marginBottom: 20 }}>Récapitulatif</h2>

            {/* Livraison progress */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 12.5, marginBottom: 8, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                {shortage > 0 ? (
                  <span style={{ color: 'var(--bark-2)' }}>
                    Plus que <strong style={{ color: 'var(--terracotta)' }}>{shortage.toFixed(2)} €</strong> pour la livraison offerte
                  </span>
                ) : (
                  <strong style={{ color: 'var(--olive-dark)' }}>Livraison offerte obtenue</strong>
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
                <span style={{ color: 'var(--bark-2)' }}>Sous-total</span>
                <span style={{ fontWeight: 600 }}>{totalPrice.toFixed(2)} €</span>
              </div>
              {totalSavings > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--olive-dark)' }}>Économies</span>
                  <span style={{ fontWeight: 600, color: 'var(--olive-dark)' }}>-{totalSavings.toFixed(2)} €</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--bark-2)' }}>Livraison</span>
                <span style={{ fontWeight: 600, color: 'var(--olive-dark)' }}>
                  {shortage > 0 ? `${FREE_SHIPPING.toFixed(2)} €` : 'Gratuite'}
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

            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Livraison & paiement</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <div className="cart-fields-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)' }}>
                  Prénom *
                  <input
                    className="input-luxury"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Marie"
                    style={{ width: '100%' }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)' }}>
                  Nom *
                  <input
                    className="input-luxury"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Dupont"
                    style={{ width: '100%' }}
                  />
                </label>
              </div>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)' }}>
                Email *
                <input
                  className="input-luxury"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="marie@exemple.fr"
                  style={{ width: '100%' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)' }}>
                Numéro de téléphone *
                <input
                  className="input-luxury"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  style={{ width: '100%' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)' }}>
                Pays *
                <input
                  className="input-luxury"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="France"
                  style={{ width: '100%' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)' }}>
                Adresse postale *
                <textarea
                  className="input-luxury"
                  style={{ minHeight: 74 }}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Numéro et rue, code postal, ville"
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--bark-2)' }}>
                Notes
                <textarea
                  className="input-luxury"
                  style={{ minHeight: 74 }}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Instructions de livraison, point relais, etc. (facultatif)"
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
                  J'accepte les{' '}
                  <Link to="/cgv" style={{ color: 'var(--terracotta)', fontWeight: 600, textDecoration: 'none' }}>conditions générales de vente</Link>{' '}
                  ainsi que les{' '}
                  <Link to="/livraison-retours" style={{ color: 'var(--terracotta)', fontWeight: 600, textDecoration: 'none' }}>conditions de paiement et de livraison</Link>. *
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
              {placing ? 'Enregistrement…' : 'Passer commande'}
            </button>
            <p style={{ fontSize: 11, color: 'var(--bark-3)', textAlign: 'center', marginTop: 12 }}>
              Paiement sécurisé · Retour gratuit 30 jours
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