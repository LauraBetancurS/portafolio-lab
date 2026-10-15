'use client';

import Link from 'next/link';
import ReadingProgress from '@/components/project/ReadingProgress';
import MediaReveal from '@/components/project/MediaReveal';
import NextProject from '@/components/project/NextProject';
import Reveal from '@/components/mixed/Reveal';
import Tape from '@/components/mixed/Tape';
import Lightbox from '@/components/project/Lightbox';
import { useLang } from '@/i18n/lang';

// Página de detalle de un proyecto (caso de estudio), en inglés o español.
// Los textos en español salen de las columnas *_es de Supabase
// (ver supabase/05_spanish.sql). Si una está vacía, se muestra el inglés.

// Divide un texto largo en párrafos (una línea en blanco = nuevo párrafo)
const toParagraphs = text =>
  (text || '')
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

// Reparte las imágenes entre las secciones, en orden (después de cada texto)
function distribute(items, slots) {
  const groups = Array.from({ length: slots }, () => []);
  if (!slots) return groups;
  items.forEach((item, i) => groups[Math.floor((i * slots) / items.length)].push(item));
  return groups;
}

// Etiqueta pequeña tipo "01 — The challenge"
function Eyebrow({ n, children }) {
  return (
    <p className="font-body flex items-center gap-3 text-sm uppercase tracking-[0.14em] text-neutral-500">
      <span className="tabular-nums text-neutral-900">{String(n).padStart(2, '0')}</span>
      <span aria-hidden="true" className="h-px w-8 bg-neutral-300" />
      {children}
    </p>
  );
}

// Sección del caso: la primera frase se lee como titular, el resto como texto
function Section({ n, label, text, t }) {
  const [first = '', ...others] = toParagraphs(text);
  // Separa la primera oración del resto del primer párrafo
  const match = first.match(/^(.+?[.!?:])\s+(.+)$/s);
  const lead = match && match[1].length > 30 ? match[1] : first;
  const rest = [match && lead !== first ? match[2] : null, ...others].filter(Boolean);
  return (
    <Reveal as="section" className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
      <div className="md:sticky md:top-28 md:self-start">
        <Eyebrow n={n}>{label}</Eyebrow>
      </div>
      <div className="max-w-[62ch]">
        <p className="font-title text-[clamp(1.5rem,2.6vw,2.15rem)] leading-[1.2] tracking-tight text-neutral-900">{lead}</p>
        {rest.length > 0 && (
          <p className="font-body mt-5 text-lg leading-[1.7] text-neutral-600">{rest[0]}</p>
        )}
        {/* Menos texto a la vista: lo demás queda detrás de "Keep reading" */}
        {rest.length > 1 && (
          <details className="group/more mt-4">
            <summary className="font-body inline-flex cursor-pointer list-none items-center gap-2 rounded-full py-1 text-[15px] font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900 [&::-webkit-details-marker]:hidden">
              <span className="group-open/more:hidden">{t('Keep reading', 'Seguir leyendo')}</span>
              <span className="hidden group-open/more:inline">{t('Show less', 'Ver menos')}</span>
              <span aria-hidden="true" className="transition-transform duration-200 group-open/more:rotate-180">↓</span>
            </summary>
            <div className="font-body mt-4 space-y-5 text-lg leading-[1.7] text-neutral-600">
              {rest.slice(1).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </details>
        )}
      </div>
    </Reveal>
  );
}

// Imágenes entre secciones: 1 = ancho completo, 2 = lado a lado, 3 = una grande + dos
function ImageGroup({ items }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item, i) => (
        <MediaReveal
          key={item.id}
          item={item}
          zoomIndex={item.zoomIndex}
          className={items.length % 2 === 1 && i === 0 ? 'md:col-span-2' : ''}
        />
      ))}
    </div>
  );
}

