-- Migration: WhatsApp completo — colunas, tabelas e RLS
-- Execute no Supabase SQL Editor

-- 1. Adiciona colunas WhatsApp na tabela companies
alter table public.companies
  add column if not exists whatsapp_token          text,
  add column if not exists whatsapp_phone_number_id text;

-- 2. Adiciona coluna phone na tabela profiles (fix de hoje)
alter table public.profiles
  add column if not exists phone text;

-- 3. Tabela de conversas WhatsApp
create table if not exists public.whatsapp_conversations (
  id               uuid primary key default gen_random_uuid(),
  company_id       uuid not null references public.companies(id) on delete cascade,
  contact_phone    text not null,
  contact_name     text,
  last_message     text,
  last_message_at  timestamptz not null default now(),
  unread_count     int not null default 0,
  status           text not null default 'open' check (status in ('open', 'resolved', 'waiting')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Uma conversa por empresa + telefone
create unique index if not exists whatsapp_conversations_company_phone_idx
  on public.whatsapp_conversations(company_id, contact_phone);

create index if not exists whatsapp_conversations_company_id_idx
  on public.whatsapp_conversations(company_id, last_message_at desc);

-- 4. Tabela de mensagens WhatsApp
create table if not exists public.whatsapp_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.whatsapp_conversations(id) on delete cascade,
  company_id      uuid not null references public.companies(id) on delete cascade,
  direction       text not null check (direction in ('inbound', 'outbound')),
  message         text not null,
  sent_by         text not null default 'human' check (sent_by in ('human', 'ai')),
  wa_message_id   text,
  created_at      timestamptz not null default now()
);

create index if not exists whatsapp_messages_conversation_id_idx
  on public.whatsapp_messages(conversation_id, created_at asc);

create index if not exists whatsapp_messages_company_id_idx
  on public.whatsapp_messages(company_id);

-- 5. Tabela de configuração da IA por empresa
create table if not exists public.ai_training (
  id                    uuid primary key default gen_random_uuid(),
  company_id            uuid not null unique references public.companies(id) on delete cascade,
  ai_enabled            boolean not null default true,
  assistant_name        text not null default 'Assistente',
  assistant_tone        text not null default 'profissional',
  custom_instructions   text,
  response_delay_min    int not null default 3,
  response_delay_max    int not null default 8,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- 6. RLS — whatsapp_conversations
alter table public.whatsapp_conversations enable row level security;

drop policy if exists "company members view conversations" on public.whatsapp_conversations;
create policy "company members view conversations"
  on public.whatsapp_conversations for select
  using (
    company_id in (
      select company_id from public.profiles where id = auth.uid()
    )
  );

drop policy if exists "company members update conversations" on public.whatsapp_conversations;
create policy "company members update conversations"
  on public.whatsapp_conversations for update
  using (
    company_id in (
      select company_id from public.profiles where id = auth.uid()
    )
  );

-- Inserção/atualização via webhook usa service role → sem policy de insert necessária para usuários

-- 7. RLS — whatsapp_messages
alter table public.whatsapp_messages enable row level security;

drop policy if exists "company members view messages" on public.whatsapp_messages;
create policy "company members view messages"
  on public.whatsapp_messages for select
  using (
    company_id in (
      select company_id from public.profiles where id = auth.uid()
    )
  );

-- 8. RLS — ai_training
alter table public.ai_training enable row level security;

drop policy if exists "company members manage ai_training" on public.ai_training;
create policy "company members manage ai_training"
  on public.ai_training for all
  using (
    company_id in (
      select company_id from public.profiles where id = auth.uid()
    )
  );

-- 9. RLS — companies: permite que membros leiam e atualizem a própria empresa
drop policy if exists "company members read company" on public.companies;
create policy "company members read company"
  on public.companies for select
  using (
    id in (
      select company_id from public.profiles where id = auth.uid()
    )
  );

drop policy if exists "company members update company" on public.companies;
create policy "company members update company"
  on public.companies for update
  using (
    id in (
      select company_id from public.profiles where id = auth.uid()
    )
  );
