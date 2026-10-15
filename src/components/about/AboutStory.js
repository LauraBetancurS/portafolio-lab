'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MICROPHONE_URL } from '@/lib/assets';
import { STORY_IMAGES, STORY_MILESTONES, STORY_TRANSLATIONS } from '@/data/story';
import { TOOLS } from '@/data/tools';
import ToolIcon from '@/components/mixed/ToolIcon';
import ContactLink from '@/components/layout/ContactLink';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Cómo funciona ──────────────────────────────────────────
// En computador la sección se queda pegada y, al bajar con el scroll, avanza
// hacia los lados. Una línea negra se va dibujando por todo el recorrido.
// Va de lo personal (primero) a lo profesional (después).
// Todo se ubica con coordenadas del "lienzo": 1000 unidades = una pantalla
// de ancho (100vw) y 1000 de alto (100vh). El lienzo mide PANELS pantallas.
// En celular es una página normal hacia abajo (sin línea).
// Los textos, hitos e imágenes se editan en src/data/story.js.
// ────────────────────────────────────────────────────────────
const PANELS = 9;
const W = PANELS * 1000;

// Recorrido de la línea (en unidades del lienzo)
const LINE = [
  'M 520 380',
  'C 600 560, 820 760, 1000 720',
  'S 1250 640, 1400 700',
  'C 1480 740, 1520 860, 1430 880',
  'C 1330 900, 1330 760, 1450 740',
  'C 1600 700, 1800 760, 1950 720',
  'S 2200 300, 2380 260',
  'S 2600 300, 2680 520',
  'S 2800 760, 2950 740',
  'S 3200 620, 3350 500',
  'S 3500 280, 3620 320',
  'S 3800 520, 3950 560',
  'S 4200 560, 4350 620',
  'S 4600 700, 4800 640',
  'S 4950 480, 5050 470',
  'S 5400 450, 5700 470',
  'S 6100 500, 6400 470',
  'S 6700 440, 6950 480',
  'S 7300 620, 7500 650',
  'S 7800 600, 7950 560',
  'C 8100 520, 8080 250, 8250 230',
  'C 8420 210, 8480 520, 8320 580',
  'C 8200 620, 8220 760, 8450 740',
  'S 8640 640, 8620 560',
].join(' ');

// x de cada hito sobre la línea
const MILESTONE_X = [5150, 5450, 5750, 6050, 6350, 6650];

// Garabato del inicio ("un mapa casi exacto de todo lo que tengo en la cabeza"):
// una línea enredada, siempre igual
const SCRIBBLE = (() => {
  let seed = 11;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  // puntos al azar (más densos en el centro) unidos con curvas suaves
  const pts = Array.from({ length: 110 }, () => {
    const a = rnd() * Math.PI * 2;
    const r = Math.pow(rnd(), 0.7) * 1;
    return [300 + Math.cos(a) * r * 270, 250 + Math.sin(a) * r * 200];
  });
  let d = `M ${pts[0][0].toFixed(0)} ${pts[0][1].toFixed(0)}`;
  for (let i = 1; i < pts.length - 2; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const [x3, y3] = pts[i + 2];
    // Catmull-Rom → Bézier
    const c1x = x1 + (x2 - x0) / 6;
    const c1y = y1 + (y2 - y0) / 6;
    const c2x = x2 - (x3 - x1) / 6;
    const c2y = y2 - (y3 - y1) / 6;
    d += ` C ${c1x.toFixed(0)} ${c1y.toFixed(0)}, ${c2x.toFixed(0)} ${c2y.toFixed(0)}, ${x2.toFixed(0)} ${y2.toFixed(0)}`;
  }
  return d;
})();

// Posición en el lienzo → estilo (solo se aplica en pantallas md o más)
const at = (x, y) => ({ '--l': `${x / 10}vw`, '--t': `${y / 10}vh` });
const POS = 'md:absolute md:left-[var(--l)] md:top-[var(--t)]';

