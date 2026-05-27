-- ==========================================================
-- 1. Create Tables
-- ==========================================================

-- Profiles (User Metadata)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  updated_at timestamp with time zone not null default now(),
  username text,
  avatar_url text
);

-- Sessions Table
create table public.sessions (
  session_id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  mode text not null,
  target_id text,
  started_at timestamp with time zone not null,
  ended_at timestamp with time zone,
  timed boolean not null default false,
  time_limit_seconds integer,
  updated_at timestamp with time zone not null default now()
);

-- Attempts Table
create table public.attempts (
  attempt_id uuid primary key,
  session_id uuid references public.sessions(session_id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade not null,
  question_id text not null,
  objective_id text not null,
  timestamp timestamp with time zone not null,
  correct boolean not null,
  selected_answers text[] not null,
  confidence text not null,
  elapsed_ms integer not null,
  updated_at timestamp with time zone not null default now()
);

-- Mastery Snapshots Table
create table public.mastery_snapshots (
  objective_id text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  accuracy numeric not null default 0.0,
  consistency numeric not null default 0.0,
  confidence numeric not null default 0.0,
  recency numeric not null default 0.0,
  variety numeric not null default 0.0,
  speed numeric not null default 0.0,
  score numeric not null default 0.0,
  label text not null default 'Not Started',
  next_review_at timestamp with time zone,
  updated_at timestamp with time zone not null default now(),
  primary key (user_id, objective_id)
);

-- Custom Resources Table
create table public.resources (
  resource_id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  objective_id text not null,
  type text not null,
  title text not null,
  url text not null,
  license_note text,
  updated_at timestamp with time zone not null default now()
);

-- Mistake Journal Table
create table public.mistake_journal (
  journal_id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  attempt_id uuid not null,
  question_id text not null,
  domain_id text not null,
  objective_id text not null,
  mistake_type text not null,
  user_note text not null,
  followup_task text,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null default now()
);

-- Sync Events Log Table
create table public.sync_events (
  event_id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  direction text not null, -- 'push', 'pull', 'sync'
  status text not null, -- 'success', 'error'
  records_synced integer not null default 0,
  timestamp timestamp with time zone not null default now(),
  error_message text
);

-- ==========================================================
-- 2. Enable Row-Level Security (RLS)
-- ==========================================================

alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.attempts enable row level security;
alter table public.mastery_snapshots enable row level security;
alter table public.resources enable row level security;
alter table public.mistake_journal enable row level security;
alter table public.sync_events enable row level security;

-- ==========================================================
-- 3. Define RLS Policies (User-owned CRUD)
-- ==========================================================

-- Profiles policies
create policy "Users can view any profile" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Sessions policies
create policy "Users can CRUD own sessions" on public.sessions
  for all using (auth.uid() = user_id);

-- Attempts policies
create policy "Users can CRUD own attempts" on public.attempts
  for all using (auth.uid() = user_id);

-- Mastery Snapshots policies
create policy "Users can CRUD own mastery snapshots" on public.mastery_snapshots
  for all using (auth.uid() = user_id);

-- Resources policies
create policy "Users can CRUD own resources" on public.resources
  for all using (auth.uid() = user_id);

-- Mistake Journal policies
create policy "Users can CRUD own mistake journal entries" on public.mistake_journal
  for all using (auth.uid() = user_id);

-- Sync Events policies
create policy "Users can view own sync events" on public.sync_events
  for select using (auth.uid() = user_id);

create policy "Users can insert own sync events" on public.sync_events
  for insert with check (auth.uid() = user_id);

-- ==========================================================
-- 4. User Profile Creation Trigger on Sign-Up
-- ==========================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
