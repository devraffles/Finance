# AGENTS.md

Este arquivo e a fonte principal de regras para construir o projeto Financas 360. Antes de qualquer implementacao, leia este arquivo e as regras em `.codex/rules/`.

No momento, este repositorio contem o prompt de construcao e configuracoes de apoio. Nao assuma que o app Next.js ja existe ate encontrar `projeto/package.json` ou uma estrutura equivalente criada explicitamente.

## Missao Do Projeto

Construir uma aplicacao web local de gestao financeira integrada para:

- Financas pessoais (PF)
- Financas empresariais (MEI/PJ)
- Investimentos

Stack alvo:

- Next.js 14 com App Router e TypeScript
- PostgreSQL com Prisma via Docker Compose
- Tailwind CSS com componentes no estilo shadcn/ui
- NextAuth com Credentials Provider
- Claude API via `@anthropic-ai/sdk`
- Recharts, lucide-react, date-fns, Zod, react-hook-form
- pnpm como package manager
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
- Toda rota protegida deve verificar sessao e filtrar por `userId`.
- Nunca retorne dados de outro usuario.
- Nunca coloque segredos reais em arquivos versionaveis.
- Use textos de interface em portugues do Brasil.
- Use formato monetario `R$` em `pt-BR`.
- Use datas de exibicao em `dd/MM/yyyy`.
- Use PostgreSQL via Docker Compose como banco padrao.
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
4. Login funciona com `admin@projeto.local` / `admin123`.
5. Dashboard exibe KPIs reais calculados a partir do seed.
6. Importacao de CSV Nubank funciona.
7. Categorizacao por IA retorna resultado quando `ANTHROPIC_API_KEY` esta configurada.
8. Todos os modulos sao navegaveis sem erros de console.
9. `pnpm run docker:reset` recria o volume PostgreSQL e reexecuta migration/seed.
