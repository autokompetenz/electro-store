import { useEffect, useState } from 'react';
import { getSeoStatus, getSeoStats, getAdminTraffic } from '../../adminApi';
import { CheckIcon, CloseIcon } from '../../components/Icons';

const RANGES = [
  { days: 7, label: '7 días' },
  { days: 28, label: '28 días' },
  { days: 90, label: '90 días' },
];

const fmtNum = n => new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(n ?? 0);
const fmtDec = n => Number(n ?? 0).toFixed(1);

function cleanPage(url) {
  try {
    const u = new URL(url);
    return u.pathname === '/' ? '/' : `${u.pathname}${u.search}`;
  } catch {
    return url;
  }
}

function pctDelta(a, b) {
  if (!b) return null;
  return ((a - b) / b) * 100;
}

function Trend({ delta, invert = false, points = false }) {
  if (delta === null || Number.isNaN(delta)) return null;
  const up = delta >= 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 11.5, fontWeight: 700,
      color: up ? (invert ? 'var(--terracotta)' : '#1a7f4b') : (invert ? '#1a7f4b' : 'var(--terracotta)'),
    }}>
      <span style={{ fontSize: 9 }}>{up ? '▲' : '▼'}</span>
      {delta > 0 ? '+' : ''}{delta.toFixed(0)}{points ? ' pt' : '%'}
    </span>
  );
}

