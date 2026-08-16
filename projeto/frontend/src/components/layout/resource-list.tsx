"use client";

import { useEffect, useState } from "react";

import { formatCurrency } from "@/lib/utils";

interface ResourceListProps {
  endpoint: string;
  title: string;
  description: string;
}
interface ApiResponse {
  data: unknown;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const display = (value: unknown) =>
  typeof value === "number"
    ? formatCurrency(value)
    : typeof value === "boolean"
      ? value
        ? "Sim"
        : "Nao"
      : typeof value === "string"
        ? value
        : "—";

export const ResourceList = ({
  endpoint,
  title,
  description,
}: ResourceListProps) => {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string>();
  useEffect(() => {
    void fetch(endpoint)
      .then(async (response) => {
        if (!response.ok)
          throw new Error("Nao foi possivel carregar os dados.");
        const body: ApiResponse = await response.json();
        const data = Array.isArray(body.data)
          ? body.data
          : isRecord(body.data) && Array.isArray(body.data.data)
            ? body.data.data
            : [];
        setItems(data.filter(isRecord));
      })
      .catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : "Falha inesperada."),
      );
  }, [endpoint]);
  const columns = items[0]
    ? Object.keys(items[0])
        .filter((key) => !["id", "createdAt", "updatedAt"].includes(key))
        .slice(0, 6)
    : [];
  return (
    <section className="space-y-4">
      <header>
        <h1 className="font-heading text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-kwak-lavender-200">{description}</p>
      </header>
      {error ? (
        <p className="rounded-lg border border-red-500/40 p-4 text-red-200">
          {error}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-kwak-border bg-kwak-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-kwak-border text-kwak-lavender-200">
              <tr>
                {columns.map((column) => (
                  <th className="px-4 py-3 font-medium" key={column}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  className="border-b border-kwak-border/60 last:border-0"
                  key={String(item.id ?? index)}
                >
                  {columns.map((column) => (
                    <td className="px-4 py-3" key={column}>
                      {display(item[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 ? (
            <p className="p-5 text-sm text-kwak-lavender-200">
              Nenhum registro encontrado.
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
};
