import Link from 'next/link';

// Colores de la paleta para proyectos que todavía no tienen imagen
const PALETTE = ['#F6C6E6', '#CDE8F8', '#E4EDB0', '#F9CDBF', '#F8D98C'];

// Tarjeta de proyecto: la imagen ocupa toda la tarjeta y encima, abajo a la
// izquierda, van "año \\ tipo de proyecto" y el nombre (sin franja blanca).
// Si no hay imagen, se usa su card_color (o uno de la paleta) y el texto va oscuro.
//
// A dónde lleva el clic (prop "to"):
//  - 'prototype' → el prototype_url de Supabase en otra pestaña
//    (si no tiene, el live_url; si tampoco, la página del proyecto)
//  - una ruta como '/work' → esa página
//  - sin "to" → la página del proyecto (/work/slug)
export default function ProjectCard({ project, index, compact = false, to }) {
  const hasImage = Boolean(project.cover);
  const color = project.card_color || PALETTE[index % PALETTE.length];
  const kind = project.service || project.role || project.tags?.[0];
  const meta = [project.year, kind].filter(Boolean);
  const ink = hasImage ? 'text-white' : 'text-neutral-900';

  const external = to === 'prototype' ? project.prototype_url || project.live_url : null;
  const href = external || (to && to !== 'prototype' ? to : `/work/${project.slug}`);
  const linkProps = external
    ? { target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${project.title}, open the prototype in a new tab` }
    : {};

  return (
    <Link
      href={href}
      {...linkProps}
      className={`project-card press group relative block overflow-hidden rounded-[18px] ring-1 ring-black/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black ${
        compact ? 'aspect-[4/3]' : 'aspect-[4/3.6]'
      }`}
      style={{ backgroundColor: color }}
    >
      {/* Imagen (más alta que la tarjeta para el efecto parallax) */}
      {hasImage && (
        <div className="project-media absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.cover}
            alt={project.coverAlt}
            loading={index < 2 ? 'eager' : 'lazy'}
            draggable={false}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Capa donde aparecen las estrellas que siguen al cursor (las crea ProjectGrid) */}
      <span aria-hidden="true" className="project-stars pointer-events-none absolute inset-0 z-[5]" />

      {/* Degradado suave abajo para que el texto se lea sobre cualquier foto */}
      {hasImage && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      )}

      {/* Flecha */}
      <span
        aria-hidden="true"
        className={`project-copy absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md transition-transform duration-300 group-hover:rotate-45 ${
          hasImage ? 'bg-white/25 text-white' : 'bg-black/10 text-neutral-900'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* Texto encima de la imagen */}
      <div className={`project-copy absolute inset-x-0 bottom-0 z-10 ${compact ? 'p-5 md:p-6' : 'p-6 md:p-8'} ${ink}`}>
        {meta.length > 0 && (
          <p className="font-body truncate text-[15px] opacity-80">{meta.join('  \\\\  ')}</p>
        )}
        <h2 className={`font-title mt-1.5 leading-[1] tracking-tight ${compact ? 'text-[clamp(1.6rem,2.4vw,2.1rem)]' : 'text-[clamp(2rem,3.4vw,3rem)]'}`}>
          {project.title}
        </h2>
      </div>
    </Link>
  );
}
