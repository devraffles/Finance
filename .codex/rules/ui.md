# UI, UX E Design System

## Direcao Visual

- Interface de produto financeiro: densa, clara, profissional e escaneavel.
- Evite visual de landing page.
- A primeira tela autenticada deve ser o dashboard funcional, nao uma pagina promocional.
- Use dark premium com contraste suficiente.
- Use Sora para titulos e DM Sans para texto, conforme o prompt.
- Use lucide-react para icones.

## Layout

- Sidebar fixa em desktop com largura de 240px.
- Header com titulo, periodo global, perfil global e notificacoes.
- Mobile deve ter navegacao colapsavel.
- Cards devem ter raio moderado, no maximo `8px` salvo padrao local diferente.
- Nao coloque cards dentro de cards.
- Graficos devem ter dimensoes estaveis e nao causar layout shift.

## Controles

- Use tabs para secoes de configuracao.
- Use selects para opcoes fechadas.
- Use badges para perfil, tipo, categoria e status.
- Use modais para criar/editar registros.
- Use tabelas para transacoes e posicoes de investimento.
- Use tooltips quando botoes forem apenas icones.

## Acessibilidade

- Inputs sempre devem ter label acessivel.
- Estados de loading, vazio e erro devem existir.
- Contraste deve ser suficiente em texto e graficos.
- Botoes destrutivos devem ser visualmente distintos.

## Exemplo De Texto De UI

Use:

- "Receita do mes"
- "Despesas"
- "Lucro liquido"
- "Patrimonio"
- "Categorizar com IA"
- "Importar CSV"

Evite:

- texto promocional;
- explicacoes longas dentro da interface;
- labels misturando portugues e ingles sem necessidade.

## Graficos

- `FluxoCaixaChart`: barras agrupadas de receitas e despesas.
- `EvolucaoPatrimonioChart`: area/linha de patrimonio.
- `CategoriasDespesaChart`: donut com top categorias.
- Investimentos: donut de alocacao e linha de rentabilidade.
- Empresarial: faturamento mensal e previsto vs realizado.

