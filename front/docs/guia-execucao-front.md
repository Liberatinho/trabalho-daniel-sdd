# Guia de Execução — Frontend PetCare

## Pré-requisitos

A tecnologia e o gerenciador de pacotes definitivos serão registrados após a decisão da stack.

Verificar:
- Ferramentas exigidas pela stack
- Backend PetCare disponível
- URL/base da API configurada
- Variáveis de ambiente necessárias

## Passo a passo

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd PetCare
```

### 2. Entrar no frontend

```bash
cd front
```

### 3. Instalar dependências

Utilizar o comando da stack escolhida.

Exemplo:
```bash
npm install
```

### 4. Configurar a API

Exemplo conceitual:
```text
API_BASE_URL=http://localhost:8080/api
```

O nome definitivo deve seguir a convenção do framework escolhido.

### 5. Iniciar o backend

Em outro terminal, iniciar o backend conforme `docs/guia-execucao.md`.

### 6. Iniciar o frontend

Exemplo:
```bash
npm run dev
```

### 7. Acessar

A URL depende da configuração. Exemplo comum:
```text
http://localhost:5173
```

## Testando funcionalidades

### Cadastro e login
- Preencher campos
- Validar dados
- Enviar
- Conferir feedback
- Conferir navegação

### Pets
- Listar
- Criar
- Ver detalhes
- Editar
- Conferir estados

### Vacinas
- Abrir pet
- Consultar histórico
- Registrar vacina
- Validar datas

### Consultas
- Abrir consultas
- Visualizar
- Criar/editar conforme escopo
- Conferir status

### Lembretes
- Abrir lembretes
- Visualizar
- Criar/atualizar
- Conferir conclusão

## Estados a testar

```text
Loading
Success
Empty
Error
```

Também:
- Campos inválidos
- Campos obrigatórios
- HTTP 400
- HTTP 403
- HTTP 404
- HTTP 500
- Falha de conexão
- Botões desabilitados durante operações

## Verificação visual

Comparar implementação e Figma:
- Espaçamentos
- Tipografia
- Hierarquia
- Componentes
- Estados
- Responsividade
- Navegação

## Verificação de rastreabilidade

```text
[ ] Requirement identificado
[ ] Design atualizado
[ ] Figma definido
[ ] Task implementada
[ ] Código funcionando
[ ] Testes executados
[ ] Commit criado
[ ] Commit referencia REQ/TASK
```

## Commits

```text
feat(front): <descrição> [REQ-XXX, TASK-FRONT-XXX]
```

Exemplo:
```text
feat(front): implement pet registration [REQ-002, TASK-FRONT-002]
```

## Solução de problemas

### Backend indisponível
Verificar backend, porta, URL da API, ambiente e CORS quando aplicável.

### Erro de requisição
Verificar:
1. Endpoint
2. Método HTTP
3. Body
4. Parâmetros
5. Status
6. Contrato da API

### Interface diferente do Figma
Comparar componentes, variantes, espaçamentos, tipografia, estados e responsividade.
