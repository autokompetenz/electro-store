import { Fragment, useEffect, useState } from 'react';
import { getAdminOrders, getAdminOrder, setOrderStatus, deleteAdminOrder } from '../../adminApi';
import { ChevronIcon } from '../../components/Icons';

const euro = n => `${Number(n).toFixed(2)} €`;

const STATUSES = [
  { key: 'pending', label: 'En attente' },
  { key: 'confirmed', label: 'Confirmée' },
  { key: 'shipped', label: 'En cours de livraison' },
  { key: 'delivered', label: 'Livrée' },
  { key: 'cancelled', label: 'Annulée' },
  { key: 'rejected', label: 'Rejetée' },
];

const STATUS_LABEL = Object.fromEntries(STATUSES.map(s => [s.key, s.label]));

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = () => {
    setLoading(true);
    setError('');
    getAdminOrders({ status: filter || undefined, q: search || undefined })
      .then(setOrders)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleDetail = async id => {
    if (detail?.id === id) { setDetail(null); return; }
    setDetailLoading(true);
    try {
      setDetail(await getAdminOrder(id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await setOrderStatus(id, status);
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
      if (detail?.id === id) setDetail(prev => (prev ? { ...prev, status } : prev));
    } catch (e) {
      alert(e.message);
    }
  };

  const removeOrder = async id => {
    if (!window.confirm('Supprimer définitivement cette commande ?')) return;
    try {
      await deleteAdminOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
      if (detail?.id === id) setDetail(null);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Commandes</h1>
      <p style={{ color: 'var(--bark-3)', fontSize: 13.5, marginBottom: 20 }}>
        {orders.length} commande(s) affichée(s)
        {filter ? ` · filtre : ${STATUS_LABEL[filter]}` : ''}
      </p>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setSearch(query)}
          placeholder="N°, email ou nom…"
          className="input-luxury"
          style={{ flex: 1, minWidth: 200, height: 42, fontSize: 14 }}
        />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-luxury" style={{ height: 42, fontSize: 14, width: 'auto' }}>
          <option value="">Tous les statuts</option>
          {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>

      {error && <p style={{ color: 'var(--terracotta)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
      {loading ? (
        <p style={{ color: 'var(--bark-3)' }}>Chargement…</p>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {orders.length === 0 ? (
            <p style={{ padding: 24, color: 'var(--bark-3)', fontSize: 14 }}>Aucune commande.</p>
          ) : (
            <table className="admin-orders-tbl" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--bark-3)', background: 'var(--sand)', fontSize: 11.5 }}>
                  {['N°', 'Client', 'Date', 'Articles', 'Total', 'Statut', ''].map(h => (
                    <th key={h} style={{ padding: '10px 12px', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <Fragment key={o.id}>
                    <tr key={o.id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--terracotta)' }}>#{o.id}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: 600 }}>{o.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--bark-3)' }}>{o.email}</div>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--bark-2)' }}>{o.created_at}</td>
                      <td style={{ padding: '10px 12px' }}>{o.items_count}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>{euro(o.total)}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <select
                          value={o.status}
                          onChange={e => changeStatus(o.id, e.target.value)}
                          style={{
                            border: '1px solid var(--border-2)', borderRadius: 8,
                            padding: '6px 8px', fontSize: 12.5, background: 'var(--cream)',
                            color: 'var(--bark)', fontFamily: 'var(--font)',
                          }}
                        >
                          {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                        <button onClick={() => removeOrder(o.id)} title="Supprimer la commande" style={{
                          border: '1px solid #e3b7ad', background: '#fdf3f1', color: '#c4453a',
                          borderRadius: 7, padding: '5px 9px', cursor: 'pointer', fontSize: 12,
                          fontFamily: 'var(--font)', marginRight: 8, fontWeight: 600,
                        }}>
                          Supprimer
                        </button>
                        <button onClick={() => toggleDetail(o.id)} style={{
                          border: 'none', background: 'transparent', cursor: 'pointer',
                          color: 'var(--bark-3)', display: 'flex', alignItems: 'center',
                        }}>
                          <ChevronIcon size={15} style={{ transform: detail?.id === o.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                      </td>
                    </tr>
                    {detail?.id === o.id && (
                      <tr className="admin-order-detail">
                        <td colSpan={7} style={{ padding: '0 12px 14px', background: 'var(--cream)' }}>
                          {detailLoading ? (
                            <p style={{ fontSize: 12.5, color: 'var(--bark-3)', padding: 12 }}>Chargement…</p>
                          ) : (
                            <div style={{ padding: '12px 4px' }}>
                              <div style={{ background: 'var(--sand)', borderRadius: 10, padding: '14px 16px', marginBottom: 10 }}>
                                <strong style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--bark-2)', display: 'block', marginBottom: 6 }}>Livraison</strong>
                                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--bark)' }}>{detail.name}</div>
                                {detail.email && <div style={{ fontSize: 13, color: 'var(--bark-2)' }}>{detail.email}</div>}
                                {detail.phone && <div style={{ fontSize: 13, color: 'var(--bark-2)' }}>Tél. : {detail.phone}</div>}
                                <div style={{ fontSize: 13, color: 'var(--bark-2)', whiteSpace: 'pre-line', marginTop: 4 }}>
                                  {[detail.address, detail.country].filter(Boolean).join(', ')}
                                </div>
                                {detail.notes && (
                                  <div style={{ fontSize: 12.5, color: 'var(--bark-3)', fontStyle: 'italic', marginTop: 6 }}>Note : {detail.notes}</div>
                                )}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {detail.items.map(it => (
                                  <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 13 }}>
                                    <span>{it.name} × {it.qty}</span>
                                    <span style={{ fontWeight: 600 }}>{euro(it.qty * it.unit_price)}</span>
                                  </div>
                                ))}
                              </div>
                              <div style={{ borderTop: '1px solid var(--border)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>Total</span>
                                <span style={{ fontSize: 15, fontWeight: 800 }}>{euro(detail.total)}</span>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .admin-orders-tbl thead { display: none; }

          .admin-orders-tbl tbody > tr:not(.admin-order-detail) {
            display: grid;
            grid-template-columns: auto minmax(0, 1fr) auto;
            grid-template-areas:
              "num client client"
              "date items total"
              "status status actions";
            align-items: center;
            column-gap: 12px;
            row-gap: 8px;
            padding: 12px 14px;
          }

          .admin-orders-tbl td { padding: 0 !important; }

          .admin-orders-tbl td:nth-child(1) { grid-area: num; }
          .admin-orders-tbl td:nth-child(2) { grid-area: client; }
          .admin-orders-tbl td:nth-child(3) { grid-area: date; }
          .admin-orders-tbl td:nth-child(4) { grid-area: items; }
          .admin-orders-tbl td:nth-child(5) { grid-area: total; text-align: right; }
          .admin-orders-tbl td:nth-child(6) { grid-area: status; }
          .admin-orders-tbl td:nth-child(7) { grid-area: actions; }

          .admin-orders-tbl td:nth-child(6) select { width: 100%; }

          .admin-orders-tbl tr.admin-order-detail {
            display: block;
          }

          .admin-orders-tbl tr.admin-order-detail td {
            display: block;
            padding: 0 14px 16px !important;
            background: var(--cream);
          }
        }
      `}</style>
    </div>
  );
}