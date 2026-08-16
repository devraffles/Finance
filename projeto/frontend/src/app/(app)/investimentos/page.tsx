import { ResourceList } from "@/components/layout/resource-list";

export default function InvestimentosPage() {
  return (
    <ResourceList
      description="Posicoes e rentabilidade da carteira."
      endpoint="/api/investimentos"
      title="Investimentos"
    />
  );
}
