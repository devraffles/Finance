# Tasks De Execucao - Financas 360

Este arquivo transforma `prompt-projeto-codex.md` em uma fila de trabalho executavel. O prompt continua sendo a especificacao de produto; este arquivo define ordem, entregaveis e criterios de aceite.

Nao execute estas tarefas ate o usuario pedir explicitamente para implementar.

## Padrao De Execucao

- Package manager: `pnpm`.
- Projeto final: `projeto/`, usado como raiz de workspace, Docker, envs e scripts operacionais.
- Frontend: `projeto/frontend/`, contendo o app Next.js 14, App Router, paginas, layouts, componentes, estilos e chamadas HTTP.
- Backend: `projeto/backend/`, contendo Prisma, seed, autenticacao, schemas Zod, servicos, regras de dominio, integracoes externas e acesso a dados.
- O backend nao deve ser tratado como componentes de UI. Quando usar Next.js API Routes, crie adapters em `projeto/frontend/src/app/api/**` que chamam funcoes do backend, mantendo validacao, ownership e persistencia em `projeto/backend/`.
- Scripts obrigatorios devem ser expostos no `package.json` de `projeto/`, mesmo quando delegarem para `frontend/` ou `backend/`.
- Banco padrao: PostgreSQL via Docker Compose.
- Cada fase deve terminar com validacao objetiva.
- Nao avance para uma fase dependente se a fase anterior estiver quebrada.
- Sempre atualize README ou notas tecnicas quando uma decisao importante mudar o uso do projeto.
- Ao concluir uma task implementada, siga `.codex/rules/git.md`: valide, verifique `git status --short` e crie um commit Conventional Commit com apenas as mudancas da task.

## Fase 0 - Fundacao De Ferramentas

Objetivo: criar a base Next.js, Docker e ferramentas antes de dominio.

Tarefas:

- Criar `projeto/package.json` como raiz operacional dos comandos obrigatorios.
- Criar `projeto/pnpm-workspace.yaml` incluindo `frontend` e `backend`.
- Criar app frontend com `pnpm dlx create-next-app@latest projeto/frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git`.
- Criar pacote backend em `projeto/backend/` com `package.json`, `tsconfig.json` e `src/`.
- Configurar o backend como pacote interno, por exemplo `@financas360/backend`, para uso apenas em codigo server-side.
- Entrar em `projeto/`.
- Garantir uso de `pnpm`.
- Criar `projeto/Dockerfile` com `node:20-alpine`, `corepack enable` e instalacao via pnpm na raiz do workspace.
- Criar `projeto/docker-compose.yml` com servicos `app` e `db`.
- Criar `projeto/.dockerignore`.
- Criar `projeto/.env.example` com placeholders seguros.
- Criar `projeto/.env` para Docker com `DATABASE_URL` apontando para `db:5432`.
- Criar `projeto/.env.local` para execucao local com `DATABASE_URL` apontando para `localhost:5432`.
- Instalar dependencias de runtime do prompt no workspace correto:
  - UI, charts, forms e cliente auth em `frontend`;
  - Prisma, Better Auth server config, Zod, Claude SDK e bibliotecas de dominio em `backend` quando forem server-side.
- Instalar dependencias dev no workspace correto, mantendo Prettier, ESLint e TypeScript acessiveis pela raiz `projeto/`.
- Adicionar Prettier e integracao ESLint na raiz:
  - `prettier`
  - `eslint-config-prettier`
- Criar scripts:
  - `dev`
  - `build`
  - `start`
  - `lint`
  - `format`
  - `format:check`
  - `typecheck`
  - `docker:up`
  - `docker:down`
  - `docker:reset`
  - `docker:logs`
  - `docker:db:logs`
  - `docker:db:studio`
  - `docker:shell`
  - `docker:seed`

Aceite:

- `pnpm install` conclui.
- `pnpm --filter frontend lint` executa ou esta documentado por script raiz equivalente.
- `pnpm --filter backend typecheck` executa ou esta documentado por script raiz equivalente.
- `pnpm run docker:up` sobe PostgreSQL e app ou falha apenas por pendencias documentadas da fase atual.
- `pnpm run lint` executa.
- `pnpm run format:check` executa.
- `pnpm run typecheck` executa.
- `pnpm run build` executa ou falha apenas por pendencias documentadas da fase atual.

## Fase 1 - Banco E Seed

Objetivo: criar modelo de dados e dados locais realistas.

Tarefas:

- Inicializar Prisma com PostgreSQL em `projeto/backend/prisma/`.
- Criar `projeto/backend/prisma/schema.prisma` com todos os modelos e enums do prompt.
- Criar singleton Prisma em `projeto/backend/src/lib/prisma.ts`.
- Garantir que `projeto/.env.local` contenha variaveis locais seguras e que o Prisma consiga ler o `DATABASE_URL`.
- Criar `projeto/backend/prisma/seed.ts` com usuario, contas, empresa, transacoes, investimentos e metas.
- Criar scripts Prisma:
  - `db:generate`
  - `db:migrate`
  - `db:push`
  - `db:seed`
  - `db:studio`
  - `db:reset`
  - `setup`

Aceite:

- `pnpm run db:generate` passa.
- `pnpm run db:migrate` passa no ambiente configurado.
- `pnpm run db:push` existe por compatibilidade e nao substitui migration estrutural.
- `pnpm run db:seed` cria dados.
- `pnpm run setup` executa a cadeia completa.

