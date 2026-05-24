# Banco De Dados E Prisma

## Prisma

- Use PostgreSQL com Prisma via Docker Compose como padrao.
- O datasource oficial do Prisma deve ser `postgresql`.
- No Docker, use `DATABASE_URL` apontando para `postgresql://...@db:5432/...`.
- Fora do Docker, use `DATABASE_URL` apontando para `postgresql://...@localhost:5432/...`.
- Schema principal em `projeto/backend/prisma/schema.prisma`.
- Seed principal em `projeto/backend/prisma/seed.ts`.
- Sempre rode `prisma generate` apos alterar o schema.
- Use migrations Prisma como caminho principal para mudancas estruturais.
- `db:push` pode existir por compatibilidade, mas nao deve substituir migration quando houver mudanca estrutural relevante.
- `db:seed` deve ser idempotente e seguro para reexecucao.

## Modelagem

Modelos obrigatorios:

- `User`
- `Conta`
- `Transacao`
- `Investimento`
- `Aporte`
- `Meta`
- `Empresa`

Enums obrigatorios:

- Tipo de conta: `CORRENTE`, `POUPANCA`, `CARTAO`, `INVESTIMENTO`, `CAIXA`, `OUTRO`
- Perfil: `PF`, `PJ`
- Tipo de transacao: `RECEITA`, `DESPESA`, `TRANSFERENCIA`
- Tipo de investimento: `ACAO`, `FII`, `RENDA_FIXA`, `CRIPTO`, `FUNDO`, `TESOURO`, `PREVIDENCIA`, `OUTRO`
- Tipo de aporte: `COMPRA`, `VENDA`, `DIVIDENDO`, `RESGATE`, `JUROS`
- Tipo de empresa: `MEI`, `ME`, `EPP`, `LTDA`, `SA`, `AUTONOMO`

## Dinheiro

- O prompt define valores como `Float`; siga o prompt se nao houver decisao posterior.
- Centralize formatacao em `formatCurrency`.
- Nao use formatacao de moeda para calculos.
- Mantenha receitas positivas e despesas negativas em `Transacao.valor`.
- Cartao e dividas podem ter saldo negativo.

## Datas

- `data`: data real do evento financeiro.
- `competencia`: periodo contabil/gerencial da transacao.
- Use Day.js para normalizar datas recebidas de formularios, CSVs e APIs antes de persistir.
- Para exibicao, use `dd/MM/yyyy`.
- Para agrupamentos mensais, normalize cuidadosamente por ano e mes.

## Validacoes Brasileiras

- CNPJ de empresas deve ser validado com biblioteca confiavel antes de persistir.
- CPF/CNPJ, quando adicionados a novos fluxos, devem ser validados no schema Zod com helper especializado.
- Nao aceite apenas mascara visual como validacao de documento.

## Seed

- O seed deve ser deterministico o suficiente para testes manuais.
- Use dados ficticios e realistas.
- Crie ao menos:
  - 1 usuario admin;
  - 4 contas;
  - 1 empresa MEI;
  - 60 transacoes;
  - 5 investimentos;
  - 3 metas.

## Exemplo De Filtro Seguro

```ts
const transacoes = await prisma.transacao.findMany({
  where: {
    userId,
    data: {
      gte: startDate,
      lte: endDate,
    },
    perfil,
  },
  orderBy: {
    data: "desc",
  },
  take: limit,
  skip: (page - 1) * limit,
});
```
