# PetCare - Brief do Projeto

## Visão Geral
PetCare é uma aplicação backend em Spring Boot para tutores organizarem informações e cuidados dos seus pets.

## Problema
Tutores de animais de estimação frequentemente têm dificuldade para centralizar informações importantes sobre seus pets, como vacinas, consultas veterinárias e lembretes de cuidados, fazendo com que dados fiquem espalhados ou sejam esquecidos.

## Solução
Uma API REST que permite ao tutor:
- Cadastrar e gerenciar seus pets
- Registrar histórico de vacinas
- Agendar e acompanhar consultas veterinárias
- Criar lembretes de cuidados

## Escopo
### Funcionalidades principais
1. **Cadastro de usuários** - Criação de conta e acesso aos pets do tutor
2. **Cadastro de pets** - Nome, espécie, raça, data de nascimento e observações
3. **Histórico de vacinas** - Vacina, data de aplicação, próxima dose e observações
4. **Consultas veterinárias** - Pet, data, veterinário, motivo, observações e status
5. **Lembretes** - Vacina, consulta, medicamento ou outros cuidados

### Stack tecnológica
- Spring Boot 3.2.0
- Java 17
- H2 Database (em memória)
- Spring Data JPA
- Spring Validation
- Swagger/OpenAPI

## Regras de Negócio
- Um usuário só pode visualizar e alterar seus próprios pets
- Uma vacina precisa estar associada a um pet existente e pertencente ao usuário
- A próxima dose da vacina não pode ser anterior à data de aplicação
- Uma consulta cancelada não pode ser marcada como realizada
- Uma consulta realizada não pode voltar para o estado agendado
- Lembretes devem estar associados a um pet existente

## Entregáveis
- API REST funcional com endpoints documentados
- Persistência de dados em H2
- Validações de entrada
- Tratamento global de exceções
- Dados de exemplo para demonstração
- Testes unitários e de integração

## Critérios de Aceite
- Todas as funcionalidades implementadas e testadas
- Regras de negócio validadas
- API acessível via Swagger UI
- Dados persistidos corretamente
- Erros tratados adequadamente
