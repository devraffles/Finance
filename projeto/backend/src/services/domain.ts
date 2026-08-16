import { Prisma, TipoAporte, TipoTransacao } from "@prisma/client";
import dayjs from "dayjs";
import { z } from "zod";

import {
  categorizarTransacoes,
  gerarInsights,
  GEMINI_API_KEY_ERROR,
} from "../lib/gemini";
import { prisma } from "../lib/prisma";
import type { ApiResult } from "./api-result";
import { failure, success } from "./api-result";
import {
  aporteCreateSchema,
  categorizarIaSchema,
  categoriaCreateSchema,
  categoriaUpdateSchema,
  contaCreateSchema,
  configuracaoUpdateSchema,
  contaUpdateSchema,
  empresaCreateSchema,
  empresaUpdateSchema,
  importCsvSchema,
  investimentoCreateSchema,
  investimentoUpdateSchema,
  metaCreateSchema,
  metaUpdateSchema,
  periodoSchema,
  transacaoCreateSchema,
  transacaoFiltersSchema,
  transacaoUpdateSchema,
} from "../schemas/api";

interface UserParams {
  userId: string;
}

interface IdParams extends UserParams {
  id: string;
}

interface BodyParams extends UserParams {
  body: unknown;
}

interface BodyIdParams extends IdParams {
  body: unknown;
}

interface QueryParams extends UserParams {
  query: Record<string, string | undefined>;
}

const validationFailure = (error: z.ZodError): ReturnType<typeof failure> => {
  return failure({
    code: "VALIDATION_ERROR",
    message: "Payload invalido.",
    status: 400,
    issues: error.flatten(),
  });
};

const notFound = <T>(message = "Recurso nao encontrado."): ApiResult<T> => {
  return failure({ code: "NOT_FOUND", message, status: 404 });
};

const conflict = <T>(message: string): ApiResult<T> => {
  return failure({ code: "CONFLICT", message, status: 409 });
};

const unexpected = <T>(error: unknown): ApiResult<T> => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return conflict("Registro duplicado para este usuario.");
    }

    if (error.code === "P2025") {
      return notFound();
    }
  }

  return failure({
    code: "INTERNAL_ERROR",
    message: "Falha inesperada ao processar a requisicao.",
    status: 500,
  });
};

const parse = <Schema extends z.ZodTypeAny>(
  schema: Schema,
  input: unknown,
): ReturnType<typeof failure> | z.output<Schema> => {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  return parsed.data;
};

const isApiResult = <T>(
  value: ReturnType<typeof failure> | T,
): value is ReturnType<typeof failure> => {
  return (
    typeof value === "object" &&
    value !== null &&
    "ok" in value &&
    "status" in value
  );
};

const competenciaFromDate = (date: Date) => {
  return dayjs(date)
    .date(1)
    .hour(12)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toDate();
};

const serializeTags = (tags?: string[]) => JSON.stringify(tags ?? []);

const parseTags = (tags: string) => {
  const parsed: unknown = JSON.parse(tags);
  return Array.isArray(parsed)
    ? parsed.filter((tag): tag is string => typeof tag === "string")
    : [];
};

const ensureConta = async ({
  userId,
  contaId,
}: {
  userId: string;
  contaId: string;
}) => {
  return prisma.conta.findFirst({
    where: { id: contaId, userId },
  });
};

const ensureEmpresa = async ({
  userId,
  empresaId,
}: {
  userId: string;
  empresaId?: string;
}) => {
  if (!empresaId) {
    return null;
  }

  return prisma.empresa.findFirst({
    where: { id: empresaId, userId },
  });
};

const serializeTransacao = (
  transacao: Prisma.TransacaoGetPayload<{
    include: { conta: true; empresa: true };
  }>,
) => ({
  id: transacao.id,
  descricao: transacao.descricao,
  valor: transacao.valor,
  tipo: transacao.tipo,
  categoria: transacao.categoria,
  subcategoria: transacao.subcategoria,
  data: transacao.data.toISOString(),
  competencia: transacao.competencia.toISOString(),
  contaId: transacao.contaId,
  contaNome: transacao.conta.nome,
  perfil: transacao.perfil,
  empresaId: transacao.empresaId,
  empresaNome: transacao.empresa?.nome,
  tags: parseTags(transacao.tags),
  observacao: transacao.observacao,
  recorrente: transacao.recorrente,
  categorizadoPorIA: transacao.categorizadoPorIA,
});

