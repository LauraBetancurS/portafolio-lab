'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Ajustes ────────────────────────────────────────────────
const MIN_SLOTS = 10;      // tarjetas mínimas en el anillo (los proyectos se repiten si son pocos)
const GAP = 24;            // px entre tarjetas
const TILT = -7;           // inclinación de la cámara (se ve un poquito desde arriba)
const INTERVAL = 3500;     // ms entre giros automáticos
const FRICTION = 0.9945;   // qué tan rápido frena al soltarlo (más alto = gira más)
const BLUR = 1100;         // fuerza del desenfoque según la velocidad
const MAX_BLUR = 9;        // px máximo de desenfoque
const SPRING = 0.012;      // rigidez del "clic" al acomodarse (más alto = más rápido)
const PALETTE = ['#F6C6E6', '#CDE8F8', '#E4EDB0', '#F9CDBF', '#F8D98C'];
// ────────────────────────────────────────────────────────────

// Anillo de proyectos (versión propia inspirada en "Momentum Ring"):
// las tarjetas están en un cilindro 3D. Arrástralo o lánzalo: gira con inercia,
// se desenfoca con la velocidad y al frenar hace "clic" en la tarjeta más cercana.
// Clic en la de adelante → abre el proyecto. Clic en otra → gira hasta ella.
export default function ProjectRing({ projects }) {
  const router = useRouter();
  const n = projects.length;
  const repeats = n ? Math.max(1, Math.ceil(MIN_SLOTS / n)) : 1;
  const slots = n * repeats;
  const step = 360 / Math.max(slots, 1);

  const stageRef = useRef(null);
  const ringRef = useRef(null);
  const cardRefs = useRef([]);
  const sim = useRef({ p: 0, v: 0, target: 0, dragging: false, last: 0, drag: null, reduce: false, hovered: false });
  const [front, setFront] = useState(0);
  const [moving, setMoving] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dims, setDims] = useState({ w: 360, h: 240, r: 900 });

  // Medidas: ancho de tarjeta según la pantalla y radio del anillo
  useEffect(() => {
    const measure = () => {
      const stageW = stageRef.current?.offsetWidth || 1000;
      const w = Math.round(Math.min(440, Math.max(220, stageW * 0.36)));
      const h = Math.round(w / 1.45);
      const r = Math.round((w + GAP) / 2 / Math.tan(Math.PI / Math.max(slots, 3)));
      setDims({ w, h, r });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [slots]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { sim.current.reduce = mq.matches; };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    projects.forEach(p => router.prefetch(`/work/${p.slug}`));
  }, [projects, router]);

  const wrap = useCallback(x => ((x % slots) + slots) % slots, [slots]);

  // Bucle de animación: inercia, resorte para el "clic", desenfoque y opacidad
  useEffect(() => {
    if (!slots) return undefined;
    let raf = 0;
    let lastFront = -1;
    let lastMoving = null;
    const s = sim.current;
    const K = SPRING * SPRING;
    const D = 2 * SPRING * 0.82; // un poquito de rebote al encajar

    const frame = now => {
      const dt = s.last ? Math.min(40, now - s.last) : 16;
      s.last = now;

      if (!s.dragging) {
        if (s.target !== null) {
          if (s.reduce) {
            s.p = s.target; s.v = 0;
          } else {
            const a = (s.target - s.p) * K - s.v * D;
            s.v += a * dt;
            s.p += s.v * dt;
          }
          if (Math.abs(s.target - s.p) < 0.0008 && Math.abs(s.v) < 0.00005) {
            s.p = s.target; s.v = 0;
          }
        } else {
          // girando libre después de lanzarlo
          s.p += s.v * dt;
          s.v *= Math.pow(FRICTION, dt);
          if (Math.abs(s.v) < 0.0018) s.target = Math.round(s.p + s.v * 90);
        }
      }

      // Dibujar
      const ring = ringRef.current;
      // translateY compensa la inclinación para que la tarjeta de adelante quede centrada
      if (ring) ring.style.transform = `translateY(${(dims.r * Math.sin((TILT * Math.PI) / 180)).toFixed(1)}px) translateZ(${-dims.r}px) rotateX(${TILT}deg) rotateY(${-s.p * step}deg)`;
      const blur = s.reduce ? 0 : Math.min(MAX_BLUR, Math.abs(s.v) * BLUR);
      ring?.style.setProperty('--ring-blur', `${blur.toFixed(2)}px`);
      for (let i = 0; i < slots; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        let rel = i - s.p;
        rel = ((rel % slots) + slots + slots / 2) % slots - slots / 2;
        const c = Math.cos((rel * step * Math.PI) / 180);
        el.style.opacity = c <= 0 ? '0' : (0.25 + 0.75 * Math.pow(c, 2.2)).toFixed(3);
        el.style.pointerEvents = c > 0.3 ? 'auto' : 'none';
      }

      const isMoving = s.dragging || Math.abs(s.v) > 0.0004 || (s.target !== null && Math.abs(s.target - s.p) > 0.02);
      const f = wrap(Math.round(s.p)) % n;
      if (f !== lastFront) { lastFront = f; setFront(f); }
      if (isMoving !== lastMoving) { lastMoving = isMoving; setMoving(isMoving); }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [slots, step, dims.r, n, wrap]);

  // Giro automático, un paso cada tanto (pausa con el mouse encima o con Espacio)
  useEffect(() => {
    if (n < 2 || paused) return undefined;
    const id = setInterval(() => {
      const s = sim.current;
      if (s.reduce || s.hovered || s.dragging || Math.abs(s.v) > 0.0004) return;
      s.target = Math.round(s.target ?? s.p) + 1;
    }, INTERVAL);
    return () => clearInterval(id);
  }, [n, paused]);

  const goBy = k => {
    const s = sim.current;
    s.target = Math.round(s.target ?? s.p) + k;
  };
  // Ir a una tarjeta por el camino más corto
  const goToSlot = i => {
    const s = sim.current;
    let d = i - wrap(Math.round(s.p));
    if (d > slots / 2) d -= slots;
    if (d < -slots / 2) d += slots;
    s.target = Math.round(s.p) + d;
  };
  const open = idx => router.push(`/work/${projects[idx].slug}`);

  // Arrastrar y lanzar
  const onPointerDown = e => {
    if (e.button !== 0) return;
    const s = sim.current;
    s.drag = { x: e.clientX, lastX: e.clientX, lastT: e.timeStamp, moved: false, id: e.pointerId };
  };
  const onPointerMove = e => {
    const s = sim.current;
    const d = s.drag;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved && Math.abs(e.clientX - d.x) > 6) {
      d.moved = true;
      s.dragging = true;
      s.target = null;
      try { stageRef.current.setPointerCapture(e.pointerId); } catch {}
    }
    if (!d.moved) return;
    const now = e.timeStamp;
    const dx = e.clientX - d.lastX;
    const cards = dx / (dims.w + GAP);
    s.p -= cards;
    const dt = Math.max(1, now - d.lastT);
    s.v = s.v * 0.4 + (-cards / dt) * 0.6;
    d.lastX = e.clientX;
    d.lastT = now;
  };
  const onPointerUp = e => {
    const s = sim.current;
    const d = s.drag;
    if (!d || d.id !== e.pointerId) return;
    s.drag = null;
    if (d.moved) {
      s.dragging = false;
      s.dragEndedAt = e.timeStamp;
      // si casi no lo lanzaste, que encaje de una vez
      if (Math.abs(s.v) < 0.0018) s.target = Math.round(s.p);
      else s.target = null;
    }
  };
  const onCardClick = (e, slot, idx) => {
    const s = sim.current;
    if (s.dragEndedAt && e.timeStamp - s.dragEndedAt < 120) return;
    // Si está girando rápido, el clic lo "atrapa" en la siguiente tarjeta
    if (Math.abs(s.v) > 0.002) {
      s.target = Math.round(s.p + Math.sign(s.v));
      return;
    }
    if (wrap(Math.round(s.p)) === slot) open(idx);
    else goToSlot(slot);
  };

  // Rueda: solo el gesto horizontal del trackpad (el scroll normal de la página sigue igual)
  const wheelAcc = useRef(0);
  const onWheel = e => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    wheelAcc.current += e.deltaX;
    if (Math.abs(wheelAcc.current) > 60) {
      goBy(Math.sign(wheelAcc.current));
      wheelAcc.current = 0;
    }
  };

  const onKeyDown = e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goBy(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goBy(-1); }
    if (e.key === 'Enter') { e.preventDefault(); open(front); }
    if (e.key === ' ') { e.preventDefault(); setPaused(p => !p); }
  };

  if (!n) return null;
  const current = projects[front];

  return (
    <div
      className="project-ring relative select-none"
      onPointerEnter={() => { sim.current.hovered = true; }}
      onPointerLeave={() => { sim.current.hovered = false; }}
    >
      <div
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={`Selected work: ${current.title} (${front + 1} of ${n}). Arrow keys to spin, Enter to open, Space to pause.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        className="ring-stage relative mx-auto cursor-grab touch-pan-y overflow-x-clip rounded-3xl outline-none [perspective:1500px] active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-black/80"
        style={{ height: Math.round(dims.h * 1.55) }}
      >
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
          style={{ '--ring-blur': '0px' }}
        >
          {Array.from({ length: slots }, (_, slot) => {
            const idx = slot % n;
            const p = projects[idx];
            const color = p.card_color || PALETTE[idx % PALETTE.length];
            return (
              <button
                key={slot}
                ref={el => { cardRefs.current[slot] = el; }}
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={e => onCardClick(e, slot, idx)}
                className="ring-card absolute overflow-hidden rounded-[14px] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.5)] [backface-visibility:hidden]"
                style={{
                  width: dims.w,
                  height: dims.h,
                  left: -dims.w / 2,
                  top: -dims.h / 2,
                  transform: `rotateY(${slot * step}deg) translateZ(${dims.r}px)`,
                  backgroundColor: color,
                }}
              >
                {p.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover} alt="" draggable={false} className="pointer-events-none h-full w-full object-cover" />
                ) : (
                  <span className="pointer-events-none flex h-full w-full flex-col justify-between p-[7%] text-left text-neutral-900">
                    <span className="font-nav text-sm opacity-70">LAB ✦</span>
                    <span className="font-title text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[0.95] tracking-tight">{p.title}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Título de la tarjeta de adelante (aparece cuando el anillo está quieto) */}
      <div className="mt-4 flex min-h-[7.5rem] flex-col items-center text-center" aria-live="polite">
        <div className={`transition-[opacity,transform,filter] duration-300 ease-[var(--ease-out)] ${moving ? 'translate-y-1 opacity-0 blur-[2px]' : 'opacity-100'}`}>
          <p className="font-title text-3xl tracking-tight text-neutral-900 md:text-4xl">{current.title}</p>
          {current.tags?.length > 0 && (
            <p className="font-body mt-1.5 text-sm text-neutral-500">{current.tags.slice(0, 3).join(' · ')}</p>
          )}
          <button
            type="button"
            onClick={() => open(front)}
            className="press font-nav group mt-4 inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-lg text-white hover:bg-neutral-800"
          >
            Open project
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
