'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Imagen o video que se "destapa" de abajo hacia arriba al aparecer en pantalla,
// con un zoom suave que se acomoda mientras haces scroll.
// frameClass: por ejemplo 'aspect-[16/9]' para recortar la imagen a esa forma
export default function MediaReveal({ item, priority = false, className = '', frameClass = '' }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const frame = ref.current;
      const media = frame.querySelector('img, video');
      gsap.fromTo(
        frame,
        { clipPath: 'inset(18% 0% 0% 0% round 6px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 6px)',
          ease: 'power3.out',
          duration: 1.1,
          scrollTrigger: { trigger: frame, start: 'top 90%', once: true },
        }
      );
      gsap.fromTo(
        media,
        { scale: 1.12 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom 40%', scrub: true } }
      );
    },
    { scope: ref }
  );

  return (
    <figure className={className}>
      <div ref={ref} className={`overflow-hidden rounded-[6px] bg-black/5 ${frameClass}`}>
        {item.type === 'video' ? (
          <video
            src={item.url}
            autoPlay
            muted
            loop
            playsInline
            aria-label={item.alt || undefined}
            className={`block w-full ${frameClass ? 'h-full object-cover' : 'h-auto'}`}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.alt || ''}
            loading={priority ? 'eager' : 'lazy'}
            className={`block w-full ${frameClass ? 'h-full object-cover' : 'h-auto'}`}
          />
        )}
      </div>
      {item.caption && (
        <figcaption className="font-body mt-3 text-sm text-neutral-500">{item.caption}</figcaption>
      )}
    </figure>
  );
}
