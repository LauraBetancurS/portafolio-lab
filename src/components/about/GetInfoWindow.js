'use client';

import { useState } from 'react';
import { LOGO_URL } from '@/lib/assets';

// Ventana "Obtener información" de macOS, pero sobre Laura.
// Cada sección se abre y cierra con su triángulo, como en Finder.

const TAGS = [
  { label: 'UX research', color: '#E8603C' },
  { label: 'UI design', color: '#F2A2DC' },
  { label: 'Front-end', color: '#A9D6F5' },
  { label: 'AI products', color: '#C9DB4B' },
  { label: 'Data', color: '#DB6A8C' },
];

function Row({ label, children }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-3 py-1">
      <dt className="text-right text-neutral-500">{label}:</dt>
      <dd className="text-neutral-900">{children}</dd>
    </div>
  );
}

function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-t border-neutral-200 px-5 py-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-2 py-1 text-left font-semibold text-neutral-800"
      >
        <span
          aria-hidden="true"
          className={`inline-block text-[10px] text-neutral-500 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        >
          ▶
        </span>
        {title}
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="pb-2 pt-1">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function GetInfoWindow() {
  return (
    <div className="font-body w-full max-w-[520px] overflow-hidden rounded-xl border border-neutral-300 bg-[#fbfbfb] text-[13px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]">
      {/* Barra de título */}
      <div className="relative flex items-center border-b border-neutral-200 bg-[#ececec] px-4 py-2.5">
        <div className="flex gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <p className="absolute left-1/2 -translate-x-1/2 font-semibold text-neutral-700">
          Laura Betancur Info
        </p>
      </div>

      {/* Encabezado con ícono */}
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_URL} alt="" className="h-10 w-auto" />
        </div>
        <div>
          <p className="text-base font-semibold text-neutral-900">Laura_Betancur.app</p>
          <p className="text-neutral-500">Designer and developer, always updating</p>
        </div>
      </div>

      <Section title="General">
        <dl>
          <Row label="Kind">Product designer and front-end developer</Row>
          <Row label="Where">Cali, Colombia</Row>
          <Row label="Studying">Interactive Media Design at Universidad Icesi</Row>
          <Row label="Speaks">Spanish, English, and JavaScript</Row>
          <Row label="Also known as">rabbit</Row>
        </dl>
      </Section>

      <Section title="Tags">
        <ul className="flex flex-wrap gap-x-4 gap-y-2 pl-1">
          {TAGS.map(tag => (
            <li key={tag.label} className="flex items-center gap-1.5 text-neutral-800">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
              {tag.label}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Comments">
        <p className="rounded-md border border-neutral-200 bg-white px-3 py-2 leading-relaxed text-neutral-800">
          Computer-to-human translator. I sit between design and strategy, and I like
          turning complicated systems into products that feel human and personal.
        </p>
      </Section>

      <Section title="More Info" defaultOpen={false}>
        <dl>
          <Row label="Honor roll">2023, 2024, 2025 and 2026</Row>
          <Row label="Scholarship">Beca de Excelencia Académica</Row>
          <Row label="Last opened">Right now</Row>
        </dl>
      </Section>
    </div>
  );
}
