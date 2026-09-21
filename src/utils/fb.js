export const PIXEL_ID = '1045680988517829';

export function fbq(...args) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq(...args);
}

export function trackPageView() {
  fbq('track', 'PageView');
}

export function trackAddToCart({ id, name, category, price, quantity = 1 }) {
  fbq('track', 'AddToCart', {
    content_ids: [String(id)],
    content_name: name,
    content_category: category,
    content_type: 'product',
    value: Number(price),
    currency: 'EUR',
    num_items: Number(quantity),
  });
}

export function trackInitiateCheckout({ value, numItems }) {
  fbq('track', 'InitiateCheckout', {
    value: Number(value),
    currency: 'EUR',
    num_items: Number(numItems),
  });
}

export function trackPurchase({ orderId, value, items = [] }) {
  fbq('track', 'Purchase', {
    content_ids: items.map(i => String(i.product?.id ?? i.id ?? '')),
    content_type: 'product',
    num_items: items.reduce((s, i) => s + (i.qty || 1), 0),
    value: Number(value),
    currency: 'EUR',
    order_id: orderId,
  });
}