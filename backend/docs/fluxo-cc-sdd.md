# Fluxo cc-sdd aplicado ao PetCare

## O que é o cc-sdd?

O **cc-sdd** (Claude Code Spec-Driven Development) é uma abordagem de desenvolvimento que estrutura o processo em fases bem definidas, com artefatos de documentação em cada etapa. O objetivo é garantir **rastreabilidade** entre o que foi planejado e o que foi implementado.

## As 4 fases do cc-sdd

```
Discovery ──► Specification ──► Implementation ──► Verification
    │              │                  │                  │
    │              │                  │                  │
  brief.md    requirements.md    código + testes    git log
              design.md           (commits           testes
              tasks.md            atômicos)          executando
```

## Fase 1: Discovery

**Objetivo:** Entender o problema e definir o escopo.

**Artefato gerado:** `brief.md`

**O que fizemos no PetCare:**
1. Identificamos o problema: tutores não têm onde centralizar info dos pets
2. Definimos a solução: API REST para gestão de pets
3. Listamos as 5 funcionalidades principais
4. Decidimos a stack: Spring Boot + H2
5. Definimos o que está dentro e fora do escopo

**Arquivo:** `.kiro/specs/petcare/brief.md` e `docs/discovery.md`

## Fase 2: Specification

**Objetivo:** Detalhar o que construir e como.

**Artefatos gerados:**
- `requirements.md` — requisitos funcionais com critérios de aceite
- `design.md` — arquitetura, modelo de dados, decisões
- `tasks.md` — decomposição em tarefas com rastreabilidade

### 2.1 Requirements

Para cada funcionalidade, definimos:
- **Descrição:** o que o sistema deve fazer
- **Critérios de aceite:** como saber que está pronto (observável)
- **Validações:** o que acontece em cenários de erro

**Exemplo — REQ-003 (Vacinas):**
```
Critérios de aceite:
- Vacina deve estar associada a um pet existente
- Nome da vacina é obrigatório
- Data de aplicação é obrigatória
- Próxima dose não pode ser anterior à data de aplicação

Validações:
- Pet inexistente → erro 404
- Pet não pertence ao usuário → erro 403
- Próxima dose inválida → erro 400
```

### 2.2 Design

Documentamos:
- Arquitetura em camadas (Controller → Service → Repository → DB)
- Modelo de dados com tipos, validações e relacionamentos
- Padrão de URL aninhada
- Tratamento de exceções
- Fluxos principais

### 2.3 Tasks

Decompondo em tarefas implementáveis, cada uma com:
- ID único (TASK-001, TASK-002, ...)
- Referência aos requisitos que atende
- Lista de entregáveis verificáveis
- Status (concluído / pendente)

## Fase 3: Implementation

**Objetivo:** Escrever código e testes.

**Princípio:** Commits atômicos, um por feature, com referência à task e ao requisito.

### Ordem de implementação por feature

Cada feature segue a mesma sequência:

```
1. Model (entidade JPA)
2. Repository (interface Spring Data)
3. Service (regras de negócio)
4. Controller (endpoint REST)
5. Teste do Service (unitário)
6. Commit atômico
```

### Estratégia de commits

Cada commit segue o padrão:
```
feat(<feature>): <descrição> [REQ-XXX, TASK-XXX]
```

**Exemplos reais do PetCare:**

