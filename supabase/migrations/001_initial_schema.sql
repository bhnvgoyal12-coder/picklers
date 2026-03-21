-- Picklers Database Schema
-- Run this in your Supabase SQL editor

create extension if not exists "uuid-ossp";

-- GAMES
create table public.games (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text default '',
  date date not null,
  start_time time not null,
  end_time time not null,
  location_name text not null,
  location_address text default '',
  location_map_url text default '',
  court_info text default '',
  max_players int not null default 8,
  price_per_player int not null default 0,        -- in paise (INR smallest unit)
  currency text not null default 'INR',
  status text not null default 'upcoming' check (status in ('upcoming', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_games_date on public.games(date);
create index idx_games_status on public.games(status);

-- REGISTRATIONS (no auth required - uses name/phone)
create table public.registrations (
  id uuid primary key default uuid_generate_v4(),
  game_id uuid not null references public.games(id) on delete cascade,
  player_name text not null,
  player_phone text not null,
  player_email text default '',
  razorpay_order_id text,
  razorpay_payment_id text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  payment_amount int not null default 0,           -- in paise
  registered_at timestamptz not null default now(),
  unique(game_id, player_phone)
);

create index idx_registrations_game on public.registrations(game_id);
create index idx_registrations_phone on public.registrations(player_phone);
create index idx_registrations_payment on public.registrations(payment_status);

-- RLS: For v1 (no auth), allow all operations
-- You can tighten these once auth is added

alter table public.games enable row level security;
alter table public.registrations enable row level security;

-- Games: anyone can read and write (admin restriction will come with auth)
create policy "Games are publicly readable"
  on public.games for select using (true);

create policy "Games are publicly insertable"
  on public.games for insert with check (true);

create policy "Games are publicly updatable"
  on public.games for update using (true);

create policy "Games are publicly deletable"
  on public.games for delete using (true);

-- Registrations: anyone can read and write
create policy "Registrations are publicly readable"
  on public.registrations for select using (true);

create policy "Registrations are publicly insertable"
  on public.registrations for insert with check (true);

create policy "Registrations are publicly updatable"
  on public.registrations for update using (true);
