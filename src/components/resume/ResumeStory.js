'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ABOUT_PHOTO_URL, MICROPHONE_URL } from '@/lib/assets';
import { RESUME_PDF_URL, STORY_IMAGES, STORY_MILESTONES, STORY_TOOLS } from '@/data/resume';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Cómo funciona ──────────────────────────────────────────
// En computador la sección se queda pegada y, al bajar con el scroll, avanza
// hacia los lados. Una línea negra se va dibujando por todo el recorrido.
// Todo se ubica con coordenadas del "lienzo": 1000 unidades = una pantalla
// de ancho (100vw) y 1000 de alto (100vh). El lienzo mide PANELS pantallas.
// En celular es una página normal hacia abajo (sin línea).
// ────────────────────────────────────────────────────────────
const PANELS = 8;
const W = PANELS * 1000;

// Recorrido de la línea (en unidades del lienzo)
const LINE = [
  'M -40 690',
  'C 200 760, 420 600, 640 650',
  'S 950 840, 1180 760',
  'S 1520 520, 1880 600',
  'S 2250 640, 2500 600',
  'S 2900 540, 3200 600',
  'S 3650 650, 3950 600',
  'S 4150 560, 4300 720',
  'C 4380 820, 4560 830, 4600 720',
  'C 4640 610, 4480 580, 4440 680',
  'C 4400 790, 4700 850, 4950 760',
  'S 5300 420, 5600 470',
  'S 5980 700, 6250 760',
  'S 6700 820, 7000 700',
  'C 7150 640, 7120 330, 7320 300',
  'C 7520 270, 7600 600, 7420 690',
  'C 7280 760, 7300 840, 7520 830',
  'S 7780 760, 7860 560',
].join(' ');

// Hitos sobre la línea: x en el lienzo y si el texto va arriba o abajo
const MILESTONE_X = [2380, 2780, 3180, 3580, 3940];

// Posición en el lienzo → estilo (solo se aplica en pantallas md o más)
const at = (x, y) => ({ '--l': `${x / 10}vw`, '--t': `${y / 10}vh` });
const POS = 'md:absolute md:left-[var(--l)] md:top-[var(--t)]';

// Imagen real o recuadro punteado con la descripción de la foto que falta
function Pic({ src, label, className = '', rotate = 0, float = 0, pos }) {
  return (
    <div
      className={`story-float ${className}`}
      style={{ ...pos, '--float-delay': `${float}s`, rotate: `${rotate}deg` }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} draggable={false} className="h-full w-full object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.18)]" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-2xl border-2 border-dashed border-black/20 bg-white/60 p-4 text-center">
          <span className="font-hand text-xl leading-tight text-neutral-500">{label}</span>
        </div>
      )}
    </div>
  );
}

function Milestone({ m, index }) {
  const up = index % 2 === 0; // alterna: texto arriba / abajo de la línea
  return (
    <div
      data-milestone={index}
      className={`story-in milestone relative max-md:border-l-2 max-md:border-black/15 max-md:pb-8 max-md:pl-6 md:absolute md:w-[clamp(220px,18vw,300px)] md:text-center ${
        up ? 'md:-translate-x-1/2 md:-translate-y-full' : 'md:-translate-x-1/2'
      }`}
      data-up={up ? '' : undefined}
    >
      <span aria-hidden="true" className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-neutral-900 md:hidden" />
      {!up && (
        <span aria-hidden="true" className="mx-auto hidden flex-col items-center md:flex">
          <span className="h-3 w-3 -translate-y-1/2 rounded-full bg-neutral-900" />
          <span className="h-24 w-px bg-neutral-400" />
        </span>
      )}
      <p className="font-title text-xl leading-snug text-neutral-900">{m.title}</p>
      <p className="font-body mt-1.5 text-[15px] leading-relaxed text-neutral-600">{m.text}</p>
      <p className="font-body mt-1.5 text-sm text-neutral-400">{m.year}</p>
      {up && (
        <span aria-hidden="true" className="mx-auto mt-3 hidden flex-col items-center md:flex">
          <span className="h-24 w-px bg-neutral-400" />
          <span className="h-3 w-3 translate-y-1/2 rounded-full bg-neutral-900" />
        </span>
      )}
    </div>
  );
}

