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

function buildHtml(order, items, total, savings, link, bank) {
  const rows = items.map(it => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;color:#333;">
        ${escapeHtml(it.name)} × ${it.qty}
      </td>
      <td align="right" style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;color:#333;">
        ${euro(it.unit_price * it.qty)}
      </td>
    </tr>`).join('');

  const bankBlock = bank
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

  return `
  <div style="background:#f5f2ed;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e8e4dd;">
      <div style="background:#573c30;padding:28px 32px;color:#fff;">
        <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em;">Electro Store</div>
        <div style="font-size:13px;opacity:.85;margin-top:6px;">Commande confirmée · n°${order.id}</div>
      </div>

      <div style="padding:28px 32px;">
        <p style="font-size:15px;color:#333;margin:0 0 18px;">
          Merci ${order.name} ! Votre commande est bien prise en compte
          et nous prépare ton envoi.
        </p>

        <div style="background:#f7f3ec;border-radius:12px;padding:16px 18px;margin-bottom:20px;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#8a857c;margin-bottom:8px;">Livraison</div>
          <div style="font-size:14px;color:#333;line-height:1.6;white-space:pre-line;">${order.address}</div>
        </div>

        <table style="width:100%;border-collapse:collapse;">
          ${rows}
        </table>

        <div style="margin-top:16px;text-align:right;">
          ${savings > 0 ? `<div style="font-size:13px;color:#B05500;margin-bottom:4px;">Économies −${euro(savings)}</div>` : ''}
          <div style="font-size:18px;font-weight:700;color:#120f0c;">Total ${euro(total)}</div>
        </div>

        ${bankBlock}

        <div style="background:#f7f3ec;border-radius:12px;padding:16px 18px;margin-top:20px;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#8a857c;margin-bottom:8px;">Suivre ma commande</div>
          <a href="${link}" style="display:inline-block;background:#b4552d;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 18px;border-radius:10px;">
            Voir l'avancement de la commande
          </a>
        </div>

        <p style="font-size:12px;color:#8a857c;margin:22px 0 0;line-height:1.6;">
          Une question ? Répondez simplement à cet email.
          Retour gratuit sous 30 jours.
        </p>
      </div>
    </div>
  </div>`;
}

export async function sendOrderConfirmation(order, items, { total, savings }, bank = null) {
  const appUrl = process.env.APP_URL || 'http://localhost:5173';
  const link = `${appUrl}/suivi-commande?ref=${order.id}`;
  const html = buildHtml(order, items, total, savings, link, bank);
  const subject = `Commande ${order.id} confirmée — Electro Store`;

  const t = getTransporter();
  if (!t) {
    console.log('\n── [EMAIL SIMULÉ] ──');
    console.log('À:', order.email);
    console.log('Sujet:', subject);
    console.log(html.replace(/\s+/g, ' ').slice(0, 400), '…\n────────────────');
    return { simulated: true };
  }

  await t.sendMail({ from: cfg.from, to: order.email, subject, html });
  return { simulated: false };
}