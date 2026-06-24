-- Migration: catálogo de 3 planos (Starter / Pro / Enterprise) — idempotente
-- Alinha a tabela public.plans com lib/billing/plans.ts.
-- "Ilimitado" é representado por número grande (mesma convenção do Pro anterior).
-- price = preço MENSAL (o preço anual é calculado no código, priceAnnual).

insert into public.plans (name, price, max_vehicles, max_leads, ai_enabled)
values
  ('Free',       0,   5,      20,     false),
  ('Starter',    97,  50,     200,    false),
  ('Pro',        197, 999999, 999999, true),
  ('Enterprise', 397, 999999, 999999, true)
on conflict (name) do update set
  price        = excluded.price,
  max_vehicles = excluded.max_vehicles,
  max_leads    = excluded.max_leads,
  ai_enabled   = excluded.ai_enabled;
