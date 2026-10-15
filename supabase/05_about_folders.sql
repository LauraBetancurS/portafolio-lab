-- ─── Carpetas del bucket "about" (ej. los keycaps) ───
-- Pega esto en Supabase → SQL Editor → Run (una sola vez).
-- Un bucket público deja abrir cada imagen, pero no ver QUÉ archivos hay
-- en una carpeta. Esto le da permiso a la web de listar el bucket "about",
-- así las imágenes que subas a la carpeta aparecen solas en la página.
drop policy if exists "Public can list about" on storage.objects;
create policy "Public can list about"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'about');
