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
const STAR_SPACING = 34;   // px que hay que mover el mouse para que salga otra estrella
const BURST_STARS = 12;    // estrellas que salen al hacer clic
const STAR_COLORS = ['#F2A2DC', '#C9DB4B', '#A9D6F5', '#E8603C', '#F8D98C'];
const REVEAL_ZOOM = 1.18;  // zoom inicial de la imagen mientras la tarjeta se destapa
// ────────────────────────────────────────────────────────────

// Grilla de proyectos con tres efectos:
// 0. Reveal: al hacer scroll cada tarjeta se "destapa" desde abajo como una
//    ventana que se abre, la imagen se acomoda desde un zoom y luego entra el texto.
//    Va atado al scroll (si subes, se vuelve a cerrar). La columna derecha va un poco después.
// 1. Parallax: la imagen se mueve más lento que la tarjeta al hacer scroll.
// 2. Con el mouse: deja un rastro de estrellitas de colores dentro de la tarjeta,
//    la imagen se corre un poquito y al hacer clic salen varias estrellas.

const STAR_PATH = 'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z';

// Crea una estrella en (x, y) dentro de la capa y la anima
function spawnStar(layer, x, y, { burst = false } = {}) {
  const size = gsap.utils.random(burst ? 18 : 16, burst ? 32 : 28);
  const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  star.setAttribute('viewBox', '0 0 24 24');
  star.style.cssText = `position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;overflow:visible`;
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', STAR_PATH);
  path.setAttribute('fill', gsap.utils.random(STAR_COLORS));
  star.appendChild(path);
  layer.appendChild(star);

  const angle = gsap.utils.random(0, Math.PI * 2);
  const dist = burst ? gsap.utils.random(50, 120) : gsap.utils.random(8, 26);
  gsap.timeline({ onComplete: () => star.remove() })
    .fromTo(star, { scale: 0, rotate: gsap.utils.random(-90, 90) }, { scale: 1, rotate: '+=60', duration: 0.35, ease: 'back.out(3)' })
    .to(star, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - (burst ? 0 : 18),
      rotate: '+=90',
      scale: 0,
      opacity: 0,
      duration: burst ? 0.8 : 0.9,
      ease: 'power2.in',
    }, burst ? 0.05 : 0.25);
}
export default function ProjectGrid({ projects }) {
  const gridRef = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const cleanups = [];

      const twoColumns = window.matchMedia('(min-width: 768px)').matches;

      gsap.utils.toArray('.project-card').forEach((card, i) => {
        const media = card.querySelector('.project-media');
        const copy = card.querySelectorAll('.project-copy');

        // 0. Reveal con el scroll
        // Las tarjetas que ya se ven al cargar se abren solas (con tiempo);
        // las demás se abren mientras haces scroll.
        const visibleOnLoad = card.getBoundingClientRect().top < window.innerHeight * 0.9;
        const lag = twoColumns && i % 2 === 1 ? 8 : 0; // la columna derecha llega un poco después
        const reveal = visibleOnLoad
          ? gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 + i * 0.12 })
          : gsap.timeline({
              // ease suave + scrub con retraso: la tarjeta "alcanza" al scroll sin saltos
              defaults: { ease: 'power2.out' },
              scrollTrigger: { trigger: card, start: `top ${100 - lag}%`, end: `top ${42 - lag}%`, scrub: 1.2 },
            });
        const d = visibleOnLoad ? 1.1 : 1;
        reveal.fromTo(
          card,
          { clipPath: 'inset(30% 6% 0% 6% round 18px)' },
          // termina un poco afuera de la tarjeta para no cortar el borde de foco del teclado
          { clipPath: 'inset(-3% -3% -3% -3% round 18px)', duration: d },
          0
        );
        if (media) reveal.fromTo(media, { scale: REVEAL_ZOOM }, { scale: 1, duration: d }, 0);
        if (copy.length) reveal.fromTo(copy, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, ease: 'power2.out' }, d * 0.45);

        // 1. Parallax con el scroll
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -PARALLAX },
            {
              yPercent: PARALLAX,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.8 }, // 0.8 s de suavizado
            }
          );
        }

        // 2. Estrellitas + movimiento con el cursor (solo con mouse)
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const layer = card.querySelector('.project-stars');
        const mediaX = media && gsap.quickTo(media, 'x', { duration: 0.8, ease: 'power3.out' });
        let last = null;

        const onEnter = e => {
          const r = card.getBoundingClientRect();
          last = { x: e.clientX - r.left, y: e.clientY - r.top };
          spawnStar(layer, last.x, last.y);
        };
        const onMove = e => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          if (!last || Math.hypot(x - last.x, y - last.y) > STAR_SPACING) {
            spawnStar(layer, x, y);
            last = { x, y };
          }
          if (mediaX) mediaX(((x / r.width) - 0.5) * -CURSOR_SHIFT * 2);
        };
        const onLeave = () => {
          last = null;
          if (mediaX) mediaX(0);
        };
        // Clic: estallido de estrellas antes de abrir el proyecto
        const onDown = e => {
          const r = card.getBoundingClientRect();
          for (let i = 0; i < BURST_STARS; i++) spawnStar(layer, e.clientX - r.left, e.clientY - r.top, { burst: true });
        };

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
    <ul ref={gridRef} className="grid gap-x-8 gap-y-10 md:grid-cols-2 md:gap-y-14">
      {projects.map((project, i) => (
        <li key={project.id}>
          <ProjectCard project={project} index={i} to="prototype" />
        </li>
      ))}
    </ul>
  );
}
