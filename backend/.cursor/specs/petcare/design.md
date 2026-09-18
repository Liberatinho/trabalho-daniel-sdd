# PetCare - Design da Arquitetura

## Arquitetura Geral
O PetCare segue uma arquitetura em camadas baseada no padrão MVC (Model-View-Controller), adaptada para uma API REST.

```
┌─────────────────────────────────────────┐
│         Client (HTTP Requests)          │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│           Controller Layer              │
│  - UserController                       │
│  - PetController                        │
│  - VaccineController                    │
│  - ConsultationController               │
│  - ReminderController                   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│            Service Layer                │
│  - UserService                          │
│  - PetService                           │
│  - VaccineService                       │
│  - ConsultationService                  │
│  - ReminderService                      │
│  - Regras de negócio                    │
│  - Validações                           │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│          Repository Layer               │
│  - UserRepository                       │
│  - PetRepository                        │
│  - VaccineRepository                    │
│  - ConsultationRepository               │
│  - ReminderRepository                   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Database (H2 Memory)            │
└─────────────────────────────────────────┘
```

## Modelo de Dados

### User
- `id`: Long (PK, auto-increment)
- `name`: String (obrigatório)
- `email`: String (obrigatório, único)
- `password`: String (obrigatório)
- `pets`: List<Pet> (One-to-Many)

### Pet
- `id`: Long (PK, auto-increment)
- `name`: String (obrigatório)
- `species`: String (obrigatório)
- `breed`: String (opcional)
- `birthDate`: LocalDate (opcional)
- `notes`: String (opcional)
- `user`: User (Many-to-One, obrigatório)
- `vaccines`: List<Vaccine> (One-to-Many)
- `consultations`: List<Consultation> (One-to-Many)
- `reminders`: List<Reminder> (One-to-Many)

### Vaccine
- `id`: Long (PK, auto-increment)
- `name`: String (obrigatório)
- `applicationDate`: LocalDate (obrigatório)
- `nextDoseDate`: LocalDate (opcional)
- `notes`: String (opcional)
- `pet`: Pet (Many-to-One, obrigatório)

### Consultation
- `id`: Long (PK, auto-increment)
- `date`: LocalDateTime (obrigatório)
- `veterinarian`: String (obrigatório)
- `reason`: String (obrigatório)
- `notes`: String (opcional)
- `status`: ConsultationStatus (obrigatório)
- `pet`: Pet (Many-to-One, obrigatório)

### Reminder
- `id`: Long (PK, auto-increment)
- `type`: ReminderType (obrigatório)
- `description`: String (obrigatório)
- `dueDate`: LocalDate (obrigatório)
- `completed`: Boolean (padrão: false)
- `pet`: Pet (Many-to-One, obrigatório)

## Estrutura de Diretórios
```
src/main/java/com/petcare/
├── config/
│   └── DataInitializer.java
├── controller/
│   ├── UserController.java
│   ├── PetController.java
│   ├── VaccineController.java
│   ├── ConsultationController.java
│   └── ReminderController.java
├── exception/
│   └── GlobalExceptionHandler.java
├── model/
│   ├── User.java
│   ├── Pet.java
│   ├── Vaccine.java
│   ├── Consultation.java
│   ├── Reminder.java
│   ├── ConsultationStatus.java
│   └── ReminderType.java
├── repository/
│   ├── UserRepository.java
│   ├── PetRepository.java
│   ├── VaccineRepository.java
│   ├── ConsultationRepository.java
│   └── ReminderRepository.java
├── service/
│   ├── UserService.java
│   ├── PetService.java
│   ├── VaccineService.java
│   ├── ConsultationService.java
│   └── ReminderService.java
└── PetCareApplication.java
```

## Design Decisions

### 1. REST API Design
- Endpoints aninhados para manter hierarquia de recursos
- Exemplo: `/api/users/{userId}/pets/{petId}/vaccines`
- Verbos HTTP padronizados (GET, POST, PUT, DELETE)

### 2. Validações
- Bean Validation no nível de modelo
- Validações de regras de negócio no service layer
- Validações de ownership (usuário dono do recurso) no service layer

### 3. Tratamento de Erros
- GlobalExceptionHandler centraliza tratamento de exceções
- Respostas de erro padronizadas com timestamp, status e mensagem
- Mapeamento de exceções para códigos HTTP apropriados

### 4. Persistência
- H2 em memória para simplicidade de demonstração
- Cascade delete para remover dependências automaticamente
- Lazy loading para relacionamentos

### 5. Segurança de Dados
- Validação de ownership em todas as operações
- Usuário só pode acessar seus próprios recursos
- Exceções de segurança retornam 403 Forbidden

## Tecnologias Utilizadas

### Spring Boot 3.2.0
- Framework base da aplicação
- Auto-configuração e dependências gerenciadas

### Spring Data JPA
- Abstração de persistência
- Repositórios com métodos customizados
- Suporte a queries derivadas

### H2 Database
- Banco de dados em memória
- Console web para inspeção de dados
- Ideal para desenvolvimento e testes

### Spring Validation
- Validação de beans com anotações
- Integração com Spring MVC
- Validações customizadas

### Swagger/OpenAPI
- Documentação automática da API
- Interface web para testar endpoints
- springdoc-openapi-starter-webmvc-ui

## Fluxos Principais

### Fluxo de Cadastro de Pet
1. Cliente envia POST para `/api/users/{userId}/pets`
2. PetController recebe a requisição
3. Validações de Bean Validation são executadas
4. PetService.createPet() é chamado
5. UserService valida existência do usuário
6. Pet é salvo com referência ao usuário
7. Resposta 201 Created é retornada

### Fluxo de Registro de Vacina
1. Cliente envia POST para `/api/users/{userId}/pets/{petId}/vaccines`
2. VaccineController recebe a requisição
3. VaccineService.createVaccine() é chamado
4. PetService valida existência e ownership do pet
5. Validação de próxima dose é executada
6. Vaccine é salva com referência ao pet
7. Resposta 201 Created é retornada

### Fluxo de Atualização de Consulta
1. Cliente envia PUT para `/api/users/{userId}/pets/{petId}/consultations/{id}`
2. ConsultationController recebe a requisição
3. ConsultationService.updateConsultation() é chamado
4. Valida existência e ownership da consulta
5. Valida transição de status (regra de negócio)
6. Consulta é atualizada
7. Resposta 200 OK é retornada

## Dados de Exemplo
DataInitializer carrega dados na inicialização:
- 2 usuários (Maria Silva, João Santos)
- 3 pets (Rex, Mimi, Thor)
- 3 vacinas
- 3 consultas
- 3 lembretes

Permite demonstração imediata sem necessidade de criar dados manualmente.
