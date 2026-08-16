"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface Configuracao {
  perfil: { name: string; email: string };
  preferencias: { perfilPadrao: "PF" | "PJ"; notificacoes: boolean };
  categorias: { id: string; nome: string; subcategoria: string | null }[];
  iaConfigurada: boolean;
}

export default function ConfiguracoesPage() {
  const [configuracao, setConfiguracao] = useState<Configuracao>();
  const [nome, setNome] = useState("");
  const [perfilPadrao, setPerfilPadrao] = useState<"PF" | "PJ">("PF");
  const [categoria, setCategoria] = useState("");

  const carregar = async () => {
    const response = await fetch("/api/configuracoes");
    const body: { data?: Configuracao } = await response.json();
    if (!response.ok || !body.data)
      throw new Error("Nao foi possivel carregar as configuracoes.");
    setConfiguracao(body.data);
    setNome(body.data.perfil.name);
    setPerfilPadrao(body.data.preferencias.perfilPadrao);
  };

  useEffect(() => {
    void fetch("/api/configuracoes")
      .then(async (response) => {
        const body: { data?: Configuracao } = await response.json();
        if (!response.ok || !body.data) {
          throw new Error("Nao foi possivel carregar as configuracoes.");
        }
        return body.data;
      })
      .then((data) => {
        setConfiguracao(data);
        setNome(data.perfil.name);
        setPerfilPadrao(data.preferencias.perfilPadrao);
      })
      .catch((error: unknown) =>
        toast.error(
          error instanceof Error ? error.message : "Falha inesperada.",
        ),
      );
  }, []);

  const salvar = async () => {
    const response = await fetch("/api/configuracoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, perfilPadrao }),
    });
    if (!response.ok)
      return toast.error("Nao foi possivel salvar as configuracoes.");
    toast.success("Configuracoes salvas.");
    await carregar();
  };

  const adicionarCategoria = async () => {
    if (!categoria.trim()) return;
    const response = await fetch("/api/configuracoes/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: categoria }),
    });
    if (!response.ok)
      return toast.error("Nao foi possivel adicionar a categoria.");
    setCategoria("");
    toast.success("Categoria adicionada.");
    await carregar();
  };

  if (!configuracao)
    return (
      <p className="text-sm text-kwak-lavender-200">
        Carregando configuracoes...
      </p>
    );

  return (
    <section className="max-w-3xl space-y-6">
      <header>
        <h1 className="font-heading text-2xl">Configuracoes</h1>
        <p className="mt-1 text-sm text-kwak-lavender-200">
          Perfil, preferencias e categorias do seu usuario.
        </p>
      </header>
      <div className="space-y-4 rounded-lg border border-kwak-border bg-kwak-surface p-5">
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input disabled id="email" value={configuracao.perfil.email} />
        </div>
        <div>
          <Label htmlFor="perfil">Perfil padrao</Label>
          <Select
            id="perfil"
            value={perfilPadrao}
            onChange={(event) =>
              setPerfilPadrao(event.target.value as "PF" | "PJ")
            }
          >
            <option value="PF">PF</option>
            <option value="PJ">PJ</option>
          </Select>
        </div>
        <Button onClick={() => void salvar()}>Salvar perfil</Button>
      </div>
      <div className="space-y-4 rounded-lg border border-kwak-border bg-kwak-surface p-5">
        <h2 className="font-heading text-lg">Categorias</h2>
        <div className="flex gap-2">
          <Input
            aria-label="Nova categoria"
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
            placeholder="Ex.: Alimentacao"
          />
          <Button onClick={() => void adicionarCategoria()}>Adicionar</Button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {configuracao.categorias.map((item) => (
            <li
              className="rounded-full bg-kwak-surface-muted px-3 py-1 text-sm"
              key={item.id}
            >
              {item.nome}
              {item.subcategoria ? ` · ${item.subcategoria}` : ""}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-kwak-lavender-200">
        IA:{" "}
        {configuracao.iaConfigurada
          ? "configurada"
          : "configure GOOGLE_GENERATIVE_AI_API_KEY no ambiente para habilitar."}
      </p>
    </section>
  );
}
