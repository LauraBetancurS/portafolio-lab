'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Trazos a mano (estilo marcador) que se dibujan solos cuando aparecen en pantalla.
// variant: underline | circle | arrow | arrow-down | sparkle
const SHAPES = {
  underline: {
    viewBox: '0 0 300 24',
    paths: ['M4 16 C 60 6, 120 20, 180 11 S 270 8, 296 14'],
  },
  circle: {
    viewBox: '0 0 220 110',
    paths: ['M118 8 C 50 4, 8 30, 12 58 C 16 92, 92 104, 150 96 C 204 88, 216 52, 196 30 C 176 8, 120 2, 74 14'],
  },
  arrow: {
    viewBox: '0 0 160 80',
    paths: ['M6 60 C 40 20, 90 10, 146 30', 'M126 14 L 148 30 L 124 44'],
  },
  'arrow-down': {
    viewBox: '0 0 80 140',
    paths: ['M30 6 C 60 40, 10 80, 44 128', 'M26 108 L 44 130 L 62 106'],
  },
  sparkle: {
    viewBox: '0 0 60 60',
    paths: ['M30 4 L 30 20', 'M30 40 L 30 56', 'M4 30 L 20 30', 'M40 30 L 56 30', 'M12 12 L 21 21', 'M39 39 L 48 48', 'M48 12 L 39 21', 'M21 39 L 12 48'],
  },
};

export default function Scribble({
  variant = 'underline',
  color = '#E8603C',
  strokeWidth = 4,
  className = '',
  delay = 0,
}) {
  const ref = useRef(null);
  const shape = SHAPES[variant] ?? SHAPES.underline;

  useGSAP(
    () => {
      const paths = ref.current.querySelectorAll('path');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 0.9,
        ease: 'power2.inOut',
        stagger: 0.12,
        delay,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      });
    },
    { scope: ref }
  );

  return (
    <svg
      ref={ref}
      viewBox={shape.viewBox}
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none overflow-visible ${className}`}
    >
      {shape.paths.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength="1"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
