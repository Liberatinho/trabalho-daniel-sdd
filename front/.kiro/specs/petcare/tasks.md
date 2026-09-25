# PetCare — Tasks de Implementação do Frontend

## 0. Regras de implementação

Antes de iniciar qualquer tarefa de código, seguir estas regras:

- O frontend é um projeto Angular + TypeScript independente do backend.
- A raiz `petcare/` funciona apenas como centralizador do projeto.
- O backend está em `../back` e é a fonte de verdade para contratos da API.
- O frontend está em `front/` e possui seu próprio `.kiro/`.
- O Figma do PetCare e `docs/design-system.md` são as fontes de verdade para a implementação visual.
- Quando houver conflito entre uma decisão visual genérica da IA e o Figma/Design System, o Figma e o Design System prevalecem.
- Não inventar endpoints, campos, enums, respostas ou regras de negócio que não estejam documentados no contrato do backend.
- O frontend pode realizar validações para melhorar a experiência do usuário, mas o backend continua sendo a autoridade sobre regras de negócio.
- Não duplicar regras de negócio do backend dentro dos componentes.
- Não criar valores visuais arbitrários quando existir token correspondente no Design System.
- Os fluxos **Registrar Vacina**, **Agendar Nova Consulta** e **Criar Novo Lembrete** devem ser implementados como modais, sem rotas próprias.
- Toda implementação deve manter acessibilidade, responsividade e estados de loading, erro e vazio.
- Cada tarefa concluída deve poder ser relacionada a um ou mais requisitos e, posteriormente, a código, testes e commit.

---

## 1. Confirmar contexto e contrato de integração

### 1.1 Confirmar o contrato da API do backend

- [ ] Registrar base URL, endpoints, métodos HTTP, payloads, respostas, enums, códigos de erro e regras de disponibilidade para autenticação, pets, vacinas, consultas e lembretes.
- [ ] Confirmar os campos obrigatórios e opcionais dos formulários.
- [ ] Confirmar os identificadores necessários para as rotas aninhadas.
- [ ] Confirmar quais dados são retornados pela API e quais não devem ser inventados no frontend.
- [ ] Confirmar se existem endpoints específicos para disponibilidade de horários, veterinários ou outros dados necessários à tela de consultas.
- [ ] Não criar modelos ou serviços de domínio antes de resolver divergências com o contrato real.

**Requirements:** RNF-004, RNF-005

### 1.2 Definir a estratégia de autenticação do frontend

- [ ] Confirmar se a autenticação usa cookie, token ou outro mecanismo definido pelo backend.
- [ ] Definir login, cadastro, logout, restauração de sessão, expiração e proteção das rotas.
- [ ] Definir o comportamento de redirecionamento para usuário autenticado e não autenticado.
- [ ] Documentar a decisão.
- [ ] Nunca armazenar senha ou credenciais de forma insegura.

**Requirements:** REQ-001, REQ-002, REQ-011, RNF-005

### 1.3 Confirmar os critérios visuais executáveis a partir do Figma

- [ ] Confirmar tokens de cor, tipografia, espaçamento, raios, sombras e breakpoints.
- [ ] Confirmar estados dos componentes: default, hover, focus, disabled, loading, error e selected quando aplicável.
- [ ] Confirmar variantes dos componentes do Design System.
- [ ] Confirmar regras visuais de tabelas, modais, sidebar, header, formulários e estados vazios.
- [ ] Confirmar comportamento responsivo das telas apresentadas no Figma.

**Requirements:** RNF-002, RNF-003, REQ-015

---

# 2. Criar a fundação da aplicação

### 2.1 Configurar a base global de estilos e tokens (P)

- [ ] Implementar os tokens definidos em `docs/design-system.md`.
- [ ] Confirmar os valores com o Figma.
- [ ] Configurar reset/base tipográfica.
- [ ] Configurar foco visível.
- [ ] Configurar superfícies, bordas, estados de formulário e responsividade.
- [ ] Evitar valores arbitrários diretamente nos componentes.

