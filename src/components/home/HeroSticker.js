'use client';

import { useState } from 'react';

// Imagen "sticker" del hero con un efecto de hover.
// effect: 'lift'   → se levanta y gira un poquito
//         'wiggle' → se sacude (como al tocar el micrófono)
//         'press'  → se hunde, como teclas presionadas
// onActivate: función opcional que se ejecuta al hacer clic (ej. un sonido)
const EFFECTS = {
  lift: 'hover:-translate-y-2 hover:-rotate-2 hover:scale-[1.03] hover:drop-shadow-xl',
  wiggle: 'hover:animate-sticker-wiggle',
  press: 'hover:translate-y-1 hover:scale-[0.97] active:translate-y-2 active:scale-95',
};

export default function HeroSticker({ src, alt, effect = 'lift', onActivate, className = '' }) {
  const [bump, setBump] = useState(0);

  const handleClick = () => {
    setBump(b => b + 1); // reinicia el "rebote" al hacer clic
    onActivate?.();
  };

  return (
    <button
      type="button"
      aria-label={alt}
      onClick={handleClick}
      className={`group block w-full cursor-pointer ${className}`}
    >
      <span key={bump} className={`block ${bump ? 'animate-sticker-bump' : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          draggable={false}
          className={`block h-auto w-full select-none drop-shadow-md transition duration-300 ease-out ${EFFECTS[effect]}`}
        />
      </span>
    </button>
  );
}
