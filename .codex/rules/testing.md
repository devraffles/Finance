# Regras de Testes - Kwak Finance

## Principios gerais

- Todo codigo novo deve ter testes. Sem excecao.
- Testes devem ser legiveis como documentacao: quem le o teste deve entender o comportamento esperado sem ver a implementacao.
- Prefira muitos testes pequenos e focados a poucos testes grandes e genericos.
- Nunca use o banco de dados real em testes unitarios.
- O comando `pnpm test` deve sempre passar na branch `main`.

## Nomenclatura

- Arquivos de teste: `nome-do-arquivo.test.ts` ou `nome-do-arquivo.spec.ts`.
- Localizacao: dentro de `__tests__/` na mesma camada do codigo testado.
- Descreva o comportamento, nao a implementacao.
- Exemplo correto: `it("deve retornar erro quando o email ja esta cadastrado")`.
- Exemplo incorreto: `it("testa o metodo createUser")`.

## Testes Unitarios (Vitest)

Use para funcoes puras, schemas Zod, utilitarios, `lib/auth` e transformacoes de dados.

```ts
import { describe, expect, it } from "vitest";

import { signUpSchema } from "@kwak-finance/backend/schemas/auth";

describe("signUpSchema", () => {
  it("deve aceitar dados validos", () => {
    const resultado = signUpSchema.safeParse({
      email: "user@example.com",
      password: "Senha@123",
      name: "Joao Silva",
    });

    expect(resultado.success).toBe(true);
  });
});
```

## Testes de Integracao com Prisma mockado

Use Vitest com `vitest-mock-extended` para services, repositorios e logica que depende do banco de dados.

Nunca conecte ao banco real nos testes unitarios ou de integracao.

```ts
import { PrismaClient } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

const prismaMock = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
});

describe("servico financeiro", () => {
  it("deve usar Prisma mockado", () => {
    expect(prismaMock).toBeDefined();
  });
});
```

## Testes de Componente

Use Vitest, Testing Library e `@testing-library/user-event` para componentes React, formularios e interacoes do usuario.

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("deve renderizar o texto acessivel", () => {
    render(<Button>Entrar</Button>);

    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });
});
```

## Testes E2E (Playwright)

Use para fluxos completos do usuario, como login, criacao de transacao, importacao CSV e navegacao entre modulos.

```ts
import { expect, test } from "@playwright/test";

test("deve abrir a tela de login", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("button", { name: /entrar/i })).toBeVisible();
});
```

## O que nao fazer

- Nao conectar ao banco real em testes unitarios.
- Nao usar `any` nos mocks.
- Nao testar detalhes internos de implementacao.
- Nao agrupar cenarios sem relacao no mesmo `describe`.
- Nao ignorar falhas com `.skip` sem justificativa.
- Nao rodar E2E contra producao.

## Cobertura minima esperada

| Camada | Minimo |
| --- | --- |
| Schemas e validacoes | 100% |
| Services e logica de negocio | 80% |
| Componentes com formulario ou interacao | 70% |
| E2E por fluxo principal da feature | 1 teste por feature |
