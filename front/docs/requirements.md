# PetCare — Frontend Requirements

## 1. Visão geral

O PetCare é uma aplicação web para tutores de animais de estimação, permitindo centralizar informações relacionadas à rotina e aos cuidados dos pets.

O frontend é desenvolvido utilizando:

- Angular
- TypeScript
- HTML
- CSS
- Angular Router
- Reactive Forms
- HTTP Client para comunicação com o backend

O frontend deve consumir exclusivamente as APIs disponibilizadas pelo backend do projeto.

O frontend não deve duplicar regras de negócio pertencentes ao backend.

---

# 2. Objetivo do frontend

O frontend deve fornecer uma interface simples, organizada e visualmente consistente para que o tutor consiga:

- criar e acessar sua conta;
- visualizar seus pets;
- cadastrar novos pets;
- acompanhar vacinas;
- registrar vacinas;
- acompanhar consultas;
- agendar consultas;
- visualizar lembretes;
- criar novos lembretes;
- receber feedback das operações realizadas.

A interface deve seguir fielmente o Design System definido para o PetCare e as referências disponíveis no Figma.

---

# 3. Identidade visual

A interface deve seguir a identidade visual apresentada no Figma.

Características principais observadas nas telas:

- aparência limpa e amigável;
- fundo em tom off-white;
- azul-petróleo como cor principal;
- verde/teal como cor de destaque;
- elementos com bordas arredondadas;
- cards com sombras suaves;
- tipografia moderna e legível;
- ícones simples;
- espaçamento generoso;
- componentes visualmente leves;
- destaque visual para informações importantes.

O frontend não deve criar componentes visualmente incompatíveis com o Design System.

---

# 4. Fluxos principais

O frontend deve implementar os seguintes fluxos:

1. Login
2. Cadastro de tutor
3. Cadastro de pet
4. Visualização de pets
5. Visualização de vacinas
6. Registro de vacina
7. Visualização de consultas
8. Agendamento de consulta
9. Visualização de lembretes
10. Criação de lembrete

---

# 5. Autenticação

## REQ-FRONT-001 — Login

O sistema deve permitir que o tutor informe:

- e-mail;
- senha.

O formulário deve possuir:

- validação dos campos;
- feedback visual para campos inválidos;
- estado de carregamento durante a autenticação;
- tratamento de erro retornado pelo backend.

Após autenticação bem-sucedida, o usuário deve ser direcionado para a área autenticada da aplicação.

---

## REQ-FRONT-002 — Cadastro de tutor

O sistema deve permitir o cadastro de um novo tutor.

Campos apresentados na interface:

- CPF;
- e-mail;
- cidade;
- senha.

O formulário deve:

- validar campos obrigatórios;
- apresentar mensagens de erro;
- impedir envio enquanto os dados forem inválidos;
- apresentar estado de carregamento;
- apresentar feedback de sucesso ou erro.

Após o cadastro, o usuário deve poder acessar a tela de login.

---

# 6. Layout autenticado

Após o login, as telas autenticadas devem utilizar um layout compartilhado.

O layout deve possuir:

- sidebar;
- logo PetCare;
- navegação principal;
- área de conteúdo;
- avatar do usuário;
- identificação do usuário;
- botão/área de notificações.

A sidebar deve conter:

- Início;
- Meus pets;
- Vacinas;
- Consultas;
- Lembretes.

A opção correspondente à página atual deve possuir estado visual de seleção.

---

# 7. Cadastro de pets

## REQ-FRONT-003 — Cadastro de pet

O sistema deve permitir cadastrar um novo pet.

Campos:

- nome;
- data de nascimento;
- espécie;
- raça;
- observações.

A interface deve seguir o formulário apresentado no Figma.

O campo espécie deve utilizar um componente de seleção.

O cadastro deve utilizar Reactive Forms.

Após o cadastro bem-sucedido:

- o formulário deve ser encerrado;
- a lista de pets deve ser atualizada;
- o usuário deve receber feedback de sucesso.

Os dados devem ser enviados para o backend conforme o contrato definido pelo backend.

---

# 8. Meus pets

## REQ-FRONT-004 — Visualização dos pets

A tela "Meus pets" deve apresentar os pets pertencentes ao tutor autenticado.

A interface deve permitir:

- visualizar os pets cadastrados;
- identificar o pet selecionado;
- acessar o cadastro de um novo pet.

O frontend deve obter os dados através da API.

Não devem ser utilizados dados mockados quando a API correspondente estiver disponível.

---

# 9. Vacinas

## REQ-FRONT-005 — Listagem de vacinas

A tela de vacinas deve apresentar o histórico de imunização dos pets.

