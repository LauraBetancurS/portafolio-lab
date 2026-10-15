'use client';

import { useEffect, useRef } from 'react';
import ProjectCard from '@/components/work/ProjectCard';

// ─── Ajustes ────────────────────────────────────────────────
const SPEED = 45;        // px por segundo que avanza solo
const CARD_W = 'clamp(260px, 30vw, 380px)'; // ancho de cada tarjeta
const GAP = 20;          // px entre tarjetas
// ────────────────────────────────────────────────────────────

// Carrusel horizontal infinito: las tarjetas avanzan solas hacia la izquierda,
// frenan suave cuando pasas el mouse encima y se pueden arrastrar (o deslizar
// con el dedo / el trackpad). Clic en una tarjeta → página Work.
export default function ProjectCarousel({ projects }) {
  const trackRef = useRef(null);
  const state = useRef({ x: 0, v: 0, speed: SPEED, hover: false, drag: null, moved: false });

  // Se repiten los proyectos para que la fila nunca se quede vacía
  const copies = projects.length < 4 ? 4 : 2;
  const loop = Array.from({ length: copies }, () => projects).flat();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !projects.length) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = state.current;
    let raf = 0;
    let last = 0;

    const frame = now => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      const setW = track.scrollWidth / copies; // ancho de una vuelta completa
      if (!s.drag) {
        // velocidad automática que frena con el hover
        const target = s.hover || reduce ? 0 : SPEED;
        s.speed += (target - s.speed) * Math.min(1, dt * 4);
        if (target === 0 && Math.abs(s.speed) < 0.5) s.speed = 0;
        // inercia de un arrastre que se suelta
        s.v *= Math.pow(0.04, dt);
        if (Math.abs(s.v) < 0.5) s.v = 0;
        s.x -= (s.speed + s.v) * dt;
      }
      // da la vuelta sin que se note
      if (setW > 0) {
        while (s.x <= -setW) s.x += setW;
        while (s.x > 0) s.x -= setW;
      }
      track.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [projects.length, copies]);

  const onPointerDown = e => {
    if (e.button !== 0) return;
    const s = state.current;
    s.drag = { x: e.clientX, lastX: e.clientX, lastT: e.timeStamp, id: e.pointerId };
    s.moved = false;
    s.v = 0;
  };
  const onPointerMove = e => {
    const s = state.current;
    const d = s.drag;
    if (!d || d.id !== e.pointerId) return;
    if (!s.moved && Math.abs(e.clientX - d.x) > 6) {
      s.moved = true;
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    }
    if (!s.moved) return;
    const dx = e.clientX - d.lastX;
    s.x += dx;
    const dt = Math.max(1, e.timeStamp - d.lastT) / 1000;
    s.v = -(dx / dt) * 0.6; // px/s (positivo = hacia la izquierda)
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
  };
  const onPointerUp = e => {
    const s = state.current;
    if (!s.drag || s.drag.id !== e.pointerId) return;
    s.drag = null;
  };
  // Si arrastraste, el clic no abre el proyecto
  const onClickCapture = e => {
    if (state.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      state.current.moved = false;
    }
  };
  // Trackpad: el gesto horizontal mueve el carrusel (el scroll vertical sigue normal)
  const onWheel = e => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    state.current.x -= e.deltaX;
  };

  if (!projects.length) return null;

  return (
    <div
      className="project-carousel relative -mx-6 cursor-grab select-none overflow-hidden py-2 active:cursor-grabbing md:-mx-12"
      onPointerEnter={() => { state.current.hover = true; }}
      onPointerLeave={() => { state.current.hover = false; }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
      onWheel={onWheel}
      role="region"
      aria-label="Selected projects"
    >
      <ul ref={trackRef} className="flex w-max will-change-transform" style={{ gap: GAP, paddingLeft: GAP }}>
        {loop.map((p, i) => (
          <li
            key={`${p.id}-${i}`}
            className="shrink-0"
            style={{ width: CARD_W }}
            aria-hidden={i >= projects.length ? 'true' : undefined}
          >
            <div tabIndex={-1} inert={i >= projects.length ? true : undefined}>
              <ProjectCard project={p} index={i % projects.length} compact to="/work" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
