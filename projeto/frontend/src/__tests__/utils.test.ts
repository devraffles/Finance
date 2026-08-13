import { describe, expect, it } from "vitest";

import {
  calcularVariacao,
  formatCurrency,
  formatDate,
  formatPercent,
  gerarCorAleatoria,
  parseCSVNubank,
  slugify,
} from "@/lib/utils";

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

  it("converte CSV Nubank com valores brasileiros", () => {
    const transactions = parseCSVNubank(
      "Data;Categoria;Titulo;Valor\n01/05/2026;Alimentacao;Mercado;-123,45\n02/05/2026;Receita;Freelance;1.250,00",
    );

    expect(transactions).toEqual([
      {
        data: "2026-05-01",
        descricao: "Mercado",
        valor: -123.45,
        categoria: "Alimentacao",
      },
      {
        data: "2026-05-02",
        descricao: "Freelance",
        valor: 1250,
        categoria: "Receita",
      },
    ]);
  });

  it("preserva separadores dentro de campos entre aspas", () => {
    const transactions = parseCSVNubank(
      'Data;Categoria;Titulo;Valor\n03/05/2026;Casa;"Aluguel, maio";-1.500,00',
    );

    expect(transactions).toEqual([
      {
        data: "2026-05-03",
        descricao: "Aluguel, maio",
        valor: -1500,
        categoria: "Casa",
      },
    ]);
  });

  it("ignora linhas invalidas e formatos sem colunas obrigatorias", () => {
    expect(
      parseCSVNubank("Data;Titulo;Valor\n31/02/2026;Invalida;10,00"),
    ).toEqual([]);
    expect(parseCSVNubank("Campo;Outro\nvalor;valor")).toEqual([]);
  });
});
