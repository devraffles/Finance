"use client";

import { ArrowDownLeft, ArrowUpRight, Landmark, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils";

interface Resumo {
  saldoTotal: number;
  receitasMes: number;
  despesasMes: number;
  patrimonioLiquido: number;
}

interface EvolucaoItem {
  mes: string;
  patrimonio: number;
}

interface ApiResponse<T> {
  data: T;
}

const isResumo = (value: unknown): value is Resumo => {
  return (
    typeof value === "object" &&
    value !== null &&
    "saldoTotal" in value &&
    "receitasMes" in value &&
    "despesasMes" in value &&
    "patrimonioLiquido" in value
  );
};

const isEvolucao = (value: unknown): value is EvolucaoItem[] => {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "mes" in item &&
        "patrimonio" in item,
    )
  );
};

export const DashboardContent = () => {
  const [resumo, setResumo] = useState<Resumo>();
  const [evolucao, setEvolucao] = useState<EvolucaoItem[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const load = async () => {
      try {
        const [resumoResponse, evolucaoResponse] = await Promise.all([
          fetch("/api/dashboard/resumo"),
          fetch("/api/dashboard/evolucao"),
        ]);
        if (!resumoResponse.ok || !evolucaoResponse.ok)
          throw new Error("Nao foi possivel carregar o dashboard.");
        const resumoBody: ApiResponse<unknown> = await resumoResponse.json();
        const evolucaoBody: ApiResponse<unknown> =
          await evolucaoResponse.json();
        if (!isResumo(resumoBody.data) || !isEvolucao(evolucaoBody.data))
          throw new Error("Resposta do dashboard invalida.");
        setResumo(resumoBody.data);
        setEvolucao(evolucaoBody.data);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Falha inesperada.");
      }
    };
    void load();
  }, []);

  if (error)
    return (
      <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
        {error}
      </p>
    );
  if (!resumo)
    return (
      <p className="text-sm text-kwak-lavender-200">
        Carregando dados financeiros…
      </p>
    );

  const cards = [
    { label: "Receita do mes", value: resumo.receitasMes, icon: ArrowUpRight },
    { label: "Despesas", value: -resumo.despesasMes, icon: ArrowDownLeft },
    { label: "Saldo em contas", value: resumo.saldoTotal, icon: Landmark },
    { label: "Patrimonio", value: resumo.patrimonioLiquido, icon: Wallet },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <article
            className="rounded-lg border border-kwak-border bg-kwak-surface p-5"
            key={label}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-kwak-lavender-200">{label}</p>
              <Icon aria-hidden="true" className="h-5 w-5 text-kwak-blue-500" />
            </div>
            <strong className="mt-3 block font-heading text-2xl">
              {formatCurrency(value)}
            </strong>
          </article>
        ))}
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <article className="h-80 rounded-lg border border-kwak-border bg-kwak-surface p-5">
          <h2 className="font-heading text-lg">Fluxo do periodo</h2>
          <ResponsiveContainer height="88%" width="100%">
            <BarChart
              data={[
                {
                  nome: "Mes",
                  receitas: resumo.receitasMes,
                  despesas: resumo.despesasMes,
                },
              ]}
            >
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="receitas" fill="#2563eb" />
              <Bar dataKey="despesas" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </article>
        <article className="h-80 rounded-lg border border-kwak-border bg-kwak-surface p-5">
          <h2 className="font-heading text-lg">Evolucao do patrimonio</h2>
          <ResponsiveContainer height="88%" width="100%">
            <AreaChart data={evolucao}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Area
                dataKey="patrimonio"
                fill="#2563eb"
                fillOpacity={0.25}
                stroke="#60a5fa"
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </article>
      </section>
    </div>
  );
};
