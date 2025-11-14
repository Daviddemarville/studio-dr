-- ================================================
-- TABLE UTILISATEURS (profil public)
-- ================================================
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text,
  firstname text,
  lastname text,
  bio_fr text,
  bio_en text,
  avatar_url text,
  role text check (role in ('developer','admin')) default 'developer',
  is_public boolean default true,
  is_approved boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ================================================
-- TABLE SECTIONS DE CONTENU (texte statique dynamique)
-- ================================================
create table if not exists content_sections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_fr text,
  title_en text,
  body_fr text,
  body_en text,
  last_modified_by uuid references users(id) on delete set null,
  updated_at timestamptz default now()
);

-- ================================================
-- TABLE OFFRES COMMERCIALES
-- ================================================
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  title_fr text,
  title_en text,
  short_fr text,
  short_en text,
  long_fr text,
  long_en text,
  price_ht numeric(10,2),
  is_active boolean default true,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ================================================
-- TABLE ETAPES DE TRAVAIL
-- ================================================
create table if not exists workflow_steps (
  id uuid primary key default gen_random_uuid(),
  step_number int,
  title_fr text,
  title_en text,
  text_fr text,
  text_en text,
  is_active boolean default true,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ================================================
-- TABLE PARAMÈTRES GLOBAUX
-- ================================================
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  site_name text default 'Studio DR',
  logo_url text,
  language_default text default 'fr',
  maintenance_mode boolean default false
);

-- ================================================
-- RLS
-- ================================================
alter table users enable row level security;
alter table content_sections enable row level security;
alter table offers enable row level security;
alter table workflow_steps enable row level security;

create policy "users_self_update"
on users for update using (auth.uid() = id);

create policy "read_public_users"
on users for select using (is_public = true);

create policy "sections_read_all"
on content_sections for select using (true);

create policy "offers_public"
on offers for select using (is_active = true);

create policy "workflow_steps_public"
on workflow_steps for select using (is_active = true);

-- ================================================
-- INSERT DEFAULT SETTINGS
-- ================================================
insert into settings (site_name, language_default, maintenance_mode)
values ('Studio DR', 'fr', false)
on conflict do nothing;
-- ================================================
-- TABLE UTILISATEURS (profil public)
-- ================================================
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text,
  firstname text,
  lastname text,
  bio_fr text,
  bio_en text,
  avatar_url text,
  role text check (role in ('developer','admin')) default 'developer',
  is_public boolean default true,
  is_approved boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ================================================
-- TABLE SECTIONS DE CONTENU (texte statique dynamique)
-- ================================================
create table if not exists content_sections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_fr text,
  title_en text,
  body_fr text,
  body_en text,
  last_modified_by uuid references users(id) on delete set null,
  updated_at timestamptz default now()
);

-- ================================================
-- TABLE OFFRES COMMERCIALES
-- ================================================
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  title_fr text,
  title_en text,
  short_fr text,
  short_en text,
  long_fr text,
  long_en text,
  price_ht numeric(10,2),
  is_active boolean default true,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ================================================
-- TABLE ETAPES DE TRAVAIL
-- ================================================
create table if not exists workflow_steps (
  id uuid primary key default gen_random_uuid(),
  step_number int,
  title_fr text,
  title_en text,
  text_fr text,
  text_en text,
  is_active boolean default true,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ================================================
-- TABLE PARAMÈTRES GLOBAUX
-- ================================================
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  site_name text default 'Studio DR',
  logo_url text,
  language_default text default 'fr',
  maintenance_mode boolean default false
);

-- ================================================
-- RLS
-- ================================================
alter table users enable row level security;
alter table content_sections enable row level security;
alter table offers enable row level security;
alter table workflow_steps enable row level security;

create policy "users_self_update"
on users for update using (auth.uid() = id);

create policy "read_public_users"
on users for select using (is_public = true);

create policy "sections_read_all"
on content_sections for select using (true);

create policy "offers_public"
on offers for select using (is_active = true);

create policy "workflow_steps_public"
on workflow_steps for select using (is_active = true);

-- ================================================
-- INSERT DEFAULT SETTINGS
-- ================================================
insert into settings (site_name, language_default, maintenance_mode)
values ('Studio DR', 'fr', false)
on conflict do nothing;
