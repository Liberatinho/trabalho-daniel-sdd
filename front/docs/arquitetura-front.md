# Arquitetura Frontend — PetCare

## Visão geral

O frontend do PetCare é responsável pela camada de apresentação e interação do sistema. Ele consome a API REST desenvolvida pelo backend e transforma seus recursos em telas, componentes e fluxos.

```text
┌─────────────────────────────────────────────┐
│                  Usuário                    │
└──────────────────┬──────────────────────────┘
                   │ interação
┌──────────────────▼──────────────────────────┐
│                  Pages                      │
│  - Organizam telas e fluxos                 │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│               Components                    │
│  - Elementos reutilizáveis                  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│             Services / API                  │
│  - Comunicação HTTP                         │
└──────────────────┬──────────────────────────┘
                   │ HTTP / JSON
┌──────────────────▼──────────────────────────┐
│                  Backend                    │
│  Controller → Service → Repository → H2     │
└─────────────────────────────────────────────┘
```

## Camadas explicadas

### 1. Pages

**Responsabilidade:** representar as telas completas.

**O que faz:**
- Organiza os componentes de uma tela
- Controla fluxos de navegação
- Solicita dados aos serviços
- Apresenta loading, error, success e empty states
- Navega para outras páginas

**O que NÃO faz:**
- Não deve concentrar componentes reutilizáveis
- Não deve espalhar chamadas HTTP pelo código
- Não deve duplicar regras de negócio do backend

Exemplos:
```text
Login
Register
Dashboard
Pets
PetDetails
PetCreate
PetEdit
Vaccines
Consultations
Reminders
```

### 2. Components

**Responsabilidade:** elementos reutilizáveis.

Exemplos:
```text
Button
Input
Select
Card
Modal
Navbar
Sidebar
PetCard
VaccineCard
ConsultationCard
ReminderCard
```

### 3. Services / API

**Responsabilidade:** centralizar a comunicação com o backend.

Exemplos conceituais:
```text
userService
petService
vaccineService
consultationService
reminderService
```

Os serviços devem encapsular as chamadas HTTP.

### 4. Estado da aplicação

Estados mínimos:
```text
Initial
Loading
Success
Empty
Error
```

Exemplo:
```text
Solicitação
    ↓
  Loading
    ↓
 ┌──┴──┐
 ↓     ↓
OK    Error
 ↓
Dados / Empty
```

## Comunicação com o backend

O backend utiliza URLs aninhadas:

```text
/api/users/{userId}/pets
/api/users/{userId}/pets/{petId}/vaccines
/api/users/{userId}/pets/{petId}/consultations
/api/users/{userId}/pets/{petId}/reminders
```

O frontend deve seguir o contrato definido pelo backend.

## Tratamento de respostas

| HTTP | Tratamento no frontend |
|---|---|
| 200 | Exibir resultado |
| 201 | Confirmar criação |
| 204 | Atualizar interface sem conteúdo |
| 400 | Exibir erro de validação/regra |
| 403 | Informar falta de acesso |
| 404 | Informar recurso não encontrado |
| 500 | Exibir erro genérico |

## Estrutura de diretórios

A estrutura definitiva depende da stack escolhida. Referência:

```text
front/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
├── public/
└── ...
```

## Princípios

- Reutilização
- Separação de responsabilidades
- Consistência visual
- Responsividade
- Acessibilidade
- Tratamento explícito de estados
- Comunicação centralizada com a API
- Não duplicação das regras de negócio
- Implementação orientada por requisitos, design, Figma e tasks
