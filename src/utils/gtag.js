export const ADS_ID = 'AW-18506392203';

// Label de conversion Google Ads pour l'achat (format "abcdEFGHijk", la partie
// après le "/" de "AW-18506392203/abcdEFGHijk").
// À récupérer dans Google Ads → Objectifs → Conversions → votre action d'achat.
// Tant qu'il est vide, l'achat est suivi côté Analytics (event "purchase") mais
// aucune conversion dédiée n'est envoyée ; il suffira de renseigner ce label.
export const PURCHASE_CONVERSION_LABEL = '';

export function gtag(...args) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag(...args);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export function trackPageView(path) {
  gtag('event', 'page_view', {
    send_to: ADS_ID,
    page_path: path,
  });
}

export function trackAddToCart({ id, name, category, price, quantity = 1 }) {
  const qty = Number(quantity);
  gtag('event', 'add_to_cart', {
    send_to: ADS_ID,
    currency: 'EUR',
    value: Number(price) * qty,
    items: [{
      item_id: String(id),
      item_name: name,
      item_category: category,
      price: Number(price),
      quantity: qty,
    }],
  });
}

export function trackInitiateCheckout({ value, numItems }) {
  gtag('event', 'begin_checkout', {
    send_to: ADS_ID,
    currency: 'EUR',
    value: Number(value),
    num_items: Number(numItems),
  });
}

export function trackPurchase({ orderId, value, items = [] }) {
  gtag('event', 'purchase', {
    send_to: ADS_ID,
    transaction_id: orderId,
    currency: 'EUR',
    value: Number(value),
    items: items.map(i => ({
      item_id: String(i.product?.id ?? i.id ?? ''),
      item_name: i.product?.name ?? i.name ?? '',
      item_category: i.product?.category ?? i.category ?? '',
      price: Number(i.product?.price ?? i.price ?? 0),
      quantity: Number(i.qty || 1),
    })),
  });

  if (PURCHASE_CONVERSION_LABEL) {
    gtag('event', 'conversion', {
      send_to: `${ADS_ID}/${PURCHASE_CONVERSION_LABEL}`,
      transaction_id: orderId,
      currency: 'EUR',
      value: Number(value),
    });
  }
}
