# PetCare - Sistema de Gestão de Pets para Tutores

Aplicação backend em Spring Boot para tutores organizarem informações e cuidados dos seus pets.

## Sobre o Projeto

PetCare foi desenvolvido como trabalho acadêmico para demonstrar a abordagem de Spec-Driven Development (SDD) usando o framework cc-sdd. O projeto implementa uma API REST completa com persistência de dados, regras de negócio e validações.

## Funcionalidades

1. **Cadastro de Usuários** - Criação de conta e gestão de perfil
2. **Cadastro de Pets** - Registro de pets com informações detalhadas
3. **Histórico de Vacinas** - Controle de vacinas aplicadas e próximas doses
4. **Consultas Veterinárias** - Agendamento e acompanhamento de consultas com status
5. **Lembretes de Cuidados** - Alertas para vacinas, consultas, medicamentos e outros

## Stack Tecnológica

- **Spring Boot** 3.2.0
- **Java** 17
- **H2 Database** (em memória)
- **Spring Data JPA**
- **Spring Validation**
- **Swagger/OpenAPI** (springdoc-openapi 2.3.0)

## Arquitetura

O projeto segue o padrão MVC em camadas:

```
Controller → Service → Repository → Database (H2)
```

### Estrutura de Diretórios

```
src/main/java/com/petcare/
├── config/              # Configurações e inicialização de dados
├── controller/          # Controllers REST
├── exception/           # Tratamento global de exceções
├── model/               # Entidades JPA
├── repository/          # Interfaces de repositório
├── service/             # Regras de negócio e validações
└── PetCareApplication.java
```

## Requisitos do Sistema

### Pré-requisitos

- **Java 17** ou superior
- **Maven 3.6+** (ou usar o Maven wrapper incluído)

### Instalação do Java

#### macOS (Homebrew)
```bash
brew install openjdk@17
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

#### Windows
Baixe o JDK 17 do [Adoptium](https://adoptium.net/) ou use:
```bash
winget install EclipseAdoptium.Temurin.17.JDK
```

## Como Executar

### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd PetCare
```

### 2. Compilar o Projeto
```bash
mvn clean compile
```

Ou com Maven wrapper:
```bash
./mvnw clean compile
```

### 3. Executar a Aplicação
```bash
mvn spring-boot:run
```

Ou com Maven wrapper:
```bash
./mvnw spring-boot:run
```

A aplicação estará disponível em: `http://localhost:8080`

