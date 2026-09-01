Task 02 — Continuação da Implementação (Kwak Finance)

Versão consolidada — une as duas propostas de retomada recebidas em um único plano.

Nota sobre esta versão

Este documento substitui os dois planos de retomada enviados, que cobriam o mesmo trabalho pendente com estruturas diferentes:

"Tasks 02 a 06 (retomada)" dividia o trabalho em 5 tasks sequenciais.
"Task 02 — Continuação da Implementação" tratava o mesmo escopo como uma única task de continuação, em 16 fases, com um retrato mais preciso do estado atual do projeto e regras explícitas contra retrabalho.

A estrutura em fases foi usada como espinha dorsal — é a mais adequada para um agente retomando um trabalho interrompido por limite de uso, sem cortes artificiais de sessão. Nela foram incorporados os pontos que só apareciam no primeiro documento: os dois bugs de investigação em aberto (shell no Windows, variáveis de fonte), o checklist de contratos de API, a pendência da pasta task/ legada com credenciais antigas, e a contagem de nove critérios de aceite em AGENTS.md.

Divergência não resolvida: os documentos de origem chamam o projeto de "Kwak Finance" em um lugar e "Financas 360" em outro (referência à Task 01, não incluída aqui). Confirmar o nome real em AGENTS.md/README.md/package.json antes de prosseguir — este documento usa "Kwak Finance" por ser o nome mais recorrente nas fontes.

Objetivo

Continuar a implementação do Kwak Finance exatamente do ponto em que o agente anterior parou, concluindo o plano de correção até que o projeto esteja funcional e todos os critérios de aceite do AGENTS.md sejam atendidos.

Não reiniciar o projeto. Não refazer a auditoria inicial. Não reverter alterações já realizadas.

Contexto — estado atual do projeto (não repetir)

O agente anterior já executou:

stack atualizada para Node 24;
pnpm atualizado para 11.16;
Next.js atualizado para 16;
React atualizado para 19;
TypeScript atualizado para 5.9;
Prisma atualizado para 7;
AI SDK atualizado para 7;
@ai-sdk/google atualizado;
Docker atualizado para Node 24 — porém só a imagem-base do Dockerfile foi trocada; o Compose ainda não foi confirmado contra a stack nova (ver Fase 3);
prisma.config.ts criado;
Prisma 7 usando adapter PostgreSQL;
typecheck do backend e frontend executado com sucesso;
dashboard começou a consumir APIs reais (DashboardContent criado; /api/dashboard/resumo e /api/dashboard/evolucao conectados);
páginas de Contas, Transações, Investimentos, Empresarial, Metas e Configurações começaram a consumir endpoints reais;
componente ResourceList (somente leitura) criado — etapa intermediária proposital, não a entrega final; não é uma pendência em si, apenas o que deve ser substituído nas Fases 6-11;
arquivos temporários removidos/ignorados;
frontend/eslint.config.mjs criado (flat config, eslint-config-next/core-web-vitals + /typescript), depois que a config antiga quebrou com ESLint 9 — mas nunca teve uma rodada confirmadamente limpa desde então;
build do Next.js 16 chegou a ser executado, mas foi cortado no meio de uma investigação sobre --font-dm-sans e --font-sora (globals.css vs. carregamento de fontes em layout.tsx/next.config.mjs) — ainda não se sabe se é erro real ou apenas warning;
interrompido por limite de uso antes de concluir implementação e validação.

Pendência adicional conhecida, ainda não confirmada nesta sessão: erros de shell no Windows (ex.: "... foi inesperado neste momento") ao rodar comandos que tocam frontend/src/app/(app)/configuracoes/page.tsx, possivelmente pelos parênteses da rota (app)/configuracoes mal interpretados por um wrapper .cmd. Se persistir, ajustar a forma de invocar os comandos — não renomear a rota.

Regra principal

NÃO COMEÇAR NOVAMENTE.

Antes de modificar qualquer coisa:

leia AGENTS.md;
leia .codex/tasks.md;
consulte o git status;
examine as alterações já realizadas;
identifique exatamente quais tarefas já foram concluídas;
continue a partir delas.

Preserve as alterações locais existentes. Não faça git reset, não descarte mudanças e não substitua implementações existentes sem necessidade.

Arquivos

