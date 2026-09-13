export default function PromoBar() {
  return (
    <div style={{
      background: 'var(--terracotta)', color: '#fff',
      fontSize: 12, fontWeight: 600, letterSpacing: '0.02em',
      textAlign: 'center', padding: '7px var(--page-side)',
    }}>
      <span>Envío gratis a partir de 99 €</span>
      <span className="promo-sep" style={{ margin: '0 12px', opacity: 0.5 }}>·</span>
      <span className="promo-mid">Devolución gratuita durante 30 días</span>
      <span className="promo-sep" style={{ margin: '0 12px', opacity: 0.5 }}>·</span>
      <span>Garantía 3 años incluida</span>

      <style>{`
        @media (max-width: 640px) {
          .promo-mid, .promo-sep { display: none; }
        }
      `}</style>
    </div>
  );
}