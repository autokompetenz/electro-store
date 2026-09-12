import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchOrders } from '../api';
import { CheckIcon, ChevronIcon } from '../components/Icons';

const STEPS = [
  { key: 'pending', label: 'Commandée', desc: 'Commande reçue' },
  { key: 'confirmed', label: 'Confirmée', desc: 'Vérification du paiement' },
  { key: 'shipped', label: 'En cours de livraison', desc: 'Votre colis est en route' },
  { key: 'delivered', label: 'Livrée', desc: 'Bien arrivée chez vous' },
];

const STEP_LABEL = {
  ...Object.fromEntries(STEPS.map(s => [s.key, s.label])),
  cancelled: 'Annulée',
  rejected: 'Rejetée',
};

const TERMINAL_STATUS = new Set(['cancelled', 'rejected']);

export default function Suivi() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runSearch = async value => {
    const q = (value || '').trim();
    if (!q) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      setOrder(await searchOrders(q));
    } catch (e) {
      setError(e.message || 'Aucune commande trouvée.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) runSearch(ref);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pré-remplissage : dernière commande mémorisée (écrite par le panier lors du succès)
  useEffect(() => {
    let last = null;
    try { last = JSON.parse(localStorage.getItem('es-last-order') || 'null'); } catch { /* noop */ }
    if (!last?.ref) return;
    setQuery(String(last.ref));
    runSearch(String(last.ref));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = e => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    runSearch(query);
  };

  const stepIndex = order ? STEPS.findIndex(s => s.key === order.status) : -1;

  return (
    <main className="section-pad">
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="section-eyebrow">Suivi de commande</div>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', marginBottom: 10 }}>
          Où en est ma commande ?
        </h1>
        <p style={{ color: 'var(--bark-2)', fontSize: 'clamp(13px, 2vw, 15px)', maxWidth: 560, marginBottom: 'clamp(28px, 4vw, 40px)', lineHeight: 1.7 }}>
          Entrez votre numéro de commande ou l'email utilisé à l'achat.
          Vous avez aussi reçu un lien de suivi par email.
        </p>

        <form onSubmit={submit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ex : 12 ou bonjour@email.fr"
            aria-label="Numéro de commande ou email"
            className="input-luxury"
            style={{ flex: 1, minWidth: 220, height: 'var(--touch)', fontSize: 15 }}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            <ChevronIcon size={14} style={{ transform: 'rotate(90deg)' }} />
            {loading ? 'Recherche…' : 'Suivre'}
          </button>
        </form>

        {error && !order && (
          <div className="card" style={{ padding: 'clamp(20px, 4vw, 32px)', textAlign: 'center' }}>
            <p style={{ color: 'var(--terracotta)', fontSize: 15, marginBottom: 16 }}>{error}</p>
            <p style={{ color: 'var(--bark-3)', fontSize: 13 }}>
              Vérifiez votre saisie ou contactez-nous pour plus d'aide.
            </p>
          </div>
        )}

        {loading && !order && (
          <p style={{ color: 'var(--bark-3)', fontSize: 14 }}>Recherche en cours…</p>
        )}

        {order && (
          <>
            {/* En-tête commande */}
            <div className="card" style={{ padding: 'clamp(20px, 4vw, 32px)', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
                <div>
                  <h2 style={{ fontSize: 18, marginBottom: 4 }}>Commande n°{order.id}</h2>
                  <p style={{ color: 'var(--bark-3)', fontSize: 13 }}>
                    Passée le {order.created_at}
                  </p>
                </div>
                <span className="badge badge-eco" style={{
                  background: TERMINAL_STATUS.has(order.status) ? '#fbeae8' : 'var(--olive-bg)',
                  color: TERMINAL_STATUS.has(order.status) ? '#b3261e' : 'var(--olive-dark)',
                  border: TERMINAL_STATUS.has(order.status) ? '1px solid #f5c6c2' : undefined,
                }}>
                  {STEP_LABEL[order.status] || order.status}
                </span>
              </div>

              {TERMINAL_STATUS.has(order.status) && (
                <div style={{
                  background: '#fbeae8', border: '1px solid #f5c6c2', borderRadius: 10,
                  padding: '12px 14px', marginBottom: 20, fontSize: 13.5, color: '#6a1a14', lineHeight: 1.6,
                }}>
                  {order.status === 'cancelled'
                    ? 'Cette commande a été annulée. Si vous avez déjà payé, le remboursement est en cours.'
                    : 'Le paiement n\'a pas pu être validé. Pour finaliser l\'achat, contactez notre service client.'}
                </div>
              )}

              {/* Timeline */}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', margin: '0 8px' }}>
                <div style={{
                  position: 'absolute', top: 13, left: 0, right: 0, height: 2,
                  background: 'var(--border)', borderRadius: 2,
                }} />
                <div style={{
                  position: 'absolute', top: 13, left: 0, height: 2,
                  background: 'var(--terracotta)', borderRadius: 2,
                  width: stepIndex < 0 ? 0 : `${(stepIndex / (STEPS.length - 1)) * 100}%`,
                  transition: 'width 0.5s var(--ease)',
                }} />
                {STEPS.map((s, i) => {
                  const done = i <= stepIndex;
                  return (
                    <div key={s.key} style={{
                      position: 'relative', width: 30, height: 28, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--cream)', zIndex: 1,
                    }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: done ? 'var(--terracotta)' : 'var(--sand)',
                        border: done ? 'none' : '1px solid var(--border-2)',
                        color: done ? '#fff' : 'var(--bark-3)',
                        boxShadow: done ? '0 2px 6px rgba(180,85,45,0.35)' : 'none',
                        transition: 'all 0.3s',
                      }}>
                        {done && <CheckIcon size={13} />}
                        {!done && <span style={{ fontSize: 11, fontWeight: 700 }}>{i + 1}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 10 }}>
                {STEPS.map((s, i) => (
                  <div key={s.key} style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: i <= stepIndex ? 700 : 500,
                      color: i <= stepIndex ? 'var(--terracotta)' : 'var(--bark-2)',
                    }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--bark-3)', marginTop: 2, lineHeight: 1.4 }}>
                      {s.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Détail */}
            <div className="card" style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                {order.items.map(it => (
                  <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                    <div style={{ minWidth: 0 }}>
                      <Link to={`/produit/${it.slug}`} style={{
                        fontSize: 14, fontWeight: 600, color: 'var(--bark)', textDecoration: 'none',
                      }}>{it.name}</Link>
                      <div style={{ fontSize: 12.5, color: 'var(--bark-3)', marginTop: 2 }}>
                        {it.qty} × {Number(it.unit_price).toFixed(2)} €
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                      {(it.qty * it.unit_price).toFixed(2)} €
                    </div>
                  </div>
                ))}
              </div>

              <div className="warm-divider" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                {order.savings > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                    <span style={{ color: 'var(--olive-dark)' }}>Économies</span>
                    <span style={{ color: 'var(--olive-dark)', fontWeight: 600 }}>-{Number(order.savings).toFixed(2)} €</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 600 }}>Total</span>
                  <span style={{ fontSize: 20, fontWeight: 700 }}>{Number(order.total).toFixed(2)} €</span>
                </div>
              </div>

              <div style={{
                marginTop: 20, background: 'var(--sand)', borderRadius: 12,
                padding: '14px 16px', fontSize: 13.5, color: 'var(--bark-2)', lineHeight: 1.7,
              }}>
                <strong style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--bark-3)', marginBottom: 4 }}>
                  Livraison
                </strong>
                <div style={{ fontWeight: 700, color: 'var(--bark)' }}>{order.name}</div>
                {order.phone && <div>Tél. : {order.phone}</div>}
                <span style={{ whiteSpace: 'pre-line' }}>
                  {[order.address, order.country].filter(Boolean).join(', ')}
                </span>
                {order.notes && <div style={{ fontStyle: 'italic', color: 'var(--bark-3)', marginTop: 4 }}>Note : {order.notes}</div>}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}