Ler antes de qualquer alteração:

text
AGENTS.md
.codex/tasks.md
package.json
backend/package.json
frontend/package.json

Examinar alterações já realizadas em:

text
frontend/src/app/(app)/
frontend/src/app/globals.css
frontend/src/app/layout.tsx
frontend/eslint.config.mjs
next.config.mjs
frontend/src/components/dashboard/
frontend/src/components/layout/
backend/src/
backend/prisma/
prisma.config.ts
Dockerfile
docker-compose.yml
docker-compose.override.yml
Fase 1 — Verificar o estado atual
powershell
git status --short
git diff --stat
git diff
node --version
pnpm --version
 Ler AGENTS.md, .codex/tasks.md, package.json, backend/package.json, frontend/package.json
 Examinar os diretórios listados acima
 Não alterar nada ainda — apenas entender o estado atual
Fase 2 — Corrigir as validações
powershell
pnpm run typecheck
pnpm run lint
pnpm run format:check
pnpm run test
pnpm run build

Se algum comando falhar:

 identificar a causa
 corrigir somente o necessário
 executar novamente
 não ignorar erros
 não desabilitar regras de lint/teste apenas para o comando passar

Pontos específicos herdados da sessão anterior, a confirmar nesta fase:

 eslint . roda limpo no frontend — a config já existe (frontend/eslint.config.mjs), mas nunca foi confirmada limpa desde a migração para ESLint 9/Next 16
 erro de shell no Windows em comandos que tocam configuracoes/page.tsx: confirmar se ainda ocorre; se sim, corrigir a forma de invocar o comando, não a rota
 next build do zero: determinar se a pendência de --font-dm-sans/--font-sora é erro real ou apenas warning
 pnpm run db e pnpm run format confirmados funcionando
 bateria completa (typecheck + lint + format:check + test + build) verde numa mesma rodada, de ponta a ponta — nunca foi confirmada antes
Fase 3 — Validar Prisma e Docker Compose
powershell
pnpm run db:generate

Verificar:

 schema
 migrations
 seed
 prisma.config.ts
 DATABASE_URL
 adapter PostgreSQL
 compatibilidade com PostgreSQL 16

Não criar migrations desnecessárias. Se houver alteração de schema necessária, seguir a arquitetura existente.

Docker Compose vs. stack nova — o Dockerfile só teve a imagem-base trocada até agora:

 confirmar se docker-compose.yml/docker-compose.override.yml já refletem Postgres 16, porta 5433, e nomes/volumes exclusivos do projeto
Fase 4 — Contratos das APIs existentes

Validar e completar os contratos das APIs já existentes antes de expandir a UI (Fases 6-11 dependem disto).

Endpoints: /api/contas, /api/transacoes, /api/investimentos, /api/empresas, /api/metas, /api/dashboard/resumo, /api/dashboard/evolucao, e a camada de acesso a dados no backend.

 ownership: cada endpoint só lê/escreve dados do usuário autenticado
 validação de entrada com Zod em todos os endpoints
 datas tratadas com Day.js de forma consistente
 ordenação consistente nas listagens
 tratamento de erros consistente (formato padronizado)
 respostas seguras — nenhum dado de outro usuário deve vazar
Fase 5 — Finalizar Dashboard

O dashboard já foi parcialmente conectado às APIs. Não voltar para KPIs estáticos. Verificar endpoints existentes no backend antes de criar novos.

Dados reais para:

 receita
 despesas
 saldo
 patrimônio
 fluxo de caixa
 evolução patrimonial
 categorias
 alertas
 insights de IA (quando disponíveis)

Implementar corretamente:

 loading state
 empty state
 error state
 estados de dados inválidos
 responsividade
 acessibilidade básica
 tratamento de erros HTTP
 atualização dos dados quando necessário

Não inventar dados financeiros no frontend. Toda informação vem do backend.

Fase 6 — Finalizar Contas

A tela atual usa o ResourceList (somente leitura) — transformar em tela funcional completa.

 listagem
 criação
 edição
 exclusão (quando permitido pela regra de negócio)
 formulário
 validação Zod
 React Hook Form
 shadcn/ui
 loading state
 empty state
 error state
 confirmação de ações destrutivas
 feedback de sucesso/erro

