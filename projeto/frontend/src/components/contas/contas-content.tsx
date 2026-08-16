"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

interface Conta {
  id: string;
  nome: string;
  tipo: "CORRENTE" | "POUPANCA" | "CARTAO" | "INVESTIMENTO" | "CAIXA" | "OUTRO";
  perfil: "PF" | "PJ";
  instituicao: string;
  saldo: number;
  cor: string;
  ativo: boolean;
}

interface ApiResponse<T> {
  data: T;
}

const contaSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome da conta."),
  instituicao: z.string().trim().min(2, "Informe a instituicao."),
  tipo: z.enum([
    "CORRENTE",
    "POUPANCA",
    "CARTAO",
    "INVESTIMENTO",
    "CAIXA",
    "OUTRO",
  ]),
  perfil: z.enum(["PF", "PJ"]),
  saldo: z
    .string()
    .refine(
      (value) => Number.isFinite(Number(value)),
      "Informe um saldo valido.",
    ),
  cor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Selecione uma cor valida."),
});

type ContaForm = z.infer<typeof contaSchema>;

const defaultValues: ContaForm = {
  nome: "",
  instituicao: "",
  tipo: "CORRENTE",
  perfil: "PF",
  saldo: "0",
  cor: "#38BDF8",
};

const getError = async (response: Response) => {
  const body: unknown = await response.json().catch(() => null);
  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "object" &&
    body.error !== null &&
    "message" in body.error &&
    typeof body.error.message === "string"
  ) {
    return body.error.message;
  }
  return "Nao foi possivel concluir a operacao.";
};

