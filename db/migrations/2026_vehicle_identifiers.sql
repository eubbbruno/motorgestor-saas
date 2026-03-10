-- Migration: vehicle identifiers (idempotente)
-- Adiciona campos para busca por placa/chassi/renavam e versão.

do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'vehicles' and column_name = 'plate'
  ) then
    alter table public.vehicles add column plate text;
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'vehicles' and column_name = 'chassis'
  ) then
    alter table public.vehicles add column chassis text;
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'vehicles' and column_name = 'renavam'
  ) then
    alter table public.vehicles add column renavam text;
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'vehicles' and column_name = 'version'
  ) then
    alter table public.vehicles add column version text;
  end if;
end $$;

create index if not exists vehicles_company_plate_idx on public.vehicles(company_id, plate);

