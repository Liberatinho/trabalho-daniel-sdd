# Matriz de Rastreabilidade — PetCare

## Visão geral

A rastreabilidade é o princípio central do cc-sdd. Esta matriz conecta cada requisito ao seu design, tasks, código, testes e commits correspondentes.

## Matriz completa

### REQ-001: Cadastro de Usuários

| Fase     | Referência                                                                 |
|----------|---------------------------------------------------------------------------|
| Requisito| `requirements.md` → REQ-001                                               |
| Design   | `design.md` → User entity, UserService, UserController                    |
| Tasks    | TASK-002 (User model), TASK-008 (UserService), TASK-013 (UserController)  |
| Código   | `model/User.java`, `service/UserService.java`, `controller/UserController.java` |
| Teste    | `service/UserServiceTest.java`, `controller/UserControllerTest.java`      |
| Commit   | `feat(users): implement user registration and CRUD [REQ-001]`             |

### REQ-002: Cadastro de Pets

| Fase     | Referência                                                                 |
|----------|---------------------------------------------------------------------------|
| Requisito| `requirements.md` → REQ-002                                               |
| Design   | `design.md` → Pet entity, PetService, PetController, endpoints aninhados  |
| Tasks    | TASK-003 (Pet model), TASK-009 (PetService), TASK-014 (PetController)      |
| Código   | `model/Pet.java`, `service/PetService.java`, `controller/PetController.java` |
| Teste    | `service/PetServiceTest.java`, `controller/PetControllerTest.java`        |
| Commit   | `feat(pets): implement pet CRUD with ownership validation [REQ-002]`      |

### REQ-003: Histórico de Vacinas

| Fase     | Referência                                                                  |
|----------|-----------------------------------------------------------------------------|
| Requisito| `requirements.md` → REQ-003                                                 |
| Design   | `design.md` → Vaccine entity, VaccineService, endpoints aninhados           |
| Tasks    | TASK-004 (Vaccine model), TASK-010 (VaccineService), TASK-015 (VaccineController) |
| Código   | `model/Vaccine.java`, `service/VaccineService.java`, `controller/VaccineController.java` |
| Teste    | `service/VaccineServiceTest.java`, `controller/VaccineControllerTest.java`  |
| Commit   | `feat(vaccines): implement vaccine records with date validation [REQ-003]`  |

### REQ-004: Consultas Veterinárias

| Fase     | Referência                                                                       |
|----------|----------------------------------------------------------------------------------|
| Requisito| `requirements.md` → REQ-004                                                      |
| Design   | `design.md` → Consultation entity, ConsultationStatus enum, ConsultationService  |
| Tasks    | TASK-005 (Consultation model), TASK-011 (ConsultationService), TASK-016 (ConsultationController) |
| Código   | `model/Consultation.java`, `model/ConsultationStatus.java`, `service/ConsultationService.java`, `controller/ConsultationController.java` |
| Teste    | `service/ConsultationServiceTest.java`, `controller/ConsultationControllerTest.java` |
| Commit   | `feat(consultations): implement appointment scheduling with status rules [REQ-004]` |

### REQ-005: Lembretes de Cuidados

| Fase     | Referência                                                                    |
|----------|-------------------------------------------------------------------------------|
| Requisito| `requirements.md` → REQ-005                                                   |
| Design   | `design.md` → Reminder entity, ReminderType enum, ReminderService             |
| Tasks    | TASK-006 (Reminder model), TASK-012 (ReminderService), TASK-017 (ReminderController) |
| Código   | `model/Reminder.java`, `model/ReminderType.java`, `service/ReminderService.java`, `controller/ReminderController.java` |
| Teste    | `service/ReminderServiceTest.java`, `controller/ReminderControllerTest.java`  |
| Commit   | `feat(reminders): implement reminder system with filters [REQ-005]`           |

### REQ-006: Persistência de Dados

| Fase     | Referência                                                              |
|----------|-------------------------------------------------------------------------|
| Requisito| `requirements.md` → REQ-006                                             |
| Design   | `design.md` → H2 config, JPA repositories, DataInitializer              |
| Tasks    | TASK-007 (Repositories), TASK-019 (DataInitializer)                      |
| Código   | `repository/*.java`, `config/DataInitializer.java`, `application.yml`   |
| Teste    | Testes de integração usam H2 real                                        |
| Commit   | `feat(persistence): configure H2 database and sample data [REQ-006]`     |

### REQ-007: Tratamento de Erros

| Fase     | Referência                                                              |
|----------|-------------------------------------------------------------------------|
| Requisito| `requirements.md` → REQ-007                                             |
| Design   | `design.md` → GlobalExceptionHandler com @RestControllerAdvice          |
| Tasks    | TASK-018 (GlobalExceptionHandler)                                       |
| Código   | `exception/GlobalExceptionHandler.java`                                 |
| Teste    | Testes de controller verificam status codes (400, 403, 404)             |
| Commit   | `feat(errors): implement global exception handler [REQ-007]`            |

### REQ-008: Documentação da API

| Fase     | Referência                                                              |
|----------|-------------------------------------------------------------------------|
| Requisito| `requirements.md` → REQ-008                                             |
| Design   | `design.md` → springdoc-openapi, configuração em application.yml        |
| Tasks    | TASK-020 (Swagger config)                                               |
| Código   | `pom.xml` (dependência), `application.yml` (config)                     |
| Teste    | Verificação manual: acessar `/swagger-ui.html`                          |
| Commit   | `docs(api): configure Swagger/OpenAPI documentation [REQ-008]`          |

## Resumo visual

```
REQ-001 ──► User.java ──────────► UserServiceTest.java ────► commit feat(users)
REQ-002 ──► Pet.java ──────────► PetServiceTest.java ──────► commit feat(pets)
REQ-003 ──► Vaccine.java ──────► VaccineServiceTest.java ──► commit feat(vaccines)
REQ-004 ──► Consultation.java ─► ConsultationServiceTest ──► commit feat(consultations)
REQ-005 ──► Reminder.java ─────► ReminderServiceTest.java ─► commit feat(reminders)
REQ-006 ──► repositories + H2 ─► (testes de integração) ──► commit feat(persistence)
REQ-007 ──► GlobalExceptionHandler ► (testes de controller) ► commit feat(errors)
REQ-008 ──► Swagger config ────► (verificação manual) ─────► commit docs(api)
```

## Como usar esta matriz

1. **Durante a apresentação:** mostre como cada requisito foi implementado de ponta a ponta
2. **Na análise crítica:** discuta se a rastreabilidade facilitou ou dificultou o desenvolvimento
3. **Na verificação:** para cada REQ, confirme que código e teste existem
