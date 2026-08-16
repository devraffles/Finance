import { hashPassword } from "better-auth/crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PerfilConta,
  PrismaClient,
  TipoAporte,
  TipoConta,
  TipoEmpresa,
  TipoInvest,
  TipoTransacao,
} from "@prisma/client";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL deve estar configurada para executar o seed.");
}

const pool = new Pool({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const seedUserId = "seed_admin_user";
const credentialAccountId = "seed_admin_credential_account";
const empresaId = "seed_empresa_dev_freelancer_mei";

const requiredEnv = (
  key: "SEED_USER_EMAIL" | "SEED_USER_PASSWORD" | "SEED_USER_NAME",
) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Variavel obrigatoria ausente: ${key}`);
  }

  return value;
};

const monthsFromNow = (months: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  date.setHours(12, 0, 0, 0);
  return date;
};

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(12, 0, 0, 0);
  return date;
};

const competenciaFromDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
};

interface ContaSeed {
  id: string;
  nome: string;
  tipo: TipoConta;
  perfil: PerfilConta;
  instituicao: string;
  saldo: number;
  cor: string;
  empresaId?: string;
}

interface TransacaoSeed {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoria: string;
  subcategoria?: string;
  data: Date;
  contaId: string;
  perfil: PerfilConta;
  empresaId?: string;
  tags: string[];
  observacao?: string;
  recorrente?: boolean;
  categorizadoPorIA?: boolean;
}

interface InvestimentoSeed {
  id: string;
  nome: string;
  tipo: TipoInvest;
  corretora: string;
  quantidade: number;
  precoMedio: number;
  precoAtual: number;
  valorInvestido: number;
  valorAtual: number;
  rentabilidade: number;
  dataAporte: Date;
  vencimento?: Date;
  indexador?: string;
  percentualIndice?: number;
  dividendos?: number;
}

interface MetaSeed {
  id: string;
  titulo: string;
  descricao: string;
  valorAlvo: number;
  valorAtual: number;
  prazo: Date;
  categoria: string;
  cor: string;
}

const contas: ContaSeed[] = [
  {
    id: "seed_conta_nubank_pf",
    nome: "Nubank Conta",
    tipo: TipoConta.CORRENTE,
    perfil: PerfilConta.PF,
    instituicao: "Nubank",
    saldo: 4200,
    cor: "#8A05BE",
  },
  {
    id: "seed_conta_nubank_cartao_pf",
    nome: "Nubank Cartao",
    tipo: TipoConta.CARTAO,
    perfil: PerfilConta.PF,
    instituicao: "Nubank",
    saldo: -1800,
    cor: "#BA4DE3",
  },
  {
    id: "seed_conta_itau_empresa_pj",
    nome: "Itau Empresa",
    tipo: TipoConta.CORRENTE,
    perfil: PerfilConta.PJ,
    instituicao: "Itau",
    saldo: 8500,
    cor: "#EC7000",
    empresaId,
  },
  {
    id: "seed_conta_carteira_pf",
    nome: "Carteira",
    tipo: TipoConta.CAIXA,
    perfil: PerfilConta.PF,
    instituicao: "Dinheiro",
    saldo: 350,
    cor: "#16A34A",
  },
];

const investimentos: InvestimentoSeed[] = [
  {
    id: "seed_invest_tesouro_selic_2027",
    nome: "Tesouro Selic 2027",
    tipo: TipoInvest.TESOURO,
    corretora: "Tesouro Direto",
    quantidade: 1,
    precoMedio: 15000,
    precoAtual: 16875,
    valorInvestido: 15000,
    valorAtual: 16875,
    rentabilidade: 12.5,
    dataAporte: daysAgo(210),
    vencimento: new Date("2027-03-01T12:00:00.000Z"),
    indexador: "SELIC",
    dividendos: 0,
  },
  {
    id: "seed_invest_cdb_nubank_110_cdi",
    nome: "CDB Nubank 110% CDI",
    tipo: TipoInvest.RENDA_FIXA,
    corretora: "Nubank",
    quantidade: 1,
    precoMedio: 8000,
    precoAtual: 8720,
    valorInvestido: 8000,
    valorAtual: 8720,
    rentabilidade: 9,
    dataAporte: daysAgo(120),
    vencimento: monthsFromNow(24),
    indexador: "CDI",
    percentualIndice: 110,
    dividendos: 0,
  },
  {
    id: "seed_invest_mxrf11",
    nome: "MXRF11",
    tipo: TipoInvest.FII,
    corretora: "Rico",
    quantidade: 200,
    precoMedio: 10.5,
    precoAtual: 11.2,
    valorInvestido: 2100,
    valorAtual: 2240,
    rentabilidade: 6.67,
    dataAporte: daysAgo(180),
    dividendos: 156,
  },
  {
    id: "seed_invest_petr4",
    nome: "PETR4",
    tipo: TipoInvest.ACAO,
    corretora: "Rico",
    quantidade: 100,
    precoMedio: 38,
    precoAtual: 41.3,
    valorInvestido: 3800,
    valorAtual: 4130,
    rentabilidade: 8.68,
    dataAporte: daysAgo(150),
    dividendos: 320,
  },
  {
    id: "seed_invest_bitcoin",
    nome: "Bitcoin",
    tipo: TipoInvest.CRIPTO,
    corretora: "Mercado Bitcoin",
    quantidade: 0.05,
    precoMedio: 280000,
    precoAtual: 350000,
    valorInvestido: 14000,
    valorAtual: 17500,
    rentabilidade: 25,
    dataAporte: daysAgo(240),
    dividendos: 0,
  },
];

const metas: MetaSeed[] = [
  {
    id: "seed_meta_reserva_emergencia",
    titulo: "Reserva de Emergencia",
    descricao: "Seis meses de custos pessoais e empresariais essenciais.",
    valorAlvo: 30000,
    valorAtual: 15200,
    prazo: monthsFromNow(12),
    categoria: "Seguranca",
    cor: "#22C55E",
  },
  {
    id: "seed_meta_macbook_m3_pro",
    titulo: "MacBook M3 Pro",
    descricao: "Upgrade de equipamento para projetos de desenvolvimento.",
    valorAlvo: 18000,
    valorAtual: 6400,
    prazo: monthsFromNow(9),
    categoria: "Equipamentos",
    cor: "#38BDF8",
  },
  {
    id: "seed_meta_viagem_europa",
    titulo: "Viagem Europa",
    descricao: "Viagem de ferias planejada para daqui a 18 meses.",
    valorAlvo: 25000,
    valorAtual: 2100,
    prazo: monthsFromNow(18),
    categoria: "Lazer",
    cor: "#F59E0B",
  },
];

const transacaoTemplates: Omit<TransacaoSeed, "id" | "data">[] = [
  {
    descricao: "Salario mensal",
    valor: 7800,
    tipo: TipoTransacao.RECEITA,
    categoria: "Receitas",
    subcategoria: "Salario",
    contaId: "seed_conta_nubank_pf",
    perfil: PerfilConta.PF,
    tags: ["pf", "recorrente"],
    recorrente: true,
  },
  {
    descricao: "Freelance landing page",
    valor: 2200,
    tipo: TipoTransacao.RECEITA,
    categoria: "Receitas",
    subcategoria: "Freelance",
    contaId: "seed_conta_nubank_pf",
    perfil: PerfilConta.PF,
    tags: ["pf", "freelance"],
  },
  {
    descricao: "Rendimentos de investimento",
    valor: 285,
    tipo: TipoTransacao.RECEITA,
    categoria: "Investimentos",
    subcategoria: "Rendimentos",
    contaId: "seed_conta_nubank_pf",
    perfil: PerfilConta.PF,
    tags: ["pf", "investimentos"],
  },
  {
    descricao: "Mercado da semana",
    valor: -420,
    tipo: TipoTransacao.DESPESA,
    categoria: "Alimentacao",
    subcategoria: "Mercado",
    contaId: "seed_conta_nubank_cartao_pf",
    perfil: PerfilConta.PF,
    tags: ["pf", "cartao"],
  },
  {
    descricao: "Aplicativo de transporte",
    valor: -58,
    tipo: TipoTransacao.DESPESA,
    categoria: "Transporte",
    subcategoria: "Aplicativos",
    contaId: "seed_conta_nubank_cartao_pf",
    perfil: PerfilConta.PF,
    tags: ["pf", "mobilidade"],
  },
  {
    descricao: "Aluguel residencial",
    valor: -2100,
    tipo: TipoTransacao.DESPESA,
    categoria: "Moradia",
    subcategoria: "Aluguel",
    contaId: "seed_conta_nubank_pf",
    perfil: PerfilConta.PF,
    tags: ["pf", "recorrente"],
    recorrente: true,
  },
  {
    descricao: "Cinema e jantar",
    valor: -190,
    tipo: TipoTransacao.DESPESA,
    categoria: "Lazer",
    subcategoria: "Entretenimento",
    contaId: "seed_conta_nubank_cartao_pf",
    perfil: PerfilConta.PF,
    tags: ["pf", "lazer"],
  },
  {
    descricao: "Consulta medica",
    valor: -320,
    tipo: TipoTransacao.DESPESA,
    categoria: "Saude",
    subcategoria: "Consultas",
    contaId: "seed_conta_nubank_pf",
    perfil: PerfilConta.PF,
    tags: ["pf", "saude"],
  },
  {
    descricao: "Assinaturas digitais",
    valor: -96,
    tipo: TipoTransacao.DESPESA,
    categoria: "Assinaturas",
    subcategoria: "Streaming e apps",
    contaId: "seed_conta_nubank_cartao_pf",
    perfil: PerfilConta.PF,
    tags: ["pf", "recorrente"],
    recorrente: true,
  },
  {
    descricao: "Projeto desenvolvimento web",
    valor: 6400,
    tipo: TipoTransacao.RECEITA,
    categoria: "Receitas PJ",
    subcategoria: "Projeto web",
    contaId: "seed_conta_itau_empresa_pj",
    perfil: PerfilConta.PJ,
    empresaId,
    tags: ["pj", "projeto"],
  },
  {
    descricao: "Consultoria tecnica",
    valor: 2800,
    tipo: TipoTransacao.RECEITA,
    categoria: "Receitas PJ",
    subcategoria: "Consultoria",
    contaId: "seed_conta_itau_empresa_pj",
    perfil: PerfilConta.PJ,
    empresaId,
    tags: ["pj", "consultoria"],
  },
  {
    descricao: "AWS",
    valor: -340,
    tipo: TipoTransacao.DESPESA,
    categoria: "Infraestrutura",
    subcategoria: "Cloud",
    contaId: "seed_conta_itau_empresa_pj",
    perfil: PerfilConta.PJ,
    empresaId,
    tags: ["pj", "recorrente"],
    recorrente: true,
  },
  {
    descricao: "GitHub Pro",
    valor: -48,
    tipo: TipoTransacao.DESPESA,
    categoria: "Ferramentas",
    subcategoria: "Desenvolvimento",
    contaId: "seed_conta_itau_empresa_pj",
    perfil: PerfilConta.PJ,
    empresaId,
    tags: ["pj", "assinatura"],
    recorrente: true,
  },
  {
    descricao: "Figma",
    valor: -72,
    tipo: TipoTransacao.DESPESA,
    categoria: "Ferramentas",
    subcategoria: "Design",
    contaId: "seed_conta_itau_empresa_pj",
    perfil: PerfilConta.PJ,
    empresaId,
    tags: ["pj", "assinatura"],
    recorrente: true,
  },
  {
    descricao: "Impostos MEI DAS",
    valor: -76.6,
    tipo: TipoTransacao.DESPESA,
    categoria: "Impostos",
    subcategoria: "DAS",
    contaId: "seed_conta_itau_empresa_pj",
    perfil: PerfilConta.PJ,
    empresaId,
    tags: ["pj", "impostos"],
    recorrente: true,
  },
  {
    descricao: "Teclado mecanico",
    valor: -480,
    tipo: TipoTransacao.DESPESA,
    categoria: "Equipamentos",
    subcategoria: "Perifericos",
    contaId: "seed_conta_itau_empresa_pj",
    perfil: PerfilConta.PJ,
    empresaId,
    tags: ["pj", "equipamentos"],
  },
];

const buildTransacoes = () => {
  return Array.from({ length: 60 }, (_, index): TransacaoSeed => {
    const template = transacaoTemplates[index % transacaoTemplates.length];
    const data = daysAgo(2 + index);
    const adjustment = index % 5 === 0 ? 1.08 : index % 3 === 0 ? 0.94 : 1;
    const valor = Number((template.valor * adjustment).toFixed(2));

    return {
      ...template,
      id: `seed_transacao_${String(index + 1).padStart(2, "0")}`,
      descricao:
        index < transacaoTemplates.length
          ? template.descricao
          : `${template.descricao} ${Math.floor(index / transacaoTemplates.length) + 1}`,
      valor,
      data,
      categorizadoPorIA: index % 4 === 0,
    };
  });
};

const seed = async () => {
  const email = requiredEnv("SEED_USER_EMAIL");
  const password = requiredEnv("SEED_USER_PASSWORD");
  const name = requiredEnv("SEED_USER_NAME");
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      emailVerified: true,
    },
    create: {
      id: seedUserId,
      email,
      name,
      emailVerified: true,
    },
  });

  await prisma.account.upsert({
    where: { id: credentialAccountId },
    update: {
      accountId: user.id,
      providerId: "credential",
      userId: user.id,
      password: passwordHash,
    },
    create: {
      id: credentialAccountId,
      accountId: user.id,
      providerId: "credential",
      userId: user.id,
      password: passwordHash,
    },
  });

  await prisma.empresa.upsert({
    where: {
      userId_cnpj: {
        userId: user.id,
        cnpj: "12.345.678/0001-90",
      },
    },
    update: {
      nome: "Dev Freelancer MEI",
      tipo: TipoEmpresa.MEI,
      ativa: true,
    },
    create: {
      id: empresaId,
      nome: "Dev Freelancer MEI",
      cnpj: "12.345.678/0001-90",
      tipo: TipoEmpresa.MEI,
      ativa: true,
      userId: user.id,
    },
  });

  for (const conta of contas) {
    await prisma.conta.upsert({
      where: { id: conta.id },
      update: {
        nome: conta.nome,
        tipo: conta.tipo,
        perfil: conta.perfil,
        instituicao: conta.instituicao,
        saldo: conta.saldo,
        cor: conta.cor,
        ativo: true,
        empresaId: conta.empresaId,
        userId: user.id,
      },
      create: {
        ...conta,
        ativo: true,
        userId: user.id,
      },
    });
  }

  for (const transacao of buildTransacoes()) {
    await prisma.transacao.upsert({
      where: { id: transacao.id },
      update: {
        descricao: transacao.descricao,
        valor: transacao.valor,
        tipo: transacao.tipo,
        categoria: transacao.categoria,
        subcategoria: transacao.subcategoria,
        data: transacao.data,
        competencia: competenciaFromDate(transacao.data),
        contaId: transacao.contaId,
        perfil: transacao.perfil,
        empresaId: transacao.empresaId,
        tags: JSON.stringify(transacao.tags),
        observacao: transacao.observacao,
        recorrente: transacao.recorrente ?? false,
        categorizadoPorIA: transacao.categorizadoPorIA ?? false,
        userId: user.id,
      },
      create: {
        ...transacao,
        competencia: competenciaFromDate(transacao.data),
        tags: JSON.stringify(transacao.tags),
        recorrente: transacao.recorrente ?? false,
        categorizadoPorIA: transacao.categorizadoPorIA ?? false,
        userId: user.id,
      },
    });
  }

  for (const investimento of investimentos) {
    await prisma.investimento.upsert({
      where: { id: investimento.id },
      update: {
        nome: investimento.nome,
        tipo: investimento.tipo,
        corretora: investimento.corretora,
        quantidade: investimento.quantidade,
        precoMedio: investimento.precoMedio,
        precoAtual: investimento.precoAtual,
        valorInvestido: investimento.valorInvestido,
        valorAtual: investimento.valorAtual,
        rentabilidade: investimento.rentabilidade,
        dataAporte: investimento.dataAporte,
        vencimento: investimento.vencimento,
        indexador: investimento.indexador,
        percentualIndice: investimento.percentualIndice,
        dividendos: investimento.dividendos ?? 0,
        userId: user.id,
      },
      create: {
        ...investimento,
        dividendos: investimento.dividendos ?? 0,
        userId: user.id,
      },
    });

    await prisma.aporte.upsert({
      where: { id: `${investimento.id}_aporte_inicial` },
      update: {
        investimentoId: investimento.id,
        valor: investimento.valorInvestido,
        quantidade: investimento.quantidade,
        preco: investimento.precoMedio,
        data: investimento.dataAporte,
        tipo: TipoAporte.COMPRA,
        userId: user.id,
      },
      create: {
        id: `${investimento.id}_aporte_inicial`,
        investimentoId: investimento.id,
        valor: investimento.valorInvestido,
        quantidade: investimento.quantidade,
        preco: investimento.precoMedio,
        data: investimento.dataAporte,
        tipo: TipoAporte.COMPRA,
        userId: user.id,
      },
    });
  }

  for (const meta of metas) {
    await prisma.meta.upsert({
      where: { id: meta.id },
      update: {
        titulo: meta.titulo,
        descricao: meta.descricao,
        valorAlvo: meta.valorAlvo,
        valorAtual: meta.valorAtual,
        prazo: meta.prazo,
        categoria: meta.categoria,
        cor: meta.cor,
        concluida: meta.valorAtual >= meta.valorAlvo,
        userId: user.id,
      },
      create: {
        ...meta,
        concluida: meta.valorAtual >= meta.valorAlvo,
        userId: user.id,
      },
    });
  }

  console.log("Seed do Kwak Finance concluido sem duplicar dados.");
};

void seed()
  .catch((error: unknown) => {
    console.error("Falha ao executar seed do Kwak Finance:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
