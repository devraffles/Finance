import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { getOptionalSession } from "@/lib/server-session";

interface AppLayoutProps {
  children: ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await getOptionalSession(new Headers(headers()));

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-kwak-navy-950 text-kwak-ice-50">
      <Sidebar
        user={{
          email: session.user.email ?? "admin@kwakfinance.local",
          name: session.user.name,
        }}
      />
      <div className="min-w-0 flex-1">
        <Header />
        <main className="px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
