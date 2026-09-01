# PROMPT — Kwak Finance

> **Para agentes de codificação autônomo (OpenAI Codex, Claude Code, etc.)**
> Leia este documento inteiro antes de escrever qualquer código ou executar qualquer comando.

---

## REGRAS DO AGENTE

1. **Leia o `AGENTS.md`** na raiz do projeto antes de qualquer ação. Ele contém o design system, padrões de código e convenções obrigatórias.
2. **Trabalhe em silêncio.** Escreva arquivos, instale dependências e execute comandos sem pedir confirmação a cada etapa. Conclua cada módulo completamente antes de reportar.
3. **Siga a ordem exata das etapas.** Cada etapa depende da anterior.
4. **Nunca reporte conclusão sem verificar os critérios de aceitação** descritos no final deste documento.
5. **Em caso de erro**, corrija antes de avançar. Não deixe erros de TypeScript, Prisma ou ESLint pendentes.

---

## MISSÃO

Construir uma aplicação web local de gestão financeira pessoal e empresarial, integrada com IA (Claude API), cobrindo três domínios:

- **Finanças Pessoais (PF)** — contas, transações, metas, orçamento
- **Finanças Empresariais (MEI/PJ)** — DRE simplificado, fluxo de caixa, CNPJ
- **Investimentos** — carteira, aportes, rentabilidade, alocação

**Stack:** Next.js 14 + TypeScript + PostgreSQL + Prisma + Tailwind CSS + shadcn/ui + Claude API
**Infraestrutura:** Docker Compose (PostgreSQL + aplicação)
**Inicialização recomendada:** `pnpm run docker:up` → app em `http://localhost:3000`

**Nome oficial do produto:** Kwak Finance. Use este nome em UI, README, Docker, seed e documentacao. Referencias antigas a "Finanças 360" devem ser tratadas como legado e substituidas ao tocar no arquivo.

**Docker dedicado:** o Compose deve declarar `name: kwak-finance`; os containeres padrao devem ser `kwak_finance_app` e `kwak_finance_db`; volumes/redes devem usar prefixo `kwak_finance_`.

---

## ETAPA 0 — Pré-requisitos e Estrutura Raiz

Antes de iniciar, verifique se `docker` e `docker compose` estão disponíveis:

```bash
docker --version
docker compose version
```

Crie a estrutura de diretórios raiz:

```
projeto/
├── docker-compose.yml
├── docker-compose.override.yml   # overrides de dev (hot reload, volumes)
├── Dockerfile
├── .env                          # variáveis para docker compose
├── .dockerignore
├── AGENTS.md
├── README.md
├── package.json
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
└── frontend/
    └── src/
```

Backend e frontend devem permanecer separados:

- `backend/` concentra Prisma, autenticacao, validacao, regras de dominio, APIs e integracoes externas.
- `frontend/` concentra Next.js App Router, paginas, layouts, componentes, estado de UI e chamadas ao backend.
- Componentes React nao devem importar Prisma, SDKs de IA, variaveis secretas ou servicos de persistencia.

---

## ETAPA 1 — Docker

### `docker-compose.yml`

```yaml
name: kwak-finance

services:
  db:
    image: postgres:16-alpine
    container_name: kwak_finance_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: kwak_finance
      POSTGRES_PASSWORD: kwakfinancepass
      POSTGRES_DB: kwak_finance
    ports:
      - "5432:5432"
    volumes:
      - kwak_finance_postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U kwak_finance"]
      interval: 5s
      timeout: 5s
      retries: 10

  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    container_name: kwak_finance_app
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    env_file:
      - .env
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    command: sh -c "corepack enable && pnpm exec prisma migrate deploy && pnpm exec prisma db seed && pnpm run dev"

volumes:
  kwak_finance_postgres_data:
```

### `docker-compose.override.yml`

```yaml
# Overrides aplicados automaticamente em dev — não commitar dados sensíveis aqui
version: "3.9"

services:
  app:
    environment:
      - NODE_ENV=development
```

### `Dockerfile`

