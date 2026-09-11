import nodemailer from 'nodemailer';

const cfg = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.SMTP_FROM || process.env.SMTP_USER,
};

let transporter = null;

function getTransporter() {
  if (!cfg.host || !cfg.user) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.port === 465,
      auth: { user: cfg.user, pass: cfg.pass },
    });
  }
  return transporter;
}

const euro = n => `${Number(n).toFixed(2)} €`;

function escapeHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function appUrl() {
  return (process.env.APP_URL || 'http://localhost:5173').replace(/\/+$/, '');
}

function itemImage(it) {
  const url = it?.image || '';
  if (/^https?:\/\//.test(url)) return escapeHtml(url);
  return escapeHtml(`${appUrl()}/img/products/${it?.slug || ''}.jpg`);
}

function trackingLink(orderId) {
  return `${appUrl()}/suivi-commande?ref=${orderId}`;
}

// ── Lignes de produits (avec image) ─────────────
function orderRows(items) {
  return (items || []).map(it => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;">
        <table role="presentation" style="border-collapse:collapse;"><tr>
          <td style="padding:0 12px 0 0;vertical-align:middle;">
            <img src="${itemImage(it)}" alt="" width="56" height="56"
                 style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #eee;display:block;"/>
          </td>
          <td style="vertical-align:middle;font-size:14px;color:#333;">
            <div style="font-weight:600;">${escapeHtml(it.name)}</div>
            <div style="color:#8a857c;font-size:12.5px;margin-top:2px;">× ${it.qty} · ${euro(it.unit_price)}</div>
          </td>
        </tr></table>
      </td>
      <td align="right" style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;color:#333;vertical-align:middle;white-space:nowrap;">
        ${euro(it.unit_price * it.qty)}
      </td>
    </tr>`).join('');
}

function bankBlock(bank) {
  return bank
    ? `
      <div style="background:#f7f3ec;border:1px dashed #d9c9b0;border-radius:12px;padding:16px 18px;margin-top:20px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#8a857c;margin-bottom:10px;">
          Paiement par virement bancaire
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:13px;color:#333;">
          <tr>
            <td style="padding:6px 0;color:#8a857c;">Titulaire du compte</td>
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
            <td style="padding:6px 0;color:#8a857c;">Motif à indiquer</td>
            <td style="padding:6px 0;font-weight:700;text-align:right;">${escapeHtml(bank.motif)}</td>
          </tr>
        </table>
        <p style="font-size:12px;color:#8a857c;margin:8px 0 0;line-height:1.6;">
          Votre commande sera expédiée dès réception du virement.
        </p>
      </div>`
    : '';
}

function orderSummary(order, items, { total, savings }, showBank) {
  return `
    <div style="background:#f7f3ec;border-radius:12px;padding:16px 18px;margin-bottom:20px;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#8a857c;margin-bottom:8px;">Livraison</div>
      <div style="font-size:14px;color:#333;line-height:1.6;white-space:pre-line;">${escapeHtml(order.address)}</div>
    </div>

    <table style="width:100%;border-collapse:collapse;">
      ${orderRows(items)}
    </table>

    <div style="margin-top:16px;text-align:right;">
      ${savings > 0 ? `<div style="font-size:13px;color:#B05500;margin-bottom:4px;">Économies −${euro(savings)}</div>` : ''}
      <div style="font-size:18px;font-weight:700;color:#120f0c;">Total ${euro(total)}</div>
    </div>

    ${showBank ? bankBlock(showBank) : ''}`;
}

const STATUS_MAILS = {
  received: {
    pill: 'En attente de confirmation',
    pillBg: '#f7f3ec', pillColor: '#8a857c',
    message: 'Merci ! Votre commande est bien enregistrée. Nous vérifions le paiement avant de confirmer : vous restez maître de votre colis, sans surprise.',
    cta: true,
  },
  confirmed: {
    pill: 'Confirmée',
    pillBg: '#eaf4e6', pillColor: '#2f7d32',
    message: 'Bonne nouvelle : votre commande est confirmée. Nous préparons soigneusement votre colis.',
    cta: true,
  },
  shipped: {
    pill: 'En cours de livraison',
    pillBg: '#eaf4e6', pillColor: '#2f7d32',
    message: 'Votre colis est en route ! Comptez 2 à 5 jours ouvrés pour le recevoir.',
    cta: true,
  },
  delivered: {
    pill: 'Livrée',
    pillBg: '#eaf4e6', pillColor: '#2f7d32',
    message: 'Votre commande est arrivée. On espère qu\'elle vous plaît — à bientôt !',
    cta: false,
  },
  cancelled: {
    pill: 'Annulée',
    pillBg: '#fbeae8', pillColor: '#b3261e',
    message: 'Votre commande a été annulée. Aucun prélèvement ne sera effectué ; si vous avez déjà payé, le remboursement est en cours.',
    cta: false,
  },
  rejected: {
    pill: 'Rejetée',
    pillBg: '#fbeae8', pillColor: '#b3261e',
    message: 'Le paiement de votre commande a été rejeté. Si vous souhaitez finaliser l\'achat, contactez notre service client.',
    cta: false,
  },
};

const SUBJECTS = {
  received: id => `Commande ${id} enregistrée — Electro Store`,
  confirmed: id => `Commande ${id} confirmée — Electro Store`,
  shipped: id => `Commande ${id} en cours de livraison — Electro Store`,
  delivered: id => `Commande ${id} livrée — Electro Store`,
  cancelled: id => `Commande ${id} annulée — Electro Store`,
  rejected: id => `Commande ${id} rejetée — Electro Store`,
};

function simulate(t, to, subject, html) {
  console.log('\n── [EMAIL SIMULÉ] ──');
  console.log('À:', to);
  console.log('Sujet:', subject);
  console.log(html.replace(/\s+/g, ' ').slice(0, 400), '…\n────────────────');
  return { simulated: true, t };
}

async function dispatch(to, subject, html) {
  const t = getTransporter();
  if (!t) return simulate(t, to, subject, html);
  await t.sendMail({ from: cfg.from, to, subject, html });
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

  const body = `
  <div style="background:#573c30;padding:28px 32px;color:#fff;">
    <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em;">Electro Store</div>
    <div style="font-size:13px;opacity:.85;margin-top:6px;">Commande n°${order.id}</div>
    <div style="display:inline-block;margin-top:14px;background:${meta.pillBg};color:${meta.pillColor};font-size:12.5px;font-weight:700;padding:6px 12px;border-radius:100px;">
      ${meta.pill}
    </div>
  </div>

  <div style="padding:28px 32px;">
    <p style="font-size:15px;color:#333;margin:0 0 20px;line-height:1.6;">
      ${meta.message}
    </p>

    ${orderSummary(order, items, totals, status === 'received' ? bank : null)}

    ${meta.cta ? `
      <div style="background:#f7f3ec;border-radius:12px;padding:16px 18px;margin-top:20px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#8a857c;margin-bottom:10px;">Suivre ma commande</div>
        <a href="${trackingLink(order.id)}" style="display:inline-block;background:#b4552d;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 18px;border-radius:10px;">
          Voir l'avancement
        </a>
      </div>` : ''}

    <p style="font-size:12px;color:#8a857c;margin:22px 0 0;line-height:1.6;">
      Une question ? Répondez simplement à cet email.
      Retour gratuit sous 30 jours.
    </p>
  </div>`;

  return dispatch(order.email, subject, wrapMail(body));
}

// ── Email admin : chaque commande ────────────────
export async function sendAdminOrderNotification(order, items, totals, bank = null) {
  const subject = `Nouvelle commande n°${order.id} — ${String(totals.total ?? 0)}`;
  const to = process.env.ADMIN_EMAIL || cfg.user;
  const created = order.created_at || new Date().toLocaleString('fr-FR');
  const paymentNote = bank
    ? `<div style="font-size:13px;color:#333;background:#f7f3ec;border-radius:8px;padding:10px 12px;margin-top:12px;">
         Paiement par virement : <strong>${escapeHtml(bank.titular)}</strong> · IBAN <strong>${escapeHtml(bank.iban)}</strong> · motif <strong>${escapeHtml(bank.motif)}</strong>
       </div>`
    : '';

  const body = `
  <div style="background:#2c4a3b;padding:28px 32px;color:#fff;">
    <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em;">Electro Store</div>
    <div style="font-size:13px;opacity:.85;margin-top:6px;">📦 Nouvelle commande à traiter</div>
  </div>

  <div style="padding:28px 32px;">
    <div style="background:#f7f3ec;border-radius:12px;padding:16px 18px;margin-bottom:20px;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#8a857c;margin-bottom:8px;">Client</div>
      <div style="font-size:15px;font-weight:700;color:#333;">${escapeHtml(order.name)}</div>
      <div style="font-size:13.5px;color:#333;">${escapeHtml(order.email)}</div>
      <div style="font-size:12.5px;color:#8a857c;margin-top:6px;">Commandé le ${escapeHtml(created)}</div>
    </div>

    ${orderSummary(order, items, totals, null)}
    ${paymentNote}

    <p style="font-size:12px;color:#8a857c;margin:20px 0 0;line-height:1.6;">
      <a href="${trackingLink(order.id)}" style="color:#b4552d;font-weight:600;">Voir le détail dans l'admin</a>
    </p>
  </div>`;

  return dispatch(to, subject, wrapMail(body));
}