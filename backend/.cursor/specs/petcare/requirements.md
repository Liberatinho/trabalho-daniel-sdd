# PetCare - Requisitos do Sistema

## REQ-001: Cadastro de Usuários
**Descrição:** O sistema deve permitir que um usuário crie uma conta informando nome, email e senha.

**Critérios de Aceite:**
- Nome é obrigatório
- Email é obrigatório e deve ser válido
- Email deve ser único no sistema
- Senha é obrigatória
- Após o cadastro, o usuário pode visualizar seus pets

**Validações:**
- Email duplicado deve retornar erro 400
- Campos obrigatórios ausentes devem retornar erro 400

## REQ-002: Cadastro de Pets
**Descrição:** O sistema deve permitir que um usuário cadastrado adicione pets informando nome, espécie, raça, data de nascimento e observações.

**Critérios de Aceite:**
- Um usuário pode ter múltiplos pets
- Nome e espécie são obrigatórios
- Raça, data de nascimento e observações são opcionais
- O pet é automaticamente associado ao usuário que o criou
- O usuário só pode ver seus próprios pets

**Validações:**
- Pet não encontrado retorna erro 404
- Tentativa de acessar pet de outro usuário retorna erro 403

## REQ-003: Histórico de Vacinas
**Descrição:** O sistema deve permitir registrar vacinas para um pet, incluindo vacina, data de aplicação, próxima dose e observações.

**Critérios de Aceite:**
- Vacina deve estar associada a um pet existente
- Vacina deve pertencer a um pet do usuário autenticado
- Nome da vacina é obrigatório
- Data de aplicação é obrigatória
- Próxima dose é opcional
- Se informada, a próxima dose não pode ser anterior à data de aplicação

**Validações:**
- Pet inexistente retorna erro 404
- Pet não pertence ao usuário retorna erro 403
- Próxima dose anterior à aplicação retorna erro 400

## REQ-004: Consultas Veterinárias
**Descrição:** O sistema deve permitir agendar e registrar consultas veterinárias para um pet, incluindo data, veterinário, motivo, observações e status.

**Critérios de Aceite:**
- Consulta deve estar associada a um pet existente
- Data, veterinário e motivo são obrigatórios
- Status pode ser: SCHEDULED, COMPLETED, CANCELLED
- Uma consulta cancelada não pode ser alterada
- Uma consulta realizada não pode voltar para agendada

**Validações:**
- Pet inexistente retorna erro 404
- Pet não pertence ao usuário retorna erro 403
- Tentativa de alterar consulta cancelada retorna erro 400
- Tentativa de reverter consulta realizada retorna erro 400

## REQ-005: Lembretes de Cuidados
**Descrição:** O sistema deve permitir criar lembretes associados a um pet, incluindo tipo, descrição, data de vencimento e status de conclusão.

**Critérios de Aceite:**
- Lembrete deve estar associado a um pet existente
- Tipo pode ser: VACCINE, CONSULTATION, MEDICATION, OTHER
- Descrição e data de vencimento são obrigatórios
- Status de conclusão é opcional (padrão: false)
- Lembretes podem ser filtrados por tipo ou status

**Validações:**
- Pet inexistente retorna erro 404
- Pet não pertence ao usuário retorna erro 403
- Campos obrigatórios ausentes retornam erro 400

## REQ-006: Persistência de Dados
**Descrição:** O sistema deve persistir todos os dados em banco de dados H2 em memória.

**Critérios de Aceite:**
- Dados persistidos durante a execução da aplicação
- Relacionamento entre entidades mantido
- Cascade delete funcionando corretamente
- Dados de exemplo carregados na inicialização

## REQ-007: Tratamento de Erros
**Descrição:** O sistema deve tratar exceções de forma consistente e retornar mensagens de erro apropriadas.

**Critérios de Aceite:**
- EntityNotFoundException retorna 404
- SecurityException retorna 403
- IllegalArgumentException retorna 400
- Erros de validação retornam 400 com detalhes dos campos
- Exceções genéricas retornam 500

## REQ-008: Documentação da API
**Descrição:** A API deve ser documentada usando Swagger/OpenAPI.

**Critérios de Aceite:**
- Swagger UI acessível em /swagger-ui.html
- Todos os endpoints documentados
- Modelos de requisição e resposta visíveis
- Exemplos de uso disponíveis
