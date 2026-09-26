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

### 1. Clonar o Repositório e Navegar para a Pasta Backend
```bash
git clone https://github.com/Liberatinho/trabalho-daniel-sdd.git
cd trabalho-daniel-sdd/backend
```

### 2. Compilar o Projeto
- **Linux/macOS:**
  ```bash
  ./mvnw clean compile
  ```
- **Windows (PowerShell / CMD):**
  ```powershell
  mvn clean compile
  # ou usando o wrapper
  ./mvnw clean compile
  ```

### 3. Executar a Aplicação
- **Linux/macOS:**
  ```bash
  ./mvnw spring-boot:run
  ```
- **Windows (PowerShell / CMD):**
  ```powershell
  mvn spring-boot:run
  # ou usando o wrapper
  ./mvnw spring-boot:run
  ```

A aplicação estará disponível em: `http://localhost:8080`

### 4. Acessar a Documentação e Ferramentas

- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI Docs**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
- **H2 Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
  - JDBC URL: `jdbc:h2:mem:petcare`
  - User: `sa`
  - Password: *(deixe em branco)*
- **CORS Configurado**: Liberado para `http://localhost:4200` e `http://127.0.0.1:4200` para consumo pelo front-end local.

## Roteiro de Demonstração da API (Swagger)

Para apresentar ou testar a API no Swagger UI em 8–12 passos rápidos (cobrindo regras de negócio, validações, segurança e filtros), consulte o guia completo em:
👉 [docs/demo-api.md](docs/demo-api.md)

Principais pontos demonstrados no roteiro:
1. `GET /api/users` — Listagem dos usuários iniciais (Maria e João)
2. `GET /api/users/1/pets` — Listagem dos pets da Maria (Rex e Mimi)
3. `POST /api/users/1/pets` — Cadastro de novo pet
4. `POST /api/users/1/pets` — Validação: campos obrigatórios vazios retornam `400 Bad Request`
5. `GET /api/users/2/pets/1` — Ownership: usuário 2 tentando ver pet do usuário 1 retorna `403 Forbidden`
6. `GET /api/users/1/pets/1/vaccines` — Histórico de vacinas do pet
7. `POST /api/users/1/pets/1/vaccines` — Regra: próxima dose anterior à aplicação retorna `400 Bad Request`
8. `GET /api/users/1/pets/1/consultations?status=SCHEDULED` — Filtro de consultas agendadas
9. `PUT /api/users/2/pets/3/consultations/3` — Regra: consulta cancelada não pode ser alterada (`400 Bad Request`)
10. `GET /api/users/1/pets/1/reminders?type=VACCINE` — Filtro de lembretes por tipo

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

1. **Ownership**: Usuário só pode acessar seus próprios pets (tentativas não autorizadas retornam `403 Forbidden`)
2. **Vacinas**: Próxima dose não pode ser anterior à data de aplicação (`400 Bad Request`)
3. **Consultas**:
   - Consulta cancelada não pode ser alterada (`400 Bad Request`)
   - Consulta realizada não pode voltar para agendada (`400 Bad Request`)
4. **Validações**: Campos obrigatórios, emails válidos e únicos, datas consistentes

## Dados de Exemplo (DataInitializer)

Ao iniciar a aplicação, o `DataInitializer` carrega automaticamente os seguintes dados de demonstração:

- **Usuário 1:** Maria Silva (`maria@email.com` / senha: `senha123`)
  - **Pet 1: Rex** (Cão, Labrador, nascimento: 12/03/2020)
    - Vacina: V10 (aplicada em 10/01/2026, próxima dose em 10/07/2026)
    - Consulta: Check-up anual (25/09/2026 10:00, Dra. Ana Costa, `SCHEDULED`)
    - Lembrete 1: "Vermífugo trimestral" (`MEDICATION`, 01/10/2026, pendente)
    - Lembrete 2: "Reforço da V10" (`VACCINE`, 10/07/2026, pendente)
  - **Pet 2: Mimi** (Gato, Siamês, nascimento: 05/08/2022)
    - Vacina: Antirrábica (aplicada em 01/02/2026, próxima dose em 01/02/2027)
    - Consulta: Retorno de cirurgia (10/08/2026 14:30, Dr. Paulo Lima, `COMPLETED`)
    - Lembrete: "Retorno pós-cirurgia" (`CONSULTATION`, 30/09/2026, concluído)

- **Usuário 2:** João Santos (`joao@email.com` / senha: `senha456`)
  - **Pet 3: Thor** (Cão, Pastor Alemão, nascimento: 20/11/2019)
    - Vacina: Giárdia (aplicada em 15/03/2026)
    - Consulta: Vacinação (05/09/2026 09:00, Dra. Ana Costa, `CANCELLED`)

## Testes

### Executar a Suíte de Testes
```bash
mvn test
# ou com wrapper
./mvnw test
```

A suíte completa conta com **84 testes automatizados** (unitários e de integração):
- `UserServiceTest` e `UserControllerTest` (CRUD e regras de usuário)
- `PetServiceTest` e `PetControllerTest` (CRUD, ownership, validação e segurança `403`)
- `VaccineServiceTest` e `VaccineControllerTest` (validação de datas de doses e regras)
- `ConsultationServiceTest` e `ConsultationControllerTest` (máquina de estados e transições proibidas)
- `ReminderServiceTest` e `ReminderControllerTest` (filtros por tipo e status)
- `CorsConfigTest` (liberação de CORS e preflight `OPTIONS` para `http://localhost:4200`)

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
