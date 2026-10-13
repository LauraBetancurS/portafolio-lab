-- ════════════════════════════════════════════════════════════════
--  OPCIONAL: proyecto de ejemplo para probar la página.
--  Córrelo DESPUÉS de 01_projects.sql. Bórralo cuando subas los tuyos:
--    delete from public.projects where slug = 'example-project';
--  (sus imágenes se borran solas)
-- ════════════════════════════════════════════════════════════════

with new_project as (
  insert into public.projects (
    slug, title, tagline, tags, card_color,
    client, industry, service, role, year, duration, team, tools,
    overview, challenge, process, outcome,
    featured, published, sort_order
  ) values (
    'example-project',
    'Example Project',
    'A placeholder case study to test the Work page.',
    array['UX Research', 'UI Design'],
    '#F8D98C',
    'Example Client', 'Education', 'Product Design', 'Product Designer', 2026, '6 weeks',
    '3 people', array['Figma', 'React', 'Supabase'],
    'Short summary of the project: who it was for and what you built.',
    'What problem were people facing? Why did it matter?',
    'How you approached it: research, ideas you tried, decisions you made.',
    'What happened in the end: results, feedback, what you learned.',
    true, true, 1
  )
  returning id
)
insert into public.project_media (project_id, url, alt, caption, layout, sort_order)
select id, url, alt, caption, layout, sort_order
from new_project,
(values
  ('https://mjwtcqrzadpsluakzfjg.supabase.co/storage/v1/object/public/HOMEPAGE/notedrawing/Note_drawing_1.svg',
   'Placeholder image', 'Replace this with a real screen from your project', 'full', 1),
  ('https://mjwtcqrzadpsluakzfjg.supabase.co/storage/v1/object/public/HOMEPAGE/notedrawing/Note_drawing_2.svg',
   'Placeholder image', null, 'half', 2),
  ('https://mjwtcqrzadpsluakzfjg.supabase.co/storage/v1/object/public/HOMEPAGE/PFP_%20BIG_BLUE.svg',
   'Placeholder image', null, 'half', 3)
) as media(url, alt, caption, layout, sort_order);
