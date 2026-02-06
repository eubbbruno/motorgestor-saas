-- MotorGestor (Supabase Postgres) - Schema + RLS
-- Execute este arquivo no Supabase SQL Editor.

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type public.user_role as enum ('admin', 'vendedor');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.vehicle_status as enum ('disponivel', 'reservado', 'vendido', 'inativo');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.lead_status as enum ('novo', 'contato', 'visita', 'proposta', 'ganho', 'perdido');
exception
  when duplicate_object then null;
end $$;

-- Timestamps helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Auth helpers for RLS
create or replace function public.current_user_id()
returns uuid
language sql
stable
as $$
  select auth.uid();
$$;

create or replace function public.current_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.company_id
  from public.profiles p
  where p.id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select p.role = 'admin' from public.profiles p where p.id = auth.uid()), false);
$$;

-- Tables
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger companies_set_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  role public.user_role not null default 'vendedor',
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_company_id_idx on public.profiles(company_id);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  make text,
  model text,
  year int,
  price numeric(12,2),
  mileage int,
  fuel text,
  transmission text,
  color text,
  status public.vehicle_status not null default 'disponivel',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vehicles_company_id_idx on public.vehicles(company_id);
create index if not exists vehicles_company_status_idx on public.vehicles(company_id, status);

create trigger vehicles_set_updated_at
before update on public.vehicles
for each row execute function public.set_updated_at();

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  name text not null,
  phone text,
  email text,
  source text,
  status public.lead_status not null default 'novo',
  last_contact_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_company_id_idx on public.leads(company_id);
create index if not exists leads_company_status_idx on public.leads(company_id, status);
create index if not exists leads_vehicle_id_idx on public.leads(vehicle_id);

create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz,
  location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_company_id_idx on public.events(company_id);
create index if not exists events_start_at_idx on public.events(start_at);

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  phone text,
  message text not null,
  page_path text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.leads enable row level security;
alter table public.events enable row level security;
alter table public.contact_messages enable row level security;

-- Companies policies
drop policy if exists "companies_select_own" on public.companies;
create policy "companies_select_own"
on public.companies
for select
using (id = public.current_company_id());

drop policy if exists "companies_insert_authenticated" on public.companies;
create policy "companies_insert_authenticated"
on public.companies
for insert
to authenticated
with check (true);

drop policy if exists "companies_update_admin" on public.companies;
create policy "companies_update_admin"
on public.companies
for update
to authenticated
using (public.is_admin() and id = public.current_company_id())
with check (public.is_admin() and id = public.current_company_id());

drop policy if exists "companies_delete_admin" on public.companies;
create policy "companies_delete_admin"
on public.companies
for delete
to authenticated
using (public.is_admin() and id = public.current_company_id());

-- Profiles policies
drop policy if exists "profiles_select_company" on public.profiles;
create policy "profiles_select_company"
on public.profiles
for select
to authenticated
using (id = public.current_user_id() or company_id = public.current_company_id());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles
for insert
to authenticated
with check (id = public.current_user_id());

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin"
on public.profiles
for update
to authenticated
using (
  id = public.current_user_id()
  or (public.is_admin() and company_id = public.current_company_id())
)
with check (
  id = public.current_user_id()
  or (public.is_admin() and company_id = public.current_company_id())
);

-- Vehicles policies
drop policy if exists "vehicles_select_company" on public.vehicles;
create policy "vehicles_select_company"
on public.vehicles
for select
to authenticated
using (company_id = public.current_company_id());

drop policy if exists "vehicles_insert_company" on public.vehicles;
create policy "vehicles_insert_company"
on public.vehicles
for insert
to authenticated
with check (company_id = public.current_company_id());

drop policy if exists "vehicles_update_company" on public.vehicles;
create policy "vehicles_update_company"
on public.vehicles
for update
to authenticated
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

drop policy if exists "vehicles_delete_company" on public.vehicles;
create policy "vehicles_delete_company"
on public.vehicles
for delete
to authenticated
using (company_id = public.current_company_id());

-- Leads policies
drop policy if exists "leads_select_company" on public.leads;
create policy "leads_select_company"
on public.leads
for select
to authenticated
using (company_id = public.current_company_id());

drop policy if exists "leads_insert_company" on public.leads;
create policy "leads_insert_company"
on public.leads
for insert
to authenticated
with check (company_id = public.current_company_id());

drop policy if exists "leads_update_company" on public.leads;
create policy "leads_update_company"
on public.leads
for update
to authenticated
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

drop policy if exists "leads_delete_company" on public.leads;
create policy "leads_delete_company"
on public.leads
for delete
to authenticated
using (company_id = public.current_company_id());

-- Events policies
drop policy if exists "events_select_company" on public.events;
create policy "events_select_company"
on public.events
for select
to authenticated
using (company_id = public.current_company_id());

drop policy if exists "events_insert_company" on public.events;
create policy "events_insert_company"
on public.events
for insert
to authenticated
with check (company_id = public.current_company_id());

drop policy if exists "events_update_company" on public.events;
create policy "events_update_company"
on public.events
for update
to authenticated
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

drop policy if exists "events_delete_company" on public.events;
create policy "events_delete_company"
on public.events
for delete
to authenticated
using (company_id = public.current_company_id());

-- Contact messages policies (public form)
drop policy if exists "contact_messages_insert_public" on public.contact_messages;
create policy "contact_messages_insert_public"
on public.contact_messages
for insert
with check (true);

drop policy if exists "contact_messages_select_admin" on public.contact_messages;
create policy "contact_messages_select_admin"
on public.contact_messages
for select
to authenticated
using (public.is_admin());