**Requirements:** RNF-002, RNF-003, REQ-015

### 2.2 Configurar HTTP, ambiente e tratamento comum de respostas (P)

- [ ] Configurar `HttpClient`.
- [ ] Configurar a base URL por ambiente.
- [ ] Definir tratamento comum de erros HTTP.
- [ ] Preservar tipagem estrita.
- [ ] Expor erros de forma explícita para as páginas e formulários.
- [ ] Não incluir segredos ou credenciais no código-fonte.

**Requirements:** RNF-004, RNF-005, RNF-006

### 2.3 Criar modelos compartilhados dos contratos confirmados (P)

- [ ] Criar interfaces/types em `src/app/models/`.
- [ ] Modelar usuário, pet, vacina, consulta, lembrete, requests, responses, filtros e erros conforme o contrato real.
- [ ] Representar enums e campos opcionais conforme o backend.
- [ ] Não duplicar tipos em páginas ou componentes.
- [ ] Não adicionar campos que não existam no contrato confirmado.

**Requirements:** RNF-004, RNF-006

### 2.4 Criar Button e componentes de formulário do Design System (P)

- [ ] Implementar Button.
- [ ] Implementar Input.
- [ ] Implementar Select.
- [ ] Implementar Date Input.
- [ ] Implementar Textarea.
- [ ] Implementar labels e mensagens de validação.
- [ ] Implementar estados disabled/loading.
- [ ] Garantir foco visível e nomes acessíveis.
- [ ] Manter os componentes sem chamadas HTTP ou regras de negócio.

**Requirements:** RNF-001, RNF-002, REQ-014, REQ-015

### 2.5 Criar componentes visuais reutilizáveis do Design System (P)

- [ ] Implementar Card.
- [ ] Implementar Badge/Status.
- [ ] Implementar Alert/Feedback.
- [ ] Implementar Avatar.
- [ ] Garantir variantes previstas no Design System.
- [ ] Manter os componentes reutilizáveis e sem regras específicas de domínio.

**Requirements:** RNF-001, RNF-002, REQ-014, REQ-015

### 2.6 Criar Modal base (P)

- [ ] Implementar Modal reutilizável.
- [ ] Garantir fechamento controlado.
- [ ] Garantir limite de viewport e scroll interno quando necessário.
- [ ] Garantir navegação por teclado.
- [ ] Garantir foco apropriado.
- [ ] Garantir nome acessível.
- [ ] Aplicar tokens e dimensões do Design System/Figma.
- [ ] Preparar o Modal para os fluxos de vacina, consulta e lembrete.

**Requirements:** REQ-006, REQ-008, REQ-010, REQ-014, REQ-015

### 2.7 Criar Table, Search, Sidebar, Header, Loading e Empty State (P)

- [ ] Implementar Table reutilizável.
- [ ] Implementar Search.
- [ ] Implementar Sidebar.
- [ ] Implementar Header.
- [ ] Implementar Loading.
- [ ] Implementar Empty State.
- [ ] Garantir responsividade.
- [ ] Garantir estados acessíveis.
- [ ] Não incluir chamadas HTTP ou regras de negócio nos componentes.

**Requirements:** REQ-011, REQ-012, REQ-013, REQ-014, REQ-015

---

# 3. Implementar autenticação e shell autenticado

### 3.1 Implementar serviço e estado de autenticação

- [ ] Encapsular login, cadastro, logout e restauração de sessão conforme o contrato confirmado.
- [ ] Expor estado do usuário autenticado.
- [ ] Expor estados de loading e erro.
- [ ] Não armazenar senha.
- [ ] Respeitar a estratégia de autenticação definida em 1.2.

**Requirements:** REQ-001, REQ-002, RNF-005

### 3.2 Implementar proteção e organização das rotas (P)

