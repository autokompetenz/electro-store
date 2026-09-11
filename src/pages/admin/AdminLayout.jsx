import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getAdminMe, setToken } from '../../adminApi';
import { TruckIcon, CartIcon, StarIcon, MailIcon } from '../../components/Icons';

const NAV = [
  { to: '/admin', label: 'Tableau de bord', icon: <StarIcon size={15} />, end: true },
  { to: '/admin/commandes', label: 'Commandes', icon: <CartIcon size={16} /> },
  { to: '/admin/produits', label: 'Produits', icon: <TruckIcon size={16} /> },
  { to: '/admin/paiements', label: 'Virement (IBAN)', icon: <MailIcon size={15} /> },
];

export default function AdminLayout() {
  const [ok, setOk] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    getAdminMe()
      .then(() => alive && setOk(true))
      .catch(() => {
        setToken(null);
        if (alive) navigate('/admin/login');
      });
    return () => { alive = false; };
  }, [navigate]);

  if (!ok) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--sand)' }}>
        <p style={{ color: 'var(--bark-3)', fontSize: 14 }}>Vérification de la session…</p>
      </main>
    );
  }

  const logout = () => {
    setToken(null);
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--cream)', color: 'var(--bark)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 230, flexShrink: 0, background: 'var(--bark)', color: '#fff',
        display: 'flex', flexDirection: 'column', padding: '20px 0',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '2px 20px 22px', fontSize: 17, fontWeight: 800, color: '#fff' }}>
          Electro <span style={{ color: 'var(--terracotta-light)' }}>Admin</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 20px', fontSize: 13.5, fontWeight: 600,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--terracotta-light)' : '3px solid transparent',
                textDecoration: 'none', transition: 'all 0.2s',
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px 20px' }}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12.5,
              textDecoration: 'none', marginBottom: 12,
            }}
          >← Voir la boutique</a>
          <button onClick={logout} style={{
            width: '100%', padding: '10px 0', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.25)', background: 'transparent',
            color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}>Déconnexion</button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, minWidth: 0, padding: 'clamp(20px, 4vw, 36px)' }}>
        <Outlet />
      </main>
    </div>
  );
}