import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../adminApi';

const euro = n => `${Number(n).toFixed(2)} €`;

const STATUS_LABEL = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
};

function StatCard({ label, value, sub }) {
  return (
    <div className="card" style={{ padding: '18px 20px' }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--bark-3)' }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6, color: 'var(--bark)' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--bark-3)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminStats().then(setStats).catch(e => setError(e.message));
  }, []);

  if (error) return <p style={{ color: 'var(--terracotta)' }}>{error}</p>;
  if (!stats) return <p style={{ color: 'var(--bark-3)' }}>Chargement…</p>;

  const maxDaily = Math.max(...stats.daily.map(d => d.revenue), 1);
  const maxCat = Math.max(...stats.byCategory.map(c => c.revenue), 1);

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Tableau de bord</h1>
      <p style={{ color: 'var(--bark-3)', fontSize: 13.5, marginBottom: 24 }}>Vue d'ensemble de la boutique.</p>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12,
        marginBottom: 24,
      }}>
        <StatCard label="Chiffre d'affaires" value={euro(stats.revenue)} sub={`${stats.orders} commande(s)`} />
        <StatCard label="Panier moyen" value={euro(stats.avgOrder)} />
        <StatCard label="Produits" value={stats.products} />
        <StatCard label="Catégories" value={stats.categories} />
        <StatCard label="Newsletter" value={stats.newsletter} sub="inscrits" />
        <StatCard label="Messages" value={stats.contacts} sub="contact" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 18 }} className="admin-cols">
        {/* Ventes 14 derniers jours */}
        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: 15, marginBottom: 16 }}>Ventes · 14 derniers jours</h2>
          {stats.daily.length === 0 ? (
            <p style={{ color: 'var(--bark-3)', fontSize: 13 }}>Pas encore de ventes.</p>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
              {stats.daily.map(d => (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
                  <div style={{
                    width: '100%', maxWidth: 34, borderRadius: '6px 6px 0 0',
                    background: d.revenue > 0 ? 'var(--terracotta)' : 'var(--sand)',
                    height: `${Math.max(4, (d.revenue / maxDaily) * 108)}px`,
                  }} title={euro(d.revenue)} />
                  <span style={{ fontSize: 9.5, color: 'var(--bark-3)' }}>{d.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top produits */}
        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: 15, marginBottom: 16 }}>Top produits</h2>
          {stats.topProducts.length === 0 ? (
            <p style={{ color: 'var(--bark-3)', fontSize: 13 }}>Pas encore de ventes.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.topProducts.map((p, i) => (
                <div key={p.slug} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                    background: 'var(--sand)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--terracotta)',
                  }}>{i + 1}</span>
                  <Link to={`/produit/${p.slug}`} target="_blank" style={{
                    flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, color: 'var(--bark)',
                    textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{p.name}</Link>
                  <span style={{ fontSize: 12.5, color: 'var(--bark-3)', flexShrink: 0 }}>{p.qty} vendus</span>
                  <span style={{ fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{euro(p.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 18 }} className="admin-cols">
        {/* CA par catégorie */}
        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: 15, marginBottom: 16 }}>Chiffre d'affaires par catégorie</h2>
          {stats.byCategory.length === 0 ? (
            <p style={{ color: 'var(--bark-3)', fontSize: 13 }}>Pas encore de ventes.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.byCategory.map(c => (
                <div key={c.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    <span style={{ color: 'var(--bark-3)' }}>{euro(c.revenue)} · {c.orders} cmd</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 100, background: 'var(--sand)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 100, background: 'var(--terracotta)',
                      width: `${(c.revenue / maxCat) * 100}%`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dernières commandes */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15 }}>Dernières commandes</h2>
            <Link to="/admin/commandes" style={{ fontSize: 12.5, color: 'var(--terracotta)', fontWeight: 600, textDecoration: 'none' }}>
              Tout voir →
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p style={{ color: 'var(--bark-3)', fontSize: 13 }}>Aucune commande.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {stats.recentOrders.map((o, i) => (
                <div key={o.id} style={{
                  display: 'grid', gridTemplateColumns: '46px 1fr auto auto',
                  alignItems: 'center', gap: 10, padding: '10px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--terracotta)' }}>#{o.id}</span>
                  <span style={{ fontSize: 13, color: 'var(--bark-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.name}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--bark-3)' }}>{STATUS_LABEL[o.status] || o.status}</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{euro(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}