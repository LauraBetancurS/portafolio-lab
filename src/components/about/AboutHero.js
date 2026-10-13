'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Note from '@/components/mixed/Note';
import { CONTACTS } from '@/data/contact';
import { FULL_BODY_URL, MICROPHONE_URL } from '@/lib/assets';

gsap.registerPlugin(useGSAP);

const CONFETTI_COLORS = ['#F2A2DC', '#C9DB4B', '#A9D6F5', '#E8603C', '#F8D98C'];

// Mensajes que van cambiando al hacer clic en la foto
const BODY_NOTES = [
  'same girl…\njust more tabs\nopen now.',
  'ok that tickles.',
  'click again,\nI dare you.',
  'fine. you win.\nlet’s work together?',
];

// Silueta de ejemplo mientras no subas tu foto
function Silhouette() {
  return (
    <svg viewBox="0 0 200 520" className="h-full w-auto" aria-hidden="true">
      <g fill="#d9d9d9">
        <circle cx="100" cy="92" r="38" />
        <path d="M128 120 L 150 20 L 165 24 L 150 135 Z" />
        <path d="M58 150 Q 100 125 142 150 L 150 300 L 50 300 Z" />
        <path d="M54 296 L 96 296 L 92 500 L 62 500 Z" />
        <path d="M104 296 L 146 296 L 138 500 L 108 500 Z" />
        <path d="M58 150 L 40 260 L 56 262 L 72 170 Z" />
      </g>
      <text x="100" y="330" textAnchor="middle" fontSize="13" fill="#9a9a9a" fontFamily="sans-serif">
        your full-body photo
      </text>
    </svg>
  );
}

