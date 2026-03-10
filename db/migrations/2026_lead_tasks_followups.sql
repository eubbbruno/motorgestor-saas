-- Migration: lead tasks / follow-ups (idempotente)
-- Cria tabela para tarefas por lead (CRM).
-- Depende de `public.current_company_id()` (db/rls.sql).

do $$ begin
  if not exists (
    select 1
    from pg_type
    where typname = 'lead_task_status'
  ) then
    create type public.lead_task_status as enum ('pending', 'done', 'cancelled');
  end if;
end $$;

create table if not exists public.lead_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null,
  company_id uuid not null,
  title text not null,
  description text,
  status public.lead_task_status not null default 'pending',
  due_date date,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create index if not exists lead_tasks_company_id_idx on public.lead_tasks(company_id);
create index if not exists lead_tasks_lead_id_idx on public.lead_tasks(lead_id, created_at desc);
create index if not exists lead_tasks_due_date_idx on public.lead_tasks(company_id, status, due_date);

-- Foreign keys (idempotente)
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'lead_tasks_lead_id_fkey') then
    alter table public.lead_tasks
      add constraint lead_tasks_lead_id_fkey
      foreign key (lead_id) references public.leads(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'lead_tasks_company_id_fkey') then
    alter table public.lead_tasks
      add constraint lead_tasks_company_id_fkey
      foreign key (company_id) references public.companies(id) on delete cascade;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'lead_tasks_created_by_fkey') then
    alter table public.lead_tasks
      add constraint lead_tasks_created_by_fkey
      foreign key (created_by) references auth.users(id) on delete set null;
  end if;
exception when undefined_table then
  -- em ambientes onde `auth.users` não está disponível no contexto (raro), ignora FK
  null;
end $$;

-- RLS
alter table public.lead_tasks enable row level security;

drop policy if exists "lead_tasks_select_company" on public.lead_tasks;
create policy "lead_tasks_select_company"
on public.lead_tasks
for select
to authenticated
using (
  company_id = public.current_company_id()
);

drop policy if exists "lead_tasks_insert_company" on public.lead_tasks;
create policy "lead_tasks_insert_company"
on public.lead_tasks
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

drop policy if exists "lead_tasks_update_company" on public.lead_tasks;
create policy "lead_tasks_update_company"
on public.lead_tasks
for update
to authenticated
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

drop policy if exists "lead_tasks_delete_company" on public.lead_tasks;
create policy "lead_tasks_delete_company"
on public.lead_tasks
for delete
to authenticated
using (company_id = public.current_company_id());

