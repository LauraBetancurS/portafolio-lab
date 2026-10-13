'use client';

import { useState } from 'react';

// "Traductor" de computadora a humano: lo que hace Laura, en broma.
const PAIRS = [
  {
    computer: 'Error: user_flow.step3 is undefined',
    human: 'People get lost on step three. Let’s redesign it.',
  },
  {
    computer: 'Bounce rate: 78% on /checkout',
    human: 'The checkout feels scary. We can make it calmer.',
  },
  {
    computer: 'Requirements.docx (v14_FINAL_final)',
    human: 'Here’s a prototype you can click instead.',
  },
  {
    computer: 'AI model accuracy: 0.92',
    human: 'It’s usually right, so the interface should say when it isn’t.',
  },
];

export default function Translator() {
  const [index, setIndex] = useState(0);
  const pair = PAIRS[index];

  return (
    <div className="font-body w-full max-w-3xl overflow-hidden text-left rounded-2xl border border-neutral-300 bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)]">
      <div className="grid md:grid-cols-2">
        <div className="border-b border-neutral-200 p-6 md:border-b-0 md:border-r">
          <p className="mb-3 text-sm font-semibold text-neutral-500">Computer</p>
          <p key={`c${index}`} className="animate-word-in font-mono text-[15px] leading-relaxed text-neutral-800">
            {pair.computer}
          </p>
        </div>
        <div className="bg-[#007AFF]/[0.06] p-6">
          <p className="mb-3 text-sm font-semibold text-[#007AFF]">Human</p>
          <p key={`h${index}`} className="animate-word-in font-title text-2xl leading-snug text-neutral-900">
            {pair.human}
          </p>
        </div>
      </div>
      <div className="flex justify-end border-t border-neutral-200 px-4 py-3">
        <button
          type="button"
          onClick={() => setIndex(i => (i + 1) % PAIRS.length)}
          className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          Translate another
        </button>
      </div>
    </div>
  );
}
