export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 px-6 py-10 text-zinc-50">
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-300">
          Financas 360
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          Fundacao Next.js pronta para evoluir a gestao financeira integrada.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300">
          Esta base usa App Router, TypeScript, Tailwind CSS, Prisma com
          PostgreSQL e workspace pnpm separado entre frontend e backend.
        </p>
        <div className="mt-10 grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            Frontend em Next.js 14
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            Backend isolado para dominio
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            Prisma configurado para PostgreSQL
          </div>
        </div>
      </section>
    </main>
  );
}
