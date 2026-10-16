'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { useGSAP } from '@gsap/react';
import { TOOLS, SKILLS } from '@/data/tools';
import ToolIcon from '@/components/mixed/ToolIcon';
import Note from '@/components/mixed/Note';
import { useLang } from '@/i18n/lang';

gsap.registerPlugin(Draggable, InertiaPlugin, useGSAP);

// ─── Ajustes ────────────────────────────────────────────────
const FOLDER_W = 230;
const FOLDER_H = 160;
const CELL_W = 128;   // espacio aproximado de cada ícono/nota
const CELL_H = 104;
// ────────────────────────────────────────────────────────────

// Carpeta "toolbox": al hacer clic se abre y salen volando los íconos de las
// herramientas y notitas con lo que sé hacer (caen hacia abajo y el espacio
// crece solo cuando está abierta). Todo se puede arrastrar y lanzar.
// Clic otra vez en la carpeta → todo vuelve adentro.

// Herramientas que NO salen en la carpeta del inicio (siguen en la lista
// general de src/data/tools.js, que también usa la página About)
const HIDDEN_HERE = ['Tailwind CSS', 'Python', 'Flask', 'Next.js'];
const FOLDER_TOOLS = TOOLS.filter(t => !HIDDEN_HERE.includes(t.name));

// Mezcla herramientas y notas en un orden fijo (siempre igual)
const ITEMS = (() => {
  const tools = FOLDER_TOOLS.map(t => ({ kind: 'tool', key: t.name, tool: t }));
  const notes = SKILLS.map(s => ({ kind: 'note', key: s.text, ...s }));
  const out = [];
  let ti = 0;
  let ni = 0;
  while (ti < tools.length || ni < notes.length) {
    if (ti < tools.length) out.push(tools[ti++]);
    if (ti < tools.length) out.push(tools[ti++]);
    if (ni < notes.length) out.push(notes[ni++]);
  }
  return out;
})();

