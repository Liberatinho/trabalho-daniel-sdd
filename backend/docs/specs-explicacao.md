# Especificações (Specs) — O que são e como usar

## Visão geral

No cc-sdd, as **specs** são artefatos de documentação que vivem dentro de `.kiro/specs/`. Elas guiam o desenvolvimento do conceito ao código, garantindo rastreabilidade entre o que foi planejado e o que foi implementado.

## Estrutura de diretórios

```
.kiro/
└── specs/
    └── petcare/
        ├── brief.md          # Visão geral do projeto
        ├── requirements.md   # Requisitos funcionais com critérios de aceite
        ├── design.md         # Arquitetura, modelo de dados, decisões
        └── tasks.md          # Decomposição em tarefas com rastreabilidade
```

## Artefatos e suas funções

### 1. `brief.md` — O resumo executivo

**O que é:** Uma página que resume o problema, a solução e o escopo.

**Quando usar:** No início do projeto, para alinhar o grupo sobre o que está sendo construído.

**Conteúdo típico:**
- Problema que o projeto resolve
- Solução proposta (alto nível)
- Escopo (dentro e fora)
- Stack tecnológica
- Entregáveis esperados

### 2. `requirements.md` — Os requisitos funcionais

**O que é:** Lista de requisitos numerados (REQ-001, REQ-002, ...) com critérios de aceite observáveis.

**Quando usar:** Depois do brief, para detalhar o que cada funcionalidade deve fazer.

**Estrutura de cada requisito:**
```markdown
## REQ-XXX: Nome da funcionalidade
**Descrição:** O sistema deve...

**Critérios de Aceite:**
- Critério 1 (observável e testável)
- Critério 2

**Validações:**
- Cenário de erro 1 → código HTTP
- Cenário de erro 2 → código HTTP
```

**Requisitos do PetCare:**
| ID       | Funcionalidade           | Critérios de aceite |
|----------|--------------------------|---------------------|
| REQ-001  | Cadastro de Usuários     | 4                   |
| REQ-002  | Cadastro de Pets         | 5                   |
| REQ-003  | Histórico de Vacinas     | 6                   |
| REQ-004  | Consultas Veterinárias   | 6                   |
| REQ-005  | Lembretes                | 5                   |
| REQ-006  | Persistência de Dados    | 4                   |
| REQ-007  | Tratamento de Erros      | 5                   |
| REQ-008  | Documentação da API      | 4                   |

### 3. `design.md` — A arquitetura

**O que é:** Documento que descreve como o sistema será construído: camadas, modelo de dados, decisões técnicas.

**Quando usar:** Depois dos requirements, para guiar a implementação.

**Conteúdo típico:**
- Diagrama de arquitetura (em texto)
- Modelo de dados com tipos e relacionamentos
- Estrutura de diretórios
- Decisões de design (com justificativa)
- Fluxos principais

### 4. `tasks.md` — A decomposição em tarefas

**O que é:** Lista de tarefas (TASK-001, TASK-002, ...) com referência aos requisitos que atendem.

**Quando usar:** Depois do design, para organizar a implementação.

**Estrutura de cada tarefa:**
```markdown
## TASK-XXX: Título
**Status:** Pendente / ⏳ Pendente
**Requisitos:** REQ-XXX
**Descrição:** O que fazer
**Entregáveis:**
- [ ] Item 1
- [ ] Item 2
```

## Rastreabilidade

A rastreabilidade é o coração do cc-sdd. Cada funcionalidade deve poder ser seguida através da cadeia:

```
REQUISITO → DESIGN → TASK → CÓDIGO → TESTE → COMMIT
```

### Exemplo prático: Cadastro de Vacinas

| Fase         | Artefato                        | Referência                |
|--------------|---------------------------------|---------------------------|
| Requisito    | `requirements.md`              | REQ-003: Histórico de Vacinas |
| Design       | `design.md`                    | Vaccine entity, VaccineService, endpoints aninhados |
| Task         | `tasks.md`                     | TASK-010 (VaccineService), TASK-015 (VaccineController) |
| Código       | `Vaccine.java`, `VaccineService.java`, `VaccineController.java` | `src/main/java/com/petcare/` |
| Teste        | `VaccineServiceTest.java`, `VaccineControllerTest.java` | `src/test/java/com/petcare/` |
| Commit       | `feat(vaccines): implement vaccine records [TASK-010]` | `git log` |

## Como consultar as specs

1. **Abrir o brief** para entender o contexto geral
2. **Ler os requirements** para saber o que o sistema deve fazer
3. **Consultar o design** para entender como foi construído
4. **Verificar as tasks** para saber o que foi feito e o que falta
5. **Usar a matriz de rastreabilidade** (`docs/rastreabilidade.md`) para conectar tudo
