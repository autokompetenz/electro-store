import { useState } from 'react';
import { MapPinIcon, MailIcon, ClockIcon } from '../components/Icons';
import { sendMessage } from '../api';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setSending(true);
    setError('');
    try {
      await sendMessage({
        name: data.name, email: data.email,
        subject: data.subject, message: data.message,
      });
      setSent(true);
      setTimeout(() => setSent(false), 6000);
    } catch (err) {
      setError(err.message || "No se ha podido enviar el mensaje.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="section-pad">
      <div className="container">
        <div className="section-eyebrow">Hablemos</div>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', marginBottom: 10 }}>
          Contáctanos
        </h1>
        <p style={{ color: 'var(--bark-2)', fontSize: 'clamp(13px, 2vw, 15px)', maxWidth: 520, marginBottom: 'clamp(32px, 5vw, 48px)', lineHeight: 1.7 }}>
          ¿Tienes una pregunta sobre un producto, un presupuesto o una devolución? Respondemos en menos de 24h.
          Sin chatbot, sin menús interminables. Solo una persona.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: '1.2fr 1fr',
          gap: 'clamp(28px, 5vw, 56px)',
        }} className="contact-grid">
          {/* Form */}
          <div className="card" style={{ padding: 'clamp(24px, 4vw, 36px) clamp(20px, 3vw, 32px)' }}>
            {sent ? (
              <div style={{ padding: '32px 0', textAlign: 'center' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, margin: '0 auto 18px',
                  background: 'var(--olive-bg)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--olive-dark)',
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 17, marginBottom: 6 }}>Mensaje enviado</h3>
                <p style={{ color: 'var(--bark-3)', fontSize: 14 }}>Te respondemos en 24h. Gracias.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { label: 'Tu nombre', type: 'text', name: 'name', placeholder: 'Juan García' },
                    { label: 'Correo electrónico', type: 'email', name: 'email', placeholder: 'juan@email.com' },
                    { label: 'Asunto', type: 'text', name: 'subject', placeholder: 'Pregunta sobre un producto, presupuesto...' },
                  ].map(field => (
                    <div key={field.label}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--bark-2)', marginBottom: 5, display: 'block' }}>
                        {field.label}
                      </label>
                      <input type={field.type} className="input-luxury" name={field.name} placeholder={field.placeholder} required />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--bark-2)', marginBottom: 5, display: 'block' }}>
                      Mensaje
                    </label>
                    <textarea className="input-luxury" name="message" rows={4} placeholder="Describe tu consulta..." required />
                  </div>
                  {error && (
                    <p style={{ color: 'var(--terracotta)', fontSize: 12.5 }}>{error}</p>
                  )}
                  <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={sending}>
                    {sending ? 'Enviando…' : 'Enviar mensaje'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: <MapPinIcon />, title: 'Dirección', text: 'Ronda del Canal Imperial de Aragón,\n18-20 · 50197 Zaragoza, España' },
              { icon: <MailIcon />, title: 'Correo electrónico', text: 'contacto@electro-domesticos.com\nRespuesta en 24h' },
              { icon: <ClockIcon />, title: 'Horario', text: 'Lunes – Viernes\n9:00 – 18:00' },
            ].map(card => (
              <div key={card.title} className="card" style={{
                padding: 'clamp(16px, 3vw, 22px)', display: 'flex', gap: 14,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: 'var(--terracotta-bg)', border: '1px solid var(--terracotta-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--terracotta)',
                }}>
                  {card.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>{card.title}</h3>
                  <p style={{ fontSize: 12.5, color: 'var(--bark-3)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {card.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </main>
  );
}
