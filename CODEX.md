# CODEX.md

Este arquivo orienta o Codex ao trabalhar neste workspace.

O contrato principal esta em `AGENTS.md`. As regras detalhadas ficam em `.codex/rules/`.

## Estado Atual

- Este repositorio ainda nao e o app final.
- O prompt principal esta em `prompt-projeto-codex.md`.
- A fila de tarefas executaveis esta em `.codex/tasks.md`.
- O app deve ser criado em `projeto/` quando o usuario pedir implementacao.
- A pasta `exemplo/` e somente referencia de organizacao.
- A pasta `app/` pode servir como referencia seletiva visual ou de componentes, mas nao define stack, banco, scripts ou arquitetura.
- O banco padrao do produto alvo e PostgreSQL via Docker Compose.

## Regras De Navegacao

- Leia `AGENTS.md` antes de implementar.
- Para regras especificas, consulte `.codex/rules/`.
- Use Serena para codigo quando o app existir.
- Use Obsidian para notas quando o vault/MCP estiver ativo.
- Use Graphify quando houver necessidade de mapa de conhecimento ou quando o usuario pedir.

## Comandos Futuros Do App

Dentro de `projeto/`, apos criacao:

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
```

Nao execute esses comandos enquanto o app ainda nao existir.