A tabela deve apresentar informações equivalentes às mostradas no Figma:

- pet;
- vacina;
- data de aplicação;
- próxima dose;
- observações.

A tela deve possuir:

- campo de busca;
- filtro por pet;
- botão "Registrar Vacina".

A busca e os filtros devem atualizar os dados apresentados de acordo com os dados disponíveis no frontend/backend.

---

# 10. Registrar vacina

## REQ-FRONT-006 — Modal de registro de vacina

O botão "Registrar Vacina" deve abrir um modal/pop-up.

O modal deve:

- utilizar componentes do Design System;
- seguir o visual do Figma;
- possuir título e descrição;
- possuir formulário;
- permitir cancelar;
- permitir salvar;
- apresentar estados de loading;
- apresentar mensagens de validação;
- apresentar feedback após sucesso ou erro.

O formulário deve utilizar os campos exigidos pelo backend para criação de uma vacina.

IMPORTANTE:

Os campos exatos, tipos, obrigatoriedade e formato devem ser obtidos da documentação/contrato do backend.

O frontend não deve inventar campos ou regras de negócio que não existam no backend.

Após o registro:

1. fechar o modal;
2. atualizar a lista de vacinas;
3. apresentar feedback de sucesso.

---

# 11. Consultas

## REQ-FRONT-007 — Listagem de consultas

A tela de consultas deve apresentar as consultas veterinárias do tutor.

A tabela deve apresentar:

- pet;
- veterinário(a);
- data;
- horário;
- motivo;
- status;
- observações.

A tela deve possuir:

- campo de busca;
- filtro de consultas;
- botão "Agendar Nova Consulta".

Os status devem ser apresentados visualmente através de componentes do Design System.

---

# 12. Agendamento de consulta

## REQ-FRONT-008 — Modal de agendamento

O botão "Agendar Nova Consulta" deve abrir um modal/pop-up.

O modal deve seguir o Design System e o Figma.

O formulário deve permitir informar os dados necessários para criar uma consulta.

Os campos devem ser definidos com base no contrato do backend.

O frontend deve:

- validar os campos;
- enviar os dados para a API;
- apresentar loading;
- tratar erros;
- impedir múltiplos envios simultâneos;
- fechar o modal após sucesso;
- atualizar a lista de consultas.

O modal deve ser reutilizável e não deve criar uma nova página.

---

# 13. Lembretes

## REQ-FRONT-009 — Central de lembretes

A tela de lembretes deve apresentar os lembretes organizados por categoria.

Categorias apresentadas no design:

- Vacinas;
- Consultas;
- Remédios.

A interface deve apresentar:

- campo de busca;
- filtro;
- botão "Criar Novo Lembrete";
- cards de lembretes.

Cada lembrete deve apresentar informações como:

- título;
- pet relacionado;
- data limite;
- categoria;
- estado visual quando necessário.

---

# 14. Criação de lembrete

## REQ-FRONT-010 — Modal de criação de lembrete

O botão "Criar Novo Lembrete" deve abrir um modal/pop-up.

O modal deve:

- seguir o Design System;
- utilizar os mesmos padrões dos demais modais;
- utilizar Reactive Forms;
- validar os campos;
- apresentar loading;
- apresentar mensagens de erro;
- permitir cancelar;
- permitir salvar.

Os campos devem ser determinados pelo contrato do backend.

Após sucesso:

1. fechar o modal;
2. atualizar a central de lembretes;
3. apresentar feedback de sucesso.

---

# 15. Estados da interface

Todos os componentes que dependem de APIs devem possuir estados de:

### Loading

Enquanto uma operação estiver sendo executada.

### Empty

Quando não existirem dados.

### Error

Quando uma requisição falhar.

### Success

Quando uma operação de criação, alteração ou exclusão for concluída.

### Disabled

Quando uma ação não puder ser executada.

Esses estados devem seguir o Design System.

---

# 16. Tratamento de erros

O frontend deve tratar respostas de erro da API.

Devem ser considerados, conforme contrato do backend:

- 400 — dados inválidos;
- 403 — acesso não autorizado;
- 404 — recurso não encontrado;
- 500 — erro interno.

As mensagens apresentadas ao usuário devem ser amigáveis.

O frontend não deve expor stack traces, informações internas do servidor ou detalhes técnicos desnecessários.

---

# 17. Comunicação com o backend

A comunicação deve ser centralizada através de Angular Services.

Os componentes não devem realizar chamadas HTTP diretamente.

Exemplo conceitual:

```text
Component
   ↓
Service
   ↓
HttpClient
   ↓
Backend API