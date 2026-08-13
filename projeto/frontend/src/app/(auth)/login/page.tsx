import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getOptionalSession } from "@/lib/server-session";

export default async function LoginPage() {
  const session = await getOptionalSession(new Headers(headers()));

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen bg-[#18191f] text-kwak-ice-50 lg:grid-cols-[minmax(0,1.62fr)_minmax(420px,1fr)]">
      <section className="relative hidden overflow-hidden bg-[#0a42bd] px-12 py-14 lg:flex lg:flex-col lg:justify-end xl:px-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(133,177,255,0.88),transparent_0%,transparent_24%),radial-gradient(circle_at_82%_82%,rgba(5,24,114,0.9),transparent_0%,transparent_38%),linear-gradient(125deg,#73a6ff_-15%,#175bd9_48%,#072a9d_110%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.65)_0.65px,transparent_0.65px)] [background-size:4px_4px]"
        />
        <div className="relative w-full max-w-[580px]">
          <Image
            alt="Kwak Finance"
            className="h-auto w-full drop-shadow-[0_18px_45px_rgba(0,24,112,0.22)]"
            height={782}
            priority
            src="/assets/Logo-White-Login.webp"
            width={2048}
          />
          <p className="mt-7 max-w-sm text-base leading-7 text-white/82">
            Controle suas financas pessoais, empresariais e investimentos em um
            unico lugar.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
        <div className="w-full max-w-[400px]">
          <div className="mb-12 lg:hidden">
            <Image
              alt="Kwak Finance"
              className="h-auto w-52"
              height={782}
              priority
              src="/assets/Logo-White.webp"
              width={2048}
            />
          </div>

          <header className="mb-9">
            <h1 className="font-heading text-4xl font-medium tracking-[-0.045em] text-white sm:text-[2.65rem]">
              Entrar
            </h1>
            <p className="mt-3 text-base text-[#b8bdcc]">
              Acesse sua conta Kwak Finance.
            </p>
          </header>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
