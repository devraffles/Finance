import { ResourceList } from "@/components/layout/resource-list";

export default function TransacoesPage() {
  return (
    <ResourceList
      description="Lancamentos recentes do perfil autenticado."
      endpoint="/api/transacoes"
      title="Transacoes"
    />
  );
}
