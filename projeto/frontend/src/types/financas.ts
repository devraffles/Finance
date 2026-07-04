export type PerfilFinanceiroUI = "PF" | "PJ" | "TODOS";

export interface KpiFinanceiroUI {
  id: string;
  titulo: string;
  valor: number;
  variacao?: number;
}

export interface ContaResumoUI {
  id: string;
  nome: string;
  instituicao: string;
  saldo: number;
  perfil: Exclude<PerfilFinanceiroUI, "TODOS">;
  cor: string;
}

export interface TransacaoResumoUI {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  contaNome: string;
}

export interface InsightUI {
  id: string;
  titulo: string;
  descricao: string;
  tipo: "alerta" | "oportunidade" | "resumo" | "risco";
}
