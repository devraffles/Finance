import { ResourceList } from "@/components/layout/resource-list";

export default function EmpresarialPage() {
  return (
    <ResourceList
      description="Empresas cadastradas para o seu perfil."
      endpoint="/api/empresas"
      title="Painel Empresarial"
    />
  );
}
