// Module Google Search Console : JWT (RS256) auto-signé + Search Analytics API v1.
// Aucune dépendance externe — node:crypto pour la signature, fetch natif (Node ≥ 18).

import crypto from 'node:crypto';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SITES_URL = 'https://www.googleapis.com/webmasters/v3/sites';
const ANALYTICS_URL = site => `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];
const CACHE_TTL_MS = 15 * 60 * 1000;

let cachedToken = null;
let cachedTokenExp = 0;

const cache = new Map();

function b64url(input) {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function normalizePrivateKey(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const pem = raw.replace(/\\n/g, '\n');
  if (/BEGIN [A-Z ]*PRIVATE KEY/.test(pem)) return pem;
  try {
    const decoded = Buffer.from(raw, 'base64').toString('utf8');
    return /BEGIN [A-Z ]*PRIVATE KEY/.test(decoded) ? decoded : pem;
  } catch {
    return pem;
  }
}

export function isConfigured() {
  return Boolean(process.env.GSC_CLIENT_EMAIL && process.env.GSC_PRIVATE_KEY);
}

export function siteUrl() {
  return process.env.GSC_SITE_URL || 'sc-domain:electro-domesticos.com';
}

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedTokenExp) return cachedToken;

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = {
    iss: process.env.GSC_CLIENT_EMAIL,
    scope: SCOPES.join(' '),
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };
  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`;
  const privateKey = normalizePrivateKey(process.env.GSC_PRIVATE_KEY);
  const signature = crypto.createSign('RSA-SHA256').update(signingInput).sign(privateKey);
  const assertion = `${signingInput}.${b64url(signature)}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    const err = new Error(data.error_description || data.error || 'Token de Google rechazado');
    err.code = data.error || 'google_token';
    throw err;
  }

  cachedToken = data.access_token;
  cachedTokenExp = Date.now() + (Number(data.expires_in) - 60) * 1000;
  return cachedToken;
}

async function gscFetch(url, { method = 'GET', body } = {}) {
  const token = await getAccessToken();
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }

  if (!res.ok) {
    const err = new Error(data.error?.message || `Error de la API de Google (${res.status})`);
    err.code = data.error?.status || `gsc_${res.status}`;
    throw err;
  }
  return data;
}

export async function listSites() {
  const data = await gscFetch(SITES_URL);
  return (data.siteEntry || []).map(s => ({ siteUrl: s.siteUrl, permissionLevel: s.permissionLevel }));
}

export async function queryAnalytics({ site, startDate, endDate, dimensions = [], rowLimit = 100 }) {
  const key = JSON.stringify({ site, startDate, endDate, dimensions, rowLimit });
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.rows;

  const data = await gscFetch(ANALYTICS_URL(site), {
    method: 'POST',
    body: {
      startDate,
      endDate,
      searchType: 'web',
      dimensions,
      rowLimit,
    },
  });

  const rows = (data.rows || []).map(r => ({
    key: (r.keys || [])[0] || '',
    clicks: Math.round(r.clicks || 0),
    impressions: Math.round(r.impressions || 0),
    ctr: Number(r.ctr || 0),
    position: Number(r.position || 0),
  }));

  if (cache.size > 20) cache.clear();
  cache.set(key, { rows, at: Date.now() });
  return rows;
}