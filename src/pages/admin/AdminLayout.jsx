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
      <aside className="admin-aside" style={{
        width: 230, flexShrink: 0, background: 'var(--bark)', color: '#fff',
        display: 'flex', flexDirection: 'column', padding: '20px 0',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div className="admin-brand" style={{ padding: '2px 20px 22px', fontSize: 17, fontWeight: 800, color: '#fff' }}>
          Electro <span style={{ color: 'var(--terracotta-light)' }}>Admin</span>
        </div>

        <nav className="admin-nav" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="admin-link"
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
              <span className="admin-link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-foot" style={{ marginTop: 'auto', padding: '16px 20px' }}>
          <a
            className="admin-shop-link"
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
      <main className="admin-main" style={{ flex: 1, minWidth: 0, padding: 'clamp(20px, 4vw, 36px)' }}>
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 760px) {
          .admin-aside {
            position: sticky !important;
            top: 0;
            z-index: 30;
            width: 100% !important;
            height: auto !important;
            flex-direction: row !important;
            align-items: center;
            gap: 6px;
            padding: 8px 12px !important;
            box-shadow: 0 4px 14px rgba(0,0,0,0.18);
          }
          .admin-brand {
            padding: 0 !important;
            font-size: 15 !important;
            white-space: nowrap;
          }
          .admin-nav {
            flex-direction: row !important;
            gap: 2 !important;
            flex: 1;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .admin-nav::-webkit-scrollbar { display: none; }
          .admin-link {
            padding: 9px 12px !important;
            border-left: none !important;
            border-bottom: 3px solid transparent;
            border-radius: 6px 6px 0 0;
            white-space: nowrap;
            flex-shrink: 0;
          }
          .admin-link-label { font-size: 12.5 !important; }
          .admin-foot {
            margin-top: 0 !important;
            padding: 0 !important;
            display: flex;
            align-items: center;
          }
          .admin-shop-link { display: none !important; }
          .admin-foot button {
            width: auto !important;
            padding: 8px 10px !important;
            font-size: 12 !important;
            white-space: nowrap;
            margin: 0 !important;
          }
          .admin-main { padding: 14px !important; }
        }
      `}</style>
    </div>
  );
}