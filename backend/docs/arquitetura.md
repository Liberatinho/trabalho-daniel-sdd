# Arquitetura — PetCare

## Visão geral

O PetCare segue uma arquitetura em camadas (layered architecture) baseada no padrão MVC, adaptada para uma API REST. Cada camada tem uma responsabilidade clara e se comunica apenas com a camada imediatamente abaixo.

```
┌─────────────────────────────────────────────┐
│         Cliente HTTP (Swagger, curl)         │
└──────────────────┬──────────────────────────┘
                   │ HTTP (JSON)
┌──────────────────▼──────────────────────────┐
│         Camada de Controller                │
│  - Recebe requisições HTTP                   │
│  - Valida entrada (Bean Validation)          │
│  - Delega para Service                       │
│  - Retorna JSON + status HTTP                │
└──────────────────┬──────────────────────────┘
                   │ chamada de método
┌──────────────────▼──────────────────────────┐
│         Camada de Service                    │
│  - Regras de negócio                         │
│  - Validações de domínio                     │
│  - Validação de ownership                    │
│  - Orquestra repositórios                    │
└──────────────────┬──────────────────────────┘
                   │ chamada de método
┌──────────────────▼──────────────────────────┐
│         Camada de Repository                 │
│  - Interfaces JPA (Spring Data)              │
│  - Acesso ao banco de dados                  │
│  - Queries derivadas                         │
└──────────────────┬──────────────────────────┘
                   │ SQL
┌──────────────────▼──────────────────────────┐
│         Banco H2 (em memória)                │
└─────────────────────────────────────────────┘
```

## Camadas explicadas

### 1. Controller

**Responsabilidade:** Ponta HTTP da aplicação.

**O que faz:**
- Mapeia URLs para métodos Java (`@GetMapping`, `@PostMapping`, etc.)
- Recebe JSON e converte para objetos Java (`@RequestBody`)
- Valida campos obrigatórios com Bean Validation (`@Valid`)
- Retorna respostas HTTP com status apropriado (200, 201, 204, 400, 403, 404, 500)

**O que NÃO faz:**
- Regras de negócio (isso fica no Service)
- Acesso direto ao banco (isso fica no Repository)

**Exemplo:**
```java
@PostMapping
public ResponseEntity<Vaccine> createVaccine(
    @PathVariable Long userId,
    @PathVariable Long petId,
    @Valid @RequestBody Vaccine vaccine) {
    Vaccine created = vaccineService.createVaccine(vaccine, petId, userId);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}
```

### 2. Service

**Responsabilidade:** Regras de negócio e validações de domínio.

**O que faz:**
- Executa regras de negócio (ex: próxima dose não pode ser anterior à aplicação)
- Valida ownership (usuário é dono do pet?)
- Orquestra chamadas aos repositórios
- Lança exceções apropriadas (`EntityNotFoundException`, `IllegalArgumentException`, `SecurityException`)

**O que NÃO faz:**
- Não conhece HTTP (não retorna status codes)
- Não acessa o banco diretamente (usa Repository)

**Exemplo:**
```java
public Vaccine createVaccine(Vaccine vaccine, Long petId, Long userId) {
    Pet pet = petService.getPetByIdAndUser(petId, userId);
    vaccine.setPet(pet);
    validateVaccine(vaccine);  // regra de negócio
    return vaccineRepository.save(vaccine);
}

private void validateVaccine(Vaccine vaccine) {
    if (vaccine.getNextDoseDate() != null &&
        vaccine.getNextDoseDate().isBefore(vaccine.getApplicationDate())) {
        throw new IllegalArgumentException(
            "A data da próxima dose não pode ser anterior à data de aplicação");
    }
}
```

### 3. Repository

**Responsabilidade:** Acesso ao banco de dados.

**O que faz:**
- Define métodos de consulta (Spring Data gera a implementação)
- Queries derivadas do nome do método (`findByEmail`, `existsByIdAndUserId`)
- Herda CRUD completo de `JpaRepository`

**O que NÃO faz:**
- Regras de negócio
- Validação

**Exemplo:**
```java
public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByUserId(Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);
}
```

## Modelo de dados

### Diagrama de relacionamentos

