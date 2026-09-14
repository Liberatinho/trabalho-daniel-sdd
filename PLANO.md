# Plano de Execução - PetCare com cc-sdd

## Visão Geral
Aplicação Spring Boot para tutores organizarem informações e cuidados dos seus pets.

## Stack Tecnológica
- **Backend:** Spring Boot 3.2.x
- **Java:** 17 (LTS)
- **Banco de Dados:** H2 (em memória, para facilidade de demo)
- **Persistência:** Spring Data JPA
- **Validação:** Spring Validation (Bean Validation)
- **Documentação API:** Swagger/OpenAPI
- **Build:** Maven

## Estrutura do Projeto
```
PetCare/
├── src/main/java/com/petcare/
│   ├── PetCareApplication.java
│   ├── model/
│   │   ├── User.java
│   │   ├── Pet.java
│   │   ├── Vaccine.java
│   │   ├── Consultation.java
│   │   └── Reminder.java
│   ├── repository/
│   ├── service/
│   ├── controller/
│   ├── dto/
│   └── exception/
├── src/main/resources/
│   ├── application.yml
│   └── data.sql (dados de exemplo)
└── src/test/java/com/petcare/
```

## Entidades do Domínio

### 1. User (Tutor)
- id (Long)
- name (String, obrigatório)
- email (String, único, obrigatório)
- password (String, obrigatório)

### 2. Pet
- id (Long)
- name (String, obrigatório)
- species (String, obrigatório)
- breed (String)
- birthDate (LocalDate)
- notes (String)
- user (User, ManyToOne, obrigatório)

### 3. Vaccine (Vacina)
- id (Long)
- name (String, obrigatório)
- applicationDate (LocalDate, obrigatório)
- nextDoseDate (LocalDate, opcional)
- notes (String)
- pet (Pet, ManyToOne, obrigatório)

### 4. Consultation (Consulta)
- id (Long)
- date (LocalDateTime, obrigatório)
- veterinarian (String, obrigatório)
- reason (String, obrigatório)
- notes (String)
- status (Enum: SCHEDULED, COMPLETED, CANCELLED, obrigatório)
- pet (Pet, ManyToOne, obrigatório)

### 5. Reminder (Lembrete)
- id (Long)
- type (Enum: VACCINE, CONSULTATION, MEDICATION, OTHER, obrigatório)
- description (String, obrigatório)
- dueDate (LocalDate, obrigatório)
- completed (Boolean)
- pet (Pet, ManyToOne, obrigatório)

## Regras de Negócio
1. **Ownership:** Usuário só pode acessar/modificar seus próprios pets
2. **Vacina:** Deve estar associada a um pet existente e pertencente ao usuário
3. **Próxima dose:** Não pode ser anterior à data de aplicação
4. **Consulta cancelada:** Não pode ser marcada como realizada
5. **Consulta realizada:** Não pode voltar para o estado agendado
6. **Lembretes:** Devem estar associados a um pet existente

## Fluxo cc-sdd (Etapas)

### Fase 1: Setup Inicial
1. ✅ Criar projeto Spring Boot com Maven
2. ✅ Configurar dependências (Spring Web, Data JPA, H2, Validation)
3. ✅ Instalar cc-sdd (`npx cc-sdd@latest --lang pt`)
4. ✅ Inicializar repositório Git

### Fase 2: Discovery
5. Executar `/kiro-discovery` com o prompt do PetCare
6. Gerar `brief.md` com escopo refinado
7. Decidir se precisa de `roadmap.md` (provavelmente sim, dado o escopo)

### Fase 3: Especificação
8. Executar `/kiro-spec-init petcare`
9. Executar `/kiro-spec-requirements` → gerar `requirements.md`
10. Executar `/kiro-spec-design` → gerar `design.md` e possivelmente `research.md`
11. Executar `/kiro-spec-tasks` → gerar `tasks.md`

### Fase 4: Implementação
12. Executar `/kiro-impl` para implementação autônoma das tasks
13. Revisar e ajustar código gerado se necessário
14. Adicionar dados de exemplo em `data.sql`

### Fase 5: Testes e Validação
15. Criar testes unitários (services)
16. Criar testes de integração (controllers)
17. Validar regras de negócio
18. Testar aplicação funcionando

### Fase 6: Documentação e Evidências
19. Garantir commits atômicos relacionados às tasks
20. Documentar rastreabilidade (requirement → task → code → test → commit)
21. Criar README.md com instruções de execução
22. Preparar apresentação (6 tópicos do guia)

## Critérios de Aceite (Checklist do Trabalho)
- [ ] Problema claramente definido
- [ ] Pelo menos 3 funcionalidades relevantes (temos 5)
- [ ] Persistência de dados (H2 + JPA)
- [ ] Regras de negócio (6 regras identificadas)
- [ ] Validações (Bean Validation)
- [ ] Aplicação funcional
- [ ] Artefatos do cc-sdd preservados (brief, requirements, design, tasks)
- [ ] Requirements documentados
- [ ] Design documentado
- [ ] Tasks documentadas
- [ ] Testes e registros de verificação preservados
- [ ] Histórico Git coerente com as tasks
- [ ] Commits relacionados às tarefas/requisitos
- [ ] Registro diário de demandas do grupo
- [ ] Slides cobrindo os 6 tópicos
- [ ] Demonstração da aplicação
- [ ] Análise crítica
- [ ] Link do repositório

## Estratégia de Commits
Cada commit deve seguir o padrão:
```
feat(spec): define requirements for [feature]
feat([feature]): implement [description] [TASK-XXX]
test([feature]): validate [scenario]
fix([feature]): correct [issue]
```

## Exemplos de Commits Esperados
```
feat(spec): define requirements for user registration
feat(auth): implement user entity and repository [TASK-001]
feat(auth): implement user registration endpoint [TASK-002]
test(auth): validate user registration [REQ-001]
feat(pets): implement pet entity and CRUD operations [TASK-005]
feat(pets): enforce pet ownership validation [REQ-003]
test(pets): validate pet belongs to user [REQ-003]
feat(vaccines): implement vaccine records [TASK-008]
test(vaccines): validate next dose date logic [REQ-006]
feat(consultations): implement appointment scheduling [TASK-011]
test(consultations): validate appointment state transitions [REQ-008]
feat(reminders): implement reminder system [TASK-014]
```

## Riscos e Mitigações

### Risco 1: cc-sdd gerar código muito genérico
**Mitigação:** Revisar e ajustar manualmente após `/kiro-impl`

### Risco 2: Tempo insuficiente para 2 semanas
**Mitigação:** Focar no MVP (usuários, pets, vacinas, consultas) e deixar lembretes como bônus

### Risco 3: Regras de negócio complexas
**Mitigação:** Implementar validações de forma incremental, testando cada regra isoladamente

### Risco 4: Dificuldade com cc-sdd
**Mitigação:** Consultar documentação em `docs/guides/` e ajustar prompts conforme necessário

## Próximos Passos Imediatos
1. Criar estrutura do projeto Spring Boot com Maven
2. Configurar `pom.xml` com dependências
3. Criar classes de modelo (entities)
4. Instalar cc-sdd no projeto
5. Iniciar Git e fazer primeiro commit

## Observações Importantes
- O trabalho valoriza **rastreabilidade** mais que quantidade de código
- Cada funcionalidade deve poder ser rastreada: requirement → design → task → code → test → commit
- A documentação do cc-sdd é parte essencial da entrega
- O grupo deve manter registro diário das demandas (planilha no guia)
- A apresentação deve demonstrar o fluxo completo, não apenas mostrar código funcionando
