# Qualidade, Validacao E Entrega

## Antes De Finalizar Implementacoes

Quando houver app criado, rode os comandos relevantes:

```bash
pnpm run lint
pnpm run format:check
pnpm run typecheck
pnpm run build
```

Quando schema ou seed mudar:

```bash
pnpm run db:generate
pnpm run db:push
pnpm run db:seed
```

Quando a tarefa tocar fluxo visual importante, valide manualmente no navegador.

## Testes Manuais Obrigatorios Do Produto

- Login com usuario seed.
- Dashboard com KPIs nao zerados.
- Listagem de contas.
- Criacao/edicao de transacao.
- Filtros de transacoes.
- Import CSV Nubank.
- Categorizacao com IA quando chave estiver configurada.
- Navegacao entre todos os modulos.

## Erros

- Nao esconda falhas de comando.
- Se nao conseguir rodar validacao por falta de dependencia, rede ou chave, informe claramente.
- Nao diga que algo esta completo se nao foi validado.
- Para formularios com datas, valide casos de data invalida, limite inicial/final e normalizacao com Day.js.
- Para empresas, valide CNPJ valido, CNPJ invalido e CNPJ duplicado do mesmo usuario.

## README

O README final deve conter:

- instalacao em 3 passos;
- comandos uteis;
- credenciais padrao;
- modulos disponiveis;
- observacao sobre `ANTHROPIC_API_KEY`;
- instrucao para reset do banco.

## ESLint E Prettier

- Configure ESLint desde a fundacao.
- Configure Prettier desde a fundacao.
- Use `eslint-config-prettier` para evitar conflito entre regras de formatacao e lint.
- Scripts obrigatorios:

```json
{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit"
  }
}
```

- Antes de finalizar qualquer etapa com codigo, rode `pnpm run lint`, `pnpm run format:check` e `pnpm run typecheck` quando esses scripts ja existirem.

## Commits

Use a politica de Git e Conventional Commits definida em `.codex/rules/git.md`.