export const listarContas = async ({ userId }: UserParams) => {
  const contas = await prisma.conta.findMany({
    where: { userId },
    orderBy: [{ ativo: "desc" }, { nome: "asc" }],
    include: {
      empresa: true,
      transacoes: {
        select: { valor: true },
      },
    },
  });

  return success(
    contas.map((conta) => ({
      id: conta.id,
      nome: conta.nome,
      tipo: conta.tipo,
      perfil: conta.perfil,
      instituicao: conta.instituicao,
      saldo:
        conta.saldo +
        conta.transacoes.reduce(
          (total, transacao) => total + transacao.valor,
          0,
        ),
      cor: conta.cor,
      ativo: conta.ativo,
      empresaId: conta.empresaId,
      empresaNome: conta.empresa?.nome,
    })),
  );
};

export const criarConta = async ({ userId, body }: BodyParams) => {
  const input = parse(contaCreateSchema, body);
  if (isApiResult(input)) return input;

  const empresa = await ensureEmpresa({ userId, empresaId: input.empresaId });
  if (input.empresaId && !empresa) return notFound("Empresa nao encontrada.");

  const conta = await prisma.conta.create({
    data: {
      ...input,
      userId,
    },
  });

  return success(conta, 201);
};

export const obterConta = async ({ userId, id }: IdParams) => {
  const conta = await prisma.conta.findFirst({
    where: { id, userId },
    include: { empresa: true },
  });

  if (!conta) return notFound();

  return success(conta);
};

export const atualizarConta = async ({ userId, id, body }: BodyIdParams) => {
  const input = parse(contaUpdateSchema, body);
  if (isApiResult(input)) return input;

  const current = await ensureConta({ userId, contaId: id });
  if (!current) return notFound();

  const empresa = await ensureEmpresa({ userId, empresaId: input.empresaId });
  if (input.empresaId && !empresa) return notFound("Empresa nao encontrada.");

  const conta = await prisma.conta.update({
    where: { id },
    data: input,
  });

  return success(conta);
};

export const removerConta = async ({ userId, id }: IdParams) => {
  const conta = await ensureConta({ userId, contaId: id });
  if (!conta) return notFound();

  const transacoes = await prisma.transacao.count({
    where: { userId, contaId: id },
  });

  if (transacoes > 0) {
    return conflict("Nao e possivel excluir conta com transacoes vinculadas.");
  }

  await prisma.conta.delete({ where: { id } });
  return success({ id });
};

export const listarTransacoes = async ({ userId, query }: QueryParams) => {
  const filters = parse(transacaoFiltersSchema, query);
  if (isApiResult(filters)) return filters;

  const where: Prisma.TransacaoWhereInput = {
    userId,
    ...(filters.tipo ? { tipo: filters.tipo } : {}),
    ...(filters.categoria ? { categoria: filters.categoria } : {}),
    ...(filters.contaId ? { contaId: filters.contaId } : {}),
    ...(filters.perfil ? { perfil: filters.perfil } : {}),
    ...(filters.search
      ? {
          descricao: {
            contains: filters.search,
            mode: "insensitive",
          },
        }
      : {}),
    ...((filters.startDate || filters.endDate) && {
      data: {
        ...(filters.startDate ? { gte: filters.startDate } : {}),
        ...(filters.endDate ? { lte: filters.endDate } : {}),
      },
    }),
  };

  const [total, transacoes] = await prisma.$transaction([
    prisma.transacao.count({ where }),
    prisma.transacao.findMany({
      where,
      orderBy: [{ data: "desc" }, { createdAt: "desc" }],
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
      include: { conta: true, empresa: true },
    }),
  ]);

  return success(transacoes.map(serializeTransacao), 200, {
    page: filters.page,
    limit: filters.limit,
    total,
  });
};