- [ ] Criar rotas públicas para login e cadastro.
- [ ] Criar rotas protegidas para a área autenticada.
- [ ] Adicionar guard/interceptor somente quando suportado pela estratégia de autenticação.
- [ ] Configurar rota inicial.
- [ ] Configurar fallback.
- [ ] Configurar redirecionamentos.

**Requirements:** REQ-001, REQ-011, RNF-005

### 3.3 Implementar layout de autenticação (P)

- [ ] Criar painel lateral conforme Figma.
- [ ] Aplicar identidade visual PetCare.
- [ ] Criar card de formulário.
- [ ] Implementar badge e demais elementos visuais previstos.
- [ ] Preparar estrutura compartilhada para Login e Cadastro.
- [ ] Evitar duplicação do layout.

**Requirements:** REQ-001, REQ-002, RNF-002, RNF-003

### 3.4 Implementar login

- [ ] Criar página standalone.
- [ ] Utilizar Reactive Forms.
- [ ] Implementar campos de e-mail e senha conforme contrato.
- [ ] Implementar validações.
- [ ] Implementar loading.
- [ ] Implementar erro.
- [ ] Implementar sucesso.
- [ ] Implementar navegação após autenticação.
- [ ] Incluir recuperação de senha somente se suportada pelo backend.

**Requirements:** REQ-001, REQ-014, RNF-005

### 3.5 Implementar cadastro de tutor

- [ ] Criar página standalone.
- [ ] Implementar somente os campos existentes no contrato confirmado do backend.
- [ ] Não assumir CPF, cidade ou outros campos sem confirmação no contrato.
- [ ] Implementar Reactive Forms.
- [ ] Implementar validações.
- [ ] Implementar loading, sucesso e erro.
- [ ] Implementar retorno para login.

**Requirements:** REQ-002, REQ-014, RNF-004

### 3.6 Implementar shell autenticado (P)

- [ ] Criar layout com sidebar.
- [ ] Criar header.
- [ ] Criar conteúdo principal.
- [ ] Implementar avatar/iniciais conforme dados disponíveis.
- [ ] Exibir identificação do tutor somente com dados reais.
- [ ] Implementar estado ativo da navegação.
- [ ] Implementar comportamento responsivo conforme Figma.
- [ ] Preparar notificações para integração futura sem inventar dados.

**Requirements:** REQ-011, REQ-012, REQ-013, REQ-015

---

# 4. Implementar pets

### 4.1 Implementar serviço de pets (P)

- [ ] Encapsular listagem de pets.
- [ ] Encapsular seleção de pet.
- [ ] Encapsular criação de pet.
- [ ] Utilizar somente endpoints e modelos confirmados.
- [ ] Expor erros sem fallback silencioso.
- [ ] Preservar o contrato do backend.

**Requirements:** REQ-003, REQ-004, RNF-004

### 4.2 Implementar página Meus Pets

- [ ] Exibir pets obtidos pela API.
- [ ] Implementar pet selecionado.
- [ ] Implementar loading.
- [ ] Implementar erro.
- [ ] Implementar estado vazio.
- [ ] Implementar ação de cadastro.
- [ ] Usar componentes reutilizáveis.
- [ ] Não utilizar valores fixos do Figma como dados reais.

**Requirements:** REQ-004, REQ-014, REQ-015

### 4.3 Implementar cadastro de pet

- [ ] Criar formulário Reactive Forms.
- [ ] Utilizar nome, data de nascimento, espécie, raça e observações somente conforme contrato.
- [ ] Implementar validações.
- [ ] Implementar loading.
- [ ] Implementar erro.
- [ ] Implementar sucesso.
- [ ] Atualizar a lista sem reload manual.

**Requirements:** REQ-003, REQ-014, REQ-015

### 4.4 Testar serviço, formulário e estados de pets

