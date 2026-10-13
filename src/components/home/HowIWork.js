'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useGSAP } from '@gsap/react';
import FigjamComment from '@/components/mixed/FigjamComment';

gsap.registerPlugin(Draggable, useGSAP);

// Tres "sections" de FigJam con sticky notes que se pueden arrastrar (en computador).
const SECTIONS = [
  {
    title: 'Research',
    tab: '#F2A2DC',
    intro: 'I start by listening. Who is this for, and where do they get stuck?',
    notes: ['User interviews', 'Journey maps', 'Usability tests', 'Foresight'],
    noteColor: '#F6C6E6',
  },
  {
    title: 'Design',
    tab: '#A9D6F5',
    intro: 'Then I turn findings into flows, interfaces and prototypes people can click.',
    notes: ['Wireframes', 'UI systems', 'Prototypes', 'Motion'],
    noteColor: '#CDE8F8',
  },
  {
    title: 'Build',
    tab: '#C9DB4B',
    intro: 'And I ship it: real code, real data, and AI where it actually helps.',
    notes: ['React + Next.js', 'Supabase', 'n8n automations', 'AI features'],
    noteColor: '#E4EDB0',
  },
];

const TILTS = [-4, 3, -2, 5];

export default function HowIWork() {
  const ref = useRef(null);

  useGSAP(
    () => {
      // Arrastrar solo con mouse (en celular estorbaría el scroll)
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const notes = gsap.utils.toArray('.drag-note');
      let z = 10;
      notes.forEach(note => {
        Draggable.create(note, {
          type: 'x,y',
          bounds: note.closest('.figjam-section'),
          onPress() {
            z += 1;
            gsap.set(this.target, { zIndex: z });
            gsap.to(this.target, { scale: 1.06, rotate: 0, boxShadow: '0 22px 40px -14px rgba(0,0,0,0.35)', duration: 0.2 });
          },
          onRelease() {
            gsap.to(this.target, {
              scale: 1,
              rotate: gsap.utils.random(-4, 4),
              boxShadow: '0 10px 20px -12px rgba(0,0,0,0.3)',
              duration: 0.35,
              ease: 'back.out(2)',
            });
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="relative">
      <FigjamComment
        className="-top-12 right-2 md:-top-14 md:right-10"
        side="left"
        text="Psst… the sticky notes move. Drag them around!"
      />
      <ul className="grid gap-6 lg:grid-cols-3">
        {SECTIONS.map(section => (
          <li
            key={section.title}
            className="figjam-section relative min-h-[360px] rounded-2xl border border-black/10 bg-white/70 p-6 pt-12 backdrop-blur-sm"
          >
            {/* Pestaña con el nombre, como las sections de FigJam */}
            <span
              className="font-body absolute -top-3.5 left-5 rounded-lg px-3 py-1 text-sm font-semibold text-neutral-900 shadow-sm"
              style={{ backgroundColor: section.tab }}
            >
              {section.title}
            </span>
            <p className="font-body max-w-[32ch] text-[17px] leading-relaxed text-neutral-700">{section.intro}</p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {section.notes.map((note, i) => (
                <div
                  key={note}
                  className="drag-note font-nav relative flex aspect-square cursor-grab items-center justify-center p-3 text-center text-lg leading-tight text-neutral-900 shadow-[0_10px_20px_-12px_rgba(0,0,0,0.3)] active:cursor-grabbing"
                  style={{ backgroundColor: section.noteColor, transform: `rotate(${TILTS[i % TILTS.length]}deg)` }}
                >
                  {note}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