export const criarTransacao = async ({ userId, body }: BodyParams) => {
  const input = parse(transacaoCreateSchema, body);
  if (isApiResult(input)) return input;

  const conta = await ensureConta({ userId, contaId: input.contaId });
  if (!conta) return notFound("Conta nao encontrada.");

  const empresa = await ensureEmpresa({ userId, empresaId: input.empresaId });
  if (input.empresaId && !empresa) return notFound("Empresa nao encontrada.");

  const transacao = await prisma.transacao.create({
    data: {
      descricao: input.descricao,
      valor: input.valor,
      tipo: input.tipo,
      categoria: input.categoria,
      subcategoria: input.subcategoria,
      data: input.data,
      competencia: input.competencia ?? competenciaFromDate(input.data),
      contaId: input.contaId,
      perfil: input.perfil,
      empresaId: input.empresaId,
      tags: serializeTags(input.tags),
      observacao: input.observacao,
      recorrente: input.recorrente,
      userId,
    },
    include: { conta: true, empresa: true },
  });

  return success(serializeTransacao(transacao), 201);
};

export const obterTransacao = async ({ userId, id }: IdParams) => {
  const transacao = await prisma.transacao.findFirst({
    where: { id, userId },
    include: { conta: true, empresa: true },
  });

  if (!transacao) return notFound();

  return success(serializeTransacao(transacao));
};

export const atualizarTransacao = async ({
  userId,
  id,
  body,
}: BodyIdParams) => {
  const input = parse(transacaoUpdateSchema, body);
  if (isApiResult(input)) return input;

  const current = await prisma.transacao.findFirst({ where: { id, userId } });
  if (!current) return notFound();

  if (input.contaId) {
    const conta = await ensureConta({ userId, contaId: input.contaId });
    if (!conta) return notFound("Conta nao encontrada.");
  }

  const empresa = await ensureEmpresa({ userId, empresaId: input.empresaId });
  if (input.empresaId && !empresa) return notFound("Empresa nao encontrada.");

  const { tags, ...inputWithoutTags } = input;
  const data: Prisma.TransacaoUncheckedUpdateInput = {
    ...inputWithoutTags,
    ...(tags ? { tags: serializeTags(tags) } : {}),
    ...(input.data && !input.competencia
      ? { competencia: competenciaFromDate(input.data) }
      : {}),
  };
  const transacao = await prisma.transacao.update({
    where: { id },
    data,
    include: { conta: true, empresa: true },
  });

  return success(serializeTransacao(transacao));
};

export const removerTransacao = async ({ userId, id }: IdParams) => {
  const current = await prisma.transacao.findFirst({ where: { id, userId } });
  if (!current) return notFound();

  await prisma.transacao.delete({ where: { id } });
  return success({ id });
};

export const importarCsvTransacoes = async ({ userId, body }: BodyParams) => {
  const input = parse(importCsvSchema, body);
  if (isApiResult(input)) return input;

  const conta = await ensureConta({ userId, contaId: input.contaId });
  if (!conta) return notFound("Conta nao encontrada.");

  let importadas = 0;
  let duplicadas = 0;

  for (const transacao of input.transacoes) {
    const duplicate = await prisma.transacao.findFirst({
      where: {
        userId,
        descricao: transacao.descricao,
        valor: transacao.valor,
        data: transacao.data,
      },
      select: { id: true },
    });

    if (duplicate) {
      duplicadas += 1;
      continue;
    }

    await prisma.transacao.create({
      data: {
        descricao: transacao.descricao,
        valor: transacao.valor,
        tipo:
          transacao.valor >= 0 ? TipoTransacao.RECEITA : TipoTransacao.DESPESA,
        categoria: transacao.categoria ?? "Importado",
        data: transacao.data,
        competencia: competenciaFromDate(transacao.data),
        contaId: input.contaId,
        perfil: input.perfil,
        tags: serializeTags(["csv", "nubank"]),
        recorrente: false,
        userId,
      },
    });
    importadas += 1;
  }

  return success({ importadas, duplicadas }, 201);
};

export const categorizarTransacoesIa = async ({ userId, body }: BodyParams) => {
  const input = parse(categorizarIaSchema, body);
  if (isApiResult(input)) return input;

  const transacoes = await prisma.transacao.findMany({
    where: { userId, id: { in: input.ids } },
    orderBy: { data: "desc" },
  });

  if (transacoes.length !== input.ids.length) {
    return notFound("Uma ou mais transacoes nao foram encontradas.");
  }

  try {
    const resultado = await categorizarTransacoes(
      transacoes.map((transacao) => ({
        transacaoId: transacao.id,
        descricao: transacao.descricao,
        valor: transacao.valor,
        data: transacao.data.toISOString(),
        categoria: transacao.categoria,
      })),
    );

    if (!input.confirmar) {
      return success(resultado, 200, { confirmado: false });
    }

    for (const item of resultado) {
      const transacaoId =
        item.transacaoId ??
        transacoes.find((transacao) => transacao.descricao === item.descricao)
          ?.id;

      if (!transacaoId) {
        continue;
      }

      await prisma.transacao.updateMany({
        where: { id: transacaoId, userId },
        data: {
          categoria: item.categoria,
          subcategoria: item.subcategoria,
          categorizadoPorIA: true,
        },
      });
    }

    return success(resultado, 200, { confirmado: true });
  } catch (error) {
    if (error instanceof Error && error.message === GEMINI_API_KEY_ERROR) {
      return failure({
        code: "AI_NOT_CONFIGURED",
        message: GEMINI_API_KEY_ERROR,
        status: 409,
      });
    }

    return unexpected(error);
  }
};