```dockerfile
# ─── Base ────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable

# ─── Dependencies ────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ─── Development ─────────────────────────────────────────────────────────────
FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED 1

# ─── Builder ─────────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm exec prisma generate
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm run build

# ─── Production ──────────────────────────────────────────────────────────────
FROM base AS production
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
CMD ["node", "server.js"]
```

### `.dockerignore`

```
node_modules
.next
.git
*.log
dist
coverage
```

### `.env` (variáveis do Docker Compose)

```env
# PostgreSQL
DATABASE_URL="postgresql://kwak_finance:kwakfinancepass@db:5432/kwak_finance"

# Better Auth
BETTER_AUTH_SECRET="kwak-finance-secret-local-dev-change-in-production"
BETTER_AUTH_URL="http://localhost:3000"

# Anthropic
ANTHROPIC_API_KEY=""

# Seed
SEED_USER_EMAIL="admin@kwakfinance.local"
SEED_USER_PASSWORD="admin123"
SEED_USER_NAME="Administrador"
```

> **Nota:** `.env` é o único arquivo de ambiente para desenvolvimento local e Docker Compose. Localmente, `DATABASE_URL` aponta para `localhost:5433`; o Compose sobrescreve apenas a URL da aplicação para usar `db:5432`.

---

## ETAPA 2 — Fundação do Projeto Next.js

```bash
pnpm dlx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git
```

> Execute dentro do diretório `projeto/` já criado. O app Next.js deve ficar em `frontend/`; o backend permanece em `backend/`.

Instale as dependências:

```bash
pnpm add \
  prisma @prisma/client better-auth \
  @anthropic-ai/sdk \
  react-hook-form @hookform/resolvers zod \
  recharts \
  lucide-react \
  date-fns \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-select @radix-ui/react-alert-dialog \
  @radix-ui/react-progress @radix-ui/react-tabs \
  @radix-ui/react-popover @radix-ui/react-tooltip \
  sonner \
  clsx tailwind-merge \
  class-variance-authority \
  react-dropzone

pnpm add -D @types/node ts-node tsx
```

Inicialize o Prisma com PostgreSQL:

```bash
pnpm exec prisma init --datasource-provider postgresql
```

---

## ETAPA 3 — Schema do Banco (PostgreSQL)

Escreva `backend/prisma/schema.prisma` completo com os seguintes modelos. Use `@map` e `@@map` para nomear tabelas em snake_case. Todos os campos de data devem ser `DateTime @default(now())` onde aplicável.

**Enums:**

```prisma
enum TipoConta     { CORRENTE POUPANCA CARTAO INVESTIMENTO CAIXA OUTRO }
enum PerfilConta   { PF PJ }
enum TipoTransacao { RECEITA DESPESA TRANSFERENCIA }
enum TipoInvest    { ACAO FII RENDA_FIXA CRIPTO FUNDO TESOURO PREVIDENCIA OUTRO }
enum TipoAporte    { COMPRA VENDA DIVIDENDO RESGATE JUROS }
enum TipoEmpresa   { MEI ME EPP LTDA SA AUTONOMO }
```

**Modelos:**

| Modelo         | Campos-chave                                                                                                                                                                                                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `User`         | id, email (unique), name, password, createdAt, relações                                                                                                                                                                                                                       |
| `Conta`        | id, nome, tipo, perfil, instituicao, saldo (Float, default 0), cor, ativo, empresaId?, userId, timestamps                                                                                                                                                                     |
| `Transacao`    | id, descricao, valor (Float — positivo=receita, negativo=despesa), tipo, categoria, subcategoria?, data, competencia, contaId, perfil, empresaId?, tags (String — JSON array), observacao?, recorrente (default false), categorizadoPorIA (default false), userId, timestamps |
| `Investimento` | id, nome, tipo, corretora, quantidade, precoMedio, precoAtual, valorInvestido, valorAtual, rentabilidade, dataAporte, vencimento?, indexador?, percentualIndice?, dividendos (default 0), userId, aportes Aporte[], timestamps                                                |
| `Aporte`       | id, investimentoId, valor, quantidade?, preco, data, tipo, createdAt                                                                                                                                                                                                          |
| `Meta`         | id, titulo, descricao?, valorAlvo, valorAtual (default 0), prazo, categoria, cor, concluida (default false), userId, timestamps                                                                                                                                               |
| `Empresa`      | id, nome, cnpj, tipo, ativa (default true), userId, contas Conta[], transacoes Transacao[], timestamps                                                                                                                                                                        |

