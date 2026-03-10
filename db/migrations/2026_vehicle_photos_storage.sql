-- Migration: Supabase Storage bucket + policies (idempotente)
-- Bucket: vehicle-photos (privado)
-- Segurança por tenant: pasta raiz deve ser o company_id (uuid) do usuário logado.
-- Ex.: <company_id>/<arquivo>.jpg

-- Bucket
do $$ begin
  if not exists (select 1 from storage.buckets where id = 'vehicle-photos') then
    insert into storage.buckets (id, name, public)
    values ('vehicle-photos', 'vehicle-photos', false);
  end if;
end $$;

-- Policies (storage.objects)
-- SELECT: ler apenas objetos da própria empresa
drop policy if exists "vehicle_photos_select_company" on storage.objects;
create policy "vehicle_photos_select_company"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'vehicle-photos'
  and (storage.foldername(name))[1] = public.current_company_id()::text
);

-- INSERT: enviar apenas para pasta da própria empresa
drop policy if exists "vehicle_photos_insert_company" on storage.objects;
create policy "vehicle_photos_insert_company"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'vehicle-photos'
  and (storage.foldername(name))[1] = public.current_company_id()::text
);

-- DELETE: remover apenas objetos da própria empresa
drop policy if exists "vehicle_photos_delete_company" on storage.objects;
create policy "vehicle_photos_delete_company"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'vehicle-photos'
  and (storage.foldername(name))[1] = public.current_company_id()::text
);

