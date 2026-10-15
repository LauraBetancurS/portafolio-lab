'use client';

import { useState } from 'react';
import { TOOLS } from '@/data/tools';
import ToolIcon from '@/components/mixed/ToolIcon';

// Herramientas que usa Laura, como apps en una ventana de Finder.
// La lista está en src/data/tools.js.
const GROUPS = ['All', 'Design', 'Code', 'Cloud and AI'];

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
