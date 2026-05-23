# Git E Conventional Commits

## Uso Do Git

- Use Git como historico oficial do projeto a partir da primeira implementacao apos esta regra.
- Se o workspace ainda nao tiver `.git`, inicialize o repositorio antes de finalizar a proxima task implementada.
- Antes de editar, verifique o estado com `git status --short` quando o repositorio existir.
- Antes de commitar, verifique novamente `git status --short` e inclua apenas arquivos relacionados a task atual.
- Nunca reverta, sobrescreva ou inclua em commit mudancas nao relacionadas feitas pelo usuario sem pedido explicito.
- Nunca versione segredos reais, `.env`, `.env.local`, `node_modules`, `.next`, logs, volumes de banco ou artefatos gerados.
- Se uma task criar ou alterar `.gitignore`, confirme que os arquivos sensiveis e gerados ficam ignorados antes do commit.

## Commit Por Task

- Ao concluir uma task implementada, rode as validacoes relevantes e crie um commit.
- Nao crie commit se uma validacao obrigatoria falhar, exceto quando a falha estiver explicitamente documentada como pendencia aceita da fase.
- Se a task for apenas de regras/documentacao, valide por busca estatica e inspeção dos arquivos alterados.
- Se a task alterar codigo de app, rode no minimo:

```bash
pnpm run lint
pnpm run format:check
pnpm run typecheck
```

- Se a task alterar build, dependencias ou configuracao Next.js, rode tambem:

```bash
pnpm run build
```

- Se a task alterar Prisma schema ou seed, rode tambem:

```bash
pnpm run db:generate
```

## Conventional Commits

- Use sempre o formato:

```text
type(scope): summary
```

- O `summary` deve ser curto, no imperativo, sem ponto final.
- Tipos permitidos:
  - `feat`: nova funcionalidade de produto;
  - `fix`: correcao de bug;
  - `docs`: documentacao, prompts, regras e tarefas;
  - `chore`: manutencao sem impacto direto de produto;
  - `refactor`: reorganizacao sem mudar comportamento;
  - `test`: testes;
  - `build`: build, dependencias e empacotamento;
  - `ci`: automacao de CI;
  - `style`: formatacao sem mudanca semantica.
- Scopes preferenciais:
  - `backend`;
  - `frontend`;
  - `db`;
  - `docker`;
  - `auth`;
  - `ui`;
  - `tasks`;
  - `rules`;
  - `docs`.

## Exemplos

```text
docs(rules): add git workflow
docs(tasks): align frontend and backend paths
feat(db): add initial prisma schema
feat(frontend): add protected app layout
fix(auth): enforce user id in session
chore(docker): ignore generated app logs
```
