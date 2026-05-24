import { getSession } from "@kwak-finance/backend/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await getSession(new Headers(headers()));

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-kwak-navy-950 text-kwak-ice-50">
      <Sidebar
        user={{
          email: session.user.email,
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
