'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ProjectCard from './ProjectCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Ajustes de la animación ────────────────────────────────
const ENTER_TILT = 22;   // grados de inclinación hacia atrás al entrar (efecto 3D)
const ENTER_SCALE = 0.94; // tamaño inicial
// ────────────────────────────────────────────────────────────

// Grilla de proyectos. Al hacer scroll, cada tarjeta entra inclinada
// hacia atrás en 3D (el borde de abajo se ve más ancho) y se endereza
// al llegar a su lugar, como en la referencia.
export default function ProjectGrid({ projects }) {
  const gridRef = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;

      gsap.utils.toArray('.project-cell').forEach(cell => {
        gsap.fromTo(
          cell,
          { rotateX: ENTER_TILT, scale: ENTER_SCALE, transformPerspective: 1200, transformOrigin: '50% 0%' },
          {
            rotateX: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: cell,
              start: 'top bottom',
              end: 'top 55%',
              scrub: 0.5,
            },
          }
        );
      });
    },
    { scope: gridRef, dependencies: [projects.length] }
  );

  return (
    <ul ref={gridRef} className="grid gap-3 md:grid-cols-2">
      {projects.map((project, i) => (
        <li key={project.id} className="project-cell will-change-transform">
          <ProjectCard project={project} index={i} />
        </li>
      ))}
    </ul>
  );
}
