-- ============================================================
-- Migration: vincula profiles.company_id automaticamente ao criar empresa
-- Causa raiz: current_company_id() retornava NULL porque o onboarding
--             criava a company mas não atualizava profiles.company_id,
--             fazendo todos os INSERTs em leads/events falharem por RLS.
--
-- Execute no SQL Editor do Supabase (Dashboard → SQL Editor → New query)
-- É idempotente: pode rodar várias vezes sem efeito colateral.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- SEÇÃO 1 — DIAGNÓSTICO (execute antes para entender o estado atual)
-- ──────────────────────────────────────────────────────────────
-- Usuários com company_id NULL (causa do erro RLS):
-- select u.id, u.email, p.company_id,
--        c.id as company_id_real, c.name as company_name
-- from auth.users u
-- left join public.profiles p  on p.id = u.id
-- left join public.companies c on c.created_by = u.id
-- where p.company_id is null;

-- ──────────────────────────────────────────────────────────────
-- SEÇÃO 2 — TRIGGER: auto-vincula profile à empresa ao criar company
-- ──────────────────────────────────────────────────────────────
-- Sem isso, o onboarding pode criar a empresa mas deixar
-- profiles.company_id = NULL, fazendo current_company_id() = NULL
-- e bloqueando TODOS os INSERTs em leads/events por RLS.

create or replace function public.handle_new_company()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Atualiza o perfil do criador da empresa com o company_id
  -- (somente se ainda não tiver empresa vinculada)
  update public.profiles
  set company_id = new.id
  where id = new.created_by
    and company_id is null;
  return new;
end;
$$;

grant execute on function public.handle_new_company() to authenticated;

drop trigger if exists on_company_created on public.companies;
create trigger on_company_created
  after insert on public.companies
  for each row execute procedure public.handle_new_company();

-- ──────────────────────────────────────────────────────────────
-- SEÇÃO 3 — BACKFILL: corrige usuários que já criaram empresa mas
--           ficaram com profiles.company_id = NULL
-- ──────────────────────────────────────────────────────────────

update public.profiles p
set company_id = c.id
from public.companies c
where c.created_by = p.id
  and p.company_id is null;

-- ──────────────────────────────────────────────────────────────
-- SEÇÃO 4 — GARANTE que current_company_id() está funcionando
-- ──────────────────────────────────────────────────────────────
-- Recria a função por garantia (SECURITY DEFINER previne recursão em RLS)

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

grant execute on function public.current_company_id() to authenticated;

-- ──────────────────────────────────────────────────────────────
-- SEÇÃO 5 — RECRIA policies de leads (idempotente)
-- ──────────────────────────────────────────────────────────────

alter table public.leads enable row level security;

drop policy if exists "leads_select_company" on public.leads;
drop policy if exists "leads_insert_company" on public.leads;
drop policy if exists "leads_update_company" on public.leads;
drop policy if exists "leads_delete_company" on public.leads;

create policy "leads_select_company"
on public.leads for select to authenticated
using (company_id = public.current_company_id());

-- INSERT: company_id enviado deve bater com a empresa do usuário logado.
-- Não validamos created_by pois ele é opcional (evita FK com profiles).
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
-- SEÇÃO 6 — RECRIA policies de events (idempotente)
-- ──────────────────────────────────────────────────────────────

alter table public.events enable row level security;

drop policy if exists "events_select_company" on public.events;
drop policy if exists "events_insert_company" on public.events;
drop policy if exists "events_update_company" on public.events;
drop policy if exists "events_delete_company" on public.events;

create policy "events_select_company"
on public.events for select to authenticated
using (company_id = public.current_company_id());

-- INSERT: company_id enviado deve bater com a empresa do usuário logado.
-- created_by é validado somente por FK (profiles), não por RLS,
-- para não bloquear caso o perfil ainda não exista na sessão.
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
-- SEÇÃO 7 — GRANTs explícitos (previne 403 silencioso)
-- ──────────────────────────────────────────────────────────────

grant usage on schema public to authenticated, anon;
grant select, insert, update, delete on table public.leads  to authenticated;
grant select, insert, update, delete on table public.events to authenticated;

-- ──────────────────────────────────────────────────────────────
-- SEÇÃO 8 — VERIFICAÇÃO FINAL (rode separado após aplicar)
-- ──────────────────────────────────────────────────────────────

-- Confirma trigger criado:
-- select trigger_name, event_object_table
-- from information_schema.triggers
-- where trigger_name = 'on_company_created';

-- Confirma usuários com empresa vinculada (deve estar vazio após backfill):
-- select u.id, u.email, p.company_id
-- from auth.users u
-- left join public.profiles p on p.id = u.id
-- where p.company_id is null;

-- Confirma policies em leads e events:
-- select tablename, policyname, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'public'
--   and tablename in ('leads', 'events')
-- order by tablename, policyname;
