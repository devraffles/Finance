import { describe, expect, it } from "vitest";

import { empresaCreateSchema, transacaoFiltersSchema } from "../../schemas/api";

describe("schemas de API", () => {
  it("rejeita datas invalidas em filtros de transacoes", () => {
    const result = transacaoFiltersSchema.safeParse({
      startDate: "2026-99-99",
      page: "1",
      limit: "20",
    });

    expect(result.success).toBe(false);
  });

  it("normaliza CNPJ valido e rejeita CNPJ invalido", () => {
    const valid = empresaCreateSchema.safeParse({
      nome: "Kwak Tecnologia",
      cnpj: "11.222.333/0001-81",
      tipo: "MEI",
    });
    const invalid = empresaCreateSchema.safeParse({
      nome: "Kwak Tecnologia",
      cnpj: "00.000.000/0000-00",
      tipo: "MEI",
    });

    expect(valid.success).toBe(true);
    expect(valid.success ? valid.data.cnpj : "").toBe("11222333000181");
    expect(invalid.success).toBe(false);
  });
});
