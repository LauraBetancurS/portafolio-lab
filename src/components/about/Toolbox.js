'use client';

import { useState } from 'react';
import {
  siReact, siNextdotjs, siJavascript, siTypescript, siTailwindcss, siGithub,
  siSupabase, siPython, siFlask, siN8n, siFigma, siFramer,
} from 'simple-icons';
import {
  TOOL_ICON_AWS_URL, TOOL_ICON_PHOTOSHOP_URL, TOOL_ICON_AFTER_EFFECTS_URL,
} from '@/lib/assets';

// Herramientas que usa Laura, como apps en una ventana de Finder.
// - icon: logo de la librería Simple Icons
// - iconUrl: imagen propia (para las que no están en la librería)
// Para agregar una herramienta, añade una línea a esta lista.
const TOOLS = [
  { name: 'Figma', group: 'Design', icon: siFigma },
  { name: 'Photoshop', group: 'Design', iconUrl: TOOL_ICON_PHOTOSHOP_URL },
  { name: 'After Effects', group: 'Design', iconUrl: TOOL_ICON_AFTER_EFFECTS_URL },
  { name: 'Framer', group: 'Design', icon: siFramer },
  { name: 'React', group: 'Code', icon: siReact },
  { name: 'Next.js', group: 'Code', icon: siNextdotjs },
  { name: 'JavaScript', group: 'Code', icon: siJavascript },
  { name: 'TypeScript', group: 'Code', icon: siTypescript },
  { name: 'Tailwind CSS', group: 'Code', icon: siTailwindcss },
  { name: 'GitHub', group: 'Code', icon: siGithub },
  { name: 'Python', group: 'Code', icon: siPython },
  { name: 'Flask', group: 'Code', icon: siFlask },
  { name: 'Supabase', group: 'Cloud and AI', icon: siSupabase },
  { name: 'AWS', group: 'Cloud and AI', iconUrl: TOOL_ICON_AWS_URL },
  { name: 'n8n', group: 'Cloud and AI', icon: siN8n },
];

const GROUPS = ['All', 'Design', 'Code', 'Cloud and AI'];

function ToolIcon({ tool }) {
  if (tool.icon) {
    return (
      <svg viewBox="0 0 24 24" className="h-9 w-9" role="img" aria-hidden="true">
        <path d={tool.icon.path} fill={`#${tool.icon.hex}`} />
      </svg>
    );
  }
  if (tool.iconUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={tool.iconUrl} alt="" className="h-10 w-10 object-contain" />;
  }
  // Ícono genérico de app mientras no haya imagen
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="2" />
      <rect x="13" y="4" width="7" height="7" rx="2" />
      <rect x="4" y="13" width="7" height="7" rx="2" />
      <rect x="13" y="13" width="7" height="7" rx="2" />
    </svg>
  );
}

export default function Toolbox() {
  const [group, setGroup] = useState('All');
  const visible = group === 'All' ? TOOLS : TOOLS.filter(t => t.group === group);

  return (
    <div className="font-body w-full max-w-4xl overflow-hidden rounded-xl border border-neutral-300 bg-[#fbfbfb] text-[13px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]">
      {/* Barra de título */}
      <div className="relative flex items-center border-b border-neutral-200 bg-[#ececec] px-4 py-2.5">
        <div className="flex gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <p className="absolute left-1/2 -translate-x-1/2 font-semibold text-neutral-700">Applications</p>
      </div>

      <div className="grid sm:grid-cols-[170px_1fr]">
        {/* Barra lateral (filtros) */}
        <nav aria-label="Filter tools" className="flex gap-1 overflow-x-auto border-b border-neutral-200 bg-[#f1f1f3] p-2 sm:flex-col sm:border-b-0 sm:border-r sm:p-3">
          <p className="hidden px-2 pb-1 text-[11px] font-semibold text-neutral-400 sm:block">Favorites</p>
          {GROUPS.map(g => (
            <button
              key={g}
              type="button"
              aria-pressed={group === g}
              onClick={() => setGroup(g)}
              className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-left transition-colors ${
                group === g ? 'bg-[#007AFF]/15 font-semibold text-[#007AFF]' : 'text-neutral-700 hover:bg-neutral-200/70'
              }`}
            >
              {g}
            </button>
          ))}
        </nav>

        {/* Íconos */}
        <ul className="grid min-h-[260px] grid-cols-3 content-start gap-x-2 gap-y-5 p-5 sm:grid-cols-4 md:grid-cols-5">
          {visible.map(tool => (
            <li key={tool.name} className="group flex flex-col items-center gap-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
                <ToolIcon tool={tool} />
              </div>
              <span className="text-neutral-800">{tool.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="border-t border-neutral-200 px-4 py-2 text-center text-neutral-500">
        {visible.length} {visible.length === 1 ? 'item' : 'items'}
      </p>
    </div>
  );
}
