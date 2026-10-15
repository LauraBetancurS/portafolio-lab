-- ─── Imágenes de cada proyecto desde su carpeta en Storage ───
-- Pega esto en Supabase → SQL Editor → Run (una sola vez).
--
-- Cómo funciona después:
--   1. Sube las imágenes del proyecto a una carpeta del bucket "proyects",
--      por ejemplo  proyects/solar/
--   2. Escribe el nombre de esa carpeta en la columna "folder" del proyecto
--      (si la dejas vacía, se usa el slug: proyects/solar-fit/).
--   3. Listo: todas las imágenes de la carpeta salen en la página del proyecto.
--      Se ordenan por nombre → llámalas 01.png, 02.png, 03.png…
--      Si una se llama "portada" (o "cover"), esa es la portada.

-- 1) Columna para la carpeta de cada proyecto
alter table public.projects add column if not exists folder text;

-- 2) Permitir que la web vea QUÉ archivos hay en el bucket "proyects"
--    (un bucket público deja abrir cada imagen, pero no listar la carpeta)
drop policy if exists "Public can list proyects" on storage.objects;
create policy "Public can list proyects"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'proyects');

-- 3) Carpetas de tus proyectos (cambia los nombres por los tuyos)
update public.projects set folder = 'solar' where slug = 'solar-fit';
-- update public.projects set folder = 'moshoo'    where slug = 'moshoo';
-- update public.projects set folder = 'sizzle'    where slug = 'sizzle';
-- update public.projects set folder = 'tripmatch' where slug = 'tripmatch';
-- update public.projects set folder = 'meca'      where slug = 'meca-timeline';
