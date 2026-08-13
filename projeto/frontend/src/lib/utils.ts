import { type ClassValue, clsx } from "clsx";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

import type { TransacaoBrutaCsv } from "@/types/financas";

dayjs.extend(customParseFormat);

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (date: Date | string) => {
  const parsedDate = dayjs(date);

  if (!parsedDate.isValid()) {
    return "Data invalida";
  }

  return parsedDate.format("DD/MM/YYYY");
};

export const formatPercent = (value: number, digits = 1) => {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
    style: "percent",
  }).format(value / 100);
};

export const calcularVariacao = (atual: number, anterior: number) => {
  if (anterior === 0) {
    return atual === 0 ? 0 : 100;
  }

  return ((atual - anterior) / Math.abs(anterior)) * 100;
};

const chartColors = [
  "#246ee9",
  "#12b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export const gerarCorAleatoria = (seed = "") => {
  if (!seed) {
    return chartColors[0];
  }

  const hash = Array.from(seed).reduce((accumulator, character) => {
    return accumulator + character.charCodeAt(0);
  }, 0);

  return chartColors[hash % chartColors.length];
};

export const slugify = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const normalizeCsvHeader = (value: string) => slugify(value).replace(/-/g, "");

const splitCsvLine = (line: string, delimiter: string) => {
  const values: string[] = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && insideQuotes && nextCharacter === '"') {
      currentValue += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (character === delimiter && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue.trim());
  return values;
};

const parseCsvAmount = (value: string) => {
  const normalized = value
    .trim()
    .replace(/R\$\s?/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const amount = Number(normalized);

  return Number.isFinite(amount) ? amount : null;
};

const parseCsvDate = (value: string) => {
  const parsed = dayjs(value.trim(), ["DD/MM/YYYY", "YYYY-MM-DD"], true);

  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : null;
};

export const parseCSVNubank = (csvText: string): TransacaoBrutaCsv[] => {
  const lines = csvText
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const delimiter = lines[0].includes(";") ? ";" : ",";
  const headers = splitCsvLine(lines[0], delimiter).map(normalizeCsvHeader);
  const dateIndex = headers.findIndex((header) =>
    ["data", "date"].includes(header),
  );
  const descriptionIndex = headers.findIndex((header) =>
    ["titulo", "title", "descricao", "description"].includes(header),
  );
  const amountIndex = headers.findIndex((header) =>
    ["valor", "amount"].includes(header),
  );
  const categoryIndex = headers.findIndex((header) =>
    ["categoria", "category"].includes(header),
  );

  if (dateIndex < 0 || descriptionIndex < 0 || amountIndex < 0) {
    return [];
  }

  return lines.slice(1).reduce<TransacaoBrutaCsv[]>((transactions, line) => {
    const values = splitCsvLine(line, delimiter);
    const data = parseCsvDate(values[dateIndex] ?? "");
    const descricao = values[descriptionIndex]?.trim();
    const valor = parseCsvAmount(values[amountIndex] ?? "");
    const categoria =
      categoryIndex >= 0 ? values[categoryIndex]?.trim() : undefined;

    if (!data || !descricao || valor === null) {
      return transactions;
    }

    transactions.push({
      data,
      descricao,
      valor,
      ...(categoria ? { categoria } : {}),
    });

    return transactions;
  }, []);
};
