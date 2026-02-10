## MotorGestor
SaaS B2B para **pequenas revendas e vendedores autônomos**: gestão de **estoque**, **leads**, **agenda** e **métricas** com **multi-tenant por empresa** e **papéis Admin/Vendedor**.

### Stack
- **Next.js (App Router)** + **TypeScript**
- **TailwindCSS** + **shadcn/ui**
- **Supabase** (Auth + Postgres + RLS)
- **Zod + React Hook Form**
- **TanStack Query**
- **Zustand** (estado leve)
- **ESLint + Prettier**
- Deploy: **Vercel**

---

## Rodando localmente
### Pré-requisitos
- **Node.js 20+ recomendado** (Vercel usa Node 20 por padrão).  
  - O projeto compila com Node 18, mas algumas dependências já sinalizam depreciação.
- **pnpm** (recomendado)  
  - Se você não tiver `pnpm` instalado, use `corepack pnpm` (ou o shim local `./pnpm`).

### 1) Instalar dependências

```bash
pnpm install
```

Se `pnpm` não existir no seu PATH:

```bash
corepack pnpm install
# ou
./pnpm install
```

### 2) Configurar Supabase
Crie um projeto no Supabase e execute os SQLs em ordem no **SQL Editor**:
1) `db/schema.sql`
2) `db/rls.sql`

Se você já tem um banco existente (staging/prod) e o onboarding falha, rode antes:
- `db/migrations/2026_onboarding_companies.sql`

No Supabase, em **Authentication → URL Configuration**, configure:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: `http://localhost:3000/**`

### 3) Variáveis de ambiente
Crie `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://SEU-PROJETO.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="SUA_ANON_KEY"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4) Rodar o dev server

```bash
pnpm dev
```

Abra `http://localhost:3000`.

### 5) Build de produção

```bash
pnpm build
pnpm start
```

---

## Supabase Setup (passo a passo)
1) **Criar projeto** no Supabase.

2) **Aplicar schema + RLS**  
Execute no **SQL Editor**, em ordem:
1) `db/schema.sql` (tabelas/tipos/índices)
2) `db/rls.sql` (FKs, funções, triggers, RLS e policies)

Para **banco existente** (incremental, sem destruir dados):
1) `db/migrations/2026_onboarding_companies.sql`
2) `db/rls.sql`

3) **Auth URLs**
- Dev:
  - Site URL: `http://localhost:3000`
  - Redirect URLs: `http://localhost:3000/**`
- Produção:
  - Site URL: `https://seu-dominio.com`
  - Redirect URLs: `https://seu-dominio.com/**`

4) **Verificação rápida de RLS (multi-tenant)**
- Crie 2 usuários e 2 empresas e valide que **um não lê dados do outro**.

5) (Opcional) **Storage para fotos de veículos**
- Se você quiser upload (em vez de URLs públicas), crie um bucket e policies por `company_id`.

---

## Fluxo do produto (MVP)
- **Cadastro/Login**: `/cadastro` e `/login`
- **Onboarding** (primeiro acesso): `/app/onboarding` cria a empresa e configura o tenant
- **App**:
  - `/app` (dashboard com métricas básicas)
  - `/app/veiculos` (CRUD de veículos)
  - `/app/leads` (CRUD de leads)
  - `/app/agenda` (eventos simples)
  - `/app/vendas` (funil por status)
  - `/app/relatorios` (indicadores básicos)
  - `/app/configuracoes` (perfil)

## Site público
Inclui landing premium + páginas legais + blog:
- `/`, `/precos`, `/recursos`, `/sobre`, `/contato`
- `/politica-de-privacidade`, `/termos-de-uso`, `/cookies`, `/seguranca`
- `/suporte`, `/status`, `/integracoes`, `/carreiras`, `/parceiros`
- `/blog` e `/blog/[slug]`

**Contato**: o formulário de `/contato` salva em `contact_messages` via `POST /api/contato` (com RLS permitindo insert público).

---

## Deploy (Vercel)
### Vercel Setup (passo a passo)
1) **Importar o repositório** no Vercel (GitHub).

2) **Configurar Environment Variables** (Production e Preview)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (ex.: `https://seu-dominio.com`)

3) **Domínio**
- Adicione o domínio no Vercel.
- Atualize as URLs no Supabase (Site URL e Redirect URLs) para o domínio final.

4) **Deploy**
- Deploy automático a cada push/merge na branch `main`.

---

## Variáveis de ambiente obrigatórias para Vercel
Configure em **Project → Settings → Environment Variables** (Production e Preview):
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase → Project Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase → Project Settings → API → anon public key
- `NEXT_PUBLIC_SITE_URL`: URL final do site (ex.: `https://seu-dominio.com`)

Sem essas variáveis, o deploy **ainda deve buildar**, mas as telas que dependem de dados podem exibir erro em runtime.

---

## Deploy: erros comuns e como resolver
### 1) "Cannot find module 'react-day-picker' ..."
O componente `components/ui/calendar.tsx` (shadcn/ui) depende de `react-day-picker`.

Como resolver:
- Garanta que `react-day-picker` está em `dependencies`
- Rode `pnpm install` e depois `pnpm build`

---

## O que falta configurar (Checklist)
### Obrigatório para produção
- **Supabase (PROD)**:
  - Rodar no Supabase de produção (o mesmo que a Vercel aponta):
    1) `db/migrations/2026_onboarding_companies.sql`
    2) `db/rls.sql`
- **Vercel**
  - Importar repo e configurar env vars (Production/Preview).
  - Configurar domínio e HTTPS.
- **Supabase**
  - Criar projeto e rodar `db/schema.sql` e depois `db/rls.sql`.
  - Configurar Auth URLs (Site URL + Redirect URLs).
  - Validar RLS (isolamento por `company_id`).
- **Imagem da Hero (asset local)**
  - Colocar a imagem em `public/hero-nova.png`.

### Opcional (recomendado)
- **E-mail transacional** (Resend/Postmark) para contato/convites/reset.
- **Billing** (Stripe / Mercado Pago) para assinatura.
- **Analytics** (Plausible/GA).
- **Observabilidade** (Sentry).

### Sem Supabase (modo “sem backend”)
Você consegue rodar a UI mesmo sem Supabase configurado, com limitações:
- **Opção 1**: criar um novo projeto Supabase e configurar `.env.local`.
- **Opção 2**: apontar para um Supabase temporário/staging.
- **Opção 3**: rodar sem env vars (as telas que dependem de dados vão exibir estado de erro, mas o site/UI carregam).

## Estrutura
- `app/` rotas (site + app)
- `components/` UI compartilhada
- `features/` domínio (auth, vehicles, leads, events)
- `lib/` supabase, auth helpers, stores
- `db/` SQL schema + RLS
- `types/` tipos compartilhados
