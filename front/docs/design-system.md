# PetCare — Design System

## 1. Objetivo

Este documento define os padrões visuais e componentes reutilizáveis do frontend do PetCare.

O objetivo é garantir que novas telas e funcionalidades mantenham a mesma identidade do Figma.

Fonte visual:

https://www.figma.com/design/qFd4D4pCennpiUsKauNZct/PetCare

---

## 2. Princípios

O Design System deve transmitir:

- cuidado;
- confiança;
- simplicidade;
- organização;
- tranquilidade.

A interface deve ser limpa e evitar excesso de elementos decorativos.

---

## 3. Tokens de cor

Os valores abaixo representam os tokens observados no design atual. Caso os valores definitivos estejam cadastrados como Variables no Figma, eles devem ser tratados como fonte de verdade.

### Brand

- `brand-primary`: azul-petróleo escuro usado em sidebar, botões primários e títulos principais.
- `brand-secondary`: verde/azul-esverdeado usado em links, ícones e elementos de apoio.
- `brand-soft`: fundo suave para estados selecionados.

### Background

- `background-page`: creme claro utilizado como fundo principal.
- `background-surface`: superfície dos cards e formulários.

### Feedback

- `feedback-warning`: coral usado para atenção, vencimentos e próximos prazos.
- `feedback-success`: verde/teal para estados positivos.

### Text

- `text-primary`: texto principal escuro.
- `text-secondary`: texto auxiliar.
- `text-muted`: texto de apoio/placeholders.
- `text-on-primary`: texto sobre superfícies escuras.

Não utilizar cores aleatórias diretamente nos componentes. Centralizar os valores em tokens CSS/SCSS.

---

## 4. Tipografia

A tipografia deve seguir a utilizada no Figma.

Hierarquia:

### Heading 1

Utilizado nos títulos principais das páginas.

### Heading 2

Utilizado em títulos de seções e cards.

### Body

Utilizado em textos corridos, descrições e conteúdo de tabela.

### Label

Utilizado nos campos de formulário.

### Caption

Utilizado em informações auxiliares e textos secundários.

A implementação deve evitar criar dezenas de tamanhos diferentes. Usar uma escala pequena e consistente.

---

## 5. Espaçamento

Adotar uma escala baseada em múltiplos de 4 ou 8 para manter consistência.

Exemplo:

- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 20px
- `space-6`: 24px
- `space-8`: 32px
- `space-10`: 40px
- `space-12`: 48px

Os valores podem ser ajustados quando as medidas definitivas do Figma forem extraídas.

---

## 6. Bordas e raios

A interface utiliza cantos arredondados.

Tokens sugeridos:

- `radius-sm`: campos e pequenos elementos;
- `radius-md`: botões e cards menores;
- `radius-lg`: cards principais;
- `radius-xl`: grandes containers e cards de autenticação;
- `radius-full`: avatar, badges e elementos circulares.

---

## 7. Sombras

Usar sombras suaves e discretas.

A sombra deve criar separação entre superfícies sem deixar a interface pesada.

Evitar sombras diferentes para cada componente.

---

## 8. Botões

### Primary

Usado para ações principais:

- Entrar;
- Criar conta;
- Salvar cadastro;
- Registrar Vacina;
- Agendar Nova Consulta;
- Criar Novo Lembrete.

Características:

- fundo brand-primary;
- texto claro;
- formato arredondado;
- estado hover;
- estado disabled;
- estado loading.

### Secondary

Usado para ações alternativas ou cancelamento.

### Text Button

Usado para ações de menor destaque, como links e navegação auxiliar.

---

## 9. Inputs

Todos os inputs devem compartilhar:

- altura consistente;
- borda;
- raio;
- padding;
- tipografia;
- estado hover;
- estado focus;
- estado disabled;
- estado error.

---

## 10. Select

O Select deve seguir o mesmo padrão visual dos inputs.

Deve possuir:

- label;
- valor selecionado;
- placeholder;
- indicador de abertura;
- estado focus;
- estado error;
- estado disabled.

---

## 11. Modal

O modal é um componente-base reutilizável.

Estrutura:

```text
Modal
├── Header
│   ├── Title
│   └── Close
├── Content
└── Footer
    ├── Cancel
    └── Primary Action
```

Características:

- overlay;
- superfície clara;
- cantos arredondados;
- sombra suave;
- largura limitada;
- scroll interno quando necessário;
- foco controlado;
- fechamento acessível.

---

## 12. Cards

Cards devem possuir:

- superfície clara;
- borda sutil quando necessário;
- raio consistente;
- padding consistente;
- sombra apenas quando necessária.

---

## 13. Badges e status

Utilizados para estados como:

- Agendado;
- Realizado;
- Próxima dose;
- Atenção;
- Vencido.

O significado não deve depender apenas da cor. O texto do estado deve permanecer visível.

---

## 14. Sidebar

A sidebar autenticada deve conter:

- logo/nome PetCare;
- navegação;
- item ativo;
- perfil do tutor na parte inferior.

Itens atuais:

- Início;
- Meus pets;
- Vacinas;
- Consultas;
- Lembretes.

---

## 15. Header

O header deve conter:

- espaço para contexto/título quando aplicável;
- notificações;
- avatar/iniciais.

---

## 16. Regras para implementação

1. Componentes reutilizáveis devem ser preferidos.
2. Tokens devem ficar centralizados.
3. Não duplicar estilos entre páginas.
4. Não criar cores específicas dentro de componentes.
5. Novos componentes devem respeitar os componentes existentes.
6. Mudanças de identidade devem ser feitas no Design System, não página por página.

---

## 17. Aplicação nos modais

Os modais de:

- Registrar Vacina;
- Agendar Nova Consulta;
- Criar Novo Lembrete;

devem reutilizar Button, Input, Select, Date Input, Textarea, Modal, Alert e demais componentes do Design System.
