-- ─── Proyectos en español ───────────────────────────────────
-- Pega esto en Supabase → SQL Editor → Run (una sola vez).
--
-- Agrega una columna "_es" por cada texto del proyecto. Cuando alguien pone
-- la página en español (botón EN / ES del navbar), se usa la columna _es;
-- si está vacía, se muestra el texto en inglés. Así puedes ir traduciendo
-- de a poquito, sin que nada se rompa.

alter table public.projects
  add column if not exists title_es     text,
  add column if not exists tagline_es   text,
  add column if not exists tags_es      text[],
  add column if not exists industry_es  text,
  add column if not exists service_es   text,
  add column if not exists role_es      text,
  add column if not exists duration_es  text,
  add column if not exists team_es      text,
  add column if not exists overview_es  text,
  add column if not exists challenge_es text,
  add column if not exists process_es   text,
  add column if not exists outcome_es   text;

-- Las cifras de la columna "stats" también pueden llevar español,
-- con "label_es" en cada una:
--   [{"value": "72%", "label": "of users finished", "label_es": "de los usuarios terminó"}]

-- Ejemplo (cambia el slug y los textos por los tuyos):
-- update public.projects set
--   tagline_es   = 'Una frase corta en español',
--   role_es      = 'Diseñadora UX/UI',
--   tags_es      = '{"Investigación UX","Diseño UI"}',
--   overview_es  = 'Resumen del proyecto…',
--   challenge_es = 'El problema…',
--   process_es   = 'Cómo lo resolvimos…',
--   outcome_es   = 'Resultados…'
-- where slug = 'solar-fit';
