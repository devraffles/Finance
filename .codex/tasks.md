# Tasks De Execucao - Kwak Finance

Este arquivo transforma `prompt-projeto-codex.md` em uma fila de trabalho executavel. O prompt continua sendo a especificacao de produto; este arquivo define ordem, entregaveis e criterios de aceite.

Nao execute estas tarefas ate o usuario pedir explicitamente para implementar.

## Padrao De Execucao

- Package manager: `pnpm`.
- Projeto final: `projeto/`, usado como raiz de workspace, Docker, envs e scripts operacionais.
- Nome oficial do produto: Kwak Finance.
- Frontend: `projeto/frontend/`, contendo o app Next.js 14, App Router, paginas, layouts, componentes, estilos e chamadas HTTP.
- Backend: `projeto/backend/`, contendo Prisma, seed, autenticacao, schemas Zod, servicos, regras de dominio, integracoes externas e acesso a dados.
- O backend nao deve ser tratado como componentes de UI. Quando usar Next.js API Routes, crie adapters em `projeto/frontend/src/app/api/**` que chamam funcoes do backend, mantendo validacao, ownership e persistencia em `projeto/backend/`.
- Scripts obrigatorios devem ser expostos no `package.json` de `projeto/`, mesmo quando delegarem para `frontend/` ou `backend/`.
- Banco padrao: PostgreSQL via Docker Compose.
- UI deve usar shadcn/ui como base padrao para componentes reutilizaveis.
- Datas de entrada devem ser parseadas, normalizadas e validadas com Day.js.
- Campos brasileiros, como CNPJ e CPF, devem usar bibliotecas especializadas integradas aos schemas Zod.
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
- Configurar o backend como pacote interno `@kwak-finance/backend`, para uso apenas em codigo server-side.
- Entrar em `projeto/`.
- Garantir uso de `pnpm`.
- Criar `projeto/Dockerfile` com `node:20-alpine`, `corepack enable` e instalacao via pnpm na raiz do workspace.
- Criar `projeto/docker-compose.yml` com `name: kwak-finance` e servicos `app` e `db`.
- Configurar containeres exclusivos `kwak_finance_app` e `kwak_finance_db`, com volumes/redes usando prefixo `kwak_finance_`.
- Criar `projeto/.dockerignore`.
- Criar `projeto/.env.example` com placeholders seguros.
- Criar `projeto/.env` para Docker com `DATABASE_URL` apontando para `db:5432`.
- Usar somente `projeto/.env` para execucao local e Docker Compose; no Compose, sobrescrever `DATABASE_URL` do app para `db:5432`.
- Instalar dependencias de runtime do prompt no workspace correto:
  - UI, charts, forms e cliente auth em `frontend`;
  - Prisma, Better Auth server config, Zod, Vercel AI SDK com Gemini, Day.js e bibliotecas de dominio/validacao em `backend` quando forem server-side.
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
- Garantir que `projeto/.env` contenha variaveis locais seguras e que o Prisma consiga ler o `DATABASE_URL`.
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
- Criar `projeto/backend/src/lib/gemini.ts` com wrapper e tratamento quando API key estiver ausente.
- Criar tipos de dominio em `projeto/backend/src/types/financas.ts`.
- Criar contratos seguros para a UI em `projeto/frontend/src/types/financas.ts`, sem expor campos internos do banco.
- Criar provider de sessao em `projeto/frontend/` quando necessario.

Aceite:

- Login consegue validar usuario seed quando UI existir.
- Helpers tem comportamento coerente para moeda, data, percentual e variacao.
- Nenhum segredo e exposto no client.

## Fase 2.1 - Autenticacao Em Dois Fatores E Login Google

Objetivo: reforcar o acesso ao Kwak Finance com segundo fator opcional por codigo enviado por e-mail ou aplicativo autenticador compativel com Google Authenticator, e permitir login social seguro com Google.

Tarefas:

- Estender a configuracao do Better Auth no backend para suportar login Google OAuth e MFA, sem remover o login existente por e-mail e senha.
- Adicionar ao `.env.example` todos os placeholders necessarios, sem valores reais:
  - `GOOGLE_CLIENT_ID`;
  - `GOOGLE_CLIENT_SECRET`;
  - configuracao de remetente/provedor de e-mail necessaria para entrega do codigo de MFA;
  - segredo de criptografia proprio para dados sensiveis de MFA, quando exigido pela implementacao escolhida.
