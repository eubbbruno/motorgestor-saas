-- MotorGestor (Supabase Postgres) — Constraints + Triggers + RLS + Policies
-- Execute DEPOIS de db/schema.sql em um projeto Supabase novo.
-- Para bancos existentes: rode db/migrations/ em ordem cronológica, depois este arquivo.
-- Este arquivo é idempotente (pode rodar várias vezes).

-- ──────────────────────────────────────────────────────────────
-- Funções auxiliares
-- ──────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_user_id()
returns uuid
language sql
stable
as $$
  select auth.uid();
$$;

-- SECURITY DEFINER: bypassa RLS para evitar recursão nas policies de profiles
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
  select coalesce(
    (select p.role = 'admin' from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

grant execute on function public.current_user_id()   to authenticated;
grant execute on function public.current_company_id() to authenticated;
grant execute on function public.is_admin()           to authenticated;

-- ──────────────────────────────────────────────────────────────
-- Trigger: auto-cria profile ao sign up (previne NULL em current_company_id)
-- ──────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ──────────────────────────────────────────────────────────────
-- Foreign keys (idempotente — apenas se não existirem)
-- ──────────────────────────────────────────────────────────────

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

-- ──────────────────────────────────────────────────────────────
-- Triggers: updated_at
-- ──────────────────────────────────────────────────────────────

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

-- ──────────────────────────────────────────────────────────────
-- GRANTs explícitos (previne 403 silencioso em tabelas criadas via SQL)
-- ──────────────────────────────────────────────────────────────

grant usage on schema public to authenticated, anon;

grant select, insert, update, delete on table public.companies       to authenticated;
grant select, insert, update, delete on table public.profiles        to authenticated;
grant select, insert, update, delete on table public.vehicles        to authenticated;
grant select, insert, update, delete on table public.leads           to authenticated;
grant select, insert, update, delete on table public.events          to authenticated;
grant select, insert, update, delete on table public.lead_tasks      to authenticated;
grant select, insert, update, delete on table public.lead_events     to authenticated;
grant select, insert, update, delete on table public.subscriptions   to authenticated;
grant select                         on table public.plans           to authenticated, anon;
grant insert                         on table public.contact_messages to anon;
grant select, insert                 on table public.contact_messages to authenticated;

-- ──────────────────────────────────────────────────────────────
-- RLS enable
-- ──────────────────────────────────────────────────────────────

alter table public.companies       enable row level security;
alter table public.profiles        enable row level security;
alter table public.vehicles        enable row level security;
alter table public.leads           enable row level security;
alter table public.events          enable row level security;
alter table public.lead_tasks      enable row level security;
alter table public.lead_events     enable row level security;
alter table public.plans           enable row level security;
alter table public.subscriptions   enable row level security;
alter table public.contact_messages enable row level security;

-- ──────────────────────────────────────────────────────────────
-- Policies: companies
-- ──────────────────────────────────────────────────────────────

drop policy if exists "companies_select_own"          on public.companies;
drop policy if exists "companies_insert_authenticated" on public.companies;
drop policy if exists "companies_update_admin"        on public.companies;
drop policy if exists "companies_delete_admin"        on public.companies;

create policy "companies_select_own"
on public.companies for select to authenticated
using (
  id = public.current_company_id()
  or created_by = public.current_user_id()
);

create policy "companies_insert_authenticated"
on public.companies for insert to authenticated
with check (
  auth.uid() is not null
  and created_by = auth.uid()
);

create policy "companies_update_admin"
on public.companies for update to authenticated
using  (public.is_admin() and id = public.current_company_id())
with check (public.is_admin() and id = public.current_company_id());

create policy "companies_delete_admin"
on public.companies for delete to authenticated
using (public.is_admin() and id = public.current_company_id());

-- ──────────────────────────────────────────────────────────────
-- Policies: profiles
-- ──────────────────────────────────────────────────────────────

drop policy if exists "profiles_select_company"       on public.profiles;
drop policy if exists "profiles_insert_self"          on public.profiles;
drop policy if exists "profiles_update_self_or_admin" on public.profiles;

create policy "profiles_select_company"
on public.profiles for select to authenticated
using (
  id = public.current_user_id()
  or company_id = public.current_company_id()
);

create policy "profiles_insert_self"
on public.profiles for insert to authenticated
with check (id = public.current_user_id());

create policy "profiles_update_self_or_admin"
on public.profiles for update to authenticated
using (
  id = public.current_user_id()
  or (public.is_admin() and company_id = public.current_company_id())
)
with check (
  id = public.current_user_id()
  or (public.is_admin() and company_id = public.current_company_id())
);

-- ──────────────────────────────────────────────────────────────
-- Policies: vehicles
-- ──────────────────────────────────────────────────────────────

drop policy if exists "vehicles_select_company" on public.vehicles;
drop policy if exists "vehicles_insert_company" on public.vehicles;
drop policy if exists "vehicles_update_company" on public.vehicles;
drop policy if exists "vehicles_delete_company" on public.vehicles;

create policy "vehicles_select_company"
on public.vehicles for select to authenticated
using (company_id = public.current_company_id());

create policy "vehicles_insert_company"
on public.vehicles for insert to authenticated
with check (company_id = public.current_company_id());

create policy "vehicles_update_company"
on public.vehicles for update to authenticated
using  (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "vehicles_delete_company"
on public.vehicles for delete to authenticated
using (company_id = public.current_company_id());

-- ──────────────────────────────────────────────────────────────
-- Policies: leads
-- ──────────────────────────────────────────────────────────────

drop policy if exists "leads_select_company" on public.leads;
drop policy if exists "leads_insert_company" on public.leads;
drop policy if exists "leads_update_company" on public.leads;
drop policy if exists "leads_delete_company" on public.leads;

create policy "leads_select_company"
on public.leads for select to authenticated
using (company_id = public.current_company_id());

create policy "leads_insert_company"
on public.leads for insert to authenticated
with check (company_id = public.current_company_id());

create policy "leads_update_company"
on public.leads for update to authenticated
using  (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "leads_delete_company"
on public.leads for delete to authenticated
using (company_id = public.current_company_id());

-- ──────────────────────────────────────────────────────────────
-- Policies: events
-- ──────────────────────────────────────────────────────────────

drop policy if exists "events_select_company" on public.events;
drop policy if exists "events_insert_company" on public.events;
drop policy if exists "events_update_company" on public.events;
drop policy if exists "events_delete_company" on public.events;

create policy "events_select_company"
on public.events for select to authenticated
using (company_id = public.current_company_id());

create policy "events_insert_company"
on public.events for insert to authenticated
with check (company_id = public.current_company_id());

create policy "events_update_company"
on public.events for update to authenticated
using  (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "events_delete_company"
on public.events for delete to authenticated
using (company_id = public.current_company_id());

-- ──────────────────────────────────────────────────────────────
-- Policies: lead_tasks
-- ──────────────────────────────────────────────────────────────

drop policy if exists "lead_tasks_select_company" on public.lead_tasks;
drop policy if exists "lead_tasks_insert_company" on public.lead_tasks;
drop policy if exists "lead_tasks_update_company" on public.lead_tasks;
drop policy if exists "lead_tasks_delete_company" on public.lead_tasks;

create policy "lead_tasks_select_company"
on public.lead_tasks for select to authenticated
using (company_id = public.current_company_id());

create policy "lead_tasks_insert_company"
on public.lead_tasks for insert to authenticated
with check (
  company_id = public.current_company_id()
  and exists (
    select 1 from public.leads l
    where l.id = lead_id
      and l.company_id = public.current_company_id()
  )
);

create policy "lead_tasks_update_company"
on public.lead_tasks for update to authenticated
using  (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "lead_tasks_delete_company"
on public.lead_tasks for delete to authenticated
using (company_id = public.current_company_id());

-- ──────────────────────────────────────────────────────────────
-- Policies: lead_events
-- ──────────────────────────────────────────────────────────────

drop policy if exists "lead_events_select_company" on public.lead_events;
drop policy if exists "lead_events_insert_company" on public.lead_events;
drop policy if exists "lead_events_update_company" on public.lead_events;
drop policy if exists "lead_events_delete_company" on public.lead_events;

create policy "lead_events_select_company"
on public.lead_events for select to authenticated
using (company_id = public.current_company_id());

create policy "lead_events_insert_company"
on public.lead_events for insert to authenticated
with check (
  company_id = public.current_company_id()
  and exists (
    select 1 from public.leads l
    where l.id = lead_id
      and l.company_id = public.current_company_id()
  )
);

create policy "lead_events_update_company"
on public.lead_events for update to authenticated
using  (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "lead_events_delete_company"
on public.lead_events for delete to authenticated
using (company_id = public.current_company_id());

-- ──────────────────────────────────────────────────────────────
-- Policies: plans e subscriptions
-- ──────────────────────────────────────────────────────────────

drop policy if exists "plans_select_public"          on public.plans;
drop policy if exists "subscriptions_select_company" on public.subscriptions;
drop policy if exists "subscriptions_insert_admin"   on public.subscriptions;
drop policy if exists "subscriptions_update_admin"   on public.subscriptions;

create policy "plans_select_public"
on public.plans for select to public
using (true);

create policy "subscriptions_select_company"
on public.subscriptions for select to authenticated
using (company_id = public.current_company_id());

create policy "subscriptions_insert_admin"
on public.subscriptions for insert to authenticated
with check (public.is_admin() and company_id = public.current_company_id());

create policy "subscriptions_update_admin"
on public.subscriptions for update to authenticated
using  (public.is_admin() and company_id = public.current_company_id())
with check (public.is_admin() and company_id = public.current_company_id());

-- ──────────────────────────────────────────────────────────────
-- Policies: contact_messages
-- ──────────────────────────────────────────────────────────────

drop policy if exists "contact_messages_insert_public" on public.contact_messages;
drop policy if exists "contact_messages_select_admin"  on public.contact_messages;

create policy "contact_messages_insert_public"
on public.contact_messages for insert
with check (true);

create policy "contact_messages_select_admin"
on public.contact_messages for select to authenticated
using (public.is_admin());
