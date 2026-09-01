import { describe, expect, it } from "vitest";

import { parseCsvNubank } from "../../services/nubank-csv";

describe("parseCsvNubank", () => {
  it("normaliza linhas validas com valores brasileiros", () => {
    const transacoes = parseCsvNubank(
      "\uFEFFData;Categoria;Titulo;Valor\n01/05/2026;Alimentacao;Mercado;-123,45\n02/05/2026;Receita;Freelance;1.250,00",
    );

    expect(transacoes).toEqual([
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

  it("preserva delimitadores em campos entre aspas", () => {
    const transacoes = parseCsvNubank(
      'Data;Categoria;Titulo;Valor\n03/05/2026;Casa;"Aluguel, maio";-1.500,00',
    );

    expect(transacoes).toEqual([
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
      parseCsvNubank("Data;Titulo;Valor\n31/02/2026;Invalida;10,00"),
    ).toEqual([]);
    expect(parseCsvNubank("Campo;Outro\nvalor;valor")).toEqual([]);
  });
});
