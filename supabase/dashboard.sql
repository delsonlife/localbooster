-- ============================================================
-- Dashboard — Supabase Auth + RLS
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- (après avoir exécuté supabase/schema.sql)
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  license_key text not null references licenses (license_key) on delete cascade,
  role text not null default 'owner',
  created_at timestamp default now()
);

alter table profiles enable row level security;
alter table licenses enable row level security;
alter table ratings enable row level security;
alter table feedbacks enable row level security;

create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

create policy "licenses_select_own" on licenses
  for select using (
    license_key in (select license_key from profiles where id = auth.uid())
  );

create policy "licenses_update_own" on licenses
  for update using (
    license_key in (select license_key from profiles where id = auth.uid())
  );

create policy "ratings_select_own" on ratings
  for select using (
    license_key in (select license_key from profiles where id = auth.uid())
  );

create policy "feedbacks_select_own" on feedbacks
  for select using (
    license_key in (select license_key from profiles where id = auth.uid())
  );

-- ============================================================
-- Créer un premier utilisateur dashboard (à faire manuellement)
-- ============================================================
-- 1. Supabase Dashboard > Authentication > Users > Add user
-- 2. Copier l'UUID de l'utilisateur créé
-- 3. insert into profiles (id, license_key, role)
--    values ('UUID_DE_L_UTILISATEUR', 'ABC123', 'owner');
