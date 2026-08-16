import { z } from "zod";

import {
  cnpjSchema,
  dateInputSchema,
  idSchema,
  moneySchema,
  optionalDateInputSchema,
  optionalTextSchema,
  paginationSchema,
  perfilContaSchema,
  positiveMoneySchema,
  tipoAporteSchema,
  tipoContaSchema,
  tipoEmpresaSchema,
  tipoInvestimentoSchema,
  tipoTransacaoSchema,
} from "./common";

export const contaCreateSchema = z.object({
  nome: z.string().trim().min(2),
  tipo: tipoContaSchema,
  perfil: perfilContaSchema,
  instituicao: z.string().trim().min(2),
  saldo: moneySchema.default(0),
  cor: z.string().trim().min(3).default("#38BDF8"),
  ativo: z.boolean().default(true),
  empresaId: idSchema.optional(),
});

export const contaUpdateSchema = contaCreateSchema.partial();

export const transacaoFiltersSchema = paginationSchema
  .extend({
    startDate: optionalDateInputSchema,
    endDate: optionalDateInputSchema,
    tipo: tipoTransacaoSchema.optional(),
    categoria: optionalTextSchema,
    contaId: idSchema.optional(),
    perfil: perfilContaSchema.optional(),
    search: optionalTextSchema,
  })
  .refine(
    (value) =>
      !value.startDate || !value.endDate || value.startDate <= value.endDate,
    {
      message: "Data inicial deve ser menor ou igual a data final.",
      path: ["startDate"],
    },
  );

export const transacaoCreateSchema = z.object({
  descricao: z.string().trim().min(2),
  valor: moneySchema,
  tipo: tipoTransacaoSchema,
  categoria: z.string().trim().min(1),
  subcategoria: optionalTextSchema,
  data: dateInputSchema,
  competencia: dateInputSchema.optional(),
  contaId: idSchema,
  perfil: perfilContaSchema,
  empresaId: idSchema.optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
  observacao: optionalTextSchema,
  recorrente: z.boolean().default(false),
});

export const transacaoUpdateSchema = transacaoCreateSchema.partial();

export const transacaoBrutaSchema = z.object({
  descricao: z.string().trim().min(1),
  valor: moneySchema,
  data: dateInputSchema,
  categoria: z.string().trim().min(1).optional(),
  conta: z.string().trim().min(1).optional(),
});

export const importCsvSchema = z.object({
  transacoes: z.array(transacaoBrutaSchema).min(1),
  contaId: idSchema,
  perfil: perfilContaSchema.default("PF"),
});

export const categorizarIaSchema = z.object({
  ids: z.array(idSchema).min(1).max(100),
  confirmar: z.boolean().default(false),
});

export const investimentoCreateSchema = z.object({
  nome: z.string().trim().min(2),
  tipo: tipoInvestimentoSchema,
  corretora: z.string().trim().min(2),
  quantidade: z.number().finite().min(0),
  precoMedio: z.number().finite().min(0),
  precoAtual: z.number().finite().min(0),
  valorInvestido: z.number().finite().min(0),
  valorAtual: z.number().finite().min(0),
  rentabilidade: z.number().finite().default(0),
  dataAporte: dateInputSchema,
  vencimento: dateInputSchema.optional(),
  indexador: optionalTextSchema,
  percentualIndice: z.number().finite().optional(),
  dividendos: z.number().finite().min(0).default(0),
});

export const investimentoUpdateSchema = investimentoCreateSchema.partial();

export const aporteCreateSchema = z.object({
  valor: positiveMoneySchema,
  quantidade: z.number().finite().positive().optional(),
  preco: z.number().finite().min(0),
  data: dateInputSchema,
  tipo: tipoAporteSchema,
});

export const metaCreateSchema = z.object({
  titulo: z.string().trim().min(2),
  descricao: optionalTextSchema,
  valorAlvo: positiveMoneySchema,
  valorAtual: z.number().finite().min(0).default(0),
  prazo: dateInputSchema,
  categoria: z.string().trim().min(1),
  cor: z.string().trim().min(3).default("#38BDF8"),
  concluida: z.boolean().optional(),
});

export const metaUpdateSchema = metaCreateSchema.partial();

export const empresaCreateSchema = z.object({
  nome: z.string().trim().min(2),
  cnpj: cnpjSchema,
  tipo: tipoEmpresaSchema,
  ativa: z.boolean().default(true),
});

export const empresaUpdateSchema = empresaCreateSchema.partial();

export const configuracaoUpdateSchema = z.object({
  moeda: z.literal("BRL").optional(),
  perfilPadrao: perfilContaSchema.optional(),
  notificacoes: z.boolean().optional(),
  nome: z.string().trim().min(2).optional(),
});

export const categoriaCreateSchema = z.object({
  nome: z.string().trim().min(2),
  subcategoria: optionalTextSchema,
  cor: z.string().trim().min(3).default("#38BDF8"),
  ordem: z.number().int().min(0).default(0),
  ativa: z.boolean().default(true),
});

export const categoriaUpdateSchema = categoriaCreateSchema.partial();

export const periodoSchema = z
  .object({
    startDate: optionalDateInputSchema,
    endDate: optionalDateInputSchema,
  })
  .refine(
    (value) =>
      !value.startDate || !value.endDate || value.startDate <= value.endDate,
    {
      message: "Data inicial deve ser menor ou igual a data final.",
      path: ["startDate"],
    },
  );

export type ContaCreateInput = z.infer<typeof contaCreateSchema>;
export type TransacaoCreateInput = z.infer<typeof transacaoCreateSchema>;
export type InvestimentoCreateInput = z.infer<typeof investimentoCreateSchema>;
export type AporteCreateInput = z.infer<typeof aporteCreateSchema>;
export type MetaCreateInput = z.infer<typeof metaCreateSchema>;
export type EmpresaCreateInput = z.infer<typeof empresaCreateSchema>;