export const listarInvestimentos = async ({ userId }: UserParams) => {
  const investimentos = await prisma.investimento.findMany({
    where: { userId },
    orderBy: { nome: "asc" },
    include: { aportes: { orderBy: { data: "desc" } } },
  });

  return success(investimentos);
};

export const criarInvestimento = async ({ userId, body }: BodyParams) => {
  const input = parse(investimentoCreateSchema, body);
  if (isApiResult(input)) return input;

  const investimento = await prisma.investimento.create({
    data: { ...input, userId },
  });

  return success(investimento, 201);
};

export const obterInvestimento = async ({ userId, id }: IdParams) => {
  const investimento = await prisma.investimento.findFirst({
    where: { id, userId },
    include: { aportes: { orderBy: { data: "desc" } } },
  });

  if (!investimento) return notFound();

  return success(investimento);
};

export const atualizarInvestimento = async ({
  userId,
  id,
  body,
}: BodyIdParams) => {
  const input = parse(investimentoUpdateSchema, body);
  if (isApiResult(input)) return input;

  const current = await prisma.investimento.findFirst({
    where: { id, userId },
  });
  if (!current) return notFound();

  const investimento = await prisma.investimento.update({
    where: { id },
    data: input,
  });

  return success(investimento);
};

export const removerInvestimento = async ({ userId, id }: IdParams) => {
  const current = await prisma.investimento.findFirst({
    where: { id, userId },
  });
  if (!current) return notFound();

  await prisma.investimento.delete({ where: { id } });
  return success({ id });
};

export const listarAportes = async ({ userId, id }: IdParams) => {
  const investimento = await prisma.investimento.findFirst({
    where: { id, userId },
  });
  if (!investimento) return notFound("Investimento nao encontrado.");

  const aportes = await prisma.aporte.findMany({
    where: { investimentoId: id, userId },
    orderBy: { data: "desc" },
  });

  return success(aportes);
};

export const criarAporte = async ({ userId, id, body }: BodyIdParams) => {
  const input = parse(aporteCreateSchema, body);
  if (isApiResult(input)) return input;

  const investimento = await prisma.investimento.findFirst({
    where: { id, userId },
  });
  if (!investimento) return notFound("Investimento nao encontrado.");

  const quantidade =
    input.quantidade ??
    (input.preco > 0 ? input.valor / input.preco : undefined);
  if (
    !quantidade &&
    input.tipo !== TipoAporte.DIVIDENDO &&
    input.tipo !== TipoAporte.JUROS
  ) {
    return failure({
      code: "VALIDATION_ERROR",
      message: "Quantidade obrigatoria para este tipo de aporte.",
      status: 400,
    });
  }

  const deltaQuantidade =
    input.tipo === TipoAporte.COMPRA
      ? (quantidade ?? 0)
      : input.tipo === TipoAporte.VENDA || input.tipo === TipoAporte.RESGATE
        ? -(quantidade ?? 0)
        : 0;
  const novaQuantidade = investimento.quantidade + deltaQuantidade;

  if (novaQuantidade < 0) {
    return conflict(
      "A operacao deixaria a quantidade do investimento negativa.",
    );
  }

  const novoValorInvestido =
    input.tipo === TipoAporte.COMPRA
      ? investimento.valorInvestido + input.valor
      : input.tipo === TipoAporte.VENDA || input.tipo === TipoAporte.RESGATE
        ? Math.max(
            0,
            investimento.valorInvestido -
              investimento.precoMedio * (quantidade ?? 0),
          )
        : investimento.valorInvestido;
  const novoPrecoMedio =
    novaQuantidade > 0 ? novoValorInvestido / novaQuantidade : 0;
  const novoValorAtual = novaQuantidade * investimento.precoAtual;
  const novosDividendos =
    input.tipo === TipoAporte.DIVIDENDO || input.tipo === TipoAporte.JUROS
      ? investimento.dividendos + input.valor
      : investimento.dividendos;
  const novaRentabilidade =
    novoValorInvestido > 0
      ? ((novoValorAtual + novosDividendos - novoValorInvestido) /
          novoValorInvestido) *
        100
      : 0;

  const result = await prisma.$transaction(async (tx) => {
    const aporte = await tx.aporte.create({
      data: {
        investimentoId: id,
        valor: input.valor,
        quantidade,
        preco: input.preco,
        data: input.data,
        tipo: input.tipo,
        userId,
      },
    });
    const atualizado = await tx.investimento.update({
      where: { id },
      data: {
        quantidade: novaQuantidade,
        valorInvestido: novoValorInvestido,
        precoMedio: novoPrecoMedio,
        valorAtual: novoValorAtual,
        rentabilidade: novaRentabilidade,
        dividendos: novosDividendos,
      },
    });

    return { aporte, investimento: atualizado };
  });

  return success(result, 201);
};

