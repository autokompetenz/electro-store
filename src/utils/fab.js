import { useEffect, useState } from 'react';

// Convention partagée pour masquer les boutons flottants quand un panneau
// (menu, recherche, comparateur, panier, chatbot…) est ouvert.
// Un composant qui ouvre un panneau émet : setFabHidden('raison', true)
// puis setFabHidden('raison', false) à la fermeture.
export function setFabHidden(reason, open) {
  window.dispatchEvent(new CustomEvent('fab-visibility', { detail: { reason, open } }));
}

export function useFabHidden() {
  const [hiddenReasons, setHiddenReasons] = useState(() => new Set());

  useEffect(() => {
    const handler = (e) => {
      const reason = e.detail?.reason;
      if (!reason) return;
      setHiddenReasons(prev => {
        const next = new Set(prev);
        if (e.detail.open) next.add(reason);
        else next.delete(reason);
        return next;
      });
    };
    window.addEventListener('fab-visibility', handler);
    return () => window.removeEventListener('fab-visibility', handler);
  }, []);

  return hiddenReasons.size > 0;
}
