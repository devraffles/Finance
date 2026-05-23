---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Regras TypeScript

## Principios

- Sempre use TypeScript.
- Nunca use `any`.
- Evite `as` para forcar tipo; prefira validar, estreitar ou tipar corretamente.
- Prefira `interface` para objetos de dominio e contratos.
- Use `type` para unions, mapped types e aliases simples.
- Prefira named exports.
- Use `async/await` em fluxos assincronos.
- Prefira early returns.
- Ao receber mais de dois parametros, receba um objeto nomeado.

## Nomenclatura

- Arquivos: kebab-case (`fluxo-caixa-chart.tsx`, `format-currency.ts`).
- Componentes React: PascalCase.
- Variaveis e funcoes: camelCase.
- Enums Prisma: UPPER_CASE quando definidos no schema.
- Tipos de dominio: PascalCase (`DashboardResumo`, `TransacaoComConta`).

## React

- Componentes devem ter props tipadas.
- Componentes de UI reutilizaveis devem aceitar `className` quando fizer sentido.
- Evite componentes grandes demais; extraia subcomponentes quando houver blocos repetidos ou estados independentes.
- Use `useMemo` apenas quando houver custo real ou estabilidade necessaria.
- Nao transforme tudo em Client Component; use `"use client"` somente quando necessario.

## Exemplo De Componente

```tsx
import { ArrowUpRight } from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: number;
  variation?: number;
  className?: string;
}

export const KpiCard = ({ title, value, variation, className }: KpiCardProps) => {
  const isPositive = typeof variation === "number" && variation >= 0;

  return (
    <section className={cn("rounded-lg border bg-card p-4", className)}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <strong className="mt-2 block text-2xl">{formatCurrency(value)}</strong>
      {typeof variation === "number" ? (
        <span className={cn("mt-3 inline-flex items-center gap-1 text-sm", isPositive ? "text-emerald-500" : "text-red-500")}>
          <ArrowUpRight className="h-4 w-4" />
          {variation.toFixed(1)}%
        </span>
      ) : null}
    </section>
  );
};
```

