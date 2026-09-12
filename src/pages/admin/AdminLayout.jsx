import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getAdminMe, setToken } from '../../adminApi';
import { StarIcon, CartIcon, TruckIcon, MailIcon, MenuIcon } from '../../components/Icons';

const NAV = [
  { to: '/admin', label: 'Tableau de bord', icon: <StarIcon size={16} />, end: true },
  { to: '/admin/commandes', label: 'Commandes', icon: <CartIcon size={17} /> },
  { to: '/admin/produits', label: 'Produits', icon: <TruckIcon size={17} /> },
  { to: '/admin/paiements', label: 'Virement (IBAN)', icon: <MailIcon size={16} /> },
];

export default function AdminLayout() {
  const [ok, setOk] = useState(false);
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 760) setOpen(false); };
    window.addEventListener('resize', onResize);
    window.addEventListener('popstate', () => setOpen(false));
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('popstate', () => setOpen(false));
    };
  }, []);

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
    <div className="admin-shell" style={{ minHeight: '100vh', display: 'flex', background: 'var(--cream)', color: 'var(--bark)' }}>
      {/* Barre compacte mobile : hamburger + marque (visible uniquement <= 760px) */}
      <div className="admin-mobilebar" style={{
        display: 'none', position: 'sticky', top: 0, zIndex: 40,
        height: 54, background: 'var(--bark)', color: '#fff',
        alignItems: 'center', gap: 10, padding: '0 12px',
      }}>
        <button onClick={() => setOpen(true)} aria-label="Ouvrir le menu" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 38, height: 38, borderRadius: 9, border: '1px solid rgba(255,255,255,0.28)',
          background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', flexShrink: 0,
        }}>
          <MenuIcon size={18} />
        </button>
        <div style={{ fontSize: 15, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Electro <span style={{ color: 'var(--terracotta-light)' }}>Admin</span>
        </div>
      </div>

      {/* Sidebar / menu principal */}
      <aside className={`admin-aside${open ? ' is-open' : ''}`} style={{
        width: 230, flexShrink: 0, background: 'var(--bark)', color: '#fff',
        display: 'flex', flexDirection: 'column', padding: '20px 0',
        position: 'sticky', top: 0, height: '100vh', transition: 'transform 0.25s ease',
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
              onClick={() => setOpen(false)}
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

      {/* Overlay mobile (ferme le tiroir) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(30,18,12,0.5)',
            zIndex: 38, display: 'none',
          }}
          className="admin-overlay"
        />
      )}

      {/* Content */}
      <main className="admin-main" style={{ flex: 1, minWidth: 0, padding: 'clamp(20px, 4vw, 36px)' }}>
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 760px) {
          .admin-mobilebar { display: flex !important; }
          .admin-aside {
            position: fixed !important;
            top: 54px !important;
            bottom: 0;
            left: 0;
            height: auto !important;
            width: 260px !important;
            transform: translateX(-105%);
            box-shadow: 6px 0 24px rgba(0,0,0,0.28);
            z-index: 39;
            overflow-y: auto;
          }
          .admin-aside.is-open { transform: translateX(0) !important; }
          .admin-overlay { display: block !important; }
          .admin-main { width: 92% !important; }
        }
      `}</style>
    </div>
  );
}