```
chore: initialize project structure [TASK-001]
feat(spec): define brief, requirements, design and tasks
feat(users): implement user entity, repository and service [REQ-001]
feat(users): implement user REST controller [REQ-001, TASK-013]
test(users): implement user service and controller tests [REQ-001]
feat(pets): implement pet entity, repository and service [REQ-002]
feat(pets): implement pet REST controller [REQ-002, TASK-014]
test(pets): implement pet service and controller tests [REQ-002]
feat(vaccines): implement vaccine entity, repository and service [REQ-003]
feat(vaccines): implement vaccine REST controller [REQ-003, TASK-015]
test(vaccines): implement vaccine tests [REQ-003]
feat(consultations): implement consultation entity, repository and service [REQ-004]
feat(consultations): implement consultation REST controller [REQ-004, TASK-016]
test(consultations): implement consultation tests [REQ-004]
feat(reminders): implement reminder entity, repository and service [REQ-005]
feat(reminders): implement reminder REST controller [REQ-005, TASK-017]
test(reminders): implement reminder tests [REQ-005]
feat(errors): implement global exception handler [REQ-007, TASK-018]
feat(persistence): configure H2 and sample data [REQ-006, TASK-019]
docs(api): configure Swagger/OpenAPI [REQ-008]
docs: add architecture and traceability documentation
```

## Fase 4: Verification

**Objetivo:** Confirmar que tudo funciona e a rastreabilidade está intacta.

**Como verificar:**
1. Rodar testes: `mvn test`
2. Iniciar aplicação: `mvn spring-boot:run`
3. Acessar Swagger: `http://localhost:8080/swagger-ui.html`
4. Testar endpoints manualmente
5. Verificar `git log --oneline` — cada commit deve referenciar um REQ
6. Consultar `docs/rastreabilidade.md` para conferir a cadeia completa

## Rastreabilidade na prática

Para a funcionalidade de Vacinas (REQ-003):

```
REQ-003 (requirements.md)
    │
    ├──► Vaccine.java (model)
    ├──► VaccineRepository.java (repository)
    ├──► VaccineService.java (service — valida nextDoseDate)
    ├──► VaccineController.java (controller — endpoints aninhados)
    ├──► VaccineServiceTest.java (teste — valida regra da próxima dose)
    ├──► VaccineControllerTest.java (teste — valida HTTP 201)
    └──► commit: "feat(vaccines): implement vaccine records [REQ-003]"
```

## O que o trabalho acadêmico exige

Conforme o guia cc-sdd, a entrega deve incluir:

| Item                              | Onde encontrar                          |
|-----------------------------------|-----------------------------------------|
| Problema definido                 | `brief.md`, `docs/discovery.md`         |
| Funcionalidades relevantes (≥3)   | `requirements.md` (5 funcionalidades)   |
| Persistência de dados             | H2 + JPA, `application.yml`             |
| Regras de negócio                 | Services, `docs/arquitetura.md`         |
| Validações                        | Bean Validation + Services              |
| Aplicação funcional               | `mvn spring-boot:run`                   |
| Artefatos do cc-sdd              | `.kiro/specs/petcare/`                  |
| Requirements documentados         | `requirements.md`                       |
| Design documentado                | `design.md`                             |
| Tasks documentadas                | `tasks.md`                              |
| Testes preservados                | `src/test/java/com/petcare/`            |
| Histórico Git coerente            | `git log --oneline`                     |
| Commits relacionados às tasks     | cada commit tem `[REQ-XXX, TASK-XXX]`  |
| Rastreabilidade                   | `docs/rastreabilidade.md`               |
| Documentação explicativa          | `docs/`                                 |

## Análise crítica (sugestões para o grupo)

### Pontos positivos do cc-sdd
- Estrutura clara: sabe exatamente o que fazer em cada fase
- Rastreabilidade facilita justificar decisões na apresentação
- Artefatos servem como documentação do projeto
- Commits atômicos criam um histórico legível

### Dificuldades encontradas
- Curva de aprendizado do fluxo (entender brief → req → design → tasks)
- Tentação de implementar tudo de uma vez em vez de seguir o fluxo
- Manter a rastreabilidade requer disciplina

### Onde o cc-sdd agregou mais valor
- Na fase de Specification: forçou pensar nos critérios de aceite antes de codar
- Na rastreabilidade: facilitou identificar gaps entre planejado e implementado
- Na organização dos commits: histórico conta a história do projeto
