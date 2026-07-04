export { auth, getSession } from "./lib/auth";
export { callGemini, categorizarTransacoes, gerarInsights } from "./lib/gemini";
export { prisma } from "./lib/prisma";
export * from "./schemas";
export * from "./services";
export { authEnvSchema, credentialsSchema } from "./schemas/auth";
export type { AuthEnv, CredentialsInput } from "./schemas/auth";
export type {
  CategorizacaoResult,
  DadosFinanceiros,
  DashboardResumo,
  FiltrosTransacao,
  FluxoCaixaMensal,
  Insight,
  InsightTipo,
  InvestimentoComAportes,
  PaginacaoParams,
  PaginacaoResult,
  TransacaoBruta,
  TransacaoComConta,
} from "./types/financas";
