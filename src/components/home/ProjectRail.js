'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Ajustes ────────────────────────────────────────────────
const VISIBLE = 3;        // portadas visibles a cada lado
const FAN = 5;            // inclinación de las vecinas (grados)
const TURN = 24;          // cuánto giran las vecinas hacia atrás (grados)
const INTERVAL = 4500;    // ms entre cambios automáticos
const OPEN_DELAY = 850;   // ms que gira el disco antes de abrir el proyecto
const PALETTE = ['#F6C6E6', '#CDE8F8', '#E4EDB0', '#F9CDBF', '#F8D98C'];
// ────────────────────────────────────────────────────────────

// "Rail" de discos: tus proyectos como portadas de álbum en abanico, cada una
// con un vinilo adentro. La del centro es la grande; al pasar el mouse el disco
// se asoma, y al hacer clic sale, gira y te lleva al proyecto.
// Clic en una vecina → pasa al centro. Flechas, arrastre, teclado y la regla de abajo.
export default function ProjectRail({ projects }) {
  const router = useRouter();
  const n = projects.length;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(-1);
  const [hovered, setHovered] = useState(false);
  const [reduce, setReduce] = useState(false);
  const drag = useRef(null);
  const openTimer = useRef(0);

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

  useEffect(() => () => clearTimeout(openTimer.current), []);

  const go = useCallback(i => setActive(((i % n) + n) % n), [n]);
  const next = useCallback(() => go(active + 1), [go, active]);
  const prev = useCallback(() => go(active - 1), [go, active]);

  // Avanza solo cada unos segundos (se pausa con el mouse encima o mientras suena un disco)
  useEffect(() => {
    if (reduce || hovered || playing !== -1 || n < 2) return undefined;
    const t = setTimeout(next, INTERVAL);
    return () => clearTimeout(t);
  }, [active, hovered, playing, reduce, next, n]);

  const open = i => {
    if (playing !== -1) return;
    const slug = projects[i].slug;
    if (reduce) return router.push(`/work/${slug}`);
    setPlaying(i);
    openTimer.current = setTimeout(() => router.push(`/work/${slug}`), OPEN_DELAY);
  };

  // Distancia más corta al centro (da la vuelta al final)
  const offsetOf = i => {
    let d = i - active;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  // Arrastrar / deslizar
  const onPointerDown = e => {
    drag.current = { x: e.clientX, moved: false };
  };
  const onPointerMove = e => {
    if (drag.current && Math.abs(e.clientX - drag.current.x) > 8) drag.current.moved = true;
  };
  const onPointerUp = e => {
    const d = drag.current;
    if (d && Math.abs(e.clientX - d.x) > 45) (e.clientX < d.x ? next : prev)();
  };
  const clickSleeve = i => {
    if (drag.current?.moved) return;
    if (offsetOf(i) === 0) open(i);
    else go(i);
  };

  const onKeyDown = e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'Enter') open(active);
  };

  if (!n) return null;
  const current = projects[active];

  return (
    <div
      className="project-rail relative select-none"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => { setHovered(false); drag.current = null; }}
    >
      {/* Escenario con las portadas */}
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={`Selected work, ${active + 1} of ${n}: ${current.title}. Use the arrow keys to browse and Enter to open.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative mx-auto h-[calc(var(--rail-s)*1.12)] touch-pan-y rounded-3xl outline-none [perspective:1400px] [--rail-s:clamp(210px,30vw,360px)] focus-visible:ring-2 focus-visible:ring-black/80 focus-visible:ring-offset-8 focus-visible:ring-offset-transparent"
      >
        {projects.map((p, i) => {
          const d = offsetOf(i);
          const a = Math.abs(d);
          const hidden = a > VISIBLE;
          const s = Math.sign(d);
          const x = d === 0 ? 0 : s * (0.78 + (a - 1) * 0.3); // en "tamaños de portada"
          // mientras suena un disco, las vecinas se apartan y se apagan
          const away = playing !== -1 && d !== 0;
          const style = {
            '--x': away ? x + s * 0.35 : x,
            transform: `translate(-50%, -50%) translateX(calc(var(--rail-s) * var(--x))) translateZ(${-a * 90}px) rotateY(${-s * (a ? TURN : 0)}deg) rotateZ(${s * Math.min(a, 2) * FAN * 0.5}deg) scale(${1 - a * 0.1})`,
            zIndex: 20 - a,
            opacity: hidden ? 0 : away ? 0.18 : 1 - a * 0.16,
            pointerEvents: hidden ? 'none' : 'auto',
          };
          const isCenter = d === 0;
          const color = p.card_color || PALETTE[i % PALETTE.length];
          return (
            <div
              key={p.id}
              className="rail-item absolute left-1/2 top-[46%] h-[var(--rail-s)] w-[var(--rail-s)] transition-[transform,opacity] duration-[650ms] ease-[var(--ease-out)]"
              style={style}
              data-center={isCenter ? '' : undefined}
              data-playing={playing === i ? '' : undefined}
              aria-hidden={hidden || undefined}
            >
              {/* Vinilo (detrás de la portada) */}
              <div className="rail-record absolute left-[3%] top-[3%] h-[94%] w-[94%] transition-transform duration-[650ms] ease-[var(--ease-out)]">
                <div className="rail-disc relative h-full w-full rounded-full">
                  <span
                    className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cover bg-center ring-2 ring-black/40"
                    style={{ backgroundColor: color, backgroundImage: p.cover ? `url("${p.cover}")` : undefined }}
                  />
                  <span className="absolute left-1/2 top-1/2 h-[4%] w-[4%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f4f4f4]" />
                </div>
              </div>

              {/* Portada */}
              <button
                type="button"
                tabIndex={-1}
                onClick={() => clickSleeve(i)}
                aria-label={isCenter ? `Open ${p.title}` : `Show ${p.title}`}
                className={`rail-sleeve absolute inset-0 overflow-hidden rounded-[14px] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.55)] ${isCenter ? 'cursor-pointer' : 'cursor-pointer'}`}
                style={{ backgroundColor: color }}
              >
                {p.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover} alt="" draggable={false} className="h-full w-full object-cover" />
                ) : (
                  // Sin imagen: portada tipográfica, como un álbum
                  <span className="flex h-full w-full flex-col justify-between p-[9%] text-left text-neutral-900">
                    <span className="font-nav text-[calc(var(--rail-s)*0.06)] opacity-70">LAB ✦</span>
                    <span className="font-title text-[calc(var(--rail-s)*0.15)] leading-[0.9] tracking-tight">{p.title}</span>
                  </span>
                )}
                {/* brillo de la funda */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/15" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Título del proyecto del centro */}
      <div className="mt-2 flex flex-col items-center text-center" aria-live="polite">
        <p key={current.id} className="rail-caption font-title text-3xl tracking-tight text-neutral-900 md:text-4xl">
          {current.title}
        </p>
        {current.tags?.length > 0 && (
          <p className="font-body mt-1.5 text-sm text-neutral-500">{current.tags.slice(0, 3).join(' · ')}</p>
        )}
        <button
          type="button"
          onClick={() => open(active)}
          className="press font-nav group mt-5 inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-lg text-white hover:bg-neutral-800"
        >
          Play this one
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">▶</span>
        </button>
      </div>

      {/* Regla: flechas + una marca por proyecto */}
      {n > 1 && (
        <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-4">
          <RailArrow dir="prev" onClick={prev} />
          <div className="flex items-end gap-2" role="tablist" aria-label="Projects">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={p.title}
                onClick={() => go(i)}
                className="group/tick flex h-7 w-4 items-end justify-center"
              >
                <span
                  className={`block w-[3px] rounded-full transition-[height,background-color] duration-300 ease-[var(--ease-out)] ${
                    i === active ? 'h-7 bg-[#F2A2DC]' : 'h-3.5 bg-neutral-400 group-hover/tick:h-5 group-hover/tick:bg-neutral-700'
                  }`}
                />
              </button>
            ))}
          </div>
          <RailArrow dir="next" onClick={next} />
        </div>
      )}
    </div>
  );
}

function RailArrow({ dir, onClick }) {
  const prev = dir === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={prev ? 'Previous project' : 'Next project'}
      className="press flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 ring-1 ring-black/15 hover:bg-white"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={prev ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
      </svg>
    </button>
  );
}
