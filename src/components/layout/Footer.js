'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { LOGO_URL } from '@/lib/assets';
import { CONTACTS } from '@/data/contact';


function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* el navegador no permitió copiar */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className="relative z-10 inline-flex items-center gap-1.5 rounded-md p-1 text-neutral-500 transition-colors hover:text-white"
    >
      {copied ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9DB4B" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm text-[#C9DB4B]">Copied</span>
        </>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V6a2 2 0 0 1 2-2h9" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

function ContactCard({ contact }) {
  const external = contact.href.startsWith('http');
  return (
    <li className="press group relative rounded-xl bg-white/[0.06] px-5 py-2.5 hover:bg-white/[0.1]">
      <p className="flex items-center gap-2 text-sm text-neutral-400">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: contact.dot }} aria-hidden="true" />
        {contact.label}
      </p>
      <div className="mt-0.5 flex items-center gap-2">
        {/* El enlace cubre toda la tarjeta; el botón de copiar queda encima */}
        <a
          href={contact.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="text-base text-white after:absolute after:inset-0 after:rounded-xl after:content-[''] md:text-lg"
        >
          {contact.value}
        </a>
        <CopyButton text={contact.copy} label={contact.label} />
      </div>
      <svg
        className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500 transition duration-200 group-hover:-translate-y-[60%] group-hover:translate-x-0.5 group-hover:text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </li>
  );
}

// Año actual, calculado en el navegador (Next no permite usar la fecha
// durante el prerender, porque quedaría congelada).
const noop = () => () => {};
function useCurrentYear() {
  return useSyncExternalStore(noop, () => new Date().getFullYear(), () => null);
}

export default function Footer() {
  const year = useCurrentYear();

  return (
    <footer id="contact" className="font-body scroll-mt-20 bg-black text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 pb-6 pt-10 md:px-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-title text-4xl leading-[1.1] md:text-5xl">
            Thanks for stopping by.
            <br />
            <span className="text-[#F2A2DC]">Say hi!</span>
          </h2>
          <p className="mt-3 max-w-[44ch] leading-relaxed text-neutral-400">
            I’m open to internships, freelance projects and good conversations about design, code and AI.
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          {CONTACTS.map(contact => (
            <ContactCard key={contact.label} contact={contact} />
          ))}
        </ul>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/10 px-6 py-4 text-sm md:flex-row md:items-center md:justify-between md:px-12">
        <Link href="/" aria-label="Home" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_URL} alt="" className="h-7 w-auto invert" />
        </Link>
        <p className="text-neutral-500">
          Laura Betancur, product designer and front-end developer. Cali, Colombia{year ? `, ${year}` : ''}.
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-nav self-start text-base text-neutral-400 transition-colors hover:text-white md:self-auto"
        >
          Back to top
        </button>
      </div>
    </footer>
  );
}