export default function ResumeStory() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const pathRef = useRef(null);
  const tipRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        const track = trackRef.current;
        const path = pathRef.current;
        const len = path.getTotalLength();

        // Ubica cada hito justo encima de la línea, en su x
        const samples = Array.from({ length: 600 }, (_, i) => path.getPointAtLength((len * i) / 599));
        gsap.utils.toArray('[data-milestone]', track).forEach(el => {
          const x = MILESTONE_X[Number(el.dataset.milestone)];
          const pt = samples.reduce((best, p) => (Math.abs(p.x - x) < Math.abs(best.x - x) ? p : best), samples[0]);
          el.style.left = `${pt.x / 10}vw`;
          el.style.top = `${pt.y / 10}vh`;
        });

        // La línea se dibuja con el scroll; un punto rosado va en la punta
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        const draw = p => {
          const l = len * Math.min(1, 0.05 + p * 0.97);
          path.style.strokeDashoffset = `${len - l}`;
          const pt = path.getPointAtLength(l);
          tipRef.current.style.transform = `translate(calc(${pt.x / 10}vw - 50%), calc(${pt.y / 10}vh - 50%))`;
        };
        draw(0);

        const distance = () => track.scrollWidth - window.innerWidth;
        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 0.8,
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            onUpdate: self => draw(self.progress),
          },
        });

        // Los textos e imágenes aparecen cuando llegan a la pantalla
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.utils.toArray('.story-in', track).forEach(el => {
            gsap.from(el, {
              opacity: 0,
              y: 36,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, containerAnimation: scroll, start: 'left 88%', toggleActions: 'play none none reverse' },
            });
          });
        }
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative md:h-screen md:overflow-hidden" aria-label="My story">
      <div ref={trackRef} className="relative px-6 pb-16 pt-32 md:h-screen md:w-[800vw] md:p-0 md:will-change-transform">
        {/* La línea (solo computador) */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" viewBox={`0 0 ${W} 1000`} preserveAspectRatio="none">
          <path ref={pathRef} d={LINE} fill="none" stroke="#1e1e1e" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <span ref={tipRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 hidden h-5 w-5 rounded-full bg-[#F2A2DC] ring-4 ring-white md:block" />

        {/* 1 · Intro */}
        <div className={`story-in max-w-xl md:w-[38vw] md:max-w-none ${POS}`} style={at(90, 230)}>
          <p className="font-body text-lg text-neutral-500">my resume, the scenic route.</p>
          <h1 className="font-title mt-3 text-[clamp(3rem,6.2vw,6.5rem)] leading-[0.95] tracking-tight text-neutral-900">
            how i got <em className="italic">here.</em>
          </h1>
          <p className="font-body mt-6 max-w-[34ch] text-lg leading-relaxed text-neutral-600">
            the short version. very short. keep scrolling and it moves sideways.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {RESUME_PDF_URL && (
              <a href={RESUME_PDF_URL} target="_blank" rel="noopener noreferrer" className="press font-nav inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-lg text-white hover:bg-neutral-800">
                Download CV ↓
              </a>
            )}
            <a href="#full-resume" className="press font-nav inline-flex items-center gap-2 rounded-full px-6 py-3 text-lg text-neutral-900 ring-1 ring-black/20 hover:bg-white">
              skip to the full resume
            </a>
          </div>
        </div>
        <p className={`font-hand hidden text-2xl text-neutral-700 md:block ${POS}`} style={at(560, 860)}>
          scroll → it goes sideways
        </p>

        {/* 2 · Icesi */}
        <Pic src={ABOUT_PHOTO_URL} label="photo: you" className={`story-in mt-16 h-64 w-52 md:mt-0 md:h-[34vh] md:w-[15vw] ${POS}`} rotate={-4} pos={at(1010, 250)} />
        <div className={`story-in mt-8 max-w-md md:mt-0 md:w-[26vw] ${POS}`} style={at(1300, 300)}>
          <p className="font-body text-lg text-neutral-500">it started with screens and stories.</p>
          <h2 className="font-title mt-2 text-[clamp(2.4rem,4.4vw,4.5rem)] leading-[1] tracking-tight text-neutral-900">
            interactive media, at Icesi.
          </h2>
          <p className="font-body mt-4 text-lg leading-relaxed text-neutral-600">Universidad Icesi, Cali. graduating 2027.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="font-body rounded-full bg-[#F6C6E6] px-3 py-1.5 text-[15px] text-neutral-900">honor roll × 4</span>
            <span className="font-body rounded-full bg-[#E4EDB0] px-3 py-1.5 text-[15px] text-neutral-900">ICFES excellence scholarship</span>
          </div>
        </div>
        <Pic src={STORY_IMAGES.icesi} label="photo: you at Icesi" pos={at(1700, 190)} className={`story-in mt-10 h-48 w-60 md:mt-0 md:h-[22vh] md:w-[13vw] ${POS}`} rotate={5} float={1.2} />

        {/* 3 · Línea de tiempo */}
        <div className={`story-in mt-20 max-w-md md:mt-0 md:w-[28vw] ${POS}`} style={at(2120, 130)}>
          <h2 className="font-title text-[clamp(2.4rem,4.4vw,4.5rem)] leading-[1] tracking-tight text-neutral-900">then it got real.</h2>
          <p className="font-body mt-3 text-lg text-neutral-500">turns out, i like people too.</p>
        </div>
        <div className="mt-10 md:mt-0">
          {STORY_MILESTONES.map((m, i) => (
            <Milestone key={i} m={m} index={i} />
          ))}
        </div>
        <Pic src={STORY_IMAGES.camera} label="img: camera / video" pos={at(3340, 110)} className={`story-in hidden md:block md:h-[18vh] md:w-[10vw] ${POS}`} rotate={-8} float={0.4} />
        <Pic src={STORY_IMAGES.solar} label="img: Ruta Solar" pos={at(3600, 680)} className={`story-in hidden md:block md:h-[20vh] md:w-[12vw] ${POS}`} rotate={6} float={2} />

        {/* 4 · Jack of all trades */}
        <div className={`story-in mt-20 max-w-md text-left md:mt-0 md:w-[30vw] md:text-center ${POS}`} style={at(4350, 300)}>
          <p className="font-body text-lg text-neutral-500">i tinker with a lot of stuff.</p>
          <h2 className="font-title mt-2 text-[clamp(2.6rem,4.8vw,5rem)] leading-[1] tracking-tight text-neutral-900">a jack of all trades</h2>
          <p className="font-body mt-3 text-lg text-neutral-500">a fancy way to say i fall down rabbit holes.</p>
        </div>
        <ul className="mt-8 flex flex-wrap gap-2 md:contents">
          {STORY_TOOLS.map((tool, i) => (
            <li
              key={tool}
              className={`story-in story-float font-body rounded-full bg-white px-4 py-2 text-[15px] text-neutral-900 shadow-[0_10px_25px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/10 ${POS}`}
              style={{ ...at([4100, 4250, 4780, 4920, 4180, 4800][i] ?? 4500, [180, 820, 180, 840, 560, 560][i] ?? 500), '--float-delay': `${i * 0.6}s`, rotate: `${[-6, 4, 5, -4, 3, -5][i] ?? 0}deg` }}
            >
              {tool}
            </li>
          ))}
        </ul>
        <Pic src={STORY_IMAGES.figma} label="img: Figma" pos={at(5010, 330)} className={`story-in hidden md:block md:h-[16vh] md:w-[8vw] ${POS}`} rotate={-10} float={0.8} />
        <Pic src={STORY_IMAGES.code} label="img: keys / laptop" pos={at(4040, 760)} className={`story-in hidden md:block md:h-[16vh] md:w-[9vw] ${POS}`} rotate={8} float={1.6} />

        {/* 5 · AI */}
        <Pic src={STORY_IMAGES.brain} label="img: something AI" pos={at(5180, 220)} className={`story-in mt-20 h-48 w-48 md:mt-0 md:h-[26vh] md:w-[13vw] ${POS}`} rotate={-3} float={0.3} />
        <div className={`story-in mt-8 max-w-md md:mt-0 md:w-[24vw] ${POS}`} style={at(5520, 560)}>
          <h2 className="font-title text-[clamp(2.6rem,4.8vw,5rem)] leading-[1] tracking-tight text-neutral-900">and now, AI.</h2>
          <p className="font-body mt-3 text-lg text-neutral-500">half designer. half “what if?”</p>
          <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-black/10">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#C9DB4B]" />
            <span className="font-body text-[15px] text-neutral-800">AWS Certified AI Practitioner · 2026</span>
          </div>
        </div>
        <Pic src={STORY_IMAGES.aws} label="img: AWS badge" pos={at(5840, 230)} className={`story-in hidden md:block md:h-[16vh] md:w-[9vw] ${POS}`} rotate={7} float={1.1} />

        {/* 6 · Teatro */}
        <div className={`story-in mt-20 max-w-md md:mt-0 md:w-[24vw] ${POS}`} style={at(6080, 160)}>
          <h2 className="font-title text-[clamp(2.6rem,4.8vw,5rem)] leading-[1] tracking-tight text-neutral-900">but a few things have my heart.</h2>
          <p className="font-body mt-3 text-lg text-neutral-500">musical theater at Icesi, and a lot of vocal practice.</p>
          <p className="font-body mt-2 text-lg text-neutral-500">spanish (native) · english (C1)</p>
        </div>
        <Pic src={MICROPHONE_URL} label="microphone" pos={at(6400, 430)} className={`story-in mt-8 h-40 w-40 md:mt-0 md:h-[24vh] md:w-[12vw] ${POS}`} rotate={18} float={0.6} />
        <Pic src={STORY_IMAGES.theater} label="photo: you on stage" pos={at(6680, 200)} className={`story-in mt-8 h-56 w-44 md:mt-0 md:h-[30vh] md:w-[12vw] ${POS}`} rotate={-5} float={1.4} />

        {/* 7 · Proceso + cierre */}
        <div className="hidden md:block">
          {[
            ['notice it.', 7340, 255],
            ['understand it.', 7470, 520],
            ['build it.', 7120, 560],
          ].map(([t, x, y]) => (
            <p key={t} className={`story-in font-body text-lg text-neutral-800 ${POS}`} style={at(x, y)}>{t}</p>
          ))}
          <p className={`story-in font-title text-3xl italic text-neutral-900 ${POS}`} style={at(7290, 420)}>repeat.</p>
        </div>
        <div className={`story-in mt-24 max-w-lg md:mt-0 md:w-[30vw] ${POS}`} style={at(7620, 250)}>
          <p className="font-body text-lg text-neutral-500">enough autobiography.</p>
          <h2 className="font-title mt-2 text-[clamp(2.6rem,4.6vw,4.75rem)] leading-[1] tracking-tight text-neutral-900">
            let’s look at what came out of it.
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/work" className="press font-nav inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-lg text-white hover:bg-neutral-800">
              see the work →
            </Link>
            <a href="#full-resume" className="press font-nav inline-flex items-center gap-2 rounded-full px-6 py-3 text-lg text-neutral-900 ring-1 ring-black/20 hover:bg-white">
              full resume ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
