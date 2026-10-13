import { cacheLife } from 'next/cache';
import { supabase } from './supabase';

// Todas las funciones guardan el resultado en caché unos minutos:
// si editas algo en Supabase, la web lo muestra en ~1–5 minutos
// (o al reiniciar `npm run dev`).

const sortByOrder = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

// Portada: cover_url o, si no hay, la primera imagen del proyecto
function withCover(project) {
  const firstImage = [...(project.project_media ?? [])].filter(m => m.type === 'image').sort(sortByOrder)[0];
  return {
    ...project,
    cover: project.cover_url || firstImage?.url || null,
    coverAlt: firstImage?.alt || project.title,
  };
}

// Lista de proyectos publicados (para /work y el inicio)
export async function getProjects() {
  'use cache';
  cacheLife('minutes');

  const { data, error } = await supabase
    .from('projects')
    .select(
      'id, slug, title, tagline, tags, cover_url, card_color, year, role, featured, sort_order, project_media(url, alt, type, sort_order)'
    )
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading projects:', error.message);
    return { projects: [], error: true };
  }
  return { projects: (data ?? []).map(withCover), error: false };
}

// Proyectos destacados para el inicio (featured = true; si no hay, los primeros)
export async function getFeaturedProjects(limit = 4) {
  const { projects, error } = await getProjects();
  const featured = projects.filter(p => p.featured);
  return { projects: (featured.length ? featured : projects).slice(0, limit), error };
}

// Un proyecto completo + sus imágenes + el siguiente proyecto
export async function getProjectBySlug(slug) {
  'use cache';
  cacheLife('minutes');

  const { data, error } = await supabase
    .from('projects')
    .select('*, project_media(id, url, type, alt, caption, layout, sort_order)')
    .eq('published', true)
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error loading project:', error.message);
    return null;
  }
  if (!data) return null;

  const project = withCover(data);
  project.media = [...(data.project_media ?? [])].sort(sortByOrder);

  // Siguiente proyecto (vuelve al primero al llegar al final)
  const { projects } = await getProjects();
  const index = projects.findIndex(p => p.slug === slug);
  project.next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;

  return project;
}

// Slugs para pre-generar las páginas en el build
export async function getProjectSlugs() {
  const { projects } = await getProjects();
  return projects.map(p => p.slug);
}
