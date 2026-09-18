# Guia de Execução — PetCare

## Pré-requisitos

### 1. Java 17 (obrigatório)

Verifique se já tem:
```bash
java -version
```

Se não tiver:

**macOS (Homebrew):**
```bash
brew install openjdk@17
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

**Windows:**
Baixe o JDK 17 do [Adoptium](https://adoptium.net/)

### 2. Maven (obrigatório)

```bash
mvn -version
```

Se não tiver:

**macOS:**
```bash
brew install maven
```

**Linux:**
```bash
sudo apt install maven
```

## Passo a passo

### 1. Clonar o repositório
```bash
git clone <url-do-repositorio>
cd PetCare
```

### 2. Compilar o projeto
```bash
mvn clean compile
```

### 3. Rodar os testes
```bash
mvn test
```

### 4. Iniciar a aplicação
```bash
mvn spring-boot:run
```

### 5. Acessar a aplicação

| Recurso         | URL                                            |
|-----------------|------------------------------------------------|
| Swagger UI      | http://localhost:8080/swagger-ui.html          |
| H2 Console      | http://localhost:8080/h2-console               |
| API base        | http://localhost:8080/api                      |

### 6. H2 Console — configurações de acesso

| Campo     | Valor                |
|-----------|----------------------|
| JDBC URL  | `jdbc:h2:mem:petcare`|
| User      | `sa`                 |
| Password  | (deixe em branco)    |

## Testando a API

### Via Swagger UI (recomendado)

1. Abra `http://localhost:8080/swagger-ui.html` no navegador
2. Clique em qualquer endpoint para expandir
3. Clique em "Try it out"
4. Preencha os parâmetros e clique em "Execute"

### Via curl (linha de comando)

#### Criar usuário
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@email.com","password":"123"}'
```

#### Listar usuários
```bash
curl http://localhost:8080/api/users
```

#### Criar pet para o usuário 1
```bash
curl -X POST http://localhost:8080/api/users/1/pets \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","species":"Cachorro","breed":"Vira-lata"}'
```

#### Listar pets do usuário 1
```bash
curl http://localhost:8080/api/users/1/pets
```

#### Registrar vacina para o pet 1
```bash
curl -X POST http://localhost:8080/api/users/1/pets/1/vaccines \
  -H "Content-Type: application/json" \
  -d '{"name":"Antirrábica","applicationDate":"2024-01-15","nextDoseDate":"2025-01-15"}'
```

#### Agendar consulta
```bash
curl -X POST http://localhost:8080/api/users/1/pets/1/consultations \
  -H "Content-Type: application/json" \
  -d '{"date":"2024-06-15T14:00:00","veterinarian":"Dr. Carlos","reason":"Check-up","status":"SCHEDULED"}'
```

#### Criar lembrete
```bash
curl -X POST http://localhost:8080/api/users/1/pets/1/reminders \
  -H "Content-Type: application/json" \
  -d '{"type":"VACCINE","description":"Vacina antirrábica","dueDate":"2025-01-15"}'
```

## Dados de exemplo

Ao iniciar, a aplicação carrega automaticamente:

| Entidade    | Quantidade | Exemplos                              |
|-------------|------------|---------------------------------------|
| Usuários    | 2          | Maria Silva, João Santos              |
| Pets        | 3          | Rex (Labrador), Mimi (Persa), Thor    |
| Vacinas     | 3          | Antirrábica, V10, Tríplice Felina     |
| Consultas   | 3          | 2 realizadas, 1 agendada              |
| Lembretes   | 3          | vacina, consulta, medicação           |

## Estrutura do projeto

```
PetCare/
├── docs/                           # Documentação explicativa
│   ├── discovery.md                # Fase de discovery
│   ├── specs-explicacao.md         # O que são as specs
│   ├── arquitetura.md              # Arquitetura detalhada
│   ├── rastreabilidade.md          # Matriz de rastreabilidade
│   ├── guia-execucao.md            # Este arquivo
│   └── fluxo-cc-sdd.md             # Fluxo cc-sdd aplicado
├── .kiro/specs/petcare/            # Artefatos do cc-sdd
│   ├── brief.md                    # Resumo do projeto
│   ├── requirements.md             # Requisitos funcionais
│   ├── design.md                   # Arquitetura e design
│   └── tasks.md                    # Tarefas implementáveis
├── src/main/java/com/petcare/      # Código-fonte
│   ├── config/                     # Configurações
│   ├── controller/                 # Controllers REST
│   ├── exception/                  # Tratamento de erros
│   ├── model/                      # Entidades JPA
│   ├── repository/                 # Repositórios
│   ├── service/                    # Regras de negócio
│   └── PetCareApplication.java     # Classe main
├── src/main/resources/
│   └── application.yml             # Configurações Spring
├── src/test/java/com/petcare/      # Testes
│   ├── controller/                 # Testes de controller
│   └── service/                    # Testes de service
├── pom.xml                         # Dependências Maven
├── README.md                       # Documentação principal
└── .gitignore                      # Arquivos ignorados pelo Git
```

## Solução de problemas

### Erro: "Port 8080 already in use"
```bash
# Encontrar processo na porta 8080
lsof -i :8080
# Matar o processo
kill -9 <PID>
```

### Erro: "Java version not supported"
Confirme que está usando Java 17:
```bash
java -version
```

### Erro: "mvn command not found"
Instale Maven (veja pré-requisitos acima) ou use o Maven wrapper se disponível:
```bash
./mvnw spring-boot:run
```
