import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
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
