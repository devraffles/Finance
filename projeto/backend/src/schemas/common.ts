import { cnpj } from "cpf-cnpj-validator";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  PerfilConta,
  TipoAporte,
  TipoConta,
  TipoEmpresa,
  TipoInvest,
  TipoTransacao,
} from "@prisma/client";
import { z } from "zod";

dayjs.extend(customParseFormat);

const parseDate = (value: string) => {
  const parsed = dayjs(
    value,
    ["YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ss.SSS[Z]", "YYYY-MM-DDTHH:mm:ss[Z]"],
    true,
  );

  if (!parsed.isValid()) {
    return null;
  }

  return parsed.hour(12).minute(0).second(0).millisecond(0).toDate();
};

export const idSchema = z.string().min(1, "Identificador obrigatorio.");

export const dateInputSchema = z
  .string()
  .min(1, "Data obrigatoria.")
  .transform((value, context) => {
    const parsed = parseDate(value);

    if (!parsed) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data invalida.",
      });
      return z.NEVER;
    }

    return parsed;
  });

export const optionalDateInputSchema = z
  .string()
  .optional()
  .transform((value, context) => {
    if (!value) {
      return undefined;
    }

    const parsed = parseDate(value);

    if (!parsed) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data invalida.",
      });
      return z.NEVER;
    }

    return parsed;
  });

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const cnpjSchema = z
  .string()
  .min(1, "CNPJ obrigatorio.")
  .transform((value) => cnpj.strip(value))
  .refine((value) => cnpj.isValid(value), "CNPJ invalido.");

export const tipoContaSchema = z.nativeEnum(TipoConta);
export const perfilContaSchema = z.nativeEnum(PerfilConta);
export const tipoTransacaoSchema = z.nativeEnum(TipoTransacao);
export const tipoInvestimentoSchema = z.nativeEnum(TipoInvest);
export const tipoAporteSchema = z.nativeEnum(TipoAporte);
export const tipoEmpresaSchema = z.nativeEnum(TipoEmpresa);

export const optionalTextSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

export const moneySchema = z.number().finite();

export const positiveMoneySchema = z.number().finite().positive();
