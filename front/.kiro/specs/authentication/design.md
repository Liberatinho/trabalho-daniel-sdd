# Login demonstrativo do PetCare — Design

## Decisão

Usar somente endpoints existentes. Esta é uma solução temporária para
demonstração local, não uma fronteira de autenticação.

## Fluxo

1. `AuthService.login()` chama `GET /api/users/email/{encodeURIComponent(email)}`.
2. O serviço compara a propriedade `password` da resposta com a senha digitada.
3. Em caso de correspondência, projeta a resposta para `{ id, name, email }` e
   armazena esse objeto somente no signal `currentUser`.
4. Para e-mail não encontrado ou senha incorreta, emitir
   `InvalidCredentialsError` com a mesma mensagem genérica.
5. `restoreSession()` retorna somente o valor atualmente em memória. Não há
   chamada de restauração ao backend; após reload o signal começa nulo.
6. `logout()` limpa o signal e não chama o backend.
7. Cadastro continua com `POST /api/users`; a resposta é projetada para os
   campos públicos antes de retornar ao chamador.
8. O guard verifica o signal, e a tela apresenta aviso persistente de que o
   modo é demonstrativo e não deve usar senha pessoal.

## Restrições

- Não persistir a senha nem a identidade no armazenamento do navegador.
- Não habilitar credenciais/cookies ou cabeçalho CSRF: esses mecanismos não
  existem no contrato atual.
- A interface não pode afirmar que a API ou os dados estão protegidos.
- O payload do endpoint continua expondo a senha ao navegador; filtrar o objeto
  no serviço não remove a exposição HTTP.
- A comparação no cliente não impede requisições manuais às APIs nem acesso a
  dados de outro `userId`.

## Substituição futura

Quando o backend implementar autenticação, substituir a busca/comparação por
endpoint de login, identidade de sessão, logout, proteção CSRF, respostas sem
senha e autorização de ownership no servidor.

## Testes frontend

- Credenciais corretas carregam somente os campos públicos na sessão local.
- Senha incorreta e e-mail ausente produzem o mesmo erro.
- Erros de transporte permanecem explícitos.
- Restauração não faz requisição e depende apenas da memória.
- Logout limpa a identidade sem chamadas HTTP.
