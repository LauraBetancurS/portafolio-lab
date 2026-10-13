-- ════════════════════════════════════════════════════════════════
--  PROYECTOS DEL PORTAFOLIO
--  Pega todo este archivo en Supabase → SQL Editor → New query → Run.
--  Crea 2 tablas:
--    projects       → un proyecto por fila (tarjeta + página de detalle)
--    project_media  → las imágenes/videos de cada proyecto (muchas por proyecto)
-- ════════════════════════════════════════════════════════════════


-- ─── 1. Tabla principal: projects ───────────────────────────────
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),

  -- Identidad
  slug          text not null unique,          -- la URL: /work/ruta-solar  (minúsculas y guiones)
  title         text not null,                 -- "Ruta Solar"
  tagline       text,                          -- frase corta para la tarjeta
  tags          text[] not null default '{}',  -- {"UX Research","UI Design"}

  -- Tarjeta en la página Work
  cover_url     text,                          -- imagen de portada (URL de Supabase Storage)
  card_color    text,                          -- color de fondo de la tarjeta, ej. "#F8D98C"

  -- Detalles del proyecto (la fila de datos de la página de detalle)
  client        text,                          -- "Promigas / GdO Solar"
  industry      text,                          -- "Energy"
  service       text,                          -- "Product Design"
  role          text,                          -- "UX/UI Designer"
  year          int,                           -- 2025
  duration      text,                          -- "8 weeks"
  team          text,                          -- "4 people: 2 designers, 2 devs"
  tools         text[] not null default '{}',  -- {"Figma","React"}

  -- Caso de estudio (texto largo; puedes usar saltos de línea)
  overview      text,                          -- resumen del proyecto
  challenge     text,                          -- el problema
  process       text,                          -- cómo lo resolviste
  outcome       text,                          -- resultados / qué aprendiste

  -- Enlaces opcionales
  live_url      text,
  prototype_url text,                          -- ej. Figma prototype
  repo_url      text,                          -- ej. GitHub

  -- Control
  featured      boolean not null default false, -- destacado (puede salir en el inicio)
  published     boolean not null default false, -- solo los publicados se ven en la web
  sort_order    int not null default 0,         -- orden en la lista (menor = primero)

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create index if not exists projects_order_idx on public.projects (published, sort_order);


-- ─── 2. Imágenes / videos de cada proyecto: project_media ──────
create table if not exists public.project_media (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  url         text not null,                    -- URL del archivo en Supabase Storage
  type        text not null default 'image'
              check (type in ('image', 'video')),
  alt         text,                             -- descripción para accesibilidad
  caption     text,                             -- texto pequeño debajo de la imagen
  layout      text not null default 'full'      -- full = ancho completo, half = mitad
              check (layout in ('full', 'half')),
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists project_media_project_idx on public.project_media (project_id, sort_order);


-- ─── 3. updated_at se actualiza solo al editar un proyecto ─────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();


-- ─── 4. Seguridad (RLS) ─────────────────────────────────────────
-- Cualquiera puede LEER los proyectos publicados (y sus imágenes).
-- Nadie puede crear/editar/borrar desde la web: eso lo haces tú
-- desde el panel de Supabase (Table Editor), que no pasa por RLS.
alter table public.projects      enable row level security;
alter table public.project_media enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
  on public.projects for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Public can read media of published projects" on public.project_media;
create policy "Public can read media of published projects"
  on public.project_media for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_media.project_id and p.published = true
    )
  );
