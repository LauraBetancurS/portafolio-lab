'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLang } from '@/i18n/lang';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DOTS = ['#F2A2DC', '#A9D6F5', '#C9DB4B', '#E8603C', '#DB6A8C', '#F8D98C'];

// Línea de tiempo: la línea vertical se dibuja mientras haces scroll
// y cada punto aparece cuando la línea llega a él.
export default function Timeline({ items }) {
  const ref = useRef(null);
  const { tr } = useLang();

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(
        '.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.4 },
        }
      );
      gsap.utils.toArray('.timeline-dot').forEach(dot => {
        gsap.from(dot, {
          scale: 0.4,
          opacity: 0,
          duration: 0.4,
          ease: 'back.out(3)',
          scrollTrigger: { trigger: dot, start: 'top 72%', once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <ol ref={ref} className="relative">
      <span aria-hidden="true" className="timeline-line absolute bottom-3 left-[7px] top-3 w-[2px] origin-top bg-neutral-900/80" />
      {items.map((item, i) => (
        <li key={`${item.role.en}-${item.period.en}`} className="group relative grid gap-1 pb-10 pl-10 last:pb-0 md:grid-cols-[150px_1fr] md:gap-8">
          <span
            aria-hidden="true"
            className="timeline-dot absolute left-0 top-1.5 h-4 w-4 rounded-full ring-4 ring-white transition-transform duration-200 group-hover:scale-125"
            style={{ backgroundColor: DOTS[i % DOTS.length] }}
          />
          <p className="font-body pt-0.5 text-sm text-neutral-500">{tr(item.period)}</p>
          <div>
            <h3 className="font-title text-xl leading-snug text-neutral-900 md:text-2xl">{tr(item.role)}</h3>
            <p className="font-body mt-0.5 text-neutral-600">{tr(item.org)}</p>
            {item.detail && <p className="font-body mt-2 max-w-[60ch] leading-relaxed text-neutral-700">{tr(item.detail)}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
