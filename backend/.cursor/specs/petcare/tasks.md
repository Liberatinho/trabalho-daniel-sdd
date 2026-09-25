# PetCare - Tarefas de Implementação

> Status atual (não reimplementar o que já está Concluído):
> User, Pet, Vaccine, Consultation, Reminder, repositórios, services, controllers e GlobalExceptionHandler já estão feitos.
> Ainda pendente: TASK-019 (DataInitializer), testes de Pet (TASK-021/022) e TASK-023 (docs finais da apresentação).

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
**Status:** Concluído
**Requisitos:** REQ-001
**Descrição:** Implementar entidade User com validações e relacionamento com Pet.
**Entregáveis:**
- [X] User.java com anotações JPA
- [X] Validações com Bean Validation
- [X] Métodos addPet() e removePet()

## TASK-003: Modelo de Dados - Pet
**Status:** Concluído
**Requisitos:** REQ-002
**Descrição:** Implementar entidade Pet com relacionamentos e validações.
**Entregáveis:**
- [X] Pet.java com todas as propriedades
- [X] Relacionamento ManyToOne com User
- [X] Relacionamentos OneToMany com Vaccine, Consultation, Reminder

## TASK-004: Modelo de Dados - Vaccine
**Status:** Concluído
**Requisitos:** REQ-003
**Descrição:** Implementar entidade Vaccine com validações.
**Entregáveis:**
- [X] Vaccine.java com todas as propriedades
- [X] Relacionamento ManyToOne com Pet
- [X] Validações de campos obrigatórios

## TASK-005: Modelo de Dados - Consultation
**Status:** Concluído
**Requisitos:** REQ-004
**Descrição:** Implementar entidade Consultation com enum de status.
**Entregáveis:**
- [X] Consultation.java com todas as propriedades
- [X] ConsultationStatus enum (SCHEDULED, COMPLETED, CANCELLED)
- [X] Relacionamento ManyToOne com Pet

## TASK-006: Modelo de Dados - Reminder
**Status:** Concluído
**Requisitos:** REQ-005
**Descrição:** Implementar entidade Reminder com enum de tipo.
**Entregáveis:**
- [X] Reminder.java com todas as propriedades
- [X] ReminderType enum (VACCINE, CONSULTATION, MEDICATION, OTHER)
- [X] Relacionamento ManyToOne com Pet

## TASK-007: Repositórios JPA
**Status:** Concluído
**Requisitos:** REQ-006
**Descrição:** Implementar interfaces de repositório para todas as entidades.
**Entregáveis:**
- [X] UserRepository com findByEmail() e existsByEmail()
- [X] PetRepository com findByUserId() e existsByIdAndUserId()
- [X] VaccineRepository com findByPetId() e existsByIdAndPetId()
- [X] ConsultationRepository com métodos customizados
- [X] ReminderRepository com métodos de filtro

## TASK-008: UserService
**Status:** Concluído
**Requisitos:** REQ-001
**Descrição:** Implementar camada de serviço para User com regras de negócio.
**Entregáveis:**
- [X] CRUD completo de usuários
- [X] Validação de email único
- [X] Tratamento de EntityNotFoundException

## TASK-009: PetService
**Status:** Concluído
**Requisitos:** REQ-002
**Descrição:** Implementar camada de serviço para Pet com validação de ownership.
**Entregáveis:**
- [X] CRUD completo de pets
- [X] Validação de ownership (getPetByIdAndUser)
- [X] Associação automática com usuário

## TASK-010: VaccineService
**Status:** Concluído
**Requisitos:** REQ-003
**Descrição:** Implementar camada de serviço para Vaccine com validações.
**Entregáveis:**
- [X] CRUD completo de vacinas
- [X] Validação de ownership
- [X] Validação de próxima dose (não pode ser anterior à aplicação)

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
**Status:** Concluído
**Requisitos:** REQ-005
**Descrição:** Implementar camada de serviço para Reminder com filtros.
**Entregáveis:**
- [X] CRUD completo de lembretes
- [X] Validação de ownership
- [X] Filtros por tipo e status de conclusão

## TASK-013: UserController
**Status:** Concluído
**Requisitos:** REQ-001
**Descrição:** Implementar controller REST para User.
**Entregáveis:**
- [X] POST /api/users
- [X] GET /api/users/{id}
- [X] GET /api/users/email/{email}
- [X] GET /api/users
- [X] PUT /api/users/{id}
- [X] DELETE /api/users/{id}

## TASK-014: PetController
**Status:** Concluído
**Requisitos:** REQ-002
**Descrição:** Implementar controller REST para Pet com endpoints aninhados.
**Entregáveis:**
- [X] POST /api/users/{userId}/pets
- [X] GET /api/users/{userId}/pets/{id}
- [X] GET /api/users/{userId}/pets
- [X] PUT /api/users/{userId}/pets/{id}
- [X] DELETE /api/users/{userId}/pets/{id}

## TASK-015: VaccineController
**Status:** Concluído
**Requisitos:** REQ-003
**Descrição:** Implementar controller REST para Vaccine com endpoints aninhados.
**Entregáveis:**
- [X] POST /api/users/{userId}/pets/{petId}/vaccines
- [X] GET /api/users/{userId}/pets/{petId}/vaccines/{id}
- [X] GET /api/users/{userId}/pets/{petId}/vaccines
- [X] PUT /api/users/{userId}/pets/{petId}/vaccines/{id}
- [X] DELETE /api/users/{userId}/pets/{petId}/vaccines/{id}

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
**Status:** Concluído
**Requisitos:** REQ-005
**Descrição:** Implementar controller REST para Reminder com filtros.
**Entregáveis:**
- [X] POST /api/users/{userId}/pets/{petId}/reminders
- [X] GET /api/users/{userId}/pets/{petId}/reminders/{id}
- [X] GET /api/users/{userId}/pets/{petId}/reminders (com filtros opcionais por tipo e completed)
- [X] PUT /api/users/{userId}/pets/{petId}/reminders/{id}
- [X] DELETE /api/users/{userId}/pets/{petId}/reminders/{id}

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
**Status:** Concluído
**Requisitos:** REQ-008
**Descrição:** Configurar Swagger/OpenAPI e preparar projeto para execução.
**Entregáveis:**
- [X] springdoc-openapi-starter-webmvc-ui adicionado
- [X] Configuração do Swagger em application.yml
- [X] PLANO.md com visão geral do projeto
- [X] .gitignore configurado
- [X] Projeto inicializado no Git

## TASK-021: Testes Unitários - Services
**Status:** ⏳ Pendente
**Requisitos:** Todos
**Descrição:** Implementar testes unitários para todas as camadas de serviço.
**Entregáveis:**
- [X] UserServiceTest
- [ ] PetServiceTest
- [X] VaccineServiceTest
- [X] ConsultationServiceTest
- [X] ReminderServiceTest

## TASK-022: Testes de Integração - Controllers
**Status:** ⏳ Pendente
**Requisitos:** Todos
**Descrição:** Implementar testes de integração para todos os controllers.
**Entregáveis:**
- [X] UserControllerTest
- [ ] PetControllerTest
- [X] VaccineControllerTest
- [X] ConsultationControllerTest
- [X] ReminderControllerTest

## TASK-023: Commit e Documentação Final
**Status:** ⏳ Pendente
**Requisitos:** Todos
**Descrição:** Realizar commits seguindo convenção e preparar para apresentação.
**Entregáveis:**
- [ ] Commits atômicos com mensagens descritivas
- [ ] README.md com instruções de execução
- [ ] Registro de rastreabilidade (requisito → task → código → teste)
- [ ] Preparação para demonstração
