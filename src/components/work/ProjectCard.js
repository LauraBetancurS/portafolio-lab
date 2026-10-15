import Link from 'next/link';

// Colores de la paleta para proyectos que todavía no tienen imagen
const PALETTE = ['#F6C6E6', '#CDE8F8', '#E4EDB0', '#F9CDBF', '#F8D98C'];

// Tarjeta de proyecto: imagen grande arriba y una franja blanca abajo con
// "año \\ tipo de proyecto" y el nombre. Si no hay imagen, se usa su card_color
// (o uno de la paleta) con el nombre en grande.
export default function ProjectCard({ project, index }) {
  const hasImage = Boolean(project.cover);
  const color = project.card_color || PALETTE[index % PALETTE.length];
  const kind = project.service || project.role || project.tags?.[0];
  const meta = [project.year, kind].filter(Boolean);

  return (
    <Link
      href={`/work/${project.slug}`}
      className="project-card press group relative block overflow-hidden rounded-[18px] bg-white ring-1 ring-black/10 transition-shadow duration-300 hover:shadow-[0_30px_60px_-35px_rgba(0,0,0,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3.4] overflow-hidden" style={{ backgroundColor: color }}>
        {hasImage ? (
          // más alta que el recuadro para el efecto parallax
          <div className="project-media absolute inset-x-0 -top-[10%] h-[120%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover}
              alt={project.coverAlt}
              loading={index < 2 ? 'eager' : 'lazy'}
              className="h-full w-full object-cover transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
            />
          </div>
        ) : (
          <div className="project-media absolute inset-x-0 -top-[10%] flex h-[120%] items-center p-[8%]">
            <span aria-hidden="true" className="font-title text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] tracking-tight text-black/15">
              {project.title}
            </span>
          </div>
        )}

        {/* Capa donde aparecen las estrellas que siguen al cursor (las crea ProjectGrid) */}
        <span aria-hidden="true" className="project-stars pointer-events-none absolute inset-0 z-[5]" />

        {/* Flecha */}
        <span
          aria-hidden="true"
          className="project-copy absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-neutral-900 backdrop-blur-md transition-transform duration-300 group-hover:rotate-45"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Franja de abajo */}
      <div className="project-copy border-t border-black/10 px-6 pb-7 pt-6 md:px-8 md:pb-9 md:pt-7">
        {meta.length > 0 && (
          <p className="font-body flex items-center gap-2 text-[15px] text-neutral-500">
            {meta.map((m, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="text-[#E8603C]">\\</span>}
                {m}
              </span>
            ))}
          </p>
        )}
        <h2 className="font-title mt-2 text-[clamp(2rem,3.4vw,3rem)] leading-[1] tracking-tight text-neutral-900">
          <span className="bg-[linear-gradient(#F2A2DC,#F2A2DC)] bg-[length:0%_0.35em] bg-[position:0_88%] bg-no-repeat transition-[background-size] duration-500 ease-[var(--ease-out)] group-hover:bg-[length:100%_0.35em]">
            {project.title}
          </span>
        </h2>
      </div>
    </Link>
  );
}
