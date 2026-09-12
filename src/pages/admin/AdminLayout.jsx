import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getAdminMe, setToken } from '../../adminApi';
import { TruckIcon, CartIcon, StarIcon, MailIcon } from '../../components/Icons';

const NAV = [
  { to: '/admin', label: 'Tableau de bord', icon: <StarIcon size={15} />, end: true },
  { to: '/admin/commandes', label: 'Commandes', icon: <CartIcon size={16} /> },
  { to: '/admin/produits', label: 'Produits', icon: <MailIcon size={15} /> },
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
    <div className="admin-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--cream)', color: 'var(--bark)' }}>
      {/* Topbar navbar */}
      <header className="admin-topbar" style={{
        display: 'flex', alignItems: 'center', gap: 14,
        background: 'var(--bark)', color: '#fff',
        padding: '0 18px', height: 60, flexShrink: 0,
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <div className="admin-brand" style={{ fontSize: 16.5, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="admin-brand-dot" style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--terracotta-light)', display: 'inline-block' }} />
          Electro <span style={{ color: 'var(--terracotta-light)' }}>Admin</span>
        </div>

        <nav className="admin-nav" style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 13px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                borderRadius: 8, textDecoration: 'none', transition: 'all 0.2s',
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-shop-linkwrap" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12.5, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >← Voir la boutique</a>
          <button onClick={logout} style={{
            padding: '9px 14px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.25)', background: 'transparent',
            color: '#fff', fontWeight: 600, fontSize: 12.5, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>Déconnexion</button>
        </div>
      </header>

      {/* Content */}
      <main className="admin-main" style={{ flex: 1, minWidth: 0, padding: 'clamp(18px, 4vw, 34px)' }}>
        <Outlet />
      </main>

      <style>{`
        @media (min-width: 761px) {
          .admin-nav { justify-content: flex-start; }
        }
        /* Mobile : navbar compacte, nav scrollable, liens sans wrap */
        @media (max-width: 760px) {
          .admin-topbar {
            gap: 10 !important;
            height: 54 !important;
            padding: 0 10px !important;
          }
          .admin-brand { font-size: 14 !important; }
          .admin-brand-dot { width: 7 !important; height: 7 !important; }
          .admin-brand span:first-of-type + span { display: inline; }
          .admin-nav { gap: 2; }
          .admin-nav a { padding: 9px 10px !important; font-size: 12 !important; }
          .admin-shop-linkwrap a { display: none !important; }
          .admin-shop-linkwrap button { padding: 8px 10px !important; font-size: 11.5 !important; }
          .admin-main { padding: 14px !important; }
        }
      `}</style>
    </div>
  );
}
