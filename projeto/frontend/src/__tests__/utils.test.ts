import { describe, expect, it } from "vitest";

import {
  calcularVariacao,
  formatCurrency,
  formatDate,
  formatPercent,
  gerarCorAleatoria,
  slugify,
} from "@/lib/utils";

describe("utils de apresentacao", () => {
  it("formata moeda em reais", () => {
    expect(formatCurrency(1234.5)).toContain("R$");
    expect(formatCurrency(1234.5)).toContain("1.234,50");
  });

  it("formata data em dd/MM/yyyy", () => {
    expect(formatDate(new Date(2026, 4, 26))).toBe("26/05/2026");
  });

  it("formata percentual em pt-BR", () => {
    expect(formatPercent(12.345, 2)).toBe("12,35%");
  });

  it("calcula variacao percentual", () => {
    expect(calcularVariacao(150, 100)).toBe(50);
    expect(calcularVariacao(0, 0)).toBe(0);
  });

  it("gera cores deterministicas por seed", () => {
    expect(gerarCorAleatoria("conta")).toBe(gerarCorAleatoria("conta"));
  });

  it("cria slugs estaveis", () => {
    expect(slugify("Cartao de Credito PF")).toBe("cartao-de-credito-pf");
  });
});
