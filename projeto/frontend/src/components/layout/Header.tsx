"use client";

import { Bell } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/contas": "Contas",
  "/transacoes": "Transacoes",
  "/metas": "Metas",
  "/empresarial": "Painel Empresarial",
  "/investimentos": "Investimentos",
  "/configuracoes": "Configuracoes",
};

const periodOptions = [
  { value: "mes-atual", label: "Mes Atual" },
  { value: "mes-anterior", label: "Mes Anterior" },
  { value: "trimestre", label: "Trimestre" },
  { value: "ano", label: "Ano" },
  { value: "customizado", label: "Customizado" },
];

const profileOptions = [
  { value: "todos", label: "Todos" },
  { value: "pf", label: "PF" },
  { value: "pj", label: "PJ" },
];

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const title = pageTitles[pathname] ?? "Kwak Finance";

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-kwak-border bg-kwak-navy-950/88 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="pl-12 md:pl-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-kwak-lavender-400">
            Kwak Finance
          </p>
          <h1 className="font-heading text-2xl font-semibold text-kwak-ice-50">
            {title}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,160px)_minmax(0,120px)_40px]">
          <Select
            aria-label="Periodo"
            onChange={(event) =>
              updateSearchParam("periodo", event.target.value)
            }
            value={searchParams.get("periodo") ?? "mes-atual"}
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Perfil"
            onChange={(event) =>
              updateSearchParam("perfil", event.target.value)
            }
            value={searchParams.get("perfil") ?? "todos"}
          >
            {profileOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Button
            aria-label="Notificacoes"
            className="relative"
            size="icon"
            variant="secondary"
          >
            <Bell aria-hidden="true" className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-kwak-blue-600 px-1 text-[0.68rem] font-semibold text-white">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};
