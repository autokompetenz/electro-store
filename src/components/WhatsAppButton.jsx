import { company } from '../data/company';
import { WhatsAppIcon } from './Icons';
import { useFabHidden } from '../utils/fab';

// Bouton WhatsApp flottant (coin bas-droite), service client.
// Se masque automatiquement quand un panneau flottant est ouvert
// (menu, recherche, comparateur, panier, chatbot).
export default function WhatsAppButton() {
  const hidden = useFabHidden();
  if (hidden) return null;

  return (
    <a
      href={company.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Contactar por WhatsApp (${company.phone})`}
      title={`WhatsApp — Atención al cliente · ${company.phone}`}
      style={{
        position: 'fixed',
        right: 'clamp(14px, 3vw, 24px)',
        bottom: 'clamp(14px, 3vw, 24px)',
        zIndex: 60,
        width: 58, height: 58, borderRadius: '50%',
        background: '#25D366', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none',
        boxShadow: '0 8px 24px rgba(37,211,102,0.45), 0 2px 6px rgba(27,27,28,0.12)',
        transition: 'transform 0.25s var(--ease)',
        animation: 'waFabIn 0.25s var(--ease) both',
      }}
    >
      <WhatsAppIcon size={26} />
      <style>{`@keyframes waFabIn { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </a>
  );
}
