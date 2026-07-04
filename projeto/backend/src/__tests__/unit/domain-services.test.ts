import { TipoAporte, TipoInvest } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  investimento: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  aporte: {
    create: vi.fn(),
  },
  $transaction: vi.fn(),
}));

vi.mock("../../lib/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("../../lib/gemini", () => ({
  categorizarTransacoes: vi.fn(),
  gerarInsights: vi.fn(),
  GEMINI_API_KEY_ERROR: "GOOGLE_GENERATIVE_AI_API_KEY nao esta configurada.",
}));

import { criarAporte } from "../../services/domain";

describe("servicos de dominio", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna conflito quando venda deixaria investimento negativo", async () => {
    prismaMock.investimento.findFirst.mockResolvedValue({
      id: "investimento_1",
      nome: "MXRF11",
      tipo: TipoInvest.FII,
      corretora: "Rico",
      quantidade: 10,
      precoMedio: 10,
      precoAtual: 11,
      valorInvestido: 100,
      valorAtual: 110,
      rentabilidade: 10,
      dataAporte: new Date("2026-01-01T12:00:00.000Z"),
      vencimento: null,
      indexador: null,
      percentualIndice: null,
      dividendos: 0,
      userId: "user_1",
      createdAt: new Date("2026-01-01T12:00:00.000Z"),
      updatedAt: new Date("2026-01-01T12:00:00.000Z"),
    });

    const result = await criarAporte({
      userId: "user_1",
      id: "investimento_1",
      body: {
        valor: 200,
        quantidade: 20,
        preco: 10,
        data: "2026-02-01",
        tipo: TipoAporte.VENDA,
      },
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe(409);
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });
});
