# PetCare - Tarefas de Implementação

## TASK-001: Configuração Inicial do Projeto
**Status:** Concluído
**Requisitos:** Todos
**Descrição:** Configurar estrutura do projeto Spring Boot com Maven, dependências e configurações básicas.
**Entregáveis:**
- [X] pom.xml com todas as dependências
- [X] application.yml configurado
- [X] PetCareApplication.java criado
- [X] .gitignore configurado

## TASK-002: Modelo de Dados - User
**Status:** Pendente
**Requisitos:** REQ-001
**Descrição:** Implementar entidade User com validações e relacionamento com Pet.
**Entregáveis:**
- [X] User.java com anotações JPA
- [X] Validações com Bean Validation
- [X] Métodos addPet() e removePet()

## TASK-003: Modelo de Dados - Pet
**Status:** Pendente
**Requisitos:** REQ-002
**Descrição:** Implementar entidade Pet com relacionamentos e validações.
**Entregáveis:**
- [ ] Pet.java com todas as propriedades
- [X] Relacionamento ManyToOne com User
- [X] Relacionamentos OneToMany com Vaccine, Consultation, Reminder

## TASK-004: Modelo de Dados - Vaccine
**Status:** Pendente
**Requisitos:** REQ-003
**Descrição:** Implementar entidade Vaccine com validações.
**Entregáveis:**
- [ ] Vaccine.java com todas as propriedades
- [ ] Relacionamento ManyToOne com Pet
- [ ] Validações de campos obrigatórios

## TASK-005: Modelo de Dados - Consultation
**Status:** Concluído
**Requisitos:** REQ-004
**Descrição:** Implementar entidade Consultation com enum de status.
**Entregáveis:**
- [X] Consultation.java com todas as propriedades
- [X] ConsultationStatus enum (SCHEDULED, COMPLETED, CANCELLED)
- [X] Relacionamento ManyToOne com Pet

## TASK-006: Modelo de Dados - Reminder
**Status:** Pendente
**Requisitos:** REQ-005
**Descrição:** Implementar entidade Reminder com enum de tipo.
**Entregáveis:**
- [ ] Reminder.java com todas as propriedades
- [ ] ReminderType enum (VACCINE, CONSULTATION, MEDICATION, OTHER)
- [ ] Relacionamento ManyToOne com Pet

## TASK-007: Repositórios JPA
**Status:** Pendente
**Requisitos:** REQ-006
**Descrição:** Implementar interfaces de repositório para todas as entidades.
**Entregáveis:**
- [ ] UserRepository com findByEmail() e existsByEmail()
- [ ] PetRepository com findByUserId() e existsByIdAndUserId()
- [ ] VaccineRepository com findByPetId() e existsByIdAndPetId()
- [ ] ConsultationRepository com métodos customizados
- [ ] ReminderRepository com métodos de filtro

## TASK-008: UserService
**Status:** Pendente
**Requisitos:** REQ-001
**Descrição:** Implementar camada de serviço para User com regras de negócio.
**Entregáveis:**
- [ ] CRUD completo de usuários
- [ ] Validação de email único
- [ ] Tratamento de EntityNotFoundException

## TASK-009: PetService
**Status:** Pendente
**Requisitos:** REQ-002
**Descrição:** Implementar camada de serviço para Pet com validação de ownership.
**Entregáveis:**
- [ ] CRUD completo de pets
- [ ] Validação de ownership (getPetByIdAndUser)
- [ ] Associação automática com usuário

## TASK-010: VaccineService
**Status:** Pendente
**Requisitos:** REQ-003
**Descrição:** Implementar camada de serviço para Vaccine com validações.
**Entregáveis:**
- [ ] CRUD completo de vacinas
- [ ] Validação de ownership
- [ ] Validação de próxima dose (não pode ser anterior à aplicação)

## TASK-011: ConsultationService
**Status:** Concluído
**Requisitos:** REQ-004
**Descrição:** Implementar camada de serviço para Consultation com validação de transição de status.
**Entregáveis:**
- [X] CRUD completo de consultas
- [X] Validação de ownership
- [X] Validação de transição de status
- [X] Consulta cancelada não pode ser alterada
- [X] Consulta realizada não pode voltar para agendada

## TASK-012: ReminderService
**Status:** Pendente
**Requisitos:** REQ-005
**Descrição:** Implementar camada de serviço para Reminder com filtros.
**Entregáveis:**
- [ ] CRUD completo de lembretes
- [ ] Validação de ownership
- [ ] Filtros por tipo e status de conclusão

## TASK-013: UserController
**Status:** Pendente
**Requisitos:** REQ-001
**Descrição:** Implementar controller REST para User.
**Entregáveis:**
- [ ] POST /api/users
- [ ] GET /api/users/{id}
- [ ] GET /api/users/email/{email}
- [ ] GET /api/users
- [ ] PUT /api/users/{id}
- [ ] DELETE /api/users/{id}

