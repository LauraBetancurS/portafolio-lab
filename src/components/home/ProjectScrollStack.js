'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Ajustes ────────────────────────────────────────────────
const TOP = 104;        // px desde arriba donde se pega cada tarjeta (debajo del menú)
const OFFSET = 18;      // px extra por tarjeta, para que se vea el borde de las de atrás
const SHRINK = 0.05;    // cuánto se achica una tarjeta por cada una que le pasa encima
const DARKEN = 0.18;    // cuánto se oscurece la de atrás (0 = nada)
const PALETTE = ['#F6C6E6', '#CDE8F8', '#E4EDB0', '#F9CDBF', '#F8D98C'];
// ────────────────────────────────────────────────────────────

// Scroll stack: al hacer scroll cada proyecto se queda pegado arriba y el
// siguiente sube encima de él; el de atrás se achica y se oscurece un poco.
// Clic en una tarjeta → abre el proyecto.
export default function ProjectScrollStack({ projects }) {
  const listRef = useRef(null);
  const n = projects.length;

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const items = gsap.utils.toArray('.scroll-stack-item');
      items.forEach((item, i) => {
        const card = item.querySelector('.scroll-stack-card');
        const shade = item.querySelector('.scroll-stack-shade');
        const covers = n - 1 - i; // cuántas tarjetas le van a pasar por encima
        if (covers <= 0) return;
        // se achica y oscurece mientras las siguientes suben (hasta la última)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: items[i + 1],
            start: 'top bottom',
            endTrigger: items[n - 1],
            end: `top ${TOP + OFFSET * (n - 1)}px`,
            scrub: true,
          },
        });
        tl.to(card, { scale: 1 - SHRINK * covers, ease: 'none' }, 0);
        tl.to(shade, { opacity: Math.min(0.5, DARKEN * covers), ease: 'none' }, 0);
      });
    },
    { scope: listRef, dependencies: [n] }
  );

  if (!n) return null;

  return (
    <ul ref={listRef} className="relative">
      {projects.map((p, i) => {
        const color = p.card_color || PALETTE[i % PALETTE.length];
        const last = i === n - 1;
        return (
          <li
            key={p.id}
            className="scroll-stack-item sticky"
            style={{ top: TOP + OFFSET * i, paddingBottom: last ? 0 : '14vh', zIndex: i + 1 }}
          >
            <Link
              href={`/work/${p.slug}`}
              className="scroll-stack-card group relative block aspect-[4/5] origin-top overflow-hidden rounded-[18px] shadow-[0_-20px_50px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/5 will-change-transform sm:aspect-[16/10] lg:aspect-[16/8.5] max-h-[calc(100svh-170px)] w-full"
              style={{ backgroundColor: color }}
            >
              {p.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.cover}
                  alt=""
                  loading={i < 2 ? 'eager' : 'lazy'}
                  className="h-full w-full object-cover transition-transform duration-[700ms] ease-[var(--ease-out)] group-hover:scale-[1.03]"
                />
              ) : (
                <span aria-hidden="true" className="font-title absolute bottom-[12%] left-[6%] text-[clamp(3.5rem,11vw,9rem)] leading-[0.9] tracking-tight text-black/10">
                  {p.title}
                </span>
              )}

              {/* degradado para leer el texto sobre la foto */}
              {p.cover && <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/30" />}

              {/* número + título + flecha */}
              <span className={`absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-6 md:p-10 ${p.cover ? 'text-white' : 'text-neutral-900'}`}>
                <span>
                  <span className="font-body block text-sm tabular-nums opacity-70">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-title mt-1 block text-[clamp(2rem,4.5vw,3.75rem)] leading-[1] tracking-tight">{p.title}</span>
                  {p.tagline && (
                    <span className="font-body mt-3 block max-w-[46ch] text-base leading-snug opacity-80 md:text-lg">{p.tagline}</span>
                  )}
                </span>
                <span
                  aria-hidden="true"
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full backdrop-blur-md transition-transform duration-300 group-hover:rotate-45 ${p.cover ? 'bg-white/20' : 'bg-black/10'}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>

              {/* etiquetas */}
              {p.tags?.length > 0 && (
                <span className="absolute bottom-0 left-0 flex flex-wrap gap-1.5 p-6 md:p-10">
                  {p.tags.slice(0, 4).map(tag => (
                    <span
                      key={tag}
                      className={`rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wide backdrop-blur-md ${p.cover ? 'bg-white/25 text-white' : 'bg-black/10 text-neutral-900'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              )}

              {/* sombra que aparece cuando otra tarjeta le pasa encima */}
              <span aria-hidden="true" className="scroll-stack-shade pointer-events-none absolute inset-0 bg-black opacity-0" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
