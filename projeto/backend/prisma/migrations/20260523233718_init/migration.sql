-- CreateEnum
CREATE TYPE "TipoConta" AS ENUM ('CORRENTE', 'POUPANCA', 'CARTAO', 'INVESTIMENTO', 'CAIXA', 'OUTRO');

-- CreateEnum
CREATE TYPE "PerfilConta" AS ENUM ('PF', 'PJ');

-- CreateEnum
CREATE TYPE "TipoTransacao" AS ENUM ('RECEITA', 'DESPESA', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "TipoInvest" AS ENUM ('ACAO', 'FII', 'RENDA_FIXA', 'CRIPTO', 'FUNDO', 'TESOURO', 'PREVIDENCIA', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoAporte" AS ENUM ('COMPRA', 'VENDA', 'DIVIDENDO', 'RESGATE', 'JUROS');

-- CreateEnum
CREATE TYPE "TipoEmpresa" AS ENUM ('MEI', 'ME', 'EPP', 'LTDA', 'SA', 'AUTONOMO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" TIMESTAMP(3),
    "refresh_token_expires_at" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoConta" NOT NULL,
    "perfil" "PerfilConta" NOT NULL,
    "instituicao" TEXT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cor" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "empresa_id" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacoes" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "tipo" "TipoTransacao" NOT NULL,
    "categoria" TEXT NOT NULL,
    "subcategoria" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "competencia" TIMESTAMP(3) NOT NULL,
    "conta_id" TEXT NOT NULL,
    "perfil" "PerfilConta" NOT NULL,
    "empresa_id" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "observacao" TEXT,
    "recorrente" BOOLEAN NOT NULL DEFAULT false,
    "categorizado_por_ia" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investimentos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoInvest" NOT NULL,
    "corretora" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "preco_medio" DOUBLE PRECISION NOT NULL,
    "preco_atual" DOUBLE PRECISION NOT NULL,
    "valor_investido" DOUBLE PRECISION NOT NULL,
    "valor_atual" DOUBLE PRECISION NOT NULL,
    "rentabilidade" DOUBLE PRECISION NOT NULL,
    "data_aporte" TIMESTAMP(3) NOT NULL,
    "vencimento" TIMESTAMP(3),
    "indexador" TEXT,
    "percentual_indice" DOUBLE PRECISION,
    "dividendos" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aportes" (
    "id" TEXT NOT NULL,
    "investimento_id" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "quantidade" DOUBLE PRECISION,
    "preco" DOUBLE PRECISION NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoAporte" NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aportes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "valor_alvo" DOUBLE PRECISION NOT NULL,
    "valor_atual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "prazo" TIMESTAMP(3) NOT NULL,
    "categoria" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "tipo" "TipoEmpresa" NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "verifications_identifier_idx" ON "verifications"("identifier");

-- CreateIndex
CREATE INDEX "contas_empresa_id_idx" ON "contas"("empresa_id");

-- CreateIndex
CREATE INDEX "contas_user_id_idx" ON "contas"("user_id");

-- CreateIndex
CREATE INDEX "transacoes_conta_id_idx" ON "transacoes"("conta_id");

-- CreateIndex
CREATE INDEX "transacoes_empresa_id_idx" ON "transacoes"("empresa_id");

-- CreateIndex
CREATE INDEX "transacoes_user_id_data_idx" ON "transacoes"("user_id", "data");

-- CreateIndex
CREATE INDEX "transacoes_user_id_competencia_idx" ON "transacoes"("user_id", "competencia");

-- CreateIndex
CREATE INDEX "investimentos_user_id_idx" ON "investimentos"("user_id");

-- CreateIndex
CREATE INDEX "aportes_investimento_id_idx" ON "aportes"("investimento_id");

-- CreateIndex
CREATE INDEX "aportes_user_id_idx" ON "aportes"("user_id");

-- CreateIndex
CREATE INDEX "metas_user_id_idx" ON "metas"("user_id");

-- CreateIndex
CREATE INDEX "empresas_user_id_idx" ON "empresas"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_user_id_cnpj_key" ON "empresas"("user_id", "cnpj");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas" ADD CONSTRAINT "contas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas" ADD CONSTRAINT "contas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes" ADD CONSTRAINT "transacoes_conta_id_fkey" FOREIGN KEY ("conta_id") REFERENCES "contas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes" ADD CONSTRAINT "transacoes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes" ADD CONSTRAINT "transacoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investimentos" ADD CONSTRAINT "investimentos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aportes" ADD CONSTRAINT "aportes_investimento_id_fkey" FOREIGN KEY ("investimento_id") REFERENCES "investimentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aportes" ADD CONSTRAINT "aportes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metas" ADD CONSTRAINT "metas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
