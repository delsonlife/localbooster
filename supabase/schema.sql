-- ============================================================
-- Schéma Supabase — SaaS Avis Google
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- Table des licences (une par entreprise cliente)
create table if not exists licenses (
  id uuid primary key default gen_random_uuid(),

  license_key text unique not null,

  company_name text not null,

  company_email text not null,

  google_review_url text not null,

  -- Couleur d'accent personnalisée (boutons, focus...) au format HEX.
  -- Permet de personnaliser le widget par entreprise sans toucher au code.
  primary_color text not null default '#2563eb',

  active boolean default true,

  created_at timestamp default now()
);

-- Table des notes (1 à 5 étoiles, toutes confondues)
create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),

  license_key text not null,

  rating integer not null check (rating between 1 and 5),

  created_at timestamp default now()
);

-- Table des retours détaillés (pour les notes 1 à 3)
create table if not exists feedbacks (
  id uuid primary key default gen_random_uuid(),

  license_key text not null,

  rating integer not null check (rating between 1 and 5),

  title text,

  comment text not null,

  created_at timestamp default now()
);

-- Index utiles pour les recherches par licence
create index if not exists idx_ratings_license_key on ratings (license_key);
create index if not exists idx_feedbacks_license_key on feedbacks (license_key);

-- ============================================================
-- Exemple de licence de test (à adapter / supprimer)
-- ============================================================
insert into licenses (license_key, company_name, company_email, google_review_url, primary_color)
values (
  'ABC123',
  'Toiture Martin',
  'contact@toiture-martin.fr',
  'https://g.page/r/xxxxxxxxxxxx/review',
  '#2563eb'
)
on conflict (license_key) do nothing;
