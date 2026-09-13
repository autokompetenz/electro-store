import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, setToken } from '../../adminApi';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token } = await adminLogin(password.trim());
      setToken(token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section-pad" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'var(--sand)' }}>
      <div style={{ maxWidth: 380, margin: '0 auto', width: '100%', padding: '0 var(--page-side)' }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'var(--bark)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'var(--cream)', fontSize: 26, fontWeight: 800,
          }}>E</div>
          <h1 style={{ fontSize: 22, marginBottom: 6 }}>Panel de administración</h1>
          <p style={{ color: 'var(--bark-3)', fontSize: 13.5 }}>Electro Store — gestión</p>
        </div>

        <form onSubmit={submit} className="card" style={{
          padding: 'clamp(22px, 4vw, 30px)',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--bark-2)', marginBottom: 5, display: 'block' }}>
              Contraseña
            </label>
            <input
              className="input-luxury"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              autoFocus
              style={{ width: '100%' }}
            />
          </div>

          {error && <p style={{ color: 'var(--terracotta)', fontSize: 12.5 }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Iniciando sesión…' : 'Acceder'}
          </button>
        </form>

        <p style={{ fontSize: 11.5, color: 'var(--bark-3)', textAlign: 'center', marginTop: 16 }}>
          Contraseña definida en <strong>server/.env</strong> (ADMIN_PASSWORD).
        </p>
      </div>
    </main>
  );
}