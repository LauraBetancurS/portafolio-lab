'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLang } from '@/i18n/lang';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Imagen o video que se "destapa" de abajo hacia arriba al aparecer en pantalla,
// con un zoom suave que se acomoda mientras haces scroll.
// frameClass: por ejemplo 'aspect-[16/9]' para recortar la imagen a esa forma
// zoomIndex: si se pasa, la imagen se puede abrir en grande (ver Lightbox)
export default function MediaReveal({ item, priority = false, className = '', frameClass = '', zoomIndex }) {
  const ref = useRef(null);
  const { t } = useLang();
  const alt = t(item.alt, item.alt_es) || '';

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
            aria-label={alt || undefined}
            className={frameClass ? 'block h-full w-full object-cover' : 'block h-auto max-h-[88vh] w-full object-contain'}
          />
        ) : zoomIndex !== undefined ? (
          <button
            type="button"
            data-lightbox-index={zoomIndex}
            aria-label={t('Open image', 'Abrir imagen') + (alt ? `: ${alt}` : '')}
            className={`group/zoom relative block w-full cursor-zoom-in ${frameClass ? 'h-full' : ''}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={alt}
              loading={priority ? 'eager' : 'lazy'}
              className={frameClass ? 'block h-full w-full object-cover' : 'block h-auto max-h-[88vh] w-full object-contain'}
            />
            <span
              aria-hidden="true"
              className="font-body pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-sm text-white opacity-0 backdrop-blur-md transition-[opacity,transform] duration-200 ease-[var(--ease-out)] translate-y-1 group-hover/zoom:translate-y-0 group-hover/zoom:opacity-100"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" />
              </svg>
              {t('View', 'Ver')}
            </span>
          </button>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            className={frameClass ? 'block h-full w-full object-cover' : 'block h-auto max-h-[88vh] w-full object-contain'}
          />
        )}
      </div>
      {item.caption && (
        <figcaption className="font-body mt-3 text-sm text-neutral-500">{t(item.caption, item.caption_es)}</figcaption>
      )}
    </figure>
  );
}
