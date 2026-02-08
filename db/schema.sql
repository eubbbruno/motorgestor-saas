-- MotorGestor (Supabase Postgres) - Schema (apenas tabelas, tipos, índices)
-- Execute PRIMEIRO este arquivo no Supabase SQL Editor.
-- Depois execute: db/rls.sql (RLS, policies, funções, triggers e FKs).

-- Extensions
create extension if not exists "pgcrypto";

-- Enums / Types
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

-- Tables (sem FKs / sem triggers / sem RLS)
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key,
  company_id uuid,
  role public.user_role not null default 'vendedor',
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_company_id_idx on public.profiles(company_id);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  created_by uuid,
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

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  created_by uuid,
  vehicle_id uuid,
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

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  created_by uuid,
  lead_id uuid,
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

