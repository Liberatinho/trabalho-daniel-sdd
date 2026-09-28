# Discovery Frontend — PetCare

## O que é a fase Discovery?

A fase Discovery no cc-sdd é o ponto de partida para compreender o problema, o usuário, o escopo e a solução antes da implementação. No frontend, essa etapa transforma os objetivos do produto em uma experiência de uso clara e coerente com os requisitos definidos pelo projeto.

O backend já definiu o PetCare como uma API REST para gerenciamento de usuários, pets, vacinas, consultas veterinárias e lembretes. O frontend disponibiliza essas funcionalidades por meio de uma interface web.

## Problema identificado

Tutores de animais de estimação têm dificuldade em centralizar informações importantes sobre seus pets:
- Cartões de vacinação podem ser perdidos ou ficar desatualizados
- Consultas veterinárias podem ser esquecidas
- Lembretes de medicamentos e outros cuidados podem não ser registrados
- As informações ficam espalhadas
- Não existe uma interface única para visualizar e administrar o histórico de cada pet

## Solução proposta

O frontend do PetCare será uma aplicação web que permitirá ao tutor interagir com os recursos disponibilizados pela API do backend.

A interface deverá permitir:
1. Criar e acessar uma conta
2. Visualizar seus pets
3. Cadastrar, editar e consultar informações dos pets
4. Visualizar e registrar vacinas
5. Visualizar e administrar consultas veterinárias
6. Visualizar e administrar lembretes de cuidados
7. Receber feedback visual sobre operações, erros, carregamentos e estados vazios

## Objetivos do frontend

- Transformar as funcionalidades da API em uma experiência de uso simples
- Organizar as informações por pet
- Facilitar a visualização do histórico de cuidados
- Reduzir a quantidade de passos necessários para ações frequentes
- Manter consistência visual entre as telas
- Utilizar o Figma como referência para implementação
- Fornecer à IA contexto suficiente para implementar a interface

## Escopo

### Dentro do escopo
- Cadastro e login
- Dashboard
- Listagem, cadastro, detalhes e edição de pets
- Vacinas
- Consultas
- Lembretes
- Loading, empty, error e success states
- Navegação
- Integração com a API REST

### Fora do escopo
- Notificações push/email
- Upload de fotos
- Integração com clínicas externas
- JWT/OAuth, caso permaneça fora do escopo do MVP definido pelo grupo

## Entidades utilizadas

```text
User
 └── Pet
      ├── Vaccine
      ├── Consultation
      └── Reminder
```

## Principais fluxos

### Autenticação

```text
Login → Validação → Autenticação → Dashboard
```

### Gerenciamento de pets

```text
Dashboard
  ↓
Meus Pets
  ├── Cadastrar Pet
  └── Selecionar Pet
          ↓
       Detalhes
       ├── Vacinas
       ├── Consultas
       └── Lembretes
```

## Figma

O Figma será utilizado como referência visual e estrutural para a implementação. O protótipo deverá representar hierarquia visual, navegação, componentes, estados, responsividade e fluxos principais.

A implementação por IA deverá utilizar o Figma em conjunto com requisitos, design e tasks.

## Stack tecnológica confirmada

A stack já está definida no projeto e deve ser considerada a base para as próximas fases:

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | Angular 21 standalone | Compatível com a estrutura atual e com a separação por páginas e componentes |
| Linguagem | TypeScript 5.9 em modo estrito | Tipagem dos contratos da API e segurança durante a evolução do frontend |
| Estilização | CSS global e estilos por componente | Permite centralizar tokens e manter estilos próximos aos componentes |
| Build | Angular CLI 21 | Scripts `start`, `build` e `watch` já configurados |
| Testes | Vitest/jsdom via Angular CLI | Testes unitários de componentes e serviços em ambiente DOM |
| Reatividade | Signals e RxJS quando necessário | Estado local simples com integração adequada para chamadas HTTP |

## Estado atual do repositório

A descoberta foi comparada com o código existente em 25/09/2026:

- O projeto ainda está no scaffold inicial do Angular.
- `src/app/app.routes.ts` não possui rotas cadastradas.
- `src/app/app.html` ainda contém o template padrão do Angular.
- Ainda não existem páginas, componentes compartilhados, modelos ou serviços de domínio.
- A pasta `.kiro/specs/petcare/` possui requisitos e design, mas ainda não possui `tasks.md`.
- O contrato detalhado do backend não está presente neste frontend; endpoints, payloads, enums e regras de disponibilidade precisam ser confirmados antes da integração.

## Decisões e restrições descobertas

1. A navegação autenticada deve ser protegida e manter sidebar, header e perfil consistentes.
2. Vacinas, consultas e lembretes devem ser páginas próprias; os três fluxos de criação devem ser modais, sem rotas exclusivas.
3. Os dados exibidos no Figma são exemplos e não podem ser implementados como valores fixos.
4. Componentes visuais, tokens e validações devem ser reutilizados entre páginas e modais.
5. Cada operação dependente da API precisa representar loading, sucesso, erro e vazio quando aplicável.
6. O frontend não deve inventar contratos ou disponibilidade; pendências do backend devem permanecer explícitas.

## Lacunas e riscos

| Lacuna | Impacto | Próxima ação |
|---|---|---|
| Contrato real da API não está disponível no frontend | Bloqueia modelos, serviços e formulários confiáveis | Obter endpoints, payloads, respostas, autenticação e enums do backend |
| Tokens do Figma ainda são descritos conceitualmente | Pode causar divergência visual | Extrair valores definitivos e consolidá-los em `src/styles.css` |
| Fluxo de autenticação e persistência de sessão não está definido | Impede proteção de rotas | Confirmar mecanismo de sessão/token com o backend |
| Não há testes de domínio ou de componentes | Regressões não são detectadas | Criar testes junto com cada feature implementada |

## Próximos passos

1. Confirmar o contrato do backend e as decisões de autenticação.
2. Revisar requisitos e design da spec `petcare` à luz das lacunas encontradas.
3. Criar `tasks.md` com a decomposição por fundação, autenticação, layout, domínios e testes.
4. Implementar primeiro o shell, tokens e componentes compartilhados.
5. Implementar páginas e modais por domínio, validando cada fluxo contra a API.
6. Executar build, testes, verificação responsiva e rastreabilidade.
