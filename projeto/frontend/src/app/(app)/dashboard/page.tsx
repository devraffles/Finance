import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

import { formatCurrency } from "@/lib/utils";

const kpis = [
  {
    label: "Receita do mes",
    value: 12840,
    icon: ArrowUpRight,
  },
  {
    label: "Despesas",
    value: -6340,
    icon: ArrowDownLeft,
  },
  {
    label: "Patrimonio",
    value: 92450,
    icon: Wallet,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <div
              className="rounded-lg border border-kwak-border bg-kwak-surface p-5"
              key={kpi.label}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-kwak-lavender-200">{kpi.label}</p>
                <Icon
                  aria-hidden="true"
                  className="h-5 w-5 text-kwak-blue-500"
                />
              </div>
              <strong className="mt-3 block font-heading text-2xl">
                {formatCurrency(kpi.value)}
              </strong>
            </div>
          );
        })}
      </section>

      <section className="rounded-lg border border-dashed border-kwak-border bg-kwak-surface/70 p-6">
        <h2 className="font-heading text-lg font-semibold">Visao geral</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-kwak-lavender-200">
          A casca navegavel esta pronta para receber os graficos e dados reais
          do dashboard nas proximas tarefas.
        </p>
      </section>
    </div>
  );
}
