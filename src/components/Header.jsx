import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartIcon, SearchIcon } from './Icons';
import { useCart } from '../context/CartContext';
import { lockBodyScroll, unlockBodyScroll } from '../utils/bodyLock';

export default function Header() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') { setMenuOpen(false); setSearchOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const any = menuOpen || searchOpen;
    if (any) lockBodyScroll();
    else unlockBodyScroll();
    window.dispatchEvent(new CustomEvent('fab-visibility', {
      detail: { reason: 'overlay', open: any },
    }));
    return () => {
      if (any) unlockBodyScroll();
    };
  }, [menuOpen, searchOpen]);

  const openFloatingCart = () => {
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent('open-floating-cart'));
  };

  const submitSearch = e => {
    e.preventDefault();
    navigate(`/catalogue${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
    setQ('');
    setSearchOpen(false);
  };

  const links = [
    { to: '/', label: 'Accueil' },
    { to: '/catalogue', label: 'Catalogue' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        {/* Top promo strip — collapses on scroll */}
        <div className="promo-strip" style={{
          background: 'var(--terracotta)', color: '#fff',
          fontSize: 11.5, fontWeight: 600, letterSpacing: '0.025em',
          textAlign: 'center',
          height: scrolled ? 0 : 30,
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'height 0.35s var(--ease)',
        }}>
          <span>Livraison offerte dès 99 €</span>
          <span className="promo-sep" style={{ margin: '0 10px', opacity: 0.5 }}>·</span>
          <span className="promo-mid">Retour gratuit 30 jours</span>
          <span className="promo-sep" style={{ margin: '0 10px', opacity: 0.5 }}>·</span>
          <span>Garantie 3 ans</span>
        </div>

        {/* Nav bar — always frosted, single bar */}
        <div style={{
          background: 'rgba(253,251,247,0.85)',
          backdropFilter: 'blur(18px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'border-color 0.35s',
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto', padding: '0 var(--page-side)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, height: 'var(--header-h)',
          }}>
          {/* Logo */}
          <Link to="/" style={{
            fontSize: 'clamp(16px, 3.5vw, 19px)', fontWeight: 700,
            color: 'var(--bark)', textDecoration: 'none', whiteSpace: 'nowrap',
            letterSpacing: '-0.02em', flexShrink: 0,
          }}>
            <span style={{ color: 'var(--terracotta)' }}>Electro</span>domésticos
          </Link>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
          }}>
            {links.map(link => (
              <Link key={link.to} to={link.to} style={{
                fontSize: 13.5, fontWeight: 500,
                color: location.pathname === link.to ? 'var(--terracotta)' : 'var(--bark-2)',
                textDecoration: 'none', transition: 'color 0.2s',
                padding: '6px 12px', borderRadius: 8,
              }}
              onMouseEnter={e => e.target.style.color = 'var(--terracotta)'}
              onMouseLeave={e => e.target.style.color = location.pathname === link.to ? 'var(--terracotta)' : 'var(--bark-2)'}
              >{link.label}</Link>
            ))}
          </nav>

          {/* Search (desktop) */}
          <form onSubmit={submitSearch} className="search-bar desktop-search" style={{
            flex: 1, maxWidth: 360, display: 'flex',
          }}>
            <SearchIcon size={16} />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Rechercher…"
              aria-label="Rechercher"
            />
            <button type="submit">OK</button>
          </form>

          {/* Desktop actions */}
          <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <button onClick={openFloatingCart} aria-label={`Panier (${count})`} style={actionBtnStyle}>
              <CartIcon size={20} />
              {count > 0 && <span key={count} className="cart-badge" style={badgeStyle}>{count}</span>}
            </button>
          </div>

          {/* Mobile actions */}
          <div className="mobile-nav" style={{ display: 'none', alignItems: 'center', gap: 2 }}>
            <button onClick={() => setSearchOpen(true)} aria-label="Rechercher" style={actionBtnStyle}>
              <SearchIcon size={18} />
            </button>
            <button onClick={openFloatingCart} aria-label={`Panier (${count})`} style={actionBtnStyle}>
              <CartIcon size={20} />
              {count > 0 && <span key={count} className="cart-badge" style={badgeStyle}>{count}</span>}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              style={{ ...actionBtnStyle, position: 'relative' }}
            >
              <span style={{ display: 'block', width: 18, height: 1.5, background: 'var(--bark)', borderRadius: 1, position: 'absolute', left: 13, top: '50%', transition: 'all 0.3s var(--ease)', transform: menuOpen ? 'translateY(-50%) rotate(45deg)' : 'translateY(calc(-50% - 6px))' }} />
              <span style={{ display: 'block', width: 18, height: 1.5, background: 'var(--bark)', borderRadius: 1, position: 'absolute', left: 13, top: '50%', transition: 'all 0.3s var(--ease)', opacity: menuOpen ? 0 : 1, transform: 'translateY(-50%)' }} />
              <span style={{ display: 'block', width: 18, height: 1.5, background: 'var(--bark)', borderRadius: 1, position: 'absolute', left: 13, top: '50%', transition: 'all 0.3s var(--ease)', transform: menuOpen ? 'translateY(-50%) rotate(-45deg)' : 'translateY(calc(-50% + 6px))' }} />
            </button>
          </div>
          </div>
        </div>
      </header>

      {/* ── Search overlay (mobile) ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Recherche"
        style={{
        position: 'fixed', inset: 0, zIndex: 55,
        background: 'rgba(253,251,247,0.97)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        opacity: searchOpen ? 1 : 0,
        pointerEvents: searchOpen ? 'auto' : 'none',
        transition: 'opacity 0.25s',
        display: 'flex', flexDirection: 'column',
        paddingTop: 'calc(var(--header-h) + 28px)',
      }}>
        <form onSubmit={submitSearch} className="search-bar" style={{
          margin: '0 var(--page-side)', maxWidth: 600, alignSelf: 'center', width: '100%',
        }}>
          <SearchIcon size={18} />
          <input
            autoFocus={searchOpen}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Rechercher un appareil…"
            aria-label="Rechercher"
          />
          <button type="submit">OK</button>
        </form>
        <button
          onClick={() => setSearchOpen(false)}
          style={{
            margin: '16px auto 0', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 13.5, fontWeight: 600, color: 'var(--bark-3)', fontFamily: 'var(--font)',
          }}
        >Annuler</button>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(27,27,28,0.3)',
          backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
        onClick={() => setMenuOpen(false)}
      />
      <nav
        className="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        style={{
        position: 'fixed', top: 0, right: 0,
        width: 'min(300px, 82vw)', height: '100vh',
        background: 'var(--cream)',
        zIndex: 45,
        boxShadow: menuOpen ? '-8px 0 32px rgba(27,27,28,0.14)' : 'none',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s var(--ease)',
        display: 'flex', flexDirection: 'column',
        paddingTop: 16,
        overflowY: 'auto',
      }}>
        <div style={{ padding: '8px var(--page-side) 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ fontSize: 17, fontWeight: 700, color: 'var(--bark)', textDecoration: 'none' }}
            onClick={() => setMenuOpen(false)}>
            <span style={{ color: 'var(--terracotta)' }}>Electro</span>domésticos
          </Link>
          <button onClick={() => setMenuOpen(false)} aria-label="Fermer" style={actionBtnStyle}>
            <span style={{ fontSize: 16, color: 'var(--bark-2)' }}>✕</span>
          </button>
        </div>

        {links.map(link => (
          <Link key={link.to} to={link.to} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px var(--page-side)',
            fontSize: 15.5, fontWeight: 500,
            color: location.pathname === link.to ? 'var(--terracotta)' : 'var(--bark)',
            textDecoration: 'none',
            borderLeft: location.pathname === link.to ? '3px solid var(--terracotta)' : '3px solid transparent',
            transition: 'all 0.2s',
          }}
          onClick={() => setMenuOpen(false)}
          >{link.label}</Link>
        ))}

        <div style={{ height: 1, background: 'var(--border)', margin: '12px var(--page-side)' }} />

        <button type="button" onClick={openFloatingCart} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px var(--page-side)',
          fontSize: 15.5, fontWeight: 500, color: 'var(--bark)',
          textDecoration: 'none', border: 'none', background: 'none',
          cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'var(--font)',
        }}>
          <CartIcon size={18} />
          Panier {count > 0 && `(${count})`}
        </button>
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .desktop-search { display: none !important; }
          .desktop-nav { display: none !important; }
          .desktop-actions { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
        @media (max-width: 640px) {
          .promo-mid, .promo-sep { display: none; }
        }
      `}</style>
    </>
  );
}

const actionBtnStyle = {
  position: 'relative', color: 'var(--bark)',
  width: 'var(--touch)', height: 'var(--touch)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer',
  transition: 'background 0.2s',
};

const badgeStyle = {
  position: 'absolute', top: 4, right: 4,
  width: 16, height: 16, borderRadius: '50%',
  background: 'var(--terracotta)', color: '#fff',
  fontSize: 9.5, fontWeight: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};