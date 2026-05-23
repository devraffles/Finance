# Obsidian, Graph E Serena

## Obsidian

- Este workspace tambem funciona como vault Obsidian.
- Plugins esperados:
  - `obsidian-local-rest-api`
  - `3d-graph`
- O REST local deve responder em `https://127.0.0.1:27124`.
- Se o MCP do Obsidian retornar `40101`, verifique a chave do plugin Local REST API do vault aberto.
- Use notas Markdown para decisoes arquiteturais, checklists e relatorios quando o usuario pedir.

## Graphify

- Consulte o grafo antes de fazer perguntas amplas sobre arquitetura quando `graphify-out/graph.json` existir.
- Comandos esperados:

```bash
/graphify .
/graphify . --update
/graphify query "como o modulo de transacoes se conecta ao dashboard?"
/graphify explain "Transacao"
```

- Nao invente relacoes de grafo; use apenas o que o grafo ou arquivos confirmam.
- Se nao houver grafo, crie somente quando o usuario pedir ou quando for necessario para uma tarefa de analise.

## Serena

- Projeto Serena: `kwak-Finance`.
- Use Serena para navegacao simbolica quando houver codigo TypeScript criado.
- Antes de editar codigo, prefira localizar simbolos com Serena.
- Para documentos e prompts, leitura direta de Markdown e aceitavel.
- Mantenha memorias de Serena atualizadas quando descobrir regras persistentes relevantes.

