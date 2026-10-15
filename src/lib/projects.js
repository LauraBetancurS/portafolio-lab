import { cacheLife } from 'next/cache';
import { supabase } from './supabase';

// Todas las funciones guardan el resultado en caché unos minutos:
// si editas algo en Supabase, la web lo muestra en ~1–5 minutos
// (o al reiniciar `npm run dev`).

const PROJECTS_BUCKET = 'proyects';
const STORAGE_BASE = 'https://mjwtcqrzadpsluakzfjg.supabase.co/storage/v1/object/public';

// Convierte lo que pegues en Supabase en un link de imagen que funcione:
//  - link del dashboard (…/storage/files/buckets/proyects?path=solar&preview=portada.webp)
//    → link público (…/storage/v1/object/public/proyects/solar/portada.webp)
//  - solo la ruta ("solar/portada.webp") → se busca en el bucket "proyects"
//  - un link público normal se deja igual
export function toImageUrl(value) {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return null;

  if (!/^https?:\/\//.test(raw)) {
    const path = raw.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/');
    return `${STORAGE_BASE}/${PROJECTS_BUCKET}/${path}`;
  }

  const dashboard = raw.match(/supabase\.com\/dashboard\/project\/([^/]+)\/storage\/files\/buckets\/([^/?#]+)(\?[^#]*)?/);
  if (dashboard) {
    const [, ref, bucket, query = ''] = dashboard;
    const params = new URLSearchParams(query);
    const parts = [params.get('path'), params.get('preview')]
      .filter(Boolean)
      .flatMap(part => part.split('/'))
      .filter(Boolean)
      .map(encodeURIComponent);
    if (!parts.length) return null;
    return `https://${ref}.supabase.co/storage/v1/object/public/${decodeURIComponent(bucket)}/${parts.join('/')}`;
  }

  return raw;
}

// Prepara un proyecto: portada + lista de imágenes.
// Las imágenes salen de image_1 … image_5 (solo las que tengan algo).
// Portada: cover_url o, si no hay, la primera imagen.
function prepare(project) {
  const images = [...new Set(
    [project.image_1, project.image_2, project.image_3, project.image_4, project.image_5].map(toImageUrl).filter(Boolean)
  )];
  const cover = toImageUrl(project.cover_url) || images[0] || null;

  // Galería del detalle (sin repetir la portada). Si son impares, la primera
  // va a todo el ancho y las demás de a dos.
  const rest = images.filter(url => url !== cover);
  const media = rest.map((url, i) => ({
    id: url,
    url,
    type: 'image',
    alt: `${project.title}, image ${i + 1}`,
    layout: rest.length % 2 === 1 && i === 0 ? 'full' : 'half',
  }));

  // Cifras clave opcionales (columna stats: [{"value":"72%","label":"…"}])
  const stats = (Array.isArray(project.stats) ? project.stats : [])
    .filter(s => s && s.value && s.label)
    .slice(0, 6);

  return { ...project, cover, coverAlt: project.title, images, media, stats };
}

// Lista de proyectos publicados (para /work y el inicio)
export async function getProjects() {
  'use cache';
  cacheLife('minutes');

  const { data, error } = await supabase
    .from('projects')
    .select(
      'id, slug, title, tagline, tags, cover_url, card_color, year, role, featured, sort_order, image_1, image_2, image_3, image_4, image_5'
    )
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading projects:', error.message);
    return { projects: [], error: true };
  }
  return { projects: (data ?? []).map(prepare), error: false };
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
    .select('*')
    .eq('published', true)
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error loading project:', error.message);
    return null;
  }
  if (!data) return null;

  const project = prepare(data);

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
