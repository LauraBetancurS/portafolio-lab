'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Palabras que van cambiando mientras el mouse está encima
const WORDS = ['Create', 'Design', 'Solutions', 'Prototype', 'Research', 'Build'];
const CYCLE_MS = 900; // cada cuánto cambia la palabra durante el hover

// Texto con estilo de "selección de texto" de iOS:
// fondo azul claro y dos manijas azules (punto arriba a la izquierda, abajo a la derecha).
// En hover las palabras van rotando; en celular cambia con cada toque.
export default function SelectionWord({ className = '' }) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const boxRef = useRef(null);
  const textRef = useRef(null);

  // Mientras hay hover: cambia de una vez y luego cada CYCLE_MS
  useEffect(() => {
    if (!hovering) return;
    const next = () => setIndex(i => (i + 1) % WORDS.length);
    const first = setTimeout(next, 120);
    const interval = setInterval(next, CYCLE_MS);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [hovering]);

  // La "selección" se estira o encoge al ancho de la nueva palabra
  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (box && text) box.style.width = `${text.offsetWidth}px`;
  }, [index]);

  const word = WORDS[index];

  return (
    <button
      type="button"
      aria-label={`${word}. Hover to see more words`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => setIndex(i => (i + 1) % WORDS.length)}
      className={`relative inline-block cursor-default select-none ${className}`}
    >
      {/* Caja de selección (fondo + manijas) */}
      <span
        ref={boxRef}
        className="relative block h-[1.75em] bg-[#007AFF]/15 transition-[width] duration-300 ease-out"
      >
        {/* Manija izquierda: barra + punto arriba */}
        <span className="absolute -left-[1px] top-0 h-full w-[2px] bg-[#007AFF]">
          <span className="absolute -top-[5px] left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-[#007AFF]" />
        </span>
        {/* Manija derecha: barra + punto abajo */}
        <span className="absolute -right-[1px] top-0 h-full w-[2px] bg-[#007AFF]">
          <span className="absolute -bottom-[5px] left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-[#007AFF]" />
        </span>
      </span>

      {/* Palabra (se mide para ajustar el ancho de la selección) */}
      <span
        ref={textRef}
        key={word}
        aria-hidden="true"
        className="animate-word-in absolute left-0 top-0 flex h-[1.75em] items-center whitespace-nowrap px-[0.6em] font-semibold text-neutral-900"
      >
        {word}
      </span>
    </button>
  );
}
