# PetCare — Critérios visuais executáveis

_Critérios consolidados em 2026-09-25 a partir de `docs/design-system.md` e `docs/figma.md`._

## Direção visual

O Figma é a referência visual principal. A interface deve ser acolhedora, limpa e profissional, com bastante espaço em branco, superfícies arredondadas e separação visual suave.

- Brand principal: azul-petróleo escuro;
- apoio: verde/azul-esverdeado;
- atenção: coral;
- página: fundo creme claro;
- superfície: cards e formulários claros;
- texto: hierarquia entre primário, secundário, muted e texto sobre fundo escuro.

Valores exatos de cor, fonte e medidas devem ser extraídos das Variables/estilos definitivos do Figma antes da implementação dos tokens. A documentação atual define os papéis sem fornecer todos os valores numéricos.

## Tipografia e espaçamento

- Usar uma escala pequena e consistente para heading, body, label e caption.
- Priorizar legibilidade em tabelas, formulários e estados de feedback.
- Usar espaçamentos baseados em múltiplos de 4 ou 8.
- Usar os tokens de espaçamento centralizados, sem valores arbitrários em páginas.

## Superfícies e estados

- Cards e formulários usam superfície clara, raio consistente e sombra suave quando necessária.
- Campos compartilham altura, padding, borda, raio e estados de hover, focus, disabled e error.
- Botões possuem variantes primary, secondary e text, com hover, disabled e loading.
- Badges e status exibem texto além da cor.
- Alertas comunicam sucesso e erro de maneira explícita.

## Layout de autenticação

- Painel lateral escuro com logo/nome PetCare e mensagem institucional.
- Card de formulário claro, arredondado e com sombra suave.
- Login possui badge de acesso restrito, e-mail, senha, recuperação quando suportada e link de cadastro.
- Cadastro segue o mesmo layout compartilhado e exibe os campos definidos pelo backend, sem inventar campos.

## Layout autenticado

- Sidebar com logo, navegação e perfil na parte inferior.
- Header com contexto, notificações preparadas para dados reais e avatar/iniciais.
- Área principal com título, descrição opcional, filtros, ações e conteúdo.
- Navegação: Início, Meus pets, Vacinas, Consultas e Lembretes.
- O item ativo deve ter estado visual claro e acessível.

## Componentes e modais

Os componentes compartilhados previstos são Button, Input, Select, Date Input, Textarea, Modal, Badge/Status, Card, Table, Search, Sidebar, Header, Avatar, Empty State, Loading e Alert/Feedback.

O Modal base deve ter overlay, título, descrição opcional, conteúdo, cancelar, ação primária, fechamento controlado, loading, erro, limite de altura, scroll interno e navegação por teclado. Ele será reutilizado posteriormente nos fluxos de vacina, consulta e lembrete.

## Tabelas e responsividade

- Vacinas e consultas usam tabela com cabeçalho claro e separadores discretos.
- Tabelas precisam permitir leitura em telas menores sem overflow horizontal desnecessário.
- Formulários reorganizam campos em larguras menores.
- Modais não ultrapassam a viewport e usam scroll interno.
- Sidebar e navegação devem adaptar-se a telas menores.

## Acessibilidade obrigatória

- Labels associados aos campos;
- foco visível;
- navegação por teclado;
- nomes acessíveis para ícones e botões;
- contraste adequado;
- estados comunicados por texto, não somente por cor;
- modal com nome acessível e comportamento de foco controlado.

## Pendências para a implementação dos tokens

Antes da TASK 2.1, confirmar no Figma:

1. valores definitivos de cores;
2. família e pesos tipográficos;
3. escala de fontes;
4. breakpoints;
5. raios e sombras;
6. dimensões e variantes exatas de componentes;
7. estados visuais de loading, erro, vazio e disabled.
