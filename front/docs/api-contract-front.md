# PetCare — Contrato de integração do frontend

_Fonte verificada em 2026-09-25 a partir do projeto `backend/`._

## Base e execução

- Backend Spring Boot: `http://localhost:8080`
- Prefixo dos recursos: `/api`
- OpenAPI: `/api-docs`
- Swagger UI: `/swagger-ui.html`
- O diretório real do backend neste repositório é `../backend`, não `../back`.
- Não há configuração de autenticação, CORS ou URL externa no backend atual.

## Usuários

### `POST /api/users`

Cria um usuário. O request usa o modelo `User`:

```json
{
  "name": "string",
  "email": "user@example.com",
  "password": "string"
}
```

`name`, `email` e `password` são obrigatórios. `email` precisa ser válido e único.

Response `201` retorna um `User` com `id`, `name`, `email`, `password` e `pets`. O backend atual expõe a senha no modelo serializado; o frontend não deve exibir, persistir ou tratar esse campo como estado de sessão.

Também existem:

- `GET /api/users/{id}` — busca um usuário;
- `GET /api/users/email/{email}` — busca por e-mail;
- `GET /api/users` — lista usuários;
- `PUT /api/users/{id}` — atualiza usuário;
- `DELETE /api/users/{id}` — remove usuário.

## Pets

Todos os endpoints usam `/api/users/{userId}/pets`.

- `POST /api/users/{userId}/pets` — cria pet, response `201`;
- `GET /api/users/{userId}/pets` — lista pets, response `200`;
- `GET /api/users/{userId}/pets/{id}` — busca pet, response `200`;
- `PUT /api/users/{userId}/pets/{id}` — atualiza pet, response `200`;
- `DELETE /api/users/{userId}/pets/{id}` — remove pet, response `204`.

O request/response de `Pet` possui:

```json
{
  "id": 0,
  "name": "string",
  "species": "string",
  "breed": "string",
  "birthDate": "YYYY-MM-DD",
  "notes": "string"
}
```

`name` e `species` são obrigatórios. `breed`, `birthDate` e `notes` são opcionais. O relacionamento `user` não deve ser enviado pelo frontend; o usuário é definido pelo `userId` da URL.

## Vacinas

Todos os endpoints usam `/api/users/{userId}/pets/{petId}/vaccines`.

- `POST` cria vacina, response `201`;
- `GET` lista vacinas, response `200`;
- `GET /{id}` busca vacina;
- `PUT /{id}` atualiza vacina;
- `DELETE /{id}` remove vacina, response `204`.

Campos:

```json
{
  "id": 0,
  "name": "string",
  "applicationDate": "YYYY-MM-DD",
  "nextDoseDate": "YYYY-MM-DD",
  "notes": "string"
}
```

`name` e `applicationDate` são obrigatórios. `nextDoseDate` e `notes` são opcionais. O backend valida que a próxima dose não seja anterior à aplicação.

## Consultas

Todos os endpoints usam `/api/users/{userId}/pets/{petId}/consultations`.

- `POST` cria consulta, response `201`;
- `GET` lista consultas, com filtro opcional `?status=...`;
- `GET /{id}` busca consulta;
- `PUT /{id}` atualiza consulta;
- `DELETE /{id}` remove consulta, response `204`.

Campos:

```json
{
  "id": 0,
  "date": "YYYY-MM-DDTHH:mm:ss",
  "veterinarian": "string",
  "reason": "string",
  "notes": "string",
  "status": "SCHEDULED"
}
```

`date`, `veterinarian`, `reason` e `status` são obrigatórios. Os status atuais são `SCHEDULED`, `COMPLETED` e `CANCELLED`. Não existe endpoint de disponibilidade de horários no backend atual; o frontend não deve inventar horários.

## Lembretes

Todos os endpoints usam `/api/users/{userId}/pets/{petId}/reminders`.

- `POST` cria lembrete, response `201`;
- `GET` lista lembretes, com filtros opcionais `type` e `completed`;
- `GET /{id}` busca lembrete;
- `PUT /{id}` atualiza lembrete;
- `DELETE /{id}` remove lembrete, response `204`.

Campos:

```json
{
  "id": 0,
  "type": "VACCINE",
  "description": "string",
  "dueDate": "YYYY-MM-DD",
  "completed": false
}
```

`type` e `description` e `dueDate` são obrigatórios. Os tipos atuais são `VACCINE`, `CONSULTATION`, `MEDICATION` e `OTHER`. `completed` inicia como `false`.

## Erros

O backend retorna um objeto com `timestamp`, `status`, `error` e `message`. Erros de validação `400` também podem conter `errors` por campo.

- `400` — validação ou regra de negócio;
- `403` — ownership ou acesso negado;
- `404` — entidade não encontrada;
- `500` — erro interno.

## Divergências que bloqueiam decisões de autenticação

O backend atual não possui endpoint de login, logout, refresh, sessão, token, middleware de autenticação ou expiração. O cadastro aceita `name`, `email` e `password`, enquanto os requisitos visuais mencionam CPF e cidade. Essas decisões não podem ser resolvidas pelo frontend sem alteração ou confirmação do contrato do backend.
