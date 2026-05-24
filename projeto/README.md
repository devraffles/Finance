# Kwak Finance

Aplicacao web local para gestao financeira integrada de PF, PJ/MEI e investimentos.

## Estado atual

Fundacao criada ate a Task 02:

- workspace pnpm em `projeto/`;
- frontend Next.js 14 em `frontend/`, com App Router, TypeScript, Tailwind CSS e ESLint;
- backend interno `@kwak-finance/backend` em `backend/`, com TypeScript e Prisma;
- Prisma inicializado em `backend/prisma/schema.prisma` com provider `postgresql`;
- Docker Compose dedicado `kwak-finance` com containeres `kwak_finance_app` e `kwak_finance_db`;
- Dockerfile com Node 24 Alpine e pnpm via Corepack;
- arquivos `.env` e `.env.example` com placeholders seguros.

## Pre-requisitos verificados

- Docker disponivel.
- Docker Compose disponivel.
- pnpm disponivel.

## Comandos principais

Execute os scripts a partir de `projeto/`:

```bash
pnpm run setup
pnpm run docker:up
pnpm run docker:down
pnpm run docker:reset
pnpm run docker:logs
pnpm run dev
pnpm run build
pnpm run lint
pnpm run format:check
pnpm run typecheck
pnpm run db:generate
pnpm run db:push
pnpm run db:seed
pnpm run db:studio
```

## Seguranca

Os arquivos de ambiente atuais usam valores locais ficticios. Substitua `BETTER_AUTH_SECRET`, `POSTGRES_PASSWORD` e demais valores sensiveis fora do controle de versao em ambientes reais.
