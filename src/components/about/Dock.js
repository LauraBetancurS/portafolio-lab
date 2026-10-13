'use client';

import { useState } from 'react';

// Un Dock de macOS con cosas que le gustan a Laura fuera del diseño.
// Al pasar el mouse, el ícono crece (y los vecinos un poco) y aparece su nombre.
const APPS = [
  { emoji: '🎭', label: 'Musical theater', bg: '#F6C6E6' },
  { emoji: '🎤', label: 'Singing', bg: '#F8D98C' },
  { emoji: '🎮', label: 'Indie games', bg: '#CDE8F8' },
  { emoji: '📚', label: 'Camus and Pessoa', bg: '#E4EDB0' },
  { emoji: '🎬', label: 'Latin American cinema', bg: '#F9CDBF' },
  { emoji: '🦕', label: 'Dinosaurs, obviously', bg: '#D7F0D2' },
];

export default function Dock() {
  const [hovered, setHovered] = useState(null);

  const scaleFor = i => {
    if (hovered === null) return 1;
    const distance = Math.abs(i - hovered);
    return distance === 0 ? 1.45 : distance === 1 ? 1.18 : 1;
  };

  return (
    <ul
      className="mx-auto flex w-fit items-end gap-2 rounded-3xl sm:gap-3 border border-white/60 bg-white/50 px-4 pb-3 pt-3 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.3)] backdrop-blur-md"
      onMouseLeave={() => setHovered(null)}
    >
      {APPS.map((app, i) => (
        <li key={app.label} className="relative">
          <button
            type="button"
            aria-label={app.label}
            onMouseEnter={() => setHovered(i)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            className="flex h-10 w-10 origin-bottom items-center justify-center rounded-xl text-xl shadow-sm transition-transform duration-200 ease-out sm:h-14 sm:w-14 sm:text-3xl"
            style={{ backgroundColor: app.bg, transform: `scale(${scaleFor(i)})` }}
          >
            {app.emoji}
          </button>
          <span
            className={`font-body pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-800/90 px-2 py-1 text-xs text-white transition-opacity duration-150 ${
              hovered === i ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {app.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