function StatCard({ label, value, sub, trend }) {
  return (
    <div className="card" style={{ padding: '18px 20px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
      }}>
        <div style={{
          fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--bark-3)',
        }}>{label}</div>
        {trend}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6, color: 'var(--bark)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--bark-3)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Table({ head, rows }) {
  if (!rows || rows.length === 0) {
    return <p style={{ color: 'var(--bark-3)', fontSize: 13 }}>Sin datos en este periodo.</p>;
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 480 }}>
        <thead>
          <tr style={{ color: 'var(--bark-3)', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {head.map((h, i) => (
              <th key={i} style={{
                textAlign: i === 0 ? 'left' : 'right', fontWeight: 700,
                padding: '0 0 8px', borderBottom: '1px solid var(--border)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
              {r.cells.map((c, j) => (
                <td key={j} style={{
                  padding: '9px 2px', textAlign: j === 0 ? 'left' : 'right',
                  color: j === 0 ? 'var(--bark)' : 'var(--bark-2)', fontWeight: j === 0 ? 600 : 500,
                  maxWidth: j === 0 ? 320 : undefined,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminSeo() {
  const [status, setStatus] = useState(null);
  const [days, setDays] = useState(28);
  const [data, setData] = useState(null);
  const [traffic, setTraffic] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSeoStatus()
      .then(setStatus)
      .catch(() => setStatus({ configured: false, connected: false, error: 'No se pudo contactar el servidor' }));
  }, []);

  useEffect(() => {
    if (!status?.configured) return;
    let alive = true;
    setLoading(true);
    setError('');
    getSeoStats(days)
      .then(d => { if (alive) { setData(d); setLoading(false); } })
      .catch(e => { if (alive) { setError(e.message); setLoading(false); } });
    return () => { alive = false; };
  }, [status?.configured, days]);

  useEffect(() => {
    if (status?.configured) return;
    let alive = true;
    setLoading(true);
    setError('');
    getAdminTraffic(days)
      .then(t => { if (alive) { setTraffic(t); setLoading(false); } })
      .catch(e => { if (alive) { setError(e.message); setLoading(false); } });
    return () => { alive = false; };
  }, [status?.configured, days]);

  if (!status) {
    return <p style={{ color: 'var(--bark-3)', fontSize: 14 }}>Consultando configuración…</p>;
  }

  const rangeBar = (
    <div style={{ display: 'flex', gap: 6, background: 'var(--sand)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
      {RANGES.map(r => (
        <button
          key={r.days}
          onClick={() => setDays(r.days)}
          style={{
            border: 'none', borderRadius: 7, padding: '8px 14px', cursor: 'pointer',
            fontFamily: 'var(--font)', fontSize: 12.5, fontWeight: 700,
            background: days === r.days ? 'var(--bark)' : 'transparent',
            color: days === r.days ? '#fff' : 'var(--bark-2)',
            transition: 'all 0.2s',
          }}
        >{r.label}</button>
      ))}
    </div>
  );

  if (!status.configured) {
    return <TrafficPanel traffic={traffic} loading={loading} error={error} rangeBar={rangeBar} />;
  }

  const connected = status.connected;

  const s = data?.summary;
  const clicksDelta = s ? pctDelta(s.clicks, s.prevClicks) : null;
  const impressionsDelta = s ? pctDelta(s.impressions, s.prevImpressions) : null;
  const ctrDelta = s ? (s.ctr - s.prevCtr) : null;
  const positionDelta = s ? (s.position - s.prevPosition) : null;

  const maxClicks = data ? Math.max(...data.daily.map(d => d.clicks), 1) : 1;
  const labelStep = data ? Math.max(1, Math.ceil(data.daily.length / 9)) : 1;

  const insights = (() => {
    if (!data) return [];
    const out = [];
    const misses = data.queries
      .filter(q => q.impressions >= 50 && q.clicks === 0)
      .slice(0, 3);
    if (misses.length > 0) {
      out.push({
        tone: 'warn',
        text: `Oportunidades: tienes impresiones pero 0 clics en busca de « ${misses.map(m => m.query).join(' », « ')} ». Revisa el título y la descripción de estas páginas.`,
      });
    }
    if (s.position > 10) {
      out.push({
        tone: 'warn',
        text: 'Posición media alta (>10): la mayoría de resultados están en la página 2 de Google. Refuerza contenido y fichas de producto.',

      });
    } else if (s.position <= 5) {
      out.push({ tone: 'ok', text: 'Posición media baja (≤5): buena visibilidad en Google.' });
    }
    if (s.clicks > 0 && s.ctr < 0.03) {
      out.push({ tone: 'warn', text: 'CTR bajo (<3%): mejora títulos, meta descripciones y precios en los resultados de búsqueda.' });
    }
    if (out.length === 0) {
      out.push({ tone: 'ok', text: 'Sin alertas particulares en este periodo. Sigue publicando contenido y mantén el feed de productos actualizado.' });
    }
    return out;
  })();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>SEO y tráfico</h1>
          <p style={{ color: 'var(--bark-3)', fontSize: 13.5 }}>Búsquedas de Google que llegan a <b>www.electro-domesticos.com</b>.</p>
        </div>
        {rangeBar}
      </div>

      {/* État connexion */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
        borderRadius: 10, marginBottom: 18,
        background: connected ? 'var(--olive-bg)' : 'var(--terracotta-bg)',
        border: `1px solid ${connected ? 'var(--olive-border)' : 'var(--terracotta-border)'}`,
        fontSize: 12.5, color: connected ? 'var(--olive-dark)' : 'var(--terracotta)',
      }}>
        {connected ? <CheckIcon size={14} /> : <CloseIcon size={14} />}
        <span>
          {connected
            ? `Conectado a Search Console — propiedad ${status.site}${status.matched ? '' : ' (no aparece en la lista de sitios del servicio)'}`
            : `Fallo de conexión: ${status.error || 'revisa GSC_CLIENT_EMAIL / GSC_PRIVATE_KEY / GSC_SITE_URL'}`}
        </span>
      </div>

      {!connected ? (
        <p style={{ color: 'var(--terracotta)', fontSize: 13.5, lineHeight: 1.6 }}>
          No se pudo conectar con Google Search Console. Revisa <b>GSC_CLIENT_EMAIL</b>, <b>GSC_PRIVATE_KEY</b> y <b>GSC_SITE_URL</b> en el servidor (Vercel → Settings → Environment Variables) y vuelve a desplegar.
        </p>
      ) : error ? (
        <p style={{ color: 'var(--terracotta)', fontSize: 13.5 }}>{error}</p>
      ) : loading || !data ? (
        <p style={{ color: 'var(--bark-3)', fontSize: 14 }}>Cargando datos…</p>
      ) : (
        <div>
          {/* KPI */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 18 }}>
            <StatCard label="Clics" value={fmtNum(s.clicks)} sub={`${fmtNum(s.prevClicks)} en el periodo anterior`} trend={<Trend delta={clicksDelta} />} />
            <StatCard label="Impresiones" value={fmtNum(s.impressions)} sub={`${fmtNum(s.prevImpressions)} en el periodo anterior`} trend={<Trend delta={impressionsDelta} />} />
            <StatCard label="CTR" value={`${(s.ctr * 100).toFixed(1).replace('.', ',')}%`} trend={<Trend delta={ctrDelta} points />} />
            <StatCard label="Posición media" value={fmtDec(s.position)} sub="Menor = mejor" trend={<Trend delta={positionDelta} invert points />} />
          </div>

          {/* Insights */}
          {insights.map((ins, i) => (
            <div key={i} style={{
              padding: '12px 16px', borderRadius: 10, marginBottom: 12,
              background: ins.tone === 'ok' ? 'var(--olive-bg)' : 'rgba(234,131,78,0.12)',
              border: `1px solid ${ins.tone === 'ok' ? 'var(--olive-border)' : 'var(--terracotta-border)'}`,
              fontSize: 13, color: 'var(--bark)', lineHeight: 1.55,
            }}>
              <b>{ins.tone === 'ok' ? '✓ ' : '• '}</b>{ins.text}
            </div>
          ))}

          {/* Tendance journalière */}
          <div className="card" style={{ padding: 20, marginBottom: 18 }}>
            <h2 style={{ fontSize: 15, marginBottom: 16 }}>Clics diarios · Google</h2>
            {data.daily.length === 0 ? (
              <p style={{ color: 'var(--bark-3)', fontSize: 13 }}>Sin datos en este periodo.</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 150 }}>
                {data.daily.map((d, i) => (
                  <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
                    <div style={{
                      width: '100%', maxWidth: 30,
                      borderRadius: '5px 5px 0 0',
                      background: d.clicks > 0 ? 'var(--terracotta)' : 'var(--sand)',
                      height: `${Math.max(3, (d.clicks / maxClicks) * 112)}px`,
                    }} title={`${d.date} · ${d.clicks} clics`} />
                    {i % labelStep === 0 && (
                      <span style={{ fontSize: 9, color: 'var(--bark-3)' }}>{d.date.slice(5)}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18 }} className="admin-cols">
            {/* Top requêtes */}
            <div className="card" style={{ padding: 20 }}>
              <h2 style={{ fontSize: 15, marginBottom: 14 }}>Búsquedas que llevaron al sitio</h2>
              <Table
                head={['Consulta', 'Impr.', 'Clics', 'CTR', 'Pos.']}
                rows={data.queries.slice(0, 20).map(q => ({
                  cells: [
                    q.query,
                    fmtNum(q.impressions),
                    fmtNum(q.clicks),
                    `${(q.ctr * 100).toFixed(1).replace('.', ',')}%`,
                    fmtDec(q.position),
                  ],
                }))}
              />
            </div>

            {/* Top pages */}
            <div className="card" style={{ padding: 20 }}>
              <h2 style={{ fontSize: 15, marginBottom: 14 }}>Páginas más visitadas</h2>
              <Table
                head={['Página', 'Impr.', 'Clics', 'CTR', 'Pos.']}
                rows={data.pages.slice(0, 20).map(p => ({
                  cells: [
                    cleanPage(p.page),
                    fmtNum(p.impressions),
                    fmtNum(p.clicks),
                    `${(p.ctr * 100).toFixed(1).replace('.', ',')}%`,
                    fmtDec(p.position),
                  ],
                }))}
              />
            </div>
          </div>

          <p style={{ color: 'var(--bark-3)', fontSize: 11.5, marginTop: 16, lineHeight: 1.5 }}>
            Datos de Google Search (solo búsqueda web orgánica), periodo {data.period.start} → {data.period.end}. El día en curso no está incluido (los datos de Google son completos hasta ayer).
          </p>

          <style>{`
            @media (max-width: 900px) {
              .admin-cols { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

function TrafficPanel({ traffic, loading, error, rangeBar }) {
  const t = traffic?.summary;
  const visitsDelta = t ? pctDelta(t.visits, t.prevVisits) : null;
  const uniqueDelta = t ? pctDelta(t.uniqueVisitors, t.prevUniqueVisitors) : null;

  const maxVisits = traffic ? Math.max(...traffic.daily.map(d => d.visits), 1) : 1;
  const labelStep = traffic ? Math.max(1, Math.ceil(traffic.daily.length / 9)) : 1;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>SEO y tráfico</h1>
          <p style={{ color: 'var(--bark-3)', fontSize: 13.5 }}>Visitas registradas en <b>electro-domesticos.com</b>.</p>
        </div>
        {rangeBar}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
        borderRadius: 10, marginBottom: 18,
        background: 'var(--olive-bg)', border: '1px solid var(--olive-border)',
        fontSize: 12.5, color: 'var(--olive-dark)', lineHeight: 1.5,
      }}>
        <CheckIcon size={14} />
        <span>
          <b>Suivi interno activo</b> — clics y zonas medidos directamente por la tienda, sin Google Search Console.
          {traffic && ` Últimos ${traffic.period.days} días: ${fmtNum(t.visits)} clics, ${fmtNum(t.uniqueVisitors)} visitantes únicos, ${fmtNum(t.customers)} clientes con pedido.`}
        </span>
      </div>

      {error ? (
        <p style={{ color: 'var(--terracotta)', fontSize: 13.5 }}>{error}</p>
      ) : loading || !traffic ? (
        <p style={{ color: 'var(--bark-3)', fontSize: 14 }}>Cargando datos…</p>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 18 }}>
            <StatCard label="Clics / visites" value={fmtNum(t.visits)} sub={`${fmtNum(t.prevVisits)} en el periodo anterior`} trend={<Trend delta={visitsDelta} />} />
            <StatCard label="Visitantes únicos" value={fmtNum(t.uniqueVisitors)} sub={`${fmtNum(t.prevUniqueVisitors)} en el periodo anterior`} trend={<Trend delta={uniqueDelta} />} />
            <StatCard label="Nuevos visitantes" value={fmtNum(t.newVisitors)} sub="primera visita en el periodo" />
            <StatCard label="Clientes" value={fmtNum(t.customers)} sub="personas que han pedido" />
          </div>

          <div className="card" style={{ padding: 20, marginBottom: 18 }}>
            <h2 style={{ fontSize: 15, marginBottom: 16 }}>Visitas diarias · sitio</h2>
            {traffic.daily.length === 0 ? (
              <p style={{ color: 'var(--bark-3)', fontSize: 13 }}>Sin visitas en este periodo.</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 150 }}>
                {traffic.daily.map((d, i) => (
                  <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
                    <div style={{
                      width: '100%', maxWidth: 30,
                      borderRadius: '5px 5px 0 0',
                      background: d.visits > 0 ? 'var(--terracotta)' : 'var(--sand)',
                      height: `${Math.max(3, (d.visits / maxVisits) * 112)}px`,
                    }} title={`${d.date} · ${d.visits} visita(s)`} />
                    {i % labelStep === 0 && (
                      <span style={{ fontSize: 9, color: 'var(--bark-3)' }}>{d.date.slice(5)}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18 }} className="admin-cols">
            <div className="card" style={{ padding: 20 }}>
              <h2 style={{ fontSize: 15, marginBottom: 14 }}>Zonas de tráfico</h2>
              <Table
                head={['Zona', 'Visitas', 'Visitantes']}
                rows={traffic.byCountry.length === 0 ? [] : traffic.byCountry.map(z => ({
                  cells: [z.country, fmtNum(z.visits), fmtNum(z.visitors)],
                }))}
              />
              {traffic.byCountry.length === 0 && <p style={{ color: 'var(--bark-3)', fontSize: 13 }}>Sin datos en este periodo.</p>}
            </div>

            <div className="card" style={{ padding: 20 }}>
              <h2 style={{ fontSize: 15, marginBottom: 14 }}>Páginas más visitadas</h2>
              <Table
                head={['Página', 'Visitas']}
                rows={traffic.topPages.length === 0 ? [] : traffic.topPages.slice(0, 20).map(p => ({
                  cells: [cleanPage(p.path), fmtNum(p.visits)],
                }))}
              />
              {traffic.topPages.length === 0 && <p style={{ color: 'var(--bark-3)', fontSize: 13 }}>Sin datos en este periodo.</p>}
            </div>
          </div>

          <p style={{ color: 'var(--bark-3)', fontSize: 11.5, marginTop: 16, lineHeight: 1.5 }}>
            Cada visita de página en la tienda se registra automáticamente (ruta, país/zona y visitante). Con Google Search Console conectado verás además clics, impresiones y posiciones de Google.
          </p>

          <style>{`
            @media (max-width: 900px) {
              .admin-cols { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      )}

      <details style={{ marginTop: 18, maxWidth: 720 }}>
        <summary style={{ cursor: 'pointer', fontSize: 12.5, fontWeight: 700, color: 'var(--terracotta)' }}>
          ¿Quieres también las búsquedas de Google? Conecta Search Console →
        </summary>
        <div style={{ marginTop: 12 }}>
          <SetupGuide />
        </div>
      </details>
    </div>
  );
}

function SetupGuide() {
  const env = ['GSC_CLIENT_EMAIL=cuenta-servicio@proyecto.iam.gserviceaccount.com', 'GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----"', 'GSC_SITE_URL=sc-domain:electro-domesticos.com'].join('\n');

  const steps = [
    'En Google Cloud Console (console.cloud.google.com): crea o abre tu proyecto, ve a «IAM y administración → Cuentas de servicio» y crea una cuenta de servicio. Descarga su clave JSON: el campo client_email es GSC_CLIENT_EMAIL y private_key es GSC_PRIVATE_KEY.',
    'Habilita la API en «APIs y servicios → Biblioteca» buscando «Google Search Console API» → Habilitar.',
    'En Search Console (search.google.com/search-console): abre tu propiedad, en «Ajustes → Usuarios y permisos» añade el email de la cuenta de servicio (rol «full»).',
    'Añade en el servidor (Vercel: Project → Settings → Environment Variables, y server/.env en local) las siguientes variables:',
  ];

  return (
    <div className="card" style={{ padding: 22 }}>
      <h2 style={{ fontSize: 15, marginBottom: 6 }}>Conecta Google Search Console (opcional)</h2>
      <p style={{ color: 'var(--bark-3)', fontSize: 13, marginBottom: 16 }}>
        Esta página ya muestra el tráfico de tu tienda. Google Search Console añade las búsquedas orgánicas de Google (clics, impresiones, CTR, posición y consultas). Sigue estos pasos (~10 min):
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 12 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 8, flexShrink: 0,
              background: 'var(--terracotta-bg)', color: 'var(--terracotta)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800,
            }}>{i + 1}</div>
            <div style={{ fontSize: 13, color: 'var(--bark)', lineHeight: 1.6 }}>{step}</div>
          </div>
        ))}
        <pre style={{
          background: 'var(--bark)', color: '#f5efe8', padding: 14, borderRadius: 10,
          fontSize: 12, lineHeight: 1.6, overflowX: 'auto', margin: 0, fontFamily: 'monospace',
        }}>{env}</pre>
      </div>
    </div>
  );
}