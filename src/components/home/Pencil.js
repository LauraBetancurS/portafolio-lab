'use client';

import { useState } from 'react';
import { PENCIL_1_URL, PENCIL_2_URL } from '@/lib/assets';
import { playPencilSound } from '@/lib/pencilSound';
import { useLang } from '@/i18n/lang';

// Lápiz: al hacer clic cambia entre la versión 1 y la 2, con sonido de lápiz.
export default function Pencil({ className = '' }) {
  const [active, setActive] = useState(false);
  const [wiggle, setWiggle] = useState(0);
  const { t } = useLang();

  const handleClick = () => {
    setActive(a => !a);
    setWiggle(w => w + 1); // reinicia la animación de "sacudida"
    playPencilSound();
  };

  return (
    <button
      type="button"
      aria-label={t('Pencil (click to switch)', 'Lápiz (clic para cambiarlo)')}
      aria-pressed={active}
      onClick={handleClick}
      className={`relative block cursor-pointer ${className}`}
    >
      <span key={wiggle} className={`block ${wiggle ? 'animate-pencil-wiggle' : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PENCIL_1_URL}
          alt=""
          draggable={false}
          className={`block h-auto w-full select-none ${active ? 'invisible' : ''}`}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PENCIL_2_URL}
          alt=""
          draggable={false}
          className={`absolute inset-0 h-full w-full select-none object-contain ${active ? '' : 'invisible'}`}
        />
      </span>
    </button>
  );
}