## Fase 2 - Auth, Utils E Tipos

Objetivo: deixar infraestrutura de aplicacao pronta.

Tarefas:

- Criar `projeto/backend/src/lib/auth.ts` com Better Auth, email/senha, Prisma adapter e validacao Zod de configuracao/credenciais.
- Criar adapter Better Auth em `projeto/frontend/src/app/api/auth/[...all]/route.ts` importando apenas configuracao server-side do backend.
- Criar `projeto/frontend/src/lib/utils.ts` com `cn`, formatadores e helpers financeiros sem dependencia de Prisma, IA ou segredos.
- Criar `projeto/backend/src/lib/claude.ts` com wrapper e tratamento quando API key estiver ausente.
- Criar tipos de dominio em `projeto/backend/src/types/financas.ts`.
- Criar contratos seguros para a UI em `projeto/frontend/src/types/financas.ts`, sem expor campos internos do banco.
- Criar provider de sessao em `projeto/frontend/` quando necessario.

Aceite:

- Login consegue validar usuario seed quando UI existir.
- Helpers tem comportamento coerente para moeda, data, percentual e variacao.
- Nenhum segredo e exposto no client.

## Fase 3 - Layout Base

Objetivo: criar a casca navegavel do app.

Tarefas:

- Configurar `projeto/frontend/src/app/layout.tsx` com fontes, tema e providers.
- Criar rota de login em `projeto/frontend/src/app/(auth)/login/page.tsx`.
- Criar layout protegido em `projeto/frontend/src/app/(app)/layout.tsx`.
- Criar `Sidebar` e `Header`.
- Implementar navegacao responsiva.

Aceite:

- Usuario nao autenticado vai para `/login`.
- Usuario autenticado acessa `/dashboard`.
- Sidebar e header aparecem nas paginas protegidas.
- Mobile nao quebra layout.

## Fase 4 - APIs De Dominio

Objetivo: implementar endpoints protegidos e validados no backend.

Tarefas:

- Criar schemas Zod para payloads e filtros.
- Implementar schemas em `projeto/backend/src/schemas/`.
- Implementar servicos de dominio em `projeto/backend/src/services/`.
- Implementar handlers/adapters HTTP em `projeto/frontend/src/app/api/**/route.ts` chamando os servicos do backend.
- Implementar CRUD de contas.
- Implementar CRUD e filtros de transacoes.
- Implementar import CSV.
- Implementar categorizacao IA.
- Implementar CRUD de investimentos e aportes.
- Implementar CRUD de metas.
- Implementar CRUD de empresas.
- Implementar endpoints/adapters de dashboard e insights.

Aceite:

- Toda rota protegida valida sessao.
- Toda consulta filtra `userId`.
- Nenhuma pagina ou componente visual importa Prisma, Claude SDK, variaveis secretas ou servicos de persistencia.
- Route handlers em `projeto/frontend/src/app/api/**` ficam finos e delegam regra de dominio para `projeto/backend/`.
- Payloads invalidos retornam `400`.
- Recurso inexistente/sem ownership retorna `404`.
- Listagens tem ordenacao explicita.

## Fase 5 - Dashboard

Objetivo: exibir visao geral real calculada do seed.

Tarefas:

- Criar pagina `projeto/frontend/src/app/(app)/dashboard/page.tsx`.
- Criar KPIs.
- Criar graficos de fluxo de caixa, patrimonio e categorias.
- Criar cards de insights e alertas.

Aceite:

- KPIs usam dados reais do banco.
- Graficos nao quebram com listas vazias.
- Dashboard carrega apos login.

## Fase 6 - Modulos Operacionais

Objetivo: entregar telas principais de operacao.

Tarefas:

- Contas.
- Transacoes.
- Importacao CSV Nubank.
- Investimentos.
- Empresarial.
- Metas.
- Configuracoes.

Aceite:

- Cada modulo permite listar, criar, editar e excluir quando aplicavel.
- Estados vazio, loading e erro existem.
- Filtros principais funcionam.
- Modais validam campos antes de enviar.

## Fase 7 - IA E Insights

Objetivo: integrar Claude sem fragilizar o app.

Tarefas:

- Categorizar transacoes em lote.
- Gerar insights a partir de dados agregados.
- Tratar ausencia de `ANTHROPIC_API_KEY`.
- Validar resposta da IA antes de persistir.

Aceite:

- Sem chave, UI mostra estado controlado.
- Com chave, endpoint retorna categorias/insights validos.
- Falha da IA nao corrompe dados existentes.

## Fase 8 - Polimento E Documentacao

Objetivo: deixar projeto usavel localmente.

Tarefas:

- Criar README com instalacao em 3 passos.
- Documentar Docker como caminho recomendado e execucao local com PostgreSQL como alternativa.
- Documentar a separacao entre `frontend/` e `backend/`, incluindo que os scripts sao executados de `projeto/`.
- Documentar credenciais padrao.
- Documentar comandos.
- Revisar responsividade.
- Revisar acessibilidade basica.
- Rodar validacoes finais.

Aceite:

- `pnpm run setup` passa.
- `pnpm run docker:up` passa.
- `pnpm run dev` sobe em `http://localhost:3000`.
- Login admin funciona.
- Dashboard mostra KPIs reais.
- CSV Nubank funciona.
- IA funciona quando chave esta configurada.
- Todos os modulos navegam sem erro de console.
- `pnpm run docker:reset` recria volume, migrations e seed.
