'use client';

import { useState } from 'react';

// Comentario estilo FigJam: un pin con avatar que se abre al pasar el mouse
// (o al tocarlo en celular) y muestra una nota.
export default function FigjamComment({ text, author = 'Lau', color = '#F2A2DC', side = 'right', className = '' }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`absolute z-20 ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-label={`Comment from ${author}`}
        onClick={() => setOpen(o => !o)}
        className="press font-body flex h-9 w-9 items-center justify-center rounded-full rounded-bl-none text-sm font-semibold text-neutral-900 shadow-[0_4px_12px_rgba(0,0,0,0.18)] ring-2 ring-white hover:scale-110"
        style={{ backgroundColor: color }}
      >
        {author[0]}
      </button>
      <div
        role="note"
        className={`font-body absolute bottom-full mb-2 w-56 origin-bottom-left rounded-2xl rounded-bl-sm bg-white p-3 text-left text-sm leading-snug text-neutral-800 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.3)] ring-1 ring-black/5 transition-[opacity,transform,visibility] duration-200 ease-[var(--ease-out)] ${
          side === 'left' ? 'right-0 origin-bottom-right rounded-br-sm rounded-bl-2xl' : 'left-0'
        } ${open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'}`}
      >
        <span className="mb-1 block text-xs font-semibold text-neutral-500">{author}</span>
        {text}
      </div>
    </div>
  );
}