### 4. Acessar a Documentação

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **H2 Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:petcare`
  - User: `sa`
  - Password: (deixe em branco)

## Endpoints da API

### Usuários
- `POST /api/users` - Criar usuário
- `GET /api/users/{id}` - Buscar usuário
- `GET /api/users/email/{email}` - Buscar por email
- `GET /api/users` - Listar todos
- `PUT /api/users/{id}` - Atualizar usuário
- `DELETE /api/users/{id}` - Deletar usuário

### Pets (aninhados em usuários)
- `POST /api/users/{userId}/pets` - Criar pet
- `GET /api/users/{userId}/pets/{id}` - Buscar pet
- `GET /api/users/{userId}/pets` - Listar pets do usuário
- `PUT /api/users/{userId}/pets/{id}` - Atualizar pet
- `DELETE /api/users/{userId}/pets/{id}` - Deletar pet

### Vacinas (aninhadas em pets)
- `POST /api/users/{userId}/pets/{petId}/vaccines` - Registrar vacina
- `GET /api/users/{userId}/pets/{petId}/vaccines/{id}` - Buscar vacina
- `GET /api/users/{userId}/pets/{petId}/vaccines` - Listar vacinas do pet
- `PUT /api/users/{userId}/pets/{petId}/vaccines/{id}` - Atualizar vacina
- `DELETE /api/users/{userId}/pets/{petId}/vaccines/{id}` - Deletar vacina

### Consultas (aninhadas em pets)
- `POST /api/users/{userId}/pets/{petId}/consultations` - Agendar consulta
- `GET /api/users/{userId}/pets/{petId}/consultations/{id}` - Buscar consulta
- `GET /api/users/{userId}/pets/{petId}/consultations?status=SCHEDULED` - Listar com filtro
- `PUT /api/users/{userId}/pets/{petId}/consultations/{id}` - Atualizar consulta
- `DELETE /api/users/{userId}/pets/{petId}/consultations/{id}` - Deletar consulta

### Lembretes (aninhados em pets)
- `POST /api/users/{userId}/pets/{petId}/reminders` - Criar lembrete
- `GET /api/users/{userId}/pets/{petId}/reminders/{id}` - Buscar lembrete
- `GET /api/users/{userId}/pets/{petId}/reminders?type=VACCINE` - Filtrar por tipo
- `PUT /api/users/{userId}/pets/{petId}/reminders/{id}` - Atualizar lembrete
- `DELETE /api/users/{userId}/pets/{petId}/reminders/{id}` - Deletar lembrete

## Regras de Negócio Implementadas

1. **Ownership**: Usuário só pode acessar seus próprios pets
2. **Vacinas**: Próxima dose não pode ser anterior à data de aplicação
3. **Consultas**:
   - Consulta cancelada não pode ser alterada
   - Consulta realizada não pode voltar para agendada
4. **Validações**: Campos obrigatórios, emails válidos, datas consistentes

## Dados de Exemplo

Ao iniciar, a aplicação carrega automaticamente:
- 2 usuários (Maria Silva, João Santos)
- 3 pets (Rex, Mimi, Thor)
- 3 vacinas
- 3 consultas
- 3 lembretes

## Testes

### Executar Testes Unitários
```bash
mvn test
```

Os testes cobrem:
- UserService (criação, validação de email, busca)
- PetService (CRUD, validação de ownership)
- VaccineService (validação de datas)
- ConsultationService (transições de status)
- ReminderService (filtros e CRUD)

## Abordagem cc-sdd

O projeto foi desenvolvido usando a abordagem Spec-Driven Development:

### Artefatos Produzidos

1. **brief.md** - Visão geral do projeto
2. **requirements.md** - Requisitos funcionais e critérios de aceite
3. **design.md** - Arquitetura e decisões de design
4. **tasks.md** - Decomposição em tarefas com rastreabilidade

### Rastreabilidade

Cada funcionalidade pode ser rastreada através da cadeia:

```
REQUISITO → DESIGN → TASK → CÓDIGO → TESTE → COMMIT
```

Exemplo:
- REQ-003: Histórico de vacinas
- Design: Vaccine entity + VaccineService + VaccineController
- TASK-010: VaccineService
- TASK-015: VaccineController
- Código: VaccineService.java, VaccineController.java
- Teste: VaccineServiceTest.java
- Commit: feat(vaccines): implement vaccine service

## Estrutura de Commits

Os commits seguem convenção semântica relacionada às tarefas:

```
feat: estrutura inicial do projeto PetCare com Spring Boot
test(services): implement unit tests for all services
feat(spec): define requirements for petcare
feat(design): define architecture and design decisions
```

## Checklist do Trabalho

- [ ] Problema claramente definido
- [ ] Pelo menos 3 funcionalidades relevantes (5 implementadas)
- [ ] Persistência de dados (H2 + JPA)
- [ ] Regras de negócio (ownership, validações de datas, transições de status)
- [ ] Validações (Bean Validation + regras customizadas)
- [ ] Aplicação funcional
- [ ] Artefatos do cc-sdd preservados (brief, requirements, design, tasks)
- [ ] Requirements documentados
- [ ] Design documentado
- [ ] Tasks documentadas
- [ ] Testes preservados
- [ ] Histórico Git coerente
- [ ] Commits relacionados às tarefas
- [ ] Registro diário de demandas (preencher manualmente)
- [ ] Slides da apresentação
- [ ] Análise crítica

## Desenvolvido por

**Grupo:** [Preencher com nomes dos integrantes]

**Disciplina:** cc-sdd - Desenvolvimento Orientado por Especificações

## Licença

Este projeto foi desenvolvido para fins acadêmicos.

## Links Úteis

- [cc-sdd Repository](https://github.com/gotalab/cc-sdd)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spec-Driven Development Guide](docs/guides/spec-driven.md)
