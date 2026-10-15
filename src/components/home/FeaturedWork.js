import Link from 'next/link';
import { getProjects } from '@/lib/projects';
// Versiones anteriores, guardadas por si quieres volver a usarlas:
// descomenta su import y su línea abajo, y comenta las de ProjectCarousel.
// import ProjectRail from '@/components/home/ProjectRail'; // discos en portadas
// import ProjectRing from '@/components/home/ProjectRing'; // anillo que gira
// import ProjectStack from '@/components/home/ProjectStack'; // pila que cambia sola
// import ProjectScrollStack from '@/components/home/ProjectScrollStack'; // scroll stack
import ProjectCarousel from '@/components/home/ProjectCarousel';
import SectionTitle from '@/components/mixed/SectionTitle';
import Scribble from '@/components/mixed/Scribble';
import Note from '@/components/mixed/Note';

// "Selected work" del inicio: carrusel horizontal que avanza solo
export default async function FeaturedWork() {
  const { projects } = await getProjects();
  if (projects.length === 0) return null;

  return (
    <>
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div className="relative">
          <Note arrow="down-left" arrowFirst rotate={-7} className="absolute -top-10 left-[clamp(14rem,40vw,30rem)] hidden md:flex">
            the ones I’m proudest of
          </Note>
          <SectionTitle>Selected work</SectionTitle>
          <p className="font-body mt-6 max-w-[48ch] text-lg leading-relaxed text-neutral-600">
            A few projects where research, design and code meet.
          </p>
        </div>
        <Link
          href="/work"
          className="group font-nav flex items-center gap-3 self-start text-xl text-neutral-900 md:self-auto"
        >
          <span className="border-b-2 border-transparent transition-colors group-hover:border-neutral-900">
            See all projects
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </div>
      {/* <ProjectRail projects={projects.slice(0, 9)} /> */}
      {/* <ProjectRing projects={projects.slice(0, 12)} /> */}
      {/* <ProjectStack projects={projects.slice(0, 10)} /> */}
      {/* <ProjectScrollStack projects={projects.slice(0, 6)} /> */}
      <ProjectCarousel projects={projects.slice(0, 10)} />
      <Scribble variant="arrow-down" color="#C9DB4B" strokeWidth={3} className="mx-auto mt-16 h-24 w-14" />
    </>
  );
}
