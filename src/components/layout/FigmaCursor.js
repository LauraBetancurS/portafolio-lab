'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/i18n/lang';

// ─── Ajustes ────────────────────────────────────────────────
const LABEL = { en: 'You', es: 'Tú' };
const COLOR = '#F2A2DC';      // color de la burbuja (rosa de la paleta)
const TEXT_COLOR = '#1e1e1e'; // color del texto dentro de la etiqueta
// ────────────────────────────────────────────────────────────

// Burbuja estilo Figma ("You") que sigue al cursor normal del mouse.
// Solo se activa en dispositivos con mouse (en celular no hace nada).
export default function FigmaCursor() {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const { tr } = useLang();

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
        {/* Burbuja: queda abajo a la derecha de la flecha normal del mouse */}
        <span
          className="font-body absolute left-[14px] top-[20px] whitespace-nowrap rounded-full rounded-tl-[4px] px-3 py-1 text-sm font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.18)] ring-1 ring-white/80"
          style={{ backgroundColor: COLOR, color: TEXT_COLOR }}
        >
          {tr(LABEL)}
        </span>
      </div>
    </div>
  );
}
