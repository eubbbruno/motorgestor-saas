-- ============================================================
-- Migration: corrige RLS para leads, events, lead_tasks, lead_events
-- Execute no SQL Editor do Supabase (Dashboard → SQL Editor)
-- É idempotente: pode rodar múltiplas vezes sem efeito colateral.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- SEÇÃO 1 — DIAGNÓSTICO (opcional — comente antes de rodar em prod)
-- ──────────────────────────────────────────────────────────────

-- 1a. Usuários sem profile row (causa raiz do NULL em current_company_id)
-- select u.id, u.email,
--        p.id as profile_id, p.company_id
-- from auth.users u
-- left join public.profiles p on p.id = u.id
-- where p.id is null or p.company_id is null;

-- 1b. RLS ativa por tabela
-- select tablename, rowsecurity from pg_tables
-- where schemaname = 'public' order by tablename;

-- 1c. Policies existentes
-- select tablename, policyname, cmd from pg_policies
-- where schemaname = 'public' order by tablename, policyname;

-- 1d. Grants por tabela/role
-- select table_name, grantee, privilege_type
-- from information_schema.role_table_grants
-- where table_schema = 'public'
--   and grantee in ('authenticated', 'anon')
-- order by table_name, grantee;

-- ──────────────────────────────────────────────────────────────
-- SEÇÃO 2 — TRIGGER: auto-cria profile ao cadastrar usuário
-- ──────────────────────────────────────────────────────────────
-- Sem isso, current_company_id() retorna NULL para usuários novos
-- (especialmente OAuth / Google) e TODOS os INSERTs falham.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    'admin'   -- padrão; onboarding pode rebaixar para 'vendedor' se necessário
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Remove trigger anterior se existir, recria
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ──────────────────────────────────────────────────────────────
-- SEÇÃO 3 — BACKFILL: cria profile para usuários já cadastrados
-- ──────────────────────────────────────────────────────────────
-- Corrige usuários que se registraram antes do trigger existir.
-- company_id ficará NULL até o onboarding — o middleware redireciona
-- automaticamente para /app/onboarding, que chama /api/onboarding/company.

insert into public.profiles (id, email, role)
select
  u.id,
  u.email,
  'admin'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

-- ──────────────────────────────────────────────────────────────
-- SEÇÃO 4 — GRANTs explícitos (previne erro 403 sem mensagem de RLS)
-- ──────────────────────────────────────────────────────────────
-- Em Supabase, tabelas criadas via SQL Editor às vezes não herdam
-- os grants padrão do schema. Melhor ser explícito.

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
-- SEÇÃO 5 — RLS: tabela leads (recria idempotente)
-- ──────────────────────────────────────────────────────────────

alter table public.leads enable row level security;

drop policy if exists "leads_select_company"  on public.leads;
drop policy if exists "leads_insert_company"  on public.leads;
drop policy if exists "leads_update_company"  on public.leads;
drop policy if exists "leads_delete_company"  on public.leads;

create policy "leads_select_company"
on public.leads for select to authenticated
using (company_id = public.current_company_id());

-- INSERT: o campo company_id enviado deve bater com o da empresa do usuário logado.
-- Não validamos created_by para evitar FK com profiles (created_by é opcional).
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
-- SEÇÃO 6 — RLS: tabela events (recria idempotente)
-- ──────────────────────────────────────────────────────────────

alter table public.events enable row level security;

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
-- SEÇÃO 7 — RLS: tabela lead_tasks (idempotente, caso migration não rodou)
-- ──────────────────────────────────────────────────────────────
-- Nota: o INSERT verifica se o lead pertence à empresa para evitar
-- que usuários criem tarefas em leads de outras empresas.

alter table public.lead_tasks enable row level security;

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
-- SEÇÃO 8 — RLS: tabela lead_events (idempotente, caso migration não rodou)
-- ──────────────────────────────────────────────────────────────

alter table public.lead_events enable row level security;

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
-- SEÇÃO 9 — RLS: subscriptions/plans (garante acesso ao billing)
-- ──────────────────────────────────────────────────────────────

alter table public.plans          enable row level security;
alter table public.subscriptions  enable row level security;

drop policy if exists "plans_select_public"         on public.plans;
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
-- SEÇÃO 10 — VERIFICAÇÃO FINAL (rode separado após aplicar)
-- ──────────────────────────────────────────────────────────────

-- Confirma trigger criado:
-- select trigger_name, event_manipulation, event_object_table
-- from information_schema.triggers
-- where trigger_name = 'on_auth_user_created';

-- Confirma usuários com perfil e empresa:
-- select u.id, u.email,
--        p.company_id,
--        case when p.company_id is not null then '✓ OK' else '✗ SEM EMPRESA (onboarding pendente)' end as status
-- from auth.users u
-- left join public.profiles p on p.id = u.id;

-- Confirma policies em leads e events:
-- select tablename, policyname, cmd
-- from pg_policies
-- where schemaname = 'public'
--   and tablename in ('leads', 'events', 'lead_tasks', 'lead_events')
-- order by tablename, policyname;