export const listarMetas = async ({ userId }: UserParams) => {
  const metas = await prisma.meta.findMany({
    where: { userId },
    orderBy: [{ concluida: "asc" }, { prazo: "asc" }],
  });

  return success(metas);
};

export const criarMeta = async ({ userId, body }: BodyParams) => {
  const input = parse(metaCreateSchema, body);
  if (isApiResult(input)) return input;

  const meta = await prisma.meta.create({
    data: {
      ...input,
      concluida: input.concluida ?? input.valorAtual >= input.valorAlvo,
      userId,
    },
  });

  return success(meta, 201);
};

export const obterMeta = async ({ userId, id }: IdParams) => {
  const meta = await prisma.meta.findFirst({ where: { id, userId } });
  if (!meta) return notFound();

  return success(meta);
};

export const atualizarMeta = async ({ userId, id, body }: BodyIdParams) => {
  const input = parse(metaUpdateSchema, body);
  if (isApiResult(input)) return input;

  const current = await prisma.meta.findFirst({ where: { id, userId } });
  if (!current) return notFound();

  const valorAtual = input.valorAtual ?? current.valorAtual;
  const valorAlvo = input.valorAlvo ?? current.valorAlvo;
  const meta = await prisma.meta.update({
    where: { id },
    data: {
      ...input,
      concluida: input.concluida ?? valorAtual >= valorAlvo,
    },
  });

  return success(meta);
};

export const removerMeta = async ({ userId, id }: IdParams) => {
  const current = await prisma.meta.findFirst({ where: { id, userId } });
  if (!current) return notFound();

  await prisma.meta.delete({ where: { id } });
  return success({ id });
};

export const listarEmpresas = async ({ userId }: UserParams) => {
  const empresas = await prisma.empresa.findMany({
    where: { userId },
    orderBy: [{ ativa: "desc" }, { nome: "asc" }],
  });

  return success(empresas);
};

export const criarEmpresa = async ({ userId, body }: BodyParams) => {
  const input = parse(empresaCreateSchema, body);
  if (isApiResult(input)) return input;

  try {
    const empresa = await prisma.empresa.create({
      data: { ...input, userId },
    });

    return success(empresa, 201);
  } catch (error) {
    return unexpected(error);
  }
};

export const obterEmpresa = async ({ userId, id }: IdParams) => {
  const empresa = await prisma.empresa.findFirst({ where: { id, userId } });
  if (!empresa) return notFound();

  return success(empresa);
};

export const atualizarEmpresa = async ({ userId, id, body }: BodyIdParams) => {
  const input = parse(empresaUpdateSchema, body);
  if (isApiResult(input)) return input;

  const current = await prisma.empresa.findFirst({ where: { id, userId } });
  if (!current) return notFound();

  try {
    const empresa = await prisma.empresa.update({
      where: { id },
      data: input,
    });

    return success(empresa);
  } catch (error) {
    return unexpected(error);
  }
};

export const removerEmpresa = async ({ userId, id }: IdParams) => {
  const current = await prisma.empresa.findFirst({ where: { id, userId } });
  if (!current) return notFound();

  await prisma.empresa.delete({ where: { id } });
  return success({ id });
};

