# PetCare — Login demonstrativo

_Implementado em 2026-09-28 usando somente endpoints existentes do backend._

## Comportamento atual

O login faz `GET /api/users/email/{email}`, compara no frontend a senha digitada
com o campo `password` retornado e mantém somente `id`, `name` e `email` em
memória. Cadastro usa `POST /api/users`. Logout limpa o estado em memória.

Não existe endpoint de sessão. Ao recarregar a página, o usuário volta para o
login. O guard protege somente a navegação no Angular; não protege chamadas à
API nem os dados.

## Aviso de segurança — somente demonstração local

Este fluxo **não é autenticação segura e não deve ser usado em produção ou com
senhas pessoais**:

- O endpoint de busca por e-mail devolve a senha, atualmente em texto puro,
  para o navegador.
- A senha trafega e fica acessível no JSON da resposta e nas ferramentas de
  desenvolvimento do navegador.
- As APIs recebem `userId` na URL e não vinculam esse identificador a uma
  identidade autenticada; ocultar rotas na interface não impede acesso a dados
  de outra conta.
- Não há sessão no servidor, proteção contra CSRF, limite de tentativas ou
  recuperação de senha.
- O banco H2 é em memória; reiniciar o backend apaga os cadastros.

A tela de login exibe um aviso e mensagens de erro genéricas para o e-mail
inexistente e a senha incorreta. O frontend descarta a senha antes de atualizar
o estado do usuário, mas isso **não impede a exposição na resposta HTTP**.

## Requisitos para substituir a demonstração por autenticação segura

Os responsáveis pelo backend devem implementar login e logout com sessão
protegida, senhas com hash BCrypt, respostas que nunca incluam `password`,
proteção CSRF e autorização de cada recurso pelo usuário da sessão. A busca
global e a busca de usuários por e-mail também precisam ser restringidas.
Depois dessa entrega, o frontend deve trocar a consulta de usuário por e-mail
pelo contrato de autenticação do servidor.
