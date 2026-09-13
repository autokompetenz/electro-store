import { useEffect, useRef } from 'react';

const AUTOPLAY_MS = 3200;

// Grille produits : sur mobile, devient un carrousel à défilement automatique
// (1 produit par écran, snap + swipe manuel possible).
export default function ProductGrid({ children }) {
  const ref = useRef(null);
  const count = Array.isArray(children) ? children.length : 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: 'auto' });
    if (count <= 1) return;

    const mq = window.matchMedia('(max-width: 640px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = null;
    let index = 0;
    let paused = false;

    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    const step = () => {
      if (paused || mq.matches === false) return;
      const cards = Array.from(el.children).filter(c => c.classList && c.classList.contains('product-card'));
      if (cards.length < 2) { stop(); return; }
      index = (index + 1) % cards.length;
      const next = cards[index];
      el.scrollTo({ left: next.offsetLeft, behavior: 'smooth' });
    };

    const start = () => {
      if (paused || !mq.matches || reduced.matches) return;
      if (el.scrollWidth <= el.clientWidth + 4) return;
      stop();
      timer = setInterval(step, AUTOPLAY_MS);
    };

    const update = () => { stop(); start(); };
    const pauseOn = () => { paused = true; stop(); };
    const pauseOff = () => { paused = false; start(); };

    start();

    const io = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) pauseOff(); else pauseOn(); }); },
      { threshold: 0.4 }
    );
    io.observe(el);

    mq.addEventListener('change', update);
    reduced.addEventListener('change', update);
    el.addEventListener('mouseenter', pauseOn);
    el.addEventListener('mouseleave', pauseOff);
    el.addEventListener('touchstart', pauseOn, { passive: true });
    el.addEventListener('touchend', pauseOff, { passive: true });

    return () => {
      stop();
      io.disconnect();
      mq.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
      el.removeEventListener('mouseenter', pauseOn);
      el.removeEventListener('mouseleave', pauseOff);
      el.removeEventListener('touchstart', pauseOn);
      el.removeEventListener('touchend', pauseOff);
    };
  }, [count]);

  return <div className="product-grid" ref={ref}>{children}</div>;
}