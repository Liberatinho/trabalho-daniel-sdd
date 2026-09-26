# Matriz de Rastreabilidade — PetCare

## Visão Geral

A rastreabilidade é o princípio central do **Spec-Driven Development (cc-sdd)**. Esta matriz conecta cada requisito funcional e não funcional ao seu design, tasks de implementação, arquivos de código-fonte, testes automatizados e commits no repositório Git.

---

## Matriz de Rastreabilidade Completa

### REQ-001: Cadastro de Usuários
| Dimensão | Referência |
|---|---|
| **Requisito** | `requirements.md` → REQ-001 (Cadastro e gestão de usuários) |
| **Design** | `design.md` → Entidade User, UserService, UserController |
| **Tasks** | `tasks.md` → TASK-002 (Model), TASK-008 (Service), TASK-013 (Controller) |
| **Código** | `model/User.java`, `repository/UserRepository.java`, `service/UserService.java`, `controller/UserController.java` |
| **Testes** | `service/UserServiceTest.java`, `controller/UserControllerTest.java` |
| **Commits** | `b2363d4` Add User management functionality... / `d466630` docs(tasks): sync completed User/Pet/Swagger tasks |

---

### REQ-002: Cadastro de Pets e Validação de Ownership
| Dimensão | Referência |
|---|---|
| **Requisito** | `requirements.md` → REQ-002 (Cadastro de pets, validações e isolamento de tutor) |
| **Design** | `design.md` → Entidade Pet, relacionamentos JPA, validação de ownership `getPetByIdAndUser` |
| **Tasks** | `tasks.md` → TASK-003 (Model), TASK-009 (Service), TASK-014 (Controller), TASK-021 (PetServiceTest), TASK-022 (PetControllerTest) |
| **Código** | `model/Pet.java`, `repository/PetRepository.java`, `service/PetService.java`, `controller/PetController.java` |
| **Testes** | `service/PetServiceTest.java` (12 testes unitários), `controller/PetControllerTest.java` (14 testes de integração) |
| **Commits** | `e269374` Add pet management functionality...<br>`c2809be` test(pets): add PetService unit tests for ownership [REQ-002]<br>`209f8ac` test(pets): add PetController integration tests [REQ-002]<br>`24399ce` docs(tasks): mark Pet tests as done [REQ-002] |

---

### REQ-003: Histórico de Vacinas
| Dimensão | Referência |
|---|---|
| **Requisito** | `requirements.md` → REQ-003 (Histórico de vacinação e regra de data da próxima dose) |
| **Design** | `design.md` → Entidade Vaccine, regra cronológica (`nextDoseDate >= applicationDate`), endpoints aninhados `/api/users/{userId}/pets/{petId}/vaccines` |
| **Tasks** | `tasks.md` → TASK-004 (Model), TASK-010 (Service), TASK-015 (Controller), TASK-021 (VaccineServiceTest), TASK-022 (VaccineControllerTest) |
| **Código** | `model/Vaccine.java`, `repository/VaccineRepository.java`, `service/VaccineService.java`, `controller/VaccineController.java` |
| **Testes** | `service/VaccineServiceTest.java`, `controller/VaccineControllerTest.java` |
| **Commits** | `0459a0c` feat(vaccines): add VaccineRepository with pet/ownership queries [REQ-003]<br>`6d72249` feat(vaccines): implement VaccineService with next-dose date rule [REQ-003]<br>`1a3e751` feat(vaccines): implement VaccineController with nested endpoints [REQ-003]<br>`d7d95de` test(vaccines): validate next-dose date rule and ownership [REQ-003]<br>`df350be` docs(tasks): mark vaccine tasks as done [REQ-003] |

---

