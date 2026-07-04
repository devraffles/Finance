"use client";

import {
  BarChart3,
  BriefcaseBusiness,
  CreditCard,
  Landmark,
  LogOut,
  Menu,
  PieChart,
  Settings,
  Target,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarUser {
  name?: string | null;
  email: string;
}

interface SidebarProps {
  user: SidebarUser;
}

const navigationGroups = [
  {
    label: "VISAO GERAL",
    items: [{ href: "/dashboard", label: "Dashboard", icon: BarChart3 }],
  },
  {
    label: "FINANCAS",
    items: [
      { href: "/contas", label: "Contas", icon: Landmark },
      { href: "/transacoes", label: "Transacoes", icon: CreditCard },
      { href: "/metas", label: "Metas", icon: Target },
    ],
  },
  {
    label: "EMPRESARIAL",
    items: [
      {
        href: "/empresarial",
        label: "Painel Empresarial",
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    label: "PATRIMONIO",
    items: [{ href: "/investimentos", label: "Investimentos", icon: PieChart }],
  },
  {
    label: "SISTEMA",
    items: [{ href: "/configuracoes", label: "Configuracoes", icon: Settings }],
  },
];

export const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  };

  const sidebarContent = (
    <aside className="flex h-full w-[240px] flex-col border-r border-kwak-border bg-kwak-navy-900/96 text-kwak-ice-50 shadow-[16px_0_48px_rgba(0,5,66,0.26)]">
      <div className="flex h-16 items-center gap-3 border-b border-kwak-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-kwak-blue-600">
          <Image
            alt=""
            aria-hidden="true"
            className="h-6 w-6 object-contain"
            height={24}
            priority
            src="/assets/Mini-Icon-White.webp"
            width={24}
          />
        </div>
        <div>
          <p className="font-heading text-base font-semibold">Kwak Finance</p>
          <p className="text-xs text-kwak-lavender-200">PF, PJ e patrimonio</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[0.68rem] font-semibold tracking-[0.12em] text-kwak-lavender-400">
              {group.label}
            </p>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-kwak-lavender-200 transition hover:bg-white/8 hover:text-kwak-ice-50",
                      isActive &&
                        "bg-[color:var(--accent-blue)] text-white shadow-[0_10px_24px_rgba(36,110,233,0.24)]",
                    )}
                    href={item.href}
                    key={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-kwak-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-kwak-surface-muted text-sm font-semibold text-kwak-ice-50">
            {(user.name ?? user.email).slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {user.name ?? "Usuario"}
            </p>
            <p className="truncate text-xs text-kwak-lavender-200">
              {user.email}
            </p>
          </div>
        </div>
        <Button
          className="w-full justify-start"
          onClick={handleLogout}
          variant="ghost"
        >
          <LogOut aria-hidden="true" className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );

  return (
    <>
      <Button
        aria-label="Abrir menu"
        className="fixed left-4 top-4 z-40 md:hidden"
        onClick={() => setIsOpen(true)}
        size="icon"
        variant="secondary"
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
      </Button>

      <div className="hidden md:block">{sidebarContent}</div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/58"
            onClick={() => setIsOpen(false)}
            type="button"
          />
          <div className="relative h-full w-[240px]">
            <Button
              aria-label="Fechar menu"
              className="absolute right-3 top-3 z-10"
              onClick={() => setIsOpen(false)}
              size="icon"
              variant="ghost"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </Button>
            {sidebarContent}
          </div>
        </div>
      ) : null}
    </>
  );
};
