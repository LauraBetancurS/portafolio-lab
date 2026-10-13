'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ProjectCard from './ProjectCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Ajustes ────────────────────────────────────────────────
const PARALLAX = 9;        // % que se mueve la imagen dentro de la tarjeta al hacer scroll
const CURSOR_SHIFT = 14;   // px que la imagen se corre hacia el lado contrario del cursor
const SPLASH_OPACITY = 0.85;
// ────────────────────────────────────────────────────────────

// Grilla de proyectos con dos efectos:
// 1. Parallax: la imagen se mueve más lento que la tarjeta al hacer scroll.
// 2. Con el mouse: una mancha de color sigue al cursor dentro de la tarjeta
//    y la imagen se corre un poquito, como si tuviera profundidad.
export default function ProjectGrid({ projects }) {
  const gridRef = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const cleanups = [];

      gsap.utils.toArray('.project-card').forEach(card => {
        const media = card.querySelector('.project-media');
        const splash = card.querySelector('.project-splash');

        // 1. Parallax con el scroll
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -PARALLAX },
            {
              yPercent: PARALLAX,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        }

        // 2. Mancha de color + movimiento con el cursor (solo con mouse)
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const splashX = gsap.quickTo(splash, 'x', { duration: 0.5, ease: 'power3.out' });
        const splashY = gsap.quickTo(splash, 'y', { duration: 0.5, ease: 'power3.out' });
        const mediaX = media && gsap.quickTo(media, 'x', { duration: 0.8, ease: 'power3.out' });

        const onEnter = e => {
          const r = card.getBoundingClientRect();
          gsap.set(splash, { x: e.clientX - r.left, y: e.clientY - r.top });
          gsap.fromTo(splash, { scale: 0.2 }, { scale: 1, opacity: SPLASH_OPACITY, duration: 0.6, ease: 'elastic.out(1, 0.6)' });
        };
        const onMove = e => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          splashX(x);
          splashY(y);
          if (mediaX) mediaX(((x / r.width) - 0.5) * -CURSOR_SHIFT * 2);
        };
        const onLeave = () => {
          gsap.to(splash, { scale: 0.4, opacity: 0, duration: 0.4, ease: 'power2.out' });
          if (mediaX) mediaX(0);
        };
        // Clic: la mancha "salpica" (crece rápido) antes de abrir el proyecto
        const onDown = () => gsap.fromTo(splash, { scale: 1 }, { scale: 1.6, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1 });

        card.addEventListener('pointerenter', onEnter);
        card.addEventListener('pointermove', onMove);
        card.addEventListener('pointerleave', onLeave);
        card.addEventListener('pointerdown', onDown);
        cleanups.push(() => {
          card.removeEventListener('pointerenter', onEnter);
          card.removeEventListener('pointermove', onMove);
          card.removeEventListener('pointerleave', onLeave);
          card.removeEventListener('pointerdown', onDown);
        });
      });

      return () => cleanups.forEach(fn => fn());
    },
    { scope: gridRef, dependencies: [projects.length] }
  );

  return (
    <ul ref={gridRef} className="grid gap-3 md:grid-cols-2">
      {projects.map((project, i) => (
        <li key={project.id}>
          <ProjectCard project={project} index={i} />
        </li>
      ))}
    </ul>
  );
}
