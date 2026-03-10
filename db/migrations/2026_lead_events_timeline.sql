-- Migration: lead_events timeline (idempotente)
-- Cria tabela para timeline/comentários de leads (CRM).
-- Depende de `public.current_company_id()` e `public.current_user_id()` (db/rls.sql).

do $$ begin
  if not exists (
    select 1
    from pg_type
    where typname = 'lead_event_type'
  ) then
    create type public.lead_event_type as enum (
      'created',
      'note',
      'status_change',
      'call',
      'visit',
      'sale'
    );
  end if;
end $$;

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null,
  company_id uuid not null,
  type public.lead_event_type not null,
  message text,
  created_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists lead_events_lead_id_idx on public.lead_events(lead_id, created_at desc);
create index if not exists lead_events_company_id_idx on public.lead_events(company_id);

-- Foreign keys (idempotente)
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'lead_events_lead_id_fkey') then
    alter table public.lead_events
      add constraint lead_events_lead_id_fkey
      foreign key (lead_id) references public.leads(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'lead_events_company_id_fkey') then
    alter table public.lead_events
      add constraint lead_events_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'lead_events_created_by_fkey') then
    alter table public.lead_events
      add constraint lead_events_created_by_fkey
      foreign key (created_by) references public.profiles(id) on delete set null;
  end if;
end $$;

-- RLS
alter table public.lead_events enable row level security;

drop policy if exists "lead_events_select_company" on public.lead_events;
create policy "lead_events_select_company"
on public.lead_events
for select
to authenticated
using (company_id = public.current_company_id());

drop policy if exists "lead_events_insert_company" on public.lead_events;
create policy "lead_events_insert_company"
on public.lead_events
for insert
to authenticated
with check (
  company_id = public.current_company_id()
  and exists (
    select 1
    from public.leads l
    where l.id = lead_id
      and l.company_id = public.current_company_id()
  )
);

