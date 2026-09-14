# Discovery — PetCare

## O que é a fase Discovery?

A fase Discovery no cc-sdd é o ponto de partida. Aqui entendemos o problema, definimos o escopo e validamos se a solução proposta faz sentido antes de escrever qualquer requisito técnico.

## Problema identificado

Tutores de animais de estimação têm dificuldade em centralizar informações importantes sobre seus pets:
- Cartões de vacinação se perdem ou ficam desatualizados
- Consultas veterinárias são esquecidas
- Lembretes de medicamentos não são registrados
- Não há um histórico consolidado por pet

## Solução proposta

Uma API REST que permite ao tutor gerenciar:
1. Sua própria conta
2. Seus pets (um usuário pode ter vários)
3. O histórico de vacinas de cada pet
4. As consultas veterinárias agendadas e realizadas
5. Lembretes de cuidados diversos

## Decisões de escopo

### Dentro do escopo (MVP)
- CRUD completo de usuários, pets, vacinas, consultas e lembretes
- Validação de ownership (usuário só acessa seus próprios recursos)
- Regras de negócio para vacinas e consultas
- Persistência em banco de dados
- Dados de exemplo para demonstração

### Fora do escopo
- Autenticação JWT / OAuth (não é obrigatório para o trabalho)
- Frontend (a entrega é só a API REST)
- Notificações push / email
- Upload de fotos dos pets
- Integração com clínicas veterinárias externas

## Stack tecnológica escolhida

| Camada        | Tecnologia                | Justificativa                                      |
|---------------|---------------------------|----------------------------------------------------|
| Framework     | Spring Boot 3.2.0         | Padrão de mercado, maturidade, auto-configuração  |
| Linguagem     | Java 17                   | LTS, obrigatório pelo grupo usar Spring Boot       |
| Banco de dados| H2 (em memória)           | Zero setup, ideal para demo acadêmica              |
| ORM           | Spring Data JPA           | Abstração de persistência, queries derivadas       |
| Validação     | Spring Validation         | Bean Validation integrado ao Spring MVC            |
| Documentação  | springdoc-openapi 2.3.0   | Swagger UI automático, sem config manual           |
| Build         | Maven                     | Padrão do ecossistema Spring                       |

## Entidades do domínio (primeira aproximação)

```
User  1───*  Pet  1───*  Vaccine
                 1───*  Consultation
                 1───*  Reminder
```

## Próximos passos

Com o Discovery concluído, avançamos para a fase de Specification:
1. `requirements.md` — detalhar requisitos funcionais com critérios de aceite
2. `design.md` — documentar decisões de arquitetura e modelo de dados
3. `tasks.md` — decompor em tarefas implementáveis com rastreabilidade
