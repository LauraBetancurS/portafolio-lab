'use client';

import Link from 'next/link';
import { useLang } from '@/i18n/lang';

// Enlace grande al siguiente proyecto, al final de la página.
export default function NextProject({ project }) {
  const { t } = useLang();
  if (!project) return null;
  const color = project.card_color || '#ECECEC';

  return (
    <Link
      href={`/work/${project.slug}`}
      className="press group relative block overflow-hidden rounded-[6px] px-6 py-12 md:px-12 md:py-16"
      style={{ backgroundColor: color }}
    >
      {project.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.cover}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 top-1/2 hidden h-[130%] w-auto -translate-y-1/2 rotate-6 rounded-[6px] object-cover shadow-2xl transition-transform duration-700 ease-out group-hover:-translate-x-6 group-hover:rotate-2 md:block"
        />
      )}
      <p className="font-body relative text-neutral-800/70">{t('Next project', 'Siguiente proyecto')}</p>
      <p className="font-title relative mt-2 max-w-[70%] text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-tight text-neutral-900">
        {t(project.title, project.title_es)}
      </p>
      <span className="relative mt-8 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:translate-x-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