```
User (1) ──────── (*) Pet
                      │
           ┌──────────┼──────────┐
           │          │          │
      (*) Vaccine  (*) Consultation  (*) Reminder
```

### Detalhamento por entidade

#### User
| Campo     | Tipo      | Obrigatório | Único | Validação              |
|-----------|-----------|-------------|-------|------------------------|
| id        | Long      | (auto)      | sim   | PK, auto-increment     |
| name      | String    | sim         | não   | @NotBlank              |
| email     | String    | sim         | sim   | @NotBlank, @Email      |
| password  | String    | sim         | não   | @NotBlank              |

#### Pet
| Campo      | Tipo        | Obrigatório | Validação              |
|------------|-------------|-------------|------------------------|
| id         | Long        | (auto)      | PK, auto-increment     |
| name       | String      | sim         | @NotBlank              |
| species    | String      | sim         | @NotBlank              |
| breed      | String      | não         | —                      |
| birthDate  | LocalDate   | não         | —                      |
| notes      | String      | não         | máx 1000 chars         |
| user       | User        | sim         | FK (Many-to-One)       |

#### Vaccine
| Campo            | Tipo        | Obrigatório | Validação                          |
|------------------|-------------|-------------|------------------------------------|
| id               | Long        | (auto)      | PK, auto-increment                 |
| name             | String      | sim         | @NotBlank                          |
| applicationDate  | LocalDate   | sim         | @NotNull                           |
| nextDoseDate     | LocalDate   | não         | deve ser ≥ applicationDate         |
| notes            | String      | não         | máx 1000 chars                     |
| pet              | Pet         | sim         | FK (Many-to-One)                   |

#### Consultation
| Campo         | Tipo                | Obrigatório | Validação                          |
|---------------|---------------------|-------------|------------------------------------|
| id            | Long                | (auto)      | PK, auto-increment                 |
| date          | LocalDateTime       | sim         | @NotNull                           |
| veterinarian  | String              | sim         | @NotBlank                          |
| reason        | String              | sim         | @NotBlank                          |
| notes         | String              | não         | máx 1000 chars                     |
| status        | ConsultationStatus  | sim         | SCHEDULED, COMPLETED, CANCELLED    |
| pet           | Pet                 | sim         | FK (Many-to-One)                   |

#### Reminder
| Campo        | Tipo          | Obrigatório | Validação                          |
|--------------|---------------|-------------|------------------------------------|
| id           | Long          | (auto)      | PK, auto-increment                 |
| type         | ReminderType  | sim         | VACCINE, CONSULTATION, MEDICATION, OTHER |
| description  | String        | sim         | @NotBlank, máx 500 chars           |
| dueDate      | LocalDate     | sim         | @NotNull                           |
| completed    | Boolean       | não         | padrão: false                      |
| pet          | Pet           | sim         | FK (Many-to-One)                   |

## Padrão de URL aninhada

O PetCare usa URLs aninhadas para refletir a hierarquia de recursos:

```
/api/users/{userId}/pets/{petId}/vaccines/{vaccineId}
         │           │            │            │
         │           │            │            └── recurso específico
         │           │            └── coleção de vacinas do pet
         │           └── pet específico do usuário
         └── usuário dono de tudo
```

**Vantagens:**
- URL expressa a relação de ownership
- `userId` e `petId` estão sempre disponíveis para validação
- Mais RESTful que IDs soltos no body

## Tratamento de exceções

Todas as exceções são capturadas por `GlobalExceptionHandler` (@RestControllerAdvice):

| Exceção                         | HTTP | Quando                          |
|---------------------------------|------|---------------------------------|
| EntityNotFoundException          | 404  | Recurso não existe              |
| SecurityException               | 403  | Recurso não pertence ao usuário |
| IllegalArgumentException         | 400  | Regra de negócio violada        |
| MethodArgumentNotValidException | 400  | Campo obrigatório ausente       |
| Exception (genérica)            | 500  | Erro inesperado                 |

## Configurações

### H2 Console
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:petcare`
- Usuário: `sa` / Senha: (vazio)

### Swagger UI
- URL: `http://localhost:8080/swagger-ui.html`
- Documenta todos os endpoints automaticamente
- Permite testar endpoints direto do navegador
