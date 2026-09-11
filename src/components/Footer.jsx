import { Link } from 'react-router-dom';
import { MapPinIcon, MailIcon, ClockIcon } from './Icons';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--sand)', color: 'var(--bark-3)' }}>
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--terracotta), var(--terracotta-light), var(--terracotta))' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px var(--page-side) 0' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40,
        }} className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div style={{
              fontWeight: 700, fontSize: 18, color: 'var(--bark)', marginBottom: 12,
            }}>
              <span style={{ color: 'var(--terracotta)' }}>Electro</span>domésticos
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 280, color: 'var(--bark-3)' }}>
              Électroménagers sélectionnés avec soin. Pas tout, juste ce qui fonctionne vraiment.
            </p>
          </div>

          {/* GEM */}
          <div>
            <h4 style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.09em', color: 'var(--bark-3)', marginBottom: 14,
            }}>GEM</h4>
            {[
              { label: 'Lave-linge', cat: 'lave-linge' },
              { label: 'Réfrigérateurs', cat: 'refrigerateur' },
              { label: 'Lave-vaisselle', cat: 'lave-vaisselle' },
              { label: 'Fours & Plaques', cat: 'four-plaque' },
            ].map(item => (
              <FooterLink key={item.cat} to={`/catalogue?cat=${item.cat}`}>{item.label}</FooterLink>
            ))}
          </div>

          {/* PEM */}
          <div>
            <h4 style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.09em', color: 'var(--bark-3)', marginBottom: 14,
            }}>PEM</h4>
            {[
              { label: 'Micro-ondes', cat: 'micro-ondes' },
              { label: 'Aspirateurs', cat: 'aspirateur' },
              { label: 'Petit appareils', cat: 'petit-cuisine' },
            ].map(item => (
              <FooterLink key={item.cat} to={`/catalogue?cat=${item.cat}`}>{item.label}</FooterLink>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.09em', color: 'var(--bark-3)', marginBottom: 14,
            }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--bark-2)' }}>
                <MapPinIcon size={15} /> Saragosse, Espagne
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--bark-2)' }}>
                <MailIcon size={15} /> contacto@electro-domesticos.com
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--bark-2)' }}>
                <ClockIcon size={15} /> Lun–Ven, 9h–18h
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid var(--border)',
          marginTop: 40, padding: '18px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 12, color: 'var(--bark-3)',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span>&copy; 2026 Electrodomésticos</span>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {[
              { to: '/suivi-commande', label: 'Suivi de commande' },
              { to: '/mentions-legales', label: 'Mentions légales' },
              { to: '/cgv', label: 'CGV' },
              { to: '/confidentialite', label: 'Confidentialité' },
              { to: '/cookies', label: 'Cookies' },
              { to: '/livraison-retours', label: 'Livraisons & retours' },
            ].map(item => (
              <FooterLink key={item.to} to={item.to}>{item.label}</FooterLink>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 28px !important;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 380px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} style={{
      display: 'inline-block', color: 'var(--bark-3)', textDecoration: 'none',
      fontSize: 13, padding: '4px 0', transition: 'all 0.2s',
      minHeight: 'var(--touch)', lineHeight: 'var(--touch)',
    }}
    onMouseEnter={e => {
      e.target.style.color = 'var(--terracotta)';
      e.target.style.paddingLeft = '4px';
    }}
    onMouseLeave={e => {
      e.target.style.color = 'var(--bark-3)';
      e.target.style.paddingLeft = '0';
    }}
    >{children}</Link>
  );
}