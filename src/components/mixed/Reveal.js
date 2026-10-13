'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Aparece suavemente (sube y se hace visible) la primera vez que entra en pantalla.
// Úsalo solo en bloques importantes, no en todo.
export default function Reveal({ children, as: Tag = 'div', delay = 0, y = 28, className = '', ...rest }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from(ref.current, {
        opacity: 0,
        y,
        duration: 0.8,
        ease: 'power3.out',
        delay,
        scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