export default function CaseStudy({ project }) {
  const { t } = useLang();
  // Texto de una columna en el idioma actual (columna_es si existe)
  const f = key => t(project[key], project[`${key}_es`]);

  const accent = project.card_color || '#F2A2DC';

  // Línea pequeña arriba del título
  const kicker = [f('industry'), f('service'), project.year].filter(Boolean).join('  ·  ');

  // Datos clave
  const facts = [
    [t('Role', 'Rol'), f('role')],
    [t('Client', 'Cliente'), project.client],
    [t('Year', 'Año'), project.year],
    [t('Duration', 'Duración'), f('duration')],
    [t('Team', 'Equipo'), f('team')],
  ].filter(([, value]) => value);

  const links = [
    [t('See it live', 'Verlo en vivo'), project.live_url],
    [t('Open the prototype', 'Abrir el prototipo'), project.prototype_url],
    [t('See the code', 'Ver el código'), project.repo_url],
  ].filter(([, url]) => url);

  // Secciones con texto, numeradas en orden
  const sections = [
    ['overview', t('Overview', 'Resumen'), f('overview')],
    ['challenge', t('The challenge', 'El reto'), f('challenge')],
    ['process', t('The process', 'El proceso'), f('process')],
    ['outcome', t('The outcome', 'El resultado'), f('outcome')],
  ].filter(([, , text]) => text?.trim());

  const tags = f('tags') || [];

  // Todas las imágenes del caso (para el visor) y su reparto entre secciones
  const zoomable = [
    ...(project.cover ? [{ url: project.cover, alt: project.coverAlt }] : []),
    ...project.media,
  ];
  const offset = project.cover ? 1 : 0;
  const gallery = project.media.map((item, i) => ({ ...item, zoomIndex: i + offset }));
  const groups = distribute(gallery, sections.length);
  const orphanImages = sections.length ? [] : gallery;

  return (
    <Lightbox images={zoomable}>
      <ReadingProgress color={accent} />

      {/* Encabezado */}
      <header className="mx-auto max-w-7xl">
        <Link
          href="/work"
          className="font-nav group inline-flex items-center gap-2 text-lg text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
          {t('All projects', 'Todos los proyectos')}
        </Link>

        {kicker && <p className="font-body mt-12 text-sm uppercase tracking-[0.14em] text-neutral-500">{kicker}</p>}

        <h1 className="font-title mt-4 text-[clamp(3rem,10vw,8.5rem)] leading-[0.92] tracking-tight text-neutral-900">
          {f('title')}
        </h1>
        {f('tagline') && (
          <p className="font-title mt-6 max-w-[30ch] text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.15] text-neutral-700">
            {f('tagline')}
          </p>
        )}

        {tags.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {tags.map(tag => (
              <li key={tag} className="font-body rounded-full bg-white px-3 py-1 text-sm text-neutral-700 ring-1 ring-black/10">
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* Datos clave + herramientas + enlaces */}
        {(facts.length > 0 || project.tools?.length > 0 || links.length > 0) && (
          <div className="mt-14 grid gap-10 border-t border-neutral-300/80 pt-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <p className="font-body text-sm text-neutral-500">{label}</p>
                  <p className="font-body mt-1.5 text-lg leading-snug text-neutral-900">{value}</p>
                </div>
              ))}
              {project.tools?.length > 0 && (
                <div className="sm:col-span-2 md:col-span-3">
                  <p className="font-body text-sm text-neutral-500">{t('Tools', 'Herramientas')}</p>
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {project.tools.map(tool => (
                      <li key={tool} className="font-body rounded-md bg-black/[0.05] px-2.5 py-1 text-[15px] text-neutral-800">
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {links.length > 0 && (
              <div className="flex flex-wrap content-start gap-3 lg:justify-end">
                {links.map(([label, url], i) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`press font-nav group inline-flex items-center gap-2 rounded-full px-6 py-3 text-lg hover:-translate-y-0.5 ${
                      i === 0 ? 'bg-black text-white' : 'bg-white text-neutral-900 ring-1 ring-black/15'
                    }`}
                  >
                    {label}
                    <span className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Portada */}
      {project.cover && (
        <div className="relative mx-auto mt-16 max-w-7xl md:mt-20">
          <Tape color="pink" rotate={-6} className="-top-3 left-6 z-10 md:left-10" />
          <Tape color="lime" rotate={5} className="-top-3 right-6 z-10 md:right-10" />
          <MediaReveal
            item={{ url: project.cover, alt: project.coverAlt, type: 'image' }}
            frameClass="aspect-[4/3] md:aspect-[16/9]"
            zoomIndex={0}
            priority
          />
        </div>
      )}

      {/* Cifras clave (columna "stats" en Supabase, opcional; "label_es" para español) */}
      {project.stats.length > 0 && (
        <Reveal className="mx-auto mt-20 max-w-7xl md:mt-28">
          <p className="font-body text-sm uppercase tracking-[0.14em] text-neutral-500">{t('At a glance', 'De un vistazo')}</p>
          <dl className={`mt-6 grid gap-3 sm:grid-cols-2 ${project.stats.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
            {project.stats.map((stat, i) => (
              <div key={i} className="rounded-[6px] bg-white p-6 ring-1 ring-black/5 md:p-8">
                <dt className="sr-only">{t(stat.label, stat.label_es)}</dt>
                <dd>
                  <span className="font-title block text-[clamp(2.75rem,5vw,4.25rem)] leading-none tracking-tight text-neutral-900">
                    {stat.value}
                  </span>
                  <span aria-hidden="true" className="mt-4 block h-1.5 w-10 rounded-full" style={{ backgroundColor: accent }} />
                  <span className="font-body mt-4 block leading-snug text-neutral-600">{t(stat.label, stat.label_es)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )}

      {/* Historia del proyecto, con las imágenes entre secciones */}
      <div className="mx-auto mt-24 max-w-7xl space-y-20 md:mt-32 md:space-y-28">
        {sections.map(([key, label, text], i) => (
          <div key={key} className="space-y-20 md:space-y-28">
            <Section n={i + 1} label={label} text={text} t={t} />
            <ImageGroup items={groups[i]} />
          </div>
        ))}
        <ImageGroup items={orphanImages} />
      </div>

      {/* Siguiente proyecto */}
      <div className="mx-auto mt-28 max-w-7xl md:mt-36">
        <NextProject project={project.next} />
      </div>
    </Lightbox>
  );
}