export default function AboutHero() {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const handRef = useRef(null);
  const bodyRef = useRef(null);
  const pathRef = useRef(null);
  const burstRef = useRef(null);
  const [clicks, setClicks] = useState(0);
  const [svgBox, setSvgBox] = useState({ w: 1, h: 1 });

  // ─── El hilo: va del título a la mano y se curva hacia el mouse ───
  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    if (!root || !path) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let start = { x: 0, y: 0 };
    let end = { x: 0, y: 0 };
    const target = { x: 0, y: 0 }; // cuánto se dobla hacia el mouse
    const current = { x: 0, y: 0 };
    let frame = 0;

    const measure = () => {
      const r = root.getBoundingClientRect();
      const t = titleRef.current.getBoundingClientRect();
      const h = handRef.current.getBoundingClientRect();
      setSvgBox({ w: r.width, h: r.height });
      start = { x: t.right - r.left + 12, y: t.top - r.top + t.height * 0.32 };
      end = { x: h.left - r.left + h.width / 2, y: h.top - r.top + h.height / 2 };
      draw();
    };

    const draw = () => {
      const dx = end.x - start.x;
      // Ola suave: baja desde el título, toca fondo a mitad de camino y sube hasta la mano
      const low = { x: start.x + dx * 0.5 + current.x, y: Math.max(start.y, end.y) + 260 + current.y };
      const c1 = { x: start.x + dx * 0.18 + current.x * 0.5, y: start.y - 70 + current.y * 0.4 };
      const c2 = { x: low.x - dx * 0.22, y: low.y };
      const c4 = { x: end.x - dx * 0.16 + current.x * 0.3, y: end.y + current.y * 0.2 };
      path.setAttribute(
        'd',
        `M ${start.x} ${start.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${low.x} ${low.y} S ${c4.x} ${c4.y} ${end.x} ${end.y}`
      );
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      draw();
      frame = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = e => {
      if (reduce) return;
      const r = root.getBoundingClientRect();
      const midX = (start.x + end.x) / 2;
      const midY = Math.max(start.y, end.y) + 260;
      target.x = gsap.utils.clamp(-70, 70, (e.clientX - r.left - midX) * 0.12);
      target.y = gsap.utils.clamp(-60, 60, (e.clientY - r.top - midY) * 0.15);
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    document.fonts.ready.then(measure);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // ─── Animación de entrada: el hilo se dibuja y la foto aparece ───
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(pathRef.current, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', delay: 0.4 });
      gsap.from(bodyRef.current, { y: 60, opacity: 0, duration: 0.9, ease: 'back.out(1.4)', delay: 0.2 });
      gsap.from('.hero-note', { opacity: 0, y: 10, stagger: 0.15, duration: 0.6, delay: 1.2 });
    },
    { scope: rootRef }
  );

  // ─── Interacciones con la foto ───
  const jump = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.timeline()
      .to(bodyRef.current, { y: -18, scaleY: 1.03, duration: 0.18, ease: 'power2.out' })
      .to(bodyRef.current, { y: 0, scaleY: 1, duration: 0.5, ease: 'bounce.out' });
  };

  const confetti = () => {
    const burst = burstRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!burst || reduce) return;
    for (let i = 0; i < 26; i++) {
      const piece = document.createElement('span');
      const size = gsap.utils.random(6, 12);
      piece.style.cssText = `position:absolute;left:0;top:0;width:${size}px;height:${size * gsap.utils.random(0.5, 1.4)}px;background:${gsap.utils.random(CONFETTI_COLORS)};border-radius:${Math.random() > 0.5 ? '50%' : '2px'}`;
      burst.appendChild(piece);
      const angle = gsap.utils.random(-170, -10) * (Math.PI / 180);
      const dist = gsap.utils.random(70, 190);
      gsap.to(piece, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        rotate: gsap.utils.random(-360, 360),
        duration: gsap.utils.random(0.6, 1),
        ease: 'power3.out',
      });
      gsap.to(piece, { y: '+=120', opacity: 0, delay: 0.55, duration: 0.7, ease: 'power1.in', onComplete: () => piece.remove() });
    }
  };

  const onBodyClick = () => {
    setClicks(c => c + 1);
    jump();
    confetti();
  };

  const email = CONTACTS.find(c => c.label === 'Email');
  const others = CONTACTS.filter(c => c.label !== 'Email');

  return (
    <section ref={rootRef} className="relative mx-auto max-w-7xl lg:min-h-[86vh]">
      {/* Hilo (solo en pantallas grandes) */}
      <svg
        className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block"
        viewBox={`0 0 ${svgBox.w} ${svgBox.h}`}
        aria-hidden="true"
      >
        <path ref={pathRef} pathLength="1" fill="none" stroke="#1e1e1e" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <div className="relative grid gap-12 lg:grid-cols-[1fr_auto]">
        {/* Texto */}
        <div className="relative pt-10">
          <Note arrow="down-left" arrowFirst rotate={-8} className="hero-note absolute -left-2 -top-2 md:-left-10">
            who made this?
          </Note>

          <h1 ref={titleRef} className="font-title w-fit text-[clamp(4rem,11vw,9.5rem)] leading-[0.88] tracking-tight text-neutral-900">
            oh, hi.
            <br />
            i’m <em className="font-title italic">Lau.</em>
          </h1>

          <p className="font-body mt-8 text-xl leading-snug text-neutral-500">
            still curious.
            <br />
            still designing.
            <br />
            still opening Figma tabs.
          </p>

          <p className="font-title mt-8 max-w-[18ch] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] text-neutral-900">
            let’s build something that feels <em className="italic">human</em>.
          </p>

          <div className="mt-10 flex max-w-xl flex-col gap-3">
            {email && (
              <a
                href={email.href}
                className="font-body group flex items-center justify-between rounded-lg bg-black px-6 py-4 text-lg text-white transition-transform duration-200 hover:-translate-y-0.5 sm:w-fit sm:gap-16"
              >
                {email.value}
                <span className="transition-transform duration-200 group-hover:rotate-45">↗</span>
              </a>
            )}
            <div className="flex flex-wrap gap-3">
              {others.map(c => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body group flex items-center gap-10 rounded-lg px-6 py-3.5 text-lg text-neutral-900 ring-1 ring-black/25 transition-colors duration-200 hover:bg-white"
                >
                  {c.label.toLowerCase()}
                  <span className="transition-transform duration-200 group-hover:rotate-45">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Sticker con dato curioso */}
          <div className="relative mt-14 flex items-end gap-2 lg:absolute lg:-right-16 lg:bottom-4 lg:mt-0">
            <Note arrow="down-right" rotate={-6} className="hero-note mb-16">
              {'fun fact:\nI sing in musical theater.'}
            </Note>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MICROPHONE_URL}
              alt=""
              className="h-28 w-auto -rotate-12 drop-shadow-xl transition-transform duration-300 hover:animate-sticker-wiggle"
            />
          </div>
        </div>

        {/* Foto de cuerpo completo */}
        <div className="relative mx-auto flex h-[520px] w-[260px] items-end justify-center lg:mx-0 lg:mr-56 lg:h-[78vh] lg:w-[300px]">
          {/* Punto donde termina el hilo (la mano levantada) */}
          <span ref={handRef} aria-hidden="true" className="absolute right-[24%] top-[3%] h-2 w-2" />
          {/* Rayitas de "¡hola!" junto a la mano */}
          <svg viewBox="0 0 60 40" className="absolute -top-6 right-[6%] h-10 w-14" aria-hidden="true">
            <path d="M8 30 L 4 8 M24 26 L 30 4 M38 32 L 56 22" stroke="#1e1e1e" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div ref={burstRef} aria-hidden="true" className="pointer-events-none absolute right-[24%] top-[6%]" />

          <button
            ref={bodyRef}
            type="button"
            onMouseEnter={jump}
            onClick={onBodyClick}
            aria-label="Laura saying hi. Click for a surprise."
            className="relative block h-full origin-bottom"
          >
            {FULL_BODY_URL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={FULL_BODY_URL} alt="Laura Betancur waving" className="h-full w-auto object-contain drop-shadow-xl" draggable={false} />
            ) : (
              <Silhouette />
            )}
          </button>

          <Note arrow="down-left" rotate={-10} className="hero-note absolute -right-4 top-[30%] translate-x-full lg:-right-6">
            <span aria-live="polite">{BODY_NOTES[clicks % BODY_NOTES.length]}</span>
          </Note>
          <Note arrow="left" arrowFirst rotate={-8} className="hero-note absolute -right-4 top-[68%] hidden translate-x-full lg:flex">
            {'still figuring\nthis out…\nand probably\nalways will.'}
          </Note>
        </div>
      </div>
    </section>
  );
}
