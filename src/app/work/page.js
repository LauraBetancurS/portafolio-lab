import { getProjects } from "@/lib/projects";
import ProjectGrid from "@/components/work/ProjectGrid";

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
        <header className="mb-20 md:mb-28">
          <h1 className="font-title text-[clamp(3.5rem,11vw,10rem)] leading-[0.9] tracking-tight text-neutral-900">
            Selected
            <br />
            <span className="inline-flex items-start">
              work
              <span className="font-body relative top-[0.6em] ml-3 text-[clamp(1rem,2vw,1.5rem)] font-medium tracking-normal text-neutral-500">
                ({count})
              </span>
            </span>
          </h1>
          <p className="font-body mt-8 max-w-[48ch] text-lg leading-relaxed text-neutral-600 md:text-xl">
            Projects where research, design and code meet. Each one started with a real
            problem and a lot of sticky notes.
          </p>
        </header>

        {/* Grilla */}
        {error ? (
          <p className="font-body rounded-2xl bg-white/70 p-8 text-center text-neutral-600">
            Projects couldn’t load right now. Refresh the page to try again.
          </p>
        ) : projects.length === 0 ? (
          <p className="font-body rounded-2xl bg-white/70 p-8 text-center text-neutral-600">
            No projects published yet. In Supabase, add a row to the projects table and set
            published to true.
          </p>
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </div>
    </main>
  );
}
