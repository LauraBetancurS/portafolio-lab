import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";
import ReadingProgress from "@/components/project/ReadingProgress";
import MediaReveal from "@/components/project/MediaReveal";
import NextProject from "@/components/project/NextProject";
import Reveal from "@/components/mixed/Reveal";
import Tape from "@/components/mixed/Tape";
import Lightbox from "@/components/project/Lightbox";

// Pre-genera las páginas de los proyectos que existen al hacer el build.
// (Next exige al menos uno; si no hay proyectos se usa un marcador que da 404.)
export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.length ? slugs.map(slug => ({ slug })) : [{ slug: "__none__" }];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found — Lau Betancur" };
  return {
    title: `${project.title} — Lau Betancur`,
    description: project.tagline || project.overview?.slice(0, 150),
  };
}

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
function Section({ n, label, text }) {
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
          <div className="font-body mt-6 space-y-5 text-lg leading-[1.75] text-neutral-700">
            {rest.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
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

async function ProjectDetail({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const accent = project.card_color || '#F2A2DC';

  // Línea pequeña arriba del título
  const kicker = [project.industry, project.service, project.year].filter(Boolean).join('  ·  ');

  // Datos clave
  const facts = [
    ['Role', project.role],
    ['Client', project.client],
    ['Year', project.year],
    ['Duration', project.duration],
    ['Team', project.team],
  ].filter(([, value]) => value);

  const links = [
    ['See it live', project.live_url],
    ['Open the prototype', project.prototype_url],
    ['See the code', project.repo_url],
  ].filter(([, url]) => url);

  // Secciones con texto, numeradas en orden
  const sections = [
    ['Overview', project.overview],
    ['The challenge', project.challenge],
    ['The process', project.process],
    ['The outcome', project.outcome],
  ].filter(([, text]) => text?.trim());

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
          All projects
        </Link>

        {kicker && <p className="font-body mt-12 text-sm uppercase tracking-[0.14em] text-neutral-500">{kicker}</p>}

        <h1 className="font-title mt-4 text-[clamp(3rem,10vw,8.5rem)] leading-[0.92] tracking-tight text-neutral-900">
          {project.title}
        </h1>
        {project.tagline && (
          <p className="font-title mt-6 max-w-[30ch] text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.15] text-neutral-700">
            {project.tagline}
          </p>
        )}

        {project.tags?.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {project.tags.map(tag => (
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
                  <p className="font-body text-sm text-neutral-500">Tools</p>
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
                    key={label}
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

      {/* Cifras clave (columna "stats" en Supabase, opcional) */}
      {project.stats.length > 0 && (
        <Reveal className="mx-auto mt-20 max-w-7xl md:mt-28">
          <p className="font-body text-sm uppercase tracking-[0.14em] text-neutral-500">At a glance</p>
          <dl className={`mt-6 grid gap-3 sm:grid-cols-2 ${project.stats.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
            {project.stats.map((stat, i) => (
              <div key={i} className="rounded-[6px] bg-white p-6 ring-1 ring-black/5 md:p-8">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-title block text-[clamp(2.75rem,5vw,4.25rem)] leading-none tracking-tight text-neutral-900">
                    {stat.value}
                  </span>
                  <span aria-hidden="true" className="mt-4 block h-1.5 w-10 rounded-full" style={{ backgroundColor: accent }} />
                  <span className="font-body mt-4 block leading-snug text-neutral-600">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )}

      {/* Historia del proyecto, con las imágenes entre secciones */}
      <div className="mx-auto mt-24 max-w-7xl space-y-20 md:mt-32 md:space-y-28">
        {sections.map(([label, text], i) => (
          <div key={label} className="space-y-20 md:space-y-28">
            <Section n={i + 1} label={label} text={text} />
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

function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse">
      <div className="h-6 w-32 rounded bg-black/10" />
      <div className="mt-16 h-24 w-2/3 rounded bg-black/10" />
      <div className="mt-20 aspect-[16/9] w-full rounded-[6px] bg-black/10" />
    </div>
  );
}

export default function ProjectPage({ params }) {
  return (
    <main className="overflow-x-clip px-6 pb-24 pt-36 md:px-12">
      <Suspense fallback={<Loading />}>
        <ProjectDetail params={params} />
      </Suspense>
    </main>
  );
}
