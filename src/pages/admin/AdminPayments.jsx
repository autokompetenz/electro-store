import { useEffect, useState } from 'react';
import { getBankSettings, saveBankSettings } from '../../adminApi';
import { CheckIcon } from '../../components/Icons';

export default function AdminPayments() {
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [titular, setTitular] = useState('');
  const [motif, setMotif] = useState('CMD {num} {nom} {produit}');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getBankSettings()
      .then(s => {
        setIban(s.iban || '');
        setBic(s.bic || '');
        setTitular(s.titular || '');
        setMotif(s.motif || 'CMD {num} {nom} {produit}');
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await saveBankSettings({ iban: iban.trim(), bic: bic.trim(), titular: titular.trim(), motif: motif.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Paiement par virement</h1>
      <p style={{ color: 'var(--bark-3)', fontSize: 13.5, marginBottom: 20, lineHeight: 1.7 }}>
        Ces coordonnées bancaires sont envoyées au client dans l'email de confirmation de sa commande.
        Il règle par virement, puis la commande est expédiée lorsque le virement est reçu.
      </p>

      {loading ? (
        <p style={{ color: 'var(--bark-3)' }}>Chargement…</p>
      ) : (
        <form onSubmit={save} className="card" style={{ padding: 'clamp(20px, 3vw, 28px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Titulaire du compte *">
            <input className="input-luxury" style={{ width: '100%' }} value={titular} onChange={e => setTitular(e.target.value)} required placeholder="SARL Electro Store" />
          </Field>
          <Field label="IBAN *">
            <input className="input-luxury" style={{ width: '100%' }} value={iban} onChange={e => setIban(e.target.value)} required placeholder="FR76 2004 1010 0500 0001 2345 678" />
          </Field>
          <Field label="BIC *">
            <input className="input-luxury" style={{ width: '100%' }} value={bic} onChange={e => setBic(e.target.value)} required placeholder="BIC/CODE SWIFT" />
          </Field>
          <Field label="Motif à indiquer par le client *">
            <input className="input-luxury" style={{ width: '100%' }} value={motif} onChange={e => setMotif(e.target.value)} required placeholder="CMD {num} {nom} {produit}" />
            <p style={{ fontSize: 11.5, color: 'var(--bark-3)', marginTop: 5 }}>
              Le motif permet d'associer le virement à la bonne commande. Variables disponibles :{' '}
              <code style={{ background: 'var(--sand)', padding: '2px 6px', borderRadius: 6 }}>{'{num}'}</code> n° de commande,{' '}
              <code style={{ background: 'var(--sand)', padding: '2px 6px', borderRadius: 6 }}>{'{nom}'}</code> nom du client,{' '}
              <code style={{ background: 'var(--sand)', padding: '2px 6px', borderRadius: 6 }}>{'{produit}'}</code> produit commandé.
            </p>
          </Field>

          {error && <p style={{ color: 'var(--terracotta)', fontSize: 13 }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={saving} style={{ maxWidth: 260 }}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>

          {saved && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--olive-bg)', color: 'var(--olive-dark)',
              borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 600,
            }}>
              <CheckIcon size={14} /> Coordonnées bancaires enregistrées. Elles seront envoyées dans les prochains emails de confirmation.
            </div>
          )}
        </form>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--bark-2)', marginBottom: 5, display: 'block' }}>
        {label}
      </label>
      {children}
    </div>
  );
}