### REQ-004: Consultas Veterinárias e Máquina de Estados
| Dimensão | Referência |
|---|---|
| **Requisito** | `requirements.md` → REQ-004 (Agendamento, status e máquina de estados de consultas) |
| **Design** | `design.md` → Entidade Consultation, enum ConsultationStatus (SCHEDULED, COMPLETED, CANCELLED), regras de transição de status |
| **Tasks** | `tasks.md` → TASK-005 (Model/Enum), TASK-011 (Service), TASK-016 (Controller), TASK-021 (ConsultationServiceTest), TASK-022 (ConsultationControllerTest) |
| **Código** | `model/Consultation.java`, `model/ConsultationStatus.java`, `repository/ConsultationRepository.java`, `service/ConsultationService.java`, `controller/ConsultationController.java` |
| **Testes** | `service/ConsultationServiceTest.java`, `controller/ConsultationControllerTest.java` |
| **Commits** | `819058b` feat(consultations): add Consultation entity and ConsultationStatus enum [REQ-004]<br>`06d9e79` feat(consultations): add ConsultationRepository with status/ownership queries [REQ-004]<br>`1e0802d` feat(consultations): implement ConsultationService with status transition rules [REQ-004]<br>`2760b89` feat(consultations): implement ConsultationController with optional status filter [REQ-004]<br>`f809bf1` test(consultations): add unit and integration tests validating status rules [REQ-004]<br>`bcefb2e` docs(tasks): mark consultation and error-handling tasks as done [REQ-004][REQ-007] |

---

### REQ-005: Lembretes de Cuidados e Filtros
| Dimensão | Referência |
|---|---|
| **Requisito** | `requirements.md` → REQ-005 (Lembretes com enum de tipos e status de conclusão) |
| **Design** | `design.md` → Entidade Reminder, enum ReminderType (VACCINE, CONSULTATION, MEDICATION, OTHER), filtros customizados |
| **Tasks** | `tasks.md` → TASK-006 (Model/Enum), TASK-012 (Service), TASK-017 (Controller), TASK-021 (ReminderServiceTest), TASK-022 (ReminderControllerTest) |
| **Código** | `model/Reminder.java`, `model/ReminderType.java`, `repository/ReminderRepository.java`, `service/ReminderService.java`, `controller/ReminderController.java` |
| **Testes** | `service/ReminderServiceTest.java`, `controller/ReminderControllerTest.java` |
| **Commits** | `e5c159b` feat(reminders): add ReminderRepository with type/completed filters [REQ-005]<br>`0b0e541` feat(reminders): implement ReminderService with ownership and filters [REQ-005]<br>`f4baa4f` feat(reminders): implement ReminderController with optional type/completed filters [REQ-005]<br>`ecd0dd6` test(reminders): validate filters and ownership [REQ-005]<br>`de7b133` docs(tasks): mark reminder tasks and repositories as done [REQ-005] |

---

### REQ-006: Persistência de Dados e Inicialização (DataInitializer)
| Dimensão | Referência |
|---|---|
| **Requisito** | `requirements.md` → REQ-006 (Banco H2 em memória, cascade e dados de demonstração) |
| **Design** | `design.md` → Configuração H2, JPA Hibernate ddl-auto, CommandLineRunner DataInitializer |
| **Tasks** | `tasks.md` → TASK-007 (Repositórios JPA), TASK-019 (DataInitializer) |
| **Código** | `resources/application.yml`, `config/DataInitializer.java`, `repository/*.java` |
| **Testes** | Testes de integração dos controllers e testes ponta a ponta com banco H2 em memória |
| **Commits** | `a83efda` feat(persistence): load sample users, pets, vaccines, consultations and reminders on startup [REQ-006]<br>`c4fdce7` docs(tasks): mark DataInitializer as done [REQ-006] |

---

