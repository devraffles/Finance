import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data invalida";
  }

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = parsedDate.getFullYear();

  return `${day}/${month}/${year}`;
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
