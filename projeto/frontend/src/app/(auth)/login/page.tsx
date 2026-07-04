import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { getOptionalSession } from "@/lib/server-session";

export default async function LoginPage() {
  const session = await getOptionalSession(new Headers(headers()));

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(36,110,233,0.28),transparent_34%),linear-gradient(145deg,#000542_0%,#020a58_52%,#17191d_100%)] px-6 py-10 text-kwak-ice-50">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-kwak-blue-600 shadow-[0_16px_40px_rgba(36,110,233,0.35)]">
            <ShieldCheck aria-hidden="true" className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-heading text-xl font-semibold">Kwak Finance</p>
            <p className="text-sm text-kwak-lavender-200">
              Gestao financeira integrada
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-kwak-border bg-kwak-surface/88 p-6 shadow-[0_24px_80px_rgba(0,5,66,0.48)] backdrop-blur">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-semibold">Entrar</h1>
            <p className="mt-2 text-sm leading-6 text-kwak-lavender-200">
              Acesse o painel para acompanhar PF, PJ e patrimonio.
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
