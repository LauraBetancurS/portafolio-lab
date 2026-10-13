import Link from 'next/link';

// Colores de la "mancha" que sigue al cursor (uno por tarjeta, en orden)
const SPLASH_COLORS = ['#F2A2DC', '#C9DB4B', '#A9D6F5', '#E8603C', '#F8D98C'];

// Tarjeta minimalista: la imagen ocupa toda la tarjeta, el título va encima.
// Si el proyecto no tiene imagen, se usa su card_color de fondo.
export default function ProjectCard({ project, index }) {
  const hasImage = Boolean(project.cover);
  const color = project.card_color || '#E5E5E5';

  return (
    <Link
      href={`/work/${project.slug}`}
      className="project-card group relative block aspect-square overflow-hidden rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black md:aspect-[1/1]"
      style={{ backgroundColor: color }}
    >
      {/* Imagen de fondo (más alta que la tarjeta para el efecto parallax) */}
      {hasImage && (
        <div className="project-media absolute inset-x-0 -top-[10%] h-[120%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.cover}
            alt={project.coverAlt}
            loading={index < 2 ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        </div>
      )}

      {/* Mancha de color que sigue al cursor (la mueve ProjectGrid) */}
      <span
        aria-hidden="true"
        className="project-splash pointer-events-none absolute left-0 top-0 -ml-40 -mt-40 h-80 w-80 rounded-full opacity-0 mix-blend-multiply blur-2xl"
        style={{ backgroundColor: SPLASH_COLORS[index % SPLASH_COLORS.length] }}
      />

      {/* Degradado suave arriba y abajo para que el texto se lea sobre cualquier foto */}
      {hasImage && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/25"
        />
      )}

      {/* Título + flecha */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-6 md:p-8">
        <h2
          className={`font-body text-2xl font-medium tracking-tight md:text-3xl ${
            hasImage ? 'text-white' : 'text-neutral-900'
          }`}
        >
          {project.title}
        </h2>
        <span
          aria-hidden="true"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full backdrop-blur-md transition-transform duration-300 group-hover:rotate-45 ${
            hasImage ? 'bg-black/25 text-white' : 'bg-black/10 text-neutral-900'
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Etiquetas */}
      {project.tags?.length > 0 && (
        <ul className="absolute bottom-0 left-0 z-10 flex flex-wrap gap-1.5 p-6 md:p-8">
          {project.tags.map(tag => (
            <li
              key={tag}
              className={`rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wide backdrop-blur-md ${
                hasImage ? 'bg-white/25 text-white' : 'bg-black/10 text-neutral-900'
              }`}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}
