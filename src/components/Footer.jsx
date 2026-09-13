import { Link } from 'react-router-dom';
import { MapPinIcon, MailIcon, ClockIcon, InstagramIcon, FacebookIcon, TikTokIcon, YouTubeIcon } from './Icons';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bark)', color: 'rgba(255,255,255,0.75)' }}>
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--terracotta), var(--terracotta-light), var(--terracotta))' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px var(--page-side) 0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
          gap: 'clamp(28px, 4vw, 48px)',
        }} className="footer-grid">

          {/* Marque */}
          <div>
            <div style={{
              fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 12,
            }}>
              <span style={{ color: 'var(--terracotta-light)' }}>Electro</span>domésticos
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 280, marginBottom: 18, color: 'rgba(255,255,255,0.65)' }}>
              Cadena europea especializada en electrodomésticos. Una selección fiable,
              moderna y garantizada para equipar tu hogar.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 12.5 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.7)' }}>
                <MapPinIcon size={15} /> Zaragoza · España
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.7)' }}>
                <MailIcon size={15} /> contacto@electro-domesticos.com
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.7)' }}>
                <ClockIcon size={15} /> Lun–Vie, 9h–18h
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              {[
                { icon: <InstagramIcon size={16} />, label: 'Instagram' },
                { icon: <FacebookIcon size={16} />, label: 'Facebook' },
                { icon: <TikTokIcon size={16} />, label: 'TikTok' },
                { icon: <YouTubeIcon size={16} />, label: 'YouTube' },
              ].map(s => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  onClick={e => e.preventDefault()}
                  style={{
                    width: 36, height: 36, borderRadius: 9,
                    border: '1px solid rgba(255,255,255,0.18)',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--terracotta)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                  }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Acheter */}
          <div>
            <h4 style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: '#fff', marginBottom: 14,
            }}>Comprar</h4>
            {[
              { to: '/catalogue', label: 'Todas las categorías' },
              { to: '/catalogue?cat=refrigerateur', label: 'Refrigeradores' },
              { to: '/catalogue?cat=lave-linge', label: 'Lavadoras' },
              { to: '/catalogue?cat=four-plaque', label: 'Hornos y Placas' },
              { to: '/catalogue?cat=petit-cuisine', label: 'Pequeños electrodomésticos' },
              { to: '/catalogue?promo=1', label: 'Promociones' },
            ].map(item => (
              <FooterLink key={item.label} to={item.to}>{item.label}</FooterLink>
            ))}
          </div>

          {/* Service client */}
          <div>
            <h4 style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: '#fff', marginBottom: 14,
            }}>Atención al cliente</h4>
            {[
              { to: '/suivi-commande', label: 'Seguimiento de pedido' },
              { to: '/livraison-retours', label: 'Envíos y devoluciones' },
              { to: '/comment-commander', label: 'Cómo comprar' },
              { to: '/contact', label: 'Contacto y ayuda' },
            ].map(item => (
              <FooterLink key={item.label} to={item.to}>{item.label}</FooterLink>
            ))}
            <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              ✓ Garantía 3 años · Devoluciones 30 días
            </div>
          </div>

          {/* Informations */}
          <div>
            <h4 style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: '#fff', marginBottom: 14,
            }}>Información</h4>
            {[
              { to: '/cgv', label: 'Condiciones generales de venta' },
              { to: '/confidentialite', label: 'Política de privacidad' },
              { to: '/mentions-legales', label: 'Aviso legal' },
              { to: '/cookies', label: 'Política de cookies' },
            ].map(item => (
              <FooterLink key={item.label} to={item.to}>{item.label}</FooterLink>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.12)',
          marginTop: 40, padding: '18px 0 6px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 12, color: 'rgba(255,255,255,0.55)',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span>&copy; 2026 Electro-Domésticos. Todos los derechos reservados.</span>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {[
              { to: '/mentions-legales', label: 'Aviso legal' },
              { to: '/cgv', label: 'Condiciones generales de venta' },
              { to: '/confidentialite', label: 'Privacidad' },
              { to: '/cookies', label: 'Cookies' },
            ].map(item => (
              <a key={item.label} href={`/#${item.to.slice(1)}`} onClick={e => { e.preventDefault(); window.location.href = item.to; }}
                style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}
              >{item.label}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 26px !important; }
        }
      `}</style>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} style={{
      display: 'block', color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
      fontSize: 13, padding: '4px 0', transition: 'all 0.2s',
      minHeight: 'var(--touch)', lineHeight: 'var(--touch)',
    }}
    onMouseEnter={e => {
      e.target.style.color = 'var(--terracotta-light)';
      e.target.style.paddingLeft = '4px';
    }}
    onMouseLeave={e => {
      e.target.style.color = 'rgba(255,255,255,0.65)';
      e.target.style.paddingLeft = '0';
    }}
    >{children}</Link>
  );
}