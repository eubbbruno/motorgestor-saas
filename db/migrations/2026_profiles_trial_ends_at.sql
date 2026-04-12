-- Migration: adiciona coluna trial_ends_at na tabela profiles (idempotente)

alter table public.profiles
  add column if not exists trial_ends_at timestamptz default (now() + interval '14 days');
