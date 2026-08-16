-- CreateTable
CREATE TABLE "configuracoes_usuario" (
    "id" TEXT NOT NULL,
    "moeda" TEXT NOT NULL DEFAULT 'BRL',
    "perfil_padrao" "PerfilConta" NOT NULL DEFAULT 'PF',
    "notificacoes" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "subcategoria" TEXT,
    "cor" TEXT NOT NULL DEFAULT '#38BDF8',
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_usuario_user_id_key" ON "configuracoes_usuario"("user_id");

-- CreateIndex
CREATE INDEX "categorias_user_id_ordem_idx" ON "categorias"("user_id", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_user_id_nome_subcategoria_key" ON "categorias"("user_id", "nome", "subcategoria");

-- AddForeignKey
ALTER TABLE "configuracoes_usuario" ADD CONSTRAINT "configuracoes_usuario_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
