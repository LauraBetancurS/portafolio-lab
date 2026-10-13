'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ProjectCard from './ProjectCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Ajustes de la animación ────────────────────────────────
const ENTER_TILT = 5;       // grados de inclinación al entrar (como una sticky note)
const ENTER_OFFSET = 140;   // px desde abajo al entrar
const MAX_BEND = 4;         // grados máximos de "doblez" según la velocidad del scroll
// ────────────────────────────────────────────────────────────

// Grilla de proyectos con dos efectos de scroll:
// 1. Cada tarjeta entra desde abajo, inclinada, y se "pega" derecha al canvas.
// 2. Al hacer scroll rápido, todas se doblan un poquito y vuelven a su forma al parar.
export default function ProjectGrid({ projects }) {
  const gridRef = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;

      const cells = gsap.utils.toArray('.project-cell');

      // 1. Entrada con scroll
      cells.forEach((cell, i) => {
        const side = i % 2 === 0 ? -1 : 1; // izquierda gira a un lado, derecha al otro
        gsap.fromTo(
          cell,
          { y: ENTER_OFFSET, rotate: ENTER_TILT * side, scale: 0.94, opacity: 0 },
          {
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: cell,
              start: 'top bottom',
              end: 'top 62%',
              scrub: 0.6,
            },
          }
        );
      });

      // 2. Doblez según la velocidad del scroll
      const benders = gsap.utils.toArray('.project-bend');
      const setters = benders.map(el => gsap.quickTo(el, 'skewY', { duration: 0.5, ease: 'power3.out' }));
      const clamp = gsap.utils.clamp(-MAX_BEND, MAX_BEND);
      ScrollTrigger.create({
        trigger: gridRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: self => {
          const bend = clamp(self.getVelocity() / -400);
          setters.forEach(set => set(bend));
        },
      });
      // Al parar, vuelven a su forma
      const relax = () => setters.forEach(set => set(0));
      ScrollTrigger.addEventListener('scrollEnd', relax);
      return () => ScrollTrigger.removeEventListener('scrollEnd', relax);
    },
    { scope: gridRef, dependencies: [projects.length] }
  );

  return (
    <ul ref={gridRef} className="grid gap-x-8 gap-y-14 md:grid-cols-2">
      {projects.map((project, i) => (
        <li key={project.id} className={`project-cell ${i % 2 === 1 ? 'md:mt-24' : ''}`}>
          <div className="project-bend origin-top will-change-transform">
            <ProjectCard project={project} index={i} />
          </div>
        </li>
      ))}
    </ul>
  );
}
