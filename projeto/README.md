# Kwak Finance

Aplicacao web local para gestao financeira integrada de PF, PJ/MEI e investimentos.

## Estado atual

O workspace usa a stack atual do projeto e esta em retomada de implementacao:

- workspace pnpm 11 em `projeto/`, frontend Next.js 16 e backend interno `@kwak-finance/backend`;
- PostgreSQL com Prisma, migration e seed idempotente com credenciais de desenvolvimento;
- autenticacao Better Auth por e-mail e senha, layout protegido e navegacao base;
- APIs protegidas para contas, transacoes, importacao CSV, IA, investimentos, metas, empresas e dashboard;
- Docker Compose dedicado `kwak-finance`, com os containeres `kwak_finance_app` e `kwak_finance_db`, volume e rede persistentes com prefixo `kwak_finance_`;
- Dockerfile com Node 24 Alpine, Corepack e pnpm.

O dashboard consome dados reais das APIs. Os modulos operacionais seguem a fila oficial em `../.codex/tasks.md`.

## Execucao recomendada

1. Copie `.env.example` para `.env`. Esse e o unico arquivo de ambiente usado localmente e pelo Docker Compose; mantenha `DATABASE_URL` apontando para `localhost:5433`.
2. Execute `pnpm run docker:up` dentro de `projeto/`.
3. Acesse `http://localhost:3000` e entre com `admin@kwakfinance.local` / `admin123`.

Para encerrar os servicos sem apagar dados, use `pnpm run docker:down`. O comando `pnpm run docker:reset` e destrutivo: apaga o volume do PostgreSQL e recria migrations e seed.

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

Use somente `.env` para execucao local e Docker Compose. Ele concentra as credenciais locais do PostgreSQL, e o Compose altera apenas o host interno da aplicacao para `db:5432`. O Compose injeta essas variaveis em runtime; o `.env` nao entra na imagem. O arquivo `.env.example` documenta valores ficticios seguros e deve permanecer versionado; `.env` fica ignorado pelo Git. Para recursos de IA, configure `GOOGLE_GENERATIVE_AI_API_KEY` no `.env`.
