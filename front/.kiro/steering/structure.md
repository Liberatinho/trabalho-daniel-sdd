# Estrutura do Projeto

_Atualizado em 2026-09-21._

## Organização

O projeto segue uma separação por responsabilidade dentro de `src/`: páginas representam telas completas, componentes representam elementos reutilizáveis, serviços concentram integração com a API e modelos tipam entidades e respostas. A estrutura pode evoluir para organização por domínio à medida que as funcionalidades forem implementadas.

## Padrões de diretórios

### Aplicação

**Localização**: `src/app/`  
**Finalidade**: shell da aplicação, configuração, rotas e código Angular.

### Páginas

**Localização**: `src/app/pages/`  
**Finalidade**: telas e fluxos completos, como login, pets, vacinas, consultas e lembretes. Páginas coordenam serviços, navegação e estados, mas não duplicam componentes visuais.

### Componentes compartilhados

**Localização**: `src/app/components/`  
**Finalidade**: primitives e componentes de interface reutilizáveis, alinhados ao Design System, sem regras de negócio específicas.

### Serviços e modelos

**Localização**: `src/app/services/` e `src/app/models/`  
**Finalidade**: serviços HTTP por domínio e tipos compartilhados para entidades, requests e responses.

### Estilos e documentação

**Localização**: `src/styles.css` e `docs/`  
**Finalidade**: tokens e estilos globais; documentação de requisitos, arquitetura, Figma e Design System.

## Convenções de nomenclatura

- **Arquivos Angular**: `kebab-case`, com sufixos convencionais (`.component.ts`, `.service.ts`, `.spec.ts`).
- **Classes e interfaces**: PascalCase; interfaces devem ter nomes orientados ao domínio.
- **Signals, variáveis e funções**: camelCase, com nomes que expressem estado ou ação.
- **Rotas**: segmentos curtos em kebab-case e sem criar rotas para os três fluxos modais.

## Organização do código

- Componentes de apresentação recebem dados e emitem eventos; não realizam chamadas HTTP diretamente.
- Páginas orquestram serviços, navegação e estados de carregamento/erro/vazio.
- Serviços encapsulam endpoints e normalização mínima de respostas.
- Modelos devem refletir o contrato do backend; não duplicar tipos localmente em páginas.
- Estilos específicos permanecem próximos ao componente; tokens e regras globais ficam centralizados.
