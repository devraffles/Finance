import { describe, expect, it } from "vitest";

import { formatCurrency, formatDate, formatPercent } from "@/lib/utils";

describe("utils de apresentacao", () => {
  it("formata moeda em reais", () => {
    expect(formatCurrency(1234.5)).toContain("R$");
    expect(formatCurrency(1234.5)).toContain("1.234,50");
  });

  it("formata data em dd/MM/yyyy", () => {
    expect(formatDate(new Date(2026, 4, 26))).toBe("26/05/2026");
    expect(formatDate("data-invalida")).toBe("Data invalida");
  });

  it("formata percentual em pt-BR", () => {
    expect(formatPercent(12.345, 2)).toBe("12,35%");
  });
});
