import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CloseIcon, WhatsAppIcon, MailIcon } from './Icons';
import { company } from '../data/company';
import { setFabHidden, useFabHidden } from '../utils/fab';
import { sendChatMessage, getChatMessages } from '../api';

// ── Base de connaissances (bot maison, en français) ──────────────────
const TOPICS = {
  envios: {
    label: 'Livraison et délais',
    answer: "Nous expédions dans toute l'Espagne, livraison gratuite en 2 à 5 jours ouvrés. Un lien de suivi vous est envoyé par e-mail dès l'expédition.",
    follow: ['devoluciones', 'pedido', 'humano'],
  },
  devoluciones: {
    label: 'Retours',
    answer: "Vous disposez de 30 jours pour retourner votre commande, sans frais. Écrivez-nous et nous organisons l'enlèvement avec vous.",
    follow: ['garantia', 'pedido', 'humano'],
  },
  garantia: {
    label: 'Garantie',
    answer: "Tous nos électroménagers bénéficient d'une garantie de 3 ans. En cas de problème, contactez le service client en indiquant votre numéro de commande.",
    follow: ['devoluciones', 'humano'],
  },
  pedido: {
    label: 'Suivi de commande',
    answer: 'Vous pouvez suivre votre commande en temps réel avec le numéro de commande ou votre adresse e-mail.',
    link: { to: '/suivi-commande', label: 'Suivre ma commande' },
    follow: ['envios', 'humano'],
  },
  productos: {
    label: 'Produits et stock',
    answer: 'Retrouvez tous les modèles dans le catalogue. Si vous cherchez un modèle précis, écrivez-nous et nous le trouvons pour vous.',
    link: { to: '/catalogue', label: 'Voir le catalogue' },
    follow: ['envios', 'humano'],
  },
  pago: {
    label: 'Moyens de paiement',
    answer: "Le paiement est 100 % sécurisé. Vous pouvez payer par virement bancaire ; les coordonnées s'affichent à la confirmation de la commande. Elle est préparée dès réception du paiement.",
    follow: ['envios', 'humano'],
  },
  humano: {
    label: 'Parler à une personne',
    answer: 'Avec plaisir. Écrivez-nous sur WhatsApp ou par e-mail : nous répondons en moins de 24 h.',
    whatsapp: true,
    contact: true,
  },
};

const TOP_LEVEL = ['envios', 'devoluciones', 'garantia', 'pedido', 'productos', 'humano'];

const GREETING = "Bonjour ! 👋 Je suis l'assistant d'Electro. Comment puis-je vous aider ? Choisissez une option ou écrivez votre question.";

const FALLBACK = "Je ne suis pas sûr d'avoir bien compris 🙂. Choisissez une option, ou écrivez-nous directement : une personne vous répondra.";

const KEYWORDS = {
  humano: ['personne', 'humain', 'agent', 'parler', 'telephone', 'whatsapp', 'contact', 'conseiller'],
  pedido: ['commande', 'suivi', 'suivre', 'ou est', 'numero de commande', 'livraison effectuee'],
  devoluciones: ['retour', 'retourner', 'echange', 'rembours', 'renvoyer'],
  garantia: ['garantie', 'panne', 'reparer', 'reparation'],
  pago: ['paiement', 'payer', 'virement', 'carte', 'facture', 'iban'],
  envios: ['livraison', 'livrer', 'delai', 'expedition', 'expedie', 'arrive', 'transporteur', 'colis'],
  productos: ['produit', 'stock', 'modele', 'prix', 'catalogue', 'disponible', 'marque'],
};

const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function detect(text) {
  const t = norm(text);
  for (const [key, words] of Object.entries(KEYWORDS)) {
    if (words.some(w => t.includes(norm(w)))) return key;
  }
  return null;
}

