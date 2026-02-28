-- Migration: dashboard charts (idempotente)
-- Cria uma função SQL que retorna dados agregados (funil + séries mensais) para gráficos.
-- Depende do helper `public.current_company_id()` (definido em db/rls.sql).

create or replace function public.get_dashboard_charts()
returns jsonb
language sql
stable
as $$
with base as (
  select
    l.id,
    l.created_at,
    case
      when l.status::text = 'visita' then 'negociacao'
      when l.status::text = 'ganho' then 'fechado'
      else l.status::text
    end as s,
    v.fipe_value
  from public.leads l
  left join public.vehicles v
    on v.id = l.vehicle_id
   and v.company_id = l.company_id
  where l.company_id = public.current_company_id()
),
funnel as (
  select * from (values
    ('novo'::text,        'Novo'::text),
    ('contato'::text,     'Contato'::text),
    ('proposta'::text,    'Proposta'::text),
    ('negociacao'::text,  'Negociação'::text),
    ('fechado'::text,     'Fechado'::text),
    ('perdido'::text,     'Perdido'::text)
  ) as t(status, label)
),
funnel_counts as (
  select
    f.status,
    f.label,
    coalesce(count(b.id) filter (where b.s = f.status), 0)::bigint as count
  from funnel f
  left join base b on true
  group by f.status, f.label
  order by array_position(array['novo','contato','proposta','negociacao','fechado','perdido'], f.status)
),
months as (
  select generate_series(
    date_trunc('month', now()) - interval '5 months',
    date_trunc('month', now()),
    interval '1 month'
  )::date as month_start
),
leads_by_month as (
  select
    to_char(m.month_start, 'YYYY-MM') as month,
    coalesce(count(b.id) filter (where date_trunc('month', b.created_at)::date = m.month_start), 0)::bigint as count
  from months m
  left join base b on true
  group by m.month_start
  order by m.month_start
),
closed_value_by_month as (
  select
    to_char(m.month_start, 'YYYY-MM') as month,
    coalesce(
      sum(b.fipe_value) filter (
        where b.s = 'fechado'
          and date_trunc('month', b.created_at)::date = m.month_start
      ),
      0
    )::numeric as value
  from months m
  left join base b on true
  group by m.month_start
  order by m.month_start
)
select jsonb_build_object(
  'funnel', coalesce((select jsonb_agg(to_jsonb(fc)) from funnel_counts fc), '[]'::jsonb),
  'leads_monthly', coalesce((select jsonb_agg(to_jsonb(lm)) from leads_by_month lm), '[]'::jsonb),
  'closed_value_monthly', coalesce((select jsonb_agg(to_jsonb(cv)) from closed_value_by_month cv), '[]'::jsonb)
);
$$;

