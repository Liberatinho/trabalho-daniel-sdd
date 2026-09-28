# Roteiro de Demonstração da API (Swagger UI) — PetCare

Este roteiro guia uma apresentação prática de 8 a 12 passos da API PetCare utilizando o **Swagger UI**.

- **URL do Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Base URL da API:** `http://localhost:8080/api`

---

## Pré-requisitos
A aplicação deve estar em execução (`mvn spring-boot:run` ou `./mvnw spring-boot:run` na pasta `backend`).
Os dados de exemplo são inseridos automaticamente pelo `DataInitializer`.

---

## Passo a Passo da Demonstração

### 1. Verificar carga inicial de Usuários
- **Endpoint:** `GET /api/users`
- **Ação:** Executar a requisição sem parâmetros.
- **Resultado Esperado (200 OK):** Lista com os 2 usuários pré-carregados:
  - `id: 1` — Maria Silva (`maria@email.com`)
  - `id: 2` — João Santos (`joao@email.com`)

### 2. Listar Pets de um Tutor (Maria)
- **Endpoint:** `GET /api/users/1/pets`
- **Ação:** Informar `userId: 1`.
- **Resultado Esperado (200 OK):** Lista com os pets de Maria:
  - `Rex` (Cão, Labrador)
  - `Mimi` (Gato, Siamês)

### 3. Cadastrar um Novo Pet com Sucesso
- **Endpoint:** `POST /api/users/1/pets`
- **Ação:** Informar `userId: 1` e body JSON:
  ```json
  {
    "name": "Pipoca",
    "species": "Cão",
    "breed": "Poodle",
    "birthDate": "2023-05-10",
    "notes": "Muito brincalhão"
  }
  ```
- **Resultado Esperado (201 Created):** Pet criado e associado automaticamente ao usuário 1.

### 4. Validação de Campos Obrigatórios de Pet (Regra REQ-002)
- **Endpoint:** `POST /api/users/1/pets`
- **Ação:** Enviar pet com campos obrigatórios em branco:
  ```json
  {
    "name": "",
    "species": ""
  }
  ```
- **Resultado Esperado (400 Bad Request):** Retorno de validação detalhado contendo:
  - `errors.name`: "Nome é obrigatório"
  - `errors.species`: "Espécie é obrigatória"

### 5. Validação de Ownership / Segurança entre Usuários (Regra REQ-002 / REQ-007)
- **Endpoint:** `GET /api/users/2/pets/1`
- **Ação:** João (`userId: 2`) tenta acessar o pet `Rex` (`id: 1`), que pertence à Maria (`userId: 1`).
- **Resultado Esperado (403 Forbidden):**
  ```json
  {
    "status": 403,
    "error": "Forbidden",
    "message": "Pet não pertence ao usuário ou não existe"
  }
  ```

### 6. Buscar Histórico de Vacinas de um Pet
- **Endpoint:** `GET /api/users/1/pets/1/vaccines`
- **Ação:** Informar `userId: 1` e `petId: 1` (Rex).
- **Resultado Esperado (200 OK):** Lista de vacinas contendo a dose registrada de "V10" com data de aplicação e próxima dose.

### 7. Regra de Negócio de Vacinas: Próxima dose anterior à aplicação (Regra REQ-003)
- **Endpoint:** `POST /api/users/1/pets/1/vaccines`
- **Ação:** Tentar cadastrar vacina onde `nextDoseDate` é anterior a `applicationDate`:
  ```json
  {
    "name": "Antirrábica",
    "applicationDate": "2026-06-15",
    "nextDoseDate": "2026-05-01",
    "notes": "Data inconsistente proposital"
  }
  ```
- **Resultado Esperado (400 Bad Request):**
  ```json
  {
    "status": 400,
    "error": "Bad Request",
    "message": "Próxima dose não pode ser anterior à data de aplicação"
  }
  ```

### 8. Listar Consultas com Filtro de Status
- **Endpoint:** `GET /api/users/1/pets/1/consultations`
- **Ação:** Informar `userId: 1`, `petId: 1` e parâmetro `status: SCHEDULED`.
- **Resultado Esperado (200 OK):** Apenas consultas agendadas do Rex (ex.: "Check-up anual" com a Dra. Ana Costa).

### 9. Regra de Negócio de Consultas: Alteração de Consulta Cancelada (Regra REQ-004)
- **Endpoint:** `PUT /api/users/2/pets/3/consultations/3`
- **Ação:** O pet Thor (`petId: 3`) do João (`userId: 2`) possui a consulta 3 com status `CANCELLED`. Tentar atualizar notas ou reagendar:
  ```json
  {
    "date": "2026-10-10T14:00:00",
    "veterinarian": "Dra. Ana Costa",
    "reason": "Vacinação reagendada",
    "status": "SCHEDULED"
  }
  ```
- **Resultado Esperado (400 Bad Request):**
  ```json
  {
    "status": 400,
    "error": "Bad Request",
    "message": "Consulta cancelada não pode ser alterada"
  }
  ```

### 10. Filtrar Lembretes por Tipo e Status
- **Endpoint:** `GET /api/users/1/pets/1/reminders`
- **Ação:** Informar `userId: 1`, `petId: 1`, `type: MEDICATION` e `completed: false`.
- **Resultado Esperado (200 OK):** Retorna apenas o lembrete de medicação ("Vermífugo trimestral") pendente do Rex.