Procurar endpoints/serviços existentes antes de criar novos. Regras de negócio permanecem no backend. Uma tabela genérica conectada ao endpoint não conta como CRUD concluído.

Fase 7 — Finalizar Transações
 listagem
 filtros
 busca
 ordenação
 criação
 edição
 exclusão conforme regras
 categorias
 contas
 receitas
 despesas
 paginação (se a API suportar)
 loading / error / empty state
Importação CSV Nubank
text
Selecionar arquivo
        ↓
Validar CSV
        ↓
Pré-visualizar registros
        ↓
Categorizar/classificar
        ↓
Confirmar importação
        ↓
Enviar para backend
        ↓
Persistir
        ↓
Atualizar dashboard

Não aplicar alterações financeiras sem confirmação explícita do usuário.

Fase 8 — Investimentos

Verificar primeiro o domínio e os endpoints existentes.

 posições
 aportes
 patrimônio investido
 rentabilidade
 alocação
 evolução
 detalhes dos ativos

Não inventar regras financeiras. Utilizar somente o domínio já definido pelo projeto.

Fase 9 — Metas
 listagem
 criação
 edição
 exclusão
 progresso
 valor alvo
 valor atual
 prazo
 acompanhamento

Utilizar: React Hook Form, Zod, shadcn/ui, APIs reais.

Fase 10 — Empresarial

Verificar o domínio existente antes de implementar.

 dados reais
 empresas vinculadas corretamente ao usuário
 ações previstas pelo backend

Não duplicar regra de negócio no frontend.

Fase 11 — Configurações

A conexão genérica atual não deve ser considerada concluída. Configurações precisa de endpoints próprios — não reaproveitar /api/empresas.

Priorizar:

 perfil
 preferências
 dados financeiros
 configurações da conta
 informações relacionadas à empresa
 configurações de IA (quando existentes)

Não expor credenciais ou secrets no frontend.

Fase 12 — Inteligência Artificial

Finalizar a integração Gemini. Verificar:

text
GEMINI_API_KEY
GOOGLE_GENERATIVE_AI_API_KEY

e a convenção definida em AGENTS.md/README.

 categorização em lote
 prévia dos resultados
 confirmação explícita antes de aplicar
 insights agregados
 tratamento de erro
 mensagem clara quando a API key não estiver configurada

Nunca alterar transações automaticamente sem confirmação explícita.

Fase 13 — Pasta task/ legada

Arquivar ou realinhar a pasta task/ legada para que não compita com .codex/tasks.md.

 confirmar se alguma credencial citada em task/ ainda é válida
 se for, invalidar/rotacionar a credencial antes de arquivar ou remover a pasta
 task/ arquivada ou realinhada, sem competir com .codex/tasks.md
 nenhuma credencial antiga válida permanece exposta

task/ cita Anthropic e credenciais antigas — tratar como pendência de segurança, não apenas organizacional.

Fase 14 — Segurança e isolamento

Revisar endpoints e serviços para garantir isolamento por usuário. Testar especialmente:

 usuário A não acessa contas do usuário B
 usuário A não acessa transações do usuário B
 usuário A não acessa investimentos do usuário B
 usuário A não acessa metas do usuário B
 usuário A não acessa empresas do usuário B

Verificar ownership e validações Zod. Não confiar em IDs enviados pelo frontend.

Fase 15 — Testes

Autenticação: login; sessão; usuário autenticado; usuário não autenticado.

Dashboard: dados reais (com seed); estado vazio; erro; isolamento.

Contas: CRUD; validação; ownership.

Transações: CRUD; filtros; ownership; CSV Nubank.

Investimentos: leitura; operações existentes; ownership.

Metas: CRUD; progresso; ownership.

IA: com chave configurada; sem chave; erro; confirmação antes de aplicar.

E2E: executar os fluxos críticos definidos pelo projeto (Contas, Transações, CSV Nubank, Investimentos, Metas, IA).

Fase 16 — Docker

Executar os scripts existentes relacionados a Docker, especialmente docker:reset (ou equivalente definido no projeto).

Confirmar:

 containers sobem
 PostgreSQL 16 sobe
 volumes funcionam
 migrations são executadas
 seed funciona
 backend funciona
 frontend funciona
 aplicação consegue acessar o banco
 não existem conflitos de portas