const H2 = 'font-title text-[clamp(2.4rem,4.6vw,4.75rem)] leading-[1] tracking-tight text-neutral-900';
const SUB = 'font-body mt-3 text-lg leading-relaxed text-neutral-500';

// Imagen real o recuadro punteado con la descripción de la foto que falta
function Pic({ src, label, className = '', rotate = 0, float = 0, pos, photo = false }) {
  return (
    <div className={`story-float ${className}`} style={{ ...pos, '--float-delay': `${float}s`, rotate: `${rotate}deg` }}>
      {src && photo ? (
        // foto real: marco blanco tipo polaroid con un pedazo de cinta
        <figure className="relative h-full w-full bg-white p-2 pb-8 shadow-[0_24px_40px_-18px_rgba(0,0,0,0.45)]">
          <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 bg-[#F2A2DC]/70" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={label} draggable={false} loading="lazy" className="h-full w-full object-cover" />
        </figure>
      ) : src ? (
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
  const up = index % 2 === 1; // alterna: texto abajo / arriba de la línea
  return (
    <div
      data-milestone={index}
      className={`story-in relative max-md:border-l-2 max-md:border-black/15 max-md:pb-8 max-md:pl-6 md:absolute md:w-[clamp(220px,17vw,290px)] md:text-center ${
        up ? 'md:-translate-x-1/2 md:-translate-y-full' : 'md:-translate-x-1/2'
      }`}
    >
      <span aria-hidden="true" className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-neutral-900 md:hidden" />
      {!up && (
        <span aria-hidden="true" className="mx-auto hidden flex-col items-center md:flex">
          <span className="h-3 w-3 -translate-y-1/2 rounded-full bg-neutral-900" />
          <span className="h-20 w-px bg-neutral-400" />
        </span>
      )}
      <p className="font-title text-xl leading-snug text-neutral-900">{m.title}</p>
      <p className="font-body mt-1.5 text-[15px] leading-relaxed text-neutral-600">{m.text}</p>
      <p className="font-body mt-1.5 text-sm text-neutral-400">{m.year}</p>
      {up && (
        <span aria-hidden="true" className="mx-auto mt-3 hidden flex-col items-center md:flex">
          <span className="h-20 w-px bg-neutral-400" />
          <span className="h-3 w-3 translate-y-1/2 rounded-full bg-neutral-900" />
        </span>
      )}
    </div>
  );
}

// Herramientas que salen flotando en "i don't know how to leave things alone"
const FLOAT_TOOLS = ['Figma', 'React', 'Next.js', 'Supabase', 'n8n', 'Framer', 'GitHub', 'TypeScript'];
const TOOL_SPOTS = [
  [7320, 470, -6], [7560, 380, 5], [7800, 470, -4], [7400, 700, 4],
  [7650, 620, -5], [7880, 760, 6], [7200, 820, -3], [7560, 860, 3],
];

export default function AboutStory() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const pathRef = useRef(null);
  const tipRef = useRef(null);
  const scribbleRef = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // El garabato se dibuja solo al aparecer
      const scribble = scribbleRef.current;
      if (scribble && !reduce) {
        const sl = scribble.getTotalLength();
        gsap.fromTo(
          scribble,
          { strokeDasharray: sl, strokeDashoffset: sl },
          { strokeDashoffset: 0, duration: 4, ease: 'power1.inOut', scrollTrigger: { trigger: scribble, start: 'top 85%', once: true } }
        );
      }

      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        const track = trackRef.current;
        const path = pathRef.current;
        const len = path.getTotalLength();

        // Ubica cada hito justo encima de la línea, en su x
        const samples = Array.from({ length: 800 }, (_, i) => path.getPointAtLength((len * i) / 799));
        gsap.utils.toArray('[data-milestone]', track).forEach(el => {
          const x = MILESTONE_X[Number(el.dataset.milestone)];
          const pt = samples.reduce((best, p) => (Math.abs(p.x - x) < Math.abs(best.x - x) ? p : best), samples[0]);
          el.style.left = `${pt.x / 10}vw`;
          el.style.top = `${pt.y / 10}vh`;
        });

        // La línea se dibuja con el scroll; un punto rosado va en la punta.
        // La punta va siempre a ~60% del ancho de la pantalla.
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        let maxX = -Infinity;
        const reach = samples.map((pt, i) => {
          maxX = Math.max(maxX, pt.x);
          return { x: maxX, l: (len * i) / (samples.length - 1) };
        });
        const lengthAtX = x => {
          const hit = reach.find(r => r.x >= x);
          return hit ? hit.l : len;
        };
        const draw = p => {
          const l = lengthAtX(p * (W - 1000) + 600);
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
        if (!reduce) {
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
    <section ref={sectionRef} className="relative md:h-screen md:overflow-hidden" aria-label="The anatomy of a curious designer">
      <div ref={trackRef} className="relative px-6 pb-16 pt-16 md:h-screen md:w-[900vw] md:p-0 md:will-change-transform">
        {/* La línea (solo computador) */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" viewBox={`0 0 ${W} 1000`} preserveAspectRatio="none">
          <path ref={pathRef} d={LINE} fill="none" stroke="#1e1e1e" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span ref={tipRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 hidden h-5 w-5 rounded-full bg-[#F2A2DC] ring-4 ring-white md:block" />

        {/* ── LO PERSONAL ─────────────────────────────── */}

        {/* 1 · Garabato + título */}
        <div className={`relative mx-auto w-full max-w-md md:mx-0 md:h-[54vh] md:w-[36vw] md:max-w-none ${POS}`} style={at(300, 60)}>
          <svg viewBox="0 0 600 500" className="h-full w-full" aria-hidden="true">
            <path ref={scribbleRef} d={SCRIBBLE} fill="none" stroke="#1e1e1e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className={`font-hand mt-2 text-2xl leading-tight text-neutral-600 md:mt-0 md:w-[18vw] ${POS}`} style={at(700, 130)}>
          ↙ an almost accurate map of everything on my mind.
        </p>
        <div className={`mt-10 md:mt-0 md:w-[44vw] ${POS}`} style={at(40, 640)}>
          <h2 className="font-title text-[clamp(2.8rem,5.6vw,6rem)] leading-[0.95] tracking-tight text-neutral-900">
            the anatomy of a <em className="italic">curious designer.</em>
          </h2>
          <p className="font-body mt-4 text-lg text-neutral-500">or should i say, welcome to my head :)</p>
        </div>
        <p className={`font-hand hidden text-2xl text-neutral-700 md:block ${POS}`} style={at(720, 880)}>
          keep scrolling → it goes sideways
        </p>

        {/* 2 · Jack of all trades (cosas personales) */}
        <div className={`story-in mt-24 max-w-md md:mt-0 md:w-[32vw] md:max-w-none md:text-center ${POS}`} style={at(1340, 380)}>
          <p className="font-body text-lg text-neutral-500">i tinker with a lot of stuff.</p>
          <h2 className={`${H2} mt-2`}>a jack of all trades</h2>
          <p className={SUB}>a fancy way to say i fall down rabbit holes.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:contents">
          <Pic src={STORY_IMAGES.games} label="img: indie games (Life is Strange?)" className={`story-in h-40 md:h-[22vh] md:w-[12vw] ${POS}`} rotate={-6} float={0.2} pos={at(1100, 120)} />
          <Pic src={STORY_IMAGES.books} label="img: Camus & Pessoa" className={`story-in h-40 md:h-[22vh] md:w-[11vw] ${POS}`} rotate={5} float={1.1} pos={at(1720, 110)} />
          <Pic src={STORY_IMAGES.cinema} label="img: Latin American cinema" className={`story-in h-40 md:h-[20vh] md:w-[12vw] ${POS}`} rotate={4} float={0.7} pos={at(1060, 690)} />
          <Pic src={STORY_IMAGES.dinosaur} label="img: a dinosaur, obviously" className={`story-in h-40 md:h-[20vh] md:w-[11vw] ${POS}`} rotate={-4} float={1.6} pos={at(1760, 680)} />
        </div>

        {/* 3 · Teatro y canto */}
        <div className={`story-in mt-24 max-w-md md:mt-0 md:w-[24vw] md:max-w-none ${POS}`} style={at(2720, 110)}>
          <h2 className={H2}>but a few things have my heart.</h2>
          <p className={SUB}>musical theater at Icesi, and a lot of vocal practice.</p>
          <p className="font-body mt-2 text-lg text-neutral-500">speaks spanish, english (C1) and javascript.</p>
        </div>
        <Pic src={MICROPHONE_URL} label="microphone" className={`story-in mt-8 h-36 w-36 md:mt-0 md:h-[22vh] md:w-[10vw] ${POS}`} rotate={20} float={0.5} pos={at(2230, 290)} />
        <Pic src={STORY_IMAGES.stage} photo label="Lau singing" className={`story-in mt-6 h-72 w-56 md:mt-0 md:h-[38vh] md:w-[14vw] ${POS}`} rotate={-5} float={1.3} pos={at(2440, 545)} />
        <p className={`story-in font-hand mt-6 text-2xl text-neutral-700 md:mt-0 ${POS}`} style={at(2760, 560)}>
          also known as “rabbit” 🐰
        </p>

        {/* 4 · La ficción */}
        <Pic src={STORY_IMAGES.fiction} label="img: anime, fanfics & visual novels" className={`story-in mt-24 h-48 md:mt-0 md:h-[24vh] md:w-[12vw] ${POS}`} rotate={-4} float={0.9} pos={at(3020, 560)} />
        <div className={`story-in mt-8 max-w-md md:mt-0 md:w-[20vw] ${POS}`} style={at(3170, 600)}>
          <h3 className="font-title text-[clamp(2rem,3vw,3rem)] leading-[1.05] tracking-tight text-neutral-900">fiction came first.</h3>
          <p className={SUB}>stories raised me. Deku still reminds me not to give up.</p>
        </div>

        {/* ── LO PROFESIONAL ──────────────────────────── */}

        {/* 5 · La gente */}
        <Pic src={STORY_IMAGES.research} label="img: sticky notes from interviews" className={`story-in mt-24 h-48 md:mt-0 md:h-[24vh] md:w-[12vw] ${POS}`} rotate={5} float={0.4} pos={at(3480, 90)} />
        <div className={`story-in mt-8 max-w-md md:mt-0 md:w-[22vw] ${POS}`} style={at(3660, 130)}>
          <h3 className="font-title text-[clamp(2rem,3vw,3rem)] leading-[1.05] tracking-tight text-neutral-900">turns out, i like people too.</h3>
          <p className={SUB}>i’m a computer-to-human translator:</p>
          <ul className="mt-4 space-y-2">
            {STORY_TRANSLATIONS.map(t => (
              <li key={t.computer} className="font-body rounded-xl bg-white px-3 py-2 text-[14px] leading-snug ring-1 ring-black/10">
                <span className="block font-mono text-[13px] text-neutral-400 line-through decoration-[#E8603C]">{t.computer}</span>
                <span className="text-neutral-900">→ {t.human}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 6 · IA */}
        <Pic src={STORY_IMAGES.ai} label="a brain made of circuits, for AI" className={`story-in mt-24 h-48 w-48 md:mt-0 md:h-[26vh] md:w-[13vw] ${POS}`} rotate={-3} float={0.3} pos={at(4180, 470)} />
        <div className={`story-in mt-8 max-w-md md:mt-0 md:w-[22vw] ${POS}`} style={at(4520, 180)}>
          <h2 className={H2}>and now, AI.</h2>
          <p className={SUB}>half designer. half “what if?”</p>
          <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-black/10">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#C9DB4B]" />
            <span className="font-body text-[15px] text-neutral-800">AWS Certified AI Practitioner · 2026</span>
          </div>
        </div>
        <Pic src={STORY_IMAGES.aws} label="img: AWS badge" className={`story-in hidden md:block md:h-[16vh] md:w-[9vw] ${POS}`} rotate={7} float={1.1} pos={at(4780, 700)} />

        {/* 7 · Línea de tiempo */}
        <Pic src={STORY_IMAGES.honorRoll} photo label="Lau on the honor roll" className={`story-in mt-24 h-64 w-52 md:mt-0 md:h-[29vh] md:w-[12vw] ${POS}`} rotate={4} float={0.8} pos={at(5040, 125)} />
        <div className="mt-12 md:mt-0">
          {STORY_MILESTONES.map((m, i) => (
            <Milestone key={i} m={m} index={i} />
          ))}
        </div>
        <p className={`story-in font-title mt-6 text-[clamp(2rem,3.8vw,4rem)] leading-[1.05] tracking-tight md:mt-0 md:whitespace-nowrap ${POS}`} style={at(5250, 840)}>
          somehow, <span className="text-neutral-400">i keep ending up…</span>
        </p>
        <p className={`story-in font-title text-[clamp(2rem,3.8vw,4rem)] leading-[1.05] tracking-tight md:whitespace-nowrap ${POS}`} style={at(6250, 840)}>
          <span className="text-neutral-400">leading the</span> research.
        </p>

        {/* 8 · Herramientas */}
        <div className={`story-in mt-24 max-w-lg md:mt-0 md:w-[34vw] ${POS}`} style={at(7080, 90)}>
          <h2 className={H2}>
            apparently, <span className="text-neutral-400">i don’t know how to leave things alone.</span>
          </h2>
          <p className={SUB}>so i learned the tools to build them myself.</p>
        </div>
        <ul className="mt-8 flex flex-wrap gap-2 md:contents">
          {FLOAT_TOOLS.map((name, i) => {
            const tool = TOOLS.find(t => t.name === name);
            if (!tool) return null;
            const [x, y, r] = TOOL_SPOTS[i];
            return (
              <li
                key={name}
                className={`story-in story-float flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-[0_12px_28px_-14px_rgba(0,0,0,0.4)] ring-1 ring-black/5 ${POS}`}
                style={{ ...at(x, y), '--float-delay': `${i * 0.5}s`, rotate: `${r}deg` }}
              >
                <ToolIcon tool={tool} className="h-6 w-6" />
                <span className="font-body text-[15px] text-neutral-800">{name}</span>
              </li>
            );
          })}
        </ul>

        {/* 9 · Proceso + cierre */}
        <div className="hidden md:block">
          {[
            ['notice it.', 8210, 175],
            ['understand it.', 8450, 420],
            ['build it.', 8040, 470],
          ].map(([t, x, y]) => (
            <p key={t} className={`story-in font-body text-lg text-neutral-800 ${POS}`} style={at(x, y)}>{t}</p>
          ))}
          <p className={`story-in font-title text-3xl italic text-neutral-900 ${POS}`} style={at(8210, 360)}>repeat.</p>
        </div>
        <div className={`story-in mt-24 max-w-lg md:mt-0 md:w-[28vw] ${POS}`} style={at(8640, 230)}>
          <p className="font-body text-lg text-neutral-500">enough autobiography.</p>
          <h2 className={`${H2} mt-2`}>let’s look at what came out of it.</h2>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/work" className="press font-nav inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-lg text-white hover:bg-neutral-800">
              see the work →
            </Link>
            <ContactLink className="press font-nav inline-flex items-center gap-2 rounded-full px-6 py-3 text-lg text-neutral-900 ring-1 ring-black/20 hover:bg-white">
              let’s talk
            </ContactLink>
          </div>
        </div>
      </div>
    </section>
  );
}
