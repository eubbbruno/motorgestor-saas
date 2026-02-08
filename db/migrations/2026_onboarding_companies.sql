-- Migration: onboarding companies.created_by (idempotente)
-- Use em bancos já existentes (staging/prod) antes de rodar novamente db/rls.sql

-- 1) Coluna created_by (não destrutivo)
do $$ begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'companies'
      and column_name = 'created_by'
  ) then
    alter table public.companies add column created_by uuid;
  end if;
end $$;

-- 2) Default = auth.uid() (para novos inserts)
alter table public.companies alter column created_by set default auth.uid();

-- 3) Índice único para limitar 1 empresa por usuário
create unique index if not exists companies_created_by_unique on public.companies(created_by);

-- 4) FK created_by -> auth.users(id)
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'companies_created_by_fkey') then
    alter table public.companies
      add constraint companies_created_by_fkey
      foreign key (created_by) references auth.users(id) on delete restrict;
  end if;
end $$;

