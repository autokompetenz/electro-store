const BASE = '/api';

async function fetchJson(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erreur ${res.status}`);
  }
  return res.json();
}

export function getProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return fetchJson(`/products${qs ? '?' + qs : ''}`);
}

export function getProduct(slug) {
  return fetchJson(`/products/${encodeURIComponent(slug)}`);
}

export function getCategories() {
  return fetchJson('/categories');
}

export function createOrder(data) {
  return fetchJson('/orders', { method: 'POST', body: JSON.stringify(data) });
}

export function subscribeNewsletter(email) {
  return fetchJson('/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
}

export function sendMessage(data) {
  return fetchJson('/contact', { method: 'POST', body: JSON.stringify(data) });
}

export function getOrder(id) {
  return fetchJson(`/orders/${encodeURIComponent(id)}`);
}

export function searchOrders(q) {
  return fetchJson(`/orders/search?q=${encodeURIComponent(q)}`);
}