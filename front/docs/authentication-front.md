# PetCare — Estratégia de autenticação do frontend

_Decisão verificada em 2026-09-25 contra o backend atual._

## Situação do backend

O backend atual não implementa autenticação. Não existem endpoints ou mecanismos para:

- login;
- logout;
- refresh de sessão;
- token JWT/OAuth;
- cookies de sessão;
- restauração de sessão;
- expiração de sessão;
- middleware de autenticação;
- autorização por identidade autenticada.

Os endpoints recebem `userId` diretamente na URL. As regras de ownership são aplicadas pelo serviço quando o usuário e o pet são relacionados, mas não há identidade autenticada que impeça alguém de enviar outro `userId`.

## Decisão para o frontend

O frontend não deve simular uma autenticação real nem tratar cadastro como login. Também não deve persistir senha, inventar tokens ou criar um guard que represente uma segurança inexistente no backend.

Enquanto o backend não disponibilizar autenticação, login, logout e proteção de sessão ficam bloqueados para implementação funcional. A interface pode ser estruturada conforme os requisitos e o Figma, mas as ações devem permanecer conectadas a um contrato real quando ele existir.

O frontend pode manter apenas estado de usuário explicitamente fornecido por uma futura camada de autenticação. Esse estado não deve ser inferido de credenciais armazenadas no navegador.

## Contrato necessário para desbloqueio

Antes de implementar `AuthService`, guard, interceptor ou restauração de sessão, o backend precisa definir:

1. endpoint e payload de login;
2. response de autenticação e identificador do usuário;
3. mecanismo de transporte e armazenamento da sessão;
4. endpoint e comportamento de logout;
5. expiração e renovação;
6. resposta para credenciais inválidas e sessão expirada;
7. regra de autorização para os recursos aninhados por `userId`.

## Impacto nas especificações existentes

Os requisitos de login, proteção de áreas autenticadas e cadastro com CPF/cidade não correspondem ao contrato atual do backend. O backend atual aceita `name`, `email` e `password` em `POST /api/users`, sem endpoint de login. Essa divergência deve ser resolvida pelo contrato do backend antes de considerar a autenticação concluída.
