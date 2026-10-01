# Login demonstrativo do PetCare

## Contexto e limite de segurança

O backend atual não tem autenticação. Por decisão explícita do usuário, o
frontend utiliza o endpoint existente `GET /api/users/email/{email}` para
comparar a senha no cliente. Esse fluxo é somente para demonstração local.
O endpoint retorna a senha em texto puro e as demais APIs não autorizam o
`userId` contra uma identidade autenticada. Não usar com senhas pessoais ou em
produção.

## Requisitos

### DEMO-AUTH-001 — Login de demonstração

O tutor pode informar e-mail e senha. O frontend consulta o usuário pelo
endpoint existente e compara a senha recebida com a senha digitada.

**Critérios de aceite**

1. Credenciais correspondentes preenchem em memória somente `id`, `name` e
   `email`.
2. E-mail inexistente e senha incorreta exibem a mesma mensagem.
3. Erros de rede/servidor não são apresentados como login bem-sucedido.
4. A interface informa que esse login não é seguro para produção.

### DEMO-AUTH-002 — Estado local

O usuário autenticado existe apenas no signal em memória.

**Critérios de aceite**

1. A navegação protegida verifica o estado em memória.
2. Atualizar/reabrir o site encerra o acesso demonstrativo e redireciona ao
   login.
3. O logout limpa o estado local sem afirmar que encerrou uma sessão de
   servidor.
4. Nenhuma senha é gravada no `localStorage` ou `sessionStorage`.

### DEMO-AUTH-003 — Cadastro compatível

O cadastro continua usando `POST /api/users` com `name`, `email` e `password`,
conforme o backend existente.

## Fora do escopo e segurança futura

- Sessão segura, token, proteção CSRF, expiração e recuperação de senha.
- Autorização no servidor para recursos pertencentes ao tutor.
- Senhas com hash, retirada de senha das respostas e limite de tentativas.
- Produção ou uso com credenciais pessoais.

Para autenticação real, o backend deve substituir a comparação no cliente por
login seguro, respostas sem senha, sessão protegida e autorização por usuário.