Após escrever o schema, **não execute `prisma db push` ainda** — a migration será feita pelo container Docker. Para desenvolvimento local fora do Docker:

```bash
# Apenas se rodando fora do Docker:
pnpm exec prisma migrate dev --name init
pnpm exec prisma generate
```

---

## ETAPA 4 — Migrations e Seed

Crie a migration inicial:

```bash
pnpm exec prisma migrate dev --name init --skip-seed
```

**`backend/prisma/seed.ts`** — dados realistas para um MEI brasileiro:

- **Usuário:** credenciais do `.env`
- **Contas (4):**
  - Nubank Conta (PF, CORRENTE, ~R$ 4.200)
  - Nubank Cartão (PF, CARTAO, ~R$ -1.800)
  - Itaú Empresa (PJ, CORRENTE, ~R$ 8.500)
  - Carteira (PF, CAIXA, ~R$ 350)
- **Empresa:** "Dev Freelancer MEI", CNPJ: "12.345.678/0001-90", tipo MEI
- **Transações (60, últimos 3 meses):**
  - PF receitas: salário, freelance, rendimentos de investimento
  - PF despesas: alimentação, transporte, moradia, lazer, saúde, assinaturas (Netflix, Spotify, etc.)
  - PJ receitas: projetos de desenvolvimento web, consultorias
  - PJ despesas: AWS, GitHub Pro, Figma, impostos MEI DAS, equipamentos
- **Investimentos (5):**
  - Tesouro Selic 2027 — R$ 15.000 investidos, rentabilidade ~12,5%
  - CDB Nubank 110% CDI — R$ 8.000, vencimento 2 anos
  - MXRF11 — 200 cotas, preço médio R$ 10,50, preço atual R$ 11,20
  - PETR4 — 100 cotas, preço médio R$ 38,00, preço atual R$ 41,30
  - Bitcoin — 0,05 BTC, preço médio R$ 280.000, preço atual R$ 350.000
- **Metas (3):**
  - Reserva de Emergência: alvo R$ 30.000, atual R$ 15.200
  - MacBook M3 Pro: alvo R$ 18.000, atual R$ 6.400
  - Viagem Europa: alvo R$ 25.000, atual R$ 2.100, prazo 18 meses

O seed deve ser **idempotente** — verificar se dados já existem antes de inserir (use `upsert` onde possível).

---

## ETAPA 5 — Configurações Base

**`backend/src/lib/prisma.ts`** — singleton do PrismaClient com hot-reload seguro para Next.js (verificar `global.__prisma`).

**`backend/src/lib/auth.ts`** — Better Auth com email e senha:

- Usar Prisma adapter com provider `postgresql`
- Habilitar `emailAndPassword`
- Validar variáveis de ambiente e credenciais com Zod
- Exportar `auth` e helper `getSession(headers)` para Server Components e route handlers

**`backend/src/lib/claude.ts`** — wrapper da Anthropic SDK:

```typescript
// Funções a implementar:
export async function callClaude(
  prompt: string,
  systemPrompt?: string,
): Promise<string>;
export async function categorizarTransacoes(
  transacoes: TransacaoBruta[],
): Promise<CategorizacaoResult[]>;
export async function gerarInsights(
  dados: DadosFinanceiros,
): Promise<Insight[]>;
```

- Usar `claude-3-5-haiku-20241022` para categorização (rápido, barato)
- Usar `claude-3-5-sonnet-20241022` para insights (mais elaborado)
- Tratar `ANTHROPIC_API_KEY` ausente com graceful degradation (retornar array vazio sem lançar erro)
- Timeout de 30s com `AbortController`

**`src/lib/utils.ts`:**

```typescript
export function cn(...inputs: ClassValue[]): string; // clsx + twMerge
export function formatCurrency(value: number): string; // R$ 1.234,56
export function formatDate(date: Date | string): string; // dd/MM/yyyy
export function formatPercent(value: number, digits?: number): string;
export function calcularVariacao(atual: number, anterior: number): number;
export function gerarCorAleatoria(): string; // hex
export function parseCSVNubank(csvText: string): TransacaoBruta[];
export function slugify(str: string): string;
```

