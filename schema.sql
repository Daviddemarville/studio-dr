-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  firstname text,
  lastname text,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.content_changes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  section_slug text NOT NULL,
  table_name text NOT NULL,
  record_id text,
  user_id uuid,
  action text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT content_changes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.content_offers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  section_slug text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  last_modified_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT content_offers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.content_pricing (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  section_slug text NOT NULL,
  offer_id uuid,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  price_ht numeric,
  tva_rate numeric DEFAULT 20.0,
  price_ttc numeric DEFAULT (price_ht * ((1)::numeric + (tva_rate / (100)::numeric))),
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  last_modified_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT content_pricing_pkey PRIMARY KEY (id),
  CONSTRAINT content_pricing_offer_id_fkey FOREIGN KEY (offer_id) REFERENCES public.content_offers(id)
);
CREATE TABLE public.content_work (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  section_slug text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_modified_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT content_work_pkey PRIMARY KEY (id)
);
CREATE TABLE public.content_custom_sections (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  section_slug text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_modified_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT content_custom_sections_pkey PRIMARY KEY (id)
);
CREATE TABLE public.content_workflow_steps (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  section_slug text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  step_number integer NOT NULL,
  is_active boolean DEFAULT true,
  last_modified_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT content_workflow_steps_pkey PRIMARY KEY (id)
);
CREATE TABLE public.settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  site_name text DEFAULT 'Studio DR'::text,
  language_default text DEFAULT 'fr'::text,
  maintenance_mode boolean DEFAULT false,
  logo_url text,
  tagline text,
  site_description text,
  favicon_url text,
  default_meta_image_url text,
  available_languages ARRAY DEFAULT ARRAY['fr'::text, 'en'::text],
  maintenance_message_fr text,
  maintenance_message_en text,
  maintenance_allowlist jsonb DEFAULT '[]'::jsonb,
  contact_email text,
  contact_phone text,
  contact_address text,
  google_maps_url text,
  social_facebook_url text,
  social_instagram_url text,
  social_linkedin_url text,
  social_github_url text,
  meta_default_title text,
  meta_default_description text,
  ga_tracking_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.site_sections (
  id integer NOT NULL DEFAULT nextval('site_sections_id_seq'::regclass),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  table_name text NOT NULL,
  is_active boolean DEFAULT true,
  position integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  icon text DEFAULT 'FileText'::text CHECK (icon = ANY (ARRAY['Layers'::text, 'FileText'::text, 'LayoutGrid'::text, 'Users'::text, 'Image'::text, 'Folder'::text, 'Wand2'::text, 'Wrench'::text, 'BookText'::text])),
  template_slug text,
  is_system boolean NOT NULL DEFAULT false,
  description text,
  CONSTRAINT site_sections_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  firstname text,
  lastname text,
  bio_fr text,
  bio_en text,
  avatar_url text,
  role text DEFAULT 'developer'::text CHECK (role = ANY (ARRAY['developer'::text, 'admin'::text])),
  is_public boolean DEFAULT true,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  pseudo text CHECK (pseudo IS NULL OR length(TRIM(BOTH FROM pseudo)) > 0),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- RLS POLICIES (Example)
ALTER TABLE public.content_custom_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.content_custom_sections
FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.content_custom_sections
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.content_custom_sections
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.content_custom_sections
FOR DELETE USING (auth.role() = 'authenticated');
