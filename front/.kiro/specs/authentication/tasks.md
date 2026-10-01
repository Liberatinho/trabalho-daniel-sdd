# Login demonstrativo do PetCare — Tasks

## Frontend

- [x] Consultar usuário pelo endpoint existente de busca por e-mail.
- [x] Comparar a senha sem persistir credenciais no navegador.
- [x] Projetar o objeto retornado para os campos públicos antes de atualizar o
  estado local.
- [x] Manter a sessão apenas em memória e limpar no logout.
- [x] Exibir aviso de demonstração e não segurança no login.
- [x] Documentar o contrato e os riscos.
- [x] Testar credenciais válidas/inválidas, e-mail ausente, memória e logout.

## Validação

- [x] Executar build frontend e a suíte de testes após a implementação.

## Dependência futura do backend para produção

- [ ] Implementar autenticação segura sem devolver senha, com sessão protegida.
- [ ] Proteger os endpoints por identidade autenticada e ownership.
- [ ] Implementar CSRF, expiração, logout de servidor e tratamento de credenciais.
- [ ] Atualizar o frontend para usar o contrato seguro do backend.

Nenhuma tarefa desta seção futura foi aplicada ao backend.
