-- Migration: adiciona colunas Mercado Pago na tabela subscriptions (idempotente)

alter table public.subscriptions
  add column if not exists mp_payment_id text,
  add column if not exists billing_cycle text default 'monthly',
  add column if not exists updated_at timestamptz default now();

create unique index if not exists subscriptions_mp_payment_id_idx
  on public.subscriptions(mp_payment_id)
  where mp_payment_id is not null;
