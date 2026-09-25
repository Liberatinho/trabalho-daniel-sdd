# Matriz de Rastreabilidade — Frontend PetCare

## Visão geral

A rastreabilidade conecta os requisitos do produto às decisões de design, telas do Figma, tasks, componentes, código, testes e commits do frontend.

## Cadeia

```text
REQUISITO
    ↓
DESIGN
    ↓
FIGMA
    ↓
TASK FRONT
    ↓
PÁGINA / COMPONENTE
    ↓
CÓDIGO
    ↓
TESTE
    ↓
COMMIT
```

## REQ-001: Cadastro de Usuários

| Fase | Referência |
|---|---|
| Requisito | `.kiro/specs/petcare/requirements.md → REQ-001` |
| Design | `docs/frontend/arquitetura-front.md` |
| Figma | `Authentication → Register` |
| Task | `TASK-FRONT-001` |
| Código | Página de cadastro + formulário + service de usuário |
| Teste | Teste da tela/formulário e integração, conforme stack |
| Commit | `feat(front): implement user registration [REQ-001, TASK-FRONT-001]` |

## REQ-002: Cadastro de Pets

| Fase | Referência |
|---|---|
| Requisito | `.kiro/specs/petcare/requirements.md → REQ-002` |
| Design | `docs/frontend/arquitetura-front.md` |
| Figma | `Pets → List / Create / Details / Edit` |
| Task | `TASK-FRONT-002` |
| Código | Página de pets + PetCard + formulário + petService |
| Teste | Cadastro, listagem e estados |
| Commit | `feat(front): implement pet management [REQ-002, TASK-FRONT-002]` |

## REQ-003: Histórico de Vacinas

| Fase | Referência |
|---|---|
| Requisito | `.kiro/specs/petcare/requirements.md → REQ-003` |
| Design | `docs/frontend/arquitetura-front.md` |
| Figma | `Pet Details → Vaccines` |
| Task | `TASK-FRONT-003` |
| Código | Tela + componentes + vaccineService |
| Teste | Carregamento, cadastro e validação |
| Commit | `feat(front): implement vaccine history [REQ-003, TASK-FRONT-003]` |

## REQ-004: Consultas Veterinárias

| Fase | Referência |
|---|---|
| Requisito | `.kiro/specs/petcare/requirements.md → REQ-004` |
| Design | `docs/frontend/arquitetura-front.md` |
| Figma | `Pet Details → Consultations` |
| Task | `TASK-FRONT-004` |
| Código | Tela + componentes + consultationService |
| Teste | Listagem, criação e estados |
| Commit | `feat(front): implement consultations [REQ-004, TASK-FRONT-004]` |

## REQ-005: Lembretes de Cuidados

| Fase | Referência |
|---|---|
| Requisito | `.kiro/specs/petcare/requirements.md → REQ-005` |
| Design | `docs/frontend/arquitetura-front.md` |
| Figma | `Pet Details → Reminders` |
| Task | `TASK-FRONT-005` |
| Código | Tela + componentes + reminderService |
| Teste | Listagem, criação e conclusão |
| Commit | `feat(front): implement reminders [REQ-005, TASK-FRONT-005]` |

## REQ-006: Persistência de Dados

A persistência é responsabilidade do backend. O frontend participa da verificação por meio da leitura e atualização dos dados pela API.

| Fase | Referência |
|---|---|
| Requisito | `.kiro/specs/petcare/requirements.md → REQ-006` |
| Integração | Services do frontend |
| Verificação | Dados criados permanecem disponíveis após nova consulta |

## REQ-007: Tratamento de Erros

| Fase | Referência |
|---|---|
| Requisito | `.kiro/specs/petcare/requirements.md → REQ-007` |
| Design | Estados de erro |
| Figma | Estados de erro das telas |
| Task | Tasks das features |
| Código | Tratamento conforme arquitetura |
| Teste | HTTP 400, 403, 404 e 500 tratados visualmente |

## REQ-008: Documentação da API

O frontend utiliza a documentação Swagger/OpenAPI do backend como contrato de integração.

| Fase | Referência |
|---|---|
| Requisito | `.kiro/specs/petcare/requirements.md → REQ-008` |
| Fonte | Swagger/OpenAPI |
| Uso | Definição dos endpoints consumidos |
| Verificação | Requests correspondem ao contrato |

## Resumo visual

```text
REQ-001 ──► Register ────────► User Service ─────► teste ──► commit
REQ-002 ──► Pets ────────────► Pet Service ──────► teste ──► commit
REQ-003 ──► Vaccines ────────► Vaccine Service ──► teste ──► commit
REQ-004 ──► Consultations ───► Consultation ─────► teste ──► commit
REQ-005 ──► Reminders ───────► Reminder Service ─► teste ──► commit
REQ-007 ──► Error States ────► Components ───────► teste ──► commit
```

## Como usar

1. Identificar o requisito antes da task
2. Confirmar o fluxo no Figma
3. Implementar conforme design
4. Associar código e testes à task
5. Criar commit com REQ e TASK
6. Atualizar a matriz
7. Demonstrar uma cadeia completa na apresentação

## Exemplo completo

```text
REQ-002
  ↓
Design Frontend
  ↓
Figma — Pets / Create
  ↓
TASK-FRONT-002
  ↓
PetCreate
  ↓
PetForm
  ↓
petService
  ↓
POST /api/users/{userId}/pets
  ↓
Teste
  ↓
feat(front): implement pet management [REQ-002, TASK-FRONT-002]
```
