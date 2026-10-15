'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Visor de imágenes: al hacer clic en una imagen del caso (los botones con
// data-lightbox-index) se abre en grande, con contador "1 / 5", flechas,
// teclado (← → Esc) y clic afuera para cerrar.
export default function Lightbox({ images, children }) {
  const [index, setIndex] = useState(null);
  const [shown, setShown] = useState(false);
  const closeRef = useRef(null);
  const openerRef = useRef(null);
  const open = index !== null;
  const total = images.length;

  const close = useCallback(() => {
    setShown(false);
    setTimeout(() => {
      setIndex(null);
      openerRef.current?.focus({ preventScroll: true });
    }, 160);
  }, []);
  const go = useCallback(step => setIndex(i => (i + step + total) % total), [total]);

  // Clic en cualquier imagen del caso
  const onClick = event => {
    const trigger = event.target.closest('[data-lightbox-index]');
    if (!trigger) return;
    openerRef.current = trigger;
    setIndex(Number(trigger.dataset.lightboxIndex));
    requestAnimationFrame(() => setShown(true));
  };

  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close, go]);

  const current = open ? images[index] : null;

  return (
    <div onClick={onClick}>
      {children}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${index + 1} of ${total}`}
          onClick={e => e.target === e.currentTarget && close()}
          className={`fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity duration-200 ease-[var(--ease-out)] md:p-12 ${
            shown ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={current.url}
            src={current.url}
            alt={current.alt || ''}
            className={`max-h-[84vh] max-w-full rounded-[6px] object-contain shadow-2xl transition-transform duration-200 ease-[var(--ease-out)] ${
              shown ? 'scale-100' : 'scale-[0.96]'
            }`}
          />

          <p className="font-body absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm tabular-nums text-white">
            {index + 1} / {total}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="press absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          {total > 1 && (
            <>
              <Arrow dir="prev" onClick={() => go(-1)} />
              <Arrow dir="next" onClick={() => go(1)} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Arrow({ dir, onClick }) {
  const prev = dir === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={prev ? 'Previous image' : 'Next image'}
      className={`press absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 ${
        prev ? 'left-3 md:left-6' : 'right-3 md:right-6'
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={prev ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
      </svg>
    </button>
  );
}
