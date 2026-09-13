import { useState } from 'react';
import { CheckIcon } from './Icons';
import { subscribeNewsletter } from '../api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSending(true);
    setError('');
    try {
      await subscribeNewsletter(email.trim());
      setDone(true);
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error, inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section-pad" style={{ background: 'var(--sand)' }}>
      <div className="container">
        <div className="card" style={{
          padding: 'clamp(28px, 6vw, 56px)',
          background: 'var(--cream)',
          borderColor: 'var(--terracotta-border)',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 'clamp(24px, 4vw, 48px)',
            alignItems: 'center',
          }} className="newsletter-grid">
            <div>
              <div className="section-eyebrow" style={{ color: 'var(--terracotta)' }}>Newsletter</div>
              <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', maxWidth: 380, marginBottom: 12 }}>
                -10% en tu primera compra
              </h2>
              <p style={{ color: 'var(--bark-2)', fontSize: 'clamp(13px, 2vw, 14.5px)', lineHeight: 1.7, maxWidth: 430, marginBottom: 22 }}>
                Recibe nuestras novedades, los nuevos lanzamientos y las ofertas antes que nadie.
                Un email a la semana, nunca spam. Baja con un solo clic.
              </p>

              {done ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(253,251,247,0.85)', border: '1px solid var(--terracotta-border)',
                  borderRadius: 12, padding: '14px 18px',
                  fontSize: 14, fontWeight: 600, color: 'var(--bark)',
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'var(--terracotta)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <CheckIcon size={12} />
                  </span>
                  ¡Gracias! Tu código -10% llega a tu correo.
                </div>
              ) : (
                <form onSubmit={submit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.es"
                    aria-label="Tu dirección de email"
                    style={{
                      flex: 1, minWidth: 200,
                      height: 'var(--touch)', padding: '0 18px',
                      border: '1px solid var(--border-2)', borderRadius: 12,
                      background: 'rgba(253,251,247,0.95)', fontSize: 16,
                      color: 'var(--bark)', outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = 'var(--terracotta)';
                      e.target.style.boxShadow = '0 0 0 3px var(--terracotta-bg)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'var(--border-2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button type="submit" className="btn-primary" disabled={sending}>
                    {sending ? 'Enviando…' : 'Quiero aprovecharlo'}
                  </button>
                </form>
              )}
              {error && (
                <p style={{ color: 'var(--terracotta)', fontSize: 12, marginTop: 8 }}>
                  {error}
                </p>
              )}

              <p style={{ fontSize: 11, color: 'var(--bark-3)', marginTop: 12 }}>
                Tus datos se quedan con nosotros. Consulta nuestra política de privacidad.
              </p>
            </div>

            {/* Visual */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: 'clamp(160px, 22vw, 220px)', height: 'clamp(160px, 22vw, 220px)',
                borderRadius: '50%', background: 'var(--terracotta-bg)',
                border: '1px solid var(--terracotta-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  fontSize: 'clamp(34px, 6vw, 48px)', fontWeight: 700,
                  fontStyle: 'normal',
                  color: 'var(--terracotta-dark)', letterSpacing: '-0.03em',
                }}>-10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .newsletter-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}