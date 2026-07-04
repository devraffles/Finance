import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { z } from "zod";

import type {
  CategorizacaoResult,
  DadosFinanceiros,
  Insight,
  TransacaoBruta,
} from "../types/financas";

const DEFAULT_TIMEOUT_MS = 30_000;
const CATEGORIZACAO_MODEL = "gemini-2.5-flash";
const INSIGHTS_MODEL = "gemini-2.5-pro";

export const GEMINI_API_KEY_ERROR =
  "GOOGLE_GENERATIVE_AI_API_KEY nao esta configurada. Defina a chave no arquivo .env para usar recursos de IA.";

const categorizacaoSchema = z.array(
  z.object({
    transacaoId: z.string().optional(),
    descricao: z.string().optional(),
    categoria: z.string().min(1),
    subcategoria: z.string().optional(),
    confianca: z.number().min(0).max(1),
    justificativa: z.string().min(1),
  }),
);

const insightsSchema = z.array(
  z.object({
    tipo: z.enum(["alerta", "oportunidade", "resumo", "risco"]),
    titulo: z.string().min(1),
    descricao: z.string().min(1),
    impacto: z.number().optional(),
  }),
);

interface CallGeminiParams {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  timeoutMs?: number;
}

const getGeminiApiKey = () => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(GEMINI_API_KEY_ERROR);
  }

  return apiKey;
};

const extractJson = (text: string) => {
  const fencedMatch = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  return text.trim();
};

const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(extractJson(text));
  } catch {
    throw new Error("A resposta do Gemini nao retornou um JSON valido.");
  }
};

const messageFromError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido.";
};

export const callGemini = async ({
  prompt,
  systemPrompt,
  model = CATEGORIZACAO_MODEL,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: CallGeminiParams): Promise<string> => {
  const google = createGoogleGenerativeAI({
    apiKey: getGeminiApiKey(),
  });
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), timeoutMs);

  try {
    const { text } = await generateText({
      model: google(model),
      prompt,
      system: systemPrompt,
      abortSignal: abortController.signal,
    });

    return text;
  } catch (error) {
    if (abortController.signal.aborted) {
      throw new Error("A chamada ao Gemini excedeu o tempo limite.");
    }

    throw new Error(`Falha ao chamar Gemini: ${messageFromError(error)}`);
  } finally {
    clearTimeout(timeout);
  }
};

export const categorizarTransacoes = async (
  transacoes: TransacaoBruta[],
): Promise<CategorizacaoResult[]> => {
  const text = await callGemini({
    model: CATEGORIZACAO_MODEL,
    systemPrompt:
      "Voce categoriza transacoes financeiras brasileiras. Responda somente JSON valido.",
    prompt: `Categorize as transacoes abaixo. Retorne um array JSON com categoria, subcategoria opcional, confianca entre 0 e 1 e justificativa.\n\n${JSON.stringify(transacoes)}`,
  });

  return categorizacaoSchema.parse(parseJson(text));
};

export const gerarInsights = async (
  dados: DadosFinanceiros,
): Promise<Insight[]> => {
  const text = await callGemini({
    model: INSIGHTS_MODEL,
    systemPrompt:
      "Voce gera insights financeiros objetivos para o Kwak Finance. Responda somente JSON valido.",
    prompt: `Analise os dados agregados e retorne um array JSON de insights com tipo, titulo, descricao e impacto opcional.\n\n${JSON.stringify(dados)}`,
  });

  return insightsSchema.parse(parseJson(text));
};
