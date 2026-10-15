import { cacheLife } from 'next/cache';
import { supabase } from './supabase';

const ABOUT_BUCKET = 'about';
const STORAGE_BASE = 'https://mjwtcqrzadpsluakzfjg.supabase.co/storage/v1/object/public';
const IMAGE_FILE = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

// Todas las imágenes de una carpeta del bucket "about" (ordenadas por nombre).
// Si no se puede listar (falta el permiso de supabase/05_about_folders.sql), devuelve [].
export async function getAboutFolder(folder) {
  'use cache';
  cacheLife('minutes');
  const clean = (folder || '').trim().replace(/^\/+|\/+$/g, '');
  if (!clean) return [];
  try {
    const { data, error } = await supabase.storage
      .from(ABOUT_BUCKET)
      .list(clean, { limit: 100, sortBy: { column: 'name', order: 'asc' } });
    if (error || !data) return [];
    return data
      .filter(file => IMAGE_FILE.test(file.name) && !file.name.startsWith('.'))
      .map(file => ({
        name: file.name,
        url: `${STORAGE_BASE}/${ABOUT_BUCKET}/${[...clean.split('/'), file.name].map(encodeURIComponent).join('/')}`,
      }));
  } catch {
    return [];
  }
}
