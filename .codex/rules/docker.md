# Docker E PostgreSQL

## Padrao Oficial

- O banco padrao do Financas 360 e PostgreSQL via Docker Compose.
- A execucao recomendada do app completo deve ser `pnpm run docker:up` dentro de `projeto/`.
- O Docker Compose deve conter os servicos `app` e `db`.
- O servico `db` deve usar `postgres:16-alpine`.
- O servico `db` deve ter volume nomeado para persistencia e `healthcheck` com `pg_isready`.
- O servico `app` deve usar imagem base `node:20-alpine` no `Dockerfile`.
- O `Dockerfile` deve habilitar Corepack e instalar dependencias com pnpm.
- O app deve expor `HOSTNAME=0.0.0.0` e porta `3000`.

## Variaveis De Ambiente

- `.env` e usado pelo Docker Compose.
- `.env.local` e usado apenas para execucao local fora do Docker.
- `DATABASE_URL` no Docker deve apontar para `db:5432`.
- `DATABASE_URL` local deve apontar para `localhost:5432`.
- Segredos reais nunca devem entrar em arquivos versionaveis.
- `.env.example` deve listar todas as variaveis necessarias com placeholders seguros.
- `ANTHROPIC_API_KEY` deve ficar vazio por padrao.

## Scripts Obrigatorios

O `package.json` em `projeto/` deve expor:

- `docker:up`: sobe app e banco com build.
- `docker:down`: para containers sem apagar volume.
- `docker:reset`: executa reset destrutivo documentado, recriando volume e seed.
- `docker:logs`: exibe logs do app.
- `docker:db:logs`: exibe logs do banco.
- `docker:db:studio`: abre Prisma Studio dentro do container app.
- `docker:shell`: abre shell no container app.
- `docker:seed`: roda seed dentro do container app.

Use `pnpm run docker:*` em documentacao e tarefas, nao `docker compose` direto, exceto para explicar o comando interno do script.

## Reset Destrutivo

- `docker compose down -v` apaga o volume do PostgreSQL e deve aparecer apenas em scripts/documentacao claramente marcados como destrutivos.
- Nunca execute reset destrutivo sem pedido explicito do usuario durante implementacao.
- O reset completo deve recriar banco, aplicar migrations e reexecutar seed idempotente.

## Relacao Com Execucao Local

- Docker e o caminho recomendado.
- Execucao local sem Docker e alternativa para desenvolvimento, mas ainda usa PostgreSQL.
- Nao introduza SQLite como fallback padrao.
