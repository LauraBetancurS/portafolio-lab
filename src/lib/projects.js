import { cacheLife } from 'next/cache';
import { supabase } from './supabase';

// Lee los proyectos publicados desde Supabase.
// Se guarda en caché unos minutos: si editas algo en Supabase,
// la web lo muestra en ~5 minutos (o al reiniciar `npm run dev`).
export async function getProjects() {
  'use cache';
  cacheLife('minutes');

  const { data, error } = await supabase
    .from('projects')
    .select(
      'id, slug, title, tagline, tags, cover_url, card_color, year, role, sort_order, project_media(url, alt, type, sort_order)'
    )
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading projects:', error.message);
    return { projects: [], error: true };
  }

  // Si un proyecto no tiene portada, usa su primera imagen
  const projects = (data ?? []).map(project => {
    const firstImage = [...(project.project_media ?? [])]
      .filter(m => m.type === 'image')
      .sort((a, b) => a.sort_order - b.sort_order)[0];
    return {
      ...project,
      cover: project.cover_url || firstImage?.url || null,
      coverAlt: firstImage?.alt || project.title,
    };
  });

  return { projects, error: false };
}