**`backend/src/types/financas.ts`** — exportar todos os tipos do domínio. Incluir no mínimo:

```typescript
(ContaComSaldo,
  TransacaoComConta,
  InvestimentoComAportes,
  DashboardResumo,
  FluxoCaixaMensal,
  Insight,
  InsightTipo,
  CategorizacaoResult,
  DadosFinanceiros,
  TransacaoBruta,
  FiltrosTransacao,
  PaginacaoParams,
  PaginacaoResult<T>);
```

---

## ETAPA 6 — Layout Base

**`src/app/layout.tsx`:**

- Importar fontes via `next/font/google`: `Sora` (display, pesos 400/600/700) + `DM Sans` (body, pesos 400/500)
- Aplicar variáveis CSS `--font-sora` e `--font-dm-sans`
- `<Toaster />` do Sonner com `position="bottom-right"`
- `<SessionProvider />`
- Metadata: título, descrição, viewport

**`src/app/(auth)/login/page.tsx`:**

- Verificar sessão no servidor — redirect para `/dashboard` se autenticado
- Design dark premium com gradiente sutil no background
- Logo + nome do produto
- Form com `react-hook-form` + Zod (email obrigatório, senha mínimo 6 caracteres)
- Chamada ao cliente Better Auth com email e senha
- Tratamento de erro com toast
- Ícone de show/hide password

**`src/components/layout/Sidebar.tsx`:**

- Largura fixa 240px desktop, overlay em mobile
- Logo "Kwak Finance" com ícone
- Grupos de navegação com labels de seção:
  - **VISÃO GERAL:** Dashboard
  - **FINANÇAS:** Contas, Transações, Metas
  - **EMPRESARIAL:** Painel Empresarial (com seletor de empresa)
  - **PATRIMÔNIO:** Investimentos
  - **SISTEMA:** Configurações
- Item ativo com highlight via CSS variable `--accent-blue`
- Avatar + nome do usuário + botão logout no rodapé
- Hamburger menu em mobile com `useState` para abrir/fechar

**`src/components/layout/Header.tsx`:**

- Título da página atual (via `usePathname`)
- Seletor de período: Mês Atual / Mês Anterior / Trimestre / Ano / Customizado (date range picker)
- Seletor de perfil: Todos / PF / PJ
- Botão de notificações com badge numérico

**`src/app/(app)/layout.tsx`:**

- `getServerSession` — redirect para `/login` se não autenticado
- Renderiza `<Sidebar />` + `<Header />` + `<main>{children}</main>`
- Passar período e perfil como searchParams para as páginas filhas

---

## ETAPA 7 — API Routes

Crie todas as rotas em `backend/src/`. Padrões obrigatórios em todas:

1. Verificar sessão com `getServerSession` — retornar 401 se não autenticado
2. Sempre filtrar por `userId` — nunca expor dados de outros usuários
3. Validar body com Zod — retornar 400 com mensagens descritivas em caso de erro
4. Tratar erros do Prisma — retornar 409 para conflitos, 404 para not found
5. Respostas sempre em JSON com estrutura `{ data, meta? }` para sucesso

