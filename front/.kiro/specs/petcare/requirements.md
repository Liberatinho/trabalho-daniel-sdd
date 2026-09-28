# PetCare — Requisitos do Frontend

## 1. Contexto

O PetCare é uma aplicação web para tutores organizarem a rotina e os cuidados de seus pets em um único lugar.

O frontend será desenvolvido em **Angular + TypeScript** e deve implementar as telas e fluxos definidos no Figma do projeto, mantendo o Design System documentado em `front/docs/design-system.md`.

### Referência visual

Figma: https://www.figma.com/design/qFd4D4pCennpiUsKauNZct/PetCare

### Telas definidas

1. Login
2. Cadastro de tutor
3. Cadastro de pet
4. Vacinas aplicadas e próximas doses
5. Consultas e atendimentos
6. Central de lembretes e cuidados

As ações de **Registrar Vacina**, **Agendar Nova Consulta** e **Criar Novo Lembrete** devem ser implementadas como **modal/popup**, e não como páginas independentes.

---

## 2. Objetivos

O frontend deve:

- reproduzir visualmente o Figma;
- utilizar componentes reutilizáveis;
- centralizar tokens e componentes no Design System;
- integrar-se ao backend real do projeto;
- apresentar estados de carregamento, vazio, erro e sucesso;
- validar formulários antes do envio;
- manter navegação consistente;
- proteger as áreas autenticadas;
- evitar duplicação de estilos e lógica.

---

## 3. Requisitos funcionais

### REQ-001 — Autenticação

O sistema deve permitir que o tutor:

- acesse a tela de login;
- informe e-mail;
- informe senha;
- envie as credenciais;
- receba feedback visual em caso de erro;
- seja direcionado para a área autenticada após autenticação válida;
- acesse a tela de cadastro;
- acesse o fluxo de recuperação de senha caso esse fluxo exista no backend.

O frontend não deve armazenar credenciais de forma insegura.

### REQ-002 — Cadastro de tutor

O sistema deve permitir cadastrar um tutor com os campos apresentados no Figma:

- CPF;
- e-mail;
- cidade;
- senha.

O formulário deve:

- validar campos obrigatórios;
- apresentar mensagens de validação;
- impedir envio de dados inválidos;
- apresentar estado de carregamento;
- apresentar sucesso ou erro retornado pelo backend;
- seguir o contrato da API para cadastro.

### REQ-003 — Cadastro de pet

O sistema deve permitir cadastrar um pet com:

- nome;
- data de nascimento;
- espécie;
- raça;
- observações.

Após salvar, o novo pet deve aparecer na área de pets conforme o contrato do backend.

### REQ-004 — Listagem e gerenciamento de pets

O usuário autenticado deve conseguir:

- visualizar seus pets;
- identificar o pet selecionado;
- acessar o cadastro de um novo pet;
- visualizar informações básicas do pet;
- utilizar os pets nas funcionalidades de vacinas, consultas e lembretes.

### REQ-005 — Vacinas

A área de vacinas deve permitir:

- visualizar histórico de imunização;
- visualizar pet;
- visualizar vacina;
- visualizar data de aplicação;
- visualizar próxima dose;
- visualizar observações;
- pesquisar vacina ou pet;
- filtrar por pet;
- registrar uma nova vacina.

### REQ-006 — Modal de Registrar Vacina

O botão `Registrar Vacina` deve abrir um modal.

O modal deve:

- seguir o Design System;
- permitir selecionar o pet;
- permitir informar a vacina;
- permitir informar a data de aplicação;
- permitir informar a próxima dose quando aplicável;
- permitir adicionar observações;
- validar os dados;
- exibir loading durante o envio;
- exibir erro retornado pelo backend;
- fechar após sucesso;
- atualizar a listagem sem reload manual.

Os nomes exatos dos campos, enums e regras devem respeitar o contrato do backend.

### REQ-007 — Consultas

A área de consultas deve permitir:

- visualizar consultas;
- visualizar pet;
- visualizar veterinário;
- visualizar data;
- visualizar horário;
- visualizar motivo;
- visualizar status;
- visualizar observações;
- pesquisar veterinário ou sintoma;
- filtrar consultas;
- agendar nova consulta.

### REQ-008 — Modal de Agendar Nova Consulta

O botão `Agendar Nova Consulta` deve abrir um modal.

O modal deve:

- seguir o Design System;
- permitir selecionar o pet;
- permitir selecionar/informar veterinário conforme o backend;
- permitir selecionar data;
- permitir selecionar horário;
- permitir informar motivo;
- permitir observações quando disponíveis;
- validar o formulário;
- apresentar loading;
- apresentar erro;
- confirmar o agendamento;
- fechar após sucesso;
- atualizar a lista de consultas.