A porta PostgreSQL local deve continuar sendo 5433. Não alterar sem necessidade.

Fase 17 — Qualidade visual

Preservar a identidade visual existente. Não fazer redesign desnecessário.

 responsividade
 consistência
 espaçamento
 tipografia
 componentes shadcn/ui
 estados de loading
 estados vazios
 mensagens de erro
 acessibilidade básica
 navegação coerente
Fase 18 — Critérios de aceite

Ler novamente AGENTS.md e transformar os nove critérios de aceite em checklist objetiva, com evidência por item:

text
[ ] Critério
    Evidência:
    Comando/teste:
    Resultado:

Não marcar como concluído sem evidência. Executar todos os comandos obrigatórios; se algum falhar, corrigir e executar novamente.

Estratégia de execução

Não tentar fazer tudo de uma vez. Executar nesta ordem, validando cada etapa antes de avançar:

text
1. Estado atual
2. Typecheck / lint / format / testes / build
3. Prisma / Docker Compose
4. Contratos de API
5. Dashboard
6. Contas
7. Transações + CSV Nubank
8. Investimentos
9. Metas
10. Empresarial
11. Configurações
12. IA
13. Pasta task/ legada
14. Segurança / ownership
15. Testes (unitários, integração, componente, E2E)
16. Docker
17. Qualidade visual
18. Critérios de aceite

Se encontrar um bloqueio, resolvê-lo antes de continuar.

Testes obrigatórios
 Testes unitários para toda lógica de negócio nova (Vitest)
 Testes de integração para endpoints/server actions criados (Supertest/Vitest)
 Testes de componente para todo componente novo (Testing Library)
 Ao menos 1 teste E2E por fluxo crítico (Playwright), cobrindo Contas, Transações, CSV Nubank, Investimentos, Metas e IA
 Testes de ownership/isolamento por usuário (Fase 14) cobertos em integração
 Cobertura de código não regrediu
 pnpm run test passa sem erros antes de marcar qualquer fase como concluída
Checklist

Não fazer:

 Não reiniciar o projeto
 Não apagar alterações existentes
 Não usar git reset
 Não trocar a stack novamente
 Não criar arquitetura paralela
 Não criar mocks para esconder problemas
 Não colocar dados financeiros fixos no frontend
 Não ignorar erros de TypeScript
 Não desabilitar ESLint
 Não desabilitar testes
 Não ignorar falhas de build
 Não considerar tabela genérica como CRUD concluído
 Não considerar placeholder conectado a endpoint como módulo terminado

Fazer:

 Reutilizar serviços existentes
 Reutilizar componentes existentes
 Respeitar AGENTS.md e .codex/tasks.md
 Manter regras de negócio no backend
 Validar ownership
 Utilizar Zod, React Hook Form e shadcn/ui
 Criar testes
 Validar cada alteração
 Executar os comandos reais
 Manter o código limpo
 Corrigir a causa raiz dos problemas

Critérios de aceite (Fase 18):

 pnpm run typecheck passa
 pnpm run lint passa
 pnpm run format:check passa
 pnpm run test passa
 pnpm run build passa
 pnpm run db:generate e migrations/seed funcionam
 Contratos de API (Fase 4) validados nos sete grupos de endpoints
 Dashboard, Contas, Transações, Investimentos, Metas, Empresarial e Configurações funcionais de ponta a ponta (não apenas conectados)
 Importação de CSV Nubank funcional com confirmação explícita
 Integração Gemini funcional (com e sem API key) e com confirmação antes de aplicar
 Pasta task/ legada arquivada/realinhada, sem credenciais válidas expostas
 Isolamento por usuário validado (Fase 14) em todos os módulos
 Docker (docker:reset ou equivalente) sobe ambiente completo com PostgreSQL 16 na porta 5433
 Qualidade visual (Fase 17) preservada, sem redesign
 Nove critérios de aceite do AGENTS.md validados individualmente, com evidência

Não declarar o projeto concluído se ainda houver falhas.

Entrega final — apresentar ao término
O que já estava pronto ao assumir a task
O que foi implementado nesta execução
Arquivos principais alterados
Testes executados
Comandos que passaram
Comandos que ainda falharam, se houver
Pendências reais
Status dos critérios de aceite (por item, com evidência)