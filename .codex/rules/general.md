# Regras Gerais

## Escopo

- Este workspace e a base de preparacao do Kwak Finance.
- O nome oficial do produto e Kwak Finance. Use esse nome em UI, README, documentacao, Docker, seed e textos de apoio.
- Nao use "Financas 360" como nome do produto; trate referencias antigas como legado a ser corrigido quando tocar no arquivo.
- O prompt principal esta em `prompt-projeto-codex.md`.
- A aplicacao final deve ser criada em `projeto/`, salvo instrucao contraria do usuario.
- Antes de implementar, confirme que a tarefa atual pede implementacao. Se pedir apenas regras, revisao, planejamento ou documentacao, nao crie codigo da aplicacao.
- A implementacao futura deve seguir `.codex/tasks.md`, que transforma o prompt em tarefas menores com criterios de aceite.
- Quando houver divergencia tecnica entre o prompt e as regras mais recentes, use as regras mais recentes para corrigir o prompt durante a implementacao.

## Fluxo De Trabalho

- Leia `AGENTS.md` antes de qualquer acao relevante.
- Use a pasta `exemplo/` apenas como referencia de organizacao de regras, nao como codigo fonte do projeto.
- Use a pasta `app/` existente apenas como referencia seletiva visual ou de componentes. Ela nao define stack, scripts, banco, arquitetura ou estrutura final do produto.
- Preserve arquivos de configuracao existentes do workspace, Obsidian e Serena.
- Nao mova nem apague `prompt-projeto-codex.md`.
- Se o prompt e as regras entrarem em conflito, siga esta ordem:
  1. Pedido mais recente do usuario.
  2. `AGENTS.md`.
  3. Arquivos em `.codex/rules/`.
  4. `prompt-projeto-codex.md`.

## Seguranca E Dados

- Nunca commite chaves reais.
- `.env` deve conter valores locais seguros e tambem ser usado pelo Docker Compose.
- `.env.example` deve documentar variaveis sem segredos reais.
- `GOOGLE_GENERATIVE_AI_API_KEY` deve ficar vazio por padrao.
- Dados seed podem ser realistas, mas devem ser ficticios.
- CNPJ, emails e transacoes de seed nao devem representar dados reais de terceiros.
- Use `pnpm` em todos os comandos de projeto.
- Use scripts `pnpm run docker:*` para operacoes comuns de Docker.
- Nao misture lockfiles: use `pnpm-lock.yaml`; nao gere `package-lock.json` ou `yarn.lock`.

## Idioma E Dominio

- Interface, README e mensagens de dominio devem estar em portugues do Brasil.
- Codigo pode usar nomes em portugues para entidades de dominio (`Conta`, `Transacao`, `Investimento`) e nomes tecnicos em ingles quando forem padroes de framework (`handler`, `layout`, `page`).
- Use PF/PJ de forma consistente.
- Trate valores negativos como despesas/dividas quando aplicavel.

## Exemplo De Decisao Correta

Pedido: "crie as regras".

Acao correta:

- Criar/editar `AGENTS.md` e `.codex/rules/*.md`.
- Nao executar `pnpm dlx create-next-app`.
- Nao instalar dependencias.
- Nao criar `src/`, `prisma/` ou telas do app.