| Rota                              | Métodos          | Observações                                                                                                             |
| --------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/api/contas`                     | GET, POST        | GET lista com saldo calculado; POST valida tipo e perfil                                                                |
| `/api/contas/[id]`                | GET, PUT, DELETE | DELETE: verificar se há transações vinculadas                                                                           |
| `/api/transacoes`                 | GET, POST        | GET: filtros via searchParams (startDate, endDate, tipo, categoria, contaId, perfil, search, page, limit) com paginação |
| `/api/transacoes/[id]`            | GET, PUT, DELETE | —                                                                                                                       |
| `/api/transacoes/import-csv`      | POST             | Recebe array de `TransacaoBruta[]`, deduplica por (data+valor+descrição), salva em batch                                |
| `/api/transacoes/categorizar-ia`  | POST             | Recebe `ids[]`, busca transações, chama `categorizarTransacoes`, atualiza no banco, retorna resultado                   |
| `/api/investimentos`              | GET, POST        | —                                                                                                                       |
| `/api/investimentos/[id]`         | GET, PUT, DELETE | —                                                                                                                       |
| `/api/investimentos/[id]/aportes` | GET, POST        | POST recalcula `precoMedio` e `valorInvestido` após aporte                                                              |
| `/api/metas`                      | GET, POST        | —                                                                                                                       |
| `/api/metas/[id]`                 | GET, PUT, DELETE | —                                                                                                                       |
| `/api/empresas`                   | GET, POST        | —                                                                                                                       |
| `/api/empresas/[id]`              | GET, PUT, DELETE | —                                                                                                                       |
| `/api/dashboard/resumo`           | GET              | Retorna todos os KPIs calculados do período selecionado                                                                 |
| `/api/dashboard/evolucao`         | GET              | Patrimônio por mês dos últimos 12 meses                                                                                 |
| `/api/ai/insights`                | GET              | Agrega dados financeiros do período e chama `gerarInsights`                                                             |

---

## ETAPA 8 — Dashboard (`/dashboard`)

**`src/app/(app)/dashboard/page.tsx`** — Server Component:

- Lê `searchParams` para período e perfil
- Faz `fetch` paralelo para `/api/dashboard/resumo` e `/api/dashboard/evolucao`
- Passa dados aos Client Components via props

**Componentes em `src/components/dashboard/`:**

| Componente                    | Descrição                                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `KPICard.tsx`                 | Título, valor formatado, variação % vs mês anterior (seta verde/vermelha), ícone lucide, cor de destaque via prop                    |
| `PatrimonioCard.tsx`          | KPI de patrimônio líquido (contas + investimentos − dívidas) com destaque visual                                                     |
| `FluxoCaixaChart.tsx`         | `BarChart` do Recharts — receitas vs despesas agrupadas por mês, últimos 6 meses                                                     |
| `EvolucaoPatrimonioChart.tsx` | `AreaChart` do Recharts — patrimônio total por mês, 12 meses, com gradiente preenchido                                               |
| `CategoriasDespesaChart.tsx`  | `PieChart` (donut) — top 6 categorias de despesa do mês com legenda                                                                  |
| `InsightCard.tsx`             | Lista de insights da IA com ícone por tipo (⚠️ alerta, 💡 oportunidade, ✅ positivo), loading skeleton, carregamento via `useEffect` |
| `AlertasCard.tsx`             | Contas a vencer em 7 dias, metas com prazo próximo, gastos acima da média histórica                                                  |

Layout: grid 4 colunas para KPIs → 2 colunas (gráficos | insights+alertas) → 3 colunas para gráficos secundários.

---

## ETAPA 9 — Módulo de Contas (`/contas`)

- Resumo de totais no topo: Total em Conta Corrente, Total Poupança, Total Cartão (dívida), Patrimônio em Conta
- Grid de cards com cor customizável, ícone por tipo, saldo, badge PF/PJ
- Badge "Conta inativa" para contas com `ativo: false`
- Botão "Nova Conta" → modal com todos os campos (react-hook-form + Zod)
- Editar/Excluir via menu dropdown (três pontos) em cada card
- Botão "Lançar Transação" em cada card → abre modal de transação com `contaId` pré-preenchido

---

## ETAPA 10 — Módulo de Transações (`/transacoes`)

**Filtros (todos simultâneos):**

- Date range picker (período)
- Tipo (RECEITA / DESPESA / TRANSFERENCIA)
- Categoria (multi-select com checkboxes)
- Conta (select)
- Perfil (PF / PJ / Todos)
- Busca textual (debounce 300ms)

**Tabela paginada (20 itens/página):**

- Colunas: Data, Descrição, Categoria (badge colorido), Conta, Valor (verde/vermelho), Ações
- Clique na categoria → edição inline com select de categorias
- Linhas com `categorizadoPorIA: true` exibem ícone ✨

**Import CSV:**

1. Dropzone para `.csv`
2. Preview das primeiras 5 linhas (tabela)
3. Detecção automática de formato Nubank (campo `Descrição`, `Valor`, `Data`) — pula etapa de mapeamento
4. Mapeamento manual de colunas para outros formatos
5. Botão "Importar" → POST `/api/transacoes/import-csv`
6. Botão "Categorizar com IA" → POST `/api/transacoes/categorizar-ia` com progresso animado
7. Toast de conclusão com contagem de importadas vs duplicatas ignoradas

---

## ETAPA 11 — Módulo de Investimentos (`/investimentos`)

**KPIs no topo (3 cards):**

- Total Investido
- Valor Atual (com variação absoluta)
- Rentabilidade Total (R$ e %)

**Tabela de posições:**

| Coluna          | Formato                 |
| --------------- | ----------------------- |
| Nome            | Texto                   |
| Tipo            | Badge colorido por tipo |
| Corretora       | Texto                   |
| Qtd             | Número                  |
| Preço Médio     | R$                      |
| Preço Atual     | R$                      |
| Valor Investido | R$                      |
| Valor Atual     | R$ com variação         |
| P&L             | R$ e % (verde/vermelho) |
| % Carteira      | Barra de progresso      |

**Gráficos (lado a lado):**

- Donut de alocação por tipo
- Linha de rentabilidade acumulada mensal

**Modais:**

- Cadastrar posição (campos condicionais por tipo: renda fixa mostra taxa/indexador/vencimento; ações mostra quantidade/preço médio)
- Histórico de aportes (tabela + `BarChart` de valor por data, com totalizadores)

---

## ETAPA 12 — Módulo Empresarial (`/empresarial`)

**Seletor de empresa** no header (se houver mais de uma empresa cadastrada).

**KPIs do mês:** Receita Bruta, Despesas Totais, Lucro Líquido, Margem Líquida %

**DRE Simplificado** (accordion):

- Receita Bruta
- (−) Deduções / Impostos
- = Receita Líquida
- (−) Custos Operacionais
- = EBITDA
- (−) Depreciação / Amortização
- = EBIT
- (−) Impostos sobre Lucro
- = **Lucro Líquido**

**Gráficos:**

- Faturamento mensal — últimos 12 meses (BarChart)
- Receitas vs Despesas — barras agrupadas por mês

**Tabela de transações PJ** — usa o mesmo componente de `/transacoes` com filtro `perfil=PJ` e empresa pré-selecionada.

---

## ETAPA 13 — Módulo de Metas (`/metas`)

**Grid de cards** com:

- Título e ícone de categoria
- Barra de progresso colorida: verde (>75%), amarela (25–75%), vermelha (<25%)
- `R$ valorAtual / R$ valorAlvo` formatado
- Dias restantes (ou "Prazo encerrado" se vencida)
- Projeção: "No ritmo atual, conclui em X meses" (cálculo: valorAlvo / (valorAtual / meses_passados))
- Badge de status: **Em andamento** / **Concluída** / **Atrasada**
- Botão "Registrar aporte" → modal para adicionar valor à meta

**Modal criar meta:** todos os campos + seletor de cor + seletor de ícone.

---

## ETAPA 14 — Configurações (`/configuracoes`)

Tabs com `@radix-ui/react-tabs`:

| Tab             | Conteúdo                                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Perfil**      | Nome, email, alterar senha (form separado com senha atual)                                                       |
| **Empresas**    | Lista de empresas com CRUD completo (modal criar/editar)                                                         |
| **Categorias**  | Lista editável de categorias e subcategorias (adicionar, renomear, excluir, reordenar)                           |
| **Integrações** | Campo `ANTHROPIC_API_KEY` (input password), botão "Testar conexão" que faz POST para `/api/ai/test`              |
| **Dados**       | Exportar JSON completo (GET `/api/export`), importar backup (upload JSON), botão "Resetar banco" com confirmação |

---

## ETAPA 15 — Scripts e `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "tsx backend/prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset --force && pnpm run db:seed",
    "docker:up": "docker compose up --build",
    "docker:up:detached": "docker compose up --build -d",
    "docker:down": "docker compose down",
    "docker:down:volumes": "docker compose down -v",
    "docker:logs": "docker compose logs -f app",
    "docker:db:logs": "docker compose logs -f db",
    "docker:db:studio": "docker compose exec app pnpm exec prisma studio",
    "docker:shell": "docker compose exec app sh",
    "docker:seed": "docker compose exec app pnpm exec tsx backend/prisma/seed.ts",
    "docker:reset": "docker compose down -v && docker compose up --build -d",
    "setup": "pnpm install && pnpm run db:generate && pnpm run db:migrate && pnpm run db:seed"
  }
}
```

---

## ETAPA 16 — README.md

O README deve cobrir:

### Quick Start (Docker — recomendado)

```bash
# 1. Clone e entre no diretório
git clone <repo> && cd projeto

