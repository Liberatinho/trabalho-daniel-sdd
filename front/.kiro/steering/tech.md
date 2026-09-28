# Stack Tecnológica

_Atualizado em 2026-09-21._

## Arquitetura

O frontend é uma aplicação Angular standalone organizada por páginas, componentes reutilizáveis e serviços de integração. As páginas coordenam navegação e estados da tela; componentes cuidam da apresentação; serviços encapsulam HTTP e contratos de API. Regras de negócio e disponibilidade pertencem ao backend.

## Tecnologias principais

- **Linguagem**: TypeScript 5.9, com compilação estrita.
- **Framework**: Angular 21 standalone.
- **Build e desenvolvimento**: Angular CLI 21.
- **Estilização**: CSS global e estilos por componente.
- **Reatividade**: Signals do Angular e RxJS quando necessário.
- **Testes**: runner integrado ao Angular CLI com Vitest/jsdom.

## Padrões de desenvolvimento

### Tipagem

Manter `strict`, `strictTemplates`, `strictInjectionParameters` e `noImplicitReturns` habilitados. Evitar `any`, casts desnecessários e modelos divergentes do contrato do backend.

### UI e acessibilidade

Centralizar tokens visuais em estilos compartilhados e reutilizar primitives do Design System. Todos os campos devem ter labels associados, foco visível e mensagens de erro próximas; ícones e ações precisam de nomes acessíveis.

### Estados e erros

Toda operação de API deve representar explicitamente os estados inicial, loading, sucesso, vazio e erro quando aplicável. Erros de validação e HTTP devem ser comunicados ao usuário; não usar fallbacks silenciosos.

### Integração

Chamadas HTTP ficam em serviços por domínio. O frontend segue o contrato real do backend, incluindo campos, enums, endpoints e regras de disponibilidade, sem inventar dados para completar a interface.

## Comandos comuns

```bash
npm start
npm run build
npm test
```

## Decisões técnicas

- Componentes standalone são o padrão do Angular adotado pelo projeto.
- Fluxos de criação de vacina, consulta e lembrete compartilham um componente-base de modal.
- A organização deve favorecer reutilização e separação de responsabilidades sem introduzir uma biblioteca de estado global antes de haver necessidade comprovada.
