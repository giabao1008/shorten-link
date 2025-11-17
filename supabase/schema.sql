create table if not exists public.links (
  id text primary key,
  original_url text not null,
  short_code text not null unique,
  custom_slug text,
  clicks integer not null default 0,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  click_history jsonb not null default '[]'::jsonb
);

create table if not exists public.admin_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.links enable row level security;
alter table public.admin_settings enable row level security;

create policy "Allow anonymous read links" on public.links
  for select
  using (true);

create policy "Allow anonymous insert links" on public.links
  for insert
  with check (true);

create policy "Allow anonymous update links" on public.links
  for update
  using (true)
  with check (true);

create policy "Allow anonymous delete links" on public.links
  for delete
  using (true);

create policy "Allow anonymous read admin settings" on public.admin_settings
  for select
  using (true);

create policy "Allow anonymous upsert admin settings" on public.admin_settings
  for insert
  with check (true);

create policy "Allow anonymous update admin settings" on public.admin_settings
  for update
  using (true)
  with check (true);