- [ ] Cobrir sucesso.
- [ ] Cobrir estado vazio.
- [ ] Cobrir validação.
- [ ] Cobrir erro HTTP.
- [ ] Cobrir atualização da listagem.
- [ ] Cobrir comportamento do pet selecionado.

**Requirements:** REQ-003, REQ-004, REQ-014

---

# 5. Implementar vacinas

### 5.1 Implementar serviço e modelos de vacinas (P)

- [ ] Encapsular listagem.
- [ ] Encapsular filtros.
- [ ] Encapsular criação de vacinas.
- [ ] Utilizar endpoints, payloads e regras confirmados.
- [ ] Não duplicar regras de negócio do backend.

**Requirements:** REQ-005, REQ-006, RNF-004

### 5.2 Implementar página de Vacinas

- [ ] Criar título.
- [ ] Criar busca.
- [ ] Criar filtro por pet.
- [ ] Criar tabela de histórico.
- [ ] Criar ação `Registrar Vacina`.
- [ ] Exibir dados reais de pet, vacina, datas e observações.
- [ ] Implementar loading.
- [ ] Implementar erro.
- [ ] Implementar estado vazio.
- [ ] Implementar filtragem.
- [ ] Adaptar a tabela a telas menores sem overflow desnecessário.

**Requirements:** REQ-005, REQ-014, REQ-015

### 5.3 Implementar modal Registrar Vacina

- [ ] Reutilizar o Modal base.
- [ ] Reutilizar componentes de formulário.
- [ ] Utilizar somente campos suportados pelo backend.
- [ ] Implementar regras de validação compatíveis com o contrato.
- [ ] Implementar loading.
- [ ] Implementar erro.
- [ ] Implementar sucesso.
- [ ] Implementar fechamento.
- [ ] Atualizar a listagem após o cadastro sem reload manual.
- [ ] Não criar rota própria para o registro de vacina.

**Requirements:** REQ-006, REQ-014, REQ-015

### 5.4 Testar vacinas e o modal de registro

- [ ] Cobrir busca.
- [ ] Cobrir filtro.
- [ ] Cobrir estados da tabela.
- [ ] Cobrir validação.
- [ ] Cobrir submissão.
- [ ] Cobrir erros HTTP.
- [ ] Cobrir atualização sem reload.
- [ ] Cobrir abertura e fechamento do modal.

**Requirements:** REQ-005, REQ-006, REQ-014

---

# 6. Implementar consultas

### 6.1 Implementar serviço e modelos de consultas (P)

- [ ] Encapsular listagem.
- [ ] Encapsular filtros.
- [ ] Encapsular criação.
- [ ] Encapsular consulta de disponibilidade somente se o backend fornecer endpoint para isso.
- [ ] Não gerar horários ou disponibilidade no frontend.
- [ ] Não criar entidade ou serviço de veterinário se isso não existir no contrato.

**Requirements:** REQ-007, REQ-008, RNF-004

### 6.2 Implementar página de Consultas

- [ ] Criar título.
- [ ] Criar busca.
- [ ] Criar filtros.
- [ ] Criar tabela de agenda.
- [ ] Criar ação `Agendar Nova Consulta`.
- [ ] Exibir somente campos fornecidos pelo contrato.
- [ ] Tratar loading.
- [ ] Tratar erro.
- [ ] Tratar estado vazio.
- [ ] Aplicar status acessível.
- [ ] Garantir responsividade da tabela.

**Requirements:** REQ-007, REQ-014, REQ-015

### 6.3 Implementar modal Agendar Nova Consulta

- [ ] Reutilizar o Modal base.
- [ ] Reutilizar componentes de formulário.
- [ ] Carregar pets somente das fontes autorizadas pelo backend.
- [ ] Carregar veterinários somente se houver fonte/endpoint definido pelo backend.
- [ ] Carregar horários somente se houver disponibilidade fornecida pelo backend.
- [ ] Não gerar horários no frontend.
- [ ] Implementar validação.
- [ ] Implementar loading.
- [ ] Implementar erro.
- [ ] Implementar confirmação.
- [ ] Implementar fechamento.
- [ ] Atualizar a agenda após o cadastro.
- [ ] Não criar rota própria para o agendamento.

