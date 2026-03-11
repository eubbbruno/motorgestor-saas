-- Migration: adiciona tipo "whatsapp" no enum lead_event_type (idempotente)

do $$ begin
  if exists (
    select 1
    from pg_type
    where typname = 'lead_event_type'
  ) then
    begin
      alter type public.lead_event_type add value if not exists 'whatsapp';
    exception
      when duplicate_object then null;
    end;
  end if;
end $$;

