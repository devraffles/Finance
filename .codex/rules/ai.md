# Integracao Com IA

## Gemini API

- Wrapper unico em `backend/src/lib/gemini.ts`.
- Funcoes obrigatorias:
  - `callGemini`
  - `categorizarTransacoes`
  - `gerarInsights`
- `GOOGLE_GENERATIVE_AI_API_KEY` deve vir de variavel de ambiente.
- Se a chave estiver ausente, retorne erro controlado ou estado explicativo, sem quebrar o app inteiro.

## Dados Enviados Para IA

- Envie somente dados necessarios.
- Nao envie senha, hash de senha, tokens ou segredos.
- Minimize dados pessoais.
- Para categorizacao, envie descricao, valor, data e contexto financeiro minimo.
- Para insights, agregue dados antes de enviar quando possivel.

## Saida Estruturada

- Prefira respostas em JSON validavel por Zod.
- Valide a resposta da IA antes de salvar no banco.
- Se a IA retornar conteudo invalido, registre erro controlado e nao atualize dados incorretamente.

## Exemplo De Contrato

```ts
interface CategorizacaoResult {
  transacaoId: string;
  categoria: string;
  subcategoria?: string;
  confianca: number;
  justificativa: string;
}
```

## Regras De Produto

- A IA sugere categorias e insights; ela nao deve sobrescrever dados criticos sem acao explicita do usuario.
- Marque transacoes categorizadas pela IA com `categorizadoPorIA = true`.
- Mostre falhas de IA de forma util, sem expor stack trace.