## TASK-014: PetController
**Status:** Pendente
**Requisitos:** REQ-002
**Descrição:** Implementar controller REST para Pet com endpoints aninhados.
**Entregáveis:**
- [ ] POST /api/users/{userId}/pets
- [ ] GET /api/users/{userId}/pets/{id}
- [ ] GET /api/users/{userId}/pets
- [ ] PUT /api/users/{userId}/pets/{id}
- [ ] DELETE /api/users/{userId}/pets/{id}

## TASK-015: VaccineController
**Status:** Pendente
**Requisitos:** REQ-003
**Descrição:** Implementar controller REST para Vaccine com endpoints aninhados.
**Entregáveis:**
- [ ] POST /api/users/{userId}/pets/{petId}/vaccines
- [ ] GET /api/users/{userId}/pets/{petId}/vaccines/{id}
- [ ] GET /api/users/{userId}/pets/{petId}/vaccines
- [ ] PUT /api/users/{userId}/pets/{petId}/vaccines/{id}
- [ ] DELETE /api/users/{userId}/pets/{petId}/vaccines/{id}

## TASK-016: ConsultationController
**Status:** Concluído
**Requisitos:** REQ-004
**Descrição:** Implementar controller REST para Consultation com filtro por status.
**Entregáveis:**
- [X] POST /api/users/{userId}/pets/{petId}/consultations
- [X] GET /api/users/{userId}/pets/{petId}/consultations/{id}
- [X] GET /api/users/{userId}/pets/{petId}/consultations (com filtro opcional por status)
- [X] PUT /api/users/{userId}/pets/{petId}/consultations/{id}
- [X] DELETE /api/users/{userId}/pets/{petId}/consultations/{id}

## TASK-017: ReminderController
**Status:** Pendente
**Requisitos:** REQ-005
**Descrição:** Implementar controller REST para Reminder com filtros.
**Entregáveis:**
- [ ] POST /api/users/{userId}/pets/{petId}/reminders
- [ ] GET /api/users/{userId}/pets/{petId}/reminders/{id}
- [ ] GET /api/users/{userId}/pets/{petId}/reminders (com filtros opcionais por tipo e completed)
- [ ] PUT /api/users/{userId}/pets/{petId}/reminders/{id}
- [ ] DELETE /api/users/{userId}/pets/{petId}/reminders/{id}

## TASK-018: GlobalExceptionHandler
**Status:** Concluído
**Requisitos:** REQ-007
**Descrição:** Implementar tratamento global de exceções com @RestControllerAdvice.
**Entregáveis:**
- [X] Tratamento de EntityNotFoundException (404)
- [X] Tratamento de SecurityException (403)
- [X] Tratamento de IllegalArgumentException (400)
- [X] Tratamento de MethodArgumentNotValidException (400)
- [X] Tratamento de exceções genéricas (500)

## TASK-019: DataInitializer
**Status:** Pendente
**Requisitos:** REQ-006
**Descrição:** Implementar carga de dados de exemplo na inicialização.
**Entregáveis:**
- [ ] 2 usuários de exemplo
- [ ] 3 pets associados aos usuários
- [ ] 3 vacinas associadas aos pets
- [ ] 3 consultas com diferentes status
- [ ] 3 lembretes com diferentes tipos

## TASK-020: Documentação e Configuração Final
**Status:** Pendente
**Requisitos:** REQ-008
**Descrição:** Configurar Swagger/OpenAPI e preparar projeto para execução.
**Entregáveis:**
- [ ] springdoc-openapi-starter-webmvc-ui adicionado
- [ ] Configuração do Swagger em application.yml
- [ ] PLANO.md com visão geral do projeto
- [ ] .gitignore configurado
- [ ] Projeto inicializado no Git

## TASK-021: Testes Unitários - Services
**Status:** ⏳ Pendente
**Requisitos:** Todos
**Descrição:** Implementar testes unitários para todas as camadas de serviço.
**Entregáveis:**
- [X] UserServiceTest
- [ ] PetServiceTest
- [ ] VaccineServiceTest
- [X] ConsultationServiceTest
- [ ] ReminderServiceTest

## TASK-022: Testes de Integração - Controllers
**Status:** ⏳ Pendente
**Requisitos:** Todos
**Descrição:** Implementar testes de integração para todos os controllers.
**Entregáveis:**
- [X] UserControllerTest
- [ ] PetControllerTest
- [ ] VaccineControllerTest
- [X] ConsultationControllerTest
- [ ] ReminderControllerTest

## TASK-023: Commit e Documentação Final
**Status:** ⏳ Pendente
**Requisitos:** Todos
**Descrição:** Realizar commits seguindo convenção e preparar para apresentação.
**Entregáveis:**
- [ ] Commits atômicos com mensagens descritivas
- [ ] README.md com instruções de execução
- [ ] Registro de rastreabilidade (requisito → task → código → teste)
- [ ] Preparação para demonstração
