# PetCare — Diretrizes de Design do Frontend

## 1. Fonte visual

A referência visual do projeto é o Figma:

https://www.figma.com/design/qFd4D4pCennpiUsKauNZct/PetCare

O frontend deve reproduzir a linguagem visual existente antes de introduzir novos padrões.

---

## 2. Identidade visual

O PetCare utiliza uma identidade:

- acolhedora;
- limpa;
- profissional;
- relacionada a cuidado e saúde animal;
- com bastante espaço em branco;
- com cantos arredondados;
- com contraste entre azul-petróleo e fundo creme;
- com verde/azul-esverdeado como cor de apoio;
- com destaque pontual em coral para situações de atenção.

---

## 3. Layout autenticado

As telas internas possuem:

- sidebar;
- área principal de conteúdo;
- cabeçalho com notificações e perfil;
- título da página;
- descrição opcional;
- filtros e ações;
- cards e/ou tabelas;
- fundo claro.

## 4. Layout de autenticação

Login e cadastro possuem:

- painel lateral escuro;
- identidade PetCare;
- mensagem institucional;
- formulário em card claro;
- bordas arredondadas;
- sombra suave.

---

## 5. Componentes reutilizáveis

O frontend deve priorizar componentes para:

- Button;
- Input;
- Select;
- Date Input;
- Textarea;
- Modal;
- Badge/Status;
- Card;
- Table;
- Search;
- Sidebar;
- Header;
- Avatar;
- Empty State;
- Loading;
- Alert/Feedback.

Não criar versões duplicadas do mesmo componente para páginas diferentes sem necessidade.

---

## 6. Modais

Os três fluxos abaixo devem utilizar o mesmo componente-base de modal:

- Registrar Vacina;
- Agendar Nova Consulta;
- Criar Novo Lembrete.

O conteúdo interno muda, mas o comportamento visual deve permanecer consistente.

Todo modal deve possuir:

- título;
- descrição quando necessária;
- conteúdo/formulário;
- ação primária;
- ação secundária/cancelar;
- fechamento controlado;
- estado de loading;
- tratamento de erro;
- limite de altura com scroll interno quando necessário.

---

## 7. Tabelas

As telas de Vacinas e Consultas utilizam tabelas como padrão de apresentação.

A tabela deve:

- manter cabeçalho visualmente claro;
- permitir leitura confortável;
- possuir separadores discretos;
- apresentar estados vazios;
- adaptar-se a telas menores.

---

## 8. Formulários

Os formulários devem:

- apresentar label;
- apresentar placeholder quando útil;
- indicar campo obrigatório quando necessário;
- mostrar mensagens de erro próximas ao campo;
- manter espaçamento consistente;
- utilizar os componentes do Design System.

---

## 9. Acessibilidade

O frontend deve:

- utilizar labels associados aos campos;
- possuir foco visível;
- permitir navegação por teclado;
- utilizar nomes acessíveis para ícones e botões;
- não depender somente de cor para comunicar estados;
- manter contraste adequado.

---

## 10. Regra de consistência

Antes de criar um novo componente visual, verificar se o Design System já possui um componente equivalente.

Antes de criar uma nova cor, espaçamento, tamanho de fonte ou raio, verificar os tokens existentes.
