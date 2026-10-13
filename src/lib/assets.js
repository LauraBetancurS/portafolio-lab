// URLs de archivos guardados en Supabase Storage.
// Formato: https://<proyecto>.supabase.co/storage/v1/object/public/<bucket>/<archivo>
const STORAGE = "https://mjwtcqrzadpsluakzfjg.supabase.co/storage/v1/object/public";
const BUCKET = "assets"; // ← cambia esto por el nombre real de tu bucket

export const LOGO_URL = `${STORAGE}/${BUCKET}/icon.svg`;
