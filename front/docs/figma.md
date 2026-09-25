# PetCare — Referência do Figma

## 1. Arquivo

Figma:

https://www.figma.com/design/qFd4D4pCennpiUsKauNZct/PetCare

O Figma é a referência visual para a implementação do frontend.

---

## 2. Telas existentes

### Login

A tela possui:

- painel lateral azul-petróleo;
- logo PetCare;
- mensagem institucional;
- indicadores visuais;
- card de login;
- badge `Acesso Restrito`;
- campo de e-mail;
- campo de senha;
- link `Esqueci minha senha`;
- botão `Entrar`;
- link para cadastro.

### Cadastro de tutor

A tela possui:

- painel lateral;
- badge `Novo cadastro`;
- título `Crie sua conta de tutor`;
- CPF;
- e-mail;
- cidade;
- senha;
- texto de termos;
- botão `Criar conta`;
- link para login.

### Cadastro de pet

A tela possui:

- sidebar;
- cabeçalho;
- título `Cadastrar novo pet`;
- descrição;
- lista de pets existentes;
- botão/atalho para adicionar;
- nome;
- data de nascimento;
- espécie;
- raça;
- observações;
- botão `Cancelar`;
- botão `Salvar cadastro`.

### Vacinas

A tela possui:

- título `Vacinas Aplicadas & Próximas Doses`;
- busca;
- filtro por pet;
- botão `Registrar Vacina`;
- card `Histórico de Imunização`;
- tabela com:
  - Pet;
  - Vacina;
  - Data de Aplicação;
  - Próxima Dose;
  - Observações.

### Consultas

A tela possui:

- título `Consultas e Atendimentos`;
- busca;
- filtro;
- botão `Agendar Nova Consulta`;
- card `Agenda Veterinária`;
- tabela com:
  - Pet;
  - Veterinário(a);
  - Data;
  - Horário;
  - Motivo;
  - Status;
  - Observações.

### Lembretes

A tela possui:

- título `Central de Lembretes & Cuidados`;
- busca;
- filtro;
- botão `Criar Novo Lembrete`;
- colunas/cards por categoria:
  - Vacinas;
  - Consultas;
  - Remédios.

Cada lembrete apresenta:

- título;
- pet;
- data limite.

---

## 3. Comportamento dos botões de criação

Os três botões abaixo abrem **modais**:

### Registrar Vacina

Localizado na página de Vacinas.

Não criar uma rota/página exclusiva para esse fluxo.

### Agendar Nova Consulta

Localizado na página de Consultas.

Não criar uma rota/página exclusiva para esse fluxo.

### Criar Novo Lembrete

Localizado na Central de Lembretes.

Não criar uma rota/página exclusiva para esse fluxo.

---

## 4. Regra para implementação

O frontend deve seguir o Figma em:

- hierarquia;
- espaçamento;
- tipografia;
- cores;
- bordas;
- raios;
- componentes;
- posicionamento;
- estados visuais.

Quando o backend exigir um campo que não esteja representado exatamente no Figma, o campo deve ser incorporado sem quebrar o padrão visual.

Quando houver conflito entre uma regra visual e uma regra de negócio do backend, a regra de negócio deve ser respeitada e a apresentação deve continuar seguindo o Design System.

---

## 5. Conteúdo de exemplo

Os nomes como:

- Simba;
- Luna;
- Mari Luna;
- Dr. Renato Silva;
- Dra. Clara Costa;

presentes nas telas devem ser tratados como dados de exemplo/mock.

Não devem ser codificados como valores fixos na aplicação.

---

## 6. Próximas telas

Caso novas telas sejam adicionadas ao Figma, elas devem:

1. reutilizar o Design System;
2. ser documentadas neste arquivo;
3. ser adicionadas aos requisitos;
4. ser implementadas como componentes/páginas reutilizáveis;
5. manter o mesmo padrão visual do projeto.