# 2. Configure a API Key da Anthropic (opcional — app funciona sem ela)
echo 'ANTHROPIC_API_KEY=sk-ant-...' >> .env

# 3. Suba tudo
pnpm run docker:up

# 4. Acesse
# http://localhost:3000
# Login: admin@kwakfinance.local / admin123
```

### Quick Start (Local, sem Docker)

```bash
# Requer: Node 20+, PostgreSQL 15+ rodando localmente
# Configure DATABASE_URL no .env para apontar para localhost:5433
pnpm install
pnpm exec prisma migrate dev --name init
pnpm run db:seed
pnpm run dev
```

### Comandos úteis

| Comando                    | Descrição                       |
| -------------------------- | ------------------------------- |
| `pnpm run docker:up`        | Sobe tudo com build             |
| `pnpm run docker:down`      | Para os containers              |
| `pnpm run docker:reset`     | Apaga volumes e recria do zero  |
| `pnpm run docker:db:studio` | Abre Prisma Studio no container |
| `pnpm run docker:logs`      | Logs da aplicação em tempo real |

### Módulos disponíveis

| Módulo        | Rota             | Descrição                                 |
| ------------- | ---------------- | ----------------------------------------- |
| Dashboard     | `/dashboard`     | KPIs, gráficos e insights da IA           |
| Contas        | `/contas`        | Gestão de contas bancárias                |
| Transações    | `/transacoes`    | Lançamentos, import CSV, categorização IA |
| Investimentos | `/investimentos` | Carteira, aportes, rentabilidade          |
| Empresarial   | `/empresarial`   | DRE, fluxo de caixa PJ                    |
| Metas         | `/metas`         | Objetivos financeiros com progresso       |
| Configurações | `/configuracoes` | Perfil, empresas, categorias, API keys    |

---

## CRITÉRIOS DE ACEITAÇÃO

O projeto está concluído **somente quando todos os itens abaixo passarem**:

| #   | Critério                                                       | Como verificar                                                                     |
| --- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | `pnpm run docker:up` executa sem erros                         | Terminal não exibe erros após build                                                |
| 2   | App disponível em `http://localhost:3000`                      | Página de login carrega                                                            |
| 3   | Login funciona                                                 | `admin@kwakfinance.local` / `admin123` autentica e redireciona para `/dashboard`   |
| 4   | Dashboard exibe dados reais                                    | KPIs mostram valores calculados a partir do seed (não zeros)                       |
| 5   | Módulo de Contas funciona                                      | 4 contas do seed aparecem, modal criar/editar abre e salva                         |
| 6   | Import CSV Nubank funciona                                     | Upload de `.csv` no formato Nubank importa transações corretamente                 |
| 7   | Categorização por IA funciona                                  | Com `ANTHROPIC_API_KEY` configurada, botão "Categorizar com IA" retorna categorias |
| 8   | Módulo Empresarial exibe DRE                                   | Dados da empresa "Dev Freelancer MEI" aparecem com DRE calculado                   |
| 9   | Módulo de Investimentos exibe carteira                         | 5 posições do seed com P&L calculado                                               |
| 10  | Sem erros de TypeScript                                        | `pnpm run typecheck` passa sem erros                                               |
| 11  | Sem erros de console no browser                                | DevTools → Console sem erros em vermelho nas páginas principais                    |
| 12  | `pnpm run docker:reset` funciona                               | Reset completo recria volume, aplica migrations e reexecuta seed                   |

**Não reporte conclusão antes de verificar todos os 12 critérios.**