export const obterConfiguracao = async ({ userId }: UserParams) => {
  const [user, configuracao, categorias] = await Promise.all([
    prisma.user.findFirst({
      where: { id: userId },
      select: { name: true, email: true },
    }),
    prisma.configuracaoUsuario.upsert({
      where: { userId },
      create: { userId },
      update: {},
    }),
    prisma.categoria.findMany({
      where: { userId },
      orderBy: [{ ordem: "asc" }, { nome: "asc" }],
    }),
  ]);

  if (!user) return notFound("Usuario nao encontrado.");

  return success({
    perfil: user,
    preferencias: {
      moeda: configuracao.moeda,
      perfilPadrao: configuracao.perfilPadrao,
      notificacoes: configuracao.notificacoes,
    },
    categorias,
    iaConfigurada: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()),
  });
};

export const atualizarConfiguracao = async ({ userId, body }: BodyParams) => {
  const input = parse(configuracaoUpdateSchema, body);
  if (isApiResult(input)) return input;

  const { nome, ...preferencias } = input;
  const [user, configuracao] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: nome ? { name: nome } : {},
      select: { name: true, email: true },
    }),
    prisma.configuracaoUsuario.upsert({
      where: { userId },
      create: { userId, ...preferencias },
      update: preferencias,
    }),
  ]);

  return success({
    perfil: user,
    preferencias: {
      moeda: configuracao.moeda,
      perfilPadrao: configuracao.perfilPadrao,
      notificacoes: configuracao.notificacoes,
    },
  });
};

export const criarCategoria = async ({ userId, body }: BodyParams) => {
  const input = parse(categoriaCreateSchema, body);
  if (isApiResult(input)) return input;

  try {
    return success(
      await prisma.categoria.create({ data: { ...input, userId } }),
      201,
    );
  } catch (error) {
    return unexpected(error);
  }
};

export const atualizarCategoria = async ({
  userId,
  id,
  body,
}: BodyIdParams) => {
  const input = parse(categoriaUpdateSchema, body);
  if (isApiResult(input)) return input;

  const categoria = await prisma.categoria.findFirst({ where: { id, userId } });
  if (!categoria) return notFound();

  try {
    return success(
      await prisma.categoria.update({ where: { id }, data: input }),
    );
  } catch (error) {
    return unexpected(error);
  }
};

export const removerCategoria = async ({ userId, id }: IdParams) => {
  const categoria = await prisma.categoria.findFirst({ where: { id, userId } });
  if (!categoria) return notFound();

  await prisma.categoria.delete({ where: { id } });
  return success({ id });
};

export const obterDashboardResumo = async ({ userId, query }: QueryParams) => {
  const input = parse(periodoSchema, query);
  if (isApiResult(input)) return input;

  const now = dayjs();
  const startDate = input.startDate ?? now.startOf("month").hour(12).toDate();
  const endDate = input.endDate ?? now.endOf("month").hour(12).toDate();
  const transacoes = await prisma.transacao.findMany({
    where: {
      userId,
      data: { gte: startDate, lte: endDate },
    },
    orderBy: { data: "asc" },
  });
  const contas = await prisma.conta.findMany({
    where: { userId },
    include: { transacoes: { select: { valor: true } } },
    orderBy: { nome: "asc" },
  });
  const investimentos = await prisma.investimento.findMany({
    where: { userId },
    orderBy: { nome: "asc" },
  });
  const receitasMes = transacoes
    .filter((transacao) => transacao.valor > 0)
    .reduce((total, transacao) => total + transacao.valor, 0);
  const despesasMes = transacoes
    .filter((transacao) => transacao.valor < 0)
    .reduce((total, transacao) => total + Math.abs(transacao.valor), 0);
  const saldoTotal = contas.reduce(
    (total, conta) =>
      total +
      conta.saldo +
      conta.transacoes.reduce((sum, transacao) => sum + transacao.valor, 0),
    0,
  );
  const valorInvestimentos = investimentos.reduce(
    (total, investimento) => total + investimento.valorAtual,
    0,
  );

  return success({
    periodo: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    saldoTotal,
    receitasMes,
    despesasMes,
    patrimonioLiquido: saldoTotal + valorInvestimentos,
    contas: contas.length,
    investimentos: valorInvestimentos,
  });
};

