-- Migration: SaaS plans + subscriptions (idempotente)
-- Cria estrutura de planos/assinaturas + seeds + helpers + enforcement de limites.
-- Depende de `public.current_company_id()` (definida em db/rls.sql).

-- Tables
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  price numeric(12,2) not null default 0,
  max_vehicles int not null,
  max_leads int not null,
  ai_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  plan_id uuid not null,
  status text not null default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists subscriptions_company_unique on public.subscriptions(company_id);
create index if not exists subscriptions_plan_id_idx on public.subscriptions(plan_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);

-- Foreign keys (idempotente)
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'subscriptions_company_id_fkey') then
    alter table public.subscriptions
      add constraint subscriptions_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'subscriptions_plan_id_fkey') then
    alter table public.subscriptions
      add constraint subscriptions_plan_id_fkey
      foreign key (plan_id) references public.plans(id) on delete restrict;
  end if;
end $$;

-- Seeds (upsert by name)
insert into public.plans (name, price, max_vehicles, max_leads, ai_enabled)
values
  ('Free', 0, 5, 20, false),
  ('Pro', 99, 1000, 1000, true)
on conflict (name) do update set
  price = excluded.price,
  max_vehicles = excluded.max_vehicles,
  max_leads = excluded.max_leads,
  ai_enabled = excluded.ai_enabled;

-- RLS
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;

-- Policies
drop policy if exists "plans_select_public" on public.plans;
create policy "plans_select_public"
on public.plans
for select
to public
using (true);

drop policy if exists "subscriptions_select_company" on public.subscriptions;
create policy "subscriptions_select_company"
on public.subscriptions
for select
to authenticated
using (company_id = public.current_company_id());

drop policy if exists "subscriptions_insert_admin" on public.subscriptions;
create policy "subscriptions_insert_admin"
on public.subscriptions
for insert
to authenticated
with check (public.is_admin() and company_id = public.current_company_id());

drop policy if exists "subscriptions_update_admin" on public.subscriptions;
create policy "subscriptions_update_admin"
on public.subscriptions
for update
to authenticated
using (public.is_admin() and company_id = public.current_company_id())
with check (public.is_admin() and company_id = public.current_company_id());

-- Helpers (current tenant)
create or replace function public.get_company_plan()
returns table (
  id uuid,
  name text,
  price numeric,
  max_vehicles int,
  max_leads int,
  ai_enabled boolean
)
language sql
stable
as $$
  with sub as (
    select s.plan_id
    from public.subscriptions s
    where s.company_id = public.current_company_id()
      and s.status in ('active','trialing')
    order by s.created_at desc
    limit 1
  )
  select
    p.id,
    p.name,
    p.price,
    p.max_vehicles,
    p.max_leads,
    p.ai_enabled
  from public.plans p
  where p.id = (select plan_id from sub)
     or (not exists (select 1 from sub) and p.name = 'Free')
  order by case when p.name = 'Free' then 2 else 1 end
  limit 1;
$$;

create or replace function public.get_company_usage()
returns table (
  plan_name text,
  plan_price numeric,
  max_vehicles int,
  max_leads int,
  ai_enabled boolean,
  used_vehicles bigint,
  used_leads bigint
)
language sql
stable
as $$
  with plan as (
    select * from public.get_company_plan()
  )
  select
    plan.name as plan_name,
    plan.price as plan_price,
    plan.max_vehicles,
    plan.max_leads,
    plan.ai_enabled,
    (select count(*)::bigint from public.vehicles v where v.company_id = public.current_company_id()) as used_vehicles,
    (select count(*)::bigint from public.leads l where l.company_id = public.current_company_id()) as used_leads
  from plan;
$$;

grant execute on function public.get_company_plan() to authenticated;
grant execute on function public.get_company_usage() to authenticated;

-- Enforcement (bloqueia criação quando atingir limites)
create or replace function public.enforce_vehicle_plan_limit()
returns trigger
language plpgsql
as $$
declare
  p record;
  used bigint;
begin
  select * into p from public.get_company_plan();
  if p is null then
    return new;
  end if;

  select count(*)::bigint into used
  from public.vehicles v
  where v.company_id = new.company_id;

  if used >= p.max_vehicles then
    raise exception 'PLAN_LIMIT_MAX_VEHICLES';
  end if;

  return new;
end;
$$;

create or replace function public.enforce_lead_plan_limit()
returns trigger
language plpgsql
as $$
declare
  p record;
  used bigint;
begin
  select * into p from public.get_company_plan();
  if p is null then
    return new;
  end if;

  select count(*)::bigint into used
  from public.leads l
  where l.company_id = new.company_id;

  if used >= p.max_leads then
    raise exception 'PLAN_LIMIT_MAX_LEADS';
  end if;

  return new;
end;
$$;

drop trigger if exists vehicles_enforce_plan_limit on public.vehicles;
create trigger vehicles_enforce_plan_limit
before insert on public.vehicles
for each row execute function public.enforce_vehicle_plan_limit();

drop trigger if exists leads_enforce_plan_limit on public.leads;
create trigger leads_enforce_plan_limit
before insert on public.leads
for each row execute function public.enforce_lead_plan_limit();

