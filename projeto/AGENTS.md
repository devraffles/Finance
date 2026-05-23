# AGENTS.md

Este diretório contém a aplicação Finanças 360.

As regras principais continuam na raiz do workspace:

- `../AGENTS.md`
- `../.codex/tasks.md`
- `../.codex/rules/`

Regras locais:

- Use `pnpm` como package manager.
- Use TypeScript em todo código de aplicação.
- Não use `any`.
- Não versione segredos reais.
- Use PostgreSQL via Docker Compose como banco padrão.
- Mantenha textos de interface em português do Brasil.
- Separe backend e frontend:
  - backend em `backend/`;
  - frontend em `frontend/`;
  - não misture regra de negócio, Prisma ou integrações externas em componentes de UI.
