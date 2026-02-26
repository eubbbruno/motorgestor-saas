-- Migration: dashboard metrics (idempotente)
-- Cria uma função SQL para calcular métricas do dashboard com agregações (sem N+1).
-- Depende do helper `public.current_company_id()` (definido em db/rls.sql).

create or replace function public.get_dashboard_metrics()
returns table (
  total_leads bigint,
  leads_em_negociacao bigint,
  leads_fechados bigint,
  valor_em_negociacao numeric,
  valor_fechado numeric,
  taxa_conversao numeric,
  ticket_medio numeric
)
language sql
stable
as $$
with base as (
  select
    l.id,
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
agg as (
  select
    count(*)::bigint as total_leads,
    count(*) filter (where s = 'negociacao')::bigint as leads_em_negociacao,
    count(*) filter (where s = 'fechado')::bigint as leads_fechados,
    coalesce(sum(fipe_value) filter (where s in ('novo','contato','proposta','negociacao')), 0)::numeric as valor_em_negociacao,
    coalesce(sum(fipe_value) filter (where s = 'fechado'), 0)::numeric as valor_fechado
  from base
)
select
  a.total_leads,
  a.leads_em_negociacao,
  a.leads_fechados,
  a.valor_em_negociacao,
  a.valor_fechado,
  case when a.total_leads = 0 then 0 else (a.leads_fechados::numeric / a.total_leads::numeric) end as taxa_conversao,
  case when a.leads_fechados = 0 then 0 else (a.valor_fechado::numeric / a.leads_fechados::numeric) end as ticket_medio
from agg a;
$$;

