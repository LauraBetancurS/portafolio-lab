import Link from 'next/link';

// Colores de los puntos de las etiquetas (se repiten en orden)
const TAG_DOTS = ['#E8603C', '#A9D6F5', '#C9DB4B', '#F2A2DC', '#DB6A8C'];

// Tarjeta de un proyecto. Los efectos de scroll los agrega ProjectGrid.
export default function ProjectCard({ project, index }) {
  const color = project.card_color || '#ECECEC';
  const number = String(index + 1).padStart(2, '0');

  return (
    <Link
      href={`/work/${project.slug}`}
      className="project-card group block rounded-[28px] p-3 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.45)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_34px_60px_-28px_rgba(0,0,0,0.5)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      style={{ backgroundColor: color }}
    >
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-4 px-3 pb-4 pt-3">
        <div>
          <h2 className="font-title text-3xl leading-tight text-neutral-900 md:text-4xl">
            {project.title}
          </h2>
          {project.tagline && (
            <p className="font-body mt-1.5 max-w-[42ch] text-[15px] leading-snug text-neutral-800/80">
              {project.tagline}
            </p>
          )}
        </div>
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70 text-neutral-900 transition-all duration-300 group-hover:rotate-45 group-hover:bg-neutral-900 group-hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-white/40">
        {project.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover}
            alt={project.coverAlt}
            loading={index < 2 ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="font-title flex h-full w-full items-center justify-center text-7xl text-neutral-900/15">
            {number}
          </div>
        )}

        {/* Etiquetas estilo macOS */}
        {project.tags?.length > 0 && (
          <ul className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {project.tags.map((tag, i) => (
              <li
                key={tag}
                className="font-body flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-neutral-800 shadow-sm backdrop-blur"
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: TAG_DOTS[i % TAG_DOTS.length] }} />
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pie: año y rol */}
      {(project.year || project.role) && (
        <p className="font-body flex justify-between px-3 pb-1 pt-3 text-sm text-neutral-800/70">
          <span>{project.role}</span>
          <span>{project.year}</span>
        </p>
      )}
    </Link>
  );
}
