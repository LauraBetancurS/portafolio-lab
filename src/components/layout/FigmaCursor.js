'use client';

import { useEffect, useRef, useState } from 'react';

// ─── Ajustes ────────────────────────────────────────────────
const LABEL = 'You';
const COLOR = '#F2A2DC';      // color del cursor (rosa de la paleta)
const TEXT_COLOR = '#1e1e1e'; // color del texto dentro de la etiqueta
// ────────────────────────────────────────────────────────────

// Cursor estilo Figma: flecha + etiqueta "You" que sigue al mouse.
// Solo se activa en dispositivos con mouse (en celular no hace nada).
export default function FigmaCursor() {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);

  // ¿Hay un mouse? (pointer: fine + hover)
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    const root = document.documentElement;
    root.classList.add('has-figma-cursor'); // esconde el cursor normal (ver globals.css)

    let x = -100;
    let y = -100;
    let frame = 0;
    const render = () => {
      frame = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMove = e => {
      x = e.clientX;
      y = e.clientY;
      el.dataset.visible = 'true';
      // ¿Está encima de algo clickeable?
      el.dataset.active = e.target.closest?.('a, button, [role="button"], label, summary') ? 'true' : 'false';
      if (!frame) frame = requestAnimationFrame(render);
    };
    const onLeave = () => (el.dataset.visible = 'false');
    const onDown = () => (el.dataset.pressed = 'true');
    const onUp = () => (el.dataset.pressed = 'false');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);

    return () => {
      root.classList.remove('has-figma-cursor');
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-visible="false"
      className="figma-cursor pointer-events-none fixed left-0 top-0 z-[9999]"
    >
      <div className="figma-cursor-inner">
        {/* Flecha: la punta está exactamente en la posición del mouse */}
        <svg width="22" height="24" viewBox="0 0 22 24" className="block drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
          <path
            d="M2 2 L2 19.5 L7.2 14.8 L10.6 22 L13.6 20.6 L10.3 13.6 L17.5 13.2 Z"
            fill={COLOR}
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        {/* Etiqueta */}
        <span
          className="font-body absolute left-[18px] top-[20px] whitespace-nowrap rounded-full rounded-tl-[4px] px-3 py-1 text-sm font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.18)] ring-1 ring-white/80"
          style={{ backgroundColor: COLOR, color: TEXT_COLOR }}
        >
          {LABEL}
        </span>
      </div>
    </div>
  );
}
