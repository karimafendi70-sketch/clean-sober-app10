-- Create table for sober tracking entries
-- Run this SQL in your Supabase project's SQL editor

create table if not exists sober_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  start_date timestamptz not null,
  days int not null default 0,
  created_at timestamptz default now()
);

create index if not exists idx_sober_entries_user on sober_entries(user_id);