export const ContasContent = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [editing, setEditing] = useState<Conta>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const form = useForm<ContaForm>({
    defaultValues,
    resolver: zodResolver(contaSchema),
  });

  const loadContas = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const response = await fetch("/api/contas", { cache: "no-store" });
      if (!response.ok) throw new Error(await getError(response));
      const body: ApiResponse<unknown> = await response.json();
      if (!Array.isArray(body.data))
        throw new Error("Resposta de contas invalida.");
      setContas(
        body.data.filter(
          (item): item is Conta =>
            typeof item === "object" &&
            item !== null &&
            "id" in item &&
            "nome" in item &&
            "saldo" in item,
        ),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Falha inesperada.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadContas();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadContas]);

  const openCreate = () => {
    setEditing(undefined);
    form.reset(defaultValues);
    setIsFormOpen(true);
  };

  const openEdit = (conta: Conta) => {
    setEditing(conta);
    form.reset({
      nome: conta.nome,
      instituicao: conta.instituicao,
      tipo: conta.tipo,
      perfil: conta.perfil,
      saldo: String(conta.saldo),
      cor: conta.cor,
    });
    setIsFormOpen(true);
  };

  const onSubmit = async (values: ContaForm) => {
    setSubmitting(true);
    try {
      const response = await fetch(
        editing ? `/api/contas/${editing.id}` : "/api/contas",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            saldo: Number(values.saldo),
            ativo: editing?.ativo ?? true,
          }),
        },
      );
      if (!response.ok) throw new Error(await getError(response));
      toast.success(editing ? "Conta atualizada." : "Conta criada.");
      setIsFormOpen(false);
      await loadContas();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Falha inesperada.");
    } finally {
      setSubmitting(false);
    }
  };

  const removeConta = async (conta: Conta) => {
    if (
      !window.confirm(
        `Excluir a conta ${conta.nome}? Esta acao nao pode ser desfeita.`,
      )
    )
      return;
    try {
      const response = await fetch(`/api/contas/${conta.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(await getError(response));
      toast.success("Conta excluida.");
      await loadContas();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Falha inesperada.");
    }
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl">Contas</h1>
          <p className="mt-1 text-sm text-kwak-lavender-200">
            Organize as contas financeiras vinculadas ao seu perfil.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Nova conta
        </Button>
      </header>
      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
          <p>{error}</p>
          <Button
            className="mt-3"
            onClick={() => void loadContas()}
            size="sm"
            variant="secondary"
          >
            Tentar novamente
          </Button>
        </div>
      ) : null}
      {loading ? (
        <p className="text-sm text-kwak-lavender-200">Carregando contas…</p>
      ) : null}
      {!loading && !error && contas.length === 0 ? (
        <div className="rounded-lg border border-dashed border-kwak-border p-8 text-center">
          <p className="font-medium">Nenhuma conta cadastrada.</p>
          <p className="mt-1 text-sm text-kwak-lavender-200">
            Cadastre sua primeira conta para acompanhar seus saldos.
          </p>
        </div>
      ) : null}
      {!loading && !error && contas.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-kwak-border bg-kwak-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-kwak-border text-kwak-lavender-200">
              <tr>
                <th className="px-4 py-3">Conta</th>
                <th className="px-4 py-3">Perfil</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Saldo</th>
                <th className="px-4 py-3">
                  <span className="sr-only">Acoes</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {contas.map((conta) => (
                <tr
                  className="border-b border-kwak-border/60 last:border-0"
                  key={conta.id}
                >
                  <td className="px-4 py-3">
                    <span
                      className="mr-2 inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: conta.cor }}
                    />
                    <strong>{conta.nome}</strong>
                    <span className="ml-2 text-kwak-lavender-200">
                      {conta.instituicao}
                    </span>
                  </td>
                  <td className="px-4 py-3">{conta.perfil}</td>
                  <td className="px-4 py-3">{conta.tipo}</td>
                  <td className="px-4 py-3 font-medium">
                    {formatCurrency(conta.saldo)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        aria-label={`Editar ${conta.nome}`}
                        onClick={() => openEdit(conta)}
                        size="icon"
                        variant="ghost"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        aria-label={`Excluir ${conta.nome}`}
                        onClick={() => void removeConta(conta)}
                        size="icon"
                        variant="danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {isFormOpen ? (
        <div
          aria-labelledby="conta-form-title"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
          role="dialog"
        >
          <form
            className="w-full max-w-lg space-y-4 rounded-lg border border-kwak-border bg-kwak-navy-950 p-6 shadow-2xl"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div>
              <h2 className="font-heading text-xl" id="conta-form-title">
                {editing ? "Editar conta" : "Nova conta"}
              </h2>
              <p className="mt-1 text-sm text-kwak-lavender-200">
                Os campos obrigatorios sao validados antes do envio.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="conta-nome">Nome</Label>
                <Input id="conta-nome" {...form.register("nome")} />
                {form.formState.errors.nome ? (
                  <p className="text-xs text-red-200">
                    {form.formState.errors.nome.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="conta-instituicao">Instituicao</Label>
                <Input
                  id="conta-instituicao"
                  {...form.register("instituicao")}
                />
                {form.formState.errors.instituicao ? (
                  <p className="text-xs text-red-200">
                    {form.formState.errors.instituicao.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="conta-tipo">Tipo</Label>
                <Select id="conta-tipo" {...form.register("tipo")}>
                  {[
                    "CORRENTE",
                    "POUPANCA",
                    "CARTAO",
                    "INVESTIMENTO",
                    "CAIXA",
                    "OUTRO",
                  ].map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="conta-perfil">Perfil</Label>
                <Select id="conta-perfil" {...form.register("perfil")}>
                  <option value="PF">PF</option>
                  <option value="PJ">PJ</option>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="conta-saldo">Saldo</Label>
                <Input
                  id="conta-saldo"
                  inputMode="decimal"
                  {...form.register("saldo")}
                />
                {form.formState.errors.saldo ? (
                  <p className="text-xs text-red-200">
                    {form.formState.errors.saldo.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="conta-cor">Cor</Label>
                <Input id="conta-cor" type="color" {...form.register("cor")} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                disabled={submitting}
                onClick={() => setIsFormOpen(false)}
                variant="ghost"
              >
                Cancelar
              </Button>
              <Button disabled={submitting} type="submit">
                {submitting ? "Salvando…" : "Salvar conta"}
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
};
