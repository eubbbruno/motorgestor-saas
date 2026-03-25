# CLAUDE.md

## Skills ativas

As skills em .claude/skills/ devem ser seguidas em todas as tarefas:
- git-workflow.md — push obrigatório após toda alteração
- design-system.md — padrões visuais e fontes do projeto
- images.md — regras para imagens e assets

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting without writing
```

> Package manager: **pnpm**. Do not use npm or yarn.

## Architecture

**MotorGestor** is a B2B SaaS for Brazilian car dealerships — Next.js 15 App Router monolith backed by Supabase (PostgreSQL + Auth).

### Route Groups

```
app/
  (marketing)/     # Public site: landing, blog, legal, contact
  (auth)/          # /login, /cadastro
  (app)/           # Authenticated app: /app/**
    onboarding/
    dashboard/
    vehicles/
    leads/
    eventos/
    relatorios/
    configuracoes/
  api/             # API routes (server-side only)
```

### Feature Domains

Each domain under `features/` follows the same convention:

```
features/<domain>/
  api.ts      # Supabase queries (server-side data fetching)
  hooks.ts    # React Query hooks wrapping api.ts
  schema.ts   # Zod validation schemas
```

Domains: `auth`, `vehicles`, `leads`, `events`, `billing`, `dashboard`.

### Multi-tenancy

Every data table has a `company_id` column. Row-Level Security (RLS) is enforced in Supabase so users only access their own company's data. All queries must filter by `company_id` — this is automatic via RLS, but always include it explicitly in writes.

### Supabase Clients

- **Browser (client components)**: `createSupabaseBrowserClient()` from `lib/supabase/browser.ts`
- **Server (API routes / server components)**: `createSupabaseServerClient()` from `lib/supabase/server.ts`

Never use the browser client in server code or vice versa.

### State Management

- **React Query** — all server state (fetching, caching, mutations)
- **Zustand** (`lib/stores/ui-store.ts`) — lightweight UI state (sidebar, modals)
- **React Hook Form + Zod** — form state and validation

### Authentication Flow (middleware.ts)

1. Unauthenticated → `/login`
2. Authenticated, no `company_id` → `/app/onboarding`
3. Authenticated + company → allow access to `/app/**`
4. Authenticated visiting `/login` or `/cadastro` → redirect to `/app`

### AI Integration

Controlled via `AI_PROVIDER` env var:
- `mock` (default) — returns dummy text, no API key needed
- `openai` — requires `OPENAI_API_KEY`

### Database Setup

Run SQL files in this order when setting up a new Supabase project:
1. `db/schema.sql`
2. `db/migrations/*.sql` (in chronological order)
3. `db/rls.sql`

Foreign key constraints live in `rls.sql`, not `schema.sql`.

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical site URL |
| `FIPE_API_BASE_URL` | No | FIPE pricing API (defaults to parallelum.com.br) |
| `AI_PROVIDER` | No | `mock` or `openai` |
| `OPENAI_API_KEY` | If AI_PROVIDER=openai | OpenAI key |

## Key Libraries

- **shadcn/ui** (New York style, Slate palette) — component library; add new components via `pnpm dlx shadcn@latest add <component>`
- **Framer Motion** — animations
- **React Big Calendar** — events/scheduling calendar
- **Recharts** — dashboard charts
- **PapaParse** — CSV imports
- **date-fns** — all date manipulation
- **Sonner** — toast notifications

## Path Aliases

`@/*` maps to the project root. Use `@/components`, `@/features`, `@/lib`, etc.

## Regra obrigatória — Git

Após QUALQUER alteração de arquivo, sempre executar obrigatoriamente:
1. `git add .`
2. `git commit -m "descrição do que foi feito"`
3. `git push origin main`

Nunca finalizar uma tarefa sem fazer o push. O Vercel está vinculado ao GitHub e só atualiza após o push. Isso inclui alterações de imagens, arquivos estáticos em /public, e qualquer outro arquivo.
