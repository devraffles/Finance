import { ResourceList } from "@/components/layout/resource-list";

export default function MetasPage() {
  return (
    <ResourceList
      description="Acompanhe a evolucao das suas metas financeiras."
      endpoint="/api/metas"
      title="Metas"
    />
  );
}
