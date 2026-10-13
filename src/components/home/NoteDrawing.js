'use client';

import { useState } from 'react';
import { NOTE_DRAWING_1_URL, NOTE_DRAWING_2_URL } from '@/lib/assets';

// Sticky note con el dibujo.
// Versión 1 al cargar; al pasar el mouse cambia a la versión 2.
// En celular (sin hover) cambia al tocarla.
export default function NoteDrawing({ className = '' }) {
  const [tapped, setTapped] = useState(false);

  return (
    <button
      type="button"
      aria-label="Drawing of Laura on a sticky note"
      onClick={() => setTapped(t => !t)}
      className={`group relative block cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-1 hover:rotate-1 ${className}`}
    >
      {/* Versión 1 (visible por defecto) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={NOTE_DRAWING_1_URL}
        alt=""
        draggable={false}
        className={`block h-auto w-full select-none transition-opacity duration-300 group-hover:opacity-0 ${
          tapped ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {/* Versión 2 (encima, aparece en hover) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={NOTE_DRAWING_2_URL}
        alt=""
        draggable={false}
        className={`absolute inset-0 h-full w-full select-none object-contain transition-opacity duration-300 group-hover:opacity-100 ${
          tapped ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </button>
  );
}
