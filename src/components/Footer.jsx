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
              Enseigne européenne spécialisée dans l'électroménager. Une sélection fiable,
              moderne et garantie pour équiper votre maison.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 12.5 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.7)' }}>
                <MapPinIcon size={15} /> Saragosse · Espagne
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.7)' }}>
                <MailIcon size={15} /> contacto@electro-domesticos.com
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.7)' }}>
                <ClockIcon size={15} /> Lun–Ven, 9h–18h
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
            }}>Acheter</h4>
            {[
              { to: '/catalogue', label: 'Toutes les catégories' },
              { to: '/catalogue?cat=refrigerateur', label: 'Réfrigérateurs' },
              { to: '/catalogue?cat=lave-linge', label: 'Lave-linge' },
              { to: '/catalogue?cat=four-plaque', label: 'Four & Plaques' },
              { to: '/catalogue?cat=petit-cuisine', label: 'Petit électroménager' },
              { to: '/catalogue?promo=1', label: 'Promotions' },
            ].map(item => (
              <FooterLink key={item.label} to={item.to}>{item.label}</FooterLink>
            ))}
          </div>

          {/* Service client */}
          <div>
            <h4 style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: '#fff', marginBottom: 14,
            }}>Service client</h4>
            {[
              { to: '/suivi-commande', label: 'Suivi de commande' },
              { to: '/livraison-retours', label: 'Livraison & retours' },
              { to: '/comment-commander', label: 'Comment commander' },
              { to: '/contact', label: 'Contact & aide' },
            ].map(item => (
              <FooterLink key={item.label} to={item.to}>{item.label}</FooterLink>
            ))}
            <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              ✓ Garantie 3 ans · Retours 30j
            </div>
          </div>

          {/* Informations */}
          <div>
            <h4 style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: '#fff', marginBottom: 14,
            }}>Informations</h4>
            {[
              { to: '/cgv', label: 'Conditions générales de vente' },
              { to: '/confidentialite', label: 'Politique de confidentialité' },
              { to: '/mentions-legales', label: 'Mentions légales' },
              { to: '/cookies', label: 'Politique cookies' },
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
          <span>&copy; 2026 Electro-Domésticos. Tous droits réservés.</span>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {[
              { to: '/mentions-legales', label: 'Mentions légales' },
              { to: '/cgv', label: 'CGV' },
              { to: '/confidentialite', label: 'Confidentialité' },
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