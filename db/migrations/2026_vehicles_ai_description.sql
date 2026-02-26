-- Migration: vehicles.description_ai (idempotente)
-- Rode em bancos existentes (staging/prod) antes de usar o recurso de IA no app.

do $$ begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'vehicles'
      and column_name = 'description_ai'
  ) then
    alter table public.vehicles add column description_ai text;
  end if;
end $$;

