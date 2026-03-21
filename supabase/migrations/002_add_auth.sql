-- Migration: Add Auth & User Profiles
-- Run this in your Supabase SQL editor AFTER enabling Google OAuth in Auth settings

-- PROFILES table (linked to Supabase Auth)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text default '',
  avatar_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Add created_by to games
alter table public.games add column created_by uuid references public.profiles(id);

-- Add user_id to registrations (nullable for backward compat with existing data)
alter table public.registrations add column user_id uuid references public.profiles(id);

-- PROFILES RLS
alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Update GAMES RLS: drop old permissive policies, add auth-based ones
drop policy if exists "Games are publicly insertable" on public.games;
drop policy if exists "Games are publicly updatable" on public.games;
drop policy if exists "Games are publicly deletable" on public.games;

create policy "Authenticated users can create games"
  on public.games for insert with check (auth.uid() is not null);

create policy "Game creator can update"
  on public.games for update using (auth.uid() = created_by);

create policy "Game creator can delete"
  on public.games for delete using (auth.uid() = created_by);

-- Update REGISTRATIONS RLS: drop old permissive policies, add auth-based ones
drop policy if exists "Registrations are publicly insertable" on public.registrations;
drop policy if exists "Registrations are publicly updatable" on public.registrations;

create policy "Authenticated users can register"
  on public.registrations for insert with check (auth.uid() is not null);

create policy "Registration owner or game creator can update"
  on public.registrations for update using (
    auth.uid() = user_id or
    auth.uid() in (select created_by from public.games where id = game_id)
  );
