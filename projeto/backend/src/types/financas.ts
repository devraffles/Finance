export type PerfilFinanceiro = "PF" | "PJ";

export type TipoTransacaoFinanceira = "RECEITA" | "DESPESA" | "TRANSFERENCIA";

export type InsightTipo = "alerta" | "oportunidade" | "resumo" | "risco";

export interface ContaComSaldo {
  id: string;
  nome: string;
  tipo: string;
  perfil: PerfilFinanceiro;
  instituicao: string;
  saldo: number;
  cor: string;
  ativo: boolean;
}

export interface TransacaoBruta {
  descricao: string;
  valor: number;
  data: string;
  categoria?: string;
  conta?: string;
}

export interface TransacaoComConta {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacaoFinanceira;
  categoria: string;
  subcategoria?: string;
  data: Date;
  competencia: Date;
  perfil: PerfilFinanceiro;
  conta: ContaComSaldo;
  categorizadoPorIA: boolean;
}

export interface AporteResumo {
  id: string;
  valor: number;
  quantidade?: number;
  preco: number;
  data: Date;
  tipo: string;
}

export interface InvestimentoComAportes {
  id: string;
  nome: string;
  tipo: string;
  corretora: string;
  quantidade: number;
  precoMedio: number;
  precoAtual: number;
  valorInvestido: number;
  valorAtual: number;
  rentabilidade: number;
  dividendos: number;
  aportes: AporteResumo[];
}

export interface FluxoCaixaMensal {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface DashboardResumo {
  saldoTotal: number;
  receitasMes: number;
  despesasMes: number;
  patrimonioLiquido: number;
  fluxoCaixa: FluxoCaixaMensal[];
}

export interface Insight {
  tipo: InsightTipo;
  titulo: string;
  descricao: string;
  impacto?: number;
}

export interface CategorizacaoResult {
  transacaoId?: string;
  descricao?: string;
  categoria: string;
  subcategoria?: string;
  confianca: number;
  justificativa: string;
}

export interface DadosFinanceiros {
  resumo: DashboardResumo;
  transacoesRecentes: TransacaoComConta[];
  investimentos: InvestimentoComAportes[];
  metas: Array<{
    titulo: string;
    valorAlvo: number;
    valorAtual: number;
    prazo: Date;
  }>;
}

export interface FiltrosTransacao {
  dataInicio?: Date;
  dataFim?: Date;
  tipo?: TipoTransacaoFinanceira;
  categoria?: string;
  contaId?: string;
  perfil?: PerfilFinanceiro;
  busca?: string;
}

export interface PaginacaoParams {
  page: number;
  limit: number;
}

export interface PaginacaoResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
