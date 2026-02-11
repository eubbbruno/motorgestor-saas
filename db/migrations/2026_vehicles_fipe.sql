-- Migration: vehicles FIPE fields (idempotente)
-- Rode em bancos existentes (staging/prod) antes de usar o recurso no app.

do $$ begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'vehicles'
      and column_name = 'fipe_value'
  ) then
    alter table public.vehicles add column fipe_value numeric(12,2);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'vehicles'
      and column_name = 'fipe_reference'
  ) then
    alter table public.vehicles add column fipe_reference text;
  end if;
end $$;

do $$ begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'vehicles'
      and column_name = 'fipe_code'
  ) then
    alter table public.vehicles add column fipe_code text;
  end if;
end $$;

