# Arquitetura

## Estrutura Alvo

Quando o app for criado, a estrutura esperada e:

```text
projeto/
  backend/
    prisma/
      schema.prisma
      seed.ts
    src/
      lib/
        auth.ts
        claude.ts
        prisma.ts
      routes/
      schemas/
      services/
      types/
        financas.ts
  frontend/
    src/
      app/
        (auth)/
        (app)/
      components/
        dashboard/
        layout/
        ui/
      lib/
        api-client.ts
        utils.ts
      types/
        financas.ts
```

## Separacao Backend E Frontend

- O backend deve ficar em `backend/` e concentrar Prisma, autenticacao, validacao Zod, integracoes externas, regras de dominio e acesso a dados.
- O frontend deve ficar em `frontend/` e concentrar Next.js App Router, layouts, paginas, componentes, estado de UI e chamadas ao backend.
- Componentes React nao devem importar Prisma, SDKs de IA, variaveis secretas ou servicos de persistencia.
- Route handlers em `frontend/src/app/api/**` devem ser adapters finos que importam funcoes server-side do pacote interno `@kwak-finance/backend`.
- Apenas codigo server-side do frontend pode importar `@kwak-finance/backend`; componentes visuais, hooks client e utilitarios de UI nao podem importar backend.
- Contratos compartilhados devem ser tipados explicitamente; quando houver duplicacao inevitavel entre backend e frontend, mantenha os tipos pequenos e estaveis.
- APIs e servicos protegidos devem verificar sessao no backend e sempre filtrar dados por `userId`.

## Next.js

- Use App Router.
- Use Server Components por padrao.
- Use Client Components somente quando houver estado de UI, formulario, evento, chart interativo ou hook de browser.
- Proteja rotas de app em `frontend/src/app/(app)/layout.tsx` com sessao vinda do backend.
- Redirecione usuarios nao autenticados para `/login`.
- Evite misturar regra de negocio pesada dentro de componentes visuais.

## Backend

- Toda API ou servico de dados deve ficar em `backend/`.
- Toda rota protegida deve:
  - obter sessao;
  - retornar `401` quando nao autenticada;
  - filtrar consultas por `userId`;
  - validar entrada com Zod;
  - usar Day.js para normalizar datas recebidas quando houver filtros, formularios ou importacoes;
  - usar validadores especializados para campos brasileiros, como CNPJ/CPF, quando existirem no payload;
  - retornar erros em JSON consistente.
- Use status HTTP coerentes:
  - `200` para leitura/atualizacao bem sucedida;
  - `201` para criacao;
  - `400` para payload invalido;
  - `401` para nao autenticado;
  - `404` para recurso inexistente ou sem ownership;
  - `409` para conflito de negocio;
  - `500` para falha inesperada.

## Ownership

Nunca busque um registro apenas por `id` em rota autenticada. Inclua `userId` no filtro sempre que possivel.

Exemplo correto:

```ts
const conta = await prisma.conta.findFirst({
  where: {
    id: params.id,
    userId: session.user.id,
  },
});
```

Exemplo incorreto:

```ts
const conta = await prisma.conta.findUnique({
  where: { id: params.id },
});
```

## Validacao Em Duas Camadas

- Rota/API: valida formato, tipos, limites, filtros e payload.
- Servico/regra de dominio: valida estado, ownership, consistencia financeira e relacoes.
- Validacoes especificas de dominio brasileiro, como CNPJ valido, devem ficar em helpers reutilizaveis no backend e ser chamadas pelos schemas Zod.

Exemplos de regra de dominio:

- transacao PJ com `empresaId` deve pertencer ao mesmo usuario;
- conta inativa nao deve receber novas transacoes sem regra explicita;
- aporte de venda nao pode deixar quantidade negativa;
- meta concluida deve ter `valorAtual >= valorAlvo`;
- transferencia deve ter origem e destino validos quando esse fluxo existir.

## Respostas

- Nao retorne models Prisma crus quando a resposta puder vazar campos internos.
- Monte objetos de resposta explicitamente em endpoints mais sensiveis.
- Ordene listas de forma explicita (`orderBy`) para estabilidade.
- Em endpoints paginados, retorne dados e metadados (`page`, `limit`, `total`).

## Exemplo De API Route

```ts
import { NextResponse } from "next/server";

import { getSession } from "@kwak-finance/backend/lib/auth";
import { criarConta } from "@kwak-finance/backend/services/contas";

export const POST = async (request: Request) => {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const result = await criarConta({
    userId: session.user.id,
    payload: await request.json(),
  });

  if (!result.ok) {
    return NextResponse.json(result.body, { status: result.status });
  }

  return NextResponse.json(result.body, { status: 201 });
};
```

No exemplo acima, validacao Zod, ownership e acesso Prisma ficam em `@kwak-finance/backend/services/contas`. O route handler apenas adapta HTTP para a funcao de dominio.
