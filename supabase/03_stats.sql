-- ─── Cifras clave ("At a glance") para la página de cada proyecto ───
-- Pega esto en Supabase → SQL Editor → Run.
-- Es opcional: si un proyecto no tiene stats, esa sección simplemente no aparece.
-- Formato: una lista de { "value": "72%", "label": "lo que significa" } (máximo 6).

alter table public.projects add column if not exists stats jsonb;

update public.projects set stats = '[
  {"value": "72%", "label": "had trouble coordinating with friends to buy concert tickets"},
  {"value": "61%", "label": "used several apps to organize a single event"},
  {"value": "81%", "label": "prefer going to concerts as a group"}
]'::jsonb where slug = 'moshoo';

update public.projects set stats = '[
  {"value": "90%", "label": "started cooking with the app, vs. 75% with a PDF"},
  {"value": "93%", "label": "of recipe steps met the time threshold"},
  {"value": "20", "label": "participants in a counterbalanced experiment"}
]'::jsonb where slug = 'sizzle';

update public.projects set stats = '[
  {"value": "10+", "label": "users in Cali tested the experience"},
  {"value": "2", "label": "personas: The Saver and The Resilient"},
  {"value": "3", "label": "connected solutions: landing, profile quiz and energy simulator"}
]'::jsonb where slug = 'solar-fit';

update public.projects set stats = '[
  {"value": "4.1/5", "label": "average satisfaction with the recommended destination"},
  {"value": "53%", "label": "would use it on a real trip"},
  {"value": "4", "label": "group decision models compared side by side"}
]'::jsonb where slug = 'tripmatch';

update public.projects set stats = '[
  {"value": "4", "label": "phases explained: planning, assessment, evaluation and improvement"}
]'::jsonb where slug = 'meca-timeline';

update public.projects set stats = '[
  {"value": "17", "label": "week roadmap, split into four phases"},
  {"value": "5", "label": "event platforms benchmarked to find the gap"}
]'::jsonb where slug = 'meetzy';
