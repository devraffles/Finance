import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

import type { TransacaoBruta } from "../types/financas";

dayjs.extend(customParseFormat);

const normalizeHeader = (value: string) => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "");
};

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

const parseAmount = (value: string) => {
  const normalized = value
    .trim()
    .replace(/R\$\s?/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const amount = Number(normalized);

  return Number.isFinite(amount) ? amount : null;
};

const parseDate = (value: string) => {
  const parsed = dayjs(value.trim(), ["DD/MM/YYYY", "YYYY-MM-DD"], true);

  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : null;
};

export const parseCsvNubank = (csvText: string): TransacaoBruta[] => {
  const lines = csvText
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const delimiter = lines[0].includes(";") ? ";" : ",";
  const headers = splitCsvLine(lines[0], delimiter).map(normalizeHeader);
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

  return lines.slice(1).reduce<TransacaoBruta[]>((transactions, line) => {
    const values = splitCsvLine(line, delimiter);
    const data = parseDate(values[dateIndex] ?? "");
    const descricao = values[descriptionIndex]?.trim();
    const valor = parseAmount(values[amountIndex] ?? "");
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