export const obterDashboardEvolucao = async ({ userId }: UserParams) => {
  const contas = await prisma.conta.findMany({
    where: { userId },
    include: { transacoes: { orderBy: { data: "asc" } } },
    orderBy: { nome: "asc" },
  });
  const investimentos = await prisma.investimento.findMany({
    where: { userId },
    orderBy: { nome: "asc" },
  });
  const valorInvestimentos = investimentos.reduce(
    (total, investimento) => total + investimento.valorAtual,
    0,
  );
  const meses = Array.from({ length: 12 }, (_, index) =>
    dayjs()
      .subtract(11 - index, "month")
      .startOf("month"),
  );

  const data = meses.map((mes) => {
    const fimMes = mes.endOf("month").toDate();
    const saldoContas = contas.reduce((total, conta) => {
      const transacoesAteMes = conta.transacoes
        .filter((transacao) => transacao.data <= fimMes)
        .reduce((sum, transacao) => sum + transacao.valor, 0);

      return total + conta.saldo + transacoesAteMes;
    }, 0);

    return {
      mes: mes.format("YYYY-MM"),
      patrimonio: saldoContas + valorInvestimentos,
    };
  });

  return success(data);
};

export const obterInsightsIa = async ({ userId, query }: QueryParams) => {
  const resumo = await obterDashboardResumo({ userId, query });
  if (!resumo.ok) return resumo;

  const [transacoesRecentes, investimentos, metas] = await prisma.$transaction([
    prisma.transacao.findMany({
      where: { userId },
      orderBy: { data: "desc" },
      take: 20,
      include: { conta: true, empresa: true },
    }),
    prisma.investimento.findMany({
      where: { userId },
      orderBy: { nome: "asc" },
      include: { aportes: { orderBy: { data: "desc" } } },
    }),
    prisma.meta.findMany({
      where: { userId },
      orderBy: { prazo: "asc" },
    }),
  ]);

  try {
    const insights = await gerarInsights({
      resumo: {
        saldoTotal: resumo.body.data.saldoTotal,
        receitasMes: resumo.body.data.receitasMes,
        despesasMes: resumo.body.data.despesasMes,
        patrimonioLiquido: resumo.body.data.patrimonioLiquido,
        fluxoCaixa: [],
      },
      transacoesRecentes: transacoesRecentes.map((transacao) => ({
        id: transacao.id,
        descricao: transacao.descricao,
        valor: transacao.valor,
        tipo: transacao.tipo,
        categoria: transacao.categoria,
        subcategoria: transacao.subcategoria ?? undefined,
        data: transacao.data,
        competencia: transacao.competencia,
        perfil: transacao.perfil,
        conta: {
          id: transacao.conta.id,
          nome: transacao.conta.nome,
          tipo: transacao.conta.tipo,
          perfil: transacao.conta.perfil,
          instituicao: transacao.conta.instituicao,
          saldo: transacao.conta.saldo,
          cor: transacao.conta.cor,
          ativo: transacao.conta.ativo,
        },
        categorizadoPorIA: transacao.categorizadoPorIA,
      })),
      investimentos: investimentos.map((investimento) => ({
        id: investimento.id,
        nome: investimento.nome,
        tipo: investimento.tipo,
        corretora: investimento.corretora,
        quantidade: investimento.quantidade,
        precoMedio: investimento.precoMedio,
        precoAtual: investimento.precoAtual,
        valorInvestido: investimento.valorInvestido,
        valorAtual: investimento.valorAtual,
        rentabilidade: investimento.rentabilidade,
        dividendos: investimento.dividendos,
        aportes: investimento.aportes.map((aporte) => ({
          id: aporte.id,
          valor: aporte.valor,
          quantidade: aporte.quantidade ?? undefined,
          preco: aporte.preco,
          data: aporte.data,
          tipo: aporte.tipo,
        })),
      })),
      metas: metas.map((meta) => ({
        titulo: meta.titulo,
        valorAlvo: meta.valorAlvo,
        valorAtual: meta.valorAtual,
        prazo: meta.prazo,
      })),
    });

    return success(insights);
  } catch (error) {
    if (error instanceof Error && error.message === GEMINI_API_KEY_ERROR) {
      return success([], 200, {
        aiConfigured: false,
        message: GEMINI_API_KEY_ERROR,
      });
    }

    return unexpected(error);
  }
};