**Requirements:** REQ-008, REQ-014, REQ-015

### 6.4 Testar consultas e o modal de agendamento

- [ ] Cobrir busca.
- [ ] Cobrir filtros.
- [ ] Cobrir status.
- [ ] Cobrir disponibilidade quando fornecida pela API.
- [ ] Cobrir validação.
- [ ] Cobrir erros HTTP.
- [ ] Cobrir atualização sem reload.
- [ ] Cobrir abertura e fechamento do modal.

**Requirements:** REQ-007, REQ-008, REQ-014

---

# 7. Implementar lembretes

### 7.1 Implementar serviço e modelos de lembretes (P)

- [ ] Encapsular listagem.
- [ ] Encapsular filtros.
- [ ] Encapsular criação.
- [ ] Utilizar categorias e campos definidos pelo backend.
- [ ] Não inventar categorias ou regras de prazo não previstas no contrato.

**Requirements:** REQ-009, REQ-010, RNF-004

### 7.2 Implementar Central de Lembretes

- [ ] Criar busca.
- [ ] Criar filtros.
- [ ] Criar agrupamento visual por Vacinas, Consultas e Remédios somente se essas categorias estiverem definidas no produto/contrato.
- [ ] Criar ação `Criar Novo Lembrete`.
- [ ] Exibir título, pet, data limite e categoria conforme dados disponíveis.
- [ ] Implementar estados de proximidade/atraso somente conforme regra definida pelo produto/backend.
- [ ] Tratar loading.
- [ ] Tratar erro.
- [ ] Tratar estado vazio.
- [ ] Garantir responsividade.

**Requirements:** REQ-009, REQ-014, REQ-015

### 7.3 Implementar modal Criar Novo Lembrete

- [ ] Reutilizar o Modal base.
- [ ] Reutilizar componentes de formulário.
- [ ] Utilizar categoria, pet, título, data limite e observações somente quando suportados pelo contrato.
- [ ] Implementar validação.
- [ ] Implementar loading.
- [ ] Implementar erro.
- [ ] Implementar sucesso.
- [ ] Implementar fechamento.
- [ ] Atualizar a central após o cadastro.
- [ ] Não criar rota própria para o cadastro de lembrete.

**Requirements:** REQ-010, REQ-014, REQ-015

### 7.4 Testar lembretes e o modal de criação

- [ ] Cobrir categorias.
- [ ] Cobrir busca.
- [ ] Cobrir filtros.
- [ ] Cobrir estados de prazo quando aplicáveis.
- [ ] Cobrir validação.
- [ ] Cobrir erros HTTP.
- [ ] Cobrir atualização sem reload.
- [ ] Cobrir abertura e fechamento do modal.

**Requirements:** REQ-009, REQ-010, REQ-014

---

# 8. Integrar, validar e finalizar

### 8.1 Integrar todas as rotas e fluxos no shell autenticado

- [ ] Confirmar navegação para Início.
- [ ] Confirmar navegação para Meus Pets.
- [ ] Confirmar navegação para Vacinas.
- [ ] Confirmar navegação para Consultas.
- [ ] Confirmar navegação para Lembretes.
- [ ] Garantir que `Registrar Vacina` permanece modal.
- [ ] Garantir que `Agendar Nova Consulta` permanece modal.
- [ ] Garantir que `Criar Novo Lembrete` permanece modal.
- [ ] Garantir que os três fluxos não possuem rotas próprias.
- [ ] Validar os redirecionamentos de autenticação.

**Requirements:** REQ-006, REQ-008, REQ-010, REQ-011

### 8.2 Validar aderência ao Figma e ao Design System

