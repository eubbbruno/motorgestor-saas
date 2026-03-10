-- Migration: vehicle photos (idempotente)
-- Armazena paths das fotos no registro do veículo.

do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'vehicles' and column_name = 'photo_paths'
  ) then
    alter table public.vehicles add column photo_paths text[] not null default '{}';
  end if;
end $$;