O frontend não deve inventar disponibilidade de horários. Quando houver regra de disponibilidade no backend, os horários devem ser obtidos pela API.

### REQ-009 — Lembretes

A Central de Lembretes deve permitir:

- visualizar lembretes;
- organizar lembretes por categoria;
- pesquisar lembretes;
- filtrar lembretes;
- identificar pet relacionado;
- visualizar data limite;
- destacar lembretes próximos ou atrasados conforme regras definidas;
- criar novo lembrete.

Categorias presentes no Figma:

- Vacinas;
- Consultas;
- Remédios.

### REQ-010 — Modal de Criar Novo Lembrete

O botão `Criar Novo Lembrete` deve abrir um modal.

O modal deve:

- seguir o Design System;
- permitir selecionar categoria;
- permitir selecionar pet;
- permitir informar título;
- permitir informar data limite;
- permitir observações quando suportadas pelo backend;
- validar os campos;
- apresentar loading;
- apresentar erro;
- fechar após sucesso;
- atualizar a Central de Lembretes.

### REQ-011 — Navegação

A navegação autenticada deve conter:

- Início;
- Meus pets;
- Vacinas;
- Consultas;
- Lembretes.

O item ativo deve utilizar o estado visual definido no Figma.

### REQ-012 — Perfil

O layout autenticado deve exibir:

- avatar/iniciais;
- nome do tutor;
- indicação de perfil quando disponível;
- acesso às ações de usuário conforme o backend/produto.

### REQ-013 — Notificações

O cabeçalho deve possuir o ícone de notificações apresentado no Figma.

A implementação deve ficar preparada para consumir notificações reais caso o backend forneça esse recurso.

### REQ-014 — Estados da interface

Toda funcionalidade que consumir API deve tratar, quando aplicável:

- loading;
- sucesso;
- erro;
- estado vazio;
- estado preenchido.

### REQ-015 — Responsividade

O frontend deve funcionar em diferentes larguras de tela.

Em telas menores:

- a navegação deve adaptar-se;
- tabelas devem possuir comportamento adequado;
- modais não podem ultrapassar a viewport;
- formulários devem reorganizar seus campos;
- não deve existir overflow horizontal desnecessário.

---

## 4. Requisitos não funcionais

### RNF-001 — Tecnologia

- Angular;
- TypeScript;
- HTML;
- CSS/SCSS conforme a configuração existente;
- componentes reutilizáveis.

### RNF-002 — Design

O frontend deve utilizar o Design System documentado em:

`front/docs/design-system.md`

Não devem ser criados valores arbitrários de cor, espaçamento ou tipografia quando existir um token equivalente.

### RNF-003 — Figma

O Figma é a referência visual principal.

As decisões documentadas em `front/docs/figma.md` devem ser utilizadas durante a implementação.

### RNF-004 — Backend

A integração deve utilizar o contrato real disponibilizado pelo backend.

Não devem ser inventados:

- endpoints;
- nomes de campos;
- enums;
- regras de negócio;
- formatos de resposta.

Quando uma informação não estiver definida pelo backend, ela deve ser marcada como pendência de integração.

### RNF-005 — Segurança

Dados de autenticação e informações pessoais devem ser tratados conforme as regras definidas pelo backend.

O frontend não deve expor segredos ou credenciais no código-fonte.

### RNF-006 — Manutenibilidade

Código relacionado a:

- chamadas HTTP;
- modelos;
- autenticação;
- componentes;
- tokens visuais;
- validações;

deve permanecer organizado e reutilizável.

---

## 5. Critérios de aceite

Uma funcionalidade é considerada concluída quando:

1. a tela/fluxo corresponde ao Figma;
2. os componentes utilizam o Design System;
3. os dados são obtidos/enviados pelo serviço correspondente;
4. o contrato do backend é respeitado;
5. os estados de loading, erro, sucesso e vazio foram tratados quando aplicáveis;
6. os formulários possuem validação;
7. o fluxo funciona sem reload manual após operações de criação;
8. o comportamento responsivo foi verificado;
9. não existem erros de compilação;
10. os testes previstos para a funcionalidade passam.

---

## 6. Escopo explícito dos modais

Os seguintes fluxos **não devem criar páginas novas**:

- `Registrar Vacina`;
- `Agendar Nova Consulta`;
- `Criar Novo Lembrete`.

Eles devem ser componentes de modal reutilizáveis, abertos pelas respectivas páginas.

A estrutura visual dos modais deve ser criada a partir do Design System e do padrão das telas do Figma.