const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID)
  ? crypto.randomUUID()
  : `m${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// Identifiant de session visiteur : on réutilise la session d'analytics
// (même valeur pour un même client), sinon on en crée une.
function getChatSession() {
  try {
    let id = localStorage.getItem('electro_session');
    if (!id) {
      id = uid();
      localStorage.setItem('electro_session', id);
    }
    return id;
  } catch {
    return uid();
  }
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const timerRef = useRef(null);
  const lastIdRef = useRef(0);
  const seenRef = useRef(new Set());
  const loadedRef = useRef(false);
  const fabHidden = useFabHidden();
  const location = useLocation();
  const [sessionId] = useState(getChatSession);

  // Ouvre/ferme : on masque les autres boutons flottants pendant que le chat est ouvert.
  useEffect(() => {
    setFabHidden('chat', open);
  }, [open]);

  // Ferme le panneau lors d'un changement de page.
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Échap pour fermer.
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Nettoyage du timer de réponse.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Défilement automatique vers le bas.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  // Chargement de l'historique (une fois) + polling des réponses admin.
  useEffect(() => {
    if (!open) return;
    let alive = true;

    const ingest = (list) => {
      let maxId = lastIdRef.current;
      const additions = [];
      for (const m of list) {
        maxId = Math.max(maxId, m.id);
        const key = m.sender === 'admin' ? `s-${m.id}` : `c-${m.client_id ?? 'x-' + m.id}`;
        if (seenRef.current.has(key)) continue;
        seenRef.current.add(key);
        additions.push({
          key,
          from: m.sender === 'admin' ? 'admin' : (m.sender === 'client' ? 'user' : 'bot'),
          text: m.text,
          time: m.time,
        });
      }
      lastIdRef.current = maxId;
      return additions;
    };

    const load = async () => {
      let history = [];
      try {
        const data = await getChatMessages(sessionId, 0);
        history = data?.messages || [];
      } catch { /* hors ligne : on continue en local */ }
      if (!alive) return;
      if (history.length) {
        setMessages(ingest(history));
      } else {
        setMessages([{ key: `g-${uid()}`, from: 'bot', text: GREETING }]);
      }
    };

    const tick = async () => {
      try {
        const data = await getChatMessages(sessionId, lastIdRef.current);
        if (!alive) return;
        const additions = ingest(data?.messages || []);
        if (additions.length) setMessages(prev => [...prev, ...additions]);
      } catch { /* on réessaiera au prochain tick */ }
    };

    if (!loadedRef.current) {
      loadedRef.current = true;
      load();
    }
    const iv = setInterval(tick, 5000);
    return () => { alive = false; clearInterval(iv); };
  }, [open, sessionId]);

  const persist = (sender, text, clientId) => {
    sendChatMessage({ sessionId, sender, text, path: location.pathname, clientId }).catch(() => {});
  };

  const addBot = (text, extras = {}) => {
    const clientId = uid();
    seenRef.current.add(`c-${clientId}`);
    setMessages(m => [...m, { key: `c-${clientId}`, from: 'bot', text, ...extras }]);
    persist('bot', text, clientId);
  };

  const addUser = (text) => {
    const clientId = uid();
    seenRef.current.add(`c-${clientId}`);
    setMessages(m => [...m, { key: `c-${clientId}`, from: 'user', text }]);
    persist('client', text, clientId);
  };

  const replyTo = (key) => {
    clearTimeout(timerRef.current);
    setTyping(true);
    timerRef.current = setTimeout(() => {
      setTyping(false);
      if (key && TOPICS[key]) {
        const t = TOPICS[key];
        addBot(t.answer, { link: t.link, whatsapp: t.whatsapp, contact: t.contact, options: t.follow });
      } else {
        addBot(FALLBACK, { options: TOP_LEVEL, whatsapp: true });
      }
    }, 450);
  };

  const handleOption = (key) => {
    addUser(TOPICS[key].label);
    replyTo(key);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    addUser(value);
    setInput('');
    replyTo(detect(value));
  };

  return (
    <div style={{ position: 'fixed', right: 'clamp(14px, 3vw, 24px)', bottom: 'clamp(14px, 3vw, 24px)', zIndex: 60, fontFamily: 'var(--font)' }}>
      {/* Panneau */}
      {open && (
        <>
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 78, background: 'rgba(27,27,28,0.28)',
              WebkitBackdropFilter: 'blur(3px)', backdropFilter: 'blur(3px)',
              animation: 'fadeInOverlay 0.25s ease both',
            }}
            onClick={() => setOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Assistant virtuel"
            style={{
              position: 'fixed', zIndex: 79,
              bottom: 0, right: 0,
              width: 'min(380px, 100vw)',
              height: 'min(600px, 82vh)',
              display: 'flex', flexDirection: 'column',
              background: 'var(--cream)',
              border: '1px solid var(--border-2)',
              borderBottom: 'none',
              borderTopLeftRadius: 18, borderTopRightRadius: 18,
              boxShadow: '0 -12px 48px rgba(27,27,28,0.2)',
              animation: 'drawerUp 0.32s var(--ease) both',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', background: 'var(--terracotta)', color: '#fff',
            }}>
              <span style={{
                width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ChatIcon size={20} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Assistant Electro</div>
                <div style={{ fontSize: 11.5, opacity: 0.9, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#B8F0A8', display: 'inline-block' }} />
                  Répond généralement instantanément
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer l'assistant"
                style={{
                  width: 36, height: 36, borderRadius: 10, cursor: 'pointer', flexShrink: 0,
                  border: 'none', background: 'rgba(255,255,255,0.18)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <CloseIcon size={15} />
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', scrollbarWidth: 'thin' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.map(m => (
                  <Message key={m.key} message={m} onOption={handleOption} />
                ))}
                {typing && (
                  <div style={{ alignSelf: 'flex-start' }}>
                    <div style={bubbleBot}>
                      <TypingDots />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pied : raccourcis + saisie */}
            <div style={{ borderTop: '1px solid var(--border)', background: 'var(--sand-light)' }}>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '10px 12px 0' }}>
                {TOP_LEVEL.map(k => (
                  <button
                    key={k}
                    type="button"
                    className="chat-chip"
                    onClick={() => handleOption(k)}
                    style={{ ...chipStyle, flex: '0 0 auto' }}
                  >
                    {TOPICS[k].label}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, padding: '10px 12px' }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Écrivez votre question…"
                  aria-label="Écrivez votre question"
                  style={{
                    flex: 1, minWidth: 0, height: 42, borderRadius: 12, padding: '0 14px',
                    border: '1px solid var(--border-2)', background: '#fff',
                    fontSize: 13.5, color: 'var(--bark)', fontFamily: 'var(--font)', outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  aria-label="Envoyer"
                  disabled={!input.trim()}
                  style={{
                    width: 42, height: 42, borderRadius: 12, border: 'none', flexShrink: 0,
                    background: 'var(--terracotta)', color: '#fff', cursor: input.trim() ? 'pointer' : 'default',
                    opacity: input.trim() ? 1 : 0.5,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <SendIcon size={18} />
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Lanceur */}
      {!open && !fabHidden && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir l'assistant"
          aria-expanded={open}
          style={{
            width: 58, height: 58, borderRadius: '50%', cursor: 'pointer',
            position: 'fixed',
            right: 'clamp(14px, 3vw, 24px)',
            bottom: 'calc(clamp(14px, 3vw, 24px) + 70px)',
            zIndex: 60, border: 'none',
            background: 'var(--bark)', color: '#fff',
            boxShadow: '0 8px 24px rgba(27,27,28,0.35), 0 2px 6px rgba(27,27,28,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.25s var(--ease)',
            animation: 'chatFabIn 0.25s var(--ease) both',
          }}
        >
          <ChatIcon size={24} />
        </button>
      )}

      <style>{`
        @keyframes chatFabIn { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes drawerUp { from { transform: translateY(40px); opacity: 0.4; } to { transform: translateY(0); opacity: 1; } }
        @keyframes typingBounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-4px); opacity: 1; } }
        .chat-typing span { display: inline-block; width: 6px; height: 6px; margin: 0 1.5px; border-radius: 50%; background: var(--bark-3); animation: typingBounce 1.1s infinite; }
        .chat-typing span:nth-child(2) { animation-delay: 0.15s; }
        .chat-typing span:nth-child(3) { animation-delay: 0.3s; }
        .chat-chip:hover { background: var(--terracotta-bg) !important; border-color: var(--terracotta-border) !important; }
        .chat-msg-in { animation: msgIn 0.22s var(--ease) both; }
        @keyframes msgIn { from { transform: translateY(4px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

function Message({ message, onOption }) {
  const isUser = message.from === 'user';
  const isAdmin = message.from === 'admin';
  const bubble = isUser ? bubbleUser : (isAdmin ? bubbleAdmin : bubbleBot);
  return (
    <div
      className="chat-msg-in"
      style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '88%', display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {isAdmin && (
        <div style={{
          fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
          color: 'var(--terracotta-dark)', paddingLeft: 4,
        }}>
          Équipe · service client{message.time ? ` · ${message.time}` : ''}
        </div>
      )}
      <div style={bubble}>{message.text}</div>

      {message.link && (
        <Link to={message.link.to} className="btn-primary" style={{ fontSize: 12.5, alignSelf: 'flex-start' }}>
          {message.link.label}
        </Link>
      )}

      {(message.whatsapp || message.contact) && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {message.whatsapp && (
            <a
              href={company.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...chipStyle, background: '#25D366', borderColor: '#25D366', color: '#fff', gap: 6 }}
            >
              <WhatsAppIcon size={14} /> WhatsApp
            </a>
          )}
          {message.contact && (
            <Link to="/contact" style={{ ...chipStyle, gap: 6 }}>
              <MailIcon size={14} /> Écrire un e-mail
            </Link>
          )}
        </div>
      )}

      {message.options && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {message.options.map(key => (
            <button
              key={key}
              type="button"
              className="chat-chip"
              onClick={() => onOption(key)}
              style={chipStyle}
            >
              {TOPICS[key].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TypingDots() {
  return <span className="chat-typing"><span /><span /><span /></span>;
}

// ── Petites icônes dédiées au chat ──────────────────────────────
function ChatIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 01-8.5 8.4 8.6 8.6 0 01-3.9-.9L3 20.5l1.6-4.4a8.4 8.4 0 01-1.1-4.3A8.4 8.4 0 0112 3.3a8.4 8.4 0 019 8.2z" />
      <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
    </svg>
  );
}

function SendIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

const bubbleBot = {
  background: 'var(--sand)', color: 'var(--bark)',
  border: '1px solid var(--border)', borderRadius: '14px 14px 14px 4px',
  padding: '10px 13px', fontSize: 13.5, lineHeight: 1.55,
  whiteSpace: 'pre-wrap',
};

const bubbleAdmin = {
  background: 'var(--terracotta-bg)', color: 'var(--bark)',
  border: '1px solid var(--terracotta-border)', borderRadius: '14px 14px 14px 4px',
  padding: '10px 13px', fontSize: 13.5, lineHeight: 1.55,
  whiteSpace: 'pre-wrap',
};

const bubbleUser = {
  background: 'var(--terracotta)', color: '#fff',
  borderRadius: '14px 14px 4px 14px',
  padding: '10px 13px', fontSize: 13.5, lineHeight: 1.55,
  alignSelf: 'flex-end', whiteSpace: 'pre-wrap',
};

const chipStyle = {
  display: 'inline-flex', alignItems: 'center',
  padding: '7px 12px', borderRadius: 100,
  border: '1px solid var(--border-2)', background: '#fff',
  color: 'var(--bark-2)', fontSize: 12.5, fontWeight: 600,
  cursor: 'pointer', textDecoration: 'none',
  fontFamily: 'var(--font)', transition: 'all 0.2s var(--ease)',
};
