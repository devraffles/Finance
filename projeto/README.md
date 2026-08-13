# Kwak Finance

Aplicacao web local para gestao financeira integrada de PF, PJ/MEI e investimentos.

## Estado atual

As Fases 0 a 4 estao implementadas e estabilizadas para execucao via Docker:

- workspace pnpm em `projeto/`, frontend Next.js 14 e backend interno `@kwak-finance/backend`;
- PostgreSQL com Prisma, migration e seed idempotente com credenciais de desenvolvimento;
- autenticacao Better Auth por e-mail e senha, layout protegido e navegacao base;
- APIs protegidas para contas, transacoes, importacao CSV, IA, investimentos, metas, empresas e dashboard;
- Docker Compose dedicado `kwak-finance`, com os containeres `kwak_finance_app` e `kwak_finance_db`;
- Dockerfile com Node 20 Alpine, Corepack e pnpm.

Dashboard com dados reais/graficos e os modulos operacionais visuais permanecem nas Fases 5 e 6.

## Execucao recomendada

1. Copie `.env.example` para `.env` e ajuste apenas valores locais, se necessario.
2. Execute `pnpm run docker:up` dentro de `projeto/`.
3. Acesse `http://localhost:3000` e entre com `admin@kwakfinance.local` / `admin123`.

Para encerrar os servicos sem apagar dados, use `pnpm run docker:down`. O comando `pnpm run docker:reset` apaga o volume do PostgreSQL e recria migrations e seed.

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

Use somente `.env` para execucao local e Docker Compose. O arquivo `.env.example` documenta placeholders seguros e deve permanecer versionado; `.env` fica ignorado pelo Git. Para recursos de IA, configure `GOOGLE_GENERATIVE_AI_API_KEY` no `.env`.