// Número "aleatorio" fijo por posición (para que no cambie entre visitas)
const seeded = i => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export default function ToolFolder() {
  const areaRef = useRef(null);
  const itemRefs = useRef([]);
  const draggables = useRef([]);
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const [size, setSize] = useState({ w: 900, h: 560, closedH: FOLDER_H + 40 });

  // El área se adapta al ancho: en celular es más alta para que quepan todos
  useEffect(() => {
    const el = areaRef.current;
    const measure = () => {
      const w = el.offsetWidth;
      const cols = Math.max(2, Math.floor((w - 20) / CELL_W));
      const rows = Math.ceil(ITEMS.length / cols);
      setSize({ w, h: rows * CELL_H + FOLDER_H + 70, closedH: FOLDER_H + 40 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Dónde cae cada cosa cuando sale de la carpeta
  const targets = () => {
    const { w } = size;
    const cols = Math.max(2, Math.floor((w - 20) / CELL_W));
    const cellW = (w - 20) / cols;
    return ITEMS.map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        x: 10 + col * cellW + cellW / 2 + (seeded(i) - 0.5) * 34,
        y: FOLDER_H + 50 + row * CELL_H + CELL_H / 2 + (seeded(i + 7) - 0.5) * 26,
        r: (seeded(i + 3) - 0.5) * 16,
      };
    });
  };

  const folderCenter = () => ({ x: size.w / 2, y: FOLDER_H * 0.6 });

  // Arrastrar y lanzar (con inercia), siempre dentro del área
  useGSAP(
    () => {
      draggables.current = itemRefs.current.filter(Boolean).flatMap(el =>
        Draggable.create(el, {
          type: 'x,y',
          bounds: areaRef.current,
          inertia: true,
          zIndexBoost: true,
          onPress() {
            gsap.to(this.target, { scale: 1.08, rotate: 0, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
          },
          onRelease() {
            gsap.to(this.target, { scale: 1, rotate: (Math.random() - 0.5) * 14, duration: 0.35, ease: 'back.out(2)' });
          },
        })
      );
      draggables.current.forEach(d => d.disable());
      return () => draggables.current.forEach(d => d.kill());
    },
    { scope: areaRef }
  );

  // Coloca todo dentro de la carpeta (cerrada) cuando cambia el tamaño
  useEffect(() => {
    if (open) return;
    const c = folderCenter();
    itemRefs.current.forEach(el => {
      if (!el) return;
      gsap.set(el, { x: c.x - el.offsetWidth / 2, y: c.y - el.offsetHeight / 2, scale: 0.2, opacity: 0, rotate: 0 });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w, size.h]);

  const toggle = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const c = folderCenter();
    const els = itemRefs.current.filter(Boolean);
    if (!open) {
      const t = targets();
      els.forEach((el, i) => {
        gsap.fromTo(
          el,
          { x: c.x - el.offsetWidth / 2, y: c.y - el.offsetHeight / 2, scale: 0.2, opacity: 0, rotate: 0 },
          {
            x: t[i].x - el.offsetWidth / 2,
            y: t[i].y - el.offsetHeight / 2,
            scale: 1,
            opacity: 1,
            rotate: t[i].r,
            duration: reduce ? 0 : 0.75,
            delay: reduce ? 0 : 0.08 + i * 0.03,
            ease: 'back.out(1.5)',
            overwrite: true,
          }
        );
      });
      draggables.current.forEach(d => d.enable());
    } else {
      draggables.current.forEach(d => d.disable());
      els.forEach((el, i) => {
        gsap.to(el, {
          x: c.x - el.offsetWidth / 2,
          y: c.y - el.offsetHeight / 2,
          scale: 0.2,
          opacity: 0,
          rotate: 0,
          duration: reduce ? 0 : 0.45,
          delay: reduce ? 0 : (els.length - i) * 0.015,
          ease: 'power2.in',
          overwrite: true,
        });
      });
    }
    setOpen(o => !o);
  };

  return (
    <div className="relative">
      <div
        ref={areaRef}
        className="relative w-full select-none transition-[height] duration-500 ease-[var(--ease-out)]"
        style={{ height: open ? size.h : size.closedH }}
      >
        {/* Íconos y notas (se pueden arrastrar) */}
        {ITEMS.map((item, i) => (
          <div
            key={item.key}
            ref={el => { itemRefs.current[i] = el; }}
            className="absolute left-0 top-0 z-[2] cursor-grab opacity-0 will-change-transform active:cursor-grabbing"
            aria-hidden={!open}
          >
            {item.kind === 'tool' ? (
              <div className="flex w-[84px] flex-col items-center gap-1.5 rounded-2xl bg-white px-2 pb-2 pt-3 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.4)] ring-1 ring-black/5">
                <ToolIcon tool={item.tool} className="h-9 w-9" />
                <span className="font-body w-full truncate text-center text-[11px] text-neutral-600">{item.tool.name}</span>
              </div>
            ) : (
              <div
                className="flex h-[86px] w-[112px] items-center justify-center p-2 text-center shadow-[0_14px_26px_-14px_rgba(0,0,0,0.4)]"
                style={{ backgroundColor: item.color }}
              >
                <span className="font-hand text-[1.35rem] leading-[1.05] text-neutral-900">{t(item.text, item.es)}</span>
              </div>
            )}
          </div>
        ))}

        {/* La carpeta */}
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label={open ? t('Close the toolbox', 'Cerrar la caja de herramientas') : t('Open the toolbox to see my tools', 'Abrir la caja para ver mis herramientas')}
          className="tool-folder group absolute left-1/2 top-0 z-[3] -translate-x-1/2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
          data-open={open ? '' : undefined}
          style={{ width: FOLDER_W, height: FOLDER_H + 16 }}
        >
          <span aria-hidden="true" className="tool-folder__back" />
          <span aria-hidden="true" className="tool-folder__paper tool-folder__paper--1" />
          <span aria-hidden="true" className="tool-folder__paper tool-folder__paper--2" />
          <span aria-hidden="true" className="tool-folder__front">
            <span className="font-hand text-2xl leading-none text-neutral-900">{t('toolbox', 'herramientas')}</span>
            <span className="font-body mt-1 text-xs text-neutral-800/70">
              {open
                ? t('click to put them back', 'clic para guardarlas')
                : t(`${FOLDER_TOOLS.length} tools · ${SKILLS.length} skills`, `${FOLDER_TOOLS.length} herramientas · ${SKILLS.length} habilidades`)}
            </span>
          </span>
        </button>
      </div>

      <Note
        arrow="down-right"
        rotate={-5}
        className="absolute left-[calc(50%-300px)] top-16 hidden md:flex"
      >
        {open ? t('drag & throw them!', '¡arrástralas y lánzalas!') : t('click the folder', 'haz clic en la carpeta')}
      </Note>
    </div>
  );
}
