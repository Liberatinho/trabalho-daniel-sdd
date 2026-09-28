# Fluxo cc-sdd aplicado ao Frontend — PetCare

## O que é o cc-sdd?

O **cc-sdd** (Claude Code Spec-Driven Development) estrutura o desenvolvimento em fases e cria artefatos que conectam planejamento e implementação.

No frontend do PetCare, o Figma é incorporado ao processo como referência central da experiência visual.

## Fluxo

```text
Discovery
    ↓
Specification
    ↓
Requirements
    ↓
Design
    ↓
Figma
    ↓
Tasks
    ↓
Implementation
    ↓
Verification
```

## Fase 1: Discovery

**Objetivo:** compreender problema, usuário e escopo do frontend.

**Artefato:**
```text
docs/frontend/discovery-front.md
```

O backend já definiu entidades, funcionalidades do MVP, API REST, regras de domínio e URLs. O frontend transforma essas definições em experiência de usuário.

## Fase 2: Specification

### Requirements

Os requisitos gerais continuam sendo os requisitos do produto. O frontend detalha como cada requisito será atendido pela interface.

Exemplo:

```text
REQ-002 — Cadastro de Pets
        ↓
Tela de cadastro
        ↓
Formulário + validação
        ↓
POST /api/users/{userId}/pets
        ↓
Feedback de sucesso/erro
```

### Design

Documenta:
- Arquitetura de componentes
- Estrutura das páginas
- Navegação
- Comunicação com API
- Estados da interface
- Responsividade
- Acessibilidade
- Decisões relacionadas ao Figma

### Figma

O Figma representa visualmente a solução. Ele complementa os requisitos e o design técnico.

### Tasks

As tasks transformam requisitos e design em unidades implementáveis.

```text
REQ-002
  ↓
Design
  ↓
Figma — Cadastro de Pet
  ↓
TASK-FRONT-002
  ↓
Implementação
```

## Fase 3: Implementation

Cada task deve ser implementada de forma isolada sempre que possível.

```text
TASK-FRONT-002
    ↓
Página
    ↓
Componentes
    ↓
Service
    ↓
Validações
    ↓
Estados
    ↓
Testes
    ↓
Commit
```

## Uso de IA

A IA deve receber:

```text
Requisito
   +
Design
   +
Figma
   +
Task
   +
Contrato da API
   ↓
  IA
   ↓
Código
```

Exemplo:

```text
Implemente a TASK-FRONT-002.

Utilize o requisito REQ-002, o design do frontend,
a tela correspondente no Figma e o contrato da API.

Não altere funcionalidades fora do escopo da task.
Mantenha componentes reutilizáveis e trate loading,
sucesso, vazio e erro.
```

## Fase 4: Verification

Verificar:
1. A tela corresponde ao Figma
2. O fluxo atende ao requisito
3. A API é consumida corretamente
4. Os estados foram tratados
5. Os testes funcionam
6. O código está integrado
7. O commit referencia task e requisito

## Rastreabilidade

```text
REQ
 ↓
DESIGN
 ↓
FIGMA
 ↓
TASK
 ↓
PÁGINA / COMPONENTE
 ↓
CÓDIGO
 ↓
TESTE
 ↓
COMMIT
```

## Estratégia de commits

```text
feat(front): <descrição> [REQ-XXX, TASK-FRONT-XXX]
```

Exemplos:
```text
feat(front): implement pet registration [REQ-002, TASK-FRONT-002]
feat(front): implement vaccine history [REQ-003, TASK-FRONT-003]
test(front): add pet registration tests [REQ-002, TASK-FRONT-002]
docs(front): document frontend architecture
```
