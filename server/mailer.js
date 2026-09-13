import './env.js';
import nodemailer from 'nodemailer';
import { randomUUID } from 'node:crypto';

const cfg = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  fromName: process.env.SMTP_FROM || process.env.SMTP_USER,
};

let transporter = null;

function getTransporter() {
  if (!cfg.host || !cfg.user) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.port === 465,
      pool: true,
      maxConnections: 5,
      auth: { user: cfg.user, pass: cfg.pass },
    });
  }
  return transporter;
}

const euro = n => `${(Number(n) || 0).toFixed(2)} €`;
const itemUnitPrice = it => Number(it?.unit_price) || Number(it?.price) || 0;

function escapeHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function appUrl() {
  return (process.env.APP_URL || 'http://localhost:5173').replace(/\/+$/, '');
}

function imageUrl(it) {
  const url = it?.image || '';
  if (/^https?:\/\//.test(url)) return url;
  return `${appUrl()}/img/products/${it?.slug || ''}.jpg`;
}

async function attachItemImage(it) {
  const cid = `img-${it?.slug || 'item'}@electro-store`;
  try {
    const res = await fetch(imageUrl(it), { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    return {
      cid,
      attachment: {
        filename: `${it?.slug || 'item'}.jpg`,
        cid,
        content: Buffer.from(await res.arrayBuffer()),
        contentType: res.headers.get('content-type') || 'image/jpeg',
      },
    };
  } catch {
    return null;
  }
}

function trackingLink(orderId) {
  return `${appUrl()}/suivi-commande?ref=${orderId}`;
}

// ── Lignes de produits (image intégrée en pièce jointe cid:) ──
async function orderRows(items) {
  const attachments = [];
  const rows = await Promise.all((items || []).map(async it => {
    const embedded = await attachItemImage(it);
    if (embedded) attachments.push(embedded.attachment);
    const src = embedded ? `cid:${embedded.cid}` : imageUrl(it);
    return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;">
        <table role="presentation" style="border-collapse:collapse;"><tr>
          <td style="padding:0 12px 0 0;vertical-align:middle;">
            <img src="${src}" alt="${escapeHtml(it.name)}" width="56" height="56"
                 style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #eee;display:block;"/>
          </td>
          <td style="vertical-align:middle;font-size:14px;color:#333;">
            <div style="font-weight:600;">${escapeHtml(it.name)}</div>
            <div style="color:#8a857c;font-size:12.5px;margin-top:2px;">× ${it.qty} · ${euro(itemUnitPrice(it))}</div>
          </td>
        </tr></table>
      </td>
      <td align="right" style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;color:#333;vertical-align:middle;white-space:nowrap;">
        ${euro(itemUnitPrice(it) * it.qty)}
      </td>
    </tr>`;
  }));
  const seen = new Set();
  return { rows: rows.join(''), attachments: attachments.filter(a => !seen.has(a.cid) && seen.add(a.cid)) };
}

function bankBlock(bank) {
  return bank
    ? `
      <div style="background:#f7f3ec;border:1px dashed #d9c9b0;border-radius:12px;padding:16px 18px;margin-top:20px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#8a857c;margin-bottom:10px;">
          Pago por transferencia bancaria
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:13px;color:#333;">
          <tr>
            <td style="padding:6px 0;color:#8a857c;">Titular de la cuenta</td>
            <td style="padding:6px 0;font-weight:700;text-align:right;">${escapeHtml(bank.titular)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8a857c;">IBAN</td>
            <td style="padding:6px 0;font-weight:700;text-align:right;">${escapeHtml(bank.iban)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8a857c;">BIC</td>
            <td style="padding:6px 0;font-weight:700;text-align:right;">${escapeHtml(bank.bic)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8a857c;">Concepto a indicar</td>
            <td style="padding:6px 0;font-weight:700;text-align:right;">${escapeHtml(bank.motif)}</td>
          </tr>
        </table>
        <p style="font-size:12px;color:#8a857c;margin:8px 0 0;line-height:1.6;">
          Su pedido se enviará en cuanto recibamos la transferencia.
        </p>
      </div>`
    : '';
}

function orderSummary(order, rows, { total, savings }, showBank) {
  const deliveryLines = [];
  if (order.name) deliveryLines.push(`<div style="font-size:15px;font-weight:700;color:#333;">${escapeHtml(order.name)}</div>`);
  if (order.email) deliveryLines.push(`<div style="font-size:13px;color:#333;">${escapeHtml(order.email)}</div>`);
  if (order.phone) deliveryLines.push(`<div style="font-size:13px;color:#333;">Tel.: ${escapeHtml(order.phone)}</div>`);
  const addr = [order.address, order.country].filter(Boolean).join(', ');
  if (addr) deliveryLines.push(`<div style="font-size:14px;color:#333;margin-top:4px;white-space:pre-line;">${escapeHtml(addr)}</div>`);
  if (order.notes) deliveryLines.push(`<div style="font-size:12.5px;color:#8a857c;margin-top:8px;font-style:italic;">Nota: ${escapeHtml(order.notes)}</div>`);

  return `
    <div style="background:#f7f3ec;border-radius:12px;padding:16px 18px;margin-bottom:20px;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#8a857c;margin-bottom:8px;">Envío</div>
      ${deliveryLines.join('')}
    </div>

    <table style="width:100%;border-collapse:collapse;">
      ${rows}
    </table>

    <div style="margin-top:16px;text-align:right;">
      ${savings > 0 ? `<div style="font-size:13px;color:#B05500;margin-bottom:4px;">Ahorro −${euro(savings)}</div>` : ''}
      <div style="font-size:18px;font-weight:700;color:#120f0c;">Total ${euro(total)}</div>
    </div>

    ${showBank ? bankBlock(showBank) : ''}`;
}

const STATUS_MAILS = {
  received: {
    pill: 'Pendiente de confirmación',
    pillBg: '#f7f3ec', pillColor: '#8a857c',
    message: '¡Gracias! Su pedido ha sido registrado correctamente. Verificamos el pago antes de confirmar: usted mantiene el control de su paquete, sin sorpresas.',
    cta: true,
  },
  confirmed: {
    pill: 'Confirmado',
    pillBg: '#eaf4e6', pillColor: '#2f7d32',
    message: 'Buenas noticias: su pedido está confirmado. Estamos preparando su paquete con esmero.',
    cta: true,
  },
  shipped: {
    pill: 'En proceso de entrega',
    pillBg: '#eaf4e6', pillColor: '#2f7d32',
    message: '¡Su paquete está en camino! Cuente entre 2 y 5 días laborables para recibirlo.',
    cta: true,
  },
  delivered: {
    pill: 'Entregado',
    pillBg: '#eaf4e6', pillColor: '#2f7d32',
    message: 'Su pedido ha llegado. ¡Esperamos que le guste — hasta pronto!',
    cta: false,
  },
  cancelled: {
    pill: 'Cancelado',
    pillBg: '#fbeae8', pillColor: '#b3261e',
    message: 'Su pedido ha sido cancelado. No se realizará ningún cargo; si ya ha pagado, el reembolso está en proceso.',
    cta: false,
  },
  rejected: {
    pill: 'Rechazado',
    pillBg: '#fbeae8', pillColor: '#b3261e',
    message: 'El pago de su pedido ha sido rechazado. Si desea finalizar la compra, contacte con nuestro servicio de atención al cliente.',
    cta: false,
  },
};

const SUBJECTS = {
  received: id => `Pedido ${id} registrado — Electro Store`,
  confirmed: id => `Pedido ${id} confirmado — Electro Store`,
  shipped: id => `Pedido ${id} en proceso de entrega — Electro Store`,
  delivered: id => `Pedido ${id} entregado — Electro Store`,
  cancelled: id => `Pedido ${id} cancelado — Electro Store`,
  rejected: id => `Pedido ${id} rechazado — Electro Store`,
};

function simulate(t, to, subject, html) {
  console.log('\n── [EMAIL SIMULÉ] ──');
  console.log('À:', to);
  console.log('Sujet:', subject);
  console.log(html.replace(/\s+/g, ' ').slice(0, 400), '…\n────────────────');
  return { simulated: true, t };
}

function htmlToText(html) {
  return String(html || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ').trim();
}

async function dispatch(to, subject, html, attachments = []) {
  const t = getTransporter();
  if (!t) return simulate(t, to, subject, html);
  await t.sendMail({
    from: { name: cfg.fromName, address: cfg.user },
    to,
    subject,
    html,
    attachments,
    text: htmlToText(html),
    headers: {
      'X-Mailer': 'Electro Store Mailer',
      'X-Entity-Ref-ID': `es-${randomUUID()}`,
      'Precedence': 'bulk',
      'List-Unsubscribe': `<mailto:${cfg.user}?subject=unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });
  return { simulated: false, t };
}

function wrapMail(body) {
  return `
  <div style="background:#f5f2ed;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e8e4dd;">
      ${body}
    </div>
  </div>`;
}

// ── Email client : selon le statut ───────────────
export async function sendOrderStatusEmail(order, items, totals, status, bank = null) {
  const meta = STATUS_MAILS[status] || STATUS_MAILS.received;
  const subject = (SUBJECTS[status] || SUBJECTS.received)(order.id);
  const { rows, attachments } = await orderRows(items);

  const body = `
  <div style="background:#573c30;padding:28px 32px;color:#fff;">
    <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em;">Electro Store</div>
    <div style="font-size:13px;opacity:.85;margin-top:6px;">Pedido n.º ${order.id}</div>
    <div style="display:inline-block;margin-top:14px;background:${meta.pillBg};color:${meta.pillColor};font-size:12.5px;font-weight:700;padding:6px 12px;border-radius:100px;">
      ${meta.pill}
    </div>
  </div>

  <div style="padding:28px 32px;">
    <p style="font-size:15px;color:#333;margin:0 0 20px;line-height:1.6;">
      ${meta.message}
    </p>

    ${orderSummary(order, rows, totals, status === 'received' ? bank : null)}

    ${meta.cta ? `
      <div style="background:#f7f3ec;border-radius:12px;padding:16px 18px;margin-top:20px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#8a857c;margin-bottom:10px;">Seguir mi pedido</div>
        <a href="${trackingLink(order.id)}" style="display:inline-block;background:#b4552d;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 18px;border-radius:10px;">
          Ver el estado del pedido
        </a>
      </div>` : ''}

    <p style="font-size:12px;color:#8a857c;margin:22px 0 0;line-height:1.6;">
      ¿Tiene alguna pregunta? Simplemente responda a este correo.
      Devolución gratuita en 30 días.
    </p>
  </div>`;

  return dispatch(order.email, subject, wrapMail(body), attachments);
}

// ── Email admin : chaque commande ────────────────
export async function sendAdminOrderNotification(order, items, totals, bank = null) {
  const subject = `Nuevo pedido n.º ${order.id} — ${String(totals.total ?? 0)}`;
  const { rows, attachments } = await orderRows(items);
  const to = process.env.ADMIN_EMAIL || cfg.user;
  const created = order.created_at || new Date().toLocaleString('fr-FR');
  const paymentNote = bank
    ? `<div style="font-size:13px;color:#333;background:#f7f3ec;border-radius:8px;padding:10px 12px;margin-top:12px;">
         Pago por transferencia: <strong>${escapeHtml(bank.titular)}</strong> · IBAN <strong>${escapeHtml(bank.iban)}</strong> · concepto <strong>${escapeHtml(bank.motif)}</strong>
       </div>`
    : '';

  const body = `
  <div style="background:#2c4a3b;padding:28px 32px;color:#fff;">
    <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em;">Electro Store</div>
    <div style="font-size:13px;opacity:.85;margin-top:6px;">📦 Nuevo pedido por procesar</div>
  </div>

  <div style="padding:28px 32px;">
    <div style="background:#f7f3ec;border-radius:12px;padding:16px 18px;margin-bottom:20px;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#8a857c;margin-bottom:8px;">Cliente</div>
      <div style="font-size:15px;font-weight:700;color:#333;">${escapeHtml(order.name)}</div>
      <div style="font-size:13.5px;color:#333;">${escapeHtml(order.email)}</div>
      <div style="font-size:12.5px;color:#8a857c;margin-top:6px;">Pedido realizado el ${escapeHtml(created)}</div>
    </div>

    ${orderSummary(order, rows, totals, null)}
    ${paymentNote}

    <p style="font-size:12px;color:#8a857c;margin:20px 0 0;line-height:1.6;">
      <a href="${trackingLink(order.id)}" style="color:#b4552d;font-weight:600;">Ver el detalle en el panel de administración</a>
    </p>
  </div>`;

  return dispatch(to, subject, wrapMail(body), attachments);
}