### REQ-007: Tratamento Global de Erros
| Dimensão | Referência |
|---|---|
| **Requisito** | `requirements.md` → REQ-007 (Padronização de respostas de erro HTTP 400, 403, 404, 500) |
| **Design** | `design.md` → GlobalExceptionHandler com `@RestControllerAdvice` |
| **Tasks** | `tasks.md` → TASK-018 (GlobalExceptionHandler) |
| **Código** | `exception/GlobalExceptionHandler.java` |
| **Testes** | Testes de controllers (`UserControllerTest`, `PetControllerTest`, `VaccineControllerTest`, etc.) validando respostas 400, 403 e 404 |
| **Commits** | `d8f5225` feat(errors): implement GlobalExceptionHandler for consistent HTTP errors [REQ-007] |

---

### REQ-008: Documentação da API e Roteiro de Demonstração
| Dimensão | Referência |
|---|---|
| **Requisito** | `requirements.md` → REQ-008 (Documentação OpenAPI/Swagger interativa) |
| **Design** | `design.md` → springdoc-openapi, Swagger UI em `/swagger-ui.html` |
| **Tasks** | `tasks.md` → TASK-020 (Configuração Swagger), TASK-023 (Documentação final e roteiro de demo) |
| **Código / Docs** | `pom.xml`, `resources/application.yml`, `README.md`, `docs/demo-api.md`, `docs/rastreabilidade.md` |
| **Testes / Validação** | Verificação manual via Swagger UI e roteiro de 10 passos (`docs/demo-api.md`) |
| **Commits** | `05391fe` docs(backend): update README with run instructions, sample data and Swagger [TASK-023] |

---

### Suporte a CORS (Front-end Integration)
| Dimensão | Referência |
|---|---|
| **Objetivo** | Liberar integração com SPA frontend (Angular) em `http://localhost:4200` e `http://127.0.0.1:4200` |
| **Design** | `WebMvcConfigurer` com mapeamento `/**`, suporte a preflight (`OPTIONS`), headers e credenciais |
| **Código** | `config/CorsConfig.java`, `resources/application.yml` |
| **Testes** | `config/CorsConfigTest.java` (requisições origin, preflight e rejeição de domínios externos) |
| **Commit** | `97aa49d` feat(backend): configure CORS for frontend at localhost:4200 |

---

## Resumo Visual da Rastreabilidade

```
[REQ-001: Usuários]    ──► User.java / UserService.java       ──► UserServiceTest / UserControllerTest       ──► b2363d4 / d466630
[REQ-002: Pets]        ──► Pet.java / PetService.java         ──► PetServiceTest / PetControllerTest         ──► e269374 / c2809be / 209f8ac
[REQ-003: Vacinas]     ──► Vaccine.java / VaccineService.java ──► VaccineServiceTest / VaccineControllerTest ──► 0459a0c / 6d72249 / 1a3e751 / d7d95de
[REQ-004: Consultas]   ──► Consultation.java / Service.java   ──► ConsultationServiceTest / ControllerTest   ──► 819058b / 06d9e79 / 1e0802d / 2760b89
[REQ-005: Lembretes]   ──► Reminder.java / Service.java       ──► ReminderServiceTest / ControllerTest       ──► e5c159b / 0b0e541 / f4baa4f / ecd0dd6
[REQ-006: Persistência]──► H2 / DataInitializer.java          ──► Inicialização e testes de integração       ──► a83efda / c4fdce7
[REQ-007: Erros]       ──► GlobalExceptionHandler.java        ──► Asserções HTTP 400/403/404 nos controllers  ──► d8f5225 / bcefb2e
[REQ-008: Swagger/Doc] ──► springdoc / demo-api.md / README   ──► Swagger UI (/swagger-ui.html)              ──► 05391fe
[CORS: Front-end]      ──► CorsConfig.java / application.yml  ──► CorsConfigTest                             ──► 97aa49d
```

---

## Conclusão da Rastreabilidade no cc-sdd

Todos os 8 requisitos do sistema e as necessidades de infraestrutura (CORS e Carga Inicial) encontram-se 100% implementados, testados (84 testes automatizados com 100% de sucesso) e versionados com commits atômicos descritivos no Git.
