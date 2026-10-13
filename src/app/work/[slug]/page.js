import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";
import ReadingProgress from "@/components/project/ReadingProgress";
import MediaReveal from "@/components/project/MediaReveal";
import NextProject from "@/components/project/NextProject";
import Reveal from "@/components/mixed/Reveal";
import Tape from "@/components/mixed/Tape";

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
function Paragraphs({ text }) {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map((p, i) => <p key={i}>{p}</p>);
}

// Fila de dos columnas: etiqueta a la izquierda, contenido a la derecha
function Row({ label, children }) {
  return (
    <Reveal className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
      <h2 className="font-title text-2xl text-neutral-900">{label}</h2>
      <div className="font-body max-w-[65ch] space-y-5 text-lg leading-[1.75] text-neutral-700">{children}</div>
    </Reveal>
  );
}

async function ProjectDetail({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const accent = project.card_color || "#F2A2DC";
  const details = [
    ["Client", project.client],
    ["Industry", project.industry],
    ["Service", project.service],
    ["Role", project.role],
    ["Year", project.year],
    ["Duration", project.duration],
    ["Team", project.team],
    ["Tools", project.tools?.length ? project.tools.join(", ") : null],
  ].filter(([, value]) => value);

  const story = [
    ["The challenge", project.challenge],
    ["The process", project.process],
    ["The outcome", project.outcome],
  ].filter(([, text]) => text);

  const links = [
    ["See it live", project.live_url],
    ["Open the prototype", project.prototype_url],
    ["See the code", project.repo_url],
  ].filter(([, url]) => url);

  // Si la portada también está en la galería, no la repetimos
  const gallery = project.media.filter(m => m.url !== project.cover);

  return (
    <>
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

        {project.tags?.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <li key={tag} className="font-body rounded-full bg-white px-3 py-1 text-sm text-neutral-700 ring-1 ring-black/10">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <h1 className="font-title mt-6 text-[clamp(3rem,10vw,8.5rem)] leading-[0.92] tracking-tight text-neutral-900">
          {project.title}
        </h1>
        {project.tagline && (
          <p className="font-body mt-6 max-w-[52ch] text-xl leading-relaxed text-neutral-600 md:text-2xl">
            {project.tagline}
          </p>
        )}

        {details.length > 0 && (
          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt className="font-body text-sm text-neutral-500">{label}</dt>
                <dd className="font-body mt-1.5 text-lg text-neutral-900">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      {/* Portada */}
      {project.cover && (
        <div className="relative mx-auto mt-16 max-w-7xl md:mt-20">
          <Tape color="pink" rotate={-6} className="-top-3 left-6 md:left-10" />
          <Tape color="lime" rotate={5} className="-top-3 right-6 md:right-10" />
          <MediaReveal
            item={{ url: project.cover, alt: project.coverAlt, type: "image" }}
            frameClass="aspect-[4/3] md:aspect-[16/9]"
            priority
          />
        </div>
      )}

      {/* Historia del proyecto */}
      <div className="mx-auto mt-24 max-w-7xl space-y-20 md:mt-32 md:space-y-28">
        {project.overview && (
          <Row label="Overview">
            <Paragraphs text={project.overview} />
          </Row>
        )}
        {story.map(([label, text]) => (
          <Row key={label} label={label}>
            <Paragraphs text={text} />
          </Row>
        ))}
      </div>

      {/* Galería: 'full' ocupa todo el ancho, 'half' va de a dos */}
      {gallery.length > 0 && (
        <div className="mx-auto mt-24 grid max-w-7xl gap-3 md:mt-32 md:grid-cols-2">
          {gallery.map(item => (
            <MediaReveal key={item.id} item={item} className={item.layout === "half" ? "" : "md:col-span-2"} />
          ))}
        </div>
      )}

      {/* Enlaces */}
      {links.length > 0 && (
        <Reveal className="mx-auto mt-20 flex max-w-7xl flex-wrap gap-3">
          {links.map(([label, url], i) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-nav group inline-flex items-center gap-2 rounded-full px-6 py-3 text-lg transition-transform duration-200 hover:-translate-y-0.5 ${
                i === 0 ? "bg-black text-white" : "bg-white text-neutral-900 ring-1 ring-black/15"
              }`}
            >
              {label}
              <span className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </a>
          ))}
        </Reveal>
      )}

      {/* Siguiente proyecto */}
      <div className="mx-auto mt-28 max-w-7xl">
        <NextProject project={project.next} />
      </div>
    </>
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
