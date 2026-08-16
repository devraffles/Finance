# AGENTS.md

Este arquivo e a fonte principal de regras para construir o projeto Kwak Finance. Antes de qualquer implementacao, leia este arquivo e as regras em `.codex/rules/`.

No momento, este repositorio contem o prompt de construcao e configuracoes de apoio. Nao assuma que o app Next.js ja existe ate encontrar `projeto/package.json` ou uma estrutura equivalente criada explicitamente.

## Missao Do Projeto

Construir uma aplicacao web local de gestao financeira integrada para:

- Financas pessoais (PF)
- Financas empresariais (MEI/PJ)
- Investimentos

Nome oficial do produto: **Kwak Finance**. Use este nome em interface, README, documentacao, Docker, seeds e textos de apoio. Nao use "Financas 360" como nome do produto.

Stack alvo:

- Node.js 24 LTS e pnpm 11
- Next.js 16 com App Router, React 19 e TypeScript 5.9+
- PostgreSQL 16 com Prisma ORM 7 via Docker Compose
- Tailwind CSS 4 com componentes shadcn/ui como padrao preferido de UI
- Better Auth 1.6+ com email e senha via Prisma/PostgreSQL
- Gemini via Vercel AI SDK 7 (`ai` e `@ai-sdk/google`)
- Recharts, lucide-react, Day.js, Zod, react-hook-form
- Bibliotecas especializadas para validacao de campos brasileiros quando aplicavel, por exemplo CPF/CNPJ
- pnpm 11 como package manager
- ESLint com Prettier

## Regra De Ordem

- Use `prompt-projeto-codex.md` como especificacao de produto e estrutura.
- Use `.codex/tasks.md` como fila de execucao quando o usuario pedir para implementar.
- Nao comece a codar se o pedido atual for apenas de regras, planejamento, revisao ou preparacao.
- Quando a implementacao for solicitada, construa o projeto em `projeto/`, conforme o prompt.
- Nao reporte conclusao do app antes de validar todos os criterios de conclusao do prompt.

## Regras Que Sempre Se Aplicam

- Use TypeScript para todo codigo de aplicacao.
- Nunca use `any`.
- Prefira named exports.
- Valide entradas de API com Zod.
- Use Day.js para parsing, normalizacao, comparacao e validacao de datas de entrada.
- Use bibliotecas confiaveis para validacoes brasileiras especificas, como CNPJ e CPF; integre essas validacoes via Zod.
- Toda rota protegida deve verificar sessao e filtrar por `userId`.
- Nunca retorne dados de outro usuario.
- Nunca coloque segredos reais em arquivos versionaveis.
- Use textos de interface em portugues do Brasil.
- Use formato monetario `R$` em `pt-BR`.
- Use datas de exibicao em `dd/MM/yyyy`.
- Use PostgreSQL via Docker Compose como banco padrao.
- Use Docker Compose dedicado ao Kwak Finance, com namespace/containeres exclusivos do projeto.
- O Compose deve declarar `name: kwak-finance`.
- Os containeres padrao devem ser `kwak_finance_app` e `kwak_finance_db`.
- Volumes Docker devem usar prefixo `kwak_finance_`, por exemplo `kwak_finance_postgres_data`.
- Use Prisma diretamente nas rotas ou em funcoes de servico locais, mantendo ownership e validacao defensiva.
- Use `pnpm` para criar o projeto, instalar dependencias e executar scripts.
- Configure Prettier e ESLint logo na fundacao do projeto.
- Separe backend e frontend:
  - backend em `projeto/backend/`;
  - frontend em `projeto/frontend/`;
  - nao importe Prisma, SDKs de IA, segredos ou regras de dominio diretamente em componentes de UI.

## Documentos Obrigatorios

Leia em conjunto:

- `.codex/tasks.md`
- `.codex/rules/general.md`
- `.codex/rules/architecture.md`
- `.codex/rules/typescript.md`
- `.codex/rules/database.md`
- `.codex/rules/docker.md`
- `.codex/rules/ui.md`
- `.codex/rules/ai.md`
- `.codex/rules/quality.md`
- `.codex/rules/git.md`
- `.codex/rules/obsidian-graph-serena.md`

## Comandos Esperados Apos Criacao Do App

Dentro de `projeto/`:

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

Se algum comando ainda nao existir, crie ou ajuste os scripts antes de considerar a etapa concluida.

## Criterios De Conclusao Do Projeto

O app so esta concluido quando:

1. `pnpm run setup` executa sem erros.
2. `pnpm run docker:up` sobe PostgreSQL e app sem erros.
3. `pnpm run dev` sobe em `http://localhost:3000` quando usado fora do Docker com PostgreSQL local.
4. Login funciona com `admin@kwakfinance.local` / `admin123`.
5. Dashboard exibe KPIs reais calculados a partir do seed.
6. Importacao de CSV Nubank funciona.
7. Categorizacao por IA retorna resultado quando `GOOGLE_GENERATIVE_AI_API_KEY` esta configurada.
8. Todos os modulos sao navegaveis sem erros de console.
9. `pnpm run docker:reset` recria o volume PostgreSQL e reexecuta migration/seed.
