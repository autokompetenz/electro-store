const BASE = '/api/admin';
const TOKEN_KEY = 'electro_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function adminFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401 && !path.startsWith('/login')) {
    setToken(null);
    window.location.href = '/admin/login';
    throw new Error('Session expirée');
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Erreur ${res.status}`);
  return body;
}

export function adminLogin(password) {
  return adminFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export function getAdminMe() {
  return adminFetch('/me');
}

export function getAdminStats() {
  return adminFetch('/stats');
}

export function getAdminOrders(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return adminFetch(`/orders${qs ? '?' + qs : ''}`);
}

export function getAdminOrder(id) {
  return adminFetch(`/orders/${id}`);
}

export function setOrderStatus(id, status) {
  return adminFetch(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function getBankSettings() {
  return adminFetch('/settings/bank');
}

export function saveBankSettings(data) {
  return adminFetch('/settings/bank', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function getAdminCategories() {
  return fetch('/api/categories').then(r => r.json());
}

export function createAdminProduct(formData) {
  return adminFetch('/products', { method: 'POST', body: formData });
}

export function updateAdminProduct(id, formData) {
  return adminFetch(`/products/${id}`, { method: 'PUT', body: formData });
}

export function deleteAdminProduct(id) {
  return adminFetch(`/products/${id}`, { method: 'DELETE' });
}