- [ ] Comparar as telas implementadas com o Figma.
- [ ] Comparar componentes e tokens com `docs/design-system.md`.
- [ ] Verificar espaçamentos.
- [ ] Verificar tipografia.
- [ ] Verificar cores.
- [ ] Verificar bordas, raios e sombras.
- [ ] Verificar estados dos componentes.
- [ ] Verificar modais.
- [ ] Verificar tabelas.
- [ ] Verificar sidebar e header.
- [ ] Verificar responsividade.
- [ ] Corrigir divergências visuais relevantes.

**Requirements:** RNF-002, RNF-003, REQ-014, REQ-015

### 8.3 Validar acessibilidade

- [ ] Verificar labels associados aos campos.
- [ ] Verificar foco visível.
- [ ] Verificar navegação por teclado.
- [ ] Verificar nomes acessíveis.
- [ ] Verificar contraste.
- [ ] Verificar comportamento de foco dos modais.
- [ ] Verificar mensagens de erro.
- [ ] Verificar estados disabled/loading.

**Requirements:** REQ-014, REQ-015

### 8.4 Validar responsividade

- [ ] Testar desktop.
- [ ] Testar tablet.
- [ ] Testar mobile.
- [ ] Verificar ausência de overflow horizontal.
- [ ] Verificar comportamento das tabelas.
- [ ] Verificar comportamento dos modais.
- [ ] Verificar sidebar/header.
- [ ] Verificar formulários.

**Requirements:** RNF-003, REQ-015

### 8.5 Executar validação técnica e testes

- [ ] Executar `npm run build`.
- [ ] Executar `npm test`.
- [ ] Corrigir erros de compilação.
- [ ] Corrigir erros de templates.
- [ ] Corrigir testes quebrados.
- [ ] Validar integração com o backend real.
- [ ] Validar os principais fluxos ponta a ponta.

**Requirements:** RNF-006

### 8.6 Atualizar rastreabilidade

- [ ] Atualizar `docs/rastreabilidade-front.md`.
- [ ] Relacionar cada requisito às tasks correspondentes.
- [ ] Relacionar tasks às páginas, componentes e serviços implementados.
- [ ] Relacionar tasks aos testes.
- [ ] Relacionar implementação aos commits.
- [ ] Confirmar que não existem requisitos sem implementação ou tasks sem requisito.

**Requirements:** RNF-006

---

# 9. Ordem recomendada de execução

A implementação deve seguir aproximadamente esta ordem:

```text
1. Contrato backend
        ↓
2. Estratégia de autenticação
        ↓
3. Figma + Design System
        ↓
4. Tokens e estilos globais
        ↓
5. HTTP + ambientes
        ↓
6. Models/types
        ↓
7. Componentes primitivos
        ↓
8. Componentes compartilhados
        ↓
9. Modal base
        ↓
10. Autenticação
        ↓
11. Shell autenticado
        ↓
12. Pets
        ↓
13. Vacinas
        ↓
14. Consultas
        ↓
15. Lembretes
        ↓
16. Integração
        ↓
17. Testes
        ↓
18. Validação visual/acessibilidade
        ↓
19. Rastreabilidade
```

## Regra para a IA durante a implementação

Antes de implementar qualquer task:

1. Ler o `requirements.md` relacionado.
2. Ler o `design.md` relacionado.
3. Consultar `docs/design-system.md`.
4. Consultar `docs/figma.md`.
5. Consultar o contrato do backend.
6. Inspecionar o código Angular existente.
7. Implementar somente o necessário para a task.
8. Não inventar contratos.
9. Não alterar o backend para resolver uma necessidade do frontend sem decisão explícita do grupo.
10. Executar os testes relacionados após a implementação.

A cadeia esperada é:

```text
REQ
 ↓
DESIGN
 ↓
TASK
 ↓
CÓDIGO
 ↓
TESTE
 ↓
COMMIT
```