- Documentar no README as variaveis, a URL de callback do Google e o processo de configuracao local; manter credenciais e segredos fora do repositorio.
- Modelar com Prisma os dados estritamente necessarios para MFA, incluindo metodo habilitado, segredo TOTP protegido em repouso, tentativas, expiracao e uso unico de codigos por e-mail. Criar migration e atualizar o seed de modo idempotente, sem habilitar MFA para o usuario admin por padrao.
- Implementar servico backend para iniciar, confirmar, ativar, desativar e consultar MFA. O servico deve exigir sessao e filtrar toda operacao por `userId`.
- Implementar MFA por e-mail com codigo alfanumerico gerado por fonte criptograficamente segura, uso unico, expiracao curta e armazenamento apenas de hash do codigo. Nunca registrar, retornar em API ou persistir o codigo em texto puro.
- Aplicar limite de tentativas, limite de reenvio e intervalo minimo entre envios de codigo. Respostas de erro nao devem revelar se uma conta, metodo ou codigo especifico existe.
- Implementar TOTP compativel com Google Authenticator: gerar segredo e URI `otpauth` somente durante a ativacao autenticada; exibir QR code e chave manual; exigir a validacao de um codigo TOTP antes de marcar o metodo como ativo; proteger o segredo no banco e nao expo-lo depois da configuracao.
- Definir fluxo de desafio apos credenciais primarias validas: a sessao definitiva so e criada apos validar o metodo MFA ativo. Permitir apenas um desafio pendente por vez, vinculado ao usuario e com expiracao.
- Implementar recuperacao segura quando o usuario perder o acesso ao segundo fator, por meio de codigos de recuperacao de uso unico, exibidos apenas uma vez na ativacao e armazenados como hash. A redefinicao de MFA deve exigir autenticacao adequada e invalidar desafios/codigos anteriores.
- Criar adapters HTTP finos em `frontend/src/app/api/**/route.ts` para os fluxos de MFA e Google OAuth, delegando validacao, entrega de e-mail e persistencia ao backend.
- Atualizar a pagina de login com botao "Entrar com Google", login por e-mail/senha e etapa condicional para o desafio MFA. Manter textos, validacoes e mensagens em portugues do Brasil.
- Criar em Configuracoes uma secao "Seguranca" com abas ou controles para: estado do MFA, ativacao/desativacao de e-mail, configuracao/remoção de aplicativo autenticador e visualizacao/renovacao de codigos de recuperacao. Confirmar a senha atual antes de mudancas sensiveis.
- Garantir que contas criadas via Google possam ser associadas de forma segura a uma conta existente apenas mediante politica explicita de e-mail verificado; nunca vincular identidades por e-mail nao verificado.
- Registrar auditoria minima de eventos sensiveis de autenticacao (ativacao/desativacao de MFA, falhas repetidas, uso de codigo de recuperacao e login Google), sem incluir senhas, codigos, tokens, segredos TOTP ou dados desnecessarios.
- Criar testes unitarios dos servicos e testes de integracao dos fluxos: codigo de e-mail valido, expirado, reutilizado e excedendo tentativas; TOTP valido/invalido; codigo de recuperacao; protecao de rota; e login Google com callback valido e erro controlado.

Aceite:

- Login por e-mail e senha continua funcionando quando MFA esta desativado.
- Usuario com MFA por e-mail ativo recebe um codigo alfanumerico, de uso unico e com expiracao; somente apos valida-lo recebe sessao autenticada.
- Reenvios e tentativas invalidas sao limitados sem expor informacoes sensiveis.
- Usuario consegue ativar TOTP lendo um QR code no Google Authenticator (ou app compativel) e so conclui a ativacao apos informar um codigo valido.
- Segredo TOTP, codigos de e-mail e codigos de recuperacao nao sao retornados por endpoints, logs ou consultas de UI apos sua exibicao autorizada.
- Usuario consegue concluir o login com TOTP e usar um codigo de recuperacao uma unica vez quando necessario.
- Usuario consegue entrar com Google quando as variaveis OAuth estao configuradas; quando ausentes ou quando o callback falha, a UI apresenta erro controlado em portugues do Brasil.
- Todas as rotas de configuracao, desafio e recuperacao validam payload com Zod, verificam sessao quando aplicavel e respeitam `userId`.
- `pnpm run db:generate`, `pnpm run lint`, `pnpm run format:check`, `pnpm run typecheck` e `pnpm run build` passam; os testes adicionados passam.

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
- Criar helpers de validacao com Day.js para datas e bibliotecas especializadas para CNPJ/CPF quando aplicavel.
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
- Nenhuma pagina ou componente visual importa Prisma, SDKs de IA, variaveis secretas ou servicos de persistencia.
- Route handlers em `projeto/frontend/src/app/api/**` ficam finos e delegam regra de dominio para `projeto/backend/`.
- Payloads invalidos retornam `400`.
- Datas invalidas e documentos brasileiros invalidos retornam `400`.
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

Objetivo: integrar Gemini sem fragilizar o app.

Tarefas:

- Categorizar transacoes em lote.
- Gerar insights a partir de dados agregados.
- Tratar ausencia de `GOOGLE_GENERATIVE_AI_API_KEY`.
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
