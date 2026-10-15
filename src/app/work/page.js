import { getProjects } from "@/lib/projects";
import ProjectGrid from "@/components/work/ProjectGrid";
import Scribble from "@/components/mixed/Scribble";
import Reveal from "@/components/mixed/Reveal";
import { T } from "@/i18n/lang";

export const metadata = {
  title: "Work — Lau Betancur",
  description: "Selected projects by Laura Betancur: UX research, UI design, front-end and AI products.",
};

export default async function WorkPage() {
  const { projects, error } = await getProjects();
  const count = String(projects.length).padStart(2, "0");

  return (
    <main className="overflow-x-clip px-6 pb-32 pt-36 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <header className="relative">
          <h1 className="font-title inline-flex items-start text-[clamp(4rem,14vw,12rem)] leading-[0.85] tracking-tight text-neutral-900">
            <T en="Work" es="Proyectos" />
            <span className="font-body relative top-[0.5em] ml-4 text-[clamp(1rem,2vw,1.5rem)] font-medium tracking-normal text-neutral-500">
              ({count})
              <Scribble variant="circle" color="#E8603C" strokeWidth={2.5} className="absolute -inset-x-4 -inset-y-3 h-[calc(100%+1.5rem)] w-[calc(100%+2rem)]" delay={0.4} />
            </span>
          </h1>
          <div className="mt-8 flex items-end gap-6">
            <Reveal as="p" delay={0.2} className="font-body max-w-[40ch] text-base font-medium uppercase leading-snug tracking-wide text-neutral-500 md:text-lg">
              <T
                en="A collection of projects where research, design and code meet, each one born from a real problem and a lot of sticky notes."
                es="Una colección de proyectos donde se juntan la investigación, el diseño y el código, cada uno nacido de un problema real y de muchos sticky notes."
              />
            </Reveal>
            <span aria-hidden="true" className="work-dot mb-1 h-4 w-4 shrink-0 rounded-full bg-[#F2A2DC] md:h-5 md:w-5" />
          </div>
        </header>
      </div>

      {/* Línea de lado a lado */}
      <hr className="-mx-6 mb-16 mt-12 border-0 border-t border-black/10 md:-mx-12 md:mb-24 md:mt-16" />

      <div className="mx-auto max-w-7xl">
        {/* Grilla */}
        {error ? (
          <p className="font-body rounded-2xl bg-white/70 p-8 text-center text-neutral-600">
            <T en="Projects couldn’t load right now. Refresh the page to try again." es="Los proyectos no cargaron. Recarga la página para intentarlo de nuevo." />
          </p>
        ) : projects.length === 0 ? (
          <p className="font-body rounded-2xl bg-white/70 p-8 text-center text-neutral-600">
            <T
              en="No projects published yet. In Supabase, add a row to the projects table and set published to true."
              es="Todavía no hay proyectos publicados. En Supabase, agrega una fila a la tabla projects y pon published en true."
            />
          </p>
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </div>
    </main>
  );
}
