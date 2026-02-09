-- MotorGestor (Supabase Postgres) - Constraints + Triggers + RLS + Policies
-- Execute DEPOIS de db/schema.sql em um projeto Supabase novo.
--
-- Para bancos existentes: rode primeiro `db/migrations/2026_onboarding_companies.sql`,
-- depois rode este arquivo.

-- Helper: updated_at
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

-- (Opcional mas seguro) grants para funções usadas em policies
grant execute on function public.current_user_id() to authenticated;
grant execute on function public.current_company_id() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- Foreign keys (aplicadas APÓS as tabelas existirem)
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'companies_created_by_fkey') then
    alter table public.companies
      add constraint companies_created_by_fkey
      foreign key (created_by) references auth.users(id) on delete restrict;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_id_fkey') then
    alter table public.profiles
      add constraint profiles_id_fkey
      foreign key (id) references auth.users(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_company_id_fkey') then
    alter table public.profiles
      add constraint profiles_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'vehicles_company_id_fkey') then
    alter table public.vehicles
      add constraint vehicles_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'vehicles_created_by_fkey') then
    alter table public.vehicles
      add constraint vehicles_created_by_fkey
      foreign key (created_by) references public.profiles(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'leads_company_id_fkey') then
    alter table public.leads
      add constraint leads_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'leads_created_by_fkey') then
    alter table public.leads
      add constraint leads_created_by_fkey
      foreign key (created_by) references public.profiles(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'leads_vehicle_id_fkey') then
    alter table public.leads
      add constraint leads_vehicle_id_fkey
      foreign key (vehicle_id) references public.vehicles(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'events_company_id_fkey') then
    alter table public.events
      add constraint events_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'events_created_by_fkey') then
    alter table public.events
      add constraint events_created_by_fkey
      foreign key (created_by) references public.profiles(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'events_lead_id_fkey') then
    alter table public.events
      add constraint events_lead_id_fkey
      foreign key (lead_id) references public.leads(id) on delete set null;
  end if;
end $$;

-- Triggers (drop/recreate para ser idempotente)
drop trigger if exists companies_set_updated_at on public.companies;
create trigger companies_set_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists vehicles_set_updated_at on public.vehicles;
create trigger vehicles_set_updated_at
before update on public.vehicles
for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

-- RLS enable
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
to authenticated
using (
  id = public.current_company_id()
  or created_by = public.current_user_id()
);

drop policy if exists "companies_insert_authenticated" on public.companies;
create policy "companies_insert_authenticated"
on public.companies
for insert
to authenticated
with check (
  auth.uid() is not null
  and created_by = auth.uid()
);

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
  -- sempre permite o usuário atualizar o próprio profile (onboarding)
  id = public.current_user_id()
  -- e também permite admin do tenant gerenciar usuários do tenant
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

-- MotorGestor (Supabase Postgres) - Constraints + Triggers + RLS + Policies
-- Execute DEPOIS de db/schema.sql em um projeto Supabase novo.

-- Helper: updated_at
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

-- (Opcional mas seguro) grants para funções usadas em policies
grant execute on function public.current_user_id() to authenticated;
grant execute on function public.current_company_id() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- Foreign keys (aplicadas APÓS as tabelas existirem)
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'companies_created_by_fkey') then
    alter table public.companies
      add constraint companies_created_by_fkey
      foreign key (created_by) references auth.users(id) on delete restrict;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_id_fkey') then
    alter table public.profiles
      add constraint profiles_id_fkey
      foreign key (id) references auth.users(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_company_id_fkey') then
    alter table public.profiles
      add constraint profiles_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'vehicles_company_id_fkey') then
    alter table public.vehicles
      add constraint vehicles_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'vehicles_created_by_fkey') then
    alter table public.vehicles
      add constraint vehicles_created_by_fkey
      foreign key (created_by) references public.profiles(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'leads_company_id_fkey') then
    alter table public.leads
      add constraint leads_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'leads_created_by_fkey') then
    alter table public.leads
      add constraint leads_created_by_fkey
      foreign key (created_by) references public.profiles(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'leads_vehicle_id_fkey') then
    alter table public.leads
      add constraint leads_vehicle_id_fkey
      foreign key (vehicle_id) references public.vehicles(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'events_company_id_fkey') then
    alter table public.events
      add constraint events_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'events_created_by_fkey') then
    alter table public.events
      add constraint events_created_by_fkey
      foreign key (created_by) references public.profiles(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'events_lead_id_fkey') then
    alter table public.events
      add constraint events_lead_id_fkey
      foreign key (lead_id) references public.leads(id) on delete set null;
  end if;
end $$;

-- Triggers (drop/recreate para ser idempotente)
drop trigger if exists companies_set_updated_at on public.companies;
create trigger companies_set_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists vehicles_set_updated_at on public.vehicles;
create trigger vehicles_set_updated_at
before update on public.vehicles
for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

-- RLS enable
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
to authenticated
using (
  id = public.current_company_id()
  or created_by = public.current_user_id()
);

drop policy if exists "companies_insert_authenticated" on public.companies;
create policy "companies_insert_authenticated"
on public.companies
for insert
to authenticated
with check (
  auth.uid() is not null
  and created_by = auth.uid()
);

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

-- MotorGestor (Supabase Postgres) - Constraints + Triggers + RLS + Policies
-- Execute DEPOIS de db/schema.sql em um projeto Supabase novo.

-- Helper: updated_at
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

-- (Opcional mas seguro) grants para funções usadas em policies
grant execute on function public.current_user_id() to authenticated;
grant execute on function public.current_company_id() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- Foreign keys (aplicadas APÓS as tabelas existirem)
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_id_fkey') then
    alter table public.profiles
      add constraint profiles_id_fkey
      foreign key (id) references auth.users(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_company_id_fkey') then
    alter table public.profiles
      add constraint profiles_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'vehicles_company_id_fkey') then
    alter table public.vehicles
      add constraint vehicles_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'vehicles_created_by_fkey') then
    alter table public.vehicles
      add constraint vehicles_created_by_fkey
      foreign key (created_by) references public.profiles(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'leads_company_id_fkey') then
    alter table public.leads
      add constraint leads_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'leads_created_by_fkey') then
    alter table public.leads
      add constraint leads_created_by_fkey
      foreign key (created_by) references public.profiles(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'leads_vehicle_id_fkey') then
    alter table public.leads
      add constraint leads_vehicle_id_fkey
      foreign key (vehicle_id) references public.vehicles(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'events_company_id_fkey') then
    alter table public.events
      add constraint events_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'events_created_by_fkey') then
    alter table public.events
      add constraint events_created_by_fkey
      foreign key (created_by) references public.profiles(id) on delete set null;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'events_lead_id_fkey') then
    alter table public.events
      add constraint events_lead_id_fkey
      foreign key (lead_id) references public.leads(id) on delete set null;
  end if;
end $$;

-- Triggers (drop/recreate para ser idempotente)
drop trigger if exists companies_set_updated_at on public.companies;
create trigger companies_set_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists vehicles_set_updated_at on public.vehicles;
create trigger vehicles_set_updated_at
before update on public.vehicles
for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

-- RLS enable
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
to authenticated
using (
  id = public.current_company_id()
  or created_by = public.current_user_id()
);

drop policy if exists "companies_insert_authenticated" on public.companies;
create policy "companies_insert_authenticated"
on public.companies
for insert
to authenticated
with check (
  auth.uid() is not null
  and created_by = auth.uid()
);

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

