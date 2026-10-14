import { useEffect, useRef, useState } from 'react';
import { getAdminChats, getAdminChat, sendAdminChatMessage, deleteAdminChat } from '../../adminApi';

const SENDER_LABEL = { client: 'Cliente', bot: 'Asistente', admin: 'Tú (equipo)' };

export default function AdminChat() {
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef(null);

  const loadChats = async () => {
    try {
      const data = await getAdminChats();
      setChats(data.chats || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadThread = async (sessionId, { scroll = false } = {}) => {
    try {
      const data = await getAdminChat(sessionId);
      setMessages(data.messages || []);
      setChats(prev => prev.map(c => (c.session_id === sessionId ? { ...c, unread_admin: 0 } : c)));
      if (scroll) {
        requestAnimationFrame(() => {
          const el = listRef.current;
          if (el) el.scrollTop = el.scrollHeight;
        });
      }
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { loadChats(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Rafraîchit la liste des conversations.
  useEffect(() => {
    const iv = setInterval(loadChats, 8000);
    return () => clearInterval(iv);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Rafraîchit la conversation ouverte (nouvelles réponses client).
  useEffect(() => {
    if (!selected) return;
    const iv = setInterval(() => loadThread(selected), 5000);
    return () => clearInterval(iv);
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const openChat = (sessionId) => {
    setSelected(sessionId);
    setMessages([]);
    loadThread(sessionId, { scroll: true });
  };

  const send = async (e) => {
    e.preventDefault();
    const text = reply.trim();
    if (!text || !selected) return;
    setSending(true);
    setError('');
    try {
      await sendAdminChatMessage(selected, text);
      setReply('');
      await loadThread(selected, { scroll: true });
      await loadChats();
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  const remove = async (sessionId) => {
    if (!window.confirm('¿Eliminar esta conversación y todos sus mensajes?')) return;
    try {
      await deleteAdminChat(sessionId);
      setChats(prev => prev.filter(c => c.session_id !== sessionId));
      if (selected === sessionId) { setSelected(null); setMessages([]); }
    } catch (e) {
      alert(e.message);
    }
  };

  const totalUnread = chats.reduce((n, c) => n + (c.unread_admin || 0), 0);

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Chat</h1>
      <p style={{ color: 'var(--bark-3)', fontSize: 13.5, marginBottom: 20 }}>
        {chats.length} conversación(es)
        {totalUnread > 0 ? ` · ${totalUnread} mensaje(s) sin leer` : ''}
      </p>

      {error && <p style={{ color: '#c4453a', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      <style>{`
        .admin-chat { display: grid; grid-template-columns: 300px 1fr; gap: 16px; align-items: start; }
        .admin-chat-list { max-height: 70vh; overflow-y: auto; }
        .admin-chat-item { width: 100%; text-align: left; cursor: pointer; }
        .admin-chat-back { display: none; }
        @media (max-width: 760px) {
          .admin-chat { grid-template-columns: 1fr; }
          .admin-chat.mobile-thread .admin-chat-list { display: none; }
          .admin-chat:not(.mobile-thread) .admin-chat-thread { display: none; }
          .admin-chat.mobile-thread .admin-chat-back { display: inline-block; }
        }
      `}</style>

      <div className={`admin-chat${selected ? ' mobile-thread' : ''}`}>
        {/* Liste des conversations */}
        <div className="card admin-chat-list" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <p style={{ padding: 18, color: 'var(--bark-3)', fontSize: 13 }}>Cargando…</p>
          ) : chats.length === 0 ? (
            <p style={{ padding: 18, color: 'var(--bark-3)', fontSize: 13 }}>Sin conversaciones por ahora.</p>
          ) : (
            chats.map(c => {
              const active = c.session_id === selected;
              return (
                <button
                  key={c.session_id}
                  className="admin-chat-item"
                  onClick={() => openChat(c.session_id)}
                  style={{
                    display: 'block', border: 'none',
                    borderBottom: '1px solid var(--border)',
                    borderLeft: active ? '3px solid var(--terracotta)' : '3px solid transparent',
                    background: active ? 'var(--terracotta-bg)' : 'transparent',
                    padding: '12px 14px', fontFamily: 'var(--font)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--bark-2)', fontFamily: 'monospace' }}>
                      #{c.session_id.slice(0, 8)}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--bark-3)', whiteSpace: 'nowrap' }}>{c.updated_at}</span>
                  </div>
                  <div style={{
                    fontSize: 12.5, color: 'var(--bark-2)', marginTop: 4,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {c.last_sender === 'admin' && <span style={{ color: 'var(--terracotta-dark)', fontWeight: 600 }}>Tú:</span>}
                    {c.last_message}
                  </div>
                  {c.unread_admin > 0 && (
                    <span style={{
                      display: 'inline-block', marginTop: 6, background: 'var(--terracotta)', color: '#fff',
                      fontSize: 10.5, fontWeight: 700, borderRadius: 100, padding: '2px 8px',
                    }}>
                      {c.unread_admin} nuevo(s)
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Fil de discussion */}
        <div className="card admin-chat-thread" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 'min(70vh, 620px)' }}>
          {!selected ? (
            <div style={{ margin: 'auto', color: 'var(--bark-3)', fontSize: 13.5, padding: 24, textAlign: 'center' }}>
              Selecciona una conversación para ver los mensajes y responder.
            </div>
          ) : (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                padding: '12px 16px', borderBottom: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <button
                    onClick={() => setSelected(null)}
                    className="admin-chat-back"
                    style={{
                      border: 'none', background: 'transparent',
                      cursor: 'pointer', color: 'var(--bark-2)', fontSize: 22, padding: 0, lineHeight: 1,
                    }}
                    aria-label="Volver"
                  >
                    ‹
                  </button>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>#{selected.slice(0, 8)}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--bark-3)' }}>Sesión del cliente</div>
                  </div>
                </div>
                <button onClick={() => remove(selected)} style={{
                  border: '1px solid #e3b7ad', background: '#fdf3f1', color: '#c4453a',
                  borderRadius: 7, padding: '5px 10px', cursor: 'pointer', fontSize: 12,
                  fontFamily: 'var(--font)', fontWeight: 600,
                }}>
                  Eliminar
                </button>
              </div>

              <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.length === 0 ? (
                  <p style={{ color: 'var(--bark-3)', fontSize: 13, margin: 'auto' }}>Sin mensajes.</p>
                ) : messages.map((m) => {
                  const isAdmin = m.sender === 'admin';
                  return (
                    <div key={m.id} style={{ alignSelf: isAdmin ? 'flex-end' : 'flex-start', maxWidth: '82%' }}>
                      <div style={{
                        fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase',
                        color: 'var(--bark-3)', marginBottom: 3,
                        textAlign: isAdmin ? 'right' : 'left',
                      }}>
                        {SENDER_LABEL[m.sender] || m.sender} · {m.created_at}
                      </div>
                      <div style={{
                        background: isAdmin ? 'var(--terracotta)' : (m.sender === 'bot' ? 'var(--sand-light)' : 'var(--sand)'),
                        color: isAdmin ? '#fff' : 'var(--bark)',
                        border: isAdmin ? 'none' : '1px solid var(--border)',
                        borderRadius: isAdmin ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        padding: '10px 13px', fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-wrap',
                      }}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={send} style={{ display: 'flex', gap: 8, padding: '10px 12px', borderTop: '1px solid var(--border)', background: 'var(--sand-light)' }}>
                <input
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Escribe tu respuesta…"
                  aria-label="Escribe tu respuesta"
                  className="input-luxury"
                  style={{ flex: 1, minWidth: 0, height: 42, fontSize: 13.5 }}
                />
                <button
                  type="submit"
                  disabled={sending || !reply.trim()}
                  className="btn-primary"
                  style={{
                    height: 42, flexShrink: 0, padding: '0 18px',
                    opacity: (sending || !reply.trim()) ? 0.5 : 1,
                  }}
                >
                  {sending ? '…' : 'Enviar'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
