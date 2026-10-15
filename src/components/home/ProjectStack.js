'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─── Ajustes ────────────────────────────────────────────────
const INTERVAL = 2000;   // ms entre cambios automáticos
const FLY_MS = 520;      // ms que tarda la tarjeta de arriba en salir y pasar al fondo
const DEPTH = 3;         // tarjetas visibles detrás de la de arriba
const PALETTE = ['#F6C6E6', '#CDE8F8', '#E4EDB0', '#F9CDBF', '#F8D98C'];
// ────────────────────────────────────────────────────────────

// Pila de proyectos: cambia sola cada unos segundos y con un clic pasa a la
// siguiente. La tarjeta de arriba sale volando hacia un lado y se acomoda al fondo.
export default function ProjectStack({ projects }) {
  const router = useRouter();
  const n = projects.length;
  const [order, setOrder] = useState(() => projects.map((_, i) => i));
  const [leaving, setLeaving] = useState(-1);
  const [hovered, setHovered] = useState(false);
  const [reduce, setReduce] = useState(false);
  const flyTimer = useRef(0);
  const [side, setSide] = useState(1); // lado hacia el que sale (alterna)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    projects.forEach(p => router.prefetch(`/work/${p.slug}`));
  }, [projects, router]);

  useEffect(() => () => clearTimeout(flyTimer.current), []);

  // Pasa a la siguiente: la de arriba sale y luego se va al fondo
  const next = useCallback(() => {
    if (n < 2 || leaving !== -1) return;
    const top = order[0];
    setSide(x => -x);
    if (reduce) {
      setOrder(o => [...o.slice(1), o[0]]);
      return;
    }
    setLeaving(top);
    flyTimer.current = setTimeout(() => {
      setOrder(o => [...o.slice(1), o[0]]);
      setLeaving(-1);
    }, FLY_MS * 0.55);
  }, [n, leaving, order, reduce]);

  // Automático (se pausa con el mouse encima)
  useEffect(() => {
    if (n < 2 || hovered || reduce) return undefined;
    const t = setTimeout(next, INTERVAL);
    return () => clearTimeout(t);
  }, [order, hovered, reduce, next, n]);

  if (!n) return null;
  // mientras la de arriba sale volando, ya mostramos la info de la siguiente
  const shownIdx = leaving !== -1 && n > 1 ? order[1] : order[0];
  const current = projects[shownIdx];

  return (
    <div
      className="flex flex-col items-center pt-12"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* La pila */}
      <button
        type="button"
        onClick={next}
        aria-label={`Show next project (now: ${current.title})`}
        className="group/stack relative mx-auto block aspect-[16/9] w-[min(980px,92vw)] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black/80 focus-visible:ring-offset-8 focus-visible:ring-offset-transparent rounded-[18px]"
      >
        {projects.map((p, i) => {
          const depth = order.indexOf(i);
          const isLeaving = leaving === i;
          const shown = depth <= DEPTH;
          const color = p.card_color || PALETTE[i % PALETTE.length];
          // cada tarjeta de atrás un poco más arriba, más pequeña y girada
          const tilt = depth === 0 ? 0 : (depth % 2 ? -1 : 1) * (2 + depth * 1.2);
          const transform = isLeaving
            ? `translate(${side * 72}%, -6%) rotate(${side * 14}deg) scale(0.96)`
            : `translateY(${-depth * 5.5}%) scale(${1 - depth * 0.06}) rotate(${tilt}deg)`;
          return (
            <span
              key={p.id}
              aria-hidden="true"
              className="stack-card absolute inset-0 overflow-hidden rounded-[18px] shadow-[0_30px_60px_-28px_rgba(0,0,0,0.55)] ring-1 ring-black/5"
              style={{
                transform,
                zIndex: isLeaving ? 50 : 40 - depth,
                opacity: isLeaving ? 0 : shown ? 1 - depth * 0.12 : 0,
                backgroundColor: color,
                transition: `transform ${FLY_MS}ms var(--ease-out), opacity ${isLeaving ? FLY_MS * 0.55 : 400}ms ease`,
              }}
            >
              {p.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover} alt="" draggable={false} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full flex-col justify-between p-[7%] text-left text-neutral-900">
                  <span className="font-nav text-base opacity-70">LAB ✦</span>
                  <span className="font-title text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.92] tracking-tight">{p.title}</span>
                </span>
              )}
              {/* brillo suave */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10" />
            </span>
          );
        })}

        {/* pista "click" sobre la de arriba */}
        <span className="font-body pointer-events-none absolute bottom-4 right-4 z-[60] rounded-full bg-black/55 px-3 py-1.5 text-sm text-white opacity-0 backdrop-blur-md transition-[opacity,transform] duration-200 ease-[var(--ease-out)] translate-y-1 group-hover/stack:translate-y-0 group-hover/stack:opacity-100">
          click for the next one
        </span>
      </button>

      {/* Info de la de arriba */}
      <div className="mt-10 flex flex-col items-center text-center" aria-live="polite">
        <p className="font-body text-sm tabular-nums text-neutral-500">
          {String(shownIdx + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </p>
        {/* El título es el enlace al proyecto */}
        <Link
          key={current.id}
          href={`/work/${current.slug}`}
          className="stack-caption group font-title mt-1 inline-flex items-center gap-2 text-3xl tracking-tight text-neutral-900 md:text-4xl"
        >
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 ease-[var(--ease-out)] group-hover:bg-[length:100%_2px]">
            {current.title}
          </span>
          <span aria-hidden="true" className="text-2xl transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
        {current.tags?.length > 0 && (
          <p className="font-body mt-1.5 text-sm text-neutral-500">{current.tags.slice(0, 3).join(' · ')}</p>
        )}
      </div>
    </div>
  );
}
