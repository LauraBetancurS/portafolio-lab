import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";
import CaseStudy from "@/components/project/CaseStudy";

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

async function ProjectDetail({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  return <CaseStudy project={project} />;
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
