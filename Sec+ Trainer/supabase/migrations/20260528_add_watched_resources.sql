-- ==========================================================
-- Create Watched Resources Table
-- ==========================================================

create table if not exists public.watched_resources (
  watched_id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  resource_id text not null,
  watched_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- ==========================================================
-- Enable Row-Level Security (RLS)
-- ==========================================================

alter table public.watched_resources enable row level security;

-- ==========================================================
-- Define RLS Policies (User-owned CRUD)
-- ==========================================================

create policy "Users can CRUD own watched resources" on public.watched_resources
  for all using (auth.uid() = user_id);
