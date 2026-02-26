-- Migration: lead status pipeline (idempotente)
-- Objetivo: suportar o Kanban com as colunas:
-- novo, contato, proposta, negociacao, fechado, perdido

-- 1) Garantir que o enum existe (para bancos que não vieram do schema.sql atual)
do $$ begin
  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type public.lead_status as enum ('novo', 'contato', 'proposta', 'negociacao', 'fechado', 'perdido');
  end if;
end $$;

-- 2) Adicionar novos valores ao enum (Supabase/Postgres suporta isso)
do $$ begin
  if not exists (select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid where t.typname = 'lead_status' and e.enumlabel = 'negociacao') then
    alter type public.lead_status add value 'negociacao';
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid where t.typname = 'lead_status' and e.enumlabel = 'fechado') then
    alter type public.lead_status add value 'fechado';
  end if;
end $$;

-- 3) Garantir coluna status em leads (mantendo compatibilidade)
do $$ begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'leads'
      and column_name = 'status'
  ) then
    alter table public.leads add column status public.lead_status not null default 'novo';
  end if;
end $$;

alter table public.leads alter column status set default 'novo';

-- 4) Migração de dados (não destrutiva):
-- visita -> negociacao, ganho -> fechado
update public.leads set status = 'negociacao' where status::text = 'visita';
update public.leads set status = 'fechado' where status::text = 'ganho';

