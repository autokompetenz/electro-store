import { Link, useLocation } from 'react-router-dom';

export const legalNav = [
  { to: '/mentions-legales', label: 'Mentions légales', num: '1' },
  { to: '/confidentialite', label: 'Confidentialité', num: '2' },
  { to: '/cookies', label: 'Cookies', num: '3' },
  { to: '/cgv', label: 'Conditions de vente', num: '4' },
  { to: '/livraison-retours', label: 'Livraisons & retours', num: '5' },
];

export function LegalLayout({ title, intro, updated, children }) {
  const location = useLocation();

  return (
    <main className="section-pad">
      <div className="container">
        <div className="section-eyebrow">Informations légales</div>
        <h1 style={{ fontSize: 'clamp(26px, 5vw, 40px)', maxWidth: 560 }}>
          {title}
        </h1>
        {intro && (
          <p style={{
            color: 'var(--bark-2)', fontSize: 'clamp(14px, 2vw, 15px)',
            maxWidth: 640, marginTop: 12, lineHeight: 1.7,
          }}>
            {intro}
          </p>
        )}

        <div className="legal-layout">
          {/* Nav */}
          <aside className="legal-sidebar" aria-label="Documents légaux">
            {legalNav.map(item => {
              const active = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to} className={`legal-link ${active ? 'active' : ''}`}>
                  <span className="legal-link-num">{item.num}</span>
                  {item.label}
                </Link>
              );
            })}
          </aside>

          {/* Content */}
          <div>
            <div className="card legal-card">
              {children}
            </div>
            <p className="legal-updated">
              Dernière mise à jour : {updated}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export function LegalSection({ n, title, children }) {
  return (
    <section className="legal-section">
      <h2>
        <span className="legal-sec-num">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}